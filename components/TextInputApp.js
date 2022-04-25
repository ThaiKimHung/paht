import React, { Component } from 'react';
import {
    TextInput,
    StyleSheet,
    TextInputProps
} from 'react-native';

export default class TextInputApp extends Component<TextInputProps> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TextInput ref={this.props?.refInput} {...this.props} style={[styles.defaultStyle, this.props.style]}>
                {this.props.children}
            </TextInput>
        );
    }
}

const styles = StyleSheet.create({
    // ... add your default style here
    defaultStyle: {
        color: 'black'
    }
});