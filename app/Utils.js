import React, { Component } from 'react';
import { Alert, Linking, Platform, Image, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import isUrl from 'is-url'
import { appConfig } from './Config';
import { AppgetGlobal, AppgetRootGlobal, AppsetGlobal, ROOTGlobal } from './data/dataGlobal';
import Moment from 'moment';
import { RootLang } from './data/locales';
import * as actions from '../srcRedux/actions';
import { connect } from 'react-redux';
import { getObjDateFormat } from './data/dateLocales';
import ImageEditor from "@react-native-community/image-editor";
import RNFS from 'react-native-fs';
import { nGlobalKeys } from './keys/globalKey';
import Share from 'react-native-share';
import { nkey } from './keys/keyStore';
import { NavigationActions, StackActions } from 'react-navigation';
import path from 'path';
import videoExtensions from 'video-extensions';
import imageExtensions from 'image-extensions'
import AppCodeConfig from './AppCodeConfig';
import { store } from '../srcRedux/store';
import RNFetchBlob from 'rn-fetch-blob';
import { showMessage } from 'react-native-flash-message';
import { sizes } from '../styles/size';
import RNOtpVerify from 'react-native-otp-verify';
import CryptoJS from 'crypto-js'
import moment from 'moment';
import Geolocation from 'react-native-geolocation-service';

if (Platform.OS === 'android') { // only android needs polyfill
    require('intl'); // import intl object
    require('intl/locale-data/jsonp/en-US'); // load the required locale details
    require('intl/locale-data/jsonp/vi-VN'); // load the required locale details
}
// const shareOptions = {
//     title: 'Share via',
//     message: 'some message',
//     url: 'some share url',
//     social: Share.Social.WHATSAPP,
//     whatsAppNumber: "9199999999"  // country code + phone number(currently only works on Android)
//     filename: 'test' , // only for base64 file in Android 
// };
// Share.shareSingle(shareOptions);
// --call API
// -1 Lỗi không lấy dữ liệu, -2 lỗi không lấy được token, -3 lỗi API
async function post_api(strUrl, strBody = '', showMsg = false, chktoken = false, chkSession = false, app = AppCodeConfig.APP_CONGDAN, type = '0', objKeyMore = {}) {
    var smethod = 'POST';
    if (strBody == '')
        smethod = 'GET'
    let token = ''
    if (app == AppCodeConfig.APP_CHAT) {
        token = await store.getState().auth.tokenCHAT;
    } else {
        token = await ngetStore(nkey.loginToken, '', app);
    }


    // let token = await ngetStore(nkey.loginToken, '') Token Công dân mang qua chưa xử lý
    if ((token == null || token.length < 3) && chktoken) {
        if (showMsg)
            Alert.alert('Bảo mật', 'Không tồn tại token người dùng');
        return -2;
    }
    nlog("XXXX-LinkAPI: ", strUrl, "Token: ", token || 'k ton tai', "TYPE-APP", app, objKeyMore);

    try {
        // nlog("[dodmain]", appConfig.domain + strUrl, strBody, token)
        const response = await fetch(appConfig.domain + strUrl,
            {
                method: smethod,
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'Content-Type': 'application/json',
                    'token': token,
                    'InternalAPI': appConfig.InternalAPI,
                    "Type": type,
                    ...objKeyMore
                },
                body: strBody
            });

        const res = await response.json();

        if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
            nlog('[API]Lỗi API:', res);
            return -3;
        }
        try {
            if (chkSession == true) {
                // nlog("Đây vào check 000000000000000000-------------------0000000000000000000000000", strUrl);
                // if (res.error.code.toString() == '7') {
                //     if (ROOTGlobal[nGlobalKeys.isShowAlertDH]) {
                //         ROOTGlobal[nGlobalKeys.isShowAlertDH] = false;
                //         Alert.alert('Cảnh báo', res.error.message);
                //         ROOTGlobal[nGlobalKeys.LogOutDH].DangXuat(true);
                //     }
                // }
            }

        } catch (error) {

        }
        return res;
    }
    catch (error) {
        nlog('[API]Lỗi error:', error);
        if (showMsg)
            Alert.alert('Lỗi mạng', 'Kết nối server thất bại');
        return -1;
    }
}

async function post_api_formdata(strUrl, strBody = '', showMsg = false, chktoken = false, app = AppCodeConfig.APP_CONGDAN) {
    var smethod = 'POST';
    if (strBody == '')
        smethod = 'GET'
    let token = ''
    if (app == AppCodeConfig.APP_CHAT) {
        token = await store.getState().auth.tokenCHAT;
    } else {
        token = await ngetStore(nkey.loginToken, '', app);
    }

    nlog("[LOG] -LINK API: ", strUrl, "Token: ", token || 'K CO TOKEN', "TYPE-APP", app);
    if ((token == null || token.length < 3) && chktoken) {
        if (showMsg)
            Alert.alert('Bảo mật', 'Không tồn tại token người dùng');
        return -2;
    }
    try {
        const response = await fetch(appConfig.domain + strUrl,
            {
                method: smethod,
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'token': token,
                },
                body: strBody
            });

        const res = await response.json();
        if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
            nlog('[API]Lỗi API:', res);
            return -3;
        }
        return res;
    }
    catch (error) {
        nlog('[API]Lỗi error:', error);
        if (showMsg)
            Alert.alert('Lỗi mạng', 'Kết nối server thất bại');
        return -1;
    }
}


async function post_api_AI(domain, strUrl, strBody = '', showMsg = false, tokenExten = '') {
    let isConected = getGlobal(nGlobalKeys.isConnected, true);
    if (isConected == false) {
        return {
            status: 0,
            error: {
                message: 'Vui lòng kiểm tra kết nối internet'
            }
        }
    } else {
        var smethod = 'POST';
        if (strBody == '')
            smethod = 'GET'
        let token = tokenExten == '' ? getGlobal(nGlobalKeys.loginToken, '') : tokenExten;
        nlog("XXXX-LinkAPI: ", strUrl, "Token: ", token || 'k ton tai', "TYPE-APP", '---');
        try {
            const response = await fetch(domain + strUrl,
                {
                    method: smethod,
                    headers: {
                        // 'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'token': token,
                    },
                    body: strBody
                });
            const res = await response.json();
            if (res.status == 5) {
                clearInterval()
                navigate("Modal_KTDangNhap");
                return { status: 1 };
            }
            if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
                nlog('[API]Lỗi API:', res);
                return -3;
            }
            const result = handleResponse(res);
            return result;
        }
        catch (error) {
            nlog('[API]Lỗi error:', error);
            if (showMsg)
                Alert.alert('Lỗi mạng', 'Kết nối server thất bại');
            return -1;
        }
    }
}

