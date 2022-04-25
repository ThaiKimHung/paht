import React, { Component } from 'react';
import {
    Image, View, Text, TouchableOpacity, Platform
} from 'react-native';
import PropTypes from 'prop-types';
import Utils from '../app/Utils';
import { sizes, colors, nstyles } from '../styles';
import LinearGradient from 'react-native-linear-gradient';
import { ImgComp } from './ImagesComponent';
import { heightStatusBar } from '../styles/styles';

class HeaderCom extends Component {
    constructor(props) {
        super(props);
        this.nthis = nthisApp;
    }

    _onPressLeftDefault = () => {
        try {
            Utils.goback(this.nthis, null);
        } catch (error) {
        }
    }

    _onPressRightDefault = () => {
        try {
            Utils.goscreen(this.nthis, 'sc_NotificationTripU');
        } catch (error) {

        }

    }

    render() {
        let {
            onPressLeft,
            titleText,
            style,
            componentLeft,
            isTransparent,
            tintColorLeft,
            notification,
            height,
            titleTextCustoms,
            customStyleIconRight,
            onPressRight,
            hiddenIconRight,
            iconLeft,
            iconRight,
            styleContent
        } = this.props;

        height += (Platform.OS == 'android' ? nstyles.paddingTopMul() + heightStatusBar() / 2 : nstyles.paddingTopMul())
        //---
        const { color = nstyles.nColors.main2 } = style;
        const { nIcon24 } = nstyles.nstyles;
        return (
            <LinearGradient
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                colors={isTransparent ? [colors.nocolor, colors.nocolor] : this.props.theme.colorHeaderAdmin ? this.props.theme.colorHeaderAdmin : [colors.peacockBlue, colors.peacockBlue]}
                style={[nstyles.nstyles.nhead, { paddingTop: Platform.OS == 'android' ? nstyles.paddingTopMul() + heightStatusBar() : 0, ...style, height, alignItems: 'center' }, isTransparent ? { backgroundColor: colors.nocolor } : {}]}>
                <View style={[nstyles.nstyles.nHcontent, { ...styleContent }]}>
                    <View style={nstyles.nstyles.nHleft}>
                        {
                            componentLeft ? componentLeft :
                                (
                                    iconLeft != null ?
                                        <TouchableOpacity
                                            style={{ padding: 4, paddingLeft: 5 }}
                                            onPress={onPressLeft}>
                                            <Image
                                                source={iconLeft}
                                                resizeMode='contain'
                                                style={[nIcon24, { tintColor: tintColorLeft }]} />
                                        </TouchableOpacity> : null
                                )
                        }
                    </View>
                    {
                        titleTextCustoms ? titleTextCustoms :
                            <View style={[nstyles.nstyles.nHmid, {}]}>
                                {
                                    titleText ? <Text numberOfLines={1} style={[nstyles.nstyles.ntitle, { fontSize: sizes.reText(20), fontWeight: '500', color }]}>
                                        {titleText}
                                    </Text> : null
                                }
                            </View>
                    }
                    <View style={nstyles.nstyles.nHright}>
                        {
                            iconRight == ImgComp.icRefresh ?
                                <TouchableOpacity
                                    onPress={onPressRight}
                                >
                                    <Image source={iconRight}
                                        resizeMode='contain'
                                        style={[nIcon24, customStyleIconRight]}
                                    />
                                </TouchableOpacity>
                                :
                                !hiddenIconRight ? //ẩn icon right
                                    <TouchableOpacity
                                        onPress={onPressRight}
                                        style={{ marginRight: 8 }}
                                    >
                                        <Image source={iconRight}
                                            resizeMode='contain'
                                            style={[nIcon24, customStyleIconRight]}
                                        />
                                        {
                                            notification ? <LinearGradient
                                                colors={[colors.blue, colors.waterBlue]}
                                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                                style={[nstyles.nstyles.nmiddle, {
                                                    backgroundColor: colors.blue,
                                                    position: 'absolute',
                                                    height: 18, width: 18,
                                                    marginLeft: 15,
                                                    borderRadius: 9,
                                                    marginTop: -5
                                                }]}>
                                                <Text style={{ color: 'white', fontSize: sizes.sizes.sText10, fontWeight: '800' }}>{notification}</Text>
                                            </LinearGradient> : null
                                        }
                                    </TouchableOpacity> : null
                        }
                    </View>
                </View>
            </LinearGradient>
        );
    }
}

HeaderCom.defaultProps = {
    onPressLeft: () => { Utils.goback(this.nthis, null) },
    onPressRight: () => { },
    titleText: '',
    style: {},
    componentLeft: null,
    isTransparent: false,
    tintColorLeft: colors.white,
    notification: 0,
    height: ((nstyles.heightHed() - nstyles.paddingTopMul()) + 5),
    titleTextCustoms: null,
    customStyleIconRight: {},
    hiddenIconRight: false,
    iconLeft: ImgComp.icBack,
    iconRight: ImgComp.icSetting,
    nthis: this.nthis,
    styleContent: {}
};

HeaderCom.propTypes = {
    onPressLeft: PropTypes.func,
    titleText: PropTypes.string,
    style: PropTypes.object,
    componentLeft: PropTypes.any,
    isTransparent: PropTypes.bool,
    tintColorLeft: PropTypes.string,
    notification: PropTypes.number,
    height: PropTypes.number,
    titleTextCustoms: PropTypes.any,
    customStyleIconRight: PropTypes.object,
    onPressRight: PropTypes.func,
    hiddenIconRight: PropTypes.bool,
    iconLeft: PropTypes.any,
    iconRight: PropTypes.any,
    nthis: PropTypes.any,
    styleContent: PropTypes.object
};

const mapStateToProps = state => ({
    theme: state.theme
});

export default Utils.connectRedux(HeaderCom, mapStateToProps, true)