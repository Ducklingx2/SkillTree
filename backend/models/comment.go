package models

import "time"

type Comment struct {
	ID              int64     `json:"id"`
	PostID          int64     `json:"postId"`
	AuthorID        string    `json:"authorId"`
	AuthorName      string    `json:"authorName"`
	Content         string    `json:"content"`
	ParentCommentID *int64    `json:"parentCommentId"`
	CreatedAt       time.Time `json:"createdAt"`
}
