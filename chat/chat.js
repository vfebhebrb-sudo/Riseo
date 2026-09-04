
// =====================================================
// CHAT SYSTEM V5
// PART 1
// CHATS + LOAD MESSAGES
// MESSAGE BOX کاملاً مستقل از سیستم چت
// =====================================================

console.log("🔥 CHAT.JS LOADED");


// =====================================================
// API CONFIG
// =====================================================

const API = API_URL;


// =====================================================
// ELEMENTS
// =====================================================

const messagesContainer =
    document.getElementById("messagesContainer");

const messageInput =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");

const chatList =
    document.getElementById("chatList");

const headerAvatar =
    document.getElementById("headerAvatar");

const contactName =
    document.getElementById("contactName");

const contactStatus =
    document.getElementById("contactStatus");

const attachBtn =
    document.getElementById("attachBtn");

const fileInput =
    document.getElementById("fileInput");

    const emojiBtn =
    document.getElementById("emojiBtn");

const emojiPicker =
    document.getElementById("emojiPicker");

    const selectedFile =
    document.getElementById("selectedFile");

const selectedFileName =
    document.getElementById("selectedFileName");

const selectedFileSize =
    document.getElementById("selectedFileSize");

const removeFileBtn =
    document.getElementById("removeFile");

const mobileBackBtn = document.getElementById("mobileBackBtn");
const chatPanel = document.getElementById("chatPanel");
const conversation = document.getElementById("conversation");
// =====================================================
// CURRENT USER
// =====================================================

const savedUser = 
    localStorage.getItem("currentUser");


const currentUser = savedUser
    ? JSON.parse(savedUser)
    : null;


if(!currentUser){

    console.log("کاربر وارد نشده");

}


// =====================================================
// STATE
// =====================================================

let chats = [];

let currentChat = null;

let currentChatType = null;

// =====================================================
// LIVE MESSAGE POLLING
// دریافت پیام‌های جدید بدون Refresh
// =====================================================

let messagePolling = null;

let loadedMessageIds = new Set();
// =====================================================
// STATIC CHATS
// =====================================================

const staticChats = [

    {
        _id: "ai",

        name: "هوش مصنوعی",

        type: "ai",

        lastMessage:
            "سلام 👋 آماده کمک به برنامه کنکور شما هستم"
    }

];


// =====================================================
// API
// =====================================================

async function api(url, options = {}) {

    try {

        const response =
            await fetch(
                API + url,
                options
            );


        const data =
            await response.json();


        return {

            ok: response.ok,

            data: data

        };

    }

    catch (error) {

        console.log(
            "🔥 API ERROR:",
            error
        );


        return {

            ok: false,

            data: null

        };

    }

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text || "";


    return div.innerHTML;

}


// =====================================================
// CHAT TYPE
// =====================================================

function getChatTypeName(type) {

    if (type === "group") {

        return "گروه";

    }


    if (type === "channel") {

        return "کانال";

    }


    if (type === "private") {

        return "خصوصی";

    }


    if (type === "ai") {

        return "آنلاین";

    }


    return "";

}


// =====================================================
// LOAD USER CHATS
// =====================================================

async function loadChats() {

    console.log(
        "🔥 LOAD CHATS START"
    );

if(!currentUser){
    return;
}

    const result =
        await api(
            `/chat/user/${currentUser.phone}`
        );


    console.log(
        "🔥 API RESULT:",
        result
    );


    if (!result.ok) {

        console.log(
            "❌ LOAD CHATS ERROR:",
            result.data
        );

        return;

    }


    // ---------------------------------------------
    // دریافت چت‌های سرور
    // ---------------------------------------------

    const serverChats =

        result.data &&
        Array.isArray(result.data.chats)

        ?

        result.data.chats

        :

        [];


    console.log(
        "🔥 SERVER CHATS:",
        serverChats
    );


    // ---------------------------------------------
    // ترکیب چت ثابت + دیتابیس
    // ---------------------------------------------

    chats = [

        ...staticChats,

        ...serverChats

    ];


    console.log(
        "🔥 FINAL CHATS:",
        chats
    );


    console.log(
        "🔥 FINAL CHATS LENGTH:",
        chats.length
    );


    renderChats();

}


// =====================================================
// RENDER CHATS
// =====================================================

