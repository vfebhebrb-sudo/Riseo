// ========================================== 
// MOBILE MENU DROPDOWN 
// ========================================== 
let selectedMobileSubject = null; 
let activeStudyPlanId = null;
const menuToggle = document.getElementById("menuToggle"); 
const mobileMenu = document.getElementById("mobileMenu"); 
const addCardBtn = document.getElementById("addCardBtn");
const taskModal = document.getElementById("taskModal");









let editingPlanId = null;







const deletePlanBtn =
document.getElementById(
    "deletePlanBtn"
);




 
if(menuToggle && mobileMenu){ 
 
    menuToggle.addEventListener("click",()=>{ 
 
 
        mobileMenu.classList.toggle("active"); 
 
 
        menuToggle.innerHTML = mobileMenu.classList.contains("active") 
        ? 
        `<i data-lucide="chevron-up"></i>` 
        : 
        `<i data-lucide="chevron-down"></i>`; 
 
 
        if(window.lucide){ 
            lucide.createIcons(); 
        } 
 
 
    }); 
 
} 
 
 
// ========================================== 
// PROFILE SYSTEM 
// ========================================== 
 
 
const profileBtn = document.getElementById("profileBtn"); 
const profileDropdown = document.getElementById("profileDropdown"); 
 
 
if(profileBtn && profileDropdown){ 
 
    profileBtn.addEventListener("click",()=>{ 
 
        profileDropdown.classList.toggle("show"); 
 
    }); 
 
} 
 
 
 
 
const user = JSON.parse( 
    localStorage.getItem("currentUser") 
); 
 
 
 
if(user){ 
 
 
    const name = document.getElementById("profileName"); 
    const phone = document.getElementById("profilePhone"); 
 
 
    if(name) 
    name.innerText = user.fullname || "کاربر"; 
 
 
    if(phone) 
    phone.innerText = user.phone || ""; 
 
 
} 
 
 
 
 
 
// ========================================== 
// LOGOUT 
// ========================================== 
 
 
const logoutBtn = document.getElementById("logoutBtn"); 
 
 
if(logoutBtn){ 
 
 
logoutBtn.addEventListener("click",()=>{ 
 
 
    localStorage.removeItem("authToken"); 
 
    localStorage.removeItem("currentUser"); 
 
 
    window.location.href="../index.html"; 
 
 
}); 
 
 
} 
 
 
 
 
 
 
// ========================================== 
// CHANGE PASSWORD 
// ========================================== 
 
 
const changePasswordBtn = 
document.getElementById("changePasswordBtn"); 
 
 
 
if(changePasswordBtn){ 
 
 
changePasswordBtn.addEventListener("click",()=>{ 
 
 
window.location.href="./تغییر رمز.html"; 
 
 
}); 
 
 
} 
 
 
 
 









 
 
// ========================================== 
// PAGE ANIMATION 
// ========================================== 
 
 
document.addEventListener("DOMContentLoaded",()=>{ 
 
 
const sections = 
document.querySelectorAll(".page-animate"); 
 
 
 
sections.forEach((section,index)=>{ 
 
 
setTimeout(()=>{ 
 
 
section.classList.add("show"); 
 
 
},index * 350); 
 
 
 
}); 
 
 
 
}); 
 
 
 
 
 
 
 
 
 
// ========================================== 
// AYAH SYSTEM 
// ========================================== 
 
 
const ayahs = [ 
 
{ 
text:"وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ", 
translation:"و اینکه برای انسان جز حاصل تلاش او نیست.", 
concept:"نتیجه‌ای که می‌خواهی با تلاش، استمرار و پشتکار ساخته می‌شود.", 
source:"سوره نجم / آیه ۳۹" 
}, 
 
 
{ 
text:"إِنَّ مَعَ الْعُسْرِ يُسْرًا", 
translation:"همانا با سختی آسانی است.", 
concept:"روزهای سخت کنکور ماندگار نیستند؛ بعد از تلاش نتیجه می‌رسد.", 
source:"سوره شرح / آیه ۶" 
}, 
 
 
{ 
text:"وَقُل رَّبِّ زِدْنِي عِلْمًا", 
translation:"پروردگارا دانش مرا افزون کن.", 
concept:"هر روز یک قدم برای رشد و یادگیری بردار.", 
source:"سوره طه / آیه ۱۱۴" 
} 
 
]; 
 
 
 
 
 
 
 
