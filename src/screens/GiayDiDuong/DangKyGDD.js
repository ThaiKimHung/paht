import moment from 'moment'
import React, { useRef, useState, useEffect } from 'react'
import { View, Text, StyleSheet, BackHandler, Image, TouchableOpacity, FlatList } from 'react-native'
import DatePicker from 'react-native-datepicker'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector } from 'react-redux'
import Utils, { icon_typeToast } from '../../../app/Utils'
import { ButtonCom, HeaderCus, IsLoading } from '../../../components'
import { colors } from '../../../styles'
import FontSize from '../../../styles/FontSize'
import { nstyles } from '../../../styles/styles'
import apis from '../../apis'
import { Images } from '../../images'
import { TYPES } from '../user/dangky/Component'
import ThongTinChungRender from '../user/dangky/ThongTinChungRender'

const listGT = [
    {
        id: 1,
        name: "Nam"
    },
    {
        id: 0,
        name: "Nữ"
    }
]

const lstLoai = [
    {
        id: 1,
        name: 'Từ ngày đến ngày',
    },
    {
        id: 2,
        name: 'Chọn ngày',
    }
]


const listCom = [
    {
        id: 1,
        name: 'Họ và tên',
        type: TYPES.TextInput,
        check: true,
        key: 'hoten',
        placehoder: 'Nhập họ và tên',
        errorText: '',
        helpText: '',
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
            backgroundColor: colors.black_10
        },
        styleLabelCus: {
            fontSize: FontSize.reText(18)
        }
    },
    {
        id: 2,
        name: "Ngày sinh",
        type: TYPES.DatePicker,
        check: true,
        key: "ngaysinh",
        placehoder: "Ngày sinh",
        errorText: "",
        helpText: "",
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
            backgroundColor: colors.black_10
        },
        styleLabel: {
            fontSize: FontSize.reText(18), fontWeight: 'bold', color: colors.black_80
        }
    },
    {
        id: 2,
        name: 'Giới tính',
        // note: "Khuyến cáo: phần dành riêng cho người tự cách ly y tế tại nhà, những người không có trách nhiệm hoặc khai báo thông tin sai là vi phạm pháp luật Việt Nam và có thể xử lý hình sự",
        type: TYPES.CauHoi,
        check: true,
        key: 'gioitinh',
        placehoder: '',
        errorText: '',
        helpText: '',
        value: listGT[1],//mặc định là nam
        list: listGT,
        note: ' ',
        styleLabel: {
            fontSize: FontSize.reText(18), fontWeight: 'bold', color: colors.black_80, marginBottom: -15
        }
    },
    {
        id: 3,
        name: 'CMND/Căn cước/Hộ chiếu',
        type: TYPES.TextInput,
        check: true,
        key: 'cmnd',
        placehoder: 'CMND/Căn cước/Hộ chiếu',
        errorText: '',
        helpText: '',
        keyboardType: 'numeric',
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
            backgroundColor: colors.black_10
        },
        styleLabelCus: {
            fontSize: FontSize.reText(18)
        }
    },
    {

        id: 4,
        name: "Ngày cấp",
        type: TYPES.DatePicker,
        check: true,
        key: "ngaycap",
        placehoder: "Ngày cấp",
        errorText: "",
        helpText: "",
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
            backgroundColor: colors.black_10
        },
        styleLabel: {
            fontSize: FontSize.reText(18), fontWeight: 'bold', color: colors.black_80
        }
    },
    {
        id: 5,
        name: 'Nơi cấp',
        type: TYPES.TextInput,
        check: true,
        key: 'noicap',
        placehoder: 'Nơi cấp',
        errorText: '',
        helpText: '',
        keyboardType: 'numeric',
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
            backgroundColor: colors.black_10
        },
        styleLabelCus: {
            fontSize: FontSize.reText(18)
        }
    },
    {
        id: 6,
        name: 'Số điện thoại',
        type: TYPES.TextInput,
        check: true,
        key: 'sodienthoai',
        placehoder: 'Nhập số điện thoại',
        errorText: '',
        helpText: '',
        keyboardType: 'numeric',
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
            backgroundColor: colors.black_10
        },
        styleLabelCus: {
            fontSize: FontSize.reText(18)
        }
    },
    {
        id: 7,
        name: 'Địa chỉ thường trú',
        type: TYPES.TextInput,
        check: true,
        key: 'diachi',
        placehoder: 'Địa chỉ',
        errorText: '',
        helpText: '',
        keyboardType: 'numeric',
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
            backgroundColor: colors.black_10
        },
        styleLabelCus: {
            fontSize: FontSize.reText(18)
        }
    }
]

