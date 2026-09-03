// // ===============================
// // Mobile Menu
// // ===============================

// const menuBtn = document.querySelector(".menu-btn");
// const mobileMenu = document.getElementById("mobileMenu");

// if (menuBtn && mobileMenu) {
//     menuBtn.addEventListener("click", () => {
//         mobileMenu.classList.toggle("active");
//     });
// }

// // ===========================================================
// const toggle = document.getElementById("theme-toggle");
// const body = document.body;

// // اگر قبلاً حالت ذخیره شده باشد
// const savedTheme = localStorage.getItem("theme");

// // اگر چیزی ذخیره نشده باشد از تنظیمات سیستم استفاده کن
// if (savedTheme) {

//     if (savedTheme === "light") {
//         body.classList.add("light");
//         toggle.checked = true;
//     }

// } else {

//     if (window.matchMedia("(prefers-color-scheme: light)").matches) {
//         body.classList.add("light");
//         toggle.checked = true;
//     }

// }

// // تغییر حالت با کلیک

// toggle.addEventListener("change", () => {

//     if (toggle.checked) {

//         body.classList.add("light");
//         localStorage.setItem("theme", "light");

//     } else {

//         body.classList.remove("light");
//         localStorage.setItem("theme", "dark");

//     }

// });


// const groups = document.querySelectorAll(".path-skills");

// groups.forEach(group => {

//     const items = group.querySelectorAll(".skill-icon");

//     items.forEach((icon,index)=>{

//         icon.addEventListener("mouseenter",()=>{

//             items.forEach(item=>{

//                 item.classList.remove("wave","hovered");

//             });

//             icon.classList.add("hovered");

//             items.forEach((item,i)=>{

//                 const delay=Math.abs(i-index)*90;

//                 setTimeout(()=>{

//                     item.classList.add("wave");

//                 },delay);

//             });

//         });

//         icon.addEventListener("mouseleave",()=>{

//             icon.classList.remove("hovered");

//             items.forEach(item=>{

//                 item.classList.remove("wave");

//             });

//         });

//     });

// });
































/* =========================================
   سیستم برنامه کنکور
========================================= */


/* =========================================
   تبدیل تاریخ شمسی به میلادی
========================================= */

function jalaliToGregorian(jy, jm, jd) {

    const breaks = [
        -61, 9, 38, 199, 426, 686,
        756, 818, 1111, 1181, 1210,
        1635, 2060, 2097, 2192, 2262,
        2324, 2394, 2456, 3178
    ];

    let gy = jy + 621;

    let leapJ = -14;
    let jp = breaks[0];
    let jump = 0;

    for (let i = 1; i < breaks.length; i++) {

        const jm2 = breaks[i];

        jump = jm2 - jp;

        if (jy < jm2) {
            break;
        }

        leapJ +=
            Math.floor(jump / 33) * 8 +
            Math.floor((jump % 33) / 4);

        jp = jm2;
    }

    let n = jy - jp;

    leapJ +=
        Math.floor(n / 33) * 8 +
        Math.floor(((n % 33) + 3) / 4);

    if (
        jump % 33 === 4 &&
        jump - n === 4
    ) {
        leapJ++;
    }

    const leapG =
        Math.floor(gy / 4) -
        Math.floor((Math.floor(gy / 100) + 1) * 3 / 4) -
        150;

    const march =
        20 + leapJ - leapG;

    let gy2 = gy;

    let gd;

    if (jm <= 6) {

        gd =
            31 * (jm - 1) +
            jd;

    } else {

        gd =
            186 +
            30 * (jm - 7) +
            jd;

    }

    gd += march;

    let gm = 3;

    if (gd > 31) {
        gd -= 31;
        gm = 4;
    }

    if (gd > 30) {
        gd -= 30;
        gm = 5;
    }

    if (gd > 31) {
        gd -= 31;
        gm = 6;
    }

    return new Date(
        gy2,
        gm - 1,
        gd
    );
}


/* =========================================
   تاریخ های اصلی پروژه
========================================= */

// شروع برنامه
// ۲۱ مرداد ۱۴۰۵

const startDate =
    jalaliToGregorian(
        1405,
        5,
        21
    );


// تاریخ کنکور
// ۱ خرداد ۱۴۰۶

const examDate =
    jalaliToGregorian(
        1406,
        3,
        1
    );


/* =========================================
   حذف ساعت از تاریخ
========================================= */

function normalizeDate(date) {

    const result =
        new Date(date);

    result.setHours(
        0,
        0,
        0,
        0
    );

    return result;
}


/* =========================================
   تبدیل میلادی به شمسی
========================================= */

function getPersianDate(date) {

    const formatter =
        new Intl.DateTimeFormat(
            "fa-IR-u-ca-persian",
            {
                year: "numeric",
                month: "numeric",
                day: "numeric"
            }
        );


    const parts =
        formatter.formatToParts(date);


    let year;
    let month;
    let day;


    parts.forEach(function(part) {

        if (part.type === "year") {
            year =
                Number(
                    part.value.replace(
                        /[۰-۹]/g,
                        function(d) {
                            return "۰۱۲۳۴۵۶۷۸۹".indexOf(d);
                        }
                    )
                );
        }


        if (part.type === "month") {
            month =
                Number(
                    part.value.replace(
                        /[۰-۹]/g,
                        function(d) {
                            return "۰۱۲۳۴۵۶۷۸۹".indexOf(d);
                        }
                    )
                );
        }


        if (part.type === "day") {
            day =
                Number(
                    part.value.replace(
                        /[۰-۹]/g,
                        function(d) {
                            return "۰۱۲۳۴۵۶۷۸۹".indexOf(d);
                        }
                    )
                );
        }

    });


    return {
        year,
        month,
        day
    };
}


/* =========================================
   تبدیل عدد به فارسی
========================================= */

function toPersianNumber(number) {

    const english =
        "0123456789";

    const persian =
        "۰۱۲۳۴۵۶۷۸۹";

    return String(number).replace(
        /[0-9]/g,
        function(digit) {

            return persian[
                english.indexOf(digit)
            ];

        }
    );
}


/* =========================================
   اطلاعات کنکور
========================================= */

const daysRemainingElement =
    document.getElementById(
        "daysRemaining"
    );

const programMonthElement =
    document.getElementById(
        "programMonth"
    );

const programWeekElement =
    document.getElementById(
        "programWeek"
    );

const progressPercentElement =
    document.getElementById(
        "progressPercent"
    );

const progressFillElement =
    document.getElementById(
        "progressFill"
    );

    // =====================================================
// DELETE CONFIRM MODAL
// =====================================================

const deleteConfirmModal =
document.getElementById("deleteConfirmModal");


const cancelDeleteBtn =
document.getElementById("cancelDeleteBtn");


const confirmDeleteBtn =
document.getElementById("confirmDeleteBtn");


let deletingTaskId = null;
let deletingTaskCard = null;


/* =========================================
   محاسبه ماه برنامه
========================================= */

function getProgramMonth(today) {

    if (today < startDate) {
        return 0;
    }

    if (today >= examDate) {
        return 10;
    }


    let month = 1;

    let year = 1405;

    let jalaliMonth = 5;


    while (month < 10) {

        let nextMonth =
            jalaliMonth + 1;

        let nextYear =
            year;


        if (nextMonth > 12) {

            nextMonth = 1;
            nextYear++;

        }


        const nextMonthDate =
            normalizeDate(
                jalaliToGregorian(
                    nextYear,
                    nextMonth,
                    21
                )
            );


        if (
            today <
            nextMonthDate
        ) {

            break;

        }


        month++;

        jalaliMonth =
            nextMonth;

        year =
            nextYear;

    }


    return month;
}


/* =========================================
   اطلاعات کنکور
========================================= */

function updateExamInfo() {

    const today =
        normalizeDate(
            new Date()
        );


    const start =
        normalizeDate(
            startDate
        );


    const exam =
        normalizeDate(
            examDate
        );


    /* کل مدت برنامه */

    const totalDays =
        Math.ceil(
            (exam - start) /
            (1000 * 60 * 60 * 24)
        );


    /* روزهای سپری شده */

    let passedDays =
        Math.floor(
            (today - start) /
            (1000 * 60 * 60 * 24)
        );


    passedDays =
        Math.max(
            0,
            Math.min(
                totalDays,
                passedDays
            )
        );


    /* روزهای باقی مانده */

    let daysRemaining =
        Math.ceil(
            (exam - today) /
            (1000 * 60 * 60 * 24)
        );


    daysRemaining =
        Math.max(
            0,
            daysRemaining
        );


    /* هفته فعلی */

    let currentWeek =
        Math.floor(
            passedDays / 7
        ) + 1;


    const totalWeeks =
        Math.ceil(
            totalDays / 7
        );


    currentWeek =
        Math.min(
            currentWeek,
            totalWeeks
        );


    /* ماه فعلی */

    const currentMonth =
        getProgramMonth(
            today
        );


    /* درصد پیشرفت */

    let progress =
        (
            passedDays /
            totalDays
        ) * 100;


    progress =
        Math.max(
            0,
            Math.min(
                100,
                progress
            )
        );


    const progressNumber =
        Math.round(
            progress
        );


    /* نمایش */

    if (daysRemainingElement) {

        daysRemainingElement.textContent =
            toPersianNumber(
                daysRemaining
            );

    }


    if (programMonthElement) {

        programMonthElement.textContent =
            `ماه ${toPersianNumber(currentMonth)}`;

    }


    if (programWeekElement) {

        programWeekElement.textContent =
            `هفته ${toPersianNumber(currentWeek)}`;

    }


    if (progressPercentElement) {

        progressPercentElement.textContent =
            `${toPersianNumber(progressNumber)}%`;

    }


    if (progressFillElement) {

        progressFillElement.style.width =
            `${progressNumber}%`;

    }

}


/* =========================================
   WEEKLY PLANNER
========================================= */


const weekDayNames = [

    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه"

];


const jalaliMonthNames = [

    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند"

];


/* =========================================
   پیدا کردن شنبه هفته جاری
========================================= */

function getSaturdayOfCurrentWeek(date) {

    const saturday =
        new Date(date);


    saturday.setHours(
        0,
        0,
        0,
        0
    );


    const day =
        saturday.getDay();


    const distance =
        (day + 1) % 7;


    saturday.setDate(
        saturday.getDate()
        - distance
    );


    return saturday;
}


/* =========================================
   ساخت تقویم هفتگی
========================================= */

function updateWeeklyPlanner() {

    const today =
        normalizeDate(
            new Date()
        );


    const saturday =
        getSaturdayOfCurrentWeek(
            today
        );


    const dayColumns =
        document.querySelectorAll(
            ".day-column"
        );


    dayColumns.forEach(
        function(column, index) {


            /* تاریخ این روز */

            const currentDate =
                new Date(
                    saturday
                );


            currentDate.setDate(
                saturday.getDate()
                + index
            );


            /* تاریخ شمسی */

            const persianDate =
                getPersianDate(
                    currentDate
                );


            /* نام روز */

            const titleElement =
                column.querySelector(
                    "h3"
                );


            if (titleElement) {

                titleElement.textContent =
                    weekDayNames[index];

            }


            /* تاریخ */

            const dateElement =
                column.querySelector(
                    ".day-date"
                );


            if (dateElement) {

                dateElement.textContent =
                    `${toPersianNumber(persianDate.day)} ${jalaliMonthNames[persianDate.month - 1]}`;

            }


            /* امروز */

            if (
                currentDate.getTime()
                === today.getTime()
            ) {

                column.classList.add(
                    "today"
                );

            } else {

                column.classList.remove(
                    "today"
                );

            }

        }
    );

}


/* =========================================
   اجرای سیستم
========================================= */

updateExamInfo();

updateWeeklyPlanner();







document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
// CURRENT USER
// =====================================================

const currentUser =
JSON.parse(
    localStorage.getItem("currentUser")
);


const userPhone =
currentUser?.phone || null;


if(!userPhone){

    console.error(
        "شماره کاربر پیدا نشد"
    );

}
    const openModalBtn = document.getElementById("openModalBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const taskModal = document.getElementById("taskModal");

    if (!openModalBtn || !closeModalBtn || !taskModal) {
        console.error("Modal elements پیدا نشدند!");
        return;
    }

    // باز کردن
    openModalBtn.addEventListener("click", () => {
        taskModal.classList.add("active");
    });

    // بستن با ضربدر
    closeModalBtn.addEventListener("click", () => {
        taskModal.classList.remove("active");
    });

    // بستن با کلیک بیرون پنجره
    taskModal.addEventListener("click", (e) => {
        if (e.target === taskModal) {
            taskModal.classList.remove("active");
        }
    });

});










