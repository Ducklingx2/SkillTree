/* =========================================================
   SKILLTREE
   Frontend application
========================================================= */

"use strict";


/* =========================================================
   CONFIG
========================================================= */

const API_URL = "https://YOUR-RENDER-SERVICE.onrender.com";

const POSTS_ENDPOINT = `${API_URL}/api/posts`;

const STORAGE_KEYS = {
    uid: "skilltree_uid",
    name: "skilltree_name"
};


/* =========================================================
   STATE
========================================================= */

const state = {
    posts: [],
    filteredPosts: [],
    sort: "recent",
    search: "",
    loading: false,
    submitting: false,
    selectedImage: "",
    activePost: null,
    toastTimer: null
};


/* =========================================================
   DOM
========================================================= */

const dom = {
    navLinks: document.querySelectorAll(".nav-links a"),

    heroCreateButton:
        document.getElementById("heroCreateButton"),

    treeTeachButton:
        document.getElementById("treeTeachButton"),

    ctaCreateButton:
        document.getElementById("ctaCreateButton"),

    notificationButton:
        document.getElementById("notificationButton"),

    notificationDot:
        document.getElementById("notificationDot"),

    profileButton:
        document.getElementById("profileButton"),

    navAvatar:
        document.getElementById("navAvatar"),

    navProfileName:
        document.getElementById("navProfileName"),

    heroPostCount:
        document.getElementById("heroPostCount"),

    heroTeacherCount:
        document.getElementById("heroTeacherCount"),

    heroSkillCount:
        document.getElementById("heroSkillCount"),

    searchInput:
        document.getElementById("searchInput"),

    resultsLabel:
        document.getElementById("resultsLabel"),

    sortButtons:
        document.querySelectorAll(".sort-button"),

    teacherGrid:
        document.getElementById("teacherGrid"),

    postGrid:
        document.getElementById("postGrid"),

    largeTree:
        document.getElementById("largeTree"),

    createModal:
        document.getElementById("createModal"),

    detailModal:
        document.getElementById("detailModal"),

    profileModal:
        document.getElementById("profileModal"),

    createPostForm:
        document.getElementById("createPostForm"),

    profileForm:
        document.getElementById("profileForm"),

    authorName:
        document.getElementById("authorName"),

    skillInput:
        document.getElementById("skillInput"),

    descriptionInput:
        document.getElementById("descriptionInput"),

    characterCount:
        document.getElementById("characterCount"),

    uploadBox:
        document.getElementById("uploadBox"),

    imageInput:
        document.getElementById("imageInput"),

    imagePreview:
        document.getElementById("imagePreview"),

    meetingLink:
        document.getElementById("meetingLink"),

    meetingUrl:
        document.getElementById("meetingUrl"),

    submitPostButton:
        document.getElementById("submitPostButton"),

    detailImage:
        document.getElementById("detailImage"),

    detailTitle:
        document.getElementById("detailTitle"),

    detailAuthor:
        document.getElementById("detailAuthor"),

    detailText:
        document.getElementById("detailText"),

    detailLive:
        document.getElementById("detailLive"),

    detailMeetingLink:
        document.getElementById("detailMeetingLink"),

    profileNameInput:
        document.getElementById("profileNameInput"),

    toast:
        document.getElementById("toast"),

    toastIcon:
        document.getElementById("toastIcon"),

    toastMessage:
        document.getElementById("toastMessage")
};


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", initialize);


async function initialize() {

    initializeIdentity();

    bindNavigation();

    bindButtons();

    bindSearch();

    bindSorting();

    bindModalControls();

    bindCreateForm();

    bindProfileForm();

    bindImageUpload();

    bindLiveOptions();

    bindCharacterCounter();

    bindKeyboardShortcuts();

    updateProfileUI();

    renderInitialTree();

    await loadPosts();

    setupScrollNavigation();
}


/* =========================================================
   IDENTITY
========================================================= */

function initializeIdentity() {

    let uid = localStorage.getItem(STORAGE_KEYS.uid);

    if (!uid) {

        uid = createUID();

        localStorage.setItem(
            STORAGE_KEYS.uid,
            uid
        );
    }


    let name = localStorage.getItem(STORAGE_KEYS.name);

    if (!name) {

        name = "You";

        localStorage.setItem(
            STORAGE_KEYS.name,
            name
        );
    }
}


