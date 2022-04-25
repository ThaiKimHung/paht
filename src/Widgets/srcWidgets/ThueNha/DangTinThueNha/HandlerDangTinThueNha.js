import Utils from "../../../../../app/Utils"
import { ApiRaoVat } from "../../../apis"

export const getListMucGia = async (callback = () => { }) => {
    Utils.setToggleLoading(true)
    let res = await ApiRaoVat.GetList_AllMucGia()
    Utils.setToggleLoading(false)
    Utils.nlog('[LOG] res muc gia', res)
    if (res.status == 1 && res.data) {
        callback(res.data)
    } else {
        callback([])
    }
}

export const getListLoaiNha = async (callback = () => { }) => {
    Utils.setToggleLoading(true)
    let res = await ApiRaoVat.GetAllListDMLoaiNha()
    Utils.setToggleLoading(false)
    Utils.nlog('[LOG] res loai nha', res)
    if (res.status == 1 && res.data) {
        callback(res.data)
    } else {
        callback([])
    }
}