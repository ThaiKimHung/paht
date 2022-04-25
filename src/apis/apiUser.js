import Utils from "../../app/Utils";
import moment from 'moment'
import { nGlobalKeys } from "../../app/keys/globalKey";
import { appConfig } from "../../app/Config";
import AppCodeConfig from "../../app/AppCodeConfig";
import { AppgetGlobal } from "../../app/data/dataGlobal";
import { GetSetMaScreen } from "../../srcRedux/actions/auth/Auth";
import { nkey } from "../../app/keys/keyStore";


const apiUser = 'api/account/'
const apiChangePass = 'api/password/'
const accApp = 'api/accapp/'

const ApiConfig = "api/congfigapp/"

// /api/congfigapp/Get_AnhNen?IdApp=1
async function Get_AnhNen(token = '') {
    var val = `${ApiConfig}Get_AnhNen?IdApp=2`
    let res = await Utils.get_api(val, false, false);
    return res;
}
//TaoTaiKhoanCongDan
async function TaoTaiKhoan(body) {
    let strBody = JSON.stringify(body)
    Utils.nlog("gia tri body dk tai khoan", strBody)
    let res = await Utils.post_api(`api${Utils.getGlobal(nGlobalKeys.formRegister, appConfig.rootIOC)}/account/` + 'TaoTaiKhoanCongDan', strBody, false, false, false);
    return res;
}
async function LoginGYPA(Username, Password) {
    let strBody = JSON.stringify({
        "UserName": Username,
        "Password": Password
    })

    let res = await Utils.post_api(`api${Utils.getGlobal(nGlobalKeys.formRegister, appConfig.rootIOC)}/account/` + 'Login', strBody, false, false);
    return res;
}
//api/accapp/RequestOTPApp
async function RequestOTPApp(Username = '', NumberPhone = '', Hash = '', isKichHoat = false) {
    let valTimeLimit = Utils.getGlobal(nGlobalKeys.timeRequestOTP, 0);
    let valTimeNow = Utils.getGlobal(nGlobalKeys.timeSendOTP, -1);
    let timeDiff = Utils.datesDiff(Date.now(), valTimeNow, true);

    if (valTimeNow > 0 && timeDiff <= valTimeLimit) {
        return res = { status: 0, error: { message: `Bạn không được gửi OTP liên tục.\nVui lòng thử lại sau  ${Utils.timeCountFormat(valTimeLimit - timeDiff, "@mm phút @ss giây")} nữa.` } };
    }
    let strBody = JSON.stringify({
        "UserName": Username,
        "NumberPhone": NumberPhone,
        "Hash": Hash,
        "isKichHoat": isKichHoat
        // "OTP": "sample string 3",
        // "IdAccount": 4
    })

    console.log('body', strBody)
    let res = await Utils.post_api(accApp + 'RequestOTPApp', strBody, false, false);
    if (!(res < 0) && res && res.status == 1) {
        Utils.setGlobal(nGlobalKeys.timeSendOTP, Date.now());
    }
    return res;
}
//doi mat khau
//api/accapp/DoiMatKhauApp
async function DoiMatKhauApp(Username = '', RePass = '', OTP = '', IdRequest = 1, IdAcc = 1) {
    let strBody = JSON.stringify({
        "NewPass": Username,
        "RePass": RePass,
        "OTP": OTP,
        "IdRequest": IdRequest,
        "IdAcc": IdAcc
    })
    // Utils.nlog('gia tri body dổi mk', strBody)
    let res = await Utils.post_api(accApp + 'DoiMatKhauApp', strBody, false, false);
    return res;
}
async function LogoutGYPA(logintoken, isDVC) {
    let MaScreen = '';
    if (isDVC) {
        await GetSetMaScreen(false, appConfig.manHinhHoSo, false);
        await GetSetMaScreen(false, appConfig.manHinhHKG, false);
        MaScreen += appConfig.manHinhHKG;
        MaScreen += ("," + appConfig.manHinhHoSo);
    } else {
        await GetSetMaScreen(false, appConfig.manhinhCongDan, false);
        await GetSetMaScreen(false, appConfig.manHinhHoSo, false);
        await GetSetMaScreen(false, appConfig.manHinhHKG, false);
        MaScreen += appConfig.manhinhCongDan;
        MaScreen += ("," + appConfig.manHinhHKG);
        MaScreen += ("," + appConfig.manHinhHoSo);
    }
    let tokenViettelID = await Utils.ngetStore(nkey.accessTokenViettelID, "");


    let strBody = {
        "TokenDevice": logintoken,
        // "MaScreen": MaScreen
    };
    if (tokenViettelID != "")
        strBody["TokenViettelID"] = tokenViettelID;
    strBody = JSON.stringify(strBody);

    Utils.nlog("[logout]", strBody);
    let res = await Utils.post_api(`api${Utils.getGlobal(nGlobalKeys.formRegister, appConfig.rootIOC)}/account/` + 'LogOut', strBody, false, false);
    Utils.nlog("[logout CD res]", res)
    return res;
}
async function GetInFoUser(IdUser) {
    let val = `api${Utils.getGlobal(nGlobalKeys.formRegister, appConfig.rootIOC)}/account/InfoAccount?IdUser=${IdUser}`
    let res = await Utils.get_api(val, false, true, AppCodeConfig.APP_CONGDAN);
    return res;
}
//check token /api/accapp/CheckSession?Token=
async function CheckSession(token = '') {
    let val = `${accApp}CheckSession?Token=${token}`
    let res = await Utils.get_api(val, false, true);
    return res;
}
async function XacThucDangKyTK(IdUser = '', Opt = '') {
    let val = `XacThucDangKyTK?IdUser=${IdUser}&otp=${Opt}`
    let res = await Utils.post_api(`api${Utils.getGlobal(nGlobalKeys.formRegister, appConfig.rootIOC)}/account/` + val, {}, false, false);
    return res;
}
//XacThucDangKyTK