function createUID() {

    if (
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
    ) {
        return window.crypto.randomUUID();
    }


    return (
        "user-" +
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).slice(2, 10)
    );
}


function getUID() {

    let uid =
        localStorage.getItem(STORAGE_KEYS.uid);

    if (!uid) {

        uid = createUID();

        localStorage.setItem(
            STORAGE_KEYS.uid,
            uid
        );
    }

    return uid;
}


function getUserName() {

    return (
        localStorage.getItem(STORAGE_KEYS.name) ||
        "You"
    );
}


function setUserName(name) {

    const cleanName =
        name.trim().slice(0, 100);

    if (!cleanName) {
        return;
    }

    localStorage.setItem(
        STORAGE_KEYS.name,
        cleanName
    );

    updateProfileUI();
}


/* =========================================================
   PROFILE UI
========================================================= */

function updateProfileUI() {

    const name = getUserName();

    const initials =
        getInitials(name);


    if (dom.navProfileName) {
        dom.navProfileName.textContent = name;
    }


    if (dom.navAvatar) {
        dom.navAvatar.textContent = initials;
    }


    if (dom.authorName) {
        dom.authorName.value = name;
    }


    if (dom.profileNameInput) {
        dom.profileNameInput.value = name;
    }
}


function getInitials(name) {

    const words =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (!words.length) {
        return "Y";
    }


    if (words.length === 1) {
        return words[0].slice(0, 1).toUpperCase();
    }


    return (
        words[0].slice(0, 1) +
        words[words.length - 1].slice(0, 1)
    ).toUpperCase();
}


/* =========================================================
   NAVIGATION
========================================================= */

function bindNavigation() {

    dom.navLinks.forEach(link => {

        link.addEventListener("click", event => {

            const href =
                link.getAttribute("href");


            if (!href || !href.startsWith("#")) {
                return;
            }


            event.preventDefault();


            const target =
                document.querySelector(href);


            if (!target) {
                return;
            }


            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
}


function setupScrollNavigation() {

    const sections = [
        document.getElementById("home"),
        document.getElementById("discover"),
        document.getElementById("tree")
    ];


    if (!("IntersectionObserver" in window)) {
        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    const id =
                        entry.target.id;


                    dom.navLinks.forEach(link => {

                        link.classList.toggle(
                            "active",
                            link.dataset.nav === id
                        );
                    });
                });

            },
            {
                threshold: 0.35
            }
        );


    sections
        .filter(Boolean)
        .forEach(section => observer.observe(section));
}


/* =========================================================
   BUTTONS
========================================================= */

function bindButtons() {

    [
        dom.heroCreateButton,
        dom.treeTeachButton,
        dom.ctaCreateButton
    ]
        .filter(Boolean)
        .forEach(button => {

            button.addEventListener(
                "click",
                () => openCreateModal()
            );
        });


    dom.profileButton?.addEventListener(
        "click",
        openProfileModal
    );


    dom.notificationButton?.addEventListener(
        "click",
        () => {

            showToast(
                "You're all caught up.",
                "✓"
            );

            if (dom.notificationDot) {
                dom.notificationDot.hidden = true;
            }
        }
    );
}


/* =========================================================
   SEARCH
========================================================= */

function bindSearch() {

    dom.searchInput?.addEventListener(
        "input",
        event => {

            state.search =
                event.target.value.trim().toLowerCase();

            applyFilters();
        }
    );
}


/* =========================================================
   SORTING
========================================================= */

function bindSorting() {

    dom.sortButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                state.sort =
                    button.dataset.sort || "recent";


                dom.sortButtons.forEach(
                    item => {
                        item.classList.toggle(
                            "active",
                            item === button
                        );
                    }
                );


                applyFilters();
            }
        );
    });
}


/* =========================================================
   LOAD POSTS
========================================================= */

