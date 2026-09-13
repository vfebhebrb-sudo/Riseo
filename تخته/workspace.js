

/* =========================================================
   RISEO WORKSPACE
   UI + FILE MANAGER
   بدون iframe
   بدون PDF.js Viewer
   بدون postMessage
========================================================= */


/* =========================================================
   GLOBAL ICON HELPER
========================================================= */

function refreshIcons(){

    if(window.lucide){

        lucide.createIcons();

    }

}


/* =========================================================
   WORKSPACE INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =================================================
           FILE MODAL
        ================================================= */

        const openFileBtn =
            document.getElementById("openFileBtn");

        const fileModal =
            document.getElementById("fileModal");

        const fileModalBox =
            document.getElementById("fileModalBox");

        const fileModalClose =
            document.getElementById("fileModalClose");


        function openFileModal(){

            if(fileModal){

                fileModal.classList.add("open");

            }

        }


        function closeFileModal(){

            if(fileModal){

                fileModal.classList.remove("open");

            }

        }


        if(openFileBtn){

            openFileBtn.addEventListener(
                "click",
                openFileModal
            );

        }


        if(fileModalClose){

            fileModalClose.addEventListener(
                "click",
                closeFileModal
            );

        }


        if(fileModal){

            fileModal.addEventListener(
                "click",
                event => {

                    if(
                        fileModalBox &&
                        !fileModalBox.contains(event.target)
                    ){

                        closeFileModal();

                    }

                }
            );

        }


        document.addEventListener(
            "keydown",
            event => {

                if(
                    event.key === "Escape" &&
                    fileModal &&
                    fileModal.classList.contains("open")
                ){

                    closeFileModal();

                }

            }
        );


        /* =================================================
           SIDEBARS
        ================================================= */

        const leftSidebar =
            document.getElementById("leftSidebar");

        const rightSidebar =
            document.getElementById("rightSidebar");

        const leftToggle =
            document.getElementById("leftSidebarToggle");

        const rightToggle =
            document.getElementById("rightSidebarToggle");

        const leftTab =
            document.getElementById("leftSidebarTab");

        const rightTab =
            document.getElementById("rightSidebarTab");


        function updateSidebarIcons(){

            if(leftToggle && leftSidebar){

                leftToggle.innerHTML =
                    leftSidebar.classList.contains("collapsed")
                        ? '<i data-lucide="panel-left-open"></i>'
                        : '<i data-lucide="panel-left-close"></i>';

            }


            if(rightToggle && rightSidebar){

                rightToggle.innerHTML =
                    rightSidebar.classList.contains("collapsed")
                        ? '<i data-lucide="panel-right-open"></i>'
                        : '<i data-lucide="panel-right-close"></i>';

            }


            refreshIcons();

        }


        function toggleLeftSidebar(){

            if(!leftSidebar){

                return;

            }

            leftSidebar.classList.toggle("collapsed");

            updateSidebarIcons();

        }


        function toggleRightSidebar(){

            if(!rightSidebar){

                return;

            }

            rightSidebar.classList.toggle("collapsed");

            updateSidebarIcons();

        }


        if(leftToggle){

            leftToggle.addEventListener(
                "click",
                toggleLeftSidebar
            );

        }


        if(leftTab){

            leftTab.addEventListener(
                "click",
                toggleLeftSidebar
            );

        }


        if(rightToggle){

            rightToggle.addEventListener(
                "click",
                toggleRightSidebar
            );

        }


        if(rightTab){

            rightTab.addEventListener(
                "click",
                toggleRightSidebar
            );

        }


        updateSidebarIcons();


        /* =================================================
           FILE MANAGER
        ================================================= */

        const fileLessonsList =
            document.getElementById("fileLessonsList");

        const fileViewerContent =
            document.getElementById("fileViewerContent");

        const a4Container =
            document.getElementById("a4PagesContainer");


        if(
            !fileLessonsList ||
            !fileViewerContent ||
            !a4Container
        ){

            console.error(
                "FILE MANAGER ELEMENTS NOT FOUND"
            );

            refreshIcons();

            return;

        }


        /* =================================================
           CONFIG / API
        ================================================= */

        if(
            typeof CONFIG === "undefined"
        ){

            console.error(
                "CONFIG پیدا نشد. config1.js باید قبل از workspace.js لود شود."
            );

            return;

        }


        if(
            !CONFIG.API ||
            !CONFIG.ENDPOINTS ||
            !CONFIG.ENDPOINTS.FILES
        ){

            console.error(
                "CONFIG.API یا CONFIG.ENDPOINTS.FILES موجود نیست."
            );

            return;

        }


        const FILES_API =
            CONFIG.API +
            CONFIG.ENDPOINTS.FILES;


        console.log(
            "FILES API:",
            FILES_API
        );


        /* =================================================
           PDF ENGINE STATE
        ================================================= */

        let pdfEngineReady =
            !!(
                window.PDF_ENGINE &&
                typeof window.PDF_ENGINE.open === "function"
            );


        window.addEventListener(
            "PDF_ENGINE_READY",
            () => {

                pdfEngineReady =
                    !!(
                        window.PDF_ENGINE &&
                        typeof window.PDF_ENGINE.open === "function"
                    );


                console.log(
                    "PDF ENGINE CONNECTED:",
                    pdfEngineReady
                );

            }
        );


        /* =================================================
           LESSON BUTTONS
        ================================================= */

        const lessonButtons =
            fileLessonsList.querySelectorAll(
                ".lesson-item"
            );


        lessonButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const lesson =
                            button.dataset.lesson;


                        lessonButtons.forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        button.classList.add(
                            "active"
                        );


                        loadLessonFiles(
                            lesson
                        );

                    }
                );

            }
        );


        /* =================================================
           LOAD LESSON FILES
        ================================================= */

        async function loadLessonFiles(
            lesson
        ){

            try{

                showFileLoading();


                const response =
                    await fetch(
                        `${FILES_API}?lesson=${encodeURIComponent(lesson)}`
                    );


                if(!response.ok){

                    throw new Error(
                        `FILES HTTP ${response.status}`
                    );

                }


                const data =
                    await response.json();


                console.log(
                    "FILES:",
                    data
                );


                if(!data.success){

                    throw new Error(
                        "FILES ERROR"
                    );

                }


                if(
                    !Array.isArray(data.files) ||
                    data.files.length === 0
                ){

                    showEmptyFiles();

                    return;

                }


                renderFiles(
                    data.files
                );

            }
            catch(error){

                console.error(
                    "LOAD FILES ERROR:",
                    error
                );

                showFileError();

            }

        }


        /* =================================================
           RENDER FILE CARDS
        ================================================= */

        function renderFiles(
            files
        ){

            fileViewerContent.innerHTML = "";


            files.forEach(
                file => {

                    const card =
                        document.createElement("div");


                    card.className =
                        "file-item";


                    card.innerHTML = `

                        <div class="file-item-icon">

                            <i data-lucide="file-text"></i>

                        </div>

                        <div class="file-item-info">

                            <div class="file-item-name">
                                ${escapeHtml(file.name)}
                            </div>

                            <div class="file-item-meta">
                                PDF • ${formatFileSize(file.size)}
                            </div>

                        </div>

                        <button
                            class="file-open-button"
                            type="button"
                            title="باز کردن"
                        >

                            <i data-lucide="eye"></i>

                        </button>

                    `;


                    const openButton =
                        card.querySelector(
                            ".file-open-button"
                        );


                    if(openButton){

                        openButton.addEventListener(
                            "click",
                            () => {

                                openPDF(
                                    file.id,
                                    file.name
                                );

                            }
                        );

                    }


                    fileViewerContent.appendChild(
                        card
                    );

                }
            );


            refreshIcons();

        }


        /* =================================================
           OPEN PDF
        ================================================= */
