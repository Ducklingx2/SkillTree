/* =========================================================
   SKILLTREE
   Frontend prototype
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {
    user: "skilltree_user",
    posts: "skilltree_posts",
    likes: "skilltree_likes"
};



/* =========================================================
   DEFAULT USER
========================================================= */

let user = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.user)
) || {
    displayName: "You",
    username: "you"
};



/* =========================================================
   SAMPLE POSTS
   These are NOT predefined skills.
   They are simply demo community posts.
========================================================= */

const samplePosts = [

    {
        id: "demo-1",

        skillName:
            "How I make cinematic Minecraft builds",

        author: {
            name: "Maya",
            username: "mayabuilds"
        },

        content:
            "I start with the lighting before I even think about the details. Pick one strong light source, build the composition around it, then use smaller sources to guide the eye. After that, I add texture and tiny imperfections so the build doesn't feel like a showroom.",

        image: null,

        platform: "none",

        createdAt:
            Date.now() - 1000 * 60 * 60 * 2,

        likes: 84,

        comments: 12
    },


    {
        id: "demo-2",

        skillName:
            "Making music without knowing music theory",

        author: {
            name: "Noah",
            username: "noahmakesnoise"
        },

        content:
            "You don't need to memorize a giant wall of theory before making something. I usually start with a melody I like, find a few notes that sound good together, and build outward. The important part is listening carefully and changing one thing at a time.",

        image: null,

        platform: "none",

        createdAt:
            Date.now() - 1000 * 60 * 60 * 5,

        likes: 67,

        comments: 9
    },


    {
        id: "demo-3",

        skillName:
            "Actually understanding difficult math",

        author: {
            name: "Sam",
            username: "samthinks"
        },

        content:
            "When I get stuck on a problem, I stop trying to solve the exact question and ask what the question is actually describing. Drawing it, explaining it in normal words, or making a tiny example usually makes the missing idea obvious.",

        image: null,

        platform: "none",

        createdAt:
            Date.now() - 1000 * 60 * 60 * 9,

        likes: 52,

        comments: 15
    },


    {
        id: "demo-4",

        skillName:
            "Making tiny robots from random junk",

        author: {
            name: "Leo",
            username: "leobuilds"
        },

        content:
            "The trick is not starting with the robot. Start with the movement you want. Once you know what should move, you can figure out what parts can create that movement. Broken toys and random hardware suddenly become useful.",

        image: null,

        platform: "none",

        createdAt:
            Date.now() - 1000 * 60 * 60 * 14,

        likes: 41,

        comments: 7
    }

];



/* =========================================================
   LOAD POSTS
========================================================= */

let savedPosts = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.posts)
);


let posts = savedPosts || samplePosts;



/* =========================================================
   LIKES
========================================================= */

let likedPosts = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.likes)
) || {};



/* =========================================================
   DOM
========================================================= */

const teacherGrid =
    document.getElementById("teacherGrid");

const postGrid =
    document.getElementById("postGrid");

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const teachButton =
    document.getElementById("teachButton");

const ctaTeachButton =
    document.getElementById("ctaTeachButton");

const modalOverlay =
    document.getElementById("modalOverlay");

const modalClose =
    document.getElementById("modalClose");

const postForm =
    document.getElementById("postForm");

const skillName =
    document.getElementById("skillName");

const skillContent =
    document.getElementById("skillContent");

const imageInput =
    document.getElementById("imageInput");

const imagePreview =
    document.getElementById("imagePreview");

const uploadBox =
    document.querySelector(".upload-box");

const uploadContent =
    document.getElementById("uploadContent");

const characterCount =
    document.getElementById("characterCount");

const meetingLink =
    document.getElementById("meetingLink");

const profileModal =
    document.getElementById("profileModal");

const profileModalClose =
    document.getElementById("profileModalClose");

const profileButton =
    document.getElementById("profileButton");

const profileForm =
    document.getElementById("profileForm");

const displayName =
    document.getElementById("displayName");

const username =
    document.getElementById("username");

const navAvatar =
    document.getElementById("navAvatar");

const navUsername =
    document.getElementById("navUsername");

const postModal =
    document.getElementById("postModal");

const postModalClose =
    document.getElementById("postModalClose");

const postDetailContent =
    document.getElementById("postDetailContent");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const skillCount =
    document.getElementById("skillCount");

const peopleCount =
    document.getElementById("peopleCount");

const resultsLabel =
    document.getElementById("resultsLabel");



/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateProfileUI();

        renderEverything();

        setupNavigation();

    }
);



