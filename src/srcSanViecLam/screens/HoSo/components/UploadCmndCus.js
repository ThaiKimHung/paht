
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { colors } from '../../../../../styles'
import { reText } from '../../../../../styles/size'
import ImageCus from '../../../../../components/ImageCus'
import { Images } from '../../../../images'
import { nstyles } from '../../../../../styles/styles'
import TextApp from '../../../../../components/TextApp'
import Utils from '../../../../../app/Utils'
import { colorsSVL } from '../../../../../styles/color'




const UploadCmndCus = (props) => {
    const userCD = useSelector(state => state.auth.userCD)
    const [AnhCMNDT, setAnhCMNDT] = useState('')
    const [AnhCMNDS, setAnhCMNDS] = useState('')

    const TypeFaceImage = {
        'FaceInFrontOf': 'FaceInFrontOf',
        'FaceBehind': 'FaceBehind'
    }

    const onChooseImage = (typeFace = '') => {
        let options = {
            assetType: 'Photos',//All,Videos,Photos - default
            multi: false,// chọn 1 or nhiều item
            response: data => callbackChooseImage(data, typeFace), // callback giá trị trả về khi có chọn item
            limitCheck: 1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
        };
        Utils.navigate('Modal_MediaPicker', options);
    }

    const callbackChooseImage = (data, typeFace) => {
        Utils.nlog('gia tri data', data)
        switch (typeFace) {
            case TypeFaceImage.FaceInFrontOf:
                if (data?.iscancel)
                    return;
                setAnhCMNDT({
                    ...data[0],
                    filename: 'CMND_MatTruoc.png'
                })
                break;
            case TypeFaceImage.FaceBehind:
                if (data?.iscancel)
                    return;
                setAnhCMNDS({
                    ...data[0],
                    filename: 'CMND_MatSau.png'
                })
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        if (props?.callback) {
            props?.callback({
                AnhCMNDT: AnhCMNDT,
                AnhCMNDS: AnhCMNDS,
            })
        }
    }, [AnhCMNDT, AnhCMNDS])

    const stUploadCMND = StyleSheet.create({
        viewID: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: colors.black_10,
            paddingTop: 10
        },
        addViewId: {
            height: 100,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center'
        },
        container: {
            marginHorizontal: 10,
            borderWidth: 0.5,
            borderColor: colorsSVL.blueMainSVL,
            borderRadius: 3,
            padding: 10
        },
        viewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
    })
    // if (!props.isEdit) {
    //     return <TextLine title={'Ảnh CMND/CCCD'} value={'Đã xác thực danh tính'} />
    // }
    Utils.nlog('gia tri uri', AnhCMNDT?.uri)
    return (
        <View style={{ backgroundColor: 'white', paddingBottom: 10 }} >
            <TextApp style={[{ margin: 10, fontWeight: 'bold', fontSize: reText(14) }, props.txtTitle]}>{'Ảnh CMND/CCCD'}<Text style={{ color: colors.redStar }}>*</Text></TextApp>
            <View style={[stUploadCMND.container, props.styleContainer]}>
                <View style={stUploadCMND.viewRow}>
                    <TouchableOpacity disabled={!props.isEdit ? true : false} onPress={() => { onChooseImage(TypeFaceImage.FaceInFrontOf) }} style={stUploadCMND.viewID}>
                        {
                            AnhCMNDT?.uri || userCD?.AnhCMNDT || props.AnhCMNDT?.uri ? <ImageCus
                                source={userCD?.AnhCMNDT && props.isEdit && !AnhCMNDT?.uri ? { uri: appConfig.domain + userCD?.AnhCMNDT } : { uri: AnhCMNDT?.uri || props.AnhCMNDT?.uri }}
                                style={{
                                    height: 100, width: '100%'
                                }} resizeMode={'contain'}
                            /> :
                                <TouchableOpacity disabled={!props.isEdit ? true : false} onPress={() => { onChooseImage(TypeFaceImage.FaceInFrontOf) }} style={stUploadCMND.addViewId}>
                                    <ImageCus source={Images.icUploadImage} style={nstyles.nIcon40} />
                                </TouchableOpacity>
                        }
                        <TextApp style={{ marginVertical: 5 }}>{'Mặt trước'}</TextApp>
                    </TouchableOpacity>
                    <View style={{ width: 10 }} />
                    <TouchableOpacity disabled={!props.isEdit ? true : false} onPress={() => { onChooseImage(TypeFaceImage.FaceBehind) }} style={stUploadCMND.viewID}>
                        {
                            AnhCMNDS?.uri || userCD?.AnhCMNDS || props.AnhCMNDS?.uri ? <ImageCus
                                source={userCD?.AnhCMNDS && props.isEdit && !AnhCMNDS?.uri ? { uri: appConfig.domain + userCD?.AnhCMNDS } : { uri: AnhCMNDS?.uri || props.AnhCMNDS?.uri }}
                                style={{
                                    height: 100, width: '100%'
                                }} resizeMode={'contain'}
                            /> :
                                <TouchableOpacity disabled={!props.isEdit ? true : false} onPress={() => { onChooseImage(TypeFaceImage.FaceBehind) }} style={stUploadCMND.addViewId}>
                                    <ImageCus source={Images.icUploadImage} style={nstyles.nIcon40} />
                                </TouchableOpacity>
                        }
                        <TextApp style={{ marginVertical: 5 }}>{'Mặt sau'}</TextApp>
                    </TouchableOpacity>
                </View>
            </View >
        </View>
    )
}

export default UploadCmndCus