function renderChats() {

    if (!chatList) {

        console.log(
            "❌ chatList پیدا نشد"
        );

        return;

    }


    chatList.innerHTML = "";


    chats.forEach(chat => {


        const item =
            document.createElement("div");


        item.className =
            "chat-item";


        item.dataset.chatId =
            chat._id;


        item.dataset.type =
            chat.type;


        // ---------------------------------------------
        // ICON
        // ---------------------------------------------

        let icon = "users";


        if (chat.type === "ai") {

            icon = "bot";

        }

        else if (chat.type === "channel") {

            icon = "megaphone";

        }

        else if (chat.type === "private") {

            icon = "user";

        }

        else if (chat.type === "group") {

            icon = "users";

        }


        // ---------------------------------------------
        // HTML
        // ---------------------------------------------

        item.innerHTML = `

            <div class="profile-icon ${escapeHTML(chat.type)}">

                <i data-lucide="${icon}"></i>

            </div>


            <div class="chat-info">

                <div class="chat-name">

                    <strong>

                        ${escapeHTML(
                            chat.name || "بدون نام"
                        )}

                    </strong>


                    ${
                        chat.type === "ai"

                        ?

                        `
                        <span class="verified">
                            ✓
                        </span>
                        `

                        :

                        ""
                    }


                    <time>

                        ${
                            chat.type === "ai"

                            ?

                            "آنلاین"

                            :

                            getChatTypeName(
                                chat.type
                            )
                        }

                    </time>

                </div>


                <p>

                    ${
                        chat.lastMessage

                        ?

                        escapeHTML(
                            chat.lastMessage
                        )

                        :

                        "پیامی وجود ندارد"
                    }

                </p>

            </div>

        `;

        item.addEventListener("click",()=>{

    console.log("CHAT CLICKED");

});

        chatList.appendChild(item);

    });


    // ---------------------------------------------
    // LUCIDE
    // ---------------------------------------------

    if (
        typeof lucide !== "undefined"
    ) {

        lucide.createIcons();

    }


    console.log(
        "🔥 AFTER RENDER COUNT:",
        chatList.children.length
    );

}


// =====================================================
// UPDATE CHAT HEADER
// =====================================================

function updateChatHeader(chatId) {

    const chat =
        chats.find(
            item =>
                item._id === chatId
        );


    if (!chat) {

        return;

    }


    // ---------------------------------------------
    // NAME
    // ---------------------------------------------

    if (contactName) {

        contactName.innerText =
            chat.name || "بدون نام";

    }


    // ---------------------------------------------
    // STATUS
    // ---------------------------------------------

    if (contactStatus) {

        contactStatus.innerText =
            getChatTypeName(
                chat.type
            );

    }


    // ---------------------------------------------
    // AVATAR
    // ---------------------------------------------

    if (headerAvatar) {


        let icon = "users";


        if (chat.type === "ai") {

            icon = "bot";

        }

        else if (chat.type === "channel") {

            icon = "megaphone";

        }

        else if (chat.type === "private") {

            icon = "user";

        }


        headerAvatar.innerHTML = `

            <i data-lucide="${icon}"></i>

        `;


        if (
            typeof lucide !== "undefined"
        ) {

            lucide.createIcons();

        }

    }

}


// =====================================================
// CLICK CHAT
// =====================================================

console.log("CHAT LIST:", chatList);

if (chatList) {

    chatList.addEventListener(
        "click",
        function(event) {

                console.log("CLICK EVENT");

            const item =
                event.target.closest(
                    ".chat-item"
                );


            if (!item) {

                return;

            }


            // -----------------------------------------
            // ACTIVE
            // -----------------------------------------

            document
                .querySelectorAll(".chat-item")
                .forEach(element => {

                    element.classList.remove(
                        "active"
                    );

                });


            item.classList.add(
                "active"
            );


            // -----------------------------------------
            // CURRENT CHAT
            // -----------------------------------------

            currentChat =
                item.dataset.chatId;


            currentChatType =
                item.dataset.type;


            console.log(
                "🔥 OPEN CHAT:",
                currentChat,
                currentChatType
            );


            // -----------------------------------------
            // HEADER
            // -----------------------------------------

            updateChatHeader(
                currentChat
            );


            // -----------------------------------------
            // فقط پیام‌ها را لود کن
            // -----------------------------------------

            loadMessages(
                currentChat
            );

            openMobileChat();


        
        }
    );

}