/* =========================================================
   WEEKLY PLANNER / TASK SYSTEM
   ADD + EDIT + FLOATING NOTE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MAIN ELEMENTS
    ===================================================== */

    const openModalBtn = document.getElementById("openModalBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const taskModal = document.getElementById("taskModal");

    const addCardBtn = document.getElementById("addCardBtn");

    const taskDay = document.getElementById("taskDay");
    const taskDuration = document.getElementById("taskDuration");
    const taskTopic = document.getElementById("taskTopic");
    const taskNote = document.getElementById("taskNote");

    const subjectCards =
        document.querySelectorAll(".subject-card");


    /* =====================================================
       EDIT MODAL
    ===================================================== */

    const editTaskModal =
        document.getElementById("editTaskModal");

    const closeEditModalBtn =
        document.getElementById("closeEditModalBtn");

    const saveTaskChangesBtn =
        document.getElementById("saveTaskChangesBtn");

    const editTaskSubject =
        document.getElementById("editTaskSubject");

    const editTaskDay =
        document.getElementById("editTaskDay");

    const editTaskDuration =
        document.getElementById("editTaskDuration");

    const editTaskTopic =
        document.getElementById("editTaskTopic");

    const editTaskNote =
        document.getElementById("editTaskNote");

        const deleteTaskBtn =
document.getElementById("deleteTaskBtn");

    /* کارت در حال ویرایش */

   window.editingTaskCard = null;


    /* =====================================================
       FLOATING NOTE
    ===================================================== */

    const floatingNote =
        document.getElementById("floatingNote");

    const floatingNoteHeader =
        document.getElementById("floatingNoteHeader");

    const floatingNoteClose =
        document.getElementById("closeFloatingNote");

    const floatingNoteSubject =
        document.getElementById("floatingNoteSubject");

    const floatingNoteContent =
        document.getElementById("floatingNoteContent");


    let currentNoteCard = null;


    /* =====================================================
       CHECK MAIN MODAL
    ===================================================== */

    if (!openModalBtn || !closeModalBtn || !taskModal) {

        console.error(
            "Modal اصلی پیدا نشد."
        );

    }


    /* =====================================================
       LUCIDE
    ===================================================== */

    function refreshIcons() {

        if (typeof lucide !== "undefined") {

            lucide.createIcons();

        }

    }


    /* =====================================================
       OPEN ADD MODAL
    ===================================================== */

    if (openModalBtn && taskModal) {

        openModalBtn.addEventListener("click", () => {

            taskModal.classList.add("active");

            refreshIcons();

        });

    }


    /* =====================================================
       CLOSE ADD MODAL
    ===================================================== */

    if (closeModalBtn && taskModal) {

        closeModalBtn.addEventListener("click", () => {

            taskModal.classList.remove("active");

        });

    }


    /* =====================================================
       CLOSE ADD MODAL BY OVERLAY
    ===================================================== */

    if (taskModal) {

        taskModal.addEventListener("click", (event) => {

            if (event.target === taskModal) {

                taskModal.classList.remove("active");

            }

        });

    }


    /* =====================================================
       SELECT SUBJECT
    ===================================================== */

    subjectCards.forEach((card) => {

        card.addEventListener("click", () => {

            subjectCards.forEach((item) => {

                item.classList.remove("active");

            });

            card.classList.add("active");

        });

    });


    /* =====================================================
       GET SELECTED SUBJECT
    ===================================================== */

    function getSelectedSubject() {

        const activeSubject =
            document.querySelector(".subject-card.active");


        if (!activeSubject) {
            return null;
        }


        const iconElement =
            activeSubject.querySelector("i");


        const color =
            getComputedStyle(activeSubject)
            .getPropertyValue("--subject-color")
            .trim();


        return {

            type:
                activeSubject.dataset.subject,


            name:
                activeSubject
                .querySelector("span")
                .textContent
                .trim(),


            icon:
                activeSubject.dataset.icon
                ||
                (
                    iconElement
                    ? iconElement.getAttribute("data-lucide")
                    : "book-open"
                ),


            color:
                color || "#6366f1"

        };

    }

    /* =====================================================
       RESET ADD FORM
    ===================================================== */

    function resetModalForm() {

        if (taskDuration) {

            taskDuration.value = "";

        }

        if (taskTopic) {
            taskTopic.value = "";

        }

        if (taskNote) {

            taskNote.value = "";

        }

    }


    /* =====================================================
       CREATE TASK CARD
    ===================================================== */

    // ======================================================
// SAVE PLAN TO DATABASE
// ======================================================

// ======================================================
// SAVE PLAN TO SERVER
// ======================================================
// ======================================================
// SAVE PLAN TO SERVER
// ======================================================

async function savePlanToServer(plan){


    try{


        console.log(
            "PLAN BEFORE SEND:",
            plan
        );



        const response = await fetch(

            `${API_URL}/plans`,

            {

                method:"POST",


                headers:{

                    "Content-Type":"application/json"

                },


                body:JSON.stringify(plan)

            }

        );





        const resultText =
        await response.text();





        console.log(
            "SERVER RESPONSE:",
            resultText
        );





        let data;



        try{


            data =
            JSON.parse(resultText);


        }
        catch(error){


            console.log(
                "INVALID JSON RESPONSE:",
                error
            );


            showToast(
                "پاسخ سرور نامعتبر است"
            );


            return null;


        }







        console.log(

            "PLAN SAVE RESPONSE:",

            data

        );







        if(!response.ok){


            showToast(

                data.message ||

                "خطا در ذخیره برنامه"

            );


            return null;


        }







        return data.plan;





    }

    catch(error){



        console.log(

            "SAVE PLAN ERROR:",

            error

        );



        showToast(

            "اتصال به سرور برقرار نیست"

        );



        return null;


    }


}

// ======================================================
// CURRENT USER PHONE
// ======================================================

const currentUser =
JSON.parse(
    localStorage.getItem("currentUser")
);


const userPhone =
currentUser?.phone || null;





// ======================================================
// CREATE TASK CARD
// ======================================================

// ======================================================
// CREATE TASK CARD
// ======================================================

async function createTaskCard(){


    const subject =
    getSelectedSubject();



    if(!subject){

        showToast(
            "لطفاً یک درس انتخاب کنید"
        );

        return;

    }



    const day =
    taskDay?.value || "";



    const duration =
    taskDuration?.value.trim() || "";



    const topic =
    taskTopic?.value.trim() || "";



    const note =
    taskNote?.value.trim() || "";




    // ================= VALIDATION =================


    if(!day){

        showToast(
            "لطفاً روز هفته را انتخاب کنید"
        );

        return;

    }



    if(!duration){

        showToast(
            "لطفاً ساعت مطالعه را وارد کنید"
        );

        taskDuration?.focus();

        return;

    }



    if(!topic){

        showToast(
            "لطفاً مبحث را وارد کنید"
        );

        taskTopic?.focus();

        return;

    }




    const dayTasks =
    document.querySelector(
        `.day-tasks[data-tasks="${day}"]`
    );



    if(!dayTasks){

        console.error(
            "Day container not found:",
            day
        );

        return;

    }





    // ================= SAVE TO DATABASE =================


    const savedPlan =
    await savePlanToServer({

        phone:userPhone,

        day:day,

        subject:subject.type,

        subjectName:subject.name,

        icon:subject.icon,

        color:subject.color,

        title:topic,

        note:note,

        duration:Number(duration)

    });





    if(!savedPlan){

        showToast(
            "برنامه ذخیره نشد"
        );

        return;

    }





    console.log(
        "SAVED PLAN:",
        savedPlan
    );


// ======================================================
// SMART ASSISTANT — PLAN CREATED
// ======================================================

if(typeof window.assistantEvent === "function"){

    window.assistantEvent(
        "PLAN_CREATED",
        {
            planId:
                savedPlan._id,

            subject:
                savedPlan.subject,

            subjectName:
                savedPlan.subjectName,

            title:
                savedPlan.title,

            duration:
                savedPlan.duration,

            day:
                savedPlan.day,

            note:
                savedPlan.note || ""
        }
    );

}


    // ================= CREATE CARD =================


    const card =
    document.createElement("div");



    card.className =
    `task-card ${subject.type}-card`;



    // مهم برای حذف و ویرایش
    card.dataset.id =
    savedPlan._id;



    card.dataset.subject =
    savedPlan.subject;



    card.dataset.subjectName =
    savedPlan.subjectName;



    card.dataset.icon =
    savedPlan.icon;



    card.dataset.color =
    savedPlan.color;



    card.dataset.day =
    savedPlan.day;



    card.dataset.duration =
    savedPlan.duration;



    card.dataset.topic =
    savedPlan.title;



    card.dataset.note =
    savedPlan.note || "";





    card.innerHTML = `


        <div class="task-content">


            <div class="task-main">


                <div class="task-name">


                    <i data-lucide="${savedPlan.icon}"></i>


                    <span>
                        ${savedPlan.subjectName}
                    </span>


                </div>


            </div>




            <div class="task-topic">

                ${savedPlan.title}

            </div>




            <div class="task-time">

                ${savedPlan.duration} مطالعه

            </div>



        </div>





        <div class="task-actions">


            <button
                type="button"
                class="task-action edit-task"
                title="ویرایش"
            >

                <i data-lucide="pen-line"></i>

            </button>





            <button
                type="button"
                class="task-action note-task"
                title="یادداشت‌ها"
            >

                <i data-lucide="notebook-pen"></i>

            </button>



        </div>


    `;





    // ================= ADD TO PAGE =================


    dayTasks.appendChild(card);





    refreshLessonsSection();



    if(typeof refreshIcons === "function"){

        refreshIcons();

    }
    else if(typeof lucide !== "undefined"){

        lucide.createIcons();

    }





    if(taskModal){

        taskModal.classList.remove(
            "active"
        );

    }



    resetModalForm();



}
    /* =====================================
   CUSTOM TOAST MESSAGE
===================================== */

function showToast(message, type = "error") {


    const toast = document.createElement("div");


    toast.className = 
        `custom-toast-new ${type}`;


    toast.innerHTML = `

        <i data-lucide="triangle-alert"></i>

        <span>
            ${message}
        </span>

    `;


    document.body.appendChild(toast);



    refreshIcons();



    setTimeout(() => {

        toast.classList.add("hide-toast");


        setTimeout(() => {

            toast.remove();

        }, 400);


    }, 3000);


}

    /* =====================================================
       ADD CARD BUTTON
    ===================================================== */

    if (addCardBtn) {

        addCardBtn.addEventListener(
            "click",
            createTaskCard
        );

    }


    /* =====================================================
       SUBJECT SLIDER
    ===================================================== */

    const subjectSlider =
        document.querySelector(".subject-slider");

    const subjectPrev =
        document.querySelector(".subject-prev");

    const subjectNext =
        document.querySelector(".subject-next");


    if (subjectSlider && subjectPrev) {

        subjectPrev.addEventListener("click", () => {

            subjectSlider.scrollBy({

                left: -160,

                behavior: "smooth"

            });

        });

    }


    if (subjectSlider && subjectNext) {

        subjectNext.addEventListener("click", () => {

            subjectSlider.scrollBy({

                left: 160,

                behavior: "smooth"

            });

        });

    }


    /* =====================================================
       TASK ACTIONS
       EDIT + NOTE
    ===================================================== */

    document.addEventListener("click", (event) => {


        /* =================================================
           EDIT
        ================================================= */

        const editButton =
            event.target.closest(".edit-task");


        if (editButton) {

            const card =
                editButton.closest(".task-card");


            if (!card) {

                return;

            }


            openEditTask(card);

            return;

        }


        /* =================================================
           NOTE
        ================================================= */

        const noteButton =
            event.target.closest(".note-task");


        if (noteButton) {

            const card =
                noteButton.closest(".task-card");


            if (!card) {

                return;

            }


            openFloatingNote(card);

        }

    });


    /* =====================================================
       OPEN EDIT MODAL
    ===================================================== */

    function openEditTask(card) {

        if (!editTaskModal) {

            console.error(
                "editTaskModal پیدا نشد."
            );

            return;

        }


        editingTaskCard =
            card;


        if (editTaskSubject) {

            editTaskSubject.value =
                card.dataset.subject || "math";

        }


        if (editTaskDay) {

            editTaskDay.value =
                card.dataset.day || "saturday";

        }


        if (editTaskDuration) {

            editTaskDuration.value =
                card.dataset.duration || "";

        }


        if (editTaskTopic) {

            editTaskTopic.value =
                card.dataset.topic || "";

        }


        if (editTaskNote) {

            editTaskNote.value =
                card.dataset.note || "";

        }


        editTaskModal.classList.add("active");


        refreshIcons();

    }


    /* =====================================================
       CLOSE EDIT MODAL
    ===================================================== */

    if (closeEditModalBtn && editTaskModal) {

        closeEditModalBtn.addEventListener(
            "click",
            () => {

                editTaskModal.classList.remove(
                    "active"
                );

                editingTaskCard = null;

            }
        );

    }


    /* =====================================================
       CLOSE EDIT MODAL BY OVERLAY
    ===================================================== */

    if (editTaskModal) {

        editTaskModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    editTaskModal
                ) {

                    editTaskModal.classList.remove(
                        "active"
                    );

                    editingTaskCard = null;

                }

            }
        );

    }


/* =====================================================
   SAVE EDITED TASK
===================================================== */

if (saveTaskChangesBtn) {


    saveTaskChangesBtn.addEventListener(
        "click",
        async () => {



            if(!editingTaskCard){

                return;

            }



            const id =
            editingTaskCard.dataset.id;



            if(!id){

                showToast(
                    "شناسه برنامه پیدا نشد"
                );

                return;

            }



            const newSubject =
                editTaskSubject
                ? editTaskSubject.value
                : editingTaskCard.dataset.subject;



            const newDay =
                editTaskDay
                ? editTaskDay.value
                : editingTaskCard.dataset.day;



            const newDuration =
                editTaskDuration
                ? editTaskDuration.value.trim()
                : "";



            const newTopic =
                editTaskTopic
                ? editTaskTopic.value.trim()
                : "";



            const newNote =
                editTaskNote
                ? editTaskNote.value.trim()
                : "";





            /* ---------------- VALIDATION ---------------- */


            if(!newDuration){

                showToast(
                    "لطفاً ساعت مطالعه را وارد کنید"
                );

                return;

            }



            if(!newTopic){

                showToast(
                    "لطفاً مبحث را وارد کنید"
                );

                return;

            }





            const subjectCard =
            document.querySelector(
                `.subject-card[data-subject="${newSubject}"]`
            );



            if(!subjectCard){

                showToast(
                    "درس پیدا نشد"
                );

                return;

            }





            const subjectName =
            subjectCard
            .querySelector("span")
            .textContent
            .trim();



            const iconElement =
            subjectCard.querySelector("i");



            const subjectIcon =
            iconElement
            ? iconElement.getAttribute(
                "data-lucide"
            )
            : "book-open";



            const subjectColor =
            subjectCard.dataset.color ||
            getComputedStyle(subjectCard)
            .getPropertyValue("--subject-color")
            .trim() ||
            "#6366f1";






            /* =================================================
               SAVE TO DATABASE
            ================================================= */


            try{


                const response =
                await fetch(

                    `${API_URL}/plans/${id}`,

                    {

                        method:"PUT",

                        headers:{

                            "Content-Type":
                            "application/json"

                        },


                        body:JSON.stringify({

                            day:newDay,

                            subject:newSubject,

                            subjectName:subjectName,

                            icon:subjectIcon,

                            color:subjectColor,

                            title:newTopic,

                            note:newNote,

                            duration:Number(newDuration)

                        })

                    }

                );





                const data =
                await response.json();




                console.log(
                    "UPDATE RESPONSE:",
                    data
                );




                if(!response.ok){

                    throw new Error(

                        data.message ||
                        "ویرایش ذخیره نشد"

                    );

                }




            }

            catch(error){


                console.log(
                    "UPDATE ERROR:",
                    error
                );


                showToast(
                    error.message
                );


                return;


            }





            /* =================================================
               UPDATE CARD AFTER DATABASE SUCCESS
            ================================================= */


            editingTaskCard.dataset.subject =
            newSubject;



            editingTaskCard.dataset.subjectName =
            subjectName;



            editingTaskCard.dataset.icon =
            subjectIcon;



            editingTaskCard.dataset.color =
            subjectColor;



            editingTaskCard.dataset.day =
            newDay;



            editingTaskCard.dataset.duration =
            newDuration;



            editingTaskCard.dataset.topic =
            newTopic;



            editingTaskCard.dataset.note =
            newNote;





            editingTaskCard.className =
            `task-card ${newSubject}-card`;






            const taskContent =
            editingTaskCard.querySelector(
                ".task-content"
            );



            if(taskContent){


                taskContent.innerHTML = `


                    <div class="task-main">

                        <div class="task-name">


                            <i data-lucide="${subjectIcon}"></i>


                            <span>
                                ${subjectName}
                            </span>


                        </div>


                    </div>



                    <div class="task-topic">

                        ${newTopic}

                    </div>



                    <div class="task-time">

                        ${newDuration} مطالعه

                    </div>


                `;


            }






            /* ---------------- MOVE DAY ---------------- */


            const newDayContainer =
            document.querySelector(

                `.day-tasks[data-tasks="${newDay}"]`

            );



            if(newDayContainer){

                newDayContainer.appendChild(
                    editingTaskCard
                );

            }






            refreshLessonsSection();






            editTaskModal
            ?.classList.remove(
                "active"
            );



            editingTaskCard = null;





            if(typeof lucide !== "undefined"){

                lucide.createIcons();

            }





            showToast(
                "برنامه بروزرسانی شد ✓",
                "success"
            );



        }

    );


}

// =====================================================
// DELETE TASK
// =====================================================
// =====================================================
// DELETE TASK
// =====================================================


