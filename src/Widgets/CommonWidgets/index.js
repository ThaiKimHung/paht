import { ImgWidget } from "../Assets"

export const KEY_ACTION_DANGTIN = {
    XOA: 'XOA',
    SUA: 'SUA',
    ANTIN: 'ANTIN',
    HIENTHI: 'HIENTHI',
    HETHANG: 'HETHANG',
    DANGTIN: 'DANGTIN'
}

export const DEFINE_TRANGTHAIHIENTHI = {
    AN: 1,
    HIENTHI: 2,
    HETHANG: 3
}

export const ACTION_DANGTIN = [
    {
        id: 1,
        name: 'Xoá',
        image: ImgWidget.icDelete,
        key: KEY_ACTION_DANGTIN.XOA,
        valueAPI: ''
    },
    {
        id: 2,
        name: 'Chỉnh sửa',
        image: ImgWidget.icEdit,
        key: KEY_ACTION_DANGTIN.SUA,
        valueAPI: ''
    },
    {
        id: 3,
        name: 'Ẩn tin',
        image: ImgWidget.icAnTin,
        key: KEY_ACTION_DANGTIN.ANTIN,
        valueAPI: DEFINE_TRANGTHAIHIENTHI.AN
    },
    {
        id: 4,
        name: 'Hiển thị',
        image: ImgWidget.icEye,
        key: KEY_ACTION_DANGTIN.HIENTHI,
        valueAPI: DEFINE_TRANGTHAIHIENTHI.HIENTHI
    },
    {
        id: 5,
        name: 'Hết hàng',
        image: ImgWidget.icHetHang,
        key: KEY_ACTION_DANGTIN.HETHANG,
        valueAPI: DEFINE_TRANGTHAIHIENTHI.HETHANG
    },
    {
        id: 6,
        name: 'Đăng tin',
        image: ImgWidget.icFile,
        key: KEY_ACTION_DANGTIN.DANGTIN,
        valueAPI: ''
    },
]

export const KEY_ACTION_TAOTIN = {
    'TAOVADANGNGAY': 'TAOVADANGNGAY',
    'CHITAO': 'CHITAO',
    'XEMLAI': 'XEMLAI',
}

export const ACTION_TAOTIN = [
    {
        id: 1,
        name: 'Tạo và đăng ngay',
        image: ImgWidget.icFile,
        key: KEY_ACTION_TAOTIN.TAOVADANGNGAY
    },
    {
        id: 2,
        name: 'Chỉ tạo',
        image: ImgWidget.icCreate,
        key: KEY_ACTION_TAOTIN.CHITAO
    },
    {
        id: 3,
        name: 'Xem lại',
        image: ImgWidget.icEye,
        key: KEY_ACTION_TAOTIN.XEMLAI
    }
]

export const ACTION_CHINHSUA = [
    {
        id: 2,
        name: 'Cập nhật',
        image: ImgWidget.icEdit,
        key: KEY_ACTION_TAOTIN.CHITAO
    },
    {
        id: 3,
        name: 'Xem lại',
        image: ImgWidget.icEye,
        key: KEY_ACTION_TAOTIN.XEMLAI
    }
]

export const THOIGIAN_THUENHA = [
    {
        IdThoiGianThue: 1,
        ThoiGianThueNha: 'Ngày'
    },
    {
        IdThoiGianThue: 2,
        ThoiGianThueNha: 'Tháng'
    },
    {
        IdThoiGianThue: 3,
        ThoiGianThueNha: 'Quý'
    },
    {
        IdThoiGianThue: 4,
        ThoiGianThueNha: 'Năm'
    },
]

export const KEY_ACTION_DANGTIN_THUENHA = {
    XOA: 'XOA',
    SUA: 'SUA',
    ANTIN: 'ANTIN',
    HIENTHI: 'HIENTHI',
}

export const ACTION_DANGTIN_THUENHA = [
    {
        id: 1,
        name: 'Xoá',
        image: ImgWidget.icDelete,
        key: KEY_ACTION_DANGTIN_THUENHA.XOA,
        valueAPI: ''
    },
    {
        id: 2,
        name: 'Chỉnh sửa',
        image: ImgWidget.icEdit,
        key: KEY_ACTION_DANGTIN_THUENHA.SUA,
        valueAPI: ''
    },
    {
        id: 3,
        name: 'Ẩn tin',
        image: ImgWidget.icAnTin,
        key: KEY_ACTION_DANGTIN_THUENHA.ANTIN,
        valueAPI: ''
    },
    {
        id: 4,
        name: 'Hiển thị',
        image: ImgWidget.icEye,
        key: KEY_ACTION_DANGTIN_THUENHA.HIENTHI,
        valueAPI: ''
    }
]