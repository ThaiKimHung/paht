import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, BackHandler } from 'react-native'
import Utils, { icon_typeToast } from '../../../../../app/Utils'
import TextApp from '../../../../../components/TextApp'
import { colorsSVL, colors } from '../../../../../styles/color'
import { reSize, reText } from '../../../../../styles/size'
import RadioButton from '../../../../sourcequyhoach/Components/UI/RadioButton'
import HeaderSVL from '../../../components/HeaderSVL'
import DropDownModal from '../../../components/DropDownModal'
import { ImagesSVL } from '../../../images'
import RadioCheck from '../components/RadioCheck'
import HeaderTitle from '../components/HeaderTitle'
import { nstyles, } from '../../../../../styles/styles'
import ListAdd from '../components/ListAdd'
import ImageCus from '../../../../../components/ImageCus'
import { store } from '../../../../../srcRedux/store'
import { SetCV } from '../../../../../srcRedux/actions/sanvieclam/DataSVL'
import { DatePick } from '../../../../../components'
import moment from 'moment'
import { GetAllList_DM_MucLuong } from '../../../apis/apiSVL'
import { useSelector } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const BenefitRequest = (props) => {
    const Item_CVTempt = useSelector(state => state.dataSVL.Data_CV[4])
    Utils.nlog('gia tri Item_CVTempt', Item_CVTempt)
    const [state, setstate] = useState({
        dataWage: [],
        Wage: Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.Wage ? Item_CVTempt.Wage : { Id: 0, MucLuong: '--Không chọn--' },
        WorkTimeStatus: Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.WorkTStatus ? Item_CVTempt.WorkTStatus : '',
        WorkTime: Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.WorkTime ?
            Item_CVTempt.WorkTime
            : '',
        MucLuongFrom: Item_CVTempt && !Item_CVTempt.data && Item_CVTempt?.MucLuongFrom ?
            Item_CVTempt.MucLuongFrom + '' : '',
        MucLuongTo: Item_CVTempt && !Item_CVTempt.data && Item_CVTempt?.MucLuongTo ?
            Item_CVTempt.MucLuongTo + '' : '',
    })
    const refDesire = useRef([]);

    const Save_CV = (item, index) => {
        store.dispatch(SetCV(item, index))
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

    const CheckData = () => {
        if (state.MucLuongFrom.length > 0 && parseInt(Utils.replaceAll(state.MucLuongTo + '', '.', '')) < parseInt(Utils.replaceAll(state.MucLuongFrom + '', '.', '')) && state.Wage.Id != 7) {
            Utils.showToastMsg("Thông báo ", "Mức lương đến phải lớn hơn mức lương từ", icon_typeToast.danger, 2000)
            return false;
        }
        else {
            return true;
        }
    }

    const OnNext = () => {
        if (CheckData()) {
            let itemSeTepCv5 = {
                Wage: state.Wage,
                WorkTStatus: state.WorkTimeStatus,
                WorkTime: state.WorkTime,
                Desire: refDesire?.current.getData(),
                MucLuongFrom: state.MucLuongFrom,
                MucLuongTo: state.MucLuongTo,
            }
            Utils.nlog('gia tri data cv', itemSeTepCv5)
            Save_CV(itemSeTepCv5, 4) // save dataaSVl store redux theo index
            Utils.navigate('Sc_InfoResult')
        }
    }
    const Go_Back = () => {
        let itemSeTepCv5 = {
            Wage: state.Wage,
            WorkTStatus: state.WorkTimeStatus,
            WorkTime: state.WorkTime,
            Desire: refDesire?.current.getData(),
            MucLuongFrom: state.MucLuongFrom,
            MucLuongTo: state.MucLuongTo,
        }
        Utils.nlog('gia tri data cv', itemSeTepCv5)
        Save_CV(itemSeTepCv5, 4) // save dataaSVl store redux theo index
        Utils.goback(this)
    }

    const Conver_MucLuong = (value = 0) => {
        return parseInt(value).toLocaleString('it-IT') + '';
    }

    const Get_Wage = (item) => {
        Utils.nlog('gia tri item khi call back', item)
        setstate({
            ...state,
            Wage: item,
            MucLuongFrom: item?.Id == 0 || item?.Id == 1 ? '' : Conver_MucLuong(item?.MucLuongFrom),
            MucLuongTo: item?.Id == 0 || item?.Id == 1 || item?.Id == 7 ? '' : Conver_MucLuong(item?.MucLuongTo),
        })
    }

    const Get_WorkTimeStatus = (item) => {
        setstate({
            ...state,
            WorkTimeStatus: item,
        })
    }

    const Get_WorkTime = (item) => {
        setstate({
            ...state,
            WorkTime: item,
        })
    }
    const getApi = async () => {
        let res = await GetAllList_DM_MucLuong();
        let item = [{ Id: 0, MucLuong: '--Không chọn--' }]
        setstate({
            ...state,
            dataWage: res.status === 1 && res.data ? item.concat(res.data) : [],
        })
    }
    useEffect(() => {
        getApi();
    }, [])


    useEffect(() => {
        if (state.MucLuongFrom?.length >= 4) {
            Utils.nlog('vao format muc luong to')
            let textFormat = parseInt(Utils.replaceAll(state.MucLuongFrom, '.', '')).toLocaleString('it-IT');
            setstate({
                ...state,
                MucLuongFrom: textFormat,
            })
        }
    }, [state.MucLuongFrom])

    useEffect(() => {
        if (state.MucLuongTo?.length >= 4) {
            Utils.nlog('vao format muc luong to')
            let textFormat = parseInt(Utils.replaceAll(state.MucLuongTo, '.', '')).toLocaleString('it-IT');
            setstate((prevState) => ({
                ...prevState,
                MucLuongTo: textFormat,
            }))
        }
    }, [state.MucLuongTo])

    Utils.nlog('gia tri state', state)
    return (
        <View style={stBenefitRequest.container}>
            <HeaderSVL
                title={"Tạo hồ sơ xin việc"}
                iconLeft={ImagesSVL.icBackSVL}
                onPressLeft={Go_Back}
                titleRight={'Tiếp theo'}
                Sleft={{ width: reSize(75) }}
                Sright={{ color: colorsSVL.blueMainSVL, fontSize: reText(14), width: reSize(75) }}
                styleTitleRight={{ width: reSize(75) }}
                styleTitle={{ flex: 1 }}
                onPressRight={OnNext}
            />
            <KeyboardAwareScrollView style={{
                flex: 1, backgroundColor: colors.white, marginTop: 10,
                paddingHorizontal: 12, paddingTop: 15,
            }}
                contentContainerStyle={{ paddingBottom: 50 }}
            >
                <HeaderTitle text='5. Nhu cầu và quyền lợi mong muốn'
                    titleSub='Chọn thời gian phù hợp, nêu lên mong muốn và mức lương để người tuyển dụng dễ dàng tiếp cận đến bạn' />
                <View style={{ marginTop: 20 }} >
                    <DropDownModal
                        label={'Lương'}
                        text={'-- Chọn mức lương--'}
                        data={state.dataWage}
                        KeyTitle={'MucLuong'}
                        valueSeleted={state.Wage}
                        KeyId={'Id'}
                        CallBack={Get_Wage}
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
                            onBlur={(text) => {
                                Utils.nlog('Đang xoá')
                            }}
                            keyboardType={'phone-pad'}
                            value={state.MucLuongFrom}
                            placeholder={'Mức lương từ'}
                            onChangeText={(text) => {

                                setstate({
                                    ...state,
                                    Wage: { Id: 0, MucLuong: '--Không chọn--' },
                                    MucLuongFrom: text,
                                })
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
                            value={state.MucLuongTo}
                            placeholder={'Mức lương từ'}
                            onChangeText={(text) => {
                                setstate({
                                    ...state,
                                    Wage: { Id: 0, MucLuong: '--Không chọn--' },
                                    MucLuongTo: text,
                                })
                            }}
                        />
                    </View>
                    <TextApp style={[stBenefitRequest.bold, {
                        marginVertical: 15, color: colorsSVL.blueMainSVL,
                        fontSize: reText(16)
                    }]} >
                        {'Thời gian làm việc'}
                    </TextApp>
                    <RadioCheck TitleValue={'Có thể làm việc ngay'} CallBack={Get_WorkTimeStatus} valueDefault={state.WorkTimeStatus} />
                    {!state.WorkTimeStatus ? <View style={{ marginTop: 15 }} >
                        <TextApp  >{'Khác'}</TextApp>
                        <TouchableOpacity
                            style={{
                                marginTop: 10,
                                borderRadius: 6,
                                borderWidth: 1, borderColor: colorsSVL.grayLine
                            }}
                        >
                            <DatePick
                                placeholder={'-- Bắt đầu từ ngày --'}
                                style={{
                                    width: "100%", height: 40, alignItems: 'center',
                                    fontSize: reText(14),
                                }}
                                value={state.WorkTime}
                                Img={ImagesSVL.icCalendar}
                                styleIcon={[nstyles.nIcon20, { resizeMode: 'contain' }]}
                                onValueChange={dateTo => {
                                    Get_WorkTime(dateTo)
                                }}
                            />
                        </TouchableOpacity>
                    </View> : null
                    }
                </View>
                <ListAdd symbolText='•' ref={refDesire} valueDefault={Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.Desire ? Item_CVTempt.Desire : ''} title='Mong muốn khác' />
            </KeyboardAwareScrollView>
        </View >
    )
}

export default BenefitRequest

const stBenefitRequest = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.whitegay,
    },
    txtTitle: {
        marginBottom: 12,
        color: colorsSVL.blueMainSVL,
        fontWeight: Platform.OS == 'android' ? 'bold' : '600',
        fontSize: reText(17)
    },
    bold: {
        fontWeight: Platform.OS == 'android' ? 'bold' : '600'
    }
})
