import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import COLOR from '../../Styles/Colors';
import FONT from '../../Styles/Font';
import AsyncStorage from '@react-native-community/async-storage';

import Type from '../../Redux/Type';
import URL from '../../Containers/Config';
import { store } from '../../../../srcRedux/store';

const ProfileMenu = ({ navigation }) => {
    const onChangePasswordPress = () => navigation.navigate('ChangePassword');

    const onMenuSignOutPress = () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có muốn đăng xuất tài khoản ?',
            [
                { text: 'Đăng xuất', onPress: onSignOut },
                {
                    text: 'Hủy bỏ', onPress: () => goBack(), style: 'cancel',
                },
            ],
            { cancelable: false },
        );
    };

    const onSignOut = () => {
        try {
            AsyncStorage.setItem(URL.token, '')
                .then(() => {
                    store.dispatch({ type: Type.SET_USER_INFO, userInfo: '' });
                    store.dispatch({ type: Type.SET_TOKEN, token: '' });
                    goBack();
                });
        }
        catch (e) {
            console.log(e);

        }

    };

    const goBack = () => navigation.goBack()

    return (
        <View style={styles.container}>
            <View style={styles.menuView}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={onChangePasswordPress}
                >
                    <Text style={styles.buttonTitle}>Đổi mật khẩu</Text>
                </TouchableOpacity>
                <View style={styles.divine} />
                <TouchableOpacity
                    style={styles.button}
                    onPress={onMenuSignOutPress}
                >
                    <Text style={[styles.buttonTitle, styles.signOutTitle]}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={[styles.button, styles.menuCancel]}
                onPress={goBack}
            >
                <Text style={styles.buttonTitle}>Hủy bỏ</Text>
            </TouchableOpacity>
        </View>
    );
}

export default ProfileMenu;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    background: opacity => ({
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,.3)',
        opacity,
    }),
    menuAnimated: anim => ({
        transform: [{ translateY: anim }],
    }),
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 52,

    },
    buttonTitle: {
        fontFamily: FONT.FontFamily,
        fontSize: 16,
        color: COLOR.blue,
    },
    menuView: {
        marginBottom: 10,
        borderRadius: 12,
        overflow: 'hidden',
        marginHorizontal: 10,
        backgroundColor: COLOR.white,
    },
    menuCancel: {
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 12,
        backgroundColor: COLOR.white,
    },
    divine: {
        height: 1,
        backgroundColor: COLOR.border,
    },
    signOutTitle: {
        color: COLOR.red,
    },

});
