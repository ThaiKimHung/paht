import React, { useState, useRef, useEffect } from 'react'
import { BackHandler, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Utils, { icon_typeToast } from '../../../../../app/Utils'
import ImageCus from '../../../../../components/ImageCus'
import { colors } from '../../../../../styles'
import { colorsSVL } from '../../../../../styles/color'
import FontSize from '../../../../../styles/FontSize'
import { reSize, reText } from '../../../../../styles/size'
import HeaderSVL from '../../../components/HeaderSVL'
import { ImagesSVL } from '../../../images'
import { Height, nstyles, Width } from '../../../../../styles/styles'
import { store } from '../../../../../srcRedux/store'
import { onUpdateAvatar } from '../../HoSo/components/OnUpdateAvatar'
import HeaderTitle from '../../HoSo/components/HeaderTitle'
import DropDownModal from '../../../components/DropDownModal'
import { SetDataTinTuyenDung } from '../../../../../srcRedux/actions/sanvieclam/DataSVL'
import { useSelector } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePickerNew from '../../../../../components/ComponentApps/ImagePicker/ImagePickerNew';
import { ImgComp } from '../../../../../components/ImagesComponent'

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

const ThongTinDaiDien = (props) => {
    const DataTuyenDung = useSelector(state => state.dataSVL.Data_TinTuyenDung[1])
    Utils.nlog('gia tri item', DataTuyenDung)
    const [IsFinish, setIsFinish] = useState(false)
    const [pathAvatar, setPathAvatar] = useState(
        DataTuyenDung && !DataTuyenDung.data && DataTuyenDung?.Avata ? DataTuyenDung.Avata :
            {
                img: undefined,
                checkFrist: true,
            }
    )
    const refLoading = useRef(null)
    const [GiayPhepKinhDoanh, setGiayPhepKinhDoanh] = useState(
        {
            ListFileDinhKemNew: [],
            ListHinhAnhDelete: [],
            ListHinhAnh: DataTuyenDung?.GiayPhepKinhDoanh ? DataTuyenDung?.GiayPhepKinhDoanh : [],
        }
    )
    const [FileDinhKem, setFileDinhKem] = useState(
        {
            ListFileDinhKemNew: [],
            ListHinhAnhDelete: [],
            ListHinhAnh: DataTuyenDung?.FileDinhKem ? DataTuyenDung?.FileDinhKem : [],
        }
    )
    const [state, setstate] = useState([
        {
            title: 'Doanh nghiệp, Công ty/ Cá nhân  ',
            value: DataTuyenDung && !DataTuyenDung.data && DataTuyenDung?.TenDoanhNghiepLH ?
                DataTuyenDung?.TenDoanhNghiepLH : '',
        },
        {
            title: 'Người liên hệ',
            value: DataTuyenDung && !DataTuyenDung.data && DataTuyenDung?.TenNguoiLH ?
                DataTuyenDung?.TenNguoiLH : '',
        },
        {
            title: 'Số Điện thoại',
            value: DataTuyenDung && !DataTuyenDung.data && DataTuyenDung?.PhoneNumberLH ?
                DataTuyenDung?.PhoneNumberLH : '',
        },
        {
            label: 'Khu vực làm việc',
            title: '-- Chọn khu vực--',
            value: DataTuyenDung && !DataTuyenDung.data && DataTuyenDung.addWork ? DataTuyenDung.addWork : ''
        },
        {
            title: 'Địa Chỉ',
            value: DataTuyenDung && !DataTuyenDung.data && DataTuyenDung?.DiaChi ?
                DataTuyenDung?.DiaChi : '',
        },
        {
            title: 'Email',
            value: DataTuyenDung && !DataTuyenDung.data && DataTuyenDung?.EmailLH ?
                DataTuyenDung?.EmailLH : '',
        }
    ])

    const Save_TinTuyenDung = (item, index) => {
        store.dispatch(SetDataTinTuyenDung(item, index))
    }

    const CheckData = (IsFinish = false) => {
        if (state[0].value.trim().length <= 0) {
            !IsFinish ? Utils.showToastMsg("Thông báo ", "Bạn chưa nhập tên doanh nghiệp", icon_typeToast.danger, 2000) : null;
            return false; s
        }
        else if (state[1].value.trim().length <= 0) {
            !IsFinish ? Utils.showToastMsg("Thông báo ", "Bạn chưa nhập người liên hệ", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else if (state[2].value.trim().length <= 0 || !validatePhoneNumber(state[2].value)) {
            !IsFinish ? Utils.showToastMsg("Thông báo ", "Số điện thoại không hợp lệ", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else if (state[3].value.length <= 0) {
            !IsFinish ? Utils.showToastMsg("Thông báo ", "Bạn chưa chọn khu vực làm việc", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else if (state[4].value.trim().length <= 0) {
            !IsFinish ? Utils.showToastMsg("Thông báo ", "Bạn chưa nhập địa chỉ", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else if (state[5].value.trim().length <= 0 || !validateEmail(state[5].value)) {
            !IsFinish ? Utils.showToastMsg("Thông báo ", "Email không hợp lệ", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else if (!pathAvatar.img) {
            !IsFinish ? Utils.showToastMsg("Thông báo ", "Bạn chưa chọn avatar cho doanh nghiệp", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else if (GiayPhepKinhDoanh.ListHinhAnh.concat(GiayPhepKinhDoanh.ListFileDinhKemNew).length <= 0) {
            !IsFinish ? Utils.showToastMsg("Thông báo ", "Bạn chưa cung cấp giấy phép kinh doanh", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else {
            return true;
        }
    }

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", backAction);
        }
    }, []);

    useEffect(() => {
        if (CheckData(true)) {
            if (!IsFinish)
                setIsFinish(true);
        }
        else {
            if (IsFinish)
                setIsFinish(false);
        }
    }, [state, pathAvatar])

    const backAction = () => {
        Go_Back();
        return true;
    };
    const OnNext = () => {
        if (CheckData()) {
            let itemSeTepCv2 = {
                TenDoanhNghiepLH: state[0].value,
                GiayPhepKinhDoanh: GiayPhepKinhDoanh.ListHinhAnh.concat(GiayPhepKinhDoanh.ListFileDinhKemNew),
                FileDinhKem: FileDinhKem.ListHinhAnh.concat(FileDinhKem.ListFileDinhKemNew),
                Avata: pathAvatar,
                TenNguoiLH: state[1].value,
                PhoneNumberLH: state[2].value,
                DiaChi: state[4].value,
                addWork: state[3].value,
                EmailLH: state[5].value,
            }
            Utils.nlog('gia tri data cv', itemSeTepCv2)
            Save_TinTuyenDung(itemSeTepCv2, 1) // save dataaSVl store redux theo index
            Utils.navigate('Sc_ThongTinTuyenDung')
        }
    }

    const Go_Back = () => {
        let itemSeTepCv2 = {
            TenDoanhNghiepLH: state[0].value,
            Avata: pathAvatar,
            GiayPhepKinhDoanh: GiayPhepKinhDoanh.ListFileDinhKemNew.concat(GiayPhepKinhDoanh.ListHinhAnh),
            FileDinhKem: FileDinhKem.ListFileDinhKemNew.concat(FileDinhKem.ListHinhAnh),
            TenNguoiLH: state[1].value,
            PhoneNumberLH: state[2].value,
            DiaChi: state[4].value,
            addWork: state[3].value,
            EmailLH: state[5].value,
        }
        Utils.nlog('gia tri data cv', itemSeTepCv2)
        Save_TinTuyenDung(itemSeTepCv2, 1) // save dataaSVl store redux theo index
        // Save_TinTuyenDung({}, 1) // remove data store redux theo index
        Utils.goback(this)

    }

    const setDataChange = (item, index) => {
        let daaTempt = [...state]
        daaTempt[index].value = item;
        setstate(daaTempt)
    }

    const GoModal_Address = () => {
        Utils.navigate('Modal_Address', {
            CallBack: Get_ItemAdrees, DataSeleted:
                state[3].value
        })
    }
    const Get_ItemAdrees = (item) => {
        setDataChange(item, 3)
    }

    const validatePhoneNumber = (number) => {
        return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    }


    Utils.nlog('gia tri state', state)
    // Utils.nlog('gia tri state kinh doanh', GiayPhepKinhDoanh, FileDinhKem)
    return (
        <View style={stThongTinDaiDien.container}>
            <HeaderSVL
                title={"Đăng tin duyển dụng"}
                iconLeft={ImagesSVL.icBackSVL}
                onPressLeft={Go_Back}
                titleRight={'Tiếp theo'}
                Sleft={{ width: reSize(75) }}
                Sright={{ color: !IsFinish ? colorsSVL.grayTextLight : colorsSVL.blueMainSVL, fontSize: reText(14), width: reSize(75) }}
                styleTitleRight={{ width: reSize(75) }}
                styleTitle={{ flex: 1 }}
                onPressRight={OnNext}
            />

            <KeyboardAwareScrollView
                style={{
                    flex: 1, backgroundColor: colors.white,
                    marginTop: 10,
                    paddingTop: 15
                }}
                extraScrollHeight={50}
                contentContainerStyle={{ paddingBottom: 25 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingHorizontal: 12 }}>
                    <HeaderTitle text='2. Thông tin đại diện    '
                        titleSub='Thông tin giúp người sử dụng lao động dễ tìm thông tin bạn hơn'
                    />
                </View>
                <View style={{ alignItems: 'center' }} >
                    <TouchableOpacity style={{
                        marginTop: FontSize.verticalScale(30), marginBottom: 20
                    }}
                        onPress={() => {
                            onUpdateAvatar(refLoading, res => {
                                if (res.iscancel || res.error) {
                                    return;
                                }
                                setPathAvatar({
                                    checkFrist: false,
                                    img: res.length > 0 ? res : pathAvatar.img
                                })
                            })
                        }}>
                        <ImageCus defaultSourceCus={ImagesSVL.icAvatar} source={{ uri: pathAvatar?.checkFrist ? pathAvatar?.img : pathAvatar?.img[0].uri }} style={nstyles.nAva120}
                            resizeMode='cover' />
                    </TouchableOpacity>
                </View>
                {state?.map((item, index) => {
                    if (index === 0) {
                        return (
                            <View key={index} >
                                <View style={{ marginBottom: 5, paddingHorizontal: 12 }} >
                                    <Text style={{ marginBottom: 8, fontSize: reText(16) }}>{item.title}</Text>
                                    <TextInput
                                        style={{ height: 40, borderRadius: 4, backgroundColor: colors.whitegay, paddingHorizontal: 10 }}
                                        value={item.value}
                                        placeholder={item.title}
                                        onChangeText={(text) => {
                                            let dataTempt = [...state]
                                            dataTempt[index]['value'] = text;
                                            setstate(dataTempt)
                                        }}
                                        styleError={{
                                            marginLeft: 6
                                        }}
                                    />
                                </View>
                                <Text style={{ paddingHorizontal: 12, marginTop: 5, fontSize: reText(16) }} >Giấy phép kinh doanh(Tối đa 1 file)</Text>
                                <ImagePickerNew
                                    datamenuCus={dataMenu}
                                    data={GiayPhepKinhDoanh.ListHinhAnh}
                                    dataNew={DataTuyenDung?.GiayPhepKinhDoanh ? [] : GiayPhepKinhDoanh.ListHinhAnh}
                                    NumberMax={1}
                                    isEdit={true}
                                    keyname={"TenFile"} uniqueKey={'uri'} nthis={{ props: props }}
                                    onDeleteFileOld={(data) => {
                                        let dataNew = [].concat(GiayPhepKinhDoanh.ListHinhAnhDelete).concat(data)
                                        setGiayPhepKinhDoanh(
                                            {
                                                ...GiayPhepKinhDoanh,
                                                ListHinhAnhDelete: dataNew,
                                            }
                                        )
                                    }}
                                    onAddFileNew={(data) => {
                                        Utils.nlog("Data list image mớ", data)
                                        setGiayPhepKinhDoanh(
                                            {
                                                ...GiayPhepKinhDoanh,
                                                ListFileDinhKemNew: data,
                                            }
                                        )
                                    }}
                                    onUpdateDataOld={(data) => {
                                        setGiayPhepKinhDoanh(
                                            {
                                                ...GiayPhepKinhDoanh,
                                                ListHinhAnh: data,
                                            }
                                        )
                                    }}
                                    isPickOne={true}
                                >
                                </ImagePickerNew>
                                <View style={{ height: 5, backgroundColor: colors.whitegay, marginVertical: 10 }} />
                                <Text style={{ paddingHorizontal: 12, marginTop: 5, fontSize: reText(16) }} >File đính kèm(Tối đa 3 file)</Text>
                                <ImagePickerNew
                                    datamenuCus={dataMenu}
                                    data={FileDinhKem.ListHinhAnh}
                                    dataNew={DataTuyenDung?.FileDinhKem ? [] : FileDinhKem.ListHinhAnh}
                                    NumberMax={3}
                                    isEdit={true}
                                    keyname={"TenFile"} uniqueKey={'uri'} nthis={{ props: props }}
                                    onDeleteFileOld={(data) => {
                                        let dataNew = [].concat(FileDinhKem.ListHinhAnhDelete).concat(data)
                                        setFileDinhKem(
                                            {
                                                ...FileDinhKem,
                                                ListHinhAnhDelete: dataNew,
                                            }
                                        )
                                    }}
                                    onAddFileNew={(data) => {
                                        Utils.nlog("Data list image mớ", data)
                                        setFileDinhKem(
                                            {
                                                ...FileDinhKem,
                                                ListFileDinhKemNew: data,
                                            }
                                        )
                                    }}
                                    onUpdateDataOld={(data) => {
                                        setFileDinhKem(
                                            {
                                                ...FileDinhKem,
                                                ListHinhAnh: data,
                                            }
                                        )
                                    }}
                                    isPickOne={true}
                                >
                                </ImagePickerNew>
                                <View style={{ height: 5, backgroundColor: colors.whitegay, marginVertical: 5 }} />
                            </View>
                        )
                    }
                    else
                        return (
                            <View key={index} style={{ marginBottom: 20, paddingHorizontal: 12 }}>
                                {item?.label === 'Khu vực làm việc' ?
                                    <View>
                                        <DropDownModal
                                            key={index}
                                            valueSeleted={item.value}
                                            KeyId={item.KeyId}
                                            styleTextTitle={{
                                                color: item.value ? colors.blackt :
                                                    colorsSVL.grayTextLight
                                            }}
                                            label={item.label}
                                            text={item.value ? item.value.TenQuanHuyen + '- ' +
                                                item.value.TenTinhThanh : item.title}
                                            styleText={{ fontSize: 13 }} styleImg={nstyles.nIcon12}
                                            isValue={false}
                                            isSearch={true}
                                            onPress={
                                                GoModal_Address}
                                        />
                                    </View>
                                    :
                                    <View key={index}>
                                        <Text style={{ marginBottom: 8, fontSize: reText(16) }}>{item.title}</Text>
                                        <TextInput
                                            style={{ height: 40, borderRadius: 4, backgroundColor: colors.whitegay, paddingHorizontal: 10 }}
                                            value={item.value}
                                            // onCheckError={(text) => onCheckErrorInput(text, index)}
                                            placeholder={item.title}
                                            onChangeText={(text) => {
                                                let dataTempt = [...state]
                                                dataTempt[index]['value'] = text;
                                                setstate(dataTempt)
                                            }}
                                            maxLength={index === 2 ? 10 : null}
                                            keyboardType={index === 2 ? 'phone-pad' : null}
                                            styleError={{
                                                marginLeft: 6
                                            }}
                                        />
                                    </View>
                                }
                            </View>
                        )
                })}
            </KeyboardAwareScrollView >
        </View >
    )
}

export default ThongTinDaiDien

const stThongTinDaiDien = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.whitegay,
    },
    bold: {
        fontWeight: Platform.OS == 'android' ? 'bold' : '600'
    },
    styleBtn: {
        width: Width(85),
        height: Width(10),
        alignItems: "center", justifyContent: "center", alignSelf: "center",
        backgroundColor: "#00B471",
    }
})
