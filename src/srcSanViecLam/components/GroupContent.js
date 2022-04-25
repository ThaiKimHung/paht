import React, { useEffect, useState, useRef, useMemo } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { View, Text, StyleSheet, Easing } from 'react-native'
import Animated from 'react-native-reanimated'
import { colors } from '../../../styles'
import TextApp from '../../../components/TextApp'
import { Images } from '../../images'
import { nstyles } from '../../../styles/styles'
import { reText } from '../../../chat/styles/size'
import { colorsSVL } from '../../../styles/color'
import { ImagesSVL } from '../images'

const GroupContent = (props) => {
    const { onPressGroup = () => { }, data = [], title } = props
    const [showGroup, setShowGroup] = useState(props?.showGroup || true)
    const animation = useRef(new Animated.Value(0)).current;

    const rotateDrop = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['-90deg', '0deg'],
    });

    useEffect(() => {
        CallAnimation(showGroup ? 1 : 0);
    }, [showGroup])

    const onPressHanler = () => {
        onPressGroup()
        setShowGroup(!showGroup)
    }

    const CallAnimation = (value) => {
        Animated.timing(animation, {
            toValue: value,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start();

    }


    return (
        <View style={[{ backgroundColor: colors.BackgroundHome }, props?.style]}>
            <TouchableOpacity activeOpacity={0.5} onPress={onPressHanler}
                style={[stGroupContent.btnTitle, props?.styleTouchTitle]}>
                <View style={[stGroupContent.title, props?.styleTitle]}>
                    <TextApp style={[stGroupContent.lblTitle, props?.styleLabelTitle]}>{title}</TextApp>
                </View>
                <Animated.Image
                    source={Images.icDropDown}
                    resizeMode="contain"
                    style={[nstyles.nIcon13, { transform: [{ rotate: rotateDrop }, props?.styleIcon] }]}
                />
            </TouchableOpacity>
            {showGroup && props.children}
        </View>
    )
}

const stGroupContent = StyleSheet.create({
    container: {
        padding: 10
    },
    title: {
        paddingLeft: 8, borderLeftWidth: 3, borderColor: colorsSVL.blueMainSVL
    },
    lblTitle: { paddingRight: 10, fontWeight: 'bold', fontSize: reText(16) },
    btnTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, backgroundColor: colors.white }
})

export default GroupContent