// =====================================================
// FORMAT TIME
// =====================================================

function formatTime(date) {

    const d =
        new Date(
            date || Date.now()
        );


    return (

        String(
            d.getHours()
        ).padStart(2, "0")

        +

        ":"

        +

        String(
            d.getMinutes()
        ).padStart(2, "0")

    );

}


// =====================================================
// ADD MESSAGE
// =====================================================
// =====================================================
// ADD MESSAGE
// نمایش پیام
// =====================================================

function addMessage(
    text,
    type,
    time,
    status = null,
    sender = "",
    senderType = "user"
) {


    if (!messagesContainer) {

        return null;

    }



    const div =
        document.createElement("div");


div.className = 
`message ${type} ${senderType}`;
    // ==============================
    // STATUS
    // ==============================

    let statusHTML = "";


    if(type === "outgoing"){


        statusHTML = `

        <span class="message-status">

            ${status || "✓"}

        </span>

        `;

    }




    // ==============================
    // AVATAR
    // ==============================


    let avatarIcon = "user";
   let senderName = sender || "کاربر";



    if(senderType === "admin"){


        avatarIcon = "shield-check";
        senderName = "مدیر";


    }


    else if(senderType === "ai"){


        avatarIcon = "bot";
        senderName = "هوش مصنوعی";


    }


    else{
        avatarIcon = "user";
        senderName = sender || "کاربر";
    }




div.innerHTML = `


<div class="message-avatar">

    <i data-lucide="${avatarIcon}"></i>

</div>



<div class="message-content">


    <strong class="sender-name">

        ${escapeHTML(senderName)}

    </strong>



    <p>

        ${escapeHTML(text)}

    </p>



    <div class="message-meta">


        <span class="message-time">

            ${formatTime(time)}

        </span>


        ${statusHTML}


    </div>



</div>


`;



    messagesContainer.appendChild(div);



    // فعال کردن آیکون ها

    lucide.createIcons();





    // اسکرول پایین

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;





    return div;


}

// =====================================================
// LOAD MESSAGES
// =====================================================

// =====================================================
// LOAD MESSAGES
// دریافت پیام‌های چت
// =====================================================

async function loadMessages(chatId) {

    console.log(
        "🔥 LOAD MESSAGES:",
        chatId
    );


    if (!messagesContainer) {

        return;

    }


    // -------------------------------------------------
    // توقف Polling قبلی
    // -------------------------------------------------

    stopMessagePolling();


    // -------------------------------------------------
    // پاک کردن پیام‌های قبلی
    // -------------------------------------------------

    messagesContainer.innerHTML = "";


    // -------------------------------------------------
    // پاک کردن ID های قبلی
    // -------------------------------------------------

    loadedMessageIds.clear();


    // -------------------------------------------------
    // AI
    // -------------------------------------------------
// -------------------------------------------------
// AI CHAT LOAD HISTORY
// -------------------------------------------------
// -------------------------------------------------
// AI CHAT LOAD HISTORY
// -------------------------------------------------

if (chatId === "ai") {


    const result =
        await api(
            `/ai/history/${currentUser.phone}`
        );



    console.log(
        "🔥 AI HISTORY RESULT:",
        result
    );



    if (
        result.ok &&
        result.data &&
        Array.isArray(result.data.messages) &&
        result.data.messages.length > 0
    ) {


        result.data.messages.forEach(msg => {


            addMessage(

                msg.text,

                msg.sender === "user"
                ?
                "outgoing"
                :
                "incoming",


                msg.createdAt,

                null,


                msg.sender === "ai"
                ?
                "هوش مصنوعی"
                :
                currentUser.fullname,


                msg.sender === "ai"
                ?
                "ai"
                :
                "user"

            );


        });


    }

    else {


        addMessage(

            "سلام 👋 من دستیار هوشمند برنامه کنکور هستم. چطور کمکت کنم؟",

            "incoming",

            new Date(),

            null,

            "هوش مصنوعی",

            "ai"

        );


    }



    return;


}

    // -------------------------------------------------
    // دریافت پیام‌های اولیه
    // -------------------------------------------------

    const result =
        await api(
            `/chat/messages/${chatId}`
        );


    console.log(
        "🔥 MESSAGE API RESULT:",
        result
    );


    if (!result.ok) {

        console.log(
            "❌ LOAD MESSAGE ERROR:",
            result.data
        );


        addMessage(

            "خطا در دریافت پیام‌ها",

            "incoming",

            new Date()

        );


        return;

    }


    const messages =

        result.data &&
        Array.isArray(
            result.data.messages
        )

        ?

        result.data.messages

        :

        [];


    console.log(
        "🔥 INITIAL MESSAGES:",
        messages
    );


    // -------------------------------------------------
    // نمایش پیام‌های موجود
    // -------------------------------------------------

    messages.forEach(msg => {

        renderServerMessage(msg);

    });


    // -------------------------------------------------
    // شروع Polling
    // -------------------------------------------------

    startMessagePolling(chatId);

}
// =====================================================
// START
// =====================================================