function changeAyah(){ 
 
 
 
const random = 
Math.floor(Math.random()*ayahs.length); 
 
 
 
const ayah = 
ayahs[random]; 
 
 
 
const text = 
document.querySelector(".mobile-ayah-text"); 
 
 
const translation = 
document.querySelector(".mobile-ayah-translation"); 
 
 
const concept = 
document.querySelector(".mobile-ayah-concept p"); 
 
 
const source = 
document.querySelector(".mobile-ayah-source"); 
 
 
 
 
 
if(text) 
text.textContent = ayah.text; 
 
 
 
if(translation) 
translation.textContent = ayah.translation; 
 
 
 
if(concept) 
concept.textContent = ayah.concept; 
 
 
 
if(source) 
source.textContent = ayah.source; 
 
 
 
 
} 
 
 
 
 
 
 
// اجرای آیه بعد از آماده شدن صفحه 
 
 
document.addEventListener( 
"DOMContentLoaded", 
()=>{ 
 
 
changeAyah(); 
 
 
}); 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
// ======================================================
// MOBILE STUDY TABS
// ======================================================


const studyTabs = document.querySelectorAll(".study-tab");

const studyPages = document.querySelectorAll(".mobile-study-page");



studyTabs.forEach(tab=>{


    tab.addEventListener("click",()=>{


        const target =
        tab.dataset.page;



        // حذف اکتیو تب ها

        studyTabs.forEach(item=>{

            item.classList.remove("active");

        });



        // مخفی کردن صفحات

        studyPages.forEach(page=>{

            page.classList.remove("active");

        });




        // فعال کردن

        tab.classList.add("active");


        const page =
        document.getElementById(target);



        if(page){

            page.classList.add("active");

        }



        if(window.lucide){

            lucide.createIcons();

        }


    });


});

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
// ========================================== 
// EXAM COUNTDOWN SYSTEM 
// ========================================== 
 
 
function calculateExamInfo(){ 
 
 
 
const examDate = new Date(2027, 4, 23);  
// ماه در JS از صفر شروع می‌شود 
// 4 یعنی خرداد 
 
 
const today = new Date(); 
 
 
 
examDate.setHours(0,0,0,0); 
today.setHours(0,0,0,0); 
 
 
 
const difference = 
examDate - today; 
 
 
 
const days = 
Math.round( 
difference /  
(1000 * 60 * 60 * 24) 
); 
 
 
 
    const daysElement = 
    document.getElementById("daysRemaining"); 
 
 
 
    if(daysElement){ 
 
        daysElement.textContent = 
        days > 0 ? days : 0; 
 
    } 
 
 
 
 
 
 
    // ================================== 
    // محاسبه هفته برنامه 
    // ================================== 
 
 
 
    const startDate = 
    new Date("2026-08-12");  
    // شروع برنامه ۱۰ ماهه 
     
 
 
    const passedTime = 
    today - startDate; 
 
 
 
    const passedDays = 
    Math.floor( 
        passedTime / 
        (1000*60*60*24) 
    ); 
 
 
 
    let week = 
    Math.floor( 
        passedDays / 7 
    ) + 1; 
 
 
 
    if(week < 1) 
    week = 1; 
 
 
 
    if(week > 40) 
    week = 40; 
 
 
 
    const weekElement = 
    document.getElementById("programWeek"); 
 
 
 
    if(weekElement){ 
 
        weekElement.textContent = 
        "هفته " + week; 
 
    } 
 
 
 
 
 
 
 
 
    // ================================== 
    // محاسبه ماه برنامه 
    // ================================== 
 
 
 
    let month = 
    Math.floor( 
        passedDays / 30 
    ) + 1; 
 
 
 
    if(month < 1) 
    month = 1; 
 
 
 
    if(month > 10) 
    month = 10; 
 
 
 
    const monthElement = 
    document.getElementById("programMonth"); 
 
 
 
    if(monthElement){ 
 
        monthElement.textContent = 
        "ماه " + month; 
 
    } 
 
 
 
 
 
} 
 
 
 
 
 
