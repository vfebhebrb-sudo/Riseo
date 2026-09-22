/* =========================================================
   RISEO / STUDYPRO
   BASE DASHBOARD JAVASCRIPT
   + UPLOADED FILES API
========================================================= */

"use strict";


/* =========================================================
   GLOBAL STATE
========================================================= */

let knownFiles = [];



/* =========================================================
   FILES API
========================================================= */

const FILES_API =
    CONFIG.API + CONFIG.ENDPOINTS.FILES;


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initTheme();

    initThemeButton();

    initNotifications();

    initSearch();

    initCategoryNavigation();

    initQuickAccess();

    initUserProfile();

    initUploadedFiles();

    refreshIcons();

});


/* =========================================================
   LUCIDE ICONS
========================================================= */

function refreshIcons() {

    if (typeof lucide !== "undefined") {

        lucide.createIcons();

    }

}


/* =========================================================
   THEME
========================================================= */

function initTheme() {

    const savedTheme =
        localStorage.getItem("riseo-theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark-theme");

    }

    else if (savedTheme === "light") {

        document.body.classList.remove("dark-theme");

    }

    else {

        const prefersDark =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;


        if (prefersDark) {

            document.body.classList.add(
                "dark-theme"
            );

        }

    }

}


/* =========================================================
   THEME BUTTON
========================================================= */

function initThemeButton() {

    const themeButtons =
        document.querySelectorAll(
            '.header-action[aria-label="تغییر حالت نمایش"]'
        );


    if (!themeButtons.length) return;


    themeButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark-theme"
                );


                const isDark =
                    document.body.classList.contains(
                        "dark-theme"
                    );


                localStorage.setItem(
                    "riseo-theme",
                    isDark
                        ? "dark"
                        : "light"
                );


                updateThemeIcon(
                    button,
                    isDark
                );

            }
        );


        updateThemeIcon(
            button,
            document.body.classList.contains(
                "dark-theme"
            )
        );

    });

}


/* =========================================================
   UPDATE THEME ICON
========================================================= */

function updateThemeIcon(
    button,
    isDark
) {

    if (!button) return;


    const svg =
        button.querySelector("svg");


    if (!svg) return;


    svg.style.transition =
        "transform .25s ease";


    svg.style.transform =
        isDark
            ? "rotate(25deg)"
            : "rotate(0deg)";

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function initNotifications() {

    const notificationButton =
        document.querySelector(
            '.header-action[aria-label="اعلان‌ها"]'
        );


    if (!notificationButton) return;


    notificationButton.addEventListener(
        "click",
        () => {

            notificationButton.classList.toggle(
                "notification-active"
            );


            const dot =
                notificationButton.querySelector(
                    ".notification-dot"
                );


            if (dot) {

                dot.style.display = "none";

            }

        }
    );

}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

function initSearch() {

    const searchInput =
        document.querySelector(
            '.header-search input[type="search"]'
        );


    if (!searchInput) return;


    searchInput.addEventListener(
        "input",
        debounce(
            () => {

                const query =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                performSearch(query);

            },
            180
        )
    );

}


/* =========================================================
   SEARCH ENGINE
========================================================= */

function performSearch(query) {

    const searchableItems = [

        ...document.querySelectorAll(
            ".quick-access-card"
        ),

        ...document.querySelectorAll(
            ".announcement-item"
        ),

        ...document.querySelectorAll(
            ".uploaded-file-item"
        ),

        ...document.querySelectorAll(
            ".lesson-item"
        )

    ];


    if (!query) {

        searchableItems.forEach(item => {

            item.style.display = "";

        });

        return;

    }


    searchableItems.forEach(item => {

        const text =
            item.textContent
                .toLowerCase()
                .trim();


        item.style.display =
            text.includes(query)
                ? ""
                : "none";

    });

}


/* =========================================================
   CATEGORY NAVIGATION
========================================================= */

function initCategoryNavigation() {

    const categoryItems =
        document.querySelectorAll(
            ".category-item"
        );


    if (!categoryItems.length) return;


    categoryItems.forEach(item => {

        item.addEventListener(
            "click",
            event => {

                event.preventDefault();


                categoryItems.forEach(
                    other => {

                        other.classList.remove(
                            "active"
                        );

                    }
                );


                item.classList.add(
                    "active"
                );


                const title =
                    item.querySelector(
                        "span:last-child"
                    );


                if (title) {

                    console.log(
                        "Selected section:",
                        title.textContent.trim()
                    );

                }

            }
        );

    });

}


/* =========================================================
   QUICK ACCESS
========================================================= */

function initQuickAccess() {

    const cards =
        document.querySelectorAll(
            ".quick-access-card"
        );


    if (!cards.length) return;


    cards.forEach(card => {

        const enterButton =
            card.querySelector(
                ".quick-access-enter"
            );


        if (!enterButton) return;


        enterButton.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const cardType =
                    getQuickAccessType(
                        card
                    );


                handleQuickAccess(
                    cardType
                );

            }
        );

    });

}


