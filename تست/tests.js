// =====================================================
// EXAM PAGE
// USER DATA + ACTIVE EXAMS
// =====================================================


document.addEventListener(
"DOMContentLoaded",
async()=>{


console.log(
"EXAM PAGE LOADED"
);



// =====================================================
// ELEMENTS
// =====================================================


const studentName =
document.getElementById(
"studentName"
);


const studentCandidateNumber =
document.getElementById(
"studentCandidateNumber"
);


const studyDays =
document.getElementById(
"studyDays"
);


const studentLeague =
document.getElementById(
"studentLeague"
);


const completedExams =
document.getElementById(
"completedExams"
);


const previousScore =
document.getElementById(
"previousScore"
);


const activeExamsList =
document.getElementById(
"activeExamsList"
);




// =====================================================
// API
// =====================================================


if(typeof API_URL === "undefined"){


console.error(
"API_URL پیدا نشد"
);


return;


}



console.log(
"API:",
API_URL
);




// =====================================================
// TOKEN
// =====================================================


const token =
localStorage.getItem(
"authToken"
);



if(!token){


console.warn(
"کاربر وارد نشده"
);


return;


}





// =====================================================
// ICON REFRESH
// =====================================================


function refreshIcons(){


if(window.lucide){

lucide.createIcons();

}


}






// =====================================================
// LOAD USER DATA
// =====================================================


async function loadUser(){


try{


const response =
await fetch(

`${API_URL}/auth/me`,

{

headers:{

Authorization:
`Bearer ${token}`

}

}

);



const data =
await response.json();



console.log(
"USER DATA:",
data
);



if(!response.ok){

throw new Error(
data.message
);

}



const user =
data.user;



studentName.textContent =
user.fullname || "کاربر";



studentCandidateNumber.textContent =
`شماره داوطلبی: ${user.candidateNumber || "---"}`;



studyDays.textContent =
`${user.studyDays || 0} روز`;



studentLeague.textContent =
user.league || "برنز";



completedExams.textContent =
`${user.completedExams || 0} آزمون`;



previousScore.textContent =
user.previousScore || 0;



localStorage.setItem(

"currentUser",

JSON.stringify(user)

);



}



catch(error){


console.error(
"USER ERROR:",
error
);


}



}







// =====================================================
// LOAD ACTIVE EXAMS
// ساخت کارت آزمون ها
// =====================================================


async function loadActiveExams(){


try{


const response =
await fetch(

`${API_URL}/tests`

);



const tests =
await response.json();



console.log(
"ACTIVE EXAMS:",
tests
);





activeExamsList.innerHTML = "";





if(
!Array.isArray(tests)
||
tests.length===0
){


activeExamsList.innerHTML = `

<div class="no-exam">

<i data-lucide="file-x"></i>

<span>
آزمون فعالی وجود ندارد
</span>

</div>

`;



refreshIcons();


return;


}





tests.forEach(

(test)=>{



let icon =
"file-question";



if(
test.subject?.includes("زیست")
){

icon="book-open";

}

else if(
test.subject?.includes("ریاضی")
){

icon="calculator";

}

else if(
test.subject?.includes("فیزیک")
){

icon="atom";

}

else if(
test.subject?.includes("شیمی")
){

icon="flask-conical";

}




const card =
document.createElement(
"article"
);



card.className =
"exam-item";



card.innerHTML = `


<div class="exam-main">


<div class="exam-icon">

<i data-lucide="${icon}"></i>

</div>



<div class="exam-details">


<h4>

${test.title || "آزمون بدون عنوان"}

</h4>



<span>

${test.description || "آزمون تستی"}

</span>



</div>





<button

class="enter-exam-btn"

data-id="${test._id}"

>


ورود


<i data-lucide="arrow-left"></i>


</button>



</div>






<div class="exam-meta">



<div>

<i data-lucide="file-question"></i>

<span>
سوال
</span>

<strong>

${test.questionCount || 0}

</strong>

</div>





<div>

<i data-lucide="clock"></i>

<span>
زمان
</span>

<strong>

${test.duration || 0}
دقیقه

</strong>

</div>





<div>

<i data-lucide="calendar-days"></i>

<span>
انتشار
</span>

<strong>

${
test.createdAt

?

new Date(test.createdAt)
.toLocaleDateString("fa-IR")

:

"امروز"

}

</strong>

</div>





<div>

<i data-lucide="timer"></i>

<span>
پاسخگویی
</span>

<strong>

${test.answerTime || test.duration || 0}
دقیقه

</strong>

</div>




</div>


`;





activeExamsList.appendChild(card);



}

);





refreshIcons();





// =====================================================
// ENTER EXAM BUTTON
// =====================================================



}



catch(error){


console.error(
"EXAMS ERROR:",
error
);


}



}




// =====================================================
// LOAD RECENT EXAMS
// آزمون های اخیر کاربر
// =====================================================


async function loadRecentExams(){


try{


console.log(
"Loading recent exams..."
);



const response =
await fetch(

`${API_URL}/exams/history`,

{

headers:{

Authorization:
`Bearer ${token}`

}

}

);



const exams =
await response.json();



console.log(
"RECENT EXAMS:",
exams
);



const list =
document.getElementById(
"recentExamsList"
);



list.innerHTML = "";



if(
!Array.isArray(exams)
||
exams.length === 0
){


list.innerHTML = `

<div class="no-exam">


<i data-lucide="history"></i>


<span>
هنوز آزمونی شرکت نکرده‌اید
</span>


</div>

`;



refreshIcons();

return;

}




exams.forEach(
(exam)=>{



let icon =
"book-open";



if(
exam.subject?.includes("ریاضی-")
){

icon="calculator";

}

else if(
exam.subject?.includes("فیزیک-")
){

icon="atom";

}

else if(
exam.subject?.includes("شیمی-")
){

icon="flask-conical";

}




const item =
document.createElement(
"div"
);



item.className =
"recent-exam-item";



item.innerHTML = `


<div class="recent-exam-icon">

<i data-lucide="${icon}"></i>

</div>





<div class="recent-exam-info">


<h4>

${exam.title}

</h4>



<span>

${exam.subject || "آزمون جامع"}

</span>



</div>






<div class="recent-exam-result">


<strong>

${exam.score || 0}٪

</strong>



<small>

تراز ${exam.rank || 0}

</small>



</div>



`;



list.appendChild(item);



}

);



refreshIcons();



}



catch(error){


console.error(

"RECENT EXAMS ERROR:",

error

);



const list =
document.getElementById(
"recentExamsList"
);



list.innerHTML = `

<div class="no-exam">

    <div class="error-icon">
        <i data-lucide="wifi-off"></i>
    </div>

    <span>
        خطا در دریافت آزمون‌ها
    </span>

</div>
`;



refreshIcons();


}



}






// =====================================================
// LOAD LAST EXAM RESULT
// اطلاعات آخرین آزمون + تحلیل AI
// =====================================================


async function loadLatestExamResult(){


try{


const token = 
localStorage.getItem("authToken");



if(!token){

console.warn(
"NO TOKEN"
);

return;

}



const response =

await fetch(

`${API_URL}/analysis/latest`,

{
headers:{
Authorization:
`Bearer ${token}`
}
}

);




const data =

await response.json();



console.log(
"LAST EXAM RESULT:",
data
);



if(!response.ok){

throw new Error(
data.message
);

}





const result =
data.result;





// =====================================================
// اطلاعات کلی آزمون
// =====================================================


document.getElementById(
"questionCountValue"
).textContent =

result.totalQuestions || 0;




document.getElementById(
"examTimeValue"
).textContent =

`${result.duration || 0} دقیقه`;





document.getElementById(
"answeredCountValue"
).textContent =

result.answeredQuestions || 0;





document.getElementById(
"examPercentValue"
).textContent =

`${result.score || 0}%`;







// =====================================================
// تحلیل درس ها
// =====================================================



if(result.subjects){



result.subjects.forEach(
(subject)=>{



if(subject.name.includes("زیست")){


document.getElementById(
"biologyPercent"
).textContent =

`${subject.percent}%`;



document.getElementById(
"biologyProgressBar"
).style.width =

`${subject.percent}%`;


}





else if(subject.name.includes("ریاضی")){


document.getElementById(
"mathPercent"
).textContent =

`${subject.percent}%`;



document.getElementById(
"mathProgressBar"
).style.width =

`${subject.percent}%`;



}





else if(subject.name.includes("فیزیک")){


document.getElementById(
"physicsPercent"
).textContent =

`${subject.percent}%`;



document.getElementById(
"physicsProgressBar"
).style.width =

`${subject.percent}%`;



}




});



}









// =====================================================
// AI MESSAGE
// =====================================================



if(result.aiAnalysis){



document.getElementById(
"aiMessage"
).innerHTML =

`

سلام 👋

<br><br>

${result.aiAnalysis.message || 
"تحلیل آزمون آماده نیست"}

<br><br>


<b>
نقاط قوت:
</b>

<br>

${result.aiAnalysis.strengths?.join("، ") || "-"}


<br><br>


<b>
نیاز به بهبود:
</b>

<br>

${result.aiAnalysis.weaknesses?.join("، ") || "-"}


`;



}





refreshIcons();



}



catch(error){


console.error(

"LOAD RESULT ERROR:",

error

);


}



}



























// ==========================================
// ENTER EXAM BUTTON
// ==========================================
document.addEventListener("click", async (e) => {
    const button = e.target.closest(".enter-exam-btn");
    if (!button) return;

    const examId = button.dataset.id;

    console.log("SELECTED EXAM:", examId);

    try {
        const token = localStorage.getItem("authToken");

        if (!token) {
            showExamMessage("لطفاً ابتدا وارد حساب کاربری خود شوید.");
            return;
        }

        const url = `${API_URL}/exam-submission/check/${examId}`;

        console.log("CHECK URL:", url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        console.log("CHECK STATUS:", response.status);
        console.log("CHECK CONTENT TYPE:", response.headers.get("content-type"));

        const raw = await response.text();

        console.log("CHECK RAW RESPONSE:", raw);

        if (!response.ok) {
            showExamMessage("خطا در بررسی وضعیت آزمون.");
            return;
        }

        let data;

        try {
            data = JSON.parse(raw);
        } catch (jsonError) {
            console.error("INVALID JSON RESPONSE:", raw);
            showExamMessage("پاسخ نامعتبر از سرور دریافت شد.");
            return;
        }

        console.log("EXAM CHECK:", data);

        if (data.alreadySubmitted) {
            showExamMessage("شما قبلاً در این آزمون شرکت کرده‌اید.");
            return;
        }

        localStorage.setItem("activeExam", examId);
        sessionStorage.setItem("selectedExamId", examId);

        console.log("ENTERING EXAM:", examId);

        window.location.href = "exam.html";

    } catch (error) {
        console.error("CHECK EXAM ERROR:", error);
        showExamMessage("خطا در بررسی وضعیت آزمون. دوباره تلاش کنید.");
    }
});


















// =======================================
// LOAD USER EXAMS
// =======================================


async function loadUserExamList(){


try{


const user = JSON.parse(
localStorage.getItem("currentUser")
);



if(!user){

console.log(
"USER NOT FOUND"
);

return;

}




const userId = user._id || user.id;



console.log(
"LOAD USER EXAMS ID:",
userId
);





const response = await fetch(

`${API_URL}/results/user-exams/${userId}`

);



const data = await response.json();



console.log(
"USER EXAMS DATA:",
data
);




const box = document.getElementById(
"examSelectorList"
);



if(!box)
return;




if(

!data.success ||

!data.exams ||

data.exams.length===0

){


box.innerHTML=`

<div class="exam-selector-empty">

هنوز آزمونی شرکت نکرده اید

</div>

`;


return;


}




box.innerHTML="";





data.exams.forEach(exam=>{



const item = document.createElement(
"div"
);



item.className =
"exam-selector-item";




item.innerHTML = `


<div class="exam-selector-name">


<i data-lucide="clipboard-check"></i>


<span>

${exam.title || "آزمون بدون عنوان"}

</span>


</div>




<button 
class="exam-view-btn"
>


مشاهده تحلیل


<i data-lucide="arrow-left"></i>


</button>


`;





const btn = item.querySelector(
".exam-view-btn"
);



btn.onclick = ()=>{


console.log(
"SELECT EXAM:",
exam
);



loadSelectedExam(

exam.examId,

userId

);


};





box.appendChild(item);



});





if(window.lucide){

lucide.createIcons();

}




}

catch(error){


console.log(

"USER EXAMS ERROR:",

error

);


}


}












// =======================================
// LOAD USER EXAMS INTO RECENT EXAMS CARD
// =======================================


async function loadUserExamList(){


try{


const user =
JSON.parse(
localStorage.getItem("currentUser")
);



if(!user){

console.log(
"USER NOT FOUND"
);

return;

}



const userId =
user._id || user.id;



console.log(
"LOAD USER EXAMS:",
userId
);



const response =
await fetch(

`${API_URL}/results/user-exams/${userId}`

);



const data =
await response.json();



console.log(
"USER EXAMS DATA:",
data
);



const box =
document.getElementById(
"recentExamsList"
);



if(!box)
return;



if(

!data.success ||
!data.exams ||
data.exams.length===0

){


box.innerHTML = `

<div class="empty">

هنوز آزمونی شرکت نکرده اید

</div>

`;


return;

}



box.innerHTML="";



data.exams.forEach(exam=>{


const item =
document.createElement("div");


item.className =
"recent-exam-item";



item.innerHTML = `


<div class="recent-exam-info">


<div class="recent-exam-icon">

 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" class="w-12 h-12 text-neutral-30 mx-auto mb-3"><path d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M22 10H18C15 10 14 9 14 6V2L22 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7 13H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7 17H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>

</div>



<div>


<strong>

${exam.title || "آزمون بدون عنوان"}

</strong>


<span>

${exam.subject || "آزمون"}

</span>


</div>


</div>



<button 
class="recent-exam-btn"
>

مشاهده



</button>


`;





const btn =
item.querySelector(
".recent-exam-btn"
);



btn.onclick = ()=>{


console.log(
"SELECTED EXAM:",
exam
);



loadSelectedExam(

exam.examId,

userId

);


};




box.appendChild(item);



});





if(window.lucide){

lucide.createIcons();

}



}
catch(error){


console.log(
"LOAD USER EXAMS ERROR:",
error
);


}


}

// =====================================================
// START
// =====================================================

await loadUser();

await loadActiveExams();

await loadRecentExams();

await loadUserExamList();

});

























































































document.addEventListener("DOMContentLoaded",()=>{


const backBtn = document.getElementById("backBtn");



if(backBtn){


    backBtn.addEventListener("click",()=>{


        if(history.length > 1){


            history.back();


        }

        else{


            window.location.href="../index1.html";


        }


    });


}



if(window.lucide){


    lucide.createIcons();


}


});



































// ==========================================
// EXAM MESSAGE
// ==========================================

function showExamMessage(message) {

    const oldMessage =
        document.querySelector(".exam-message");

    if (oldMessage) {
        oldMessage.remove();
    }


    const messageBox =
        document.createElement("div");

    messageBox.className = "exam-message";

    messageBox.textContent = message;


    document.body.appendChild(messageBox);


    requestAnimationFrame(() => {

        messageBox.classList.add("show");

    });


    setTimeout(() => {

        messageBox.classList.remove("show");

        setTimeout(() => {

            messageBox.remove();

        }, 300);

    }, 3500);
}





























































