import URL, { onAxiosPost, formatNumber } from './Config';

import Type from '../Redux/Type';
import { GetTong, ITongSoLieu, GetBieuDo, ITongSoLieuMucDo34 } from '../Interface/DichVuCong';
import { OptionState } from '../Interface/Option';
import type { LastOption } from '../Interface/Option';
import { store } from '../../../srcRedux/store';
const LIMIT_RANGE = 3;

export const getTongSoLieu = () => {
    store.dispatch({ type: Type.DVC.TONGSOLIEU.LOADING, value: true });
    store.dispatch({ type: Type.DVC.TONGSOLIEU.IS_ERROR, value: false });
    store.dispatch({ type: Type.DVC.TONGSOLIEU.IS_EMPTY, value: false });

    let state: OptionState = store.getState()['Option'];

    let payload: GetTong = {
        Option: state.TypeOption,
        Nam: state.Nam.Chon,
        Thang: state.Thang.Chon,
        DonVi: state.DonVi.Chon,
    },

        onSuccess = ({ statusCode, response }) => {
            switch (statusCode) {
                case 200: {
                    response = response[0];
                    if (payload.Option !== 4) {
                        let tongSoLieu: ITongSoLieu = {
                            TiepNhan: formatNumber(response['TIEP_NHAN']),
                            DaGiaiQuyet: formatNumber(response['DA_GQ_DUNG_HAN']),
                            ChuaGiaiQuyet: formatNumber(response['CHUA_GQ']),
                            ChuaGiaiQuyetQuaHan: formatNumber(response['CHUA_GQ_QUA_HAN']),
                            Ton: formatNumber(response['TON_TRUOC']),
                            DaTra: formatNumber(response['DA_TRA']),
                        };
                        store.dispatch({ type: Type.DVC.TONGSOLIEU.DATA, value: tongSoLieu });
                    }
                    else {
                        let tongSoLieu: ITongSoLieuMucDo34 = {
                            TiepNhan: formatNumber(response['TIEP_NHAN']),
                            TiepNhanMucDo3: formatNumber(response['TIEP_NHAN_MUC_DO_3']),
                            TiepNhanMucDo4: formatNumber(response['TIEP_NHAN_MUC_DO_4']),
                            TrucTuyen: formatNumber(response['TRUC_TUYEN']),
                            DaGiaiQuyet34: formatNumber(response['DA_GIAI_QUYET_34']),
                        };
                        store.dispatch({ type: Type.DVC.TONGSOLIEU.DATA, value: tongSoLieu });
                    }
                }
                    break;
                case 201:
                    store.dispatch({ type: Type.DVC.TONGSOLIEU.IS_EMPTY, value: true });
                    break;
                default:
                    store.dispatch({ type: Type.DVC.TONGSOLIEU.IS_ERROR, value: true });
                    break;
            }
            store.dispatch({ type: Type.DVC.TONGSOLIEU.LOADING, value: false });
        };
    console.log("Loading", payload.Nam);
    onAxiosPost(URL.getTongSoLieu, onSuccess, payload).catch();
};

export const getDonVi = () => {
    let state: OptionState = store.getState()['Option'];

    let onSuccess = ({ statusCode, response }) => {
        if (statusCode === 200) {
            store.dispatch({ type: Type.OPTION.DONVI.LIST, value: response });

        }
    };

    onAxiosPost(URL.getDonVi(state.TypeOption), onSuccess, null, true).catch();
};

