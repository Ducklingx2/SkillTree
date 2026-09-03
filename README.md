# Skilltree 🌱

> **Skills are better when shared.**

Skilltree is a modern, community-driven platform designed to help people **teach what they know, learn from others, and document the skills they develop along the way**.

It is built around a remarkably simple principle:

**If you know how to do something, someone else probably wants to learn it.**

Skilltree provides the infrastructure. Humanity provides the questionable hobbies.

---

## Overview

Skilltree is a social learning platform where users can:

* 📚 **Teach skills through posts**
* 🌱 **Build a personal skill tree**
* 🧑‍🏫 **Discover people who know interesting things**
* 💬 **Interact with educational posts**
* 🖼️ **Share images alongside their teaching**
* 🔗 **Optionally provide a Google Meet or Zoom link for live teaching**
* 🔍 **Search for skills, teachers, and ideas**
* 🌐 **Learn directly from community-created content**

There are no mandatory skill categories.

There is no enormous administrative committee deciding whether "making Minecraft houses" belongs under *Architecture*, *Game Development*, *Creative Arts*, or whatever taxonomy humans invent next.

**Users name their own skills.**

If someone considers their skill to be called *"Making tiny robots out of junk"*, that is what the skill is called.

If someone else calls essentially the same thing *"Engineering With Stuff I Found In My Drawer"*, Skilltree accepts this important contribution to civilization.

---

# Core Concept

Skilltree revolves around **posts**.

A user creates a post describing something they know how to do.

A typical post may contain:

* A user-defined skill name
* An image
* A written explanation or lesson
* Examples of the skill
* Additional information from the creator
* Optional contact information for live teaching

The post itself is the primary teaching environment.

External platforms such as Google Meet and Zoom are **optional extensions**, not the foundation of the platform.

In other words:

> **Skilltree teaches in the post first.**

The video-call button exists for situations where explaining something through a screen full of paragraphs becomes slightly unreasonable.

---

# User-Defined Skills

Skilltree deliberately avoids predefined skills and categories.

There is no master list such as:

```text
Technology
Music
Art
Science
Programming
Cooking
```

Instead, users decide what their skills are called.

For example:

```text
How I make Minecraft builds look good
```

```text
Understanding calculus without crying
```

```text
Making lo-fi beats
```

```text
How to repair old bicycles
```

```text
Grandma's biryani
```

Every skill originates from the community.

This keeps Skilltree flexible enough to support both conventional expertise and the wonderfully unpredictable collection of things people actually know how to do.

---

# Skill Trees 🌳

Each user's knowledge can be represented through a personal **Skilltree**.

Skills appear as nodes connected through the user's progression and knowledge.

The tree is not intended to enforce a universal hierarchy of knowledge.

It represents **the individual's journey**.

One user's tree may contain:

```text
Programming
   │
   ├── JavaScript
   │      │
   │      └── Web Development
   │
   └── Python
```

Another user's tree may contain:

```text
Cooking
   │
   ├── Biryani
   ├── Bread
   └── Making Food At 2 AM
```

Both are equally valid.

One simply raises more questions.

---

# Teaching

Teaching on Skilltree does not require a classroom.

A creator can explain their skill directly through a post using:

* Written explanations
* Images
* Examples
* Demonstrations
* Tips
* Personal experience
* Step-by-step instruction

For users who want to teach live, Skilltree may also allow an optional:

* Google Meet link
* Zoom link

These links are supplementary.

The platform remains useful even if the teacher never schedules a live session.

---

# Identity & User IDs

Each Skilltree user may have a unique user identifier.

The identifier exists to distinguish accounts reliably even when users have similar names.

For example:

```text
Username: Alex
UID: ST-8F42C1
```

The UID is not intended to replace the user's display name.

It simply answers the eternal question:

> "Which Alex is this?"

A surprisingly difficult problem for software.

---

# Technology

Skilltree is designed as a modern web application with a strong emphasis on:

* Responsive design
* Accessibility
* Performance
* Maintainability
* Clean component structure
* User-generated content
* Minimal friction
* Visual polish

The frontend is built using web technologies including:

* **HTML**
* **CSS**
* **JavaScript**

Additional backend infrastructure may be introduced as the platform develops.

---

# Design Philosophy

Skilltree aims to feel:

**Modern.**

**Human.**

**Calm.**

**Organic.**

**Technical without looking like a server dashboard from 2007.**

The interface combines elements such as:

* Dark visual foundations
* Subtle grids and textures
* Glass-like surfaces
* Organic branching motifs
* Clean typography
* Fine connecting lines
* Circular skill nodes
* Carefully controlled animation
* Strong visual hierarchy

The design intentionally separates the two primary experiences:

### Discover

A human-centered environment focused on:

* Teachers
* Posts
* Images
* Community interaction
* Learning

### My Tree

A knowledge-centered environment focused on:

* Skills
* Progression
* Connections
* Personal development

Because apparently one screen cannot simultaneously be a social network and a botanical diagram without becoming visually confused.

---

# Project Structure

A typical project structure may look like:

```text
skilltree/
│
├── index.html
├── style.css
├── script.js
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── pages/
│   ├── discover.html
│   ├── tree.html
│   ├── learn.html
│   └── teach.html
│
└── README.md
```

The exact structure may evolve as the application grows.

Software projects, unlike trees, rarely grow in a straight line.

---

# Development Philosophy

Skilltree follows several principles.

### 1. People define their own knowledge

The platform should not force users into arbitrary categories.

### 2. Posts are the primary teaching medium

Learning should happen inside the platform rather than immediately sending users elsewhere.

### 3. External tools are optional

Zoom and Google Meet can supplement teaching but should never be required.

### 4. The interface should get out of the way

Good design should make the product easier to understand, not merely provide opportunities for the developer to demonstrate that they discovered gradients.

### 5. User-generated content comes first

Skilltree should reflect what people actually know and teach.

---

# Future Development

Potential future functionality includes:

* Advanced skill discovery
* User-to-user matching
* Improved recommendations
* Skill progression tracking
* Richer teaching tools
* Live teaching integration
* Notifications
* Social interactions
* Better personalization
* Expanded profile functionality

Matching is intentionally **not the core system at present**.

First, people need something worth matching over.

Then we can unleash the algorithms.

---

# Contributing

Contributions are welcome.

Before submitting a contribution, please ensure that it:

1. Solves an actual problem.
2. Does not unnecessarily complicate the architecture.
3. Does not introduce a dependency solely because it has a fashionable README.
4. Maintains the existing design language.
5. Does not replace 40 lines of understandable JavaScript with a framework requiring three configuration files and a blood sacrifice.

Pull requests should clearly describe:

* What changed
* Why it changed
* Any relevant implementation details
* Any known limitations

---

# Development

Clone the repository:

```bash
git clone <repository-url>
```

Enter the project:

```bash
cd skilltree
```

Run the application using the appropriate development environment.

For a simple static development setup, the frontend may be served through any standard local web server.

---

# Status

**🚧 Active Development**

Skilltree is currently under development.

Features, architecture, visual design, and internal implementation may change substantially.

If something breaks, congratulations.

You have discovered a development build.

---

# Philosophy

Skilltree exists because knowledge is more useful when it moves.

Someone knows something.

Someone else wants to know it.

The internet has spent decades making it increasingly difficult to have a normal conversation about anything, so Skilltree attempts to make the process slightly more pleasant.

Teach something.

Learn something.

Build your tree.

Share what you know.

---

## License

This project is currently under development.

Licensing information will be added as the project reaches an appropriate release stage.

---

<div align="center">

**Skilltree**

*Skills are better when shared.*

🌱

</div>
