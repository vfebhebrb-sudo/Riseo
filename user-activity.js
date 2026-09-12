const authToken =
    localStorage.getItem("authToken");

let heartbeatInterval = null;


// ======================================================
// SEND HEARTBEAT
// ======================================================

async function sendHeartbeat() {

    if (!authToken) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/auth/heartbeat`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${authToken}`
                    }
                }
            );


        if (!response.ok) {

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

    catch (error) {

        console.warn(
            "Heartbeat error:",
            error
        );

    }

}


// ======================================================
// START HEARTBEAT
// ======================================================

function startHeartbeat() {

    if (!authToken) {
        return;
    }


    sendHeartbeat();


    heartbeatInterval =
        setInterval(
            sendHeartbeat,
            30 * 1000
        );

}


// ======================================================
// STOP HEARTBEAT
// ======================================================

function stopHeartbeat() {

    if (heartbeatInterval) {

        clearInterval(
            heartbeatInterval
        );

        heartbeatInterval = null;

    }

}


// ======================================================
// LOGOUT
// ======================================================

async function logoutUser() {

    if (!authToken) {
        return;
    }


    try {

        await fetch(
            `${API_URL}/auth/logout`,
            {
                method: "POST",

                headers: {
                    "Authorization":
                        `Bearer ${authToken}`
                }
            }
        );

    }

    catch (error) {

        console.warn(
            "Logout request failed:",
            error
        );

    }


    // توقف Heartbeat
    stopHeartbeat();


    // پاک کردن اطلاعات ورود
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