import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    TextProps
} from 'react-native';

export default class TextApp extends Component<TextProps> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Text {...this.props} style={[styles.defaultStyle, this.props.style]}>
                {this.props.children}
            </Text>
        );
    }
}

const styles = StyleSheet.create({
    // ... add your default style here
    defaultStyle: {
    }
});