async function loadPosts() {

    setLoading(true);


    try {

        const response =
            await fetch(POSTS_ENDPOINT, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );
        }


        const data =
            await response.json();


        state.posts =
            Array.isArray(data)
                ? data.map(normalizePost)
                : [];


        applyFilters();

        updateStats();

        renderUserTree();


        if (state.posts.length) {

            dom.notificationDot.hidden = true;
        }

    } catch (error) {

        console.error(
            "Failed to load posts:",
            error
        );


        state.posts = [];

        renderEmptyFeed(
            "Could not load the community.",
            "Check that the API URL is correct and the backend is running."
        );


        renderCommunityEmpty(
            "The community couldn't be loaded.",
            "Your backend may still be waking up."
        );


        updateStats();


        showToast(
            "Couldn't connect to Skilltree.",
            "!"
        );

    } finally {

        setLoading(false);
    }
}


/* =========================================================
   NORMALIZE POST
========================================================= */

function normalizePost(post) {

    return {
        id: post.id,

        uid:
            String(
                post.uid ??
                ""
            ),

        authorName:
            String(
                post.authorName ??
                post.author_name ??
                "Unknown"
            ),

        skill:
            String(
                post.skill ??
                "Untitled skill"
            ),

        description:
            String(
                post.description ??
                ""
            ),

        imageUrl:
            String(
                post.imageUrl ??
                post.image_url ??
                ""
            ),

        meetingUrl:
            String(
                post.meetingUrl ??
                post.meeting_url ??
                ""
            ),

        createdAt:
            post.createdAt ??
            post.created_at ??
            new Date().toISOString()
    };
}


/* =========================================================
   FILTER + SORT
========================================================= */

function applyFilters() {

    let posts =
        [...state.posts];


    if (state.search) {

        posts =
            posts.filter(post => {

                const searchable =
                    [
                        post.skill,
                        post.authorName,
                        post.description
                    ]
                        .join(" ")
                        .toLowerCase();


                return searchable.includes(
                    state.search
                );
            });
    }


    posts.sort(
        getSortFunction(state.sort)
    );


    state.filteredPosts =
        posts;


    renderTeacherGrid(
        state.filteredPosts
    );


    renderPostGrid(
        state.filteredPosts
    );


    updateResultsLabel();
}


function getSortFunction(sort) {

    if (sort === "skill") {

        return (a, b) =>
            a.skill.localeCompare(
                b.skill
            );
    }


    if (sort === "teacher") {

        return (a, b) =>
            a.authorName.localeCompare(
                b.authorName
            );
    }


    return (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt);
}


/* =========================================================
   RESULTS LABEL
========================================================= */

function updateResultsLabel() {

    if (!dom.resultsLabel) {
        return;
    }


    const count =
        state.filteredPosts.length;


    if (!state.posts.length) {

        dom.resultsLabel.textContent =
            "No skills shared yet";

        return;
    }


    if (state.search) {

        dom.resultsLabel.textContent =
            `${count} ${
                count === 1
                    ? "result"
                    : "results"
            }`;

        return;
    }


    dom.resultsLabel.textContent =
        `${count} ${
            count === 1
                ? "skill"
                : "skills"
        } shared`;
}


/* =========================================================
   TEACHER GRID
========================================================= */

function renderTeacherGrid(posts) {

    if (!dom.teacherGrid) {
        return;
    }


    dom.teacherGrid.replaceChildren();


    if (!posts.length) {

        const empty =
            createEmptyState(
                state.search
                    ? "Nothing found."
                    : "No skills yet.",
                state.search
                    ? "Try another skill, person, or phrase."
                    : "Be the first person to put something on the tree."
            );


        dom.teacherGrid.appendChild(
            empty
        );

        return;
    }


    posts.forEach(post => {

        dom.teacherGrid.appendChild(
            createTeacherCard(post)
        );
    });
}


