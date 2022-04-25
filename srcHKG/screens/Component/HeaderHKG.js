import React, { Component } from 'react';
import {
    Image, View, Text, TouchableOpacity, StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import { Images } from '../../../src/images';
import { colors } from '../../../styles';
import { nstyles, paddingTopMul, Width } from '../../../styles/styles';
import { reText } from '../../../styles/size';
class HeaderHKG extends Component {
    constructor(props) {
        super(props);
        // this.nthisHeader = nthisApp;
    };
    render() {
        const { textLeft, textRight, title, iconLeft, iconRight, stylesLeft, stylesMid, stylesRight, onPressLeft, onPressMid, onPressRight, styleIconLeft, styleIconRight, componentMid = null } = this.props;
        return (
            <View style={{ backgroundColor: '#F0A14D', paddingVertical: 6 }}>
                <View style={[nstyles.nrow, { alignItems: 'center', paddingHorizontal: nstyles.khoangcach, paddingTop: Platform.OS == 'android' ? paddingTopMul() + 15 : paddingTopMul() }]}>
                    <View style={[nstyles.nrow, { flex: 1, alignItems: 'center', justifyContent: 'space-around' }]}>
                        <View style={{ width: Width(10), alignItems: 'center' }}>
                            <TouchableOpacity activeOpacity={0.5} onPress={onPressLeft} style={{ padding: 10 }}>
                                {
                                    iconLeft ?
                                        <Image source={iconLeft} style={[nstyles.nIcon20, styleIconLeft, { tintColor: colors.white }]} resizeMode='contain' /> :
                                        <Text style={[{ fontSize: reText(12), color: colors.redStar }, stylesLeft]}>{textLeft}</Text>
                                }
                            </TouchableOpacity>
                        </View>
                        {
                            componentMid ? componentMid :
                                <View style={{ width: Width(80), alignItems: 'center' }}>
                                    <Text style={[{ fontSize: reText(16), fontWeight: 'bold', color: colors.white }, stylesMid]}>{title}</Text>
                                </View>
                        }
                        <View style={{ width: Width(10), alignItems: 'center' }}>
                            {
                                <TouchableOpacity activeOpacity={0.5} onPress={onPressRight} style={{ padding: 10 }}>
                                    {
                                        iconRight ?
                                            <Image source={iconRight} style={[nstyles.nIcon20, styleIconRight, { tintColor: colors.white }]} resizeMode='contain' /> :
                                            <Text style={[{ fontSize: reText(12), color: colors.white }, stylesRight]}>{textRight}</Text>
                                    }
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

HeaderHKG.propTypes = {
    ///PropTypes
    textLeft: PropTypes.string,
    textRight: PropTypes.string,
    title: PropTypes.string,
    iconLeft: PropTypes.any,
    iconRight: PropTypes.any,
    stylesLeft: PropTypes.object,
    stylesMid: PropTypes.object,
    stylesRight: PropTypes.object,
    onPressLeft: PropTypes.func,
    onPressMid: PropTypes.func,
    onPressRight: PropTypes.func,
    styleIconLeft: PropTypes.object,
    styleIconRight: PropTypes.object,
    componentMid: PropTypes.any,
}
HeaderHKG.defaultProps = {
    textLeft: '',
    textRight: '',
    title: '',
    iconLeft: '',
    iconRight: '',
    stylesLeft: {},
    stylesMid: {},
    stylesRight: {},
    onPressLeft: () => { },
    onPressMid: () => { },
    onPressRight: () => { },
    styleIconLeft: {},
    styleIconRight: {},
    componentMid: null
};
export default HeaderHKG;
