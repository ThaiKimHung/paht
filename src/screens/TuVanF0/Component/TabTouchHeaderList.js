import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useSelector } from 'react-redux';
import { colors } from '../../../../styles';
import { nstyles, Width } from '../../../../styles/styles';
import LottieView from 'lottie-react-native';
import { reText } from '../../../../styles/size';

const TabTouchHeaderList = (props) => {
    const [filterChoose, setFilterChoose] = useState(props?.filterChoose || '')
    const [dataFilter, setdataFilter] = useState(props?.dataFilter || [])
    const { colorLinear } = useSelector(state => state.theme)

    useEffect(() => {
        if (filterChoose != props?.filterChoose) {
            setFilterChoose(props?.filterChoose)
        }
        return () => {

        }
    }, [props?.filterChoose])


    const _renderFilter = (item, index) => {
        var { key, value, title, icon } = item
        return (
            <TouchableOpacity
                onPress={() => props.chooseFilter(index, key, value)}
                key={index}
                style={[nstyles.nmiddle, nstyles.nrow,
                {
                    backgroundColor: filterChoose == index ? colorLinear.color[0] + '0D' : colors.white,
                    paddingVertical: value == '3' ? 5 : 10,
                    flex: 1,
                    paddingHorizontal: 10,
                    borderTopLeftRadius: index == 0 ? 5 : 0,
                    borderBottomLeftRadius: index == 0 ? 5 : 0,
                    borderTopRightRadius: index == dataFilter.length - 1 ? 5 : 0,
                    borderBottomRightRadius: index == dataFilter.length - 1 ? 5 : 0,
                    borderWidth: 0.5,
                    borderColor: colors.black_11
                }]}>

                {value == '3' ?
                    <LottieView
                        source={require('../../../images/red_alert.json')}
                        style={{ width: Width(7), marginRight: -5 }}
                        loop={true}
                        autoPlay={true}
                    /> :
                    <Image source={icon}
                        style={[nstyles.nIcon18, { tintColor: filterChoose == index ? colorLinear.color[0] : colors.black_60 }]} />}
                <Text style={{ color: filterChoose == index ? colorLinear.color[0] : colors.black_60, paddingLeft: 5, fontWeight: 'bold', fontSize: reText(14) }}>{title}</Text>
            </TouchableOpacity>
        );
    };
    return (
        <View style={{ paddingHorizontal: 15, width: '100%', flexDirection: 'row', marginTop: 10 }}>
            {dataFilter && dataFilter.map(_renderFilter)}
        </View>
    )
}

export default TabTouchHeaderList
