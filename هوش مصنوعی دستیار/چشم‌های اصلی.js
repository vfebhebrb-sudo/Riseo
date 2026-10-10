// ======================================================
// چشم‌های اصلی ربات
// Compatibility Layer
// ======================================================

(() => {

    console.log("👀 Robot Eyes Core Loading...");


    // --------------------------------------------------
    // بررسی سیستم جدید چشم‌ها
    // --------------------------------------------------

    function getEyes() {

        if (
            typeof window.Eyes !== "undefined" &&
            window.Eyes
        ) {

            return window.Eyes;

        }

        return null;

    }


    // --------------------------------------------------
    // تبدیل نام حالت‌های قدیمی به حالت‌های جدید
    // --------------------------------------------------

    const moodMap = {

        neutral: "idle",

        idle: "idle",

        happy: "happy",

        sad: "sad",

        angry: "angry",

        surprised: "surprised",

        thinking: "thinking",

        searching: "searching",

        listening: "listening",

        speaking: "speaking",

        sleepy: "sleepy",

        lazy: "lazy",

        excited: "excited",

        confused: "confused",

        focused: "focused",

        upset: "upset",

        love: "love",

        blink: "blink"

    };


    // --------------------------------------------------
    // تغییر حالت
    // --------------------------------------------------

    function setMood(
        mood
    ) {

        const eyes =
            getEyes();


        if (!eyes) {

            console.warn(
                "⚠️ Eyes controller هنوز آماده نیست."
            );

            return false;

        }


        const state =
            moodMap[mood] || mood;


        try {

            eyes.setState(
                state
            );

            console.log(
                "👀 RobotEyes →",
                state
            );

            return true;

        }

        catch (error) {

            console.error(
                "❌ خطا در تغییر حالت چشم:",
                error
            );

            return false;

        }

    }


    // --------------------------------------------------
    // پخش حالت
    // --------------------------------------------------

    function playMood(
        mood,
        loop = true
    ) {

        return setMood(
            mood
        );

    }


    // --------------------------------------------------
    // توقف انیمیشن
    // --------------------------------------------------

    function stopAnimation() {

        const eyes =
            getEyes();


        if (
            eyes &&
            typeof eyes.stopAllAnimations ===
            "function"
        ) {

            eyes.stopAllAnimations();

            return;

        }


        if (
            eyes &&
            typeof eyes.stopAnimations ===
            "function"
        ) {

            eyes.stopAnimations();

        }

    }


    // --------------------------------------------------
    // چشمک
    // --------------------------------------------------

    function blink(
        duration = 130
    ) {

        const eyes =
            getEyes();


        if (!eyes) {

            return;

        }


        if (
            typeof eyes.blink ===
            "function"
        ) {

            eyes.blink(
                duration
            );

            return;

        }


        setMood(
            "blink"
        );

    }


    // --------------------------------------------------
    // رنگ
    // --------------------------------------------------

    function setColor(
        color
    ) {

        const leftEye =
            document.getElementById(
                "leftEye"
            );

        const rightEye =
            document.getElementById(
                "rightEye"
            );


        if (leftEye) {

            leftEye.style.setProperty(
                "--eye-color",
                color
            );

        }


        if (rightEye) {

            rightEye.style.setProperty(
                "--eye-color",
                color
            );

        }

    }


    // --------------------------------------------------
    // تست
    // --------------------------------------------------

    function test() {

        const leftEye =
            document.getElementById(
                "leftEye"
            );

        const rightEye =
            document.getElementById(
                "rightEye"
            );


        if (
            !leftEye ||
            !rightEye
        ) {

            console.error(
                "❌ leftEye یا rightEye پیدا نشد."
            );

            return false;

        }


        console.log(
            "✅ Robot Eyes Core Ready"
        );

        return true;

    }


    // --------------------------------------------------
    // API
    // --------------------------------------------------

    window.RobotEyes = {

        playMood,

        setMood,

        stopAnimation,

        blink,

        setColor,

        test,

        moods: moodMap

    };


    // --------------------------------------------------
    // شروع
    // --------------------------------------------------

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            () => {

                window.RobotEyes.test();

            },
            {
                once: true
            }
        );

    }

    else {

        window.RobotEyes.test();

    }


})();