if(deleteTaskBtn){


    deleteTaskBtn.addEventListener(
    "click",
    ()=>{


        if(!editingTaskCard){

            return;

        }


        // باز کردن پنجره تایید حذف

        deleteConfirmModal.classList.add(
            "active"
        );


    });


}




    /* =====================================================
       OPEN FLOATING NOTE
    ===================================================== */

    function openFloatingNote(card) {

        if (
            !floatingNote ||
            !floatingNoteSubject ||
            !floatingNoteContent
        ) {

            console.error(
                "پنجره یادداشت یا عناصر آن پیدا نشدند."
            );

            return;

        }


        currentNoteCard =
            card;


        const subjectName =
            card.dataset.subjectName ||
            "برنامه";


        const note =
            card.dataset.note ||
            "";


        floatingNoteSubject.textContent =
            subjectName;


        if (note.trim()) {

            floatingNoteContent.textContent =
                note;

        } else {

            floatingNoteContent.textContent =
                "برای این برنامه یادداشتی ثبت نشده است.";

        }


        /* ---------------- SHOW ---------------- */

        floatingNote.style.display =
            "block";


        /*
           اگر قبلاً با left/right
           جای پنجره خراب شده بود
        */

        if (
            !floatingNote.style.left &&
            !floatingNote.style.top
        ) {

            const width =
                floatingNote.offsetWidth || 320;

            const height =
                floatingNote.offsetHeight || 200;


            floatingNote.style.left =
                `${Math.max(
                    20,
                    (window.innerWidth - width) / 2
                )}px`;


            floatingNote.style.top =
                `${Math.max(
                    20,
                    (window.innerHeight - height) / 2
                )}px`;

        }


        floatingNote.style.right =
            "auto";


        floatingNote.style.bottom =
            "auto";


        refreshIcons();

    }


    /* =====================================================
       CLOSE FLOATING NOTE
    ===================================================== */

    if (floatingNoteClose && floatingNote) {

        floatingNoteClose.addEventListener(
            "click",
            () => {

                floatingNote.style.display =
                    "none";

                currentNoteCard =
                    null;

            }
        );

    }


    /* =====================================================
       FLOATING NOTE DRAG
    ===================================================== */

    let isDraggingNote =
        false;

    let noteOffsetX =
        0;

    let noteOffsetY =
        0;


    if (
        floatingNote &&
        floatingNoteHeader
    ) {

        floatingNoteHeader.addEventListener(
            "mousedown",
            (event) => {


                /*
                   اگر روی دکمه بستن کلیک شد
                   Drag شروع نشود
                */

                if (
                    event.target.closest(
                        "#closeFloatingNote"
                    )
                ) {

                    return;

                }


                isDraggingNote =
                    true;


                const rect =
                    floatingNote.getBoundingClientRect();


                noteOffsetX =
                    event.clientX -
                    rect.left;


                noteOffsetY =
                    event.clientY -
                    rect.top;


                floatingNoteHeader.style.cursor =
                    "grabbing";


                event.preventDefault();

            }
        );

    }


    /* =====================================================
       MOVE FLOATING NOTE
    ===================================================== */

    document.addEventListener(
        "mousemove",
        (event) => {


            if (
                !isDraggingNote ||
                !floatingNote
            ) {

                return;

            }


            let left =
                event.clientX -
                noteOffsetX;


            let top =
                event.clientY -
                noteOffsetY;


            const maxLeft =
                Math.max(
                    0,
                    window.innerWidth -
                    floatingNote.offsetWidth
                );


            const maxTop =
                Math.max(
                    0,
                    window.innerHeight -
                    floatingNote.offsetHeight
                );


            left =
                Math.max(
                    0,
                    Math.min(
                        left,
                        maxLeft
                    )
                );


            top =
                Math.max(
                    0,
                    Math.min(
                        top,
                        maxTop
                    )
                );


            floatingNote.style.left =
                `${left}px`;


            floatingNote.style.top =
                `${top}px`;


            floatingNote.style.right =
                "auto";


            floatingNote.style.bottom =
                "auto";

        }
    );


    /* =====================================================
       STOP DRAG
    ===================================================== */

    document.addEventListener(
        "mouseup",
        () => {

            isDraggingNote =
                false;


            if (floatingNoteHeader) {

                floatingNoteHeader.style.cursor =
                    "move";

            }

        }
    );


    /* =====================================================
       INITIAL ICONS
    ===================================================== */

    refreshIcons();

});






/* =========================================================
   DIGITAL STUDY TIMER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const display =
        document.getElementById("timerDisplay");

    const pauseBtn =
        document.getElementById("timerPause");

    const pauseIcon =
        document.getElementById("timerPauseIcon");

    const resetBtn =
        document.getElementById("timerReset");

    const stopBtn =
        document.getElementById("timerStop");

    const status =
        document.getElementById("timerStatus");

    const timerCircle =
        document.getElementById("timerCircle");

    const tabs =
        document.querySelectorAll(".timer-tab");

    const tasks =
        document.querySelectorAll(".study-task");



    /* =====================================================
       STATE
    ===================================================== */

    let seconds = 0;

    let timerInterval = null;

    let isRunning = false;

    let timerMode = "study";


    /* =====================================================
       FORMAT TIME
    ===================================================== */

    function formatTime(totalSeconds) {

        const hours =
            Math.floor(totalSeconds / 3600);

        const minutes =
            Math.floor((totalSeconds % 3600) / 60);

        const secs =
            totalSeconds % 60;


        return [

            String(hours).padStart(2, "0"),

            String(minutes).padStart(2, "0"),

            String(secs).padStart(2, "0")

        ].join(":");

    }


    /* =====================================================
       UPDATE DISPLAY
    ===================================================== */

    function updateDisplay() {

        display.textContent =
            formatTime(seconds);

    }


    /* =====================================================
       START
    ===================================================== */

    function startTimer() {

        if (isRunning) return;


        isRunning = true;


        timerCircle.classList.add("running");

        status.textContent =
            timerMode === "study"
                ? "در حال مطالعه"
                : "تایمر آزاد";


        if (pauseIcon) {

            pauseIcon.setAttribute(
                "data-lucide",
                "pause"
            );

        }


        if (typeof lucide !== "undefined") {

            lucide.createIcons();

        }


        timerInterval =
            setInterval(() => {

                seconds++;

                updateDisplay();

            }, 1000);

    }


    /* =====================================================
       PAUSE
    ===================================================== */

    function pauseTimer() {

        if (!isRunning) return;


        clearInterval(timerInterval);

        timerInterval = null;

        isRunning = false;


        timerCircle.classList.remove("running");

        timerCircle.classList.add("paused");


        status.textContent =
            "متوقف موقت";


        if (pauseIcon) {

            pauseIcon.setAttribute(
                "data-lucide",
                "play"
            );

        }


        if (typeof lucide !== "undefined") {

            lucide.createIcons();

        }

    }


    /* =====================================================
       TOGGLE
    ===================================================== */

    function toggleTimer() {

        if (isRunning) {

            pauseTimer();

        } else {

            startTimer();

        }

    }


    /* =====================================================
       RESET
    ===================================================== */

    function resetTimer() {

        clearInterval(timerInterval);

        timerInterval = null;

        isRunning = false;

        seconds = 0;


        updateDisplay();


        timerCircle.classList.remove(
            "running",
            "paused"
        );


        status.textContent =
            "آماده شروع";


        if (pauseIcon) {

            pauseIcon.setAttribute(
                "data-lucide",
                "play"
            );

        }


        if (typeof lucide !== "undefined") {

            lucide.createIcons();

        }

    }


    /* =====================================================
       STOP
    ===================================================== */

    function stopTimer() {

        clearInterval(timerInterval);

        timerInterval = null;

        isRunning = false;


        timerCircle.classList.remove(
            "running",
            "paused"
        );


        status.textContent =
            seconds > 0
                ? "مطالعه متوقف شد"
                : "آماده شروع";


        if (pauseIcon) {

            pauseIcon.setAttribute(
                "data-lucide",
                "play"
            );

        }


        if (typeof lucide !== "undefined") {

            lucide.createIcons();

        }

    }


    /* =====================================================
       CONTROLS
    ===================================================== */

    
    if (pauseBtn) {

        pauseBtn.addEventListener(
            "click",
            toggleTimer
        );

    }


    if (resetBtn) {

        resetBtn.addEventListener(
            "click",
            resetTimer
        );

    }


    if (stopBtn) {

        stopBtn.addEventListener(
            "click",
            stopTimer
        );

    }


    /* =====================================================
       TIMER TABS
    ===================================================== */

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            tabs.forEach(item => {

                item.classList.remove("active");

            });


            tab.classList.add("active");


            timerMode =
                tab.dataset.timerMode;


            if (timerMode === "study") {

                status.textContent =
                    isRunning
                        ? "در حال مطالعه"
                        : "آماده شروع";

            } else {

                status.textContent =
                    isRunning
                        ? "تایمر آزاد"
                        : "آماده شروع";

            }

        });

    });


    /* =====================================================
       STUDY CHECKLIST
    ===================================================== */

    tasks.forEach(task => {

        task.addEventListener("click", () => {

            task.classList.toggle("completed");


            const checkbox =
                task.querySelector(".check-box");


            if (!checkbox) return;


            if (task.classList.contains("completed")) {

                checkbox.innerHTML =
                    `<i data-lucide="check"></i>`;

            } else {

                checkbox.innerHTML = "";

            }


            if (typeof lucide !== "undefined") {

                lucide.createIcons();

            }

        });

    });


    /* =====================================================
       INITIAL
    ===================================================== */

    updateDisplay();


    if (typeof lucide !== "undefined") {

        lucide.createIcons();

    }


});








const reportTabs =
document.querySelectorAll(".report-tab");


const reportSections =
document.querySelectorAll(".report-section");



reportTabs.forEach(tab=>{


    tab.addEventListener("click",()=>{


        reportTabs.forEach(t=>
            t.classList.remove("active")
        );


        reportSections.forEach(section=>
            section.classList.remove("active")
        );



        tab.classList.add("active");



        document
        .getElementById(
            tab.dataset.report
        )
        .classList.add("active");


    });



});





































/* =====================================
   CUSTOM TOAST MESSAGE
===================================== */

function showToast(message, type = "error") {


    const toast = document.createElement("div");


    toast.className =
        `custom-toast-new ${type}`;



    toast.innerHTML = `

        <i data-lucide="triangle-alert"></i>

        <span>
            ${message}
        </span>

    `;



    document.body.appendChild(toast);



    // فعال کردن آیکون SVG
    lucide.createIcons();



    setTimeout(()=>{


        toast.classList.add(
            "hide-toast"
        );



        setTimeout(()=>{


            toast.remove();


        },400);



    },3000);


}


/* =====================================================
   SESSION REPORT DAYS
===================================================== */


const reportDays =
document.querySelectorAll(".day");



reportDays.forEach(day=>{


    day.addEventListener(
        "click",
        ()=>{


            // حذف انتخاب قبلی

            reportDays.forEach(d=>{

                d.classList.remove(
                    "active"
                );

            });



            // انتخاب روز جدید

            day.classList.add(
                "active"
            );



            const selectedDay =
            day.innerText;



            console.log(
                "روز انتخاب شده:",
                selectedDay
            );



            /*
            
            مرحله بعد:
            اینجا برنامه های همان روز
            از weekly planner گرفته میشه

            مثال:

            loadWeeklyTasks(selectedDay)

            */


        }
    );


});
/* =====================================================
   SAVE SESSION REPORT
===================================================== */
const saveReportBtn = 
document.getElementById("saveReportBtn");


let weeklyReportSaved = false;



if(saveReportBtn){


saveReportBtn.addEventListener(
"click",
()=>{


    console.log("دکمه ذخیره کلیک شد");

    const noteInput =
    document.querySelector(
        ".today-note-input"
    );



    const note =
    noteInput
    ? noteInput.value.trim()
    : "";



    const selectedDay =
    document.querySelector(
        ".day.active"
    );



    const hour =
    document.getElementById(
        "studyHourNew"
    );


    const minute =
    document.getElementById(
        "studyMinuteNew"
    );


    const second =
    document.getElementById(
        "studySecondNew"
    );



    const studyHour =
    hour
    ? hour.value.trim()
    : "";


    const studyMinute =
    minute
    ? minute.value.trim()
    : "";


    const studySecond =
    second
    ? second.value.trim()
    : "";





    /* ===============================
       VALIDATION
    =============================== */


    if(!selectedDay){

        console.log("روز انتخاب نشده");

        showToast(
            "لطفاً روز هفته را انتخاب کنید."
        );


        return;

    }



    if(
        !studyHour &&
        !studyMinute &&
        !studySecond
    ){

        console.log(
"ساعت خالی است",
studyHour,
studyMinute,
studySecond
);

        showToast(
            "لطفاً ساعت مطالعه را وارد کنید."
        );


        if(hour){

            hour.focus();

        }


        return;

    }




    if(!note){


        showToast(
            "لطفاً یادداشت امروز را وارد کنید."
        );


        if(noteInput){

            noteInput.focus();

        }


        return;

    }





    /* ===============================
       SAVE SUCCESS
    =============================== */


    weeklyReportSaved = true;



const reportData = {
    day: selectedDay.innerText,

    studyTime: {
        hour: studyHour,
        minute: studyMinute,
        second: studySecond
    },

    note: note,

    saved: true
};


/* =========================================
   گزارش جلسه فعلی
========================================= */

window.currentStudyReport = reportData;



    console.log(
        "گزارش ذخیره شد:",
        reportData
    );




    saveReportBtn.innerHTML = `

        <i data-lucide="check"></i>

        ذخیره شد

    `;



    lucide.createIcons();



    saveReportBtn.classList.add(
        "saved"
    );


});


}











































/* =====================================================
   LESSONS TAB - LOAD WEEKLY TASKS
===================================================== */

const lessonDays =
    document.querySelectorAll(".lesson-day");

const lessonListContainer =
    document.getElementById("lessonListContainer");


/* تبدیل نام روزها به data-day برنامه هفتگی */
const lessonDayMap = {
    "شنبه": "saturday",
    "یکشنبه": "sunday",
    "دوشنبه": "monday",
    "سه‌شنبه": "tuesday",
    "چهارشنبه": "wednesday",
    "پنجشنبه": "thursday",
    "جمعه": "friday"
};

/* =====================================================
   CURRENT STUDYING TASK
===================================================== */

let currentStudyingTaskCard = null;


/* =====================================================
   نمایش برنامه‌های یک روز
===================================================== */

function loadWeeklyTasks(selectedDay) {

    if (!lessonListContainer) return;


    /* پاک کردن لیست قبلی */
    lessonListContainer.innerHTML = "";


    /* پیدا کردن data-day */
    const dayKey =
        lessonDayMap[selectedDay] || selectedDay;


    /* پیدا کردن باکس همان روز در برنامه هفتگی */
    const weeklyDayTasks =
        document.querySelector(
            `.day-tasks[data-tasks="${dayKey}"]`
        );


    /* =================================================
       اگر روز پیدا نشد
    ================================================= */

    if (!weeklyDayTasks) {

        lessonListContainer.innerHTML = `
            <div class="no-lessons">

                <i data-lucide="calendar-x"></i>

                <span>
                    برنامه‌ای برای این روز ثبت نشده است.
                </span>

            </div>
        `;

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }

        return;
    }


    /* =================================================
       پیدا کردن برنامه‌های همان روز
    ================================================= */

    const weeklyTasks =
        weeklyDayTasks.querySelectorAll(".task-card");


    /* =================================================
       اگر برنامه‌ای وجود ندارد
    ================================================= */

    if (weeklyTasks.length === 0) {

        lessonListContainer.innerHTML = `
            <div class="no-lessons">

                <i data-lucide="calendar-x"></i>

                <span>
                    برنامه‌ای برای این روز ثبت نشده است.
                </span>

            </div>
        `;

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }

        return;
    }


    /* =================================================
       ساخت کارت‌های درس
    ================================================= */

    weeklyTasks.forEach(task => {


        /* -------------------------------------------------
           اطلاعات برنامه
        ------------------------------------------------- */

        const subjectName =
            task.dataset.subjectName || "بدون نام";


        const subjectIcon =
            task.dataset.icon || "book-open";


        const topic =
            task.dataset.topic || "-";


        const duration =
            task.dataset.duration || "-";


        const note =
            task.dataset.note || "-";


        /* -------------------------------------------------
           رنگ درس
        ------------------------------------------------- */

        const subjectColor =
            task.dataset.color || "";


        /* -------------------------------------------------
           ساخت کارت
        ------------------------------------------------- */

        const lessonCard =
            document.createElement("div");


        lessonCard.className =
            "lesson-item-card";


        /* -------------------------------------------------
           رنگ کارت
        ------------------------------------------------- */

        if (subjectColor) {

            lessonCard.style.setProperty(
                "--lesson-bg",
                subjectColor + "22"
            );

            lessonCard.style.setProperty(
                "--lesson-border",
                subjectColor
            );

            lessonCard.style.setProperty(
                "--lesson-accent",
                subjectColor
            );

        }


        /* -------------------------------------------------
           ذخیره اطلاعات روی کارت
        ------------------------------------------------- */

        lessonCard.dataset.subject =
            task.dataset.subject || "";


        lessonCard.dataset.subjectName =
            subjectName;


        lessonCard.dataset.icon =
            subjectIcon;


        lessonCard.dataset.day =
            dayKey;


        lessonCard.dataset.duration =
            duration;


        lessonCard.dataset.topic =
            topic;


        lessonCard.dataset.note =
            note;


        /* وضعیت انجام شده */
        lessonCard.dataset.completed =
            task.dataset.completed || "false";


        /* -------------------------------------------------
           اگر برنامه قبلاً انجام شده
        ------------------------------------------------- */

        if (
            task.dataset.completed === "true"
        ) {

            lessonCard.classList.add(
                "completed"
            );

        }


        /* =================================================
           HTML کارت درس
        ================================================= */

        lessonCard.innerHTML = `

            <div class="lesson-item-info">

                <div class="lesson-item-title">

                    <i
                        data-lucide="${subjectIcon}">
                    </i>

                    <span>
                        ${subjectName}
                    </span>

                </div>


                <div class="lesson-item-topic">
                    ${topic}
                </div>

            </div>


            <div class="lesson-item-note">

                ${
                    note && note !== "-"
                        ? note
                        : "بدون یادداشت"
                }

            </div>


            <button
                type="button"
                class="lesson-start-btn"
            >

                <i data-lucide="play"></i>

                <span>
                    شروع مطالعه
                </span>

            </button>

        `;


        /* -------------------------------------------------
           اضافه کردن کارت به لیست
        ------------------------------------------------- */

        lessonListContainer.appendChild(
            lessonCard
        );

    });


    /* =================================================
       ساخت آیکون‌ها
    ================================================= */

    if (typeof lucide !== "undefined") {

        lucide.createIcons();

    }

}


