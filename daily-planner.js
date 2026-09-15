

console.log("🔥 DAILY-PLANNER.JS STARTED");

console.log("🟢 CHECK 1");


"use strict";

/* =========================================================
   WEEKLY PLANNER
   STEP 1 — RECURRING WEEKLY SCHEDULE
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const days = document.querySelectorAll(".day");

const programList =
    document.getElementById("programList");

const emptyState =
    document.getElementById("emptyState");

const selectedDay =
    document.getElementById("selectedDay");

const selectedDate =
    document.getElementById("selectedDate");

const programCount =
    document.getElementById("programCount");

const categoryList =
    document.querySelector(".category-list");


/* =========================================================
   DAY NAMES
========================================================= */

const DAY_NAMES = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه"
];


/* =========================================================
   CATEGORIES
========================================================= */

const CATEGORIES = {

    maz: {
        name: "برنامه ماز",
        icon: "brain"
    },

    school: {
        name: "مدرسه",
        icon: "school"
    },

    daily: {
        name: "کارهای روزمره",
        icon: "clipboard-check"
    },

    special: {
        name: "تخصصی / تمرین",
        icon: "flask-conical"
    },

    fun: {
        name: "تفریح و استراحت",
        icon: "gamepad-2"
    }

};


/* =========================================================
   MAZ TEACHERS
========================================================= */

const MAZ_TEACHERS = {

    shojaei: "استاد شجاعی",

    hadian: "استاد هادیان‌فرد",

    karami: "استاد معین‌کرمی",

    darbi_gos: "استاد داربی - گسسته",

    darbi_geometry: "استاد داربی - هندسه"

};


/* =========================================================
   WEEKLY DATA
========================================================= */
/* =========================================================
   WEEKLY DATA — LOCAL STORAGE
========================================================= */

const PLANNER_STORAGE_KEY = "weeklyPlannerData";

const EMPTY_PLANNER_DATA = {

    شنبه: {
        fixedPrograms: [],
        floatingPrograms: []
    },

    یکشنبه: {
        fixedPrograms: [],
        floatingPrograms: []
    },

    دوشنبه: {
        fixedPrograms: [],
        floatingPrograms: []
    },

    سه‌شنبه: {
        fixedPrograms: [],
        floatingPrograms: []
    },

    چهارشنبه: {
        fixedPrograms: [],
        floatingPrograms: []
    },

    پنجشنبه: {
        fixedPrograms: [],
        floatingPrograms: []
    },

    جمعه: {
        fixedPrograms: [],
        floatingPrograms: []
    }

};


function loadPlannerData() {

    try {

        const saved =
            localStorage.getItem(
                PLANNER_STORAGE_KEY
            );

        if (!saved) {

            return structuredClone(
                EMPTY_PLANNER_DATA
            );

        }


        const parsed =
            JSON.parse(saved);


        /*
         * اطمینان از وجود تمام روزها
         */
        DAY_NAMES.forEach(day => {

            if (!parsed[day]) {

                parsed[day] = {
                    fixedPrograms: [],
                    floatingPrograms: []
                };

            }


            if (!Array.isArray(parsed[day].fixedPrograms)) {

                parsed[day].fixedPrograms = [];

            }


            if (!Array.isArray(parsed[day].floatingPrograms)) {

                parsed[day].floatingPrograms = [];

            }

        });


        console.log(
            "📦 برنامه‌ها از LocalStorage بارگذاری شدند."
        );


        return parsed;

    } catch (error) {

        console.error(
            "❌ خطا در بارگذاری برنامه‌ها:",
            error
        );


        return structuredClone(
            EMPTY_PLANNER_DATA
        );

    }

}


const plannerData =
    loadPlannerData();


function savePlannerData() {

    try {

        localStorage.setItem(
            PLANNER_STORAGE_KEY,
            JSON.stringify(plannerData)
        );


        console.log(
            "💾 برنامه‌ها ذخیره شدند."
        );


    } catch (error) {

        console.error(
            "❌ خطا در ذخیره برنامه‌ها:",
            error
        );

    }

}
/* =========================================================
   CURRENT STATE
========================================================= */

let currentDay = "سه‌شنبه";

let currentFilter = "all";

let currentTeacher = null;

let mazOpen = false;


