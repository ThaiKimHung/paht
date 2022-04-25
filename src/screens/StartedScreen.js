import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ImageBackground, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Images } from '../images'
import Utils from '../../app/Utils'
import { sizes, colors } from '../../styles'
import ButtonCom from '../../components/Button/ButtonCom'
import { Height, nstyles, stLogin, Width } from '../../styles/styles'
import { nkey } from '../../app/keys/keyStore'
import { reSize, reText } from '../../styles/size'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { nGlobalKeys } from '../../app/keys/globalKey'
import { appConfig } from '../../app/Config'
import apis from '../apis'
import RNRestart from 'react-native-restart';
import ImageCus from '../../components/ImageCus'

const listImg = [Images.imgNinhKieu, Images.imgCaiRang, Images.imgThotNot]
const StartedScreen = (props) => {
    const data = Utils.ngetParam({ props: props }, "data", []);
    let IdDomainSelect = Utils.ngetParam({ props: props }, 'IdDomainSelect');
    let indexDefault = data.findIndex((item) => item.IDQuan == IdDomainSelect);
    Utils.nlog('datasubconfig', data)
    const [indexChoose, setindexChoose] = useState(indexDefault)
    const renderItem = (item, index) => {
        return <TouchableOpacity
            onPress={() => setindexChoose(index)}
            key={index}
            opacity={0.1}
            style={[{
                borderRadius: 10,
                marginTop: 15,
                borderRadiusshadowColor: 'black',
                shadowOffset: { width: 2, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 4,// do itemdanhsach shadow k hiện rõ trên android
                borderWidth: indexChoose == index ? 3 : 0,
                borderColor: 'rgba(168,7,12,1)',
                marginHorizontal: indexChoose == index ? 0 : 5,
            }]}>
            {/* <Image
                opacity={1}
                // defaultSource={Images.imgNinhKieu}
                source={item.icon ? { uri: appConfig.domain + item.icon } : listImg[index] ? listImg[index] : Images.imgNinhKieu}
                style={{ width: '100%', height: 90, borderRadius: 5 }}
                resizeMode='cover'
            /> */}
            <ImageCus defaultSourceCus={Images[item?.iconLocal]} source={{ uri: appConfig.domain + item.icon }}
                style={[{ width: '100%', height: 90, borderRadius: 5 }]} resizeMode='cover'
            />
            <View style={{ position: 'absolute', left: 10, bottom: 10, zIndex: 100 }}>
                <Text style={{ color: indexChoose == index ? colors.white : colors.brownGreyThree, fontWeight: 'bold', fontSize: reText(18) }}> {`${item.TenQuan}`}</Text>
            </View>
            <LinearGradient
                start={{ x: 0.3, y: 0.5 }} end={{ x: 0.6, y: 0.5 }}
                colors={indexChoose == index ? ['rgba(168,7,12,1)', 'rgba(220,9,16,0.1)'] : ['transparent', 'transparent']}
                style={{ position: 'absolute', top: 0, right: 0, height: 90, width: '100%', borderRadius: 5 }}>
            </LinearGradient>
            {
                indexChoose == index ? null :
                    <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, backgroundColor: colors.black_60, borderRadius: 5 }} />
            }

        </TouchableOpacity >
    }
    const UpdateOneSignal = async () => {
        let DevicesInfo = Platform.OS == 'ios' ? 'ios' : 'android'
        let DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
        const IdPA = 0
        const res = await apis.ApiUser.RegisDeviceToken(false, DevicesInfo, DevicesToken, IdPA, 0, 0, 0, '');
        Utils.nlog('OFF-onesignal', res)
    }
    const onPressStarted = async (isCancel = false) => {
        if (isCancel != true && indexChoose != indexDefault) { // ko được để if(isCancel) 
            //Xoá token notifi ở domain cũ
            await UpdateOneSignal();
        }
        let dataItem = data[indexChoose];
        await Utils.nsetStore(nkey.idDomain, dataItem.IDQuan);
        RNRestart.Restart();
        // Utils.goscreen({ props: props }, "sw_Root")

    }
    return (
        <ImageBackground
            opacity={0.5}
            source={Images.imgStartScreen}
            // style={{ flex: 1, paddingTop: 50, backgroundColor: colors.black_30 }}>
            resizeMode="contain"
            style={{ flex: 1, paddingTop: 50, backgroundColor: colors.colorBrownLine }}>

            <ImageCus
                defaultSourceCus={Images.iconApp}
                source={Utils.getGlobal(nGlobalKeys.LogoAppHome, '') ? { uri: Utils.getGlobal(nGlobalKeys.LogoAppHome, '') } : undefined}
                style={{ width: Height(18), height: Height(18), alignSelf: 'center' }} resizeMode='contain' />
            <Image
                source={Images.imgTextApp}
                style={{ width: Width(100), height: Height(5), alignSelf: 'center', marginTop: 10 }} resizeMode='contain' />
            <View style={{ flex: 1 }}>
                <View style={{ marginTop: 20 }}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{
                        paddingHorizontal: 10,
                        marginHorizontal: 10,
                        backgroundColor: 'rgba(255,255,255,0.6)',
                        borderRadius: 10,
                        paddingBottom: 15
                    }}>
                        {
                            data.map(renderItem)
                        }
                    </ScrollView>
                </View>
            </View>
            <View style={{
                width: '100%',
                paddingHorizontal: 10,
                paddingBottom: isIphoneX() ? 20 : 10,
            }}>
                <View style={[nstyles.nrow, { width: '100%' }]}>
                    {/* {
                        indexDefault == -1 ? null :
                            <>
                                <ButtonCom
                                    onPress={() => onPressStarted(true)}
                                    Linear={false}
                                    sizeIcon={30}
                                    styleTouchable={{ flex: 1 }}
                                    txtStyle={{ color: colors.colorTextSelect }}
                                    style={{
                                        ...stLogin.contentInput,
                                        marginTop: Height(2), borderRadius: 6,
                                        paddingHorizontal: 20,
                                        backgroundColor: colors.white, width: '100%',
                                    }}
                                    text={'Đóng'}
                                />
                                <View style={{ width: 10 }} />
                            </>
                    } */}
                    {
                        indexChoose == -1 ? null :
                            <ButtonCom
                                onPress={onPressStarted}
                                Linear={true}
                                sizeIcon={30}
                                styleTouchable={{ flex: 1 }}
                                txtStyle={{ color: colors.white }}
                                style={
                                    {
                                        ...stLogin.contentInput,
                                        marginTop: Height(2), borderRadius: 6,
                                        paddingHorizontal: 20,
                                        backgroundColor: colors.colorTextSelect, width: '100%',
                                    }}
                                text={'Tiếp tục'}
                            />
                    }
                </View>
            </View>
        </ImageBackground>
    )
}

export default StartedScreen

const styles = StyleSheet.create({})
