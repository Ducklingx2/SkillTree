/* =========================================================
   SKILLTREE
   Frontend application
========================================================= */

"use strict";


/* =========================================================
   CONFIG
========================================================= */

const SUPABASE_URL =
    "https://bdhthcfovlgpmliohgnt.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_TlzA00mjS3PVBIfBnXFpsg_Zq_9QwvX";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

const API_URL =
    "https://skilltree-9quj.onrender.com";

const POSTS_ENDPOINT =
    `${API_URL}/api/posts`;


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

    toastTimer: null,

    session: null,

    user: null
};


/* =========================================================
   DOM
========================================================= */

const dom = {

    navLinks:
        document.querySelectorAll(".nav-links a"),

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

    authModal:
        document.getElementById("authModal"),

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

function bindAuthForms() {
    const signInForm =
        document.getElementById("signInForm");

    const signUpForm =
        document.getElementById("signUpForm");

    signInForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email =
            document.getElementById("signInEmail")?.value.trim();

        const password =
            document.getElementById("signInPassword")?.value;

        if (!email || !password) {
            showToast(
                "Enter your email and password.",
                "!"
            );
            return;
        }

        try {
            await signIn(email, password);

            closeModal(dom.authModal);

            showToast(
                "Signed in.",
                "✓"
            );
        } catch (error) {
            console.error("Sign in failed:", error);

            showToast(
                error.message || "Couldn't sign in.",
                "!"
            );
        }
    });

    signUpForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username =
            document.getElementById("signUpName")?.value.trim();

        const email =
            document.getElementById("signUpEmail")?.value.trim();

        const password =
            document.getElementById("signUpPassword")?.value;

        if (!username || !email || !password) {
            showToast(
                "Fill in all the fields.",
                "!"
            );
            return;
        }

        try {
            await signUp(
                email,
                password,
                username
            );

            closeModal(dom.authModal);

            showToast(
                "Account created!",
                "✓"
            );

        } catch (error) {
            console.error("Sign up failed:", error);

            showToast(
                error.message || "Couldn't create your account.",
                "!"
            );
        }
    });
}

function bindAuthTabs() {
    const signInTab = document.getElementById("signInTab");
    const signUpTab = document.getElementById("signUpTab");

    const signInForm = document.getElementById("signInForm");
    const signUpForm = document.getElementById("signUpForm");

    if (
        !signInTab ||
        !signUpTab ||
        !signInForm ||
        !signUpForm
    ) {
        console.error("Auth tabs/forms not found:", {
            signInTab,
            signUpTab,
            signInForm,
            signUpForm
        });

        return;
    }

    signInTab.addEventListener("click", () => {
        signInTab.classList.add("active");
        signUpTab.classList.remove("active");

        signInTab.setAttribute("aria-selected", "true");
        signUpTab.setAttribute("aria-selected", "false");

        signInForm.hidden = false;
        signUpForm.hidden = true;
    });

    signUpTab.addEventListener("click", () => {
        signUpTab.classList.add("active");
        signInTab.classList.remove("active");

        signUpTab.setAttribute("aria-selected", "true");
        signInTab.setAttribute("aria-selected", "false");

        signUpForm.hidden = false;
        signInForm.hidden = true;
    });
}

function bindNavigation() {
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            if (!href || !href.startsWith("#")) return;

            const target = document.querySelector(href);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
}


function bindModalControls() {
    document.querySelectorAll(".modal-close").forEach((button) => {
        button.addEventListener("click", () => {
            const modal = button.closest(".modal-overlay");

            if (modal) {
                closeModal(modal);
            }
        });
    });

    document.querySelectorAll(".modal-overlay").forEach((overlay) => {
        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) {
                closeModal(overlay);
            }
        });
    });
}


function bindCreateForm() {
    const form = document.getElementById("createPostForm");

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        await handleCreatePost(event);
    });
}


