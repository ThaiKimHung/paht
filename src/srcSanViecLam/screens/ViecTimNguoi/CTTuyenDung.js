import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, StatusBar, RefreshControl } from 'react-native';
import Utils, { icon_typeToast } from '../../../../app/Utils';
import ImageCus from '../../../../components/ImageCus';
import { colors } from '../../../../styles';
import { colorsSVL } from '../../../../styles/color';
import { reText } from '../../../../styles/size';
import { heightStatusBar, nstyles } from '../../../../styles/styles';
import HeaderSVL from '../../components/HeaderSVL';
import ButtonSVL from '../../components/ButtonSVL';
import { ImagesSVL } from '../../images';
import TextApp from '../../../../components/TextApp';
import { GetChiTietTinTuyenDung, GetDetailViecLam, GetDetailTuyenDungCaNhan, UpdateStatusHienThi } from '../../apis/apiSVL';
import AutoHeightWebViewCus from '../../../../components/AutoHeightWebViewCus';
import { useDispatch, useSelector } from 'react-redux';
import { LikeRecruitment, LikeUnlikeApplied, LoadListRecruitmentSaved, Set_TinTuyenDung, UnLikeRecruitment, UnLikeRecruitmentSaved, ChangeIsHideShowEmployment, SetDataTinTuyenDung, LoadListRecruitmentPost, LoadListCvUserPublic } from '../../../../srcRedux/actions/sanvieclam/DataSVL';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import common, { DEFINE_SCREEN_DETAILS } from '../../common';
import { appConfig } from '../../../../app/Config';
import { store } from '../../../../srcRedux/store';
import moment from 'moment';
import { StatusHinhThucLamViec, StatusNguoiLaoDong, StatusNguoiLaoDongId } from '../HoSo/components/StatusCv'
import { StatusLoaiDoanhNghiep } from './components/StatusDangTin';
import { Images } from '../../../images';
import GroupContent from '../../components/GroupContent';
import { Transitioning, Transition } from 'react-native-reanimated'
import TextLine from '../../../../components/TextLine';
import HtmlViewCom from '../../../../components/HtmlView';;
import { ImgComp } from '../../../../components/ImagesComponent';
import ImagePickerNew from '../../../../components/ComponentApps/ImagePicker/ImagePickerNew';
import { IsLoading } from '../../../../components';
import DanhGiaTinTuyenDung from './components/DanhGiaTinTuyenDung';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const transition = (
    <Transition.Together>
        <Transition.In type='fade' durationMs={150} />
        <Transition.Change />
        <Transition.Out type='fade' durationMs={150} />
    </Transition.Together>
)

const dataMenu = [
    {
        id: 1,
        name: 'Photo',
        icon: ImgComp.icChoseImage
    },
    {
        id: 3,
        name: 'File',
        icon: ImgComp.icChoseFile
    }
]

