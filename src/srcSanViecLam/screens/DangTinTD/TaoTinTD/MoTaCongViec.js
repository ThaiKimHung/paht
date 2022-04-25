import React, { useEffect, useRef, useState } from 'react'
import { BackHandler, StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-navigation';
import { useSelector } from 'react-redux';
import Utils, { icon_typeToast } from '../../../../../app/Utils';
import { SetDataTinTuyenDung } from '../../../../../srcRedux/actions/sanvieclam/DataSVL';
import { store } from '../../../../../srcRedux/store';
import { colorsSVL, colors } from '../../../../../styles/color';
import { reSize, reText } from '../../../../../styles/size';
import HeaderSVL from '../../../components/HeaderSVL';
import { dataTinTD } from '../../../dataDemo/dataTinTD';
import { ImagesSVL } from '../../../images';
import HeaderTitle from '../../HoSo/components/HeaderTitle';
import ListAdd from '../../HoSo/components/ListAdd';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const MoTaCongViec = (props) => {
    const DataTuyenDung = useSelector(state => state.dataSVL.Data_TinTuyenDung[3])
    const [IsFinish, setIsFinish] = useState(false)
    Utils.nlog('gia tri item', DataTuyenDung)
    const [CheckDataOnNext, setCheckDataOnNext] = useState(false)
    const [CheckDataOnNext2, setCheckDataOnNext2] = useState(false)
    const refData1 = useRef();
    const refData2 = useRef();

    const Save_TinTuyenDung = (item, index) => {
        store.dispatch(SetDataTinTuyenDung(item, index))
    }

    const Go_Back = () => {
        Utils.goback({ props: props })
        let itemSeTepCv4 =
        {
            MoTaCongViec: refData1.current.getData(),
            YeuCauCongViec: refData2.current.getData(),
        }
        Save_TinTuyenDung(itemSeTepCv4, 3) // save dataaSVl store redux theo index
    }

    const CheckData = (IsFinish = false) => {

        let data = refData1.current.getData().length;
        let data2 = refData2.current.getData().length;
        Utils.nlog('gia tri data', data)
        Utils.nlog('gia tri data2', data2)
        if (refData1.current.getData().length <= 2) {
            !IsFinish ? Utils.showToastMsg("Thông báo ", "Bạn chưa mô tả công việc", icon_typeToast.danger, 2000) : null;
            return false;
        }
        else if (refData2.current.getData().length <= 2) {
            !IsFinish ? Utils.showToastMsg("Thông báo ", "Bạn chưa nhập yêu cầu công việc", icon_typeToast.danger, 2000) : null;
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

    const CheckOnNext1 = (item) => {
        if (refData1.current.getData().length > 3)
            setCheckDataOnNext(true);
        else
            setCheckDataOnNext(false);
    }

    const CheckOnNext2 = (item) => {
        if (refData2.current.getData().length > 3)
            setCheckDataOnNext2(true);
        else
            setCheckDataOnNext2(false);
    }

    useEffect(() => {
        if (CheckDataOnNext && CheckDataOnNext2) {
            setIsFinish(true);
        }
        else {
            setIsFinish(false);
        }
    }, [CheckDataOnNext, CheckDataOnNext2])

    const OnNext = () => {
        if (CheckData()) {
            let itemSeTepCv4 =
            {
                MoTaCongViec: refData1.current.getData(),
                YeuCauCongViec: refData2.current.getData(),
            }
            Utils.nlog('gia tri data cv', itemSeTepCv4)
            Save_TinTuyenDung(itemSeTepCv4, 3) // save dataaSVl store redux theo index
            Utils.goscreen({ props }, 'sc_XenTruoc', { data: dataTinTD[0], isNhaTuyenDung: true, type: 2 })
        }
    }

    return (
        <View style={stMoTaCongViec.container}>
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
                flex: 1, backgroundColor: colors.white, marginTop: 10, paddingHorizontal: 12, paddingTop: 15
            }}
                contentContainerStyle={{ paddingBottom: 35 }}
            >
                <HeaderTitle text='4. Mô tả và yêu cầu công việc '
                    titleSub='Thông tin giúp người lao động biết rõ nội dung và yêu cầu công việc ' />
                <ListAdd symbolText='-' Call_Back={CheckOnNext1} valueDefault={DataTuyenDung && !DataTuyenDung.data ? DataTuyenDung.MoTaCongViec : ''} ref={refData1} title='Mô tả công việc' />
                <ListAdd symbolText='-' Call_Back={CheckOnNext2} valueDefault={DataTuyenDung && !DataTuyenDung.data ? DataTuyenDung.YeuCauCongViec : ''} ref={refData2} title='Yêu cầu công việc' />
            </KeyboardAwareScrollView >
        </View >

    )
}

export default MoTaCongViec

const stMoTaCongViec = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
})
