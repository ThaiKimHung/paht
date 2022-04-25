import Utils from "../../app/Utils";
import { AppgetGlobal } from "../../app/data/dataGlobal";
import { nGlobalKeys } from "../../app/keys/globalKey";
import { nkey } from "../../app/keys/keyStore";
import { appConfig } from "../../app/Config";

const apiPA = 'api/phananhweb/'
const apiPAApp = 'api/phananhapp/'
const apiTBApp = 'api/thongbaoapp/';
const PREFIX = 'api/chuyenmuc/';

async function GetDetail_PhanAnh(IdPA) {
    var val = `${apiPA}GetDetail_PhanAnh?id=${IdPA}`
    let res = await Utils.get_api(val, false, false);
    return res;
}
//api/thongbaoapp/IsSeen
async function IsSeen(IdNotify = '') {
    var val = `${apiTBApp}IsSeen?IdNotifyDevice=${IdNotify}`
    let res = await Utils.post_api(val, {}, false, true);
    return res;
}
// api/thongbaoapp/XoaThongBao
async function XoaThongBao(IdNotify = []) {
    let strBody = JSON.stringify({
        "IdNotifyDevice": IdNotify,
    })
    Utils.nlog('strBody xoá thông báo -----', strBody);
    let res = await Utils.post_api(apiTBApp + 'XoaThongBao', strBody, false, true);
    return res;

}
//api/phananhapp/GetList_ThongBaoApp

async function GetList_ThongBaoApp(platform = '', nextPage = 1, size = 10, more = false) {
    //&query.page=${nextPage}&query.record=${size}
    // let url = `api/canhbao/GetListThongBao_All?query.page=${nextPage}&query.record=${size}&query.more=${more}`; // Tây Ninh
    let url = `${apiTBApp}DanhSachThongBao?query.page=${nextPage}&query.record=${size}&query.filter.keys=ThietBi&query.filter.vals=${platform}&query.sortField=SendDate&query.sortOrder=desc&query.more=${more}`;
    // Utils.nlog("gia tri Url", url)
    let res = await Utils.get_api(url, false, true);
    return res;
}
async function GetDanhSachPAFilter(more = false, nextPage = 1, size = 10, keys = '', vals = '', keyword = '', isCongDong = false) {
    let url = ''
    if (keys && vals) {
        let kq = 'MucDo' == keys ? true : false;
        if (kq == false && isCongDong) {
            keys = `${keys}|MucDo`;
            vals = `${vals}|1,2`;
        }

        var fillter = `&query.filter.keys=${keys}&query.filter.vals=${vals}&query.sortField=NgayGui&query.sortOrder=desc`;
    };

    if (more == true) {
        url = `${apiPA}DanhSachPAFilter?query.more=${more}`;
    } else {
        if (keyword) url = `${apiPA}DanhSachPAFilter?query.more=${more}&query.page=${nextPage}&query.record=${size}&query.filter.keys=keyword&query.filter.vals=${keyword}&query.sortField=NgayGui&query.sortOrder=desc`;
        else url = `${apiPA}DanhSachPAFilter?query.more=${more}&query.page=${nextPage}&query.record=${size}${fillter}`;
    };
    // Utils.nlog("gia tri url--------------------------------------", url)
    let res = await Utils.get_api(url, false, false);
    return res;
}

async function GetDanhSachPAFilterDaGui(nextPage = 1, size = 10, objectFilter) {
    const NoLogin = Utils.getGlobal(nGlobalKeys.sendOpinionNoLogin, false)
    const DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
    const token = await Utils.ngetStore(nkey.loginToken, '');

    let IdUser = Utils.getGlobal(nGlobalKeys.Id_user, 0);
    let fillter = `&query.filter.keys=NguoiGopY|${objectFilter.filterkey || ''}&query.filter.vals=${IdUser}|${objectFilter.filtervalue || ''}`
    if (NoLogin) {
        fillter = `&query.filter.keys=DevicesToken|NguoiGopY|${objectFilter.filterkey || ''}&query.filter.vals=${DevicesToken}|${IdUser}|${objectFilter.filtervalue || ''}`
    }
    let sort = '&query.sortField=NgayGui&query.sortOrder=desc';
    let url = `${apiPA}DanhSachPAFilter?&query.more=false&query.page=${nextPage}&query.record=${size}${fillter}${sort}`;

    Utils.nlog('url list da gui', url)
    let res = await Utils.get_api(url, false, NoLogin && token.length < 3 ? false : true);
    return res;
}