document.addEventListener( 
"DOMContentLoaded", 
()=>{ 
 
 
calculateExamInfo(); 
 
 
}); 
 
 
 
// ========================================== 
// EXAM PROGRESS 
// ========================================== 
 
function calculateProgress(){ 
 
 
    const startDate = new Date("2026-08-12"); 
 
    const examDate = new Date("2027-05-22"); 
 
 
    const today = new Date(); 
 
 
    const totalDays = 
    examDate - startDate; 
 
 
    const passedDays = 
    today - startDate; 
 
 
    let percent = 
    (passedDays / totalDays) * 100; 
 
 
    percent = Math.floor(percent); 
 
 
 
    if(percent < 0){ 
        percent = 0; 
    } 
 
 
    if(percent > 100){ 
        percent = 100; 
    } 
 
 
 
    const progressText = 
    document.getElementById( 
        "progressPercent" 
    ); 
 
 
    const progressBar = 
    document.getElementById( 
        "progressFill" 
    ); 
 
 
 
    if(progressText){ 
 
        progressText.innerText = 
        percent + "%"; 
 
    } 
 
 
 
    if(progressBar){ 
 
        progressBar.style.width = 
        percent + "%"; 
 
    } 
 
} 
 
 
 
document.addEventListener( 
"DOMContentLoaded", 
calculateProgress 
); 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
document.addEventListener("DOMContentLoaded",()=>{ 
 
 
    const progressFill = 
    document.querySelector(".mobile-progress-value"); 
 
 
    const progressText = 
    document.querySelector(".mobile-progress-percent"); 
 
 
 
    if(!progressFill) return; 
 
 
 
    let progress = 23; 
 
 
 
    progressFill.style.width = 
    progress + "%"; 
 
 
 
    if(progressText){ 
 
        progressText.textContent = 
        progress + "%"; 
 
    } 
 
 
 
}); 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
document.addEventListener("DOMContentLoaded",()=>{ 
 
 
const openModalBtn =  
document.getElementById("openModalBtn"); 
 
 
const mobilePlanModal =  
document.getElementById("taskModal"); 
 
 
const closeModalBtn =  
document.getElementById("closeModalBtn"); 
 
 
 
/* ========================= 
   OPEN MODAL 
========================= */ 
 
if(openModalBtn && mobilePlanModal){ 
 
 
openModalBtn.addEventListener( 
"click", 
()=>{ 
 
 
    mobilePlanModal.classList.add( 
        "active" 
    ); 
 
 
    if(typeof lucide !== "undefined"){ 
 
        lucide.createIcons(); 
 
    } 
 
 
}); 
 
 
} 
 
 
 
 
/* ========================= 
   CLOSE BUTTON 
========================= */ 
 
 
if(closeModalBtn && mobilePlanModal){ 
 
 
closeModalBtn.addEventListener( 
"click", 
()=>{ 
 
 
    mobilePlanModal.classList.remove( 
        "active" 
    ); 
 
 
}); 
 
 
} 
 
 
 
 
/* ========================= 
   CLOSE OUTSIDE 
========================= */ 
 
 
if(mobilePlanModal){ 
 
 
mobilePlanModal.addEventListener( 
"click", 
(e)=>{ 
 
 
    if(e.target === mobilePlanModal){ 
 
 
        mobilePlanModal.classList.remove( 
            "active" 
        ); 
 
 
    } 
 
 
}); 
 
 
} 
 
 
}); 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 function resetModalMode(){


    editingPlanId = null;


    addCardBtn.querySelector("span").textContent =
    "افزودن کارت";


    deletePlanBtn.style.display =
    "none";


}
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 // ==========================================
// WEEKLY PLANNER COLLAPSE
// ==========================================

