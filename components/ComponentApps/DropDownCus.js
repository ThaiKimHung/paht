import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Utils from '../../app/Utils';
import { nstyles, colors, sizes } from '../../styles';
const stLogin = StyleSheet.create({
    contentInput: {
        // marginHorizontal: '10%',
        fontWeight: '600',
        backgroundColor: 'transparent'
    },
    textThongbao: {
        color: colors.black_80,
        fontSize: sizes.sizes.sText18,
        fontWeight: '600',
    },
    viewcontainer: {
        paddingVertical: 20,
        flex: 1,
        flexDirection: 'column'
    },
    textTitleItem: {
        paddingHorizontal: 30,
        color: colors.black_20,
        fontSize: sizes.sizes.sText16,
        fontWeight: '600',

    },
    textValueItem: {
        paddingHorizontal: 30,
        color: colors.black_80,
        fontSize: sizes.sizes.sText16,
        fontWeight: '300',

    }
});
class DropDownCus extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    goback = () => {
        Utils.goback(this)
    }
    render() {
        return (
            <View style={[{ flex: 1, justifyContent: 'center' }]} >
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center',
                }} onTouchEnd={this.goback} />
                <View style={{
                    backgroundColor: colors.white,
                    flex: 1, marginTop: nstyles.Height(30), borderTopLeftRadius: 30, borderTopRightRadius: 30
                }}>

                </View>
            </View >

        );
    }
}
export default DropDownCus