const CTTuyenDung = (props) => {
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    const { LstCVOfUserPublic = [] } = useSelector(state => state.dataSVL)
    const [Data, setData] = useState({})
    const Go_Back = Utils.ngetParam({ props: props }, 'Go_Back', false)
    const IdDetails_IdScreen = Utils.ngetParam({ props: props }, 'Id', '')
    const [KeyScreenDetail, setKeyScreenDetail] = useState('')
    const [refresh, setRefresh] = useState(true)
    const refView = useRef(null)

    useEffect(() => {
        // IdDetails_IdScreen: ???????c ?????nh ngh??a v?? truy???n theo d???ng Id|KeyScreen v?? d???: 1|TuyenDung_CaNhan || 1%7CTuyenDung_CaNhan
        // M???t s??? tr?????ng h???p d???u  | khi truy???n s??? ?????i th??nh %7C
        HandlePreLoad()
    }, [IdDetails_IdScreen, Go_Back])

    const HandlePreLoad = () => {
        if (IdDetails_IdScreen?.length > 0) {
            let paramsData = [] // 
            //X??? l?? params navigation & params deeplink
            if (IdDetails_IdScreen?.includes('%7C'))
                paramsData = IdDetails_IdScreen.toString().split("%7C");
            else
                paramsData = IdDetails_IdScreen.toString().split("|");
            Utils.nlog('[LOG] PARAMS DETAILS', paramsData)
            //Call API get chi ti???t theo m??n h??nh
            if (paramsData.length > 0) {
                setKeyScreenDetail(paramsData[1])
                getDetail(paramsData[0], paramsData[1] || '')
            }
        }
    }

    const getDetail = async (Id, KeyScreen) => {
        setRefresh(true)
        // setData('')
        switch (KeyScreen) {
            case DEFINE_SCREEN_DETAILS.TuyenDung_CaNhan.KeyScreen:
                {
                    Utils.nlog('vao load chi tiet  tin tuye ndung')
                    Utils.setToggleLoading(true)
                    let res = await GetDetailTuyenDungCaNhan(Id)
                    Utils.nlog('[???NG TUY???N --> CHI TI???T]:', res)
                    if (res.status == 1 && res.data) {
                        const { data } = res
                        setData(data)
                    } else {
                        Utils.nlog('l???i ')
                    }
                    Utils.setToggleLoading(false)
                }
                break;
            case DEFINE_SCREEN_DETAILS.DanhSach_BaiDangDoanhNghiep.KeyScreen:
                {
                    Utils.setToggleLoading(true)
                    let res = await GetChiTietTinTuyenDung(Id)
                    Utils.nlog('[????NG TIN] :', res)
                    if (res.status == 1 && res.data) {
                        const { data } = res
                        setData(data)
                    } else {
                        Utils.nlog('l???i ')
                    }
                    Utils.setToggleLoading(false)
                }
                break;
            case DEFINE_SCREEN_DETAILS.DanhSach_TinTuyenDung.KeyScreen:
                {
                    Utils.setToggleLoading(true)
                    let res = await GetDetailViecLam(Id)
                    Utils.nlog('[VI???C T??M NG?????I --> CHI TI???T]:', res)
                    if (res.status == 1 && res.data) {
                        const { data } = res
                        setData(data)
                    } else {
                        Utils.nlog('l???i ')
                    }
                    Utils.setToggleLoading(false)
                }
                break;
            default:
                break;
        }
        setRefresh(false)
    }

    const openMap = () => {
        Utils.showToastMsg('Th??ng b??o', '??ang ph??t tri???n, s??? c?? trong b???n c???p nh???t ti???p theo', icon_typeToast.info, 2000)
        // Utils.goscreen(this, "Modal_MapChiTietPA", { dataItem: Data })
    }

    const onShare = () => {
        Utils.showToastMsg('Th??ng b??o', '??ang ph??t tri???n, s??? c?? trong b???n c???p nh???t ti???p theo', icon_typeToast.info, 2000)
        // Utils.onShare(`${Data?.TieuDe}`, appConfig.linkWeb + 'vi/chi-tiet-phan-anh?id=' + idPA.toString());
        // Utils.onShare(`Tuy???n d???ng`, `${Data?.TieuDe} (${Data?.company})`)
        // Utils.goscreen(this, "Modal_MapChiTietPA", { dataItem: Data })
    }

    const nopHoSo = async () => {
        if (LstCVOfUserPublic.length > 0) {
            Utils.goscreen({ props }, 'Modal_ChonHoSo', { dataDetails: Data });
        } else {
            Utils.showMsgBoxYesNo({ props }, 'Th??ng b??o', 'B???n ch??a c?? h??? s?? (CV) n??o ???????c c??ng khai. T???o m???i ngay!', 'T???o ngay', '????? sau', () => {
                Utils.navigate('Sc_CreateCv')
            })
        }
    }

    const onSaveChange = () => {
        if (!refresh) {
            Utils.goscreen({ props }, 'PopupSave', {
                data: Data, isSave: Data?.IsLike == 0 ? true : false,
                callback: (itemcallback) => {
                    setData({ ...Data, IsLike: itemcallback?.IsLike });
                    if (itemcallback?.IsLike == 1) {
                        //Item ch??a l??u chuy???n tr???ng th??i th??nh l??u v???i IsLike : 1 -> Load l???i danh s??ch tin tuy???n d???ng ???? l??u
                        dispatch(LoadListRecruitmentSaved())
                        //Item ch??a l??u chuy???n tr???ng th??i th??nh l??u v???i IsLike : 1 -> Map la??? danh s??ch x??? l?? UI danh s??ch tin tuy???n d???ng
                        dispatch(LikeRecruitment(itemcallback))
                        //Item ch??a l??u chuy???n tr???ng th??i th??nh l??u v???i IsLike : 1 -> Map la??? danh s??ch x??? l?? UI l???ch s??? ???ng tuy???n
                        dispatch(LikeUnlikeApplied(itemcallback))
                    }
                    else {
                        //Item l??u chuy???n tr???ng th??i th??nh ch??a l??u v???i IsLike : 0 -> Map la??? danh s??ch x??? l?? UI danh s??ch tin tuy???n d???ng ???? l??u
                        dispatch(UnLikeRecruitmentSaved(itemcallback))
                        //Item l??u chuy???n tr???ng th??i th??nh ch??a l??u v???i IsLike : 0 -> Map la??? danh s??ch x??? l?? UI danh s??ch tin tuy???n d???ng
                        dispatch(UnLikeRecruitment(itemcallback))
                        //Item l??u chuy???n tr???ng th??i th??nh ch??a l??u v???i IsLike : 0 -> Map la??? danh s??ch ??? l?? UI l???ch s??? ???ng tuy???n
                        dispatch(LikeUnlikeApplied(itemcallback))
                    }
                }
            })
        }
    }

    const getDataDinhKem = () => {
        Utils.nlog('gia tri data', Data)
        let dataFileDichkem = [];
        if (Data?.FileDinhKem && Data?.FileDinhKem.length > 0) {
            for (let index = 0; index < Data.FileDinhKem.length; index++) {
                let item = Data.FileDinhKem[index];
                dataFileDichkem.push({
                    uri: appConfig.domain + item.FileDinhKem,
                    filename: item.FileDinhKem,
                    uriPath: item.FileDinhKem,
                    type: !item.FileDinhKem.includes("png" || "jpg" || ".jpeg") ? 3 : 1
                })
            }
        }
        return dataFileDichkem;
    }
    const OnNext = () => {
        if (Data.Status === 1) {
            return Utils.showMsgBoxOK({ props }, 'Th??ng b??o', "Tin ???? ki???m duy???t r???i kh??ng ???????c ph??p ch???nh s???a");
        }
        Utils.nlog('gia tri data', Data)
        dispatch(SetDataTinTuyenDung([
            {
                TypeDoanhNghiep: StatusLoaiDoanhNghiep(Data.TypeDoanhNghiep), // doanh nghi???p / c?? nh??n
                TypePerson: Data?.TypePerson != -1 ? {
                    title: StatusNguoiLaoDong(Data?.TypePerson), // to??n th???i  gian, b??n th???i gian
                    value: Data?.TypePerson,
                } : '',
                TypeTinTuyenDung: StatusHinhThucLamViec(Data.TypeTinTuyenDung),
                career: Data?.IdNganhNghe || Data?.IdNganhNghe === 0 ? { Id: Data?.IdNganhNghe, NganhNghe: Data?.IdNganhNghe === 0 ? '--Kh??ng ch???n--' : Data?.NganhNghe } : '',
                Chucvu: Data?.IdChucVu || Data?.IdChucVu === 0 ? { Id: Data?.IdChucVu, ChucVu: Data?.IdChucVu === 0 ? '--Kh??ng ch???n--' : Data?.ChucVu } : '',
                isShare: Data?.IsHienThi ? Data.IsHienThi : false,
                Id: Data?.Id,
                ChucVuKhac: Data?.ChucVuKhac ? Data?.ChucVuKhac : '',
                NganhNgheKhac: Data?.NganhNgheKhac ? Data?.NganhNgheKhac : '',
            },
            {
                TenDoanhNghiepLH: Data?.TenDoanhNghiep ? Data?.TenDoanhNghiep : '',
                GiayPhepKinhDoanh: Data?.GiayPhepKinhDoanh ? [{
                    uri: appConfig.domain + Data?.GiayPhepKinhDoanh,
                    filename: Data?.GiayPhepKinhDoanh,
                    uriPath: Data?.GiayPhepKinhDoanh,
                    type: Data?.GiayPhepKinhDoanh ? Data?.GiayPhepKinhDoanh.includes("png" || "jpg" || ".jpeg") ? 3 : 1 : 0
                }] : [],
                FileDinhKem: getDataDinhKem(),
                Avata: {
                    img: Data.Avata ? appConfig.domain + Data.Avata : undefined,
                    checkFrist: true,
                },
                TenNguoiLH: Data?.TenNguoiLH ? Data?.TenNguoiLH : '',
                PhoneNumberLH: Data?.PhoneNumber ? Data?.PhoneNumber : '',
                DiaChi: Data?.DiaChi ? Data?.DiaChi : '',
                addWork: Data?.IdQuanHuyen === -1 && Data?.IdTinhThanh === -1 ? '' : {
                    IDQuanHuyen: Data.IdQuanHuyen,
                    IdTinh: Data?.IdTinhThanh,
                    TenQuanHuyen: Data?.TenQuanHuyen ? Data.TenQuanHuyen : '-- T???t c??? --',
                    TenTinhThanh: Data?.TenTinhThanh ? Data.TenTinhThanh : '-- T???t c??? --',
                },
                EmailLH: Data?.EmailLH ? Data?.EmailLH : '',
            },
            {
                NoiDung: Data?.TieuDe ? Data.TieuDe : '',
                SoLuongTuyenDung: Data?.SoLuongTuyenDung ? Data?.SoLuongTuyenDung : '',
                Luong: Data?.IdMucLuong || Data?.IdMucLuong === 0 ? { Id: Data.IdMucLuong, MucLuong: Data.IdMucLuong === 0 ? '--Kh??ng ch???n--' : Data.MucLuong } : '',
                MucLuongFrom: Data?.MucLuongFrom ? Data?.MucLuongFrom : '',
                MucLuongTo: Data?.MucLuongTo ? Data?.MucLuongTo : '',
                HanNopHoSo: Data?.HanNopHoSo ? moment(moment(Data.HanNopHoSo, 'DD/MM/YYYY')).format('YYYY/MM/DD') : '',
            },
            {
                MoTaCongViec: Data?.MoTaCongViec ? Data?.MoTaCongViec : '',
                YeuCauCongViec: Data?.YeuCauCongViec ? Data.YeuCauCongViec : '',
            }
        ]))
        Utils.setGlobal('SaoLuu', Data.StatusKD === 0 ? false : true);
        Utils.setGlobal('IsEditTinTuyenDung', Data.StatusKD === 1 ? false : true);
        Utils.navigate('Sc_TaoTinTD')
    }

    const handleTextStatus = () => {
        if (Data?.IsDaNopHoSo == common.BUTTON_PERSONAL.DANOPHOSO)
            return '???? n???p h??? s??'
        else
            return 'Ch??a n???p h??? s??'
    }

    const checkScreenPosted = KeyScreenDetail == DEFINE_SCREEN_DETAILS.DanhSach_BaiDangDoanhNghiep.KeyScreen
    const checkScreenApplied = KeyScreenDetail == DEFINE_SCREEN_DETAILS.TuyenDung_CaNhan.KeyScreen

    const onPressGroup = () => {
        refView?.current.animateNextTransition();
    }

    const updateShareEmployment = async () => {
        Utils.navigate('Modal_ShareEmployment', {
            Type: !Data.IsHienThi ? 2 : 3,
            onPressLeft: () => {
                Utils.goback();
            },
            onPressRight: async () => {
                let res = await UpdateStatusHienThi(Data.Id, !Data.IsHienThi,)
                if (res.status === 1) {
                    dispatch(ChangeIsHideShowEmployment({ ...Data, IsHienThi: !Data.IsHienThi }))
                    dispatch(LoadListRecruitmentPost('IsHienThi', 1)) // t???m th???i c??? ????? load l???i, ????ng ra l?? t??m lo???i b??? item ???? ra kh???i lst redux
                    setData({ ...Data, IsHienThi: !Data.IsHienThi })
                    Utils.goscreen({ props }, 'ModalCTTuyenDung')
                    Utils.showToastMsg('Th??ng b??o', !Data.IsHienThi ? 'Hi???n th??? tin tuy???n d???ng th??nh c??ng' : '???n tin tuy???n d???ng th??nh c??ng', icon_typeToast.success, 2000, icon_typeToast.success)
                }
                else
                    Utils.showToastMsg('Th??ng b??o', !Data.IsHienThi ? 'Hi???n th??? tin tuy???n d???ng kh??ng th??nh c??ng' : '???n tin tuy???n d???ng th??nh kh??ng c??ng', icon_typeToast.danger, 2000, icon_typeToast.danger)
            }
        })
    }

    const TextInfo = (props) => {
        return <TextApp style={[{ paddingVertical: 5 }, props?.styleTitle]}>
            {props?.title || ''}{': '}
            <TextApp style={props?.styleValue}>
                {props?.value || ''}
            </TextApp>
        </TextApp>
    }

    const TypeWork = (key) => {
        switch (key) {
            case 0:
                return 'Sinh vi??n, h???c sinh'
            case 1:
                return 'Ng?????i lao ?????ng'
            default:
                return '??ang c???p nh???t'
        }
    }

    const checkExpires = () => {
        if (Data && Data?.HanNopHoSo) {
            const check = moment().isBefore(moment(Data?.HanNopHoSo, 'DD/MM/YYYY'), 'day')
            if (check) {
                return colorsSVL.grayText
            } else {
                return colors.redStar
            }
        }
        return colorsSVL.grayText
    }

    const rejectInterView = () => {
        Utils.goscreen({ props }, 'Modal_ConfirmTuChoi', {
            item: Data, callback: (value) => {
                setData({ ...Data, Status: value });
            }
        })
    }

    const Conver_MucLuong = (value = 0) => {
        return parseInt(value).toLocaleString('it-IT') + '';
    }

    const thumbnailUrl = Data?.Avata ? appConfig.domain + `${Data?.Avata}` : ''
    const address1 = Data.TenQuanHuyen && Data.TenQuanHuyen != '-- T???t c??? --' ? Data.TenQuanHuyen : '';
    const address2 = Data.TenTinhThanh && Data.TenTinhThanh != '-- T???t c??? --' ? Data.TenTinhThanh : ''
    return (
        <View style={[nstyles.ncontainer, { paddingBottom: getBottomSpace() / 2 }]}>
            <StatusBar barStyle={'dark-content'} />
            <HeaderSVL
                title={"Chi ti???t"}
                iconLeft={ImagesSVL.icBackSVL}
                onPressLeft={() => Utils.goback({ props })}
                titleRight={checkScreenPosted ? (Data?.IsHienThi ? null : Data.StatusKD ? "Sao l??u" : "S???a") : (Data?.IsLike ? "Hu??? l??u" : "L??u")}
                iconRight={checkScreenPosted ? undefined : ImagesSVL.icStar}
                styleTitleRight={{ width: 85, maxWidth: 85 }}
                onPressRight={checkScreenPosted ? OnNext : onSaveChange}
                Sright={[{
                    tintColor: Data?.IsLike ? colorsSVL.organeMainSVL : undefined,
                    color: Data?.IsLike ? colorsSVL.organeMainSVL : colorsSVL.grayTextLight,
                    fontSize: reText(14)
                }, !checkScreenPosted && { width: 75 }]}
                Sleft={{ width: 75 }}
                SrightIcon={[nstyles.nIcon16, { marginRight: 5 }]}
            />
            <Transitioning.View
                ref={refView}
                transition={transition}
                style={{ flex: 1 }}
            >
                <KeyboardAwareScrollView
                    pointerEvents={refresh}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={HandlePreLoad}
                            title={!refresh ? 'Vu???t xu???ng th??? ra ????? c???p nh???t' : `??ang t???i th??ng tin tuy???n d???ng...`}
                        />
                    }
                >
                    <View style={stCTTuyenDung.containerView}>
                        {/* LOGO, TI??U ?????, T??N C??NG TY */}
                        <View style={{ flexDirection: 'row' }}>
                            <ImageCus
                                defaultSourceCus={Images.imgViettelTuyenDung}
                                source={{ uri: thumbnailUrl }}
                                style={stCTTuyenDung.contLeft}
                                resizeMode='cover'
                                borderRadius={5}
                            />
                            <View style={stCTTuyenDung.contRight}>
                                <TextApp numberOfLines={2} style={stCTTuyenDung.txtTitle}>
                                    {Data?.TieuDe || "??ang c???p nh???t"}
                                </TextApp>
                                <TextApp numberOfLines={2} style={stCTTuyenDung.txtCompany}>
                                    {Data?.TenDoanhNghiep || "T??n doanh nghi???p ??ang c???p nh???t"}
                                </TextApp>
                            </View>
                        </View>
                        {/* ?????A CH???  */}
                        <View style={{ paddingVertical: 10, flexDirection: 'row', }}>
                            <ImageCus source={ImagesSVL.icLocation} style={stCTTuyenDung.icLocation} resizeMode='contain' />
                            <TouchableOpacity onPress={openMap} style={{ flex: 1 }}>
                                <TextApp style={stCTTuyenDung.txtLocal}>{Data?.DiaChi + ', ' + address1 + ', ' + address2 || !Data?.DiaChi && !address1 && !address2 && '?????a ch??? ??ang c???p nh???t'}</TextApp>
                            </TouchableOpacity>
                        </View>
                        {/* H???N N???P V?? L?????T XEM */}
                        {
                            checkScreenPosted || !checkScreenApplied ?
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <ImageCus tintColor={checkExpires()} source={ImagesSVL.icCalendar} style={stCTTuyenDung.icDateView} resizeMode='contain' />
                                        {/* H???n n???p h??? s?? */}
                                        <TextApp style={[stCTTuyenDung.txtView, { color: checkExpires() }]}>
                                            {'H???n n???p:'} {Data?.HanNopHoSo || "??ang c???p nh???t"}
                                        </TextApp>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <ImageCus source={ImagesSVL.icEye} style={stCTTuyenDung.icDateView} resizeMode='contain' />
                                        {/* l?????t xem */}
                                        <TextApp style={stCTTuyenDung.txtView}>
                                            {'L?????t xem:'} {Data?.LuotXem || "0"}
                                        </TextApp>
                                    </View>
                                </View> :
                                <View style={{ alignSelf: 'flex-start' }}>
                                    <View style={stCTTuyenDung.contTypeWork}>
                                        <TextApp numberOfLines={1} style={stCTTuyenDung.txtDateInterview}>
                                            Ph???ng v???n: {Data?.ThoiGianPhongVan ? Data?.ThoiGianPhongVan : ''}{Data?.NgayPhongVan ? ' - ' + Data?.NgayPhongVan : ''}
                                            {!Data?.ThoiGianPhongVan && !Data?.NgayPhongVan && '??ang c???p nh???t'}
                                        </TextApp>
                                    </View>
                                </View>
                        }

                        {/* Hi???n th??? // ???n tin tuy???n d???ng  [????ng tin] */}
                        {
                            checkScreenPosted ?
                                <ButtonSVL
                                    onPress={updateShareEmployment}
                                    style={[stCTTuyenDung.containerShow, { backgroundColor: !Data.IsHienThi ? colorsSVL.blueMainSVL : colorsSVL.grayTextLight }]}
                                    styleText={[stCTTuyenDung.txtShow]}
                                    text={!Data.IsHienThi ? 'Hi???n th??? tin tuy???n d???ng' : '???n tin tuy???n d???ng'}
                                    colorText={"white"}
                                />
                                : null
                        }
                    </View>
                    <View style={{ backgroundColor: colors.white, padding: 10, marginVertical: 5 }} >
                        <Text style={[{ marginTop: 10, color: colors.orange }]} >Gi???y ph??p kinh doanh :{Data?.GiayPhepKinhDoanh ? '' : '??ang c???p nh???t'}</Text>
                        <ImagePickerNew
                            styleContainer={{ padding: 0 }}
                            datamenuCus={dataMenu}
                            data={Data?.GiayPhepKinhDoanh ? [{
                                uri: appConfig.domain + Data?.GiayPhepKinhDoanh,
                                uriPath: Data?.GiayPhepKinhDoanh,
                                filename: Data?.GiayPhepKinhDoanh.split(".")[1],
                                type: Data?.GiayPhepKinhDoanh ? Data?.GiayPhepKinhDoanh.split(".")[1] != 'png' || Data?.GiayPhepKinhDoanh.split(".")[1] != 'jpg' || Data?.GiayPhepKinhDoanh.split(".")[1] != '.jpeg' ? 3 : 1 : 0
                            }] : []}
                            dataNew={[]}
                            nthis={{ props: props }}
                            keyname={"TenFile"} uniqueKey={'uri'}
                            NumberMax={1}
                            isEdit={false}
                        />
                    </View>
                    <View style={{ backgroundColor: colors.white, padding: 10, marginBottom: 2 }} >
                        <Text style={[{ color: colors.orange, marginTop: 10 }]} >File ????nh k??m :{Data?.FileDinhKem?.length > 0 ? '' : ' ??ang c???p nh???t'}</Text>
                        <ImagePickerNew
                            styleContainer={{ padding: 0 }}
                            datamenuCus={dataMenu}
                            data={getDataDinhKem() ? getDataDinhKem() : []}
                            dataNew={[]}
                            nthis={{ props: props }}
                            keyname={"TenFile"} uniqueKey={'uri'}
                            NumberMax={1}
                            isEdit={false}
                        />
                    </View>
                    {
                        Data?.IsDaNopHoSo == common.BUTTON_PERSONAL.DANOPHOSO &&
                        <ButtonSVL
                            disabled={true}
                            text={handleTextStatus()}
                            style={stCTTuyenDung.containerSubmit}
                        />
                    }
                    {/* M???C L????NG */}
                    <View>
                        <View style={[stCTTuyenDung.containerView, stCTTuyenDung.contRow]}>
                            <View style={stCTTuyenDung.lineTab}>
                                <TextApp style={stCTTuyenDung.txtTab}>{'L????ng'}</TextApp>
                            </View>
                            <TextApp style={stCTTuyenDung.txtSalary}>
                                {Data?.MucLuong || (Conver_MucLuong(Data?.MucLuongFrom) + '-' + Conver_MucLuong(Data?.MucLuongTo)) || "??ang c???p nh???t"}
                            </TextApp>
                        </View>
                        <View style={[stCTTuyenDung.containerView]}>
                            <TextInfo
                                title={'Lo???i h??nh doanh nghi???p'}
                                value={[0, 1].includes(Data?.TypeDoanhNghiep) ?
                                    Data?.TypeDoanhNghiep == 0 ? 'Doanh nghi???p, c??ng ty' : 'C?? nh??n' : '??ang c???p nh???t'
                                }
                            />
                            <TextInfo
                                title={'S??? l?????ng lao ?????ng c???n tuy???n'}
                                value={Data?.SoLuongTuyenDung || '0'}
                            />
                            <TextInfo
                                title={'Ng??nh ngh???'}
                                value={Data?.NganhNghe || Data?.NganhNgheKhac || Data?.NganhNgheShow || '??ang c???p nh???t'}
                            />
                            <TextInfo
                                title={'Ch???c danh'}
                                value={Data?.ChucVu || Data?.ChucVuKhac || Data?.ChucVuShow || '??ang c???p nh???t'}
                            />
                            <TextInfo
                                title={'Lo???i h??nh lao ?????ng'}
                                value={TypeWork(Data?.TypePerson)}
                            />
                        </View>
                    </View>
                    <GroupContent
                        title={'M?? t??? c??ng vi???c'}
                        style={{ marginTop: 2 }}
                        onPressGroup={onPressGroup}
                    >
                        <View style={stCTTuyenDung.viewGroup}>
                            <HtmlViewCom
                                style={{ paddingVertical: 10 }}
                                html={Data?.MoTaCongViec ? Data?.MoTaCongViec : '<p>Kh??ng c?? d??? li???u</p>'}
                            />
                        </View>
                    </GroupContent>
                    <GroupContent
                        title={'Y??u c???u c??ng vi???c'}
                        style={{ marginTop: 2 }}
                        onPressGroup={onPressGroup}
                    >
                        <View style={stCTTuyenDung.viewGroup}>
                            <HtmlViewCom
                                style={{ paddingVertical: 10 }}
                                html={Data?.YeuCauCongViec ? Data?.YeuCauCongViec : '<p>Kh??ng c?? d??? li???u</p>'}
                            />
                        </View>
                    </GroupContent>
                    <GroupContent
                        title={'Th??ng tin li??n h???'}
                        style={{ marginTop: 2 }}
                        onPressGroup={onPressGroup}
                    >
                        <View style={stCTTuyenDung.viewGroup}>
                            <TextLine
                                showTitle
                                styleTitle={stCTTuyenDung.textInfo}
                                title={'H??? v?? t??n'}
                                value={Data?.TenNguoiLH || '??ang c???p nh???t'}
                                styleValue={{ fontWeight: 'bold', textAlign: 'right' }}
                            />
                            <TextLine
                                showTitle
                                styleTitle={stCTTuyenDung.textInfo}
                                title={'S??? ??i???n tho???i'}
                                value={Data?.PhoneNumber || "??ang c???p nh???t"}
                                styleValue={{ fontWeight: 'bold', textAlign: 'right' }}
                            />
                            <TextLine
                                showTitle
                                styleTitle={stCTTuyenDung.textInfo}
                                title={'?????a ch???'}
                                value={Data?.DiaChi || "??ang c???p nh???t"}
                                styleValue={{ fontWeight: 'bold', textAlign: 'right' }}
                            />
                        </View>
                    </GroupContent>
                    {
                        auth?.userCD?.UserID != Data?.IdDoanhNghiep && Data ? <GroupContent
                            title={'????nh gi??'}
                            style={{ marginTop: 2 }}
                            onPressGroup={onPressGroup}
                        >
                            <View style={stCTTuyenDung.viewGroup}>
                                <DanhGiaTinTuyenDung itemTinTuyenDung={Data} />
                            </View>
                        </GroupContent> : null
                    }

                    {/* SHARE */}
                    <View style={stCTTuyenDung.containerView}>
                        <TouchableOpacity activeOpacity={0.5} onPress={onShare}>
                            <View style={stCTTuyenDung.containerShare}>
                                <View style={stCTTuyenDung.contRow}>
                                    <ImageCus source={ImagesSVL.icShare} style={stCTTuyenDung.icShare} resizeMode='contain' />
                                    <TextApp style={stCTTuyenDung.txtShare}>{'Chia s???'}</TextApp>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </Transitioning.View>
            {/* BUTTON N???P H??? S?? */}
            {
                Data?.IsDaNopHoSo == common.BUTTON_PERSONAL.CHUANOPHOSO &&
                <ButtonSVL
                    onPress={nopHoSo}
                    text={'N???p h??? s??'}
                    colorText={colorsSVL.white}
                    style={stCTTuyenDung.btnNopHoSo}
                />
            }
            {
                Data?.Status == common.BUTTON_PERSONAL.TUCHOIPHONGVAN &&
                <ButtonSVL
                    onPress={rejectInterView}
                    text={'T??? ch???i ph???ng v???n'}
                    colorText={colorsSVL.white}
                    style={[stCTTuyenDung.btnNopHoSo, { backgroundColor: colorsSVL.organeMainSVL }]}
                />
            }
            <IsLoading />
        </View >
    )
}