/* =========================================================
   PROFILE
========================================================= */

function updateProfileUI() {

    navUsername.textContent =
        user.username === "you"
            ? "You"
            : `@${user.username}`;


    navAvatar.textContent =
        getInitials(user.displayName);


    displayName.value =
        user.displayName === "You"
            ? ""
            : user.displayName;


    username.value =
        user.username === "you"
            ? ""
            : user.username;
}


function getInitials(name) {

    if (!name) return "?";

    const parts =
        name.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
}



function saveUser() {

    localStorage.setItem(
        STORAGE_KEYS.user,
        JSON.stringify(user)
    );

    updateProfileUI();
}



/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderEverything() {

    renderTeacherCards();

    renderPosts();

    renderTree();

    updateStats();

}



/* =========================================================
   SEARCH
========================================================= */

let currentSort = "popular";


searchInput.addEventListener(
    "input",
    renderEverything
);


searchButton.addEventListener(
    "click",
    () => {

        document
            .getElementById("discover")
            .scrollIntoView({
                behavior: "smooth"
            });

        setTimeout(
            () => searchInput.focus(),
            500
        );

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "/" &&
            document.activeElement.tagName !== "INPUT" &&
            document.activeElement.tagName !== "TEXTAREA"
        ) {

            event.preventDefault();

            searchInput.focus();

        }

        if (event.key === "Escape") {

            closeAllModals();

        }

    }
);



/* =========================================================
   SORT
========================================================= */

document
    .querySelectorAll(".sort-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".sort-button")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );

                button.classList.add("active");

                currentSort =
                    button.dataset.sort;

                renderEverything();

            }
        );

    });



/* =========================================================
   FILTER POSTS
========================================================= */

function getFilteredPosts() {

    const query =
        searchInput.value
            .trim()
            .toLowerCase();


    let filtered =
        [...posts];


    if (query) {

        filtered =
            filtered.filter(post => {

                const searchable = [
                    post.skillName,
                    post.content,
                    post.author.name,
                    post.author.username
                ]
                    .join(" ")
                    .toLowerCase();

                return searchable.includes(query);

            });

    }


    if (currentSort === "newest") {

        filtered.sort(
            (a, b) =>
                b.createdAt - a.createdAt
        );

    } else {

        filtered.sort(
            (a, b) =>
                b.likes - a.likes
        );

    }


    return filtered;

}



/* =========================================================
   TEACHER CARDS
========================================================= */

function renderTeacherCards() {

    const filtered =
        getFilteredPosts();


    teacherGrid.innerHTML = "";


    if (!filtered.length) {

        teacherGrid.innerHTML = `
            <div class="empty-state">
                <h3>Nothing found.</h3>
                <p>
                    Try searching for something else.
                </p>
            </div>
        `;

        return;

    }


    filtered
        .slice(0, 8)
        .forEach(post => {

            const card =
                document.createElement("article");

            card.className =
                "teacher-card";


            card.innerHTML = `

                <div class="teacher-image">

                    ${getImageHTML(
                        post,
                        "teacher"
                    )}

                </div>


                <div class="teacher-content">

                    <h3 class="skill-name">
                        ${escapeHTML(
                            post.skillName
                        )}
                    </h3>


                    <div class="teacher-name">
                        ${escapeHTML(
                            post.author.name
                        )}
                        · @${escapeHTML(
                            post.author.username
                        )}
                    </div>


                    <p class="teacher-description">
                        ${escapeHTML(
                            post.content
                        )}
                    </p>


                    <div class="teacher-meta">

                        <span>
                            ${post.likes} people liked this
                        </span>

                        <span class="card-arrow">
                            ↗
                        </span>

                    </div>

                </div>
            `;


            card.addEventListener(
                "click",
                () => openPost(post.id)
            );


            teacherGrid.appendChild(card);

        });


    resultsLabel.textContent =
        searchInput.value.trim()
            ? `${filtered.length} result${filtered.length === 1 ? "" : "s"}`
            : "Popular right now";

}



/* =========================================================
   COMMUNITY POSTS
========================================================= */