function createTeacherCard(post) {

    const card =
        document.createElement("article");

    card.className =
        "teacher-card";


    card.dataset.postId =
        String(post.id);


    const image =
        document.createElement("div");

    image.className =
        "teacher-image";


    if (post.imageUrl) {

        const img =
            document.createElement("img");

        img.src =
            post.imageUrl;

        img.alt =
            `${post.skill} shared by ${post.authorName}`;

        img.loading =
            "lazy";

        image.appendChild(img);

    } else {

        const placeholder =
            document.createElement("div");

        placeholder.className =
            "image-placeholder";


        const avatar =
            document.createElement("div");

        avatar.className =
            "placeholder-avatar";

        avatar.textContent =
            getInitials(post.authorName);


        placeholder.appendChild(
            avatar
        );

        image.appendChild(
            placeholder
        );
    }


    const content =
        document.createElement("div");

    content.className =
        "teacher-content";


    const skill =
        document.createElement("h3");

    skill.className =
        "skill-name";

    skill.textContent =
        post.skill;


    const name =
        document.createElement("div");

    name.className =
        "teacher-name";

    name.textContent =
        `by ${post.authorName}`;


    const description =
        document.createElement("p");

    description.className =
        "teacher-description";

    description.textContent =
        post.description;


    const meta =
        document.createElement("div");

    meta.className =
        "teacher-meta";


    const date =
        document.createElement("span");

    date.textContent =
        formatDate(post.createdAt);


    const arrow =
        document.createElement("span");

    arrow.className =
        "card-arrow";

    arrow.textContent =
        "→";


    meta.append(
        date,
        arrow
    );


    content.append(
        skill,
        name,
        description,
        meta
    );


    card.append(
        image,
        content
    );


    card.addEventListener(
        "click",
        () => openDetailModal(post)
    );


    return card;
}


/* =========================================================
   COMMUNITY POSTS
========================================================= */

function renderPostGrid(posts) {

    if (!dom.postGrid) {
        return;
    }


    dom.postGrid.replaceChildren();


    if (!posts.length) {

        dom.postGrid.appendChild(
            createEmptyState(
                "Nothing here yet.",
                "Skills shared by the community will appear here."
            )
        );

        return;
    }


    posts
        .slice(0, 12)
        .forEach(post => {

            dom.postGrid.appendChild(
                createPostCard(post)
            );
        });
}


function createPostCard(post) {

    const card =
        document.createElement("article");

    card.className =
        "post-card";


    card.dataset.postId =
        String(post.id);


    const image =
        document.createElement("div");

    image.className =
        "post-image";


    if (post.imageUrl) {

        const img =
            document.createElement("img");

        img.src =
            post.imageUrl;

        img.alt =
            `${post.skill} by ${post.authorName}`;

        img.loading =
            "lazy";

        image.appendChild(img);

    } else {

        const placeholder =
            document.createElement("div");

        placeholder.className =
            "post-image-placeholder";


        const avatar =
            document.createElement("span");

        avatar.className =
            "placeholder-avatar";

        avatar.textContent =
            getInitials(post.authorName);


        placeholder.appendChild(
            avatar
        );


        image.appendChild(
            placeholder
        );
    }


    const body =
        document.createElement("div");

    body.className =
        "post-body";


    const author =
        document.createElement("div");

    author.className =
        "post-author";


    const avatar =
        document.createElement("div");

    avatar.className =
        "mini-avatar";

    avatar.textContent =
        getInitials(post.authorName);


    const authorText =
        document.createElement("div");

    authorText.className =
        "post-author-text";


    const authorStrong =
        document.createElement("strong");

    authorStrong.textContent =
        post.authorName;


    const authorDate =
        document.createElement("span");

    authorDate.textContent =
        formatDate(post.createdAt);


    authorText.append(
        authorStrong,
        authorDate
    );


    author.append(
        avatar,
        authorText
    );


    const title =
        document.createElement("h3");

    title.className =
        "post-title";

    title.textContent =
        post.skill;


    const content =
        document.createElement("p");

    content.className =
        "post-content";

    content.textContent =
        post.description;


    const actions =
        document.createElement("div");

    actions.className =
        "post-actions";


    const viewButton =
        createActionButton(
            "View",
            "→"
        );


    viewButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            openDetailModal(post);
        }
    );


    actions.appendChild(
        viewButton
    );


    if (post.meetingUrl) {

        const live =
            document.createElement("span");

        live.className =
            "live-badge";

        live.textContent =
            "Live";


        actions.appendChild(
            live
        );
    }


    body.append(
        author,
        title,
        content,
        actions
    );


    card.append(
        image,
        body
    );


    card.addEventListener(
        "click",
        () => openDetailModal(post)
    );


    return card;
}


