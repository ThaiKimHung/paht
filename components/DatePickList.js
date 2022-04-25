import React, { Component, PureComponent, Fragment } from 'react';
import {
    View, TouchableOpacity, Text, FlatList, Image,
    StyleSheet, Modal, Platform
} from 'react-native';
import { nstyles, boldMax, nheight, nColors, safeHeighHead, boldNom2, nwidth } from '../styles/styles';
import { colors } from '../styles/color';
import { sizes, isPad, reText } from '../styles/size';
import Utils from '../app/Utils';
import ListEmpty from './ListEmpty'
import HeaderCom from './HeaderCom';
import { RootLang } from '../app/data/locales';
import LinearGradient from 'react-native-linear-gradient'
import { appConfig } from '../app/Config';
import ButtonCom from './Button/ButtonCom';
import { getObjDateFormat } from '../app/data/dateLocales';
import { ImgComp } from './ImagesComponent';

const sizeContain = () => (nwidth() - 20) / 7;
const sizeItemDay = () => nwidth() / 7 * 0.70;
const sizeLeftRight = () => (sizeContain() - sizeItemDay()) / 2;
//styles màn hình popupMore
const stDatePickList = StyleSheet.create({
    textNum: {
        fontSize: reText(14),
        fontWeight: '500',
        lineHeight: reText(18)

    },
    textThu: {
        fontSize: reText(12),
        fontWeight: 'bold',
        lineHeight: reText(15)
    },
    containerItem: {
        justifyContent: 'center',
        alignItems: 'center',
        width: sizeContain(),
        backgroundColor: 'white',
        marginVertical: 2
    },
    containerItem2: {
        backgroundColor: colors.nocolor,
        width: sizeItemDay(),
        height: sizeItemDay(),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: sizeItemDay() / 2
    },
    stTextCheckInOut: {
        fontSize: reText(12),
        color: nColors.main,
        lineHeight: reText(20),
        fontWeight: '500'
    },
    textDate: {
        fontSize: reText(14),
        lineHeight: reText(22),
        fontWeight: 'bold',
        color: nColors.main
    },
    btnmenuTour: {
        backgroundColor: colors.white,
        marginHorizontal: 6,
        borderRadius: 4,
        paddingHorizontal: 5,
        height: 50,
        justifyContent: 'center',
        paddingVertical: 0
    },
    txtmenuTour: {
        width: '100%',
        fontSize: reText(11),
        textAlign: 'center',
        color: colors.lightGreyBlue,
        fontWeight: 'bold',
        lineHeight: reText(14)
    },

});

class ItemNum extends Component {
    // -- Hàm này sẽ tối ưu không render lại quá nhiều đặc biệt là FlatList, List
    // --

    constructor(props) {
        super(props);
    }

    //--
    render() {
        let { dataItem, value1, value2, indexCha, item, _selectedDay } = this.props;
        // Utils.nlog('-- render ItemNum:' + dataItem.month + '-' + item.ngay);
        let isSelected = (value1.date == item.ngay && value1.month == item.thang &&
            value1.year == item.nam || value2.date == item.ngay && value2.month == item.thang &&
            value2.year == item.nam);
        let isDateChose = item.date >= value1.fullDate && item.date <= value2.fullDate && value2.date != -1
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={_selectedDay}
                disabled={item.disabled}
                style={stDatePickList.containerItem}
            >
                {
                    item.vitri < 0 ? null :
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <View style={[{
                                position: 'absolute', top: 0, left: -2, right: -2, height: '100%', opacity: 0.98,
                                backgroundColor: isDateChose ? '#FFF7EC' : colors.white
                            }, item.vitri == 1 || item.vitri == 3 || value1.date == item.ngay && value1.month == item.thang ? {
                                left: sizeLeftRight(), borderBottomLeftRadius: sizeItemDay() / 2 + 2,
                                borderTopLeftRadius: sizeItemDay() / 2 + 2
                            } : {}, item.vitri == 2 || item.vitri == 3 || value2.date == item.ngay && value2.month == item.thang ? {
                                right: sizeLeftRight(), borderBottomRightRadius: sizeItemDay() / 2 + 2,
                                borderTopRightRadius: sizeItemDay() / 2 + 2
                            } : {}]} />
                            <View style={[stDatePickList.containerItem2, isSelected ? { backgroundColor: colors.tangerine } : null]}>
                                <Text style={[stDatePickList.textNum,
                                isSelected ? { color: nColors.main } :
                                    (item.ngayht || isDateChose ? { color: nColors.main2 } : { color: colors.black }), { opacity: item.disabled ? 0.3 : 1 }
                                ]}>{item.ngay}</Text>
                            </View>
                        </View>
                }
            </TouchableOpacity>
        );
    }
}

