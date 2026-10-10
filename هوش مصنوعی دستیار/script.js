// ======================================================
// GEMINI LIVE ROBOT
// نسخه بازنویسی‌شده
// مدیریت صحیح تغییر حالت چشم
// ======================================================


// ======================================================
// عناصر صفحه
// ======================================================

const connectionStatus =
    document.getElementById("connectionStatus");



    
// ======================================================
// کنترل چشم
// ======================================================

function setEyeState(state) {

    if (
        typeof window.Eyes !== "undefined" &&
        typeof window.Eyes.setState === "function"
    ) {

        window.Eyes.setState(state);

        return;
    }

    console.warn(
        "👀 eyes.js هنوز آماده نیست:",
        state
    );
}


// ======================================================
// GEMINI LIVE VARIABLES
// ======================================================

let geminiLiveSocket = null;

let microphoneStream = null;

let audioContext = null;

let microphoneSource = null;

let processor = null;

let audioOutputContext = null;

let nextAudioTime = 0;

let isCallActive = false;

let selectedVoice = 
    localStorage.getItem("aiVoice") || "default";


// ======================================================
// وضعیت مکالمه
// ======================================================

let isUserSpeaking = false;

let isModelSpeaking = false;

let lastUserSpeechTime = 0;


// ======================================================
// حالت فعلی دستی چشم
// ======================================================
//
// فقط آخرین فرمان دستی معتبر است.
//
// مثال:
//
// happy
// ↓
// angry
// ↓
// idle
//
// حالت قبلی هیچ‌وقت دوباره برنمی‌گردد.
// ======================================================

let manualEyeState = null;


// ======================================================
// تنظیمات تشخیص پایان صحبت
// ======================================================

const USER_SPEECH_TIMEOUT = 700;

let userSpeechTimer = null;


// ======================================================
// وضعیت اتصال
// ======================================================

function setConnectionStatus(text) {

    if (!connectionStatus) {
        return;
    }

    connectionStatus.textContent =
        text;
}


// ======================================================
// تشخیص اجباری حالت چشم
// ======================================================
//
// این تابع مستقیماً فرمان کاربر را بررسی می‌کند.
//
// اگر کاربر یکی از حالت‌های چشم را بخواهد:
// حالت قبلی فوراً لغو می‌شود
// و حالت جدید حتماً اعمال می‌شود.
//
// ======================================================
// ======================================================
// تشخیص اجباری حالت چشم
// ======================================================

function forceEyeStateFromText(text) {

    const command =
        normalizePersianText(text);

    if (!command) {
        return false;
    }


    // ==================================================
    // HAPPY
    // ==================================================

    if (
        command.includes("خوشحال شو") ||
        command.includes("خوشحال باش") ||
        command.includes("شاد شو") ||
        command.includes("شاد باش") ||
        command.includes("لبخند بزن") ||
        command.includes("حالت خوشحال") ||
        command.includes("حالت شادی")
    ) {

        applyManualEyeState(
            "happy",
            "خوشحالم 😄"
        );

        return true;
    }


    // ==================================================
    // SAD
    // ==================================================

    if (
        command.includes("ناراحت شو") ||
        command.includes("ناراحت باش") ||
        command.includes("غمگین شو") ||
        command.includes("غمگین باش") ||
        command.includes("حالت ناراحت") ||
        command.includes("حالت غمگین")
    ) {

        applyManualEyeState(
            "sad",
            "اوه... 😔"
        );

        return true;
    }


    // ==================================================
    // ANGRY
    // ==================================================

    if (
        command.includes("عصبانی شو") ||
        command.includes("عصبانی باش") ||
        command.includes("عصبانی") ||
        command.includes("اخم کن") ||
        command.includes("اخم شو") ||
        command.includes("اخم بکن") ||
        command.includes("حالت عصبانی") ||
        command.includes("قیافت رو عصبانی کن") ||
        command.includes("قیافتو عصبانی کن") ||
        command.includes("قیافه عصبانی") ||
        command.includes("عصبانی به نظر برس")
    ) {

        applyManualEyeState(
            "angry",
            "باشه، عصبانی شدم 😠"
        );

        return true;
    }


    // ==================================================
    // SURPRISED
    // ==================================================

    if (
        command.includes("تعجب کن") ||
        command.includes("متعجب شو") ||
        command.includes("شوکه شو") ||
        command.includes("شگفت زده شو") ||
        command.includes("شگفت‌زده شو") ||
        command.includes("حالت تعجب") ||
        command.includes("حالت متعجب")
    ) {

        applyManualEyeState(
            "surprised",
            "وااای! 😮"
        );

        return true;
    }


    // ==================================================
    // THINKING
    // ==================================================

    if (
        command.includes("فکر کن") ||
        command.includes("برو تو فکر") ||
        command.includes("حالت فکر") ||
        command.includes("فکر کردن") ||
        command.includes("حالت تفکر")
    ) {

        applyManualEyeState(
            "thinking",
            "دارم فکر می‌کنم 🧠"
        );

        return true;
    }


    // ==================================================
    // SEARCHING
    // ==================================================

    if (
        command.includes("سرچ کن") ||
        command.includes("سرچ شو") ||
        command.includes("جستجو کن") ||
        command.includes("جست و جو کن") ||
        command.includes("جست‌وجو کن") ||
        command.includes("حالت سرچ") ||
        command.includes("برو برای سرچ")
    ) {

        applyManualEyeState(
            "searching",
            "دارم می‌گردم 🔎"
        );

        return true;
    }


    // ==================================================
    // LISTENING
    // ==================================================

    if (
        command.includes("گوش بده") ||
        command.includes("گوش کن") ||
        command.includes("گوش بده ببین") ||
        command.includes("حالت گوش دادن") ||
        command.includes("حالت شنیدن")
    ) {

        applyManualEyeState(
            "listening",
            "دارم گوش می‌دم 👂"
        );

        return true;
    }


    // ==================================================
    // SPEAKING
    // ==================================================

    if (
        command.includes("حالت صحبت") ||
        command.includes("حالت حرف زدن") ||
        command.includes("در حال صحبت باش") ||
        command.includes("درحال صحبت باش") ||
        command.includes("صحبت کن") ||
        command.includes("حالت سخن گفتن") ||
        command.includes("حالت حرف زدن")
    ) {

        applyManualEyeState(
            "speaking",
            "دارم صحبت می‌کنم 🗣️"
        );

        return true;
    }


    // ==================================================
    // SLEEPY
    // ==================================================

    if (
        command.includes("خواب آلود شو") ||
        command.includes("خواب‌آلود شو") ||
        command.includes("خواب آلود باش") ||
        command.includes("خواب‌آلود باش") ||
        command.includes("چشمات خواب آلود") ||
        command.includes("چشمات خواب‌آلود") ||
        command.includes("حالت خواب آلود") ||
        command.includes("حالت خواب‌آلود") ||
        command.includes("خوابم میاد")
    ) {

        applyManualEyeState(
            "sleepy",
            "خیلی خوابم میاد... 😴"
        );

        return true;
    }


    // ==================================================
    // LAZY
    // ==================================================

    if (
        command.includes("تنبل شو") ||
        command.includes("تنبل باش") ||
        command.includes("حالت تنبل") ||
        command.includes("حالت تنبلی") ||
        command.includes("بی حال شو") ||
        command.includes("بی‌حال شو") ||
        command.includes("بی حال باش") ||
        command.includes("بی‌حال باش") ||
        command.includes("حوصله ندار") ||
        command.includes("حوصله ندارم")
    ) {

        applyManualEyeState(
            "lazy",
            "حوصله ندارم کاری کنم... 🥱"
        );

        return true;
    }


    // ==================================================
    // EXCITED
    // ==================================================

    if (
        command.includes("هیجان زده شو") ||
        command.includes("هیجان‌زده شو") ||
        command.includes("هیجان زده باش") ||
        command.includes("هیجان‌زده باش") ||
        command.includes("حالت هیجان") ||
        command.includes("حالت هیجانی") ||
        command.includes("ذوق کن")
    ) {

        applyManualEyeState(
            "excited",
            "وااای! خیلی هیجان‌زده‌ام! 🤩"
        );

        return true;
    }


    // ==================================================
    // CONFUSED
    // ==================================================

    if (
        command.includes("گیج شو") ||
        command.includes("گیج باش") ||
        command.includes("حالت گیج") ||
        command.includes("حالت گیجی") ||
        command.includes("سردرگم شو") ||
        command.includes("سردرگم باش") ||
        command.includes("حالت سردرگم")
    ) {

        applyManualEyeState(
            "confused",
            "یکم گیج شدم... 😵"
        );

        return true;
    }


    // ==================================================
    // FOCUSED
    // ==================================================

    if (
        command.includes("متمرکز شو") ||
        command.includes("متمرکز باش") ||
        command.includes("تمرکز کن") ||
        command.includes("حالت تمرکز") ||
        command.includes("حالت متمرکز") ||
        command.includes("با دقت نگاه کن") ||
        command.includes("دقیق باش")
    ) {

        applyManualEyeState(
            "focused",
            "کاملاً متمرکزم 🎯"
        );

        return true;
    }


    // ==================================================
    // UPSET
    // ==================================================

    if (
        command.includes("کلافه شو") ||
        command.includes("کلافه باش") ||
        command.includes("حالت کلافه") ||
        command.includes("ناراضی شو") ||
        command.includes("ناراضی باش") ||
        command.includes("حالت ناراضی") ||
        command.includes("دلخور شو") ||
        command.includes("دلخور باش") ||
        command.includes("حالت دلخور")
    ) {

        applyManualEyeState(
            "upset",
            "یکم کلافه شدم... 😒"
        );

        return true;
    }


    // ==================================================
    // LOVE
    // ==================================================

    if (
        command.includes("عاشق شو") ||
        command.includes("عاشق باش") ||
        command.includes("حالت عاشق") ||
        command.includes("حالت عشق") ||
        command.includes("چشمات عاشق") ||
        command.includes("عاشقانه شو")
    ) {

        applyManualEyeState(
            "love",
            "❤️"
        );

        return true;
    }


    // ==================================================
    // IDLE / RESET
    // ==================================================

    if (
        command.includes("عادی شو") ||
        command.includes("عادی باش") ||
        command.includes("حالت عادی") ||
        command.includes("برگرد به حالت عادی") ||
        command.includes("ریست شو") ||
        command.includes("حالت معمولی") ||
        command.includes("همه حالت ها رو لغو کن") ||
        command.includes("همه حالت‌ها رو لغو کن") ||
        command.includes("حالت قبلی رو لغو کن") ||
        command.includes("حالت قبلی را لغو کن")
    ) {

        manualEyeState = null;

        setEyeState("idle");

        setConnectionStatus(
            "آماده‌ام 😎"
        );

        console.log(
            "👀 تمام حالت‌های دستی لغو شدند → IDLE"
        );

        return true;
    }


    return false;
}
// ======================================================
// اعمال حالت دستی جدید
// ======================================================
//
// این تابع قلب سیستم حالت‌هاست.
//
// هر حالت جدید:
// 1. حالت قبلی را لغو می‌کند
// 2. حالت جدید را ثبت می‌کند
// 3. چشم را تغییر می‌دهد
//
// ======================================================

