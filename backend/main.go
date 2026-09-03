package main

import (
	"log"
	"net/http"
	"os"

	"skilltree-backend/database"
	"skilltree-backend/handlers"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set(
			"Access-Control-Allow-Origin",
			"https://ducklingx2.github.io",
		)

		w.Header().Set(
			"Access-Control-Allow-Methods",
			"GET, POST, OPTIONS",
		)

		w.Header().Set(
			"Access-Control-Allow-Headers",
			"Content-Type",
		)

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	db, err := database.Connect()

	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	postHandler := handlers.NewPostHandler(db)

	mux := http.NewServeMux()

	mux.HandleFunc(
		"/api/posts",
		func(w http.ResponseWriter, r *http.Request) {

			switch r.Method {

			case http.MethodGet:
				postHandler.GetPosts(w, r)

			case http.MethodPost:
				postHandler.CreatePost(w, r)

			case http.MethodOptions:
				w.WriteHeader(http.StatusNoContent)

			default:
				http.Error(
					w,
					"Method not allowed",
					http.StatusMethodNotAllowed,
				)
			}
		},
	)

	mux.HandleFunc(
		"/",
		func(w http.ResponseWriter, r *http.Request) {

			w.Header().Set(
				"Content-Type",
				"application/json",
			)

			w.Write([]byte(`{
				"service": "Skilltree API",
				"status": "online"
			}`))
		},
	)

	server := &http.Server{
		Addr:    "0.0.0.0" + port,
		Handler: corsMiddleware(mux),
	}

	log.Printf(
		"Skilltree API running on port %s",
		port,
	)

	log.Fatal(server.ListenAndServe())
}
