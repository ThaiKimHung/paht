import { appConfig } from "../../app/Config";
import Utils from "../../app/Utils";
import { nGlobalKeys } from "../../app/keys/globalKey";

async function GuiPA_FormData(dataBoDy) {
    const NoLogin = Utils.getGlobal(nGlobalKeys.sendOpinionNoLogin, false)
    var token = Utils.getGlobal(nGlobalKeys.loginToken, "");
    if ((token == '' || (token && token.length < 3)) && NoLogin == false) {
        return -2;
    } else {
        console.log("gia tri databody", dataBoDy)
        let header = {
            'Accept': 'application/json',
            token: token
        }
        if ((token == '' || (token && token.length < 3)) && NoLogin) {
            header = {
                'Accept': 'application/json',
            }
        }
        try {
            let response = await fetch(appConfig.domain + `api${Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC)}` + "/uploadapp/GuiPAFormData", {
                method: 'post',
                headers: header,
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

async function EditPA_FormData(dataBoDy) {  // Hàm Update - Xoá Phản ánh. Hiện tại chức năng Update PA IOC chưa đồng bộ dc. Dung xử lý sau!
    const NoLogin = Utils.getGlobal(nGlobalKeys.sendOpinionNoLogin, false)
    const DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
    var token = Utils.getGlobal(nGlobalKeys.loginToken, "");
    if ((token == '' || (token && token.length < 3)) && NoLogin == false) {
        return -2;
    } else {
        console.log("gia tri res SUAPA:", dataBoDy)
        let header = {
            'Accept': 'application/json',
            token: token
        }
        if ((token == '' || (token && token.length < 3)) && NoLogin) {
            header = {
                'Accept': 'application/json',
                'DevicesToken': DevicesToken
            }
        }
        console.log(header)
        console.log(appConfig.domain + "api" + Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC) + "/phananhapp/UpdateFormPhanAnhApp")
        try {
            let response = await fetch(appConfig.domain + "api" + Utils.getGlobal(nGlobalKeys.RootThaiNguyen, appConfig.rootIOC) + "/phananhapp/UpdateFormPhanAnhApp", {
                method: 'post',
                headers: header,
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer',
                body: dataBoDy
            });
            response = await response.json();
            Utils.nlog("gia tri res -xxxx response", response);
            return response;

        } catch (error) {
            Utils.nlog("gia tri eror", error);
            return -1;

        }
    }

}

async function GuiSOS(dataBoDy) {
    console.log("gia tri databody", dataBoDy)
    try {
        let response = await fetch(appConfig.domain + "api/sos/InsertSosApp", {
            method: 'post',
            headers: {
                // 'Content-Type': 'application/json',
                'Accept': 'application/json',
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
// funtions gửi góp ý về IOC
async function GuiGopYIOC(dataBoDy) {
    console.log("gia tri databody-----IOC", dataBoDy)
    try {
        let response = await fetch(appConfig.domain + "api/feedback/InsertFeedbackApp", {
            method: 'post',
            headers: {
                // 'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: dataBoDy
        });
        response = await response.json();
        Utils.nlog("gia tri res GUIPA------IOC:", response);
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;

    }
}
export {
    GuiPA_FormData, EditPA_FormData, GuiSOS, GuiGopYIOC
}
