package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"skilltree-backend/database"
	"skilltree-backend/handlers"
)

const allowedOrigin = "https://ducklingx2.github.io"

// corsMiddleware handles Cross-Origin Resource Sharing.
// The frontend is hosted on GitHub Pages while the API is hosted on Render.
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		// Only allow the actual SkillTree GitHub Pages site.
		if origin == allowedOrigin {
			w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			w.Header().Set("Access-Control-Max-Age", "86400")
			w.Header().Set("Vary", "Origin")
		}

		// Browser preflight request.
		if r.Method == http.MethodOptions {
			if origin == allowedOrigin {
				w.WriteHeader(http.StatusNoContent)
				return
			}

			http.Error(w, "CORS origin not allowed", http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// healthHandler confirms that the API is running.
func healthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	response := map[string]string{
		"service": "Skilltree API",
		"status":  "online",
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("failed to write health response: %v", err)
	}
}

func main() {
	log.Println("Starting Skilltree API...")

	// --------------------------------------------------
	// DATABASE
	// --------------------------------------------------

	pool, err := database.Connect()
	if err != nil {
		log.Fatalf("database connection failed: %v", err)
	}
	defer pool.Close()

	log.Println("Database connection established.")

	// --------------------------------------------------
	// ROUTES
	// --------------------------------------------------

	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("/", healthHandler)

	// Posts API
	mux.HandleFunc("/api/posts", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {

		case http.MethodGet:
			handlers.GetPosts(pool)(w, r)

		case http.MethodPost:
			handlers.CreatePost(pool)(w, r)

		case http.MethodOptions:
			// Normally handled by corsMiddleware before this point.
			w.WriteHeader(http.StatusNoContent)

		default:
			http.Error(
				w,
				"Method not allowed",
				http.StatusMethodNotAllowed,
			)
		}
	})

	// --------------------------------------------------
	// PORT
	// --------------------------------------------------

	port := os.Getenv("PORT")

	if port == "" {
		port = "10000"
	}

	// --------------------------------------------------
	// SERVER
	// --------------------------------------------------

	server := &http.Server{
		Addr:              "0.0.0.0:" + port,
		Handler:           corsMiddleware(mux),
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	log.Printf("Skilltree API running on port %s", port)

	// Graceful-ish shutdown context is not required for the basic
	// Render deployment, but the server is kept deliberately simple.
	if err := server.ListenAndServe(); err != nil &&
		err != http.ErrServerClosed {
		log.Fatalf("server failed: %v", err)
	}

	// Keep context imported/available for future graceful shutdown work.
	_ = context.Background()
}
