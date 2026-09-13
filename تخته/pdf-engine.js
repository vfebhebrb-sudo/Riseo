import * as pdfjsLib
    from "./pdfjs/build/pdf.mjs";


pdfjsLib.GlobalWorkerOptions.workerSrc =
    "./pdfjs/build/pdf.worker.mjs";


/* =========================================================
   RISEO PDF ENGINE
========================================================= */

const PDF_ENGINE = {

    /* =====================================================
       STATE
    ===================================================== */

    document: null,

    pages: [],

    baseScale: 1,

    quality: 2.5,

    maxQuality: 3,

    currentTool: "select",

    color: "#111111",

    size: 3,

    opacity: 1,

    history: [],

    redoStack: [],

    isDrawing: false,

    activeStroke: null,


    /* =====================================================
       OPEN PDF
    ===================================================== */

    async open(url){

        const container =
            document.getElementById(
                "a4PagesContainer"
            );


        if(!container){

            throw new Error(
                "a4PagesContainer پیدا نشد"
            );

        }


        this.cancelDrawing();

        this.pages = [];

        this.history = [];

        this.redoStack = [];

        this.document = null;


        container.innerHTML = "";


        try{

            console.log(
                "📄 Opening PDF:",
                url
            );


            const loadingTask =
                pdfjsLib.getDocument({

                    url: url,

                    useWorkerFetch: true,

                    isEvalSupported: true

                });


            this.document =
                await loadingTask.promise;


            console.log(
                "✅ PDF Loaded:",
                this.document.numPages,
                "pages"
            );


            for(
                let pageNumber = 1;
                pageNumber <= this.document.numPages;
                pageNumber++
            ){

                await this.createPage(
                    pageNumber
                );

            }


            console.log(
                "✅ ALL PDF PAGES RENDERED"
            );

        }
        catch(error){

            console.error(
                "❌ PDF ENGINE ERROR:",
                error
            );


            throw error;

        }

    },


    /* =====================================================
       CREATE PAGE
    ===================================================== */

    async createPage(
        pageNumber
    ){

        const page =
            await this.document.getPage(
                pageNumber
            );


        const container =
            document.getElementById(
                "a4PagesContainer"
            );


        if(!container){

            throw new Error(
                "a4PagesContainer پیدا نشد"
            );

        }


        /* =============================================
           PDF BASE SIZE
        ============================================= */

        const baseViewport =
            page.getViewport({

                scale: 1

            });


        /* =============================================
           FIT WIDTH
        ============================================= */

        const availableWidth =
            Math.max(
                container.clientWidth,
                1
            );


        const scale =
            availableWidth /
            baseViewport.width;


        this.baseScale =
            scale;


        const viewport =
            page.getViewport({

                scale: scale

            });


        /* =============================================
           PAGE WRAPPER
        ============================================= */

        const pageBox =
            document.createElement(
                "div"
            );


        pageBox.className =
            "a4-page";


        pageBox.dataset.page =
            pageNumber;


        pageBox.style.position =
            "relative";


        pageBox.style.width =
            `${viewport.width}px`;


        pageBox.style.height =
            `${viewport.height}px`;


        pageBox.style.overflow =
            "hidden";


        /* =============================================
           QUALITY
        ============================================= */

        const dpr =
            window.devicePixelRatio || 1;


        const quality =
            Math.min(

                Math.max(
                    dpr * this.quality,
                    2
                ),

                this.maxQuality * 2

            );


        /* =============================================
           PDF CANVAS
        ============================================= */

        const pdfCanvas =
            document.createElement(
                "canvas"
            );


        pdfCanvas.className =
            "pdf-canvas";


        pdfCanvas.width =
            Math.ceil(
                viewport.width *
                quality
            );


        pdfCanvas.height =
            Math.ceil(
                viewport.height *
                quality
            );


        pdfCanvas.style.width =
            `${viewport.width}px`;


        pdfCanvas.style.height =
            `${viewport.height}px`;


        pdfCanvas.style.display =
            "block";


        const context =
            pdfCanvas.getContext(
                "2d",
                {

                    alpha: false,

                    desynchronized: true

                }
            );


        if(!context){

            throw new Error(
                "Canvas context ساخته نشد"
            );

        }


        context.setTransform(
            quality,
            0,
            0,
            quality,
            0,
            0
        );


        context.fillStyle =
            "#ffffff";


        context.fillRect(
            0,
            0,
            viewport.width,
            viewport.height
        );


        /* =============================================
           RENDER PDF
        ============================================= */

        await page.render({

            canvasContext:
                context,

            viewport:
                viewport,

            intent:
                "display"

        }).promise;


        pageBox.appendChild(
            pdfCanvas
        );


        /* =============================================
           DRAW LAYER
        ============================================= */

        const drawCanvas =
            this.createDrawingCanvas(

                pageBox,

                viewport.width,

                viewport.height,

                quality,

                pageNumber

            );


        /* =============================================
           ADD PAGE TO DOM
        ============================================= */

        container.appendChild(
            pageBox
        );


        /* =============================================
           STORE PAGE
        ============================================= */

        this.pages.push({

            number:
                pageNumber,

            element:
                pageBox,

            pdfCanvas:
                pdfCanvas,

            drawCanvas:
                drawCanvas,

            viewport:
                viewport,

            width:
                viewport.width,

            height:
                viewport.height,

            quality:
                quality

        });


        console.log(
            `✅ Page ${pageNumber} rendered`,
            `${Math.round(viewport.width)}×${Math.round(viewport.height)}`,
            `quality:${quality.toFixed(2)}`
        );

    },


    /* =====================================================
       DRAWING CANVAS
    ===================================================== */

    createDrawingCanvas(
        parent,
        width,
        height,
        quality,
        pageNumber
    ){

        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.className =
            "draw-layer";


        canvas.dataset.page =
            pageNumber;


        /* =============================================
           INTERNAL RESOLUTION
        ============================================= */

        canvas.width =
            Math.ceil(
                width *
                quality
            );


        canvas.height =
            Math.ceil(
                height *
                quality
            );


        /* =============================================
           DISPLAY SIZE
        ============================================= */

        canvas.style.position =
            "absolute";


        canvas.style.top =
            "0";


        canvas.style.left =
            "0";


        canvas.style.width =
            `${width}px`;


        canvas.style.height =
            `${height}px`;


        canvas.style.zIndex =
            "5";


        canvas.style.pointerEvents =
            "auto";


        /* =============================================
           CONTEXT
        ============================================= */

        const context =
            canvas.getContext(
                "2d",
                {

                    alpha: true

                }
            );


        if(!context){

            throw new Error(
                "Draw canvas context ساخته نشد"
            );

        }


        context.setTransform(
            quality,
            0,
            0,
            quality,
            0,
            0
        );


        context.lineCap =
            "round";


        context.lineJoin =
            "round";


        /* =============================================
           POINTER EVENTS
        ============================================= */

        canvas.addEventListener(
            "pointerdown",
            event => {

                this.handlePointerDown(
                    event,
                    canvas,
                    context,
                    pageNumber
                );

            }
        );


        canvas.addEventListener(
            "pointermove",
            event => {

                this.handlePointerMove(
                    event,
                    canvas,
                    context
                );

            }
        );


        canvas.addEventListener(
            "pointerup",
            event => {

                this.handlePointerUp(
                    event
                );

            }
        );


        canvas.addEventListener(
            "pointercancel",
            event => {

                this.handlePointerUp(
                    event
                );

            }
        );


        parent.appendChild(
            canvas
        );


        return canvas;

    },


    /* =====================================================
       POINTER DOWN
    ===================================================== */
handlePointerDown(
    event,
    canvas,
    context,
    pageNumber
){

    if(
        this.currentTool !== "pen" &&
        this.currentTool !== "highlighter" &&
        this.currentTool !== "eraser" &&
        this.currentTool !== "thick-pen"
    ){

        return;

    }


    event.preventDefault();


    this.isDrawing =
        true;


    canvas.setPointerCapture(
        event.pointerId
    );


    const point =
        this.getPointerPosition(
            event,
            canvas
        );


    this.activeStroke = {

        page:
            pageNumber,

        tool:
            this.currentTool,

        color:
            this.color,

        size:
            this.size,

        opacity:
            this.opacity,

        points:[
            point
        ]

    };


    this.configureContext(
        context
    );


    context.beginPath();


    context.moveTo(
        point.x,
        point.y
    );

},

    /* =====================================================
       POINTER MOVE
    ===================================================== */
handlePointerMove(
    event,
    canvas,
    context
){

    if(
        !this.isDrawing ||
        !this.activeStroke
    ){

        return;

    }


    event.preventDefault();


    const point =
        this.getPointerPosition(
            event,
            canvas
        );


    const points =
        this.activeStroke.points;


    const previous =
        points[
            points.length - 1
        ];


    if(!previous){

        points.push(
            point
        );

        return;

    }


    const middle = {

        x:
            (
                previous.x +
                point.x
            ) / 2,

        y:
            (
                previous.y +
                point.y
            ) / 2

    };


    context.quadraticCurveTo(

        previous.x,

        previous.y,

        middle.x,

        middle.y

    );


    context.stroke();


    points.push(
        point
    );

},
    /* =====================================================
       POINTER UP
    ===================================================== */

    handlePointerUp(
        event
    ){

        if(!this.isDrawing){

            return;

        }


        this.isDrawing =
            false;


        try{

            event.currentTarget.releasePointerCapture(
                event.pointerId
            );

        }
        catch{

        }


        if(
            this.activeStroke &&
            this.activeStroke.points.length > 1
        ){

            this.history.push(
                this.activeStroke
            );


            this.redoStack = [];

        }


        this.activeStroke =
            null;

    },


    /* =====================================================
       POINTER POSITION
    ===================================================== */
getPointerPosition(
    event,
    canvas
){

    const rect =
        canvas.getBoundingClientRect();


    if(
        !rect.width ||
        !rect.height
    ){

        return {
            x:0,
            y:0
        };

    }


    const quality =
        canvas.width /
        rect.width;


    /*
        canvas.width = width × quality

        ما مختصات را به مختصات
        نمایشی/منطقی برمی‌گردانیم.
    */

    return {

        x:
            (
                event.clientX -
                rect.left
            ),

        y:
            (
                event.clientY -
                rect.top
            )

    };

},

    /* =====================================================
       CONTEXT SETTINGS
    ===================================================== */

    configureContext(
        context
    ){

        context.globalAlpha =
            this.opacity;


        context.lineWidth =
            Number(
                this.size
            );


        if(
            this.currentTool ===
            "highlighter"
        ){

            context.globalCompositeOperation =
                "multiply";


            context.strokeStyle =
                this.color;

        }
        else{

            context.globalCompositeOperation =
                "source-over";


            context.strokeStyle =
                this.color;

        }


        context.lineCap =
            "round";


        context.lineJoin =
            "round";

    },


    /* =====================================================
       SET TOOL
    ===================================================== */

    setTool(
        tool
    ){

        const allowed = [

            "select",

            "pen",

            "highlighter",

            "eraser",

            "text",

            "shape",

            "hand"

        ];


        if(
            !allowed.includes(tool)
        ){

            return;

        }


        this.currentTool =
            tool;


        const container =
            document.getElementById(
                "a4PagesContainer"
            );


        if(!container){

            return;

        }


        container.dataset.tool =
            tool;

    },

    setTool(tool){

    const allowed = [

        "select",
        "pen",
        "highlighter",
        "eraser",
        "text",
        "shape",
        "hand",
        "ruler",
        "triangle",
        "protractor",
        "arrow",
        "thick-pen",
        "number",
        "link"

    ];


    if(
        !allowed.includes(tool)
    ){

        return;

    }


    this.currentTool =
        tool;


    const container =
        document.getElementById(
            "a4PagesContainer"
        );


    if(container){

        container.dataset.tool =
            tool;

    }


    /* =====================================
       CURSOR
    ===================================== */

    if(container){

        if(
            tool === "pen" ||
            tool === "highlighter" ||
            tool === "eraser" ||
            tool === "thick-pen"
        ){

            container.style.cursor =
                "crosshair";

        }
        else if(
            tool === "hand"
        ){

            container.style.cursor =
                "grab";

        }
        else{

            container.style.cursor =
                "default";

        }

    }


    console.log(
        "PDF ENGINE TOOL:",
        tool
    );

},
    /* =====================================================
       SET COLOR
    ===================================================== */

    setColor(
        color
    ){

        if(
            typeof color !==
            "string"
        ){

            return;

        }


        this.color =
            color;

    },


    /* =====================================================
       SET SIZE
    ===================================================== */

    setSize(
        size
    ){

        const value =
            Number(size);


        if(!Number.isFinite(value)){

            return;

        }


        this.size =
            Math.max(
                1,
                Math.min(
                    100,
                    value
                )
            );

    },


    /* =====================================================
       SET OPACITY
    ===================================================== */

    setOpacity(
        opacity
    ){

        const value =
            Number(opacity);


        if(!Number.isFinite(value)){

            return;

        }


        this.opacity =
            Math.max(
                0,
                Math.min(
                    1,
                    value
                )
            );

    },


    /* =====================================================
       CLEAR DRAWING
    ===================================================== */

    clearDrawing(){

        this.pages.forEach(
            page => {

                const canvas =
                    page.drawCanvas;


                const context =
                    canvas.getContext(
                        "2d"
                    );


                if(!context){

                    return;

                }


                context.clearRect(

                    0,

                    0,

                    canvas.width,

                    canvas.height

                );

            }
        );


        this.history = [];

        this.redoStack = [];

    },


    /* =====================================================
       CLEAR CURRENT PAGE
    ===================================================== */

    clearPage(
        pageNumber
    ){

        const page =
            this.getPage(
                pageNumber
            );


        if(!page){

            return;

        }


        const context =
            page.drawCanvas.getContext(
                "2d"
            );


        if(!context){

            return;

        }


        context.clearRect(

            0,

            0,

            page.drawCanvas.width,

            page.drawCanvas.height

        );


        this.history =
            this.history.filter(
                stroke =>
                    stroke.page !==
                    pageNumber
            );


    },


    /* =====================================================
       UNDO
    ===================================================== */

    undo(){

        if(
            this.history.length === 0
        ){

            return;

        }


        const stroke =
            this.history.pop();


        this.redoStack.push(
            stroke
        );


        this.redrawAll();

    },


    /* =====================================================
       REDO
    ===================================================== */

    redo(){

        if(
            this.redoStack.length === 0
        ){

            return;

        }


        const stroke =
            this.redoStack.pop();


        this.history.push(
            stroke
        );


        this.redrawAll();

    },


    /* =====================================================
       REDRAW ALL
    ===================================================== */

    redrawAll(){

        this.pages.forEach(
            page => {

                const canvas =
                    page.drawCanvas;


                const context =
                    canvas.getContext(
                        "2d"
                    );


                if(!context){

                    return;

                }


                context.clearRect(

                    0,

                    0,

                    canvas.width,

                    canvas.height

                );

            }
        );


        const strokes =
            [...this.history];


        strokes.forEach(
            stroke => {

                this.renderStroke(
                    stroke
                );

            }
        );

    },


    /* =====================================================
       RENDER SAVED STROKE
    ===================================================== */

    renderStroke(
        stroke
    ){

        const page =
            this.getPage(
                stroke.page
            );


        if(!page){

            return;

        }


        const context =
            page.drawCanvas.getContext(
                "2d"
            );


        if(!context){

            return;

        }


        context.save();


        context.globalAlpha =
            stroke.opacity;


        context.lineWidth =
            Number(
                stroke.size
            );


        context.lineCap =
            "round";


        context.lineJoin =
            "round";


        if(
            stroke.tool ===
            "highlighter"
        ){

            context.globalCompositeOperation =
                "multiply";

        }
        else{

            context.globalCompositeOperation =
                "source-over";

        }


        context.strokeStyle =
            stroke.color;


        const points =
            stroke.points;


        if(
            !points ||
            points.length === 0
        ){

            context.restore();

            return;

        }


        context.beginPath();


        context.moveTo(
            points[0].x,
            points[0].y
        );


        for(
            let i = 1;
            i < points.length;
            i++
        ){

            const previous =
                points[i - 1];


            const current =
                points[i];


            const middle = {

                x:
                    (previous.x +
                    current.x) / 2,

                y:
                    (previous.y +
                    current.y) / 2

            };


            context.quadraticCurveTo(

                previous.x,

                previous.y,

                middle.x,

                middle.y

            );

        }


        context.stroke();


        context.restore();

    },


    /* =====================================================
       GET PAGE
    ===================================================== */

    getPage(
        pageNumber
    ){

        return this.pages.find(
            page =>
                page.number ===
                pageNumber
        );

    },


    /* =====================================================
       CANCEL DRAWING
    ===================================================== */

    cancelDrawing(){

        this.isDrawing =
            false;

        this.activeStroke =
            null;

    },


    /* =====================================================
       CLEAR ENGINE
    ===================================================== */

    clear(){

        this.cancelDrawing();


        const container =
            document.getElementById(
                "a4PagesContainer"
            );


        if(container){

            container.innerHTML =
                "";

        }


        this.pages =
            [];

        this.history =
            [];

        this.redoStack =
            [];

        this.document =
            null;

    }

};

window.PDF_ENGINE = PDF_ENGINE;

window.dispatchEvent(
    new Event("PDF_ENGINE_READY")
);

console.log(
    "✅ PDF ENGINE READY FOR TOOLS"
);


export {
    PDF_ENGINE
};