// =====================================================
// SEND MESSAGE
// ارسال پیام واقعی
// =====================================================
// =====================================================
// SEND MESSAGE
// ارسال پیام
// =====================================================

async function sendMessage() {

    // -------------------------------------------------
    // بررسی چت
    // -------------------------------------------------

    if (!currentChat) {

        console.log(
            "⚠️ هیچ چتی انتخاب نشده"
        );

        return;

    }


    // -------------------------------------------------
    // بررسی input
    // -------------------------------------------------

    if (!messageInput) {

        console.log(
            "❌ messageInput پیدا نشد"
        );

        return;

    }


    // -------------------------------------------------
    // دریافت متن
    // -------------------------------------------------

    const text =
        messageInput.value.trim();


    if (!text) {

        return;

    }


    // -------------------------------------------------
    // AI
    // -------------------------------------------------


function showAITyping(){


    const div =
        document.createElement("div");


    div.className =
        "ai-typing";


    div.innerHTML = `

        <span></span>

        <span></span>

        <span></span>

    `;


    messagesContainer.appendChild(div);


    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;


    return div;

}




if (currentChatType === "ai") {



    
    // نمایش پیام کاربر
addMessage(
    text,
    "outgoing",
    new Date(),
    "✓",
   currentUser.fullname,
    "user"
);

await api(
    "/ai/save",
    {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            phone: currentUser.phone,

            sender:"user",

            text:text

        })

    }
);

    messageInput.value = "";

    messageInput.focus();



    // پیام در حال فکر کردن AI
