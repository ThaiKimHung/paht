import { useState, useEffect } from "react";
import Utils from "../../../app/Utils";
import apis from "../../apis";
import { nGlobalKeys } from '../../../app/keys/globalKey';
import Geolocation from 'react-native-geolocation-service';
import { Linking, PermissionsAndroid, Platform } from "react-native";
import { appConfig } from '../../../app/Config';

export const getCurrentPosition = async (nthis, callback = () => { }) => {
    Geolocation.setRNConfiguration({ skipPermissionRequests: true, authorizationLevel: 'whenInUse' });
    Geolocation.requestAuthorization();
    var granted;
    if (Platform.OS == 'android') {
        granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            title: 'Tự động lấy vị trí',
            message: 'Bạn có muốn lưu động lấy thông tin vị trí hiện tại để gửi kèm phản ánh?\n' +
                'Để tự động lấy vị trí thì bạn cần cấp quyền truy cập vị tri cho ứng dụng.',
            buttonNegative: 'Để sau',
            buttonPositive: 'Cấp quyền'
        })
        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
            Geolocation.getCurrentPosition(
                async (position) => {
                    Utils.nlog('geolocation-android', JSON.stringify(position));
                    var { coords = {} } = position;
                    var { latitude, longitude } = coords;
                    let latlng = {
                        latitude: latitude,
                        longitude: longitude
                    };
                    callback(latlng)
                },
                error => {
                    Utils.nlog('getCurrentPosition error: ', JSON.stringify(error))
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
            );
        }
    } else {
        Geolocation.getCurrentPosition(
            async (position) => {
                Utils.nlog('geolocation-ios', JSON.stringify(position));
                var { coords = {} } = position;
                var { latitude, longitude } = coords;
                if (Platform.OS == 'ios' && (!latitude || !longitude)) {
                    Utils.showMsgBoxYesNo(nthis, 'Dịch vụ vị trí bị tắt', appConfig.TenAppHome + ' cần truy cập vị trí của bạn. Hãy bật Dịch vụ vị trí trong phần cài đặt điện thoại của bạn.',
                        'Chuyển tới cài đặt', 'Không, cảm ơn',
                        () => {
                            Linking.openURL('app-settings:').catch((err) => {
                                Utils.nlog('app-settings:', err);
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
                    Utils.showMsgBoxYesNo(nthis, 'Dịch vụ vị trí bị tắt',
                        'Ứng dụng cần truy cập vị trí của bạn. Hãy bật dịch vụ vị trí trong phần cài đặt điện thoại của bạn.',
                        'Chuyển tới cài đặt', 'Không, cảm ơn',
                        () => {
                            Linking.openURL('app-settings:').catch((err) => {
                                nlog('app-settings:', err);
                            });
                        });
                }
                Utils.nlog('getCurrentPosition error: ', JSON.stringify(error))
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    }
}