const listComDiDuong = [
    {
        id: 1,
        name: 'Cơ quan làm việc/ Nghề nghiệp:',
        type: TYPES.TextInput,
        check: true,
        key: 'coquanlamviec',
        placehoder: 'Vui lòng nhập cơ quan làm việc',
        errorText: '',
        helpText: '',
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabelCus: {
            fontSize: FontSize.reText(18)
        },
        note: ' *',
    },
    {
        id: 2,
        name: 'Địa chỉ cơ quan ',
        type: TYPES.TextInput,
        check: true,
        key: 'diachicoquan',
        placehoder: 'Vui lòng nhập địa chỉ cơ quan',
        errorText: '',
        helpText: '',
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabelCus: {
            fontSize: FontSize.reText(18)
        },
        note: ' *',
    },
    {
        id: 3,
        name: 'Mục đích tham gia giao thông ',
        type: TYPES.TextInput,
        check: true,
        key: 'mucdichthamgia',
        placehoder: 'Vui lòng nhập mục đích tham gia giao thông',
        errorText: '',
        helpText: '',
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabelCus: {
            fontSize: FontSize.reText(18)
        },
        note: ' *',
    },
    {
        id: 4,
        name: 'Điểm đi ',
        type: TYPES.TextInput,
        check: true,
        key: 'diemdi',
        placehoder: 'Vui lòng nhập điểm đi',
        errorText: '',
        helpText: '',
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabelCus: {
            fontSize: FontSize.reText(18)
        },
        note: ' *',
    },
    {
        id: 5,
        name: 'Tuyến đường đi ',
        type: TYPES.TextInput,
        check: true,
        key: 'tuyenduong',
        placehoder: 'Vui lòng nhập tuyến đường đi',
        errorText: '',
        helpText: '',
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabelCus: {
            fontSize: FontSize.reText(18)
        },
        note: ' *',
    },
    {
        id: 6,
        name: 'Điểm đến',
        type: TYPES.TextInput,
        check: true,
        key: 'diemden',
        placehoder: 'Vui lòng nhập điểm đến',
        errorText: '',
        helpText: '',
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabelCus: {
            fontSize: FontSize.reText(18)
        },
        note: ' *',
    },
    // {
    //     id: 7,
    //     name: 'Thời gian tham gia giao thông',
    //     type: TYPES.Title,
    //     check: false,
    //     key: 'thoigian',
    //     note: ' *',
    // },
    // {
    //     id: 8,
    //     name: "Từ giờ",
    //     type: TYPES.DatePicker,
    //     check: true,
    //     key: "tugio",
    //     placehoder: "Từ giờ",
    //     errorText: "",
    //     helpText: "",
    //     checkNull: true,
    //     styleBodyInputCus: {
    //         borderColor: colors.grayLight,
    //         borderRadius: 7,
    //     },
    //     styleLabel: {
    //         fontSize: FontSize.reText(18), fontWeight: 'bold', color: colors.black_80
    //     },
    //     mode: 'time',
    //     format: 'HH:mm'
    // },
    // {
    //     id: 9,
    //     name: "Đền giờ",
    //     type: TYPES.DatePicker,
    //     check: true,
    //     key: "dengio",
    //     placehoder: "Đến giờ",
    //     errorText: "",
    //     helpText: "",
    //     checkNull: true,
    //     styleBodyInputCus: {
    //         borderColor: colors.grayLight,
    //         borderRadius: 7,
    //     },
    //     styleLabel: {
    //         fontSize: FontSize.reText(18), fontWeight: 'bold', color: colors.black_80
    //     },
    //     mode: 'time',
    //     format: 'HH:mm'
    // },
    // {
    //     id: 10,
    //     name: "Từ ngày",
    //     type: TYPES.DatePicker,
    //     check: true,
    //     key: "tungay",
    //     placehoder: "Từ ngày",
    //     errorText: "",
    //     helpText: "",
    //     checkNull: true,
    //     styleBodyInputCus: {
    //         borderColor: colors.grayLight,
    //         borderRadius: 7,
    //     },
    //     styleLabel: {
    //         fontSize: FontSize.reText(18), fontWeight: 'bold', color: colors.black_80
    //     },
    // },
    // {
    //     id: 11,
    //     name: "Đến ngày",
    //     type: TYPES.DatePicker,
    //     check: true,
    //     key: "denngay",
    //     placehoder: "Đến ngày",
    //     errorText: "",
    //     helpText: "",
    //     checkNull: true,
    //     styleBodyInputCus: {
    //         borderColor: colors.grayLight,
    //         borderRadius: 7,
    //     },
    //     styleLabel: {
    //         fontSize: FontSize.reText(18), fontWeight: 'bold', color: colors.black_80
    //     },
    // },
    {
        id: 12,
        name: 'Cơ quan cấp',
        type: TYPES.DropDown,
        check: false,
        key: 'coquancap',
        placehoder: '- Vui lòng chọn cơ quan cấp -',
        errorText: '',
        helpText: '',
        isRow: false,
        isEnd: true,
        keyView: 'TenPhuongXa',
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.turquoiseBlue_10,
            borderRadius: 7,
            backgroundColor: colors.colorPaleGrey,
        },
        styleLabelCus: {
            fontSize: FontSize.reText(20)
        },
        prefixlabelCus: {
            tintColor: colors.cobaltBlue,
        },
        note: ' *'
    },
    {
        id: 13,
        name: "Loại đăng ký:",
        type: TYPES.CauHoi,
        check: false,
        key: "loai",
        placehoder: "",
        errorText: "",
        helpText: "",
        value: lstLoai[0],
        list: lstLoai,
        checkNull: false,
        // note: ' '
    }
]

