import AppCodeConfig from "../../app/AppCodeConfig";
import Utils from "../../app/Utils";


async function Get_BieuDoPATongQuan(thang = '', linhvuc = '') {
    let filterapi = thang || linhvuc ? `?ThangNam=${thang}&LinhVuc=${linhvuc}` : '';
    let res = await Utils.get_api('api/bieudo/BieuDo_BieuDoPATongQuan' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);

    return res;
}


async function Get_BieuDo_Top5KhuVucPA(thang = '', linhvuc = '') {
    let filterapi = thang || linhvuc ? `?ThangNam=${thang}&LinhVuc=${linhvuc}` : '';
    let res = await Utils.get_api('api/bieudo/BieuDo_Top5KhuVucPA' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;
}

async function Get_BieuDo_DienBienXuLyPATrong6Thang(thang = '', linhvuc = '') {
    let filterapi = thang || linhvuc ? `?ThangNam=${thang}&LinhVuc=${linhvuc}` : '';
    let res = await Utils.get_api('api/bieudo/BieuDo_DienBienXuLyPATrong6Thang' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;
}

async function Get_BieuDo_Top5DonViXuLyChamNhat(thang = '', linhvuc = '') {
    let filterapi = thang || linhvuc ? `?ThangNam=${thang}&LinhVuc=${linhvuc}` : '';
    let res = await Utils.get_api('api/bieudo/BieuDo_Top5DonViXuLyChamNhat' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;
}
async function Get_BieuDo_Top5DonViPhanHoiTotNhat(thang = '', linhvuc = '') {
    let filterapi = thang || linhvuc ? `?ThangNam=${thang}&LinhVuc=${linhvuc}` : '';
    let res = await Utils.get_api('api/bieudo/BieuDo_Top5DonViPhanHoiTotNhat' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;
}

async function Get_BieuDo_Top5DonViPhanHoiTeNhat(thang = '', linhvuc = '') {
    let filterapi = thang || linhvuc ? `?ThangNam=${thang}&LinhVuc=${linhvuc}` : '';
    let res = await Utils.get_api('api/bieudo/BieuDo_Top5DonViPhanHoiTeNhat' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;
}
async function Get_BieuDo_Top5DonViXuLyTotNhat(thang = '', linhvuc = '') {
    let filterapi = thang || linhvuc ? `?ThangNam=${thang}&LinhVuc=${linhvuc}` : '';
    let res = await Utils.get_api('api/bieudo/BieuDo_Top5DonViXuLyTotNhat' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;
}

async function Get_BieuDo_Top5LinhVucBiPANhieuNhat(thang = '', linhvuc = '') {
    let filterapi = thang || linhvuc ? `?ThangNam=${thang}&LinhVuc=${linhvuc}` : '';
    let res = await Utils.get_api('api/bieudo/BieuDo_Top5LinhVucBiPANhieuNhat' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    console.log(res);
    return res;
}
async function Get_BieuDo_Top5LinhVucTonNhieuPA(thang = '', linhvuc = '') {
    let filterapi = thang || linhvuc ? `?ThangNam=${thang}&LinhVuc=${linhvuc}` : '';
    let res = await Utils.get_api('api/bieudo/BieuDo_Top5LinhVucTonNhieuPA' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;
}

async function Get_BieuDo_Top5LinhVucXuLyNhieuPA(thang = '', linhvuc = '') {
    let filterapi = thang || linhvuc ? `?ThangNam=${thang}&LinhVuc=${linhvuc}` : '';
    let res = await Utils.get_api('api/bieudo/BieuDo_Top5LinhVucXuLyNhieuPA' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;
}

async function Get_List_LinhVuc() {
    let res = await Utils.get_api('api/linhvuc/GetList_LinhVuc?query.more=true', false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;
}

async function Get_BieuDo_Top5KhuVucPA_Chitiet(page = 1, record = 10, IdDVXL = 0, ThangNam = '', LinhVuc = 0) {
    let filterapi = `?page=${page}&record=${record}&filter.keys=IdDVXL|ThangNam|LinhVuc&filter.vals=${IdDVXL}|${ThangNam}|${LinhVuc === 0 ? '' : LinhVuc}`
    let res = await Utils.get_api('api/ChiTietChart/GetList_Top5KhuVucPA_ChiTiet' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;

}
async function GetList_Top5LinhVucXuLyNhieuPA_ChiTiet(page = 1, record = 10, ThangNam = '', LinhVuc = 0) {
    let filterapi = `?page=${page}&record=${record}&filter.keys=LinhVuc|ThangNam&filter.vals=${LinhVuc === 0 ? '' : LinhVuc}|${ThangNam}`
    let res = await Utils.get_api('api/ChiTietChart/GetList_Top5LinhVucXuLyNhieuPA_ChiTiet' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;

}

async function GetList_Top5LinhVucTonNhieuPA_ChiTiet(page = 1, record = 10, ThangNam = '', LinhVuc = 0) {
    let filterapi = `?page=${page}&record=${record}&filter.keys=LinhVuc|ThangNam&filter.vals=${LinhVuc === 0 ? '' : LinhVuc}|${ThangNam}`
    let res = await Utils.get_api('api/ChiTietChart/GetList_Top5LinhVucTonNhieuPA_ChiTiet' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;

}

async function GetList_DienBienXuLyPATrong6Thang_ChiTiet(page = 1, record = 10, ThangNam = '', LinhVuc = 0, TreHan = -1) {
    let filterapi = `?page=${page}&record=${record}&filter.keys=ThangNam|LinhVuc|TreHen&filter.vals=${ThangNam}|${LinhVuc === 0 ? '' : LinhVuc}|${TreHan === -1 ? '' : TreHan}`
    let res = await Utils.get_api('api/ChiTietChart/GetList_DienBienXuLyPATrong6Thang_ChiTiet' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;

}

async function GetList_Top5LinhVucBiPANhieuNhat_ChiTiet(page = 1, record = 10, ThangNam = '', LinhVuc = 0, status = 0) {
    let filterapi = `?page=${page}&record=${record}&filter.keys=LinhVuc|ThangNam|Status&filter.vals=${LinhVuc}|${ThangNam}|${status === 0 ? '' : status}`
    let res = await Utils.get_api('api/ChiTietChart/GetList_Top5LinhVucBiPANhieuNhat_ChiTiet' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;
}

async function GetList_Top5DonViXuLyTheoHen_ChiTiet(page = 1, record = 10, ThangNam = '', LinhVuc = 0, IdDVXL = 0, TreHen = -1) {
    let filterapi = `?page=${page}&record=${record}&filter.keys=IdDVXL|ThangNam|LinhVuc|TreHen&filter.vals=${IdDVXL}|${ThangNam}|${LinhVuc === 0 ? '' : LinhVuc}|${TreHen === -1 ? '' : TreHen}`
    let res = await Utils.get_api('api/ChiTietChart/GetList_Top5DonViXuLyTheoHen_ChiTiet' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;
}

async function GetList_Top5DonViXuLyTheoHenTot_ChiTiet(page = 1, record = 10, ThangNam = '', LinhVuc = 0, IdDVXL = 0, TreHen = -1) {
    let filterapi = `?page=${page}&record=${record}&filter.keys=IdDVXL|ThangNam|LinhVuc|TreHen&filter.vals=${IdDVXL}|${ThangNam}|${LinhVuc === 0 ? '' : LinhVuc}|${TreHen === -1 ? '' : TreHen}`
    let res = await Utils.get_api('api/ChiTietChart/GetList_Top5DonViXuLyTheoHen_ChiTiet' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;
}

async function GetList_Top5DonViPhanHoiDanhGia_ChiTiet(page = 1, record = 10, ThangNam = '', LinhVuc = 0, IdDVXL = 0, typeItem = '1,2') {
    let filterapi = `?page=${page}&record=${record}&filter.keys=IdDVXL|ThangNam|LinhVuc|DanhGia&filter.vals=${IdDVXL}|${ThangNam}|${LinhVuc === 0 ? '' : LinhVuc}|${typeItem}`
    let res = await Utils.get_api('api/ChiTietChart/GetList_Top5DonViPhanHoiDanhGia_ChiTiet' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;
}

async function GetList_Top5DonViPhanHoiDanhGiaTot_ChiTiet(page = 1, record = 10, ThangNam = '', LinhVuc = 0, IdDVXL = 0, typeItem = '1,2') {
    let filterapi = `?page=${page}&record=${record}&filter.keys=IdDVXL|ThangNam|LinhVuc|DanhGia&filter.vals=${IdDVXL}|${ThangNam}|${LinhVuc === 0 ? '' : LinhVuc}|${typeItem}`
    let res = await Utils.get_api('api/ChiTietChart/GetList_Top5DonViPhanHoiDanhGia_ChiTiet' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;
}

async function GetList_PATongQuanTheoTrangThai_ChiTiet(page = 1, record = 10, ThangNam = '', LinhVuc = 0, TreHen = -1, status = 0) {
    let filterapi = `?page=${page}&record=${record}&filter.keys=ThangNam|LinhVuc|TreHen|Status&filter.vals=${ThangNam}|${LinhVuc === 0 ? '' : LinhVuc}|${TreHen === -1 ? '' : TreHen}|${status === 0 ? '' : status}`
    let res = await Utils.get_api('api/ChiTietChart/GetList_PATongQuanTheoTrangThai_ChiTiet' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res
}

async function GetList_PATongQuanTheoThoiHan_ChiTiet(page = 1, record = 10, ThangNam = '', LinhVuc = 0, TreHen = -1) {
    let filterapi = `?page=${page}&record=${record}&filter.keys=ThangNam|LinhVuc|TreHen|&filter.vals=${ThangNam}|${LinhVuc === 0 ? '' : LinhVuc}|${TreHen === -1 ? '' : TreHen}`
    let res = await Utils.get_api('api/ChiTietChart/GetList_PATongQuanTheoThoiHan_ChiTiet' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;
}

async function GetList_PATongQuanTheoDanhGia_ChiTiet(page = 1, record = 10, ThangNam = '', LinhVuc = 0, DanhGia = '') {
    let filterapi = `?page=${page}&record=${record}&filter.keys=ThangNam|LinhVuc|DanhGia&filter.vals=${ThangNam}|${LinhVuc === 0 ? '' : LinhVuc}|${DanhGia === '' ? '' : DanhGia}`
    let res = await Utils.get_api('api/ChiTietChart/GetList_PATongQuanTheoDanhGia_ChiTiet' + filterapi, false, true, false,
        AppCodeConfig.APP_ADMIN);
    return res;
}





export {
    Get_BieuDoPATongQuan, Get_BieuDo_Top5KhuVucPA, Get_BieuDo_DienBienXuLyPATrong6Thang,
    Get_BieuDo_Top5DonViPhanHoiTotNhat, Get_BieuDo_Top5DonViXuLyChamNhat, Get_BieuDo_Top5DonViPhanHoiTeNhat,
    Get_BieuDo_Top5DonViXuLyTotNhat, Get_BieuDo_Top5LinhVucBiPANhieuNhat, Get_BieuDo_Top5LinhVucTonNhieuPA,
    Get_BieuDo_Top5LinhVucXuLyNhieuPA, Get_List_LinhVuc, Get_BieuDo_Top5KhuVucPA_Chitiet, GetList_Top5LinhVucXuLyNhieuPA_ChiTiet,
    GetList_Top5LinhVucTonNhieuPA_ChiTiet, GetList_DienBienXuLyPATrong6Thang_ChiTiet, GetList_Top5LinhVucBiPANhieuNhat_ChiTiet,
    GetList_Top5DonViXuLyTheoHen_ChiTiet, GetList_Top5DonViXuLyTheoHenTot_ChiTiet, GetList_Top5DonViPhanHoiDanhGia_ChiTiet,
    GetList_Top5DonViPhanHoiDanhGiaTot_ChiTiet, GetList_PATongQuanTheoTrangThai_ChiTiet, GetList_PATongQuanTheoThoiHan_ChiTiet,
    GetList_PATongQuanTheoDanhGia_ChiTiet
};