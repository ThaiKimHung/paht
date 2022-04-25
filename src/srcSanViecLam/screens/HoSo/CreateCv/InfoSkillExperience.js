import React, { useEffect, useRef } from 'react'
import { BackHandler, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native'
import Utils from '../../../../../app/Utils'
import { SetCV } from '../../../../../srcRedux/actions/sanvieclam/DataSVL'
import { store } from '../../../../../srcRedux/store'
import { colors } from '../../../../../styles'
import { colorsSVL } from '../../../../../styles/color'
import { reSize, reText } from '../../../../../styles/size'
import HeaderSVL from '../../../components/HeaderSVL'
import { ImagesSVL } from '../../../images'
import HeaderTitle from '../components/HeaderTitle'
import ListAdd from '../components/ListAdd'
import { useSelector } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const InfoSkillExperience = (props) => {
    const Item_CVTempt = useSelector(state => state.dataSVL.Data_CV[3])
    const refData1 = useRef();
    const refData2 = useRef();

    const Save_CV = (item, index) => {
        store.dispatch(SetCV(item, index))
    }

    const Go_Back = () => {
        let itemSeTepCv4 =
        {
            Experience: refData1.current.getData(),
            Skill: refData2.current.getData(),
        }
        Utils.nlog('gia tri data cv', itemSeTepCv4)
        Save_CV(itemSeTepCv4, 3) // save dataaSVl store redux theo index
        Utils.goback({ props: props })
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
        let itemSeTepCv4 =
        {
            Experience: refData1.current.getData(),
            Skill: refData2.current.getData(),
        }
        Utils.nlog('gia tri data cv', itemSeTepCv4)
        Save_CV(itemSeTepCv4, 3) // save dataaSVl store redux theo index
        // Utils.navigate('Sc_InfoResult')
        Utils.navigate('Sc_BenefitRequest')
    }
    return (
        <View style={stInfoSkillExperience.container}>
            <HeaderSVL
                title={"Tạo hồ sơ xin việc"}
                iconLeft={ImagesSVL.icBackSVL}
                onPressLeft={() => Go_Back()}
                titleRight={'Tiếp theo'}
                Sleft={{ width: reSize(75) }}
                Sright={{ color: colorsSVL.blueMainSVL, fontSize: reText(14), width: reSize(75) }}
                styleTitleRight={{ width: reSize(75) }}
                styleTitle={{ flex: 1 }}
                onPressRight={OnNext}
            />
            <KeyboardAwareScrollView
                contentContainerStyle={{ paddingBottom: 35 }}
                style={{ flex: 1, backgroundColor: colors.white, marginTop: 10, paddingHorizontal: 12, paddingTop: 15 }}>
                <HeaderTitle text='4. Kinh nghiệm và kỹ năng' titleSub='Mô tả những công ty, vị trí, trách nhiệm, công việc, kỹ năng bạn từng làm và kỹ năng bạn đang có.' />
                <ListAdd symbolText='•' ref={refData1} valueDefault={Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.Experience ? Item_CVTempt.Experience : ''} title='Kinh nghiệm' />
                <ListAdd symbolText='•' ref={refData2} valueDefault={Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.Skill ? Item_CVTempt.Skill : ''} title='Kỹ năng' />
            </KeyboardAwareScrollView>
        </View>
    )
}

export default InfoSkillExperience

const stInfoSkillExperience = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
})