const plannerCollapseBtn =
document.getElementById(
    "plannerCollapseBtn"
);


const weeklyPlanner =
document.querySelector(
    ".weekly-planner"
);



if(
plannerCollapseBtn &&
weeklyPlanner
){

    plannerCollapseBtn.addEventListener(
    "click",
    ()=>{


        weeklyPlanner.classList.toggle(
            "collapsed"
        );


        plannerCollapseBtn.classList.toggle(
            "active"
        );


        const icon =
        plannerCollapseBtn.querySelector(
            "svg"
        );


        if(icon){

            icon.style.transform =
            plannerCollapseBtn.classList.contains("active")
            ?
            "rotate(180deg)"
            :
            "rotate(0deg)";

        }


    });


}
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 /* ======================================================
   MOBILE PLANNER SYSTEM - PART 1
====================================================== */




let selectedSubject = {

    subject:"math",
    subjectName:"ریاضی",
    icon:"book-open",
    color:"#6366f1"

};



document.addEventListener(
"DOMContentLoaded",
()=>{


// ======================================================
// ELEMENTS
// ======================================================


const taskModal =
document.getElementById(
    "taskModal"
);


const openTaskBtn =
document.getElementById(
    "openTaskModal"
);


const closeModalBtn =
document.getElementById(
    "closeModalBtn"
);


const addCardBtn =
document.getElementById(
    "addCardBtn"
);



const taskDay =
document.getElementById(
    "taskDay"
);


const taskDuration =
document.getElementById(
    "taskDuration"
);


const taskTopic =
document.getElementById(
    "taskTopic"
);


const taskNote =
document.getElementById(
    "taskNote"
);





// ======================================================
// SUBJECT SELECT
// ======================================================


const subjectCards =
document.querySelectorAll(
    ".subject-card"
);



subjectCards.forEach(card=>{


card.addEventListener(
"click",
()=>{


subjectCards.forEach(item=>{

    item.classList.remove(
        "active"
    );

});



card.classList.add(
    "active"
);



selectedSubject = {


    subject:
    card.dataset.subject,


    subjectName:
    card.querySelector("span")
    .textContent
    .trim(),


    icon:
    card.dataset.icon,


    color:
    card.dataset.color


};



console.log(
"SELECTED:",
selectedSubject
);



});


});






// ======================================================
// OPEN MODAL
// ======================================================


if(openTaskBtn){


openTaskBtn.addEventListener(
"click",
()=>{


taskModal.classList.add(
    "active"
);


if(window.lucide){

    lucide.createIcons();

}


});


}







// ======================================================
// CLOSE MODAL
// ======================================================


function closeModal(){


taskModal.classList.remove(
    "active"
);


resetModalMode();


}




if(closeModalBtn){


closeModalBtn.addEventListener(
"click",
closeModal
);


}







// ======================================================
// CLICK OUTSIDE
// ======================================================


if(taskModal){


taskModal.addEventListener(
"click",
(e)=>{


if(e.target === taskModal){

    closeModal();

}


});


}








// ======================================================
// GET FORM DATA
// ======================================================


function getMobileTaskData(){


return {


subject:selectedSubject,


day:
taskDay.value,


duration:
taskDuration.value.trim(),


topic:
taskTopic.value.trim(),


note:
taskNote.value.trim()


};


}









// ======================================================
// SAVE TASK
// ======================================================


if(addCardBtn){


addCardBtn.addEventListener(
"click",
async ()=>{


const data =
getMobileTaskData();




if(!data.duration){


alert(
"لطفاً ساعت مطالعه را وارد کنید"
);


return;


}




if(!data.topic){


alert(
"لطفاً مبحث را وارد کنید"
);


return;


}





const currentUser =
JSON.parse(
localStorage.getItem(
"currentUser"
)
);





if(!currentUser || !currentUser.phone){


alert(
"کاربر پیدا نشد"
);


return;


}





const planData = {


phone:
currentUser.phone,


day:
data.day,


subject:
data.subject.subject,


subjectName:
data.subject.subjectName,


icon:
data.subject.icon,


color:
data.subject.color,


title:
data.topic,


duration:
data.duration,


note:
data.note


};





console.log(
"SEND:",
planData
);






// حالت ویرایش

if(editingPlanId){


updateMobileTask(
planData
);


return;


}







try{



const response =
await fetch(

`${API_URL}/plans`,

{


method:"POST",


headers:{


"Content-Type":
"application/json"


},


body:
JSON.stringify(
planData
)


}


);






const result =
await response.json();






if(!response.ok){


throw new Error(

result.message ||
"خطا در ذخیره برنامه"

);


}






createMobileTaskCard(
result.plan
);





taskModal.classList.remove(
"active"
);





resetMobileTaskForm();





alert(
"برنامه با موفقیت ذخیره شد ✅"
);




}



catch(error){


console.log(
"SAVE ERROR:",
error
);


alert(
error.message
);


}



});


}









// ======================================================
// RESET FORM
// ======================================================


function resetMobileTaskForm(){



[
"taskDuration",
"taskTopic",
"taskNote"

].forEach(id=>{


const el =
document.getElementById(id);



if(el){

el.value="";

}


});






if(taskDay){

taskDay.value =
"saturday";

}





subjectCards.forEach(card=>{


card.classList.remove(
"active"
);


});





if(subjectCards[0]){


subjectCards[0].classList.add(
"active"
);


}




resetModalMode();



}








// ======================================================
// RESET MODAL MODE
// ======================================================


function resetModalMode(){


editingPlanId = null;



const btn =
document.getElementById(
"addCardBtn"
);



if(btn){


btn.innerHTML = `

<span>
افزودن کارت
</span>

<i data-lucide="plus"></i>

`;


}





const deleteBtn =
document.getElementById(
"deletePlanBtn"
);



if(deleteBtn){


deleteBtn.style.display =
"none";


}





if(window.lucide){

lucide.createIcons();

}



}



// ======================================================
// MOBILE PLANNER SYSTEM - PART 2
// CARD + LOAD + UPDATE + DELETE
// ======================================================




// ======================================================
// CREATE MOBILE TASK CARD
// ======================================================


function createMobileTaskCard(plan){


if(!plan)
return;




const container =
document.querySelector(

`.planner-tasks[data-tasks="${plan.day}"]`

);



if(!container){


console.log(
"DAY BOX NOT FOUND:",
plan.day
);


return;


}






const card =
document.createElement(
"div"
);



card.className =
"mobile-mini-card";



card.dataset.id =
plan._id;



card.style.setProperty(

"--subject-color",

plan.color

);






card.innerHTML = `



<div class="mini-card-top">


<div 
class="mini-subject-icon"

style="
color:${plan.color};
background:${plan.color}20;
"

>


<i data-lucide="${plan.icon}"></i>


</div>




<span class="mini-subject-name">

${plan.subjectName}

</span>


</div>





<div class="mini-card-actions">



<button
class="note-btn"
data-id="${plan._id}"
title="یادداشت"
>


<i data-lucide="notebook-pen"></i>


</button>






<button
class="edit-btn"
data-id="${plan._id}"
title="ویرایش"
>


<i data-lucide="pen"></i>


</button>






<button
class="mobile-start-study-btn"
data-id="${plan._id}"
title="شروع مطالعه"
>


<i data-lucide="play"></i>


</button>




</div>



`;





container.appendChild(card);








// ======================================================
// EDIT BUTTON
// ======================================================


const editBtn =
card.querySelector(
".edit-btn"
);



if(editBtn){


editBtn.addEventListener(
"click",
()=>{



editingPlanId =
plan._id;





document
.getElementById(
"taskModal"
)
.classList.add(
"active"
);






document.getElementById(
"taskDuration"
).value =
plan.duration;






document.getElementById(
"taskTopic"
).value =
plan.title;






document.getElementById(
"taskNote"
).value =
plan.note || "";







document.getElementById(
"taskDay"
).value =
plan.day;








const addBtn =
document.getElementById(
"addCardBtn"
);



if(addBtn){


addBtn.innerHTML = `

ذخیره تغییرات

`;


}







const deleteBtn =
document.getElementById(
"deletePlanBtn"
);



if(deleteBtn){


deleteBtn.style.display =
"flex";


}






console.log(
"EDIT:",
plan
);




});


}








// ======================================================
// NOTE BUTTON
// ======================================================


const noteBtn =
card.querySelector(
".note-btn"
);



if(noteBtn){


noteBtn.addEventListener(
"click",
()=>{


console.log(
"NOTE:",
plan
);


});


}






if(window.lucide){

lucide.createIcons();

}



}












// ======================================================
// LOAD USER PLANS
// ======================================================


async function loadMobileTasks(){



const currentUser =
JSON.parse(

localStorage.getItem(
"currentUser"
)

);





if(
!currentUser ||
!currentUser.phone
){


console.log(
"USER NOT FOUND"
);


return;


}






try{



const response =
await fetch(

`${API_URL}/plans/${currentUser.phone}`

);





const result =
await response.json();





console.log(
"LOADED:",
result
);





if(!result.success)
return;







result.plans.forEach(plan=>{


createMobileTaskCard(
plan
);


});







}

catch(error){


console.log(
"LOAD ERROR:",
error
);


}





}











// ======================================================
// UPDATE PLAN
// ======================================================


async function updateMobileTask(data){



try{



const response =
await fetch(


`${API_URL}/plans/${editingPlanId}`,

{


method:"PUT",


headers:{


"Content-Type":
"application/json"


},


body:
JSON.stringify(
data
)


}


);








const result =
await response.json();





console.log(
"UPDATED:",
result
);








if(result.success){



alert(
"برنامه ویرایش شد ✅"
);




location.reload();



}






}



catch(error){


console.log(
"UPDATE ERROR:",
error
);


}





}











// ======================================================
// DELETE PLAN
// ======================================================


const deleteBtn =
document.getElementById(
"deletePlanBtn"
);



if(deleteBtn){


deleteBtn.addEventListener(
"click",
async ()=>{





if(!editingPlanId)
return;







const ok =
confirm(
"این برنامه حذف شود؟"
);





if(!ok)
return;








await fetch(

`${API_URL}/plans/${editingPlanId}`,

{

method:"DELETE"

}

);







location.reload();






});


}





// ======================================================
// MOBILE PLANNER SYSTEM - PART 3
// START STUDY + FINISH STUDY
// ======================================================





// ======================================================
// START STUDY BUTTON
// ======================================================


document.addEventListener(
"click",
(e)=>{



const btn =
e.target.closest(
".mobile-start-study-btn"
);





if(!btn)
return;






const id =
btn.dataset.id;






const card =
btn.closest(
".mobile-mini-card"
);





if(!card)
return;






activeStudyPlanId =
id;








const currentUser =
JSON.parse(

localStorage.getItem(
"currentUser"
)

);






if(!currentUser || !currentUser.phone)
return;









fetch(

`${API_URL}/plans/${currentUser.phone}`

)



.then(res=>res.json())



.then(data=>{






const plan =
data.plans.find(

item=>
item._id === id

);







if(!plan)
return;








console.log(
"START STUDY:",
plan
);










// ===============================
// LESSON NAME
// ===============================


const lessonName =
document.getElementById(
"mobileLessonName"
);



if(lessonName){


lessonName.innerText =
plan.subjectName;


}









// ===============================
// TOPIC
// ===============================


const topic =
document.getElementById(
"mobileLessonTopic"
);



if(topic){


topic.innerText =
plan.title || "-";


}









// ===============================
// TIME
// ===============================


const time =
document.getElementById(
"mobileLessonTime"
);



if(time){


time.innerText =
plan.duration + " ساعت";


}









// ===============================
// NOTE
// ===============================


const note =
document.getElementById(
"mobileLessonNote"
);



if(note){


note.innerText =
plan.note || "-";


}









// ===============================
// ICON
// ===============================


const icon =
document.getElementById(
"mobileLessonIcon"
);



if(icon){



icon.innerHTML = `

<i data-lucide="${plan.icon}"></i>

`;



icon.style.background =
`${plan.color}25`;



icon.style.color =
plan.color;



}









// ===============================
// CARD COLOR
// ===============================


const lessonCard =
document.querySelector(
".mobile-current-lesson"
);



if(lessonCard){


lessonCard.style.setProperty(

"--lesson-color",

plan.color

);


}








if(window.lucide){

lucide.createIcons();

}






});




});









// ======================================================
// FINISH STUDY
// ======================================================



const finishBtn =
document.getElementById(
"mobileFinishStudyBtn"
);







if(finishBtn){



finishBtn.addEventListener(
"click",
()=>{






if(!activeStudyPlanId){


console.log(
"NO ACTIVE STUDY"
);


return;


}








const card =
document.querySelector(

`.mobile-mini-card[data-id="${activeStudyPlanId}"]`

);







if(!card)
return;








const name =
card.querySelector(
".mini-subject-name"
);








if(name && !card.querySelector(".completed-label")){



name.innerHTML = `

${name.innerText}


<small class="completed-label">

انجام شده

</small>


`;



}









card.classList.add(
"completed"
);






console.log(
"FINISHED:",
activeStudyPlanId
);







});



}












// ======================================================
// INITIAL LOAD
// ======================================================



loadMobileTasks();


















});















































