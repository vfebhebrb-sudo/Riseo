// ======================================================
// AI TOOLS BRIDGE
// Gemini Live -> PDF System
// ======================================================


let activePDF = {

    fileId:null,

    source:null,

    pdfUrl:null,

    viewerUrl:null,

    sessionId:null

};





// ======================================================
// LOAD SAVED PDF
// ======================================================

function loadActivePDF(){


    try{


        const saved =
            localStorage.getItem(
                "activePDF"
            );


        if(saved){

            activePDF =
                JSON.parse(saved);


            console.log(
                "📂 RESTORED PDF:",
                activePDF
            );

        }


    }
    catch(error){

        console.error(
            "LOAD PDF ERROR:",
            error
        );

    }

}


loadActivePDF();





// ======================================================
// SAVE PDF
// ======================================================

function saveActivePDF(){


    localStorage.setItem(

        "activePDF",

        JSON.stringify(
            activePDF
        )

    );


}





// ======================================================
// TOOL EXECUTOR
// ======================================================


async function executeTool(

    name,

    args={},

    context={}

){


    console.log(
        "🛠️ TOOL:",
        name,
        args
    );



    switch(name){


        case "list_files":

            return await listFiles(args);



        case "open_pdf":

            return await openPdf(args);



case "ask_pdf":

    return await askPdf(
        args,
        context
    );


case "read_pdf":

    return await askPdf(
        args,
        context
    );


        default:

            return {

                success:false,

                error:
                "Unknown tool"

            };


    }


}






// ======================================================
// LIST FILES
// ======================================================


async function listFiles(args={}){


    try{


        const url =

        CONFIG.API +

        CONFIG.ENDPOINTS.FILES +

        "?source=" +

        (
            args.source ||
            "all"
        );



        console.log(
            "📡 FILE LIST:",
            url
        );



        const response =
            await fetch(url);



        const data =
            await response.json();



        return {


            success:true,


            files:

            data.files || data


        };


    }

    catch(error){


        console.error(
            "❌ FILE LIST ERROR:",
            error
        );


        return {

            success:false,

            error:error.message

        };


    }


}






// ======================================================
// OPEN PDF
// ======================================================


async function openPdf(args={}){


    try{


        if(!args.fileId){


            return {

                success:false,

                error:
                "fileId missing"

            };


        }




const fileResponse = await fetch(
    CONFIG.API +
    "/api/files"
);


const fileData =
await fileResponse.json();


const selectedFile =
fileData.files.find(
    f =>
    f.fileId === args.fileId ||
    f.id === args.fileId
);



if(!selectedFile){

    return {

        success:false,

        error:
        "PDF file not found"

    };

}

let pdfUrl;


if(args.source === "telegram"){

    pdfUrl =
    CONFIG.API +
    "/api/telegram-files/" +
    args.fileId +
    "/pdf";

}
else{

    pdfUrl =
    CONFIG.API +
    "/api/files/" +
    args.fileId +
    "/pdf";

}



        // const viewerUrl =


        // CONFIG.API +

        // CONFIG.ENDPOINTS.PDF_VIEWER +

        // "?file=" +

        // encodeURIComponent(
        //     pdfUrl
        // );

const viewerUrl = pdfUrl;

activePDF = {

    fileId:
    selectedFile.id,

    source:
    args.source || 
    "all",

    pdfUrl,

    viewerUrl,

    sessionId:

    (
        crypto.randomUUID ?

        crypto.randomUUID() :

        Date.now().toString()
    )

};



        saveActivePDF();





        console.log(

            "✅ ACTIVE PDF:",

            activePDF

        );





        window.currentPdfFileId =
            activePDF.fileId;



        window.currentPdfSessionId =
            activePDF.sessionId;






        window.open(

            viewerUrl,

            "_blank"

        );






        return {


            success:true,


            fileId:
            activePDF.fileId,


            sessionId:
            activePDF.sessionId,


            url:
            viewerUrl,


            message:
            "PDF opened successfully"


        };



    }

    catch(error){


        console.error(

            "❌ OPEN PDF ERROR:",

            error

        );


        return {

            success:false,

            error:error.message

        };


    }


}






// ======================================================
// ASK PDF
// ======================================================
// ======================================================
// ASK PDF
// ======================================================

async function askPdf(
    args = {},
    context = {}
){

    try{


        if(!activePDF.fileId){

            loadActivePDF();

        }



        if(
            !activePDF.sessionId
        ){

            return {

                success:false,

                error:
                "ابتدا یک PDF باز کنید."

            };

        }



        const payload = {


            sessionId:
            activePDF.sessionId,


            message:
            args.question


        };



        console.log(
            "📚 PDF CHAT REQUEST:",
            payload
        );




        const response =
        await fetch(

            CONFIG.API +
            "/api/ai/pdf/chat",

            {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json"

                },


                body:

                JSON.stringify(
                    payload
                )


            }

        );





        const data =
        await response.json();



        console.log(

            "📚 PDF CHAT RESPONSE:",

            data

        );




        if(
            !response.ok ||
            !data.success
        ){

            return {

                success:false,

                error:

                data.message ||
                data.error ||
                "خطای پردازش PDF"

            };

        }





        return {

            success:true,

            reply:
            data.reply

        };



    }

    catch(error){


        console.error(

            "❌ ASK PDF ERROR:",

            error

        );



        return {

            success:false,

            error:
            error.message

        };


    }


}




// ======================================================
// GET ACTIVE PDF
// ======================================================


function getActivePDF(){


    return activePDF;


}