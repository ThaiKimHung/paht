import React, { Component } from 'react'
import { Text, View, Animated, Image, TouchableOpacity, Platform } from 'react-native'
import Moment from 'moment'
import { Picker, DatePicker } from 'react-native-wheel-pick';
import Utils from '../../../../app/Utils';
import { reText } from '../../../../styles/size';
import { Height, nstyles, Width } from '../../../../styles/styles';
import { colors } from '../../../../styles';



export class Modal_YearPickerNew extends Component {
    constructor(props) {
        super(props)

        var currentYear = new Date().getFullYear()
        // var currentMonth = new Date().getMonth()
        var years = []
        var startYear = 19;
        for (var i = 0; i <= startYear; i++) {
            if (i != 0)
                currentYear--;
            years.push(currentYear + '-' + (currentYear + 1));
        }
        Utils.nlog('gia tri years', years)
        // Utils.nlog('my', this.MonthYear)
        this.callback = Utils.ngetParam(this, 'callback', () => { });
        this.year = Utils.ngetParam(this, 'year', null); // input time
        this.state = {
            opacity: new Animated.Value(0),
            itemListYear: years.sort((a, b) => a < b),
            year: this.year ? this.year : new Date().getFullYear()
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

    callbackDate = async () => {
        let { year } = this.state
        this._goback();
        this.callback(year);
    }
    render() {
        var { opacity, year } = this.state
        Utils.nlog('gia tri state', year)
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View onTouchEnd={this._goback} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity }} />

                <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 15, borderTopRightRadius: 15, zIndex: 1000, maxHeight: Height(90) }}>
                    <View style={{ backgroundColor: colors.white, paddingHorizontal: 13, paddingBottom: 25, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: 5, marginTop: 10 }}>
                            {/* <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: reText(14), color: colors.yellowishOrange }}>Tháng</Text> */}
                            <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: reText(14), color: colors.yellowishOrange }}>Năm</Text>
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
                            <TouchableOpacity
                                onPress={() => {
                                    this._goback()
                                }}
                                style={{
                                    width: Width(25), paddingVertical: Width(3), backgroundColor: colors.black_50, justifyContent: 'center', alignItems: 'center',
                                    borderRadius: 5,
                                }}>
                                <Text style={{ color: colors.white, fontSize: reText(13), fontWeight: 'bold' }}>Huỷ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { this.callbackDate() }}
                                style={{
                                    width: Width(25), paddingVertical: Width(3), backgroundColor: colors.yellowishOrange, justifyContent: 'center', alignItems: 'center',
                                    borderRadius: 5,
                                }}>
                                <Text style={{ color: colors.white, fontSize: reText(13), fontWeight: 'bold' }}>Chọn</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>
        )
    }
}

export default Modal_YearPickerNew