async function post_api_domain(_domain, authen, strUrl, strBody = '', showMsg = false, chktoken = false, chkSession = false, app = AppCodeConfig.APP_CONGDAN, type = '0') {
    var smethod = 'POST';
    if (strBody == '')
        smethod = 'GET'
    let token = ''
    if (app == AppCodeConfig.APP_CHAT) {
        token = await store.getState().auth.tokenCHAT;
    } else {
        token = await ngetStore(nkey.loginToken, '', app);
    }

    nlog("XXXX-LinkAPI: ", strUrl, "Token: ", token || 'k ton tai', "TYPE-APP", app);
    nlog("RESSSS:", authen)
    // let token = await ngetStore(nkey.loginToken, '') Token Công dân mang qua chưa xử lý
    if ((token == null || token.length < 3) && chktoken) {
        if (showMsg)
            Alert.alert('Bảo mật', 'Không tồn tại token người dùng');
        return -2;
    }
    try {
        nlog("domain-----", _domain, strUrl, authen)
        const response = await fetch(_domain + strUrl,
            {
                method: smethod,
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'Content-Type': 'application/json',
                    'token': token,
                    'InternalAPI': appConfig.InternalAPI,
                    "Type": type,
                    "Authorization": authen
                },
                body: strBody
            });
        const res = await response.json();
        if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
            nlog('[API]Lỗi API:', res);
            return -3;
        }
        try {
            if (chkSession == true) {
                // nlog("Đây vào check 000000000000000000-------------------0000000000000000000000000", strUrl);
                // if (res.error.code.toString() == '7') {
                //     if (ROOTGlobal[nGlobalKeys.isShowAlertDH]) {
                //         ROOTGlobal[nGlobalKeys.isShowAlertDH] = false;
                //         Alert.alert('Cảnh báo', res.error.message);
                //         ROOTGlobal[nGlobalKeys.LogOutDH].DangXuat(true);
                //     }
                // }
            }

        } catch (error) {

        }
        return res;
    }
    catch (error) {
        nlog('[API]Lỗi error:', error);
        if (showMsg)
            Alert.alert('Lỗi mạng', 'Kết nối server thất bại');
        return -1;
    }
}

//----post copy default
async function post_api_default(strUrl, strBody = '', showMsg = false, chktoken = false, token = 'rpNuGJebgtBEp0eQL1xKnqQG') {
    var smethod = 'POST';
    if (strBody == '')
        smethod = 'GET'
    // let token = await ngetStore(nkey.loginToken, '') //ROOTGlobal.loginToken;
    if ((token == null || token.length < 3) && chktoken) {
        if (showMsg)
            Alert.alert('Bảo mật', 'Không tồn tại token người dùng');
        return -2;
    }
    nlog("XXXX-LinkAPI: ", strUrl, "Token: ", token || 'k ton tai', "TYPE-APP", '---');
    try {
        const response = await fetch(appConfig.domain + strUrl,
            {
                method: smethod,
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'Content-Type': 'application/json',
                    'token': token,
                    //'InternalAPI': appConfig.InternalAPI
                },
                body: strBody
            });
        const res = await response.json();
        if (res.ExceptionMessage != undefined || (res.Message != undefined && res.status == undefined)) { // edit tuỳ từng object api
            nlog('[API]Lỗi API:', res);
            return -3;
        }
        return res;
    }
    catch (error) {
        nlog('[API]Lỗi error:', error);
        if (showMsg)
            Alert.alert('Lỗi mạng', 'Kết nối server thất bại');
        return -1;
    }
}
//copy ra

async function post_api_headers(strUrl, strBody = '', showMsg = false, chktoken = false, chkSession = false, app = AppCodeConfig.APP_CONGDAN, isAdmin) {
    var smethod = 'POST';
    if (strBody == '')
        smethod = 'GET'
    let token = await ngetStore(nkey.loginToken, '', app);
    nlog("giá trị token la", token)
    // let token = await ngetStore(nkey.loginToken, '') Token Công dân mang qua chưa xử lý
    if ((token == null || token.length < 3) && chktoken) {
        if (showMsg)
            Alert.alert('Bảo mật', 'Không tồn tại token người dùng');
        return -2;
    }
    nlog("XXXX-LinkAPI: ", strUrl, "Token: ", token || 'k ton tai', "TYPE-APP", app);
    try {
        const response = await fetch(appConfig.domain + strUrl,
            {
                method: smethod,
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'Content-Type': 'application/json',
                    'token': token,
                    'IsAdmin': isAdmin,
                    'InternalAPI': appConfig.InternalAPI

                },
                body: strBody
            });
        const res = await response.json();
        if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
            nlog('[API]Lỗi API:', res);
            return -3;
        }
        try {
            if (chkSession == true) {
                // nlog("Đây vào check 000000000000000000-------------------0000000000000000000000000", strUrl);
                if (res.error.code.toString() == '7') {
                    if (ROOTGlobal[nGlobalKeys.isShowAlertDH]) {
                        ROOTGlobal[nGlobalKeys.isShowAlertDH] = false;
                        Alert.alert('Cảnh báo', res.error.message);
                        ROOTGlobal[nGlobalKeys.LogOutDH].DangXuat(true);
                    }
                }
            }

        } catch (error) {

        }
        return res;
    }
    catch (error) {
        nlog('[API]Lỗi error:', error);
        if (showMsg)
            Alert.alert('Lỗi mạng', 'Kết nối server thất bại');
        return -1;
    }
}
function connectRedux(Component, StateToProps = null, isActions = false) {
    return connect(StateToProps, isActions ? actions : null, null, { forwardRef: true })(Component);
}

async function post_apiBear(strUrl, strBody = '', showMsg = false, chktoken = true) {
    var smethod = 'POST';
    if (strBody == '')
        smethod = 'GET'
    let token = ROOTGlobal[nGlobalKeys.loginToken];
    // let token = ROOTGlobal.loginToken; Token công dân
    token = 'Bearer ' + token;
    nlog("XXXX-LinkAPI: ", strUrl, "Token: ", token || 'k ton tai', "TYPE-APP", '---');
    if ((token == null || token.length < 3) && chktoken) {
        if (showMsg)
            Alert.alert('Bảo mật', 'Không tồn tại token người dùng');
        return -2;
    }
    try {
        const response = await fetch(appConfig.domain + strUrl,
            {
                method: smethod,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: strBody
            });

        const res = await response.json();
        if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
            nlog('[API]Lỗi API:', res);
            return -3;
        }
        return res;
    }
    catch (error) {
        nlog('[API]Lỗi error:', error);
        if (showMsg)
            Alert.alert('Lỗi mạng', 'Kết nối server thất bại');
        return -1;
    }
}

async function get_apiBearer(strUrl, showMsg = true, chktoken = true) {
    const res = await post_apiBear(strUrl, '', showMsg, chktoken);
    return res;
}

// -1 Lỗi không lấy dữ liệu, -2 lỗi không lấy được token, -3 lỗi API
async function get_api(strUrl, showMsg = true, chktoken = false, chkSession = false, app = AppCodeConfig.APP_CONGDAN, type = '0', objKeyMore = {}) {
    const res = await post_api(strUrl, '', showMsg, chktoken, chkSession, app, type, objKeyMore);
    return res;
}