function applyManualEyeState(
    newState,
    statusText = null
) {

    console.log(
        "👀 تغییر حالت دستی:",
        manualEyeState,
        "→",
        newState
    );


    // ----------------------------------------------
    // حالت قبلی کاملاً لغو می‌شود
    // ----------------------------------------------

    manualEyeState = null;


    // ----------------------------------------------
    // اگر حالت جدید idle باشد
    // حالت دستی نداریم
    // ----------------------------------------------

    if (
        !newState ||
        newState === "idle"
    ) {

        setEyeState(
            "idle"
        );


        if (statusText) {

            setConnectionStatus(
                statusText
            );
        }


        console.log(
            "👀 Manual State Cleared"
        );


        return;
    }


    // ----------------------------------------------
    // ثبت حالت جدید
    // ----------------------------------------------

    manualEyeState =
        newState;


    // ----------------------------------------------
    // اعمال روی چشم
    // ----------------------------------------------

    setEyeState(
        newState
    );


    // ----------------------------------------------
    // وضعیت اتصال
    // ----------------------------------------------

    if (statusText) {

        setConnectionStatus(
            statusText
        );
    }


    console.log(
        "👀 New Manual State:",
        manualEyeState
    );
}


// ======================================================
// نرمال‌سازی فارسی
// ======================================================

function normalizePersianText(text) {

    if (!text) {
        return "";
    }

    return text
        .toString()
        .toLowerCase()

        .replace(/ي/g, "ی")
        .replace(/ى/g, "ی")
        .replace(/ك/g, "ک")

        .replace(/‌/g, " ")

        .replace(/\s+/g, " ")

        .replace(
            /[،؛؟!.,:؛]/g,
            ""
        )

        .trim();
}


// ======================================================
// تشخیص فرمان ربات
// ======================================================

function detectRobotCommand(text) {

    const command =
        normalizePersianText(text);

    if (!command) {
        return false;
    }


    console.log(
        "🎤 بررسی فرمان:",
        command
    );


    // ==================================================
    // HAPPY
    // ==================================================

    if (
        command.includes("خوشحال شو") ||
        command.includes("خوشحال باش") ||
        command.includes("شاد شو") ||
        command.includes("شاد باش") ||
        command.includes("لبخند بزن") ||
        command.includes("حالت خوشحال") ||
        command.includes("حالت شادی")
    ) {

        applyManualEyeState(
            "happy",
            "خوشحالم 😄"
        );

        return true;
    }


    // ==================================================
    // SAD
    // ==================================================

    if (
        command.includes("ناراحت شو") ||
        command.includes("ناراحت باش") ||
        command.includes("غمگین شو") ||
        command.includes("غمگین باش") ||
        command.includes("حالت ناراحت") ||
        command.includes("حالت غمگین")
    ) {

        applyManualEyeState(
            "sad",
            "اوه... 😔"
        );

        return true;
    }


    // ==================================================
    // ANGRY
    // ==================================================

    if (
        command.includes("عصبانی شو") ||
        command.includes("عصبانی باش") ||
        command.includes("عصبانی") ||
        command.includes("اخم کن") ||
        command.includes("اخم شو") ||
        command.includes("اخم بکن") ||
        command.includes("حالت عصبانی") ||
        command.includes("قیافت رو عصبانی کن") ||
        command.includes("قیافتو عصبانی کن") ||
        command.includes("قیافه عصبانی") ||
        command.includes("عصبانی به نظر برس")
    ) {

        applyManualEyeState(
            "angry",
            "باشه، عصبانی شدم 😠"
        );

        return true;
    }


    // ==================================================
    // SURPRISED
    // ==================================================

    if (
        command.includes("تعجب کن") ||
        command.includes("متعجب شو") ||
        command.includes("شوکه شو") ||
        command.includes("شگفت زده شو") ||
        command.includes("شگفت‌زده شو") ||
        command.includes("حالت تعجب") ||
        command.includes("حالت متعجب")
    ) {

        applyManualEyeState(
            "surprised",
            "وااای! 😮"
        );

        return true;
    }


    // ==================================================
    // THINKING
    // ==================================================

    if (
        command.includes("فکر کن") ||
        command.includes("برو تو فکر") ||
        command.includes("حالت فکر") ||
        command.includes("فکر کردن")
    ) {

        applyManualEyeState(
            "thinking",
            "دارم فکر می‌کنم 🧠"
        );

        return true;
    }


    // ==================================================
    // SEARCHING
    // ==================================================
// ==================================================
// SEARCHING
// ==================================================

if (
    command.includes("سرچ") &&
    (
        command.includes("حالت") ||
        command.includes("چشم") ||
        command.includes("بکن") ||
        command.includes("شو") ||
        command.includes("کن")
    )
    ||

    command.includes("جستجو") &&
    (
        command.includes("حالت") ||
        command.includes("چشم") ||
        command.includes("بکن") ||
        command.includes("شو") ||
        command.includes("کن")
    )
) {

    applyManualEyeState(
        "searching",
        "دارم می‌گردم 🔎"
    );

    return true;
}


    // ==================================================
    // LISTENING
    // ==================================================

    if (
        command.includes("گوش بده") ||
        command.includes("گوش کن") ||
        command.includes("گوش بده ببین") ||
        command.includes("حالت گوش دادن") ||
        command.includes("حالت شنیدن")
    ) {

        applyManualEyeState(
            "listening",
            "دارم گوش می‌دم 👂"
        );

        return true;
    }


    // ==================================================
    // IDLE
    // ==================================================

    if (
        command.includes("عادی شو") ||
        command.includes("عادی باش") ||
        command.includes("حالت عادی") ||
        command.includes("برگرد به حالت عادی") ||
        command.includes("ریست شو") ||
        command.includes("حالت معمولی")
    ) {

        applyManualEyeState(
            "idle",
            "آماده‌ام 😎"
        );

        return true;
    }


    return false;
}


// ======================================================
// تشخیص احساس
// ======================================================

function detectEmotion(text) {

    const command =
        normalizePersianText(text);

    if (!command) {
        return null;
    }


    // --------------------------------------------------
    // HAPPY
    // --------------------------------------------------

    if (
        command.includes("خیلی خوبه") ||
        command.includes("عالیه") ||
        command.includes("عالی بود") ||
        command.includes("خیلی خوشحالم") ||
        command.includes("خوشحالم") ||
        command.includes("دمت گرم") ||
        command.includes("باحاله") ||
        command.includes("چه خوب") ||
        command.includes("هورا") ||
        command.includes("موفق شدم")
    ) {

        return "happy";
    }


    // --------------------------------------------------
    // SAD
    // --------------------------------------------------

    if (
        command.includes("خیلی ناراحتم") ||
        command.includes("ناراحتم") ||
        command.includes("غمگینم") ||
        command.includes("حالم بده") ||
        command.includes("خیلی بد شد") ||
        command.includes("خراب کردم") ||
        command.includes("شکست خوردم") ||
        command.includes("ناراحت کننده")
    ) {

        return "sad";
    }


    // --------------------------------------------------
    // SURPRISED
    // --------------------------------------------------

    if (
        command.includes("وای") ||
        command.includes("وااای") ||
        command.includes("جدی") ||
        command.includes("باورم نمیشه") ||
        command.includes("باور نمی‌کنم") ||
        command.includes("چه جالب") ||
        command.includes("چی") ||
        command.includes("عجب")
    ) {

        return "surprised";
    }


    return null;
}


// ======================================================
// مدیریت پایان صحبت کاربر
// ======================================================

function resetUserSpeechTimer() {

    if (userSpeechTimer) {

        clearTimeout(
            userSpeechTimer
        );
    }


    userSpeechTimer =
        setTimeout(
            () => {

                if (
                    !isUserSpeaking ||
                    isModelSpeaking
                ) {

                    return;
                }


                startThinkingState();

            },
            USER_SPEECH_TIMEOUT
        );
}


// ======================================================
// شروع گوش دادن
// ======================================================