/* =====================================================
   SELECTED LESSON CARD
===================================================== */

const selectedLessonLogo =
    document.getElementById(
        "selectedLessonLogo"
    );


const selectedLessonName =
    document.getElementById(
        "selectedLessonName"
    );


const selectedLessonTopic =
    document.getElementById(
        "selectedLessonTopic"
    );


const selectedLessonNote =
    document.getElementById(
        "selectedLessonNote"
    );


const selectedLessonTime =
    document.getElementById(
        "selectedLessonTime"
    );


/* =====================================================
   شروع مطالعه
===================================================== */

if (lessonListContainer) {

    lessonListContainer.addEventListener(
        "click",
        function (event) {


            const startButton =
                event.target.closest(
                    ".lesson-start-btn"
                );


            if (!startButton) {
                return;
            }


            /* -------------------------------------------------
               کارت درس
            ------------------------------------------------- */

            const lessonCard =
                startButton.closest(
                    ".lesson-item-card"
                );


            if (!lessonCard) {
                return;
            }


            /* -------------------------------------------------
               پیدا کردن کارت اصلی برنامه هفتگی
            ------------------------------------------------- */

            const dayKey =
                lessonCard.dataset.day;


            const weeklyDayTasks =
                document.querySelector(
                    `.day-tasks[data-tasks="${dayKey}"]`
                );


            let originalTask = null;


            if (weeklyDayTasks) {

                const weeklyTasks =
                    weeklyDayTasks.querySelectorAll(
                        ".task-card"
                    );


                weeklyTasks.forEach(task => {

                    if (
                        !originalTask &&
                        task.dataset.subjectName ===
                            lessonCard.dataset.subjectName &&

                        task.dataset.topic ===
                            lessonCard.dataset.topic &&

                        task.dataset.duration ===
                            lessonCard.dataset.duration
                    ) {

                        originalTask = task;

                    }

                });

            }


            /* -------------------------------------------------
               اگر کارت اصلی پیدا شد
            ------------------------------------------------- */

            if (originalTask) {

                currentStudyingTaskCard =
                    originalTask;

            } else {

                /*
                   fallback:
                   اگر به هر دلیلی کارت اصلی پیدا نشد،
                   خود کارت درس را نگه می‌داریم.
                */

                currentStudyingTaskCard =
                    lessonCard;

            }


            /* -------------------------------------------------
               اطلاعات کارت
            ------------------------------------------------- */

            const subjectName =
                lessonCard.dataset.subjectName ||
                "بدون نام";


            const subjectIcon =
                lessonCard.dataset.icon ||
                "book-open";


            const topic =
                lessonCard.dataset.topic ||
                "-";


            const note =
                lessonCard.dataset.note ||
                "";


            const duration =
                lessonCard.dataset.duration ||
                "-";


            /* -------------------------------------------------
               نام درس
            ------------------------------------------------- */

            if (selectedLessonName) {

                selectedLessonName.textContent =
                    subjectName;

            }


            /* -------------------------------------------------
               مبحث
            ------------------------------------------------- */

            if (selectedLessonTopic) {

                selectedLessonTopic.textContent =
                    topic || "-";

            }


            /* -------------------------------------------------
               یادداشت
            ------------------------------------------------- */

            if (selectedLessonNote) {

                selectedLessonNote.textContent =
                    note.trim()
                        ? note
                        : "بدون یادداشت";

            }


            /* -------------------------------------------------
               زمان
            ------------------------------------------------- */

            if (selectedLessonTime) {

                selectedLessonTime.textContent =
                    duration || "-";

            }


            /* -------------------------------------------------
               آیکون درس
            ------------------------------------------------- */

            if (selectedLessonLogo) {


                selectedLessonLogo.innerHTML = `

                    <i
                        data-lucide="${subjectIcon}">
                    </i>

                `;


                /* رنگ همان درس */

                const subjectColor =
                    lessonCard.style.getPropertyValue(
                        "--lesson-accent"
                    );


                if (subjectColor) {

                    selectedLessonLogo.style.color =
                        subjectColor;

                }


                /* ساخت دوباره آیکون */

                if (
                    typeof lucide !== "undefined"
                ) {

                    lucide.createIcons();

                }

            }


            /* -------------------------------------------------
               حذف انتخاب قبلی
            ------------------------------------------------- */

            document
                .querySelectorAll(
                    ".lesson-item-card.selected"
                )
                .forEach(card => {

                    card.classList.remove(
                        "selected"
                    );

                });


            /* -------------------------------------------------
               انتخاب کارت فعلی
            ------------------------------------------------- */

            lessonCard.classList.add(
                "selected"
            );


            console.log(
                "برنامه برای مطالعه انتخاب شد:",
                {
                    subject: subjectName,
                    topic: topic,
                    note: note,
                    duration: duration
                }
            );

        }
    );

}


/* =====================================================
   پایان مطالعه
===================================================== */

const finishStudyBtn =
    document.getElementById(
        "finishStudyBtn"
    );


if (finishStudyBtn) {

    finishStudyBtn.addEventListener(
        "click",
        function () {


/* -------------------------------------------------
   بررسی ذخیره گزارش روزانه
------------------------------------------------- */

if (!weeklyReportSaved) {


    showToast(
        "لطفاً ابتدا گزارش مطالعه امروز را ذخیره کنید."
    );


    return;

}

            /* -------------------------------------------------
               بررسی اینکه برنامه‌ای انتخاب شده
            ------------------------------------------------- */

            if (!currentStudyingTaskCard) {

                alert(
                    "ابتدا یک برنامه را برای مطالعه انتخاب کنید."
                );

                return;

            }


            /* -------------------------------------------------
               کارت اصلی برنامه هفتگی
            ------------------------------------------------- */

            const taskCard =
                currentStudyingTaskCard;


                /* =========================================
   ساخت اطلاعات کامل جلسه مطالعه
========================================= */

const studyReport =
    window.currentStudyReport || {};


const studySession = {

    id:
        Date.now(),

    createdAt:
        new Date().toISOString(),

    day:
        taskCard.dataset.day || "",

    subject:
        taskCard.dataset.subject || "",

    subjectName:
        taskCard.dataset.subjectName || "",

    icon:
        taskCard.dataset.icon || "book-open",

    color:
        taskCard.dataset.color || "",

    topic:
        taskCard.dataset.topic || "",

    lessonNote:
        taskCard.dataset.note || "",

    plannedDuration:
        taskCard.dataset.duration || "",

    studyTime:
        studyReport.studyTime || {
            hour: "0",
            minute: "0",
            second: "0"
        },

    reportNote:
        studyReport.note || "",

    completed:
        true

};

/* =========================================
   ذخیره جلسه مطالعه در پروفایل
========================================= */

const savedSessions =
    JSON.parse(
        localStorage.getItem(
            "studySessions"
        )
    ) || [];


savedSessions.push(
    studySession
);


localStorage.setItem(
    "studySessions",
    JSON.stringify(
        savedSessions
    )
);
            /* -------------------------------------------------
               انجام شده
            ------------------------------------------------- */

            taskCard.classList.add(
                "completed"
            );


            taskCard.dataset.completed =
                "true";


            /* -------------------------------------------------
               تغییر زمان به انجام شده
            ------------------------------------------------- */

            const taskTime =
                taskCard.querySelector(
                    ".task-time"
                );


            if (taskTime) {

                taskTime.innerHTML = `

                    <i data-lucide="check"></i>

                    انجام شده

                `;

            }


            /* -------------------------------------------------
               کارت متناظر در تب درس‌ها هم سبز شود
            ------------------------------------------------- */

            const selectedLessonCard =
                document.querySelector(
                    ".lesson-item-card.selected"
                );


            if (selectedLessonCard) {

                selectedLessonCard.classList.add(
                    "completed"
                );

                selectedLessonCard.dataset.completed =
                    "true";

            }


            /* -------------------------------------------------
               آیکون‌ها
            ------------------------------------------------- */

            if (typeof lucide !== "undefined") {

                lucide.createIcons();

            }


            /* -------------------------------------------------
               تغییر دکمه پایان مطالعه
            ------------------------------------------------- */

            finishStudyBtn.innerHTML = `

                <i data-lucide="check-circle-2"></i>

                <span>
                    مطالعه انجام شد
                </span>

            `;


            finishStudyBtn.classList.add(
                "finished"
            );


            if (typeof lucide !== "undefined") {

                lucide.createIcons();

            }


            console.log(
                "مطالعه با موفقیت پایان یافت."
            );

        }
    );

}


/* =====================================================
   کلیک روی روزهای هفته
===================================================== */

lessonDays.forEach(dayButton => {

    dayButton.addEventListener(
        "click",
        () => {


            /* حذف active از همه */

            lessonDays.forEach(day => {

                day.classList.remove(
                    "active"
                );

            });


            /* فعال کردن روز انتخاب شده */

            dayButton.classList.add(
                "active"
            );


            /* روز انتخاب شده */

            const selectedDay =
                dayButton.dataset.day;


            /* نمایش برنامه‌ها */

            loadWeeklyTasks(
                selectedDay
            );

        }
    );

});


/* =====================================================
   روز پیش‌فرض
===================================================== */

if (lessonDays.length > 0) {

    const activeDay =
        document.querySelector(
            ".lesson-day.active"
        );


    if (activeDay) {

        loadWeeklyTasks(
            activeDay.dataset.day
        );

    } else {

        loadWeeklyTasks(
            lessonDays[0].dataset.day
        );

    }

}



































// ======================================================
// REFRESH LESSON SECTION
// ======================================================

function refreshLessonsSection(){


    const activeLessonDay =
    document.querySelector(
        ".lesson-day.active"
    );


    if(!activeLessonDay){
        return;
    }


    loadWeeklyTasks(
        activeLessonDay.dataset.day
    );


    refreshSelectedLessonCard();

}



// ======================================================
// REFRESH SELECTED LESSON
// ======================================================

function refreshSelectedLessonCard(){


    if(!currentStudyingTaskCard){
        return;
    }


    const task =
    currentStudyingTaskCard;



    const fields = {

        selectedLessonName:
        task.dataset.subjectName || "بدون نام",

        selectedLessonTopic:
        task.dataset.topic || "-",

        selectedLessonNote:
        task.dataset.note || "بدون یادداشت",

        selectedLessonTime:
        task.dataset.duration || "-"

    };



    Object.keys(fields).forEach(id=>{


        const element =
        document.getElementById(id);


        if(element){

            element.textContent =
            fields[id];

        }


    });



    const logo =
    document.getElementById(
        "selectedLessonLogo"
    );



    if(logo){


        logo.innerHTML = `

            <i data-lucide="${
                task.dataset.icon || "book-open"
            }"></i>

        `;


        if(typeof lucide !== "undefined"){

            lucide.createIcons();

        }


    }



}







// ======================================================
// LOAD USER PLANS
// ======================================================

async function loadUserPlans(user){



    const planner =
    document.querySelector(
        ".weekly-planner"
    );



    if(planner){


        planner
        .querySelectorAll(".task-card")
        .forEach(card=>{

            card.remove();

        });


    }




    try{


        if(
            !user ||
            !user.phone
        ){


            console.log(
                "User phone not found"
            );


            return;


        }



        const response =
        await fetch(

            `${API_URL}/plans/${user.phone}`

        );



        const data =
        await response.json();



        console.log(
            "USER PLANS:",
            data
        );




        if(!response.ok){


            throw new Error(

                data.message ||
                "خطا در دریافت برنامه ها"

            );


        }




        if(
            data.success &&
            Array.isArray(data.plans)
        ){



            data.plans.forEach(plan=>{


                renderTaskFromDatabase(
                    plan
                );


            });



        }



    }


    catch(error){



        console.log(
            "LOAD PLANS ERROR:",
            error
        );



        showToast(
            error.message
        );


    }



}






// ======================================================
// CREATE CARD FROM DATABASE
// ======================================================

function renderTaskFromDatabase(plan){



    const dayTasks =
    document.querySelector(

        `.day-tasks[data-tasks="${plan.day}"]`

    );



    if(!dayTasks){

        console.log(
            "DAY NOT FOUND:",
            plan.day
        );

        return;

    }




    const card =
    document.createElement(
        "div"
    );



    card.className =
    `task-card ${plan.subject}-card`;


    card.dataset.id =
    plan._id;



    card.dataset.subject =
    plan.subject;



    card.dataset.subjectName =
    plan.subjectName;



    card.dataset.icon =
    plan.icon;



    card.dataset.color =
    plan.color;



    card.dataset.day =
    plan.day;



    card.dataset.duration =
    plan.duration;



    card.dataset.topic =
    plan.title;



    card.dataset.note =
    plan.note;




    card.innerHTML = `


    <div class="task-content">


        <div class="task-main">


            <div class="task-name">


                <i data-lucide="${plan.icon}"></i>


                <span>
                    ${plan.subjectName}
                </span>


            </div>


        </div>



        <div class="task-topic">

            ${plan.title}

        </div>



        <div class="task-time">

            ${plan.duration} مطالعه

        </div>



    </div>



    <div class="task-actions">


        <button
        class="task-action edit-task">

            <i data-lucide="pen-line"></i>

        </button>



        <button
        class="task-action note-task">


            <i data-lucide="notebook-pen"></i>


        </button>



    </div>


    `;



    dayTasks.appendChild(card);



    if(typeof lucide !== "undefined"){

        lucide.createIcons();

    }


}






// ======================================================
// INIT LOAD
// ======================================================


document.addEventListener(
"DOMContentLoaded",
()=>{


    const currentUser =
    JSON.parse(

        localStorage.getItem(
            "currentUser"
        )

    );



    loadUserPlans(
        currentUser
    );


});






// ======================================================
// DELETE PLAN
// ======================================================

if (confirmDeleteBtn) {

    confirmDeleteBtn.addEventListener(
        "click",
        async () => {


            if (!editingTaskCard) {

                console.log(
                    "No task selected"
                );

                return;

            }



            const id =
            editingTaskCard.dataset.id;



            if (!id) {

                showToast(
                    "شناسه برنامه پیدا نشد"
                );

                return;

            }



            // جلوگیری از کلیک دوباره
            confirmDeleteBtn.disabled = true;


            const oldText =
            confirmDeleteBtn.innerHTML;


            confirmDeleteBtn.innerHTML =
            `
                <i data-lucide="loader-circle"></i>
                حذف...
            `;


            if(typeof lucide !== "undefined"){
    lucide.createIcons();
}



            try {


                console.log(
                    "DELETE ID:",
                    id
                );


                console.log(
                    "DELETE URL:",
                    `${API_URL}/plans/${id}`
                );



                const response =
                await fetch(

                    `${API_URL}/plans/${id}`,

                    {
                        method:"DELETE",

                        headers:{
                            "Content-Type":
                            "application/json"
                        }

                    }

                );



                // دریافت متن خام
                const text =
                await response.text();



                let data = {};



                try{

                    data =
                    JSON.parse(text);

                }

                catch{

                    console.log(
                        "SERVER RESPONSE:",
                        text
                    );

                    throw new Error(
                        "پاسخ نامعتبر از سرور دریافت شد"
                    );

                }





                console.log(
                    "DELETE RESPONSE:",
                    data
                );





                if(!response.ok){

                    throw new Error(

                        data.message ||
                        "حذف برنامه انجام نشد"

                    );

                }




                // حذف از صفحه فقط بعد از موفقیت سرور

                editingTaskCard.remove();





                // بستن مودال و پاکسازی

                editTaskModal
                ?.classList.remove(
                    "active"
                );


                deleteConfirmModal
                ?.classList.remove(
                    "active"
                );



                editingTaskCard = null;



                refreshLessonsSection();



                showToast(
                    "برنامه حذف شد ✓",
                    "success"
                );



            }


            catch(error){


                console.error(
                    "DELETE ERROR:",
                    error
                );


                showToast(
                    error.message ||
                    "خطا در حذف برنامه"
                );


            }


            finally{


                confirmDeleteBtn.disabled =
                false;


                confirmDeleteBtn.innerHTML =
                oldText;


                if(typeof lucide !== "undefined"){
    lucide.createIcons();
}


            }



        }

    );

}