async function GetList_ChuyenMucApp(idLinhVuc = 0) {
    let fillter = `&query.filter.keys=LinhVuc&query.filter.vals=${idLinhVuc}`;
    var val = `${apiPAApp}GetList_ChuyenMucApp?more=true${fillter}`;
    let res = await Utils.get_api(val, false, false);
    return res;
}

//List_ChuyenMucAI

async function GetList_ChuyenMucAITheoLinhVuc(body) {

    let strBody = JSON.stringify(body)
    Utils.nlog("gia tri xu li UpdateCanhBao", strBody)
    let res = await Utils.post_api(apiPA + `List_ChuyenMucAI`, strBody, false, false);
    Utils.nlog("gia tri xu li UpdateCanhBao---------------------", res)
    return res;
};

async function GetList_ChuyenMucAppTN(params = '') {
    var val = `${apiPAApp}GetList_ChuyenMucApp?more=true&${params ? params : ''}`
    let res = await Utils.get_api(val, false, false);
    return res;
}
///phananhweb/GetList_LinhVuc 
// /phananhweb/GetList_LinhVuc 
async function GetList_LinhVucApp() {
    var val = `${apiPA}GetList_LinhVuc?more=true`
    let res = await Utils.get_api(val, false, false);
    return res;
}


async function GuiPhanAnhApp(NoiDung, TieuDe, LonLat, DiaDiem, LstImg, Notify = false, isPAKhan = false) {

    const {
        latitude,
        longitude
    } = LonLat;
    const IdUser = Utils.getGlobal(nGlobalKeys.Id_user, 0);
    const Email = Utils.getGlobal(nGlobalKeys.Email, "");
    const NumberPhone = Utils.getGlobal(nGlobalKeys.NumberPhone, "");
    let tempBody = {
        "NguoiGopY": IdUser,
        "NoiDung": NoiDung,
        "TieuDe": TieuDe,
        "NumberPhone": NumberPhone,
        "Email": Email,
        "ToaDoX": latitude,
        "ToaDoY": longitude,
        "Notify": Notify,
        "DiaDiem": DiaDiem,
        "MucDo": isPAKhan ? 3 : 0,
        "fileModel": {
            "LstImg": LstImg
        }
    };
    let strBody = JSON.stringify(tempBody);
    let url = `${apiPAApp}GuiPhanAnhApp`
    let res = await Utils.post_api(url, strBody, false, true);
    return res;
}


// http://192.168.2.88:8003/api/phananhapp/GetList_TrangThaiAll
async function GetList_TrangThaiAll() {
    var val = `${apiPAApp}GetList_TrangThaiAll`
    let res = await Utils.get_api(val, false, false);
    return res;
}

