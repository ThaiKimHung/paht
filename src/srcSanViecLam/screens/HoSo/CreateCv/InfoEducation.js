import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, BackHandler } from 'react-native'
import Utils, { icon_typeToast } from '../../../../../app/Utils'
import TextApp from '../../../../../components/TextApp'
import { colorsSVL, colors } from '../../../../../styles/color'
import { reSize, reText } from '../../../../../styles/size'
import HeaderSVL from '../../../components/HeaderSVL'
import DropDownModal from '../../../components/DropDownModal'
import { ImagesSVL } from '../../../images'
import RadioCheck from '../components/RadioCheck'
import { Height, nstyles, Width } from '../../../../../styles/styles'
import HeaderTitle from '../components/HeaderTitle'
import { SetCV } from '../../../../../srcRedux/actions/sanvieclam/DataSVL'
import { store } from '../../../../../srcRedux/store'
import { ScrollView } from 'react-navigation'
import ImageCus from '../../../../../components/ImageCus'
import { GetAllListDMTrinhDoVanHoa } from '../../../apis/apiSVL'
import { useSelector } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'



const InfoEducation = (props) => {
    // const ItemCV = useSelector(state => state.dataSVL.ItemCV)
    const Item_CVTempt = useSelector(state => state.dataSVL.Data_CV[2])
    // Utils.nlog('gia tri item cv', ItemCV)
    const [level, setLevel] = useState(
        {
            label: 'Trình độ học vấn',
            title: '-- Chọn trình độ --',
            keyTitle: 'TrinhDoVanHoa',
            KeyId: 'Id',
            value: Item_CVTempt && !Item_CVTempt.data && Item_CVTempt.AcademicLevel ? Item_CVTempt.AcademicLevel : '',
            data: [],
        }
    )
    const [state, setstate] = useState(Item_CVTempt && !Item_CVTempt.data &&
        Item_CVTempt.dataEducation ? Item_CVTempt.dataEducation : [{
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

        }])


    const Save_CV = (item, index) => {
        store.dispatch(SetCV(item, index))
    }

    const OnNext = () => {
        let itemSeTepCv3 =
        {
            AcademicLevel: level.value,
            dataEducation: state,
        }
        Utils.nlog('gia tri cv next', itemSeTepCv3)
        Save_CV(itemSeTepCv3, 2) // save dataaSVl store redux theo index
        Utils.navigate('Sc_InfoSkillExperience')
    }

    const Go_Back = () => {
        let itemSeTepCv3 =
        {
            AcademicLevel: level.value,
            dataEducation: state,
        }
        Utils.nlog('gia tri cv back', itemSeTepCv3)
        Save_CV(itemSeTepCv3, 2) // save dataaSVl store redux theo index
        Utils.goback({ props: props })
    }

    const setDataChange = (item, index1, index2) => { // index1 là cấp  cha ,index2 cấp con
        let daaTempt = Utils.cloneData(state)
        daaTempt[index1].item[index2].value = item;
        setstate(daaTempt)
    }

    const Get_ItemCheck = (item, index1) => {
        let daaTempt = Utils.cloneData(state)
        daaTempt[index1].check = item;
        setstate(daaTempt)
    }

    const Get_DegreeTraining = (item, index1, index2) => {
        setDataChange(item, index1, index2)
    }

    const Get_Item = (item) => {
        let daaTempt = { ...level }
        daaTempt.value = item;
        setLevel(daaTempt)
    }

    const AddUi = () => {
        setstate([...state,
        { // thêm state new cho ui dc thêm vào
            item:
                [
                    {
                        title: 'Từ Năm',
                        value: '',
                    },
                    {
                        title: 'Đến Năm',
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
                        KeyId: 'Id',
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
        }
        ])
    }
    const removeUi = (index) => {
        const dataTempt = [...state];
        dataTempt.splice(index, 1)
        setstate(dataTempt);
    }
    const getApi = async () => {
        let res = await GetAllListDMTrinhDoVanHoa();
        if (res.status === 1 && res.data) {
            setLevel({
                ...level,
                data: res.data
            })
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
        getApi();
    }, [])
    Utils.nlog('gia tri state', state)
    return (
        <View style={stInfoEducation.container}>
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
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, backgroundColor: colors.white, marginTop: 10, paddingHorizontal: 12, paddingTop: 15 }}
                contentContainerStyle={{ paddingBottom: 40 }}>
                <HeaderTitle text='3. Học vấn'
                    titleSub='Có thể điền bất kỳ trường lớp, bằng cấp nào đã học hoặc đã tốt nghiệp'
                />
                <DropDownModal
                    label={level.label}
                    text={level.title}
                    data={level.data}
                    KeyId={level.KeyId}
                    valueSeleted={level.value}
                    KeyTitle={level.keyTitle}
                    styleDrop={{
                        backgroundColor: colors.white, borderWidth: 1,
                        borderColor: colorsSVL.grayLine
                    }}
                    CallBack={Get_Item}
                />
                <TextApp style={[stInfoEducation.bold, { color: colorsSVL.blueMainSVL, marginTop: 20, fontSize: reText(16) }]} >
                    {'Chi tiết thông tin học vấn'}
                </TextApp>
                {state.map((item1, index1) => {
                    return (
                        <View
                            key={index1}
                            style={{
                                marginTop: 20, backgroundColor: colors.whitegay, paddingVertical: 20,
                                paddingHorizontal: 12,
                                borderRadius: 10,
                            }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                <RadioCheck TitleValue='Hiện tại đang học' CallBack={(item) => Get_ItemCheck(item, index1)}
                                    valueDefault={item1.check}
                                />
                                {index1 > 0 && <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }}
                                    onPress={() => {
                                        removeUi(index1)
                                        Utils.showToastMsg('Thông báo', 'Xóa Thành Công')
                                    }}
                                >
                                    <ImageCus source={ImagesSVL.icCloseSVL} style={nstyles.nIcon13} />
                                </TouchableOpacity>
                                }
                            </View>
                            <View>
                                <View style={{ flexDirection: 'row', paddingTop: 10, marginBottom: 15 }}>
                                    {item1.item.map((item, index2) => {
                                        if (index2 <= 1) {
                                            return (
                                                <TouchableOpacity
                                                    key={index2}
                                                    style={{
                                                        flex: 1, height: 40, borderWidth: 1,
                                                        backgroundColor: colorsSVL.white,
                                                        borderColor: colorsSVL.grayLine, flex: 1,
                                                        marginRight: index2 === 1 ? 0 : 11,
                                                        borderRadius: 4,
                                                        justifyContent: 'center',
                                                        paddingHorizontal: 10
                                                    }}
                                                    activeOpacity={0.5}
                                                    onPress={() => Utils.goscreen({ props }, 'Modal_YearPicker',
                                                        {
                                                            year: item.value, callback: year => {
                                                                setDataChange(year, index1, index2)
                                                            }
                                                        }
                                                    )}
                                                >
                                                    <Text style={{ color: item.value ? colors.black : colorsSVL.grayTextLight }} >{item.value ? item.value : item.title}</Text>
                                                </TouchableOpacity>
                                            )
                                        }
                                    })}
                                </View>
                                <View>
                                    {item1.item.map((item, index2) => {
                                        return (
                                            <View key={index2} >
                                                {index2 === 3 &&
                                                    <DropDownModal
                                                        styleContainer={{ marginTop: 0, marginBottom: 15 }}
                                                        text={item.title}
                                                        data={level.data}
                                                        KeyId={item?.KeyId}
                                                        valueSeleted={item.value}
                                                        KeyTitle={item.keyTitle}
                                                        CallBack={(item) => Get_DegreeTraining(item, index1, index2)}
                                                        styleDrop={{
                                                            backgroundColor: colorsSVL.white, borderWidth: 1,
                                                            borderColor: colorsSVL.grayLine
                                                        }}
                                                    />
                                                }
                                                {index2 != 0 && index2 != 1 && index2 != 3 &&
                                                    <TextInput
                                                        placeholder={item.title}
                                                        style={{
                                                            height: 40, paddingHorizontal: 10,
                                                            borderWidth: 1, borderColor: colorsSVL.grayLine,
                                                            backgroundColor: colorsSVL.white,
                                                            marginBottom: 15,
                                                            borderRadius: 4,
                                                            fontSize: reText(14)
                                                        }}
                                                        value={item.value}
                                                        onChangeText={(text) => {
                                                            setDataChange(text, index1, index2)
                                                        }}
                                                    />}
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                        </View>
                    )
                })}
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                    <TouchableOpacity style={{
                        borderWidth: 1.5, borderColor: colorsSVL.blueMainSVL,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 30,
                        width: Width(40),
                        height: 40,
                    }}
                        activeOpacity={0.5}
                        onPress={AddUi}
                    >
                        <Text style={[stInfoEducation.bold, { fontSize: reText(16), color: colorsSVL.blueMainSVL }]} >{'+'}
                            <Text>{' Thêm '}</Text></Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </View >
    )
}

export default InfoEducation

const stInfoEducation = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.whitegay,
    },
    bold: {
        fontWeight: Platform.OS == 'android' ? 'bold' : '600'
    },
})