async function get_api_domain(domain, authen, strUrl, showMsg = true, chktoken = false, chkSession = false, app = AppCodeConfig.APP_CONGDAN, type = '0') {
    const res = await post_api_domain(domain, authen, strUrl, '', showMsg, chktoken, chkSession, app, type);
    return res;
}

//copy để get khi có token mặc định
async function get_api_default(strUrl, showMsg = true, chktoken = false) {
    const res = await post_api_default(strUrl, '', showMsg, chktoken);
    return res;
}

//
async function get_api_headers(strUrl, showMsg = true, chktoken = false, chkSession = false, app = AppCodeConfig.APP_CONGDAN, isAdmin) {
    const res = await post_api_headers(strUrl, '', showMsg, chktoken, chkSession, app, isAdmin);
    return res;
}

// -- custom AynsStore
function ngetParam(nthis, keys, defaultValue) {
    let param = nthis.props.navigation.getParam(keys, defaultValue);
    return param;
}

// --


//--Thông số cấu hình mặc

function nlog(...val) {
    if (__DEV__)
        console.log(...val);
}

function nlogError(...val) {
    if (__DEV__)
        console.error(...val);
}

// -- custom AynsStore
async function ngetStore(keys, defaultValue = null, app = AppCodeConfig.APP_CONGDAN) {
    let temp = await AsyncStorage.getItem(app == '' ? keys : `@${app}@${keys}`);
    if (temp == null)
        return defaultValue;
    try {
        let tempValue = JSON.parse(temp);
        return tempValue;
    } catch (error) {
        return temp;
    }
}

async function ngetMultiStore(ArrStringKeys, defaultValue = null, app = AppCodeConfig.APP_CONGDAN) {
    for (let i = 0; i < ArrStringKeys.length; i++) {
        let itemKey = ArrStringKeys[i];
        itemKey = app == '' ? itemKey : `@${app}@${itemKey}`;
        ArrStringKeys[i] = itemKey;
    }
    let tempArr = await AsyncStorage.multiGet(ArrStringKeys);
    if (tempArr == null || tempArr == [])
        return defaultValue;
    let objResult = {}
    for (let y = 0; y < tempArr.length; y++) {
        const item = tempArr[y];
        try {
            objResult[item[0]] = JSON.parse(item[1]);
        } catch (error) {
            objResult[item[0]] = item[1];
        }
    }
    return objResult;
}

async function nsetStore(keys, value, app = AppCodeConfig.APP_CONGDAN) {
    if (typeof (value) !== 'string')
        value = JSON.stringify(value);
    await AsyncStorage.setItem(app == '' ? keys : `@${app}@${keys}`, value);
}
// --

// --navigation, [core] pass param on all of app
function goscreen(nthis, routeName, params = null) {
    try {
        if (params) {
            nthis.props.navigation.navigate(routeName,
                { ...params, lang: nthis.lang });
        } else {
            nthis.props.navigation.navigate(routeName,
                { lang: nthis.lang });
        };
    } catch (error) {
        _navigator.dispatch(
            NavigationActions.navigate({
                routeName,
                params
            }),
        );
    }
}

function goback(nthis, routeName = '') {
    try {
        if (routeName == '')
            nthis.props.navigation.goBack();
        else nthis.props.navigation.goBack(routeName);
    } catch (error) {
        _navigator.dispatch(NavigationActions.back());
    }
}

/**
 * @deprecated
 * @param {*} nthis 
 * @param {*} isClose 
 * @param {*} mode 
 */
function toggleDrawer(nthis, isClose = false, mode = 'toggleDrawer') {
    if (isClose)
        nthis.props.navigation.closeDrawer();
    else {
        nthis.props.navigation[mode]();
    }
}

// -- Alert native, custom call func
function msgAlert(title, message = '', btnTextOk = 'OK', onPress = () => { }) {
    setTimeout(() => {
        Alert.alert(title, message, [{ text: btnTextOk, onPress }]);
    }, 520);
}

function msgAlertYesNo(title, message = '', btnTextYes = 'Xác nhận', btnTextNo = 'Xem lại', funcYes = () => { nlog('is Yes') }, funcNo = function () { console.log('is No') }) {
    Alert.alert(
        title,
        message,
        [
            { text: btnTextNo, onPress: funcNo },
            { text: btnTextYes, onPress: funcYes, style: 'cancel' }
        ],
        { cancelable: false }
    )
}

// -- show Toast Custom
export const icon_typeToast = {
    success: 'success',
    danger: 'danger',
    warning: 'warning',
    info: 'info'
};
function showToastMsg(message, description = '', icon = 'info', duration = 3000, type = null) {
    // icon và type: "info" | "success" | "danger" | "warning"
    if (type == null)
        type = icon;
    showMessage({
        message: message,
        description: description,
        icon: icon,
        titleStyle: { color: 'white', fontWeight: 'bold', fontSize: sizes.sText16 },
        textStyle: { fontSize: sizes.sText14, paddingRight: 5 },
        duration: duration,
        type: type,
    });
}

// -- Alert custom 
function showMsgBoxOK(nthis, title, message = '', btnTextOk = 'OK', onPressOK = () => { }, goback = true) {
    goscreen(nthis, 'Modal_MsgBox', { title, message, buttons: [{ text: btnTextOk, onPress: onPressOK }], goback });
}

function showMsgBoxYesNo(nthis, title, message = '', btnTextOk = 'OK', btnTextCancel = 'Cancel', onPressOK = () => { }, onPressCancel = () => { }, goback = true) {
    goscreen(nthis, 'Modal_MsgBox', { title, message, buttons: [{ text: btnTextOk, onPress: onPressOK }, { text: btnTextCancel, onPress: onPressCancel }], goback });
}

function showMsgBoxOKCus(nthis, title, message = '', btnTextOk = 'OK', onPressOK = () => { }) {
    goscreen(nthis, 'Modal_MsgBoxCus', { title, message, buttons: [{ text: btnTextOk, onPress: onPressOK }] });
}


// -- get domain from a link. ex: abc.com/home/abc -> abc.com
function getDomain(url) {
    if (url == undefined || url == null)
        url = '';
    len = 0;
    count = 0;
    for (let index = 0; index < url.length; index++) {
        const element = url[index];
        if (element == '/')
            count++;
        if (count == 3)
            break;
        len++;
    }
    return url.substr(0, len);
}

// -- check the link is a uri
function isUrlCus(val) {
    if (isUrl(val))
        return val;
    urls = ['google.com',
        'facebook.com',
        'youtube.com',
        'zing.vn',
        'vnexpress.net',
        '24h.com.vn',
        'dkn.tv',
        'amazon.com',
        'webtretho.com',
        'wikipedia.org']
    for (let i = 0; i < urls.length; i++) {
        if (val.toLowerCase().indexOf(urls[i]) == 0) {
            return 'http://' + urls[i];
        }
    }
    return '';
}

