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
    const typeDetalis = Utils.ngetParam({ props: props }, 'typeDetalis', 1)// 1 chi tiết cho nhà tuyển dụng
    const [data, setData] = useState('') // data chi tiết
    const [state, setstate] = useState([
        {
            title: 'Tổng quan',
            dataItem: [
                {
                    title: 'Loại hồ sơ'
                },
                {
                    title: 'Hình thước làm việc'
                },
                {
                    title: 'Ngành nghề'
                },
                {
                    title: 'Kinh nghiệm'
                },
                {
                    title: 'Vị trí mong muốn'
                },
                {
                    title: 'Khu vực làm việc'
                }
            ],
        },
        {
            title: 'Thông tin ứng viên',
            dataItem: [
                {
                    title: 'Ngày sinh'
                },
                {
                    title: 'Giới tính'
                },
                {
                    title: 'Số điện thoại'
                },
                {
                    title: 'Địa chỉ'
                },
                {
                    title: 'Email'
                },
            ],
        },
        {
            title: 'Học vấn',
        },
        {
            title: 'Kinh nhgiệm',
        },
        {
            title: 'Lương',
        },
        {
            title: 'Kỹ năng',
        },
        {
            title: 'Thời gian làm việc',
        },
        {
            title: 'Mong muốn khác',
        },
    ])

    const IdDetails_IdScreen = Utils.ngetParam({ props: props }, 'Id', '')
    const [KeyScreenDetail, setKeyScreenDetail] = useState('')
    const [refresh, setRefresh] = useState(true)

    useEffect(() => {
        // IdDetails_IdScreen: được định nghĩa và truyền theo dạng Id|KeyScreen ví dụ: 1|TuyenDung_CaNhan || 1%7CTuyenDung_CaNhan
        // Một số trường hợp dấu  | khi truyền sẽ đổi thành %7C
        HandlePreLoad()
    }, [IdDetails_IdScreen])

    const HandlePreLoad = () => {
        if (IdDetails_IdScreen?.length > 0) {
            let paramsData = [] // 
            //Xử lý params navigation & params deeplink
            if (IdDetails_IdScreen?.includes('%7C'))
                paramsData = IdDetails_IdScreen.toString().split("%7C");
            else
                paramsData = IdDetails_IdScreen.toString().split("|");
            Utils.nlog('[LOG] PARAMS DETAILS', paramsData)
            //Call API get chi tiết theo màn hình
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
                    let res = await GetDetailCV(Id) // truyền IdCV
                    Utils.nlog('DETAILS DS CV NGUOI LAO DONG', res)
                    setData(res?.data && res?.status === 1 ? res.data : '')
                    Utils.setToggleLoading(false)
                }
                break;
            case DEFINE_SCREEN_DETAILS.TuyenDung_DoanhNghiep.KeyScreen:
                {
                    Utils.setToggleLoading(true)
                    let res = await GetDetailTuyenDungDoanhNghiep(Id) // truyền IdUngTuyen
                    Utils.nlog('DETAILS TUYEN DUNG DOANH NGHIEP', res)
                    setData(res?.data && res?.status === 1 ? res.data : '')
                    Utils.setToggleLoading(false)
                }
                break;
            case DEFINE_SCREEN_DETAILS.DanhSach_CVDoanhNghiep.KeyScreen:
                {
                    Utils.setToggleLoading(true)
                    let res = await GetDetailCV(Id) // truyền IdCV
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
            //Item chưa lưu chuyển trạng thái thành lưu với IsLike : 1 -> Load lại danh sách hồ sơ (CV) đã lưu
            dispatch(LoadListCvSaved())
            //Item chưa lưu chuyển trạng thái thành lưu với IsLike : 1 -> Map laị danh sách xử lý UI danh sách hồ sơ (CV)
            dispatch(LikeProfileEnterprise(itemcallback))
            //Item chưa lưu chuyển trạng thái thành lưu với IsLike : 1 -> Map laị danh sách xử lý UI lịch sử ứng tuyển
            dispatch(LikeUnlikeProfileApplied(itemcallback))
            //Set lại data
            setData({ ...data, IsLike: 1 })
        }
        else {
            //Item lưu chuyển trạng thái thành chưa lưu với IsLike : 0 -> Map laị danh sách xử lý UI danh sách hồ sơ (CV) đã lưu
            dispatch(UnLikeCvSaved(itemcallback))
            //Item lưu chuyển trạng thái thành chưa lưu với IsLike : 0 -> Map laị danh sách xử lý UI danh sách hồ sơ (CV)
            dispatch(UnLikeProfileEnterprise(itemcallback))
            //Item lưu chuyển trạng thái thành chưa lưu với IsLike : 0 -> Map laị danh sách ử lý UI lịch sử ứng tuyển
            dispatch(LikeUnlikeProfileApplied(itemcallback))
            //Set lại data
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
                        Utils.showToastMsg('Thông báo', !data.IsPublic ? 'Công khai hồ sơ thành công' : 'Không công khai hồ sơ thành công', icon_typeToast.success, 2000)
                        Utils.navigate('Sc_DetalisHoSo')
                    }
                    else
                        Utils.showMsgBoxOK({ props: props }, 'Thông báo', !data.IsPublic ? 'Công khai hồ sơ thất bại' : 'Không công hồ sơ không thành công')
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
                                title: 'Từ Năm',
                                value: element?.TuNam ? element?.TuNam : '',
                            },
                            {
                                title: 'Đến  Năm',
                                value: element?.DenNam ? element?.DenNam : '',
                            },
                            {
                                title: 'Trường lớp/ bằng cấp',
                                value: element?.TenTruongHoc ? element?.TenTruongHoc : '',
                            },
                            {
                                title: 'Tình độ đào tạo',
                                value: element.IdTrinhDoDaoTao && element.TrinhDoVanHoa ? { Id: element.IdTrinhDoDaoTao, TrinhDoVanHoa: element.TrinhDoVanHoa } :
                                    '',
                                keyTitle: 'TrinhDoVanHoa',
                            },
                            {
                                title: 'Nghành học',
                                value: element?.NganhHoc ? element?.NganhHoc : '',
                            },
                            {
                                title: 'Loại tốt nghiệp',
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
                        TypePerson: StatusNguoiLaoDong(data.TypePerson), // loại cv  học sinh ||  người lao động
                        TypeCV: StatusHinhThucLamViec(data.TypeCV), // hình thức làm việc
                        career: data?.IdNganhNghe || data?.IdNganhNghe === 0 ? { Id: data?.IdNganhNghe, NganhNghe: data?.IdNganhNghe === 0 ? '--Không chọn--' : data?.NganhNghe } : '',
                        experience: data.IdKinhNghiem ? { Id: data?.IdKinhNghiem, KinhNghiem: data?.KinhNghiem } : '',
                        position: data?.IdChucVu || data?.IdChucVu === 0 ? { Id: data?.IdChucVu, ChucVu: data?.IdChucVu === 0 ? '--Không chọn--' : data?.ChucVu } : '',
                        addressWork: data.IdQuanHuyen === -1 && data.IdTinhThanh === -1 ? '' : {
                            IDQuanHuyen: data.IdQuanHuyen,
                            IdTinh: data.IdTinhThanh,
                            TenQuanHuyen: data.TenQuanHuyen ? data.TenQuanHuyen : '-- Tất cả --',
                            TenTinhThanh: data.TenTinhThanh ? data.TenTinhThanh : '-- Tất cả --',
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
                        Gender: data.GioiTinh === 0 ? 'Nam' : 'Nữ',
                        Address: data.DiaChi,
                        Phone: data.PhoneNumber,
                        Email: data.Email,
                    },
                    {
                        AcademicLevel: data.IdTrinhDoVanHoa ? { Id: data.IdTrinhDoVanHoa, TrinhDoVanHoa: data.TrinhDoVanHoa } : '',
                        dataEducation: dataTemptHocVan.length <= 0 ? [{
                            item: [
                                {
                                    title: 'Từ Năm',
                                    value: '',
                                },
                                {
                                    title: 'Đến  Năm',
                                    value: '',
                                },
                                {
                                    title: 'Trường lớp/ bằng cấp',
                                    value: '',
                                },
                                {
                                    title: 'Tình độ đào tạo',
                                    value: '',
                                    keyTitle: 'TrinhDoVanHoa',
                                },
                                {
                                    title: 'Nghành học',
                                    value: '',
                                },
                                {
                                    title: 'Loại tốt nghiệp',
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
                        Wage: data?.IdMucLuong || data?.IdMucLuong === 0 ? { Id: data.IdMucLuong, MucLuong: data.IdMucLuong === 0 ? '--Không chọn--' : data.MucLuong } : '',
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

    //Từ chối hồ sơ
    const rejectProfile = async () => {
        Utils.showMsgBoxYesNo({ props },
            'Thông báo',
            'Bạn có chắc muốn TỪ CHỐI hồ sơ này không ?',
            'Từ chối',
            'Xem lại',
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
                    Utils.showToastMsg('Thông báo', `Từ chối hồ sơ thành công !`, icon_typeToast.success, 2000)
                    Utils.goback({ props })
                } else {
                    Utils.showToastMsg('Thông báo', res?.error?.message || `Từ chối hồ sơ không thành công !`, icon_typeToast.danger, 2000)
                }
            }
        )
    }

    // Mời phỏng vấn  - Chọn hồ sơ
    const inviteInterview = async () => {
        Utils.goscreen({ props }, 'Modal_MoiPhongVan', { item: data, KeyScreen: KeyScreenDetail })
    }

    // Đậu phòng vấn
    const passedInterview = async () => {
        Utils.showMsgBoxYesNo({ props },
            'Thông báo',
            'Bạn có chắc muốn xác nhận ĐẬU phỏng vấn hồ sơ này không ?',
            'Đậu phỏng vấn',
            'Xem lại',
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
                    Utils.showToastMsg('Thông báo', `Xác nhận hồ sơ ĐẬU phỏng vấn thành công !`, icon_typeToast.success, 2000)
                    Utils.goback({ props })
                } else {
                    Utils.showToastMsg('Thông báo', res?.error?.message || `Xác nhận hồ sơ ĐẬU phỏng vấn không thành công !`, icon_typeToast.danger, 2000)
                }
            }
        )
    }

    // Trượt phỏng vấn
    const failedInterview = async () => {
        Utils.showMsgBoxYesNo({ props },
            'Thông báo',
            'Bạn có chắc muốn xác nhận KHÔNG ĐẬU phỏng vấn hồ sơ này không ?',
            'Không đậu',
            'Xem lại',
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
                    Utils.showToastMsg('Thông báo', `Xác nhận hồ sơ KHÔNG ĐẬU phỏng vấn thành công !`, icon_typeToast.success, 2000)
                    Utils.goback({ props })
                } else {
                    Utils.showToastMsg('Thông báo', res?.error?.message || `Xác nhận hồ sơ KHÔNG ĐẬU phỏng vấn không thành công !`, icon_typeToast.danger, 2000)
                }
            }
        )
    }

    // Hoàn tất phỏng vấn
    const completeInterview = async () => {
        Utils.showMsgBoxYesNo({ props },
            'Thông báo',
            'Bạn có chắc muốn HOÀN TẤT phỏng vấn hồ sơ này không ?',
            'Hoàn tất',
            'Xem lại',
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
                    Utils.showToastMsg('Thông báo', `Xác nhận HOÀN TẤT phỏng vấn thành công !`, icon_typeToast.success, 2000)
                    Utils.goback({ props })
                } else {
                    Utils.showToastMsg('Thông báo', res?.error?.message || `Xác nhận HOÀN TẤT phỏng vấn không thành công !`, icon_typeToast.danger, 2000)
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
                        text='Từ chối'
                        style={{
                            borderRadius: 5,
                            marginHorizontal: 13, marginTop: 10, backgroundColor: colorsSVL.organeMainSVL,
                            flex: 1
                        }}
                    />
                    <ButtonSVL
                        onPress={inviteInterview}
                        text='Mời phỏng vấn'
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
                        text='Không đậu'
                        style={{
                            borderRadius: 5,
                            marginHorizontal: 13, marginTop: 10, backgroundColor: colorsSVL.organeMainSVL,
                            flex: 1
                        }}
                    />
                    <ButtonSVL
                        onPress={passedInterview}
                        text='Đậu phỏng vấn'
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
                        text='Cập nhật lịch PV'
                        style={{
                            borderRadius: 5,
                            marginHorizontal: 13, marginTop: 10, backgroundColor: colorsSVL.organeMainSVL,
                            flex: 1
                        }}
                    />
                    <ButtonSVL
                        onPress={completeInterview}
                        text='Hoàn tất PV'
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
            return 'Đã phỏng vấn'
        else if (data?.Status == common.DEFINE_STATUS.PHONGVANDAU)
            return 'Trúng tuyển'
        else if (data?.Status == common.DEFINE_STATUS.PHONGVANKHONGDAU)
            return 'Trượt phỏng vấn'
        else if (data?.Status == common.DEFINE_STATUS.TUCHOIPHONGVAN)
            return 'Đã từ chối'
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
                title={"Chi tiết"}
                iconLeft={ImagesSVL.icBackSVL}
                onPressLeft={GoBack}
                titleRight={KeyScreenDetail == DEFINE_SCREEN_DETAILS.DanhSach_CVNguoiLaoDong.KeyScreen ? data?.StatusKD === 0 ? '' : 'Sao lưu' : (data?.IsLike ? "Huỷ lưu" : "Lưu")}
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
                            title={!refresh ? 'Vuốt xuống thả ra để cập nhật' : `Đang tải thông tin tuyển dụng...`}
                        />
                    }
                >
                    <ItemPersonal item={data} isDetails />
                    {KeyScreenDetail == DEFINE_SCREEN_DETAILS.DanhSach_CVNguoiLaoDong.KeyScreen && data.StatusKD === 0 &&
                        <View style={{ paddingHorizontal: 13, paddingVertical: 5, backgroundColor: colors.white }}>
                            <ButtonSVL
                                text={!data?.IsFinish ? 'Cập nhật hồ sơ' : !data.IsPublic ? 'Công khai hồ sơ' : 'Không công khai hồ sơ'}
                                style={{ backgroundColor: !data?.IsFinish ? colorsSVL.organeMainSVL : !data.IsPublic ? colorsSVL.blueMainSVL : colorsSVL.grayTextLight }}
                                onPress={updateShareCv}
                                styleText={{ fontSize: reText(14) }}
                            />
                        </View>
                    }
                    {xulyIdScreen() != DEFINE_SCREEN_DETAILS.DanhSach_CVDoanhNghiep.KeyScreen && <View style={{ paddingHorizontal: 10, backgroundColor: colorsSVL.white, paddingVertical: 10 }}  >
                        <Text>Chứng minh nhân dân :</Text>
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
                        <Text style={[{ marginTop: 10 }]} >Giấy giới thiệu :{data?.GiayGioiThieu ? '' : 'Đang cập nhật'}</Text>
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
                        <Text style={{ marginTop: 10 }} >File đính kèm :{data?.FileDinhKem?.length > 0 ? '' : ' Đang cập nhật'}</Text>
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
                            text='Đã mời phỏng vấn'
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
                                title={'Đánh giá'}
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
                        text='Mời phỏng vấn'
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
