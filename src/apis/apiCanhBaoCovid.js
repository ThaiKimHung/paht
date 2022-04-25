import AppCodeConfig from "../../app/AppCodeConfig";
import { appConfig } from "../../app/Config";
import Utils from "../../app/Utils";


async function GetList_SOS_LyDoAll() {
    let res = await Utils.get_api('api/sos/GetList_SOS_LyDoAll', false, false, false);
    return res
}

async function GuiCanhBaoCovid(dataBoDy) {
    console.log("gia tri databody", dataBoDy)
    try {
        let response = await fetch(appConfig.domain + "api/sos/InsertSosApp", {
            method: 'post',
            headers: {
                // 'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Type': 1 // Khác SOS chỗ type này
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: dataBoDy,
        });
        response = await response.json();
        Utils.nlog("gia tri res GUIPA:", response);
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;

    }
}

async function GetListCanhBaoCovid(obj = {
    "sortOrder": "asc",
    "sortField": "CreatedDate",
    "pageNumber": "1",
    "pageSize": "10",
    "OrderBy": "CreatedDate",
    "page": "1",
    "keyword": "",
    "record": "10",
    "more": false,
    "filter.keys": "tungay|denngay|status|DevicesToken|Type",
    "filter.vals": "||1||1",
}) {
    let filter = ''
    for (const property in obj) {
        filter = filter + `&${property}=${obj[property]}`
    }
    Utils.nlog('[LOG] link canh bao covid', `api/sos/GetListSOSApp?${filter}`)
    const res = await Utils.get_api(`api/sos/GetListSOSApp?${filter}`, false, false, true)
    return res;
};

async function GetList_TinhTrangAll() {
    const res = await Utils.get_api('api/map-sos/GetList_TinhTrangAll', false, false, false, AppCodeConfig.APP_CONGDAN, 1)
    return res;
};

export {
    GetList_SOS_LyDoAll, GuiCanhBaoCovid, GetListCanhBaoCovid, GetList_TinhTrangAll
}
