document.addEventListener(
"DOMContentLoaded",
async()=>{


console.log("EXAM PAGE READY");



// ===============================
// ICONS
// ===============================

function refreshIcons(){

    if(window.lucide){

        lucide.createIcons();

    }

}



// ===============================
// TOKEN
// ===============================

const token =
localStorage.getItem("authToken");

let currentUserId = null;

if(!token){

    console.error("NO TOKEN");

    return;

}



// ===============================
// EXAM ID
// ===============================

const examId =
sessionStorage.getItem("selectedExamId");



if(!examId){

    console.error("EXAM ID NOT FOUND");

    return;

}



// ===============================
// ELEMENTS
// ===============================


// user

const studentName =
document.getElementById(
"studentName"
);


const studentCandidateNumber =
document.getElementById(
"studentCandidateNumber"
);



// exam info

const examTitle =
document.getElementById(
"detailExamTitle"
);


const examSubject =
document.getElementById(
"detailExamSubject"
);


const examCount =
document.getElementById(
"detailQuestionCount"
);


const examDuration =
document.getElementById(
"detailExamDuration"
);


const examDescription =
document.getElementById(
"examDescription"
);



// question

const questionText =
document.getElementById(
"questionText"
);


const optionsList =
document.getElementById(
"optionsList"
);


const questionsGrid =
document.getElementById(
"questionsGrid"
);


const questionNumber =
document.getElementById(
"currentQuestionNumber"
);



// buttons

const nextBtn =
document.getElementById(
"nextQuestion"
);


const prevBtn =
document.getElementById(
"previousQuestion"
);


const markBtn =
document.getElementById(
"markQuestion"
);


const finishExamBtn =
document.getElementById(
"finishExamBtn"
);


const confirmModal =
document.getElementById(
"examConfirmModal"
);


const submitFinalExam =
document.getElementById(
"submitFinalExam"
);


const cancelFinalExam =
document.getElementById(
"cancelFinalExam"
);

const statusFinishOverlay =
document.getElementById(
"statusFinishOverlay"
);
// ===============================
// STATE
// ===============================


let questions=[];

let currentQuestion=1;

let answers={};

let marked=[];

let finalExamData = null;



// ===============================
// LOAD USER
// ===============================


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
"USER:",
data
);



const user =
data.user;

currentUserId = user._id;

console.log(
"CURRENT USER ID:",
currentUserId
);


if(studentName){

studentName.textContent =
user.fullname || "کاربر";

}



if(studentCandidateNumber){

studentCandidateNumber.textContent =
`شماره داوطلبی: ${user.candidateNumber || "---"}`;

}



}

catch(error){

console.error(
"USER ERROR:",
error
);

}


}







// ===============================
// LOAD EXAM
// ===============================


async function loadExam(){


try{


console.log(
"GET EXAM:",
examId
);



const response =
await fetch(

`${API_URL}/tests/${examId}`

);



const data =
await response.json();



console.log(
"EXAM DATA:",
data
);



if(!response.ok){

throw new Error(
data.message
);

}



const test =
data.test;




// اطلاعات آزمون


if(examTitle){

examTitle.textContent =
test.title || "-";

}



if(examSubject){

examSubject.textContent =
test.subject || "-";

}



if(examCount){

examCount.textContent =
`${test.questions.length} سوال`;

}



if(examDuration){

examDuration.textContent =
`${test.duration} دقیقه`;

}



if(examDescription){

examDescription.textContent =
test.advice || 
"توضیحی ثبت نشده";

}





questions =
test.questions || [];





console.log(
"QUESTIONS:",
questions
);





createQuestionNumbers();


loadQuestion(1);



}

catch(error){


console.error(
"EXAM ERROR:",
error
);



questionText.textContent =
"خطا در دریافت آزمون";

}



}









// ===============================
// CREATE QUESTION GRID
// ===============================


function createQuestionNumbers(){


questionsGrid.innerHTML="";



questions.forEach(
(q,index)=>{


const btn =
document.createElement(
"button"
);



btn.className =
"question-number-btn";



btn.textContent =
index+1;



btn.onclick=()=>{


loadQuestion(
index+1
);


};



questionsGrid.appendChild(btn);



});


}









// ===============================
// LOAD QUESTION
// ===============================


function loadQuestion(id){


const q =
questions[id-1];



if(!q)
return;



currentQuestion=id;



questionNumber.textContent =
id;



questionText.textContent =
q.question;



optionsList.innerHTML="";



q.options.forEach(

(option,index)=>{


const label =
document.createElement(
"label"
);



label.className =
"answer-option";



label.innerHTML=`

<input
type="radio"
name="answer"
value="${index}"
>

<span class="checkBox">

<div class="transition"></div>

</span>


<span class="answer-text">

${option}

</span>

`;





const input =
label.querySelector(
"input"
);




if(
answers[id] === index
){

input.checked=true;

label.classList.add(
"selected"
);

}




input.onchange=()=>{


answers[id]=index;



document
.querySelectorAll(
".answer-option"
)
.forEach(
(item)=>{

item.classList.remove(
"selected"
);

}

);



label.classList.add(
"selected"
);



updateStatus();


};




optionsList.appendChild(
label
);



});



updateStatus();


}









