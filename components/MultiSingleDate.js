import dayjs from "dayjs";
import range from "lodash/range";
import moment from 'moment';
import React, { Component, useEffect, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getBottomSpace, isIphoneX } from "react-native-iphone-x-helper";
import { ButtonCom } from ".";
// import { RootLang } from '../app/data/locales';
// import { nGlobalKeys } from '../app/keys/globalKey';
import Utils from '../app/Utils';
import { colors, nstyles } from "../styles";
import { Height, Width } from "../styles/styles";
// import { colors, nstyles } from '../styles';
import { ImgComp } from "./ImagesComponent";
// import ButtonCom from './Button/ButtonCom';

const Calanda = (props) => {
    const weekDaysVI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
    const weekDaysEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const weekDays = weekDaysVI // Utils.getGlobal(nGlobalKeys.lang, 'vi') === 'vi' ? weekDaysVI : weekDaysEN
    const disable = Utils.ngetParam(props.nthis, "disable", false);
    const df = Utils.ngetParam(props.nthis, "date");
    const dm = Utils.ngetParam(props.nthis, "month");
    const dy = Utils.ngetParam(props.nthis, "years");
    const dateSelect = Utils.ngetParam(props.nthis, "dateSelect", []);
    const chooseOnlyDay = Utils.ngetParam(props.nthis, "chooseOnlyDay", false);
    const setTimeFC = Utils.ngetParam(props.nthis, "setTimeFC", () => { });
    const newDate = moment(new Date()).format('DD/MM/YYYY');
    const [dayObj, setDayObj] = df ? useState(dayjs(moment(df, "DD/MM/YYYY").format('MM/DD/YYYY'))) : useState(dayjs(moment(dm + '/' + dy, 'MM/YYYY')));
    const [dateF, SetdateF] = useState(df ? df : newDate);

    const thisYear = dayObj.year()
    const thisMonth = dayObj.month() // (January as 0, December as 11)
    const daysInMonth = dayObj.daysInMonth()

    const dayObjOf1 = dayjs(`${thisYear}-${thisMonth + 1}-1`)
    const weekDayOf1 = dayObjOf1.day() // (Sunday as 0, Saturday as 6)

    const dayObjOfLast = dayjs(`${thisYear}-${thisMonth + 1}-${daysInMonth}`)
    const weekDayOfLast = dayObjOfLast.day();

    const arrold = range(weekDayOf1).map(i => dayObjOf1.subtract(weekDayOf1 - i, "day").format('DD/MM/YYYY')
    );
    const arrdate = range(daysInMonth).map(i => moment(new Date(dayObj.format('YYYY'), dayObj.format('MM') - 1, i + 1)).format("DD/MM/YYYY")
    );
    const arrnext = range(6 - weekDayOfLast).map(i => dayObjOfLast.add(i + 1, "day").format("DD/MM/YYYY")
    );

    const date = [].concat(arrold, arrdate, arrnext);
    const num = range(Math.ceil(date.length / 7));
    const [opacity] = useState(new Animated.Value(0))
    const [lstDateChose, setLstDateChose] = useState(dateSelect.length > 0 ? dateSelect : [])

    const setDateChoose = (item) => {
        SetdateF(item);
    }

    const setLstDateChoose = (item) => {
        const selectedDays = lstDateChose.concat()
        if (selectedDays.includes(item)) {
            const selectedIndex = selectedDays.findIndex(selectedDay =>
                moment(item, 'DD/MM/YYYY').isSame(moment(selectedDay, "DD/MM/YYYY"))
            );
            selectedDays.splice(selectedIndex, 1);
        } else {
            selectedDays.push(item);
        }
        setLstDateChose(selectedDays)
    }

    const setStyle = (item) => {
        if (chooseOnlyDay) {
            if (moment(item, 'DD/MM/YYYY').isSame(moment(dateF, "DD/MM/YYYY"))) {
                return { backgroundColor: colors.greenFE, borderRadius: 50, }
            }
        } else {
            if (hasDate(item) != -1) {
                return { backgroundColor: colors.greenFE, borderRadius: 50, }
            }
        }
    }

    const hasDate = (item) => {
        return lstDateChose.findIndex(selectedDay =>
            moment(item, 'DD/MM/YYYY').isSame(moment(selectedDay, "DD/MM/YYYY"))
        );
    }

    const setStyleText = (item, isMonthFocus) => {
        if (chooseOnlyDay) {
            if (moment(item, 'DD/MM/YYYY').isSame(moment(dateF, "DD/MM/YYYY"))) {
                return { color: 'white' }
            }
            return { color: 'black', opacity: isMonthFocus ? 1 : 0.35 }
        } else {
            if (hasDate(item) != -1) {
                return { color: 'white' }
            }
            return { color: 'black', opacity: isMonthFocus ? 1 : 0.35 }
        }
    }

    const renderItemNum = (item, index) => {
        let tempDate = new Date(moment(item, 'DD/MM/YYYY').format('YYYY/MM/DD'));
        let isMonthFocus = tempDate.getMonth() == thisMonth;
        return (
            <View
                key={index}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingVertical: 5,
                }}>
                <TouchableOpacity
                    style={[setStyle(item), {
                        position: 'absolute',
                        top: 5, bottom: 5, left: 5, right: 5,
                        zIndex: 10,
                        // width: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }]}
                    onPress={() =>
                        disable == true && isMonthFocus == false ? null :
                            chooseOnlyDay ? setDateChoose(item) : setLstDateChoose(item)
                    }>
                    <View>
                        <Text style={[setStyleText(item, isMonthFocus), {
                            fontSize: 16, fontWeight: 'bold',
                            textAlign: 'center', paddingRight: 3
                        }]}>
                            {
                                ` ${moment(item, 'DD/MM/YYYY').format('D')}`
                            }
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    const renderRow = (i, index) => {
        var arr = date.slice(i * 7, i * 7 + 7);
        return (<View
            key={index}
            style={{
                flexDirection: 'row',
                flex: 1, color: "green"
            }}>
            {
                arr.map(renderItemNum)
            }
        </View>)
    }
    const handlePrev = () => {
        setDayObj(dayObj.subtract(1, "month"))
    }

    const handleNext = () => {
        setDayObj(dayObj.add(1, "month"))
    }
    const _goback = () => {
        setTimeFC(chooseOnlyDay ? dateF : lstDateChose);
        endAnimation(0)
        Utils.goback(props.nthis);
    }
    const _gobackTemp = () => {
        endAnimation(0)
        Utils.goback(props.nthis);
    }
    const startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 400);
    };

    const endAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: value,
                duration: 1
            }).start();
        }, 1);
    };
    useEffect(() => {
        startAnimation(0.8)
    })
    const { nrow, nmiddle } = nstyles.nstyles
    return (
        <View style={[nstyles.nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
            <Animated.View onTouchEnd={_gobackTemp} style={{
                position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                backgroundColor: colors.backgroundModal, alignItems: 'flex-end',
                opacity
            }} />
            <View style={{
                backgroundColor: colors.white,
                borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 1,
                paddingVertical: 20
            }}>
                <View >
                    <View style={{
                        paddingVertical: 10,
                        flexDirection: 'row',
                    }}>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={disable ? null : handlePrev}>
                            <Image
                                source={ImgComp.icCalandarLeft}
                                style={{ tintColor: colors.colorTabActiveJeeHR }}
                                resizeMode={'cover'}>
                            </Image>
                        </TouchableOpacity>
                        <View style={{
                            flex: 1, alignItems: 'center',
                        }} >
                            <Text style={{
                                color: colors.greenFE,
                                fontSize: 16, fontWeight: 'bold'
                            }} >{"Tháng " + dayObj.format("MM/YYYY")}</Text>
                        </View>

                        <TouchableOpacity onPress={disable ? null : handleNext} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={ImgComp.icCalandarRight}
                                style={{ tintColor: colors.greenFE }}
                                resizeMode={'cover'}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: colors.colorGrayBgr,
                        alignItems: 'center', justifyContent: 'center',
                        height: 50,

                    }}>
                        {

                            weekDays.map((item, index) =>
                            (<View key={index} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 16, color: colors.black_20 }}>{item}</Text>
                            </View>))
                        }
                    </View>

                    <View style={{ paddingVertical: 10, height: 350, backgroundColor: 'white', paddingBottom: 30 }}>
                        {
                            num.map((i, index) =>

                            (
                                <View key={i} style={{ flex: 1, width: '100%', }}  >
                                    {
                                        renderRow(i, index)
                                    }
                                </View>
                            )
                            )
                        }
                    </View>
                    <View style={[nrow, { marginHorizontal: 30, marginBottom: isIphoneX() ? getBottomSpace() : 10, justifyContent: 'space-between' }]}>
                        <ButtonCom
                            onPress={_gobackTemp}
                            shadow={false}
                            txtStyle={{ color: colors.white }}
                            style={
                                {
                                    borderRadius: 5,
                                    // alignSelf: 'center',
                                    // marginBottom: getBottomSpace(),
                                    width: Width(40),
                                }}
                            text={'Thoát'}
                        />
                        <ButtonCom
                            onPress={_goback}
                            shadow={false}
                            txtStyle={{ color: colors.white }}
                            style={
                                {
                                    borderRadius: 5,
                                    // alignSelf: 'center',
                                    // marginBottom: getBottomSpace(),
                                    width: Width(40),
                                }}
                            text={'Chọn xong'}
                        />
                    </View>
                </View>
            </View>
        </View>
    );

}
const styleT = StyleSheet.create({
    stBtn: {
        flex: 1, marginHorizontal: 5,
        paddingVertical: 5, borderRadius: 5,
        // borderWidth: 1,
        alignItems: 'center'
    }
})

class MultiSingleDate extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }
    render() {
        return (
            <View style={{ backgroundColor: 'transparent', flex: 1 }}>
                <Calanda nthis={this}
                />
            </View>
        );
    }
}
const mapStateToProps = state => ({

});
export default Utils.connectRedux(MultiSingleDate, mapStateToProps, true)