async function ChangePasswordJeeHR(Id = '', OldPassword = '', NewPassword = '', RePassword = '') {
    let strBody = JSON.stringify({
        "Id": Id,
        "OldPassword": OldPassword,
        "NewPassword": NewPassword,
        "RePassword": RePassword,
        "Logout": true
    })
    let res = await Utils.post_api(apiChangePass + 'ChangePassword', strBody, false, true);
    return res;
}

//cap nhat thong tin tai khoan "OldPassword": "sample string 5",
// api / account / CapNhatTTCongDan
// api / account / CapNhatTTCongDan
async function CapNhatTTCongDan(item = {}, itemPass = {}) {
    let strBody = {
        "UserID": item.UserID,
        "UserName": item.Username,
        "FullName": item.FullName,
        "Password": itemPass.Password,
        "RePassword": itemPass.RePassword,
        "Email": item.Email,
        "CMND": item.CMND,
        "PhoneNumber": item.PhoneNumber,
        "Status": item.Status,
        "IsDel": false,
        "GioiTinh": item.GioiTinh,
        "DiaChi": item.DiaChi,
        "CreatedDate": item.CreatedDate,
        "Avata": item.Avata,
        "NgaySinh": item.NgaySinh,
        "FileUploadAvata": {
            "strBase64": item.strBase64,
            "filename": "Image_avatar" + moment(new Date()).format('DD_MM_YYYY_HH_mm') + ".png"
        },
        "DanToc": item.DanToc ? item.DanToc : '',
        "NgayCap": item.NgayCap,
        "NoiCap": item.NoiCap,
        "QuocTich": item.QuocTich ? item.QuocTich : '',
        "TonGiao": item.TonGiao ? item.TonGiao : '',
        "ChangePass": itemPass?.Password ? true : false,
        "SendData": 16,
        "CachLy": item?.CachLy ? item.CachLy : {},
        "QRCode": item.QRCode ? item.QRCode : ''
    }
    if (item?.AnhCMND && item?.AnhCMND.length > 0) {
        strBody = {
            ...strBody,
            "AnhCMND": item?.AnhCMND ? item.AnhCMND : []
        }
    }
    if (item?.GiayThongHanh && item.GiayThongHanh) {
        strBody = {
            ...strBody,
            "GiayThongHanh": item?.GiayThongHanh ? item.GiayThongHanh : ''
        }
    }
    let res = await Utils.post_api(`api${Utils.getGlobal(nGlobalKeys.formRegister, appConfig.rootIOC)}/account/` + 'CapNhatTTCongDan', JSON.stringify(strBody), false, true, false);
    Utils.nlog('==> gia tri res', res)
    return res;
}
//api/accapp/CDChangePass
async function CDChangePass(item = {}) {
    let strBody = JSON.stringify({

        "UserID": 1,
        "UserName": "sample string 2",
        "FullName": "sample string 3",
        "Password": item.Password,
        "OldPassword": item.OldPassword,
        "RePassword": item.RePassword,
        "Email": "sample string 7",
        "PhoneNumber": "sample string 8",
        "Status": 9,
        "IsDel": true,
        "GioiTinh": 11,
        "DiaChi": "sample string 12",
        "CreatedDate": "sample string 13",
        "Avata": "sample string 14",
        "NgaySinh": "sample string 15",
        "FileUploadAvata": {
            "strBase64": "sample string 1"
        },
        "ChangePass": true,
        "SendData": 17

    })
    // Utils.nlog("gia tri body cạp nhật thông tin  tai khoan", strBody)
    let res = await Utils.post_api(accApp + 'CDChangePass', strBody, false, true);
    return res;
}