function bindImageUpload() {
    const uploadBox = document.getElementById("uploadBox");
    const imageInput = document.getElementById("imageInput");

    if (!uploadBox || !imageInput) return;

    uploadBox.addEventListener("click", () => {
        imageInput.click();
    });

    imageInput.addEventListener("change", () => {
        const file = imageInput.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showToast("Please select an image.", "error");
            imageInput.value = "";
            return;
        }

        state.selectedImage = file;

        const reader = new FileReader();

        reader.onload = (event) => {
            uploadBox.innerHTML = `
                <img
                    src="${event.target.result}"
                    alt="Selected image"
                    class="upload-preview"
                >
                <span>Change image</span>
            `;
        };

        reader.readAsDataURL(file);
    });

    uploadBox.addEventListener("dragover", (event) => {
        event.preventDefault();
        uploadBox.classList.add("dragging");
    });

    uploadBox.addEventListener("dragleave", () => {
        uploadBox.classList.remove("dragging");
    });

    uploadBox.addEventListener("drop", (event) => {
        event.preventDefault();

        uploadBox.classList.remove("dragging");

        const file = event.dataTransfer?.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showToast("Please drop an image file.", "error");
            return;
        }

        state.selectedImage = file;

        const reader = new FileReader();

        reader.onload = (readerEvent) => {
            uploadBox.innerHTML = `
                <img
                    src="${readerEvent.target.result}"
                    alt="Selected image"
                    class="upload-preview"
                >
                <span>Change image</span>
            `;
        };

        reader.readAsDataURL(file);
    });
}


function bindLiveOptions() {
    const liveOptions = document.querySelectorAll(
        'input[name="liveOption"]'
    );

    const meetingLink = document.getElementById("meetingLink");

    if (!liveOptions.length || !meetingLink) return;

    function updateMeetingLinkVisibility() {
        const selected = document.querySelector(
            'input[name="liveOption"]:checked'
        );

        const isLive = selected?.value === "meeting";

        meetingLink.classList.toggle("visible", isLive);
        meetingLink.disabled = !isLive;

        if (!isLive) {
            meetingLink.value = "";
        }
    }

    liveOptions.forEach((option) => {
        option.addEventListener(
            "change",
            updateMeetingLinkVisibility
        );
    });

    updateMeetingLinkVisibility();
}


function bindKeyboardShortcuts() {
    document.addEventListener("keydown", (event) => {
        // Escape closes any open modal
        if (event.key === "Escape") {
            document
                .querySelectorAll(".modal-overlay")
                .forEach((modal) => {
                    closeModal(modal);
                });
        }

        // Ctrl/Cmd + K focuses search
        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {
            event.preventDefault();

            const searchInput =
                document.getElementById("searchInput");

            if (searchInput) {
                searchInput.focus();
            }
        }
    });
}


function setupScrollNavigation() {
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(
        '.nav-links a[href^="#"]'
    );

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                navLinks.forEach((link) => {
                    link.classList.remove("active");

                    if (
                        link.getAttribute("href") ===
                        `#${entry.target.id}`
                    ) {
                        link.classList.add("active");
                    }
                });
            });
        },
        {
            threshold: 0.25,
            rootMargin: "-20% 0px -60% 0px"
        }
    );

    sections.forEach((section) => {
        observer.observe(section);
    });
}

/* =========================================================
   MODALS
========================================================= */

function openModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");
}


function closeModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    /*
        Only remove the body lock when no modal
        is currently open.
    */

    const anotherModalOpen =
        document.querySelector(
            ".modal-overlay.open"
        );

    if (!anotherModalOpen) {
        document.body.classList.remove(
            "modal-open"
        );
    }
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

        dom.teacherGrid.append(
            createEmptyState(
                state.search
                    ? "No teachers found"
                    : "No teachers yet",
                state.search
                    ? "Try a different search."
                    : "Be the first person to teach a skill."
            )
        );

        return;
    }

    /*
        Show each teacher only once.
        The first post encountered represents them.
    */

    const teachers = [];
    const seenUsers = new Set();

    posts.forEach(post => {

        const identifier =
            post.userId ||
            post.authorName;

        if (seenUsers.has(identifier)) {
            return;
        }

        seenUsers.add(identifier);
        teachers.push(post);
    });


    teachers.forEach(post => {

        const card =
            document.createElement("article");

        card.className =
            "teacher-card";


        const avatar =
            document.createElement("div");

        avatar.className =
            "teacher-avatar";

        avatar.textContent =
            getInitials(
                post.authorName
            );


        const content =
            document.createElement("div");

        content.className =
            "teacher-card-content";


        const name =
            document.createElement("h3");

        name.textContent =
            post.authorName;


        const skill =
            document.createElement("p");

        skill.className =
            "teacher-skill";

        skill.textContent =
            post.skill;


        const date =
            document.createElement("span");

        date.className =
            "teacher-date";

        date.textContent =
            formatDate(
                post.createdAt
            );


        content.append(
            name,
            skill,
            date
        );


        card.append(
            avatar,
            content
        );


        card.addEventListener(
            "click",
            () => {

                openPostDetail(
                    post
                );
            }
        );


        dom.teacherGrid.append(
            card
        );
    });
}


/* =========================================================
   POST GRID
========================================================= */

function renderPostGrid(posts) {

    if (!dom.postGrid) {
        return;
    }

    dom.postGrid.replaceChildren();


    if (!posts.length) {

        dom.postGrid.append(
            createEmptyState(
                state.search
                    ? "No skills found"
                    : "No skills shared yet",
                state.search
                    ? "Try searching for something else."
                    : "Be the first to share what you know."
            )
        );

        return;
    }


    posts.forEach(post => {

        const card =
            document.createElement("article");

        card.className =
            "post-card";


        /* =================================================
           IMAGE
        ================================================= */

       const imageContainer = document.createElement("div");
imageContainer.className = "post-image";

if (post.imageUrl) {
    const image = document.createElement("img");

    image.src = post.imageUrl;
    image.alt = post.skill || "Skill post";
    image.loading = "lazy";

    image.addEventListener("error", () => {
        image.remove();

        const placeholder = document.createElement("div");
        placeholder.className = "post-image-placeholder";

        const icon = document.createElement("span");
        icon.textContent = "✦";
        icon.setAttribute("aria-hidden", "true");

        placeholder.append(icon);
        imageContainer.append(placeholder);
    });

    imageContainer.append(image);
} else {
    const placeholder = document.createElement("div");
    placeholder.className = "post-image-placeholder";

    const icon = document.createElement("span");
    icon.textContent = "✦";
    icon.setAttribute("aria-hidden", "true");

    placeholder.append(icon);
    imageContainer.append(placeholder);
}

        /* =================================================
           BODY
        ================================================= */

        const body =
            document.createElement("div");

        body.className =
            "post-body";


        /* =================================================
           AUTHOR
        ================================================= */

        const author =
            document.createElement("div");

        author.className =
            "post-author";


        const avatar =
            document.createElement("div");

        avatar.className =
            "mini-avatar";

        avatar.textContent =
            getInitials(
                post.authorName
            );


        const authorText =
            document.createElement("div");

        authorText.className =
            "post-author-text";


        const authorName =
            document.createElement("strong");

        authorName.textContent =
            post.authorName;


        const authorDate =
            document.createElement("span");

        authorDate.textContent =
            formatDate(
                post.createdAt
            );


        authorText.append(
            authorName,
            authorDate
        );


        author.append(
            avatar,
            authorText
        );


        /* =================================================
           TITLE
        ================================================= */

        const title =
            document.createElement("h3");

        title.className =
            "post-title";

        title.textContent =
            post.skill;


        /* =================================================
           CONTENT
        ================================================= */

        const content =
            document.createElement("p");

        content.className =
            "post-content";

        content.textContent =
            post.description;


        /* =================================================
           ACTIONS
        ================================================= */

        const actions =
            document.createElement("div");

        actions.className =
            "post-actions";


        const viewButton =
            document.createElement("button");

        viewButton.type =
            "button";

        viewButton.className =
            "post-action";

        viewButton.innerHTML = `
            <span aria-hidden="true">↗</span>
            <span>View skill</span>
        `;


        viewButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                openPostDetail(
                    post
                );
            }
        );


        actions.append(
            viewButton
        );


        /* =================================================
           LIVE TEACHING
        ================================================= */

        if (post.meetingUrl) {

            const liveBadge =
                document.createElement("span");

            liveBadge.className =
                "live-badge";

            liveBadge.textContent =
                "Live teaching";


            actions.append(
                liveBadge
            );
        }


        /* =================================================
           ASSEMBLE
        ================================================= */

        body.append(
            author,
            title,
            content,
            actions
        );


        card.append(
            imageContainer,
            body
        );


        card.addEventListener(
            "click",
            () => {

                openPostDetail(
                    post
                );
            }
        );


        dom.postGrid.append(
            card
        );
    });
}