function startListeningState() {

    if (isModelSpeaking) {
        return;
    }


    isUserSpeaking =
        true;


    lastUserSpeechTime =
        performance.now();


    if (!manualEyeState) {

        setEyeState(
            "listening"
        );

        setConnectionStatus(
            "دارم گوش می‌دم 👂"
        );
    }


    resetUserSpeechTimer();
}


// ======================================================
// شروع فکر کردن
// ======================================================

function startThinkingState() {

    if (isModelSpeaking) {
        return;
    }


    isUserSpeaking =
        false;


    if (userSpeechTimer) {

        clearTimeout(
            userSpeechTimer
        );

        userSpeechTimer =
            null;
    }


    if (!manualEyeState) {

        setEyeState(
            "thinking"
        );

        setConnectionStatus(
            "دارم فکر می‌کنم 🧠"
        );
    }


    console.log(
        "🧠 User finished speaking"
    );
}


// ======================================================
// شروع صحبت Gemini
// ======================================================

function startSpeakingState() {

    if (isModelSpeaking) {
        return;
    }


    isModelSpeaking =
        true;


    isUserSpeaking =
        false;


    if (userSpeechTimer) {

        clearTimeout(
            userSpeechTimer
        );

        userSpeechTimer =
            null;
    }


    if (!manualEyeState) {

        setEyeState(
            "speaking"
        );

        setConnectionStatus(
            "دارم جوابتو می‌دم 😎"
        );
    }


    console.log(
        "🔊 Gemini started speaking"
    );
}


// ======================================================
// پایان صحبت Gemini
// ======================================================

function finishSpeakingState() {

    isModelSpeaking =
        false;


    isUserSpeaking =
        false;


    // ----------------------------------------------
    // اگر حالت دستی جدید وجود دارد،
    // همان حالت فعلی باقی می‌ماند.
    // ----------------------------------------------

    if (manualEyeState) {

        setEyeState(
            manualEyeState
        );

        return;
    }


    setEyeState(
        "idle"
    );


    setConnectionStatus(
        "منتظرم رفیق 👀"
    );


    console.log(
        "🔊 Gemini finished speaking"
    );
}


// ======================================================
// پردازش متن کاربر
// ======================================================

function handleUserTranscription(
    inputTranscription
) {

    if (!inputTranscription) {
        return;
    }


    let text = "";


    if (
        typeof inputTranscription ===
        "string"
    ) {

        text =
            inputTranscription;

    }

    else if (
        typeof inputTranscription ===
        "object"
    ) {

        text =
            inputTranscription.text ||
            inputTranscription.transcript ||
            "";
    }


    if (
        typeof text !==
        "string"
    ) {

        return;
    }


    text =
        text.trim();


    if (!text) {
        return;
    }


    console.log(
        "🎤 USER:",
        text
    );


    // ==================================================
    // فرمان ربات
    // ==================================================

    const commandDetected =
        detectRobotCommand(text);


    if (commandDetected) {

        return;
    }


    // ==================================================
    // احساس
    // ==================================================

    const emotion =
        detectEmotion(text);


    if (emotion) {

        // احساس خودکار فقط زمانی اعمال می‌شود
        // که حالت دستی فعال نباشد.

        if (!manualEyeState) {

            setEyeState(
                emotion
            );
        }

        return;
    }


    // ==================================================
    // صحبت عادی
    // ==================================================

    startListeningState();
}


// ======================================================
// Float32 → PCM16
// ======================================================

function float32ToPCM16(input) {

    const output =
        new Int16Array(
            input.length
        );


    for (
        let i = 0;
        i < input.length;
        i++
    ) {

        const sample =
            Math.max(
                -1,
                Math.min(
                    1,
                    input[i]
                )
            );


        output[i] =
            sample < 0
                ? sample * 0x8000
                : sample * 0x7FFF;
    }


    return output;
}


// ======================================================
// Resample → 16kHz
// ======================================================

function resampleTo16k(
    input,
    inputSampleRate
) {

    const targetSampleRate =
        16000;


    if (
        inputSampleRate ===
        targetSampleRate
    ) {

        return input;
    }


    const ratio =
        inputSampleRate /
        targetSampleRate;


    const newLength =
        Math.round(
            input.length /
            ratio
        );


    const output =
        new Float32Array(
            newLength
        );


    for (
        let i = 0;
        i < newLength;
        i++
    ) {

        const position =
            i * ratio;


        const index =
            Math.floor(
                position
            );


        const fraction =
            position -
            index;


        const sample1 =
            input[index] ||
            0;


        const sample2 =
            input[index + 1] ||
            sample1;


        output[i] =
            sample1 +
            (
                sample2 -
                sample1
            ) *
            fraction;
    }


    return output;
}


// ======================================================
// ArrayBuffer → Base64
// ======================================================

function arrayBufferToBase64(
    buffer
) {

    const bytes =
        new Uint8Array(
            buffer
        );


    let binary =
        "";


    const chunkSize =
        0x8000;


    for (
        let i = 0;
        i < bytes.length;
        i += chunkSize
    ) {

        binary +=
            String.fromCharCode(
                ...bytes.subarray(
                    i,
                    i + chunkSize
                )
            );
    }


    return btoa(
        binary
    );
}


// ======================================================
// ارسال صدا به Gemini
// ======================================================

function sendAudioToGemini(
    pcm16
) {

    if (
        !geminiLiveSocket ||
        geminiLiveSocket.readyState !==
        WebSocket.OPEN
    ) {

        return;
    }


    const base64Audio =
        arrayBufferToBase64(
            pcm16.buffer
        );


    geminiLiveSocket.send(
        JSON.stringify({

            realtimeInput: {

                audio: {

                    data:
                        base64Audio,

                    mimeType:
                        "audio/pcm;rate=16000"
                }
            }

        })
    );
}


// ======================================================
// شروع Microphone
// ======================================================

async function startMicrophone() {

    microphoneStream =
        await navigator.mediaDevices
            .getUserMedia({

                audio: {

                    channelCount: 1,

                    echoCancellation:
                        true,

                    noiseSuppression:
                        true,

                    autoGainControl:
                        true
                }

            });


    audioContext =
        new (
            window.AudioContext ||
            window.webkitAudioContext
        )();


    microphoneSource =
        audioContext
            .createMediaStreamSource(
                microphoneStream
            );


    processor =
        audioContext
            .createScriptProcessor(
                4096,
                1,
                1
            );


    processor.onaudioprocess =
        event => {

            if (
                !isCallActive
            ) {

                return;
            }


            const input =
                event.inputBuffer
                    .getChannelData(
                        0
                    );


            const resampled =
                resampleTo16k(
                    input,
                    audioContext.sampleRate
                );


            const pcm16 =
                float32ToPCM16(
                    resampled
                );


            sendAudioToGemini(
                pcm16
            );
        };


    microphoneSource.connect(
        processor
    );


    processor.connect(
        audioContext.destination
    );


    console.log(
        "🎙️ Microphone started"
    );
}


// ======================================================
// توقف Microphone
// ======================================================

function stopMicrophone() {

    if (processor) {

        processor.disconnect();

        processor =
            null;
    }


    if (microphoneSource) {

        microphoneSource.disconnect();

        microphoneSource =
            null;
    }


    if (microphoneStream) {

        microphoneStream
            .getTracks()
            .forEach(
                track =>
                    track.stop()
            );

        microphoneStream =
            null;
    }


    if (audioContext) {

        audioContext.close();

        audioContext =
            null;
    }
}


// ======================================================
// Base64 → PCM16
// ======================================================

function base64ToInt16(
    base64
) {

    const binary =
        atob(
            base64
        );


    const bytes =
        new Uint8Array(
            binary.length
        );


    for (
        let i = 0;
        i < binary.length;
        i++
    ) {

        bytes[i] =
            binary.charCodeAt(i);
    }


    return new Int16Array(
        bytes.buffer
    );
}


// ======================================================
// پخش صدای Gemini
// ======================================================

function playGeminiAudio(
    base64Data
) {

    const pcm16 =
        base64ToInt16(
            base64Data
        );


    if (!audioOutputContext) {

        audioOutputContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )({

                sampleRate:
                    24000
            });
    }


    const audioBuffer =
        audioOutputContext
            .createBuffer(
                1,
                pcm16.length,
                24000
            );


    const channel =
        audioBuffer
            .getChannelData(
                0
            );


    for (
        let i = 0;
        i < pcm16.length;
        i++
    ) {

        channel[i] =
            pcm16[i] /
            32768;
    }


    const source =
        audioOutputContext
            .createBufferSource();


    source.buffer =
        audioBuffer;


    source.connect(
        audioOutputContext.destination
    );


    const currentTime =
        audioOutputContext.currentTime;


    if (
        nextAudioTime <
        currentTime
    ) {

        nextAudioTime =
            currentTime;
    }


    source.start(
        nextAudioTime
    );


    nextAudioTime +=
        audioBuffer.duration;
}


// ======================================================
// اتصال Gemini Live
// ======================================================