const stCTTuyenDung = StyleSheet.create({
    viewGroup: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 13 },
    textInfo: { fontWeight: 'normal', color: colorsSVL.grayText, paddingVertical: 5 },
    btnNopHoSo: {
        fontSize: reText(18), marginHorizontal: 12, marginVertical: 10, borderRadius: 18
    },
    Container: {
        flex: 1,
        backgroundColor: colorsSVL.white,
    },
    containerShare: {
        alignItems: 'flex-end', paddingHorizontal: 12
    },
    containerView: {
        padding: 12,
        backgroundColor: colorsSVL.white, marginTop: 2
    },
    containerSubmit: {
        backgroundColor: colorsSVL.organeMainSVL,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 50,
        marginTop: 10, marginBottom: 5,
        marginHorizontal: 12
    },
    containerShow: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 5,
        marginVertical: 8
    },
    icShare: {
        ...nstyles.nIcon22, marginRight: 5
    },
    icLocation: {
        ...nstyles.nIcon12, marginRight: 5
    },
    icDateView: {
        ...nstyles.nIcon12, marginRight: 5
    },
    contLeft: {
        ...nstyles.nIcon65, borderRadius: 5
    },
    contRight: {
        flex: 1, paddingLeft: 8
    },
    txtTitle: {
        fontSize: reText(14), textAlign: 'justify', fontWeight: 'bold', color: '#333333', flex: 1
    },
    txtCompany: {
        fontSize: reText(11), color: colorsSVL.grayText, paddingVertical: 5
    },
    txtLocal: {
        fontSize: reText(12), color: colorsSVL.blueMainSVL, textAlign: 'justify'
    },
    lineTab: {
        paddingLeft: 8, borderLeftWidth: 3, borderColor: colorsSVL.blueMainSVL
    },
    txtSalary: {
        fontSize: reText(16), fontWeight: 'bold', color: colorsSVL.organeMainSVL
    },
    txtShare: {
        fontSize: reText(16), fontWeight: 'bold', color: colorsSVL.blueMainSVL
    },
    txtView: {
        fontSize: reText(12), color: colorsSVL.grayText
    },
    txtDateInterview: {
        fontSize: reText(11), color: colorsSVL.blueMainSVL,
    },
    txtShow: {
        fontSize: reText(12), color: colorsSVL.white,
    },
    txtTab: {
        fontSize: reText(16), fontWeight: 'bold',
    },
    contRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
    contTypeWork: { paddingHorizontal: 10, paddingVertical: 3, backgroundColor: '#cce6f0', borderRadius: 10, marginVertical: 10, alignItems: 'center', justifyContent: 'center' }
})

export default CTTuyenDung