/* =========================================================
   POST DETAIL
========================================================= */

function openPostDetail(post) {

    if (!post) {
        return;
    }

    state.activePost =
        post;


    if (dom.detailImage) {

        if (post.imageUrl) {

            dom.detailImage.src =
                post.imageUrl;

            dom.detailImage.hidden =
                false;

        } else {

            dom.detailImage.src =
                "";

            dom.detailImage.hidden =
                true;
        }
    }


    if (dom.detailTitle) {

        dom.detailTitle.textContent =
            post.skill;
    }


    if (dom.detailAuthor) {

        dom.detailAuthor.textContent =
            post.authorName;
    }


    if (dom.detailText) {

        dom.detailText.textContent =
            post.description;
    }


    if (dom.detailLive) {

        dom.detailLive.hidden =
            !post.meetingUrl;
    }


    if (dom.detailMeetingLink) {

        if (post.meetingUrl) {

            dom.detailMeetingLink.href =
                post.meetingUrl;

            dom.detailMeetingLink.hidden =
                false;

        } else {

            dom.detailMeetingLink.href =
                "#";

            dom.detailMeetingLink.hidden =
                true;
        }
    }


    openModal(
        dom.detailModal
    );
}
document.addEventListener(
    "DOMContentLoaded",
    initialize
);


async function initialize() {
    bindNavigation();
    bindButtons();

    bindAuthTabs();
    bindAuthForms();

    bindSearch();
    bindSorting();
    bindModalControls();
    bindCreateForm();
    bindProfileForm();
    bindImageUpload();
    bindLiveOptions();
    bindCharacterCounter();
    bindKeyboardShortcuts();

    renderInitialTree();

    await initializeAuth();

    updateProfileUI();

    await loadPosts();

    setupScrollNavigation();
}


/* =========================================================
   SUPABASE AUTH
========================================================= */

async function initializeAuth() {

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();

    if (error) {

        console.error(
            "Failed to restore Supabase session:",
            error
        );

        state.session = null;
        state.user = null;

    } else {

        state.session = session;
        state.user = session?.user || null;
    }


    updateAuthUI();


    /*
        Listen for:

        SIGNED_IN
        SIGNED_OUT
        TOKEN_REFRESHED
        USER_UPDATED
        INITIAL_SESSION
    */

    supabaseClient.auth.onAuthStateChange(
        (_event, session) => {

            state.session =
                session;

            state.user =
                session?.user || null;

            updateAuthUI();

            updateProfileUI();

            renderUserTree();
        }
    );
}


/* =========================================================
   AUTH UI
========================================================= */