/* =========================================================
   GET DAY PROGRAMS
========================================================= */

function getDayPrograms(dayName) {

    const day =
        plannerData[dayName];

    if (!day) return [];


    return [

        ...(day.fixedPrograms || []),

        ...(day.floatingPrograms || [])

    ];

}


/* =========================================================
   TIME TO MINUTES
========================================================= */

function timeToMinutes(time) {

    if (!time) return 0;


    const parts =
        time.split(":");


    return (
        Number(parts[0]) * 60 +
        Number(parts[1])
    );

}


/* =========================================================
   SORT PROGRAMS
========================================================= */

function sortPrograms(programs) {

    return [...programs].sort((a, b) => {

        return (
            timeToMinutes(a.start) -
            timeToMinutes(b.start)
        );

    });

}


/* =========================================================
   LOAD DAY
========================================================= */

function loadDay(dayName) {

    if (!plannerData[dayName]) return;


    currentDay = dayName;

    currentFilter = "all";

    currentTeacher = null;

    mazOpen = false;


    /* HEADER */

    selectedDay.textContent =
        `برنامه ${dayName}`;


    const dayButton =
        [...days].find(
            item =>
                item.dataset.day === dayName
        );


    if (dayButton) {

        selectedDate.textContent =
            `${dayButton.dataset.date} ۱۴۰۴`;

    }


    /* PROGRAMS */

    const programs =
        sortPrograms(
            getDayPrograms(dayName)
        );


    renderPrograms(programs);

    renderCategories();

}


/* =========================================================
   RENDER PROGRAMS
========================================================= */
function renderPrograms(programs) {

    programList.innerHTML = "";

    /* =========================================
       EMPTY
    ========================================= */

    if (!programs.length) {

        programCount.textContent = "بدون برنامه";

        emptyState.classList.add("show");

        return;
    }

    emptyState.classList.remove("show");


    /* =========================================
       SORT
    ========================================= */

    const sortedPrograms =
        sortPrograms(programs);


    /* =========================================
       FRAGMENT
       برای کاهش reflow و سریع‌تر شدن رندر
    ========================================= */

    const fragment =
        document.createDocumentFragment();


    /* =========================================
       CREATE CARDS
    ========================================= */

    sortedPrograms.forEach(program => {

        const article =
            document.createElement("article");


        article.className =
            `program-card ${program.category}`;


        article.dataset.programId =
            program.id;


        article.dataset.category =
            program.category;


        if (program.teacher) {

            article.dataset.teacher =
                program.teacher;

        }


        const category =
            CATEGORIES[program.category];


        /* =====================================
           CARD
        ===================================== */

        article.innerHTML = `

            <div class="program-card-top">

                <div class="program-card-icon">

                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" class="w-12 h-12 text-neutral-30 mx-auto mb-3"><path d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M22 10H18C15 10 14 9 14 6V2L22 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7 13H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7 17H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>

                </div>


                <div class="program-card-info">

                    <h3 class="program-card-title">
                        ${program.title}
                    </h3>

                    <p class="program-card-subtitle">
                        ${program.subtitle || ""}
                    </p>

                </div>


                <div class="program-card-status">

                    ${
                        program.notification
                            ? `
                                <i
                                    data-lucide="bell"
                                    class="notification-icon">
                                </i>
                              `
                            : ""
                    }

                </div>

                <button
                    type="button"
                    class="delete-program-btn"
                    data-id="${program.id}"
                    title="حذف برنامه"
                >

                    <i data-lucide="trash-2"></i>

                </button>

            </div>


            <div class="program-card-bottom">

                <div class="program-card-time">

                    <i data-lucide="clock-3"></i>

                    <span>
                        ${program.start}
                    </span>

                    <span class="time-separator">
                        تا
                    </span>

                    <span>
                        ${program.end}
                    </span>

                </div>


                <div class="program-card-category">

                    <i data-lucide="${category?.icon || "calendar"}"></i>

                    <span>
                        ${category?.name || "برنامه"}
                    </span>

                </div>

            </div>

        `;


        fragment.appendChild(article);

    });


    /* =========================================
       APPEND ONCE
    ========================================= */

    programList.appendChild(fragment);


    /* =========================================
       COUNT
    ========================================= */

    programCount.textContent =
        `${sortedPrograms.length} برنامه`;


    /* =========================================
       LUCIDE
    ========================================= */

    if (
        window.lucide &&
        typeof lucide.createIcons === "function"
    ) {

        lucide.createIcons({
            root: programList
        });

    }

}
/* =========================================================
   RENDER CATEGORIES
========================================================= */