function createActionButton(label, icon) {

    const button =
        document.createElement("button");

    button.type =
        "button";

    button.className =
        "post-action";


    const text =
        document.createElement("span");

    text.textContent =
        label;


    const symbol =
        document.createElement("span");

    symbol.textContent =
        icon;


    button.append(
        text,
        symbol
    );


    return button;
}


/* =========================================================
   EMPTY STATES
========================================================= */

function createEmptyState(title, message) {

    const empty =
        document.createElement("div");

    empty.className =
        "empty-state";


    const heading =
        document.createElement("h3");

    heading.textContent =
        title;


    const paragraph =
        document.createElement("p");

    paragraph.textContent =
        message;


    empty.append(
        heading,
        paragraph
    );


    return empty;
}


function renderEmptyFeed(title, message) {

    if (!dom.teacherGrid) {
        return;
    }


    dom.teacherGrid.replaceChildren(
        createEmptyState(
            title,
            message
        )
    );
}


function renderCommunityEmpty(title, message) {

    if (!dom.postGrid) {
        return;
    }


    dom.postGrid.replaceChildren(
        createEmptyState(
            title,
            message
        )
    );
}


/* =========================================================
   STATS
========================================================= */

function updateStats() {

    const posts =
        state.posts;


    const teacherSet =
        new Set(
            posts.map(
                post => post.uid
            )
        );


    const skillSet =
        new Set(
            posts.map(
                post =>
                    post.skill
                        .trim()
                        .toLowerCase()
            )
        );


    animateNumber(
        dom.heroPostCount,
        posts.length
    );


    animateNumber(
        dom.heroTeacherCount,
        teacherSet.size
    );


    animateNumber(
        dom.heroSkillCount,
        skillSet.size
    );
}


function animateNumber(element, target) {

    if (!element) {
        return;
    }


    const start =
        Number(element.textContent) || 0;


    if (start === target) {
        return;
    }


    const duration =
        500;

    const startTime =
        performance.now();


    function frame(now) {

        const progress =
            Math.min(
                (now - startTime) /
                duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const value =
            Math.round(
                start +
                (target - start) *
                eased
            );


        element.textContent =
            value.toLocaleString();


        if (progress < 1) {
            requestAnimationFrame(frame);
        }
    }


    requestAnimationFrame(frame);
}


/* =========================================================
   CREATE MODAL
========================================================= */

function openCreateModal() {

    resetCreateForm();

    updateProfileUI();

    openModal(
        dom.createModal
    );


    setTimeout(
        () => {
            dom.skillInput?.focus();
        },
        100
    );
}


function resetCreateForm() {

    if (!dom.createPostForm) {
        return;
    }


    dom.createPostForm.reset();


    state.selectedImage =
        "";


    dom.uploadBox?.classList.remove(
        "has-image"
    );


    if (dom.imagePreview) {

        dom.imagePreview.src =
            "";
    }


    if (dom.meetingLink) {

        dom.meetingLink.classList.remove(
            "visible"
        );
    }


    if (dom.meetingUrl) {

        dom.meetingUrl.value =
            "";
    }


    updateCharacterCount();
}


/* =========================================================
   CREATE FORM
========================================================= */

function bindCreateForm() {

    dom.createPostForm?.addEventListener(
        "submit",
        handleCreatePost
    );
}


async function handleCreatePost(event) {

    event.preventDefault();


    if (state.submitting) {
        return;
    }


    const authorName =
        dom.authorName.value.trim();


    const skill =
        dom.skillInput.value.trim();


    const description =
        dom.descriptionInput.value.trim();


    const meeting =
        document.querySelector(
            'input[name="liveOption"]:checked'
        );


    const meetingEnabled =
        meeting?.value === "meeting";


    const meetingUrl =
        meetingEnabled
            ? dom.meetingUrl.value.trim()
            : "";


    if (!authorName) {

        showToast(
            "Add your name first.",
            "!"
        );

        dom.authorName.focus();

        return;
    }


    if (!skill) {

        showToast(
            "Give your skill a name.",
            "!"
        );

        dom.skillInput.focus();

        return;
    }


    if (!description) {

        showToast(
            "Add a description.",
            "!"
        );

        dom.descriptionInput.focus();

        return;
    }


    if (meetingEnabled) {

        if (!meetingUrl) {

            showToast(
                "Add the meeting link.",
                "!"
            );

            dom.meetingUrl.focus();

            return;
        }


        if (!isValidHttpUrl(meetingUrl)) {

            showToast(
                "Use a valid http or https link.",
                "!"
            );

            dom.meetingUrl.focus();

            return;
        }
    }


    setUserName(authorName);


    const payload = {
        uid: getUID(),
        authorName,
        skill,
        description,
        imageUrl: state.selectedImage || "",
        meetingUrl: meetingUrl || ""
    };


    state.submitting =
        true;


    setSubmitLoading(true);


    try {

        const response =
            await fetch(
                POSTS_ENDPOINT,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body:
                        JSON.stringify(payload)
                }
            );


        if (!response.ok) {

            let message =
                `Server returned ${response.status}`;


            try {

                const errorData =
                    await response.json();


                if (errorData?.error) {
                    message =
                        errorData.error;
                }

            } catch {
                // Server may not have returned JSON.
            }


            throw new Error(message);
        }


        const created =
            await response.json();


        const normalized =
            normalizePost(created);


        state.posts.unshift(
            normalized
        );


        applyFilters();

        updateStats();

        renderUserTree();


        closeModal(
            dom.createModal
        );


        resetCreateForm();


        showToast(
            "Skill added to your tree.",
            "✓"
        );


        dom.notificationDot.hidden =
            true;


        document
            .getElementById("discover")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


    } catch (error) {

        console.error(
            "Create post failed:",
            error
        );


        showToast(
            getFriendlyApiError(error),
            "!"
        );

    } finally {

        state.submitting =
            false;

        setSubmitLoading(false);
    }
}


