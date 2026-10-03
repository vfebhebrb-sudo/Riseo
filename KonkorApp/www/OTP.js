
/* =================================
        OTP SYSTEM
================================= */


const phoneNumber =
document.getElementById("phoneNumber");


const chatId =
document.getElementById("chatId");


const phoneGroup =
document.getElementById("phoneGroup");


const sendCodeBtn =
document.getElementById("sendCodeBtn");


const editPhoneBtn =
document.getElementById("editPhoneBtn");


const otpBoxes =
document.querySelectorAll(".otp-box");


const verifyBtn =
document.getElementById("verifyBtn");


const otpContainer =
document.querySelector(".otp-container");













console.log("sendCodeBtn:", sendCodeBtn);
console.log("editPhoneBtn:", editPhoneBtn);
console.log("otpForm:", document.getElementById("otpForm"));
/* =================================
        TOAST
================================= */


function showToast(text){

    const toast =
    document.getElementById("toast");


    if(!toast)
        return;


    const span =
    toast.querySelector("span");


    if(span)
        span.innerText = text;


    toast.classList.add("show");


    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}




/* =================================
        VALIDATION
================================= */


function validatePhone(phone){

    return /^09\d{9}$/.test(phone);

}




/* =================================
        TIMER
================================= */


function startOtpTimer(time){


    sendCodeBtn.disabled = true;


    const timer =
    setInterval(()=>{


        let min =
        Math.floor(time / 60);


        let sec =
        time % 60;



        sendCodeBtn.innerHTML = `

        <span>
            ارسال مجدد
            ${min}:${sec.toString().padStart(2,"0")}
        </span>

        `;



        time--;



        if(time < 0){


            clearInterval(timer);


            sendCodeBtn.disabled = false;


            sendCodeBtn.innerHTML = `

            <span>
                ارسال کد تایید
            </span>

            <i class="fa-solid fa-paper-plane"></i>

            `;

        }


    },1000);

}





/* =================================
        SEND OTP
================================= */


sendCodeBtn.addEventListener(
"click",
async()=>{


const phone =
phoneNumber.value.trim();



const rubikaChatId =
chatId.value.trim();




if(!validatePhone(phone)){


    phoneGroup.classList.add("invalid");


    setTimeout(()=>{

        phoneGroup.classList.remove("invalid");

    },700);


    return;

}




if(!rubikaChatId){


    alert(
        "شناسه روبیکا را وارد کنید"
    );


    return;

}





try{


sendCodeBtn.disabled = true;



sendCodeBtn.innerHTML = `

<div class="loading">

<div class="d1"></div>
<div class="d2"></div>

</div>

`;



console.log(
    "REQUEST URL:",
    `${API_URL}/auth/send-otp`
);



const response =
await fetch(

`${API_URL}/auth/send-otp`,

{

method:"POST",


headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify({

    phone:phone,

    chatId:userChatId

})

}

);




const data =
await response.json();

console.log(data);


console.log(
    "OTP:",
    data
);





if(response.ok){



phoneNumber.disabled = true;



showToast(
    "کد تایید ارسال شد ✓"
);



otpBoxes.forEach(box=>{

    box.disabled=false;

});



startOtpTimer(120);



}

else{


throw new Error(
    data.message
);


}



}



catch(error){



console.log(
    "OTP ERROR:",
    error
);



sendCodeBtn.disabled=false;



sendCodeBtn.innerHTML = `

<span>
ارسال کد تایید
</span>

<i class="fa-solid fa-paper-plane"></i>

`;



showToast(
"ارسال کد انجام نشد ❌"
);



}



});







/* =================================
        EDIT PHONE
================================= */

if (editPhoneBtn) {

    editPhoneBtn.addEventListener(
        "click",
        () => {

            // فعال کردن شماره
            phoneNumber.disabled = false;

            phoneNumber.focus();

            // فعال کردن ارسال مجدد
            sendCodeBtn.disabled = false;

            sendCodeBtn.innerHTML = `

                <span>
                    ارسال کد تایید
                </span>

                <i class="fa-solid fa-paper-plane"></i>

            `;


            // پاک کردن OTP
            otpBoxes.forEach(box => {

                box.value = "";

                box.disabled = true;

            });

        }
    );

}


/* =================================
        OTP INPUT
================================= */

otpBoxes.forEach(
    (box, index) => {

        // در ابتدا غیرفعال
        box.disabled = true;


        /* =============================
                INPUT
        ============================= */

        box.addEventListener(
            "input",
            () => {

                // فقط عدد
                box.value =
                    box.value.replace(/\D/g, "");


                // رفتن به خانه بعدی
                if (
                    box.value &&
                    index < otpBoxes.length - 1
                ) {

                    otpBoxes[index + 1].focus();

                }

            }
        );


        /* =============================
                BACKSPACE
        ============================= */

        box.addEventListener(
            "keydown",
            (e) => {

                if (
                    e.key === "Backspace" &&
                    !box.value &&
                    index > 0
                ) {

                    otpBoxes[index - 1].focus();

                }

            }
        );

    }
);


