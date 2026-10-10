
/* =========================================
   TODAY DASHBOARD — CLOCK & DATE
========================================= */

(() => {
    "use strict";

    function initTodayDashboard() {
        const clockElement =
            document.getElementById("todayLiveClock");

        const weekdayElement =
            document.getElementById("todayWeekday");

        const dateElement =
            document.getElementById("todayFullDate");

        if (!clockElement || !weekdayElement || !dateElement) {
            return;
        }

        const weekdayFormatter = new Intl.DateTimeFormat(
            "fa-IR",
            {
                weekday: "long",
                timeZone: "Asia/Tehran"
            }
        );

        const dateFormatter = new Intl.DateTimeFormat(
            "fa-IR-u-ca-persian",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "Asia/Tehran"
            }
        );

        const clockFormatter = new Intl.DateTimeFormat(
            "fa-IR",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
                timeZone: "Asia/Tehran"
            }
        );

        function updateTodayDateTime() {
            const now = new Date();

            weekdayElement.textContent =
                weekdayFormatter.format(now);

            dateElement.textContent =
                dateFormatter.format(now);

            clockElement.textContent =
                clockFormatter.format(now);
        }

        updateTodayDateTime();

        if (window.todayClockInterval) {
            clearInterval(window.todayClockInterval);
        }

        window.todayClockInterval = setInterval(
            updateTodayDateTime,
            1000
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initTodayDashboard,
            { once: true }
        );
    } else {
        initTodayDashboard();
    }
})();
























/* =========================================
WORKSPACE NAVIGATION
مدیریت تب‌های فضای کار
========================================= */

(() => {
"use strict";

function initWorkspaceNavigation() {

    const sidebar = document.querySelector(
        ".workspace-sidebar .sidebar-navigation"
    );

    const content = document.querySelector(
        ".workspace-content"
    );

    if (!sidebar || !content) {
        console.warn(
            "Workspace Navigation: sidebar یا content پیدا نشد."
        );
        return;
    }

    const links = Array.from(
        sidebar.querySelectorAll(
            'a.sidebar-link[href^="#"]'
        )
    );

    const pages = Array.from(
        content.querySelectorAll(
            ":scope > .workspace-page"
        )
    );

    if (!links.length || !pages.length) {
        console.warn(
            "Workspace Navigation: لینک یا صفحه‌ای پیدا نشد."
        );
        return;
    }

    // ساخت فهرست صفحه‌ها بر اساس شناسه
    const pageMap = new Map();

    pages.forEach(page => {
        if (page.id) {
            pageMap.set(page.id, page);
        }
    });

    // جلوگیری از اجرای چندباره کد ناوبری
    if (sidebar.dataset.navigationReady === "true") {
        return;
    }

    sidebar.dataset.navigationReady = "true";

    // نمایش صفحه انتخاب‌شده
    function showPage(id, updateAddress = true) {

        const targetPage = pageMap.get(id);

        // اگر شناسه معتبر نبود، صفحه امروز را انتخاب کن
        const pageToShow =
            targetPage || pageMap.get("today");

        if (!pageToShow) {
            console.warn(
                "Workspace Navigation: صفحه today وجود ندارد."
            );
            return;
        }

        const activeId = pageToShow.id;

        // به‌روزرسانی تمام صفحه‌ها
        pages.forEach(page => {

            const isActive = page === pageToShow;

            page.classList.toggle(
                "active",
                isActive
            );

            page.setAttribute(
                "aria-hidden",
                String(!isActive)
            );

            if (isActive) {
                page.removeAttribute("inert");
            } else {
                page.setAttribute("inert", "");
            }
        });

        // به‌روزرسانی منوی کناری
        links.forEach(link => {

            const linkId = link
                .getAttribute("href")
                .slice(1);

            const isActive = linkId === activeId;

            link.classList.toggle(
                "active",
                isActive
            );

            if (isActive) {
                link.setAttribute(
                    "aria-current",
                    "page"
                );
            } else {
                link.removeAttribute(
                    "aria-current"
                );
            }
        });

        // هماهنگ‌سازی آدرس مرورگر
        if (updateAddress) {

            const newHash = "#" + activeId;

            if (window.location.hash !== newHash) {
                history.replaceState(
                    null,
                    "",
                    newHash
                );
            }
        }
    }

    // مدیریت کلیک‌های منوی کناری
    sidebar.addEventListener("click", event => {

        const link = event.target.closest(
            'a.sidebar-link[href^="#"]'
        );

        if (!link || !sidebar.contains(link)) {
            return;
        }

        const id = link
            .getAttribute("href")
            .slice(1);

        // فقط لینک‌هایی که صفحه معتبر دارند
        // توسط سیستم تب‌ها مدیریت می‌شوند.
        if (!pageMap.has(id)) {
            return;
        }

        event.preventDefault();

        showPage(id);
    });

    // پشتیبانی از عقب و جلو مرورگر
    window.addEventListener("popstate", () => {

        const id = window.location.hash.slice(1);

        showPage(
            pageMap.has(id) ? id : "today",
            false
        );
    });

    // انتخاب صفحه اولیه
    const initialId =
        window.location.hash.slice(1);

    showPage(
        pageMap.has(initialId)
            ? initialId
            : "today",
        false
    );
}

// اجرا پس از آماده‌شدن HTML
if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initWorkspaceNavigation,
        { once: true }
    );

} else {

    initWorkspaceNavigation();

}


})();





















