import React, { Component } from 'react';
import {
    StyleSheet,
    Keyboard,
    View,
    Text,
    Alert,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import COLOR from '../../Styles/Colors';
import FONT from '../../Styles/Font';
import POSITION from '../../Styles/Position';
import { onAuthentication, onChangePassWord } from '../../Containers/Login';
import Dash from '../UI/Dash';
import { store } from '../../../../srcRedux/store';

class Login extends Component<{}> {

    constructor(props, context) {
        super(props, context);
        let dataUser = store.getState().userInfo,
            isLoginScreen = props.route.name === 'Login';

        this.state = {
            username: !isLoginScreen ? dataUser.Username : '',
            password: '',
            statusCode: 200,
            isLoginScreen,
            lastPassword: '',
            confirmPassword: '',
        };
    }


    onCallLoginAPI = () => {
        let { username, password } = this.state;
        username = username.trim();
        let payload = {
            Username: username,
            Password: password,
            AppId: '3518',
        };
        this.setState({ statusCode: 'loading' });
        let onSuccess = ({ statusCode, response }) => {
            if (statusCode === 200) {
                this.props.navigation.goBack();
            } else {
                Alert.alert(
                    'Thông báo',
                    response,
                    [
                        {
                            text: 'Đồng ý', onPress: () => this.setState({ statusCode: 200 }), style: 'cancel',
                        },
                    ],
                    { cancelable: false },
                );
            }
        };
        onAuthentication(payload, onSuccess);
    };

    onChangePassWord = () => {
        this.setState({ statusCode: 'loading' });
        let { lastPassword, password } = this.state;
        let payload = {
            Password: password,
            LastPassword: lastPassword,
        };
        let onSuccess = ({ statusCode, response }) => {
            if (statusCode === 200) {
                Alert.alert(
                    'Thông báo',
                    'Đổi mật khẩu thành công',
                    [
                        { text: 'Đồng ý', onPress: () => this.props.navigation.goBack(), style: 'cancel' },
                    ],
                    { cancelable: false },
                );
            } else {
                Alert.alert(
                    'Thông báo',
                    response,
                    [
                        { text: 'Đồng ý', onPress: () => this.setState({ statusCode: 200 }), style: 'cancel' },
                    ],
                    { cancelable: false },
                );
            }
        };
        onChangePassWord(payload, onSuccess);
    };

    onCreateAccountPress = () => {
        Alert.alert(
            'Tạo tài khoản',
            'Vui lòng liên hệ quản trị viên để được hỗ trợ.',
            [
                {
                    text: 'Đồng ý', onPress: () => {
                    }, style: 'cancel',
                },
            ],
            { cancelable: false },
        );
    };

    _onSubmitEditing = () => {
        Keyboard.dismiss();
        let { username, password, isLoginScreen, lastPassword, confirmPassword } = this.state;
        username = username.trim();
        if (isLoginScreen && username && password) {
            this.onCallLoginAPI();
        } else if (!isLoginScreen && lastPassword && confirmPassword && password) {
            if (confirmPassword === lastPassword) {
                this.onChangePassWord();
            } else {
                Alert.alert(
                    'Sai xác nhận',
                    'Mật khẩu xác nhận không khớp với mật khẩu mới.',
                    [
                        {
                            text: 'Đồng ý', onPress: () => {
                            }, style: 'cancel',
                        },
                    ],
                    { cancelable: false },
                );
            }
        }

    };

    _onUsernameChange = value => this.setState({ username: value });
    _onPasswordChange = value => this.setState({ password: value });
    _onNewPasswordChange = value => this.setState({ lastPassword: value });
    _onConfirmPasswordChange = value => this.setState({ confirmPassword: value });

    render() {
        let isLoading = this.state.statusCode === 'loading',
            { isLoginScreen } = this.state;
        return (
            <View style={styles.container}>
                <Dash />
                <Text style={styles.title}>{isLoginScreen ? 'Đăng nhập' : 'Đổi mật khẩu'}</Text>
                {isLoginScreen ?
                    <Text style={styles.description}>
                        Tài khoản đăng nhập là tài khoản đã được quản trị viên cung cấp
                    </Text>
                    :
                    <View style={{ margin: 15 }} />
                }
                {isLoginScreen ?
                    <View>
                        <View style={styles.underline} />
                        <View style={styles.form}>
                            <Text style={styles.formTitle}>Tài khoản</Text>
                            <TextInput
                                ref={e => this.TextInput = e}
                                style={styles.input}
                                onChangeText={this._onUsernameChange}
                                value={this.state.username}
                                placeholder={'Tên đăng nhập'}
                                onSubmitEditing={this._onSubmitEditing}
                                editable={!isLoading}
                                autoCapitalize='none'
                            />
                        </View>
                        <View style={styles.underline} />
                        <View style={styles.form}>
                            <Text style={styles.formTitle}>Mật khẩu</Text>
                            <TextInput
                                ref={e => this.TextInput = e}
                                style={styles.input}
                                onChangeText={this._onPasswordChange}
                                value={this.state.password}
                                placeholder={'Nhập mật khẩu'}
                                onSubmitEditing={this._onSubmitEditing}
                                editable={!isLoading}
                                secureTextEntry

                            />
                        </View>
                        <View style={styles.underline} />
                    </View>
                    :
                    <View>
                        <View style={styles.underline} />
                        <View style={styles.form}>
                            <Text style={styles.titleWithWidth}>Mật khẩu cũ</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={this._onPasswordChange}
                                value={this.state.password}
                                placeholder={'Nhập mật khẩu cũ'}
                                onSubmitEditing={this._onSubmitEditing}
                                editable={!isLoading}
                                secureTextEntry
                            />
                        </View>
                        <View style={styles.underline} />
                        <View style={styles.form}>
                            <Text style={styles.titleWithWidth}>Mật khẩu mới</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={this._onNewPasswordChange}
                                value={this.state.lastPassword}
                                placeholder={'Nhập mật khẩu mới'}
                                onSubmitEditing={this._onSubmitEditing}
                                editable={!isLoading}
                                secureTextEntry
                            />
                        </View>
                        <View style={styles.underline} />
                        <View style={styles.form}>
                            <Text style={styles.titleWithWidth}>Xác nhận lại</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={this._onConfirmPasswordChange}
                                value={this.state.confirmPassword}
                                placeholder={'Nhập lại mật khẩu mới'}
                                onSubmitEditing={this._onSubmitEditing}
                                editable={!isLoading}
                                secureTextEntry
                            />
                        </View>
                        <View style={styles.underline} />
                    </View>
                }
                <Text style={styles.createAccount} onPress={this.onCreateAccountPress}>
                    {isLoginScreen ?
                        'Chưa có hoặc quên tài khoản ?'
                        :
                        'Quên mật khẩu ?'
                    }
                </Text>
                <TouchableOpacity
                    onPress={this._onSubmitEditing}
                    style={styles.button(!isLoading)}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonTitle}>
                        {isLoginScreen ? 'Đăng nhập' : 'Đổi mật khẩu'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR.white,
    },
    title: {
        fontFamily: FONT.FontFamily,
        marginTop: '10%',
        textAlign: POSITION.center,
        color: COLOR.black,
        fontSize: 30,
    },
    description: {
        fontFamily: FONT.FontFamily,
        textAlign: POSITION.center,
        color: COLOR.black,
        fontSize: 15,
        margin: 20,
    },
    form: {
        flexDirection: POSITION.row,
        alignItems: POSITION.center,
        marginLeft: 16,
        paddingVertical: 3,
    },
    formTitle: {
        fontFamily: FONT.FontFamily,
        fontSize: 16,
        color: COLOR.black,
        marginRight: 20,
        fontWeight: FONT.Bold,
    },
    titleWithWidth: {
        fontFamily: FONT.FontFamily,
        fontSize: 16,
        color: COLOR.black,
        fontWeight: FONT.Bold,
        width: 120,
    },
    input: {
        height: 40,
        fontFamily: FONT.FontFamily,
        fontSize: 16,
        padding: 0,
        color: COLOR.black,
        flex: 1,
    },
    createAccount: {
        fontFamily: FONT.FontFamily,
        fontSize: 15,
        color: COLOR.blue,
        textAlign: POSITION.center,
        marginTop: 20,
    },
    button: (active) => ({
        alignSelf: POSITION.center,
        marginVertical: 20,
        alignItems: POSITION.center,
        justifyContent: POSITION.center,
        paddingHorizontal: 16,
        height: 40,
        backgroundColor: active ? COLOR.blue : COLOR.gray,
        borderRadius: 5,
        flexDirection: POSITION.row,
    }),
    buttonTitle: {
        fontFamily: FONT.FontFamily,
        color: COLOR.white,
        fontSize: 15,
    },
    underline: {
        height: 1,
        backgroundColor: COLOR.border,
        marginHorizontal: 16,
    },
});

export default Login;