async function connectGeminiLive() {

    try {

        manualEyeState =
            null;


        setEyeState(
            "idle"
        );


        setConnectionStatus(
            "دارم وصل می‌شم..."
        );


        // ==================================================
        // دریافت Token
        // ==================================================

        const response =
            await fetch(
                API_URL +
                "/voice/token"
            );


        if (!response.ok) {

            throw new Error(
                "دریافت توکن ناموفق بود"
            );
        }


        const data =
            await response.json();


        if (
            !data.success ||
            !data.token
        ) {

            throw new Error(
                "توکن معتبر نیست"
            );
        }


        // ==================================================
        // WebSocket URL
        // ==================================================

        const wsUrl =
            "wss://generativelanguage.googleapis.com/ws/" +
            "google.ai.generativelanguage.v1beta." +
            "GenerativeService.BidiGenerateContentConstrained" +
            "?access_token=" +
            encodeURIComponent(
                data.token
            );


        geminiLiveSocket =
            new WebSocket(
                wsUrl
            );

// ==================================================
// OPEN
// ==================================================

geminiLiveSocket.onopen =
    () => {

        console.log(
            "🔌 Gemini WebSocket connected"
        );


        const setupMessage = {

            setup: {

                model:
                    "models/gemini-3.8-live",



                // ==================================================
                // GEMINI TOOLS
                // ==================================================

                tools: [

                    {

                        functionDeclarations: [


                            {

                                name:
                                    "list_files",

                                description:
                                    "فهرست فایل‌های PDF موجود در سیستم را دریافت کن. وقتی کاربر دنبال فایل، جزوه یا PDF است ابتدا از این ابزار استفاده کن.",


                                parameters: {

                                    type:
                                        "OBJECT",


                                    properties: {

                                        source: {

                                            type:
                                                "STRING",

                                            enum: [

                                                "rubika",
                                                "telegram",
                                                "all"

                                            ],

                                            description:
                                                "منبع فایل‌ها"

                                        }

                                    }

                                }

                            },



                            {

                                name:
                                    "open_pdf",


                                description:
                                    "یک فایل PDF مشخص را باز کن تا برای سؤال و جواب آماده شود.",


                                parameters: {

                                    type:
                                        "OBJECT",


                                    properties: {


                                        fileId: {

                                            type:
                                                "STRING",

                                            description:
                                                "شناسه فایل"

                                        },


                                        source: {

                                            type:
                                                "STRING",

                                            enum: [

                                                "rubika",
                                                "telegram"

                                            ],

                                            description:
                                                "منبع فایل"

                                        }

                                    },


                                    required: [

                                        "fileId",
                                        "source"

                                    ]

                                }

                            },



{
    name:
        "read_pdf",

    description:
        "PDF باز شده را دانلود کن و همراه سؤال کاربر برای هوش مصنوعی ارسال کن تا خودش فایل PDF را بخواند و پاسخ دهد.",

    parameters: {

        type:
            "OBJECT",

        properties: {

            question: {

                type:
                    "STRING",

                description:
                    "سؤال کاربر درباره محتوای PDF"

            }

        },

        required: [

            "question"

        ]

    }

}

                        ]

                    }

                ],




                // ==================================================
                // AUDIO CONFIG
                // ==================================================

                generationConfig: {


                    responseModalities: [

                        "AUDIO"

                    ],



                    speechConfig: {

                        voiceConfig: {

                            prebuiltVoiceConfig: {

                                voiceName:

                                    selectedVoice === "male"

                                        ? "Charon"

                                        :

                                    selectedVoice === "female"

                                        ? "Aoede"

                                        :

                                        "Puck"

                            }

                        }

                    }

                },



                // ==================================================
                // USER TRANSCRIPTION
                // ==================================================

                inputAudioTranscription: {},




                // ==================================================
                // AI PERSONALITY
                // ==================================================

                systemInstruction: {


                    parts: [


                        {

                            text:

                                "تو یک دستیار فارسی‌زبان خیلی صمیمی و رفیق‌طور هستی. " +

                                "رسمی و خشک حرف نزن. " +

                                "مثل یک دوست باهوش و کمک‌کننده صحبت کن. " +

                                "همیشه فارسی صحبت کن. " +

                                "پاسخ‌ها طبیعی و نسبتاً کوتاه باشند. " +


                                // چشم‌ها

                                "اگر کاربر فرمان تغییر حالت چشم ربات داد، آن را انجام بده. " +

                                "فرمان‌های خوشحال شو، ناراحت شو، عصبانی شو، اخم کن، تعجب کن، فکر کن، سرچ کن، گوش بده و عادی شو فرمان‌های کنترل چشم هستند. " +

                                "هر فرمان جدید جایگزین فرمان قبلی می‌شود. " +

                                "وقتی کاربر می‌گوید عادی شو، حالت دستی چشم را لغو کن. " +


                                // فایل‌ها

                                "اگر کاربر درباره فایل، جزوه، PDF یا کتاب سؤال کرد، از ابزار list_files استفاده کن. " +

                                "اگر فایل مناسب پیدا شد، برای باز کردن آن از open_pdf استفاده کن. " +

                               "بعد از باز شدن PDF، برای پاسخ درباره محتوای آن از read_pdf استفاده کن. " +

                                "بدون استفاده از ابزار فایل، درباره فایل‌های موجود حدس نزن. " +


                                "در فرمان‌های چشم لازم نیست احساس واقعی داشته باشی؛ فقط فرمان کاربر را اجرا کن و طبیعی پاسخ بده."

                        }

                    ]

                }

            }

        };



        geminiLiveSocket.send(

            JSON.stringify(

                setupMessage

            )

        );



        console.log(

            "📤 Setup sent with tools"

        );

    };

        // ==================================================
        // MESSAGE
        // ==================================================

        geminiLiveSocket.onmessage =
            async event => {

                try {

                    let messageText;


                    if (
                        typeof event.data ===
                        "string"
                    ) {

                        messageText =
                            event.data;

                    }

                    else if (
                        event.data instanceof
                        Blob
                    ) {

                        messageText =
                            await event.data.text();

                    }

                    else {

                        return;
                    }


                    const response =
                        JSON.parse(
                            messageText
                        );


                    console.log(
                        "📥 Gemini:",
                        response
                    );


                    // ======================================================
// GEMINI TOOL CALL
// ======================================================

if (response.toolCall) {

    console.log(
        "🛠️ GEMINI TOOL CALL:",
        response.toolCall
    );


    const functionCalls =
        response.toolCall.functionCalls || [];


    const functionResponses = [];


    for (
        const call
        of functionCalls
    ) {

        console.log(
            "🛠️ Function:",
            call.name,
            call.args
        );


        // ==================================================
        // SET EYE STATE
        // ==================================================
// ==================================================
// GEMINI TOOL HANDLER
// ==================================================

if (
    call.name === "set_eye_state"
) {

    const requestedState =
        call.args?.state;


    const validStates = [

        "idle",
        "listening",
        "speaking",
        "thinking",
        "searching",

        "happy",
        "sad",
        "angry",
        "surprised",

        "sleepy",
        "lazy",
        "excited",
        "confused",

        "focused",
        "upset",
        "love"

    ];


    if (
        validStates.includes(requestedState)
    ) {

        manualEyeState =
            requestedState;


        setEyeState(
            requestedState
        );


        functionResponses.push({

            id:
                call.id,

            name:
                call.name,

            response: {

                success:true,

                result:
                    `Eye changed to ${requestedState}`

            }

        });


    } else {


        functionResponses.push({

            id:
                call.id,

            name:
                call.name,

            response: {

                success:false,

                error:
                    "Invalid eye state"

            }

        });

    }


}


// ==================================================
// FILE TOOLS
// ==================================================

else if (

    call.name === "list_files" ||
    call.name === "open_pdf" ||
   call.name === "read_pdf"
) {


    try {


        const toolResponse =
            await executeTool(

                call.name,

                call.args || {},

                {

                    sessionId:
                        window.currentPdfSessionId || null

                }

            );



        console.log(
            "📂 TOOL RESULT:",
            toolResponse
        );



        if (

            call.name === "open_pdf" &&
            toolResponse.success

        ) {


            window.currentPdfSessionId =

                toolResponse.sessionId ||

                toolResponse.fileId;


            console.log(
                "📄 PDF SESSION:",
                window.currentPdfSessionId
            );

        }



        functionResponses.push({

            id:
                call.id,

            name:
                call.name,

            response:
                toolResponse

        });



    }

    catch(error){


        console.error(
            "❌ TOOL ERROR:",
            error
        );


        functionResponses.push({

            id:
                call.id,

            name:
                call.name,

            response: {

                success:false,

                error:
                    error.message

            }

        });


    }


}


// ==================================================
// UNKNOWN
// ==================================================

else {


    console.warn(
        "⚠️ Unknown Gemini tool:",
        call.name
    );


    functionResponses.push({

        id:
            call.id,

        name:
            call.name,

        response: {

            success:false,

            error:
                "Unknown tool"

        }

    });

}

    }


    // ==================================================
    // ارسال پاسخ Tool به Gemini
    // ==================================================

    if (
        functionResponses.length > 0 &&
        geminiLiveSocket &&
        geminiLiveSocket.readyState ===
        WebSocket.OPEN
    ) {

        geminiLiveSocket.send(

            JSON.stringify({

                toolResponse: {

                    functionResponses

                }

            })

        );


        console.log(
            "📤 TOOL RESPONSE SENT:",
            functionResponses
        );

    }


    // ==================================================
    // خیلی مهم:
    // بعد از Tool Call دیگر این پیام را
    // به منطق serverContent نده.
    // ==================================================

    return;
}


                    // ----------------------------------
                    // خطای Gemini
                    // ----------------------------------

                    if (
                        response.error
                    ) {

                        console.error(
                            "❌ GEMINI SERVER ERROR:",
                            response.error
                        );


                        setConnectionStatus(
                            "خطای Gemini 😕"
                        );


                        return;
                    }


                    // ----------------------------------
                    // Setup Complete
                    // ----------------------------------

                    if (
                        response.setupComplete
                    ) {

                        await startMicrophone();


                        isCallActive =
                            true;


                        isUserSpeaking =
                            false;


                        isModelSpeaking =
                            false;


                        nextAudioTime =
                            0;


                        setEyeState(
                            "idle"
                        );


                        setConnectionStatus(
                            "آماده‌ام 😎"
                        );


                        console.log(
                            "✅ Gemini Live Ready"
                        );


                        return;
                    }


                    const serverContent =
                        response?.serverContent;


                    if (!serverContent) {
                        return;
                    }


                    // ----------------------------------
                    // ورودی کاربر
                    // ----------------------------------

                    if (
                        serverContent.inputTranscription
                    ) {

                        if (
                            !isModelSpeaking
                        ) {

                            startListeningState();


                            handleUserTranscription(
                                serverContent.inputTranscription
                            );
                        }
                    }


                    // ----------------------------------
                    // صدای Gemini
                    // ----------------------------------

                    const parts =
                        serverContent
                            ?.modelTurn
                            ?.parts;


                    let hasAudio =
                        false;


                    if (
                        Array.isArray(parts)
                    ) {

                        for (
                            const part
                            of parts
                        ) {

                            if (
                                part.inlineData &&
                                part.inlineData.data
                            ) {

                                hasAudio =
                                    true;


                                playGeminiAudio(
                                    part.inlineData.data
                                );
                            }
                        }
                    }


                    // ----------------------------------
                    // شروع پاسخ صوتی
                    // ----------------------------------

                    if (
                        hasAudio
                    ) {

                        startSpeakingState();
                    }


                    // ----------------------------------
                    // پایان Turn
                    // ----------------------------------

                    if (
                        serverContent.turnComplete
                    ) {

                        if (
                            !audioOutputContext
                        ) {

                            finishSpeakingState();

                            return;
                        }


                        const waitForAudio =
                            Math.max(
                                0,
                                (
                                    nextAudioTime -
                                    audioOutputContext.currentTime
                                ) * 1000
                            );


                        setTimeout(
                            () => {

                                finishSpeakingState();

                            },
                            Math.max(
                                100,
                                waitForAudio + 50
                            )
                        );
                    }

                }

                catch (error) {

                    console.error(
                        "❌ Message Error:",
                        error
                    );
                }
            };


        // ==================================================
        // ERROR
        // ==================================================

        geminiLiveSocket.onerror =
            error => {

                console.error(
                    "❌ Gemini WebSocket Error:",
                    error
                );


                manualEyeState =
                    null;


                setEyeState(
                    "sad"
                );


                setConnectionStatus(
                    "یه مشکلی پیش اومد 😕"
                );
            };


        // ==================================================
        // CLOSE
        // ==================================================

        geminiLiveSocket.onclose =
            event => {

                isCallActive =
                    false;


                stopMicrophone();


                isUserSpeaking =
                    false;


                isModelSpeaking =
                    false;


                manualEyeState =
                    null;


                if (userSpeechTimer) {

                    clearTimeout(
                        userSpeechTimer
                    );

                    userSpeechTimer =
                        null;
                }


                setEyeState(
                    "idle"
                );


                setConnectionStatus(
                    "تماس بسته شد"
                );


                console.error(
                    "🔴 Gemini Live closed"
                );


                console.error(
                    "📌 Close Code:",
                    event.code
                );


                console.error(
                    "📌 Close Reason:",
                    event.reason
                );


                console.error(
                    "📌 Was Clean:",
                    event.wasClean
                );
            };

    }

    catch (error) {

        console.error(
            "❌ Connection Error:",
            error
        );


        manualEyeState =
            null;


        setEyeState(
            "sad"
        );


        setConnectionStatus(
            error.message
        );
    }
}


