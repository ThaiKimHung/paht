import CryptoJS from 'crypto-js';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';
import Type from '../Redux/Type';
import { onShowOffPanel } from './PanelInfo';
import { store } from '../../../srcRedux/store';

const apiLink = 'http://ilis.tayninh.gov.vn/apiv3/api/';
// const apiLink = 'http://10.73.60.210:8080/api/';
const secretKey = '123456qwertyasdfghzxcvbn!@#$%^';

const URL = {
    signAuth: `${apiLink}Users/AuthSignIn`,
    login: `${apiLink}Users/SignIn`,
    changePassWord: `${apiLink}Users/ChangePassword`,
    // getPolygonByDistance: `${apiLink}BanDo/GetPolygonByCoord`,
    getPolygonByDistance: `${apiLink}BanDo/GetPolygonByDistance`,
    getPolygonByToThua: `${apiLink}BanDo/GetPolygonByThuaDat`,
    getTreeDVHC: (maTinh, capDo) =>
        `${apiLink}HanhChinh/GetDVHC?maTinh=${maTinh}&CapDo=${capDo}`,
    searchByToThua: `${apiLink}HienTrang/SearchThuaDatByToThua`,
    searchByName: `${apiLink}HienTrang/SearchThuaDatByTenChu`,
    getPolygonQuyHoach: `${apiLink}QuyHoach/GetPolygonQuyHoachMobile`,
    getZonePolygonByDistance: `${apiLink}QuyHoach/getZonePolygonByDistance`,
    getQuyHoachByDocument: `${apiLink}QuyHoach/GetThongTinQuyHoach`,
    getQuyHoachLayer: `${apiLink}ilis/wsilis_getDSPolygonQHTheoKhoangCach`,
    checkPermissionAddNote: `${apiLink}ghichu/checkPermissionAddNote`,
    uploadHinhAnh: (thuadat) =>
        `${apiLink}ghichu/uploadHinhAnh?soto=${thuadat.soto}&sothua=${thuadat.sothua}&madvhc=${thuadat.madvhc}`,
    loadListNoteByThuaDat: `${apiLink}ghichu/getListGhiChuByThuaDat`,
    loadListNoteByAccount: `${apiLink}ghichu/getListGhiChuByAccount`,
    createGhiChu: `${apiLink}ghichu/createGhiChu`,
    xoaGhiChu: `${apiLink}ghichu/xoaGhiChu`,
    root: apiLink,
    token: '@DataUserILIS',
};

export default URL;

export const isObject = (obj) =>
    obj && obj.constructor && obj.constructor === Object;

export function onPostRequest(url, onSuccess, payload) {
    let dataResponse = {
        statusCode: null,
        response: null,
    },
        rawDataHeader = payload,
        token = store.getState().token,
        dataHeader = '';
    if (isObject(payload)) {
        let rawToken = token;
        if (token) {
            token = decodeResponse(token);
            token = JSON.parse(token);
        }
        payload = {
            Username: token.Username || '',
            Token: rawToken || '',
            ...payload,
        };
    }

    dataHeader = encodeResponse(payload);
    Axios.post(encodeURI(url), null, {
        headers: {
            'Content-Type': 'application/json',
            Data: dataHeader,
        },
    })
        .then((res) => {
            dataResponse.statusCode = res.status;
            dataResponse.response = res.data;
            onSuccess(dataResponse);
        })
        .catch((error) => {
            let callBack = () => onPostRequest(url, onSuccess, rawDataHeader);
            handlerError(error, onSuccess, callBack);
        });
}

export function onUploadRequest(url, onSuccess, payload) {
}

export function formatFLetter(inputString) {
    if (inputString) {
        inputString = inputString.split(' ');
        inputString = inputString.map((e) => capitalizeFLetter(e));
        inputString = inputString.filter((e) => !!e);
        return inputString.join(' ');
    }
    return '';
}

function capitalizeFLetter(inputStr) {
    if (inputStr) {
        inputStr = inputStr.toLowerCase();
        return inputStr.charAt(0).toUpperCase() + inputStr.slice(1);
    }
    return '';
}