const aiLoading =
    showAITyping();



    try {


        const result =
            await api(
                "/ai/chat",
                {

                    method:"POST",

                    headers:{

                        "Content-Type":
                        "application/json"

                    },


                    body:
                    JSON.stringify({

                        message:text

                    })

                }
            );



        // حذف پیام لودینگ

        if(aiLoading){

            aiLoading.remove();

        }



        if(!result.ok){


        addMessage(
            "خطا در ارتباط با هوش مصنوعی ❌",
            "incoming",
            new Date(),
            null,
            "هوش مصنوعی",
            "ai"
        );


            return;

        }




        addMessage(
            result.data.reply,
            "incoming",
            new Date(),
            null,
            "هوش مصنوعی",
            "ai"
        );

        await api(
    "/ai/save",
    {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            phone: currentUser.phone,

            sender:"ai",

            text:result.data.reply

        })

    }
);


    }


    catch(error){


        console.log(
            "AI FRONT ERROR:",
            error
        );


        if(aiLoading){

            aiLoading.remove();

        }


        addMessage(

            "ارتباط با هوش مصنوعی برقرار نشد ❌",

            "incoming",

            new Date()

        );


    }



    return;


}

    // -------------------------------------------------
    // قفل دکمه ارسال
    // -------------------------------------------------

    if (sendBtn) {

        sendBtn.disabled = true;

    }


    // -------------------------------------------------
    // نمایش فوری پیام با وضعیت در حال ارسال
    // -------------------------------------------------

    const temporaryMessage =
            addMessage(
                text,
                "outgoing",
                new Date(),
                "⏳",
               currentUser.fullname,
                "user"
            );


    try {

        // -------------------------------------------------
        // ارسال به سرور
        // -------------------------------------------------
const formData = new FormData();


formData.append(
    "chatId",
    currentChat
);


formData.append(
    "sender",
    currentUser.phone
);

formData.append(
    "senderName",
   currentUser.fullname
);

formData.append(
    "text",
    text
);


// اگر فایل انتخاب شده بود
if (selectedFileData) {

    formData.append(
        "file",
        selectedFileData
    );

}


const result =
    await api(
        "/chat/message",
        {

            method: "POST",

            body: formData

        }
    );


        console.log(
            "🔥 SEND MESSAGE RESULT:",
            result
        );



        // -------------------------------------------------
        // خطا
        // -------------------------------------------------

        if (!result.ok) {

            console.log(
                "❌ SEND MESSAGE ERROR:",
                result.data
            );


            // ---------------------------------------------
            // تغییر وضعیت به خطا
            // ---------------------------------------------

            if (temporaryMessage) {

                const status =
                    temporaryMessage.querySelector(
                        ".message-status"
                    );


                if (status) {

                    status.innerText =
                        "✕";

                    status.classList.add(
                        "failed"
                    );

                }

            }


            return;

        }


        // -------------------------------------------------
        // پیام ذخیره‌شده واقعی
        // -------------------------------------------------

        const savedMessage =
            result.data &&
            result.data.data
                ? result.data.data
                : null;


        if (!savedMessage) {

            console.log(
                "⚠️ اطلاعات پیام برگشت داده نشد"
            );


            return;

        }


        console.log(
            "🔥 SAVED MESSAGE:",
            savedMessage
        );

        // -------------------------------------------------
// ثبت ID پیام ذخیره‌شده
// جلوگیری از نمایش دوباره توسط Polling
// -------------------------------------------------

if (savedMessage._id) {

    loadedMessageIds.add(
        savedMessage._id
    );

}

        // -------------------------------------------------
        // تغییر وضعیت پیام موقت
        // -------------------------------------------------

        if (temporaryMessage) {

            const status =
                temporaryMessage.querySelector(
                    ".message-status"
                );


            if (status) {

                status.innerText =
                    "✓";

                status.classList.remove(
                    "failed"
                );

            }


            // ---------------------------------------------
            // زمان واقعی MongoDB
            // ---------------------------------------------

            const time =
                temporaryMessage.querySelector(
                    ".message-time"
                );


            if (time) {

                time.innerText =
                    formatTime(
                        savedMessage.createdAt
                    );

            }

        }


        // -------------------------------------------------
        // پاک کردن input
        // -------------------------------------------------

        messageInput.value = "";
        selectedFileData = null;


if(fileInput){

    fileInput.value = "";

}


if(selectedFile){

    selectedFile.classList.remove(
        "show"
    );

}

        messageInput.focus();


        // -------------------------------------------------
        // آپدیت آخرین پیام چت
        // -------------------------------------------------

        const chat =
            chats.find(
                item =>
                    item._id === currentChat
            );


        if (chat) {

            chat.lastMessage =
                savedMessage.text;


            chat.updatedAt =
                savedMessage.createdAt;


            renderChats();


            // ---------------------------------------------
            // حفظ active
            // ---------------------------------------------

            const activeChat =
                document.querySelector(
                    `.chat-item[data-chat-id="${currentChat}"]`
                );


            if (activeChat) {

                activeChat.classList.add(
                    "active"
                );

            }

            

        }
// activeChat.dataset.chatId = currentChat;
    }


  
catch (error) {


        console.log(
            "🔥 SEND MESSAGE EXCEPTION:",
            error
        );


        // -------------------------------------------------
        // وضعیت خطا
        // -------------------------------------------------

        if (temporaryMessage) {

            const status =
                temporaryMessage.querySelector(
                    ".message-status"
                );


            if (status) {

                status.innerText =
                    "✕";

                status.classList.add(
                    "failed"
                );

            }

        }

    }

    finally {

        // -------------------------------------------------
        // فعال شدن دکمه
        // -------------------------------------------------

        if (sendBtn) {

            sendBtn.disabled = false;

        }

    }

}
// =====================================================
// SEND BUTTON
// دکمه ارسال
// =====================================================

if (sendBtn) {

    sendBtn.addEventListener(
        "click",
        function () {

            sendMessage();

        }
    );

}


// =====================================================
// ENTER KEY
// ارسال با Enter
// =====================================================

if (messageInput) {

    messageInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );

}
loadChats();

// =====================================================
// RENDER SERVER MESSAGE
// نمایش پیام دریافت‌شده از سرور
// =====================================================