function renderCategories() {

    if (!categoryList) return;


    const programs =
        getDayPrograms(currentDay);


    const html = [];


    /* =====================================================
       ALL
    ===================================================== */

    const allActive =
        currentFilter === "all";


    html.push(`

        <button
            type="button"
            class="category-btn ${allActive ? "active" : ""}"
            data-filter="all"
        >

            <div class="category-icon">

                <i data-lucide="layers"></i>

            </div>


            <div class="category-info">

                <span class="category-name">
                    همه برنامه‌ها
                </span>

                <span class="category-count">
                    ${programs.length} برنامه
                </span>

            </div>


            <i
                class="category-arrow"
                data-lucide="chevron-left">
            </i>

        </button>

    `);


    /* =====================================================
       OTHER CATEGORIES
    ===================================================== */

    Object.entries(CATEGORIES)
        .forEach(([categoryKey, category]) => {

            const categoryPrograms =
                programs.filter(
                    program =>
                        program.category === categoryKey
                );


            const categoryActive =
                currentFilter === categoryKey &&
                currentTeacher === null;


            /* CATEGORY BUTTON */

            html.push(`

                <button
                    type="button"
                    class="category-btn ${categoryActive ? "active" : ""}"
                    data-filter="${categoryKey}"
                    ${categoryKey === "maz"
                        ? 'id="mazButton"'
                        : ""}
                >

                    <div class="category-icon">

                        <i data-lucide="${category.icon}"></i>

                    </div>


                    <div class="category-info">

                        <span class="category-name">
                            ${category.name}
                        </span>

                        <span class="category-count">
                            ${categoryPrograms.length} برنامه
                        </span>

                    </div>


                    <i
                        class="category-arrow ${categoryKey === "maz" && mazOpen ? "open" : ""}"
                        data-lucide="chevron-left">
                    </i>

                </button>

            `);


            /* =================================================
               MAZ TEACHERS
            ================================================= */

            if (categoryKey === "maz") {

                html.push(`

                    <div
                        class="maz-subcategories ${mazOpen ? "show" : ""}"
                        id="mazTeachers"
                    >

                        ${Object.entries(MAZ_TEACHERS)
                            .map(([teacherId, teacherName]) => {

                                const teacherCount =
                                    categoryPrograms.filter(
                                        program =>
                                            program.teacher === teacherId
                                    ).length;


                                const teacherActive =
                                    currentTeacher === teacherId;


                                return `

                                    <button
                                        type="button"
                                        class="teacher-btn ${teacherActive ? "active" : ""}"
                                        data-teacher="${teacherId}"
                                    >

                                        <span
                                            class="teacher-dot">
                                        </span>


                                        <span
                                            class="teacher-name">

                                            ${teacherName}

                                        </span>


                                        <span
                                            class="teacher-count">

                                            ${
                                                teacherCount > 0
                                                    ? `${teacherCount} کلاس`
                                                    : "کلاسی برای امروز وجود ندارد"
                                            }

                                        </span>

                                    </button>

                                `;

                            })
                            .join("")}

                    </div>

                `);

            }

        });


    categoryList.innerHTML =
        html.join("");


    if (
        window.lucide &&
        typeof lucide.createIcons === "function"
    ) {

        lucide.createIcons();

    }


    attachCategoryEvents();

}


/* =========================================================
   CATEGORY EVENTS
========================================================= */

