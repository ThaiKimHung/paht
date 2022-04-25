import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, BackHandler } from 'react-native'
import { colors } from '../../../styles';
import ComponentItem, { TYPES } from '../../screens/user/dangky/Component';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { ButtonCom, HeaderCus } from '../../../components';
import Utils, { icon_typeToast } from '../../../app/Utils';
import { Images } from '../../images';
import FontSize from '../../../styles/FontSize';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { getCurrentPosition } from './hook';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { ImgComp } from '../../../components/ImagesComponent';
import { reText } from '../../../styles/size';
import ThongTinChungRender from '../../screens/user/dangky/ThongTinChungRender';
import ThongTinDiaChi from '../../screens/user/dangky/ThongTinDiaChi';
import ListCauHoi from './component/ListCauHoi';
import PhotoPickerView from './component/PhotoPickerView';
import ThongTinDiaChiDen from '../../screens/user/dangky/ThongTinDiaChiDen';
const listGT = [
    {
        id: 0,
        name: "Đi về trong ngày"
    },
    {
        id: 1,
        name: "Về ở luôn"
    }
]
const listCom = [
    {

        id: 2,
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
        },
        styleLabelCus: {
            fontSize: FontSize.reText(20)
        }
    },
    {

        id: 3,
        name: 'Số diện thoại',
        type: TYPES.TextInput,
        check: true,
        key: 'sodienthoai',
        placehoder: 'Nhập số điện thoại',
        errorText: '',
        helpText: '',
        keyboardType: 'phone-pad',
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabelCus: {
            fontSize: FontSize.reText(20)
        }

    },
    {
        id: 1,
        name: 'Địa chỉ đi',
        type: TYPES.Title,
        check: false,
        key: 'ttcn',
    },

    {
        id: 8,
        name: 'Huyện',
        type: TYPES.Children,
        check: false,
    },
]
const listComKhaiBao = [
    // {
    //     id: 1,
    //     name: 'Khai báo mục đích',
    //     type: TYPES.Title,
    //     check: false,
    //     key: 'ttmd',
    // },
    {
        id: 2,
        name: 'Mục đích ',
        // note: "Khuyến cáo: phần dành riêng cho người tự cách ly y tế tại nhà, những người không có trách nhiệm hoặc khai báo thông tin sai là vi phạm pháp luật Việt Nam và có thể xử lý hình sự",
        type: TYPES.CauHoi,
        check: true,
        key: 'MucDichDangKy',
        placehoder: '',
        errorText: '',
        helpText: '',
        value: listGT[0],//mặc định là đi về trong ngày
        list: listGT,
        checkNull: true
    },
    {
        id: 1,
        name: 'Trạm đến',
        type: TYPES.DropDown,
        check: true,
        key: 'tram',
        placehoder: '- Chọn trạm -',
        errorText: '',
        helpText: '',
        isRow: false,
        isEnd: false,
        keyView: 'TenTram',
        styleBodyInputCus: {
            borderColor: colors.turquoiseBlue_10,
            borderRadius: 7,
            backgroundColor: colors.colorPaleGrey,
        },
        styleLabelCus: {
            // fontSize: FontSize.reText(20),
            fontWeight: '400'
        },
        prefixlabelCus: {
            tintColor: colors.cobaltBlue,
        },
        checkNull: true
    },
]
const listComDiaChi = [
    {
        id: 1,
        name: 'Tỉnh/Thành phố',
        type: TYPES.DropDown,
        check: false,
        key: 'tinh',
        placehoder: '- Chọn tỉnh/thành -',
        errorText: '',
        helpText: '',
        isRow: false,
        isEnd: false,
        keyView: 'TenTinhThanh',
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
        }, checkNull: true,
    },
    {
        id: 5,
        name: 'Huyện',
        type: TYPES.DropDown,
        check: false,
        key: 'huyen',
        placehoder: '- Chọn quận/huyện -',
        errorText: '',
        helpText: '',
        isRow: false,
        isEnd: false,
        keyView: 'TenQuanHuyen',
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
        }, checkNull: true,
    },
    {
        id: 5,
        name: 'Xã',
        type: TYPES.DropDown,
        check: true,
        key: 'IdDonVi',
        placehoder: '- Chọn xã/phường -',
        errorText: '',
        helpText: '',
        isRow: false,
        isEnd: false,
        keyView: 'TenXaPhuong',
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
        }, checkNull: true,
    },
]
const listComDiaChiDen = [
    {
        id: 1,
        name: 'Địa chỉ đến',
        type: TYPES.Title,
        check: false,
        key: 'ttcn',
    },
    {
        id: 5,
        name: 'Huyện',
        type: TYPES.DropDown,
        check: false,
        key: 'huyen',
        placehoder: '- Chọn quận/huyện -',
        errorText: '',
        helpText: '',
        isRow: false,
        isEnd: false,
        keyView: 'TenPhuongXa',
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
        checkNull: true
    },
    {
        id: 5,
        name: 'Xã',
        type: TYPES.DropDown,
        check: true,
        key: 'phuongxa',
        placehoder: '- Chọn xã/phường -',
        errorText: '',
        helpText: '',
        isRow: false,
        isEnd: false,
        keyView: 'TenPhuongXa',
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
        checkNull: true
    },
    {
        id: 5,
        name: 'Khu phố/Tổ',
        type: TYPES.DropDown,
        check: true,
        key: 'khupho',
        placehoder: '- Chọn xã/phường -',
        errorText: '',
        helpText: '',
        isRow: false,
        isEnd: false,
        keyView: 'TenPhuongXa',
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
        checkNull: true
    },
    {
        id: 2,
        name: 'Địa chỉ đến',
        type: TYPES.TextInput,
        check: true,
        key: 'DiaChi',
        placehoder: 'Nhập địa chỉ',
        errorText: '',
        helpText: '',
        multiline: true,
        numberOfLines: 3,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabelCus: {
            // fontSize: FontSize.reText(20)
            fontWeight: '400'
        },
        checkNull: true
    },
]