function renderServerMessage(msg) {

    if (!msg) {

        return;

    }






    

    // -------------------------------------------------
    // ID پیام
    // -------------------------------------------------

    const messageId =
        msg._id;


    // -------------------------------------------------
    // جلوگیری از پیام تکراری
    // -------------------------------------------------

    if (
        messageId &&
        loadedMessageIds.has(messageId)
    ) {

        return;

    }


    // -------------------------------------------------
    // ثبت ID
    // -------------------------------------------------

    if (messageId) {

        loadedMessageIds.add(
            messageId
        );

    }


    // -------------------------------------------------
    // نوع پیام
    // -------------------------------------------------
// -------------------------------------------------
// نوع پیام
// -------------------------------------------------

const type =
    msg.sender === currentUser.phone
    ?
    "outgoing"
    :
    "incoming";



let senderType = "user";


if (msg.senderType) {

    senderType = msg.senderType;

}

console.log("SERVER MESSAGE:", msg);

addMessage(
    msg.text,
    type,
    msg.createdAt,
    null,
    msg.senderName || currentUser.fullname,
    senderType
);}


// =====================================================
// START MESSAGE POLLING
// =====================================================

function startMessagePolling(chatId) {

    // -------------------------------------------------
    // جلوگیری از چند Polling همزمان
    // -------------------------------------------------

    stopMessagePolling();


    console.log(
        "🟢 MESSAGE POLLING START:",
        chatId
    );


    messagePolling =
        setInterval(
            async function() {

                // -----------------------------------------
                // اگر کاربر چت را عوض کرده
                // -----------------------------------------

                if (
                    currentChat !== chatId
                ) {

                    return;

                }


                // -----------------------------------------
                // دریافت پیام‌ها
                // -----------------------------------------

                const result =
                    await api(
                        `/chat/messages/${chatId}`
                    );


                if (!result.ok) {

                    console.log(
                        "⚠️ POLLING ERROR:",
                        result.data
                    );

                    return;

                }


                const messages =

                    result.data &&
                    Array.isArray(
                        result.data.messages
                    )

                    ?

                    result.data.messages

                    :

                    [];


                // -----------------------------------------
                // بررسی پیام‌های جدید
                // -----------------------------------------

                messages.forEach(
                    msg => {

                        renderServerMessage(
                            msg
                        );

                    }
                );

            },

            2000
        );

}

// =====================================================
// STOP MESSAGE POLLING
// =====================================================

function stopMessagePolling() {

    if (messagePolling) {

        clearInterval(
            messagePolling
        );

        messagePolling = null;

        console.log(
            "🔴 MESSAGE POLLING STOP"
        );

    }

}

// =====================================================
// ATTACH FILE
// انتخاب فایل
// =====================================================

if (attachBtn && fileInput) {

    attachBtn.addEventListener(
        "click",
        function () {

            fileInput.click();

        }
    );


    fileInput.addEventListener(
        "change",
        function () {

            const file =
                fileInput.files[0];

            if (!file) {

                return;

            }


            console.log(
                "📎 FILE SELECTED:",
                file
            );


            console.log(
                "📎 FILE NAME:",
                file.name
            );


            console.log(
                "📎 FILE TYPE:",
                file.type
            );


            console.log(
                "📎 FILE SIZE:",
                file.size
            );

        }
    );

}

// =====================================================
// SELECTED FILE
// نمایش فایل انتخاب‌شده
// =====================================================

let selectedFileData = null;


// =====================================================
// FORMAT FILE SIZE
// =====================================================

function formatFileSize(bytes) {

    if (!bytes) {
        return "0 KB";
    }


    if (bytes < 1024 * 1024) {

        return (
            (bytes / 1024).toFixed(1)
            +
            " KB"
        );

    }


    return (
        (bytes / (1024 * 1024)).toFixed(1)
        +
        " MB"
    );

}


// =====================================================
// SHOW SELECTED FILE
// =====================================================