class ItemList extends Component {
    // -- Hàm này sẽ tối ưu không render lại quá nhiều đặc biệt là FlatList, List
    shouldComponentUpdate(nextProps) {
        if ((nextProps.dataItem.month == nextProps.value1.month && nextProps.dataItem.year == nextProps.value1.year
            || nextProps.dataItem.month == this.props.value1.month && nextProps.dataItem.year == this.props.value1.year)
            || (nextProps.dataItem.month == nextProps.value2.month && nextProps.dataItem.year == nextProps.value2.year
                || nextProps.dataItem.month == this.props.value2.month && nextProps.dataItem.year == this.props.value2.year)
            || (nextProps.value2.date != -1 && this.props.dataItem.fullDate > nextProps.value1.fullDate
                && this.props.dataItem.fullDate < nextProps.value2.fullDate)
            || (nextProps.value2.date == -1 && this.props.value2.fullDate != -1 && this.props.dataItem.fullDate > this.props.value1.fullDate
                && this.props.dataItem.fullDate < this.props.value2.fullDate) || this.props.dateType != nextProps.dateType
        ) {
            return true;
        }
        return false;
    }
    // --

    constructor(props) {
        super(props);
        // onSelectedDay = props.onSelectedDay;
    }

    // _selectedDay = (item, indexCha) => () => {
    //     onSelectedDay(item, indexCha);
    // }

    //--
    render() {
        let { dataItem, value1, value2, indexCha, onSelectedDay } = this.props;
        // Utils.nlog('-- render ItemList:' + dataItem.month + ' --');
        return (
            <View>
                <View style={[nstyles.nrow, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Image source={ImgComp.icCalendarPicker} style={nstyles.nIcon14} resizeMode='contain' />
                    <Text style={{ textAlign: 'center', fontSize: reText(14), lineHeight: reText(20), marginVertical: 8, fontWeight: 'bold', marginLeft: 8 }}>
                        {arrayMonth[dataItem.month]}, {dataItem.year}
                    </Text>
                </View>
                <FlatList
                    style={{ backgroundColor: 'white', padding: 10 }}
                    data={dataItem.dataDates}
                    extraData={this.state}
                    renderItem={({ item, index }) =>
                        <ItemNum item={item} value1={value1} value2={value2}
                            _selectedDay={() => onSelectedDay(item, indexCha)} dataItem={dataItem} />
                    }
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()
                    }
                    numColumns={7}
                />
            </View>
        );
    }
}
const defaultLoadMonth = Platform.OS == 'ios' ? 4 : 3;
export default class DatePickList extends PureComponent {
    constructor(props) {
        super(props);

        let defaultOptions = {
            // title: 'Chọn ngày',
            // textFrom: 'CHECK IN',
            textTo: 'CHECK OUT',
            mode: 0, //0 Hotels, 1 Flights, 2 - Tour
            disableDateOld: true,
            dateFrom: undefined,
            dateTo: undefined,
            dateType: -1
        };
        defaultOptions = { ...defaultOptions, ...props.options }
        this.optionsCus = defaultOptions;

        this.onValueChange = props.onValueChange;
        //--
        // default language = en
        this.lang = '';
        arrayMonth = [];
        arrayMonth2 = [];
        this.loadLanguage();
        // --Data main
        let dateNow = new Date();
        year = dateNow.getFullYear();
        month = dateNow.getMonth();
        date = dateNow.getDate();
        //--Load date default
        // let ivalue = this.props.value;
        // if (ivalue != undefined)
        //     ivalue = new Date(Date.parse(ivalue.toString()));
        // defYear = year;
        // defMonth = month;
        // defDate = -1;
        // if (!isNaN(ivalue)) {
        //     defYear = ivalue.getFullYear();
        //     defMonth = ivalue.getMonth();
        //     defDate = ivalue.getDate();
        // }
        // //--
        this.sttempMonth = month;
        this.sttempYear = year;
        indexFocus = 0;
        this.state = {
            modalVisible: false,
            showLimit: false,
            dataMonths: [], // default load 12 month next
            dateSelected: { date: -1, month: month, year: year, fullDate: dateNow },
            dateSelected2: { date: -1, month: month, year: year + 1, fullDate: dateNow },
            isFocus: 1, // 1: focus select date 1 | 2: forcus select date 2 | -1: no forcus
            dateType: this.optionsCus.dateType // dùng cho tour có 3 option
        }
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }

    componentDidMount() {
        this.loadListDate();
        // Utils.nlog('render DateList', this.optionsCus.dateFrom);
        //set default value
        if (this.optionsCus.dateFrom) {
            this.optionsCus.dateFrom = new Date(this.optionsCus.dateFrom);
            this.setState({
                dateSelected: {
                    date: this.optionsCus.dateFrom.getDate(),
                    month: this.optionsCus.dateFrom.getMonth(),
                    year: this.optionsCus.dateFrom.getFullYear(),
                    fullDate: this.optionsCus.dateFrom
                }
            })
        }

        if (this.optionsCus.dateFrom && this.optionsCus.dateTo) {
            this.optionsCus.dateFrom = new Date(this.optionsCus.dateFrom);
            this.optionsCus.dateTo = new Date(this.optionsCus.dateTo);
            this.setState({
                dateSelected: {
                    date: this.optionsCus.dateFrom.getDate(),
                    month: this.optionsCus.dateFrom.getMonth(),
                    year: this.optionsCus.dateFrom.getFullYear(),
                    fullDate: this.optionsCus.dateFrom
                },
                dateSelected2: {
                    date: this.optionsCus.dateTo.getDate(),
                    month: this.optionsCus.dateTo.getMonth(),
                    year: this.optionsCus.dateTo.getFullYear(),
                    fullDate: this.optionsCus.dateTo
                }
            })
        }
    }

    loadLanguage = (first = false) => {
        let language = RootLang._keys;
        if (language == this.lang)
            return;
        this.lang = language;
        let temp = getObjDateFormat(language);
        this.arrayDay = temp.d;
        this.arrayDay2 = temp.ddd;
        arrayMonth = temp.M;
        arrayMonth2 = temp.MMM;
    }

    show() {
        // if (this.state.dataMonths.length != 0)
        //     this.setState({
        //         modalVisible: true
        //     });
        this.onClear();
    }

    hide() {
        this.sttempMonth = month + defaultLoadMonth - 1;
        this.sttempYear = year;
        let tempData = this.state.dataMonths.slice(0, defaultLoadMonth);
        this.setState({ modalVisible: false, dataMonths: tempData });
    }


    loadListDate = (more = defaultLoadMonth) => {
        let arrayTemps = this.state.dataMonths;
        if (arrayTemps.length != 0 && Utils.datesDiff(arrayTemps[arrayTemps.length - 1].fullDate, new Date()) > 366)
            return;
        for (let i = 0; i < more; i++) {
            let res = this._onChangeMonth(arrayTemps.length == 0 ? 0 : 1);
            arrayTemps.push(res);
        }
        this.setState({ dataMonths: arrayTemps });
    }