/* =========================================================
   QUICK ACCESS TYPE
========================================================= */

function getQuickAccessType(card) {

    if (
        card.classList.contains(
            "quick-exam"
        )
    ) {

        return "exam";

    }


    if (
        card.classList.contains(
            "quick-archive"
        )
    ) {

        return "archive";

    }


    if (
        card.classList.contains(
            "quick-maz"
        )
    ) {

        return "maz";

    }


    if (
        card.classList.contains(
            "quick-kanoon"
        )
    ) {

        return "kanoon";

    }


    return "unknown";

}


/* =========================================================
   QUICK ACCESS ACTION
========================================================= */

function handleQuickAccess(type) {

    switch (type) {

        case "exam":

            console.log(
                "Opening exams..."
            );

            break;


        case "archive":

            console.log(
                "Opening archive..."
            );

            break;


        case "maz":

            console.log(
                "Opening Maz..."
            );

            break;


        case "kanoon":

            console.log(
                "Opening Kanoon..."
            );

            break;


        default:

            console.log(
                "Unknown quick access item."
            );

    }

}


/* =========================================================
   USER PROFILE
========================================================= */

function initUserProfile() {

    const userName =
        document.querySelector(
            ".user-profile-heading h3"
        );


    if (!userName) return;


    const userData = {

        name: "",

        phone: "",

        chatId: "123456789",

        attendance: "",

        status: "فعال"

    };


    userName.textContent =
        userData.name;


    const status =
        document.querySelector(
            ".user-status"
        );


    if (status) {

        const statusText =
            status.childNodes[
                status.childNodes.length - 1
            ];


        if (statusText) {

            statusText.textContent =
                ` ${userData.status}`;

        }

    }

}


/* =========================================================
   FILES
   LESSON NAME NORMALIZER
========================================================= */

function normalizeLesson(lesson) {

    const map = {

        "حسابان ۲": "حسابان",

        "هندسه ۳": "هندسه",

        "گسسته": "گسسته",

        "فیزیک ۳": "فیزیک",

        "شیمی ۳": "شیمی",

        "فارسی ۳": "فارسی",

        "عربی ۳": "عربی",

        "دین و زندگی ۳": "دین و زندگی",

        "زبان انگلیسی ۳": "زبان انگلیسی",

        "سلامت و بهداشت": "سلامت و بهداشت",

        "هویت اجتماعی": "هویت اجتماعی",

        "سایر": "سایر"

    };


    return map[lesson] || lesson;

}


/* =========================================================
   INITIALIZE UPLOADED FILES
========================================================= */
/* =========================================================
   INITIALIZE UPLOADED FILES
========================================================= */

function initUploadedFiles() {

    const list =
        document.getElementById(
            "uploaded-files-list"
        );


    if (!list) return;


    /*
     * دکمه بروزرسانی
     */

    const refreshButton =
        document.getElementById(
            "uploaded-files-refresh"
        );


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            () => {

                loadAllFiles();

            }
        );

    }


    /*
     * جستجوی فایل
     */

    initFileSearch();


    /*
     * دریافت همه فایل‌ها
     * هنگام باز شدن صفحه
     */

    loadAllFiles();

}
/* =========================================================
   LOAD LESSON FILES
========================================================= */
/* =========================================================
   LOAD ALL FILES
   جدیدترین فایل‌ها اول
========================================================= */

