import React, { useState } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { sizes } from '../../../styles/size'
import { nstyles } from '../../../styles/styles'
import Utils from '../../../app/Utils'

export const ItemDVXL = (props) => {
    let {
        item,
        index,
        // DonViXL,
        onClick = () => { }
    } = props;


    const [checked, setCheck] = useState(item.isCheck);

    const onPress = () => {
        // const chk = !checked
        // setCheck(chk)
        // // DonViXL[index].isCheck = chk;
        onClick(item, index, chk);
    }

    return (
        <TouchableOpacity
            //onPress={() => this._onClickDVXL(item, index)}
            onPress={onPress}
            key={item.MaPX}
            style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <Text style={{ fontSize: sizes.sText14 }}>{item.TenPhuongXa}</Text>
            <Image
                source={checked == true ? Images.icCheck : Images.icUnCheck}
                style={[nstyles.nIcon14, { tintColor: colors.peacockBlue }]}
            />
        </TouchableOpacity>
    )
}
