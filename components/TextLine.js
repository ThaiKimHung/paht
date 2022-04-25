import React from 'react'
import { View, Text, Image } from 'react-native'
import PropTypes from 'prop-types';
import { colors, sizes } from '../styles';
import { reText } from '../styles/size';
import { nstyles, Width } from '../styles/styles';

const TextLine = (props) => {
    let { title = '', styleTitle, value = '', styleValue, icon, styleIcon, showTitle = false, style } = props
    return (
        <>
            <View {...props} style={[{ flexDirection: 'row', backgroundColor: colors.white }, style]}>
                {
                    icon && <Image source={icon} style={[nstyles.nIcon18, styleIcon]} resizeMode='contain' />
                }
                {
                    showTitle && <Text style={[{ fontWeight: 'bold', fontSize: reText(14) }, styleTitle]}>{title}</Text>
                }
                <Text style={[{ flex: 1, paddingLeft: 5 }, styleValue]}>{value}</Text>
                {props.children}
            </View>
        </>

    )
}

TextLine.defaultProps = {
    title: '',
    value: '',
    styleValue: {},
    icon: undefined,
    styleIcon: {},
    styleTitle: {},
    showTitle: false,
    style: {}
};

TextLine.propTypes = {
    title: PropTypes.string,
    value: PropTypes.any,
    styleValue: PropTypes.object,
    icon: PropTypes.any,
    styleIcon: PropTypes.object,
    styleTitle: PropTypes.object,
    showTitle: PropTypes.bool,
    style: PropTypes.object,
};

export default TextLine