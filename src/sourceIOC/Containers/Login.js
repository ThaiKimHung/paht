import URL, { onAxiosPost } from './Config';
import Axios from 'axios';

import Type from '../Redux/Type';
import AsyncStorage from '@react-native-community/async-storage';
import Utils from '../../../app/Utils';
import { store } from '../../../srcRedux/store';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export function onSignIn(phoneNumber, onSuccess) {
    onAxiosPost(URL.login(phoneNumber), onSuccess, null, true).catch()
}

export async function onConfirmPassCode(phoneNumber, passCode, onSuccess) {
    let config = {
        method: 'post',
        url: encodeURI(URL.confirmPassCode(phoneNumber, passCode)),
        headers: {
            'Content-Type': 'application/json',
        }
    },
        statusCode = '',
        token = '',
        userInfo = '';

    await Axios(config)
        .then(res => {
            token = res.headers.auth;
            userInfo = res.data;
            statusCode = res.status;
            Utils.nlog('res API xac nhan code: ', res)
        })
        .catch(error => {
            if (error.response) {
                statusCode = error.response.status;
            } else if (error.request) {
                statusCode = 'Error';
            } else {
                statusCode = 'Bad';
            }
        });
    if (statusCode === 200) {
        store.dispatch({ type: Type.USER.TOKEN, value: token });
        store.dispatch({ type: Type.USER.USER_INFO, value: userInfo });
        await AsyncStorage.setItem(Type.USER.TOKEN, token);
        await AsyncStorage.setItem(Type.USER.USER_INFO, JSON.stringify(userInfo));
        store.dispatch({ type: Type.USER.SIGN_IN_STATE, value: true });
    }
    onSuccess({ statusCode });
}