function attachCategoryEvents() {

    const categoryButtons =
        categoryList.querySelectorAll(
            ".category-btn"
        );


    const teacherButtons =
        categoryList.querySelectorAll(
            ".teacher-btn"
        );


    const mazButton =
        categoryList.querySelector(
            "#mazButton"
        );


    const mazTeachers =
        categoryList.querySelector(
            "#mazTeachers"
        );


    /* =====================================================
       CATEGORY BUTTONS
    ===================================================== */

    categoryButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const filter =
                    button.dataset.filter;


                /* =========================================
                   MAZ
                ========================================= */

                if (filter === "maz") {

                    currentFilter = "maz";

                    currentTeacher = null;


                    /* TOGGLE */

                    mazOpen =
                        !mazOpen;


                    /* ACTIVE CATEGORY */

                    categoryButtons.forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                    teacherButtons.forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                    button.classList.add(
                        "active"
                    );


                    /* SHOW / HIDE TEACHERS */

                    if (mazTeachers) {

                        mazTeachers.classList.toggle(
                            "show",
                            mazOpen
                        );

                    }


                    /* FILTER MAZ */

                    const mazPrograms =
                        getDayPrograms(
                            currentDay
                        ).filter(
                            program =>
                                program.category === "maz"
                        );


                    renderPrograms(
                        sortPrograms(
                            mazPrograms
                        )
                    );


                    updateMazArrow();

                    return;

                }


                /* =========================================
                   OTHER CATEGORIES
                ========================================= */

                mazOpen = false;

                currentTeacher = null;

                currentFilter = filter;


                /* CLOSE MAZ */

                if (mazTeachers) {

                    mazTeachers.classList.remove(
                        "show"
                    );

                }


                /* ACTIVE */

                categoryButtons.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                teacherButtons.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                applyCurrentFilter();

                updateMazArrow();

            }
        );

    });


    /* =====================================================
       TEACHER BUTTONS
    ===================================================== */

    teacherButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const teacher =
                    button.dataset.teacher;


                currentFilter = "maz";

                currentTeacher = teacher;

                mazOpen = true;


                /* TEACHER ACTIVE */

                teacherButtons.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                /* KEEP MAZ OPEN */

                if (mazTeachers) {

                    mazTeachers.classList.add(
                        "show"
                    );

                }


                /* KEEP MAZ BUTTON ACTIVE */

                categoryButtons.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                if (mazButton) {

                    mazButton.classList.add(
                        "active"
                    );

                }


                filterTeacher(
                    teacher
                );


                updateMazArrow();

            }
        );

    });

}


/* =========================================================
   APPLY CURRENT FILTER
========================================================= */

function applyCurrentFilter() {

    const programs =
        getDayPrograms(currentDay);


    let filtered = [];


    /* ALL */

    if (currentFilter === "all") {

        filtered =
            programs;

    }


    /* CATEGORY */

    else {

        filtered =
            programs.filter(
                program =>
                    program.category === currentFilter
            );

    }


    renderPrograms(
        sortPrograms(filtered)
    );

}


/* =========================================================
   FILTER TEACHER
========================================================= */

function filterTeacher(teacher) {

    const programs =
        getDayPrograms(currentDay);


    const filtered =
        programs.filter(program => {

            return (
                program.category === "maz" &&
                program.teacher === teacher
            );

        });


    renderPrograms(
        sortPrograms(filtered)
    );

}


/* =========================================================
   UPDATE MAZ ARROW
========================================================= */

function updateMazArrow() {

    const arrow =
        categoryList.querySelector(
            "#mazButton .category-arrow"
        );


    if (!arrow) return;


    arrow.classList.toggle(
        "open",
        mazOpen
    );

}


/* =========================================================
   DAY CLICK
========================================================= */

days.forEach(day => {

    day.addEventListener(
        "click",
        () => {

            days.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            day.classList.add(
                "active"
            );


            loadDay(
                day.dataset.day
            );

        }
    );

});


/* =========================================================
   WEEK ARROWS
========================================================= */

const prevWeek =
    document.getElementById("prevWeek");


const nextWeek =
    document.getElementById("nextWeek");


if (prevWeek) {

    prevWeek.addEventListener(
        "click",
        () => {

            console.log(
                "هفته قبل — در مرحله بعد"
            );

        }
    );

}


if (nextWeek) {

    nextWeek.addEventListener(
        "click",
        () => {

            console.log(
                "هفته بعد — در مرحله بعد"
            );

        }
    );

}


/* =========================================================
   INITIAL LOAD
========================================================= */

loadDay("سه‌شنبه");


/* =========================================================
   ICONS
========================================================= */

if (
    window.lucide &&
    typeof lucide.createIcons === "function"
) {

    lucide.createIcons();

}

console.log("🔥 MODAL SYSTEM START");

