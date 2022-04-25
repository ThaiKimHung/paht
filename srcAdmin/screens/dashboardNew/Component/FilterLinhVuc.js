import { colors } from '../../../../styles';
import React, { useState } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { reText } from '../../../../styles/size';
import { nwidth, nstyles } from '../../../../chat/styles/styles';
import { Images } from '../../../../src/images';
import { Width } from '../../../../styles/styles';

const FilterLinhVuc = React.forwardRef((props, ref) => {
    const { onPress = () => { }, showFilter = () => { }, date, linhvuc = '' } = props
    return (
        <View style={{ flexDirection: 'row', width: '100%' }}>
            <TouchableOpacity style={{
                flex: 1, backgroundColor: colors.black, height: 40, borderRadius: 6,
                alignItems: 'center', flexDirection: 'row', paddingHorizontal: Width(2), marginRight: 10
            }} onPress={onPress}>
                <Text style={{ color: colors.grayLight, marginRight: 10, fontSize: reText(15), flex: 1 }}>{'Tháng ' + date}</Text>
                <Image source={Images.ic_datepicker_hcm} style={{ ...nstyles.nIcon15, tintColor: colors.grayLight }} />
            </TouchableOpacity>
            <TouchableOpacity style={{
                flex: 1, backgroundColor: colors.black, height: 40, borderRadius: 10,
                alignItems: 'center', flexDirection: 'row', paddingHorizontal: Width(2)
            }} onPress={showFilter}>
                <Text style={{ color: colors.grayLight, fontSize: reText(16), flex: 1 }}>{linhvuc != '' ? linhvuc : 'Chọn lĩnh vực'}</Text>
                <Image source={Images.icDropDown} style={[nstyles.nIcon15, { tintColor: colors.grayLight }]} />
            </TouchableOpacity>
        </View>
    )
})

export default FilterLinhVuc