    _onChangeMonth = (val = 1) => {
        // -- render month and year --
        let iMonth = this.sttempMonth;
        let iYear = this.sttempYear;
        iMonth += val;
        if (iMonth >= 12) {
            iYear++;
            iMonth = 0;
        }
        if (iMonth < 0) {
            iYear--;
            iMonth = 11;
        }
        // -- render Days --
        let tempMonth = iMonth, tempYear = iYear;
        let dateTemp = new Date(iYear, iMonth, 0);
        let days1 = dateTemp.getDate();
        iMonth++;
        if (iMonth == 12) {
            iMonth = 0;
            iYear = iYear + 1;
        }
        let dateTemp2 = new Date(iYear, iMonth, 0);
        // -- Lấy thứ của ngày 1 và thứ của ngày Cuối tháng đang chọn
        let daysNow = dateTemp2.getDate();
        let dayonWeekEnd = dateTemp2.getDay();
        // if (dayonWeekEnd == -1)
        //     dayonWeekEnd = 6;
        dateTemp2.setDate(1);
        let dayonWeekStart = dateTemp2.getDay();
        // if (dayonWeekStart == -1)
        //     dayonWeekStart = 6;

        let dataDatesTemp = [];
        // -- Xử lý add ngày của tháng đang chọn
        for (let i = 1; i <= daysNow; i++) {
            let dateTempNew = new Date(tempYear, tempMonth, i);
            let tempVitri = 0; // vi trí để hiện thị backgroud khi select. 0: vi tri giữa
            if (i == 1 || dateTempNew.getDay() == 0)
                tempVitri = 1;  // vi trí đầu
            if (i == daysNow || dateTempNew.getDay() == 6)
                tempVitri = tempVitri == 1 ? 3 : 2;  // vi trí cuối 
            let tempDisabled = false;
            if (this.optionsCus.disableDateOld && dateTempNew < new Date(year, month, date))
                tempDisabled = true;
            let idataTemp = {
                ngay: i, vitri: tempVitri, thang: tempMonth, nam: tempYear,
                date: dateTempNew, disabled: tempDisabled
            };
            if (i == date && tempMonth == month && tempYear == year)
                idataTemp.ngayht = true;
            dataDatesTemp.push(idataTemp);
        }
        // add thêm ngày của tháng trước - add vào nhưng ẩn để ko bị bể giao diện
        while (dayonWeekStart != 0) {
            // xử lý ngày hiện tại của nếu tháng chọn ở trước tháng hiện tại
            let kMonth = tempMonth - 1, kYear = tempYear;
            if (kMonth == -1) {
                kMonth = 11;
                kYear--;
            }
            let idataTemp = { ngay: -1, vitri: -1, thang: -1, nam: -1, disabled: true };
            if (days1 == date && kMonth == month && kYear == year)
                idataTemp.ngayht = true;

            dataDatesTemp.unshift(idataTemp); //add Item Date
            days1--;
            dayonWeekStart--;
        }
        this.sttempMonth = tempMonth;
        this.sttempYear = tempYear;
        return { dataDates: dataDatesTemp, month: tempMonth, year: tempYear, fullDate: new Date(tempYear, tempMonth, 1) };
    }

