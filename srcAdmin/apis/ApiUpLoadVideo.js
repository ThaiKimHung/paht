import { appConfig } from "../../app/Config";
import Utils from "../../app/Utils";
import { nGlobalKeys } from "../../app/keys/globalKey";
import AppCodeConfig from "../../app/AppCodeConfig";



async function Uploadvideo(arrVideo, IdPA, IdLichSu, StatusPA) {
    let dataBoDy = new FormData();
    var token = Utils.getGlobal(nGlobalKeys.loginToken, "", AppCodeConfig.APP_ADMIN);
    for (let index = 0; index < arrVideo.length; index++) {
        const element = arrVideo[index];
        var arrtemp = element.uri.split('.');
        let temp = arrtemp[arrtemp.length - 1].toLowerCase();
        dataBoDy.append("File",
            {
                name: "video" + index + "." + "mp4",
                type: "video/" + "mp4",
                uri: element.uri
            })
    }
    Utils.nlog("gia tri data body form", dataBoDy);
    dataBoDy.append("IdPA", IdPA);
    dataBoDy.append("IdLichSu", IdLichSu);
    dataBoDy.append("StatusPA", StatusPA);
    // api/uploadapp/MediaUploadXuLy IdLichSu StatusPA
    try {
        let response = await fetch(appConfig.domain + "api/uploadapp/MediaUploadXuLy?IdPA=" + IdPA + "&IdLichSu=" + IdLichSu + "&StatusPA=" + StatusPA, {
            method: 'post',
            headers: {
                // 'Content-Type': 'application/json',
                // 'Accept': 'application/json',
                token: token
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: dataBoDy
        });
        Utils.nlog("gia tri res -xxxx response", response);
        if (response && response.ok == true) {
            return {
                status: 1
            }
        } else {
            return {
                status: 0
            }
        }


    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;

    }

}
async function UploadFileCanhBao(arrVideo, IdCB) {
    let dataBoDy = new FormData();
    var token = Utils.getGlobal(nGlobalKeys.loginToken, "", AppCodeConfig.APP_ADMIN);
    for (let index = 0; index < arrVideo.length; index++) {
        const element = arrVideo[index];
        Utils.nlog("gia tri element", element)
        dataBoDy.append("File",
            {
                name: "file" + index + "." + "mp4",
                type: "video/" + "mp4",
                uri: element.uri
            })
    }
    Utils.nlog("gia tri data body form", dataBoDy);
    dataBoDy.append("IdCB", IdCB);
    try {
        let response = await fetch(appConfig.domain + `api/uploadapp/MediaUploadCanhBao?IdCB=${IdCB}`, {
            method: 'post',
            headers: {
                // 'Content-Type': 'application/json',
                // 'Accept': 'application/json',
                token: token,
                'Accept': 'application/json',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: dataBoDy
        });
        Utils.nlog("gia tri res -xxxx response", response);

        if (response && response.ok == true) {
            return {
                status: 1
            }
        } else {
            return {
                status: 0
            }
        }
    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;

    }
    // var val = 'api/congfigapp/GetConfig?idapp=2'
    // let res = await Utils.get_api(val, false, false);
    // return res;
}
export {
    Uploadvideo, UploadFileCanhBao
}