function setSubmitLoading(loading) {

    if (!dom.submitPostButton) {
        return;
    }


    dom.submitPostButton.disabled =
        loading;


    if (loading) {

        dom.submitPostButton.dataset.originalText =
            dom.submitPostButton.textContent;


        dom.submitPostButton.textContent =
            "Publishing...";

    } else {

        dom.submitPostButton.innerHTML =
            `
                Publish skill
                <span
                    class="button-arrow"
                    aria-hidden="true"
                >
                    →
                </span>
            `;
    }
}


function getFriendlyApiError(error) {

    const message =
        error?.message || "";


    if (
        message.includes(
            "Failed to fetch"
        )
    ) {

        return (
            "Couldn't reach the Skilltree server."
        );
    }


    if (
        message.includes(
            "relation"
        ) &&
        message.includes(
            "does not exist"
        )
    ) {

        return (
            "The posts table hasn't been created yet."
        );
    }


    return (
        message ||
        "Something went wrong while publishing."
    );
}


/* =========================================================
   IMAGE UPLOAD
========================================================= */

function bindImageUpload() {

    dom.uploadBox?.addEventListener(
        "click",
        () => dom.imageInput?.click()
    );


    dom.uploadBox?.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                dom.imageInput?.click();
            }
        }
    );


    dom.imageInput?.addEventListener(
        "change",
        handleImageSelection
    );
}


async function handleImageSelection(event) {

    const file =
        event.target.files?.[0];


    if (!file) {
        return;
    }


    if (!file.type.startsWith("image/")) {

        showToast(
            "Please choose an image.",
            "!"
        );

        event.target.value =
            "";

        return;
    }


    if (file.size > 5 * 1024 * 1024) {

        showToast(
            "That image is larger than 5 MB.",
            "!"
        );

        event.target.value =
            "";

        return;
    }


    try {

        showToast(
            "Preparing image...",
            "↑"
        );


        const compressed =
            await compressImage(file);


        state.selectedImage =
            compressed;


        dom.imagePreview.src =
            compressed;


        dom.uploadBox.classList.add(
            "has-image"
        );


        showToast(
            "Image ready.",
            "✓"
        );

    } catch (error) {

        console.error(
            "Image processing failed:",
            error
        );


        showToast(
            "Couldn't process that image.",
            "!"
        );


        event.target.value =
            "";
    }
}


/*
    Compress the image before putting it into the
    PostgreSQL TEXT field as a data URL.

    This keeps the database payload much smaller than
    uploading the original camera/photo file.
*/

