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

// corsMiddleware handles requests coming from the SkillTree
// GitHub Pages frontend.
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		if origin == allowedOrigin {
			w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			w.Header().Set("Access-Control-Max-Age", "86400")
			w.Header().Set("Vary", "Origin")
		}

		// Handle browser CORS preflight requests.
		if r.Method == http.MethodOptions {
			if origin != allowedOrigin {
				http.Error(
					w,
					"CORS origin not allowed",
					http.StatusForbidden,
				)
				return
			}

			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// healthHandler is used to verify that the API is alive.
func healthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(
			w,
			"Method not allowed",
			http.StatusMethodNotAllowed,
		)
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
	// POST HANDLER
	// --------------------------------------------------

	postHandler := handlers.NewPostHandler(pool)

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

	if err := server.ListenAndServe(); err != nil &&
		err != http.ErrServerClosed {
		log.Fatalf("server failed: %v", err)
	}
}
