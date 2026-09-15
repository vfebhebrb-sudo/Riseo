
/* =========================================================
   WEEKLY NOTIFICATION CENTER
   Version: 5.0

   Features:
   - Notification settings
   - Multiple notification sounds
   - Volume control
   - Sound test
   - Real notification Toast
   - Automatic planner scheduler
   - Today program detection
   - Fixed + floating programs
   - Notification history
   - Automatic history cleanup
   - Duplicate notification prevention
   - Lucide icons
   - Public API
   - Works on main page + planner page
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIG
    ===================================================== */

    const CONFIG = {

        settingsKey:
            "weeklyPlannerNotificationSettings",

        historyKey:
            "weeklyPlannerNotificationHistory",

        sentKey:
            "weeklyPlannerNotificationSent",

        historyMaxAge:
            7 * 24 * 60 * 60 * 1000,

        maxHistoryItems:
            100,

        checkInterval:
            5000,

        toastDuration:
            5000,

        defaultVolume:
            70,

        defaultSoundType:
            "classic"

    };


    /* =====================================================
       SOUND TYPES
    ===================================================== */

    const SOUND_TYPES = [

        "classic",
        "soft",
        "warning",
        "double",
        "modern",
        "clock",
        "none"

    ];


    /* =====================================================
       DEFAULT SETTINGS
    ===================================================== */

    const DEFAULT_SETTINGS = {

        notificationsEnabled:
            true,

        soundEnabled:
            true,

        soundVolume:
            CONFIG.defaultVolume,

        soundType:
            CONFIG.defaultSoundType

    };


    /* =====================================================
       STATE
    ===================================================== */

    let settings =
        loadSettings();

    let audioContext =
        null;

    let schedulerTimer =
        null;

    let initialized =
        false;


    /* =====================================================
       DOM ELEMENTS
    ===================================================== */

    let notificationToggle = null;
    let soundToggle = null;

    let soundTypeSelect = null;

    let volumeInput = null;
    let volumeValue = null;
    let volumeRow = null;

    let testSoundButton = null;

    let historyList = null;
    let clearHistoryButton = null;


    /* =====================================================
       DOM CACHE
    ===================================================== */

    function cacheElements() {

        notificationToggle =
            document.getElementById(
                "weeklyNotificationsEnabled"
            );

        soundToggle =
            document.getElementById(
                "weeklyNotificationSound"
            );

        soundTypeSelect =
            document.getElementById(
                "weeklyNotificationSoundType"
            );

        volumeInput =
            document.getElementById(
                "weeklyNotificationVolume"
            );

        volumeValue =
            document.getElementById(
                "weeklyNotificationVolumeValue"
            );

        volumeRow =
            document.getElementById(
                "weeklyNotificationVolumeRow"
            );

        testSoundButton =
            document.getElementById(
                "weeklyNotificationTestSound"
            );

        historyList =
            document.getElementById(
                "weeklyNotificationHistoryList"
            );

        clearHistoryButton =
            document.getElementById(
                "weeklyNotificationClearHistory"
            );
    }


    /* =====================================================
       SETTINGS
    ===================================================== */

    function loadSettings() {

        try {

            const saved =
                localStorage.getItem(
                    CONFIG.settingsKey
                );

            if (!saved) {

                return {
                    ...DEFAULT_SETTINGS
                };
            }


            const parsed =
                JSON.parse(saved);


            if (
                !parsed ||
                typeof parsed !== "object"
            ) {

                return {
                    ...DEFAULT_SETTINGS
                };
            }


            const merged = {

                ...DEFAULT_SETTINGS,
                ...parsed

            };


            let volume =
                Number(
                    merged.soundVolume
                );


            if (!Number.isFinite(volume)) {

                volume =
                    CONFIG.defaultVolume;
            }


            volume =
                Math.max(
                    10,
                    Math.min(
                        100,
                        volume
                    )
                );


            if (
                !SOUND_TYPES.includes(
                    merged.soundType
                )
            ) {

                merged.soundType =
                    CONFIG.defaultSoundType;
            }


            merged.soundVolume =
                volume;

            merged.notificationsEnabled =
                Boolean(
                    merged.notificationsEnabled
                );

            merged.soundEnabled =
                Boolean(
                    merged.soundEnabled
                );


            return merged;

        } catch (error) {

            console.error(
                "❌ خطا در بارگذاری تنظیمات اعلان:",
                error
            );

            return {
                ...DEFAULT_SETTINGS
            };
        }
    }


    /* =====================================================
       SAVE SETTINGS
    ===================================================== */

    function saveSettings() {

        try {

            localStorage.setItem(
                CONFIG.settingsKey,
                JSON.stringify(settings)
            );

        } catch (error) {

            console.error(
                "❌ خطا در ذخیره تنظیمات اعلان:",
                error
            );
        }
    }


    /* =====================================================
       UPDATE SETTINGS UI
    ===================================================== */

    function updateSettingsUI() {

        if (notificationToggle) {

            notificationToggle.checked =
                settings.notificationsEnabled;
        }


        if (soundToggle) {

            soundToggle.checked =
                settings.soundEnabled;
        }


        if (soundTypeSelect) {

            soundTypeSelect.value =
                settings.soundType;
        }


        if (volumeInput) {

            volumeInput.value =
                settings.soundVolume;
        }


        updateVolumeText();

        updateSoundUI();
    }


    /* =====================================================
       VOLUME TEXT
    ===================================================== */

    function updateVolumeText() {

        if (!volumeValue) {
            return;
        }


        volumeValue.textContent =
            `${settings.soundVolume}٪`;
    }


    /* =====================================================
       SOUND UI
    ===================================================== */

    function updateSoundUI() {

        if (!volumeRow) {
            return;
        }


        const enabled =
            settings.soundEnabled &&
            settings.soundType !== "none";


        volumeRow.style.opacity =
            enabled
                ? "1"
                : ".45";


        volumeRow.style.pointerEvents =
            enabled
                ? "auto"
                : "none";
    }


    /* =====================================================
       SET NOTIFICATIONS
    ===================================================== */

    function setNotificationsEnabled(
        enabled
    ) {

        settings.notificationsEnabled =
            Boolean(enabled);


        saveSettings();

        updateSettingsUI();


        console.log(
            settings.notificationsEnabled
                ? "🔔 اعلان‌ها فعال شدند."
                : "🔕 اعلان‌ها غیرفعال شدند."
        );
    }


    /* =====================================================
       SET SOUND
    ===================================================== */

    function setSoundEnabled(
        enabled
    ) {

        settings.soundEnabled =
            Boolean(enabled);


        saveSettings();

        updateSettingsUI();


        console.log(
            settings.soundEnabled
                ? "🔊 صدای اعلان فعال شد."
                : "🔇 صدای اعلان خاموش شد."
        );
    }


    /* =====================================================
       SET VOLUME
    ===================================================== */

    function setVolume(
        value
    ) {

        let volume =
            Number(value);


        if (!Number.isFinite(volume)) {

            volume =
                CONFIG.defaultVolume;
        }


        volume =
            Math.max(
                10,
                Math.min(
                    100,
                    volume
                )
            );


        settings.soundVolume =
            volume;


        saveSettings();

        updateSettingsUI();
    }


    /* =====================================================
       SET SOUND TYPE
    ===================================================== */

    function setSoundType(
        type
    ) {

        if (
            !SOUND_TYPES.includes(type)
        ) {

            type =
                CONFIG.defaultSoundType;
        }


        settings.soundType =
            type;


        saveSettings();

        updateSettingsUI();


        console.log(
            `🎵 نوع صدای اعلان: ${type}`
        );
    }


    /* =====================================================
       CONNECT SETTINGS EVENTS
    ===================================================== */

    function connectSettingsEvents() {

        if (
            notificationToggle &&
            !notificationToggle.dataset.bound
        ) {

            notificationToggle.addEventListener(
                "change",
                function () {

                    setNotificationsEnabled(
                        this.checked
                    );

                }
            );


            notificationToggle.dataset.bound =
                "true";
        }


        if (
            soundToggle &&
            !soundToggle.dataset.bound
        ) {

            soundToggle.addEventListener(
                "change",
                function () {

                    setSoundEnabled(
                        this.checked
                    );

                }
            );


            soundToggle.dataset.bound =
                "true";
        }


        if (
            soundTypeSelect &&
            !soundTypeSelect.dataset.bound
        ) {

            soundTypeSelect.addEventListener(
                "change",
                function () {

                    setSoundType(
                        this.value
                    );

                }
            );


            soundTypeSelect.dataset.bound =
                "true";
        }


        if (
            volumeInput &&
            !volumeInput.dataset.bound
        ) {

            volumeInput.addEventListener(
                "input",
                function () {

                    setVolume(
                        this.value
                    );

                }
            );


            volumeInput.dataset.bound =
                "true";
        }


        if (
            testSoundButton &&
            !testSoundButton.dataset.bound
        ) {

            testSoundButton.addEventListener(
                "click",
                function () {

                    testSound();

                }
            );


            testSoundButton.dataset.bound =
                "true";
        }


        if (
            clearHistoryButton &&
            !clearHistoryButton.dataset.bound
        ) {

            clearHistoryButton.addEventListener(
                "click",
                function () {

                    clearHistory();

                }
            );


            clearHistoryButton.dataset.bound =
                "true";
        }
    }


    /* =====================================================
       AUDIO CONTEXT
    ===================================================== */

    function getAudioContext() {

        try {

            if (!audioContext) {

                const AudioContext =
                    window.AudioContext ||
                    window.webkitAudioContext;


                if (!AudioContext) {

                    console.warn(
                        "⚠️ Web Audio API پشتیبانی نمی‌شود."
                    );

                    return null;
                }


                audioContext =
                    new AudioContext();
            }


            if (
                audioContext.state ===
                "suspended"
            ) {

                audioContext
                    .resume()
                    .catch(() => {});
            }


            return audioContext;

        } catch (error) {

            console.error(
                "❌ خطا در سیستم صدا:",
                error
            );

            return null;
        }
    }


    /* =====================================================
       AUDIO UNLOCK
    ===================================================== */

    function unlockAudio() {

        const context =
            getAudioContext();


        if (!context) {
            return;
        }


        if (
            context.state ===
            "suspended"
        ) {

            context
                .resume()
                .catch(() => {});
        }
    }


    function setupAudioUnlock() {

        const unlock =
            function () {

                unlockAudio();

            };


        document.addEventListener(
            "pointerdown",
            unlock,
            {
                once: true,
                passive: true
            }
        );


        document.addEventListener(
            "keydown",
            unlock,
            {
                once: true,
                passive: true
            }
        );
    }


    /* =====================================================
       PLAY BEEP
    ===================================================== */

    function playBeep(
        frequency = 880,
        duration = 180,
        delay = 0,
        volumeMultiplier = 0.45,
        type = "sine"
    ) {

        const context =
            getAudioContext();


        if (!context) {
            return;
        }


        const volume =
            (settings.soundVolume / 100) *
            volumeMultiplier;


        const startTime =
            context.currentTime +
            delay;


        const oscillator =
            context.createOscillator();


        const gain =
            context.createGain();


        oscillator.type =
            type;


        oscillator.frequency.setValueAtTime(
            frequency,
            startTime
        );


        gain.gain.setValueAtTime(
            0,
            startTime
        );


        gain.gain.linearRampToValueAtTime(
            volume,
            startTime + 0.02
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            startTime +
            duration / 1000
        );


        oscillator.connect(
            gain
        );


        gain.connect(
            context.destination
        );


        oscillator.start(
            startTime
        );


        oscillator.stop(
            startTime +
            duration / 1000 +
            0.04
        );
    }


    /* =====================================================
       CLASSIC
    ===================================================== */

    function playClassicSound() {

        playBeep(
            880,
            180,
            0,
            0.45,
            "sine"
        );


        playBeep(
            988,
            180,
            0.24,
            0.45,
            "sine"
        );


        playBeep(
            880,
            260,
            0.48,
            0.5,
            "sine"
        );
    }


    /* =====================================================
       SOFT
    ===================================================== */

    function playSoftSound() {

        playBeep(
            523,
            220,
            0,
            0.28,
            "sine"
        );


        playBeep(
            659,
            240,
            0.28,
            0.28,
            "sine"
        );


        playBeep(
            784,
            360,
            0.58,
            0.25,
            "sine"
        );
    }


    /* =====================================================
       WARNING
    ===================================================== */

    function playWarningSound() {

        playBeep(
            880,
            130,
            0,
            0.5,
            "square"
        );


        playBeep(
            880,
            130,
            0.19,
            0.5,
            "square"
        );


        playBeep(
            1046,
            180,
            0.38,
            0.55,
            "square"
        );


        playBeep(
            880,
            220,
            0.62,
            0.5,
            "square"
        );
    }


    /* =====================================================
       DOUBLE
    ===================================================== */

    function playDoubleSound() {

        playBeep(
            880,
            180,
            0,
            0.48,
            "sine"
        );


        playBeep(
            660,
            240,
            0.25,
            0.45,
            "sine"
        );
    }


    /* =====================================================
       MODERN
    ===================================================== */

    function playModernSound() {

        playBeep(
            523,
            120,
            0,
            0.35,
            "triangle"
        );


        playBeep(
            659,
            120,
            0.15,
            0.35,
            "triangle"
        );


        playBeep(
            784,
            120,
            0.30,
            0.38,
            "triangle"
        );


        playBeep(
            1046,
            260,
            0.45,
            0.42,
            "triangle"
        );
    }


    /* =====================================================
       CLOCK
    ===================================================== */

    function playClockSound() {

        playBeep(
            1000,
            100,
            0,
            0.4,
            "sine"
        );


        playBeep(
            700,
            100,
            0.17,
            0.38,
            "sine"
        );


        playBeep(
            1000,
            100,
            0.34,
            0.4,
            "sine"
        );


        playBeep(
            700,
            160,
            0.51,
            0.35,
            "sine"
        );
    }


    /* =====================================================
       PLAY NOTIFICATION SOUND
    ===================================================== */

    function playNotificationSound(
        force = false
    ) {

        if (
            !force &&
            !settings.soundEnabled
        ) {

            return;
        }


        if (
            settings.soundType ===
            "none"
        ) {

            return;
        }


        const context =
            getAudioContext();


        if (!context) {
            return;
        }


        switch (
            settings.soundType
        ) {

            case "soft":
                playSoftSound();
                break;

            case "warning":
                playWarningSound();
                break;

            case "double":
                playDoubleSound();
                break;

            case "modern":
                playModernSound();
                break;

            case "clock":
                playClockSound();
                break;

            case "classic":
            default:
                playClassicSound();
                break;
        }
    }


    /* =====================================================
       TEST SOUND
    ===================================================== */

    function testSound() {

        playNotificationSound(true);
    }


    /* =====================================================
       TOAST CONTAINER
    ===================================================== */

    function getNotificationContainer() {

        let container =
            document.querySelector(
                ".weekly-notification-container"
            );


        if (!container) {

            container =
                document.createElement("div");

            container.className =
                "weekly-notification-container";

            document.body.appendChild(
                container
            );
        }


        return container;
    }


    /* =====================================================
       SHOW TOAST
    ===================================================== */

    function showNotification(
        program
    ) {

        if (!program) {
            return null;
        }


        if (
            !settings.notificationsEnabled
        ) {

            return null;
        }


        const container =
            getNotificationContainer();


        const card =
            document.createElement("div");


        card.className =
            "weekly-notification-card";


        const title =
            escapeHTML(
                program.title ||
                "برنامه"
            );


        const start =
            escapeHTML(
                program.start ||
                ""
            );


        const end =
            escapeHTML(
                program.end ||
                ""
            );


        /*
           اولویت نمایش نام استاد:
           1. teacherName
           2. subtitle
           3. teacher
        */

        const teacherName =
            program.teacherName ||
            program.subtitle ||
            program.teacher ||
            "";


        const teacher =
            teacherName
                ? `

                    <span
                        class="weekly-notification-teacher"
                    >

                        <i
                            data-lucide="user-round"
                        ></i>

                        ${escapeHTML(
                            teacherName
                        )}

                    </span>

                  `
                : "";


        card.innerHTML = `

            <div
                class="weekly-notification-icon"
            >

                <i
                    data-lucide="bell-ring"
                ></i>

            </div>


            <div
                class="weekly-notification-content"
            >

                <strong>
                    زمان شروع برنامه
                </strong>


                <span
                    class="weekly-notification-title"
                >
                    ${title}
                </span>


                <span
                    class="weekly-notification-time"
                >

                    <i
                        data-lucide="clock-3"
                    ></i>

                    ${start}

                    ${
                        end
                            ? `<span>تا</span>${end}`
                            : ""
                    }

                </span>


                ${teacher}

            </div>


            <button
                type="button"
                class="weekly-notification-close"
                aria-label="بستن"
            >

                <i
                    data-lucide="x"
                ></i>

            </button>

        `;


        container.appendChild(
            card
        );


        refreshLucide();


        const closeButton =
            card.querySelector(
                ".weekly-notification-close"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                function () {

                    removeNotificationCard(
                        card
                    );

                }
            );
        }


        setTimeout(
            function () {

                removeNotificationCard(
                    card
                );

            },
            CONFIG.toastDuration
        );


        const rubikaMessage =