export const getBieuDoHoSoTon = () => {
    store.dispatch({ type: Type.DVC.HOSOTON.LOADING, value: true });
    store.dispatch({ type: Type.DVC.HOSOTON.IS_ERROR, value: false });
    store.dispatch({ type: Type.DVC.HOSOTON.IS_EMPTY, value: false });
    let state: OptionState = store.getState()['Option'];
    let payload: GetBieuDo = {
        Option: state.TypeOption,
        DonVi: state.DonVi.Chon,
        Limit: 0,
        Loai: 'HoSoTon',
        Nam: state.Nam.Chon,
        Thang: state.Thang.Chon,
    },
        onSuccess = ({ statusCode, response }) => {
            switch (statusCode) {
                case 200: {
                    let dataShow = [],
                        maxValue = response[0].VALUE;
                    response.forEach((item) => {
                        if (item.VALUE > maxValue) {
                            maxValue = item.VALUE;
                        }
                    });

                    response = response.map((item) => ({
                        ID: item.ID,
                        title: item.LABEL,
                        value: formatNumber(item.VALUE),
                        percent: item.VALUE * 95 / maxValue,
                    }));

                    if (!payload.Option) {
                        dataShow = response;
                        dataShow.reverse();
                        dataShow = dataShow.slice(0, LIMIT_RANGE);
                    } else {
                        dataShow = response.slice(0, LIMIT_RANGE);
                    }

                    store.dispatch({ type: Type.DVC.HOSOTON.DATA, value: dataShow });
                    store.dispatch({ type: Type.DVC.HOSOTON.DATA_DETAIL, value: response });
                }
                    break;
                case 201:
                    store.dispatch({ type: Type.DVC.HOSOTON.IS_EMPTY, value: true });
                    break;
                default:
                    store.dispatch({ type: Type.DVC.HOSOTON.IS_ERROR, value: true });
                    break;
            }
            store.dispatch({ type: Type.DVC.HOSOTON.LOADING, value: false });
        };
    onAxiosPost(URL.getBieuDo, onSuccess, payload).catch();
};

export const getBieuHoSoQuaHan = () => {
    store.dispatch({ type: Type.DVC.HOSOQUAHAN.LOADING, value: true });
    store.dispatch({ type: Type.DVC.HOSOQUAHAN.IS_ERROR, value: false });
    store.dispatch({ type: Type.DVC.HOSOQUAHAN.IS_EMPTY, value: false });
    let state: OptionState = store.getState()['Option'];
    let payload: GetBieuDo = {
        Option: state.TypeOption,
        DonVi: state.DonVi.Chon,
        Limit: 0,
        Loai: 'HoSoQuaHan',
        Nam: state.Nam.Chon,
        Thang: state.Thang.Chon,
    },
        onSuccess = ({ statusCode, response }) => {
            switch (statusCode) {
                case 200: {
                    let dataShow = [],
                        maxValue = response[0].VALUE;
                    response.forEach((item) => {
                        if (item.VALUE > maxValue) {
                            maxValue = item.VALUE;
                        }
                    });

                    response = response.map((item) => ({
                        ID: item.ID,
                        title: item.LABEL,
                        leftPercent: item.DA_GQ_QUA_HAN_PERCENT,
                        rightPercent: item.CHUA_GQ_QUA_HAN_PERCENT,
                        leftValue: formatNumber(item.DA_GQ_QUA_HAN),
                        rightValue: formatNumber(item.CHUA_GQ_QUA_HAN),
                    }));

                    if (!payload.Option) {
                        dataShow = response;
                        dataShow.reverse();
                        dataShow = dataShow.slice(0, LIMIT_RANGE);
                    } else {
                        dataShow = response.slice(0, LIMIT_RANGE);
                    }

                    store.dispatch({ type: Type.DVC.HOSOQUAHAN.DATA, value: dataShow });
                    store.dispatch({ type: Type.DVC.HOSOQUAHAN.DATA_DETAIL, value: response });
                }
                    break;
                case 201:
                    store.dispatch({ type: Type.DVC.HOSOQUAHAN.IS_EMPTY, value: true });
                    break;
                default:
                    store.dispatch({ type: Type.DVC.HOSOQUAHAN.IS_ERROR, value: true });
                    break;
            }
            store.dispatch({ type: Type.DVC.HOSOQUAHAN.LOADING, value: false });
        };
    onAxiosPost(URL.getBieuDo, onSuccess, payload).catch();
};