// ======================================================
// CANCEL DELETE
// ======================================================


if(cancelDeleteBtn){


cancelDeleteBtn.addEventListener(
"click",
()=>{


    deleteConfirmModal
    ?.classList.remove(
        "active"
    );


});


}






















































































// ============================================================
// DAILY TASK MANAGER
// مستقل از سایر بخش های پنل
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // ELEMENTS
    // ========================================================

    const addTaskBtn =
        document.getElementById("addTaskBtn");

    const taskModal =
        document.getElementById("dailyTaskModal");

    const modalCard =
        document.getElementById("dailyTaskModalCard");

    const closeModalBtn =
        document.getElementById("dailyTaskModalClose");

    const cancelBtn =
        document.getElementById("dailyTaskCancel");

    const saveBtn =
        document.getElementById("dailyTaskSave");

    const taskTitleInput =
        document.getElementById("dailyTaskTitle");

    const startTimeInput =
        document.getElementById("dailyTaskStartTime");

    const endTimeInput =
        document.getElementById("dailyTaskEndTime");

    const descriptionInput =
        document.getElementById("dailyTaskDescription");

    const taskList =
        document.getElementById("taskList");

    const taskCount =
        document.getElementById("taskCount");

    const liveClock =
        document.getElementById("liveClock");

    const todayDate =
        document.getElementById("todayDate");

    const todayDay =
        document.getElementById("todayDay");


    // ========================================================
    // CHECK ELEMENTS
    // ========================================================

    if (
        !addTaskBtn ||
        !taskModal ||
        !closeModalBtn ||
        !cancelBtn ||
        !saveBtn ||
        !taskTitleInput ||
        !startTimeInput ||
        !endTimeInput ||
        !descriptionInput ||
        !taskList ||
        !taskCount ||
        !liveClock ||
        !todayDate ||
        !todayDay
    ) {

        console.error(
            "❌ DAILY TASK MANAGER: بعضی از عناصر HTML پیدا نشدند."
        );

        return;

    }


    // ========================================================
    // DATE KEY
    // برای هر روز یک فضای ذخیره سازی جدا
    // ========================================================

    function getTodayKey() {

        const now = new Date();

        return now.toLocaleDateString(
            "fa-IR-u-nu-latn"
        );

    }


    // ========================================================
    // STORAGE KEY
    // ========================================================

    function getStorageKey() {

        return "dailyTasks_" + getTodayKey();

    }


    // ========================================================
    // LOAD TASKS
    // ========================================================

    let tasks = loadTasks();


    function loadTasks() {

        try {

            const saved =
                localStorage.getItem(
                    getStorageKey()
                );

            if (!saved) {

                return [];

            }

            const parsed =
                JSON.parse(saved);

            return Array.isArray(parsed)
                ? parsed
                : [];

        }

        catch (error) {

            console.error(
                "❌ خطا در خواندن کارها:",
                error
            );

            return [];

        }

    }


    // ========================================================
    // SAVE TASKS
    // ========================================================

    function saveTasks() {

        try {

            localStorage.setItem(
                getStorageKey(),
                JSON.stringify(tasks)
            );

        }

        catch (error) {

            console.error(
                "❌ خطا در ذخیره کارها:",
                error
            );

        }

    }


    // ========================================================
    // OPEN MODAL
    // ========================================================

    function openModal() {

        taskModal.style.display = "flex";

        document.body.style.overflow = "hidden";

        setTimeout(() => {

            taskTitleInput.focus();

        }, 100);

    }


    // ========================================================
    // CLOSE MODAL
    // ========================================================

    function closeModal() {

        taskModal.style.display = "none";

        document.body.style.overflow = "";

        clearForm();

    }


    // ========================================================
    // CLEAR FORM
    // ========================================================

    function clearForm() {

        taskTitleInput.value = "";

        startTimeInput.value = "";

        endTimeInput.value = "";

        descriptionInput.value = "";

    }


    // ========================================================
    // OPEN
    // ========================================================

    addTaskBtn.addEventListener(
        "click",
        openModal
    );


    // ========================================================
    // CLOSE BUTTON
    // ========================================================

    closeModalBtn.addEventListener(
        "click",
        closeModal
    );


    // ========================================================
    // CANCEL
    // ========================================================

    cancelBtn.addEventListener(
        "click",
        closeModal
    );


    // ========================================================
    // CLICK OUTSIDE MODAL
    // ========================================================

    taskModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === taskModal
            ) {

                closeModal();

            }

        }
    );


    // ========================================================
    // ESCAPE
    // ========================================================

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                taskModal.style.display === "flex"
            ) {

                closeModal();

            }

        }
    );


    // ========================================================
    // SAVE NEW TASK
    // ========================================================

    saveBtn.addEventListener(
        "click",
        saveNewTask
    );


    function saveNewTask() {

        const title =
            taskTitleInput.value.trim();

        const start =
            startTimeInput.value;

        const end =
            endTimeInput.value;

        const description =
            descriptionInput.value.trim();


        // --------------------------------
        // TITLE VALIDATION
        // --------------------------------

        if (!title) {

            alert(
                "لطفاً عنوان کار را وارد کنید."
            );

            taskTitleInput.focus();

            return;

        }


        // --------------------------------
        // TIME VALIDATION
        // --------------------------------

        if (
            start &&
            end &&
            end <= start
        ) {

            alert(
                "ساعت پایان باید بعد از ساعت شروع باشد."
            );

            endTimeInput.focus();

            return;

        }


        // --------------------------------
        // CREATE TASK
        // --------------------------------

        const newTask = {

            id: Date.now(),

            title: title,

            start: start || "",

            end: end || "",

            description: description,

            done: false,

            createdAt:
                new Date().toISOString()

        };


        // --------------------------------
        // ADD
        // --------------------------------

        tasks.push(newTask);


        // --------------------------------
        // SORT
        // --------------------------------

        sortTasks();


        // --------------------------------
        // SAVE
        // --------------------------------

        saveTasks();


        // --------------------------------
        // RENDER
        // --------------------------------

        renderTasks();


        // --------------------------------
        // CLOSE
        // --------------------------------

        closeModal();

    }


    // ========================================================
    // SORT TASKS
    // ========================================================

    function sortTasks() {

        tasks.sort(
            (a, b) => {

                if (!a.start && !b.start) {

                    return 0;

                }

                if (!a.start) {

                    return 1;

                }

                if (!b.start) {

                    return -1;

                }

                return a.start.localeCompare(
                    b.start
                );

            }
        );

    }

function renderTasks() {

    taskList.innerHTML = "";

    taskCount.textContent = tasks.length;


    // ========================================================
    // EMPTY
    // ========================================================

    if (tasks.length === 0) {

        const empty = document.createElement("div");

        empty.className = "empty-task";

        empty.innerHTML = `
            <i data-lucide="clipboard-list"></i>

            <h4>
                هنوز کاری ثبت نشده
            </h4>

            <p>
                برای ساخت برنامه امروز روی + کلیک کنید
            </p>
        `;

        taskList.appendChild(empty);

        refreshIcons();

        return;
    }


    // ========================================================
    // CREATE CARDS
    // ========================================================

    tasks.forEach((task, index) => {


        // ====================================================
        // CARD
        // ====================================================

        const card =
            document.createElement("article");

        card.className = "daily-task-card";

        card.dataset.taskId = task.id;


        if (task.done) {

            card.classList.add("completed");

        }


        // ====================================================
        // HEADER
        // ====================================================

        const header =
            document.createElement("div");

        header.className =
            "daily-task-card-header";


        // ----------------------------------------------------
        // BRAND
        // ----------------------------------------------------

        const brand =
            document.createElement("div");

        brand.className =
            "daily-task-card-brand";


        // LOGO

        const logo =
            document.createElement("div");

        logo.className =
            "daily-task-card-logo";

        logo.innerHTML = `
            <i data-lucide="calendar-check"></i>
        `;


        // TITLE BOX

        const titleBox =
            document.createElement("div");

        titleBox.className =
            "daily-task-card-title-box";


        const number =
            document.createElement("span");

        number.className =
            "daily-task-card-number";

        number.textContent =
            String(index + 1).padStart(2, "0");


        const title =
            document.createElement("h4");

        title.className =
            "daily-task-card-title";

        title.textContent =
            task.title;


        titleBox.appendChild(number);

        titleBox.appendChild(title);


        brand.appendChild(logo);

        brand.appendChild(titleBox);


        // ----------------------------------------------------
        // STATUS BUTTON
        // ----------------------------------------------------

        const statusBtn =
            document.createElement("button");

        statusBtn.type = "button";

        statusBtn.className =
            "daily-task-status";


        statusBtn.title =
            task.done
                ? "این کار انجام شده"
                : "این کار انجام نشده";


        statusBtn.innerHTML = `
            <span></span>
        `;


        // ====================================================
        // HEADER
        // ====================================================

        header.appendChild(brand);

        header.appendChild(statusBtn);


        // ====================================================
        // BODY
        // ====================================================

        const body =
            document.createElement("div");

        body.className =
            "daily-task-card-body";


        // ----------------------------------------------------
        // DESCRIPTION BOX
        // ----------------------------------------------------

        const descriptionBox =
            document.createElement("div");

        descriptionBox.className =
            "daily-task-description";


        if (task.description) {

            descriptionBox.innerHTML = `

                <i data-lucide="file-text"></i>

                <span></span>

            `;

            descriptionBox
                .querySelector("span")
                .textContent =
                task.description;

        }

        else {

            descriptionBox.innerHTML = `

                <i data-lucide="file-text"></i>

                <span>
                    بدون توضیحات
                </span>

            `;

        }


        // ----------------------------------------------------
        // TIME
        // ----------------------------------------------------

        const timeBox =
            document.createElement("div");

        timeBox.className =
            "daily-task-time";


        timeBox.innerHTML = `

            <div class="daily-time-item">

                <i data-lucide="play"></i>

                <div>

                    <small>
                        شروع
                    </small>

                    <strong>
                        ${task.start || "--:--"}
                    </strong>

                </div>

            </div>


            <div class="daily-time-divider"></div>


            <div class="daily-time-item">

                <i data-lucide="square"></i>

                <div>

                    <small>
                        پایان
                    </small>

                    <strong>
                        ${task.end || "--:--"}
                    </strong>

                </div>

            </div>

        `;


        body.appendChild(
            descriptionBox
        );

        body.appendChild(
            timeBox
        );


        // ====================================================
        // FOOTER
        // ====================================================

        const footer =
            document.createElement("div");

        footer.className =
            "daily-task-card-footer";


        // ----------------------------------------------------
        // CHECK
        // ----------------------------------------------------

        const checkBtn =
            document.createElement("button");

        checkBtn.type = "button";

        checkBtn.className =
            "daily-task-check";


        checkBtn.title =
            task.done
                ? "علامت‌گذاری به عنوان انجام نشده"
                : "انجام کار";


        checkBtn.innerHTML =
            task.done

            ? `<i data-lucide="check"></i>`

            : `<i data-lucide="check"></i>`;


        checkBtn.addEventListener(
            "click",
            () => {

                toggleTask(task.id);

            }
        );


        // ----------------------------------------------------
        // DELETE
        // ----------------------------------------------------

        const deleteBtn =
            document.createElement("button");

        deleteBtn.type = "button";

        deleteBtn.className =
            "daily-task-delete";


        deleteBtn.title =
            "حذف کار";


        deleteBtn.innerHTML = `
            <i data-lucide="trash-2"></i>
        `;


        deleteBtn.addEventListener(
            "click",
            () => {

                deleteTask(task.id);

            }
        );


        // ====================================================
        // FOOTER
        // ====================================================

        footer.appendChild(
            checkBtn
        );

        footer.appendChild(
            deleteBtn
        );


        // ====================================================
        // CARD
        // ====================================================

        card.appendChild(
            header
        );

        card.appendChild(
            body
        );

        card.appendChild(
            footer
        );


        taskList.appendChild(
            card
        );

    });


    // ========================================================
    // ICONS
    // ========================================================

    refreshIcons();

}    // ========================================================
    // TOGGLE TASK
    // ========================================================

    function toggleTask(id) {

        tasks =
            tasks.map(
                (task) => {

                    if (
                        task.id === id
                    ) {

                        return {
                            ...task,
                            done: !task.done
                        };

                    }

                    return task;

                }
            );


        saveTasks();

        renderTasks();

    }


    // ========================================================
    // DELETE TASK
    // ========================================================

    function deleteTask(id) {

        const task =
            tasks.find(
                item =>
                    item.id === id
            );


        if (!task) {

            return;

        }


        const confirmed =
            confirm(
                `آیا کار «${task.title}» حذف شود؟`
            );


        if (!confirmed) {

            return;

        }


        tasks =
            tasks.filter(
                item =>
                    item.id !== id
            );


        saveTasks();

        renderTasks();

    }


    // ========================================================
    // LIVE CLOCK
    // ========================================================

    function updateClock() {

        const now =
            new Date();


        liveClock.textContent =
            now.toLocaleTimeString(
                "fa-IR",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );

    }


    updateClock();

    setInterval(
        updateClock,
        1000
    );


    // ========================================================
    // TODAY DATE
    // ========================================================

    function updateTodayInfo() {

        const now =
            new Date();


        todayDate.textContent =
            now.toLocaleDateString(
                "fa-IR"
            );


        todayDay.textContent =
            now.toLocaleDateString(
                "fa-IR",
                {
                    weekday: "long"
                }
            );

    }


    updateTodayInfo();


    // ========================================================
    // REMOVE OLD TASKS
    // ========================================================

    function clearOldTasks() {

        const todayKey =
            getStorageKey();


        const keys =
            Object.keys(
                localStorage
            );


        keys.forEach(
            (key) => {

                if (
                    key.startsWith(
                        "dailyTasks_"
                    ) &&
                    key !== todayKey
                ) {

                    localStorage.removeItem(
                        key
                    );

                }

            }
        );

    }


    clearOldTasks();


    // ========================================================
    // DETECT NEW DAY
    // ========================================================

    let currentDay =
        getTodayKey();


    setInterval(
        () => {

            const newDay =
                getTodayKey();


            if (
                newDay !== currentDay
            ) {

                currentDay =
                    newDay;


                tasks =
                    loadTasks();


                clearOldTasks();

                updateTodayInfo();

                renderTasks();

            }

        },
        30000
    );


    // ========================================================
    // LUCIDE
    // ========================================================

    function refreshIcons() {

        if (
            window.lucide
        ) {

            lucide.createIcons();

        }

    }


    // ========================================================
    // INITIAL RENDER
    // ========================================================

    sortTasks();

    renderTasks();

    refreshIcons();


    console.log(
        "✅ Daily Task Manager Ready"
    );

});


















































