`
🔔 زمان شروع برنامه

📚 ${program.title || "برنامه"}

🕐 ${program.start || ""} 
${program.end ? "تا " + program.end : ""}

👨‍🏫 ${
    program.teacherName ||
    program.subtitle ||
    program.teacher ||
    ""
}
`;

sendSiteAlertToRubika(
    rubikaMessage
);


        return card;
    }


    /* =====================================================
       REMOVE TOAST
    ===================================================== */

    function removeNotificationCard(
        card
    ) {

        if (
            !card ||
            !card.isConnected
        ) {

            return;
        }


        card.style.opacity =
            "0";


        card.style.transform =
            "translateX(20px)";


        setTimeout(
            function () {

                if (
                    card.isConnected
                ) {

                    card.remove();

                }

            },
            250
        );
    }


    /* =====================================================
       NORMALIZE DIGITS
    ===================================================== */

    function normalizeDigits(
        value
    ) {

        return String(value || "")
            .replace(
                /[۰-۹]/g,
                function (digit) {

                    return String(
                        "۰۱۲۳۴۵۶۷۸۹"
                            .indexOf(digit)
                    );

                }
            )
            .replace(
                /[٠-٩]/g,
                function (digit) {

                    return String(
                        "٠١٢٣٤٥٦٧٨٩"
                            .indexOf(digit)
                    );

                }
            );
    }


    /* =====================================================
       PARSE TIME
    ===================================================== */

    function parseTime(
        value
    ) {

        if (
            value === null ||
            value === undefined
        ) {

            return null;
        }


        const normalized =
            normalizeDigits(value)
                .trim();


        const match =
            normalized.match(
                /(\d{1,2})\s*[:٫.]\s*(\d{1,2})/
            );


        if (!match) {
            return null;
        }


        const hour =
            Number(match[1]);


        const minute =
            Number(match[2]);


        if (
            !Number.isInteger(hour) ||
            !Number.isInteger(minute)
        ) {

            return null;
        }


        if (
            hour < 0 ||
            hour > 23 ||
            minute < 0 ||
            minute > 59
        ) {

            return null;
        }


        return {
            hour,
            minute
        };
    }


    /* =====================================================
       GET SATURDAY-FIRST DAY
    ===================================================== */

    function getTodayName() {

        const days = [

            "شنبه",
            "یکشنبه",
            "دوشنبه",
            "سه‌شنبه",
            "چهارشنبه",
            "پنجشنبه",
            "جمعه"

        ];


        const dayIndex =
            (
                new Date().getDay() +
                1
            ) % 7;


        return days[dayIndex];
    }


    /* =====================================================
       GET TODAY PROGRAMS
    ===================================================== */

    function getTodayPrograms() {

        try {

            const raw =
                localStorage.getItem(
                    "weeklyPlannerData"
                );


            if (!raw) {

                return [];
            }


            const data =
                JSON.parse(raw);


            if (
                !data ||
                typeof data !== "object"
            ) {

                return [];
            }


            const today =
                getTodayName();


            const dayData =
                data[today];


            if (
                !dayData ||
                typeof dayData !== "object"
            ) {

                return [];
            }


            const fixed =
                Array.isArray(
                    dayData.fixedPrograms
                )
                    ? dayData.fixedPrograms
                    : [];


            const floating =
                Array.isArray(
                    dayData.floatingPrograms
                )
                    ? dayData.floatingPrograms
                    : [];


            return [
                ...fixed,
                ...floating
            ];

        } catch (error) {

            console.error(
                "❌ خطا در خواندن برنامه هفتگی:",
                error
            );

            return [];
        }
    }


    /* =====================================================
       PROGRAM NOTIFICATION ENABLED
    ===================================================== */

    function isProgramNotificationEnabled(
        program
    ) {

        if (!program) {
            return false;
        }


        /*
           اگر برنامه صراحتاً notification=false
           داشته باشد، اعلان آن خاموش است.
        */

        if (
            program.notification === false ||
            program.notification === "false" ||
            program.notification === 0 ||
            program.notification === "0"
        ) {

            return false;
        }


        return true;
    }


        

    /* =====================================================
       GET PROGRAM UNIQUE ID
    ===================================================== */

    function getProgramId(
        program
    ) {

        if (
            program &&
            program.id !== undefined &&
            program.id !== null &&
            String(program.id).trim()
        ) {

            return String(
                program.id
            );
        }


        return [

            program?.title || "program",
            program?.start || "",
            program?.end || ""

        ].join("_");
    }


    /* =====================================================
       CURRENT DATE KEY
    ===================================================== */

    function getDateKey() {

        const now =
            new Date();


        return [

            now.getFullYear(),

            String(
                now.getMonth() + 1
            ).padStart(2, "0"),

            String(
                now.getDate()
            ).padStart(2, "0")

        ].join("-");
    }


    /* =====================================================
       SENT NOTIFICATION STORAGE
    ===================================================== */

    function getSentNotifications() {

        try {

            const raw =
                sessionStorage.getItem(
                    CONFIG.sentKey
                );


            if (!raw) {
                return {};
            }


            const parsed =
                JSON.parse(raw);


            if (
                !parsed ||
                typeof parsed !== "object"
            ) {

                return {};
            }


            return parsed;

        } catch (error) {

            return {};
        }
    }


    function saveSentNotifications(
        data
    ) {

        try {

            sessionStorage.setItem(
                CONFIG.sentKey,
                JSON.stringify(data)
            );

        } catch (error) {

            console.warn(
                "⚠️ ذخیره وضعیت اعلان انجام نشد:",
                error
            );
        }
    }


    /* =====================================================
       CLEAN SENT NOTIFICATIONS
    ===================================================== */

    function cleanupSentNotifications() {

        const sent =
            getSentNotifications();


        const today =
            getDateKey();


        let changed =
            false;


        Object.keys(sent)
            .forEach(
                function (key) {

                    if (
                        !key.startsWith(
                            today + "_"
                        )
                    ) {

                        delete sent[key];

                        changed = true;
                    }

                }
            );


        if (changed) {

            saveSentNotifications(
                sent
            );
        }


        return sent;
    }


    /* =====================================================
       NOTIFICATION KEY
    ===================================================== */

    function getNotificationKey(
        program
    ) {

        return [

            getDateKey(),

            getProgramId(program)

        ].join("_");
    }


    /* =====================================================
       WAS ALREADY SENT?
    ===================================================== */

    function wasNotificationSent(
        program
    ) {

        const sent =
            cleanupSentNotifications();


        return Boolean(
            sent[
                getNotificationKey(
                    program
                )
            ]
        );
    }


    /* =====================================================
       MARK AS SENT
    ===================================================== */

    function markNotificationSent(
        program
    ) {

        const sent =
            cleanupSentNotifications();


        sent[
            getNotificationKey(
                program
            )
        ] = Date.now();


        saveSentNotifications(
            sent
        );
    }


    /* =====================================================
       NOTIFY PROGRAM
    ===================================================== */

    function notifyProgram(
        program
    ) {

        if (!program) {
            return false;
        }


        if (
            !settings.notificationsEnabled
        ) {

            return false;
        }


        if (
            !isProgramNotificationEnabled(
                program
            )
        ) {

            return false;
        }


        if (
            wasNotificationSent(
                program
            )
        ) {

            return false;
        }


        /*
           خیلی مهم:
           قبل از نمایش اعلان آن را sent می‌کنیم
           تا اگر دو اجرای همزمان checkNotifications
           رخ داد، دوباره اعلان ارسال نشود.
        */

        markNotificationSent(
            program
        );


        showNotification(
            program
        );


        playNotificationSound();


        addToHistory(
            program
        );

        


        console.log(
            "🔔 اعلان برنامه ارسال شد:",
            program.title,
            program.start
        );


        return true;
    }


    /* =====================================================
       CHECK NOTIFICATIONS
    ===================================================== */

    function checkNotifications() {

        if (
            !settings.notificationsEnabled
        ) {

            return;
        }


        const now =
            new Date();


        const currentHour =
            now.getHours();


        const currentMinute =
            now.getMinutes();


        const programs =
            getTodayPrograms();


        if (!programs.length) {
            return;
        }


        programs.forEach(
            function (program) {

                if (
                    !isProgramNotificationEnabled(
                        program
                    )
                ) {

                    return;
                }


                const time =
                    parseTime(
                        program.start
                    );


                if (!time) {

                    return;
                }


                if (
                    time.hour ===
                    currentHour &&
                    time.minute ===
                    currentMinute
                ) {

                    notifyProgram(
                        program
                    );

                }

            }
        );
    }


    /* =====================================================
       START SCHEDULER
    ===================================================== */

    function startScheduler() {

        if (schedulerTimer) {

            return;
        }


        checkNotifications();


        schedulerTimer =
            setInterval(
                function () {

                    checkNotifications();

                },
                CONFIG.checkInterval
            );


        console.log(
            "⏰ Weekly Notification Scheduler started."
        );
    }


    /* =====================================================
       STOP SCHEDULER
    ===================================================== */

    function stopScheduler() {

        if (!schedulerTimer) {
            return;
        }


        clearInterval(
            schedulerTimer
        );


        schedulerTimer =
            null;


        console.log(
            "⏹️ Weekly Notification Scheduler stopped."
        );
    }


    async function sendTestNotificationToRubika(message) {

    try {

        const token =
            localStorage.getItem("authToken");

        if (!token) {
            console.warn(
                "⚠️ توکن کاربر پیدا نشد؛ پیام روبیکا ارسال نشد."
            );
            return;
        }

        const response =
            await fetch(
                `${API_URL}/notifications/rubika/test`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        message: message
                    })
                }
            );


        const data =
            await response.json();


        if (
            data.success === true &&
            data.sent === true
        ) {

            console.log(
                "📤 پیام تست اعلان به روبیکا ارسال شد."
            );

        } else {

            console.warn(
                "⚠️ ارسال پیام تست روبیکا انجام نشد:",
                data.message
            );

        }

    } catch (error) {

        console.error(
            "❌ خطا در ارسال تست اعلان به روبیکا:",
            error
        );

    }

}

    /* =====================================================
       TEST COMPLETE NOTIFICATION
    ===================================================== */

    function testNotification() {

        const now =
            new Date();


        const hour =
            String(
                now.getHours()
            ).padStart(
                2,
                "0"
            );


        const minute =
            String(
                now.getMinutes()
            ).padStart(
                2,
                "0"
            );


        const program = {

            id:
                "manual-test-" +
                Date.now(),

            title:
                "تست اعلان برنامه",

            start:
                `${hour}:${minute}`,

            end:
                `${hour}:${minute}`,

            teacher:
                "تست سیستم",

            subtitle:
                "اعلان آزمایشی",

            notification:
                true

        };


        showNotification(
            program
        );


        playNotificationSound(
            true
        );


        addToHistory(
            program
        );


        const rubikaMessage =
        `🔔 زمان شروع برنامه

        📚 ${program.title}
        🕐 ${program.start} تا ${program.end}
        👨‍🏫 ${program.teacher}`;

        sendTestNotificationToRubika(
            rubikaMessage
        );


        console.log(
            "🧪 تست کامل اعلان انجام شد."
        );


        return program;
    }


    /* =====================================================
       HISTORY
    ===================================================== */

    function getHistory() {

        try {

            const saved =
                localStorage.getItem(
                    CONFIG.historyKey
                );


            if (!saved) {
                return [];
            }


            const parsed =
                JSON.parse(saved);


            if (
                !Array.isArray(parsed)
            ) {

                return [];
            }


            return parsed;

        } catch (error) {

            console.error(
                "❌ خطا در خواندن تاریخچه اعلان:",
                error
            );

            return [];
        }
    }


    /* =====================================================
       SAVE HISTORY
    ===================================================== */

    function saveHistory(
        history
    ) {

        try {

            localStorage.setItem(
                CONFIG.historyKey,
                JSON.stringify(history)
            );

        } catch (error) {

            console.error(
                "❌ خطا در ذخیره تاریخچه اعلان:",
                error
            );
        }
    }


    /* =====================================================
       CLEAN HISTORY
    ===================================================== */

    function cleanupHistory() {

        const now =
            Date.now();


        const history =
            getHistory();


        const cleaned =
            history.filter(
                function (item) {

                    if (
                        !item ||
                        !item.timestamp
                    ) {

                        return false;
                    }


                    const timestamp =
                        Number(
                            item.timestamp
                        );


                    if (
                        !Number.isFinite(
                            timestamp
                        )
                    ) {

                        return false;
                    }


                    return (
                        now -
                        timestamp
                    ) <
                    CONFIG.historyMaxAge;

                }
            );


        if (
            cleaned.length !==
            history.length
        ) {

            saveHistory(
                cleaned
            );


            console.log(
                `🧹 ${
                    history.length -
                    cleaned.length
                } اعلان قدیمی حذف شد.`
            );
        }


        return cleaned;
    }


    /* =====================================================
       ADD HISTORY
    ===================================================== */

    function addToHistory(
        program
    ) {

        if (
            !program ||
            typeof program !==
            "object"
        ) {

            return;
        }


        const history =
            cleanupHistory();


        const now =
            Date.now();


        const item = {

            id:
                `notification_${now}_${Math.random()
                    .toString(36)
                    .slice(2, 7)}`,

            programId:
                program.id ||
                null,

            title:
                program.title ||
                "برنامه",

            start:
                program.start ||
                "",

            end:
                program.end ||
                "",

            teacher:
                program.teacher ||
                null,

            teacherName:
                program.subtitle ||
                null,

            date:
                new Date(
                    now
                ).toLocaleDateString(
                    "fa-IR"
                ),

            timestamp:
                now

        };


        history.unshift(
            item
        );


        saveHistory(
            history.slice(
                0,
                CONFIG.maxHistoryItems
            )
        );


        renderHistory();
    }


    /* =====================================================
       RENDER HISTORY
    ===================================================== */

    function renderHistory() {

        if (!historyList) {
            return;
        }


        const history =
            cleanupHistory();


        if (!history.length) {

            historyList.innerHTML = `

                <div
                    class="notification-history-empty"
                >

                    <i
                        data-lucide="bell-off"
                    ></i>

                    <span>
                        هنوز اعلانی دریافت نکرده‌اید.
                    </span>

                </div>

            `;


            refreshLucide();

            return;
        }


        historyList.innerHTML =
            history.map(
                function (item) {

                    const title =
                        escapeHTML(
                            item.title ||
                            "برنامه"
                        );


                    const date =
                        escapeHTML(
                            item.date ||
                            ""
                        );


                    const start =
                        escapeHTML(
                            item.start ||
                            ""
                        );


                    const teacherName =
                        item.teacherName ||
                        item.teacher ||
                        "";


                    const teacher =
                        teacherName
                            ? `
                                <span>
                                    ${escapeHTML(
                                        teacherName
                                    )}
                                </span>
                              `
                            : "";


                    return `

                        <div
                            class="weekly-notification-history-item"
                        >

                            <div
                                class="notification-history-icon"
                            >

                                <i
                                    data-lucide="bell"
                                ></i>

                            </div>


                            <div
                                class="notification-history-content"
                            >

                                <span
                                    class="notification-history-title"
                                >
                                    ${title}
                                </span>


                                <span
                                    class="notification-history-meta"
                                >

                                    ${date}

                                    •
                                    ${start}

                                    ${teacher}

                                </span>

                            </div>

                        </div>

                    `;

                }
            ).join("");


        refreshLucide();
    }


    /* =====================================================
       CLEAR HISTORY
    ===================================================== */

    function clearHistory() {

        try {

            localStorage.removeItem(
                CONFIG.historyKey
            );

        } catch (error) {

            console.error(
                "❌ خطا در پاک کردن تاریخچه اعلان:",
                error
            );
        }


        renderHistory();


        console.log(
            "🗑️ تاریخچه اعلان‌ها پاک شد."
        );
    }


    /* =====================================================
       HTML ESCAPE
    ===================================================== */

    function escapeHTML(
        value
    ) {

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


    /* =====================================================
       LUCIDE
    ===================================================== */

    function refreshLucide() {

        if (
            window.lucide &&
            typeof window.lucide.createIcons ===
            "function"
        ) {

            try {

                window.lucide.createIcons();

            } catch (error) {

                console.warn(
                    "⚠️ خطا در اجرای Lucide:",
                    error
                );
            }
        }
    }


    /* =====================================================
       REFRESH DOM
    ===================================================== */

    function refreshDOM() {

        cacheElements();

        updateSettingsUI();

        connectSettingsEvents();

        renderHistory();

        refreshLucide();
    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.WeeklyNotificationCenter = {

        /* ---------------------------------------------
           SETTINGS
        --------------------------------------------- */

        getSettings() {

            return {
                ...settings
            };
        },


        saveSettings() {

            saveSettings();
        },


        refreshSettings() {

            settings =
                loadSettings();

            refreshDOM();
        },


        /* ---------------------------------------------
           NOTIFICATIONS
        --------------------------------------------- */

        isEnabled() {

            return Boolean(
                settings.notificationsEnabled
            );
        },


        setEnabled(
            enabled
        ) {

            setNotificationsEnabled(
                enabled
            );
        },


        showNotification(
            program
        ) {

            return showNotification(
                program
            );
        },


        notify(
            program
        ) {

            return notifyProgram(
                program
            );
        },


        check() {

            checkNotifications();
        },


        start() {

            startScheduler();
        },


        stop() {

            stopScheduler();
        },


        test() {

            return testNotification();
        },


        /* ---------------------------------------------
           SOUND
        --------------------------------------------- */

        isSoundEnabled() {

            return Boolean(
                settings.soundEnabled
            );
        },


        setSoundEnabled(
            enabled
        ) {

            setSoundEnabled(
                enabled
            );
        },


        getVolume() {

            return settings.soundVolume;
        },


        setVolume(
            volume
        ) {

            setVolume(
                volume
            );
        },


        getSoundType() {

            return settings.soundType;
        },


        setSoundType(
            type
        ) {

            setSoundType(
                type
            );
        },


        getAvailableSounds() {

            return [
                ...SOUND_TYPES
            ];
        },


        playSound() {

            playNotificationSound();
        },


        testSound() {

            testSound();
        },


        /* ---------------------------------------------
           PLANNER
        --------------------------------------------- */

        getTodayName() {

            return getTodayName();
        },


        getTodayPrograms() {

            return getTodayPrograms();
        },


        parseTime(
            value
        ) {

            return parseTime(
                value
            );
        },


        /* ---------------------------------------------
           HISTORY
        --------------------------------------------- */

        addHistory(
            program
        ) {

            addToHistory(
                program
            );
        },


        getHistory() {

            return cleanupHistory();
        },


        clearHistory() {

            clearHistory();
        },


        cleanup() {

            cleanupHistory();

            cleanupSentNotifications();

            renderHistory();
        },


        refreshHistory() {

            renderHistory();
        }

    };


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function init() {

        if (initialized) {
            return;
        }


        initialized =
            true;


        console.log(
            "🔔 WEEKLY NOTIFICATION CENTER V5 STARTED"
        );


        cacheElements();

        applyInitialState();

        connectSettingsEvents();

        setupAudioUnlock();

        cleanupHistory();

        cleanupSentNotifications();

        renderHistory();

        refreshLucide();


        /*
           شروع موتور بررسی زمان
        */

        startScheduler();


        /*
           اگر تنظیمات توسط SPA/AJAX
           بعداً وارد DOM شدند.
        */

        setTimeout(
            function () {

                refreshDOM();

            },
            100
        );


        /*
           یک بار دیگر بعد از یک ثانیه
           برای صفحات سنگین/PWA.
        */

        setTimeout(
            function () {

                refreshDOM();

            },
            1000
        );
    }


    /* =====================================================
       APPLY INITIAL STATE
    ===================================================== */

    function applyInitialState() {

        settings =
            loadSettings();

        updateSettingsUI();
    }


    /* =====================================================
       START AFTER DOM READY
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init,
            {
                once: true
            }
        );

    } else {

        init();
    }


})();






































































































/* =========================================================
   RUBIKA NOTIFICATION SETTINGS
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIG
    ===================================================== */

    /*
     * API_URL از فایل اصلی API Config سایت می‌آید.
     *
     * Local:
     * http://localhost:3000/api
     *
     * Production:
     * https://iran-go4q.onrender.com/api
     */

    if (typeof API_URL === "undefined") {

        console.error(
            "❌ RUBIKA: API_URL تعریف نشده است."
        );

        return;
    }


    const API_BASE =
        `${API_URL}/notifications/rubika`;


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const elements = {

        chatIdInput:
            document.getElementById(
                "rubikaNotificationChatId"
            ),

        saveButton:
            document.getElementById(
                "rubikaNotificationSave"
            ),

        enabledSwitch:
            document.getElementById(
                "rubikaNotificationEnabled"
            ),

        testButton:
            document.getElementById(
                "rubikaNotificationTest"
            ),

        statusBox:
            document.getElementById(
                "rubikaNotificationStatus"
            ),

        statusText:
            document.getElementById(
                "rubikaNotificationStatusText"
            ),

        messageBox:
            document.getElementById(
                "rubikaNotificationMessage"
            )
    };


    /* =====================================================
       CHECK HTML
    ===================================================== */

    const missingElements =
        Object.entries(elements)
            .filter(([, element]) => !element)
            .map(([name]) => name);


    if (missingElements.length > 0) {

        console.warn(
            "🔔 RUBIKA: عناصر HTML پیدا نشدند:",
            missingElements
        );

        return;
    }


    /* =====================================================
       AUTH TOKEN
    ===================================================== */

    function getToken() {

        /*
         * سیستم Login سایت تو Token را با
         * کلید authToken ذخیره می‌کند.
         */

        const token =
            localStorage.getItem(
                "authToken"
            );


        if (!token) {

            console.warn(
                "🔐 RUBIKA: authToken پیدا نشد."
            );

            return null;
        }


        return token;
    }


    /* =====================================================
       API REQUEST
    ===================================================== */

    async function apiRequest(
        endpoint,
        options = {}
    ) {

        const token =
            getToken();


        /*
         * بدون Token درخواست نمی‌فرستیم.
         */

        if (!token) {

            throw new Error(
                "توکن ورود پیدا نشد. لطفاً دوباره وارد حساب شوید."
            );
        }


        const headers = {

            "Content-Type":
                "application/json",

            "Authorization":
                `Bearer ${token}`
        };


        const response =
            await fetch(
                `${API_BASE}${endpoint}`,
                {
                    ...options,

                    headers: {
                        ...headers,
                        ...(options.headers || {})
                    }
                }
            );


        let data = null;


        try {

            data =
                await response.json();

        } catch {

            data = null;
        }


        /*
         * خطای Authentication
         */

        if (response.status === 401) {

            throw new Error(
                data?.message ||
                "احراز هویت نامعتبر است. لطفاً دوباره وارد حساب شوید."
            );
        }


        /*
         * سایر خطاهای HTTP
         */

        if (!response.ok) {

            throw new Error(
                data?.message ||
                data?.error ||
                `خطای سرور: ${response.status}`
            );
        }


        return data;
    }


    /* =====================================================
       MESSAGE
    ===================================================== */

    function showMessage(
        text,
        type = "success"
    ) {

        elements.messageBox.hidden =
            false;


        elements.messageBox.className =
            `rubika-notification-message ${type}`;


        elements.messageBox.textContent =
            text;
    }


    function hideMessage() {

        elements.messageBox.hidden =
            true;


        elements.messageBox.textContent =
            "";


        elements.messageBox.className =
            "rubika-notification-message";
    }


    /* =====================================================
       CONNECTION STATUS
    ===================================================== */

    function setStatus(
        state,
        text
    ) {

        elements.statusBox.classList.remove(
            "connected",
            "error"
        );


        if (state === true) {

            elements.statusBox.classList.add(
                "connected"
            );

        }

        else if (state === "error") {

            elements.statusBox.classList.add(
                "error"
            );
        }


        elements.statusText.textContent =
            text;
    }


    /* =====================================================
       LOADING
    ===================================================== */

    function setLoading(
        loading
    ) {

        elements.saveButton.disabled =
            loading;

        elements.testButton.disabled =
            loading;

        elements.enabledSwitch.disabled =
            loading;


        elements.saveButton.style.opacity =
            loading
                ? "0.6"
                : "";


        elements.testButton.style.opacity =
            loading
                ? "0.6"
                : "";
    }


    /* =====================================================
       LOAD STATUS
    ===================================================== */

    async function loadStatus() {

        try {

            setStatus(
                false,
                "در حال بررسی..."
            );


            const data =
                await apiRequest(
                    "/status",
                    {
                        method: "GET"
                    }
                );


            /*
             * Chat ID
             */

            if (data?.chatId) {

                elements.chatIdInput.value =
                    data.chatId;


                setStatus(
                    true,
                    "متصل"
                );

            }

            else {

                elements.chatIdInput.value =
                    "";


                setStatus(
                    false,
                    "متصل نیست"
                );
            }


            /*
             * وضعیت اعلان‌ها
             */

            elements.enabledSwitch.checked =
                Boolean(
                    data?.notificationEnabled
                );


            console.log(
                "🔔 RUBIKA STATUS:",
                data
            );


        }

        catch (error) {

            console.error(
                "❌ RUBIKA STATUS ERROR:",
                error
            );


            setStatus(
                "error",
                "خطا در اتصال"
            );
        }
    }


    /* =====================================================
       SAVE CHAT ID
    ===================================================== */

    async function saveChatId() {

        const chatId =
            elements.chatIdInput.value.trim();


        /*
         * خالی
         */

        if (!chatId) {

            showMessage(
                "لطفاً Chat ID روبیکا را وارد کنید.",
                "error"
            );

            elements.chatIdInput.focus();

            return;
        }


/*
 * اعتبارسنجی Chat ID روبیکا
 *
 * Chat ID روبیکا می‌تواند شامل:
 * حروف + اعداد + _ + -
 * باشد.
 */

if (
    !/^[A-Za-z0-9_-]+$/.test(chatId)
) {

    showMessage(
        "Chat ID روبیکا معتبر نیست.",
        "error"
    );

    elements.chatIdInput.focus();

    return;
}


        try {

            setLoading(true);

            hideMessage();


            const data =
                await apiRequest(
                    "/connect",
                    {
                        method: "POST",

                        body:
                            JSON.stringify({
                                chatId:
                                    chatId
                            })
                    }
                );


            console.log(
                "✅ RUBIKA CHAT ID SAVED:",
                data
            );


            setStatus(
                true,
                "متصل"
            );


            showMessage(
                "Chat ID با موفقیت ذخیره شد.",
                "success"
            );


        }

        catch (error) {

            console.error(
                "❌ RUBIKA SAVE ERROR:",
                error
            );


            setStatus(
                "error",
                "ذخیره نشد"
            );


            showMessage(
                error.message ||
                "ذخیره Chat ID انجام نشد.",
                "error"
            );


        }

        finally {

            setLoading(false);
        }
    }


    /* =====================================================
       ENABLE / DISABLE NOTIFICATIONS
    ===================================================== */

    async function changeNotificationState() {

        const enabled =
            elements.enabledSwitch.checked;


        try {

            setLoading(true);

            hideMessage();


            /* =============================================
               ENABLE
            ============================================= */

            if (enabled) {

                const chatId =
                    elements.chatIdInput.value.trim();


                /*
                 * Chat ID وجود ندارد
                 */

                if (!chatId) {

                    elements.enabledSwitch.checked =
                        false;


                    showMessage(
                        "ابتدا Chat ID را ذخیره کنید.",
                        "error"
                    );

                    return;
                }


                /*
                 * اعتبارسنجی Chat ID
                 */

                if (!/^[A-Za-z0-9_-]+$/.test(chatId)) {

                    elements.enabledSwitch.checked =
                        false;

                    showMessage(
                        "Chat ID روبیکا معتبر نیست.",
                        "error"
                    );

                    return;
                }

                const data =
                    await apiRequest(
                        "/connect",
                        {
                            method: "POST",

                            body:
                                JSON.stringify({
                                    chatId:
                                        chatId,

                                    notificationEnabled:
                                        true
                                })
                        }
                    );


                console.log(
                    "🔔 RUBIKA NOTIFICATIONS ENABLED:",
                    data
                );


                showMessage(
                    "اعلان‌های روبیکا فعال شد.",
                    "success"
                );
            }


            /* =============================================
               DISABLE
            ============================================= */

            else {

                const data =
                    await apiRequest(
                        "/disconnect",
                        {
                            method: "POST"
                        }
                    );


                console.log(
                    "🔕 RUBIKA NOTIFICATIONS DISABLED:",
                    data
                );


                showMessage(
                    "اعلان‌های روبیکا غیرفعال شد.",
                    "success"
                );
            }
        }


        catch (error) {

            console.error(
                "❌ RUBIKA NOTIFICATION STATE ERROR:",
                error
            );


            /*
             * برگرداندن وضعیت Toggle
             */

            elements.enabledSwitch.checked =
                !enabled;


            showMessage(
                error.message ||
                "تغییر وضعیت اعلان‌ها انجام نشد.",
                "error"
            );
        }


        finally {

            setLoading(false);
        }
    }


    /* =====================================================
       TEST NOTIFICATION
    ===================================================== */

/* =====================================================
   TEST NOTIFICATION
   ===================================================== */

async function testNotification() {

    const chatId =
        elements.chatIdInput.value.trim();


    /* =================================================
       CHECK CHAT ID
       ================================================= */

    if (!chatId) {

        showMessage(
            "ابتدا Chat ID را وارد و ذخیره کنید.",
            "error"
        );

        return;
    }


    /* =================================================
       START
       ================================================= */

    try {

        setLoading(true);

        hideMessage();


        /*
         * تغییر ظاهر دکمه
         */

        const originalButtonHTML =
            elements.testButton.innerHTML;


        elements.testButton.innerHTML = `
            <i data-lucide="loader-2"></i>
            <span>در حال ارسال...</span>
        `;


        /*
         * دوباره Lucide را فعال می‌کنیم
         */

        if (
            typeof lucide !== "undefined" &&
            typeof lucide.createIcons === "function"
        ) {

            lucide.createIcons();

        }


        /* =================================================
           API
           ================================================= */

        const data =
            await apiRequest(
                "/test",
                {
                    method: "POST"
                }
            );


        console.log(
            "📨 RUBIKA TEST RESULT:",
            data
        );


        /* =================================================
           CHECK REAL RESULT
           ================================================= */

        /*
         * فقط وقتی موفقیت را نمایش بده که
         * Backend صراحتاً ارسال را تأیید کرده باشد.
         */

        if (
            data?.success === true &&
            data?.sent === true
        ) {

            showMessage(
                data.message ||
                "پیام تست با موفقیت ارسال شد.",
                "success"
            );

        }

        else {

            /*
             * Backend درخواست را قبول نکرده
             */

            showMessage(
                data?.message ||
                "پیام ارسال نشد.",
                "error"
            );

        }

    }


    /* =================================================
       ERROR
       ================================================= */

    catch (error) {

        console.error(
            "❌ RUBIKA TEST ERROR:",
            error
        );


        showMessage(
            error.message ||
            "ارسال پیام تست انجام نشد.",
            "error"
        );

    }


    /* =================================================
       FINISH
       ================================================= */

    finally {

        setLoading(false);


        /*
         * برگرداندن دکمه به حالت عادی
         */

        elements.testButton.innerHTML = `
            <i data-lucide="send"></i>
            <span>ارسال تست</span>
        `;


        if (
            typeof lucide !== "undefined" &&
            typeof lucide.createIcons === "function"
        ) {

            lucide.createIcons();

        }

    }
}



    /* =====================================================
       CHAT ID INPUT
    ===================================================== */

elements.chatIdInput.addEventListener(
    "input",
    function () {

        this.value =
            this.value.replace(
                /[^A-Za-z0-9_-]/g,
                ""
            );

    }
);

    /* =====================================================
       EVENTS
    ===================================================== */

    elements.saveButton.addEventListener(
        "click",
        saveChatId
    );


    elements.enabledSwitch.addEventListener(
        "change",
        changeNotificationState
    );


    elements.testButton.addEventListener(
        "click",
        testNotification
    );


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.RubikaNotificationSettings = {

        reload:
            loadStatus,


        save:
            saveChatId,


        test:
            testNotification,


        getChatId() {

            return elements.chatIdInput
                .value
                .trim();
        },


        isEnabled() {

            return elements.enabledSwitch
                .checked;
        }
    };


    /* =====================================================
       INIT
    ===================================================== */

    loadStatus();


    console.log(
        "🔔 RUBIKA NOTIFICATION SETTINGS READY"
    );

})();

























































async function sendSiteAlertToRubika(message) {

    try {

        if (!message) {
            console.warn(
                "⚠️ پیام هشدار خالی است؛ ارسال به روبیکا انجام نشد."
            );
            return;
        }

        const token =
            localStorage.getItem("authToken");

        if (!token) {
            console.warn(
                "⚠️ authToken پیدا نشد؛ ارسال به روبیکا انجام نشد."
            );
            return;
        }

        const response =
            await fetch(
                `${API_URL}/notifications/rubika/test`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        message: String(message)
                    })
                }
            );


        const data =
            await response.json();


        if (
            data.success === true &&
            data.sent === true
        ) {

            console.log(
                "📤 هشدار سایت به روبیکا ارسال شد."
            );

        } else {

            console.warn(
                "⚠️ روبیکا پیام هشدار را ارسال نکرد:",
                data.message
            );

        }

    } catch (error) {

        console.error(
            "❌ خطا در ارسال هشدار سایت به روبیکا:",
            error
        );

    }

}