async function loadAllFiles() {

    const list =
        document.getElementById(
            "uploaded-files-list"
        );

    if (!list) return;


    showFilesLoading();


    try {

        /*
         * دیگر lesson ارسال نمی‌شود.
         * API باید همه فایل‌های کاربر را برگرداند.
         */

        const response =
            await fetch(
                FILES_API,
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
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "ALL FILES API RESPONSE:",
            data
        );


        if (!data.success) {

            throw new Error(
                data.message ||
                "دریافت فایل‌ها ناموفق بود."
            );

        }


        knownFiles =
            Array.isArray(data.files)
                ? data.files
                : [];


        /*
         * جدیدترین فایل اول
         */

        knownFiles.sort(
            (a, b) => {

                const dateA =
                    new Date(
                        a.uploadedAt ||
                        a.createdAt ||
                        a.date ||
                        0
                    ).getTime();


                const dateB =
                    new Date(
                        b.uploadedAt ||
                        b.createdAt ||
                        b.date ||
                        0
                    ).getTime();


                return dateB - dateA;

            }
        );


        renderFiles(
            knownFiles
        );


    }

    catch (error) {

        console.error(
            "FILES ERROR:",
            error
        );


        showFilesError();

    }

}
/* =========================================================
   RENDER FILES
========================================================= */

function renderFiles(files) {

    const list =
        document.getElementById(
            "uploaded-files-list"
        );


    if (!list) return;


    if (
        !Array.isArray(files) ||
        files.length === 0
    ) {

        showFilesEmpty(
            "برای این درس هنوز فایلی آپلود نشده است."
        );

        return;

    }


    list.innerHTML =
        files
            .map(
                file =>
                    createFileItem(file)
            )
            .join("");


    refreshIcons();


    initFileSearch();

}


/* =========================================================
   CREATE FILE ITEM
========================================================= */

function createFileItem(file) {

    const name =
        file.name ||
        file.originalName ||
        file.filename ||
        "فایل بدون نام";


    const url =
        file.url ||
        file.fileUrl ||
        file.downloadUrl ||
        "#";


    const type =
        getFileType(
            file,
            name
        );


    const icon =
        getFileIcon(
            type
        );


    const size =
        formatFileSize(
            file.size
        );


    const date =
        formatFileDate(
            file.uploadedAt ||
            file.createdAt ||
            file.date
        );


    return `
        <div
            class="uploaded-file-item file-${type}"
            data-file-name="${escapeHtml(name)}"
        >

            <div class="uploaded-file-icon">

                <i data-lucide="${icon}"></i>

            </div>


            <div class="uploaded-file-info">

                <span class="uploaded-file-name">
                    ${escapeHtml(name)}
                </span>


                <div class="uploaded-file-meta">

                    ${
                        size
                            ? `<span>${size}</span>`
                            : ""
                    }

                    ${
                        date
                            ? `
                                <span>•</span>
                                <span>${date}</span>
                            `
                            : ""
                    }

                </div>

            </div>


            ${
                url !== "#"
                    ? `
                        <a
                            class="uploaded-file-download"
                            href="${escapeHtml(url)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            title="دانلود فایل"
                        >
                            <i data-lucide="download"></i>
                        </a>
                    `
                    : ""
            }

        </div>
    `;

}


/* =========================================================
   GET FILE TYPE
========================================================= */

function getFileType(
    file,
    name
) {

    const mimeType =
        String(
            file.type ||
            file.mimeType ||
            ""
        ).toLowerCase();


    const extension =
        String(name)
            .split(".")
            .pop()
            .toLowerCase();


    if (
        mimeType.includes("pdf") ||
        extension === "pdf"
    ) {

        return "pdf";

    }


    if (
        mimeType.includes("word") ||
        mimeType.includes("document") ||
        extension === "doc" ||
        extension === "docx"
    ) {

        return "doc";

    }


    if (
        mimeType.includes("image") ||
        [
            "png",
            "jpg",
            "jpeg",
            "webp",
            "gif"
        ].includes(extension)
    ) {

        return "image";

    }


    if (
        [
            "xls",
            "xlsx"
        ].includes(extension)
    ) {

        return "excel";

    }


    if (
        [
            "ppt",
            "pptx"
        ].includes(extension)
    ) {

        return "powerpoint";

    }


    return "other";

}


/* =========================================================
   FILE ICON
========================================================= */

function getFileIcon(type) {

    const icons = {

        pdf: "file-text",

        doc: "file-type-2",

        image: "image",

        excel: "table-2",

        powerpoint: "presentation",

        other: "file"

    };


    return icons[type] ||
        icons.other;

}


