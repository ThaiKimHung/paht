import React, { Component } from 'react';
import {
    TextInput,
    StyleSheet,
    Platform,
    Text,
    View,
    Image,
    TouchableOpacity
} from "react-native";
import { colors, sizes, nstyles } from "../../styles";
import Utils from '../../app/Utils';
import * as Animatable from 'react-native-animatable';


class InputCheckCus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isF: false,
            isFs: false,
            isC: true,
            text: '',
        };

    }
    _onChangeText = (val) => {
        var { isF, isFs } = this.state
        if (val.length == 0 && isF == true) {
            this.setState({ isC: true, text: val })
            this.props.onChangeText(val)
        } else {
            Utils.nlog(" vao on change text")
            let isf1 = true
            let isc2 = true
            var check = true
            const { useCheck } = this.props
            if (useCheck == true) {
                check = this.props.fcCheck(val)
            }
            if (check == false) {
                Utils.nlog("gia tri nhap sai")
                isc2 = false
            }

            if (val.length == 0) {
                isf1 = false
                // isc = true
            }
            this.setState({ isF: isf1, isC: isc2 })
            this.props.onChangeText(val)
        }

    }

    render() {
        const {
            titleText = '',
            errorText = '',
            styTitle = undefined,
            customStyle,
            colorUnline = '#fff',
            placeholderTextColor = "#fff",
            icon = undefined,
            showIcon = false,
            iconShowPass = undefined,
            icShowPass = false,
            onFoCusCus = () => { },
            iconStyle = {
                backgroundColor: 'transparent',
            }
        } = this.props;
        var { isF, isFs, isC } = this.state
        if (showIcon) {
            return (
                <View style={[{
                    flexDirection: 'column', width: '100%', alignSelf: 'center'
                },]}>
                    {
                        isF == true ? <Animatable.Text animation='slideInUp' duration={2000}>
                            <Text style={styTitle ? styTitle : { color: colors.colorBlue }}>
                                {`${titleText}`}
                            </Text>
                        </Animatable.Text> : <View />
                    }
                    <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 5 }}>
                        <Image
                            source={icon}
                            style={[nstyles.nstyles.nIcon20, iconStyle,]}
                            resizeMode={"contain"}
                        />
                        <TextInput
                            {...this.props}
                            underlineColorAndroid={"transparent"}
                            style={{ paddingVertical: 0, flex: 1, color: '#fff', paddingLeft: 5 }}
                            placeholderTextColor={placeholderTextColor}
                            onChangeText={this._onChangeText}
                            // onFocus={() => this.setState({ isF: true })}
                            onFocus={() => this.setState({ isFs: true }, onFoCusCus)}

                        />
                        {
                            icShowPass == true ?
                                <TouchableOpacity onPress={props.setShowPass}><Image
                                    source={iconShowPass}
                                    style={[nstyles.nstyles.nIcon20, iconStyle,]}
                                    resizeMode={"contain"}
                                /></TouchableOpacity> : null
                        }
                    </View>
                    <View style={{ height: 1, width: '100%', backgroundColor: colorUnline, justifyContent: 'flex-end' }}>
                    </View>
                    {isFs == true ?
                        <View style={{
                            flex: 1, flexDirection: 'column',
                            paddingVertical: 30,
                        }}>
                            <Text style={{ color: colors.redStar }}>{'Nhập số chứng minh nhân dân hoặc số thẻ căn cước của bạn'}</Text>
                        </View> : <View />
                    }

                </View>

            );
        } else
            return (
                <View style={{ width: '100%' }}>
                    {
                        isF == true ? <Animatable.Text animation='zoomInUp' duration={1000}>
                            <Text style={styTitle ? styTitle : { color: colors.colorBlue }}>
                                {`${titleText}`}
                            </Text>
                        </Animatable.Text> : <View />
                    }
                    <TextInput
                        {...this.props}
                        underlineColorAndroid={"transparent"}
                        style={customStyle}
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={this._onChangeText}
                        onFocus={() => this.setState({ isF: true, isFs: true })}
                        onEndEditing={() => {
                            var isFss = isC == true ? false : true
                            this.setState({ isFs: isFss, isF: isFss })
                        }
                        }
                    />
                    <View style={{ height: 1, width: '100%', backgroundColor: colorUnline, justifyContent: 'flex-end' }}></View>
                    {isFs == true ?
                        <View style={{
                            flex: 1, flexDirection: 'column',
                            // paddingVertical: 30,
                        }}>
                            <Text style={{ color: isC == true ? colors.black_20 : colors.redStar }}>{`${errorText}`}</Text>
                        </View> : <View />
                    }
                </View>

            );
    }
}

export default InputCheckCus;
