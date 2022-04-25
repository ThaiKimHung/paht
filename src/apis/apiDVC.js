import Utils from '../../app/Utils';
import { appConfig } from '../../app/Config';
import AppCodeConfig from '../../app/AppCodeConfig';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { store } from '../../srcRedux/store';
const PREFIX = 'api/dvc/';
const PREFIX_HOIDAP = 'api/hoi-dap/';
const PREFIX_TINTUC = 'api/tin-tuc-dvc/';



async function GetDataDonVi_TraCuu() {
    let val = `${PREFIX}GetDataDonVi_TraCuu`
    let res = await Utils.get_api_default(val, false, false);
    return res
}

async function LoadCBoLinhVuc(DonViID) {
    let val = `${PREFIX}LoadCBoLinhVuc?DonViID=${DonViID}`
    let res = await Utils.get_api_default(val, false, false);
    return res
}

async function GetDanhSachTTHCDVC(dataBoDy, token = 'rpNuGJebgtBEp0eQL1xKnqQG') {
    console.log("gia tri res SUAPA:", dataBoDy)
    try {
        let response = await fetch(appConfig.domain + "api/dvc/GetDanhSachTTHCDVC", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                token: token
            },
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
//api/dvc/TraCuuTTHSClick

async function TraCuuTTHSClick(dataBoDy, token = 'rpNuGJebgtBEp0eQL1xKnqQG') {
    // console.log("gia tri res SUAPA:", dataBoDy)
    try {
        let response = await fetch(appConfig.domain + "api/dvc/TraCuuTTHSClick", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                token: token
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: dataBoDy
        });
        response = await response.json();
        // Utils.nlog("gia tri res -xxxx response", response);
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}
//api/dvc/GetDanhSachHoSoKemTheoTraCuu?ThuTucID=4797&DonViID=356
async function GetDanhSachHoSoKemTheoTraCuu(ThuTucID, DonViID) {
    let val = `${PREFIX}GetDanhSachHoSoKemTheoTraCuu?ThuTucID=${ThuTucID}&DonViID=${DonViID}`;
    let res = await Utils.get_api_default(val, false, false);
    return res
}

async function GetAllTinhTrang() {
    let val = `${PREFIX}GetAllTinhTrang?MaTinhTrang=VTN&TenTinhTrang=Hồ sơ chưa gửi&TinhTrangID=1`
    let res = await Utils.get_api_default(val, false, false);
    return res
}
//api/dvc/DownLoadHSKemTheo?HSKTID=61068&FileName=HSOL18112002434023_☺TAILIEUTICHHOPDVCTAYNINH_v12.docx&linkDownLoad=http://taphuandvc.tayninh.gov.vn:1008/
async function DownLoadHSKemTheo(HSKTID, FileName) {
    let val = `${PREFIX}DownLoadHSKemTheo?HSKTID=${HSKTID}&FileName=${FileName}&linkDownLoad=http://taphuandvc.tayninh.gov.vn:1008/`;
    let res = await Utils.get_api_default(val, false, false);
    return res
}


async function TimKiemHoSoNguoiDung(dataBoDy, token = 'rpNuGJebgtBEp0eQL1xKnqQG') {
    // console.log("gia tri res SUAPA:", dataBoDy)
    try {
        let response = await fetch(appConfig.domain + "api/dvc/TimKiemHoSoNguoiDung", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                token: token
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: dataBoDy
        });
        response = await response.json();
        // Utils.nlog("gia tri res -xxxx response", response);
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}
//api/dvc/LoadCBoByDieuKien?DieuKien=356&TableName=DMPHUONG
async function LoadCBoByDieuKien(DonViID) {
    let val = `${PREFIX}LoadCBoByDieuKien?DieuKien=${DonViID}&TableName=DMPHUONG`;
    let res = await Utils.get_api_default(val, false, false);
    return res
}

//api/dvc/UploadFileDKTTHC
async function UploadFileDKTTHC(dataBoDy, token = 'rpNuGJebgtBEp0eQL1xKnqQG') {
    // console.log("gia tri res SUAPA:", dataBoDy)
    try {
        let response = await fetch(appConfig.domain + "api/dvc/UploadFileDKTTHC", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                token: token
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: dataBoDy
        });
        response = await response.json();
        // Utils.nlog("gia tri res -xxxx response", response);
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}


//api/dvc/SaveDKTTHC
async function SaveDKTTHC(dataBoDy, token = 'rpNuGJebgtBEp0eQL1xKnqQG') {
    try {
        let response = await fetch(appConfig.domain + "api/dvc/SaveDKTTHC", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                token: token
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: dataBoDy
        });
        response = await response.json();
        // Utils.nlog("gia tri res -xxxx response", response);
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}

//api/dvc/SendDKTTHC
async function SendDKTTHC(dataBoDy, token = 'rpNuGJebgtBEp0eQL1xKnqQG') {
    try {
        let response = await fetch(appConfig.domain + "api/dvc/SendDKTTHC", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                token: token
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: dataBoDy
        });
        response = await response.json();
        // Utils.nlog("gia tri res -xxxx response", response);
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}

//api/dvc/DeleteHSKemTheo?HSKTID=61068&FileName=HSOL18112002434023_☺TAILIEUTICHHOPDVCTAYNINH_v12.docx
async function DeleteHSKemTheo(IdThuTuc, FileName) {
    let val = `${PREFIX}DeleteHSKemTheo?HSKTID=${IdThuTuc}&FileName=${FileName}`;
    let res = await Utils.get_api_default(val, false, false);
    return res
}

//api/dvc/UpdateDKTTHC
async function UpdateDKTTHC(dataBoDy, token = 'rpNuGJebgtBEp0eQL1xKnqQG') {
    try {
        let response = await fetch(appConfig.domain + "api/dvc/UpdateDKTTHC", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                token: token
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: dataBoDy
        });
        response = await response.json();
        // Utils.nlog("gia tri res -xxxx response", response);
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}

//HOI DAP TRUC TUYEN
//
async function DanhSachCauHoi(pageRows = 15, pageIndex = 1) {
    let val = `${PREFIX_HOIDAP}DanhSachCauHoi?pageRows=${pageRows}&pageIndex=${pageIndex}`;
    let res = await Utils.get_api_default(val, false, false);
    return res
}

//api/hoi-dap/ChiTietCauHoi?id=7983
async function ChiTietCauHoi(id) {
    let val = `${PREFIX_HOIDAP}ChiTietCauHoi?id=${id}`;
    let res = await Utils.get_api_default(val, false, false);
    return res
}

//api/hoi-dap/ChiTietCauTraLoi?id=7983
async function ChiTietCauTraLoi(id) {
    let val = `${PREFIX_HOIDAP}ChiTietCauTraLoi?id=${id}`;
    let res = await Utils.get_api_default(val, false, false);
    return res
}

//api/hoi-dap/ratingtl
async function DanhGiaCauTraLoi(dataBoDy, token = 'rpNuGJebgtBEp0eQL1xKnqQG') {
    try {
        let response = await fetch(appConfig.domain + "api/hoi-dap/ratingtl", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                token: token
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: dataBoDy
        });
        response = await response.json();
        // Utils.nlog("gia tri res -xxxx response", response);
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}

async function DatCauHoi(dataBoDy, token = 'rpNuGJebgtBEp0eQL1xKnqQG') {
    try {
        let response = await fetch(appConfig.domain + "api/hoi-dap/DatCauHoi", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                token: token
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: dataBoDy
        });
        response = await response.json();
        // Utils.nlog("gia tri res -xxxx response", response);
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}

// DsNguonBaiViet
async function DsNguonBaiViet() {
    let val = `${PREFIX_TINTUC}DsNguonBaiViet`;
    let res = await Utils.get_api_default(val, false, false);
    return res
}

//api/tin-tuc-dvc/DsBaiViet
async function DsBaiViet(dataBoDy, token = 'rpNuGJebgtBEp0eQL1xKnqQG') {
    try {
        let tempS = "";
        Object.keys(dataBoDy).map(function (key, index) {
            tempS += key + "=" + dataBoDy[key] + "&";
        });
        dataBoDy = tempS;
        Utils.nlog(dataBoDy)
        let response = await fetch(appConfig.domain + "api/tin-tuc-dvc/DsBaiViet", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                token: token
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: dataBoDy
        });
        response = await response.json();
        // Utils.nlog("gia tri res -xxxx response", response);
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}
//api/tin-tuc-dvc/ChiTietBaiViet
async function ChiTietBaiViet(dataBoDy, token = 'rpNuGJebgtBEp0eQL1xKnqQG') {
    try {
        let tempS = "";
        Object.keys(dataBoDy).map(function (key, index) {
            tempS += key + "=" + dataBoDy[key] + "&";
        });
        dataBoDy = tempS;
        let response = await fetch(appConfig.domain + "api/tin-tuc-dvc/ChiTietBaiViet", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                token: token
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: dataBoDy
        });
        response = await response.json();
        // Utils.nlog("gia tri res -xxxx response", response);
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}
//thanh toan
// {{domain}}api/dvc/Get_HSDVC api get ho so thanh toan
async function Get_HSDVC(dataBoDy, token = 'rpNuGJebgtBEp0eQL1xKnqQG') {
    try {
        let tempS = "";
        Object.keys(dataBoDy).map(function (key, index) {
            tempS += key + "=" + dataBoDy[key] + "&";
        });
        dataBoDy = tempS;
        let response = await fetch(appConfig.domain + "api/dvc/Get_HSDVC", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                token: token
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: dataBoDy
        });
        response = await response.json();
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}
// HoSoThanhToanModel
// {{domain}}api/dvc/ThanhToanTrucTuyenXLDVCQG
async function ThanhToanTrucTuyenXLDVCQG(body) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Token", "rpNuGJebgtBEp0eQL1xKnqQG");
        myHeaders.append("Accept", 'application/json');
        var formdata = new FormData();
        formdata.append("HoSoThanhToanModel", JSON.stringify(body));
        // Utils.nlog("from data-------", formdata)
        let response = await fetch(appConfig.domain + "api/dvc/ThanhToanTrucTuyenXLDVCQG", {
            method: 'post',
            headers: myHeaders,

            redirect: 'follow', // manual, *follow, error
            body: formdata
        });
        response = await response.json();
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}
// api/dvc/InBienLai?HoSoID=559202
async function InBienLai(IDHoSo, token = 'rpNuGJebgtBEp0eQL1xKnqQG') {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Token", token);
        Utils.nlog("giá trị url bien lai thanh toan", appConfig.domain + `api/dvc/InBienLai?HoSoID=${IDHoSo}&GiaoDichID=0&TransactionID&TypePay=0`)
        //api/dvc/InBienLai?HoSoID=608544&GiaoDichID=0&TransactionID&TypePay=0
        let response = await fetch(appConfig.domain + `api/dvc/InBienLai?HoSoID=${IDHoSo}&GiaoDichID=0&TransactionID&TypePay=0`, {
            method: 'get',
            headers: myHeaders,
            redirect: 'follow', // manual, *follow, error

        });
        response = await response.json();
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}


async function AutoLienKet(body) {
    let strBody = JSON.stringify(body)
    let url = 'api/tichhop-tk/AutoLienKet'
    let res = await Utils.post_api(url, strBody, false, false)
    return res
}
// api/dvc/Tim_Tai_Khoan?sodt=

async function Tim_Tai_Khoan(sdt) {
    Utils.nlog("vao-----danh sách đơn vị là")
    let url = `api/dvc/Tim_Tai_Khoan?sodt=${sdt}`
    let res = await Utils.get_api(url, false, false);
    Utils.nlog(`res----------${url}`, res)
    return res
}
// api/dvc/DS_DonVi
async function DS_DonVi() {
    let url = `api/dvc/DS_DonVi`
    let res = await Utils.get_api(url, false, false)
    Utils.nlog(`res----------${url}`, res)
    return res
}

// api/dvc/DSNotification?sortOrder=asc&sortField=&pageNumber=1&pageSize=10&OrderBy=&page=1&keyword=&record=10&more=false&filter.keys=CMND&filter.vals=025290829
async function GetThongBaoDichVuCong(page = 1, CMND = '') {
    let url = `api/dvc/DSNotification?sortOrder=asc&sortField=&pageNumber=1&pageSize=10&OrderBy=&page=${page}&keyword=&record=10&more=false&filter.keys=CMND&filter.vals=${CMND}`
    let res = await Utils.get_api(url, false, false)
    Utils.nlog(`[LOG] RES THONG BAO DICH VU CONG: ${url}`, res)
    return res
}

//api/dvc/Login_QR
async function XacThucDangNhapQR(dataBoDy, token = 'rpNuGJebgtBEp0eQL1xKnqQG') {
    try {
        let tempS = "";
        Object.keys(dataBoDy).map(function (key, index) {
            tempS += key + "=" + dataBoDy[key] + "&";
        });
        dataBoDy = tempS;
        let response = await fetch(appConfig.domain + "api/dvc/Login_QR", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                token: token
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: dataBoDy
        });
        response = await response.json();
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}

async function GetTinhThanhPho() {
    try {
        var myHeaders = new Headers();
        myHeaders.append("ApiKey", "QsnTBOdstv1bu7bamN5JXHR99w9I6XYb");
        myHeaders.append("Authorization", "Basic WVNxT1VjZzVKUVlkdFk5VHJCY2tHMHFjQ1BYOFBCWDQ6aUJ4ZmpMOXJLb01ycWdJWjhVcjVOdzZuR2VMTzNmeTE=");
        let response = await fetch('https://tinhhinhcovid.tayninh.gov.vn/api/TinhThanh/Get', {
            method: 'get',
            headers: myHeaders,
            redirect: 'follow', // manual, *follow, error
        });
        response = await response.json();
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}

async function GetQuanHuyen(id = -1) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("ApiKey", "QsnTBOdstv1bu7bamN5JXHR99w9I6XYb");
        myHeaders.append("Authorization", "Basic WVNxT1VjZzVKUVlkdFk5VHJCY2tHMHFjQ1BYOFBCWDQ6aUJ4ZmpMOXJLb01ycWdJWjhVcjVOdzZuR2VMTzNmeTE=");
        let response = await fetch(`https://tinhhinhcovid.tayninh.gov.vn/api/QuanHuyen/Get?id=${id}`, {
            method: 'get',
            headers: myHeaders,
            redirect: 'follow', // manual, *follow, error
        });
        response = await response.json();
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}

async function GetPhuongXa(id = -1) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("ApiKey", "QsnTBOdstv1bu7bamN5JXHR99w9I6XYb");
        myHeaders.append("Authorization", "Basic WVNxT1VjZzVKUVlkdFk5VHJCY2tHMHFjQ1BYOFBCWDQ6aUJ4ZmpMOXJLb01ycWdJWjhVcjVOdzZuR2VMTzNmeTE=");
        let response = await fetch(`https://tinhhinhcovid.tayninh.gov.vn/api/XaPhuong/Get?id=${id}`, {
            method: 'get',
            headers: myHeaders,
            redirect: 'follow', // manual, *follow, error
        });
        response = await response.json();
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}

