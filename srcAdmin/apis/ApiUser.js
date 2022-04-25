import Utils from "../../app/Utils";
import { nkey } from "../../app/keys/keyStore";
import { nGlobalKeys } from "../../app/keys/globalKey";
import AppCodeConfig from "../../app/AppCodeConfig";
import { GetSetMaScreen } from "../../srcRedux/actions/auth/Auth";
import { appConfig } from "../../app/Config";

const apiUser = 'api/nguoidung/'
const accApp = 'api/accadminapp/'
const ApiConfig = "api/congfigapp/"

//{_isEditMode: false, _isNew: false, _isUpdated: false, _isDeleted: false, _prevState: null,…}
// _isEditMode: false
// _isNew: false
// _isUpdated: false
// _isDeleted: false
// _prevState: null
// _defaultFieldName: ""
// _userId: 0
// UserName: "tamdinhvan"
// FullName: "dinh văn tâm"
// Password: "123456Aa@"
// RePassword: "123456Aa@"
// PhoneNumber: "0967384144"
// TenChucVu: "testtam"
// Email: "testtam@gmail.com"
// IdCoQuan: 25771
// IdGroup: []
// Change: true
//TaoNguoiDungTuDo tạm thời
async function TaoNguoiDung(body = '') {
    let bodyChangePass = JSON.stringify(body)
    var val = `${apiUser}TaoNguoiDungTuDo`
    let res = await Utils.post_api(val, bodyChangePass, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
async function Get_AnhNen(token = '') {
    // api/account/InfoAccount?IdUser=
    // let res = await Utils.get_api(apiUser + 'InfoAccount?IdUser=' + IdUser);
    var val = `${ApiConfig}Get_AnhNen?IdApp=1`
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
async function ChangePassword(body = '') {
    let bodyChangePass = JSON.stringify(body)
    var val = `${apiUser}ChangePassword`
    let res = await Utils.post_api(val, bodyChangePass, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function CapNhatHinh(body = {}) {
    let Body = JSON.stringify(body)
    var val = `${apiUser}CapNhatHinh`
    let res = await Utils.post_api(val, Body, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}
//TaoTaiKhoanCongDan
async function LoginGYPA(Username, Password) {
    let strBody = JSON.stringify({
        "UserName": Username,
        "Password": Password
    })
    let res = await Utils.post_api(apiUser + 'Login', strBody, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function LogOut(token = '') {
    await GetSetMaScreen(false, appConfig.manHinhADmin, false);
    let MaScreen = appConfig.manHinhADmin
    let strBody = JSON.stringify({
        "TokenDevice": token,
        // "MaScreen": MaScreen
    })
    let res = await Utils.post_api(apiUser + 'LogOut', strBody, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}


//api/nhatkysd/Insert_NhatKy
async function Insert_NhatKy(Id = '') {
    let strBody = JSON.stringify({
        "UserID": Id,
        "NoiDung": "Truy cập App"
    })
    let res = await Utils.post_api('api/nhatkysd/Insert_NhatKy', strBody, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}
//api/nguoidung/LayMaCapLaiMK

async function LayMaCapLaiMK(Email = '', Type = 1, Hash = '') {
    // const ID = await Utils.ngetStore(nkey.Id_user, '', AppCodeConfig.APP_ADMIN)
    let strBody = JSON.stringify({
        "Email": Email,
        "EmailHash": Email,
        "IdAccount": 0,
        "Time1": new Date(),
        "Type": Type,
        "Hash": Hash
    })
    Utils.nlog('body', strBody)
    let res = await Utils.post_api(apiUser + 'LayMaCapLaiMK', strBody, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
//api/nguoidung/XacThucDangNhap
async function XacThucDangNhap(item = {}) {
    let strBody = JSON.stringify({
        "Sha": item.sha,
        "Otp": item.otp,
        "Id": item.id,
        "Type": item.type
    })
    Utils.nlog('body', strBody)
    let res = await Utils.post_api(apiUser + 'XacThucDangNhap', strBody, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
//{
//     "Sha": "sample string 1",
//     "Otp": "sample string 2",
//     "Id": 3,
//     "Type": 4
//   }
async function RegisDeviceToken(DevicesInfo = '', DevicesToken = '', IdPA = 0, IdHuyen = '', IdUser = '', SDT = '', new_token = '') {
    let MaScreen = await GetSetMaScreen(true)
    let strBody = JSON.stringify({
        "DevicesInfo": DevicesInfo,
        "DevicesToken": DevicesToken,
        "IdPA": IdPA,
        "IdHuyen": IdHuyen,
        "IdUser": IdUser,
        "SDT": SDT,
        "new_token": new_token,
        "on_off": true,
        "IsDan": false,
        "MaScreen": MaScreen,
    })
    Utils.nlog('[body-Noti-DH------------]', strBody)
    let res = await Utils.post_api('api/accapp/RegisDeviceToken', strBody, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
async function CheckSession(token = '') {
    // api/account/InfoAccount?IdUser=CheckSessionAdmin
    // let res = await Utils.get_api(apiUser + 'InfoAccount?IdUser=' + IdUser);
    var val = `${accApp}CheckSessionAdmin?token=${token}`
    let res = await Utils.get_api(val, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}

async function GetInfoUser() {
    const iduser = await Utils.ngetStore(nkey.Id_user, '', AppCodeConfig.APP_ADMIN);
    var val = `${apiUser}InfoUser?IdUser=${iduser}`
    Utils.nlog('String API:', val)
    let res = await Utils.get_api(val, false, true, true, AppCodeConfig.APP_ADMIN)
    return res;
}
//api/accadminapp/CheckSessionAdmin

//api/accapp/RequestOTPApp
// async function RequestOTPApp(Username = '', NumberPhone = '') {
//     let strBody = JSON.stringify({
//         "UserName": Username,
//         "NumberPhone": NumberPhone,
//         // "OTP": "sample string 3",
//         // "IdAccount": 4
//     })
//     let res = await Utils.post_api(accApp + 'RequestOTPApp', strBody, false, false);
//     return res;
// }

async function CapNhatMySelft(Id, FullName, Email, PhoneNumber) {
    let bodyUser = JSON.stringify({
        "FullName": FullName,
        "PhoneNumber": PhoneNumber,
        "Email": Email,
        "MySelf": true,
        "Id": Id
    })
    var val = `${apiUser}CapNhatMySelft`
    Utils.nlog("<>BodyUsser", bodyUser)
    let res = await Utils.post_api(val, bodyUser, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
}
async function TaoTKCongDan(body) {
    let bodyUser = JSON.stringify(body)
    var val = `api/nguoidan/TaoTaiKhoanCongDanBE`
    Utils.nlog("<>BodyUsser", bodyUser)
    let res = await Utils.post_api(val, bodyUser, false, false, true, AppCodeConfig.APP_ADMIN);
    return res;
}
export {
    LoginGYPA, RegisDeviceToken, CheckSession, TaoNguoiDung, TaoTKCongDan,
    Insert_NhatKy, LayMaCapLaiMK, XacThucDangNhap, GetInfoUser, Get_AnhNen, CapNhatHinh, LogOut, ChangePassword, CapNhatMySelft
}