export const getBieuHoSoChuaGiaiQuyet = () => {
    store.dispatch({ type: Type.DVC.CHUAGIAIQUYET.LOADING, value: true });
    store.dispatch({ type: Type.DVC.CHUAGIAIQUYET.IS_ERROR, value: false });
    store.dispatch({ type: Type.DVC.CHUAGIAIQUYET.IS_EMPTY, value: false });
    let state: OptionState = store.getState()['Option'];
    let payload: GetBieuDo = {
        Option: state.TypeOption,
        DonVi: state.DonVi.Chon,
        Limit: 0,
        Loai: 'HoSoChuaGiaiQuyet',
        Nam: state.Nam.Chon,
        Thang: state.Thang.Chon,
    },
        onSuccess = ({ statusCode, response }) => {
            switch (statusCode) {
                case 200: {
                    let dataShow = [];
                    let dataShowDetail = [];
                    if (!payload.Option) {
                        let maxValue = response[0].TONG;
                        response.forEach((item) => {
                            if (item.TONG > maxValue) {
                                maxValue = item.TONG;
                            }
                        });

                        response = response.map((item) => ({
                            ID: item.ID,
                            title: item.LABEL,
                            rightValue: item.CHUA_GQ_QUA_HAN,
                            rootPercent: item.TONG * 95 / maxValue,
                            leftPercent: formatNumber(item.CHUA_GQ_TRONG_HAN_PERCENT),
                            leftValue: formatNumber(item.CHUA_GQ_TRONG_HAN),
                        }));
                        dataShowDetail = response;
                        dataShow = response;
                        dataShow.reverse();
                        dataShow = dataShow.slice(0, LIMIT_RANGE);
                    } else {
                        dataShow = []
                        let dataTongTempt = [];
                        let dataChuaGQTempt = [];
                        response.forEach((item) => {
                            const leftPercentTong = (item.TONG / (item.TONG + item.CHUA_GQ_QUA_HAN)) * 100;
                            dataTongTempt.push({
                                ID: item.ID,
                                title: item.LABEL,
                                rightValue: formatNumber(item.CHUA_GQ_QUA_HAN),
                                rightPercent: leftPercentTong ? (100 - leftPercentTong) : (!item.CHUA_GQ_QUA_HAN ? 0 : 100),
                                rootPercent: 100,
                                leftPercent: leftPercentTong,
                                leftValue: formatNumber(item.TONG),
                            });
                            dataChuaGQTempt.push({
                                ID: item.ID,
                                title: item.LABEL,
                                rightValue: formatNumber(item.CHUA_GQ_QUA_HAN),
                                rightPercent: item.CHUA_GQ_TRONG_HAN ? (100 - item.CHUA_GQ_TRONG_HAN_PERCENT) : (!item.CHUA_GQ_QUA_HAN ? 0 : 100),
                                rootPercent: 100,
                                leftPercent: item.CHUA_GQ_TRONG_HAN_PERCENT,
                                leftValue: formatNumber(item.CHUA_GQ_TRONG_HAN),
                            });
                        });
                        dataShow.push(dataTongTempt.slice(0, LIMIT_RANGE), dataChuaGQTempt.slice(0, LIMIT_RANGE));
                        dataShowDetail.push(dataTongTempt, dataChuaGQTempt)
                    }
                    store.dispatch({ type: Type.DVC.CHUAGIAIQUYET.DATA, value: dataShow });
                    store.dispatch({ type: Type.DVC.CHUAGIAIQUYET.DATA_DETAIL, value: dataShowDetail });

                }
                    break;
                case 201:
                    store.dispatch({ type: Type.DVC.CHUAGIAIQUYET.IS_EMPTY, value: true });
                    break;
                default:
                    store.dispatch({ type: Type.DVC.CHUAGIAIQUYET.IS_ERROR, value: true });
                    break;
            }
            store.dispatch({ type: Type.DVC.CHUAGIAIQUYET.LOADING, value: false });
        };

    onAxiosPost(URL.getBieuDo, onSuccess, payload).catch();
};

