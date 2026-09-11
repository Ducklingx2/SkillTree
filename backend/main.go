package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"skilltree-backend/database"
	"skilltree-backend/handlers"
)

const allowedOrigin = "https://ducklingx2.github.io"

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set(
			"Access-Control-Allow-Origin",
			allowedOrigin,
		)

		w.Header().Set(
			"Access-Control-Allow-Methods",
			"GET, POST, PUT, DELETE, OPTIONS",
		)

		w.Header().Set(
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization",
		)

		w.Header().Set(
			"Access-Control-Max-Age",
			"86400",
		)

		w.Header().Set(
			"Vary",
			"Origin",
		)

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(map[string]string{
		"status":  "ok",
		"service": "skilltree-api",
	})
}

func main() {
	log.Println("Starting Skilltree API...")

	// Connect to PostgreSQL.
	pool, err := database.Connect()
	if err != nil {
		log.Fatalf(
			"database connection failed: %v",
			err,
		)
	}

	defer pool.Close()

	log.Println("Database connection established.")

	// Create handlers.
	postHandler := handlers.NewPostHandler(pool)
	commentHandler := handlers.NewCommentHandler(pool)

	// Create router.
	mux := http.NewServeMux()

	// Health check.
	mux.HandleFunc(
		"/",
		healthHandler,
	)

	// -------------------------
	// POSTS
	// -------------------------

	mux.HandleFunc(
		"/api/posts",
		func(w http.ResponseWriter, r *http.Request) {
			switch r.Method {
			case http.MethodGet:
				postHandler.GetPosts(w, r)

			case http.MethodPost:
				postHandler.CreatePost(w, r)

			default:
				http.Error(
					w,
					"Method not allowed",
					http.StatusMethodNotAllowed,
				)
			}
		},
	)

	// Delete a post.
	mux.HandleFunc(
		"DELETE /api/posts/{postId}",
		postHandler.DeletePost,
	)

	// -------------------------
	// COMMENTS
	// -------------------------

	// Get comments for a post.
	mux.HandleFunc(
		"GET /api/posts/{postId}/comments",
		commentHandler.GetComments,
	)

	// Create a comment.
	mux.HandleFunc(
		"POST /api/posts/{postId}/comments",
		commentHandler.CreateComment,
	)

	// Delete a comment.
	mux.HandleFunc(
		"DELETE /api/posts/{postId}/comments/{commentId}",
		commentHandler.DeleteComment,
	)

	// -------------------------
	// SERVER
	// -------------------------

	port := os.Getenv("PORT")

	if port == "" {
		port = "10000"
	}

	server := &http.Server{
		Addr: "0.0.0.0:" + port,

		Handler: corsMiddleware(mux),

		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	log.Printf(
		"Skilltree API running on 0.0.0.0:%s",
		port,
	)

	if err := server.ListenAndServe(); err != nil &&
		err != http.ErrServerClosed {
		log.Fatalf(
			"server failed: %v",
			err,
		)
	}
}