// ======================================================
// MOBILE THEME TOGGLE
// ======================================================

const themeToggle =
    document.getElementById("themeToggle");


if(themeToggle){

    themeToggle.addEventListener(
        "click",
        function(){

            // تغییر تم
            document.body.classList.toggle(
                "light-theme"
            );


            // پیدا کردن آیکون فعلی
            const icon =
                themeToggle.querySelector(
                    "svg"
                );


            if(!icon){
                return;
            }


            // تغییر آیکون
            if(
                document.body.classList.contains(
                    "light-theme"
                )
            ){

                icon.outerHTML = `
                    <i
                        data-lucide="sun"
                    ></i>
                `;

            }else{

                icon.outerHTML = `
                    <i
                        data-lucide="moon"
                    ></i>
                `;

            }


            // تبدیل i جدید به SVG
            if(
                typeof lucide !== "undefined"
            ){

                lucide.createIcons();

            }

        }
    );

}











































// ======================================================
// MOBILE SETTINGS + HEARTBEAT + LOGOUT
// ======================================================


// ======================================================
// SETTINGS ELEMENTS
// ======================================================

const mobileSettingsBtn =
    document.getElementById(
        "mobileSettingsBtn"
    );

const settingsModal =
    document.getElementById(
        "settingsModal"
    );