// ======================================================
// کنترل دستی ربات
// ======================================================
//
// این توابع هم از همان سیستم مرکزی استفاده می‌کنند.
// ======================================================

window.robot = {

    happy:
        () => {

            applyManualEyeState(
                "happy"
            );
        },


    sad:
        () => {

            applyManualEyeState(
                "sad"
            );
        },


    angry:
        () => {

            applyManualEyeState(
                "angry"
            );
        },


    surprised:
        () => {

            applyManualEyeState(
                "surprised"
            );
        },


    thinking:
        () => {

            applyManualEyeState(
                "thinking"
            );
        },


    searching:
        () => {

            applyManualEyeState(
                "searching"
            );
        },


    listening:
        () => {

            applyManualEyeState(
                "listening"
            );
        },


    speaking:
        () => {

            applyManualEyeState(
                "speaking"
            );
        },


    idle:
        () => {

            applyManualEyeState(
                "idle"
            );
        },


    blink:
        () => {

            if (
                typeof window.Eyes !== "undefined" &&
                typeof window.Eyes.blink === "function"
            ) {

                window.Eyes.blink();

            }

        }

};


// ======================================================
// شروع اولیه
// ======================================================

setEyeState(
    "idle"
);


setConnectionStatus(
    "دارم آماده می‌شم..."
);


// ======================================================
// اتصال بعد از Load
// ======================================================

window.addEventListener(
    "load",
    () => {

        connectGeminiLive();

    }
);


































































































/* =========================================================
   SIDEBAR - COMPLETE CONTROL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sidebar =
        document.querySelector(".control-sidebar");

    const sidebarOpen =
        document.getElementById("sidebarOpen");

    const sidebarClose =
        document.getElementById("sidebarClose");

    const voiceSelect =
        document.getElementById("voiceSelect");

    const volumeControl =
        document.getElementById("volumeControl");

    const glowControl =
        document.getElementById("glowControl");

    const eyeStateSelect =
        document.getElementById("eyeStateSelect");

    const floatingToggle =
        document.getElementById("floatingToggle");

        const floatingRobot =
    document.getElementById(
        "floatingRobot"
    );

    const floatingIntensity =
        document.getElementById("floatingIntensity");

    const blinkToggle =
        document.getElementById("blinkToggle");

    const eyeMovementToggle =
        document.getElementById("eyeMovementToggle");

    const screenBrightness =
        document.getElementById("screenBrightness");

    const darkModeToggle =
        document.getElementById("darkModeToggle");

    const resetControls =
        document.getElementById("resetControls");

    const eyeColors =
        document.querySelectorAll(".eye-color");


    /* =====================================================
       SECTION OPEN / CLOSE
    ===================================================== */

    const sectionButtons =
        document.querySelectorAll(".section-title");


    sectionButtons.forEach(button => {

        button.addEventListener("click", () => {

            const section =
                button.closest(".control-section");

            if (!section) return;

            section.classList.toggle("open");

            const arrow =
                button.querySelector(".section-arrow");

            if (arrow) {

                arrow.style.transform =
                    section.classList.contains("open")
                        ? "rotate(180deg)"
                        : "rotate(0deg)";
            }

        });

    });


    /* =====================================================
       SIDEBAR OPEN
    ===================================================== */

    if (sidebarOpen && sidebar) {

        sidebarOpen.addEventListener("click", () => {

            sidebar.classList.remove("closed");

        });

    }