/* =========================================================
   FILE SIZE
========================================================= */

function formatFileSize(bytes) {

    if (
        bytes === undefined ||
        bytes === null ||
        bytes === ""
    ) {

        return "";

    }


    const size =
        Number(bytes);


    if (
        !Number.isFinite(size) ||
        size <= 0
    ) {

        return "";

    }


    if (size < 1024) {

        return `${size} B`;

    }


    if (
        size <
        1024 * 1024
    ) {

        return `${(
            size / 1024
        ).toFixed(1)} KB`;

    }


    if (
        size <
        1024 * 1024 * 1024
    ) {

        return `${(
            size /
            (1024 * 1024)
        ).toFixed(1)} MB`;

    }


    return `${(
        size /
        (1024 * 1024 * 1024)
    ).toFixed(1)} GB`;

}


/* =========================================================
   FILE DATE
========================================================= */

function formatFileDate(
    dateValue
) {

    if (!dateValue) return "";


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return new Intl.DateTimeFormat(
        "fa-IR",
        {
            year: "numeric",
            month: "numeric",
            day: "numeric"
        }
    ).format(date);

}


/* =========================================================
   FILE SEARCH
========================================================= */

function initFileSearch() {

    const input =
        document.getElementById(
            "uploaded-files-search"
        );


    if (
        !input ||
        input.dataset.initialized === "true"
    ) {

        return;

    }


    input.dataset.initialized =
        "true";


    input.addEventListener(
        "input",
        () => {

            const query =
                input.value
                    .trim()
                    .toLowerCase();


            const items =
                document.querySelectorAll(
                    ".uploaded-file-item"
                );


            items.forEach(item => {

                const name =
                    (
                        item.dataset.fileName ||
                        ""
                    ).toLowerCase();


                item.style.display =
                    !query ||
                    name.includes(query)
                        ? ""
                        : "none";

            });

        }
    );

}


/* =========================================================
   FILE LOADING STATE
========================================================= */

function showFilesLoading() {

    const list =
        document.getElementById(
            "uploaded-files-list"
        );


    if (!list) return;


    list.innerHTML = `

        <div class="uploaded-files-loading">

            <span
                class="uploaded-files-loading-spinner"
            ></span>

            <span>
                در حال دریافت فایل‌ها...
            </span>

        </div>

    `;

}


/* =========================================================
   FILE EMPTY STATE
========================================================= */

function showFilesEmpty(
    message
) {

    const list =
        document.getElementById(
            "uploaded-files-list"
        );


    if (!list) return;


    list.innerHTML = `

        <div class="uploaded-files-empty">

            <i data-lucide="folder-open"></i>

            <span>
                ${escapeHtml(message)}
            </span>

        </div>

    `;


    refreshIcons();

}


/* =========================================================
   FILE ERROR STATE
========================================================= */

