// ======================================================
// حرکات چشم ربات
// Eye Mood & Animation Controller
// نسخه دوگانه: Main + Floating
// ======================================================

const Eyes = (() => {

    console.log("👀 Eyes Controller Loading...");


    // ==================================================
    // عناصر اصلی
    // ==================================================

    const screen =
        document.getElementById("aiScreen");

    const floatingRobot =
        document.getElementById("floatingRobot");


    // ==================================================
    // گرفتن چشم‌ها
    //
    // به جای نگه داشتن یک leftEye/rightEye ثابت،
    // هر بار هر دو مجموعه چشم را پیدا می‌کنیم.
    // ==================================================

    function getEyePairs() {

        const pairs = [];


        // ----------------------------------------------
        // چشم اصلی
        // ----------------------------------------------

        const mainLeft =
            document.getElementById("leftEye");

        const mainRight =
            document.getElementById("rightEye");


        if (mainLeft && mainRight) {

            pairs.push({
                left: mainLeft,
                right: mainRight,
                container: screen
            });

        }


        // ----------------------------------------------
        // چشم شناور
        // ----------------------------------------------

        if (floatingRobot) {

            const floatingLeft =
                floatingRobot.querySelector(
                    ".left-eye .robot-eye"
                );

            const floatingRight =
                floatingRobot.querySelector(
                    ".right-eye .robot-eye"
                );


            if (
                floatingLeft &&
                floatingRight
            ) {

                pairs.push({
                    left: floatingLeft,
                    right: floatingRight,
                    container: floatingRobot
                });

            }

        }


        return pairs;

    }


    // ==================================================
    // حالت‌های مجاز
    // ==================================================

    const states = [

        "idle",

        "listening",
        "speaking",
        "thinking",
        "searching",

        "happy",
        "sad",
        "surprised",
        "angry",

        "sleepy",
        "lazy",
        "excited",
        "confused",
        "focused",
        "upset",
        "love",

        "blink"

    ];


    // ==================================================
    // وضعیت فعلی
    // ==================================================

    let currentState = "idle";
    let previousState = "idle";


    // ==================================================
    // تایمرها
    // ==================================================

    let animationTimer = null;
    let blinkTimer = null;
    let blinkReturnTimer = null;


    // ==================================================
    // تنظیمات پلک
    // ==================================================

    let autoBlinkEnabled = true;
    let blinkInterval = 15000;


    // ==================================================
    // بررسی آماده بودن
    // ==================================================

    function isReady() {

        return Boolean(
            screen &&
            getEyePairs().length > 0
        );

    }


    // ==================================================
    // توقف حرکت
    // ==================================================

    function stopAnimation() {

        if (
            animationTimer !== null
        ) {

            clearInterval(
                animationTimer
            );

            animationTimer = null;

        }

    }


    // ==================================================
    // پاک کردن تایمر برگشت پلک
    // ==================================================

    function clearBlinkReturnTimer() {

        if (
            blinkReturnTimer !== null
        ) {

            clearTimeout(
                blinkReturnTimer
            );

            blinkReturnTimer = null;

        }

    }


    // ==================================================
    // ریست حرکت
    // ==================================================

    function resetMovement() {

        const pairs =
            getEyePairs();


        pairs.forEach(pair => {

            pair.left.style.translate = "";
            pair.right.style.translate = "";

            pair.left.style.scale = "";
            pair.right.style.scale = "";

        });

    }


    // ==================================================
    // حرکت چشم‌ها
    // ==================================================

    function moveEyes(
        x = 0,
        y = 0
    ) {

        const pairs =
            getEyePairs();


        pairs.forEach(pair => {

            // ------------------------------------------
            // متغیرهای CSS
            // ------------------------------------------

            pair.left.style.setProperty(
                "--eye-x",
                `${x}px`
            );

            pair.left.style.setProperty(
                "--eye-y",
                `${y}px`
            );


            pair.right.style.setProperty(
                "--eye-x",
                `${x}px`
            );

            pair.right.style.setProperty(
                "--eye-y",
                `${y}px`
            );


            // ------------------------------------------
            // حرکت واقعی
            // ------------------------------------------

            pair.left.style.translate =
                `${x}px ${y}px`;

            pair.right.style.translate =
                `${x}px ${y}px`;

        });

    }


    // ==================================================
    // برگشت به مرکز
    // ==================================================

    function centerEyes() {

        moveEyes(0, 0);

    }


    // ==================================================
    // اعمال کلاس روی صفحه اصلی و شناور
    // ==================================================

    function applyStateClass(state) {

        if (!screen) {
            return false;
        }


        if (!states.includes(state)) {

            console.warn(
                "👀 حالت چشم نامعتبر:",
                state
            );

            return false;

        }


        // ----------------------------------------------
        // صفحه اصلی
        // ----------------------------------------------

        screen.classList.remove(
            ...states
        );

        screen.classList.add(
            state
        );


        // ----------------------------------------------
        // ربات شناور
        // ----------------------------------------------

        if (floatingRobot) {

            floatingRobot.classList.remove(
                ...states
            );

            floatingRobot.classList.add(
                state
            );

        }


        // ----------------------------------------------
        // ذخیره وضعیت
        // ----------------------------------------------

        previousState =
            currentState;

        currentState =
            state;


        console.log(
            "👀 Eye State:",
            state
        );


        return true;

    }


    // ==================================================
    // IDLE
    // ==================================================

    function idleMovement() {

        stopAnimation();

        centerEyes();


        let direction = 1;
        let position = 0;


        animationTimer =
            setInterval(() => {

                position +=
                    direction * 0.5;


                if (position >= 3) {
                    direction = -1;
                }


                if (position <= -3) {
                    direction = 1;
                }


                moveEyes(
                    position,
                    0
                );

            }, 80);

    }


    // ==================================================
    // THINKING
    // ==================================================

    function thinkingMovement() {

        stopAnimation();

        centerEyes();


        let direction = 1;
        let position = 0;


        animationTimer =
            setInterval(() => {

                position +=
                    direction * 0.7;


                if (position >= 5) {
                    direction = -1;
                }


                if (position <= -5) {
                    direction = 1;
                }


                moveEyes(
                    position,
                    -3
                );

            }, 90);

    }


    // ==================================================
    // SEARCHING
    // ==================================================

    function searchingMovement() {

        stopAnimation();

        centerEyes();


        let position = -5;
        let direction = 1;


        animationTimer =
            setInterval(() => {

                position +=
                    direction;


                if (position >= 5) {
                    direction = -1;
                }


                if (position <= -5) {
                    direction = 1;
                }


                moveEyes(
                    position,
                    0
                );

            }, 70);

    }


    // ==================================================
    // LISTENING
    // ==================================================

    function listeningMovement() {

        stopAnimation();

        centerEyes();


        let up = false;


        animationTimer =
            setInterval(() => {

                up = !up;


                moveEyes(
                    0,
                    up ? -2 : 0
                );

            }, 700);

    }


    // ==================================================
    // SPEAKING
    // ==================================================

    function speakingMovement() {

        stopAnimation();

        centerEyes();


        let scale = 1;
        let direction = 1;


        animationTimer =
            setInterval(() => {

                scale +=
                    direction * 0.01;


                if (scale >= 1.04) {
                    direction = -1;
                }


                if (scale <= 0.98) {
                    direction = 1;
                }


                const pairs =
                    getEyePairs();


                pairs.forEach(pair => {

                    pair.left.style.scale =
                        scale;

                    pair.right.style.scale =
                        scale;

                });

            }, 40);

    }


    // ==================================================
    // EXCITED
    // ==================================================

    function excitedMovement() {

        stopAnimation();

        centerEyes();


        animationTimer =
            setInterval(() => {

                const x =
                    (Math.random() - 0.5) * 3;

                const y =
                    (Math.random() - 0.5) * 3;


                moveEyes(
                    x,
                    y
                );

            }, 120);

    }


    // ==================================================
    // HAPPY
    // ==================================================

    function happyMovement() {

        stopAnimation();

        centerEyes();

    }


    // ==================================================
    // SAD
    // ==================================================

    function sadMovement() {

        stopAnimation();

        centerEyes();

    }


    // ==================================================
    // ANGRY
    // ==================================================

    function angryMovement() {

        stopAnimation();

        centerEyes();

    }


    // ==================================================
    // SURPRISED
    // ==================================================

    function surprisedMovement() {

        stopAnimation();

        centerEyes();

    }


    // ==================================================
    // SLEEPY
    // ==================================================

    function sleepyMovement() {

        stopAnimation();

        centerEyes();


        let y = 0;
        let direction = 1;


        animationTimer =
            setInterval(() => {

                y +=
                    direction * 0.25;


                if (y >= 1.5) {
                    direction = -1;
                }


                if (y <= 0) {
                    direction = 1;
                }


                moveEyes(
                    0,
                    y
                );

            }, 120);

    }


    // ==================================================
    // LAZY
    // ==================================================

    function lazyMovement() {

        stopAnimation();

        centerEyes();


        let y = 8;
        let direction = 1;


        animationTimer =
            setInterval(() => {

                y +=
                    direction * 0.15;


                if (y >= 10) {
                    direction = -1;
                }


                if (y <= 7) {
                    direction = 1;
                }


                moveEyes(
                    0,
                    y
                );

            }, 150);

    }


    // ==================================================
    // CONFUSED
    // ==================================================

    function confusedMovement() {

        stopAnimation();

        centerEyes();


        let x = 0;
        let direction = 1;


        animationTimer =
            setInterval(() => {

                x +=
                    direction * 0.2;


                if (x >= 2) {
                    direction = -1;
                }


                if (x <= -2) {
                    direction = 1;
                }


                moveEyes(
                    x,
                    0
                );

            }, 150);

    }


    // ==================================================
    // FOCUSED
    // ==================================================

    function focusedMovement() {

        stopAnimation();

        centerEyes();

    }


    // ==================================================
    // UPSET
    // ==================================================

    function upsetMovement() {

        stopAnimation();

        centerEyes();

    }


    // ==================================================
    // LOVE
    // ==================================================

    function loveMovement() {

        stopAnimation();

        centerEyes();

    }


    // ==================================================
    // تغییر حالت اصلی
    // ==================================================

    function setState(state) {

        if (!isReady()) {

            console.warn(
                "⚠️ عناصر چشم پیدا نشدند."
            );

            return false;

        }


        if (!states.includes(state)) {

            console.warn(
                "👀 حالت چشم نامعتبر:",
                state
            );

            return false;

        }


        // ----------------------------------------------
        // توقف حرکت قبلی
        // ----------------------------------------------

        stopAnimation();


        // ----------------------------------------------
        // توقف تایمر برگشت پلک
        // ----------------------------------------------

        clearBlinkReturnTimer();


        // ----------------------------------------------
        // پاک کردن حرکت قبلی
        // ----------------------------------------------

        resetMovement();


        // ----------------------------------------------
        // اعمال state
        // ----------------------------------------------

        const applied =
            applyStateClass(state);


        if (!applied) {
            return false;
        }


        // ----------------------------------------------
        // اجرای انیمیشن
        // ----------------------------------------------

        switch (state) {

            case "idle":
                idleMovement();
                break;


            case "thinking":
                thinkingMovement();
                break;


            case "searching":
                searchingMovement();
                break;


            case "listening":
                listeningMovement();
                break;


            case "speaking":
                speakingMovement();
                break;


            case "excited":
                excitedMovement();
                break;


            case "sleepy":
                sleepyMovement();
                break;


            case "lazy":
                lazyMovement();
                break;


            case "confused":
                confusedMovement();
                break;


            case "focused":
                focusedMovement();
                break;


            case "upset":
                upsetMovement();
                break;


            case "love":
                loveMovement();
                break;


            case "happy":
                happyMovement();
                break;


            case "sad":
                sadMovement();
                break;


            case "angry":
                angryMovement();
                break;


            case "surprised":
                surprisedMovement();
                break;


            case "blink":
                centerEyes();
                break;

        }


        return true;

    }


    // ==================================================
    // سازگاری با نسخه قبلی
    // ==================================================

    function setStateWithAnimation(state) {

        return setState(state);

    }


    // ==================================================
    // حالت‌های عمومی
    // ==================================================

    function idle() {
        setState("idle");
    }


    function listening() {
        setState("listening");
    }


    function speaking() {
        setState("speaking");
    }


    function thinking() {
        setState("thinking");
    }


    function searching() {
        setState("searching");
    }


    function happy() {
        setState("happy");
    }


    function sad() {
        setState("sad");
    }


    function surprised() {
        setState("surprised");
    }


    function angry() {
        setState("angry");
    }


    function sleepy() {
        setState("sleepy");
    }


    function lazy() {
        setState("lazy");
    }


    function excited() {
        setState("excited");
    }


    function confused() {
        setState("confused");
    }


    function focused() {
        setState("focused");
    }


    function upset() {
        setState("upset");
    }


    function love() {
        setState("love");
    }


    // ==================================================
    // پلک زدن
    // ==================================================

    function blink() {

        if (!isReady()) {
            return;
        }


        if (
            currentState === "blink"
        ) {

            return;

        }


        const stateBeforeBlink =
            currentState;


        stopAnimation();

        clearBlinkReturnTimer();

        resetMovement();


        // ----------------------------------------------
        // هر دو چشم → blink
        // ----------------------------------------------

        applyStateClass("blink");


        blinkReturnTimer =
            setTimeout(() => {

                blinkReturnTimer = null;


                if (
                    currentState !== "blink"
                ) {

                    return;

                }


                setState(
                    stateBeforeBlink
                );


            }, 130);

    }


    // ==================================================
    // شروع پلک خودکار
    // ==================================================

    function startAutoBlink() {

        stopAutoBlink();


        if (!autoBlinkEnabled) {
            return;
        }


        blinkTimer =
            setInterval(() => {

                blink();

            }, blinkInterval);

    }


    // ==================================================
    // توقف پلک خودکار
    // ==================================================

    function stopAutoBlink() {

        if (
            blinkTimer !== null
        ) {

            clearInterval(
                blinkTimer
            );

            blinkTimer = null;

        }

    }


    // ==================================================
    // فعال / غیرفعال کردن پلک
    // ==================================================

    function setAutoBlink(enabled) {

        autoBlinkEnabled =
            Boolean(enabled);


        if (autoBlinkEnabled) {

            startAutoBlink();

        } else {

            stopAutoBlink();

        }

    }


    // ==================================================
    // تنظیم فاصله پلک
    // ==================================================

    function setBlinkInterval(ms) {

        const value =
            Number(ms);


        blinkInterval =
            Math.max(
                1000,
                Number.isFinite(value)
                    ? value
                    : 15000
            );


        if (autoBlinkEnabled) {

            startAutoBlink();

        }

    }


    // ==================================================
    // دریافت وضعیت
    // ==================================================

    function getState() {

        return currentState;

    }


    function getPreviousState() {

        return previousState;

    }


    // ==================================================
    // بررسی چشم‌ها
    // ==================================================

    function test() {

        const pairs =
            getEyePairs();


        if (pairs.length === 0) {

            console.error(
                "❌ هیچ چشم رباتی پیدا نشد."
            );

            return false;

        }


        console.log(
            `✅ Eyes Controller Ready → ${pairs.length} pair(s)`
        );


        return true;

    }


    // ==================================================
    // اجرای اولیه
    // ==================================================

    if (isReady()) {

        applyStateClass("idle");

        resetMovement();

        startAutoBlink();

    } else {

        console.warn(
            "⚠️ Eyes Controller: عناصر چشم پیدا نشدند."
        );

    }


    // ==================================================
    // API عمومی
    // ==================================================

    return {

        setState,
        setStateWithAnimation,

        getState,
        getPreviousState,

        idle,
        listening,
        speaking,
        thinking,
        searching,

        happy,
        sad,
        surprised,
        angry,

        sleepy,
        lazy,
        excited,
        confused,
        focused,
        upset,
        love,

        blink,

        startAutoBlink,
        stopAutoBlink,

        setAutoBlink,
        setBlinkInterval,

        test

    };

})();


window.Eyes = Eyes;