function renderPosts() {

    const filtered =
        getFilteredPosts();


    postGrid.innerHTML = "";


    if (!filtered.length) {

        postGrid.innerHTML = `
            <div class="empty-state">
                <h3>No posts found.</h3>
                <p>
                    Be the person who starts something new.
                </p>
            </div>
        `;

        return;

    }


    filtered
        .slice(0, 6)
        .forEach(post => {

            const card =
                document.createElement("article");

            card.className =
                "post-card";


            const liked =
                Boolean(likedPosts[post.id]);


            const liveBadge =
                post.platform !== "none"
                    ? `
                        <span class="live-badge">
                            ${post.platform === "zoom"
                                ? "Zoom"
                                : "Meet"}
                        </span>
                    `
                    : "";


            card.innerHTML = `

                <div class="post-image">

                    ${getImageHTML(
                        post,
                        "post"
                    )}

                </div>


                <div class="post-body">

                    <div class="post-author">

                        <div class="mini-avatar">
                            ${getInitials(
                                post.author.name
                            )}
                        </div>


                        <div class="post-author-text">

                            <strong>
                                ${escapeHTML(
                                    post.author.name
                                )}
                            </strong>

                            <span>
                                @${escapeHTML(
                                    post.author.username
                                )}
                                ·
                                ${formatTime(
                                    post.createdAt
                                )}
                            </span>

                        </div>

                    </div>


                    <h3 class="post-title">
                        ${escapeHTML(
                            post.skillName
                        )}
                    </h3>


                    <p class="post-content">
                        ${escapeHTML(
                            post.content
                        )}
                    </p>


                    <div class="post-actions">

                        <button
                            class="post-action like-button ${liked ? "liked" : ""}"
                            data-id="${post.id}"
                        >
                            ${liked ? "♥" : "♡"}
                            <span>
                                ${post.likes}
                            </span>
                        </button>


                        <button
                            class="post-action comment-button"
                            data-id="${post.id}"
                        >
                            ◌
                            <span>
                                ${post.comments}
                            </span>
                        </button>


                        <button
                            class="post-action share-button"
                            data-id="${post.id}"
                        >
                            ↗
                            <span>
                                Share
                            </span>
                        </button>


                        ${liveBadge}

                    </div>

                </div>
            `;


            card
                .querySelector(".like-button")
                .addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        toggleLike(post.id);

                    }
                );


            card
                .querySelector(".comment-button")
                .addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        openPost(post.id);

                    }
                );


            card
                .querySelector(".share-button")
                .addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        sharePost(post);

                    }
                );


            card.addEventListener(
                "click",
                () => openPost(post.id)
            );


            postGrid.appendChild(card);

        });

}



/* =========================================================
   IMAGE HTML
========================================================= */

function getImageHTML(
    post,
    type
) {

    if (post.image) {

        return `
            <img
                src="${post.image}"
                alt="${escapeHTML(
                    post.skillName
                )}"
            >
        `;

    }


    return `
        <div class="${type === "teacher"
            ? "image-placeholder"
            : "post-image-placeholder"}">

            <div class="placeholder-avatar">
                ${getInitials(
                    post.author.name
                )}
            </div>

        </div>
    `;

}



/* =========================================================
   LIKE
========================================================= */

function toggleLike(id) {

    const post =
        posts.find(
            item => item.id === id
        );


    if (!post) return;


    if (likedPosts[id]) {

        post.likes =
            Math.max(
                0,
                post.likes - 1
            );

        delete likedPosts[id];

    } else {

        post.likes++;

        likedPosts[id] = true;

    }


    savePosts();

    localStorage.setItem(
        STORAGE_KEYS.likes,
        JSON.stringify(likedPosts)
    );


    renderEverything();

}



/* =========================================================
   SHARE
========================================================= */

async function sharePost(post) {

    const shareText =
        `${post.skillName} by @${post.author.username}`;


    if (
        navigator.share
    ) {

        try {

            await navigator.share({
                title: post.skillName,
                text: shareText
            });

            showToast(
                "Shared successfully"
            );

        } catch {
            // User cancelled sharing.
        }

        return;

    }


    try {

        await navigator.clipboard.writeText(
            shareText
        );

        showToast(
            "Copied to clipboard"
        );

    } catch {

        showToast(
            "Share link copied"
        );

    }

}



/* =========================================================
   OPEN POST
========================================================= */

