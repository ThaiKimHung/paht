
import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Platform } from 'react-native'
import { HeaderCus } from '../../../components'
import { colors, nstyles } from '../../../styles'
import Utils from '../../../app/Utils'
import { Images } from '../../images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ThongTinChungRender from '../../../src/screens/user/dangky/ThongTinChungRender'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import dataHCM from '../../../src/screens/user/dangky/dataRender'
import { useSelector } from 'react-redux'
import { appConfig } from '../../../app/Config'
import Clipboard from '@react-native-clipboard/clipboard';
import { reText } from '../../../styles/size'
import { Width, heightStatusBar } from '../../../styles/styles'
import apis from '../../apis'
import FontSize from '../../../styles/FontSize'


const height = (Platform.OS == 'android' ? nstyles.heightHed() + 10 + heightStatusBar() / 2 : nstyles.heightHed() + 10)

const Modal_TiemVaccine = (props) => {
    // const data = Utils.ngetParam({ props: props }, 'data')
    const refTTCaNhan = useRef(null);
    const isTiemVaccine = Utils.ngetParam({ props: props }, 'isTiemVaccine')
    // useEffect(() => {
    //     if (refTTCaNhan.current) {
    //         refTTCaNhan.current.setData({
    //             ...data,
    //             ["GioiTinh"]: dataHCM.dataGT.find(i => i.id == data["GioiTinh"])?.name,
    //             // ['Loai']: dataHCM.dataNhanVien.find(i => i.id == userCD["Loai"])?.name
    //         });

    //     }
    // }, [data])

    useEffect(() => {
    }, [])


    return (
        <View style={{ flex: 1, paddingBottom: getBottomSpace(), backgroundColor: colors.white, }}>
            <View style={{ backgroundColor: isTiemVaccine == 0 ? colors.BackgroundHome : isTiemVaccine == 1 ? colors.yellowHCM : colors.blueHCM, height: height, width: Width(100) }}>
                <View style={{ flexDirection: 'row', paddingTop: Platform.OS == 'android' ? nstyles.paddingTopMul() + heightStatusBar() : nstyles.paddingTopMul(), paddingHorizontal: 15, justifyContent: 'space-between' }}>
                    <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => Utils.goback({ props: props })}>
                        <Image source={Images.icBack} style={{ tintColor: isTiemVaccine == 0 ? colors.black : colors.white, width: Width(6), height: Width(4), alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <View>
                        <Text style={{ textAlign: 'center', color: isTiemVaccine == 0 ? colors.black : colors.white, fontSize: reText(16), fontWeight: 'bold' }}>{'COVID-19 VACCINATION '}</Text>
                        <Text style={{ textAlign: 'center', color: isTiemVaccine == 0 ? colors.black : colors.white, fontSize: reText(16), fontWeight: 'bold' }}>{' PASSPORT'}</Text>
                    </View>
                    <View style={{ width: Width(6) }} />
                </View>
            </View>
            <KeyboardAwareScrollView style={{ backgroundColor: colors.BackgroundHome }}>
                <View style={{ backgroundColor: colors.white, padding: 15, alignSelf: 'center', marginTop: 15, borderRadius: 10 }}>
                    <Image source={Images.icQR} style={{ width: Width(35), height: Width(35), }} />
                </View>

                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 15, backgroundColor: isTiemVaccine == 0 ? colors.white : isTiemVaccine == 1 ? colors.yellowHCM : colors.blueHCM }}>
                    <Image source={isTiemVaccine == 0 ? Images.icChuaTiemChung : Images.icDaTiemChung} style={{}} />
                    <Text style={{
                        alignSelf: 'center', marginLeft: 10, fontSize: reText(18), fontWeight: '600', color: isTiemVaccine == 0 ? colors.black : colors.white
                    }}>{isTiemVaccine == 0 ? 'Chưa tiêm Vaccine' : isTiemVaccine == 1 ? 'Đã tiêm 01 mũi Vaccine' : 'Đã tiêm 02 mũi Vaccine'}</Text>

                </View>

                <View style={{ backgroundColor: colors.white, marginTop: 5 }}>
                    <ThongTinChungRender ref={refTTCaNhan} listCom={dataHCM.dataTTNguoiTiemVaccine} isEdit={true}></ThongTinChungRender>
                    <View style={{ backgroundColor: colors.greyLight, height: FontSize.scale(5), marginTop: 10 }}></View>
                    {isTiemVaccine == 1 ? <ThongTinChungRender ref={refTTCaNhan} listCom={dataHCM.dataTiemChungLan1} isEdit={true}></ThongTinChungRender> : null}
                    {isTiemVaccine == 2 ?
                        <>
                            <ThongTinChungRender ref={refTTCaNhan} listCom={dataHCM.dataTiemChungLan1} isEdit={true}></ThongTinChungRender>
                            <View style={{ backgroundColor: colors.greyLight, height: FontSize.scale(5), marginTop: 10 }}></View>
                            <ThongTinChungRender ref={refTTCaNhan} listCom={dataHCM.dataTiemChungLan2} isEdit={true}></ThongTinChungRender>
                        </> : null}
                </View>

            </KeyboardAwareScrollView>
        </View>
    )
}


const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,

});
export default Utils.connectRedux(Modal_TiemVaccine, mapStateToProps, true);



