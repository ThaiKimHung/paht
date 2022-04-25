import React, { Component } from 'react';
import {
    TextInput,
    Text,
    View,
} from "react-native";
import Utils from '../../app/Utils';

class InputT extends Component {
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
            const { useCheck = false } = this.props
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
            //text
            titleText = '',
            errorText = '',
            //style
            styTitle = {},
            customStyle = {},
            styComtainer = {},
            styErorr = {},
            //show giao diện
            showTitle = false,
            showUnline = false,
            showError = false,

            //color
            colorUnline = '#fff',
            colorError1 = '#fff',
            colorError2 = 'red',
            placeholderTextColor = "#fff",
            //check dữ liêu
            useCheck = false,
            refInput
        } = this.props;
        var { isF, isFs, isC } = this.state
        return (
            <View style={[styComtainer, { flexDirection: 'column' }]}>
                {
                    showTitle == true ?
                        (isF == true ? <Text style={styTitle}>
                            {`${titleText}`}
                        </Text> : <View />) : null
                }
                <TextInput
                    ref={refInput}
                    {...this.props}
                    underlineColorAndroid={"transparent"}
                    // style={[customStyle]}
                    // placeholderTextColor={placeholderTextColor}
                    onChangeText={this._onChangeText}
                    onFocus={() => this.setState({ isF: true, isFs: true })}
                    onEndEditing={() => {
                        var isFss = isC == true ? false : true
                        this.setState({ isFs: isFss, isF: isFss })
                    }
                    }
                />
                {
                    showUnline == true ? <View style={{
                        height: 1, width: '100%',
                        backgroundColor: colorUnline ? colorUnline : "#000", justifyContent: 'flex-end'
                    }}></View> : null
                }

                {
                    showError == true ? (isFs == true ?
                        <Text style={[{ color: isC == true ? colorError1 : colorError2 }, styErorr]}>{`${errorText}`}</Text>
                        : <View />) : null
                }
            </View>
        );
    }
}

export default InputT;