export const getBieuHoSoDaGiaiQuyet = () => {
    store.dispatch({ type: Type.DVC.DAGIAIQUYET.LOADING, value: true });
    store.dispatch({ type: Type.DVC.DAGIAIQUYET.IS_ERROR, value: false });
    store.dispatch({ type: Type.DVC.DAGIAIQUYET.IS_EMPTY, value: false });
    let state: OptionState = store.getState()['Option'];
    let payload: GetBieuDo = {
        Option: state.TypeOption,
        DonVi: state.DonVi.Chon,
        Limit: 0,
        Loai: 'HoSoDaGiaiQuyet',
        Nam: state.Nam.Chon,
        Thang: state.Thang.Chon,
    },
        onSuccess = ({ statusCode, response }) => {
            switch (statusCode) {
                case 200: {
                    let dataShow = [];
                    if (payload.Option === 0) {
                        let maxValue = response[0].TONG;
                        response.forEach((item) => {
                            if (item.TONG > maxValue) {
                                maxValue = item.TONG;
                            }
                        });

                        response = response.map((item) => ({
                            ID: item.ID,
                            title: item.LABEL,
                            leftPercent: (item.DA_GQ_TRUOC_HAN / item.TONG) * 100,
                            middlePercent: (item.DA_GQ_DUNG_HAN / item.TONG) * 100,
                            rightPercent: (item.DA_GQ_QUA_HAN / item.TONG) * 100,
                            leftValue: formatNumber(item.DA_GQ_TRUOC_HAN),
                            middleValue: formatNumber(item.DA_GQ_DUNG_HAN),
                            rightValue: formatNumber(item.DA_GQ_QUA_HAN),
                            rootPercent: item.TONG * 95 / maxValue,
                        }));

                        dataShow = response;
                        dataShow.reverse();
                        dataShow = dataShow.slice(0, LIMIT_RANGE);
                    } else if (payload.Option == 1 || payload.Option == 2 || payload.Option == 3) {
                        response = response.map((item) => (
                            {
                                ID: item.ID,
                                title: item.LABEL,
                                leftPercent: (item.DA_GQ_TRUOC_HAN / item.TONG) * 100,
                                middlePercent: (item.DA_GQ_DUNG_HAN / item.TONG) * 100,
                                rightPercent: (item.DA_GQ_QUA_HAN / item.TONG) * 100,
                                leftValue: formatNumber(item.DA_GQ_TRUOC_HAN),
                                middleValue: formatNumber(item.DA_GQ_DUNG_HAN),
                                rightValue: formatNumber(item.DA_GQ_QUA_HAN),
                                rootPercent: 100,
                            }
                        ));
                        dataShow = response.slice(0, LIMIT_RANGE);
                    } else {
                        response = response.map((item) => (
                            {
                                ID: item.ID,
                                title: item.LABEL,
                                leftPercent: item.TIEP_NHAN_PERCENT,
                                rightPercent: item.GIAI_QUYET_PERCENT,
                                leftValue: formatNumber(item.TIEP_NHAN),
                                rightValue: formatNumber(item.GIAI_QUYET),
                                rootPercent: 100,
                            }
                        ));
                        dataShow = response.slice(0, LIMIT_RANGE);
                    }
                    store.dispatch({ type: Type.DVC.DAGIAIQUYET.DATA, value: dataShow });
                    store.dispatch({ type: Type.DVC.DAGIAIQUYET.DATA_DETAIL, value: response });

                }
                    break;
                case 201:
                    store.dispatch({ type: Type.DVC.DAGIAIQUYET.IS_EMPTY, value: true });
                    break;
                default:
                    store.dispatch({ type: Type.DVC.DAGIAIQUYET.IS_ERROR, value: true });
                    break;
            }
            store.dispatch({ type: Type.DVC.DAGIAIQUYET.LOADING, value: false });
        };

    onAxiosPost(URL.getBieuDo, onSuccess, payload).catch();
};

