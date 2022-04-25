import React from 'react'
import { View, Text, Platform, StyleSheet, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { useSelector } from 'react-redux'
import { reText } from '../../../../styles/size'
import { heightStatusBar } from '../../../../styles/styles'
import Icon from 'react-native-vector-icons/Ionicons';
import FontSize from '../../../../styles/FontSize'
import { colors } from '../../../../styles'

const HeaderCongDong = (props) => {
    const { onPressBack, onPressSearch, onPressMap, isCaNhan = false, onPressHistory } = props
    const { colorLinear } = useSelector(state => state.theme)
    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={colorLinear.color}
        >
            <View style={stHeaderCongDong.container}>
                <View style={stHeaderCongDong.left}>
                    <TouchableOpacity onPress={onPressBack} style={{ padding: 2, paddingHorizontal: 10 }}>
                        <Icon name={"arrow-back"} size={FontSize.scale(24)} color={'white'} />
                    </TouchableOpacity>
                </View>
                <View style={stHeaderCongDong.middle}>
                    <Text style={stHeaderCongDong.txtMiddle} numberOfLines={1}>{isCaNhan ? 'Thông tin quan tâm' : 'Thông tin tuyển dụng'}</Text>
                </View>
                <View style={stHeaderCongDong.right}>
                    {
                        isCaNhan ?
                            // <TouchableOpacity onPress={onPressHistory} style={{ padding: 2, paddingHorizontal: 10 }}>
                            //     <Icon name={"timer-outline"} size={FontSize.scale(20)} color={'white'} />
                            // </TouchableOpacity>
                            null
                            :
                            <>
                                {/* <TouchableOpacity onPress={onPressMap} style={{ padding: 2, paddingHorizontal: 10 }}>
                                    <Icon name={"location-sharp"} size={FontSize.scale(20)} color={'white'} />
                                </TouchableOpacity> */}
                                <TouchableOpacity onPress={onPressSearch} style={{ padding: 2, paddingHorizontal: 10 }}>
                                    <Icon name={"search-outline"} size={FontSize.scale(20)} color={'white'} />
                                </TouchableOpacity>
                            </>
                    }
                </View>
            </View>
        </LinearGradient>
    )
}

const stHeaderCongDong = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        paddingTop: Platform.OS == 'ios' ? heightStatusBar() : heightStatusBar() * 1.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    left: {
        width: '25%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    right: {
        width: '25%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    middle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%'
    },
    txtMiddle: {
        fontWeight: 'bold',
        fontSize: reText(16),
        color: colors.white
    }
})

export default HeaderCongDong