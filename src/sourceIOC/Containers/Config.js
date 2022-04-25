import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import { Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Type from '../Redux/Type';
import Utils from '../../../app/Utils';
import { store } from '../../../srcRedux/store';

// const linkAPI = 'http://10.73.60.210:8081/api/v1/';

const linkAPI = 'http://apiioc.vienthongtayninh.vn/api/v1/'

export const AppID = 'eyJ1ciI6ImhvbmdodW5nX21vYmlsZSIsInB3IjoiSG9uZ2h1bmdNb2JpbGVAMjAyMCJ9'

const URL = {
    token: '_token',
    login: phone => `${linkAPI}Authentication/Login?phonenumber=${phone}`,
    confirmPassCode: (phone, otp) => `${linkAPI}Authentication/ConfirmOTP?phonenumber=${phone}&otp=${otp}`,
    getTongSoLieu: `${linkAPI}DichVuCong/TongSoLieu`,
    getBieuDo: `${linkAPI}DichVuCong/BieuDo`,
    getDonVi: opt => `${linkAPI}DichVuCong/GetDonVi?opt=${opt}`
}

export default URL;

export const isObject = obj => obj && obj.constructor && obj.constructor === Object;

export function onPostRequest(url, onSuccess, payload) {
    let response = '';
    if (payload) {
        let payloadLoading = store.getState()['payloadLoading']
        if (!!payloadLoading)
            payload = {
                ...payload,
                ...payloadLoading
            }
        else
            payload = {
                ...payload,
                appid: AppID
            }
    }
}

export const onAxiosPost = async (url, onSuccess, payload, isGet) => {

    let token = await AsyncStorage.getItem(Type.USER.TOKEN);
    let config = {
        method: isGet ? 'get' : 'post',
        url: encodeURI(url),
        headers: {
            'Content-Type': 'application/json',
            'Auth': token,
        },
        data: payload ? JSON.stringify(payload) : null
    },
        statusCode = '',
        response = '';

    await Axios(config)
        .then(res => {
            statusCode = res.status
            response = res.data
            Utils.nlog('RES API AXIOS :', res)
        })
        .catch(error => {
            if (error.response) {
                response = error.response.data;
                statusCode = error.response.status;
            } else if (error.request) {
                statusCode = 'Error';
                response = response.request
            } else {
                statusCode = 'Bad';
                response = response.message
            }
        });
    if (statusCode === 401) {
        await AsyncStorage.multiRemove([Type.USER.USER_INFO, Type.USER.TOKEN])
        store.dispatch({ type: Type.USER.SIGN_IN_STATE, value: false });
        Alert.alert(
            'Thông báo',
            'Phiên làm việc của bạn đã hết, xin vui lòng đăng nhập lại',
            [
                { text: 'Đồng ý', onPress: () => { }, style: 'cancel' }
            ],
            { cancelable: false },
        );
    }
    else
        onSuccess({ statusCode, response })
}

const responseStatus = [-1, 0, 1]

export function checkResponse(statusCode, response) {

    if (statusCode === 200) {
        if (isObject(response)) {
            if (response.Code === "000") {
                response = response.Data;
                if (!Array.isArray(response)) {
                    if (responseStatus.indexOf(response) !== -1) {
                        if (response === -1) {
                            statusCode = 202;
                            response = 'Lỗi trong quá trình xử lý';
                        }
                    }
                    else if (response !== 'Success') {
                        statusCode = 202;
                        response = 'Lỗi dữ liệu.';
                    }

                }
                else if (!response.length)
                    statusCode = 201;
            }
            else
                statusCode = response.Code
        }
        else
            statusCode = 'response error';
    }

    return {
        statusCode,
        data: response
    }
}

export const formatNumber = (stringNumber) => {
    return stringNumber.toString().replace(/(.)(?=(\d{3})+$)/g, '$1,')
}
