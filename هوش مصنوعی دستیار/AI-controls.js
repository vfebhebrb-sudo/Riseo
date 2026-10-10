
/* =========================================================
   AI CONTROLS
   Sidebar + Voice + Robot Controls
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    console.log("🎛️ AI Controls loaded");

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    const voiceSelect = $("#voiceSelect");
    const volumeControl = $("#volumeControl");
    const glowControl = $("#glowControl");
    const eyeStateSelect = $("#eyeStateSelect");
    const floatingToggle = $("#floatingToggle");
    const floatingIntensity = $("#floatingIntensity");
    const blinkToggle = $("#blinkToggle");
    const eyeMovementToggle = $("#eyeMovementToggle");
    const screenBrightness = $("#screenBrightness");
    const darkModeToggle = $("#darkModeToggle");
    const resetControls = $("#resetControls");
    const sidebar = $(".control-sidebar");
    const sidebarOpen = $("#sidebarOpen");
    const sidebarClose = $("#sidebarClose");

    /* =====================================================
       SAFE STORAGE
    ===================================================== */

    function save(key, value) {
        try {
            localStorage.setItem(key, String(value));
        } catch (error) {
            console.warn("Storage save failed:", key, error);
        }
    }

    function read(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : value;
        } catch (error) {
            console.warn("Storage read failed:", key, error);
            return fallback;
        }
    }

    function remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn("Storage remove failed:", key, error);
        }
    }

    function storedBoolean(key, fallback) {
        const value = read(key);
        return value === null ? fallback : value === "true";
    }

    /* =====================================================
       VOICE SYSTEM
    ===================================================== */

    const DEFAULT_VOICE = "default";

    const VOICE_MAP = Object.freeze({
        default: "Kore",
        male: "Puck",
        female: "Kore"
    });

    function getVoiceMode() {
        return voiceSelect?.value || DEFAULT_VOICE;
    }

    function getVoiceName() {
        return VOICE_MAP[getVoiceMode()] || VOICE_MAP.default;
    }

    function setVoice(mode) {
        if (!Object.prototype.hasOwnProperty.call(VOICE_MAP, mode)) {
            console.warn("Unknown voice mode:", mode);
            return;
        }

        if (voiceSelect) {
            voiceSelect.value = mode;
        }

        save("geminiVoiceMode", mode);

        const voiceName = VOICE_MAP[mode];

        console.log("🎙️ Voice selected:", mode, voiceName);

        window.dispatchEvent(
            new CustomEvent("geminiVoiceChanged", {
                detail: {
                    mode,
                    voiceName
                }
            })
        );
    }

    if (voiceSelect) {
        const savedMode = read("geminiVoiceMode", DEFAULT_VOICE);

        voiceSelect.value = Object.prototype.hasOwnProperty.call(
            VOICE_MAP,
            savedMode
        ) ? savedMode : DEFAULT_VOICE;

        voiceSelect.addEventListener("change", () => {
            setVoice(voiceSelect.value);
        });
    }

    window.AIVoice = {
        getMode: getVoiceMode,
        getVoice: getVoiceMode,
        getVoiceName,

        getVoices() {
            return { ...VOICE_MAP };
        },

        setVoice
    };

    /* =====================================================
       SIDEBAR OPEN / CLOSE
    ===================================================== */

    sidebarOpen?.addEventListener("click", () => {
        sidebar?.classList.remove("closed");
    });

    sidebarClose?.addEventListener("click", () => {
        sidebar?.classList.add("closed");
    });

    /* =====================================================
       COLLAPSIBLE SECTIONS
    ===================================================== */

    $$(".section-title").forEach((button) => {
        button.addEventListener("click", () => {
            const section = button.closest(".control-section");

            if (!section) return;

            const isOpen = section.classList.toggle("open");
            const arrow = button.querySelector(".section-arrow");

            button.setAttribute("aria-expanded", String(isOpen));

            if (arrow) {
                arrow.style.transform = isOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)";
            }
        });
    });

    /* =====================================================
       EYE COLOR
    ===================================================== */

    function applyEyeColor(color) {
        if (!color) return;

        document.documentElement.style.setProperty(
            "--eye-color",
            color
        );

        $$(".eye-color").forEach((button) => {
            const active = button.dataset.color === color;

            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        if (
            window.Eyes &&
            typeof window.Eyes.setColor === "function"
        ) {
            window.Eyes.setColor(color);
        }
    }

    $$(".eye-color").forEach((button) => {
        const color = button.dataset.color;

        if (color) {
            button.style.backgroundColor = color;
        }

        button.addEventListener("click", () => {
            if (!color) return;

            save("aiEyeColor", color);
            applyEyeColor(color);
        });
    });

    const savedColor = read("aiEyeColor");

    if (savedColor) {
        applyEyeColor(savedColor);
    }

    /* =====================================================
       ROBOT STATE
    ===================================================== */

    function applyEyeState(state) {
        if (!state || !eyeStateSelect) return;

        const exists = Array.from(eyeStateSelect.options).some(
            (option) => option.value === state
        );

        if (!exists) return;

        eyeStateSelect.value = state;

        if (
            window.Eyes &&
            typeof window.Eyes.setState === "function"
        ) {
            window.Eyes.setState(state);
        }
    }

    eyeStateSelect?.addEventListener("change", () => {
        const state = eyeStateSelect.value;

        save("aiEyeState", state);
        applyEyeState(state);
    });

    const savedState = read("aiEyeState");

    if (savedState) {
        applyEyeState(savedState);
    }

    /* =====================================================
       VOLUME
    ===================================================== */

    function applyVolume(value) {
        if (!volumeControl) return;

        const volume = Math.min(
            100,
            Math.max(0, Number(value) || 0)
        );

        volumeControl.value = volume;

        // Works for ordinary HTML audio elements.
        // Gemini Web Audio output needs its own gain control.
        $$("audio").forEach((audio) => {
            audio.volume = volume / 100;
        });

        document.documentElement.style.setProperty(
            "--ai-volume",
            String(volume / 100)
        );
    }

    volumeControl?.addEventListener("input", () => {
        const value = Number(volumeControl.value);

        save("aiVolume", value);
        applyVolume(value);
    });

    const savedVolume = read("aiVolume");

    if (savedVolume !== null && volumeControl) {
        applyVolume(savedVolume);
    }

    /* =====================================================
       GLOW
    ===================================================== */

    function applyGlow(value) {
        if (!glowControl) return;

        glowControl.value = value;

        document.documentElement.style.setProperty(
            "--eye-glow-strength",
            String(value)
        );
    }

    glowControl?.addEventListener("input", () => {
        save("aiGlow", glowControl.value);
        applyGlow(glowControl.value);
    });

    const savedGlow = read("aiGlow");

    if (savedGlow !== null && glowControl) {
        applyGlow(savedGlow);
    }

    /* =====================================================
       FLOATING
    ===================================================== */

    function applyFloating(enabled) {
        if (floatingToggle) {
            floatingToggle.checked = enabled;
        }

        document.body.classList.toggle(
            "floating-disabled",
            !enabled
        );
    }

    floatingToggle?.addEventListener("change", () => {
        const enabled = floatingToggle.checked;

        if (floatingRobot) {

    floatingRobot.classList.toggle(
        "active",
        enabled
    );

}

        save("aiFloating", enabled);
        applyFloating(enabled);
    });

    applyFloating(storedBoolean("aiFloating", true));

    /* =====================================================
       FLOATING INTENSITY
    ===================================================== */

    function applyFloatingIntensity(value) {
        if (!floatingIntensity) return;

        floatingIntensity.value = value;

        document.documentElement.style.setProperty(
            "--floating-intensity",
            String(value)
        );
    }

    floatingIntensity?.addEventListener("input", () => {
        const value = floatingIntensity.value;

        save("aiFloatingIntensity", value);
        applyFloatingIntensity(value);
    });

    const savedFloatingIntensity = read("aiFloatingIntensity");

    if (
        savedFloatingIntensity !== null &&
        floatingIntensity
    ) {
        applyFloatingIntensity(savedFloatingIntensity);
    }

    /* =====================================================
       BLINK
    ===================================================== */

    function applyBlink(enabled) {
        if (blinkToggle) {
            blinkToggle.checked = enabled;
        }

        document.body.classList.toggle(
            "blink-disabled",
            !enabled
        );

        if (
            window.Eyes &&
            typeof window.Eyes.setBlinkEnabled === "function"
        ) {
            window.Eyes.setBlinkEnabled(enabled);
        }
    }

    blinkToggle?.addEventListener("change", () => {
        const enabled = blinkToggle.checked;

        save("aiBlink", enabled);
        applyBlink(enabled);
    });

    applyBlink(storedBoolean("aiBlink", true));

    /* =====================================================
       EYE MOVEMENT
    ===================================================== */

    function applyEyeMovement(enabled) {
        if (eyeMovementToggle) {
            eyeMovementToggle.checked = enabled;
        }

        document.body.classList.toggle(
            "eye-movement-disabled",
            !enabled
        );

        if (
            window.Eyes &&
            typeof window.Eyes.setMovementEnabled === "function"
        ) {
            window.Eyes.setMovementEnabled(enabled);
        }
    }

    eyeMovementToggle?.addEventListener("change", () => {
        const enabled = eyeMovementToggle.checked;

        save("aiEyeMovement", enabled);
        applyEyeMovement(enabled);
    });

    applyEyeMovement(storedBoolean("aiEyeMovement", true));

    /* =====================================================
       SCREEN BRIGHTNESS
    ===================================================== */

    function applyBrightness(value) {
        if (!screenBrightness) return;

        const brightness = Math.min(
            100,
            Math.max(0, Number(value) || 0)
        );

        screenBrightness.value = brightness;

        document.documentElement.style.setProperty(
            "--screen-brightness",
            String(brightness / 100)
        );
    }

    screenBrightness?.addEventListener("input", () => {
        const value = screenBrightness.value;

        save("aiBrightness", value);
        applyBrightness(value);
    });

    const savedBrightness = read("aiBrightness");

    if (savedBrightness !== null && screenBrightness) {
        applyBrightness(savedBrightness);
    }

    /* =====================================================
       DARK MODE
    ===================================================== */

    function applyDarkMode(enabled) {
        if (darkModeToggle) {
            darkModeToggle.checked = enabled;
        }

        document.body.classList.toggle("dark-theme", enabled);
    }

    darkModeToggle?.addEventListener("change", () => {
        const enabled = darkModeToggle.checked;

        save("aiDarkMode", enabled);
        applyDarkMode(enabled);
    });

    applyDarkMode(storedBoolean("aiDarkMode", false));

    /* =====================================================
       RESET SETTINGS
    ===================================================== */

    resetControls?.addEventListener("click", () => {
        const keys = [
            "geminiVoiceMode",
            "geminiVoice",
            "aiEyeColor",
            "aiEyeState",
            "aiVolume",
            "aiGlow",
            "aiFloating",
            "aiFloatingIntensity",
            "aiBlink",
            "aiEyeMovement",
            "aiBrightness",
            "aiDarkMode"
        ];

        keys.forEach(remove);

        location.reload();
    });

    console.log("🎛️ AI Controls ready");
});