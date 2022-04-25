import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, ViewProps } from 'react-native'
import { ImagesSVL } from '../images';
import PropTypes from 'prop-types';
import { reText } from '../../../styles/size';


export class EmptySVL extends Component<ViewProps> {
    render() {
        const { textEmpty = 'Không có dữ liệu', style = {} } = this.props;
        return (
            <View {...this.props} style={[stEmptySVL.contain, style]}>
                <Image source={ImagesSVL.icEmptyList} />
                <Text style={[stEmptySVL.text]}> {textEmpty}</Text>
            </View>
        )
    }
}

EmptySVL.defaultProps = {
    textEmpty: undefined,
};

EmptySVL.propTypes = {
    textEmpty: PropTypes.string,
};
const stEmptySVL = StyleSheet.create({
    contain: {
        alignItems: 'center', justifyContent: 'center'
    },
    text: {
        marginTop: 30, fontWeight: 'bold', fontSize: reText(14), width: '100%',
        textAlign: 'center', paddingHorizontal: 20
    }
})
export default EmptySVL