async function RegisDeviceToken(on_off = true, DevicesInfo = '', DevicesToken = '', IdPA = 0, IdHuyen = '', IdUser = '', SDT = '', new_token = '', CMND = '') {
    let MaScreen = await GetSetMaScreen(true)
    let strBody = JSON.stringify({
        "DevicesInfo": DevicesInfo,
        "DevicesToken": DevicesToken,
        "IdPA": IdPA,
        "IdHuyen": IdHuyen,
        "IdUser": IdUser,
        "SDT": SDT,
        "new_token": new_token,
        "on_off": on_off,
        "IsDan": true,
        "CMND": CMND,
        MaScreen: MaScreen,
    })


    let res = await Utils.post_api(accApp + 'RegisDeviceToken', strBody, false, false);
    Utils.nlog('[body-Noti-CD------------]', strBody, res)
    return res;
}
//api/dvc/LoginSSO
async function LoginSSO(token) {
    var keySSO = Utils.getGlobal(nGlobalKeys.SecretKeySSO, "");
    if (token == '' || (token && token.length < 3)) {
        return -2;
    } else {
        try {
            var details = {
                "key": keySSO,
                "code": token
            };

            var formBody = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

            Utils.nlog('body', formBody)
            let response = await fetch(appConfig.domain + "api/dvc/LoginSSO", {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Token': "rpNuGJebgtBEp0eQL1xKnqQG"
                },
                redirect: 'follow',
                body: formBody
            });
            response = await response.json();
            Utils.nlog("gia tri res sso:", response);
            return response;

        } catch (error) {
            Utils.nlog("gia tri eror SSO", error);
            return -1;

        }
    }
}
async function LogiFB(UserName = '', Password = '', Avata = '', IdAccountTickets = '') {
    let strBody = JSON.stringify({
        "UserName": UserName,
        "Password": Password,
        "Avata": Avata,
        "IdAccountTickets": IdAccountTickets,
    })
    let res = await Utils.post_api(apiUser + 'LoginFaceBook', strBody, false, false); // api này ko để root thaingyen vào. Dung đã mô tả
    return res;
}

async function GetListSOSApp(obj = {
    "sortOrder": "asc",
    "sortField": "CreatedDate",
    "pageNumber": "1",
    "pageSize": "10",
    "OrderBy": "CreatedDate",
    "page": "1",
    "keyword": "",
    "record": "10",
    "more": false,
    "filter.keys": "tungay|denngay|status|DevicesToken",
    "filter.vals": "||1|",
}) {
    let filter = ''
    for (const property in obj) {
        filter = filter + `&${property}=${obj[property]}`
    }
    Utils.nlog(`api/sos/GetListSOSApp?${filter}`)
    const res = await Utils.get_api(`api/sos/GetListSOSApp?${filter}`, false, false, true)
    return res;
};


async function GetListIOCApp(obj = {
    "sortOrder": "asc",
    "sortField": "HoTen",
    "pageNumber": "1",
    "pageSize": "10",
    "OrderBy": "HoTen",
    "page": "1",
    "keyword": "",
    "record": "10",
    "more": false,
    // "filter.keys": "tungay|denngay|DevicesToKen",
    // "filter.vals": "||",
    // "DevicesToken": ""
}) {
    let filter = ''
    for (const property in obj) {
        filter = filter + `&${property}=${obj[property]}`
    }
    Utils.nlog(`api/feedback/GetListFeedBackApp?${filter}`)
    const res = await Utils.get_api(`api/feedback/GetListFeedBackApp?${filter}`, false, false, true)
    return res;
};