async function UpdatePhanAnhApp(IdPA, NoiDung, TieuDe, LonLat, DiaDiem, LstImg, Notify, IsDel, isPAKhan = false) {
    const {
        latitude,
        longitude
    } = LonLat;

    const IdUser = Utils.getGlobal(nGlobalKeys.Id_user, 0);
    const Email = Utils.getGlobal(nGlobalKeys.Email, "");
    const NumberPhone = Utils.getGlobal(nGlobalKeys.NumberPhone, "");

    let body = {
        "IdPA": IdPA,
        "NguoiGopY": IdUser,
        "NoiDung": NoiDung,
        "TieuDe": TieuDe,
        "NumberPhone": NumberPhone,
        "Email": Email,
        "ToaDoX": latitude,
        "ToaDoY": longitude,
        "Notify": Notify,
        "DiaDiem": DiaDiem,
        "MucDo": isPAKhan ? 3 : 0,
        "fileModel": {
            "LstImg": LstImg
        }
    }
    if (IsDel == true) {
        body = {
            ...body,
            "IsDel": 1,
        }
    }

    let strBody = JSON.stringify(body);
    // Utils.nlog('strBody', strBody);
    // var url = `${apiPAApp}UpdatePhanAnhApp`
    // let res = await Utils.post_api(url, strBody, false, false);
    // Utils.nlog('res', res);
    // return res;

    const NoLogin = Utils.getGlobal(nGlobalKeys.sendOpinionNoLogin, false)
    const DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
    var token = Utils.getGlobal(nGlobalKeys.loginToken, "");
    if ((token == '' || (token && token.length < 3)) && NoLogin == false) {
        return -2;
    } else {
        console.log("[LOG] BODY XOA PA", strBody)
        let header = {
            'Accept': 'application/json',
            token: token,
            'Content-Type': 'application/json',
        }
        if ((token == '' || (token && token.length < 3)) && NoLogin) {
            header = {
                'Accept': 'application/json',
                'DevicesToken': DevicesToken,
                'Content-Type': 'application/json',
            }
        }
        console.log(header)
        try {
            let response = await fetch(`${appConfig.domain}api/phananhapp/UpdatePhanAnhApp`, {
                method: 'post',
                headers: header,
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer',
                body: strBody
            });
            response = await response.json();
            Utils.nlog("[LOG] RES XOA PA", response);
            return response;

        } catch (error) {
            Utils.nlog("[LOG] RES ERR", error);
            return -1;
        }
    }
}

async function GetDanhSachPAFilterDaGuiAnSinh(nextPage = 1, size = 10, objectFilter) {
    let IdUser = Utils.getGlobal(nGlobalKeys.Id_user, 0);
    let fillter = `&query.filter.keys=NguoiGopY|${objectFilter.filterkey || ''}&query.filter.vals=${IdUser}|${objectFilter.filtervalue || ''}`
    let sort = '&query.sortField=NgayGui&query.sortOrder=desc';
    let url = `${apiPA}DanhSachPAFilter?&query.more=false&query.page=${nextPage}&query.record=${size}${fillter}${sort}`;

    Utils.nlog('url list da gui', url)
    let res = await Utils.get_api(url, false, true);
    return res;
}

async function GetDanhSachTuiAnSinh(nextPage = 1, size = 10, keys = '', vals = '', keyword = '', more = false,) {
    let url = ''
    if (keys && vals) {
        var fillter = `&query.filter.keys=${keys}|ChuyenMuc&query.filter.vals=${vals}|42&query.sortField=NgayGui&query.sortOrder=desc`;
    };
    if (more == true) {
        url = `${apiPA}DanhSachPAFilter?query.more=${more}&query.filter.keys=TypeReference|ChuyenMuc&query.filter.vals=102|42`;
    } else {
        if (keyword) url = `${apiPA}DanhSachPAFilter?query.more=${more}&query.page=${nextPage}&query.record=${size}&query.filter.keys=keyword|TypeReference|ChuyenMuc&query.filter.vals=${keyword}|102|42&query.sortField=NgayGui&query.sortOrder=desc`;
        else url = `${apiPA}DanhSachPAFilter?query.more=${more}&query.page=${nextPage}&query.record=${size}${fillter}`;
    };
    // Utils.nlog("gia tri url--------------------------------------", url)
    let res = await Utils.get_api(url, false, false);
    return res;
}

async function GetDanhSachPAFilterDaGuiTuVanF0(nextPage = 1, size = 10, objectFilter) {
    let IdUser = Utils.getGlobal(nGlobalKeys.Id_user, 0);
    let fillter = `&query.filter.keys=NguoiGopY|${objectFilter.filterkey || ''}&query.filter.vals=${IdUser}|${objectFilter.filtervalue || ''}`
    let sort = '&query.sortField=NgayGui&query.sortOrder=desc';
    let url = `${apiPA}DanhSachPAFilter?&query.more=false&query.page=${nextPage}&query.record=${size}${fillter}${sort}`;

    Utils.nlog('url list da gui', url)
    let res = await Utils.get_api(url, false, true);
    return res;
}