const settingsClose =
    document.getElementById(
        "settingsClose"
    );

const settingsOverlay =
    document.getElementById(
        "settingsOverlay"
    );


// ======================================================
// OPEN SETTINGS
// ======================================================

if(
    mobileSettingsBtn &&
    settingsModal
){

    mobileSettingsBtn.addEventListener(
        "click",
        function(){

            settingsModal.classList.add(
                "active"
            );

        }
    );

}


// ======================================================
// CLOSE SETTINGS
// ======================================================

function closeSettings(){

    if(!settingsModal){
        return;
    }

    settingsModal.classList.remove(
        "active"
    );

}


// ======================================================
// SETTINGS CLOSE BUTTON
// ======================================================

if(settingsClose){

    settingsClose.addEventListener(
        "click",
        closeSettings
    );

}


// ======================================================
// SETTINGS OVERLAY
// ======================================================

if(settingsOverlay){

    settingsOverlay.addEventListener(
        "click",
        closeSettings
    );

}


// ======================================================
// ESC → CLOSE SETTINGS
// ======================================================

document.addEventListener(
    "keydown",
    function(event){

        if(
            event.key === "Escape" &&
            settingsModal &&
            settingsModal.classList.contains(
                "active"
            )
        ){

            closeSettings();

        }

    }
);