function updateAuthUI() {

    /*
        Your current HTML does not appear to have
        dedicated login buttons yet.

        This function is deliberately defensive so
        nothing breaks if those elements don't exist.
    */

    const loggedIn =
        Boolean(state.user);


    const authButtons =
        document.querySelectorAll(
            "[data-auth-required]"
        );


    authButtons.forEach(element => {

        element.hidden =
            !loggedIn;
    });


    const guestElements =
        document.querySelectorAll(
            "[data-auth-guest]"
        );


    guestElements.forEach(element => {

        element.hidden =
            loggedIn;
    });
}


/* =========================================================
   SIGN UP
========================================================= */

async function signUp(email, password, username) {
    const {
        data,
        error
    } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
            data: {
                username
            }
        }
    });

    if (error) {
        throw error;
    }

    console.log("Sign up response:", data);

    return data;
}

    if (data.session) {

        state.session =
            data.session;

        state.user =
            data.user;

        updateProfileUI();

        updateAuthUI();

    } else {

        showToast(
            "Check your email to confirm your account.",
            "✉"
        );
    }


    return data;
}


/* =========================================================
   SIGN IN
========================================================= */

async function signIn(
    email,
    password
) {

    const {
        data,
        error
    } =
        await supabaseClient.auth.signInWithPassword({

            email:
                email.trim(),

            password
        });


    if (error) {

        throw new Error(
            error.message
        );
    }


    state.session =
        data.session;

    state.user =
        data.user;


    updateAuthUI();

    updateProfileUI();

    await loadPosts();

    renderUserTree();


    return data;
}


/* =========================================================
   SIGN OUT
========================================================= */

async function signOut() {

    const {
        error
    } =
        await supabaseClient.auth.signOut();


    if (error) {

        throw new Error(
            error.message
        );
    }


    state.session = null;

    state.user = null;


    updateAuthUI();

    updateProfileUI();

    renderUserTree();


    showToast(
        "Signed out.",
        "✓"
    );
}


/* =========================================================
   CURRENT USER
========================================================= */

async function getCurrentUser() {

    const {
        data: { user },
        error
    } =
        await supabaseClient.auth.getUser();


    if (error) {

        return null;
    }


    state.user =
        user;


    return user;
}


/* =========================================================
   USERNAME
========================================================= */

function getUserName() {

    if (!state.user) {

        return "You";
    }


    return (
        state.user.user_metadata?.username ||
        state.user.email?.split("@")[0] ||
        "You"
    );
}


async function setUserName(name) {

    const cleanName =
        name
            .trim()
            .slice(0, 100);


    if (!cleanName) {

        throw new Error(
            "Username cannot be empty."
        );
    }


    if (!state.user) {

        throw new Error(
            "You must be signed in."
        );
    }


    const {
        data,
        error
    } =
        await supabaseClient.auth.updateUser({

            data: {
                username: cleanName
            }
        });


    if (error) {

        throw new Error(
            error.message
        );
    }


    state.user =
        data.user;


    updateProfileUI();


    /*
        Re-render posts locally so any posts
        belonging to this user can update.
    */

    state.posts =
        state.posts.map(post => {

            if (
                post.userId ===
                state.user.id
            ) {

                return {
                    ...post,
                    authorName:
                        cleanName
                };
            }

            return post;
        });


    applyFilters();

    updateStats();

    renderUserTree();
}


/* =========================================================
   PROFILE UI
========================================================= */

function updateProfileUI() {
    if (!dom.navProfileName || !dom.navAvatar) return;

    if (state.user) {
        const username =
            state.user.user_metadata?.username ||
            state.user.user_metadata?.display_name ||
            state.user.email?.split("@")[0] ||
            "You";

        dom.navProfileName.textContent = username;
        dom.navAvatar.textContent =
            username.charAt(0).toUpperCase();

        return;
    }

    dom.navProfileName.textContent = "Sign in";
    dom.navAvatar.textContent = "?";
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

        return words[0]
            .slice(0, 1)
            .toUpperCase();
    }


    return (
        words[0].slice(0, 1) +
        words[words.length - 1]
            .slice(0, 1)
    ).toUpperCase();
}


