import Utils from '../../../app/Utils';
import { nGlobalKeys } from '../../../app/keys/globalKey';

const PREFIX = `api/nguoi-tim-viec/`
const PREFIX_ENTERPRISE = `api/viec-tim-nguoi/`

const PREFIX3 = `api/nguoi-tim-viec/`
const PREFIX2 = `api/dung-chung/`

export const defObjParamSVL = {
    "query.more": false,
    "query.page": "1",
    "query.pageNumber": "1",
    "query.pageSize": "10", //It
    "record": "10", //It
    //-------
    "query.sortOrder": "desc",
    "query.sortField": "CreatedDate",
    "query.OrderBy": "CreatedDate",
    "query.keyword": "",
    "query.filter.keys": "",
    "query.filter.vals": "",
};

//++++ PHÚC++++

//api/authorization/LoginPersonal
export async function LoginPersonal(objBody) {
    const strBody = JSON.stringify(objBody);
    const res = await Utils.post_api('api/authorization/LoginPersonal', strBody, false, false);
    return res
}

//api/authorization/RegisToken?Token=&info
export async function RegisToken() {
    const DevicesToken = Utils.getGlobal(nGlobalKeys.deviceToken, '')
    const info = ''
    const res = await Utils.post_api(`api/authorization/RegisToken?Token=${DevicesToken}&info=${info}`)
    return res
}
//api/viec-tim-nguoi/CreateNewCV
export async function CreateNewCV(objBody) {
    // const strBody = JSON.stringify(objBody);
    const res = await Utils.post_api_formdata(`${PREFIX3}CreateNewCV`, objBody, false, true);
    // const res = await Utils.post_api(`${PREFIX3}CreateNewCV`, strBody, false, true);
    return res
}

//api/viec-tim-nguoi/UpdateCV
export async function UpdateCV(objBody) {
    // const strBody = JSON.stringify(objBody);
    const res = await Utils.post_api_formdata(`${PREFIX}UpdateCV`, objBody, false, true);
    return res
}

//api/viec-tim-nguoi/UpdateStatusCV?IdCV=&value=&Type=
export async function UpdateStatusCV(IdCV, value, Type) {
    const res = await Utils.get_api(`${PREFIX}UpdateStatusCV?IdCV=${IdCV}&value=${value}&Type=${Type}`)
    return res
}

//api/nguoi-tim-viec/GetListCVByUserId?query.more=true&query.sortField=CreatedDate&query.sortOrder=desc&query.filter.keys=IsPublic&query.filter.vals=1
export async function GetListCVByUserId(keys = '', vals = '') {
    let url = `${PREFIX}GetListCVByUserId?query.more=true&query.sortField=CreatedDate&query.sortOrder=desc&query.filter.keys=${keys}&query.filter.vals=${vals}`
    let res = await Utils.get_api(url, false, true)
    return res
}

//api/nguoi-tim-viec/GetDetailCV?IdCV=
export async function GetDetailCV(Idcv) {
    let url = `api/nguoi-tim-viec/GetDetailCV?IdCV=${Idcv}`
    let res = await Utils.get_api(url, false, true)
    return res
}

// https://dt-hong-ngu-admin-api.vts-paht.com/api/nguoi-tim-viec/DeleteCV?IdCV=26
export async function DeleteCV(id) {
    let url = `api/nguoi-tim-viec/DeleteCV?IdCV=${id}`
    let res = await Utils.get_api(url, false, true)
    return res
}

// https://dt-hong-ngu-admin-api.vts-paht.com/api/nguoi-tim-viec/NopHoSo
export async function NopCV(objBody) {
    let url = `api/nguoi-tim-viec/NopHoSo`
    const strBody = JSON.stringify(objBody);
    Utils.nlog('strBody', strBody)
    let res = await Utils.post_api(url, strBody, false, true)
    return res
}

//api/viec-tim-nguoi/GetListViecLam?query.more=true&query.sortField=CreatedDate&query.sortOrder=desc&query.filter.vals=&query.filter.key=
export async function GetListViecLam(objFilter = {
    "query.more": false,
    "query.page": 1,
    "query.record": 10,
    "query.sortField": "CreatedDate",
    "query.sortOrder": "desc",
    "query.filter.keys": '',
    "query.filter.vals": ''
}) {
    let filter = ''
    for (const property in objFilter) {
        filter = filter + `&${property}=${objFilter[property]}`
    }
    Utils.nlog('[LOG] filter', filter)
    const res = await Utils.get_api(`${PREFIX}GetListViecLam?${filter}`, false, true);
    return res
}