export const getBieuHoSoDaTra = () => {
    store.dispatch({ type: Type.DVC.DATRA.LOADING, value: true });
    store.dispatch({ type: Type.DVC.DATRA.IS_ERROR, value: false });
    store.dispatch({ type: Type.DVC.DATRA.IS_EMPTY, value: false });
    let state: OptionState = store.getState()['Option'];
    let payload: GetBieuDo = {
        Option: state.TypeOption,
        DonVi: state.DonVi.Chon,
        Limit: 0,
        Loai: 'HoSoDaTra',
        Nam: state.Nam.Chon,
        Thang: state.Thang.Chon,
    },
        onSuccess = ({ statusCode, response }) => {
            switch (statusCode) {
                case 200: {
                    let dataShow = [];
                    if (!payload.Option) {
                        response = response.map((item) => ({
                            ID: item.ID,
                            title: `Tháng: ` + item.LABEL,
                            leftPercent: item.DA_TRA_PERCENT,
                            rightPercent: item.CHUA_TRA_PERCENT,
                            leftValue: formatNumber(item.DA_TRA),
                            rightValue: formatNumber(item.CHUA_TRA),
                        }));

                        dataShow = response;
                        dataShow.reverse();
                        dataShow = dataShow.slice(0, LIMIT_RANGE);
                    } else {
                        response = response.map((item) => (
                            {
                                ID: item.ID,
                                title: item.LABEL,
                                leftPercent: item.DA_TRA_PERCENT ? item.DA_TRA_PERCENT : 0,
                                rightPercent: item.CHUA_TRA_PERCENT ? item.CHUA_TRA_PERCENT : 0,
                                leftValue: formatNumber(item.DA_TRA),
                                rightValue: formatNumber(item.CHUA_TRA),
                                rootPercent: 100
                            }
                        ));
                        dataShow = response.slice(0, LIMIT_RANGE);
                    }
                    store.dispatch({ type: Type.DVC.DATRA.DATA, value: dataShow });
                    store.dispatch({ type: Type.DVC.DATRA.DATA_DETAIL, value: response });
                }
                    break;
                case 201:
                    store.dispatch({ type: Type.DVC.DATRA.IS_EMPTY, value: true });
                    break;
                default:
                    store.dispatch({ type: Type.DVC.DATRA.IS_ERROR, value: true });
                    break;
            }
            store.dispatch({ type: Type.DVC.DATRA.LOADING, value: false });
        };

    onAxiosPost(URL.getBieuDo, onSuccess, payload).catch();
};

export const getBieuTuongQuanDaGQChuaGQ = () => {
    store.dispatch({ type: Type.DVC.TUONGQUANDAGQCHUAGQ.LOADING, value: true });
    store.dispatch({ type: Type.DVC.TUONGQUANDAGQCHUAGQ.IS_ERROR, value: false });
    store.dispatch({ type: Type.DVC.TUONGQUANDAGQCHUAGQ.IS_EMPTY, value: false });
    let state: OptionState = store.getState()['Option'];
    let payload: GetBieuDo = {
        Option: state.TypeOption,
        DonVi: state.DonVi.Chon,
        Limit: 0,
        Loai: 'TuongQuanDaGQChuaGQ',
        Nam: state.Nam.Chon,
        Thang: state.Thang.Chon,
    },
        onSuccess = ({ statusCode, response }) => {
            switch (statusCode) {
                case 200: {
                    let dataShow = [];
                    if (payload.Option) {
                        response = response.map((item) => ({
                            ID: item.ID,
                            title: item.LABEL,
                            leftPercent: item.DA_GQ_PERCENT,
                            rightPercent: item.CHUA_GQ_PERCENT,
                            leftValue: formatNumber(item.DA_GQ),
                            rightValue: formatNumber(item.CHUA_GQ),
                        }));

                        dataShow = response;
                        dataShow = dataShow.slice(0, LIMIT_RANGE);
                    }
                    store.dispatch({ type: Type.DVC.TUONGQUANDAGQCHUAGQ.DATA, value: dataShow });
                    store.dispatch({ type: Type.DVC.TUONGQUANDAGQCHUAGQ.DATA_DETAIL, value: response });
                }
                    break;
                case 201:
                    store.dispatch({ type: Type.DVC.TUONGQUANDAGQCHUAGQ.IS_EMPTY, value: true });
                    break;
                default:
                    store.dispatch({ type: Type.DVC.TUONGQUANDAGQCHUAGQ.IS_ERROR, value: true });
                    break;
            }
            store.dispatch({ type: Type.DVC.TUONGQUANDAGQCHUAGQ.LOADING, value: false });
        };
    onAxiosPost(URL.getBieuDo, onSuccess, payload).catch();
};