if (voiceSelect) {

    voiceSelect.value =
        selectedVoice;


    voiceSelect.addEventListener(
        "change",
        () => {

            selectedVoice =
                voiceSelect.value;


            localStorage.setItem(
                "aiVoice",
                selectedVoice
            );


            console.log(
                "🎙️ Voice changed:",
                selectedVoice
            );

        }
    );

}
    /* =====================================================
       SIDEBAR CLOSE
    ===================================================== */

    if (sidebarClose && sidebar) {

        sidebarClose.addEventListener("click", () => {

            sidebar.classList.add("closed");

        });

    }


    /* =====================================================
       EYE COLOR
    ===================================================== */

    function applyEyeColor(color) {

        if (!color) return;


        /* ذخیره رنگ */

        localStorage.setItem(
            "aiEyeColor",
            color
        );


        /* تغییر CSS variable */

        document.documentElement.style
            .setProperty(
                "--eye-color",
                color
            );


        document.body.style
            .setProperty(
                "--eye-color",
                color
            );


        /* اگر سیستم Eyes وجود داشت */

        if (
            window.Eyes &&
            typeof window.Eyes.setColor === "function"
        ) {

            window.Eyes.setColor(color);

        }


        /* اگر RobotEyes وجود داشت */

        else if (
            window.RobotEyes &&
            typeof window.RobotEyes.setColor === "function"
        ) {

            window.RobotEyes.setColor(color);

        }


        /* تغییر مستقیم چشم‌ها */

        document
            .querySelectorAll(".robot-eye")
            .forEach(eye => {

                eye.style.setProperty(
                    "--eye-color",
                    color
                );

            });


        /* فعال کردن دکمه */

        eyeColors.forEach(button => {

            button.classList.remove("active");

        });

    }


    eyeColors.forEach(button => {

        const color =
            button.dataset.color;


        /* رنگ خود دکمه */

        if (color) {

            button.style.backgroundColor =
                color;

            button.style.setProperty(
                "--eye-button-color",
                color
            );

        }


        button.addEventListener(
            "click",
            () => {

                applyEyeColor(color);

                button.classList.add("active");

            }
        );

    });


    /* رنگ ذخیره شده */

    const savedEyeColor =
        localStorage.getItem(
            "aiEyeColor"
        );


    if (savedEyeColor) {

        applyEyeColor(savedEyeColor);

        eyeColors.forEach(button => {

            if (
                button.dataset.color ===
                savedEyeColor
            ) {

                button.classList.add("active");

            }

        });

    }


    /* =====================================================
       ROBOT EYE STATE
    ===================================================== */

    if (eyeStateSelect) {

        eyeStateSelect.addEventListener(
            "change",
            () => {

                const state =
                    eyeStateSelect.value;

                if (!state) return;


                localStorage.setItem(
                    "aiEyeState",
                    state
                );


                if (
                    window.Eyes &&
                    typeof window.Eyes.setState ===
                    "function"
                ) {

                    window.Eyes.setState(state);

                }

            }
        );

    }


    /* حالت ذخیره شده */

    const savedEyeState =
        localStorage.getItem(
            "aiEyeState"
        );


    if (
        savedEyeState &&
        eyeStateSelect
    ) {

        eyeStateSelect.value =
            savedEyeState;

    }


    /* =====================================================
       VOLUME
    ===================================================== */

    if (volumeControl) {

        volumeControl.addEventListener(
            "input",
            () => {

                const value =
                    Number(volumeControl.value);

                localStorage.setItem(
                    "aiVolume",
                    value
                );


                /* اگر AudioManager وجود داشت */

                if (
                    window.AudioManager &&
                    typeof window.AudioManager
                        .setVolume === "function"
                ) {

                    window.AudioManager
                        .setVolume(value);

                }


                /* صدای Audio element */

                document
                    .querySelectorAll("audio")
                    .forEach(audio => {

                        audio.volume =
                            value / 100;

                    });

            }
        );

    }


    /* =====================================================
       GLOW
    ===================================================== */

    if (glowControl) {

        glowControl.addEventListener(
            "input",
            () => {

                const value =
                    glowControl.value;

                localStorage.setItem(
                    "aiGlow",
                    value
                );


                document.documentElement
                    .style
                    .setProperty(
                        "--eye-glow-strength",
                        value
                    );

            }
        );

    }


    /* =====================================================
       FLOATING
    ===================================================== */

    if (floatingToggle) {

        floatingToggle.addEventListener(
            "change",
            () => {

                const enabled =
                    floatingToggle.checked;

                localStorage.setItem(
                    "aiFloating",
                    enabled
                );


                document.body.classList.toggle(
                    "floating-disabled",
                    !enabled
                );

            }
        );

    }


    /* =====================================================
       FLOATING INTENSITY
    ===================================================== */

    if (floatingIntensity) {

        floatingIntensity.addEventListener(
            "input",
            () => {

                const value =
                    floatingIntensity.value;

                localStorage.setItem(
                    "aiFloatingIntensity",
                    value
                );


                document.documentElement
                    .style
                    .setProperty(
                        "--floating-intensity",
                        value
                    );

            }
        );

    }


    /* =====================================================
       BLINK
    ===================================================== */

    if (blinkToggle) {

        blinkToggle.addEventListener(
            "change",
            () => {

                const enabled =
                    blinkToggle.checked;

                localStorage.setItem(
                    "aiBlink",
                    enabled
                );


                document.body.classList.toggle(
                    "blink-disabled",
                    !enabled
                );


                if (
                    window.Eyes &&
                    typeof window.Eyes.setBlinkEnabled ===
                    "function"
                ) {

                    window.Eyes.setBlinkEnabled(
                        enabled
                    );

                }

            }
        );

    }


    /* =====================================================
       EYE MOVEMENT
    ===================================================== */

    if (eyeMovementToggle) {

        eyeMovementToggle.addEventListener(
            "change",
            () => {

                const enabled =
                    eyeMovementToggle.checked;

                localStorage.setItem(
                    "aiEyeMovement",
                    enabled
                );


                document.body.classList.toggle(
                    "eye-movement-disabled",
                    !enabled
                );


                if (
                    window.Eyes &&
                    typeof window.Eyes.setMovementEnabled ===
                    "function"
                ) {

                    window.Eyes
                        .setMovementEnabled(
                            enabled
                        );

                }

            }
        );

    }


    /* =====================================================
       SCREEN BRIGHTNESS
    ===================================================== */

    if (screenBrightness) {

        screenBrightness.addEventListener(
            "input",
            () => {

                const value =
                    Number(
                        screenBrightness.value
                    );

                localStorage.setItem(
                    "aiBrightness",
                    value
                );


                document.documentElement
                    .style
                    .setProperty(
                        "--screen-brightness",
                        value / 100
                    );

            }
        );

    }


    /* =====================================================
       DARK MODE
    ===================================================== */

    if (darkModeToggle) {

        darkModeToggle.addEventListener(
            "change",
            () => {

                const enabled =
                    darkModeToggle.checked;

                document.body.classList.toggle(
                    "dark-theme",
                    enabled
                );


                localStorage.setItem(
                    "aiDarkMode",
                    enabled
                );

            }
        );

    }


    /* =====================================================
       LOAD SAVED SETTINGS
    ===================================================== */

    const savedVolume =
        localStorage.getItem(
            "aiVolume"
        );

    if (
        savedVolume !== null &&
        volumeControl
    ) {

        volumeControl.value =
            savedVolume;

    }


    const savedGlow =
        localStorage.getItem(
            "aiGlow"
        );

    if (
        savedGlow !== null &&
        glowControl
    ) {

        glowControl.value =
            savedGlow;

        document.documentElement
            .style
            .setProperty(
                "--eye-glow-strength",
                savedGlow
            );

    }


    const savedFloating =
        localStorage.getItem(
            "aiFloating"
        );

    if (
        savedFloating !== null &&
        floatingToggle
    ) {

        const enabled =
            savedFloating === "true";

        floatingToggle.checked =
            enabled;

        document.body.classList.toggle(
            "floating-disabled",
            !enabled
        );

    }


    const savedFloatingIntensity =
        localStorage.getItem(
            "aiFloatingIntensity"
        );

    if (
        savedFloatingIntensity !== null &&
        floatingIntensity
    ) {

        floatingIntensity.value =
            savedFloatingIntensity;

        document.documentElement
            .style
            .setProperty(
                "--floating-intensity",
                savedFloatingIntensity
            );

    }


    const savedBlink =
        localStorage.getItem(
            "aiBlink"
        );

    if (
        savedBlink !== null &&
        blinkToggle
    ) {

        const enabled =
            savedBlink === "true";

        blinkToggle.checked =
            enabled;

        document.body.classList.toggle(
            "blink-disabled",
            !enabled
        );

    }


    const savedMovement =
        localStorage.getItem(
            "aiEyeMovement"
        );

    if (
        savedMovement !== null &&
        eyeMovementToggle
    ) {

        const enabled =
            savedMovement === "true";

        eyeMovementToggle.checked =
            enabled;

        document.body.classList.toggle(
            "eye-movement-disabled",
            !enabled
        );

    }


    const savedBrightness =
        localStorage.getItem(
            "aiBrightness"
        );

    if (
        savedBrightness !== null &&
        screenBrightness
    ) {

        screenBrightness.value =
            savedBrightness;

        document.documentElement
            .style
            .setProperty(
                "--screen-brightness",
                Number(savedBrightness) / 100
            );

    }


    const savedDarkMode =
        localStorage.getItem(
            "aiDarkMode"
        );


    if (
        savedDarkMode === "true" &&
        darkModeToggle
    ) {

        darkModeToggle.checked = true;

        document.body.classList.add(
            "dark-theme"
        );

    }


    /* =====================================================
       RESET ALL
    ===================================================== */

    if (resetControls) {

        resetControls.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    "aiEyeColor"
                );

                localStorage.removeItem(
                    "aiEyeState"
                );

                localStorage.removeItem(
                    "aiVolume"
                );

                localStorage.removeItem(
                    "aiGlow"
                );

                localStorage.removeItem(
                    "aiFloating"
                );

                localStorage.removeItem(
                    "aiFloatingIntensity"
                );

                localStorage.removeItem(
                    "aiBlink"
                );

                localStorage.removeItem(
                    "aiEyeMovement"
                );

                localStorage.removeItem(
                    "aiBrightness"
                );

                localStorage.removeItem(
                    "aiDarkMode"
                );


                location.reload();

            }
        );

    }

});




































