import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { nstyles, colors, sizes } from '../../styles';
class ModalLoading extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View
                onTouchEnd={this.props.enLoading}
                style={
                    [{
                        backgroundColor: colors.backgroundModal, flex: 1,
                        zIndex: 10,
                        left: 0, top: 0, bottom: 0,
                        right: 0,
                        justifyContent: 'center', position: "absolute", alignItems: 'center'
                    }]} >
                <View style={{
                    alignItems: 'center',
                    paddingHorizontal: 30, paddingVertical: 30,
                    //backgroundColor: colors.backgroundModal
                }}>
                    <ActivityIndicator size="large" color={colors.colorHeaderApp} />
                    <Text style={{ color: colors.colorHeaderApp }}>Đang tải...</Text>
                </View>
            </View >

        );
    }
}

export default ModalLoading;
