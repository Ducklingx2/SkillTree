package models

import "time"

type Post struct {
	ID          int64     `json:"id"`
	UID         string    `json:"uid"`
	AuthorName  string    `json:"authorName"`
	Skill       string    `json:"skill"`
	Description string    `json:"description"`
	ImageURL    string    `json:"imageUrl"`
	MeetingURL  string    `json:"meetingUrl"`
	CreatedAt   time.Time `json:"createdAt"`
}

type CreatePostRequest struct {
	UID         string `json:"uid"`
	AuthorName  string `json:"authorName"`
	Skill       string `json:"skill"`
	Description string `json:"description"`
	ImageURL    string `json:"imageUrl"`
	MeetingURL  string `json:"meetingUrl"`
}
