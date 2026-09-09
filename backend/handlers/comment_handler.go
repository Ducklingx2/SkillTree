package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"skilltree-backend/database"
	"skilltree-backend/models"

	"github.com/gorilla/mux"
)

type CreateCommentRequest struct {
	AuthorID        string `json:"authorId"`
	AuthorName      string `json:"authorName"`
	Content         string `json:"content"`
	ParentCommentID *int64 `json:"parentCommentId"`
}

func GetComments(db database.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		postID, err := strconv.ParseInt(
			mux.Vars(r)["postId"],
			10,
			64,
		)

		if err != nil {
			http.Error(
				w,
				"Invalid post ID",
				http.StatusBadRequest,
			)
			return
		}

		rows, err := db.Query(
			r.Context(),
			`
			SELECT
				id,
				post_id,
				author_id,
				author_name,
				content,
				parent_comment_id,
				created_at
			FROM comments
			WHERE post_id = $1
			ORDER BY created_at ASC
			`,
			postID,
		)

		if err != nil {
			http.Error(
				w,
				"Failed to load comments",
				http.StatusInternalServerError,
			)
			return
		}

		defer rows.Close()

		comments := make([]models.Comment, 0)

		for rows.Next() {
			var comment models.Comment

			err := rows.Scan(
				&comment.ID,
				&comment.PostID,
				&comment.AuthorID,
				&comment.AuthorName,
				&comment.Content,
				&comment.ParentCommentID,
				&comment.CreatedAt,
			)

			if err != nil {
				http.Error(
					w,
					"Failed to read comments",
					http.StatusInternalServerError,
				)
				return
			}

			comments = append(comments, comment)
		}

		if err := rows.Err(); err != nil {
			http.Error(
				w,
				"Failed to read comments",
				http.StatusInternalServerError,
			)
			return
		}

		w.Header().Set(
			"Content-Type",
			"application/json",
		)

		if err := json.NewEncoder(w).Encode(comments); err != nil {
			return
		}
	}
}

func CreateComment(db database.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		postID, err := strconv.ParseInt(
			mux.Vars(r)["postId"],
			10,
			64,
		)

		if err != nil {
			http.Error(
				w,
				"Invalid post ID",
				http.StatusBadRequest,
			)
			return
		}

		var request CreateCommentRequest

		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			http.Error(
				w,
				"Invalid request body",
				http.StatusBadRequest,
			)
			return
		}

		request.AuthorID = strings.TrimSpace(request.AuthorID)
		request.AuthorName = strings.TrimSpace(request.AuthorName)
		request.Content = strings.TrimSpace(request.Content)

		if request.AuthorID == "" {
			http.Error(
				w,
				"Author ID is required",
				http.StatusBadRequest,
			)
			return
		}

		if request.AuthorName == "" {
			http.Error(
				w,
				"Author name is required",
				http.StatusBadRequest,
			)
			return
		}

		if request.Content == "" {
			http.Error(
				w,
				"Comment cannot be empty",
				http.StatusBadRequest,
			)
			return
		}

		if len(request.Content) > 2000 {
			http.Error(
				w,
				"Comment is too long",
				http.StatusBadRequest,
			)
			return
		}

		// If this is a reply, make sure the parent
		// comment actually belongs to this post.
		if request.ParentCommentID != nil {
			var parentPostID int64

			err := db.QueryRow(
				r.Context(),
				`
				SELECT post_id
				FROM comments
				WHERE id = $1
				`,
				*request.ParentCommentID,
			).Scan(&parentPostID)

			if err != nil {
				http.Error(
					w,
					"Parent comment not found",
					http.StatusBadRequest,
				)
				return
			}

			if parentPostID != postID {
				http.Error(
					w,
					"Parent comment belongs to another post",
					http.StatusBadRequest,
				)
				return
			}
		}

		var comment models.Comment

		err = db.QueryRow(
			r.Context(),
			`
			INSERT INTO comments (
				post_id,
				author_id,
				author_name,
				content,
				parent_comment_id
			)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING
				id,
				post_id,
				author_id,
				author_name,
				content,
				parent_comment_id,
				created_at
			`,
			postID,
			request.AuthorID,
			request.AuthorName,
			request.Content,
			request.ParentCommentID,
		).Scan(
			&comment.ID,
			&comment.PostID,
			&comment.AuthorID,
			&comment.AuthorName,
			&comment.Content,
			&comment.ParentCommentID,
			&comment.CreatedAt,
		)

		if err != nil {
			http.Error(
				w,
				"Failed to create comment",
				http.StatusInternalServerError,
			)
			return
		}

		w.Header().Set(
			"Content-Type",
			"application/json",
		)

		w.WriteHeader(http.StatusCreated)

		json.NewEncoder(w).Encode(comment)
	}
}