document.addEventListener("click", function (event) {

    const addBox = event.target.closest("#addProgramBox");

    if (addBox) {

        console.log("✅ ADD BOX CLICKED");

        const modal = document.getElementById("programModal");

        if (!modal) {
            console.error("❌ programModal NOT FOUND");
            return;
        }

        console.log("✅ programModal FOUND");

        modal.classList.add("show");

        console.log("✅ MODAL SHOW CLASS ADDED");
    }

    // بستن با ×
    const closeButton = event.target.closest("#closeProgramModal");

    if (closeButton) {

        const modal = document.getElementById("programModal");

        if (modal) {
            modal.classList.remove("show");
            console.log("❌ MODAL CLOSED");
        }
    }

    // بستن با انصراف
    const cancelButton = event.target.closest("#cancelProgram");

    if (cancelButton) {

        const modal = document.getElementById("programModal");

        if (modal) {
            modal.classList.remove("show");
        }
    }

});






























/* =========================================================
   ADD PROGRAM SYSTEM
========================================================= */

(function () {

    "use strict";

    console.log("🚀 ADD PROGRAM SYSTEM READY");


    /* ---------------------------------------------------------
       ELEMENTS
    --------------------------------------------------------- */

    const modal =
        document.getElementById("programModal");

    const form =
        document.getElementById("programForm");

    const addBox =
        document.getElementById("addProgramBox");

    const closeButton =
        document.getElementById("closeProgramModal");

    const cancelButton =
        document.getElementById("cancelProgram");

    const titleInput =
        document.getElementById("programTitle");

    const startInput =
        document.getElementById("programStart");

    const endInput =
        document.getElementById("programEnd");

    const notificationInput =
        document.getElementById("programNotification");

    const teacherField =
        document.getElementById("teacherField");

    const teacherInput =
        document.getElementById("programTeacher");

    const modalContext =
        document.getElementById("modalContext");


    if (!modal || !form || !addBox) {

        console.error(
            "❌ Add Program System: عناصر اصلی پیدا نشدند."
        );

        return;
    }


    /* ---------------------------------------------------------
       دسته‌ای که کاربر از آنجا روی افزودن زده
    --------------------------------------------------------- */

    let addCategory = "all";


    /* ---------------------------------------------------------
       باز کردن مدال
    --------------------------------------------------------- */

    document.addEventListener("click", function (event) {

        const clickedAddBox =
            event.target.closest("#addProgramBox");

        if (!clickedAddBox) {
            return;
        }


        /*
         * دسته فعلی
         */
        addCategory =
            currentFilter || "all";


        /*
         * اگر روی «همه برنامه‌ها» هستیم،
         * فعلاً برنامه روزمره به عنوان پیش‌فرض استفاده می‌شود.
         */
        if (addCategory === "all") {

            addCategory = "daily";

        }


        /*
         * مشخص کردن عنوان مدال
         */
        const category =
            CATEGORIES[addCategory];


        if (modalContext) {

            modalContext.textContent =
                `${category?.name || "برنامه"} — ${currentDay}`;

        }


        /*
         * نمایش انتخاب استاد فقط برای ماز
         */
        if (teacherField) {

            if (addCategory === "maz") {

                teacherField.style.display = "block";

            } else {

                teacherField.style.display = "none";

            }

        }


        /*
         * باز کردن
         */
        modal.classList.add("show");


        /*
         * تمرکز روی عنوان
         */
        setTimeout(function () {

            if (titleInput) {
                titleInput.focus();
            }

        }, 100);

    });


    /* ---------------------------------------------------------
       بستن مدال
    --------------------------------------------------------- */

    function closeModal() {

        modal.classList.remove("show");

        form.reset();

        if (teacherField) {
            teacherField.style.display = "none";
        }

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeModal
        );

    }


    /*
     * کلیک روی فضای بیرونی مدال
     */
    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {

                closeModal();

            }

        }
    );


    /*
     * Escape
     */
    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains("show")
            ) {

                closeModal();

            }

        }
    );


    /* ---------------------------------------------------------
       ذخیره اطلاعات
    --------------------------------------------------------- */

    function savePlannerData() {

        try {

            localStorage.setItem(
                "weeklyPlannerData",
                JSON.stringify(plannerData)
            );

            console.log(
                "💾 برنامه‌ها ذخیره شدند."
            );

        } catch (error) {

            console.error(
                "❌ خطا در ذخیره برنامه‌ها:",
                error
            );

        }

    }


    /* ---------------------------------------------------------
       ساخت برنامه
    --------------------------------------------------------- */

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            console.log(
                "🟢 فرم افزودن برنامه ارسال شد."
            );


            const title =
                titleInput.value.trim();

            const start =
                startInput.value;

            const end =
                endInput.value;

            const notification =
                notificationInput.checked;


            /*
             * اعتبارسنجی
             */
            if (!title) {

                alert("لطفاً عنوان برنامه را وارد کنید.");

                titleInput.focus();

                return;

            }


            if (!start || !end) {

                alert("لطفاً ساعت شروع و پایان را وارد کنید.");

                return;

            }


            if (
                typeof timeToMinutes === "function" &&
                timeToMinutes(end) <= timeToMinutes(start)
            ) {

                alert(
                    "ساعت پایان باید بعد از ساعت شروع باشد."
                );

                return;

            }


            /*
             * اگر روز فعلی وجود نداشته باشد
             */
            if (!plannerData[currentDay]) {

                plannerData[currentDay] = {

                    fixedPrograms: [],
                    floatingPrograms: []

                };

            }


            /*
             * ساخت ID
             */
            const programId =
                `program_${Date.now()}_${Math.random()
                    .toString(36)
                    .slice(2, 7)}`;


            /*
             * اطلاعات پایه
             */
            const newProgram = {

                id: programId,

                category: addCategory,

                title: title,

                icon:
                    CATEGORIES[addCategory]?.icon ||
                    "calendar",

                start: start,

                end: end,

                notification: notification

            };


            /* -------------------------------------------------
               برنامه ماز
            ------------------------------------------------- */

            if (addCategory === "maz") {

                const teacher =
                    teacherInput.value;

                newProgram.teacher =
                    teacher;

                newProgram.subtitle =
                    MAZ_TEACHERS[teacher] ||
                    "برنامه ماز";

            }


            /* -------------------------------------------------
               تعیین Fixed / Floating
            ------------------------------------------------- */

            if (
                addCategory === "maz" ||
                addCategory === "school" ||
                addCategory === "special"
            ) {

                plannerData[currentDay]
                    .fixedPrograms
                    .push(newProgram);

            } else {

                plannerData[currentDay]
                    .floatingPrograms
                    .push(newProgram);

            }


            /*
             * ذخیره
             */
            savePlannerData();


            console.log(
                "✅ برنامه ساخته شد:",
                newProgram
            );


            /*
             * بستن مدال
             */
            closeModal();


            /*
             * نمایش دوباره برنامه‌ها
             */
            loadDay(currentDay);


            /*
             * اگر Lucide داریم
             */
            if (
                window.lucide &&
                typeof lucide.createIcons === "function"
            ) {

                lucide.createIcons();

            }

        }
    );

})();


























