// ======================================================
// MOBILE MENU
// ======================================================
// خانه / برنامه هفتگی / عملکرد
// → بستن پنل تنظیمات
//
// تنظیمات
// → باز کردن پنل تنظیمات
// ======================================================

const mobileMenuItems =
    document.querySelectorAll(
        ".mobile-menu-item"
    );


mobileMenuItems.forEach(
    function(item){

        item.addEventListener(
            "click",
            function(){

                // -------------------------------
                // SETTINGS
                // -------------------------------

                if(
                    item.id ===
                    "mobileSettingsBtn"
                ){

                    return;

                }


                // -------------------------------
                // OTHER MENU ITEMS
                // -------------------------------

                closeSettings();

            }
        );

    }
);


// ======================================================
// HEARTBEAT
// ======================================================

let heartbeatInterval = null;


// ======================================================
// SEND HEARTBEAT
// ======================================================

async function sendHeartbeat(){

    const authToken =
        localStorage.getItem(
            "authToken"
        );


    if(!authToken){

        return;

    }


    if(
        typeof API_URL ===
        "undefined"
    ){

        console.error(
            "HEARTBEAT: API_URL is not defined"
        );

        return;

    }


    try{

        const response =
            await fetch(
                `${API_URL}/auth/heartbeat`,
                {
                    method:"POST",

                    headers:{
                        "Authorization":
                            `Bearer ${authToken}`
                    }
                }
            );


        if(!response.ok){

            console.warn(
                "Heartbeat failed:",
                response.status
            );

            return;

        }


        const data =
            await response.json();


        console.log(
            "USER HEARTBEAT:",
            data.lastSeenAt
        );

    }
    catch(error){

        console.warn(
            "Heartbeat error:",
            error
        );

    }

}