async function GetDanhSachTuVanF0(nextPage = 1, size = 10, keys = '', vals = '', keyword = '', more = false,) {
    let url = ''
    if (keys && vals) {
        var fillter = `&query.filter.keys=${keys}|ChuyenMuc&query.filter.vals=${vals}|41&query.sortField=NgayGui&query.sortOrder=desc`;
    };
    if (more == true) {
        url = `${apiPA}DanhSachPAFilter?query.more=${more}&query.filter.keys=TypeReference|ChuyenMuc&query.filter.vals=103|41`;
    } else {
        if (keyword) url = `${apiPA}DanhSachPAFilter?query.more=${more}&query.page=${nextPage}&query.record=${size}&query.filter.keys=keyword|TypeReference|ChuyenMuc&query.filter.vals=${keyword}|103|41&query.sortField=NgayGui&query.sortOrder=desc`;
        else url = `${apiPA}DanhSachPAFilter?query.more=${more}&query.page=${nextPage}&query.record=${size}${fillter}`;
    };
    // Utils.nlog("gia tri url--------------------------------------", url)
    let res = await Utils.get_api(url, false, false);
    return res;
}
//api/chuyenmuc/GetChuyenMuc_NguyCo
async function GetChuyenMuc_NguyCo() {
    var val = `${PREFIX}GetChuyenMuc_NguyCo`
    Utils.nlog("gia tri val GetChuyenMuc_NguyCo", val)
    let res = await Utils.get_api(val, false, true)
    return res;
}

//api/dk-nhan-ho-tro/List_HuyenThiXaThanhPho
async function List_HuyenThiXaThanhPho() {
    var val = `api/dk-nhan-ho-tro/List_HuyenThiXaThanhPho`
    Utils.nlog("[LOG] res url: ", val)
    let res = await Utils.get_api(val, false, false);
    return res;
}

//api/dk-nhan-ho-tro/GetDonVi_Id?id=703
async function GetDonVi_Id(IdDonVi = '') {
    var val = `api/dk-nhan-ho-tro/GetDonVi_Id?id=${IdDonVi}`
    Utils.nlog("[LOG] res url: ", val)
    let res = await Utils.get_api(val, false, false);
    return res;
}

// api/phananhweb/GetPALinhVucQuanTam
async function GetPALinhVucQuanTam() {
    var val = `api/phananhweb/GetPALinhVucQuanTam`
    let res = await Utils.get_api(val, false, true);
    return res;
}

//api/donvi/GetList_DonVi?query.more=true
async function GetList_DonVi() {
    const url = `api/donvi/GetList_DonVi?query.more=true`
    let res = await Utils.get_api(url, false, false)
    return res
}

// api/phananhweb/GetListChuyenMucLinhVuc
async function GetListChuyenMucLinhVuc(IdLinhVuc) {
    const url = `api/phananhweb/GetListChuyenMucLinhVuc?IdLinhVuc=${IdLinhVuc}`
    let res = await Utils.get_api(url, false, false)
    return res
}

export {
    GetDetail_PhanAnh, GuiPhanAnhApp, GetList_ChuyenMucApp, UpdatePhanAnhApp, GetList_ChuyenMucAppTN,
    GetList_TrangThaiAll, GetDanhSachPAFilter,
    GetDanhSachPAFilterDaGui, GetList_ThongBaoApp, IsSeen, XoaThongBao, GetList_LinhVucApp,
    GetList_ChuyenMucAITheoLinhVuc, GetDanhSachPAFilterDaGuiAnSinh, GetDanhSachTuiAnSinh, GetChuyenMuc_NguyCo,
    GetDanhSachTuVanF0, GetDanhSachPAFilterDaGuiTuVanF0, List_HuyenThiXaThanhPho, GetDonVi_Id, GetPALinhVucQuanTam,
    GetList_DonVi, GetListChuyenMucLinhVuc
}