//api/feedback/LoaiFeedBack
async function LoaiFeedBack() {
    let res = await Utils.get_api(`api/feedback/LoaiFeedBack`, false, false, false)
    return res;
}

async function Info_FeedBack_APP(Id = '') {
    let DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
    const res = await Utils.get_api(`api/feedback/Info_FeedBack_APP?Id=${Id}&DevicesToken=${DevicesToken}`, false, false, true)
    return res;
};

async function ScanQRLogin(ScanQRData = '', DevicesToken = '') {
    let strBody = JSON.stringify({
        "ScanQRData": ScanQRData,
        "DevicesToken": DevicesToken,
    })
    // api này TAM thời ko để root thaingyen vào. Dùng cho bên CALongAn, đã hỏi Dung
    let res = await Utils.post_api(apiUser + 'ScanQRLogin', strBody, false, false);
    Utils.nlog('[LOGIN_OTP_1]:', strBody, res)
    return res;
}

async function CreateOTPScanQRLogin(UserID = '', PhoneNumber = '', Hash = '') {
    let strBody = JSON.stringify({
        "UserID": UserID,
        "PhoneNumber": PhoneNumber,
        "Hash": Hash
    })
    console.log('body', strBody)
    // api này TAM thời ko để root thaingyen vào. Dùng cho bên CALongAn, đã hỏi Dung
    let res = await Utils.post_api(apiUser + 'CreateOTPScanQRLogin', strBody, false, false);
    Utils.nlog('[LOGIN_OTP]_2:', strBody, res)
    return res;
}

async function XacThucScanQRLogin(UserID = '', DevicesToken = '', OTP) {
    let strBody = JSON.stringify({
        "UserID": UserID,
        "DevicesToken": DevicesToken,
        "OTP": OTP
    })
    // api này TAM thời ko để root thaingyen vào. Dùng cho bên CALongAn, đã hỏi Dung
    let res = await Utils.post_api(apiUser + 'XacThucScanQRLogin', strBody, false, false);
    Utils.nlog('[LOGIN_OTP_3]:', strBody, res)
    return res;
}
// https://tay-ninh-admin-api.vts-paht.com/api/xac-thuc-tnh/DS_DonVi
async function DS_DonViTNH(UserID = '', DevicesToken = '', OTP) {
    const res = await Utils.get_api(`api/xac-thuc-tnh/DS_DonVi`, false, false, true)
    return res;
}
// https://localhost:44345/api/xac-thuc-tnh/DangKy_Smart
async function DangKy_Smart(body) {
    let strBody = JSON.stringify({
        ...body
    })
    let res = await Utils.post_api('api/xac-thuc-tnh/DangKy_Smart', strBody, false, false);
    Utils.nlog('[LOGIN_OTP_3]:', strBody, res)
    return res;
}
// https://tay-ninh-admin-api.vts-paht.com/api/xac-thuc-tnh/OTP_Smart
async function OTP_Smart(body) {
    let strBody = JSON.stringify({
        ...body
    })
    let res = await Utils.post_api('api/xac-thuc-tnh/OTP_Smart', strBody, false, false);
    Utils.nlog('[OTP_Smart]:', strBody, res)
    return res;
}
// https://tay-ninh-admin-api.vts-paht.com/api/xac-thuc-tnh/Login_Smart
async function Login_Smart(body) {
    let strBody = JSON.stringify({
        ...body
    })
    let res = await Utils.post_api('api/xac-thuc-tnh/Login_Smart', strBody, false, false);
    Utils.nlog('[OTP_Smart]:', strBody, res)
    return res;
}
export {
    LoginGYPA, LogoutGYPA, ChangePasswordJeeHR, RegisDeviceToken,
    GetInFoUser, TaoTaiKhoan, XacThucDangKyTK, RequestOTPApp, ScanQRLogin, CreateOTPScanQRLogin, XacThucScanQRLogin,
    DoiMatKhauApp, CheckSession, CapNhatTTCongDan, CDChangePass, Get_AnhNen, LoginSSO, LogiFB, GetListSOSApp, GetListIOCApp, Info_FeedBack_APP,
    DS_DonViTNH, DangKy_Smart, OTP_Smart, Login_Smart, LoaiFeedBack
}