async function openPDF(
    id,
    name
){

    try{

        showPDFOpening(
            name
        );


        const response =
            await fetch(
                `${FILES_API}/${id}/open`
            );


        if(!response.ok){

            throw new Error(
                `OPEN PDF HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "OPEN PDF:",
            data
        );


        if(
            !data.success ||
            !data.url
        ){

            throw new Error(
                "PDF URL ERROR"
            );

        }


        const pdfUrl =
            normalizePDFUrl(
                data.url
            );


        console.log(
            "LOCAL PDF URL:",
            pdfUrl
        );


        /* =========================================
           LOAD PDF ENGINE ONLY WHEN NEEDED
        ========================================= */

        const engineModule =
            await import(
                "./pdf-engine.js"
            );


        const PDF_ENGINE =
            engineModule.PDF_ENGINE;


        if(
            !PDF_ENGINE ||
            typeof PDF_ENGINE.open !== "function"
        ){

            throw new Error(
                "PDF ENGINE MODULE INVALID"
            );

        }


        /* =========================================
           OPEN PDF
        ========================================= */

        await PDF_ENGINE.open(
            pdfUrl
        );


        /* =========================================
           CURRENT FILE
        ========================================= */

        window.currentFile = {

            id:id,

            name:name,

            url:pdfUrl

        };


        updateCurrentFileName(
            name
        );


        closeFileModal();


    }
    catch(error){

        console.error(
            "PDF OPEN ERROR:",
            error
        );


        showViewerError();

    }

}

        /* =================================================
           NORMALIZE PDF URL
        ================================================= */

        function normalizePDFUrl(
            url
        ){

            if(
                typeof url !== "string" ||
                !url
            ){

                return url;

            }


            try{

                const parsed =
                    new URL(url);


                const apiURL =
                    new URL(CONFIG.API);


                if(
                    parsed.hostname ===
                    "iran-go4q.onrender.com"
                ){

                    parsed.protocol =
                        apiURL.protocol;

                    parsed.hostname =
                        apiURL.hostname;

                    parsed.port =
                        apiURL.port;

                }


                return parsed.toString();

            }
            catch{

                return url.replace(
                    "https://iran-go4q.onrender.com",
                    CONFIG.API
                );

            }

        }


        /* =================================================
           HEADER FILE NAME
        ================================================= */

        function updateCurrentFileName(
            name
        ){

            const fileNameElement =
                document.getElementById(
                    "workspaceFileName"
                );


            if(fileNameElement){

                fileNameElement.textContent =
                    name;

            }

        }


        /* =================================================
           STATES
        ================================================= */

        function showFileLoading(){

            fileViewerContent.innerHTML = `

                <div class="file-loading">

                    <i data-lucide="loader-circle"></i>

                    <span>
                        در حال دریافت فایل‌ها...
                    </span>

                </div>

            `;


            refreshIcons();

        }


        function showEmptyFiles(){

            fileViewerContent.innerHTML = `

                <div class="file-empty">

                    <i data-lucide="folder-open"></i>

                    <strong>
                        فایلی موجود نیست
                    </strong>

                    <span>
                        برای این درس فایلی ثبت نشده است
                    </span>

                </div>

            `;


            refreshIcons();

        }


        function showFileError(){

            fileViewerContent.innerHTML = `

                <div class="file-error">

                    <i data-lucide="triangle-alert"></i>

                    <strong>
                        خطا در دریافت فایل
                    </strong>

                </div>

            `;


            refreshIcons();

        }


        function showPDFOpening(
            name
        ){

            a4Container.innerHTML = `

                <div class="a4-empty-state loading">

                    <i data-lucide="loader-circle"></i>

                    <span>
                        در حال باز کردن PDF...
                    </span>

                    <small>
                        ${escapeHtml(name)}
                    </small>

                </div>

            `;


            refreshIcons();

        }


        function showViewerError(){

            a4Container.innerHTML = `

                <div class="a4-empty-state">

                    <i data-lucide="file-x"></i>

                    <span>
                        نمایش فایل ناموفق بود
                    </span>

                    <small>
                        خطا در موتور PDF
                    </small>

                </div>

            `;


            refreshIcons();

        }


        /* =================================================
           HELPERS
        ================================================= */

        function formatFileSize(
            bytes
        ){

            const size =
                Number(bytes) || 0;


            if(size < 1024){

                return `${size} B`;

            }


            if(size < 1024 * 1024){

                return (
                    size / 1024
                ).toFixed(1) + " KB";

            }


            return (
                size / (1024 * 1024)
            ).toFixed(1) + " MB";

        }


        function escapeHtml(
            text
        ){

            const div =
                document.createElement("div");


            div.textContent =
                text || "";


            return div.innerHTML;

        }


        // ======================================================
// AH — HEADER PEN TOOL
// ======================================================

const ahHeaderPenTool =
    document.getElementById("ah-headerPenTool");


// وضعیت ابزار مداد
let ahPenActive = false;


// اگر دکمه وجود نداشت، چیزی اجرا نکن
if (ahHeaderPenTool) {

    ahHeaderPenTool.addEventListener(
        "click",
        function () {

            ahPenActive = !ahPenActive;

            // حالت فعال / غیرفعال
            ahHeaderPenTool.classList.toggle(
                "active",
                ahPenActive
            );


            // ------------------------------------------
            // فعال کردن مداد
            // ------------------------------------------

            if (ahPenActive) {

                console.log("AH Pen: ACTIVE");


                // اگر تابع اصلی ابزارها وجود داشته باشد
                if (
                    typeof activateDrawingTool ===
                    "function"
                ) {

                    activateDrawingTool("pen");

                }


                // وضعیت سراسری
                if (window.drawingToolState) {

                    window.drawingToolState.activeTool =
                        "pen";

                }

            }


            // ------------------------------------------
            // خاموش کردن مداد
            // ------------------------------------------

            else {

                console.log("AH Pen: OFF");


                // اگر تابع اصلی ابزارها وجود داشته باشد
                if (
                    typeof activateDrawingTool ===
                    "function"
                ) {

                    activateDrawingTool(null);

                }


                // وضعیت سراسری
                if (window.drawingToolState) {

                    window.drawingToolState.activeTool =
                        null;

                }

            }

        }
    );

}



// ======================================================
// RISEO — AH COLOR PICKERS
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    const colorData = [
        {
            button: "ah-colorBtn1",
            panel: "ah-colorPanel1"
        },
        {
            button: "ah-colorBtn2",
            panel: "ah-colorPanel2"
        },
        {
            button: "ah-colorBtn3",
            panel: "ah-colorPanel3"
        },
        {
            button: "ah-colorBtn4",
            panel: "ah-colorPanel4"
        }
    ];


    // ==================================================
    // بستن همه پنل‌ها
    // ==================================================

    function closeAllAHColorPanels() {

        colorData.forEach(function (item) {

            const panel =
                document.getElementById(item.panel);

            if (!panel) return;

            panel.classList.remove("open");
            panel.classList.remove("show");

        });

    }


    // ==================================================
    // ساخت رویداد برای هر رنگ
    // ==================================================

    colorData.forEach(function (item, index) {

        const button =
            document.getElementById(item.button);

        const panel =
            document.getElementById(item.panel);


        if (!button || !panel) {

            console.warn(
                "AH Color پیدا نشد:",
                item.button,
                item.panel
            );

            return;

        }


        // ----------------------------------------------
        // کلیک روی دکمه رنگ
        // ----------------------------------------------

        button.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                const panelIsOpen =
                    panel.classList.contains("open") ||
                    panel.classList.contains("show");


                // همه پنل‌ها بسته شوند
                closeAllAHColorPanels();


                // اگر پنل بسته بود، باز شود
                if (!panelIsOpen) {

                    panel.classList.add("open");

                }

            }
        );


        // ----------------------------------------------
        // کلیک روی خود پنل
        // ----------------------------------------------

        panel.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

            }
        );


        // ----------------------------------------------
        // تمام رنگ‌های داخل پنل
        // ----------------------------------------------

        const palette =
            panel.querySelectorAll(
                ".ah-palette-color"
            );


        palette.forEach(function (colorButton) {

            colorButton.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();


                    const selectedColor =
                        colorButton.getAttribute(
                            "data-color"
                        );


                    if (!selectedColor) {

                        return;

                    }


                    // ----------------------------------
                    // تغییر رنگ دایره
                    // ----------------------------------

                    const dot =
                        button.querySelector(
                            ".ah-color-dot"
                        );


                    if (dot) {

                        dot.style.background =
                            selectedColor;

                    }


                    // ----------------------------------
                    // ذخیره رنگ روی دکمه
                    // ----------------------------------

                    button.setAttribute(
                        "data-color",
                        selectedColor
                    );


                    // ----------------------------------
                    // فعال کردن رنگ انتخاب‌شده
                    // ----------------------------------

                    palette.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    colorButton.classList.add(
                        "active"
                    );


                    // ----------------------------------
                    // ذخیره در متغیر عمومی
                    // ----------------------------------

                    window.ahSelectedColors =
                        window.ahSelectedColors || [];


                    window.ahSelectedColors[index] =
                        selectedColor;


                    // ----------------------------------
                    // اگر سیستم نقاشی فعلی وجود دارد
                    // ----------------------------------

                    if (window.drawingToolState) {

                        window.drawingToolState.color =
                            selectedColor;

                    }


                    // ----------------------------------
                    // بستن پنل
                    // ----------------------------------

                    closeAllAHColorPanels();


                    console.log(
                        "AH COLOR " +
                        (index + 1) +
                        ":",
                        selectedColor
                    );

                }
            );

        });


        // ----------------------------------------------
        // مقدار اولیه
        // ----------------------------------------------

        const initialColor =
            button.getAttribute("data-color");


        window.ahSelectedColors =
            window.ahSelectedColors || [];


        window.ahSelectedColors[index] =
            initialColor || "#111111";

    });


    // ==================================================
    // کلیک بیرون از ابزار رنگ
    // ==================================================

    document.addEventListener(
        "click",
        function (event) {

            const clickedColorTool =
                event.target.closest(
                    "#ah-colorWrapper1, " +
                    "#ah-colorWrapper2, " +
                    "#ah-colorWrapper3, " +
                    "#ah-colorWrapper4"
                );


            if (!clickedColorTool) {

                closeAllAHColorPanels();

            }

        }
    );


    // ==================================================
    // ESC
    // ==================================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeAllAHColorPanels();

            }

        }
    );

});


        refreshIcons();

    }
);


















