export const getTongHoSoTiepNhan = () => {
    store.dispatch({ type: Type.DVC.TONGHOSOTIEPNHAN.LOADING, value: true });
    store.dispatch({ type: Type.DVC.TONGHOSOTIEPNHAN.IS_ERROR, value: false });
    store.dispatch({ type: Type.DVC.TONGHOSOTIEPNHAN.IS_EMPTY, value: false });
    let state: OptionState = store.getState()['Option'];
    let payload: GetBieuDo = {
        Option: state.TypeOption,
        DonVi: state.DonVi.Chon,
        Limit: 0,
        Loai: 'HoSoTiepNhan',
        Nam: state.Nam.Chon,
        Thang: state.Thang.Chon,
    },
        onSuccess = ({ statusCode, response }) => {
            switch (statusCode) {
                case 200: {
                    let dataShow = [];
                    if (payload.Option) {
                        let maxValue = response[0].VALUE;
                        response.forEach((item) => {
                            if (item.VALUE > maxValue) {
                                maxValue = item.VALUE;
                            }
                        });

                        response = response.map((item) => ({
                            ID: item.ID,
                            title: item.LABEL,
                            value: formatNumber(item.VALUE),
                            percent: item.VALUE * 95 / maxValue,
                        }));
                        dataShow = response;
                        dataShow = dataShow.slice(0, LIMIT_RANGE);
                    }
                    store.dispatch({ type: Type.DVC.TONGHOSOTIEPNHAN.DATA, value: dataShow });
                    store.dispatch({ type: Type.DVC.TONGHOSOTIEPNHAN.DATA_DETAIL, value: response });
                }
                    break;
                case 201:
                    store.dispatch({ type: Type.DVC.TONGHOSOTIEPNHAN.IS_EMPTY, value: true });
                    break;
                default:
                    store.dispatch({ type: Type.DVC.TONGHOSOTIEPNHAN.IS_ERROR, value: true });
                    break;
            }
            store.dispatch({ type: Type.DVC.TONGHOSOTIEPNHAN.LOADING, value: false });
        };
    onAxiosPost(URL.getBieuDo, onSuccess, payload).catch();
};

export const getTongHoSoTiepNhanMucDo34 = () => {
    store.dispatch({ type: Type.DVC.TIEPNHANTHEOMUCDO.LOADING, value: true });
    store.dispatch({ type: Type.DVC.TIEPNHANTHEOMUCDO.IS_ERROR, value: false });
    store.dispatch({ type: Type.DVC.TIEPNHANTHEOMUCDO.IS_EMPTY, value: false });
    let state: OptionState = store.getState()['Option'];
    let payload: GetBieuDo = {
        Option: state.TypeOption,
        DonVi: state.DonVi.Chon,
        Limit: 0,
        Loai: 'HoSo32TiepNhan',
        Nam: state.Nam.Chon,
        Thang: state.Thang.Chon,
    },
        onSuccess = ({ statusCode, response }) => {
            switch (statusCode) {
                case 200: {
                    let dataShow = [];
                    if (payload.Option == 4) {
                        response = response.map((item) => ({
                            ID: item.ID,
                            title: item.LABEL,
                            leftPercent: item.MUC_DO_3_PERCENT,
                            rightPercent: item.MUC_DO_4_PERCENT,
                            leftValue: formatNumber(item.TIEP_NHAN_MUC_DO_3),
                            rightValue: formatNumber(item.TIEP_NHAN_MUC_DO_4),
                            rootPercent: 100
                        }));
                        dataShow = response;
                        dataShow = dataShow.slice(0, LIMIT_RANGE);
                    }
                    store.dispatch({ type: Type.DVC.TIEPNHANTHEOMUCDO.DATA, value: dataShow });
                    store.dispatch({ type: Type.DVC.TIEPNHANTHEOMUCDO.DATA_DETAIL, value: response });
                }
                    break;
                case 201:
                    store.dispatch({ type: Type.DVC.TIEPNHANTHEOMUCDO.IS_EMPTY, value: true });
                    break;
                default:
                    store.dispatch({ type: Type.DVC.TIEPNHANTHEOMUCDO.IS_ERROR, value: true });
                    break;
            }
            store.dispatch({ type: Type.DVC.TIEPNHANTHEOMUCDO.LOADING, value: false });
        };
    onAxiosPost(URL.getBieuDo, onSuccess, payload).catch();
};