async function CheckInKiemDich(dataBoDy) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("ApiKey", "QsnTBOdstv1bu7bamN5JXHR99w9I6XYb");
        myHeaders.append("Authorization", "Basic WVNxT1VjZzVKUVlkdFk5VHJCY2tHMHFjQ1BYOFBCWDQ6aUJ4ZmpMOXJLb01ycWdJWjhVcjVOdzZuR2VMTzNmeTE=");

        var strBody = JSON.stringify(dataBoDy);

        let response = await fetch(`https://tinhhinhcovid.tayninh.gov.vn/api/ThongTin/Post`, {
            method: 'POST',
            headers: myHeaders,
            body: strBody,
            redirect: 'follow'
        });
        response = await response.json();
        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}

async function DanhSachCauHoiByDienThoai(pageRows = 10, pageIndex = 1) {
    let { userCD } = store.getState().auth
    try {
        let url = Utils.getGlobal(nGlobalKeys.DOMAIN_LSHOIDAP, '')
        Utils.nlog('[LOG] url DOMAIN_LSHOIDAP', url);
        let dataBoDy = {
            "dienThoai": userCD?.PhoneNumber,
            "pageRows": pageRows,
            "pageIndex": pageIndex
        }
        let tempS = "";
        Object.keys(dataBoDy).map(function (key, index) {
            tempS += key + "=" + dataBoDy[key] + "&";
        });
        dataBoDy = tempS;
        Utils.nlog('[LOG] dataBoDy', dataBoDy);
        let response = await fetch(url, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: dataBoDy
        });
        response = await response.json();

        return response;

    } catch (error) {
        Utils.nlog("gia tri eror", error);
        return -1;
    }
}
export {
    GetDataDonVi_TraCuu, LoadCBoLinhVuc, GetDanhSachTTHCDVC, GetDanhSachHoSoKemTheoTraCuu, DownLoadHSKemTheo, TraCuuTTHSClick,
    LoadCBoByDieuKien, UploadFileDKTTHC, SaveDKTTHC, SendDKTTHC, DeleteHSKemTheo, UpdateDKTTHC, GetAllTinhTrang, TimKiemHoSoNguoiDung,
    DanhSachCauHoi, ChiTietCauHoi, ChiTietCauTraLoi, DanhGiaCauTraLoi, DatCauHoi, DsNguonBaiViet, DsBaiViet, ChiTietBaiViet, Get_HSDVC,
    ThanhToanTrucTuyenXLDVCQG, InBienLai, AutoLienKet, Tim_Tai_Khoan, DS_DonVi, GetThongBaoDichVuCong, XacThucDangNhapQR, GetTinhThanhPho,
    GetQuanHuyen, GetPhuongXa, CheckInKiemDich, DanhSachCauHoiByDienThoai
}