function showSelectedFile(file) {

    if (
        !file ||
        !selectedFile
    ) {

        return;

    }


    selectedFileData = file;


    // ---------------------------------------------
    // نام فایل
    // ---------------------------------------------

    if (selectedFileName) {

        selectedFileName.textContent =
            file.name;

    }


    // ---------------------------------------------
    // حجم فایل
    // ---------------------------------------------

    if (selectedFileSize) {

        selectedFileSize.textContent =
            formatFileSize(
                file.size
            );

    }


    // ---------------------------------------------
    // نمایش باکس
    // ---------------------------------------------

    selectedFile.classList.add(
        "show"
    );


    // ---------------------------------------------
    // Lucide
    // ---------------------------------------------

    if (
        typeof lucide !== "undefined"
    ) {

        lucide.createIcons();

    }

}


// =====================================================
// FILE INPUT
// =====================================================

if (fileInput) {

    fileInput.addEventListener(
        "change",
        function () {

            const file =
                fileInput.files[0];


            if (!file) {

                return;

            }


            console.log(
                "📎 SELECTED FILE:",
                file
            );


            showSelectedFile(
                file
            );

        }
    );

}


// =====================================================
// REMOVE SELECTED FILE
// =====================================================

if (removeFileBtn) {

    removeFileBtn.addEventListener(
        "click",
        function () {

            selectedFileData =
                null;


            if (fileInput) {

                fileInput.value =
                    "";

            }


            if (selectedFile) {

                selectedFile.classList.remove(
                    "show"
                );

            }

        }
    );

}
// =====================================================
// EMOJI PICKER
// =====================================================

if (emojiBtn && emojiPicker) {

    emojiBtn.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            emojiPicker.classList.toggle(
                "show"
            );

        }
    );


    emojiPicker.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "button"
                );


            if (!button) {

                return;

            }


            const emoji =
                button.textContent;


            if (!messageInput) {

                return;

            }


            // -----------------------------------------
            // قرار دادن ایموجی در محل کرسر
            // -----------------------------------------

            const start =
                messageInput.selectionStart;

            const end =
                messageInput.selectionEnd;


            const text =
                messageInput.value;


            messageInput.value =
                text.substring(
                    0,
                    start
                )
                +
                emoji
                +
                text.substring(
                    end
                );


            // -----------------------------------------
            // انتقال کرسر بعد از ایموجی
            // -----------------------------------------

            const cursorPosition =
                start + emoji.length;


            messageInput.focus();


            messageInput.setSelectionRange(
                cursorPosition,
                cursorPosition
            );


            // -----------------------------------------
            // بستن پنل
            // -----------------------------------------

            emojiPicker.classList.remove(
                "show"
            );

        }
    );

}


// =====================================================
// CLOSE EMOJI PICKER
// کلیک بیرون از پنل
// =====================================================

document.addEventListener(
    "click",
    function (event) {

        if (
            emojiPicker &&
            !emojiPicker.contains(event.target) &&
            event.target !== emojiBtn
        ) {

            emojiPicker.classList.remove(
                "show"
            );

        }

    }
);






















document.addEventListener("DOMContentLoaded",()=>{


    const mobileBackBtn =
        document.getElementById("mobileBackBtn");


    console.log(
        "BACK BUTTON:",
        mobileBackBtn
    );


    if(mobileBackBtn){


        mobileBackBtn.addEventListener(
            "click",
            ()=>{


                console.log(
                    "⬅️ BACK CLICKED"
                );


                const chatPanel =
                document.getElementById("chatPanel");


                const conversation =
                document.getElementById("conversation");



                chatPanel.classList.remove(
                    "mobile-hide"
                );


                conversation.classList.remove(
                    "mobile-show"
                );


            }
        );


    }


});






























const themeBtn = document.getElementById("themeBtn");


if(themeBtn){

    themeBtn.addEventListener(
        "click",
        ()=>{

        }
    );

}





window.addEventListener("load",()=>{


    const theme = localStorage.getItem("theme");



    if(theme === "chatgpt"){


        document.body.classList.add("chatgpt-theme");


    }


});


































function openMobileChat(){

    if(window.innerWidth <= 768){

        chatPanel.classList.add("mobile-hide");

        conversation.classList.add("mobile-show");

    }

}



function closeMobileChat(){

    chatPanel.classList.remove("mobile-hide");

    conversation.classList.remove("mobile-show");

}



if(mobileBackBtn){

    mobileBackBtn.addEventListener(
        "click",
        function(){

            console.log("⬅️ BACK CLICKED");

            closeMobileChat();

        }
    );

}
else{

    console.log("❌ mobileBackBtn پیدا نشد");

}






















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











