/* =========================================================
   RISEO PDF TOOLS
   مدیریت کامل ابزارهای PDF و صفحه
========================================================= */


/* =========================================================
   آماده‌سازی ابزارها بعد از لود صفحه
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =====================================================
           موتور PDF
           این بخش موتور خودمان را نگه می‌دارد
        ===================================================== */

        let engine =
            window.PDF_ENGINE || null;


        let engineReady =
            !!(
                engine &&
                typeof engine.setTool === "function"
            );


        /* =====================================================
           وقتی موتور PDF آماده شد
        ===================================================== */

        window.addEventListener(
            "PDF_ENGINE_READY",
            () => {

                engine =
                    window.PDF_ENGINE || null;


                engineReady =
                    !!(
                        engine &&
                        typeof engine.setTool === "function"
                    );


                console.log(
                    "✅ PDF TOOLS CONNECTED"
                );


                /* اگر ابزاری قبل از موتور انتخاب شده */
                if(
                    selectedTool &&
                    engineReady
                ){

                    engine.setTool(
                        selectedTool
                    );

                }

            }
        );


        /* =====================================================
           ابزار انتخاب‌شده فعلی
        ===================================================== */

        let selectedTool =
            "select";


        /* =====================================================
           گرفتن موتور PDF
        ===================================================== */

        function getEngine(){

            if(
                engineReady &&
                engine
            ){

                return engine;

            }


            engine =
                window.PDF_ENGINE || null;


            engineReady =
                !!(
                    engine &&
                    typeof engine.setTool === "function"
                );


            if(!engineReady){

                console.warn(
                    "PDF_ENGINE هنوز آماده نیست."
                );


                return null;

            }


            return engine;

        }


        /* =====================================================
           همه دکمه‌های ابزار
        ===================================================== */

        const allToolIds = [

            "penTool",
            "highlighterTool",
            "eraserTool",
            "shapesTool",
            "textTool",
            "imageTool",
            "moveTool",
            "handTool",
            "rulerTool",
            "triangleTool",
            "protractorTool",
            "arrowTool",
            "thickPenTool",
            "noteTool",
            "numberTool",
            "linkTool"

        ];


        /* =====================================================
           حذف active از تمام ابزارها
        ===================================================== */

        function clearActiveTools(){

            allToolIds.forEach(
                id => {

                    const button =
                        document.getElementById(
                            id
                        );


                    if(button){

                        button.classList.remove(
                            "active"
                        );

                    }

                }
            );

        }


        /* =====================================================
           فعال کردن یک ابزار
        ===================================================== */

        function activateTool(
            button
        ){

            clearActiveTools();


            if(button){

                button.classList.add(
                    "active"
                );

            }

        }


        /* =====================================================
           انتخاب ابزار
        ===================================================== */

        function selectTool(
            button,
            tool
        ){

            selectedTool =
                tool;


            activateTool(
                button
            );


            console.log(
                "🔧 ACTIVE TOOL:",
                tool
            );


            const pdf =
                getEngine();


            if(!pdf){

                console.log(
                    "⏳ ابزار انتخاب شد؛ موتور PDF هنوز آماده نیست."
                );

                return;

            }


            pdf.setTool(
                tool
            );

        }



        /* =====================================================
           1. ابزار مداد
        ===================================================== */

        const penTool =
            document.getElementById(
                "penTool"
            );


        if(penTool){

            penTool.addEventListener(
                "click",
                () => {

                    selectTool(
                        penTool,
                        "pen"
                    );

                }
            );

        }



        /* =====================================================
           2. ابزار هایلایتر
        ===================================================== */

        const highlighterTool =
            document.getElementById(
                "highlighterTool"
            );


        if(highlighterTool){

            highlighterTool.addEventListener(
                "click",
                () => {

                    selectTool(
                        highlighterTool,
                        "highlighter"
                    );

                }
            );

        }



        /* =====================================================
           3. ابزار پاک‌کن
        ===================================================== */

        const eraserTool =
            document.getElementById(
                "eraserTool"
            );


        if(eraserTool){

            eraserTool.addEventListener(
                "click",
                () => {

                    selectTool(
                        eraserTool,
                        "eraser"
                    );

                }
            );

        }



        /* =====================================================
           4. ابزار اشکال
        ===================================================== */

        const shapesTool =
            document.getElementById(
                "shapesTool"
            );


        if(shapesTool){

            shapesTool.addEventListener(
                "click",
                () => {

                    selectTool(
                        shapesTool,
                        "shape"
                    );

                }
            );

        }



        /* =====================================================
           5. ابزار متن
        ===================================================== */

        const textTool =
            document.getElementById(
                "textTool"
            );


        if(textTool){

            textTool.addEventListener(
                "click",
                () => {

                    selectTool(
                        textTool,
                        "text"
                    );

                }
            );

        }



        /* =====================================================
           6. ابزار افزودن تصویر
        ===================================================== */

        const imageTool =
            document.getElementById(
                "imageTool"
            );


        if(imageTool){

            imageTool.addEventListener(
                "click",
                () => {

                    selectTool(
                        imageTool,
                        "image"
                    );

                }
            );

        }



        /* =====================================================
           7. ابزار جابه‌جایی صفحه
        ===================================================== */

        const moveTool =
            document.getElementById(
                "moveTool"
            );


        if(moveTool){

            moveTool.addEventListener(
                "click",
                () => {

                    selectTool(
                        moveTool,
                        "hand"
                    );

                }
            );

        }



        /* =====================================================
           8. ابزار دست
        ===================================================== */

        const handTool =
            document.getElementById(
                "handTool"
            );


        if(handTool){

            handTool.addEventListener(
                "click",
                () => {

                    selectTool(
                        handTool,
                        "hand"
                    );

                }
            );

        }



        /* =====================================================
           9. خط‌کش
        ===================================================== */

        const rulerTool =
            document.getElementById(
                "rulerTool"
            );


        if(rulerTool){

            rulerTool.addEventListener(
                "click",
                () => {

                    selectTool(
                        rulerTool,
                        "ruler"
                    );

                }
            );

        }



        /* =====================================================
           10. گونیا
        ===================================================== */

        const triangleTool =
            document.getElementById(
                "triangleTool"
            );


        if(triangleTool){

            triangleTool.addEventListener(
                "click",
                () => {

                    selectTool(
                        triangleTool,
                        "triangle"
                    );

                }
            );

        }



        /* =====================================================
           11. نقاله
        ===================================================== */

        const protractorTool =
            document.getElementById(
                "protractorTool"
            );


        if(protractorTool){

            protractorTool.addEventListener(
                "click",
                () => {

                    selectTool(
                        protractorTool,
                        "protractor"
                    );

                }
            );

        }



        /* =====================================================
           12. فلش
        ===================================================== */

        const arrowTool =
            document.getElementById(
                "arrowTool"
            );


        if(arrowTool){

            arrowTool.addEventListener(
                "click",
                () => {

                    selectTool(
                        arrowTool,
                        "arrow"
                    );

                }
            );

        }



        /* =====================================================
           13. قلم ضخیم
        ===================================================== */

        const thickPenTool =
            document.getElementById(
                "thickPenTool"
            );


        if(thickPenTool){

            thickPenTool.addEventListener(
                "click",
                () => {

                    const pdf =
                        getEngine();


                    if(!pdf){

                        selectTool(
                            thickPenTool,
                            "thick-pen"
                        );

                        return;

                    }


                    selectTool(
                        thickPenTool,
                        "thick-pen"
                    );


                    /* ضخامت مخصوص قلم ضخیم */

                    if(
                        typeof pdf.setSize ===
                        "function"
                    ){

                        pdf.setSize(
                            8
                        );

                    }

                }
            );

        }



        /* =====================================================
           14. یادداشت
        ===================================================== */

        const noteTool =
            document.getElementById(
                "noteTool"
            );


        if(noteTool){

            noteTool.addEventListener(
                "click",
                () => {

                    selectTool(
                        noteTool,
                        "text"
                    );

                }
            );

        }



        /* =====================================================
           15. شماره‌گذاری
        ===================================================== */

        const numberTool =
            document.getElementById(
                "numberTool"
            );


        if(numberTool){

            numberTool.addEventListener(
                "click",
                () => {

                    selectTool(
                        numberTool,
                        "number"
                    );

                }
            );

        }



        /* =====================================================
           16. لینک
        ===================================================== */

        const linkTool =
            document.getElementById(
                "linkTool"
            );


        if(linkTool){

            linkTool.addEventListener(
                "click",
                () => {

                    selectTool(
                        linkTool,
                        "link"
                    );

                }
            );

        }



        /* =====================================================
           UNDO
           بازگشت آخرین عملیات
        ===================================================== */

        const undoTool =
            document.getElementById(
                "undoTool"
            );


        if(undoTool){

            undoTool.addEventListener(
                "click",
                () => {

                    const pdf =
                        getEngine();


                    if(
                        !pdf ||
                        typeof pdf.undo !==
                            "function"
                    ){

                        console.warn(
                            "Undo در موتور PDF آماده نیست."
                        );

                        return;

                    }


                    pdf.undo();


                    console.log(
                        "↩ UNDO"
                    );

                }
            );

        }



        /* =====================================================
           REDO
           برگرداندن عملیات Undo شده
        ===================================================== */

        const redoTool =
            document.getElementById(
                "redoForwardTool"
            );


        if(redoTool){

            redoTool.addEventListener(
                "click",
                () => {

                    const pdf =
                        getEngine();


                    if(
                        !pdf ||
                        typeof pdf.redo !==
                            "function"
                    ){

                        console.warn(
                            "Redo در موتور PDF آماده نیست."
                        );

                        return;

                    }


                    pdf.redo();


                    console.log(
                        "↪ REDO"
                    );

                }
            );

        }



        /* =====================================================
           DELETE
           پاک کردن تمام نوشته‌های لایه نقاشی
        ===================================================== */

        const deleteTool =
            document.getElementById(
                "deleteTool"
            );


        if(deleteTool){

            deleteTool.addEventListener(
                "click",
                () => {

                    const pdf =
                        getEngine();


                    if(
                        !pdf ||
                        typeof pdf.clearDrawing !==
                            "function"
                    ){

                        console.warn(
                            "پاک‌کردن در موتور PDF آماده نیست."
                        );

                        return;

                    }


                    pdf.clearDrawing();


                    console.log(
                        "🗑 DRAWING CLEARED"
                    );

                }
            );

        }



        /* =====================================================
           HAND TOOL
           حالت حرکت
        ===================================================== */

        if(handTool){

            handTool.addEventListener(
                "dblclick",
                () => {

                    selectTool(
                        handTool,
                        "hand"
                    );

                }
            );

        }



        /* =====================================================
           بزرگنمایی
        ===================================================== */

        const zoomTool =
            document.getElementById(
                "zoomTool"
            );


        if(zoomTool){

            zoomTool.addEventListener(
                "click",
                () => {

                    console.log(
                        "🔍 ZOOM TOOL"
                    );

                }
            );

        }



        /* =====================================================
           تنظیم صفحه
        ===================================================== */

        const fitTool =
            document.getElementById(
                "fitTool"
            );


        if(fitTool){

            fitTool.addEventListener(
                "click",
                () => {

                    console.log(
                        "📐 FIT PAGE"
                    );

                }
            );

        }



        /* =====================================================
           تمام صفحه
        ===================================================== */

        const fullscreenTool =
            document.getElementById(
                "fullscreenTool"
            );


        if(fullscreenTool){

            fullscreenTool.addEventListener(
                "click",
                async () => {

                    const workspace =
                        document.getElementById(
                            "a4PagesContainer"
                        );


                    if(!workspace){

                        return;

                    }


                    try{

                        if(
                            !document.fullscreenElement
                        ){

                            await workspace.requestFullscreen();

                        }
                        else{

                            await document.exitFullscreen();

                        }

                    }
                    catch(error){

                        console.error(
                            "FULLSCREEN ERROR:",
                            error
                        );

                    }

                }
            );

        }



        /* =====================================================
           MORE TOOLS
           باز / بسته کردن منوی ابزارهای بیشتر
        ===================================================== */

        const moreToolsBtn =
            document.getElementById(
                "moreToolsBtn"
            );


        const moreToolsPanel =
            document.getElementById(
                "moreToolsPanel"
            );


        if(
            moreToolsBtn &&
            moreToolsPanel
        ){

            moreToolsBtn.addEventListener(
                "click",
                () => {

                    moreToolsPanel.classList.toggle(
                        "show"
                    );

                }
            );

        }



        /* =====================================================
           حالت اولیه
           مداد به صورت پیش‌فرض انتخاب می‌شود
        ===================================================== */

        const defaultTool =
            document.getElementById(
                "penTool"
            );


        if(defaultTool){

            activateTool(
                defaultTool
            );

        }


        selectedTool =
            "pen";


        const initialEngine =
            getEngine();


        if(initialEngine){

            initialEngine.setTool(
                "pen"
            );

        }


        /* =====================================================
           ICONS
        ===================================================== */

        if(window.lucide){

            lucide.createIcons();

        }

    }
);