    onSelectedDay = (item, index) => {
        let tempFocus = this.state.isFocus;
        if (this.state.isFocus == -1 && this.optionsCus.textTo != null) {
            this.onClear();
            tempFocus = 1;
        }
        dateTemp = item.ngay;
        monthTemp = item.thang;
        yearTemp = item.nam;
        fullDate = item.date;
        if (tempFocus == 1)
            indexFocus = index;
        if (this.optionsCus.textTo == null)
            this.setState({ dateSelected: { date: dateTemp, month: monthTemp, year: yearTemp, fullDate } });
        else {
            if (tempFocus == 1)
                this.setState({ dateSelected: { date: dateTemp, month: monthTemp, year: yearTemp, fullDate }, isFocus: 2 });
            if (tempFocus == 2) {
                let dateSelectedTemp = { date: dateTemp, month: monthTemp, year: yearTemp, fullDate };
                if (this.optionsCus.mode == 0 && Utils.datesDiff(this.state.dateSelected.fullDate, dateSelectedTemp.fullDate) > 30) {
                    this.setState({ showLimit: true });
                    return;
                }
                // Utils.nlog('aaaa', Utils.datesDiff(this.state.dateSelected.fullDate, dateSelectedTemp.fullDate));
                if (fullDate < this.state.dateSelected.fullDate) {
                    indexFocus = index;
                    dateSelectedTemp = { ...this.state.dateSelected };
                    this.setState({
                        dateSelected: { date: dateTemp, month: monthTemp, year: yearTemp, fullDate },
                        dateSelected2: dateSelectedTemp,
                        isFocus: -1
                    });
                }
                else
                    this.setState({ dateSelected2: dateSelectedTemp, isFocus: -1 });
                //---
            }
        }
    }


    onDone = () => {
        let tempdateFrom = '';
        if (this.state.dateSelected.date != -1)
            tempdateFrom = this.state.dateSelected.fullDate;
        let tempdateTo = '';
        if (this.state.dateSelected2.date != -1)
            tempdateTo = this.state.dateSelected2.fullDate;
        let temp = {
            dateType: this.state.dateType,
            dateFrom: tempdateFrom,
            dateTo: tempdateTo,
            thuFrom: this.arrayDay2[this.state.dateSelected.fullDate.getDay()],
            thuTo: this.arrayDay2[this.state.dateSelected2.fullDate.getDay()]
        };
        this.setState({ showLimit: false });
        this.onValueChange(temp);
        this.hide();
    }

    onClear = () => {
        temp_dateSelected = this.state.dateSelected;
        temp_dateSelected.date = -1;

        temp_dateSelected2 = this.state.dateSelected2;
        temp_dateSelected2.date = -1;
        this.setState({
            modalVisible: true,
            dateSelected: temp_dateSelected,
            dateSelected2: temp_dateSelected2,
            isFocus: 1 // 1: focus select date 1 | 2: forcus select date 2 | -1: no forcus
        });
        indexFocus = 0;
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        // this.getZoneList(search).then(this.setState({ refreshing: false }));
    }

    onRenerList = ({ item, index }) => {
        return <ItemList onSelectedDay={this.onSelectedDay} dateType={this.state.dateType} indexCha={index} value1={this.state.dateSelected}
            value2={this.state.dateSelected2} dataItem={item} />
    }