async function compressImage(file) {

    const source =
        await readFileAsDataURL(file);


    const image =
        await loadImage(source);


    const maxWidth =
        1200;


    const scale =
        Math.min(
            1,
            maxWidth / image.width
        );


    const width =
        Math.round(
            image.width * scale
        );


    const height =
        Math.round(
            image.height * scale
        );


    const canvas =
        document.createElement("canvas");


    canvas.width =
        width;

    canvas.height =
        height;


    const context =
        canvas.getContext("2d");


    if (!context) {
        throw new Error(
            "Canvas unavailable"
        );
    }


    context.drawImage(
        image,
        0,
        0,
        width,
        height
    );


    return canvas.toDataURL(
        "image/jpeg",
        0.76
    );
}


function readFileAsDataURL(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                () => resolve(
                    reader.result
                );


            reader.onerror =
                () => reject(
                    reader.error ||
                    new Error(
                        "Could not read image"
                    )
                );


            reader.readAsDataURL(
                file
            );
        }
    );
}


function loadImage(source) {

    return new Promise(
        (resolve, reject) => {

            const image =
                new Image();


            image.onload =
                () => resolve(image);


            image.onerror =
                () => reject(
                    new Error(
                        "Could not load image"
                    )
                );


            image.src =
                source;
        }
    );
}


/* =========================================================
   LIVE OPTIONS
========================================================= */

function bindLiveOptions() {

    const options =
        document.querySelectorAll(
            'input[name="liveOption"]'
        );


    options.forEach(option => {

        option.addEventListener(
            "change",
            () => {

                const visible =
                    option.value ===
                    "meeting";


                dom.meetingLink?.classList.toggle(
                    "visible",
                    visible
                );


                if (!visible) {

                    dom.meetingUrl.value =
                        "";
                }
            }
        );
    });
}


/* =========================================================
   CHARACTER COUNT
========================================================= */

function bindCharacterCounter() {

    dom.descriptionInput?.addEventListener(
        "input",
        updateCharacterCount
    );
}


function updateCharacterCount() {

    if (
        !dom.descriptionInput ||
        !dom.characterCount
    ) {
        return;
    }


    const length =
        dom.descriptionInput.value.length;


    dom.characterCount.textContent =
        `${length} / 2000`;
}


/* =========================================================
   DETAIL MODAL
========================================================= */

function openDetailModal(post) {

    if (!post) {
        return;
    }


    state.activePost =
        post;


    dom.detailTitle.textContent =
        post.skill;


    dom.detailAuthor.textContent =
        `by ${post.authorName} · ${formatDate(post.createdAt)}`;


    dom.detailText.textContent =
        post.description;


    if (post.imageUrl) {

        dom.detailImage.src =
            post.imageUrl;

        dom.detailImage.alt =
            `${post.skill} by ${post.authorName}`;

        dom.detailImage.hidden =
            false;

    } else {

        dom.detailImage.src =
            "";

        dom.detailImage.hidden =
            true;
    }


    if (post.meetingUrl) {

        dom.detailLive.hidden =
            false;


        dom.detailMeetingLink.href =
            post.meetingUrl;


        dom.detailMeetingLink.textContent =
            post.meetingUrl;

    } else {

        dom.detailLive.hidden =
            true;


        dom.detailMeetingLink.href =
            "#";
    }


    openModal(
        dom.detailModal
    );
}


/* =========================================================
   PROFILE
========================================================= */

function openProfileModal() {

    updateProfileUI();

    openModal(
        dom.profileModal
    );


    setTimeout(
        () => {
            dom.profileNameInput?.focus();
        },
        100
    );
}


function bindProfileForm() {

    dom.profileForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                dom.profileNameInput.value.trim();


            if (!name) {

                showToast(
                    "Enter a name first.",
                    "!"
                );

                return;
            }


            setUserName(name);


            closeModal(
                dom.profileModal
            );


            showToast(
                "Profile updated.",
                "✓"
            );
        }
    );
}


/* =========================================================
   MODALS
========================================================= */

function bindModalControls() {

    document
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.closeModal;


                    const modal =
                        document.getElementById(id);


                    closeModal(modal);
                }
            );
        });


    [
        dom.createModal,
        dom.detailModal,
        dom.profileModal
    ]
        .filter(Boolean)
        .forEach(modal => {

            modal.addEventListener(
                "click",
                event => {

                    if (
                        event.target === modal
                    ) {

                        closeModal(
                            modal
                        );
                    }
                }
            );
        });
}