function openPost(id) {

    const post =
        posts.find(
            item => item.id === id
        );


    if (!post) return;


    const image =
        post.image
            ? `
                <img
                    class="post-detail-image"
                    src="${post.image}"
                    alt="${escapeHTML(
                        post.skillName
                    )}"
                >
            `
            : "";


    const live =
        post.platform !== "none" &&
        post.meetingLink
            ? `
                <div class="detail-live">

                    <strong>
                        Want to learn live?
                    </strong>

                    <a
                        href="${escapeAttribute(
                            post.meetingLink
                        )}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Connect on
                        ${post.platform === "zoom"
                            ? "Zoom"
                            : "Google Meet"}
                    </a>

                </div>
            `
            : "";


    postDetailContent.innerHTML = `

        ${image}

        <div class="post-detail-content">

            <h2>
                ${escapeHTML(
                    post.skillName
                )}
            </h2>


            <div class="detail-author">
                ${escapeHTML(
                    post.author.name
                )}
                ·
                @${escapeHTML(
                    post.author.username
                )}
            </div>


            <div class="detail-text">
                ${escapeHTML(
                    post.content
                )}
            </div>


            ${live}

        </div>

    `;


    postModal.classList.add("open");

    document.body.style.overflow = "hidden";

}



/* =========================================================
   CREATE POST MODAL
========================================================= */

function openCreateModal() {

    modalOverlay.classList.add("open");

    document.body.style.overflow = "hidden";

    setTimeout(
        () => skillName.focus(),
        200
    );

}


function closeCreateModal() {

    modalOverlay.classList.remove("open");

    if (
        !profileModal.classList.contains("open") &&
        !postModal.classList.contains("open")
    ) {
        document.body.style.overflow = "";
    }

}



/* =========================================================
   TEACH BUTTONS
========================================================= */

teachButton.addEventListener(
    "click",
    openCreateModal
);


ctaTeachButton.addEventListener(
    "click",
    openCreateModal
);


modalClose.addEventListener(
    "click",
    closeCreateModal
);


modalOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target === modalOverlay
        ) {
            closeCreateModal();
        }

    }
);



/* =========================================================
   IMAGE UPLOAD
========================================================= */

imageInput.addEventListener(
    "change",
    () => {

        const file =
            imageInput.files[0];


        if (!file) return;


        if (!file.type.startsWith("image/")) {

            showToast(
                "Please choose an image"
            );

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

                imagePreview.src =
                    event.target.result;

                uploadBox.classList.add(
                    "has-image"
                );

            };


        reader.readAsDataURL(file);

    }
);



/* =========================================================
   TEXT CHARACTER COUNTER
========================================================= */

skillContent.addEventListener(
    "input",
    () => {

        characterCount.textContent =
            skillContent.value.length;

    }
);



/* =========================================================
   LIVE TEACHING
========================================================= */

document
    .querySelectorAll(
        'input[name="platform"]'
    )
    .forEach(radio => {

        radio.addEventListener(
            "change",
            () => {

                const selected =
                    document.querySelector(
                        'input[name="platform"]:checked'
                    ).value;


                if (selected === "none") {

                    meetingLink
                        .classList
                        .remove("visible");

                    meetingLink.required =
                        false;

                } else {

                    meetingLink
                        .classList
                        .add("visible");

                    meetingLink.required =
                        true;

                }

            }
        );

    });



/* =========================================================
   SUBMIT POST
========================================================= */

postForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            skillName.value.trim();

        const content =
            skillContent.value.trim();


        if (!name || !content) {

            showToast(
                "Give your skill a name and teach it"
            );

            return;

        }


        const platform =
            document.querySelector(
                'input[name="platform"]:checked'
            ).value;


        const newPost = {

            id:
                `post-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 8)}`,

            skillName:
                name,

            author: {
                name:
                    user.displayName,

                username:
                    user.username
            },

            content:
                content,

            image:
                imagePreview.src || null,

            platform:
                platform,

            meetingLink:
                platform === "none"
                    ? ""
                    : meetingLink.value.trim(),

            createdAt:
                Date.now(),

            likes:
                0,

            comments:
                0

        };


        posts.unshift(
            newPost
        );


        savePosts();


        resetPostForm();


        closeCreateModal();


        renderEverything();


        document
            .getElementById("community")
            .scrollIntoView({
                behavior: "smooth"
            });


        showToast(
            "Your skill is now part of the tree"
        );

    }
);



/* =========================================================
   RESET POST FORM
========================================================= */

function resetPostForm() {

    postForm.reset();


    imagePreview.src = "";

    uploadBox.classList.remove(
        "has-image"
    );


    characterCount.textContent =
        "0";


    meetingLink.classList.remove(
        "visible"
    );


    meetingLink.required =
        false;

}



/* =========================================================
   SAVE POSTS
========================================================= */

function savePosts() {

    /*
        Demo note:

        Images are stored as Base64 data URLs
        in localStorage.

        That's fine for a prototype.

        A real version should move images
        into cloud storage.
    */

    localStorage.setItem(
        STORAGE_KEYS.posts,
        JSON.stringify(posts)
    );

}



