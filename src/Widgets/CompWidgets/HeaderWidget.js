import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types'
import { colors, nstyles } from '../../../styles';
import LinearGradient from 'react-native-linear-gradient'
import { sizes } from '../../../styles/size';
import { heightStatusBar } from '../../../styles/styles';
import { store } from '../../../srcRedux/store';


//Dùng thêm <{}> nó mới gợi ý props
class HeaderWidget extends Component<{}> {

    render() {
        const {
            Sleft,
            Smiddle,
            Sright,
            SrightIcon,
            onPressLeft,
            onPressMiddle,
            onPressRight,
            iconLeft,
            iconRight,
            title,
            titleLeft,
            titleRight,
            styleContainer,
            styleTitle,
            styleTitleRight,
            colorChange,
            numberOfLines,
            componentTitle,
            maxWidth_LR,
        } = this.props;

        let theme = store.getState().theme;

        height = (Platform.OS == 'android' ? nstyles.heightHed() + heightStatusBar() : nstyles.heightHed());

        return (
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={colorChange.length > 0 ? colorChange : theme.colorLinear.color}
                style={[nstyles.nstyles.shadown, {
                    paddingTop: Platform.OS == 'android' ? nstyles.paddingTopMul() + heightStatusBar() : nstyles.paddingTopMul(),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: height,
                }, styleContainer]}>
                <View style={[styles.left, { alignItems: 'center', maxWidth: maxWidth_LR }]}>
                    <TouchableOpacity
                        style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }]}
                        onPress={onPressLeft}
                    >
                        {
                            iconLeft ? <Image source={iconLeft} resizeMode={'contain'} style={[styles.st_icon, Sleft]} /> : null
                        }
                        {
                            titleLeft ?
                                <Text style={[styles.st_titleLeft, Sleft]}>{titleLeft}</Text>
                                : null
                        }
                    </TouchableOpacity>
                </View>

                <View style={[styles.middle, { alignItems: 'center' }]}>
                    <TouchableOpacity
                        disabled={!onPressMiddle}
                        activeOpacity={0.9}
                        style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }, Smiddle]}
                        onPress={onPressMiddle}
                    >
                        {componentTitle}
                        {
                            title ? <Text numberOfLines={numberOfLines} style={[styles.st_title, styleTitle]}>{title}</Text> : null
                        }
                    </TouchableOpacity>
                </View>

                <View style={[styles.right, { maxWidth: maxWidth_LR }, styleTitleRight]}>
                    <TouchableOpacity
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
                        onPress={onPressRight}
                    >
                        {
                            iconRight ? <Image source={iconRight} resizeMode={'contain'} style={[styles.st_iconRight, Sright, SrightIcon]} /> : null
                        }
                        {
                            titleRight ?
                                <Text style={[styles.st_titleRight, Sright]}>{titleRight}</Text>
                                : null
                        }
                    </TouchableOpacity>

                </View>
            </LinearGradient>
        );
    }
}
const styles = StyleSheet.create({
    left: { alignItems: 'center', justifyContent: 'center', width: 70 },
    middle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    right: { alignItems: 'center', justifyContent: 'center', width: 70 },
    st_title: {
        fontSize: sizes.sText16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    st_icon: {
        width: 22,
        height: 22
    },
    st_iconRight: {
        width: 22,
        height: 22
    },
    st_titleLeft: {
        fontSize: sizes.sText14,
        fontWeight: 'bold',
        color: colors.white,
    },
    st_titleRight: {
        fontSize: sizes.sText14,
        fontWeight: 'bold'
    }
})
HeaderWidget.propTypes = {
    Sleft: PropTypes.object,
    Smiddle: PropTypes.object,
    Sright: PropTypes.object,
    SrightIcon: PropTypes.object,
    onPressLeft: PropTypes.func,
    onPressMiddle: PropTypes.func,
    onPressRight: PropTypes.func,
    iconLeft: PropTypes.any,
    iconRight: PropTypes.any,
    title: PropTypes.string,
    titleLeft: PropTypes.string,
    titleRight: PropTypes.string,
    styleContainer: PropTypes.object,
    styleTitle: PropTypes.object,
    styleTitleRight: PropTypes.object,
    colorChange: PropTypes.array,
    numberOfLines: PropTypes.number,
    componentTitle: PropTypes.any,
    maxWidth_LR: PropTypes.number,

}
HeaderWidget.defaultProps = {
    Sleft: {},
    Smiddle: {},
    Sright: {},
    SrightIcon: {},
    onPressLeft: () => { },
    onPressMiddle: false,
    onPressRight: () => { },
    iconLeft: '',
    iconRight: '',
    title: '',
    titleLeft: '',
    titleRight: '',
    styleContainer: {},
    styleTitle: {},
    styleTitleRight: {},
    colorChange: [colors.white, colors.white],
    numberOfLines: 2,
    componentTitle: null,
    maxWidth_LR: 50
};

export default HeaderWidget;
