import React, { Component } from 'react';
import {
    View,
    TextInput,
    Image,
    StyleSheet,
    Keyboard,
    Platform
} from 'react-native';
import PropTypes from 'prop-types';

import { nstyles, colors, sizes } from '../styles';

export default class TextInputCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focus: false
        }
    };

    _renderIconLeft = (iconLeft) => {
        if (iconLeft)
            return <Image
                source={iconLeft}
                style={{ marginRight: 10 }}
                resizeMode='contain'
            />
        else return null;
    }
    _renderIconRight = (iconRight) => {
        if (iconRight)
            return <Image
                source={iconRight}
                style={{ marginLeft: 10 }}
                resizeMode='contain'
            />
        else return null;
    }


    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        this.setState({ focus: true });
    }

    _keyboardDidHide = () => {
        this.setState({ focus: false });

    }

    render() {
        const {
            placeholder,
            iconLeft,
            cusViewContainer,
            cusStyleTextInput,
            refInput,
            iconRight,
        } = this.props;
        return (
            <View style={[styles.constianer, cusViewContainer, { borderColor: this.state.focus ? colors.peacockBlue : 'rgba(0,0,0,0.05)', borderWidth: 1 }]}>
                {this._renderIconLeft(iconLeft)}
                <TextInput
                    {...this.props}
                    ref={refInput}
                    placeholder={placeholder}
                    underlineColorAndroid='transparent'
                    style={[{ paddingVertical: 0, flex: 1 }, cusStyleTextInput]}>
                </TextInput>
                {this._renderIconRight(iconRight)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    constianer: {
        ...nstyles.nstyles.nrow,
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 10,
        borderRadius: 2,
        paddingVertical: Platform.OS === 'ios' ? 10 : 5,
        alignItems:"center"
    }
});

TextInputCom.defaultProps = {
    placeholder: 'Nhập nội dung',
    iconLeft: null,
    iconRight: null,
    cusViewContainer: {},
    cusStyleTextInput: {},
};

TextInputCom.propTypes = {
    placeholder: PropTypes.string,
    iconLeft: PropTypes.any,
    iconRight: PropTypes.any,
    cusViewContainer: PropTypes.object,
    cusStyleTextInput: PropTypes.object
};