/* =========================================================
   DELETE PROGRAM
========================================================= */

document.addEventListener(
    "click",
    function(event) {


        const deleteButton =
            event.target.closest(
                ".delete-program-btn"
            );


        if (!deleteButton) {
            return;
        }


        const programId =
            deleteButton.dataset.id;


        if (!programId) {
            return;
        }


        const confirmDelete =
            confirm(
                "آیا از حذف این برنامه مطمئن هستید؟"
            );


        if (!confirmDelete) {
            return;
        }


        let deleted = false;


        DAY_NAMES.forEach(day => {


            const dayData =
                plannerData[day];


            if (!dayData) {
                return;
            }



            const beforeFixed =
                dayData.fixedPrograms.length;


            dayData.fixedPrograms =
                dayData.fixedPrograms.filter(
                    program =>
                        program.id !== programId
                );



            if (
                dayData.fixedPrograms.length !== beforeFixed
            ) {

                deleted = true;

            }



            const beforeFloating =
                dayData.floatingPrograms.length;


            dayData.floatingPrograms =
                dayData.floatingPrograms.filter(
                    program =>
                        program.id !== programId
                );


            if (
                dayData.floatingPrograms.length !== beforeFloating
            ) {

                deleted = true;

            }


        });



        if (deleted) {


            savePlannerData();


            loadDay(
                currentDay
            );


            console.log(
                "🗑️ برنامه حذف شد:",
                programId
            );


        }


    }
);