// ======================================================
// ⚙️ SETTINGS MODAL
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const settingsBtn =
            document.getElementById(
                "settingsBtn"
            );

        const settingsModal =
            document.getElementById(
                "settingsModal"
            );

        const settingsClose =
            document.getElementById(
                "settingsClose"
            );

        const settingsOverlay =
            document.getElementById(
                "settingsOverlay"
            );


        if (
            !settingsBtn ||
            !settingsModal
        ) {

            console.error(
                "❌ Settings elements پیدا نشدند."
            );

            return;

        }


        // ==================================================
        // OPEN
        // ==================================================

        function openSettings(){

            settingsModal.classList.add(
                "active"
            );

            document.body.style.overflow =
                "hidden";

            if(window.lucide){

                lucide.createIcons();

            }

        }


        // ==================================================
        // CLOSE
        // ==================================================

        function closeSettings(){

            settingsModal.classList.remove(
                "active"
            );

            document.body.style.overflow =
                "";

        }


        settingsBtn.addEventListener(
            "click",
            openSettings
        );


        if(settingsClose){

            settingsClose.addEventListener(
                "click",
                closeSettings
            );

        }


        if(settingsOverlay){

            settingsOverlay.addEventListener(
                "click",
                closeSettings
            );

        }


        // ==================================================
        // ESC
        // ==================================================

        document.addEventListener(
            "keydown",
            event => {

                if(
                    event.key === "Escape" &&
                    settingsModal.classList.contains(
                        "active"
                    )
                ){

                    closeSettings();

                }

            }
        );


        // ==================================================
        // SETTINGS MENU
        // ==================================================

        const menuItems =
            document.querySelectorAll(
                ".settings-menu-item"
            );

        const sections =
            document.querySelectorAll(
                ".settings-section"
            );


        menuItems.forEach(
            item => {

                item.addEventListener(
                    "click",
                    () => {

                        const target =
                            item.dataset
                                .settingsSection;


                        menuItems.forEach(
                            menu => {

                                menu.classList.remove(
                                    "active"
                                );

                            }
                        );


                        sections.forEach(
                            section => {

                                section.classList.remove(
                                    "active"
                                );

                            }
                        );


                        item.classList.add(
                            "active"
                        );


                        const targetSection =
                            document.getElementById(
                                `settings-section-${target}`
                            );


                        if(targetSection){

                            targetSection.classList.add(
                                "active"
                            );

                        }

                    }
                );

            }
        );


        // ==================================================
        // ICONS
        // ==================================================

        if(window.lucide){

            lucide.createIcons();

        }

    }
);



































// =====================================================
// SMART ASSISTANT SETTINGS — DATABASE SYNC
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        const settingsModal =
            document.getElementById(
                "settingsModal"
            );


        const settingsBtn =
            document.getElementById(
                "settingsBtn"
            );


        if(
            !settingsModal ||
            !settingsBtn
        ){

            console.error(
                "❌ SETTINGS ELEMENTS NOT FOUND"
            );

            return;

        }


        // =================================================
        // GET CURRENT USER
        // =================================================

        function getCurrentUser(){

            try{

                const savedUser =
                    localStorage.getItem(
                        "currentUser"
                    );

                if(!savedUser){

                    return null;

                }

                return JSON.parse(
                    savedUser
                );

            }
            catch(error){

                console.error(
                    "❌ CURRENT USER ERROR:",
                    error
                );

                return null;

            }

        }


        // =================================================
        // GET PHONE
        // =================================================

        function getUserPhone(){

            const user =
                getCurrentUser();

            return user?.phone || null;

        }


        // =================================================
        // LOAD SETTINGS
        // =================================================

        async function loadAISettings(){

            try{

                const phone =
                    getUserPhone();


                if(!phone){

                    console.error(
                        "❌ شماره کاربر پیدا نشد."
                    );

                    return;

                }


                console.log(
                    "⚙️ Loading AI settings..."
                );


                const response =
                    await fetch(

                        `${API_URL}/smart-assistant/settings/${phone}`

                    );


                const data =
                    await response.json();


                console.log(
                    "⚙️ AI SETTINGS:",
                    data
                );


                if(
                    !response.ok ||
                    !data.success
                ){

                    console.error(
                        "❌ دریافت تنظیمات ناموفق بود:",
                        data
                    );

                    return;

                }


                applyAISettings(
                    data.settings
                );

            }
            catch(error){

                console.error(
                    "❌ LOAD AI SETTINGS ERROR:",
                    error
                );

            }

        }


        // =================================================
        // APPLY SETTINGS TO UI
        // =================================================

        function applyAISettings(
            settings
        ){

            if(!settings){

                return;

            }


            const enabled =
                document.getElementById(
                    "aiEnabledSwitch"
                );


            const profile =
                document.getElementById(
                    "aiProfileSwitch"
                );


            const studyPlans =
                document.getElementById(
                    "aiStudyPlansSwitch"
                );


            const performance =
                document.getElementById(
                    "aiPerformanceSwitch"
                );


            const actions =
                document.getElementById(
                    "aiActionsSwitch"
                );


            if(enabled){

                enabled.checked =
                    settings.enabled === true;

            }


            if(profile){

                profile.checked =
                    settings.profile === true;

            }


            if(studyPlans){

                studyPlans.checked =
                    settings.studyPlans === true;

            }


            if(performance){

                performance.checked =
                    settings.performance === true;

            }


            if(actions){

                actions.checked =
                    settings.actions === true;

            }


            const accessLevel =
                settings.accessLevel ||
                "study";


            const accessRadio =
                document.querySelector(
                    `input[name="aiAccessLevel"][value="${accessLevel}"]`
                );


            if(accessRadio){

                accessRadio.checked =
                    true;

            }

        }


        // =================================================
        // SAVE SETTINGS
        // =================================================

        async function saveAISettings(){

            try{

                const phone =
                    getUserPhone();


                if(!phone){

                    console.error(
                        "❌ شماره کاربر پیدا نشد."
                    );

                    return;

                }


                const enabled =
                    document.getElementById(
                        "aiEnabledSwitch"
                    );


                const profile =
                    document.getElementById(
                        "aiProfileSwitch"
                    );


                const studyPlans =
                    document.getElementById(
                        "aiStudyPlansSwitch"
                    );


                const performance =
                    document.getElementById(
                        "aiPerformanceSwitch"
                    );


                const actions =
                    document.getElementById(
                        "aiActionsSwitch"
                    );


                const selectedAccess =
                    document.querySelector(
                        'input[name="aiAccessLevel"]:checked'
                    );


                const settings = {

                    enabled:
                        enabled?.checked === true,

                    accessLevel:
                        selectedAccess?.value ||
                        "study",

                    profile:
                        profile?.checked === true,

                    studyPlans:
                        studyPlans?.checked === true,

                    performance:
                        performance?.checked === true,

                    actions:
                        actions?.checked === true

                };


                console.log(
                    "💾 Saving AI settings:",
                    settings
                );


                const response =
                    await fetch(

                        `${API_URL}/smart-assistant/settings/${phone}`,

                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    settings
                                )

                        }

                    );


                const data =
                    await response.json();


                console.log(
                    "💾 SAVE RESPONSE:",
                    data
                );


                if(
                    !response.ok ||
                    !data.success
                ){

                    console.error(
                        "❌ ذخیره تنظیمات ناموفق بود:",
                        data
                    );

                    return;

                }


                // مقدار واقعی برگشتی سرور
                applyAISettings(
                    data.settings
                );


                console.log(
                    "✅ AI SETTINGS SAVED"
                );

            }
            catch(error){

                console.error(
                    "❌ SAVE AI SETTINGS ERROR:",
                    error
                );

            }

        }


        // =================================================
        // OPEN MODAL → LOAD FROM DATABASE
        // =================================================

        settingsBtn.addEventListener(
            "click",
            async () => {

                settingsModal.classList.add(
                    "active"
                );

                document.body.style.overflow =
                    "hidden";


                await loadAISettings();

            }
        );


        // =================================================
        // SWITCHES
        // =================================================

        const settingInputs =
            settingsModal.querySelectorAll(
                'input[type="checkbox"], input[name="aiAccessLevel"]'
            );


        settingInputs.forEach(
            input => {

                input.addEventListener(
                    "change",
                    async () => {

                        await saveAISettings();

                    }
                );

            }
        );


    }
);



































































// =====================================================
// AI ASSISTANT — BASIC BEHAVIOR
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const aiAssistant =
        document.getElementById("aiAssistant");

    const aiCharacter =
        document.getElementById("aiCharacter");

    const aiMessage =
        document.getElementById("aiMessage");

    const aiMessageText =
        document.getElementById("aiMessageText");

    if (
        !aiAssistant ||
        !aiCharacter ||
        !aiMessage ||
        !aiMessageText
    ) {

        console.error(
            "❌ AI Assistant: عناصر دستیار پیدا نشدند."
        );

        return;
    }


    // =================================================
    // TYPE MESSAGE
    // =================================================

    let typingTimer = null;

    function typeMessage(message){

        clearInterval(typingTimer);

        aiMessageText.textContent = "";

        let index = 0;

        typingTimer = setInterval(() => {

            if(index >= message.length){

                clearInterval(typingTimer);

                return;
            }

            aiMessageText.textContent +=
                message[index];

            index++;

        },35);
    }


    // =================================================
    // OPEN MESSAGE
    // =================================================

    function showAssistantMessage(){

        aiAssistant.classList.add(
            "show-message"
        );

        typeMessage(
            "سلام 👋 من دستیار هوشمندت هستم. هر وقت به کمک نیاز داشتی، من اینجام."
        );
    }


    // =================================================
    // CLOSE MESSAGE
    // =================================================

    function hideAssistantMessage(){

        aiAssistant.classList.remove(
            "show-message"
        );

        clearInterval(typingTimer);

        aiMessageText.textContent = "";
    }


    // =================================================
    // CLICK
    // =================================================

    aiCharacter.addEventListener(
        "click",
        () => {

            const isOpen =
                aiAssistant.classList.contains(
                    "show-message"
                );

            if(isOpen){

                hideAssistantMessage();

            }else{

                showAssistantMessage();

            }

        }
    );


    console.log(
        "🤖 AI Assistant Ready"
    );

});






























// =====================================================
// 🤖 SMART ASSISTANT — MAIN DASHBOARD
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const smartAssistant =
        document.getElementById("aiAssistant");

    const smartAssistantCharacter =
        document.getElementById("aiCharacter");

    const smartAssistantPanel =
        document.getElementById("aiChatPanel");

    const smartAssistantClose =
        document.getElementById("aiChatClose");

    const smartAssistantInput =
        document.getElementById("aiChatInput");

    const smartAssistantSend =
        document.getElementById("aiChatSend");

    const smartAssistantMessages =
        document.getElementById("aiChatMessages");


    // =================================================
    // CHECK
    // =================================================

    if (
        !smartAssistant ||
        !smartAssistantCharacter ||
        !smartAssistantPanel ||
        !smartAssistantClose ||
        !smartAssistantInput ||
        !smartAssistantSend ||
        !smartAssistantMessages
    ) {

        console.error(
            "❌ Smart Assistant: عناصر پیدا نشدند."
        );

        return;

    }


    // =================================================
    // STATE
    // =================================================

    let smartAssistantSending = false;

    let smartAssistantHistoryLoading = false;

    let smartAssistantHistoryLoaded = false;


    // =================================================
    // GET CURRENT USER PHONE
    // =================================================

    function getSmartAssistantPhone(){

        try{

            const savedUser =
                localStorage.getItem(
                    "currentUser"
                );


            if(!savedUser){

                return null;

            }


            const user =
                JSON.parse(
                    savedUser
                );


            return user?.phone || null;

        }

        catch(error){

            console.error(
                "❌ SMART ASSISTANT USER ERROR:",
                error
            );

            return null;

        }

    }


    // =================================================
    // OPEN CHAT
    // =================================================

    async function openSmartAssistantChat(){

        smartAssistantPanel.classList.add(
            "open"
        );


        smartAssistant.classList.remove(
            "show-message"
        );


        // ---------------------------------------------
        // LOAD HISTORY
        // ---------------------------------------------

        await loadSmartAssistantHistory();


        setTimeout(() => {

            smartAssistantInput.focus();

        }, 250);


        smartAssistantScroll();

    }


    // =================================================
    // CLOSE CHAT
    // =================================================

    function closeSmartAssistantChat(){

        smartAssistantPanel.classList.remove(
            "open"
        );


        smartAssistantInput.value = "";

    }


    // =================================================
    // CHARACTER CLICK
    // =================================================

    smartAssistantCharacter.addEventListener(
        "click",
        openSmartAssistantChat
    );


    // =================================================
    // CLOSE BUTTON
    // =================================================

    smartAssistantClose.addEventListener(
        "click",
        closeSmartAssistantChat
    );


    // =================================================
    // ADD USER MESSAGE
    // =================================================

    function addSmartAssistantUserMessage(
        text
    ){

        if(
            !text ||
            !String(text).trim()
        ){

            return;

        }


        const message =
            document.createElement(
                "div"
            );


        message.className =
            "ai-chat-message user";


        const bubble =
            document.createElement(
                "div"
            );


        bubble.className =
            "ai-chat-bubble";


        bubble.textContent =
            text;


        message.appendChild(
            bubble
        );


        smartAssistantMessages.appendChild(
            message
        );


        smartAssistantScroll();

    }


    // =================================================
    // SHOW TYPING
    // =================================================

    function showSmartAssistantTyping(){

        const message =
            document.createElement(
                "div"
            );


        message.className =
            "ai-chat-message assistant";


        message.innerHTML = `

            <div class="ai-chat-small-avatar">

                <img
                    src="images/ai-assistant.png"
                    alt="AI"
                >

            </div>

            <div class="ai-chat-bubble">

                <div class="ai-chat-typing">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            </div>

        `;


        smartAssistantMessages.appendChild(
            message
        );


        smartAssistantScroll();


        return message;

    }


    // =================================================
    // ADD AI MESSAGE
    // =================================================

    function addSmartAssistantMessage(
        text,
        typeEffect = true
    ){

        if(
            !text ||
            !String(text).trim()
        ){

            return;

        }


        text =
            String(text);


        const message =
            document.createElement(
                "div"
            );


        message.className =
            "ai-chat-message assistant";


        message.innerHTML = `

            <div class="ai-chat-small-avatar">

                <img
                    src="./01/e8ea2b32-26cb-45ed-94b3-2518bf447e50.png"
                    alt="AI"
                >

            </div>

            <div class="ai-chat-bubble"></div>

        `;


        const bubble =
            message.querySelector(
                ".ai-chat-bubble"
            );


        smartAssistantMessages.appendChild(
            message
        );


        // ---------------------------------------------
        // HISTORY MESSAGE
        // ---------------------------------------------

        if(!typeEffect){

            bubble.textContent =
                text;

            smartAssistantScroll();

            return;

        }


        // ---------------------------------------------
        // TYPE EFFECT
        // ---------------------------------------------

        let index = 0;


        const timer =
            setInterval(() => {

                if(
                    index >= text.length
                ){

                    clearInterval(
                        timer
                    );

                    return;

                }


                bubble.textContent +=
                    text[index];


                index++;


                smartAssistantScroll();

            }, 20);

    }


    // =================================================
    // LOAD SMART ASSISTANT HISTORY
    // =================================================

    async function loadSmartAssistantHistory(){

        // ---------------------------------------------
        // جلوگیری از درخواست همزمان
        // ---------------------------------------------

        if(
            smartAssistantHistoryLoading
        ){

            return;

        }


        smartAssistantHistoryLoading =
            true;


        try{

            // -----------------------------------------
            // GET PHONE
            // -----------------------------------------

            const phone =
                getSmartAssistantPhone();


            if(!phone){

                console.warn(
                    "⚠️ Smart Assistant history: شماره کاربر پیدا نشد."
                );

                return;

            }


            console.log(
                "🧠 Loading Smart Assistant history..."
            );


            // -----------------------------------------
            // REQUEST
            // -----------------------------------------

            const response =
                await fetch(

                    `${API_URL}/smart-assistant/history/${encodeURIComponent(phone)}`,

                    {

                        method:
                            "GET",

                        headers:{

                            "Content-Type":
                                "application/json"

                        }

                    }

                );


            // -----------------------------------------
            // RESPONSE
            // -----------------------------------------

            const data =
                await response.json();


            console.log(
                "🧠 SMART ASSISTANT HISTORY:",
                data
            );


            // -----------------------------------------
            // CHECK RESPONSE
            // -----------------------------------------

            if(
                !response.ok ||
                !data.success
            ){

                console.error(
                    "❌ Smart Assistant history error:",
                    data
                );

                return;

            }


            const messages =
                Array.isArray(
                    data.messages
                )
                    ? data.messages
                    : [];


            // -----------------------------------------
            // CLEAR CURRENT CHAT
            // -----------------------------------------

            smartAssistantMessages.innerHTML =
                "";


            // -----------------------------------------
            // BUILD HISTORY
            // -----------------------------------------

            messages.forEach(
                (message) => {

                    if(
                        !message ||
                        !message.content
                    ){

                        return;

                    }


                    const role =
                        message.role;


                    // -------------------------------
                    // USER
                    // -------------------------------

                    if(
                        role === "user"
                    ){

                        addSmartAssistantUserMessage(
                            message.content
                        );

                    }


                    // -------------------------------
                    // ASSISTANT
                    // -------------------------------

                    else if(
                        role === "assistant"
                    ){

                        addSmartAssistantMessage(
                            message.content,
                            false
                        );

                    }

                }
            );


            // -----------------------------------------
            // STATE
            // -----------------------------------------

            smartAssistantHistoryLoaded =
                true;


            smartAssistantScroll();


            console.log(
                "✅ Smart Assistant history loaded:",
                messages.length,
                "messages"
            );

        }

        catch(error){

            console.error(
                "❌ LOAD SMART ASSISTANT HISTORY ERROR:",
                error
            );

        }

        finally{

            smartAssistantHistoryLoading =
                false;

        }

    }


    // =================================================
    // NEW SMART ASSISTANT API
    // =================================================

    async function requestSmartAssistant(
        text
    ){

        try{

            // -----------------------------------------
            // GET CURRENT USER
            // -----------------------------------------

            const phone =
                getSmartAssistantPhone();


            // -----------------------------------------
            // CHECK USER
            // -----------------------------------------

            if(!phone){

                console.error(
                    "❌ SMART ASSISTANT: شماره کاربر پیدا نشد"
                );


                return {

                    ok:
                        false,

                    data:{

                        message:
                            "کاربر شناسایی نشد."

                    }

                };

            }


            console.log(
                "👤 SMART ASSISTANT USER:",
                phone
            );


            // -----------------------------------------
            // SEND REQUEST
            // -----------------------------------------

            const response =
                await fetch(

                    `${API_URL}/smart-assistant/message`,

                    {

                        method:
                            "POST",

                        headers:{

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                message:
                                    text,

                                phone:
                                    phone

                            })

                    }

                );


            // -----------------------------------------
            // RESPONSE
            // -----------------------------------------

            const data =
                await response.json();


            console.log(
                "🤖 SMART ASSISTANT RESPONSE:",
                data
            );


            return {

                ok:
                    response.ok,

                data:
                    data

            };

        }


        catch(error){

            console.error(
                "❌ SMART ASSISTANT REQUEST ERROR:",
                error
            );


            return {

                ok:
                    false,

                data:
                    null

            };

        }

    }


    // =================================================
    // SEND MESSAGE
    // =================================================

    async function sendSmartAssistantMessage(){

        const text =
            smartAssistantInput.value.trim();


        if(!text){

            return;

        }


        // ---------------------------------------------
        // جلوگیری از ارسال چند درخواست همزمان
        // ---------------------------------------------

        if(smartAssistantSending){

            return;

        }


        smartAssistantSending =
            true;


        smartAssistantSend.disabled =
            true;


        // ---------------------------------------------
        // USER MESSAGE
        // ---------------------------------------------

        addSmartAssistantUserMessage(
            text
        );


        smartAssistantInput.value =
            "";


        smartAssistantInput.focus();


        // ---------------------------------------------
        // TYPING
        // ---------------------------------------------

        const loading =
            showSmartAssistantTyping();


        try{

            // -----------------------------------------
            // REQUEST
            // -----------------------------------------

            const result =
                await requestSmartAssistant(
                    text
                );


            // -----------------------------------------
            // REMOVE TYPING
            // -----------------------------------------

            if(loading){

                loading.remove();

            }


            // -----------------------------------------
            // ERROR
            // -----------------------------------------

            if(
                !result ||
                !result.ok
            ){

                addSmartAssistantMessage(

                    "متأسفم 😕 فعلاً نتونستم به هوش مصنوعی وصل بشم."

                );

                return;

            }


            // -----------------------------------------
            // RESPONSE
            // -----------------------------------------

            const reply =
                result.data?.reply ||
                "پاسخی از دستیار دریافت نشد.";


            addSmartAssistantMessage(
                reply
            );

        }

        catch(error){

            console.error(
                "❌ SMART ASSISTANT ERROR:",
                error
            );


            if(loading){

                loading.remove();

            }


            addSmartAssistantMessage(

                "یک خطای غیرمنتظره رخ داد 😕"

            );

        }

        finally{

            smartAssistantSending =
                false;


            smartAssistantSend.disabled =
                false;

        }

    }


    // =================================================
    // SEND BUTTON
    // =================================================

    smartAssistantSend.addEventListener(
        "click",
        sendSmartAssistantMessage
    );


    // =================================================
    // ENTER
    // =================================================

    smartAssistantInput.addEventListener(
        "keydown",
        (event) => {

            if(
                event.key === "Enter" &&
                !event.shiftKey
            ){

                event.preventDefault();


                sendSmartAssistantMessage();

            }

        }
    );


    // =================================================
    // SCROLL
    // =================================================

    function smartAssistantScroll(){

        smartAssistantMessages.scrollTop =
            smartAssistantMessages.scrollHeight;

    }


    // =================================================
    // ESC
    // =================================================

    document.addEventListener(
        "keydown",
        (event) => {

            if(
                event.key === "Escape" &&
                smartAssistantPanel.classList.contains(
                    "open"
                )
            ){

                closeSmartAssistantChat();

            }

        }
    );


    // =================================================
    // READY
    // =================================================

    console.log(
        "🤖 Smart Assistant connected"
    );

});
























































































































