// ===============================
// STATUS
// ===============================


function updateStatus(){



document
.querySelectorAll(
".question-number-btn"
)
.forEach(
(btn,index)=>{


let id=index+1;



btn.className =
"question-number-btn";



if(id===currentQuestion){

btn.classList.add(
"current"
);

}



if(
answers[id] !== undefined
){

btn.classList.add(
"answered"
);

}



if(
marked.includes(id)
){

btn.classList.add(
"marked"
);

}


});


}



function updateStatus(){


    // ===============================
    // QUESTION BUTTONS
    // ===============================


    document
    .querySelectorAll(".question-number-btn")
    .forEach((btn,index)=>{


        const id = index + 1;


        btn.className =
        "question-number-btn";



        // سوال فعلی

        if(id === currentQuestion){

            btn.classList.add(
                "current"
            );

        }



        // پاسخ داده شده

        if(
            answers[id] !== undefined
        ){

            btn.classList.add(
                "answered"
            );

        }



        // علامت دار

        if(
            marked.includes(id)
        ){

            btn.classList.add(
                "marked"
            );

        }



    });



    // ===============================
    // COUNTERS
    // ===============================


    const answeredCount =
    document.getElementById(
        "answeredCount"
    );


    const remainingCount =
    document.getElementById(
        "remainingCount"
    );


    const markedCount =
    document.getElementById(
        "markedCount"
    );



    if(answeredCount){

        answeredCount.textContent =
        Object.keys(answers).length;

    }



    if(remainingCount){

        remainingCount.textContent =
        questions.length -
        Object.keys(answers).length;

    }



    if(markedCount){

        markedCount.textContent =
        marked.length;

    }


}




// ===============================
// MARK QUESTION
// ===============================


if(markBtn){


markBtn.onclick=()=>{


if(
marked.includes(currentQuestion)
){


marked =
marked.filter(
x=>x!==currentQuestion
);



markBtn.classList.remove(
"active"
);


}

else{


marked.push(
currentQuestion
);



markBtn.classList.add(
"active"
);


}



updateStatus();


};


}









// ===============================
// NAVIGATION
// ===============================

// ===============================
// NEXT PREVIOUS FIX
// ===============================


nextBtn.onclick = ()=>{

    if(currentQuestion > 1){

        loadQuestion(
            currentQuestion - 1
        );

    }

};



prevBtn.onclick = ()=>{

    if(currentQuestion < questions.length){

        loadQuestion(
            currentQuestion + 1
        );

    }

};









// ===============================
// OPEN STATUS FINISH OVERLAY
// ===============================


function openStatusFinishOverlay(){


    const overlay =
    document.getElementById(
        "statusFinishOverlay"
    );


    if(overlay){

        overlay.classList.add(
            "show"
        );

    }


}



// ===============================
// CLOSE STATUS FINISH OVERLAY
// ===============================


function closeStatusFinishOverlay(){


    const overlay =
    document.getElementById(
        "statusFinishOverlay"
    );


    if(overlay){

        overlay.classList.remove(
            "show"
        );

    }


}

// ===============================
// FINISH EXAM MODAL
// ===============================


if(finishExamBtn){


    finishExamBtn.onclick = ()=>{

        openStatusFinishOverlay();

        const answered = 
        Object.keys(answers).length;


        const remaining = 
        questions.length - answered;



        const finalStudentName =
        document.getElementById(
            "finalStudentName"
        );


        const finalCandidateNumber =
        document.getElementById(
            "finalCandidateNumber"
        );


        const finalTotalQuestions =
        document.getElementById(
            "finalTotalQuestions"
        );


        const finalAnswered =
        document.getElementById(
            "finalAnswered"
        );


        const finalRemaining =
        document.getElementById(
            "finalRemaining"
        );


        const finalMarked =
        document.getElementById(
            "finalMarked"
        );

        const finalLeague =
        document.getElementById(
            "finalLeague"
        );


        const finalExamTitle =
        document.getElementById(
            "finalExamTitle"
        );


        const finalExamSubject =
        document.getElementById(
            "finalExamSubject"
        );


        const finalExamDuration =
        document.getElementById(
            "finalExamDuration"
        );


        const finalDescription =
        document.getElementById(
            "finalDescription"
        );

        


        if(finalStudentName){

            finalStudentName.textContent =
            studentName.textContent;

        }



        if(finalCandidateNumber){

            finalCandidateNumber.textContent =
            studentCandidateNumber.textContent;

        }



        if(finalTotalQuestions){

            finalTotalQuestions.textContent =
            questions.length;

        }



        if(finalAnswered){

            finalAnswered.textContent =
            answered;

        }



        if(finalRemaining){

            finalRemaining.textContent =
            remaining;

        }



        if(finalMarked){

            finalMarked.textContent =
            marked.length;

        }



        if(finalLeague){

            finalLeague.textContent =
            document.getElementById(
                "studentLeague"
            ).textContent;

        }



        if(finalExamTitle){

            finalExamTitle.textContent =
            examTitle.textContent;

        }



        if(finalExamSubject){

            finalExamSubject.textContent =
            examSubject.textContent;

        }



        if(finalExamDuration){

            finalExamDuration.textContent =
            examDuration.textContent;

        }



        if(finalDescription){

            finalDescription.textContent =
            examDescription.textContent;

        }



        if(confirmModal){

            confirmModal.classList.add(
                "show"
            );



        }


        


    };


}

