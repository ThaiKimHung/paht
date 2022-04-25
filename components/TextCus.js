import React, { Component } from 'react';
import { Text, TextProps } from 'react-native';
import PropTypes from 'prop-types';
import Utils from '../app/Utils';
import { nGlobalKeys } from '../app/keys/globalKey';

export default class TextCus extends Component<TextProps> {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { minSizeText, maxSizeText, children, style = {} } = this.props;
        let { fontSize = 16 } = style;
        if (style[0])
            style.map((item) => { if (item.fontSize) fontSize = item.fontSize });
        let scaleSizeText = Utils.getGlobal(nGlobalKeys.scaleSizeText, 1);
        fontSize = fontSize * scaleSizeText;
        if (minSizeText && fontSize < minSizeText) {
            fontSize = minSizeText;
        }
        if (maxSizeText && fontSize > maxSizeText) {
            fontSize = maxSizeText;
        }
        if (fontSize < 1)
            fontSize = 1;
        let styleNew = style;
        let stypeCus = { fontSize: fontSize };
        if (style[0])
            styleNew.push(stypeCus);
        else
            styleNew = { ...style, ...stypeCus };
        return (
            <Text
                {...this.props}
                style={styleNew}
            >
                {children}
            </Text>
        );
    }
}

TextCus.defaultProps = {
    minSizeText: undefined,
    maxSizeText: undefined
};

TextCus.propTypes = {
    minSizeText: PropTypes.number,
    maxSizeText: PropTypes.number
};