/* =========================================
   WEEKLY CALENDAR
========================================= */

(() => {
    "use strict";

    const initWeeklyCalendar = () => {

        const calendar = document.getElementById("calendar");

        if (!calendar) return;

        const weekBar = calendar.querySelector("#calendarWeekBar");
        const selectedDayTitle = calendar.querySelector("#calendarSelectedDay");
        const subtitle = calendar.querySelector("#calendarScheduleSubtitle");
        const planCount = calendar.querySelector("#calendarPlanCount");
        const scheduleList = calendar.querySelector("#calendarScheduleList");

        if (
            !weekBar ||
            !selectedDayTitle ||
            !subtitle ||
            !planCount ||
            !scheduleList
        ) {
            console.warn("Weekly calendar: عناصر تقویم پیدا نشدند.");
            return;
        }

        const dayNames = {
            saturday: "شنبه",
            sunday: "یکشنبه",
            monday: "دوشنبه",
            tuesday: "سه‌شنبه",
            wednesday: "چهارشنبه",
            thursday: "پنجشنبه",
            friday: "جمعه"
        };

        /*
         * برنامه‌های نمونه را می‌توانی بعداً
         * در آرایه مربوط به هر روز وارد کنی.
         *
         * مثال:
         * saturday: [
         *     {
         *         title: "مطالعه فیزیک",
         *         time: "08:00",
         *         description: "دیدن ویدئو و حل تست"
         *     }
         * ]
         */

        const calendarPlans = {
            saturday: [],
            sunday: [],
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: []
        };

        const escapeHTML = (value) => {
            return String(value ?? "").replace(/[&<>"']/g, (char) => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[char]);
        };

        const renderPlans = (day) => {

            const plans = calendarPlans[day] || [];
            const dayName = dayNames[day] || "روز انتخاب‌شده";

            selectedDayTitle.textContent = `برنامه‌های ${dayName}`;
            subtitle.textContent = `برنامه‌های روز ${dayName} در یک نگاه`;

            planCount.textContent = `${plans.length.toLocaleString("fa-IR")} برنامه`;

            if (plans.length === 0) {
                scheduleList.innerHTML = `
                    <div class="calendar-empty-state">
                        <span class="calendar-empty-icon">
                            <i class="fa-regular fa-calendar-xmark"></i>
                        </span>

                        <strong>هنوز برنامه‌ای ثبت نشده</strong>

                        <p>
                            برای روز ${escapeHTML(dayName)} هنوز برنامه‌ای وجود ندارد.
                        </p>
                    </div>
                `;

                return;
            }

            scheduleList.innerHTML = plans.map((plan) => `
                <article class="calendar-plan-item">

                    <div class="calendar-plan-time" dir="ltr">
                        ${escapeHTML(plan.time || "بدون زمان")}
                    </div>

                    <div class="calendar-plan-details">
                        <h4>${escapeHTML(plan.title || "برنامه بدون عنوان")}</h4>
                        <p>${escapeHTML(plan.description || "توضیحی ثبت نشده است.")}</p>
                    </div>

                </article>
            `).join("");
        };

        weekBar.addEventListener("click", (event) => {

            const button = event.target.closest(".calendar-day");

            if (!button || !weekBar.contains(button)) return;

            const day = button.dataset.day;

            if (!Object.prototype.hasOwnProperty.call(dayNames, day)) {
                return;
            }

            weekBar.querySelectorAll(".calendar-day").forEach((dayButton) => {

                const isActive = dayButton === button;

                dayButton.classList.toggle("active", isActive);
                dayButton.setAttribute("aria-pressed", String(isActive));

            });

            renderPlans(day);
        });

        const initialButton = weekBar.querySelector(".calendar-day.active")
            || weekBar.querySelector(".calendar-day");

        if (initialButton) {
            renderPlans(initialButton.dataset.day);
        }

    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initWeeklyCalendar, {
            once: true
        });
    } else {
        initWeeklyCalendar();
    }

})();