// ===============================
// CANCEL FINISH
// ===============================

if(cancelFinalExam){


    cancelFinalExam.onclick = ()=>{


        // بستن باکس تایید نهایی

        if(confirmModal){

            confirmModal.classList.remove(
                "show"
            );

        }



        // بستن باکس وضعیت سوالات

        if(statusFinishOverlay){

            statusFinishOverlay.classList.remove(
                "show"
            );

        }


    };


}




// ===============================
// SUBMIT FINAL EXAM
// ===============================


const examSubmitState =
document.getElementById(
"examSubmitState"
);


const submitLoader =
document.querySelector(
".submit-loader"
);


const submitSuccess =
document.querySelector(
".submit-success"
);



if(submitFinalExam){


submitFinalExam.onclick = async ()=>{


console.log("SUBMIT BUTTON CLICKED");

// ===============================
// CREATE FINAL DATA
// ===============================


finalExamData = {


    examId: examId,


    answers: answers,


    markedQuestions: marked,


    totalQuestions: questions.length,


    answeredCount:
    Object.keys(answers).length,


    remainingCount:
    questions.length -
    Object.keys(answers).length,


    submittedAt:
    new Date().toISOString()


};



console.log(
"FINAL EXAM DATA:",
finalExamData
);

localStorage.setItem(

    `submitted_${currentUserId}_${examId}`,

    JSON.stringify(finalExamData)

);

// ===============================
// SEND EXAM TO SERVER
// ===============================


try{

console.log(
"SENDING TO SERVER:",
finalExamData
);

const response =
await fetch(

`${API_URL}/exam-submission/submit`,

{

method:"POST",


headers:{


"Content-Type":
"application/json",


Authorization:
`Bearer ${token}`


},


body:
JSON.stringify(finalExamData)


}

);



const result =
await response.json();



console.log(
"SAVED EXAM:",
result
);



}
catch(error){


console.error(
"SAVE EXAM ERROR:",
error
);


}

// ===============================
// LOCK BOTH BOXES
// ===============================


if(confirmModal){

    confirmModal.classList.add(
        "locked"
    );

}



if(statusFinishOverlay){

    statusFinishOverlay.classList.add(
        "locked"
    );

}

// ===============================
// LOCK PAGE
// ===============================


const workspace =
document.querySelector(
".exam-workspace"
);



if(workspace){

workspace.classList.add(
"exam-lock-mode"
);

}




// ===============================
// HIDE OLD CONTENT
// ===============================


const oldContent =
document.querySelectorAll(
".confirm-box > *:not(#examSubmitState)"
);



oldContent.forEach(item=>{

item.style.display="none";

});





// ===============================
// SHOW LOADER
// ===============================


if(examSubmitState){

examSubmitState.style.display=
"flex";

}



if(submitLoader){

submitLoader.style.display=
"flex";

}



if(submitSuccess){

submitSuccess.style.display=
"none";

}



refreshIcons();





// ===============================
// WAIT SEND
// ===============================



setTimeout(()=>{



if(submitLoader){

submitLoader.style.display=
"none";

}



if(submitSuccess){

submitSuccess.style.display=
"flex";

}



refreshIcons();



},2500);




};


}
























// ===============================
// START
// ===============================


await loadUser();

await loadExam();

// ===============================
// RESTORE SUBMITTED STATE
// ===============================


const savedExam =
localStorage.getItem(
    `submitted_${currentUserId}_${examId}`
);



if(savedExam){


    if(confirmModal){

        confirmModal.classList.add(
            "show",
            "locked"
        );

    }



    if(statusFinishOverlay){

        statusFinishOverlay.classList.add(
            "show",
            "locked"
        );

    }



    const dashboard =
    document.querySelector(
        ".confirm-dashboard"
    );


    const title =
    document.querySelector(
        ".confirm-box > h2"
    );


    if(dashboard){

        dashboard.style.display="none";

    }


    if(title){

        title.style.display="none";

    }



    const examSubmitState =
    document.getElementById(
        "examSubmitState"
    );



    const submitLoader =
    document.querySelector(
        ".submit-loader"
    );



    const submitSuccess =
    document.querySelector(
        ".submit-success"
    );



    if(examSubmitState){

        examSubmitState.style.display="flex";

    }


    if(submitLoader){

        submitLoader.style.display="none";

    }


    if(submitSuccess){

        submitSuccess.style.display="flex";

    }



    refreshIcons();


}

refreshIcons();


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