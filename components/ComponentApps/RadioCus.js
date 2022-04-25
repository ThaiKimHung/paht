import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, sizes } from '../../styles';

class RadioCus extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    _onPress = () => {
        this.props.setValue(this.props.value)
    }
    render() {
        var { selected = false } = this.props
        return (
            <TouchableOpacity onPress={this._onPress}>
                <View style={{
                    width: 30, height: 30,
                    borderRadius: 25, backgroundColor: colors.white,
                    alignItems: 'center', justifyContent: 'center',
                    borderWidth: 2, borderColor: colors.black_80,
                }}>
                    <View style={{
                        width: 15, height: 15,
                        borderRadius: 15, backgroundColor: selected == true ? colors.black_80 : colors.white,
                        alignItems: 'center', justifyContent: 'center',

                    }}>
                    </View>
                </View>
            </TouchableOpacity >
        );
    }
}

export default RadioCus;