const listComTuNgayDenNgay = [
    {
        id: 7,
        name: 'Thời gian tham gia giao thông',
        type: TYPES.Title,
        check: false,
        key: 'thoigian',
        note: ' *',
    },
    {
        id: 8,
        name: "Từ giờ",
        type: TYPES.DatePicker,
        check: true,
        key: "tugio",
        placehoder: "Từ giờ",
        errorText: "",
        helpText: "",
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabel: {
            fontSize: FontSize.reText(18), fontWeight: 'bold', color: colors.black_80
        },
        mode: 'time',
        format: 'HH:mm'
    },
    {
        id: 9,
        name: "Đền giờ",
        type: TYPES.DatePicker,
        check: true,
        key: "dengio",
        placehoder: "Đến giờ",
        errorText: "",
        helpText: "",
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabel: {
            fontSize: FontSize.reText(18), fontWeight: 'bold', color: colors.black_80
        },
        mode: 'time',
        format: 'HH:mm'
    },
    {
        id: 10,
        name: "Từ ngày",
        type: TYPES.DatePicker,
        check: true,
        key: "tungay",
        placehoder: "Từ ngày",
        errorText: "",
        helpText: "",
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabel: {
            fontSize: FontSize.reText(18), fontWeight: 'bold', color: colors.black_80
        },
    },
    {
        id: 11,
        name: "Đến ngày",
        type: TYPES.DatePicker,
        check: true,
        key: "denngay",
        placehoder: "Đến ngày",
        errorText: "",
        helpText: "",
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabel: {
            fontSize: FontSize.reText(18), fontWeight: 'bold', color: colors.black_80
        },
    },
]