export const getBieuDoHoSo34TrucTuyen = () => {
    store.dispatch({ type: Type.DVC.MUCDO34TRUCTUYEN.LOADING, value: true });
    store.dispatch({ type: Type.DVC.MUCDO34TRUCTUYEN.IS_ERROR, value: false });
    store.dispatch({ type: Type.DVC.MUCDO34TRUCTUYEN.IS_EMPTY, value: false });
    let state: OptionState = store.getState()['Option'];
    let payload: GetBieuDo = {
        Option: state.TypeOption,
        DonVi: state.DonVi.Chon,
        Limit: 0,
        Loai: 'HoSo32TrucTuyen',
        Nam: state.Nam.Chon,
        Thang: state.Thang.Chon,
    },
        onSuccess = ({ statusCode, response }) => {
            switch (statusCode) {
                case 200: {
                    let dataShow = [],
                        maxValue = response[0].TRUC_TUYEN;
                    response.forEach((item) => {
                        if (item.TRUC_TUYEN > maxValue) {
                            maxValue = item.TRUC_TUYEN;
                        }
                    });

                    response = response.map((item) => ({
                        ID: item.ID,
                        title: item.LABEL,
                        value: formatNumber(item.TRUC_TUYEN),
                        percent: item.TRUC_TUYEN * 95 / maxValue,
                    }));
                    dataShow = response;
                    dataShow = dataShow.slice(0, LIMIT_RANGE);
                    store.dispatch({ type: Type.DVC.MUCDO34TRUCTUYEN.DATA, value: dataShow });
                    store.dispatch({ type: Type.DVC.MUCDO34TRUCTUYEN.DATA_DETAIL, value: response });
                }
                    break;
                case 201:
                    store.dispatch({ type: Type.DVC.MUCDO34TRUCTUYEN.IS_EMPTY, value: true });
                    break;
                default:
                    store.dispatch({ type: Type.DVC.MUCDO34TRUCTUYEN.IS_ERROR, value: true });
                    break;
            }
            store.dispatch({ type: Type.DVC.MUCDO34TRUCTUYEN.LOADING, value: false });
        };
    onAxiosPost(URL.getBieuDo, onSuccess, payload).catch();
};


export const compareOption = () => {
    let option: OptionState = store.getState().Option,
        current: LastOption = {
            Thang: option.Thang.Chon,
            Nam: option.Nam.Chon,
            DonVi: option.DonVi.Chon,
            Option: option.TypeOption
        },
        past: LastOption = option.LastOption

    if (
        current.Thang.length === past.Thang.length
        && current.Nam === past.Nam
        && current.Option === past.Option
        && current.DonVi.length === past.DonVi.length
    ) {
        let flag = true;
        current.Thang.forEach((thang, index) => {
            if (thang !== past.Thang[index])
                flag = false
        })

        if (flag)
            current.DonVi.forEach((dv, index) => {
                if (dv !== past.DonVi[index])
                    flag = false
            })

        return flag
    }
    return false
}