//api/viec-tim-nguoi/GetDetailViecLam?Id=
export async function GetDetailViecLam(Id) {
    const res = await Utils.get_api(`${PREFIX}GetDetailViecLam?Id=${Id}&IsCountView=true`, false, false);
    return res
}

//->> api/viec-tim-nguoi/GetDetailViecLam?Id=2
//++++ NHÂN++++
//->> api/nguoi-tim-viec/GetListTuyenDungCaNhan?query.more=true&query.sortField=CreatedDate&query.sortOrder=desc&query.filter.keys=&query.filter.vals=
export async function GetListTuyenDungCaNhan() {
    const res = await Utils.get_api(`${PREFIX}GetListTuyenDungCaNhan?query.more=true&query.sortField=CreatedDate&query.sortOrder=desc`, false, true);
    return res
}
//->> api/nguoi-tim-viec/GetDetailTuyenDungCaNhan?Id=37
export async function GetDetailTuyenDungCaNhan(Id) {
    const res = await Utils.get_api(`${PREFIX}GetDetailTuyenDungCaNhan?Id=${Id}`, false, true);
    return res
}

// ->> api/viec-tim-nguoi/UpdateStatusTuyenDung
export async function UpdateStatusTuyenDung(objBody) {
    const strBody = JSON.stringify(objBody);
    const res = await Utils.post_api(`${PREFIX}UpdateStatusTuyenDung`, strBody, false, true);
    return res
}
// ->> api/dung-chung/GetAllList_DM_KinhNghiem
export async function GetAllList_DM_KinhNghiem() {
    const res = await Utils.get_api(`${PREFIX2}GetAllList_DM_KinhNghiem`, false, false);
    return res
}
// ->> api/dung-chung//GetAllList_DM_MucLuong
export async function GetAllList_DM_MucLuong() {

    const res = await Utils.get_api(`${PREFIX2}GetAllList_DM_MucLuong`, false, false);
    return res
}

// ->> api/dung-chung//GetAllList_DM_ChucVu
export async function GetAllList_DM_ChucVu() {

    const res = await Utils.get_api(`${PREFIX2}GetAllList_DM_ChucVu`, false, false);
    return res
}


// ->> api/dung-chung/GetListDMXaPhuongById?IDQuanHuyen=859
export async function GetListDMXaPhuongById(idquanhuyen = 0) {

    const res = await Utils.get_api(`${PREFIX2}GetListDMXaPhuongById?IDQuanHuyen=${idquanhuyen}`, false, false);
    return res
}

// ->> api/dung-chung/GetListDMQuanHuyenById?IDTinhThanh=1
export async function GetListDMQuanHuyenById(IDTinhThanh = 0) {

    const res = await Utils.get_api(`${PREFIX2}GetListDMQuanHuyenById?IDTinhThanh=${IDTinhThanh}`, false, false);
    return res
}

// ->> api/dung-chung/GetListDMTrinhDoNgoaiNguChiTietById?IdNgoaiNgu=1
export async function GetListDMTrinhDoNgoaiNguChiTietById(IdNgoaiNgu = 0) {

    const res = await Utils.get_api(`${PREFIX2}GetListDMTrinhDoNgoaiNguChiTietById?IdNgoaiNgu=${IdNgoaiNgu}`, false, false);
    return res
}


//->> API SỐ 9 -> API 17



//++++ HÙNG++++

//->> API SỐ 18 -> API 26

//Danh sách trình độ ngoại ngữ
//api/dung-chung/GetAllList_DM_TrinhDoNgoaiNgu
export async function GetAllListDMTrinhDoNgoaiNgu(objBody) {
    const strBody = JSON.stringify(objBody);
    const res = await Utils.post_api(`${PREFIX2}GetAllList_DM_TrinhDoNgoaiNgu`, strBody, false, true);
    return res
}

//Danh sách trình độ văn hóa
//api/dung-chung/GetAllList_DM_TrinhDoVanHoa
export async function GetAllListDMTrinhDoVanHoa() {
    const res = await Utils.get_api(`${PREFIX2}GetAllList_DM_TrinhDoVanHoa`, false, false);
    return res
}

