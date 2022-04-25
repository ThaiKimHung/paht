
import React, { Component } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Text
} from 'react-native';
import { colors } from '../../styles/color';
import { sizes } from '../../styles/size';
import { nColors, nstyles } from '../../styles/styles';

const stBookingDetail = StyleSheet.create({
    Tab: {
        borderTopColor: 'white',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        paddingVertical: 10,
        paddingLeft: 15,
        flex: 1,
        margin: 5
    }
});
const TabYellowHeader = (props) => {
    //starMode : yellow, white
    let { tab = [], indexScreen = 0 } = props;
    // if (style == undefined)
    //     style = {};
    return <View style={[nstyles.nrow, { backgroundColor: 'white' }]}>
        {tab.map((item, index) => <TouchableOpacity activeOpacit={1}
            //onPress={() => this._tab(item.id)}
            key={index}
            style={[stBookingDetail.Tab, { backgroundColor: index == indexScreen ? colors.colorButterscotch : colors.colorPaleGrey }]}>
            <Text style={[nstyles.txtSoftBlue, { color: index == indexScreen ? colors.colorSapphire : colors.colorSoftBlue, fontSize: sizes.sText12 }]}>{item}</Text>
        </TouchableOpacity>)}
    </View>;
}

export default TabYellowHeader;