// ======================================================
// START HEARTBEAT
// ======================================================

function startHeartbeat(){

    if(
        typeof API_URL ===
        "undefined"
    ){

        console.error(
            "Heartbeat cannot start: API_URL is not defined"
        );

        return;

    }


    const authToken =
        localStorage.getItem(
            "authToken"
        );


    if(!authToken){

        return;

    }


    // ارسال اولیه

    sendHeartbeat();


    // جلوگیری از Interval تکراری

    if(heartbeatInterval){

        clearInterval(
            heartbeatInterval
        );

    }


    heartbeatInterval =
        setInterval(
            sendHeartbeat,
            30 * 1000
        );

}


// ======================================================
// STOP HEARTBEAT
// ======================================================

function stopHeartbeat(){

    if(heartbeatInterval){

        clearInterval(
            heartbeatInterval
        );

        heartbeatInterval = null;

    }

}


// ======================================================
// LOGOUT
// ======================================================

async function logoutUser(){

    const authToken =
        localStorage.getItem(
            "authToken"
        );


    if(!authToken){

        return;

    }


    try{

        if(
            typeof API_URL !==
            "undefined"
        ){

            await fetch(
                `${API_URL}/auth/logout`,
                {
                    method:"POST",

                    headers:{
                        "Authorization":
                            `Bearer ${authToken}`
                    }
                }
            );

        }

    }
    catch(error){

        console.warn(
            "Logout request failed:",
            error
        );

    }


    // توقف Heartbeat

    stopHeartbeat();


    // پاک کردن ورود

    localStorage.removeItem(
        "authToken"
    );

    localStorage.removeItem(
        "currentUser"
    );

}


// ======================================================
// START
// ======================================================

startHeartbeat();


// ======================================================
// SERVICE WORKER
// ======================================================

if(
    "serviceWorker" in
    navigator
){

    navigator.serviceWorker
        .register(
            "service-worker.js"
        )
        .then(
            function(){

                console.log(
                    "Service Worker Registered"
                );

            }
        )
        .catch(
            function(error){

                console.log(
                    "SW Error:",
                    error
                );

            }
        );

}