//Danh sách trình độ tin học
//api/dung-chung/GetAllList_DM_TrinhDoTinHoc
export async function GetAllListDMTrinhDoTinHoc(objBody) {
    const strBody = JSON.stringify(objBody);
    const res = await Utils.post_api(`${PREFIX2}GetAllList_DM_TrinhDoTinHoc`, strBody, false, true);
    return res
}

//Danh sách loại ngành nghề
//api/dung-chung/GetAllList_DM_LoaiNganhNghe
export async function GetAllListDMLoaiNganhNghe() {
    const res = await Utils.get_api(`${PREFIX2}GetListDMNganhNgheById`, false, false);
    return res
}

//Danh sách tỉnh thành
//api/dung-chung/GetAllList_DM_TinhThanh
export async function GetAllListDMTinhThanh() {
    const res = await Utils.get_api(`${PREFIX2}GetAllList_DM_TinhThanh`, false, false);
    return res
}

//Danh sách tôn giáo
//api/dung-chung/GetAllList_DM_TonGiao
export async function GetAllListDMTonGiao(objBody) {
    const strBody = JSON.stringify(objBody);
    const res = await Utils.post_api(`${PREFIX2}GetAllList_DM_TonGiao`, strBody, false, true);
    return res
}

//Danh sách dân tộc
//api/dung-chung/GetAllList_DM_DanToc
export async function GetAllListDMDanToc(objBody) {
    const strBody = JSON.stringify(objBody);
    const res = await Utils.post_api(`${PREFIX2}GetAllList_DM_DanToc`, strBody, false, true);
    return res
}

//cập nhật trạng thái tuyển dụng (doanh nghiệp)
//api/viec-tim-nguoi/UpdateStatus
export async function UpdateStatus(objBody) {
    const strBody = JSON.stringify(objBody);
    const res = await Utils.post_api(`${PREFIX_ENTERPRISE}UpdateStatus`, strBody, false, true);
    return res
}

//++++ THÀNH++++
// api/viec-tim-nguoi/ChonCVPhuHop
export async function ChonCvPhuHop(objBody) {
    const strBody = JSON.stringify(objBody);
    const res = await Utils.post_api(`api/viec-tim-nguoi/ChonCVPhuHop`, strBody, false, true);
    return res
}

// api/viec-tim-nguoi/GetListTuyenDungDoanhNghiep
export async function GetListTuyenDungDoanhNghiep(objFilter = {}) {
    let filter = ''
    for (const property in objFilter) {
        filter = filter + `&${property}=${objFilter[property]}`
    }
    Utils.nlog('[LOG] filter enterprise', filter)
    const res = await Utils.get_api(`${PREFIX_ENTERPRISE}GetListTuyenDungDoanhNghiep?${filter}`, false, true);
    return res
}

// api/viec-tim-nguoi/DeleteTinTuyenDung?Id=1
export async function XoaTinTuyenDung(Id) {
    const res = await Utils.get_api(`${PREFIX_ENTERPRISE}DeleteTinTuyenDung?Id=${Id}`, false, false);
    return res
}

// api/viec-tim-nguoi/GetDetailTinTuyenDung?Id=1
export async function GetChiTietTinTuyenDung(Id) {

    const res = await Utils.get_api(`${PREFIX_ENTERPRISE}GetDetailTinTuyenDung?Id=${Id}`, false, false);
    return res
}

// api/viec-tim-nguoi/GetListTinTuyenDung
export async function GetListTinTuyenDung(objFilter = {
    "query.more": true,
    "query.page": "",
    "query.record": "",
    "query.sortField": "",
    "query.sortOrder": "",
    "query.filter.keys": "",
    "query.filter.vals": "",
}) {
    let filter = ''
    for (const property in objFilter) {
        filter = filter + `&${property}=${objFilter[property]}`
    }
    const res = await Utils.get_api(`${PREFIX_ENTERPRISE}GetListTinTuyenDung?${filter}`, false, false);
    return res
}
// api/viec-tim-nguoi/UpdatedTinTuyenDung
export async function CapNhapTinTuyenDung(objBody) {
    const res = await Utils.post_api_formdata(`api/viec-tim-nguoi/UpdatedTinTuyenDung`, objBody, false, true);
    return res
}
// api/viec-tim-nguoi/UpdateStatusHienThi?Id=&value=
export async function UpdateStatusHienThi(Id, value, Type) {
    const res = await Utils.get_api(`${PREFIX_ENTERPRISE}UpdateStatusHienThi?Id=${Id}&value=${value}`)
    return res
}