const listImagePicker = [
    {
        id: 1,
        name: 'CMND/CCCD Mặt trước',
        check: true,
        key: 'i1',
        placehoder: '- Chọn xã/phường -',
        errorText: '',
        helpText: '',
    },
    {
        id: 2,
        name: 'CMND/CCCD Mặt sau',
        check: true,
        key: 'i2',
        placehoder: '- Chọn xã/phường -',
        errorText: '',
        helpText: '',
    },
    {
        id: 3,
        name: 'Phiếu xét nghiệm',
        check: true,
        key: 'i3',
        placehoder: '- Chọn xã/phường -',
        errorText: '',
        helpText: '',
    },

]
// const listImagePicker=()=>{

// }
const ToKhaiDiChuyen = (props) => {
    const [ID, setID] = useState(Utils.ngetParam({ props }, "ID", ''))
    const { userCD, tokenCD, userTNSmart = {} } = useSelector(state => state.auth);
    const { CachLy } = userCD || {}
    const refTTCaNhan = useRef(null);
    const refTTKhaiBao = useRef(null);
    const refTTDiaChi = useRef(null);
    const refTTDiaChiDen = useRef(null);
    const refTTCauHoi = useRef(null);
    const [IsKhaiHo, setIsKhaiHo] = useState(false);
    const [DiaChi, setDiaChi] = useState('')
    const [objectFile, setobjectFile] = useState({})

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backAction)
        return () => {
            try {
                BackHandler.removeEventListener('hardwareBackPress', backAction)
            } catch (error) {

            }
        }
    }, [backAction])

    const backAction = () => {
        Utils.goback({ props: props })
        return true
    }

    const getDataInit = async () => {
        Utils.setToggleLoading(true);
        let res = await apis.ApiHCM.GetList_TramKiemSoat();
        Utils.setToggleLoading(false);
        Utils.nlog("res-------haha", res)
        const { data = [] } = res || {}
        if (data && data.length > 0 && refTTKhaiBao.current) {
            refTTKhaiBao.current.setDataDropDown("tram", data);
        } else {
            Utils.showToastMsg("Thông báo", res?.error?.message || "Lỗi lấy dữ liệu trạm ", icon_typeToast.danger);
        }
    }
    useEffect(() => {
        getDataInit()
    }, [])
    const onPressSubmid = async () => {
        let objectTTCN = refTTCaNhan.current.getData();
        let objectTTDC = refTTDiaChi.current.getData();
        let objectTTDCDen = refTTDiaChiDen.current.getData();
        let objectTTCH = refTTCauHoi.current.getData();
        let objectTTKhaiBao = refTTKhaiBao.current.getData();
        Utils.nlog("data câu hoi-----", objectTTCN, objectTTDC, objectTTCH, objectTTKhaiBao)
        if (!tokenCD) {
            Utils.showToastMsg("Thông báo", "Vui lòng đăng nhập ", icon_typeToast.warning);
            return;
        }
        Utils.nlog("res data-------[TH2]", objectTTCN, objectTTDC, objectTTDCDen);
        for (const element of listCom) {
            if (element["checkNull"] == true && !objectTTCN[element['key']]) {
                Utils.showToastMsg("Thông báo", "Vui lòng kiểm tra điền đầy đủ thông tin cá nhân", icon_typeToast.warning);
                return;
            }
        }
        for (const element of listComDiaChi) {
            if (element["checkNull"] == true && !objectTTDC[element['key']]) {
                Utils.showToastMsg("Thông báo", "Vui lòng kiểm tra điền đầy đủ thông tin địa chỉ", icon_typeToast.warning);
                return;
            }
        }
        for (const element of listComKhaiBao) {
            if (element["checkNull"] == true && !objectTTKhaiBao[element['key']]) {
                Utils.showToastMsg("Thông báo", "Vui lòng kiểm tra điền đầy đủ thông tin mục đích và trạm đến", icon_typeToast.warning);
                return;
            }
        }
        for (const element of listComDiaChiDen) {
            if (element["checkNull"] == true && !objectTTDCDen[element['key']]) {
                Utils.showToastMsg("Thông báo", "Vui lòng kiểm tra điền đầy đủ thông tin địa chỉ đến", icon_typeToast.warning);
                return;
            }
        }
        if (!location) {
            Utils.showToastMsg("Thông báo", "Vui lòng kiểm tra và bật vị trí để thực hiện khai báo", icon_typeToast.warning);
            return;
        }
        if (!objectFile?.i1 || !objectFile?.i2 || !objectFile?.i3) {
            Utils.showToastMsg("Thông báo", "Vui lòng chụp đầy đủ hình ảnh giấy tờ", icon_typeToast.warning);
            return;
        }
        let dataBoDy = new FormData();

        dataBoDy.append('CMT_MatTruoc',
            {
                name: "imageMatTRuoc" + '.png',
                type: "image/png",
                uri: objectFile?.i1?.uri
            });
        dataBoDy.append('CMT_MatSau',
            {
                name: "imageMatSau" + '.png',
                type: "image/png",
                uri: objectFile?.i2?.uri
            });
        dataBoDy.append('PhieuXetNghiem',
            {
                name: "imageGiayXetNghiem" + '.png',
                type: "image/png",
                uri: objectFile?.i3?.uri
            });

        dataBoDy.append('HoTen', objectTTCN.hoten || '');
        dataBoDy.append('IsKhaiHo', IsKhaiHo ? true : false);
        dataBoDy.append("MucDichDangKy", objectTTKhaiBao?.MucDichDangKy?.id);
        dataBoDy.append("IdTram", objectTTKhaiBao?.tram?.IdTram);
        dataBoDy.append("PhoneNumber", objectTTCN.sodienthoai || '');
        dataBoDy.append("DiaChi", objectTTDCDen?.DiaChi || '');
        dataBoDy.append("MaPX", objectTTDCDen?.phuongxa?.IdDonVi || '');
        dataBoDy.append("IdThanhPho", objectTTDC?.tinh?.IDTinhThanh || '');
        dataBoDy.append("IdQuanHuyen", objectTTDC?.huyen?.IDQuanHuyen || '');
        dataBoDy.append("IdPhuongXa", Number(objectTTDC?.IdDonVi?.IdPhuongXa) || '');
        dataBoDy.append("LstTraLoi_JSON", JSON.stringify(objectTTCH));

        Utils.nlog("body", dataBoDy)
        Utils.setToggleLoading(true);
        let res = await apis.ApiHCM.Confirm_KhaiBaoDiChuyen(dataBoDy)
        Utils.nlog("res", res)
        Utils.setToggleLoading(false);
        if (res.status == 1) {
            Utils.showToastMsg("Thông báo", "Thực hiện thành công", icon_typeToast.success);
        } else {
            Utils.showToastMsg("Thông báo", res?.data?.message || "Thực hiện thất bại", icon_typeToast.warning);
        }


    }
    const renderPhotoPicker = (item, index) => {
        const { key } = item
        return <PhotoPickerView key={index} {...item} data={objectFile[key] || ''} setData={(val) => setobjectFile({ ...objectFile, [key]: val })} />
    }
    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <HeaderCus
                Sleft={{ tintColor: 'white' }}
                onPressLeft={() => Utils.goback({ props })}
                iconLeft={Images.icBack}
                title={`Khai báo di chuyển`}
                styleTitle={{ color: colors.white }}
            />
            <View style={customStyles.containerBody}>
                <KeyboardAwareScrollView style={{ backgroundColor: colors.white }} showsVerticalScrollIndicator={false}>
                    <View style={{ paddingVertical: FontSize.reText(10), }}>
                        <Text style={customStyles.title}>{'khai báo di chuyển'.toLocaleUpperCase()}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        setIsKhaiHo(!IsKhaiHo)
                    }} style={customStyles.contentKhaiHo}>
                        <Image
                            source={IsKhaiHo ? Images.icCheck : Images.icUnCheck}
                            resizeMode="contain"
                            style={customStyles.icKhaiHo}
                        />
                        <Text style={customStyles.textKH}>{`Khai hộ`}</Text>

                    </TouchableOpacity>
                    <View pointerEvents={IsKhaiHo ? 'auto' : 'none'}>
                        <ThongTinChungRender objectData={{ "sodienthoai": IsKhaiHo ? '' : userCD?.PhoneNumber || userCD?.SDT || '', "hoten": IsKhaiHo ? '' : userCD?.FullName || '' }} ref={refTTCaNhan} listCom={listCom} isEdit={true} >
                            <ThongTinDiaChi tinh={CachLy?.IDTinhThanh || ''} huyen={CachLy?.IDQuanHuyen || ''} IdDonVi={CachLy?.IDXaPhuong} ref={refTTDiaChi} isEdit={true} listCom={listComDiaChi} />
                        </ThongTinChungRender>
                    </View>
                    <ThongTinChungRender ref={refTTKhaiBao} listCom={listComKhaiBao} isEdit={true} >
                    </ThongTinChungRender>
                    <ThongTinDiaChiDen ref={refTTDiaChiDen} isEdit={true} listCom={listComDiaChiDen} key="to khai" />
                    {
                        listImagePicker.map(renderPhotoPicker)
                    }
                    <ListCauHoi ref={refTTCauHoi} />
                    <View style={{
                        padding: FontSize.scale(10),
                        flexDirection: 'row',
                    }}>
                        <ButtonCom
                            onPress={onPressSubmid}
                            sizeIcon={30}
                            txtStyle={{ color: colors.white }}
                            style={customStyles.buttonSubmit}
                            text={'Gửi thông tin khai báo'}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </View >
    )
}
export default ToKhaiDiChuyen
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
        paddingHorizontal: FontSize.scale(15), backgroundColor: colors.colorPaleGrey, flex: 1,
        paddingBottom: getBottomSpace()
    }
})