function openModal(modal) {

    if (!modal) {
        return;
    }


    modal.classList.add(
        "open"
    );


    document.body.style.overflow =
        "hidden";
}


function closeModal(modal) {

    if (!modal) {
        return;
    }


    modal.classList.remove(
        "open"
    );


    const anyOpen =
        document.querySelector(
            ".modal-overlay.open"
        );


    if (!anyOpen) {

        document.body.style.overflow =
            "";
    }
}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

function bindKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "/" &&
                !isTypingTarget(event.target)
            ) {

                event.preventDefault();

                dom.searchInput?.focus();

                return;
            }


            if (event.key === "Escape") {

                const openModal =
                    document.querySelector(
                        ".modal-overlay.open"
                    );


                if (openModal) {

                    closeModal(
                        openModal
                    );
                }
            }
        }
    );
}


function isTypingTarget(element) {

    if (!element) {
        return false;
    }


    const tag =
        element.tagName?.toLowerCase();


    return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        element.isContentEditable
    );
}


/* =========================================================
   TREE
========================================================= */

function renderInitialTree() {

    const nodes =
        document.querySelectorAll(
            ".large-node"
        );


    nodes.forEach(node => {

        node.title =
            "Your skill";
    });
}


function renderUserTree() {

    const userPosts =
        state.posts.filter(
            post =>
                post.uid === getUID()
        );


    const nodes =
        document.querySelectorAll(
            ".large-node"
        );


    nodes.forEach(
        (node, index) => {

            const post =
                userPosts[index];


            node.replaceChildren();


            if (!post) {

                node.style.opacity =
                    "0.22";

                node.title =
                    "Empty skill slot";

                return;
            }


            node.style.opacity =
                "1";


            node.title =
                post.skill;


            node.dataset.skill =
                post.skill;
        }
    );
}


/* =========================================================
   DATE FORMATTING
========================================================= */

function formatDate(dateValue) {

    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Recently";
    }


    const now =
        new Date();


    const difference =
        now - date;


    const seconds =
        Math.floor(
            difference / 1000
        );


    if (seconds < 60) {
        return "Just now";
    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    if (minutes < 60) {

        return `${minutes}m ago`;
    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {

        return `${hours}h ago`;
    }


    const days =
        Math.floor(
            hours / 24
        );


    if (days < 7) {

        return `${days}d ago`;
    }


    return date.toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric"
        }
    );
}


/* =========================================================
   VALIDATION
========================================================= */

function isValidHttpUrl(value) {

    try {

        const url =
            new URL(value);


        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );

    } catch {

        return false;
    }
}


/* =========================================================
   LOADING
========================================================= */

function setLoading(loading) {

    state.loading =
        loading;


    if (!loading) {
        return;
    }


    if (dom.resultsLabel) {

        dom.resultsLabel.textContent =
            "Loading skills...";
    }


    if (dom.teacherGrid) {

        dom.teacherGrid.replaceChildren(
            createEmptyState(
                "Loading skills...",
                "Finding people who are teaching."
            )
        );
    }


    if (dom.postGrid) {

        dom.postGrid.replaceChildren(
            createEmptyState(
                "Loading posts...",
                "Finding something worth learning."
            )
        );
    }
}


/* =========================================================
   TOASTS
========================================================= */

function showToast(
    message,
    icon = "✓"
) {

    if (
        !dom.toast ||
        !dom.toastMessage
    ) {
        return;
    }


    dom.toastMessage.textContent =
        message;


    dom.toastIcon.textContent =
        icon;


    dom.toast.classList.add(
        "show"
    );


    clearTimeout(
        state.toastTimer
    );


    state.toastTimer =
        setTimeout(
            () => {

                dom.toast.classList.remove(
                    "show"
                );

            },
            3000
        );
}


/* =========================================================
   OFFLINE / ONLINE
========================================================= */

window.addEventListener(
    "offline",
    () => {

        showToast(
            "You're offline.",
            "!"
        );
    }
);


window.addEventListener(
    "online",
    () => {

        showToast(
            "Connection restored.",
            "✓"
        );


        loadPosts();
    }
);
