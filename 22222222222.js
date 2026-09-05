document.addEventListener("DOMContentLoaded", () => {


    // =========================================
    // ELEMENTS
    // =========================================

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


    // =========================================
    // UPDATE LEFT BUTTON
    // =========================================

    function updateLeftButton(){

        if(!leftSidebar || !leftToggle) return;


        if(leftSidebar.classList.contains("collapsed")){

            leftToggle.innerHTML =
                `<i data-lucide="panel-left-open"></i>`;

            leftToggle.title = "باز کردن";

        }else{

            leftToggle.innerHTML =
                `<i data-lucide="panel-left-close"></i>`;

            leftToggle.title = "بستن";

        }

    }


    // =========================================
    // UPDATE RIGHT BUTTON
    // =========================================

    function updateRightButton(){

        if(!rightSidebar || !rightToggle) return;


        if(rightSidebar.classList.contains("collapsed")){

            rightToggle.innerHTML =
                `<i data-lucide="panel-right-open"></i>`;

            rightToggle.title = "باز کردن";

        }else{

            rightToggle.innerHTML =
                `<i data-lucide="panel-right-close"></i>`;

            rightToggle.title = "بستن";

        }

    }


    // =========================================
    // LEFT SIDEBAR
    // =========================================

    function toggleLeftSidebar(){

        if(!leftSidebar) return;


        leftSidebar.classList.toggle("collapsed");


        updateLeftButton();


        if(window.lucide){

            lucide.createIcons();

        }

    }


    // =========================================
    // RIGHT SIDEBAR
    // =========================================

    function toggleRightSidebar(){

        if(!rightSidebar) return;


        rightSidebar.classList.toggle("collapsed");


        updateRightButton();


        if(window.lucide){

            lucide.createIcons();

        }

    }


    // =========================================
    // LEFT BUTTON
    // =========================================

    if(leftToggle){

        leftToggle.addEventListener(
            "click",
            toggleLeftSidebar
        );

    }


    // =========================================
    // RIGHT BUTTON
    // =========================================

    if(rightToggle){

        rightToggle.addEventListener(
            "click",
            toggleRightSidebar
        );

    }


    // =========================================
    // LEFT TAB
    // =========================================

    if(leftTab){

        leftTab.addEventListener(
            "click",
            toggleLeftSidebar
        );

    }


    // =========================================
    // RIGHT TAB
    // =========================================

    if(rightTab){

        rightTab.addEventListener(
            "click",
            toggleRightSidebar
        );

    }


    // =========================================
    // INITIAL STATE
    // =========================================

    updateLeftButton();

    updateRightButton();


    // =========================================
    // LUCIDE
    // =========================================

    if(window.lucide){

        lucide.createIcons();

    }

});




















// =====================================================
// PDF ZOOM CONTROLS
// =====================================================


const zoomInBtn =
document.getElementById("zoomInBtn");


const zoomOutBtn =
document.getElementById("zoomOutBtn");


const zoomValue =
document.getElementById("zoomValue");



let currentZoom = 100;



function updateZoom(){

    zoomValue.textContent =
    currentZoom + "%";


    const iframe =
    document.getElementById("pdfFrame");


    if(
        iframe &&
        iframe.contentWindow
    ){

        iframe.contentWindow.postMessage(
            {
                type:"SET_ZOOM",
                value:currentZoom
            },
            "*"
        );

    }

}





if(zoomInBtn){

    zoomInBtn.addEventListener(
        "click",
        ()=>{


            if(currentZoom < 200){

                currentZoom += 10;

                updateZoom();

            }


        }
    );

}




if(zoomOutBtn){

    zoomOutBtn.addEventListener(
        "click",
        ()=>{


            if(currentZoom > 50){

                currentZoom -= 10;

                updateZoom();

            }


        }
    );

}



















document.addEventListener("DOMContentLoaded", () => {


    // =========================================
    // FILE MODAL
    // =========================================

    const openFileBtn =
        document.getElementById("openFileBtn");

    const fileModal =
        document.getElementById("fileModal");

    const fileModalBox =
        document.getElementById("fileModalBox");

    const fileModalClose =
        document.getElementById("fileModalClose");


    // =========================================
    // OPEN MODAL
    // =========================================

    if(openFileBtn && fileModal){

        openFileBtn.addEventListener("click", () => {

            fileModal.classList.add("open");

        });

    }


    // =========================================
    // CLOSE MODAL
    // =========================================

    if(fileModalClose && fileModal){

        fileModalClose.addEventListener("click", () => {

            fileModal.classList.remove("open");

        });

    }


    // =========================================
    // CLICK OUTSIDE
    // =========================================

    if(fileModal){

        fileModal.addEventListener("click", (event) => {

            if(
                fileModalBox &&
                !fileModalBox.contains(event.target)
            ){

                fileModal.classList.remove("open");

            }

        });

    }


    // =========================================
    // ESCAPE
    // =========================================

    document.addEventListener("keydown", (event) => {

        if(
            event.key === "Escape" &&
            fileModal &&
            fileModal.classList.contains("open")
        ){

            fileModal.classList.remove("open");

        }

    });


    // =========================================
    // LUCIDE
    // =========================================

    if(window.lucide){

        lucide.createIcons();

    }

});








































































