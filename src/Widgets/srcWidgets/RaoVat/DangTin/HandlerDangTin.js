import Utils from "../../../../../app/Utils"
import { ApiRaoVat } from "../../../apis"
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { colorsWidget, colors } from "../../../../../styles/color";
import moment from "moment";


export const getListDanhMuc = async (callback = () => { }) => {
    Utils.setToggleLoading(true)
    let res = await ApiRaoVat.GetList_AllDanhMuc()
    Utils.setToggleLoading(false)
    Utils.nlog('[LOG] res danh muc', res)
    if (res.status == 1 && res.data) {
        callback(res.data)
    } else {
        callback([])
    }
}

const viewItemList = (item, value, keyId, currentSelected) => {
    return (
        <View key={item.id} style={{
            flex: 1,
            paddingVertical: 12,
            borderBottomColor: colors.black_50,
            backgroundColor: item[keyId] == currentSelected[keyId] ? colorsWidget.mainOpacity : 'white',
            paddingHorizontal: 10
        }}>
            <Text style={{ textAlign: 'left', color: item[keyId] == currentSelected[keyId] ? colorsWidget.main : colorsWidget.textDropdown, }} >{item[value] || ''}</Text>
        </View>
    )
}

export const onChangeDropdown = (config, callback = () => { }) => {
    Utils.navigate('Modal_ComponentSelectBottom', {
        callback: (val) => callback(val),
        "item": config?.currentSelected || {},
        "title": config?.title_drop,
        "AllThaoTac": config?.data || [],
        "ViewItem": (item, currentSelected) => viewItemList(item, config?.keyView, config?.keyID, currentSelected),
        "Search": config?.Search || true,
        "key": config?.keyView,
        "isWhiteHeader": config?.isWhiteHeader
    })
}

export const toFixedNumber = (number = '', numberAfterDot = 1) => {
    if (Number(number))
        return Number(number)?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    else
        return number
}

export const formatNumber = inputNumber => {
    try {
        let formetedNumber = (Number(inputNumber.replace(/,/g, ''))).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        let splitArray = formetedNumber.split('.');
        if (splitArray.length > 1) {
            formetedNumber = splitArray[0];
        }
        return (formetedNumber);
    } catch (error) {
        return inputNumber
    }
};

export const formatFirstLastName = (name) => {
    try {
        return name.replace(/\s\s+/g, ' ')
    } catch (error) {
        return name
    }
}

export const regexPhoneNumber = (number) => {
    try {
        return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
    } catch (error) {
        return number
    }
}

export const formatPhone = (text) => {
    var cleaned = ('' + text).replace(/\D/g, '')
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
        var intlCode = (match[1] ? '+1 ' : ''), number = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
        return number;
    }
    return text;
}

export const isValidPhone = phone => { return /((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/.test(phone); }

export const handlerListInput = (val = '', symbolText) => {
    const textFrist = symbolText + ' ';
    try {
        if (val.length >= 1 && val[0] != symbolText) {
            val = textFrist + val;
        }
        if (val.length > 2 && val.substring(val.length - 2, val.length) === '\n●') {
            val = val.slice(0, -2);
        }
        let tempVal = '';
        let tempArr = val.split("\n");
        if (tempArr.length >= 2) {
            for (let index = 0; index < tempArr.length; index++) {
                var strLine = tempArr[index];
                if (strLine == '' && index != 0) {
                    strLine = textFrist;
                }
                if (strLine == symbolText) {
                    strLine = '';
                }
                if (index == tempArr.length - 1)
                    tempVal += strLine;
                else {
                    if (tempArr[index + 1] === symbolText)
                        tempVal += strLine;
                    else {
                        if (!(index === 0 && strLine === ''))
                            tempVal += strLine + '\n';
                    }
                }
            }
            val = tempVal;
        }
        return val;
    } catch (error) {
        return val;
    }
}

export const getUniqueNameMoment = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const replaceAllSpace = (str) => {
    try {
        return str?.replace(/ /g, '');
    } catch (error) {
        return str
    }
}