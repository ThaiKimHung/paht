
export interface DVCType {
    LOADING: string,
    DATA: string,
    IS_ERROR: string,
    IS_EMPTY: string
}

export interface GetTong {
    Option?: number,
    Nam?: number,
    Thang?: number[],
    DonVi?: number[]
}

export interface GetBieuDo {
    Loai: string,
    Option: number,
    Nam: number,
    Thang: number[],
    DonVi: number[],
    Limit: number
}

export interface ITongSoLieu {
    TiepNhan: string,
    DaGiaiQuyet: string,
    ChuaGiaiQuyet: string,
    ChuaGiaiQuyetQuaHan: string,
    DaTra: string,
    Ton: string
}

export interface ITongSoLieuMucDo34 {
    TiepNhan: string,
    TiepNhanMucDo3: String,
    TiepNhanMucDo4: String,
    TrucTuyen: String,
    DaGiaiQuyet34: String,
}

export interface IState {
    data: any[],
    isLoading: boolean,
    isError: boolean,
    isEmpty: boolean,
    dataDetail: any[]
}

export interface HoSoTon {
    ID: number,
}

export interface IDvcReducer {
    TongSoLieu: any,
    HoSoTon: any,
    HoSoQuaHan: any,
    ChuaGiaiQuyet: any,
    DaGiaiQuyet: any,
    DaTra: any,
    TuongQuanDaGQChuaGQ: any,
    TongHosoTiepNhan: any,
    TiepNhanTheoMucDo: any,
    MucDo34TrucTuyen: anny
}

export interface IChartHST {
    ID: number,
    Title: string,
    Value: string,
    percent: string
}

export const NAME_DVC_REDUCER = {
    TONG_SO_LIEU: 'TongSoLieu',
    HO_SO_TON: 'HoSoTon',
    HO_SO_QUA_HAN: 'HoSoQuaHan',
    HO_SO_CHUA_GQ: 'ChuaGiaiQuyet',
    HO_SO_DA_GQ: 'DaGiaiQuyet',
    HO_SO_DA_TRA: 'DaTra',
}

