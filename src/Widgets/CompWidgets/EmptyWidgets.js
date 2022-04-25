import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, ViewProps } from 'react-native'
import PropTypes from 'prop-types';
import { reText, sizes } from '../../../styles/size';
import { ImgWidget } from '../Assets';
import { colorsWidget } from '../../../styles/color';


export class EmptyWidgets extends Component<ViewProps> {
    render() {
        const { textEmpty = 'Không có dữ liệu', style = {} } = this.props;
        return (
            <View {...this.props} style={[stEmptyWidgets.contain, style]}>
                <Image source={ImgWidget.icEmpty} style={{ width: sizes.nImgSize187, height: sizes.nImgSize187 }} />
                <Text style={[stEmptyWidgets.text]}> {textEmpty}</Text>
            </View>
        )
    }
}

EmptyWidgets.defaultProps = {
    textEmpty: undefined,
};

EmptyWidgets.propTypes = {
    textEmpty: PropTypes.string,
};
const stEmptyWidgets = StyleSheet.create({
    contain: {
        alignItems: 'center', justifyContent: 'center'
    },
    text: {
        marginTop: 30, fontSize: reText(14), width: '100%',
        textAlign: 'center', paddingHorizontal: 20, color: colorsWidget.placeholderInput
    }
})
export default EmptyWidgets
