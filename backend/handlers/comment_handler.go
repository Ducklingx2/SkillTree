package handlers

import (
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "strconv"
    "strings"
    "time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Comment struct {
	ID              int64     `json:"id"`
	PostID          int64     `json:"postId"`
	AuthorID        string    `json:"authorId"`
	AuthorName      string    `json:"authorName"`
	Content         string    `json:"content"`
	ParentCommentID *int64    `json:"parentCommentId"`
	CreatedAt       time.Time `json:"createdAt"`
}

type CreateCommentRequest struct {
	AuthorID        string `json:"authorId"`
	AuthorName      string `json:"authorName"`
	Content         string `json:"content"`
	ParentCommentID *int64 `json:"parentCommentId"`
}

type CommentHandler struct {
	DB *pgxpool.Pool
}

func NewCommentHandler(db *pgxpool.Pool) *CommentHandler {
	return &CommentHandler{
		DB: db,
	}
}

// GET /api/posts/{postId}/comments
func (h *CommentHandler) GetComments(w http.ResponseWriter, r *http.Request) {
	postIDString := r.PathValue("postId")

	postID, err := strconv.ParseInt(postIDString, 10, 64)
	if err != nil {
		http.Error(
			w,
			"Invalid post ID",
			http.StatusBadRequest,
		)
		return
	}

	rows, err := h.DB.Query(
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

	comments := make([]Comment, 0)

	for rows.Next() {
		var comment Comment

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

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(comments)
}

// POST /api/posts/{postId}/comments
func (h *CommentHandler) CreateComment(w http.ResponseWriter, r *http.Request) {
	postIDString := r.PathValue("postId")

	postID, err := strconv.ParseInt(postIDString, 10, 64)
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
	// comment belongs to the same post.
	if request.ParentCommentID != nil {
		var parentPostID int64

		err := h.DB.QueryRow(
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

	var comment Comment

	err = h.DB.QueryRow(
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

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(comment)
}

func getSupabaseUserID(r *http.Request) (string, error) {
	authHeader := r.Header.Get("Authorization")

	if authHeader == "" {
		return "", fmt.Errorf("missing authorization header")
	}

	parts := strings.SplitN(authHeader, " ", 2)

	if len(parts) != 2 ||
		!strings.EqualFold(parts[0], "Bearer") ||
		strings.TrimSpace(parts[1]) == "" {
		return "", fmt.Errorf("invalid authorization header")
	}

	token := strings.TrimSpace(parts[1])

	req, err := http.NewRequest(
		http.MethodGet,
		"https://bdhthcfovlgpmliohgnt.supabase.co/auth/v1/user",
		nil,
	)

	if err != nil {
		return "", err
	}

	req.Header.Set(
		"Authorization",
		"Bearer "+token,
	)

	req.Header.Set(
		"apikey",
		"YOUR_SUPABASE_PUBLISHABLE_KEY",
	)

	response, err := http.DefaultClient.Do(req)

	if err != nil {
		return "", err
	}

	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return "", fmt.Errorf(
			"supabase rejected token: %s",
			response.Status,
		)
	}

	body, err := io.ReadAll(response.Body)

	if err != nil {
		return "", err
	}

	var user struct {
		ID string `json:"id"`
	}

	if err := json.Unmarshal(body, &user); err != nil {
		return "", err
	}

	if user.ID == "" {
		return "", fmt.Errorf("supabase returned no user ID")
	}

	return user.ID, nil
}

func (h *CommentHandler) DeleteComment(w http.ResponseWriter, r *http.Request) {
	commentIDString := r.PathValue("commentId")

	commentID, err := strconv.ParseInt(commentIDString, 10, 64)
	if err != nil {
		http.Error(w, "Invalid comment ID", http.StatusBadRequest)
		return
	}

	// TODO: replace this with your actual authenticated
	// Supabase user ID once we hook into your auth middleware.
	userID := r.Header.Get("X-User-ID")

	if userID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	commandTag, err := h.DB.Exec(
		r.Context(),
		`
		DELETE FROM comments
		WHERE id = $1
		AND author_id = $2
		`,
		commentID,
		userID,
	)

	if err != nil {
		http.Error(
			w,
			"Failed to delete reply",
			http.StatusInternalServerError,
		)
		return
	}

	if commandTag.RowsAffected() == 0 {
		http.Error(
			w,
			"Reply not found or you do not own it",
			http.StatusNotFound,
		)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