// -- open uri on Website in App
function openWeb(nthis, link, params = {}) {
    let optionDef = { //option default
        title: '',
        isEditUrl: false, // Tạm thời biến này ko Dùng
        isHtml: false,
        isShowUrl: false //title = false && isShowUrl true = Show link va icon Security
    };
    let { isLinking = false, isShowMenuWeb = true } = params; // isShowMenuWeb mặc định hiện menu web
    nlog("openWeb: ", link, params)
    if (!link) {
        return;
    }
    //--Open AppStore && CHPlay
    if (Platform.OS == 'ios' && link.includes('https://apps.apple.com/') && link.includes('/app/')
        || Platform.OS != 'ios' && link.includes('https://play.google.com/store/apps/details?id=')) {
        openUrl(link);
        return;
    }
    //--Open DeepLink
    if (link.includes('://') && !link.includes('http') || isLinking) {
        Linking.openURL(link);
        return;
    }
    goscreen(nthis, 'Modal_BrowserInApp', { goback: goback, link, ...optionDef, ...params });
}

// --format
function formatMoney(value) {
    var stemp = '';
    if (value == undefined)
        value = '';
    var svalue = value.toString();
    let icount = 0;
    for (var i = svalue.length - 1; i >= 0; i--) {
        stemp = svalue[i] + stemp;
        icount++;
        if (icount == 3 && i > 0) {
            icount = 0;
            stemp = ',' + stemp;
        }
    }
    return stemp;
}

function formatMoney1(number) {
    let objCurrency = null;
    switch (nGlobalKeys.currency) {
        case 'VND':
            objCurrency = { locales: 'vi-VN', currency: nGlobalKeys.currency };
            break;
        case 'USD':
            objCurrency = { locales: 'en-US', currency: nGlobalKeys.currency };
            break;
        default:
            break;
    };
    const money = new Intl.NumberFormat(objCurrency.locales, { style: 'currency', currency: objCurrency.currency }).format(number);
    return money;
}


function inputMoney(value, isNeg = false, dec = 9) {
    if (value == undefined)
        value = '0';
    let stemp = '';
    let svalue = value.toString();
    //check dấu âm
    let iam = "";
    if (isNeg && svalue.length > 0 && svalue[0] == '-') {
        iam = "-";
    }
    //xoá ký tự khác số trước khi format
    for (let i = 0; i < svalue.length; i++) { //xoá tất cả kí tự không phải là số hợp lệ
        let tchar = svalue[i];
        if (tchar != '.' && isNaN(parseInt(tchar)))
            while (true) {
                svalue = svalue.replace(tchar, "");
                if (!svalue.includes(tchar)) {
                    i = i - 1;
                    break;
                }
            };
    }
    //kiểm tra lấy thập phân
    let mval = svalue.split('.');
    let thapphan = '';
    if (mval.length >= 2) {
        svalue = mval[0].slice();
        thapphan = mval[1];
        if (dec != 0 && thapphan == '')
            thapphan = '.';
        else {
            thapphan = thapphan.substr(0, thapphan.length < dec ? thapphan.length : dec);
            thapphan = '.' + thapphan;
        }
    }
    //format chuỗi số
    if (!isNaN(parseFloat(svalue)))
        svalue = parseFloat(svalue).toString();
    let icount = 0;
    for (let i = svalue.length - 1; i >= 0; i--) {
        stemp = svalue[i] + stemp;
        icount++;
        if (icount == 3 && i > 0) {
            icount = 0;
            stemp = ',' + stemp;
        }
    }
    if (stemp == '')
        stemp = "0";
    else
        stemp = iam + stemp;
    return stemp + thapphan;
}

function formatNumber(value) {
    if (value == null || value == undefined || value == '' || isNaN(parseFloat(value)))
        value = '0';
    for (let i = 0; i < value.length; i++) {
        const inum = value[i];
        if (isNaN(parseFloat(inum)) && inum != ".") {
            value = value.replace(inum, "");
            i--;
        }
    }
    return parseFloat(value);
}

// -- Các hàm xử lý thao tác với biến gốc rootGlobal
// Hàm get giá trị theo keys - read only. Giá trị thay đổi không làm thay đổi giá trị root
function getGlobal(keys, defaultValue, app = AppCodeConfig.APP_CONGDAN) {
    return AppgetGlobal(`@${app}@${keys}`, defaultValue);
}
// Hàm get giá trị gốc theo keys - read write. Giá trị thay đổi làm thay đổi giá trị root
function getRootGlobal(keys, defaultValue, app = AppCodeConfig.APP_CONGDAN) {
    return AppgetRootGlobal(`@${app}@${keys}`, defaultValue);
}
// Hàm khởi tạo một biến gốc, cũng có thể dùng để thay đổi một gốc.
function setGlobal(keys, value, app = AppCodeConfig.APP_CONGDAN) {
    AppsetGlobal(`@${app}@${keys}`, value);
}
//--
//--
function validateMK(val) {
    let t = getGlobal(nGlobalKeys.regexPass);
    return new RegExp(t).test(val)
}
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,3}))$/;
    return re.test(email);
}

function validatePhone(phoneNumber) {
    phoneNumber = phoneNumber.toString();
    return phoneNumber.length > 5 && phoneNumber.length < 15;
}

let resTrue = (data = '', message = 'Xử lý thành công') => {
    return {
        ...data,
        status: 1,
        title: RootLang.lang.notification,
        message
    }
}

let resFalse = (res = null, message = 'Xử lý thất bại') => {
    try {
        if (res.data != undefined || res.error != undefined || res.status != undefined || res.message != undefined)
            return {
                data: null,
                status: 0,
                title: RootLang.lang.Warning,
                message,
                ...res
            }
        return {
            data: res,
            status: 0,
            title: RootLang.lang.Warning,
            message
        }
    } catch (error) {
        return {
            data: res,
            status: 0,
            title: RootLang.lang.Warning,
            message
        }
    }
}

let resEmpty = (message = 'Vui lòng nhập đủ dữ liệu!') => {
    return {
        data: null,
        status: -1,
        title: RootLang.lang.Warning,
        message
    }
}

function handleResponse(res, isTrue = false) {
    if (res < 0 || res.status == undefined && !isTrue)
        return resFalse(res);
    if (res.status >= 1 || isTrue) { //ok 
        return resTrue(res);
    }
    return resFalse(res);
}

function handleSelectedDate(date) {
    let str = date.toString().split(' ');
    let selectedDate = str[2] + ' ' + str[1] + ' ' + str[3];
    return selectedDate;
}

function formatPhoneCode(phoneCode) {
    let value = phoneCode;
    if (value[0] != '+') {
        value = '+' + value;
    }
    return value;
}

function formatDate(dates, format, isMomentPare = false) {
    dates = dates.toString();
    if (!isMomentPare)
        dates = new Date(dates);
    return Moment(dates).format(format);
}

