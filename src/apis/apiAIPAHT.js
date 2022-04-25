import Utils from "../../app/Utils";
import { appConfig } from "../../app/Config";
import { Platform } from "react-native";

async function sendFrame(session, frameBase64 = '', IdNV = 0, type = 'register') {
    // let strBody = {
    //     "session": session,
    //     "frame": frameBase64,
    //     "employee_id": IdNV,
    //     "f_type": type
    // };
    // strBody = JSON.stringify(strBody);
    // let res = await Utils.post_api_domain(appConfig.domainAIFace, 'rest/post/', strBody, false, appConfig.tokenAIFace);
    // return res;
}

async function delRegisFace(IdNV, IdCty = 0) {
    let res = await Utils.post_api_AI(appConfig.domainAIPAHT, 'rest/delete/?company_id=' + IdCty + '&employee_id=' + IdNV, '', false, appConfig.tokenAIFace);
    Utils.nlog('UUUU', res)
    return res;
}

async function getFaceRegister(IdNV, IdCty = 0) {
    let res = await Utils.post_api_AI(appConfig.domainAIPAHT, 'rest/get/?company_id=' + IdCty + '&employee_id=' + IdNV, '', false, appConfig.tokenAIFace);
    return res;
}

async function sendFrameForm(session, dataImg, IdNV = 0, IdCty = 0, type = 'register') {
    try {
        // const { uri, codec = "jpg" } = dataImg;
        let dataBody = new FormData();
        // if (uri != undefined) {
        //     dataBody.append("frame", {
        //         name: "img" + IdNV + '_' + Date.now() + '.' + codec,
        //         type: 'image/' + codec,
        //         uri
        //     });
        // }
        dataBody.append("frame", dataImg == "" ? "no_img" : dataImg);
        dataBody.append("is_base64", "1");
        dataBody.append("session", session);
        dataBody.append("employee_id", IdNV.toString());
        dataBody.append("company_id", IdCty.toString());
        dataBody.append("f_type", type);
        dataBody.append("device", Platform.OS); // ios - android
        let response = await fetch(appConfig.domainAIPAHT + 'rest/form/', {
            method: "post",
            headers: {
                token: appConfig.tokenAIFace,
                'Content-Type': 'multipart/form-data'
            },
            body: dataBody
        });

        const res = await response.json();
        // const res = response;
        return res;
    } catch (e) {
        Utils.nlog('error-saveFaceOK:', e);
        return -1;
    }
}





export default { sendFrame, sendFrameForm, delRegisFace, getFaceRegister }