const listComChonNgay = [
    {
        id: 7,
        name: 'Thời gian tham gia giao thông',
        type: TYPES.Title,
        check: false,
        key: 'thoigian',
        note: ' *',
    },
    {
        id: 8,
        name: "Từ giờ",
        type: TYPES.DatePicker,
        check: true,
        key: "tugio",
        placehoder: "Từ giờ",
        errorText: "",
        helpText: "",
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabel: {
            fontSize: FontSize.reText(18), fontWeight: 'bold', color: colors.black_80
        },
        mode: 'time',
        format: 'HH:mm'
    },
    {
        id: 9,
        name: "Đền giờ",
        type: TYPES.DatePicker,
        check: true,
        key: "dengio",
        placehoder: "Đến giờ",
        errorText: "",
        helpText: "",
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabel: {
            fontSize: FontSize.reText(18), fontWeight: 'bold', color: colors.black_80
        },
        mode: 'time',
        format: 'HH:mm'
    }
]
const DangKyGDD = (props) => {
    const { userCD, tokenCD, userTNSmart = {}, noiCachLy = {} } = useSelector(state => state.auth);
    const refTTCaNhan = useRef(null)
    const refTTDiDuong = useRef(null)
    const refLoading = useRef(null)
    const refTTDate = useRef(null)
    const [dataDonVi, setDataDonVi] = useState([])
    const [Loai, setLoai] = useState(lstLoai[0])
    const [selectedDays, setSelectedDays] = useState([])
    let date = ''

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backAction)
        return () => {
            try {
                BackHandler.removeEventListener('hardwareBackPress', backAction)
            } catch (error) {

            }

        }
    }, [])

    const backAction = () => {
        Utils.goback({ props })
        return true
    }

    useEffect(() => {
        if (!tokenCD) {
            Utils.navigate("login", {
                sdt: false
            })
            Utils.showToastMsg('Thông báo', 'Vui lòng đăng nhập', icon_typeToast.warning, 3000, icon_typeToast.warning)
            return;
        } else {
            GetList_DonVi()
        }
    }, [])

    useEffect(() => {
        if (dataDonVi && dataDonVi?.length > 0) {
            refTTDiDuong.current.setDataDropDown("coquancap", dataDonVi)
        }
    }, [dataDonVi])

    const GetList_DonVi = async () => {
        refLoading.current.show()
        let res = await apis.ApiXuPhatCD.GetList_DonVi(true)
        refLoading.current.hide()
        Utils.nlog('[LOG] res don vi', res)
        if (res.status == 1) {
            setDataDonVi(res.data)
        } else {
            setDataDonVi([])
        }
    }

    const onPressSubmid = async () => {
        const objTTCaNhan = refTTCaNhan.current.getData()
        const objTTDiDuong = refTTDiDuong.current.getData()
        const objTTDate = refTTDate.current.getData()

        if (!tokenCD) {
            Utils.navigate("login", {
                sdt: false
            })
            Utils.showToastMsg('Thông báo', 'Vui lòng đăng nhập', icon_typeToast.warning, 3000, icon_typeToast.warning)
            return;
        }
        for (const element of listCom) {
            if (element["checkNull"] == true && !objTTCaNhan[element['key']]) {
                Utils.showToastMsg('Thông báo', 'Vui lòng kiểm tra đẩy đủ thông tin cá nhân. Vui lòng cập nhật đầy đủ thông tin cá nhân trước khi đăng ký.', icon_typeToast.warning, 3000, icon_typeToast.warning)
                return;
            }
        }
        for (const element of listComDiDuong) {
            if (element["checkNull"] == true && !objTTDiDuong[element['key']]) {
                Utils.showToastMsg('Thông báo', 'Vui lòng kiểm tra điền đầy đủ thông tin đi đường: ' + element['name'], icon_typeToast.warning, 3000, icon_typeToast.warning)
                return;
            }
        }

        //Kiem tra ngay thời gian
        if (Loai?.id == 1) {
            for (const element of listComTuNgayDenNgay) {
                if (element["checkNull"] == true && !objTTDate[element['key']]) {
                    Utils.showToastMsg('Thông báo', 'Vui lòng kiểm tra điền đầy đủ thông tin đi đường: ' + element['name'], icon_typeToast.warning, 3000, icon_typeToast.warning)
                    return;
                }
            }
            if (objTTDate?.denngay && objTTDate?.tungay) {
                let number = moment(objTTDate?.tungay, 'DD-MM-YYYY').diff(moment(objTTDate?.denngay, 'DD-MM-YYYY'))
                if (number > 0) {
                    Utils.showToastMsg("Thông báo", "Từ ngày phải nhỏ hơn hoặc bằng đến ngày", icon_typeToast.warning);
                    return
                }
            }
        } else {
            for (const element of listComChonNgay) {
                if (element["checkNull"] == true && !objTTDate[element['key']]) {
                    Utils.showToastMsg('Thông báo', 'Vui lòng kiểm tra điền đầy đủ thông tin đi đường: ' + element['name'], icon_typeToast.warning, 3000, icon_typeToast.warning)
                    return;
                }
            }
            if (selectedDays.length == 0) {
                Utils.showToastMsg('Thông báo', 'Vui lòng kiểm tra điền đầy đủ thông tin đi đường: Thêm các ngày cần đăng ký', icon_typeToast.warning, 3000, icon_typeToast.warning)
                return;
            }
        }

        let body = {
            IdCapPhep: objTTDiDuong?.coquancap?.MaPX || '',
            bussiness: objTTDiDuong?.coquanlamviec || '',
            bussinessAddress: objTTDiDuong?.diachicoquan || '',
            endAddress: objTTDiDuong?.diemden || '',
            endDate: objTTDate?.denngay || '',
            purposeInTraffic: objTTDiDuong?.mucdichthamgia || '',
            route: objTTDiDuong?.tuyenduong || '',
            startAddress: objTTDiDuong?.diemdi || '',
            startDate: Loai?.id == 1 ? objTTDate?.tungay || '' : selectedDays.toString(),
            startTime: objTTDate?.tugio || '',
            totime: objTTDate?.dengio || '',
            LoaiDangKy: Loai?.id == 1 ? 0 : 1
        }

        Utils.nlog('[LOG] body post', body)
        refLoading.current.show()
        let res = await apis.ApiApp.TaoGiayDiDuong(body)
        refLoading.current.hide()
        Utils.nlog('[LOG] res dang ky giay di duong', res)
        if (res.status == 1) {
            Utils.showToastMsg("Thông báo", res?.error?.message || 'Đăng ký giấy đi đường thành công', icon_typeToast.success, 3000, icon_typeToast.success);
        } else {
            Utils.showToastMsg("Thông báo", res?.error?.message || 'Đăng ký giấy đi đường thất bại', icon_typeToast.danger, 3000, icon_typeToast.danger);
        }
    }

    const onChangeState = async (state) => {
        if (state?.keyChange == 'loai') {
            setLoai(state.loai)
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <HeaderCus
                Sleft={{ tintColor: 'white' }}
                onPressLeft={() => Utils.goback(this)}
                iconLeft={Images.icBack}
                title={`Đăng ký giấy đi đường`}
                styleTitle={{ color: colors.white }}
                iconRight={Images.ichistory}
                Sright={{ tintColor: 'white' }}
                onPressRight={() => { Utils.goscreen({ props }, 'Modal_LichSuDangKyGDD') }}

            />
            <View style={customStyles.containerBody}>
                <KeyboardAwareScrollView style={{ backgroundColor: colors.white }} contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
                    <View style={{ paddingVertical: FontSize.reText(10), }}>
                        <Text style={customStyles.title}>{'Đăng ký giấy đi đường'.toLocaleUpperCase()}</Text>
                    </View>
                    <Text style={{ fontSize: FontSize.reText(18), paddingHorizontal: 10 }}>{'Các thông tin có dấu'}<Text style={{ color: colors.redStar, fontWeight: 'bold' }}>{' * '}</Text>{'bắt buộc nhập'}</Text>
                    <View pointerEvents={'none'}>
                        {
                            React.useMemo(() => <View>
                                <ThongTinChungRender
                                    objectData={{
                                        "sodienthoai": userCD?.PhoneNumber || userCD?.SDT || '',
                                        "hoten": userCD?.FullName || '',
                                        "ngaysinh": userCD?.NgaySinh || '',
                                        "gioitinh": listGT[userCD?.GioiTinh] || '',
                                        "ngaycap": userCD?.NgayCap || '',
                                        "noicap": userCD?.NoiCap || '',
                                        "diachi": userCD?.DiaChi || '',
                                        "cmnd": userCD?.CMND || ''
                                    }}
                                    ref={refTTCaNhan}
                                    listCom={listCom} isEdit={false} >
                                </ThongTinChungRender>
                            </View>, [])
                        }
                    </View>
                    {
                        React.useMemo(() => <View >
                            <ThongTinChungRender objectData={{ "sodienthoai": userCD?.PhoneNumber || userCD?.SDT || '', "hoten": userCD?.FullName || '' }}
                                objectData={{ loai: Loai }}
                                ref={refTTDiDuong}
                                listCom={listComDiDuong}
                                listenState={state => onChangeState(state)}
                            />
                        </View>, [])
                    }
                    {/* <ThongTinChungRender
                        listCom={[
                            {
                                id: 13,
                                name: "Loại đăng ký:",
                                type: TYPES.CauHoi,
                                check: false,
                                key: "loai",
                                placehoder: "",
                                errorText: "",
                                helpText: "",
                                value: lstLoai[0],
                                list: lstLoai,
                                checkNull: false,
                                // note: ' '
                            }
                        ]}
                    /> */}
                    {
                        Loai?.id == 1 && <ThongTinChungRender
                            ref={refTTDate}
                            listCom={listComTuNgayDenNgay}
                            isEdit={false}
                        />
                    }
                    {
                        Loai?.id == 2 && <ThongTinChungRender
                            ref={refTTDate}
                            listCom={listComChonNgay}
                            isEdit={false}
                        />
                    }
                    {
                        Loai?.id == 2 &&
                        <View style={{ padding: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.colorPaleGrey, paddingLeft: 10, borderRadius: 5 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: FontSize.scale(14), flex: 1 }}>{'Thêm các ngày cần đăng ký'}</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        Utils.goscreen(this, 'Modal_MultiSingleDate', {
                                            date: moment(new Date()).format('DD/MM/YYYY').toString(),
                                            disable: false,
                                            month: moment(new Date()).format('MM').toString(),
                                            years: moment(new Date()).format('YYYY').toString(),
                                            dateSelect: selectedDays,
                                            chooseOnlyDay: false,
                                            setTimeFC: data => setSelectedDays(data)
                                        })
                                    }}
                                    style={{ flexDirection: 'row', padding: 12, backgroundColor: colors.black_10, borderRadius: 5 }}>
                                    <Image source={selectedDays.length > 0 ? Images.icEditHome : Images.icAddBT} resizeMode='contain' style={[nstyles.nIcon20, { tintColor: colors.redStar }]} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {
                                    selectedDays.length > 0 ? selectedDays.map((e, i) => {
                                        return (
                                            <View key={i} style={{
                                                flexDirection: 'row', justifyContent: 'space-between',
                                                alignItems: 'center', backgroundColor: colors.black_10, padding: 8,
                                                marginLeft: i > 0 ? 10 : 0, marginTop: 5, borderRadius: 5
                                            }}>
                                                <Text style={{}}>{e}</Text>
                                            </View>

                                        )
                                    }) : <Text style={{ marginTop: 10 }}>{'Chưa có ngày nào được chọn'}</Text>
                                }
                            </View>
                        </View>
                    }
                    <View style={{ padding: FontSize.scale(10), flexDirection: "row" }}  >
                        <ButtonCom
                            onPress={onPressSubmid}
                            sizeIcon={30}
                            txtStyle={{ color: colors.white }}
                            style={customStyles.buttonSubmit}
                            text={"Gửi đăng ký giấy đi đường"}
                        />
                    </View>
                </KeyboardAwareScrollView>
                <IsLoading ref={refLoading} />
            </View>
        </View>
    )
}

export default DangKyGDD
const customStyles = StyleSheet.create({
    title: {
        fontWeight: 'bold', fontSize: FontSize.reText(20), color: colors.blueFaceBook, textAlign: 'center', paddingVertical: FontSize.scale(10)
    },
    icKhaiHo: {
        width: FontSize.reSize(20),
        height: FontSize.reSize(20),
        tintColor: colors.colorSalmon,
        borderWidth: 0.5, borderColor: colors.colorSalmon
    },
    textKH: {
        fontWeight: 'bold', fontSize: FontSize.reText(18), color: colors.black_60, paddingHorizontal: FontSize.scale(10)
    },
    contentKhaiHo: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: FontSize.scale(15)
    },
    buttonSubmit: {
        borderRadius: FontSize.scale(5),
        alignSelf: 'center',
        flex: 1, padding: FontSize.scale(15),
        width: '100%'
    },
    containerBody: {
        paddingHorizontal: FontSize.scale(7), backgroundColor: colors.colorPaleGrey, flex: 1,
        paddingBottom: getBottomSpace()
    },
    location: {
        fontWeight: 'bold',
        color: colors.blueFaceBook,
        padding: 10
    }
})