// =====================================================
// 🔄 LIVE SYNC ENGINE
// =====================================================
// هدف:
// - همگام‌سازی برنامه‌های هفتگی با سرور
// - بدون Refresh صفحه
// - فقط اعمال تغییرات واقعی
// - Sync هر 1 ثانیه
// - Sync فوری بعد از تغییرات
// - جلوگیری از درخواست‌های همزمان
// =====================================================

(function(){

    "use strict";


    // =================================================
    // CONFIG
    // =================================================

    const LIVE_SYNC_INTERVAL = 1000;


    // =================================================
    // STATE
    // =================================================

    let liveSyncTimer = null;

    let liveSyncRunning = false;

    let liveSyncStarted = false;

    let lastServerPlans = new Map();

    let firstSyncCompleted = false;


    // =================================================
    // GET CURRENT USER
    // =================================================

    function getLiveSyncUser(){

        try{

            const savedUser =
                localStorage.getItem(
                    "currentUser"
                );

            if(!savedUser){

                return null;

            }

            return JSON.parse(
                savedUser
            );

        }
        catch(error){

            console.error(
                "❌ LIVE SYNC USER ERROR:",
                error
            );

            return null;

        }

    }


    // =================================================
    // GET PHONE
    // =================================================

    function getLiveSyncPhone(){

        const user =
            getLiveSyncUser();

        return user?.phone || null;

    }


    // =================================================
    // CREATE PLAN SIGNATURE
    // =================================================
    // برای تشخیص اینکه یک برنامه واقعاً تغییر کرده
    // =================================================

    function getPlanSignature(plan){

        if(!plan){

            return "";

        }

        return JSON.stringify({

            _id:
                plan._id || "",

            phone:
                plan.phone || "",

            day:
                plan.day || "",

            subject:
                plan.subject || "",

            subjectName:
                plan.subjectName || "",

            icon:
                plan.icon || "",

            color:
                plan.color || "",

            title:
                plan.title || "",

            note:
                plan.note || "",

            duration:
                plan.duration ?? "",

            completed:
                plan.completed === true

        });

    }


    // =================================================
    // GET CURRENT DOM PLAN CARDS
    // =================================================

    function getCurrentPlanCards(){

        const cards =
            document.querySelectorAll(
                ".task-card"
            );

        const map =
            new Map();


        cards.forEach(
            card => {

                const id =
                    card.dataset.id;


                if(id){

                    map.set(
                        String(id),
                        card
                    );

                }

            }
        );


        return map;

    }


    // =================================================
    // FIND PLAN CARD
    // =================================================

    function findPlanCard(planId){

        if(!planId){

            return null;

        }

        const cards =
            document.querySelectorAll(
                ".task-card"
            );


        for(
            const card of cards
        ){

            if(
                String(card.dataset.id) ===
                String(planId)
            ){

                return card;

            }

        }


        return null;

    }


    // =================================================
    // UPDATE EXISTING CARD
    // =================================================

    function updatePlanCard(
        card,
        plan
    ){

        if(
            !card ||
            !plan
        ){

            return false;

        }


        const oldDay =
            card.dataset.day;


        const newDay =
            plan.day || oldDay;


        // ---------------------------------------------
        // UPDATE DATASET
        // ---------------------------------------------

        card.dataset.id =
            plan._id || card.dataset.id;

        card.dataset.subject =
            plan.subject || "";

        card.dataset.subjectName =
            plan.subjectName || "";

        card.dataset.icon =
            plan.icon || "book-open";

        card.dataset.color =
            plan.color || "#6366f1";

        card.dataset.day =
            newDay;

        card.dataset.duration =
            plan.duration ?? "";

        card.dataset.topic =
            plan.title || "";

        card.dataset.note =
            plan.note || "";

        card.dataset.completed =
            plan.completed === true
                ? "true"
                : "false";


        // ---------------------------------------------
        // COMPLETED
        // ---------------------------------------------

        if(
            plan.completed === true
        ){

            card.classList.add(
                "completed"
            );

        }
        else{

            card.classList.remove(
                "completed"
            );

        }


        // ---------------------------------------------
        // UPDATE CONTENT
        // ---------------------------------------------

        const subjectNameElement =
            card.querySelector(
                ".task-subject-name"
            );


        if(subjectNameElement){

            subjectNameElement.textContent =
                plan.subjectName || "بدون نام";

        }


        const topicElement =
            card.querySelector(
                ".task-topic"
            );


        if(topicElement){

            topicElement.textContent =
                plan.title || "-";

        }


        const timeElement =
            card.querySelector(
                ".task-time"
            );


        if(timeElement){

            if(
                plan.completed === true
            ){

                timeElement.innerHTML =
                    `
                    <i data-lucide="check"></i>
                    انجام شده
                    `;

            }
            else{

                timeElement.textContent =
                    `${plan.duration ?? "-"} مطالعه`;

            }

        }


        // ---------------------------------------------
        // UPDATE SUBJECT ICON
        // ---------------------------------------------

        const iconElement =
            card.querySelector(
                "[data-lucide]"
            );


        if(iconElement){

            iconElement.setAttribute(
                "data-lucide",
                plan.icon || "book-open"
            );

        }


        // ---------------------------------------------
        // MOVE CARD IF DAY CHANGED
        // ---------------------------------------------

        if(
            oldDay !== newDay
        ){

            const newContainer =
                document.querySelector(
                    `.day-tasks[data-tasks="${newDay}"]`
                );


            if(newContainer){

                newContainer.appendChild(
                    card
                );

            }

        }


        // ---------------------------------------------
        // REFRESH ICONS
        // ---------------------------------------------

        if(
            window.lucide
        ){

            lucide.createIcons();

        }


        return true;

    }


    // =================================================
    // ADD NEW PLAN CARD
    // =================================================

    function addPlanCard(
        plan
    ){

        if(!plan){

            return false;

        }


        const existingCard =
            findPlanCard(
                plan._id
            );


        if(existingCard){

            return updatePlanCard(
                existingCard,
                plan
            );

        }


        // از تابع اصلی خود سایت استفاده می‌کنیم
        // تا ظاهر کارت دقیقاً مثل کارت‌های فعلی باشد.

        if(
            typeof renderTaskFromDatabase ===
            "function"
        ){

            renderTaskFromDatabase(
                plan
            );


            const newCard =
                findPlanCard(
                    plan._id
                );


            if(newCard){

                updatePlanCard(
                    newCard,
                    plan
                );

            }


            return true;

        }


        console.warn(
            "⚠️ renderTaskFromDatabase پیدا نشد."
        );


        return false;

    }


    // =================================================
    // REMOVE PLAN CARD
    // =================================================

    function removePlanCard(
        planId
    ){

        const card =
            findPlanCard(
                planId
            );


        if(!card){

            return false;

        }


        // اگر کارت در حال مطالعه است،
        // reference را پاک نکنیم مگر واقعاً حذف شده باشد.

        if(
            typeof currentStudyingTaskCard !==
            "undefined" &&
            currentStudyingTaskCard === card
        ){

            try{

                currentStudyingTaskCard =
                    null;

            }
            catch(error){

                console.warn(
                    "⚠️ Could not clear current studying card."
                );

            }

        }


        card.remove();


        return true;

    }


    // =================================================
    // APPLY SERVER PLANS
    // =================================================

    function applyServerPlans(
        plans
    ){

        if(
            !Array.isArray(plans)
        ){

            return false;

        }


        let changed =
            false;


        const serverMap =
            new Map();


        // ---------------------------------------------
        // BUILD SERVER MAP
        // ---------------------------------------------

        plans.forEach(
            plan => {

                if(!plan?._id){

                    return;

                }


                const id =
                    String(
                        plan._id
                    );


                serverMap.set(
                    id,
                    plan
                );

            }
        );


        const currentDomCards =
            getCurrentPlanCards();


        // ---------------------------------------------
        // ADD / UPDATE
        // ---------------------------------------------

        serverMap.forEach(
            (
                plan,
                id
            ) => {

                const oldPlan =
                    lastServerPlans.get(
                        id
                    );


                const oldSignature =
                    oldPlan
                        ? getPlanSignature(
                            oldPlan
                        )
                        : null;


                const newSignature =
                    getPlanSignature(
                        plan
                    );


                const domCard =
                    currentDomCards.get(
                        id
                    );


                // برنامه جدید
                if(
                    !oldPlan
                ){

                    if(
                        addPlanCard(
                            plan
                        )
                    ){

                        changed =
                            true;

                    }

                    return;

                }


                // برنامه تغییر کرده
                if(
                    oldSignature !==
                    newSignature
                ){

                    if(
                        domCard
                    ){

                        if(
                            updatePlanCard(
                                domCard,
                                plan
                            )
                        ){

                            changed =
                                true;

                        }

                    }
                    else{

                        if(
                            addPlanCard(
                                plan
                            )
                        ){

                            changed =
                                true;

                        }

                    }

                }

            }
        );


        // ---------------------------------------------
        // REMOVE
        // ---------------------------------------------

        lastServerPlans.forEach(
            (
                oldPlan,
                id
            ) => {

                if(
                    !serverMap.has(
                        id
                    )
                ){

                    if(
                        removePlanCard(
                            id
                        )
                    ){

                        changed =
                            true;

                    }

                }

            }
        );


        // ---------------------------------------------
        // SAVE NEW CACHE
        // ---------------------------------------------

        lastServerPlans =
            serverMap;


        // ---------------------------------------------
        // REFRESH LESSONS ONLY IF NEEDED
        // ---------------------------------------------

        if(
            changed &&
            typeof refreshLessonsSection ===
            "function"
        ){

            refreshLessonsSection();

        }


        return changed;

    }


    // =================================================
    // FETCH PLANS
    // =================================================

    async function fetchLivePlans(){

        const phone =
            getLiveSyncPhone();


        if(!phone){

            return null;

        }


        if(
            typeof API_URL ===
            "undefined"
        ){

            console.error(
                "❌ API_URL برای Live Sync پیدا نشد."
            );

            return null;

        }


        try{

            const response =
                await fetch(

                    `${API_URL}/plans/${phone}`,

                    {
                        method:
                            "GET",

                        cache:
                            "no-store",

                        headers:{
                            "Cache-Control":
                                "no-cache"
                        }

                    }

                );


            if(
                !response.ok
            ){

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            const data =
                await response.json();


            if(
                !data ||
                data.success !== true
            ){

                throw new Error(
                    data?.message ||
                    "دریافت برنامه‌ها ناموفق بود."
                );

            }


            return Array.isArray(
                data.plans
            )
                ? data.plans
                : [];

        }
        catch(error){

            // اینجا عمداً Toast نمی‌زنیم
            // چون در حالت قطعی اینترنت نباید هر ثانیه Toast نمایش داده شود.

            console.warn(
                "⚠️ LIVE SYNC FETCH:",
                error.message
            );


            return null;

        }

    }


    // =================================================
    // MAIN SYNC
    // =================================================

    async function liveSync(){

        // اگر قبلاً Sync در حال اجراست
        // درخواست جدید ایجاد نکن.

        if(
            liveSyncRunning
        ){

            return;

        }


        // اگر اینترنت قطع است
        // درخواست بی‌دلیل نفرست.

        if(
            navigator.onLine === false
        ){

            return;

        }


        liveSyncRunning =
            true;


        try{

            const plans =
                await fetchLivePlans();


            if(
                plans === null
            ){

                return;

            }


            const changed =
                applyServerPlans(
                    plans
                );


            if(
                changed
            ){

                console.log(
                    "🔄 LIVE SYNC: تغییرات اعمال شد."
                );

            }


            if(
                !firstSyncCompleted
            ){

                firstSyncCompleted =
                    true;


                console.log(
                    "🟢 LIVE SYNC: اتصال اولیه انجام شد."
                );

            }

        }
        catch(error){

            console.error(
                "❌ LIVE SYNC ERROR:",
                error
            );

        }
        finally{

            liveSyncRunning =
                false;

        }

    }


    // =================================================
    // FORCE SYNC
    // =================================================
    // این تابع برای بعد از:
    // ADD
    // EDIT
    // DELETE
    // SMART ASSISTANT
    // استفاده می‌شود.
    // =================================================

    async function forceLiveSync(){

        console.log(
            "⚡ LIVE SYNC: فورس سینک..."
        );


        await liveSync();

    }


    // =================================================
    // START
    // =================================================

    function startLiveSync(){

        if(
            liveSyncStarted
        ){

            return;

        }


        liveSyncStarted =
            true;


        console.log(
            "🟢 LIVE SYNC ENGINE STARTED"
        );


        // Sync اولیه
        liveSync();


        // Sync هر 1 ثانیه
        liveSyncTimer =
            setInterval(
                () => {

                    liveSync();

                },
                LIVE_SYNC_INTERVAL
            );

    }


    // =================================================
    // STOP
    // =================================================

    function stopLiveSync(){

        if(
            liveSyncTimer
        ){

            clearInterval(
                liveSyncTimer
            );

            liveSyncTimer =
                null;

        }


        liveSyncStarted =
            false;


        console.log(
            "🔴 LIVE SYNC ENGINE STOPPED"
        );

    }


    // =================================================
    // ONLINE
    // =================================================

    window.addEventListener(
        "online",
        () => {

            console.log(
                "🌐 اینترنت وصل شد → LIVE SYNC"
            );


            forceLiveSync();

        }
    );


    // =================================================
    // OFFLINE
    // =================================================

    window.addEventListener(
        "offline",
        () => {

            console.log(
                "🔴 اینترنت قطع شد."
            );

        }
    );


    // =================================================
    // GLOBAL API
    // =================================================
    // برای استفاده از قسمت‌های دیگر 1.js
    // =================================================

    window.liveSyncNow =
        forceLiveSync;

    window.startLiveSync =
        startLiveSync;

    window.stopLiveSync =
        stopLiveSync;


    // =================================================
    // START AFTER DOM READY
    // =================================================

    if(
        document.readyState ===
        "loading"
    ){

        document.addEventListener(
            "DOMContentLoaded",
            () => {

                startLiveSync();

            },
            {
                once:true
            }
        );

    }
    else{

        startLiveSync();

    }


})();



















document.addEventListener("DOMContentLoaded",()=>{

    const aiAssistant =
        document.getElementById("aiAssistant");

    const aiMessage =
        document.getElementById("aiMessage");

    const aiMessageText =
        document.getElementById("aiMessageText");


    console.log("AI ELEMENTS:",{
        aiAssistant,
        aiMessage,
        aiMessageText
    });


    if(
        !aiAssistant ||
        !aiMessage ||
        !aiMessageText
    ){

        console.error(
            "SMART ASSISTANT ELEMENTS NOT FOUND"
        );

        return;
    }


    let typingTimer = null;

    let hideTimer = null;


    function getCurrentUser(){

        try{

            const savedUser =
                localStorage.getItem(
                    "currentUser"
                );


            if(!savedUser){
                return null;
            }


            return JSON.parse(
                savedUser
            );

        }
        catch(error){

            console.warn(
                "⚠️ ASSISTANT USER ERROR:",
                error
            );

            return null;

        }

    }


    function hideSmartAssistantMessage(){

        clearTimeout(
            typingTimer
        );

        clearTimeout(
            hideTimer
        );


        aiMessage.classList.remove(
            "show"
        );


        aiAssistant.classList.remove(
            "message-active"
        );

    }


    function showSmartAssistantMessage(
        message,
        duration = 8000,
        saveMessage = false
    ){

        clearTimeout(
            typingTimer
        );

        clearTimeout(
            hideTimer
        );


        if(!message){
            return;
        }


        aiMessageText.textContent =
            "";


        aiMessage.classList.add(
            "show"
        );


        aiAssistant.classList.add(
            "message-active"
        );


        let index = 0;


        function typeText(){

            if(index >= message.length){

                if(saveMessage){

                    saveAssistantMessage(
                        message
                    );

                }


                hideTimer =
                    setTimeout(
                        hideSmartAssistantMessage,
                        duration
                    );


                return;
            }


            aiMessageText.textContent +=
                message[index];


            index++;


            typingTimer =
                setTimeout(
                    typeText,
                    35
                );

        }


        typeText();

    }


    async function saveAssistantMessage(
        message
    ){

        try{

            const user =
                getCurrentUser();


            const phone =
                user?.phone;


            if(!phone){
                return;
            }


            if(
                typeof API_URL ===
                "undefined"
            ){

                console.error(
                    "❌ API_URL پیدا نشد."
                );

                return;

            }


            const response =
                await fetch(
                    `${API_URL}/smart-assistant/proactive`,
                    {
                        method:"POST",

                        headers:{
                            "Content-Type":
                                "application/json"
                        },

                        body:JSON.stringify({
                            phone:phone,
                            message:message
                        })
                    }
                );


            const result =
                await response.json();


            if(!response.ok){

                throw new Error(
                    result?.message ||
                    `HTTP ${response.status}`
                );

            }


            console.log(
                "💾 SMART ASSISTANT MESSAGE SAVED"
            );

        }
        catch(error){

            console.warn(
                "⚠️ SMART ASSISTANT SAVE ERROR:",
                error
            );

        }

    }


    window.showSmartAssistantMessage =
        showSmartAssistantMessage;


    window.hideSmartAssistantMessage =
        hideSmartAssistantMessage;


    window.saveAssistantMessage =
        saveAssistantMessage;


    console.log(
        "🤖 SMART ASSISTANT UI READY"
    );

});



(function(){

    "use strict";


    const assistantEvents = [];

    const MAX_EVENTS = 30;


    function getCurrentUser(){

        try{

            const savedUser =
                localStorage.getItem(
                    "currentUser"
                );


            if(!savedUser){
                return null;
            }


            return JSON.parse(
                savedUser
            );

        }
        catch(error){

            console.warn(
                "⚠️ ASSISTANT USER ERROR:",
                error
            );

            return null;

        }

    }


    function assistantEvent(
        type,
        data = {}
    ){

        const event = {

            type:type,

            data:data,

            time:
                new Date()
                    .toISOString(),

            phone:
                getCurrentUser()?.phone ||
                null

        };


        assistantEvents.push(
            event
        );


        if(
            assistantEvents.length >
            MAX_EVENTS
        ){

            assistantEvents.shift();

        }


        console.log(
            "🤖 ASSISTANT EVENT:",
            event
        );


        processAssistantEvent(
            event
        );

    }


    function getAssistantEvents(){

        return [
            ...assistantEvents
        ];

    }


    function processAssistantEvent(
        event
    ){

        if(!event){
            return;
        }


        switch(
            event.type
        ){

            case "PLAN_CREATED":

                console.log(
                    "📚 برنامه جدید ایجاد شد:",
                    event.data
                );

                break;


            case "PLAN_UPDATED":

                console.log(
                    "✏️ برنامه ویرایش شد:",
                    event.data
                );

                break;


            case "PLAN_DELETED":

                console.log(
                    "🗑️ برنامه حذف شد:",
                    event.data
                );

                break;


            case "PLAN_COMPLETED":

                console.log(
                    "✅ برنامه تکمیل شد:",
                    event.data
                );

                break;


            case "STUDY_STARTED":

                console.log(
                    "▶️ مطالعه شروع شد:",
                    event.data
                );

                break;


            case "STUDY_PAUSED":

                console.log(
                    "⏸️ مطالعه متوقف شد:",
                    event.data
                );

                break;


            case "STUDY_FINISHED":

                console.log(
                    "⏱️ مطالعه تمام شد:",
                    event.data
                );

                break;


            default:

                console.log(
                    "ℹ️ رویداد دستیار:",
                    event.type
                );

        }

    }


    window.assistantEvent =
        assistantEvent;


    window.getAssistantEvents =
        getAssistantEvents;


})();


(function(){

    "use strict";


    const assistantEvents = [];

    const MAX_EVENTS = 30;


    let eventRequestRunning = false;


    function getCurrentUser(){

        try{

            const savedUser =
                localStorage.getItem(
                    "currentUser"
                );


            if(!savedUser){
                return null;
            }


            return JSON.parse(
                savedUser
            );

        }
        catch(error){

            console.warn(
                "⚠️ ASSISTANT USER ERROR:",
                error
            );

            return null;

        }

    }


    async function triggerSmartAssistantProactive(
        event
    ){

        if(!event){
            return;
        }


        if(eventRequestRunning){

            console.log(
                "⏳ SMART ASSISTANT EVENT REQUEST ALREADY RUNNING"
            );

            return;

        }


        const user =
            getCurrentUser();


        const phone =
            user?.phone;


        if(!phone){

            console.warn(
                "⚠️ SMART ASSISTANT EVENT: USER PHONE NOT FOUND"
            );

            return;

        }


        if(
            typeof API_URL ===
            "undefined"
        ){

            console.error(
                "❌ API_URL برای Smart Assistant پیدا نشد."
            );

            return;

        }


        try{

            eventRequestRunning =
                true;


            console.log(
                "🚀 SMART ASSISTANT EVENT → BACKEND:",
                event.type
            );


            const response =
                await fetch(

                    `${API_URL}/smart-assistant/proactive/check`,

                    {

                        method:
                            "POST",

                        headers:{
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                phone:
                                    phone,

                                event:
                                    event.type,

                                eventData:
                                    event.data || {}

                            })

                    }

                );


            const data =
                await response.json();


            if(!response.ok){

                throw new Error(

                    data?.message ||
                    `HTTP ${response.status}`

                );

            }


            console.log(
                "🤖 EVENT PROACTIVE RESULT:",
                data
            );


            if(
                data.success === true &&
                data.shouldSpeak === true &&
                data.message
            ){

                if(
                    typeof window.showSmartAssistantMessage ===
                    "function"
                ){

                    window.showSmartAssistantMessage(

                        data.message,

                        8000,

                        false

                    );

                }

            }

        }
        catch(error){

            console.warn(
                "⚠️ SMART ASSISTANT EVENT ERROR:",
                error
            );

        }
        finally{

            eventRequestRunning =
                false;

        }

    }


    function assistantEvent(
        type,
        data = {}
    ){

        if(
            !type ||
            typeof type !== "string"
        ){

            console.warn(
                "⚠️ SMART ASSISTANT EVENT TYPE INVALID"
            );

            return;

        }


        const event = {

            type:
                type,

            data:
                data,

            time:
                new Date()
                    .toISOString(),

            phone:
                getCurrentUser()?.phone ||
                null

        };


        assistantEvents.push(
            event
        );


        if(
            assistantEvents.length >
            MAX_EVENTS
        ){

            assistantEvents.shift();

        }


        console.log(
            "🤖 ASSISTANT EVENT:",
            event
        );


        processAssistantEvent(
            event
        );


        triggerSmartAssistantProactive(
            event
        );

    }


    function getAssistantEvents(){

        return [
            ...assistantEvents
        ];

    }


    function processAssistantEvent(
        event
    ){

        if(!event){
            return;
        }


        switch(
            event.type
        ){

            case "PLAN_CREATED":

                console.log(
                    "📚 برنامه جدید ایجاد شد:",
                    event.data
                );

                break;


            case "PLAN_UPDATED":

                console.log(
                    "✏️ برنامه ویرایش شد:",
                    event.data
                );

                break;


            case "PLAN_DELETED":

                console.log(
                    "🗑️ برنامه حذف شد:",
                    event.data
                );

                break;


            case "PLAN_COMPLETED":

                console.log(
                    "✅ برنامه تکمیل شد:",
                    event.data
                );

                break;


            case "STUDY_STARTED":

                console.log(
                    "▶️ مطالعه شروع شد:",
                    event.data
                );

                break;


            case "STUDY_PAUSED":

                console.log(
                    "⏸️ مطالعه متوقف شد:",
                    event.data
                );

                break;


            case "STUDY_FINISHED":

                console.log(
                    "⏱️ مطالعه تمام شد:",
                    event.data
                );

                break;


            default:

                console.log(
                    "ℹ️ رویداد دستیار:",
                    event.type
                );

        }

    }


    window.assistantEvent =
        assistantEvent;


    window.getAssistantEvents =
        getAssistantEvents;


    window.triggerSmartAssistantProactive =
        triggerSmartAssistantProactive;


})();


















