/* =================================
        VERIFY OTP
================================= */

const otpForm =
    document.getElementById("otpForm");


if (otpForm) {

    otpForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            /* =============================
                    OTP CODE
            ============================= */

            const otpCode =
                [...otpBoxes]
                    .map(box => box.value)
                    .join("");


            /* =============================
                    PHONE
            ============================= */

            const phone =
                phoneNumber.value.trim();


            /* =============================
                    RUBIKA CHAT ID
            ============================= */

            const rubikaChatId =
                chatId.value.trim();


            /* =============================
                    REGISTER DATA
            ============================= */

            const savedRegisterData =
                localStorage.getItem(
                    "registerData"
                );


            if (!savedRegisterData) {

                alert(
                    "اطلاعات ثبت نام پیدا نشد"
                );

                return;

            }


            let registerData;


            try {

                registerData =
                    JSON.parse(
                        savedRegisterData
                    );

            }

            catch (error) {

                console.log(
                    "REGISTER DATA ERROR:",
                    error
                );

                alert(
                    "اطلاعات ثبت نام نامعتبر است"
                );

                return;

            }


            /* =============================
                    VALIDATE OTP
            ============================= */

            if (otpCode.length !== 4) {

                alert(
                    "کد تایید را کامل وارد کنید"
                );

                return;

            }


            /* =============================
                    DISABLE VERIFY BUTTON
            ============================= */

            verifyBtn.disabled = true;


            verifyBtn.innerHTML = `

                <span>
                    در حال تایید...
                </span>

                <i class="fa-solid fa-spinner fa-spin"></i>

            `;


            try {


                /* =============================
                        API REQUEST
                ============================= */

                const response =
                    await fetch(

                        `${API_URL}/auth/verify-otp`,

                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                phone:

                                    phone,

                                chatId:

                                    rubikaChatId,

                                otp:

                                    otpCode,

                                fullname:

                                    registerData.fullname,

                                email:

                                    registerData.email,

                                password:

                                    registerData.password

                            })

                        }

                    );


                /* =============================
                        RESPONSE
                ============================= */

                const data =
                    await response.json();
                    console.log(data);

                console.log(
                    "VERIFY RESPONSE:",
                    data
                );


                /* =============================
                        SUCCESS
                ============================= */

                if (response.ok) {


                    /* =============================
                            OTP SUCCESS STYLE
                    ============================= */

                    if (otpContainer) {

                        otpContainer.classList.add(
                            "valid"
                        );

                    }


                    /* =============================
                            BUTTON
                    ============================= */

                    verifyBtn.innerHTML = `

                        <span>
                            حساب ایجاد شد ✓
                        </span>

                        <i class="fa-solid fa-check"></i>

                    `;


                    /* =============================
                            SAVE USER
                    ============================= */

                    if (data.user) {

                        localStorage.setItem(
                            "currentUser",
                            JSON.stringify(
                                data.user
                            )
                        );

                    }


                    /* =============================
                            REMOVE REGISTER DATA
                    ============================= */

                    localStorage.removeItem(
                        "registerData"
                    );


                    /* =============================
                            SUCCESS MESSAGE
                    ============================= */

                    showToast(
                        "حساب شما با موفقیت ساخته شد ✓"
                    );


                    /* =============================
                            REDIRECT
                    ============================= */

                    setTimeout(
                        () => {


                            const screenWidth =
                                window.innerWidth;


                            /*
                                موبایل:
                                768px و کمتر

                                دسکتاپ:
                                بیشتر از 768px
                            */

                            if (
                                screenWidth <= 768
                            ) {


                                // 📱 Mobile Dashboard

                                window.location.href =
                                    "./موبایل.html";


                            }

                            else {


                                // 💻 Desktop Dashboard

                                window.location.href =
                                    "../index1.html";

                            }


                        },
                        2000
                    );


                }


                /* =============================
                        ERROR RESPONSE
                ============================= */

                else {


                    verifyBtn.disabled = false;


                    verifyBtn.innerHTML = `

                        <span>
                            تایید کد
                        </span>

                        <i class="fa-solid fa-check"></i>

                    `;


                    alert(
                        data.message ||
                        "کد تایید صحیح نیست"
                    );

                }

            }


            /* =============================
                    CONNECTION ERROR
            ============================= */

            catch (error) {


                console.log(
                    "VERIFY OTP ERROR:",
                    error
                );


                verifyBtn.disabled = false;


                verifyBtn.innerHTML = `

                    <span>
                        تایید کد
                    </span>

                    <i class="fa-solid fa-check"></i>

                `;


                alert(
                    "خطا در اتصال به سرور"
                );

            }

        }
    );

}