function setMomentLocale(location = RootLang._keys) {
    // Moment.locale(location); // ko áp dụng được cho đa ngôn ngữ, đang lỗi. xem Doc lại
}

//*****
// Cách dùng như format bình thường, sẽ có thể tuỳ chỉnh Thứ và Tháng. * Xem chi tiết tại: getObjDateFormat
// Thứ có 2 fortmat: d và ddd.   -vd: 'ddd, DD M YYYY' -> Thứ 2, 20 Thg 2 2019
// Tháng có 2 fortmat: M và MMM. -vd: 'd, DD-MM-YYYY' -> T2, 20-02-2019
// Nếu muốn chữ thường hết thì nên dùng formatDateApp(...).toLowerCase();
// Còn lại sẽ lấy theo format Chuẩn.
// *Chú ý: theo 1 chuyển duy nhất, nếu giao diện để QUÁ khác những cái đang có thì bỏ quả.
//*****
function formatDateApp(dates, format, lang = RootLang._keys) {
    // dates = Moment(dates.toString());
    dates = new Date(dates);
    let objFormatDate = getObjDateFormat(lang); //**** get dữ liêu format DATE custom ****
    let arrFormat = [];
    let temp = '';
    for (let i = 0; i < format.length; i++) {
        const char = format[i];
        if (char.toLowerCase() == 'd' || char.toLowerCase() == 'm' || char.toLowerCase() == 'y') {
            temp += char;
            if (i != format.length - 1)
                continue;
        };
        if (temp != '') {
            arrFormat.push(temp);
            temp = ''
        };
    };
    //--xử lý trả về kết quả
    let result = format;
    for (let i = 0; i < arrFormat.length; i++) {
        const item = arrFormat[i];
        switch (item) {
            case 'd':
            case 'ddd':
                let tempD = dates.getDay();
                result = result.replace(item, objFormatDate[item][tempD]);
                break;
            case 'M':
            case 'MMM':
                let tempM = dates.getMonth();
                result = result.replace(item, objFormatDate[item][tempM]);
                break;
            default:
                result = result.replace(item, Moment(dates).format(item));
                break;
        };
    };
    return result;
}

// tính khoảng cách giữa 2 ngày
function datesDiff(date1, date2, isSecond = false, isFloat = false) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    //isFloat:trả về số lẻ or nguyên, mặc định trả về số nguyên 
    //isSecond:trả ngày or giây,  mặc dinh trả về số ngày days  
    let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    if (isSecond)
        oneDay = 1000;
    let diffDays = Math.round(Math.abs((date2.getTime() - date1.getTime()) / (oneDay)));
    if (isFloat)
        diffDays = Math.abs((date2.getTime() - date1.getTime()) / (oneDay));
    return diffDays;
};
// truyền vào second trả về mảng [day, hour, minute, second]
function sformat(s) {
    let fm = [
        Math.floor(s / 60 / 60 / 24), // DAYS
        Math.floor(s / 60 / 60) % 24, // HOURS
        Math.floor(s / 60) % 60, // MINUTES
        s % 60 // SECONDS
    ];
    return fm
}

/**
 * @description Mở link url 
 * @param {*} url 
 */
function openUrl(url) {
    try {
        if (!url)
            return;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                nlog('Can\'t handle url: ' + url);
            } else {
                Linking.openURL(url);
            }
        }).catch(err => nlogError(err));
    } catch (error) {
        error => nlogError(error);
    }
}

/**
 * @description Trả về queryStrings cho param phương thức get.
 * @param {*} param Là 1 object chứa các param của phương 
 */
function objToQueryString(param) {
    const keyValuePairs = [];
    for (const key in param) {
        keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(param[key]));
    }
    return keyValuePairs.join('&');
}
// function decodeHTML
var entities = {
    'amp': '&',
    'apos': '\'',
    'lt': '<',
    'gt': '>',
    'quot': '"',
    'nbsp': '\xa0'
};
var entityPattern = /&([a-z]+);/ig;

function decodeHTMLEntities(text) {
    // A single replace pass with a static RegExp is faster than a loop
    return text.replace(entityPattern, function (match, entity) {
        entity = entity.toLowerCase();
        if (entities.hasOwnProperty(entity)) {
            return entities[entity];
        }
        // return original string if there is no matching entity (no replace)
        return match;
    });
};

function timeCountFormat(second = 0, format = "@hh giờ @mm phút @ss giây") {
    //--Quy định format chuẩn: @hh @h @mm @m @ss @s
    let hesoH = 1, hesoM = 1;
    if (format.includes("@hh") || format.includes("@h")) {
        hesoH = 60;
        hesoM = 60;
    }
    if (format.includes("@mm") || format.includes("@m"))
        hesoM = 60;
    let h = Math.floor(second / hesoM / hesoH);
    let m = Math.floor(second / hesoM);
    let s = second;
    if (hesoM != 1) {
        s = s % hesoM;
    }
    if (hesoH != 1) {
        m = m % hesoH;
        s = s % hesoH
    }
    format = format.replace("@hh", h < 10 ? `0${h}` : h);
    format = format.replace("@mm", m < 10 ? `0${m}` : m);
    format = format.replace("@ss", s < 10 ? `0${s}` : s);
    //---
    format = format.replace("@h", h);
    format = format.replace("@m", m);
    format = format.replace("@s", s);
    return format;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function isNullOrUndefined(value) {
    return !(!!value);
}

function isNullOrEmpty(value) {
    return !(!!value) || value == '';
}

function cloneData(data) {
    let _data = JSON.parse(JSON.stringify(data));
    return _data;
}

async function parseBase64(uri, height = 0, width = 0, downSize = 0.3, isVideo = false, isFile = false) {
    try {
        nlog("gia tri uri basse64", uri)
        let uriReturn = uri;
        if (!isVideo && height != 0 && width != 0) {
            nlog("vao image")
            uriReturn = await ImageEditor.cropImage(
                uri,
                {
                    offset: { x: 0, y: 0 },
                    size: { width, height },
                    displaySize: { width: width * downSize, height: height * downSize },
                    resizeMode: 'contain'
                }
            );
        }
        if (Platform.OS == 'ios' && isVideo) {
            nlog("vao video")
            const dest = `${RNFS.TemporaryDirectoryPath}${Math.random().toString(36).substring(7)}.mp4`;
            uriReturn = await RNFS.copyAssetsVideoIOS(uri, dest);

        }
        // if(Platform.OS == 'ios' && !isVideo&&!height && !width){
        //     nlog("vao file  nha")
        //    var arr= uri.split('.')
        //     const dest = `${RNFS.TemporaryDirectoryPath}${Math.random().toString(36).substring(7)}.${arr[arr.length-1]}`;
        //     uriReturn=await RNFS.copyAssetsFileIOS(uri,dest)
        // }
        if (uriReturn) {
            nlog("vao file conf lai")
            //-------
            try {
                const data64 = await RNFS.readFile(uriReturn, 'base64');
                // console.log('data64:', data64);
                //POSTDATA
                return data64;
            } catch (error) {
                nlog('error-----:', error)
                return '';
            };
        };
    } catch (cropError) {
        nlog('error----- 2:', cropError);
        return '';
    };


}
async function parseBase64_File(uri) {
    try {
        let uriReturn = uri;
        if (uriReturn) {
            //-------
            try {
                nlog("gia tri retun uri", uriReturn)
                const data64 = await RNFS.readFile(decodeURIComponent(uriReturn), 'base64');
                // nlog("gia tri retun ur2", data64)
                // console.log('data64:', data64);
                //POSTDATA
                return data64;
            } catch (error) {
                nlogError('error-----:', error)
                return '';
            };
        };
    } catch (cropError) {
        nlogError('error----- 2:', cropError)
        return '';
    };


}

// random UUID/GUID
// function uuidv4() {
//     return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
//         (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
//     )
// }

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function openCallNumber(phone = ROOTGlobal.hotlineTripU) {
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
        phoneNumber = 'telprompt:19009066';
    } else {
        phoneNumber = 'tel:19009066';
    };
    Linking.canOpenURL(phoneNumber)
        .then(supported => {
            if (!supported) {
                Alert.alert('Phone number is not available', phone);
            } else {
                return Linking.openURL(phoneNumber);
            }
        })
        .catch(err => console.log(err));
};

