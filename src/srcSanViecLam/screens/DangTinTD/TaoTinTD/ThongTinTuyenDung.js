import React, { useState, useEffect } from 'react'
import { BackHandler, StyleSheet, Text, TextInput, View } from 'react-native'
import Utils, { icon_typeToast } from '../../../../../app/Utils'
import { DatePick } from '../../../../../components'
import { SetDataTinTuyenDung } from '../../../../../srcRedux/actions/sanvieclam/DataSVL'
import { store } from '../../../../../srcRedux/store'
import { colorsSVL, colors } from '../../../../../styles/color'
import { reSize, reText } from '../../../../../styles/size'
import { nstyles, Width } from '../../../../../styles/styles'
import DropDownModal from '../../../components/DropDownModal'
import HeaderSVL from '../../../components/HeaderSVL'
import { ImagesSVL } from '../../../images'
import HeaderTitle from '../../HoSo/components/HeaderTitle'
import { GetAllList_DM_MucLuong } from '../../../apis/apiSVL'
import { useSelector } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const ThongTinTuyenDung = (props) => {
    const DataTuyenDung = useSelector(state => state.dataSVL.Data_TinTuyenDung[2])
    Utils.nlog('gia tri item', DataTuyenDung)
    const [IsFinish, setIsFinish] = useState(false)
    const Get_Date = () => {
        let date = new Date();
        let Year = date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear();
        let Month = date.getMonth() === 11 ? 1 : date.getMonth() === 12 ? 2 : date.getMonth() + 2;
        let dateTempt = ''
        if (Month < 10) {
            dateTempt = Year + '-' + '0' + Month + '-' + date.getDate();
        }
        else {
            dateTempt = Year + '-' + Month + '-' + date.getDate();
        }
        Utils.nlog('gia tri ', dateTempt)
        return dateTempt;
    }
    let date = Get_Date();
    const [state, setstate] = useState([
        {
            title: 'Tiêu Đề',
            label: '-- Nhập tiêu đề --',
            value: DataTuyenDung && !DataTuyenDung.data && DataTuyenDung?.NoiDung ?
                DataTuyenDung?.NoiDung : '',
        },
        {
            title: 'Số lượng tuyển dụng',
            value: DataTuyenDung && !DataTuyenDung.data && DataTuyenDung?.SoLuongTuyenDung ?
                DataTuyenDung?.SoLuongTuyenDung + '' : '',
            label: '-- Nhập số lượng tuyển dụng --',
        },
        {
            title: 'Lương',
            KeyTitle: 'MucLuong',
            KeyId: 'Id',
            value: DataTuyenDung && !DataTuyenDung.data && DataTuyenDung?.Luong ?
                DataTuyenDung?.Luong : { Id: 0, MucLuong: '--Không chọn--' },
            label: '-- Chọn mức lương--',
            data: [],
            Placeholdertxt1: 'Mức lương từ',
            Placeholdertxt2: 'Mức lương đến',
            MucLuongFrom: DataTuyenDung && !DataTuyenDung.data && DataTuyenDung?.MucLuongFrom ?
                DataTuyenDung?.MucLuongFrom + '' : '',
            MucLuongTo: DataTuyenDung && !DataTuyenDung.data && DataTuyenDung?.MucLuongTo ?
                DataTuyenDung?.MucLuongTo + '' : '',
        },
        {
            title: 'Thời  hạn tuyển dụng',
            value: DataTuyenDung && !DataTuyenDung.data && DataTuyenDung?.HanNopHoSo ?
                DataTuyenDung?.HanNopHoSo : date,
            label: '',
        }
    ])

    const Save_TinTuyenDung = (item, index) => {
        store.dispatch(SetDataTinTuyenDung(item, index))
    }

    useEffect(() => {
        get_Api();
    }, [])

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

    const get_Api = async () => {
        let res = await GetAllList_DM_MucLuong();
        Utils.nlog('gia tri mưc lương', res)
        let dataTempt = [...state];
        dataTempt[2].data = res.data && res.status === 1 ? [{ Id: 0, MucLuong: '--Không chọn--' }].concat(res.data) : []
        setstate(dataTempt)
    }
    const CheckData = (IsFinish = false) => {
        if (state[0].value.trim().length <= 0) {
            !IsFinish ? Utils.showToastMsg("Thông báo ", "Bạn chưa nhập tiêu đề tuyển dụng", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else if (isNaN(state[1].value) || state[1].value.trim().length <= 0 || state[1].value === '0') {
            !IsFinish ? Utils.showToastMsg("Thông báo ", "Số lượng tuyển dụng không hợp lệ", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else if (state[2].value.length <= 0) {
            !IsFinish ? Utils.showToastMsg("Thông báo ", "Bạn chưa chọn mức lương", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else if (parseInt(Utils.replaceAll(state[2].MucLuongTo + '', '.', '')) <= parseInt(Utils.replaceAll(state[2].MucLuongFrom + '', '.', '')) && state[2].value.Id != 7) {
            !IsFinish ? Utils.showToastMsg("Thông báo ", "Mức lương đến phải lớn hơn mức lương từ", icon_typeToast.danger, 2000) : null;
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

    const OnNext = () => {
        if (CheckData()) {
            let itemSeTepCv1 = {
                NoiDung: state[0].value,
                SoLuongTuyenDung: state[1].value,
                Luong: state[2].value,
                MucLuongFrom: state[2].MucLuongFrom,
                MucLuongTo: state[2].MucLuongTo,
                HanNopHoSo: state[3].value,
            }
            Utils.nlog('gia tri data cv', itemSeTepCv1)
            Save_TinTuyenDung(itemSeTepCv1, 2) // save dataaSVl store redux theo index
            Utils.navigate('Sc_MoTaCongViec')
        }
    }

    const Go_Back = () => {
        let itemSeTepCv1 = {
            NoiDung: state[0].value,
            SoLuongTuyenDung: state[1].value,
            Luong: state[2].value,
            MucLuongFrom: state[2].MucLuongFrom,
            MucLuongTo: state[2].MucLuongTo,
            HanNopHoSo: state[3].value,
        }
        Save_TinTuyenDung(itemSeTepCv1, 2) // save dataaSVl store redux theo index
        Utils.goback({ props: props })
    }

    const setDataChange = (item, index) => {
        let daaTempt = [...state]
        daaTempt[index].value = item;
        setstate(daaTempt)
    }

    const Get_ItemDrop = (item, index) => { // lấy item từ các dropdown
        Utils.nlog('gia tri item', item);
        setDataChange(item, index)
        let dataTempt = [...state]
        dataTempt[index]['MucLuongFrom'] = item?.MucLuongFrom == 0 || item.Id == 0 ? '' : Conver_MucLuong(item?.MucLuongFrom);
        dataTempt[index]['MucLuongTo'] = item?.MucLuongTo == 0 || item.Id == 0 ? '' : Conver_MucLuong(item?.MucLuongTo);
        setstate(dataTempt)
    }

    const Conver_MucLuong = (value = 0) => {
        return parseInt(value).toLocaleString('it-IT') + '';
    }

    useEffect(() => {
        if (state[2].MucLuongFrom?.length >= 4) {
            let textFormat = parseInt(Utils.replaceAll(state[2].MucLuongFrom, '.', '')).toLocaleString('it-IT');
            let dataTempt = [...state]
            dataTempt[2].MucLuongFrom = textFormat
            setstate(dataTempt)
        }

    }, [state[2].MucLuongFrom])

    useEffect(() => {
        if (state[2].MucLuongTo?.length >= 4) {
            let textFormat = parseInt(Utils.replaceAll(state[2].MucLuongTo, '.', '')).toLocaleString('it-IT');
            let dataTempt = [...state]
            dataTempt[2].MucLuongTo = textFormat
            setstate(dataTempt)
        }

    }, [state[2].MucLuongTo])
    Utils.nlog('gia tri state', state)
    return (
        <View style={stThongTinTuyenDung.container}>
            <HeaderSVL
                title={"Đăng tin tuyển dụng"}
                iconLeft={ImagesSVL.icBackSVL}
                onPressLeft={Go_Back}
                titleRight={'Tiếp theo'}
                Sleft={{ width: reSize(75) }}
                Sright={{ color: !IsFinish ? colorsSVL.grayTextLight : colorsSVL.blueMainSVL, fontSize: reText(14), width: reSize(75) }}
                styleTitleRight={{ width: reSize(75) }}
                styleTitle={{ flex: 1 }}
                onPressRight={OnNext}
            />
            <KeyboardAwareScrollView style={{
                flex: 1, backgroundColor: colors.white, marginTop: 10,
                paddingTop: 15
            }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
            >
                <View style={{ paddingHorizontal: 12 }} >
                    <HeaderTitle text='3. Thông tin tuyển dụng'
                        titleSub='Thông tin giúp người sử dụng lao động dễ tìm thông tin bạn hơn'
                    />
                </View>
                {state?.map((item, index) => {
                    if (index <= 1)
                        return (
                            <View>
                                <View style={{ marginTop: 20, paddingHorizontal: 12 }} >
                                    <Text style={stThongTinTuyenDung.txtTitle} >{item.title}</Text>
                                    <TextInput
                                        style={{
                                            height: index === 0 ? Width(25) : Width(10), backgroundColor: colors.whitegay,
                                            textAlignVertical: 'top',
                                            justifyContent: 'center', paddingHorizontal: 10,
                                            borderRadius: 4,
                                            fontSize: reText(15)
                                        }}
                                        numberOfLines={index === 0 ? 5 : null}
                                        keyboardType={index === 1 ? 'phone-pad' : null}
                                        value={item.value}
                                        placeholder={item.label}
                                        multiline={index == 0 ? true : false}
                                        onChangeText={(text) =>
                                            setDataChange(text, index)
                                        }
                                    />
                                </View>
                                {index === 1 && <View style={{ marginTop: 15, height: 4, backgroundColor: colors.whitegay }} />}
                            </View>
                        )
                    else {
                        return (
                            <View style={{
                                paddingHorizontal: 12, borderBottomWidth: index === state.length - 1 ? 0 : 0.7,
                                paddingVertical: 20,
                                borderBottomColor: colorsSVL.grayLine
                            }}>
                                {index != 2 && <Text style={stThongTinTuyenDung.txtTitle} >{item.title}</Text>}
                                {index === 2 &&
                                    <View>
                                        <DropDownModal
                                            data={item?.data}
                                            KeyTitle={item.KeyTitle}
                                            valueSeleted={item.value}
                                            KeyId={item.KeyId}
                                            label={item.title}
                                            text={item.label}
                                            CallBack={(item) => Get_ItemDrop(item, index)}
                                        />
                                        <View style={{ flexDirection: 'row', width: '100%' }} >
                                            <TextInput
                                                style={{
                                                    height: 40, borderRadius: 4,
                                                    backgroundColor: colors.whitegay,
                                                    paddingHorizontal: 10,
                                                    marginTop: 15,
                                                    marginRight: 10,
                                                    flex: 1,
                                                }}
                                                keyboardType={'phone-pad'}
                                                value={item.MucLuongFrom}
                                                placeholder={item.Placeholdertxt1}
                                                onChangeText={(text) => {
                                                    let dataTempt = [...state]
                                                    dataTempt[index]['value'] = { Id: 0, MucLuong: '--Không chọn--' };
                                                    dataTempt[index]['MucLuongFrom'] = text
                                                    setstate(dataTempt)
                                                }}
                                            />
                                            <TextInput
                                                style={{
                                                    height: 40, borderRadius: 4,
                                                    backgroundColor: colors.whitegay,
                                                    paddingHorizontal: 10,
                                                    marginTop: 15,
                                                    flex: 1,
                                                }}
                                                keyboardType={'phone-pad'}
                                                value={item.MucLuongTo}
                                                placeholder={item.Placeholdertxt2}
                                                onChangeText={(text) => {
                                                    let dataTempt = [...state]
                                                    dataTempt[index]['value'] = { Id: 0, MucLuong: '--Không chọn--' };
                                                    dataTempt[index]['MucLuongTo'] = text
                                                    setstate(dataTempt)
                                                }}
                                            />
                                        </View>
                                    </View>
                                }
                                {index === state.length - 1 &&
                                    <View>
                                        <DatePick
                                            value={item.value}
                                            Img={ImagesSVL.icCalendar}
                                            style={{
                                                height: Width(10), backgroundColor: colors.whitegay,
                                                alignItems: 'center'
                                            }}
                                            styleIcon={[nstyles.nIcon20, { resizeMode: 'contain' }]}
                                            onValueChange={dateTo => {
                                                setDataChange(dateTo, index)
                                            }}
                                        />

                                    </View>
                                }
                            </View>
                        )
                    }
                })}
            </KeyboardAwareScrollView>

        </View>
    )
}

export default ThongTinTuyenDung

const stThongTinTuyenDung = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.whitegay,
    },
    txtTitle: {
        fontSize: reText(16),
        marginBottom: 8
    }
})
