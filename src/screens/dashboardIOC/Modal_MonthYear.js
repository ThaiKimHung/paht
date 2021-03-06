import React, { Component } from 'react'
import { Text, View, Animated, Image } from 'react-native'
import Moment from 'moment'
import { Picker, DatePicker } from 'react-native-wheel-pick';
import { nstyles, Height, Width } from '../../../styles/styles'
import { reSize, reText } from '../../../styles/size'
import { colors } from '../../../styles';
import Utils from '../../../app/Utils';
import { TouchableOpacity } from 'react-native-gesture-handler';

export class Modal_MonthYear extends Component {
    constructor(props) {
        super(props)

        var currentYear = new Date().getFullYear()
        // var currentMonth = new Date().getMonth()
        var years = [], months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        var startYear = 1980;
        for (var i = currentYear; i >= startYear; i--) {
            years.push(currentYear--);
        }
        // Utils.nlog('my', this.MonthYear)
        this.callback = Utils.ngetParam(this, 'callback', () => { });
        this.DateInput = Utils.ngetParam(this, 'DateInput', null); // input time
        this.state = {
            opacity: new Animated.Value(0),
            itemListMonth: months,
            itemListYear: years.sort((a, b) => a < b),
            month: this.DateInput ? this.DateInput.getMonth() + 1 : new Date().getMonth(),
            year: this.DateInput ? this.DateInput.getFullYear() : new Date().getFullYear()
        }

    }

    componentDidMount() {
        this._startAnimation(0.4)
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 200
            }).start();
        }, 200);
    };

    _goback = () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 150
            }).start(() => {
                Utils.goback(this)
            });
        }, 100);
    }

    chooseDate = () => {
        let mFrom = this.DateFrom, mTo = this.DateTo
        let { month, year } = this.state
        let date = new Date(year + '/' + month + '/01');
        Utils.nlog('mFrom ', mFrom)
        Utils.nlog('mTo ', mTo)
        if (this.CheckFromTo == true) {
            //so s??nh dateinput(t??? th??ng) v???i ?????n th??ng
            if (Moment(date).isAfter(mTo, 'month')) {
                Utils.showMsgBoxOK(this, 'Th??ng b??o', 'Gi?? tr??? t??? th??ng ph???i nh??? h??n gi?? tr??? ?????n th??ng\n Vui l??ng ch???n l???i !', 'Xem l???i', () => {
                    this.callback(mTo);
                    this._goback();
                })
            }
            else {
                this.callbackDate()
            }
        }
        else {
            //so s??nh dateinput(?????n th??ng) v???i t??? th??ng
            if (Moment(date).isBefore(mFrom, 'month')) {
                Utils.showMsgBoxOK(this, 'Th??ng b??o', 'Gi?? tr??? ?????n th??ng ph???i l???n h??n gi?? tr??? t??? th??ng\n Vui l??ng ch???n l???i !', 'Xem l???i', () => {
                    this.callback(mFrom);
                    this._goback();
                })
            }
            else {
                this.callbackDate()
            }
        }
    }
    callbackDate = async () => {
        let { month, year } = this.state
        Utils.nlog('value date', new Date(year + '/' + month + '/01'))
        this._goback();
        this.callback(new Date(year + '/' + month + '/01'));
    }
    render() {
        var { opacity, month, year } = this.state

        return (
            <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View onTouchEnd={this._goback} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity }} />

                <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 15, borderTopRightRadius: 15, zIndex: 1000, maxHeight: Height(90) }}>
                    <View style={{ backgroundColor: colors.white, paddingHorizontal: 13, paddingBottom: 25, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: 5, marginTop: 10 }}>
                            <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: reText(14), color: colors.yellowishOrange }}>Th??ng</Text>
                            <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: reText(14), color: colors.yellowishOrange }}>N??m</Text>
                        </View>
                        <View style={{ height: 220 }}>
                            <View style={{
                                opacity: 0.1,
                                height: Platform.OS == 'ios' ? 45 : 44,
                                width: '100%',
                                marginTop: Platform.OS == 'ios' ? 85 : 88,
                                backgroundColor: Platform.OS == 'ios' ? 'transparen' : 'gray',
                            }} />
                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                <Picker
                                    style={{ backgroundColor: 'transparent', width: '50%', height: 220 }}
                                    selectedValue={month}
                                    pickerData={this.state.itemListMonth}
                                    onValueChange={month => { this.setState({ month }) }}
                                    itemSpace={30} // this only support in android
                                    textColor={colors.black}
                                    textSize={16}
                                />
                                <Picker
                                    style={{ backgroundColor: 'transparent', width: '50%', height: 220 }}
                                    selectedValue={year}
                                    pickerData={this.state.itemListYear}
                                    onValueChange={year => { this.setState({ year }) }}
                                    itemSpace={30} // this only support in android
                                    textColor={colors.black}
                                    textSize={16}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                            {/* <ButtonCusApp
                                onPress={() => { this.callbackDate() }}
                                style={{
                                    width: Width(30),
                                    height: reSize(36),
                                    marginVertical: 13,
                                    alignSelf: 'center', backgroundColor: colors.colorTextSelect,
                                    borderColor: colors.colorTextSelect,
                                    borderWidth: 1,
                                    marginTop: 15
                                }}
                                styleText={{ color: colors.white }}
                                title={'Ch???n'}
                            />
                            <ButtonCusApp
                                onPress={() => {
                                    this._goback()
                                }}//kiem tra huy/xoa khi xu ly
                                style={{
                                    width: Width(30),
                                    height: reSize(36),
                                    marginVertical: 13,
                                    alignSelf: 'center', backgroundColor: colors.white,
                                    borderColor: colors.colorHeader,
                                    borderWidth: 1,
                                    marginTop: 15
                                }}
                                styleText={{ color: colors.colorHeader }}
                                title={'H???y'}
                            /> */}
                            <TouchableOpacity
                                onPress={() => {
                                    this._goback()
                                }}
                                style={{
                                    width: Width(25), paddingVertical: Width(3), backgroundColor: colors.black_50, justifyContent: 'center', alignItems: 'center',
                                    borderRadius: 5,
                                }}>
                                <Text style={{ color: colors.white, fontSize: reText(13), fontWeight: 'bold' }}>Hu???</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { this.callbackDate() }}
                                style={{
                                    width: Width(25), paddingVertical: Width(3), backgroundColor: colors.yellowishOrange, justifyContent: 'center', alignItems: 'center',
                                    borderRadius: 5,
                                }}>
                                <Text style={{ color: colors.white, fontSize: reText(13), fontWeight: 'bold' }}>Ch???n</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>
        )
    }
}

export default Modal_MonthYear