/* =========================================================
   AUTHENTICATED API REQUEST
========================================================= */

async function authenticatedFetch(
    url,
    options = {}
) {

    /*
        getSession() is fine here because we need
        the access token to send to our own backend.

        The Go backend independently verifies the token.
    */

    const {
        data: { session },
        error
    } =
        await supabaseClient.auth.getSession();


    if (error) {

        throw new Error(
            error.message
        );
    }


    if (!session) {

        throw new Error(
            "You must be signed in."
        );
    }


    const headers =
        new Headers(
            options.headers || {}
        );


    headers.set(
        "Authorization",
        `Bearer ${session.access_token}`
    );


    if (
        options.body &&
        !headers.has("Content-Type")
    ) {

        headers.set(
            "Content-Type",
            "application/json"
        );
    }


    return fetch(
        url,
        {
            ...options,
            headers
        }
    );
}


/* =========================================================
   LOAD POSTS
========================================================= */

async function loadPosts() {

    setLoading(true);


    try {

        const response =
            await fetch(
                POSTS_ENDPOINT,
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


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

            dom.notificationDot.hidden =
                true;
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

        id:
            post.id,

        /*
            NEW:
            Supabase user's UUID
        */

        userId:
            String(
                post.userId ??
                post.user_id ??
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
   CREATE POST
========================================================= */

async function handleCreatePost(event) {

    event.preventDefault();


    if (state.submitting) {

        return;
    }


    /*
        IMPORTANT:
        A post cannot be created without
        an authenticated Supabase user.
    */

    const user =
        await getCurrentUser();


    if (!user) {

        showToast(
            "Sign in before creating a skill.",
            "!"
        );

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


        if (
            !isValidHttpUrl(
                meetingUrl
            )
        ) {

            showToast(
                "Use a valid http or https link.",
                "!"
            );

            dom.meetingUrl.focus();

            return;
        }
    }


    /*
        Update Supabase username first.

        This means changing the name here changes
        the account's actual username.
    */

    if (
        authorName !==
        getUserName()
    ) {

        try {

            await setUserName(
                authorName
            );

        } catch (error) {

            showToast(
                error.message,
                "!"
            );

            return;
        }
    }


    /*
        NOTICE:
        There is NO uid here.

        The backend gets the user ID from
        the verified Supabase access token.
    */

    const payload = {

        authorName:
            getUserName(),

        skill,

        description,

        imageUrl:
            state.selectedImage || "",

        meetingUrl:
            meetingUrl || ""
    };


    state.submitting =
        true;


    setSubmitLoading(true);


    try {

        const response =
            await authenticatedFetch(
                POSTS_ENDPOINT,
                {
                    method: "POST",

                    headers: {
                        "Accept":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );


        if (!response.ok) {

            let message =
                `Server returned ${response.status}`;


            try {

                const errorData =
                    await response.json();


                if (
                    errorData?.error
                ) {

                    message =
                        errorData.error;
                }

            } catch {
                // Server may not have returned JSON.
            }


            throw new Error(
                message
            );
        }


        const created =
            await response.json();


        const normalized =
            normalizePost(
                created
            );


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


        if (dom.notificationDot) {

            dom.notificationDot.hidden =
                true;
        }


        document
            .getElementById(
                "discover"
            )
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
            getFriendlyApiError(
                error
            ),
            "!"
        );

    } finally {

        state.submitting =
            false;

        setSubmitLoading(
            false
        );
    }
}


/* =========================================================
   PROFILE FORM
========================================================= */

function bindProfileForm() {

    dom.profileForm?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                dom.profileNameInput
                    .value
                    .trim();


            if (!name) {

                showToast(
                    "Enter a name first.",
                    "!"
                );

                return;
            }


            try {

                await setUserName(
                    name
                );


                closeModal(
                    dom.profileModal
                );


                showToast(
                    "Profile updated.",
                    "✓"
                );

            } catch (error) {

                console.error(
                    "Profile update failed:",
                    error
                );


                showToast(
                    error.message ||
                    "Couldn't update profile.",
                    "!"
                );
            }
        }
    );
}


/* =========================================================
   PROFILE MODAL
========================================================= */

function openProfileModal() {

    if (!state.user) {

        showToast(
            "Sign in to edit your profile.",
            "!"
        );

        return;
    }


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


async function renderUserTree() {

    const nodes =
        document.querySelectorAll(
            ".large-node"
        );


    if (!nodes.length) {

        return;
    }


    /*
        No logged-in user = empty tree.
    */

    if (!state.user) {

        nodes.forEach(node => {

            node.replaceChildren();

            node.style.opacity =
                "0.22";

            node.title =
                "Sign in to see your tree";
        });

        return;
    }


    const userPosts =
        state.posts.filter(
            post =>
                post.userId ===
                state.user.id
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
                () => {

                    if (!state.user) {

                        showToast(
                            "Sign in to teach a skill.",
                            "!"
                        );

                        return;
                    }


                    openCreateModal();
                }
            );
        });


   dom.profileButton?.addEventListener("click", () => {
    if (state.user) {
        openModal(dom.profileModal);
    } else {
        openModal(dom.authModal);
    }
});

    dom.notificationButton?.addEventListener(
        "click",
        () => {

            showToast(
                "You're all caught up.",
                "✓"
            );


            if (
                dom.notificationDot
            ) {

                dom.notificationDot.hidden =
                    true;
            }
        }
    );
}


/* =========================================================
   CREATE MODAL
========================================================= */

function openCreateModal() {

    if (!state.user) {

        showToast(
            "Sign in to create a skill.",
            "!"
        );

        return;
    }


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
   SUBMIT BUTTON
========================================================= */

function setSubmitLoading(
    loading
) {

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


/* =========================================================
   API ERROR
========================================================= */

function getFriendlyApiError(
    error
) {

    const message =
        error?.message || "";


    if (
        message.includes(
            "You must be signed in"
        )
    ) {

        return message;
    }


    if (
        message.includes(
            "401"
        )
    ) {

        return (
            "Your session expired. Please sign in again."
        );
    }


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
   STATS
========================================================= */

function updateStats() {

    const posts =
        state.posts;


    const teacherSet =
        new Set(
            posts.map(
                post =>
                    post.userId
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


function animateNumber(
    element,
    target
) {

    if (!element) {

        return;
    }


    const start =
        Number(
            element.textContent
        ) || 0;


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

            requestAnimationFrame(
                frame
            );
        }
    }


    requestAnimationFrame(
        frame
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
                event.target.value
                    .trim()
                    .toLowerCase();


            applyFilters();
        }
    );
}


function applyFilters() {

    let posts =
        [...state.posts];


    if (state.search) {

        posts =
            posts.filter(
                post => {

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
                }
            );
    }


    posts.sort(
        getSortFunction(
            state.sort
        )
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


function getSortFunction(
    sort
) {

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
   SORTING
========================================================= */

function bindSorting() {

    dom.sortButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    state.sort =
                        button.dataset.sort ||
                        "recent";


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
        }
    );
}


/* =========================================================
   RESULTS
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
   DATE
========================================================= */

function formatDate(
    dateValue
) {

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

function isValidHttpUrl(
    value
) {

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
   EMPTY STATES
========================================================= */

function createEmptyState(
    title,
    message
) {

    const empty =
        document.createElement(
            "div"
        );

    empty.className =
        "empty-state";


    const heading =
        document.createElement(
            "h3"
        );

    heading.textContent =
        title;


    const paragraph =
        document.createElement(
            "p"
        );

    paragraph.textContent =
        message;


    empty.append(
        heading,
        paragraph
    );


    return empty;
}


function renderEmptyFeed(
    title,
    message
) {

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


function renderCommunityEmpty(
    title,
    message
) {

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
   LOADING
========================================================= */

function setLoading(
    loading
) {

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