// api/viec-tim-nguoi/CreatedTinTuyenDung
export async function TaoTinTuyenDung(objBody) {
    const res = await Utils.post_api_formdata(`api/viec-tim-nguoi/CreatedTinTuyenDung`, objBody, false, true);
    return res
}

// api/viec-tim-nguoi/GetListCV
export async function GetListCV(objFilter = {}) {
    let filter = ''
    for (const property in objFilter) {
        filter = filter + `&${property}=${objFilter[property]}`
    }
    const res = await Utils.get_api(`${PREFIX_ENTERPRISE}GetListCV?${filter}`, false, true);
    return res
}

//->> API SỐ 26 -> API 33


//api/dung-chung/GetListDMDoTuoi
export async function GetListDMDoTuoi() {
    const res = await Utils.get_api(`${PREFIX2}GetListDMDoTuoi`, false, false);
    return res
}

//api/nguoi-tim-viec/LikeTinTuyenDung?Id=
export async function LikeTinTuyenDung(Id) {
    const res = await Utils.get_api(`${PREFIX}LikeTinTuyenDung?Id=${Id}`, false, true)
    return res
}

//api/nguoi-tim-viec/UnLikeTinTuyenDung?Id=
export async function UnLikeTinTuyenDung(Id) {
    const res = await Utils.get_api(`${PREFIX}UnLikeTinTuyenDung?Id=${Id}`, false, true)
    return res
}

//api/viec-tim-nguoi/LikeHoSoCV?Id=166
export async function LikeHoSoCV(Id) {
    const res = await Utils.get_api(`${PREFIX_ENTERPRISE}LikeHoSoCV?Id=${Id}`, false, true)
    return res
}

//api/viec-tim-nguoi/UnLikeHoSoCV?Id=
export async function UnLikeHoSoCV(Id) {
    const res = await Utils.get_api(`${PREFIX_ENTERPRISE}UnLikeHoSoCV?Id=${Id}`, false, true)
    return res
}

//api/viec-tim-nguoi/GetDetailTuyenDungDoanhNghiep?Id=64
export async function GetDetailTuyenDungDoanhNghiep(Id) {
    const res = await Utils.get_api(`${PREFIX_ENTERPRISE}GetDetailTuyenDungDoanhNghiep?Id=${Id}`, false, true)
    return res
}

//api/dung-chung/GetListNotifyByUserId
export async function GetListNotifyByUserId(objFilter = {
    "query.more": false,
    "query.page": 1,
    "query.record": 10,
    "query.sortField": "",
    "query.sortOrder": "",
    "query.filter.keys": "",
    "query.filter.vals": "",
}) {
    let filter = ''
    for (const property in objFilter) {
        filter = filter + `&${property}=${objFilter[property]}`
    }
    const res = await Utils.get_api(`api/dung-chung/GetListNotifyByUserId?${filter}`, false, true);
    return res
}

// Id=0: Cập nhật tất cả thông báo của user đang đăng nhập thành đã xem
// Id>0: Cập nhật thông báo có Id tương ứng thành đã xem
//api/dung-chung/UpdateIsSeen?Id=0
export async function UpdateIsSeen(Id) {
    const res = await Utils.get_api(`api/dung-chung/UpdateIsSeen?Id=${Id}`, false, true);
    return res
}

// Gửi đánh giá
// https://dt-hong-ngu-admin-api.vts-paht.com/api/dung-chung/DanhGia
export async function PostDanhGia(objBody) {
    const strBody = JSON.stringify(objBody);
    const res = await Utils.post_api('api/dung-chung/DanhGia', strBody, false, false);
    return res
}

// Get danh sách đánh giá
// 1 tin tuyển dụng 0 là CV
// https://dt-hong-ngu-admin-api.vts-paht.com/api/dung-chung/List_DanhGia?query.more=false&query.record=10&query.page=1&query.filter.keys=Type|Id&query.filter.vals=1
export async function GetListDanhGia(Id, Page, Type, Size) {
    const res = await Utils.get_api(`api/dung-chung/List_DanhGia?query.more=false&query.record=${Size}&query.page=${Page}&query.filter.keys=Type|Id|IsActive&query.filter.vals=${Type}|${Id}|1`, false, true);
    return res
}

