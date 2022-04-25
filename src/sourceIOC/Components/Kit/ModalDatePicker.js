import React from 'react';
import {Stack, Color, Fit, Text, IconSmallButton, Font,Screen} from '../Kit';
import {StyleSheet,TouchableOpacity,View,TouchableWithoutFeedback} from 'react-native';
import moment from 'moment';

const ListDay = [
    {key:'CN',value:'CN',isTitle:true},
    {key:'T2',value:'T2',isTitle:true},
    {key:'T3',value:'T3',isTitle:true},
    {key:'T4',value:'T4',isTitle:true},
    {key:'T5',value:'T5',isTitle:true},
    {key:'T6',value:'T6',isTitle:true},
    {key:'T7',value:'T7',isTitle:true},
]

const getCalendarHeaderTitle = (dateSelected)=>
{
    let selected = moment();
    if (dateSelected)
        selected = moment(dateSelected,'DD/MM/YYYY');
    let month = `Tháng ${selected.format('MM')}`,
        day = ListDay[selected.day()].value;
    return `${day}, ${selected.format('DD')} ${month}`
}

const getCalendarHeaderMonth = (isNext)=>
{
    let selected = moment().startOf('month');
    if (isNext)
        selected = moment().year(selected.year())
            .month(selected.month() + 1)
            .startOf('month');

    return `Tháng ${selected.format('MM')}`
}

const ModalDatePicker = props =>
{
    const [isNext, setNext] = React.useState(false);
    const [calendarList, setCalendarList] = React.useState(props.calendarList.current);
    const [headerTitle] = React.useState(getCalendarHeaderTitle(props.selected));
    const [headerMonth,setHeaderMonth] = React.useState(getCalendarHeaderMonth(isNext));

    const onItemPress = (item)=>()=>
    {
        props.onSelected(item.key);
        props.onClose();
    }

    const renderWeekRow = (listDate,index)=>
    {
        return (
            <View key = {index.toString()} style = {styles.dayView}>
                {listDate.map(renderDateItem)}
            </View>
        )
    }

    const renderDateItem = (item)=>
    {
        return (
            <DateItem
                key = {item.key}
                item = {item}
                onPress = {onItemPress(item)}
                active = {props.selected === item.key && !!item.value}
            />
        )
    };

    const onNavigateMonthPress = ()=>
    {
        if (isNext)
            setCalendarList(props.calendarList.current)
        else
            setCalendarList(props.calendarList.next)
        setHeaderMonth(getCalendarHeaderMonth(!isNext))
        setNext(!isNext)
    }

    return (
        <Stack style={styles.container}>
            <TouchableWithoutFeedback onPress = {props.onClose}>
                <View style ={styles.backgroundColor}/>
            </TouchableWithoutFeedback>
            <Stack style={styles.main}>
                <View style={styles.headerView}>
                    <Text size={Font.small} color={Color.white} style={{marginBottom:10}}>CHỌN NGÀY KHÁM</Text>
                    <Text size={Font.xxLarge} bold color={Color.white}>{headerTitle}</Text>
                </View>
                <View style = {styles.bodyView}>
                    <Text style={styles.monthTitle}>{headerMonth}</Text>
                    <IconSmallButton
                        iconName={'chevron-left'}
                        disabled = {!isNext}
                        style = {{marginRight:10}}
                        onPress = {onNavigateMonthPress}
                    />
                    <IconSmallButton
                        iconName={'chevron-right'}
                        disabled = {isNext}
                        onPress = {onNavigateMonthPress}
                    />
                </View>
                <View style = {styles.footerView}>
                    {renderWeekRow(ListDay,1)}
                    {calendarList.map(renderWeekRow)}
                </View>
                <View style={styles.btnClose}>
                    <IconSmallButton
                        iconName={'close'}
                        color={Color.white}
                        onPress = {props.onClose}
                    />
                </View>
            </Stack>
        </Stack>
    )
}

const DateItem = props =>
{
    const item = props.item;
    return (
        <View style = {styles.buttonSize}>
            <TouchableOpacity
                style = {styles.circleButtonView(item.isToday,props.active)}
                onPress = {props.onPress}
                disabled = {!item.editable}
            >
                {item.editable || item.isTitle ?
                    <Text color={props.active ? Color.white : Color.black}>{item.value}</Text>
                    :
                    item.isToday ?
                        <Text color={Color.secondary}>{item.value}</Text>
                        :
                        <Text color={Color.gray90}>{item.value}</Text>
                }
            </TouchableOpacity>
        </View>
    )
}

export default ModalDatePicker;

const BTN_SIZE = (Screen.width - 36)/7 - 4;
const BTN_CIRCLE = BTN_SIZE - 3

const styles = StyleSheet.create({
    container:{
        justifyContent:Fit.center,
        alignItems:Fit.center,
        flex:1,
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    backgroundColor:{
        ...StyleSheet.absoluteFill
    },
    main:{
        borderRadius:5,
        overflow:'hidden'
    },
    headerView:{
        padding:16,
        backgroundColor: Color.primary
    },
    bodyView:{
        paddingLeft:20,
        paddingRight:10,
        paddingVertical:10,
        backgroundColor:Color.white,
        flexDirection:Fit.row,
        alignItems:Fit.center
    },
    monthTitle:{
        flex:1,
        color:Color.gray100,
        fontWeight:Font.bold,
        fontSize:Font.medium
    },
    footerView:{
        paddingBottom:5,
        backgroundColor:Color.white,
        paddingHorizontal:10
    },
    dayView:{
        flexDirection: Fit.row,
    },
    buttonSize:{
        height:BTN_SIZE,
        width:BTN_SIZE,
        justifyContent: Fit.center,
        alignItems: Fit.center
    },
    circleButtonView:(isToDay,active)=>({
        borderWidth:1,
        borderColor:Color.transparent,
        borderRadius: BTN_CIRCLE/2,
        height:BTN_CIRCLE,
        width:BTN_CIRCLE,
        justifyContent: Fit.center,
        alignItems: Fit.center,
        backgroundColor:(active) ? Color.secondary : Color.transparent
    }),
    btnClose:{
        position:Fit.absolute,
        top:5,
        right:5,
    }
})