document.addEventListener("DOMContentLoaded",()=>{

    const character =
        document.querySelector(".ai-character");


    if(!character) return;


    /* هر 10 ثانیه */

    setInterval(()=>{


        /* حرکت توجه */

        character.classList.remove(
            "ai-attention"
        );


        /* مجبور می‌کنیم انیمیشن دوباره اجرا شود */

        void character.offsetWidth;


        character.classList.add(
            "ai-attention"
        );


        /* بعد از تمام شدن حرکت،
           دوباره حالت شناور عادی */

        setTimeout(()=>{

            character.classList.remove(
                "ai-attention"
            );

        },1600);


    },10000);

});





document.addEventListener("DOMContentLoaded",()=>{

    const aiImage =
        document.querySelector(".ai-character img");


    if(!aiImage) return;


    let lastScrollY =
        window.scrollY;

    let scrollTimeout;


    window.addEventListener(
        "scroll",
        ()=>{


            const currentScrollY =
                window.scrollY;


            /* =========================
               تشخیص جهت اسکرول
            ========================= */

            if(currentScrollY > lastScrollY){

                aiImage.classList.remove(
                    "ai-scroll-up"
                );

                void aiImage.offsetWidth;

                aiImage.classList.add(
                    "ai-scroll-down"
                );

            }

            else if(currentScrollY < lastScrollY){

                aiImage.classList.remove(
                    "ai-scroll-down"
                );

                void aiImage.offsetWidth;

                aiImage.classList.add(
                    "ai-scroll-up"
                );

            }


            lastScrollY =
                currentScrollY;


            /* =========================
               پاک کردن کلاس
            ========================= */

            clearTimeout(scrollTimeout);


            scrollTimeout =
                setTimeout(()=>{

                    aiImage.classList.remove(
                        "ai-scroll-down",
                        "ai-scroll-up"
                    );

                },700);


        },
        {
            passive:true
        }

    );

});

