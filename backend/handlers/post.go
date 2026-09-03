package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"skilltree-backend/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type PostHandler struct {
	DB *pgxpool.Pool
}

func NewPostHandler(db *pgxpool.Pool) *PostHandler {
	return &PostHandler{
		DB: db,
	}
}

func (h *PostHandler) GetPosts(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(
		r.Context(),
		5*time.Second,
	)
	defer cancel()

	rows, err := h.DB.Query(ctx, `
		SELECT
			id,
			uid,
			author_name,
			skill,
			description,
			COALESCE(image_url, ''),
			COALESCE(meeting_url, ''),
			created_at
		FROM posts
		ORDER BY created_at DESC
		LIMIT 100
	`)

	if err != nil {
		writeJSON(
			w,
			http.StatusInternalServerError,
			map[string]string{
				"error": "Failed to retrieve posts",
			},
		)
		return
	}

	defer rows.Close()

	posts := make([]models.Post, 0)

	for rows.Next() {
		var post models.Post

		err := rows.Scan(
			&post.ID,
			&post.UID,
			&post.AuthorName,
			&post.Skill,
			&post.Description,
			&post.ImageURL,
			&post.MeetingURL,
			&post.CreatedAt,
		)

		if err != nil {
			writeJSON(
				w,
				http.StatusInternalServerError,
				map[string]string{
					"error": "Failed to read post",
				},
			)
			return
		}

		posts = append(posts, post)
	}

	if err := rows.Err(); err != nil {
		writeJSON(
			w,
			http.StatusInternalServerError,
			map[string]string{
				"error": "Failed to process posts",
			},
		)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		posts,
	)
}

func (h *PostHandler) CreatePost(w http.ResponseWriter, r *http.Request) {
	var request models.CreatePostRequest

	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&request); err != nil {
		writeJSON(
			w,
			http.StatusBadRequest,
			map[string]string{
				"error": "Invalid JSON",
			},
		)
		return
	}

	request.UID = strings.TrimSpace(request.UID)
	request.AuthorName = strings.TrimSpace(request.AuthorName)
	request.Skill = strings.TrimSpace(request.Skill)
	request.Description = strings.TrimSpace(request.Description)
	request.ImageURL = strings.TrimSpace(request.ImageURL)
	request.MeetingURL = strings.TrimSpace(request.MeetingURL)

	if request.UID == "" {
		writeJSON(
			w,
			http.StatusBadRequest,
			map[string]string{
				"error": "UID is required",
			},
		)
		return
	}

	if request.AuthorName == "" {
		writeJSON(
			w,
			http.StatusBadRequest,
			map[string]string{
				"error": "Author name is required",
			},
		)
		return
	}

	if request.Skill == "" {
		writeJSON(
			w,
			http.StatusBadRequest,
			map[string]string{
				"error": "Skill name is required",
			},
		)
		return
	}

	if request.Description == "" {
		writeJSON(
			w,
			http.StatusBadRequest,
			map[string]string{
				"error": "Description is required",
			},
		)
		return
	}

	ctx, cancel := context.WithTimeout(
		r.Context(),
		5*time.Second,
	)
	defer cancel()

	var post models.Post

	err := h.DB.QueryRow(
		ctx,
		`
		INSERT INTO posts (
			uid,
			author_name,
			skill,
			description,
			image_url,
			meeting_url
		)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING
			id,
			uid,
			author_name,
			skill,
			description,
			COALESCE(image_url, ''),
			COALESCE(meeting_url, ''),
			created_at
		`,
		request.UID,
		request.AuthorName,
		request.Skill,
		request.Description,
		request.ImageURL,
		request.MeetingURL,
	).Scan(
		&post.ID,
		&post.UID,
		&post.AuthorName,
		&post.Skill,
		&post.Description,
		&post.ImageURL,
		&post.MeetingURL,
		&post.CreatedAt,
	)

	if err != nil {
		writeJSON(
			w,
			http.StatusInternalServerError,
			map[string]string{
				"error": "Failed to create post",
			},
		)
		return
	}

	writeJSON(
		w,
		http.StatusCreated,
		post,
	)
}

func writeJSON(
	w http.ResponseWriter,
	status int,
	data any,
) {
	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	w.WriteHeader(status)

	_ = json.NewEncoder(w).Encode(data)
}
