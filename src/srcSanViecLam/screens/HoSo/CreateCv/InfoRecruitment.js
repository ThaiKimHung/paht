import React, { useState, useRef, useEffect } from 'react'
import { BackHandler, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Utils, { icon_typeToast } from '../../../../../app/Utils'
import ImageCus from '../../../../../components/ImageCus'
import { colors } from '../../../../../styles'
import { colorsSVL } from '../../../../../styles/color'
import FontSize from '../../../../../styles/FontSize'
import { reSize, reText } from '../../../../../styles/size'
import HeaderSVL from '../../../components/HeaderSVL'
import { ImagesSVL } from '../../../images'
import RadioButton from '../components/RadioButton'
import { Height, nstyles, Width } from '../../../../../styles/styles'
import { onUpdateAvatar } from '../components/OnUpdateAvatar'
import HeaderTitle from '../components/HeaderTitle'
import { store } from '../../../../../srcRedux/store'
import { SetCV } from '../../../../../srcRedux/actions/sanvieclam/DataSVL'
import { DatePick } from '../../../../../components'
import { useSelector } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import UploadCmndCus from '../components/UploadCmndCus'
import ImagePickerNew from '../../../../../components/ComponentApps/ImagePicker/ImagePickerNew'
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


const InfoRecruitment = (props) => {
    const Item_CVTempt = useSelector(state => state.dataSVL.Data_CV[1])
    const [IsFinish, setIsFinish] = useState(false)
    console.log('gia tri item tempt', Item_CVTempt)
    const Save_CV = (item, index) => {
        store.dispatch(SetCV(item, index))
    }
    const [pathAvatar, setPathAvatar] = useState(Item_CVTempt &&
        !Item_CVTempt.data && Item_CVTempt.Avatar ? Item_CVTempt.Avatar :
        {
            img: undefined,
            checkFrist: true,
        }
    )

    const [GiayGioiThieu, setGiayGioiThieu] = useState(
        {
            ListFileDinhKemNew: [],
            ListHinhAnhDelete: [],
            ListHinhAnh: Item_CVTempt?.GiayGioiThieu ? Item_CVTempt?.GiayGioiThieu : [],
        }
    )

    const [FileDinhKem, setFileDinhKem] = useState(
        {
            ListFileDinhKemNew: [],
            ListHinhAnhDelete: [],
            ListHinhAnh: Item_CVTempt?.FileDinhKem ? Item_CVTempt?.FileDinhKem : [],
        }
    )
    const [Cmnd, setCmnd] = useState({
        AnhCMNDT: "",
        AnhCMNDS: "",
    })
    const refLoading = useRef(null)
    const [state, setstate] = useState([
        {
            title: 'H??? v?? t??n',
            value: Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.Name ? Item_CVTempt.Name : '',
        },
        {
            title: 'Ng??y sinh',
            value: Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.Birthday ? Item_CVTempt.Birthday : '',
        },
        {
            title: 'Gi???i t??nh',
            value: Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.Gender ? Item_CVTempt.Gender : 'Nam',
            dataGioiTinh: [
                {
                    lable: 'Nam'
                },
                {
                    lable: 'N???'
                },
            ],
        },
        {
            title: '?????a Ch???',
            value: Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.Address ? Item_CVTempt.Address : ''
        },
        {
            title: 'S??? ??i???n tho???i',
            value: Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.Phone ? Item_CVTempt.Phone : '',
        },
        {
            title: 'Email',
            value: Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.Email ? Item_CVTempt.Email : '',
        }
    ])




    const OnNext = () => {
        if (CheckData()) {
            let itemSeTepCv2 = {
                Avatar: pathAvatar,
                CMND_MatTruoc: Cmnd.AnhCMNDT,
                CMND_MatSau: Cmnd.AnhCMNDS,
                GiayGioiThieu: GiayGioiThieu.ListHinhAnh.concat(GiayGioiThieu.ListFileDinhKemNew),
                FileDinhKem: FileDinhKem.ListHinhAnh.concat(FileDinhKem.ListFileDinhKemNew),
                Name: state[0].value,
                Birthday: state[1].value,
                Gender: state[2].value,
                Address: state[3].value,
                Phone: state[4].value,
                Email: state[5].value,
            }
            Utils.nlog('gia tri data cv', itemSeTepCv2)
            Save_CV(itemSeTepCv2, 1) // save dataaSVl store redux theo index
            Utils.navigate('Sc_InfoEducation')
        }
    }

    const Go_Back = () => {
        let itemSeTepCv2 = {
            Avatar: pathAvatar,
            CMND_MatTruoc: Cmnd.AnhCMNDT,
            CMND_MatSau: Cmnd.AnhCMNDS,
            GiayGioiThieu: GiayGioiThieu.ListHinhAnh.concat(GiayGioiThieu.ListFileDinhKemNew),
            FileDinhKem: FileDinhKem.ListHinhAnh.concat(FileDinhKem.ListFileDinhKemNew),
            Name: state[0].value,
            Birthday: state[1].value,
            Gender: state[2].value,
            Address: state[3].value,
            Phone: state[4].value,
            Email: state[5].value,
        }
        Utils.nlog('gia tri data cv', itemSeTepCv2)
        Save_CV(itemSeTepCv2, 1) // save dataaSVl store redux theo index
        Utils.goback(this)

    }

    const setDataChange = (item, index) => {
        let daaTempt = [...state]
        daaTempt[index].value = item;
        setstate(daaTempt)
    }

    const Get_Gender = (item) => {
        setDataChange(item, 2)
    }


    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validatePhoneNumber = (number) => {
        return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
    }

    const CheckData = (IsFinish = false) => {
        if (state[0].value.trim().length <= 0) {
            !IsFinish ? Utils.showToastMsg("Th??ng b??o ", "B???n ch??a nh???p h??? t??n", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else if (state[1].value.length <= 0) {
            !IsFinish ? Utils.showToastMsg("Th??ng b??o ", "B???n ch??a nh???p ng??y sinh", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else if (state[3].value.trim().length <= 0) {
            !IsFinish ? Utils.showToastMsg("Th??ng b??o ", "B???n ch??a nh???p ?????a ch???", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else if (state[4].value.trim().length <= 0 || !validatePhoneNumber(state[4].value.trim())) {
            !IsFinish ? Utils.showToastMsg("Th??ng b??o ", "S??? ??i???n tho???i kh??ng h???p l???", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else if (state[5].value.trim().length <= 0 || !Utils.validateEmail(state[5].value)) {
            !IsFinish ? Utils.showToastMsg("Th??ng b??o ", "?????a ch??? email kh??ng h???p l???", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else if (!Cmnd.AnhCMNDS?.uri || !Cmnd.AnhCMNDT?.uri) {
            !IsFinish ? Utils.showToastMsg("Th??ng b??o ", "B???n ph???i cung c???p ?????y ????? hai m???t cmnd", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else if (!pathAvatar.img) {
            !IsFinish ? Utils.showToastMsg("Th??ng b??o ", "B???n ph???i up load avatar", icon_typeToast.danger, 2000) : null;
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

    const backAction = () => {
        Go_Back();
        return true;
    };

    useEffect(() => {
        if (CheckData(true)) {
            if (!IsFinish)
                setIsFinish(true);
        }
        else {
            if (IsFinish)
                setIsFinish(false);
        }
    }, [state])

    Utils.nlog('gia tri state', Cmnd)
    return (
        <View style={stInfoRecruitment.container}>
            <HeaderSVL
                title={"T???o h??? s?? xin vi???c"}
                iconLeft={ImagesSVL.icBackSVL}
                onPressLeft={Go_Back}
                titleRight={'Ti???p theo'}
                Sleft={{ width: reSize(75) }}
                Sright={{ color: !IsFinish ? colorsSVL.grayTextLight : colorsSVL.blueMainSVL, fontSize: reText(14), width: reSize(75) }}
                styleTitleRight={{ width: reSize(75) }}
                styleTitle={{ flex: 1 }}
                onPressRight={OnNext}
            />

            <KeyboardAwareScrollView
                style={{
                    backgroundColor: colors.white,
                    marginTop: 10, paddingHorizontal: 12,
                    paddingTop: 15
                }}
                contentContainerStyle={{ paddingBottom: 10 }}
                showsVerticalScrollIndicator={false}
                extraScrollHeight={50}
            >
                <HeaderTitle text='2. Th??ng tin ???ng tuy???n'
                    titleSub='Th??ng tin gi??p ng?????i s??? d???ng lao ?????ng d??? t??m th??ng tin b???n h??n'
                />
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={{
                        marginTop:
                            FontSize.verticalScale(30)
                    }}
                        onPress={() => {
                            onUpdateAvatar(refLoading, res => {
                                if (res.iscancel || res.error) {
                                    return;
                                }
                                console.log('123', res)
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
                    return (
                        <View key={index} style={{ marginBottom: 20 }}>
                            <Text style={{ marginBottom: 8, fontSize: reText(15) }}>{item.title}</Text>
                            {index == 1 ?
                                <View>

                                    <TouchableOpacity style={{
                                        flexDirection: 'row', borderRadius: 4, backgroundColor: colors.whitegay,
                                        alignItems: 'center',
                                    }}>
                                        <DatePick
                                            placeholder={'Ng??y sinh'}
                                            style={{ width: "100%", height: 40, alignItems: 'center' }}
                                            value={item.value}
                                            Img={ImagesSVL.icCalendar}
                                            styleIcon={[nstyles.nIcon20, { resizeMode: 'contain' }]}
                                            onValueChange={dateTo => {
                                                setDataChange(dateTo, index)
                                            }}
                                        />
                                    </TouchableOpacity>
                                    <View style={{ backgroundColor: 'white', flex: 1 }} >
                                        <UploadCmndCus
                                            txtTitle={{ fontWeight: null, margin: 0, marginVertical: 10 }}
                                            // isReq={defaultReq.includes(id)}
                                            styleContainer={{
                                                marginHorizontal: 0,
                                            }}
                                            callback={(data) => {
                                                Utils.nlog('vao set state cmnd', data)
                                                setCmnd({
                                                    // AnhCMNDT: data?.AnhCMNDT,
                                                    AnhCMNDT: data?.AnhCMNDT ? data?.AnhCMNDT : Item_CVTempt?.CMND_MatTruoc ? Item_CVTempt?.CMND_MatTruoc : "",
                                                    AnhCMNDS: data?.AnhCMNDS ? data?.AnhCMNDS : Item_CVTempt?.CMND_MatSau ? Item_CVTempt?.CMND_MatSau : ""
                                                })
                                            }}
                                            AnhCMNDT={Cmnd.AnhCMNDT}
                                            AnhCMNDS={Cmnd.AnhCMNDS}
                                            isEdit={true}
                                        />
                                        <View style={{ height: 5, backgroundColor: colors.whitegay, marginVertical: 10 }} />
                                        <Text style={{ paddingHorizontal: 0, marginVertical: 10, fontSize: reText(16) }} >Gi???y gi???i thi???u (T???i ??a 1 file)</Text>
                                        <ImagePickerNew
                                            styleContainer={{ padding: 0 }}
                                            datamenuCus={dataMenu}
                                            data={GiayGioiThieu.ListHinhAnh}
                                            dataNew={Item_CVTempt?.GiayGioiThieu ? [] : GiayGioiThieu.ListHinhAnh}
                                            NumberMax={1}
                                            isEdit={true}
                                            keyname={"TenFile"} uniqueKey={'uri'} nthis={{ props: props }}
                                            onDeleteFileOld={(data) => {
                                                let dataNew = [].concat(GiayGioiThieu.ListHinhAnhDelete).concat(data)
                                                setGiayGioiThieu(
                                                    {
                                                        ...GiayGioiThieu,
                                                        ListHinhAnhDelete: dataNew,
                                                    }
                                                )
                                            }}
                                            onAddFileNew={(data) => {
                                                Utils.nlog("Data list image m???", data)
                                                setGiayGioiThieu(
                                                    {
                                                        ...GiayGioiThieu,
                                                        ListFileDinhKemNew: data,
                                                    }
                                                )
                                            }}
                                            onUpdateDataOld={(data) => {
                                                setGiayGioiThieu(
                                                    {
                                                        ...GiayGioiThieu,
                                                        ListHinhAnh: data,
                                                    }
                                                )
                                            }}
                                            isPickOne={true}
                                        >
                                        </ImagePickerNew>
                                        <View style={{ height: 5, backgroundColor: colors.whitegay, marginVertical: 10 }} />
                                        <Text style={{ paddingHorizontal: 0, marginVertical: 10, fontSize: reText(16) }} >File ????nh k??m (T???i ??a 3 file)</Text>
                                        <ImagePickerNew
                                            styleContainer={{ padding: 0 }}
                                            datamenuCus={dataMenu}
                                            data={FileDinhKem.ListHinhAnh}
                                            dataNew={Item_CVTempt?.FileDinhKem ? [] : FileDinhKem.ListHinhAnh}
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
                                                Utils.nlog("Data list image m???", data)
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
                                        <View style={{ height: 5, backgroundColor: colors.whitegay, marginVertical: 10 }} />
                                    </View>
                                </View>
                                :
                                index === 2 ?
                                    <RadioButton defaultvalue={item.value} data={item?.dataGioiTinh} keyValue='lable' CallBack={Get_Gender} />
                                    :
                                    <TextInput
                                        style={{ height: 40, borderRadius: 4, backgroundColor: colors.whitegay, paddingHorizontal: 10 }}
                                        value={item.value}
                                        // onCheckError={(text) => onCheckErrorInput(text, index)}
                                        maxLength={index === 4 ? 10 : null}
                                        keyboardType={index === 4 ? 'phone-pad' : null}
                                        placeholder={item.title}
                                        onChangeText={(text) => {
                                            let dataTempt = [...state]
                                            dataTempt[index]['value'] = text;
                                            setstate(dataTempt)
                                        }}
                                    />
                            }
                        </View>
                    )
                })}
            </KeyboardAwareScrollView >
        </View >
    )
}

export default InfoRecruitment

const stInfoRecruitment = StyleSheet.create({
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
