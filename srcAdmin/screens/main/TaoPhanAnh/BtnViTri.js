

import React, { Component } from 'react';
import {
    View, TextInput,
    Text, Image, TouchableOpacity,
    StyleSheet, PermissionsAndroid,
    Linking,
    ActivityIndicator, Platform, ScrollView, Alert, Keyboard, BackHandler
} from 'react-native';
import apis from '../../../apis';
import { Images } from '../../../images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Geolocation from 'react-native-geolocation-service';
import ImageSize from 'react-native-image-size'
import moment from 'moment';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import Toast from 'react-native-simple-toast';
import ImagePicker from '../../../../components/ComponentApps/ImagePicker/ImagePicker';
import RNCompress from '../../../../src/RNcompress';
import { reText, reSize, sizes } from '../../../../styles/size';
import { nstyles, Height, paddingTopMul, khoangcach, Width } from '../../../../styles/styles';
import { appConfig } from '../../../../app/Config';
import { IsLoading, HeaderCom } from '../../../../components';
import { colors } from '../../../../styles';
import Utils from '../../../../app/Utils';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import AppCodeConfig from '../../../../app/AppCodeConfig';



export const BtnViTri = (props) => {

    var {
        onPress = () => { Utils.nlog('onPress') },
        source = Images.icHere,
        text = 'Hiện tại',
    } = props;

    var {
        stViewBtn,
        stText
    } = styles;
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.5}>
            <View style={stViewBtn}>
                <Image
                    source={source}
                    resizeMode={'contain'}
                    style={{
                        width: reSize(15), height: reSize(15),
                        tintColor: colors.colorBlueP
                    }} />
                <Text style={[stText, { color: colors.colorBlueP }]}>
                    {text}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    stText: {
        marginLeft: 8,
        fontSize: reText(15),
        color: colors.colorGrayText
    },
    stViewBtn: {
        ...nstyles.nrow,
        ...nstyles.nmiddle,
        borderColor: colors.colorBlueP,
        borderRadius: 4,
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginLeft: 4,
    }
})