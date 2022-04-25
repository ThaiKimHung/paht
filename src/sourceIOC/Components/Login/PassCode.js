import React from 'react';
import { Stack, Button, Color, ButtonColor, Fit, HeaderBarStatus, Text, TextField } from '../Kit';
import { Alert, StyleSheet } from 'react-native';
import { onConfirmPassCode } from '../../Containers/Login';
import Utils from '../../../../app/Utils';


const PassCode = ({ navigation, route }) => {
    const [passCode, setPassCode] = React.useState('');
    const [statusCode, setStatusCode] = React.useState(200);

    const onConfirmPassCodePress = () => {
        let checkValid = '1' + passCode.trim();

        if (checkValid === parseInt(checkValid).toString())
            onCallConfirmPassCodeAPI();
        else
            Alert.alert(
                'Sai mã xác thực',
                'Vui lòng nhập đúng mã xác thực',
                [
                    { text: 'Đồng ý', onPress: () => { }, style: 'cancel' },
                ],
                { cancelable: false },
            );
    }

    const onCallConfirmPassCodeAPI = () => {
        setStatusCode('loading');
        let phoneNumber = navigation.getParam('phoneNumber', ''),
            onSuccess = ({ statusCode, response }) => {
                if (statusCode === 200) {
                    Utils.navigate('scMainApp')
                } else if (statusCode === 204)
                    Alert.alert(
                        'Sai mã xác thực',
                        'Mã xác thực không đúng. Xin vui lòng nhập lại.',
                        [
                            { text: 'Đồng ý', onPress: () => setStatusCode(200), style: 'cancel' },
                        ],
                        { cancelable: false },
                    );
                else if (statusCode !== 200)
                    Alert.alert(
                        'Thông báo',
                        'Xảy ra lỗi trong quá trình kết nối máy chủ, xin vui lòng thử lại.',
                        [
                            { text: 'Đồng ý', onPress: () => setStatusCode(200), style: 'cancel' },
                        ],
                        { cancelable: false },
                    );
            }
        onConfirmPassCode(phoneNumber, passCode, onSuccess).catch()

    };

    const onBack = () => navigation.goBack();
    Utils.nlog('prams pascode....', navigation.getParam('phoneNumber', ''))
    return (
        <Stack flexFluid style={styles.container}>
            <HeaderBarStatus
                title='Xác thực'
            />
            <Stack backgroundColor={Color.white} flexFluid padding={20}>
                <Text textAlign={Fit.center} style={styles.description}>Mã số xác thực đã được gửi đến số điện thoại <Text color={Color.primary}>{navigation.getParam('phoneNumber', '')}</Text>. Xin vui lòng nhập chính xác mã số.</Text>
                <TextField
                    placeholder={''}
                    title={'Mã xác nhận'}
                    value={passCode}
                    onChangeText={setPassCode}
                    disabled={statusCode === 'loading'}
                />
                <Stack style={styles.bottomView}>
                    <Button
                        fullWidth
                        color={ButtonColor.fillPrimary}
                        title='Xác nhận'
                        style={styles.nextButton}
                        onPress={onConfirmPassCodePress}
                        disabled={!passCode.trim() || statusCode === 'loading'}
                        isLoading={statusCode === 'loading'}
                    />
                    <Button
                        fullWidth
                        color={ButtonColor.textPrimary}
                        title='Không nhận được'
                        onPress={onBack}
                    />
                </Stack>
            </Stack>
        </Stack>

    )
}

export default PassCode;

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderTopColor: Color.gray50
    },

    headerView: {
        paddingVertical: 10,
        marginBottom: 10
    },
    description: {
        marginBottom: 16
    },
    bottomView: {
        alignItems: Fit.center,
        marginTop: 10
    },
    nextButton: {
        marginBottom: 10
    }
})