/* =========================================================
   PROFILE MODAL
========================================================= */

profileButton.addEventListener(
    "click",
    () => {

        profileModal.classList.add(
            "open"
        );

        document.body.style.overflow =
            "hidden";

    }
);


profileModalClose.addEventListener(
    "click",
    closeProfileModal
);


profileModal.addEventListener(
    "click",
    event => {

        if (
            event.target === profileModal
        ) {
            closeProfileModal();
        }

    }
);


function closeProfileModal() {

    profileModal.classList.remove(
        "open"
    );

    if (
        !modalOverlay.classList.contains("open") &&
        !postModal.classList.contains("open")
    ) {

        document.body.style.overflow =
            "";

    }

}



/* =========================================================
   SAVE PROFILE
========================================================= */

profileForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const newName =
            displayName.value.trim();


        let newUsername =
            username.value
                .trim()
                .toLowerCase();


        newUsername =
            newUsername
                .replace(
                    /^@/,
                    ""
                )
                .replace(
                    /[^a-z0-9_.]/g,
                    ""
                );


        if (
            !newName ||
            !newUsername
        ) {

            showToast(
                "Please fill in your profile"
            );

            return;

        }


        user = {

            displayName:
                newName,

            username:
                newUsername

        };


        saveUser();


        closeProfileModal();


        showToast(
            "Profile saved"
        );


        renderEverything();

    }
);



/* =========================================================
   TREE
========================================================= */

function renderTree() {

    const tree =
        document.getElementById(
            "largeTree"
        );


    tree
        .querySelectorAll(".large-node")
        .forEach(node => node.remove());


    const userPosts =
        posts.filter(
            post =>
                post.author.username ===
                user.username
        );


    /*
        The nodes are intentionally simple circles.

        No giant SVG monstrosity.
        Humanity has suffered enough.
    */

    const positions = [

        {
            left: "25%",
            top: "24%"
        },

        {
            right: "23%",
            top: "27%"
        },

        {
            left: "19%",
            bottom: "24%"
        },

        {
            right: "18%",
            bottom: "23%"
        },

        {
            left: "47%",
            top: "8%"
        },

        {
            left: "47%",
            bottom: "7%"
        }

    ];


    userPosts
        .slice(0, 6)
        .forEach(
            (post, index) => {

                const node =
                    document.createElement(
                        "button"
                    );


                node.className =
                    "large-node";


                Object.assign(
                    node.style,
                    positions[index]
                );


                node.title =
                    post.skillName;


                node.addEventListener(
                    "click",
                    () => openPost(post.id)
                );


                tree.appendChild(
                    node
                );

            }
        );

}



/* =========================================================
   STATS
========================================================= */

function updateStats() {

    skillCount.textContent =
        posts.length;


    const people =
        new Set(
            posts.map(
                post =>
                    post.author.username
            )
        );


    peopleCount.textContent =
        people.size;

}



/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const links =
        document.querySelectorAll(
            ".nav-links a"
        );


    links.forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    links.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    link.classList.add(
                        "active"
                    );

                }
            );

        }
    );



    document
        .getElementById("treeButton")
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById("tree")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

}



/* =========================================================
   CLOSE POST DETAIL
========================================================= */

postModalClose.addEventListener(
    "click",
    () => {

        postModal.classList.remove(
            "open"
        );

        document.body.style.overflow =
            "";

    }
);


postModal.addEventListener(
    "click",
    event => {

        if (
            event.target === postModal
        ) {

            postModal.classList.remove(
                "open"
            );

            document.body.style.overflow =
                "";

        }

    }
);



/* =========================================================
   CLOSE ALL MODALS
========================================================= */

function closeAllModals() {

    modalOverlay.classList.remove(
        "open"
    );

    profileModal.classList.remove(
        "open"
    );

    postModal.classList.remove(
        "open"
    );


    document.body.style.overflow =
        "";

}



/* =========================================================
   TOAST
========================================================= */

let toastTimeout;


function showToast(message) {

    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2600
        );

}



/* =========================================================
   TIME FORMAT
========================================================= */

function formatTime(timestamp) {

    const seconds =
        Math.floor(
            (Date.now() - timestamp) /
            1000
        );


    if (seconds < 60) {
        return "just now";
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


    return `${days}d ago`;

}



/* =========================================================
   HTML ESCAPING
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(value) {

    return escapeHTML(value);

}