    changeDateType = (val) => () => {
        this.onClear();
        switch (val) {
            case 1:
                this.optionsCus.textTo = 'To';
                break;
            case 2:
                this.optionsCus.textTo = null;
                break;
            case 3:
                break;
        }
        this.setState({ dateType: val });
    }
    render() {
        this.loadLanguage();
        // Utils.nlog('-- render DatePickList --');
        if (this.props.options != undefined && this.state.dateType != 2)
            this.optionsCus.textTo = this.props.options.textTo;
        const { ncontainerX, nbody, nrow, ntitle, nIcon30, nIcon24 } = nstyles;
        //--mặc định mode = 0 là Hotels
        let titleModal = 'Chọn ngày', titleLeft = 'Ngày đi', titleRight = 'Ngày đến';
        if (this.optionsCus.mode == 1) { //mode = 1 là Flight
            titleLeft = 'Ngày đi';
            titleRight = 'Ngày về';
        }
        if (this.optionsCus.mode == 2) { //mode = 2 là Flight
            titleLeft = 'Ngày đi';
            titleRight = 'Ngày về';
        }

        return (
            <Modal
                animationType='slide'
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    //Utils.nlog('DatePick has been closed.');
                }}>
                <View style={ncontainerX}>
                    {/* Header  */}
                    <HeaderCom titleText={titleModal} iconLeft={ImgComp.icBackWhite}
                        iconRight={null} nthis={this} onPressLeft={() => this.hide()}
                        tintColorLeft={'white'}
                        style={{
                            backgroundColor: nColors.main2
                        }} />
                    {/* BODY */}
                    <View style={[nbody]}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            colors={[colors.orange, colors.tangerine]}
                            style={{ backgroundColor: nColors.main2, paddingVertical: 10, paddingHorizontal: 10 }}
                        >
                            {
                                this.state.dateType == -1 ? null : null
                                // <View style={[nstyles.nrow, { marginTop: -10, justifyContent: 'space-between', marginBottom: 10 }]}>
                                //     <ButtonCom
                                //         text={'xxx'}
                                //         Linear={this.state.dateType == 1 ? true : false}
                                //         style={stDatePickList.btnmenuTour}
                                //         txtStyle={[stDatePickList.txtmenuTour, this.state.dateType == 1 ? { color: colors.white } : {}]}
                                //         styleTouchable={{ flex: 1 }}
                                //         onPress={this.changeDateType(1)}
                                //     />
                                //     <ButtonCom
                                //         text={'xxx'}
                                //         Linear={this.state.dateType == 2 ? true : false}
                                //         style={stDatePickList.btnmenuTour}
                                //         txtStyle={[stDatePickList.txtmenuTour, this.state.dateType == 2 ? { color: colors.white } : {}]}
                                //         styleTouchable={{ flex: 1 }}
                                //         onPress={this.changeDateType(2)}
                                //     />
                                //     <ButtonCom
                                //         text={'xxx'}
                                //         Linear={this.state.dateType == 3 ? true : false}
                                //         style={stDatePickList.btnmenuTour}
                                //         txtStyle={[stDatePickList.txtmenuTour, this.state.dateType == 3 ? { color: colors.white } : {}]}
                                //         styleTouchable={{ flex: 1 }}
                                //         onPress={this.changeDateType(3)}
                                //     />
                                // </View>
                            }
                            <View
                                style={[nrow, { justifyContent: this.optionsCus.textTo == null ? 'center' : 'space-around', marginBottom: 15, alignItems: 'center' }]}
                            >
                                {/* select Date 1 */}
                                <View style={this.optionsCus.mode == 0 ? {} : { alignItems: 'center' }}>
                                    <Text style={stDatePickList.stTextCheckInOut}>{titleLeft}</Text>

                                    {/* <Text style={[ntitle, {
                                            fontSize: sizes.sText36, fontWeight: '500', marginRight: 3, textAlign: 'center',
                                            width: isPad ? 45 * 1.2 : 45,
                                        }]}>
                                            {this.state.dateSelected.date == -1 ? '--' : this.state.dateSelected.date}
                                        </Text> */}

                                    <Text style={stDatePickList.textDate}>
                                        {this.state.dateSelected.date == -1 ? '--' : this.state.dateSelected.date} {arrayMonth2[this.state.dateSelected.month]}, {this.state.dateSelected.year}
                                    </Text>
                                    <Text style={stDatePickList.textDate}>{this.state.dateSelected.date == -1 ? '---' : this.arrayDay2[this.state.dateSelected.fullDate.getDay()]}</Text>