export const encodeResponse = (body) => {
    body = JSON.stringify(body);
    let key = CryptoJS.enc.Utf8.parse(secretKey);
    key = CryptoJS.MD5(key);
    key.words.push(key.words[0], key.words[1]);
    let options = { mode: CryptoJS.mode.ECB },
        textWordArray = CryptoJS.enc.Utf8.parse(body),
        encrypted = CryptoJS.TripleDES.encrypt(textWordArray, key, options);
    return encrypted.toString();
};

export const decodeResponse = (encryptedText) => {
    let key = CryptoJS.enc.Utf8.parse(secretKey);
    key = CryptoJS.MD5(key);
    key.words.push(key.words[0], key.words[1]);
    let options = { mode: CryptoJS.mode.ECB },
        decrypted = CryptoJS.TripleDES.decrypt(
            // @ts-ignore
            {
                ciphertext: CryptoJS.enc.Base64.parse(encryptedText),
            },
            key,
            options,
        );
    return decrypted.toString(CryptoJS.enc.Utf8);
};

const handlerError = (error, onSuccess, callBack) => {
    let payload = {
        statusCode: 'Error',
        response: '',
    };
    if (error.response) {
        payload.response = error.response.data;
        payload.statusCode = error.response.status;
        if (error.response.status === 401) {
            onRefreshAuthToken(callBack).catch();
        }
    } else if (error.request) {
        payload.response = error.request;
        onSuccess(payload);
    } else {
        // Something happened in setting up the request that triggered an Error
        payload.response = error.message;
        onSuccess(payload);
    }
};

const onRefreshToken = (onSuccess) => {
    let token = store.getState().token;

    if (token) {
        token = decodeResponse(token);
        token = JSON.parse(token);
        let payload = {
            Username: token.Username,
            Password: token.Password,
        },
            strPayload = encodeResponse(payload);
        Axios.post(encodeURI(URL.login), null, {
            headers: {
                'Content-Type': 'application/json',
                Data: strPayload,
            },
        })
            .then((res) => {
                if (res.status === 200 && !!res.data) {
                    AsyncStorage.setItem(URL.token, res.data).then(() => {
                        store.dispatch({ type: 'SET_TOKEN', token: res.data });
                        onSuccess();
                    });
                }
            })
            .catch((error) => {
                onAuthExpire()
                if (error.response) {
                    console.log('response', error.response);
                } else if (error.request) {
                    console.log('req', error.request);
                } else {
                    console.log('Message', error.message);
                }
            });
    } else {
        onAuthExpire();
    }
};

export type Payload = {
    PhoneNumber: ?string,
    PersonId: ?string
}

const onRefreshAuthToken = async (onSuccess) => {
    try {
        let token = await AsyncStorage.getItem(URL.token);
        if (!token) return;
        token = decodeResponse(token);
        token = JSON.parse(token);

        let encodeHeader: Payload = {
            PhoneNumber: token.PhoneNumber,
            PersonId: token.Password
        }

        await Axios.post(encodeURI(URL.signAuth), null, {
            headers: {
                'Content-Type': 'application/json',
                Data: encodeResponse(encodeHeader)
            },
        })
            .then((res) => {
                AsyncStorage.setItem(URL.token, res.data)
                    .then(() => {
                        let userInfo = decodeResponse(res.data);
                        userInfo = JSON.parse(userInfo);
                        store.dispatch({ type: 'SET_USER_INFO', userInfo });
                        store.dispatch({ type: 'SET_TOKEN', token: res.data });
                        onSuccess();
                    })
            })
            .catch((error) => {
                console.log(error);
            });

    }
    catch (e) {
        console.log(e);
    }
}

const onAuthExpire = () => {
    Alert.alert(
        'Thông báo',
        'Phiên đăng nhập của bạn đã hết, vui lòng đăng nhập lại.',
        [
            {
                text: 'Đồng ý', onPress: onSignOut, style: 'cancel',
            },
        ],
        { cancelable: false },
    );
};

const onSignOut = () => {
    AsyncStorage.setItem(URL.token, '')
        .then(() => {
            store.dispatch({ type: Type.SET_USER_INFO, userInfo: '' });
            store.dispatch({ type: Type.SET_TOKEN, token: '' });
            onShowOffPanel();
        });
}

export const mapGeoType = {
    'LINESTRING': 'LINESTRING',
    'MULTILINESTRING': 'MULTILINESTRING',
    'POLYGON': 'POLYGON',
    "MULTIPOLYGON": 'MULTIPOLYGON',
    'POINT': 'POINT'
}