function onShare(title = 'Wellcome to App', link = '', subject = 'Chia sẻ PA ' + appConfig.TenTinh, data = {}) {
    // linkWeb = encodeURI(`/${linkWeb}`);
    // linkWeb = linkWeb.split('&').join('%26');
    // deepLink = encodeURI(deepLink);
    // deepLink = deepLink.split('&').join('%26');
    const shareOptions = {
        title,
        message: title + ': ' + link,
        url: link,
        subject,
        // social: Share.Social.WHATSAPP,
        // whatsAppNumber: "9199999999"  // country code + phone number(currently only works on Android)
        // filename: 'test', // only for base64 file in Android 
    };
    Share.open(shareOptions)
        .then((res) => { console.log('SSSSS:', res) })
        .catch((err) => { err && console.log('SSSSS:', err); });
}

// function loai bỏ dấu trong tiếng việt
function removeAccents(str) {
    return str?.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function GetIDyoutobe(link = '') {
    let idvdeo = link.split("/");
    let idVideo2 = link.split("=");
    return idVideo2.length > 1 ? idVideo2[idVideo2.length - 1] : idvdeo[idvdeo.length - 1]
}

function clearHtml(str) {
    var regex = "/<(.|\n)*?>/";
    var result = str.replace(regex, "");
    let isRemove = false;
    let valNew = '';
    for (let i = 0; i < result.length; i++) {
        const item = result[i];
        if (item == '<')
            isRemove = true;
        if (!isRemove) {
            valNew += item;
        }
        if (item == '>')
            isRemove = false;
    }
    return valNew
}
var _navigator;
function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function navigate(routeName, params = {}) {
    // Utils.nlog("vao navigation", routeName, params, _navigator)
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        }),
    );
}
function BackStack() {
    // Utils.nlog("vao navigation", routeName, params, _navigator)
    _navigator.dispatch(
        NavigationActions.back(),
    );
}
function push(routeName, params = {}) {
    // Utils.nlog("vao navigation", routeName, params, _navigator)
    _navigator.dispatch(
        StackActions.push({
            routeName,
            params,
        }),
    );
}
async function postapiOneSignal(data, id_palyer) {
    // nlog("gia tri data=======================", data.Comment, id_palyer)
    var smethod = 'POST';
    let body = {
        "app_id": appConfig.onesignalID,
        "contents": {
            "en": data.Comment
        },
        "data": {
            ...data,
            isMessage: true
        },
        "headings": {
            "en": "Message"
        },
        "include_player_ids": id_palyer

    }
    let stbody = JSON.stringify(body);
    try {
        const response = await fetch('https://onesignal.com/api/v1/notifications',
            {
                method: smethod,
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic OGJlY2E0MTktZWFjYy00Y2UyLTlkMjUtZGE5NTUyMjY5ZjM2',
                    'InternalAPI': appConfig.InternalAPI,
                    'Access-Control-Allow-Origin': '*'
                },
                body: stbody
            });
        const res = await response.json();
        // nlog("gia tri res bắn notify", res);
        if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
            nlog('[API]Lỗi API:', res);
            return -3;
        }
        return res;
    }
    catch (error) {
        nlog('[API]Lỗi error:', error);
        if (showMsg)
            Alert.alert('Lỗi mạng', 'Kết nối server thất bại');
        return -1;
    }
}
//giair thích
function checkVersion(nthis = this, dataConfig = {}) {
    try {
        let { verIOS = '0', verAndroid = '0', linkIOS = '', linkAndroid = '',
            reqUpdateIOS = '0', reqUpdateAndroid = '0' } = dataConfig;
        verIOS = parseInt(verIOS);
        verAndroid = parseInt(verAndroid);
        reqUpdateIOS = parseInt(reqUpdateIOS);
        reqUpdateAndroid = parseInt(reqUpdateAndroid);
        let isUpdate = false;
        let linkStore = '';
        let isRequire = false;
        if (Platform.OS == 'ios') {
            isUpdate = appConfig.verIOS < verIOS;
            isRequire = appConfig.verIOS < reqUpdateIOS;
            linkStore = linkIOS;
        } else {
            isUpdate = appConfig.verAndroid < verAndroid;
            isRequire = appConfig.verAndroid < reqUpdateAndroid;
            linkStore = linkAndroid;
        }
        setGlobal(nGlobalKeys.resconfig, { isUpdate: isUpdate || isRequire, linkStore }); // set về rỗng để giảm bơt RAM

        if (isUpdate || isRequire) {
            setTimeout(() => {
                if (isRequire)
                    showMsgBoxOK(nthis, 'Thông báo cập nhật', 'Phiên bản hiện tại đã KHÔNG còn sử dụng. Vui lòng cập nhật phiên bản mới!', 'Cập nhật', () => {
                        if (linkStore != '') {
                            openUrl(linkStore);
                        }
                    }, false);
                else
                    showMsgBoxYesNo(nthis, 'Thông báo cập nhật', 'Đã có bản cập nhật mới. Vui lòng cập nhật ứng dụng!', 'Cập nhật', "Để sau", () => {
                        if (linkStore != '') {
                            openUrl(linkStore);
                        }
                    });
            }, 600);
        }
    } catch (error) {
        nlogError(error)
    }
}
function checkIsVideo(url = '') {
    const extensionsVideo = new Set(videoExtensions);
    return extensionsVideo.has(path.extname(url).slice(1).toLowerCase());
}

function checkIsImage(url = '') {
    const extensionsImage = new Set(imageExtensions);
    return extensionsImage.has(path.extname(url).slice(1).toLowerCase());
}