                                </View>
                                {
                                    this.optionsCus.textTo == null || this.state.dateType == 2 ? null :
                                        <Fragment>
                                            <View style={{ alignItems: 'center', paddingTop: this.optionsCus.mode == 0 ? 20 : 0 }}>
                                                {
                                                    this.optionsCus.mode == 1 ? <Image source={ImgComp.icInOut} style={[nIcon30, { tintColor: colors.white }]} resizeMode='contain' /> :
                                                        <Image source={ImgComp.icLineRight} style={[nIcon24, { tintColor: colors.white }]} resizeMode='contain' />
                                                }
                                                {
                                                    this.optionsCus.mode != 0 ? null :
                                                        <Text style={stDatePickList.stTextCheckInOut}>
                                                            ( {this.state.dateSelected2.date != -1 ? Utils.datesDiff(this.state.dateSelected.fullDate, this.state.dateSelected2.fullDate) : '--'} {'đêm'} )
                                                        </Text>
                                                }
                                            </View>
                                            {/* select Date 2 */}
                                            <View style={this.optionsCus.mode == 0 ? { alignItems: 'flex-end' } : { alignItems: 'center' }}>
                                                <Text style={[stDatePickList.stTextCheckInOut]}>{titleRight}</Text>
                                                {/* <Text style={[ntitle, {
                                                    fontSize: sizes.sText36, fontWeight: '500', marginRight: 3, textAlign: 'center',
                                                    width: isPad ? 45 * 1.2 : 45,
                                                }]}>
                                                    {this.state.dateSelected2.date == -1 ? '--' : this.state.dateSelected2.date}
                                                </Text> */}
                                                <Text style={stDatePickList.textDate}>
                                                    {this.state.dateSelected2.date == -1 ? '--' : this.state.dateSelected2.date} {arrayMonth2[this.state.dateSelected2.month]}, {this.state.dateSelected2.year}
                                                </Text>
                                                <Text style={stDatePickList.textDate}>{this.state.dateSelected2.date == -1 ? '---' : this.arrayDay2[this.state.dateSelected2.fullDate.getDay()]}</Text>
                                            </View>
                                        </Fragment>
                                }
                            </View>
                            {/* Days of Week */}
                            <View

                                style={[nrow, { justifyContent: 'space-around', alignItems: 'center' }]}
                            >
                                {
                                    this.arrayDay.map((item, index) =>
                                        <Fragment key={item} >
                                            <Text style={[stDatePickList.textThu, { color: nColors.main }]}>{item}</Text>
                                            {
                                                index == 6 ? null :
                                                    <View style={{ backgroundColor: colors.white, width: 0.8, height: 10, opacity: 0.3 }} />
                                            }
                                        </Fragment>
                                    )
                                }
                            </View>
                        </LinearGradient>
                        {
                            !this.state.showLimit ? null :
                                <Text style={{ fontSize: reText(11), fontWeight: '600', color: colors.redStar, textAlign: 'center', marginVertical: 5 }}>
                                    {'Không đươc quá 30 ngày'}
                                </Text>
                        }
                        <View style={{ flex: 1 }}>
                            <FlatList
                                ListEmptyComponent={<ListEmpty
                                    textempty={'...'} />
                                }
                                // initialScrollIndex={indexFocus <= 2 ? indexFocus : 0}
                                // onScrollToIndexFailed={(val) => { }}
                                onEndReached={() => this.loadListDate(3)}
                                onEndReachedThreshold={0.2}
                                data={this.state.dataMonths}
                                renderItem={this.onRenerList}
                                keyExtractor={(item, index) => index.toString()}
                            />
                            {
                                this.state.dateType != 3 ? null :
                                    <View style={[nstyles.position, { bottom: 0, backgroundColor: colors.black, opacity: 0.4 }]} />
                            }
                            <View style={[{
                                backgroundColor: colors.white, paddingVertical: 14,
                                paddingHorizontal: 15, shadowColor: "#000000",
                                shadowOpacity: 0.12, shadowRadius: 4, elevation: 4
                            }]}>
                                <ButtonCom
                                    text={'Xác nhận'}
                                    Linear={true}
                                    style={{ borderRadius: 4 }}
                                    onPress={this.onDone}
                                />
                                {/* <TouchableOpacity activeOpacity={0.9} onPress={this.onDone}
                                style={{ backgroundColor: colors.softBlue, paddingVertical: 8, paddingHorizontal: 30, borderRadius: 25 }}>
                                <Text style={[stDatePickList.textNum, { color: colors.white }]}>Done</Text>
                            </TouchableOpacity> */}
                            </View>
                        </View>
                    </View>
                </View>
            </Modal >
        );
    }
}