import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar, Platform } from 'react-native'
import { color, Transition, Transitioning, TransitioningView } from 'react-native-reanimated'
import Utils, { icon_typeToast } from '../../../../app/Utils'
import { colorsSVL, colors } from '../../../../styles/color'
import { reSize, reText } from '../../../../styles/size'
import { nstyles } from '../../../../styles/styles'
import ButtonSVL from '../../components/ButtonSVL'
import HeaderSVL from '../../components/HeaderSVL'
import { ImagesSVL } from '../../images'
import ItemPersonal from '../HoSo/components/ItemPersonal'
import ItemDetalis from './ItemDetalis'
import { GetDetailCV, GetDetailTuyenDungDoanhNghiep, UpdateStatus, UpdateStatusCV } from '../../apis/apiSVL'
import { IsLoading } from '../../../../components'
import { store } from '../../../../srcRedux/store'
import {
    ChangeIspublicCvUser, LikeProfileEnterprise, LikeUnlikeProfileApplied, LoadListCvSaved, SetCV_Item, UnLikeCvSaved, UnLikeProfileEnterprise,
    SetCV_Default,
    LoadListProfileApplied,
    LoadListCvUserPublic
} from '../../../../srcRedux/actions/sanvieclam/DataSVL'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { appConfig } from '../../../../app/Config'
import { StatusHinhThucLamViec, StatusNguoiLaoDong } from '../HoSo/components/StatusCv'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import common, { DEFINE_SCREEN_DETAILS } from '../../common'
import { ImgComp } from '../../../../components/ImagesComponent'
import ImagePickerNew from '../../../../components/ComponentApps/ImagePicker/ImagePickerNew'
import UploadCmndCus from '../HoSo/components/UploadCmndCus'
import DanhGiaCV from './components/DanhGiaCV'
import GroupContent from '../../components/GroupContent'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const transition = (
    <Transition.Together>
        <Transition.Change />
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


const DetalisUngVien = (props) => {
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    const typeDetalis = Utils.ngetParam({ props: props }, 'typeDetalis', 1)// 1 chi ti???t cho nh?? tuy???n d???ng
    const [data, setData] = useState('') // data chi ti???t
    const [state, setstate] = useState([
        {
            title: 'T???ng quan',
            dataItem: [
                {
                    title: 'Lo???i h??? s??'
                },
                {
                    title: 'H??nh th?????c l??m vi???c'
                },
                {
                    title: 'Ng??nh ngh???'
                },
                {
                    title: 'Kinh nghi???m'
                },
                {
                    title: 'V??? tr?? mong mu???n'
                },
                {
                    title: 'Khu v???c l??m vi???c'
                }
            ],
        },
        {
            title: 'Th??ng tin ???ng vi??n',
            dataItem: [
                {
                    title: 'Ng??y sinh'
                },
                {
                    title: 'Gi???i t??nh'
                },
                {
                    title: 'S??? ??i???n tho???i'
                },
                {
                    title: '?????a ch???'
                },
                {
                    title: 'Email'
                },
            ],
        },
        {
            title: 'H???c v???n',
        },
        {
            title: 'Kinh nhgi???m',
        },
        {
            title: 'L????ng',
        },
        {
            title: 'K??? n??ng',
        },
        {
            title: 'Th???i gian l??m vi???c',
        },
        {
            title: 'Mong mu???n kh??c',
        },
    ])

    const IdDetails_IdScreen = Utils.ngetParam({ props: props }, 'Id', '')
    const [KeyScreenDetail, setKeyScreenDetail] = useState('')
    const [refresh, setRefresh] = useState(true)

    useEffect(() => {
        // IdDetails_IdScreen: ???????c ?????nh ngh??a v?? truy???n theo d???ng Id|KeyScreen v?? d???: 1|TuyenDung_CaNhan || 1%7CTuyenDung_CaNhan
        // M???t s??? tr?????ng h???p d???u  | khi truy???n s??? ?????i th??nh %7C
        HandlePreLoad()
    }, [IdDetails_IdScreen])

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
                getDetailsProfile(paramsData[0], paramsData[1] || '')
            }
        }
    }

    const xulyIdScreen = () => {
        let paramsData = [] // 
        if (IdDetails_IdScreen?.includes('%7C'))
            paramsData = IdDetails_IdScreen.toString().split("%7C");
        else
            paramsData = IdDetails_IdScreen.toString().split("|");
        return paramsData[1] || '';
    }
    const getDetailsProfile = async (Id, KeyScreen) => {
        setRefresh(true)
        // setData('')
        switch (KeyScreen) {
            case DEFINE_SCREEN_DETAILS.DanhSach_CVNguoiLaoDong.KeyScreen:
                {
                    Utils.setToggleLoading(true)
                    let res = await GetDetailCV(Id) // truy???n IdCV
                    Utils.nlog('DETAILS DS CV NGUOI LAO DONG', res)
                    setData(res?.data && res?.status === 1 ? res.data : '')
                    Utils.setToggleLoading(false)
                }
                break;
            case DEFINE_SCREEN_DETAILS.TuyenDung_DoanhNghiep.KeyScreen:
                {
                    Utils.setToggleLoading(true)
                    let res = await GetDetailTuyenDungDoanhNghiep(Id) // truy???n IdUngTuyen
                    Utils.nlog('DETAILS TUYEN DUNG DOANH NGHIEP', res)
                    setData(res?.data && res?.status === 1 ? res.data : '')
                    Utils.setToggleLoading(false)
                }
                break;
            case DEFINE_SCREEN_DETAILS.DanhSach_CVDoanhNghiep.KeyScreen:
                {
                    Utils.setToggleLoading(true)
                    let res = await GetDetailCV(Id) // truy???n IdCV
                    Utils.nlog('DETAILS DS CV DOANH NGHIEP', res)
                    setData(res?.data && res?.status === 1 ? res.data : '')
                    Utils.setToggleLoading(false)
                }
                break;
            default:
                break;
        }
        setRefresh(false)
    }

    const onUnSave = () => {
        Utils.goscreen({ props }, 'PopupSaveTD', { data: data, isSave: data?.IsLike == 0 ? true : false, callback: callbackPopupSave })
    }

    const callbackPopupSave = (itemcallback) => {
        if (itemcallback?.IsLike == 1) {
            //Item ch??a l??u chuy???n tr???ng th??i th??nh l??u v???i IsLike : 1 -> Load l???i danh s??ch h??? s?? (CV) ???? l??u
            dispatch(LoadListCvSaved())
            //Item ch??a l??u chuy???n tr???ng th??i th??nh l??u v???i IsLike : 1 -> Map la??? danh s??ch x??? l?? UI danh s??ch h??? s?? (CV)
            dispatch(LikeProfileEnterprise(itemcallback))
            //Item ch??a l??u chuy???n tr???ng th??i th??nh l??u v???i IsLike : 1 -> Map la??? danh s??ch x??? l?? UI l???ch s??? ???ng tuy???n
            dispatch(LikeUnlikeProfileApplied(itemcallback))
            //Set l???i data
            setData({ ...data, IsLike: 1 })
        }
        else {
            //Item l??u chuy???n tr???ng th??i th??nh ch??a l??u v???i IsLike : 0 -> Map la??? danh s??ch x??? l?? UI danh s??ch h??? s?? (CV) ???? l??u
            dispatch(UnLikeCvSaved(itemcallback))
            //Item l??u chuy???n tr???ng th??i th??nh ch??a l??u v???i IsLike : 0 -> Map la??? danh s??ch x??? l?? UI danh s??ch h??? s?? (CV)
            dispatch(UnLikeProfileEnterprise(itemcallback))
            //Item l??u chuy???n tr???ng th??i th??nh ch??a l??u v???i IsLike : 0 -> Map la??? danh s??ch ??? l?? UI l???ch s??? ???ng tuy???n
            dispatch(LikeUnlikeProfileApplied(itemcallback))
            //Set l???i data
            setData({ ...data, IsLike: 0 })
        }
    }

    const onSendInterviewAgain = () => {
        Utils.goscreen({ props }, 'Modal_MoiPhongVan', { item: data, KeyScreen: KeyScreenDetail })
    }

    const refView = useRef(null);

    const getDataDinhKem = () => {
        let dataFileDichkem = [];
        if (data?.FileDinhKem && data?.FileDinhKem.length > 0) {
            for (let index = 0; index < data.FileDinhKem.length; index++) {
                let item = data.FileDinhKem[index];
                dataFileDichkem.push({
                    uri: appConfig.domain + item.FileDinhKem,
                    uriPath: item.FileDinhKem,
                    filename: item.FileDinhKem,
                    type: !item.FileDinhKem.includes("png" || "jpg" || "jpeg") ? 3 : 1
                })
            }
        }
        return dataFileDichkem;
    }

    const updateShareCv = async () => {
        if (data?.IsFinish) {
            Utils.navigate('Modal_ShareCv', {
                Type: !data.IsPublic ? 2 : 3,
                onPressLeft: () => {
                },
                onPressRight: async () => {
                    let res = await UpdateStatusCV(data.IdCV, !data.IsPublic, 2)
                    if (res.status === 1) {
                        dispatch(ChangeIspublicCvUser({ ...data, IsPublic: !data.IsPublic }))
                        dispatch(LoadListCvUserPublic())
                        setData({ ...data, IsPublic: !data.IsPublic })
                        Utils.showToastMsg('Th??ng b??o', !data.IsPublic ? 'C??ng khai h??? s?? th??nh c??ng' : 'Kh??ng c??ng khai h??? s?? th??nh c??ng', icon_typeToast.success, 2000)
                        Utils.navigate('Sc_DetalisHoSo')
                    }
                    else
                        Utils.showMsgBoxOK({ props: props }, 'Th??ng b??o', !data.IsPublic ? 'C??ng khai h??? s?? th???t b???i' : 'Kh??ng c??ng h??? s?? kh??ng th??nh c??ng')
                }
            })
        }
        else {
            Utils.navigate('Sc_CreateCv');
            Utils.setGlobal('SaoLuu', data?.StatusKD === 1 ? true : false);
            Utils.setGlobal('IsEditCv', data?.StatusKD === 1 ? false : true);
            if (data) {
                let dataTemptHocVan = []
                for (let index = 0; index < data.ChiTietHocVan?.length; index++) {
                    const element = data.ChiTietHocVan[index];
                    dataTemptHocVan.push({
                        item: [
                            {
                                title: 'T??? N??m',
                                value: element?.TuNam ? element?.TuNam : '',
                            },
                            {
                                title: '?????n  N??m',
                                value: element?.DenNam ? element?.DenNam : '',
                            },
                            {
                                title: 'Tr?????ng l???p/ b???ng c???p',
                                value: element?.TenTruongHoc ? element?.TenTruongHoc : '',
                            },
                            {
                                title: 'T??nh ????? ????o t???o',
                                value: element.IdTrinhDoDaoTao && element.TrinhDoVanHoa ? { Id: element.IdTrinhDoDaoTao, TrinhDoVanHoa: element.TrinhDoVanHoa } :
                                    '',
                                keyTitle: 'TrinhDoVanHoa',
                            },
                            {
                                title: 'Ngh??nh h???c',
                                value: element?.NganhHoc ? element?.NganhHoc : '',
                            },
                            {
                                title: 'Lo???i t???t nghi???p',
                                value: element?.LoaiTotNghiep ? element?.LoaiTotNghiep : '',
                            },
                        ],
                        check: element?.IsHienTaiDangHoc ? element?.IsHienTaiDangHoc : false,
                    }
                    )
                }
                let dataTempt = [
                    {
                        IdCV: data.IdCV,
                        TypePerson: StatusNguoiLaoDong(data.TypePerson), // lo???i cv  h???c sinh ||  ng?????i lao ?????ng
                        TypeCV: StatusHinhThucLamViec(data.TypeCV), // h??nh th???c l??m vi???c
                        career: data?.IdNganhNghe || data?.IdNganhNghe === 0 ? { Id: data?.IdNganhNghe, NganhNghe: data?.IdNganhNghe === 0 ? '--Kh??ng ch???n--' : data?.NganhNghe } : '',
                        experience: data.IdKinhNghiem ? { Id: data?.IdKinhNghiem, KinhNghiem: data?.KinhNghiem } : '',
                        position: data?.IdChucVu || data?.IdChucVu === 0 ? { Id: data?.IdChucVu, ChucVu: data?.IdChucVu === 0 ? '--Kh??ng ch???n--' : data?.ChucVu } : '',
                        addressWork: data.IdQuanHuyen === -1 && data.IdTinhThanh === -1 ? '' : {
                            IDQuanHuyen: data.IdQuanHuyen,
                            IdTinh: data.IdTinhThanh,
                            TenQuanHuyen: data.TenQuanHuyen ? data.TenQuanHuyen : '-- T???t c??? --',
                            TenTinhThanh: data.TenTinhThanh ? data.TenTinhThanh : '-- T???t c??? --',
                        },
                        isShareCv: data.IsPublic,
                        NganhNgheKhac: data?.NganhNgheKhac ? data.NganhNgheKhac : '',
                        ChucVuKhac: data?.ChucVuKhac ? data.ChucVuKhac : ''
                    },
                    {
                        Avatar: {
                            img: data.Avata ? appConfig.domain + data.Avata : undefined,
                            uriPath: data.Avata ? data.Avata : "",
                            checkFrist: true,
                        },
                        CMND_MatSau: data?.CMND_MatSau ? { uri: appConfig.domain + data?.CMND_MatSau, uriPath: data?.CMND_MatSau } : "",
                        CMND_MatTruoc: data?.CMND_MatTruoc ? { uri: appConfig.domain + data?.CMND_MatTruoc, uriPath: data?.CMND_MatTruoc } : "",
                        FileDinhKem: getDataDinhKem(),
                        GiayGioiThieu: data?.GiayGioiThieu ? [{
                            uri: appConfig.domain + data?.GiayGioiThieu,
                            filename: data?.GiayGioiThieu,
                            uriPath: data?.GiayGioiThieu,
                            type: data?.GiayGioiThieu ? data?.GiayGioiThieu.includes("png" || "jpg" || "jpeg") ? 3 : 1 : 0
                        }] : [],
                        Name: data.HoTen,
                        Birthday: data.NgaySinh ? moment(moment(data.NgaySinh, 'DD/MM/YYYY')).format('YYYY/MM/DD') : '',
                        Gender: data.GioiTinh === 0 ? 'Nam' : 'N???',
                        Address: data.DiaChi,
                        Phone: data.PhoneNumber,
                        Email: data.Email,
                    },
                    {
                        AcademicLevel: data.IdTrinhDoVanHoa ? { Id: data.IdTrinhDoVanHoa, TrinhDoVanHoa: data.TrinhDoVanHoa } : '',
                        dataEducation: dataTemptHocVan.length <= 0 ? [{
                            item: [
                                {
                                    title: 'T??? N??m',
                                    value: '',
                                },
                                {
                                    title: '?????n  N??m',
                                    value: '',
                                },
                                {
                                    title: 'Tr?????ng l???p/ b???ng c???p',
                                    value: '',
                                },
                                {
                                    title: 'T??nh ????? ????o t???o',
                                    value: '',
                                    keyTitle: 'TrinhDoVanHoa',
                                },
                                {
                                    title: 'Ngh??nh h???c',
                                    value: '',
                                },
                                {
                                    title: 'Lo???i t???t nghi???p',
                                    value: '',
                                },
                            ],
                            check: false,

                        }] : dataTemptHocVan
                    },
                    {
                        Experience: data.MoTaKinhNghiem,
                        Skill: data.MoTaKyNang,
                    },
                    {
                        Wage: data?.IdMucLuong || data?.IdMucLuong === 0 ? { Id: data.IdMucLuong, MucLuong: data.IdMucLuong === 0 ? '--Kh??ng ch???n--' : data.MucLuong } : '',
                        WorkTStatus: data.IsDiLamNgay,
                        WorkTime: data.NgayBatDauLamViec ? moment(moment(data.NgayBatDauLamViec, 'DD/MM/YYYY')).format('YYYY/MM/DD') : '',
                        Desire: data.GhiChu,
                        MucLuongFrom: data?.MucLuongMongMuonFrom ? data.MucLuongMongMuonFrom : '',
                        MucLuongTo: data?.MucLuongMongMuonTo ? data.MucLuongMongMuonTo : '',
                    }
                ]
                Utils.nlog('gia tri dataTempt', dataTempt)
                store.dispatch(SetCV_Default(dataTempt))
            }
        }
    }

    const GoBack = () => {
        Utils.goback({ props: props })
    }

    //T??? ch???i h??? s??
    const rejectProfile = async () => {
        Utils.showMsgBoxYesNo({ props },
            'Th??ng b??o',
            'B???n c?? ch???c mu???n T??? CH???I h??? s?? n??y kh??ng ?',
            'T??? ch???i',
            'Xem l???i',
            async () => {
                let strBody = {
                    "IdRow": data?.IdUngTuyen,
                    "Status": 99,
                    "ThoiGianPhongVan": data?.ThoiGianPhongVan,//HH:mm
                    "NgayPhongVan": data?.NgayPhongVan,//yyyy/MM/dd
                    "DiaDiemPhongVan": data?.DiaDiemPhongVan,
                    "GhiChu": data?.GhiChu
                }
                Utils.nlog('BODY UPDATE STATUS -TU CHOI HO SO', strBody)
                let res = await UpdateStatus(strBody)
                if (res?.status == 1) {
                    dispatch(LoadListProfileApplied(data?.Id))
                    Utils.showToastMsg('Th??ng b??o', `T??? ch???i h??? s?? th??nh c??ng !`, icon_typeToast.success, 2000)
                    Utils.goback({ props })
                } else {
                    Utils.showToastMsg('Th??ng b??o', res?.error?.message || `T??? ch???i h??? s?? kh??ng th??nh c??ng !`, icon_typeToast.danger, 2000)
                }
            }
        )
    }

    // M???i ph???ng v???n  - Ch???n h??? s??
    const inviteInterview = async () => {
        Utils.goscreen({ props }, 'Modal_MoiPhongVan', { item: data, KeyScreen: KeyScreenDetail })
    }

    // ?????u ph??ng v???n
    const passedInterview = async () => {
        Utils.showMsgBoxYesNo({ props },
            'Th??ng b??o',
            'B???n c?? ch???c mu???n x??c nh???n ?????U ph???ng v???n h??? s?? n??y kh??ng ?',
            '?????u ph???ng v???n',
            'Xem l???i',
            async () => {
                let strBody = {
                    "IdRow": data?.IdUngTuyen,
                    "Status": 3,
                    "ThoiGianPhongVan": data?.ThoiGianPhongVan,//HH:mm
                    "NgayPhongVan": data?.NgayPhongVan,//yyyy/MM/dd
                    "DiaDiemPhongVan": data?.DiaDiemPhongVan,
                    "GhiChu": data?.GhiChu
                }
                Utils.nlog('BODY UPDATE STATUS -DAU PHONG VAN', strBody)
                let res = await UpdateStatus(strBody)
                if (res?.status == 1) {
                    dispatch(LoadListProfileApplied(data?.Id))
                    Utils.showToastMsg('Th??ng b??o', `X??c nh???n h??? s?? ?????U ph???ng v???n th??nh c??ng !`, icon_typeToast.success, 2000)
                    Utils.goback({ props })
                } else {
                    Utils.showToastMsg('Th??ng b??o', res?.error?.message || `X??c nh???n h??? s?? ?????U ph???ng v???n kh??ng th??nh c??ng !`, icon_typeToast.danger, 2000)
                }
            }
        )
    }

    // Tr?????t ph???ng v???n
    const failedInterview = async () => {
        Utils.showMsgBoxYesNo({ props },
            'Th??ng b??o',
            'B???n c?? ch???c mu???n x??c nh???n KH??NG ?????U ph???ng v???n h??? s?? n??y kh??ng ?',
            'Kh??ng ?????u',
            'Xem l???i',
            async () => {
                let strBody = {
                    "IdRow": data?.IdUngTuyen,
                    "Status": 4,
                    "ThoiGianPhongVan": data?.ThoiGianPhongVan,//HH:mm
                    "NgayPhongVan": data?.NgayPhongVan,//yyyy/MM/dd
                    "DiaDiemPhongVan": data?.DiaDiemPhongVan,
                    "GhiChu": data?.GhiChu
                }
                Utils.nlog('BODY UPDATE STATUS -KHONG DAU PHONG VAN', strBody)
                let res = await UpdateStatus(strBody)
                if (res?.status == 1) {
                    dispatch(LoadListProfileApplied(data?.Id))
                    Utils.showToastMsg('Th??ng b??o', `X??c nh???n h??? s?? KH??NG ?????U ph???ng v???n th??nh c??ng !`, icon_typeToast.success, 2000)
                    Utils.goback({ props })
                } else {
                    Utils.showToastMsg('Th??ng b??o', res?.error?.message || `X??c nh???n h??? s?? KH??NG ?????U ph???ng v???n kh??ng th??nh c??ng !`, icon_typeToast.danger, 2000)
                }
            }
        )
    }

    // Ho??n t???t ph???ng v???n
    const completeInterview = async () => {
        Utils.showMsgBoxYesNo({ props },
            'Th??ng b??o',
            'B???n c?? ch???c mu???n HO??N T???T ph???ng v???n h??? s?? n??y kh??ng ?',
            'Ho??n t???t',
            'Xem l???i',
            async () => {
                let strBody = {
                    "IdRow": data?.IdUngTuyen,
                    "Status": 2,
                    "ThoiGianPhongVan": data?.ThoiGianPhongVan,//HH:mm
                    "NgayPhongVan": data?.NgayPhongVan,//yyyy/MM/dd
                    "DiaDiemPhongVan": data?.DiaDiemPhongVan,
                    "GhiChu": data?.GhiChu
                }
                Utils.nlog('BODY UPDATE STATUS -HOAN TAT PHONG VAN', strBody)
                let res = await UpdateStatus(strBody)
                if (res?.status == 1) {
                    dispatch(LoadListProfileApplied(data?.Id))
                    Utils.showToastMsg('Th??ng b??o', `X??c nh???n HO??N T???T ph???ng v???n th??nh c??ng !`, icon_typeToast.success, 2000)
                    Utils.goback({ props })
                } else {
                    Utils.showToastMsg('Th??ng b??o', res?.error?.message || `X??c nh???n HO??N T???T ph???ng v???n kh??ng th??nh c??ng !`, icon_typeToast.danger, 2000)
                }
            }
        )
    }

    const renderButton = () => {
        switch (data?.Status) {
            case common.BUTTON_ENTERPRISE.TUCHOIHOSO || common.BUTTON_ENTERPRISE.NHAPLICHPHONGVAN:
                return <View style={{
                    marginBottom: props?.navigation?.state?.routeName == 'Modal_DetalisUngVien' ? getBottomSpace() : 10,
                    flexDirection: 'row',
                }}>
                    <ButtonSVL
                        onPress={rejectProfile}
                        text='T??? ch???i'
                        style={{
                            borderRadius: 5,
                            marginHorizontal: 13, marginTop: 10, backgroundColor: colorsSVL.organeMainSVL,
                            flex: 1
                        }}
                    />
                    <ButtonSVL
                        onPress={inviteInterview}
                        text='M???i ph???ng v???n'
                        style={{
                            borderRadius: data?.IsChonHoSo == 0 ? 30 : 5,
                            marginHorizontal: 13, marginTop: 10,
                            flex: 1
                        }}
                    />
                </View>
            case common.BUTTON_ENTERPRISE.DAUPHONGVAN:
                return <View style={{
                    marginBottom: props?.navigation?.state?.routeName == 'Modal_DetalisUngVien' ? getBottomSpace() : 10,
                    flexDirection: 'row',
                }}>
                    <ButtonSVL
                        onPress={failedInterview}
                        text='Kh??ng ?????u'
                        style={{
                            borderRadius: 5,
                            marginHorizontal: 13, marginTop: 10, backgroundColor: colorsSVL.organeMainSVL,
                            flex: 1
                        }}
                    />
                    <ButtonSVL
                        onPress={passedInterview}
                        text='?????u ph???ng v???n'
                        style={{
                            borderRadius: data?.IsChonHoSo == 0 ? 30 : 5,
                            marginHorizontal: 13, marginTop: 10,
                            flex: 1
                        }}
                    />
                </View>
            case common.BUTTON_ENTERPRISE.HOANTATPHONGVAN:
                return <View style={{
                    marginBottom: props?.navigation?.state?.routeName == 'Modal_DetalisUngVien' ? getBottomSpace() + 15 : 20,
                    flexDirection: 'row',
                }}>
                    <ButtonSVL
                        onPress={inviteInterview}
                        text='C???p nh???t l???ch PV'
                        style={{
                            borderRadius: 5,
                            marginHorizontal: 13, marginTop: 10, backgroundColor: colorsSVL.organeMainSVL,
                            flex: 1
                        }}
                    />
                    <ButtonSVL
                        onPress={completeInterview}
                        text='Ho??n t???t PV'
                        style={{
                            borderRadius: 5,
                            marginHorizontal: 13, marginTop: 10,
                            flex: 1
                        }}
                    />
                </View>
            default:
                break;
        }
    }

    const transferTextStatus = () => {
        if (data?.Status == common.DEFINE_STATUS.HOANTATPHONGVAN)
            return '???? ph???ng v???n'
        else if (data?.Status == common.DEFINE_STATUS.PHONGVANDAU)
            return 'Tr??ng tuy???n'
        else if (data?.Status == common.DEFINE_STATUS.PHONGVANKHONGDAU)
            return 'Tr?????t ph???ng v???n'
        else if (data?.Status == common.DEFINE_STATUS.TUCHOIPHONGVAN)
            return '???? t??? ch???i'
    }

    const getDataCmnd = () => {
        let dataCmnd = [];
        if (data?.CMND_MatSau && data?.CMND_MatTruoc)
            dataCmnd.push(
                {
                    uri: appConfig.domain + data?.CMND_MatTruoc,
                    type: 1
                },
                {
                    uri: appConfig.domain + data?.CMND_MatSau,
                    type: 1
                },
            )
        return dataCmnd;
    }

    return (
        <View style={stDetalisUngVien.container}>
            <StatusBar barStyle={'dark-content'} />
            <HeaderSVL
                title={"Chi ti???t"}
                iconLeft={ImagesSVL.icBackSVL}
                onPressLeft={GoBack}
                titleRight={KeyScreenDetail == DEFINE_SCREEN_DETAILS.DanhSach_CVNguoiLaoDong.KeyScreen ? data?.StatusKD === 0 ? '' : 'Sao l??u' : (data?.IsLike ? "Hu??? l??u" : "L??u")}
                Sright={{
                    tintColor: data?.IsLike ? colorsSVL.organeMainSVL : undefined,
                    color: data?.IsLike ? colorsSVL.organeMainSVL : undefined, fontSize: reText(14),
                    width: reSize(80)
                }}
                Sleft={{ width: reSize(80) }}
                onPressRight={KeyScreenDetail == DEFINE_SCREEN_DETAILS.DanhSach_CVNguoiLaoDong.KeyScreen ? () => {
                    if (data?.StatusKD != 0)
                        updateShareCv();
                } : onUnSave
                }
                styleTitleRight={{ width: reSize(85) }}
                iconRight={KeyScreenDetail == DEFINE_SCREEN_DETAILS.DanhSach_CVNguoiLaoDong.KeyScreen ? null : ImagesSVL.icStar}
                SrightIcon={[nstyles.nIcon16, { marginRight: 5 }]}
                styleTitle={{ flex: 1 }}
            />
            <Transitioning.View
                style={{ flex: 1 }}
                ref={refView}
                transition={transition}
            >
                <KeyboardAwareScrollView
                    style={{ backgroundColor: colors.BackgroundHome, marginTop: 5 }}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={HandlePreLoad}
                            title={!refresh ? 'Vu???t xu???ng th??? ra ????? c???p nh???t' : `??ang t???i th??ng tin tuy???n d???ng...`}
                        />
                    }
                >
                    <ItemPersonal item={data} isDetails />
                    {KeyScreenDetail == DEFINE_SCREEN_DETAILS.DanhSach_CVNguoiLaoDong.KeyScreen && data.StatusKD === 0 &&
                        <View style={{ paddingHorizontal: 13, paddingVertical: 5, backgroundColor: colors.white }}>
                            <ButtonSVL
                                text={!data?.IsFinish ? 'C???p nh???t h??? s??' : !data.IsPublic ? 'C??ng khai h??? s??' : 'Kh??ng c??ng khai h??? s??'}
                                style={{ backgroundColor: !data?.IsFinish ? colorsSVL.organeMainSVL : !data.IsPublic ? colorsSVL.blueMainSVL : colorsSVL.grayTextLight }}
                                onPress={updateShareCv}
                                styleText={{ fontSize: reText(14) }}
                            />
                        </View>
                    }
                    {xulyIdScreen() != DEFINE_SCREEN_DETAILS.DanhSach_CVDoanhNghiep.KeyScreen && <View style={{ paddingHorizontal: 10, backgroundColor: colorsSVL.white, paddingVertical: 10 }}  >
                        <Text>Ch???ng minh nh??n d??n :</Text>
                        <ImagePickerNew
                            styleContainer={{ padding: 0 }}
                            data={getDataCmnd() ? getDataCmnd() : []}
                            dataNew={[]}
                            nthis={{ props: props }}
                            keyname={"TenFile"} uniqueKey={'uri'}
                            isEdit={false}
                        />
                    </View>
                    }
                    <View style={{ backgroundColor: 'white', paddingHorizontal: 10, paddingBottom: 10, marginBottom: 5, marginTop: 5 }}>
                        <Text style={[{ marginTop: 10 }]} >Gi???y gi???i thi???u :{data?.GiayGioiThieu ? '' : '??ang c???p nh???t'}</Text>
                        <ImagePickerNew
                            styleContainer={{ padding: 0 }}
                            datamenuCus={dataMenu}
                            data={data?.GiayGioiThieu ? [{
                                uri: appConfig.domain + data?.GiayGioiThieu,
                                filename: data?.GiayGioiThieu.split(".")[1],
                                type: data?.GiayGioiThieu ? !data?.GiayGioiThieu.includes("png" || "jpg" || "jpeg") ? 3 : 1 : 0
                            }] : []}
                            dataNew={[]}
                            nthis={{ props: props }}
                            keyname={"TenFile"} uniqueKey={'uri'}
                            NumberMax={1}
                            isEdit={false}
                        />
                    </View>
                    <View style={{ backgroundColor: 'white', paddingHorizontal: 10, paddingBottom: 10, marginBottom: 5 }}>
                        <Text style={{ marginTop: 10 }} >File ????nh k??m :{data?.FileDinhKem?.length > 0 ? '' : ' ??ang c???p nh???t'}</Text>
                        <ImagePickerNew
                            styleContainer={{ padding: 0 }}
                            datamenuCus={dataMenu}
                            data={getDataDinhKem() ? getDataDinhKem() : []}
                            dataNew={[]}
                            nthis={{ props: props }}
                            keyname={"TenFile"} uniqueKey={'uri'}
                            isEdit={false}
                        />
                    </View>

                    {data?.IsChonHoSo == 1 &&
                        <ButtonSVL
                            disabled
                            text='???? m???i ph???ng v???n'
                            style={{
                                borderRadius: 30,
                                marginHorizontal: 13, marginVertical: 5,
                                backgroundColor: colorsSVL.organeMainSVL
                            }}
                        />
                    }
                    {common.ARRAY_VALUE_STATUS.includes(data?.Status) &&
                        <ButtonSVL
                            disabled
                            text={transferTextStatus()}
                            style={{
                                borderRadius: 30,
                                marginHorizontal: 13, marginVertical: 5,
                                backgroundColor: colorsSVL.organeMainSVL
                            }}
                        />
                    }
                    {state.map((item, index) => {
                        return (
                            <View key={index}
                                style={{
                                    backgroundColor: colorsSVL.white
                                }}>
                                <ItemDetalis indexItem={index} itemValue={data}
                                    item={item} CallBack={() => {

                                    }}
                                    type={typeDetalis}
                                />
                            </View>
                        )
                    })}
                    {
                        auth?.userCD?.UserID != data?.IdUser && data ?
                            <GroupContent
                                title={'????nh gi??'}
                                style={{ marginTop: 2 }}
                                onPressGroup={() => {
                                    refView?.current?.animateNextTransition()
                                }}
                                style={{ paddingHorizontal: 5, marginTop: 5 }}
                            >
                                <View style={{ flex: 1, backgroundColor: colors.white, paddingHorizontal: 13 }}>
                                    <DanhGiaCV itemCV={data} />
                                </View>
                            </GroupContent> : null
                    }
                </KeyboardAwareScrollView>
                {data?.IsChonHoSo == 0 && KeyScreenDetail == DEFINE_SCREEN_DETAILS.DanhSach_CVDoanhNghiep.KeyScreen ?
                    <ButtonSVL
                        onPress={inviteInterview}
                        text='M???i ph???ng v???n'
                        style={{
                            borderRadius: data?.IsChonHoSo == 0 ? 30 : 5,
                            marginHorizontal: 13, marginTop: 10,
                            marginBottom: props?.navigation?.state?.routeName == 'Modal_DetalisUngVien' ? Platform === 'ios' ? getBottomSpace() : 20 : 20
                        }}
                    />
                    :
                    renderButton()
                }
            </Transitioning.View>
            <IsLoading />
        </View >
    )
}

export default DetalisUngVien

const stDetalisUngVien = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.whitegay,
    },
    bold: {
        fontWeight: Platform.OS == 'android' ? 'bold' : '600'
    },
    titleSub: {
        fontSize: reText(14)
    },
    titleInfo: {
        marginBottom: 8,
        fontSize: reText(12),
        // fontWeight: Platform.OS == 'android' ? 'bold' : '600'
    },
    stViewBS1: {
        paddingVertical: 3, paddingHorizontal: 10,
        backgroundColor: colorsSVL.grayBgrInput,
        borderRadius: 17, alignItems: 'center', justifyContent: 'center'
    },
    stTextBS1: {
        fontSize: reText(12), color: colorsSVL.grayTextLight
    },
    stViewBS2: {
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 17,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colorsSVL.organeMainSVL, borderWidth: 1

    },
    stTextBS2: {
        fontSize: reText(12), color: colorsSVL.organeMainSVL
    },
})