// =====================================================
// FILE SYSTEM
// =====================================================

document.addEventListener(
"DOMContentLoaded",
()=>{


// =====================================================
// ELEMENTS
// =====================================================

const fileLessonsList =
document.getElementById(
    "fileLessonsList"
);


const fileViewerContent =
document.getElementById(
    "fileViewerContent"
);



const a4Container =
document.getElementById(
    "a4PagesContainer"
);



// =====================================================
// API
// =====================================================




// =====================================================
// CHECK
// =====================================================

if(
    !fileLessonsList ||
    !fileViewerContent ||
    !a4Container
){

    console.error(
        "FILE SYSTEM ELEMENT ERROR"
    );

    return;

}



// =====================================================
// LESSON BUTTONS
// =====================================================

const lessonButtons =
fileLessonsList.querySelectorAll(
    ".lesson-item"
);



lessonButtons.forEach(
button=>{


button.addEventListener(
"click",
()=>{


const lesson =
button.dataset.lesson;



setActiveLesson(
    lesson
);



loadLessonFiles(
    lesson
);



});



});



// =====================================================
// ACTIVE LESSON
// =====================================================

function setActiveLesson(
lesson
){


lessonButtons.forEach(
btn=>{


btn.classList.toggle(
"active",
btn.dataset.lesson === lesson
);


});


}




// =====================================================
// LOAD FILES
// =====================================================

async function loadLessonFiles(
lesson
){


try{


showFileLoading();



const response =
await fetch(
`${FILES_API}?lesson=${encodeURIComponent(lesson)}`
);



const data =
await response.json();



console.log(
"FILES:",
data
);



if(
!data.success
){

throw new Error(
"FILES ERROR"
);

}



if(
!data.files ||
data.files.length===0
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
error
);


showFileError();


}



}





// =====================================================
// RENDER FILE CARDS
// =====================================================

function renderFiles(
files
){


fileViewerContent.innerHTML="";



files.forEach(
file=>{


const card =
document.createElement(
"div"
);



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

PDF
•
${formatFileSize(file.size)}

</div>


</div>



<button
class="file-open-button"
>


<i data-lucide="eye"></i>


</button>


`;



card
.querySelector(
".file-open-button"
)
.onclick =
()=>{


openFile(
file.id,
file.name
);


};



fileViewerContent.appendChild(
card
);



});



refreshIcons();


}






// =====================================================
// OPEN PDF
// =====================================================
// =====================================================
// OPEN PDF
// =====================================================

async function openFile(
fileId,
fileName
){


try{


showViewerLoading(
fileName
);



const response =
await fetch(
`${FILES_API}/${fileId}/open`
);



const data =
await response.json();



console.log(
"OPEN FILE:",
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



const viewerURL =

`/workspace/pdf-viewer/web/viewer.html?file=${encodeURIComponent(data.url)}`;

console.log(
"VIEWER URL:",
viewerURL
);



a4Container.innerHTML = `


<iframe

id="pdfFrame"

class="pdf-viewer"

src="${viewerURL}"

frameborder="0"

></iframe>


`;



const frame =
document.getElementById(
"pdfFrame"
);



frame.onload = ()=>{

console.log(
"✅ PDF VIEWER LOADED"
);

};



frame.onerror = ()=>{

console.error(
"❌ PDF VIEWER LOAD ERROR"
);

};



window.currentTempFile =
data.url;



}
catch(error){


console.error(
"OPEN PDF ERROR",
error
);



showViewerError();


}


}




// =====================================================
// VIEW STATES
// =====================================================

function showViewerLoading(
name
){


a4Container.innerHTML = `


<div class="a4-empty-state loading">


<i data-lucide="loader-circle"></i>


<span>
در حال آماده سازی فایل
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


</div>


`;


refreshIcons();


}



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
فایلی پیدا نشد
</strong>


<span>
هنوز فایلی ثبت نشده است
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





// =====================================================
// HELPERS
// =====================================================


function formatFileSize(
bytes
){

if(!bytes)
return "0 KB";


if(bytes < 1024)
return bytes+" B";


if(bytes < 1024*1024)

return (
bytes/1024
).toFixed(1)+" KB";


return (

bytes/(1024*1024)

).toFixed(1)+" MB";


}





function escapeHtml(
text
){

const div =
document.createElement(
"div"
);


div.textContent =
text || "";


return div.innerHTML;


}





function refreshIcons(){

if(window.lucide){

lucide.createIcons();

}

}



});




































































































































// =====================================================
// WORKSPACE + PDF TOOLS SYSTEM
// =====================================================


document.addEventListener(
"DOMContentLoaded",
()=>{



// =====================================================
// PDF FRAME COMMUNICATION
// =====================================================


let pdfFrame = null;



function getPDFFrame(){


    pdfFrame =
    document.getElementById(
        "pdfFrame"
    );


    return pdfFrame;


}





function sendPDFCommand(
command,
data={}
){


    const frame =
    getPDFFrame();



    if(
        !frame ||
        !frame.contentWindow
    ){

        console.log(
            "PDF viewer not ready"
        );

        return;

    }



    frame.contentWindow.postMessage(

    {

        type:"PDF_COMMAND",

        command,

        data

    },

    "*"

    );


}





// =====================================================
// LEFT SIDEBAR TOOLS
// =====================================================


const workspaceTools =
document.querySelectorAll(
".workspace-tool-btn"
);



workspaceTools.forEach(
button=>{


button.addEventListener(
"click",
()=>{


workspaceTools.forEach(
btn=>{

btn.classList.remove(
"active"
);

});


button.classList.add(
"active"
);



const tool =
button.querySelector(
"span"
)?.innerText.trim();



console.log(
"WORKSPACE TOOL:",
tool
);



switch(tool){



case "سند جدید":


sendPDFCommand(
"newDocument"
);


break;



case "انتخاب":


sendPDFCommand(
"select"
);


break;



case "مداد":


sendPDFCommand(
"pencil"
);


break;



case "هایلایتر":


sendPDFCommand(
"highlight"
);


break;



case "پاک‌کن":


sendPDFCommand(
"eraser"
);


break;



case "اشکال":


sendPDFCommand(
"shape"
);


break;



case "متن":


sendPDFCommand(
"text"
);


break;



case "جابجایی صفحه":


sendPDFCommand(
"hand"
);


break;



}



});


});







// =====================================================
// RIGHT PDF TOOL PANEL
// =====================================================


const toolButtons =
document.querySelectorAll(
".tool-grid .tool-btn"
);



toolButtons.forEach(
button=>{


button.addEventListener(
"click",
()=>{


toolButtons.forEach(
btn=>{

btn.classList.remove(
"active"
);

});


button.classList.add(
"active"
);



const tool =
button.dataset.tooltip;



console.log(
"PDF TOOL:",
tool
);



const tools = {


"انتخاب و حرکت":
"select",


"مداد":
"pencil",


"هایلایت":
"highlight",


"افزودن متن":
"text"



};



if(
tools[tool]
){


sendPDFCommand(
tools[tool]
);


}



});


});







// =====================================================
// COLORS
// =====================================================


const colors =
document.querySelectorAll(
".color"
);



colors.forEach(
color=>{


color.addEventListener(
"click",
()=>{


colors.forEach(
item=>{

item.classList.remove(
"active"
);

});


color.classList.add(
"active"
);



const value =
getComputedStyle(
color
).backgroundColor;



console.log(
"COLOR:",
value
);



sendPDFCommand(

"color",

{

color:value

}

);



});


});








// =====================================================
// SIZE + OPACITY
// =====================================================


const sliders =
document.querySelectorAll(
'.tool-box input[type="range"]'
);



if(
sliders.length >= 2
){


const sizeSlider =
sliders[0];


const opacitySlider =
sliders[1];




sizeSlider.addEventListener(
"input",
()=>{


sendPDFCommand(

"size",

{

size:
sizeSlider.value

}

);


});





opacitySlider.addEventListener(
"input",
()=>{


sendPDFCommand(

"opacity",

{

opacity:
opacitySlider.value

}

);


});


}







// =====================================================
// ERASER ACTIONS
// =====================================================


document
.querySelectorAll(
".action-btn"
)
.forEach(
button=>{


button.addEventListener(
"click",
()=>{


const action =
button.innerText.trim();



if(
action.includes("انتخابی")
){


sendPDFCommand(
"eraseSelected"
);


}



if(
action.includes("همه")
){


sendPDFCommand(
"eraseAll"
);


}



});


});








// =====================================================
// SHAPES
// =====================================================


document
.querySelectorAll(
".shape-grid button"
)
.forEach(
button=>{


button.addEventListener(
"click",
()=>{


document
.querySelectorAll(
".shape-grid button"
)
.forEach(
btn=>
btn.classList.remove(
"active"
)
);



button.classList.add(
"active"
);



sendPDFCommand(

"shape",

{

shape:
button.innerText.trim()

}

);



});


});








// =====================================================
// VIEW CONTROLS
// =====================================================


document
.querySelectorAll(
".view-buttons button"
)
.forEach(
button=>{


button.addEventListener(
"click",
()=>{


const icon =
button.querySelector(
"svg"
);



if(
icon?.classList.contains(
"lucide-zoom-in"
)
){


sendPDFCommand(
"zoomIn"
);


}



else if(
icon?.classList.contains(
"lucide-zoom-out"
)
){


sendPDFCommand(
"zoomOut"
);


}



else if(
icon?.classList.contains(
"lucide-scan"
)
){


sendPDFCommand(
"fitPage"
);


}



else if(
icon?.classList.contains(
"lucide-maximize"
)
){


sendPDFCommand(
"fullscreen"
);


}



});


});







// =====================================================
// LUCIDE
// =====================================================


if(window.lucide){

lucide.createIcons();

}



});