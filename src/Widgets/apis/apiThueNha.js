import Utils from "../../../app/Utils";

const PREFIX_THUENHA = `api/thue-nha/`

// api/thue-nha/AddEditTinThueNha
export async function AddEditTinThueNha(formdata) {
    let res = await Utils.post_api_formdata(`${PREFIX_THUENHA}AddEditTinThueNha`, formdata, false, true);
    return res
}

//List_TinThueNha_TheoNguoiDang
export async function List_TinThueNha_TheoNguoiDang(objFilter = {
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
    const res = await Utils.get_api(`${PREFIX_THUENHA}List_TinThueNha_TheoNguoiDang?${filter}`, false, true)
    return res
}

//GetTinThueNhaById?Id=2
export async function GetTinThueNhaById(Id) {
    const res = await Utils.get_api(`${PREFIX_THUENHA}GetTinThueNhaById?Id=${Id}`, false, true);
    return res
}

//Delete_TinThueNha?Id=
export async function Delete_TinThueNha(Id) {
    const res = await Utils.get_api(`${PREFIX_THUENHA}Delete_TinThueNha?Id=${Id}`, false, true);
    return res
}

//HienThi_TinThueNha
export async function HienThi_TinThueNha(Id, TTHienThiHienTai = false) {
    const res = await Utils.get_api(`${PREFIX_THUENHA}HienThi_TinThueNha?Id=${Id}&TTHienThiHienTai=${TTHienThiHienTai}`, false, true);
    return res
}

//List_TinThueNha_App
export async function List_TinThueNha_App(objFilter = {
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
    const res = await Utils.get_api(`${PREFIX_THUENHA}List_TinThueNha_App?${filter}`, false, true)
    return res
}