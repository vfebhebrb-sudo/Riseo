/* =========================================================
   PLANNER BRAIN
   Version: 1.0.0
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIG
    ===================================================== */

    const STORAGE_KEY = "daily_planner_data_v2";
    const CHAT_STORAGE_KEY = "planner_brain_chat";

    const DAY_START = 0;
    const DAY_END = 1440;


    /* =====================================================
       DOM
    ===================================================== */

    const DOM = {

        status: document.getElementById("dp-brain-status"),

        generateButton:
            document.getElementById("dp-generate-plan"),

        refreshButton:
            document.getElementById("dp-ai-plan-refresh"),

        planDate:
            document.getElementById("dp-plan-date"),

        planSummary:
            document.getElementById("dp-ai-plan-summary"),

        planState:
            document.getElementById("dp-plan-state"),

        planContent:
            document.getElementById("dp-ai-plan-content"),

        planEmpty:
            document.getElementById("dp-ai-plan-empty"),

        planList:
            document.getElementById("dp-ai-plan-list"),

        command:
            document.getElementById("dp-brain-command"),

        commandSend:
            document.getElementById("dp-brain-command-send"),

        chatMessages:
            document.getElementById("dp-brain-chat-messages"),

        chatInput:
            document.getElementById("dp-brain-chat-input"),

        chatSend:
            document.getElementById("dp-brain-chat-send"),

        clearChat:
            document.getElementById("dp-brain-clear-chat"),

        footer:
            document.getElementById("dp-brain-footer-text")
    };


    /* =====================================================
       STATE
    ===================================================== */

    const State = {

        currentContext: null,

        currentPlan: null,

        chat: loadChat(),

        preferences: {

            lighter: false,

            moreBreaks: false,

            extraMath: false

        }
    };


    /* =====================================================
       BASIC HELPERS
    ===================================================== */

    function pad(number) {

        return String(number).padStart(2, "0");

    }


    function getToday() {

        const now = new Date();

        return {

            date:
                `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,

            currentTime:
                `${pad(now.getHours())}:${pad(now.getMinutes())}`,

            hour: now.getHours(),

            minute: now.getMinutes(),

            timestamp: now.toISOString()

        };

    }


    function timeToMinutes(time) {

        if (!time || typeof time !== "string") {
            return 0;
        }

        const parts = time.split(":");

        const hour = Number(parts[0]) || 0;
        const minute = Number(parts[1]) || 0;

        return hour * 60 + minute;

    }


    function minutesToTime(minutes) {

        minutes = Math.max(
            0,
            Math.min(DAY_END, Math.round(minutes))
        );

        const hour =
            Math.floor(minutes / 60);

        const minute =
            minutes % 60;

        return `${pad(hour)}:${pad(minute)}`;

    }


    function getPersianDayName(date = new Date()) {

        const days = [

            "یکشنبه",
            "دوشنبه",
            "سه‌شنبه",
            "چهارشنبه",
            "پنجشنبه",
            "جمعه",
            "شنبه"

        ];

        return days[date.getDay()];

    }


    /* =====================================================
       LOAD PLANNER DATA
    ===================================================== */

    function loadPlannerData() {

        try {

            const raw =
                localStorage.getItem(STORAGE_KEY);

            if (!raw) {

                return {

                    monthPlans: [],
                    dayPlans: [],
                    events: []

                };

            }

            const data = JSON.parse(raw);

            return {

                monthPlans:
                    Array.isArray(data.monthPlans)
                        ? data.monthPlans
                        : [],

                dayPlans:
                    Array.isArray(data.dayPlans)
                        ? data.dayPlans
                        : [],

                events:
                    Array.isArray(data.events)
                        ? data.events
                        : []

            };

        } catch (error) {

            console.error(
                "Planner Brain: failed to load planner data",
                error
            );

            return {

                monthPlans: [],
                dayPlans: [],
                events: []

            };

        }

    }


    /* =====================================================
       MAIN CONTEXT ENGINE
       ===================================================== */

    function getPlannerDayContext() {

        const now = new Date();

        const today = getToday();

        const plannerData =
            loadPlannerData();

        return {

            date: today.date,

            dayOfWeek:
                getPersianDayName(now),

            currentTime:
                today.currentTime,

            currentHour:
                today.hour,

            currentMinute:
                today.minute,

            currentDateTime:
                today.timestamp,

            dayStart: "00:00",

            dayEnd: "23:59",

            fullDay: {

                start: "00:00",

                end: "23:59",

                totalMinutes: 1440

            },

            monthPlans:
                plannerData.monthPlans,

            dayPlans:
                plannerData.dayPlans,

            events:
                plannerData.events,

            plannerState: {

                generated: Boolean(State.currentPlan),

                generatedAt:
                    State.currentPlan?.generatedAt || null

            }

        };

    }


    /* =====================================================
       DAY MATCHING
       ===================================================== */

    function monthPlanAppliesToday(plan, dayName) {

        if (!plan) {
            return false;
        }

        const days = String(
            plan.days || ""
        ).trim();

        if (!days) {
            return false;
        }

        if (
            days.includes("هر روز") ||
            days.includes("روز")
        ) {

            return true;

        }

        return days.includes(dayName);

    }


    /* =====================================================
       NORMALIZE TASK
    ===================================================== */

    function normalizeTask(item, type) {

        const duration =
            Number(item.duration) || 30;

        return {

            id:
                item.id ||
                `${type}-${Date.now()}-${Math.random()}`,

            title:
                item.title ||
                "فعالیت بدون عنوان",

            description:
                item.description ||
                "",

            start:
                item.time ||
                "08:00",

            duration,

            end:
                minutesToTime(
                    timeToMinutes(item.time || "08:00")
                    + duration
                ),

            type,

            source: type

        };

    }


    /* =====================================================
       COLLECT TODAY'S TASKS
       ===================================================== */

    function collectTasks(context) {

        const tasks = [];


        /* -----------------------------------------------
           DAILY FIXED
        ------------------------------------------------ */

        for (const item of context.dayPlans) {

            tasks.push(
                normalizeTask(
                    item,
                    "study"
                )
            );

        }


        /* -----------------------------------------------
           MONTHLY FIXED
        ------------------------------------------------ */

        for (const item of context.monthPlans) {

            if (
                monthPlanAppliesToday(
                    item,
                    context.dayOfWeek
                )
            ) {

                tasks.push(
                    normalizeTask(
                        item,
                        "study"
                    )
                );

            }

        }


        /* -----------------------------------------------
           EVENTS
        ------------------------------------------------ */

        for (const item of context.events) {

            tasks.push(
                normalizeTask(
                    item,
                    "event"
                )
            );

        }


        return tasks;

    }


    /* =====================================================
       SORT
    ===================================================== */

    function sortTasks(tasks) {

        return [...tasks].sort(

            (a, b) =>
                timeToMinutes(a.start)
                -
                timeToMinutes(b.start)

        );

    }


    /* =====================================================
       CONFLICT ENGINE
    ===================================================== */

    function detectConflicts(tasks) {

        const conflicts = [];

        const sorted =
            sortTasks(tasks);


        for (
            let i = 0;
            i < sorted.length - 1;
            i++
        ) {

            const current =
                sorted[i];

            const next =
                sorted[i + 1];

            const currentEnd =
                timeToMinutes(current.end);

            const nextStart =
                timeToMinutes(next.start);


            if (currentEnd > nextStart) {

                conflicts.push({

                    first: current.id,

                    second: next.id,

                    message:
                        `تداخل بین «${current.title}» و «${next.title}»`

                });

            }

        }


        return conflicts;

    }


    /* =====================================================
       PLAN GENERATOR
       ===================================================== */

    function generatePlan() {

        const context =
            getPlannerDayContext();

        const rawTasks =
            collectTasks(context);

        const conflicts =
            detectConflicts(rawTasks);

        let tasks =
            sortTasks(rawTasks);


        /* -----------------------------------------------
           REMOVE DUPLICATES
        ------------------------------------------------ */

        const seen = new Set();

        tasks = tasks.filter(task => {

            const key =
                `${task.title}-${task.start}-${task.duration}`;

            if (seen.has(key)) {
                return false;
            }

            seen.add(key);

            return true;

        });


        /* -----------------------------------------------
           APPLY USER PREFERENCES
        ------------------------------------------------ */

        if (State.preferences.lighter) {

            tasks =
                makePlanLighter(tasks);

        }


        if (State.preferences.extraMath) {

            tasks =
                prioritizeMath(tasks);

        }


        /* -----------------------------------------------
           INSERT BREAKS
        ------------------------------------------------ */

        if (
            State.preferences.moreBreaks ||
            tasks.length > 1
        ) {

            tasks =
                insertBreaks(tasks);

        }


        const finalPlan = {

            date:
                context.date,

            dayOfWeek:
                context.dayOfWeek,

            generatedAt:
                new Date().toISOString(),

            schedule:
                tasks,

            conflicts,

            notes: []

        };


        State.currentContext =
            context;

        State.currentPlan =
            finalPlan;


        return finalPlan;

    }


    /* =====================================================
       BREAK ENGINE
       ===================================================== */

    function insertBreaks(tasks) {

        if (tasks.length < 2) {
            return tasks;
        }

        const result = [];

        for (
            let i = 0;
            i < tasks.length;
            i++
        ) {

            const current =
                tasks[i];

            result.push(current);


            if (i === tasks.length - 1) {
                continue;
            }


            const next =
                tasks[i + 1];

            const currentEnd =
                timeToMinutes(current.end);

            const nextStart =
                timeToMinutes(next.start);

            const freeTime =
                nextStart - currentEnd;


            if (freeTime >= 15) {

                const breakDuration =
                    Math.min(
                        15,
                        freeTime
                    );

                result.push({

                    id:
                        `break-${Date.now()}-${i}`,

                    title:
                        "استراحت",

                    description:
                        "استراحت کوتاه بین فعالیت‌ها",

                    start:
                        minutesToTime(currentEnd),

                    end:
                        minutesToTime(
                            currentEnd +
                            breakDuration
                        ),

                    duration:
                        breakDuration,

                    type:
                        "break",

                    source:
                        "planner-brain"

                });

            }

        }


        return result;

    }


    /* =====================================================
       LIGHTER PLAN
       ===================================================== */

    function makePlanLighter(tasks) {

        let studyCount = 0;

        return tasks.filter(task => {

            if (task.type !== "study") {
                return true;
            }

            studyCount++;

            return studyCount % 3 !== 0;

        });

    }


    /* =====================================================
       MATH PRIORITY
       ===================================================== */

    function prioritizeMath(tasks) {

        return [...tasks].sort((a, b) => {

            const aMath =
                /ریاضی|حسابان|هندسه|گسسته/i
                    .test(a.title);

            const bMath =
                /ریاضی|حسابان|هندسه|گسسته/i
                    .test(b.title);

            if (aMath && !bMath) return -1;

            if (!aMath && bMath) return 1;

            return 0;

        });

    }


    /* =====================================================
       RENDER PLAN
       ===================================================== */

    function renderPlan(plan) {

        if (!DOM.planList) {
            return;
        }

        DOM.planList.innerHTML = "";


        if (!plan.schedule.length) {

            if (DOM.planEmpty) {
                DOM.planEmpty.style.display =
                    "flex";
            }

            return;

        }


        if (DOM.planEmpty) {
            DOM.planEmpty.style.display =
                "none";
        }


        for (const item of plan.schedule) {

            const card =
                document.createElement("div");

            card.className =
                "dp-ai-plan-item";

            card.dataset.type =
                item.type;


            card.innerHTML = `

                <div class="dp-ai-plan-time">
                    ${item.start}
                </div>

                <div class="dp-ai-plan-main">

                    <div class="dp-ai-plan-title">
                        ${escapeHTML(item.title)}
                    </div>

                    <div class="dp-ai-plan-description">
                        ${escapeHTML(item.description)}
                    </div>

                </div>

                <div class="dp-ai-plan-duration">
                    ${item.duration} دقیقه
                </div>

            `;


            DOM.planList.appendChild(card);

        }


        updatePlanMeta(plan);

    }


    /* =====================================================
       PLAN META
       ===================================================== */

    function updatePlanMeta(plan) {

        if (DOM.planDate) {

            DOM.planDate.textContent =
                `${plan.dayOfWeek} • ${plan.date}`;

        }


        if (DOM.planSummary) {

            DOM.planSummary.textContent =
                `${plan.schedule.length} فعالیت`;

        }


        if (DOM.planState) {

            DOM.planState.textContent =
                "برنامه آماده است";

        }

    }


    /* =====================================================
       COMMAND ENGINE
       ===================================================== */

    function applyCommand(command) {

        const text =
            String(command || "")
                .trim()
                .toLowerCase();

        if (!text) {
            return;
        }


        if (
            text.includes("سبک") ||
            text.includes("کمتر")
        ) {

            State.preferences.lighter =
                true;

            generateAndRender();

            addChatMessage(
                "brain",
                "باشه؛ برنامه امروز را سبک‌تر کردم."
            );

            return;

        }


        if (
            text.includes("استراحت")
        ) {

            State.preferences.moreBreaks =
                true;

            generateAndRender();

            addChatMessage(
                "brain",
                "استراحت‌های بیشتری بین فعالیت‌ها قرار دادم."
            );

            return;

        }


        if (
            text.includes("ریاضی")
        ) {

            State.preferences.extraMath =
                true;

            generateAndRender();

            addChatMessage(
                "brain",
                "اولویت ریاضی را در برنامه بیشتر کردم."
            );

            return;

        }


        if (
            text.includes("برنامه") &&
            (
                text.includes("امروز") ||
                text.includes("چیه") ||
                text.includes("چی دارم")
            )
        ) {

            const plan =
                State.currentPlan ||
                generatePlan();

            renderPlan(plan);

            addChatMessage(
                "brain",
                `برای امروز ${plan.schedule.length} فعالیت در برنامه دارم.`
            );

            return;

        }


        addChatMessage(
            "brain",
            "دستور را متوجه نشدم. می‌توانی مثلاً بگویی «برنامه را سبک‌تر کن»، «استراحت بیشتر» یا «ریاضی را بیشتر کن»."
        );

    }


    /* =====================================================
       CHAT ENGINE
       ===================================================== */

    function chat(message) {

        const text =
            String(message || "").trim();

        if (!text) {
            return;
        }


        addChatMessage(
            "user",
            text
        );


        applyCommand(text);

    }


    /* =====================================================
       CHAT STORAGE
       ===================================================== */

    function loadChat() {

        try {

            const raw =
                localStorage.getItem(
                    CHAT_STORAGE_KEY
                );

            return raw
                ? JSON.parse(raw)
                : [];

        } catch {

            return [];

        }

    }


    function saveChat() {

        localStorage.setItem(
            CHAT_STORAGE_KEY,
            JSON.stringify(State.chat)
        );

    }


    function addChatMessage(type, text) {

        const message = {

            type,

            text,

            time:
                new Date().toISOString()

        };


        State.chat.push(message);

        saveChat();

        renderChat();

    }


    function renderChat() {

        if (!DOM.chatMessages) {
            return;
        }


        if (!State.chat.length) {

            DOM.chatMessages.innerHTML = `

                <div class="dp-chat-empty">
                    هنوز گفتگویی انجام نشده است.
                </div>

            `;

            return;

        }


        DOM.chatMessages.innerHTML = "";


        for (const message of State.chat) {

            const element =
                document.createElement("div");

            element.className =
                `dp-chat-message ${message.type}`;

            element.textContent =
                message.text;

            DOM.chatMessages.appendChild(
                element
            );

        }


        DOM.chatMessages.scrollTop =
            DOM.chatMessages.scrollHeight;

    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {

        return String(value || "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    /* =====================================================
       GENERATE + RENDER
       ===================================================== */

    function generateAndRender() {

        setStatus("در حال تحلیل برنامه...");


        const plan =
            generatePlan();

        renderPlan(plan);


        setStatus("برنامه امروز آماده است");

        return plan;

    }


    function setStatus(text) {

        if (DOM.status) {

            DOM.status.textContent =
                text;

        }

    }


    /* =====================================================
       EVENTS
       ===================================================== */

    function bindEvents() {


        if (DOM.generateButton) {

            DOM.generateButton.addEventListener(
                "click",
                generateAndRender
            );

        }


        if (DOM.refreshButton) {

            DOM.refreshButton.addEventListener(
                "click",
                generateAndRender
            );

        }


        if (DOM.commandSend) {

            DOM.commandSend.addEventListener(
                "click",
                () => {

                    const value =
                        DOM.command.value;

                    DOM.command.value = "";

                    applyCommand(value);

                }
            );

        }


        if (DOM.command) {

            DOM.command.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        DOM.commandSend?.click();

                    }

                }
            );

        }


        if (DOM.chatSend) {

            DOM.chatSend.addEventListener(
                "click",
                () => {

                    const value =
                        DOM.chatInput.value;

                    DOM.chatInput.value = "";

                    chat(value);

                }
            );

        }


        if (DOM.chatInput) {

            DOM.chatInput.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter" &&
                        !event.shiftKey
                    ) {

                        event.preventDefault();

                        DOM.chatSend?.click();

                    }

                }
            );

        }


        if (DOM.clearChat) {

            DOM.clearChat.addEventListener(
                "click",
                () => {

                    State.chat = [];

                    saveChat();

                    renderChat();

                }
            );

        }


        /* Quick commands */

        document
            .querySelectorAll(
                ".dp-command-suggestions button"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const command =
                            button.dataset.command;

                        applyCommand(command);

                    }
                );

            });

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.PlannerBrain = {

        getDayContext:
            getPlannerDayContext,

        generate:
            generatePlan,

        analyze:
            generatePlan,

        applyCommand,

        chat,

        getCurrentPlan:
            () => State.currentPlan,

        getState:
            () => State

    };


    /* =====================================================
       INIT
       ===================================================== */

    function init() {

        bindEvents();

        renderChat();

        setStatus(
            "برنامه‌ریز آماده است"
        );

        if (DOM.footer) {

            DOM.footer.textContent =
                "Planner Brain به برنامه‌ها، اتفاقات امروز، تاریخ و زمان فعلی دسترسی دارد.";

        }

        console.log(
            "🧠 Planner Brain initialized"
        );

    }


    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }

})();
















































"use strict";

/* =========================================================
   PROGRAM MODAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const addProgramBox =
        document.getElementById("addProgramBox");

    const programModal =
        document.getElementById("programModal");

    const closeProgramModal =
        document.getElementById("closeProgramModal");

    const cancelProgram =
        document.getElementById("cancelProgram");


    /* اگر عناصر وجود نداشتند */
    if (!addProgramBox || !programModal) {

        console.error(
            "Planner Modal: عناصر Modal پیدا نشدند."
        );

        return;

    }


    /* =====================================================
       OPEN
    ===================================================== */

    addProgramBox.addEventListener(
        "click",
        () => {

            console.log(
                "Opening program modal..."
            );

            programModal.classList.add("show");

            if (
                window.lucide &&
                typeof lucide.createIcons === "function"
            ) {

                lucide.createIcons();

            }

        }
    );


    /* =====================================================
       CLOSE FUNCTION
    ===================================================== */

    function closeModal() {

        programModal.classList.remove(
            "show"
        );

    }


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    if (closeProgramModal) {

        closeProgramModal.addEventListener(
            "click",
            closeModal
        );

    }


    /* =====================================================
       CANCEL
    ===================================================== */

    if (cancelProgram) {

        cancelProgram.addEventListener(
            "click",
            closeModal
        );

    }


    /* =====================================================
       CLICK OUTSIDE
    ===================================================== */

    programModal.addEventListener(
        "click",
        event => {

            if (
                event.target === programModal
            ) {

                closeModal();

            }

        }
    );


    /* =====================================================
       ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                programModal.classList.contains("show")
            ) {

                closeModal();

            }

        }
    );

});
























console.log("🔥 PLANNER MODAL SCRIPT LOADED");

document.addEventListener("click", function (e) {

    const addBox = e.target.closest("#addProgramBox");

    if (addBox) {

        console.log("✅ ADD PROGRAM CLICKED");

        const modal = document.getElementById("programModal");

        if (!modal) {
            console.error("❌ programModal پیدا نشد!");
            return;
        }

        console.log("✅ Modal پیدا شد");

        modal.classList.add("show");

        console.log("✅ کلاس show اضافه شد");
    }

});