function runAPI_Debounce(func = () => { }, wait = 100, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function showMsgBoxOKTop(title, message = '', btnTextOk = 'OK', onPressOK = () => { }) {
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName: 'Modal_MsgBox',
            params: { title, message, buttons: [{ text: btnTextOk, onPress: onPressOK }] },
        }),
    );
}

function showMsgBoxYesNoTop(title, message = '', btnTextOk = 'OK', btnTextCancel = 'Cancel', onPressOK = () => { }, onPressCancel = () => { }) {
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName: 'Modal_MsgBox',
            params: { title, message, buttons: [{ text: btnTextOk, onPress: onPressOK }, { text: btnTextCancel, onPress: onPressCancel }] },
        }),
    );
}

function ConvertHtmlToText(text = '') {
    const noidung = text.replace(/(<([^>]+)>)/gi, "");
    return noidung
}

async function post_apiFacebook(strUrl, showMsg = false, logUrl = true, smethod = 'GET') {
    try {
        const response = await fetch(strUrl,
            {
                method: smethod,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
        logUrl == true ? console.log(response) : null
        const res = await response.json();
        if (res.ExceptionMessage != undefined) { // edit tuỳ từng object api
            nlog('[API]Lỗi API:', res);
            return -3;
        }
        return res;
    }
    catch (error) {
        nlog('[API]Lỗi error:', error);
        if (showMsg)
            Alert.alert('Lỗi mạng', 'Kết nối server thất bại');
        return -1;
    }
}

async function get_apiFacebook(strUrl, showMsg = true, logUrl = true) {
    const res = await post_apiFacebook(strUrl, showMsg, logUrl, "GET");
    return res;
}

const regionToBoundingBox = (region, kilomet = 10000) => {
    let Delta = kilomet / 69;
    let lngD
    if (Delta < 0)
        lngD = Delta + 360
    else
        lngD = Delta
    return ({
        minlog: region.longitude - lngD / 2, // westLng - min lng
        minlat: region.latitude - lngD / 2, // southLat - min lat
        maxlog: region.longitude + lngD / 2, // eastLng - max lng
        maxlat: region.latitude + lngD / 2 // northLat - max lat
    })
}

async function checkImageURL(url) {
    await fetch(url)
        .then(res => {
            if (res.status == 404) {
                return false;
            } else {
                return true
            }
        })
        .catch(err => { return false; });
}

async function setCacheURL(keyURL, strUrl, extend = undefined) {
    //Mô tả hàm: hàm sẽ tự lưu cache files, và lấy url cache lên. Và sẽ tự xoá files nếu url file đổi.
    //strUrl là key chính. Nếu đổi là hàm sẽ tự động lưu cache lại.
    //--Set Key 
    if (!strUrl || strUrl == '')
        return "";
    //---Xử lý cắt dấu // thừa
    strUrl = strUrl.split("://");
    if (strUrl.length > 1) {
        strUrl[1] = strUrl[1].replace("//", "/");
        strUrl = strUrl.join("://");
    } else {
        strUrl = strUrl[0];
    }
    //---
    let keyCache = keyURL;

    let tempVal = ROOTGlobal[keyCache];
    if (!tempVal) {
        tempVal = await ngetStore(keyCache, undefined, '');
        ROOTGlobal[keyCache] = tempVal;
    }

    try {
        //--Xử lý lưu cache files url local 
        let isURLNone = false;
        if (tempVal && tempVal.strUrlOld == strUrl) {
            try {
                let existFiles = await RNFetchBlob.fs.exists(tempVal.urlCache);
                isURLNone = !existFiles;
            } catch (error) {
                isURLNone = true;
            }
        }
        nlog('CACHE existFiles:', isURLNone)

        if (!tempVal || tempVal.strUrlOld != strUrl || isURLNone) {
            if (tempVal && tempVal.strUrlOld != strUrl)
                RNFetchBlob.fs.unlink('some-file-path').then((res) => {
                    nlog('The file REMOVE - CACHE:', res)
                    // ...
                })
            if (!extend) { // Xử lý tự lấy extend từ strUrl truyền vào.
                var iextend = '';
                for (var i = strUrl.length - 1; i > 0; i--) {
                    if (strUrl[i] === '.')
                        break;
                    iextend = strUrl[i] + iextend;
                }
                extend = iextend;
            }
            RNFetchBlob
                .config({
                    fileCache: true,
                    // by adding this option, the temp files will have a file extension
                    appendExt: extend
                })
                .fetch('GET', strUrl, {
                    //some headers ..
                })
                .then((res) => {
                    // the temp file path with file extension `png`
                    nlog('The file SAVED - CACHE:', res)
                    // Beware that when using a file path as Image source on Android,
                    // you must prepend "file://"" before the file path
                    ROOTGlobal[keyCache] = {
                        strUrlOld: strUrl,
                        urlCache: Platform.OS === 'android' ? 'file://' + res.path() : res.path()
                    };
                    nsetStore(keyCache, ROOTGlobal[keyCache], '');
                });
            return strUrl;
        }
        return tempVal.urlCache;
    } catch (error) {
        nlog('ERROR - CACHE:', error);
        return strUrl;
    }
}

function getCacheURL(keyURL) {
    try {
        return ROOTGlobal[keyURL]?.urlCache;
    } catch (error) {
        return "";
    }
}

function replaceAll(strVal, searchVal, replaceVal) {
    return strVal.split(searchVal).join(replaceVal);
}

function encodeID(ID) {
    try {
        ID = ID.toString(); //ID phải là kiểu số.
        let numStart = Math.floor(Math.random() * 9) + 1;
        let numEnd = "02468"[Math.floor(Math.random() * 5)];
        ID = numStart + ID + numEnd;
        ID = parseInt(ID) / 2;
        numEnd = Math.floor(Math.random() * 9) + 1;
        let valNewCode = formatDate(new Date(), numStart + "DDMM" + ID + "YYHHmm" + numEnd);
        console.log("encodeID:", valNewCode)
        return valNewCode;
    } catch (error) {
        return null;
    }

}

function decodeID(CodeID, isgetTime = false) {
    try {
        //--isgetTime: trả thêm về thời gian lúc encode Nếu cần.
        CodeID = CodeID.substr(1, CodeID.length - 2);
        let tempTime = CodeID.substr(0, 4) + CodeID.substr(CodeID.length - 6, 7);
        CodeID = CodeID.substr(4, CodeID.length - 10);
        CodeID = (parseInt(CodeID) * 2).toString();
        CodeID = CodeID.substr(1, CodeID.length - 2);
        return isgetTime ? { ID: CodeID, time: tempTime } : CodeID;
    } catch (error) {
        return null;
    }
}
let refLoading = React.createRef();

function setToggleLoading(isShow = true) {
    if (!refLoading.current) {
        return;
    }
    if (isShow) {
        if (refLoading.current.show && typeof (refLoading.current.show) == 'function') {
            refLoading.current.show()
        }
    } else {
        if (refLoading.current.hide && typeof (refLoading.current.hide) == 'function') {
            refLoading.current.hide()
        }

    }
}

function hidePhoneNum(phone = '', textHide = '*') {
    let result = "";
    let hide = ""
    Array.from(Array(4).keys()).map(i => {
        hide += textHide
    })
    if (phone && phone != null) {
        result = phone.substring(0, 3) + hide + phone.substring(7);
    }
    return result;
}

function hideEmail(email = '', textHide = 'x') {
    let hide = ""
    Array.from(Array(4).keys()).map(i => {
        hide += textHide
    })
    if (email.length > 0) {
        return email.replace(/^(.{2})[^@]+/, `$1${hide}`)
    }
    return ''
}

function chuanhoaHovaTen(hovaten = "") {
    hovaten = hovaten.trim();
    while (hovaten.includes("  ")) {
        hovaten = replaceAll(hovaten, "  ", " ");
    }
    return hovaten
}

//Trong 1 FORM chỉ được dùng cho 1 ô SEARCH, muốn dùng nhiều hơn thì custom lại
function searchTimer(nthis, funAPISearch = () => { }, time = 700) {
    if (nthis.TIMEOUT_SEARCH) {
        clearTimeout(nthis.TIMEOUT_SEARCH);
    }
    nthis.TIMEOUT_SEARCH = setTimeout(() => {
        funAPISearch();
    }, time);
}

async function getHashOTP() {
    try {
        if (Platform.OS == 'android') {
            let hashOTP = await RNOtpVerify.getHash()
            console.log('hashOTP', hashOTP);
            return hashOTP[0]
        } else {
            const hashText = CryptoJS.SHA256(moment().format('DD/MM/YYYY HH:mm:ss').toString() + appConfig.deeplinkApp).toString().substring(0, 11)
            console.log('hashText', hashText);
            return hashText
        }
    } catch (error) {
        console.error('err hash otp', error)
        return ''
    }

}
const getImageSize = async uri => new Promise(resolve => {
    Image.getSize(uri, (width, height) => {
        resolve({ width, height });
    });
})

const getCurrentPosition = async (nthis, callback = () => { }) => {
    Geolocation.setRNConfiguration({ skipPermissionRequests: true, authorizationLevel: 'whenInUse' });
    Geolocation.requestAuthorization();
    var granted;
    if (Platform.OS == 'android') {
        granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            title: 'Cấp quyền',
            message: `Ứng dụng cần quyền truy cập vị trí để lấy thông tin vị trí`,
            buttonNegative: 'Để sau',
            buttonPositive: 'Cấp quyền'
        })
        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
            Geolocation.getCurrentPosition(
                async (position) => {
                    nlog('geolocation-android', JSON.stringify(position));
                    var { coords = {} } = position;
                    var { latitude, longitude } = coords;
                    let latlng = {
                        latitude: latitude,
                        longitude: longitude
                    };
                    callback(latlng)
                },
                error => {
                    nlog('getCurrentPosition error: ', JSON.stringify(error))
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
            );
        }
    } else {
        Geolocation.getCurrentPosition(
            async (position) => {
                nlog('geolocation-ios', JSON.stringify(position));
                var { coords = {} } = position;
                var { latitude, longitude } = coords;
                if (Platform.OS == 'ios' && (!latitude || !longitude)) {
                    showMsgBoxYesNo(nthis, 'Dịch vụ vị trí bị tắt. Hãy bật dịch vụ vị trí trong phần cài đặt điện thoại của bạn.',
                        'Chuyển tới cài đặt', 'Không, cảm ơn',
                        () => {
                            Linking.openURL('app-settings:').catch((err) => {
                                nlog('app-settings:', err);
                            });
                        });
                } else {
                    granted = 'granted';
                    let latlng = {
                        latitude: latitude,
                        longitude: longitude
                    }
                    callback(latlng)
                }
            },
            (error) => {
                let {
                    code
                } = error;
                if (code == 1) {
                    showMsgBoxYesNo(nthis, 'Dịch vụ vị trí bị tắt',
                        'Ứng dụng cần truy cập vị trí của bạn. Hãy bật dịch vụ vị trí trong phần cài đặt điện thoại của bạn.',
                        'Chuyển tới cài đặt', 'Không, cảm ơn',
                        () => {
                            Linking.openURL('app-settings:').catch((err) => {
                                nlog('app-settings:', err);
                            });
                        });
                }
                nlog('getCurrentPosition error: ', JSON.stringify(error))
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    }
}

const dialCall = (number) => {
    try {
        let phoneNumber = '';
        if (number == undefined) {
            showMsgBoxOKTop("Thông báo", "Chưa có số điện thoại", 'Xác nhận')
            return;
        }
        if (validateEmail(number)) {
            phoneNumber = `mailto:${number}`;
        } else if (Platform.OS === 'android') {
            phoneNumber = `tel:${number}`;
        }
        else {
            phoneNumber = `telprompt:${number}`;
        }
        Linking.openURL(phoneNumber)

    } catch (error) {
        nlog('Cannot call', error)
    }

};

//-------END---------
export default {
    setTopLevelNavigator, navigate, BackStack, push,
    goscreen, nlog, goback, isUrlCus, getDomain, openWeb, showMsgBoxOK, showMsgBoxYesNo, getRootGlobal, setGlobal,
    formatMoney, inputMoney, formatNumber, post_api, get_api, validateEmail, handleResponse, getGlobal,
    resTrue, resFalse, resEmpty, toggleDrawer, handleSelectedDate, ngetStore, nsetStore, ngetParam,
    post_apiBear, get_apiBearer, formatPhoneCode, datesDiff, formatDate, sformat,
    openUrl, objToQueryString, decodeHTMLEntities, capitalize, connectRedux, isNullOrUndefined, isNullOrEmpty,
    formatDateApp, cloneData, parseBase64, formatMoney1, uuidv4, setMomentLocale, openCallNumber, onShare, validatePhone, removeAccents,
    showMsgBoxOKCus, clearHtml, postapiOneSignal, checkVersion, checkIsVideo, checkIsImage, post_api_default,
    get_api_default, validateMK, GetIDyoutobe, runAPI_Debounce, showMsgBoxOKTop, showMsgBoxYesNoTop, ConvertHtmlToText, post_api_headers, get_api_headers,
    get_apiFacebook, post_apiFacebook, parseBase64_File, post_api_domain, get_api_domain, regionToBoundingBox, timeCountFormat, checkImageURL,
    setCacheURL, ngetMultiStore, getCacheURL, replaceAll, encodeID, decodeID,
    refLoading, setToggleLoading, post_api_AI, post_api_formdata, showToastMsg, nlogError, hidePhoneNum, hideEmail, searchTimer, getHashOTP, chuanhoaHovaTen,
    getImageSize, getCurrentPosition, dialCall
};