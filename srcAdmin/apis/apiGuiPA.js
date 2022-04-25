import Utils from "../../app/Utils";
import { nGlobalKeys } from "../../app/keys/globalKey";
import AppCodeConfig from "../../app/AppCodeConfig";
import { appConfig } from "../../app/Config";

async function GuiPA_FormData(dataBoDy) {
    var token = Utils.getGlobal(nGlobalKeys.loginToken, "", AppCodeConfig.APP_ADMIN);
    // Utils.nlog("<>><><>", appConfig.domain + "api/longan/uploadapp/GuiPAFormData")

    if (token == '' || (token && token.length < 3)) {
        return -2;
    } else {
        console.log("gia tri databody", dataBoDy)
        try {
            let response = await fetch(appConfig.domain + `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC, AppCodeConfig.APP_ADMIN)}/uploadapp/GuiPAFormDataAdmin`, {
                method: 'post',
                headers: {
                    // 'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    token: token
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer',
                body: dataBoDy
            });
            response = await response.json();
            Utils.nlog("gia tri res GUIPA:", response);
            return response;

        } catch (error) {
            Utils.nlog("gia tri eror", error);
            return -1;

        }
    }
}

//API EditPA_FormData ko dùng => BỎ 

// https://ca-long-an-admin-api.vts-paht.com/api/xulyphananh/CheckInfoAccount?username=0784567373
async function CheckInfoAccount(username = '') {
    let vals = `api/xulyphananh/CheckInfoAccount?username=${username}`
    console.log(vals)
    let res = await Utils.get_api(vals, false, false)
    return res
}
export {
    GuiPA_FormData, CheckInfoAccount
}
