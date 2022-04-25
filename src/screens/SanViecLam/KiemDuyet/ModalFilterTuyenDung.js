import React, { Component } from 'react';
import { View, Text, Animated, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Utils, { icon_typeToast } from '../../../../app/Utils';
import { colors } from '../../../../styles';
import { reSize, reText, sizes } from '../../../../styles/size';
import { Height, khoangcach, nstyles, paddingBotX } from '../../../../styles/styles';
import { Images } from '../../../../srcAdmin/images';
import moment from 'moment';
import { DatePick, TextInputCom } from '../../../../components';
import ModalDrop from '../../../../srcAdmin/screens/PhanAnhHienTruong/components/ModalDrop';

class ModalFilterTuyenDung extends Component {
    constructor(props) {
        super(props);
        this.dataSetting = Utils.ngetParam(this, 'dataSetting');
        this.callbacSetting = Utils.ngetParam(this, 'callbacSetting');
        this.isManHinhIOC = Utils.ngetParam(this, 'isManHinhIOC', false);
        const {
            dateTo,
            dateFrom,
            tinhtrang,
            dataTinhTrang,
            keyword
        } = this.dataSetting;
        this.textChange = keyword // keyword
        this.state = {
            opacity: new Animated.Value(0),
            dateTo,
            dateFrom,
            tinhtrang,
            dataTinhTrang
        };
    }

    componentDidMount() {
        this._startAnimation(0.4)
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 250
            }).start();
        }, 200);
    };

    _goback = () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                Utils.goback(this)
            });
        }, 100);
    }

    onChangeDate = (val, isFrom = true) => {

        const { dateTo, dateFrom } = this.state
        if (isFrom) {
            if (dateFrom) {
                let number = moment(val, 'YYYY-MM-DD').diff(moment(dateFrom, 'YYYY-MM-DD'))
                if (number <= 0) {
                    this.setState({ dateTo: val })
                } else {
                    Utils.showToastMsg("Thông báo", "Từ ngày phải nhỏ hơn đến ngày", icon_typeToast.warning);
                }

            } else {
                this.setState({ dateTo: val })
            }

        } else {
            if (dateTo) {
                let number = moment(dateTo, 'YYYY-MM-DD').diff(moment(val, 'YYYY-MM-DD'))
                if (number <= 0) {
                    this.setState({ dateFrom: val })
                } else {
                    Utils.showToastMsg("Thông báo", "Đến ngày phải lớn hơn từ ngày", icon_typeToast.warning);
                }


            } else {
                this.setState({ dateFrom: val })
            }
        }

    }

    _onChangeText = (value) => {
        this.textChange = value
    }

    _search = () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                this.callbacSetting({ ...this.state, keyword: this.textChange })
                Utils.goback(this)
            });
        }, 100);
    }

    render() {
        const { opacity, dateTo, dateFrom, tinhtrang, dataTinhTrang } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity }} />
                <KeyboardAwareScrollView scrollEnabled={false} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ flex: 1, backgroundColor: 'tranparent' }} />
                    <View style={stHomeSetting.container}>
                        <TouchableOpacity
                            onPress={this._goback}
                            style={{ alignSelf: 'flex-start', marginTop: 15 }}>
                            <Image source={Images.icBack} style={[nstyles.nIcon20, { tintColor: colors.brownGreyThree }]} resizeMode='contain' />
                        </TouchableOpacity>
                        <View style={[nstyles.nrow, { marginTop: 22 }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={stHomeSetting.text12}>Từ ngày</Text>
                                <View style={stHomeSetting.btnCalendar}>
                                    <DatePick
                                        style={{ width: "100%" }}
                                        value={dateTo}
                                        onValueChange={dateTo => this.onChangeDate(dateTo, true)}
                                    />
                                </View>
                            </View>
                            <View style={{ width: 5 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={stHomeSetting.text12}>Đến ngày</Text>
                                <View style={stHomeSetting.btnCalendar}>
                                    <DatePick
                                        style={{ width: "100%" }}
                                        value={dateFrom}
                                        onValueChange={dateFrom => this.onChangeDate(dateFrom, false)}
                                    />
                                </View>
                            </View>
                        </View>
                        {this.isManHinhIOC ? null :
                            <View style={nstyles.nrow}>
                                <ModalDrop
                                    value={tinhtrang}
                                    keyItem={'Id'}
                                    texttitle={'Tình trạng'}
                                    dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: reText(13) }}
                                    options={dataTinhTrang}
                                    onselectItem={(item) => this.setState({ tinhtrang: item })}
                                    Name={"Status"}
                                />
                            </View>}
                        <TextInputCom
                            cusViewContainer={{ marginTop: 20 }}
                            iconLeft={Images.icSearchGrey}
                            onChangeText={this._onChangeText}
                        >{this.textChange}</TextInputCom>
                        <TouchableOpacity
                            onPress={this._search}
                            style={stHomeSetting.btnSearch}>
                            <Text >Tìm kiếm</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

export default ModalFilterTuyenDung;

const stHomeSetting = StyleSheet.create({
    container: {
        // height: nstyles.Height(60),
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: khoangcach,
        paddingBottom: paddingBotX + 20,
        minHeight: Height(50)
    },
    text12: {
        fontSize: reText(12)
    },
    btnCalendar: {
        ...nstyles.nrow,
        padding: 10,
        backgroundColor: colors.veryLightPink,
        // alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
        borderRadius: 2
    },
    viewCheckBox: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -130,
        backgroundColor: 'white',
        top: 55,
        ...nstyles.shadow,
        borderRadius: 2
    },
    btnSearch: {
        paddingVertical: reSize(12),
        paddingHorizontal: reSize(31),
        backgroundColor: colors.colorGolden,
        borderRadius: reSize(20),
        alignSelf: 'center',
        marginTop: 30
    },
    btnLamMoi: {
        paddingVertical: reSize(12),
        paddingHorizontal: reSize(31),
        backgroundColor: colors.black_30,
        borderRadius: reSize(20),
        alignSelf: 'center',
        marginTop: 30
    }
})