function showFilesError() {

    const list =
        document.getElementById(
            "uploaded-files-list"
        );


    if (!list) return;


    list.innerHTML = `

        <div class="uploaded-files-error">

            <i data-lucide="triangle-alert"></i>

            <span>
                دریافت فایل‌ها با مشکل مواجه شد.
            </span>

        </div>

    `;


    refreshIcons();

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(value) {

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


/* =========================================================
   DEBOUNCE
========================================================= */

function debounce(
    callback,
    delay = 200
) {

    let timeout;


    return function (...args) {

        clearTimeout(
            timeout
        );


        timeout =
            setTimeout(
                () => {

                    callback.apply(
                        this,
                        args
                    );

                },
                delay
            );

    };

}


/* =========================================================
   GLOBAL APP API
========================================================= */

window.RiseoApp = {

    theme: {

        isDark() {

            return document.body
                .classList
                .contains(
                    "dark-theme"
                );

        },


        set(mode) {

            if (
                mode === "dark"
            ) {

                document.body
                    .classList
                    .add(
                        "dark-theme"
                    );


                localStorage.setItem(
                    "riseo-theme",
                    "dark"
                );

            }

            else {

                document.body
                    .classList
                    .remove(
                        "dark-theme"
                    );


                localStorage.setItem(
                    "riseo-theme",
                    "light"
                );

            }


            document
                .querySelectorAll(
                    '.header-action[aria-label="تغییر حالت نمایش"]'
                )
                .forEach(
                    button => {

                        updateThemeIcon(
                            button,
                            mode === "dark"
                        );

                    }
                );

        },


        toggle() {

            const isDark =
                document.body.classList.toggle(
                    "dark-theme"
                );


            localStorage.setItem(
                "riseo-theme",
                isDark
                    ? "dark"
                    : "light"
            );


            document
                .querySelectorAll(
                    '.header-action[aria-label="تغییر حالت نمایش"]'
                )
                .forEach(
                    button => {

                        updateThemeIcon(
                            button,
                            isDark
                        );

                    }
                );

        }

    },


    icons() {

        refreshIcons();

    },


    search(query) {

        performSearch(
            String(query || "")
                .trim()
                .toLowerCase()
        );

    },


    files: {

        load(lesson) {

            return loadLessonFiles(
                lesson
            );

        },


        getAll() {

            return knownFiles;

        },


        getCurrentLesson() {

            return currentLesson;

        }

    }

};











// ======================================================
// USER PROFILE
// دریافت اطلاعات کاربر از currentUser
// ======================================================

function loadUserProfile() {

    try {

        // ------------------------------------------
        // دریافت اطلاعات ذخیره شده کاربر
        // ------------------------------------------

        const savedUser =
            localStorage.getItem("currentUser");


        // ------------------------------------------
        // اگر کاربر وارد نشده
        // ------------------------------------------

        if (!savedUser) {

            console.warn(
                "CURRENT USER NOT FOUND"
            );

            return;

        }


        // ------------------------------------------
        // تبدیل JSON به Object
        // ------------------------------------------

        const user =
            JSON.parse(savedUser);


        console.log(
            "CURRENT USER:",
            user
        );


        // ------------------------------------------
        // نام
        // ------------------------------------------

        const nameElement =
            document.getElementById(
                "user-profile-name"
            );


        if (nameElement) {

            nameElement.textContent =
                user.fullname ||
                "کاربر";

        }


        // ------------------------------------------
        // شماره تلفن
        // ------------------------------------------

        const phoneElement =
            document.getElementById(
                "user-profile-phone"
            );


        if (phoneElement) {

            phoneElement.textContent =
                user.phone ||
                "ثبت نشده";

        }


        // ------------------------------------------
        // چت آیدی
        // ------------------------------------------

        const chatIdElement =
            document.getElementById(
                "user-profile-chat-id"
            );


        if (chatIdElement) {

            chatIdElement.textContent =
                user.chatId ||
                "ثبت نشده";

        }


        // ------------------------------------------
        // سابقه حضور
        // ------------------------------------------

        const studyDaysElement =
            document.getElementById(
                "user-profile-study-days"
            );


        if (studyDaysElement) {

            const days =
                Number(user.studyDays || 0);


            studyDaysElement.textContent =
                `${days.toLocaleString("fa-IR")} روز`;

        }


        // ------------------------------------------
        // وضعیت کاربر
        // ------------------------------------------

        const statusElement =
            document.getElementById(
                "user-profile-status"
            );


        const statusTextElement =
            document.getElementById(
                "user-profile-status-text"
            );


        if (statusTextElement) {

            if (user.isOnline === true) {

                statusTextElement.textContent =
                    "آنلاین";

            }

            else if (user.isActive !== false) {

                statusTextElement.textContent =
                    "فعال";

            }

            else {

                statusTextElement.textContent =
                    "غیرفعال";

            }

        }


        // ------------------------------------------
        // کلاس وضعیت
        // ------------------------------------------

        if (statusElement) {

            statusElement.classList.toggle(
                "is-online",
                user.isOnline === true
            );

            statusElement.classList.toggle(
                "is-inactive",
                user.isActive === false
            );

        }


        // ------------------------------------------
        // عکس پروفایل
        // ------------------------------------------

        const profileLogo =
            document.getElementById(
                "user-profile-logo"
            );


        if (
            profileLogo &&
            user.profileImage
        ) {

            profileLogo.innerHTML = `
                <img
                    src="${user.profileImage}"
                    alt="تصویر پروفایل"
                >`;

        }


    }

    catch (error) {

        console.error(
            "LOAD USER PROFILE ERROR:",
            error
        );

    }

}