// ======================================================
// CHAT PDF + GEMINI PDF SESSION
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // ELEMENTS
    // ==================================================

    const fileButton =
        document.getElementById("chatFile");

    const fileInput =
        document.getElementById("chatFileInput");

    const filePreview =
        document.getElementById("chatFilePreview");

    const fileName =
        document.getElementById("chatFileName");

    const fileRemove =
        document.getElementById("chatFileRemove");

    const chatInput =
        document.getElementById("chatInput");

    const chatSend =
        document.getElementById("chatSend");

    const chatMessages =
        document.getElementById("chatMessages");


    // ==================================================
    // PDF STATE
    // ==================================================

    let selectedPDF = null;

    let pdfSessionId = null;

    let pdfUploading = false;

    let pdfReady = false;

    let pdfSending = false;


    // ==================================================
    // CHAT MESSAGE
    // ==================================================

    function addChatMessage(
        text,
        type = "user"
    ) {

        if (!chatMessages) {
            return null;
        }


        const message =
            document.createElement("div");


        message.className =
            `chat-message ${type}-message`;


        const avatar =
            document.createElement("div");


        avatar.className =
            "message-avatar";


        avatar.textContent =
            type === "user"
                ? "تو"
                : "AI";


        const content =
            document.createElement("div");


        content.className =
            "message-content";


        const name =
            document.createElement("span");


        name.className =
            "message-name";


        name.textContent =
            type === "user"
                ? "شما"
                : "دستیار";


        const paragraph =
            document.createElement("p");


        paragraph.textContent =
            text;


        content.appendChild(name);

        content.appendChild(paragraph);

        message.appendChild(avatar);

        message.appendChild(content);

        chatMessages.appendChild(message);


        chatMessages.scrollTop =
            chatMessages.scrollHeight;


        return message;

    }


    // ==================================================
    // LOADING MESSAGE
    // ==================================================

    function addLoadingMessage(
        text = "دارم بررسی می‌کنم... 🧠"
    ) {

        if (!chatMessages) {
            return null;
        }


        const message =
            document.createElement("div");


        message.className =
            "chat-message ai-message";


        const avatar =
            document.createElement("div");


        avatar.className =
            "message-avatar";


        avatar.textContent =
            "AI";


        const content =
            document.createElement("div");


        content.className =
            "message-content";


        const name =
            document.createElement("span");


        name.className =
            "message-name";


        name.textContent =
            "دستیار";


        const paragraph =
            document.createElement("p");


        paragraph.textContent =
            text;


        content.appendChild(name);

        content.appendChild(paragraph);

        message.appendChild(avatar);

        message.appendChild(content);

        chatMessages.appendChild(message);


        chatMessages.scrollTop =
            chatMessages.scrollHeight;


        return message;

    }


    // ==================================================
    // UPDATE LOADING MESSAGE
    // ==================================================

    function updateLoadingMessage(
        message,
        text
    ) {

        if (!message) {
            return;
        }


        const paragraph =
            message.querySelector("p");


        if (paragraph) {

            paragraph.textContent =
                text;

        }


        if (chatMessages) {

            chatMessages.scrollTop =
                chatMessages.scrollHeight;

        }

    }


    // ==================================================
    // CHECK API
    // ==================================================

    function checkAPI() {

        if (
            typeof API_URL ===
            "undefined"
        ) {

            throw new Error(
                "API_URL تعریف نشده است."
            );

        }

    }


    // ==================================================
    // UPDATE PUBLIC STATE
    // ==================================================

    function updatePDFState() {

        window.ChatPDFState = {

            sessionId:
                pdfSessionId,

            fileName:
                selectedPDF
                    ? selectedPDF.name
                    : null,

            ready:
                pdfReady

        };

    }


    // ==================================================
    // UPLOAD PDF TO GEMINI
    // ==================================================

    async function uploadPDFToGemini(
        pdfFile
    ) {

        if (!pdfFile) {

            throw new Error(
                "فایل PDF وجود ندارد."
            );

        }


        checkAPI();


        // ----------------------------------------------
        // اگر قبلاً Session داریم
        // دوباره آپلود نکن
        // ----------------------------------------------

        if (pdfSessionId) {

            console.log(
                "📄 PDF session already exists:",
                pdfSessionId
            );

            return {

                success: true,

                sessionId:
                    pdfSessionId

            };

        }


        // ----------------------------------------------
        // اگر در حال آپلود است
        // ----------------------------------------------

        if (pdfUploading) {

            console.log(
                "⏳ PDF upload already in progress..."
            );


            // صبر می‌کنیم تا آپلود فعلی تمام شود

            while (pdfUploading) {

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            100
                        )
                );

            }


            if (pdfSessionId) {

                return {

                    success: true,

                    sessionId:
                        pdfSessionId

                };

            }

        }


        pdfUploading =
            true;

        pdfReady =
            false;


        updatePDFState();


        const loadingMessage =
            addLoadingMessage(
                "دارم PDF رو برای ربات آماده می‌کنم... 📄🧠"
            );


        try {

            console.log(
                "📤 Uploading PDF:",
                pdfFile.name
            );


            const formData =
                new FormData();


            formData.append(
                "pdf",
                pdfFile
            );


            const response =
                await fetch(

                    API_URL +
                    "/ai/pdf/upload",

                    {

                        method:
                            "POST",

                        body:
                            formData

                    }

                );


            let data;


            try {

                data =
                    await response.json();

            }

            catch {

                throw new Error(
                    "پاسخ معتبر از سرور دریافت نشد."
                );

            }


            if (!response.ok) {

                throw new Error(

                    data.message ||
                    data.error ||
                    "خطا در آپلود PDF."

                );

            }


            if (
                !data.success ||
                !data.sessionId
            ) {

                throw new Error(
                    "Gemini session برای PDF ساخته نشد."
                );

            }


            // ------------------------------------------
            // SAVE SESSION
            // ------------------------------------------

            pdfSessionId =
                data.sessionId;


            pdfReady =
                true;


            console.log(
                "✅ PDF SESSION READY:",
                pdfSessionId
            );


            console.log(
                "📄 PDF:",
                data.fileName ||
                pdfFile.name
            );


            updatePDFState();


            // ------------------------------------------
            // UPDATE MESSAGE
            // ------------------------------------------

            updateLoadingMessage(

                loadingMessage,

                `PDF «${pdfFile.name}» آماده شد. دارم سؤال رو بررسی می‌کنم... 🔎🧠`

            );


            return data;

        }

        catch (error) {

            console.error(
                "❌ PDF UPLOAD ERROR:",
                error
            );


            pdfSessionId =
                null;


            pdfReady =
                false;


            updatePDFState();


            updateLoadingMessage(

                loadingMessage,

                "نتونستم PDF رو آماده کنم 😕"

            );


            throw error;

        }

        finally {

            pdfUploading =
                false;

        }

    }


    
    // ==================================================
    // OPEN PDF FROM BACKEND TEMP-FILES
    // ==================================================

    async function openPDFFromServer(filename) {

        if (
            typeof filename !== "string" ||
            !filename.trim() ||
            filename !== filename.split(/[\\/]/).pop() ||
            !filename.toLowerCase().endsWith(".pdf")
        ) {
            throw new Error("نام فایل PDF معتبر نیست.");
        }

        checkAPI();

        const apiRoot = API_URL.replace(/\/+$/, "");

        const apiBase = apiRoot.endsWith("/api")
            ? apiRoot
            : `${apiRoot}/api`;

        const serverBase = apiRoot.replace(/\/api$/, "");

        const loadingMessage = addLoadingMessage(
            `دارم فایل «${filename}» رو از سرور دریافت می‌کنم... 📄`
        );

        try {
            // ابتدا فهرست معتبر فایل‌ها را دریافت می‌کنیم
            const listResponse = await fetch(
                `${apiBase}/ai/pdf/list-files`
            );

            const listData = await listResponse.json();

            if (!listResponse.ok || !listData.success) {
                throw new Error(
                    listData.message || "دریافت فهرست PDFها ناموفق بود."
                );
            }

            // فقط فایل موجود در فهرست سرور پذیرفته می‌شود
            if (!listData.files.includes(filename)) {
                throw new Error(
                    "این فایل در فهرست PDFهای سرور وجود ندارد."
                );
            }

            // دریافت فایل PDF از مسیر استاتیک بک‌اند
            const fileURL =
                `${serverBase}/temp-files/${encodeURIComponent(filename)}`;

            const fileResponse = await fetch(fileURL);

            if (!fileResponse.ok) {
                throw new Error(
                    "دریافت فایل از سرور ناموفق بود."
                );
            }

            const blob = await fileResponse.blob();

            if (
                blob.type &&
                blob.type !== "application/pdf" &&
                blob.type !== "application/octet-stream"
            ) {
                throw new Error(
                    "پاسخ سرور یک فایل PDF معتبر نیست."
                );
            }

            if (blob.size === 0) {
                throw new Error("فایل PDF خالی است.");
            }

            if (blob.size > 50 * 1024 * 1024) {
                throw new Error(
                    "حجم فایل بیشتر از محدودیت ۵۰ مگابایت است."
                );
            }

            const pdfFile = new File(
                [blob],
                filename,
                { type: "application/pdf" }
            );

            // بستن نشست قبلی، در صورت وجود
            if (pdfSessionId) {
                await closePDFSession();
            }

            selectedPDF = pdfFile;
            pdfSessionId = null;
            pdfReady = false;

            updatePDFState();

            if (fileInput) {
                fileInput.value = "";
            }

            if (fileName) {
                fileName.textContent = filename;
            }

            if (filePreview) {
                filePreview.hidden = false;
            }

            // استفاده از همان سیستم آپلود فعلی
            const uploadResult = await uploadPDFToGemini(pdfFile);

            if (
                !uploadResult ||
                !uploadResult.success ||
                !pdfSessionId
            ) {
                throw new Error(
                    "ساخت نشست PDF ناموفق بود."
                );
            }

            updateLoadingMessage(
                loadingMessage,
                `فایل «${filename}» آماده سؤال‌وجواب است. ✅`
            );

            console.log("✅ Server PDF opened:", filename);

            return {
                success: true,
                filename,
                sessionId: pdfSessionId
            };

        } catch (error) {
            console.error("❌ OPEN SERVER PDF ERROR:", error);

            updateLoadingMessage(
                loadingMessage,
                `باز کردن PDF ناموفق بود: ${error.message}`
            );

            throw error;
        }
    }

    // ==================================================
    // ASK GEMINI ABOUT PDF
    // ==================================================

    async function askPDF(
        userMessage
    ) {

        if (!pdfSessionId) {

            throw new Error(
                "هیچ PDF فعالی وجود ندارد."
            );

        }


        if (
            !userMessage ||
            !userMessage.trim()
        ) {

            throw new Error(
                "سؤال خالی است."
            );

        }


        checkAPI();


        const loadingMessage =
            addLoadingMessage(
                "دارم از روی PDF جواب رو پیدا می‌کنم... 🔎📄"
            );


        try {

            console.log(
                "💬 PDF QUESTION:",
                userMessage
            );


            const response =
                await fetch(

                    API_URL +
                    "/ai/pdf/chat",

                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                sessionId:
                                    pdfSessionId,

                                message:
                                    userMessage

                            })

                    }

                );


            let data;


            try {

                data =
                    await response.json();

            }

            catch {

                throw new Error(
                    "پاسخ معتبر از سرور دریافت نشد."
                );

            }


            if (!response.ok) {

                throw new Error(

                    data.message ||
                    data.error ||
                    "خطا در سؤال از PDF."

                );

            }


            if (!data.reply) {

                throw new Error(
                    "Gemini پاسخی برنگرداند."
                );

            }


            // ------------------------------------------
            // SHOW ANSWER
            // ------------------------------------------

            updateLoadingMessage(

                loadingMessage,

                data.reply

            );


            console.log(
                "🤖 PDF ANSWER:",
                data.reply
            );


            return data;

        }

        catch (error) {

            console.error(
                "❌ PDF CHAT ERROR:",
                error
            );


            updateLoadingMessage(

                loadingMessage,

                "نتونستم از روی PDF جواب بدم 😕"

            );


            throw error;

        }

    }


    // ==================================================
    // CLOSE PDF SESSION
    // ==================================================

    async function closePDFSession() {

        if (!pdfSessionId) {

            pdfReady =
                false;

            updatePDFState();

            return;

        }


        checkAPI();


        const oldSession =
            pdfSessionId;


        console.log(
            "🗑️ Closing PDF session:",
            oldSession
        );


        // ----------------------------------------------
        // اول Session را از Frontend پاک می‌کنیم
        // ----------------------------------------------

        pdfSessionId =
            null;


        pdfReady =
            false;


        updatePDFState();


        try {

            const response =
                await fetch(

                    API_URL +
                    "/ai/pdf/close",

                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                sessionId:
                                    oldSession

                            })

                    }

                );


            let data;


            try {

                data =
                    await response.json();

            }

            catch {

                data = null;

            }


            console.log(
                "🗑️ PDF session closed:",
                data
            );

        }

        catch (error) {

            console.warn(
                "⚠️ Could not close PDF session:",
                error
            );

        }

    }


    // ==================================================
    // OPEN FILE SELECTOR
    // ==================================================

    fileButton?.addEventListener(
        "click",
        () => {

            fileInput?.click();

        }
    );


    // ==================================================
    // PDF SELECTED
    // ==================================================

    fileInput?.addEventListener(
        "change",
        async () => {

            const file =
                fileInput.files?.[0];


            if (!file) {
                return;
            }


            // ------------------------------------------
            // TYPE CHECK
            // ------------------------------------------

            if (
                file.type !==
                "application/pdf"
            ) {

                alert(
                    "لطفاً فقط فایل PDF انتخاب کن."
                );


                fileInput.value =
                    "";


                return;

            }


            // ------------------------------------------
            // SIZE CHECK
            // ------------------------------------------

            const maxSize =
                50 *
                1024 *
                1024;


            if (
                file.size >
                maxSize
            ) {

                alert(
                    "حجم PDF نباید بیشتر از 50 مگابایت باشد."
                );


                fileInput.value =
                    "";


                return;

            }


            // ------------------------------------------
            // PDF قبلی
            // اگر Session داشت، ببند
            // ------------------------------------------

            if (pdfSessionId) {

                await closePDFSession();

            }


            // ------------------------------------------
            // PDF جدید
            // فقط انتخاب می‌شود
            // هنوز آپلود نمی‌شود
            // ------------------------------------------

            selectedPDF =
                file;


            pdfSessionId =
                null;


            pdfReady =
                false;


            updatePDFState();


            // ------------------------------------------
            // SHOW FILE
            // ------------------------------------------

            if (fileName) {

                fileName.textContent =
                    file.name;

            }


            if (filePreview) {

                filePreview.hidden =
                    false;

            }


            console.log(
                "📄 PDF selected:",
                file.name
            );


            console.log(
                "⏳ PDF upload postponed until Send."
            );

        }
    );


    // ==================================================
    // REMOVE PDF
    // ==================================================

    fileRemove?.addEventListener(
        "click",
        async () => {

            console.log(
                "📄 Removing PDF..."
            );


            await closePDFSession();


            selectedPDF =
                null;


            pdfSessionId =
                null;


            pdfReady =
                false;


            pdfUploading =
                false;


            updatePDFState();


            if (fileInput) {

                fileInput.value =
                    "";

            }


            if (filePreview) {

                filePreview.hidden =
                    true;

            }


            if (fileName) {

                fileName.textContent =
                    "فایل PDF";

            }


            console.log(
                "✅ PDF removed"
            );

        }
    );


    // ==================================================
    // SEND CHAT MESSAGE
    // ==================================================

    async function sendChatMessage() {

        if (!chatInput) {
            return;
        }


        // ----------------------------------------------
        // جلوگیری از ارسال همزمان
        // ----------------------------------------------

        if (pdfSending) {

            console.log(
                "⏳ Previous PDF request is still running..."
            );

            return;

        }


        const text =
            chatInput.value.trim();


        // ----------------------------------------------
        // NOTHING
        // ----------------------------------------------

        if (!text) {
            return;
        }


        // ----------------------------------------------
        // LOCK
        // ----------------------------------------------

        pdfSending =
            true;


        try {

            // ------------------------------------------
            // ADD USER MESSAGE
            // ------------------------------------------

            addChatMessage(
                text,
                "user"
            );


            chatInput.value =
                "";


            // ==========================================
            // PDF SELECTED BUT NOT UPLOADED
            // ==========================================

            if (
                selectedPDF &&
                !pdfSessionId
            ) {

                console.log(
                    "📄 First question for PDF."
                );


                // --------------------------------------
                // مرحله 1:
                // آپلود PDF
                // --------------------------------------

                try {

                    await uploadPDFToGemini(
                        selectedPDF
                    );

                }

                catch (error) {

                    console.error(
                        "❌ First PDF upload failed:",
                        error
                    );


                    addChatMessage(
                        "آپلود PDF انجام نشد. دوباره تلاش کن.",
                        "ai"
                    );


                    return;

                }


                // --------------------------------------
                // مرحله 2:
                // سؤال از PDF
                // --------------------------------------

                try {

                    await askPDF(
                        text
                    );

                }

                catch (error) {

                    console.error(
                        "❌ First PDF question failed:",
                        error
                    );


                    addChatMessage(
                        "نتونستم سؤال رو از PDF بپرسم 😕",
                        "ai"
                    );

                }


                return;

            }


            // ==========================================
            // PDF SESSION ALREADY EXISTS
            // ==========================================

            if (pdfSessionId) {

                console.log(
                    "📄 Using existing PDF session:",
                    pdfSessionId
                );


                try {

                    await askPDF(
                        text
                    );

                }

                catch (error) {

                    console.error(
                        "❌ PDF question error:",
                        error
                    );


                    addChatMessage(
                        "نتونستم از روی PDF جواب بدم 😕",
                        "ai"
                    );

                }


                return;

            }


            // ==========================================
            // NORMAL CHAT
            // ==========================================

            console.log(
                "💬 Normal chat:",
                text
            );


            /*
             * فعلاً پیام معمولی
             * به Gemini Live متصل نمی‌شود.
             *
             * بعداً این قسمت را
             * به Chat + Live وصل می‌کنیم.
             */


        }

        finally {

            pdfSending =
                false;

        }

    }


    // ==================================================
    // SEND BUTTON
    // ==================================================

    chatSend?.addEventListener(
        "click",
        sendChatMessage
    );


    // ==================================================
    // ENTER
    // ==================================================

    chatInput?.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();


                sendChatMessage();

            }

        }
    );


    // ==================================================
    // PUBLIC PDF API
    // ==================================================

    window.ChatPDF = {

        // ----------------------------------------------
        // GET FILE
        // ----------------------------------------------

        getFile() {

            return selectedPDF;

        },


        // ----------------------------------------------
        // GET SESSION
        // ----------------------------------------------

        getSessionId() {

            return pdfSessionId;

        },


        // ----------------------------------------------
        // IS READY
        // ----------------------------------------------

        isReady() {

            return pdfReady;

        },


        // ----------------------------------------------
        // IS UPLOADING
        // ----------------------------------------------

        isUploading() {

            return pdfUploading;

        },


        // ----------------------------------------------
        // UPLOAD
        // ----------------------------------------------

        upload() {

            if (!selectedPDF) {

                console.warn(
                    "📄 No PDF selected."
                );


                return null;

            }


            return uploadPDFToGemini(
                selectedPDF
            );

        },


        
        // ----------------------------------------------
        // OPEN PDF FROM SERVER
        // ----------------------------------------------

        openFromServer(filename) {
            return openPDFFromServer(filename);
        },


        // ----------------------------------------------
        // ASK
        // ----------------------------------------------

        ask(message) {

            return askPDF(
                message
            );

        },


        // ----------------------------------------------
        // CLOSE
        // ----------------------------------------------

        close() {

            return closePDFSession();

        },


        // ----------------------------------------------
        // CLEAR
        // ----------------------------------------------

        async clear() {

            await closePDFSession();


            selectedPDF =
                null;


            pdfSessionId =
                null;


            pdfReady =
                false;


            pdfUploading =
                false;


            updatePDFState();


            if (fileInput) {

                fileInput.value =
                    "";

            }


            if (filePreview) {

                filePreview.hidden =
                    true;

            }


            if (fileName) {

                fileName.textContent =
                    "فایل PDF";

            }


            console.log(
                "🧹 PDF state cleared."
            );

        }

    };


    // ==================================================
    // PUBLIC CHAT API
    // ==================================================

    window.ChatAI = {

        send:
            sendChatMessage,

        askPDF:
            askPDF,

        uploadPDF:
            uploadPDFToGemini

    };


    // ==================================================
    // INITIAL STATE
    // ==================================================

    updatePDFState();


    console.log(
        "🤖 Chat PDF system ready"
    );



    

});