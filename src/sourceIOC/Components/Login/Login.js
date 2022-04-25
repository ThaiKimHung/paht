import React from 'react';
import { Stack, Button, Color, ButtonColor, Fit, StatusBar, Text, TextField, Font } from '../Kit';
import { Alert, StyleSheet } from 'react-native';
import { onSignIn } from '../../Containers/Login';


const Login = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [statusCode, setStatusCode] = React.useState(200);

    const onBack = () => {
        if (statusCode === 200)
            navigation.goBack();
    }

    const onLoginPress = () => {
        // Utils.navigate('scMainApp')
        let checkPhone = '1' + phoneNumber
        if (checkPhone === parseInt(checkPhone).toString() && phoneNumber.length === 10)
            onCallAPILogin();
        else
            Alert.alert(
                'Thông báo',
                'Vui lòng nhập đúng số điện thoại của bạn.',
                [
                    { text: 'Đồng ý', onPress: () => { }, style: 'cancel' },
                ],
                { cancelable: false },
            );
    };

    const onCallAPILogin = () => {
        // navigation.navigate('PassCodeMoHomedal',{
        //     phoneNumber
        // });
        setStatusCode('loading');
        let onSuccess = ({ statusCode, response }) => {
            console.log(response);
            setStatusCode(200);
            if (statusCode === 200)
                navigation.navigate('PassCodeModal', {
                    phoneNumber
                });
            else
                Alert.alert(
                    'Thông báo',
                    'Không thể kết nối đến máy chủ.',
                    [
                        { text: 'Đồng ý', onPress: () => { }, style: 'cancel' },
                    ],
                    { cancelable: false },
                );
        };
        onSignIn(phoneNumber, onSuccess);
    }

    return (
        <Stack backgroundColor={Color.white} flexFluid padding={20}>
            <StatusBar />
            <Stack style={styles.headerView}>
                <Text size={Font.xLarge} color={Color.primary}>Đăng nhập</Text>
                <Text style={styles.description}>Vui lòng nhập số điện thoại của bạn</Text>
            </Stack>
            <TextField
                placeholder={'Gồm 10 số và không có khoảng trắng'}
                title={'Số điện thoại'}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                disabled={statusCode === 'loading'}
            />
            <Stack style={styles.bottomView}>
                <Button
                    fullWidth
                    color={ButtonColor.fillPrimary}
                    title='Đăng nhập'
                    style={styles.nextButton}
                    onPress={onLoginPress}
                    disabled={!phoneNumber.trim() || statusCode === 'loading'}
                    isLoading={statusCode === 'loading'}
                />
                <Button
                    fullWidth
                    color={ButtonColor.textPrimary}
                    title='Lúc khác'
                    onPress={onBack}
                // disabled = {statusCode === 'loading'}
                />
            </Stack>
        </Stack>
    )
}

export default Login;

const styles = StyleSheet.create({
    headerView: {
        paddingVertical: 10,
        marginBottom: 10
    },
    description: {
        marginVertical: 3
    },
    bottomView: {
        alignItems: Fit.center,
        marginTop: 10
    },
    nextButton: {
        marginBottom: 10
    }
})


