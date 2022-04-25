import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Utils from '../../../app/Utils';
import { nstyles, colors, sizes } from '../../../styles';
import { ScrollView } from 'react-native-gesture-handler';

const stLogin = StyleSheet.create({
    contentInput: {
        // marginHorizontal: '10%',
        fontWeight: '600',
        backgroundColor: 'transparent'
    },
    textThongbao: {
        color: colors.black_80,
        fontSize: sizes.sizes.sText18,
        fontWeight: '600',
        // textAlign: 'center'

    },
    viewcontainer: {
        paddingVertical: 20,
        flex: 1,
        flexDirection: 'column'
    },
    textTitleItem: {
        paddingHorizontal: 30,
        color: colors.black_20,
        fontSize: sizes.sizes.sText16,
        fontWeight: '600',

    },
    textValueItem: {
        paddingHorizontal: 30,
        color: colors.black_80,
        fontSize: sizes.sizes.sText16,
        fontWeight: '300',

    }
});
class ModalThongBao extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
    }
    dangNhap = () => {
        Utils.goscreen(this, 'login')
    }
    goback = () => {
        Utils.goback(this)
    }
    render() {
        return (
            <View style={[{ backgroundColor: colors.backgroundModal, flex: 1, justifyContent: 'center' }]} >
                <View style={{
                    position: 'absolute', left: 0, top: 60, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center',
                }} />
                <View style={{
                    margin: 15, backgroundColor: colors.white, marginTop: 60,
                    padding: 10, width: '90%', alignSelf: 'center', borderRadius: 8
                }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={stLogin.viewcontainer}>
                            <Text style={[stLogin.textThongbao, { paddingHorizontal: 30, paddingVertical: 30 }]}>{`Đăng ký thành công`}</Text>
                            <Text style={stLogin.textValueItem}>{`Tài khoản đã được kích hoạt thành công. Đi đến đăng nhập ngay tài khoản vừa tạo để sử dụng các tiện ích.`}</Text>
                        </View>
                    </ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        {/* <TouchableOpacity onPress={this.goback} style={{ justifyContent: 'flex-start', paddingVertical: 10 }}>
                            <Text style={[stLogin.textTitleItem, { color: colors.colorBlue, }]}>{`Đóng`.toUpperCase()}</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity onPress={this.dangNhap} style={{ justifyContent: 'flex-end', paddingVertical: 10 }}>
                            <Text style={[stLogin.textTitleItem, { color: colors.colorBlue, textAlign: 'right' }]}>{`Đăng nhập`.toUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View >

        );
    }
}

export default ModalThongBao;
