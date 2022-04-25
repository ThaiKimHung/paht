import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ImageBackground, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Images } from '../images'
import Utils from '../../app/Utils'
import { sizes, colors } from '../../styles'
import ButtonCom from '../../components/Button/ButtonCom'
import { Height, nstyles, stLogin, Width } from '../../styles/styles'
import { nkey } from '../../app/keys/keyStore'
import { reSize, reText, isPad } from '../../styles/size'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { nGlobalKeys } from '../../app/keys/globalKey'
import apis from '../apis'
import { appConfig } from '../../app/Config'
import AppCodeConfig from '../../app/AppCodeConfig'
import { nkeyCache } from '../../app/keys/nkeyCache'


const listImg = [Images.imgNinhKieu, Images.imgCaiRang, Images.imgThotNot]
const StartedScreen = (props) => {
    const data = Utils.ngetParam({ props: props }, "data", []);
    let IdDomainSelect = Utils.ngetParam({ props: props }, 'IdDomainSelect');
    let indexDefault = data.findIndex((item) => item.IDQuan == IdDomainSelect);

    const Tentinh = Utils.getGlobal(nGlobalKeys.TenTinh, '', AppCodeConfig.APP_ADMIN);
    const [ImageBGR, setImageBGR] = useState(Utils.getCacheURL(nkeyCache.imgBgrHomeDH))
    Utils.nlog('datasubconfig', data)
    const [indexChoose, setindexChoose] = useState(indexDefault)

    const _GetBackGround = async () => {
        const res = await apis.ApiUser.Get_AnhNen();
        // Utils.nlog("gia tri bg", res)
        if (res.status == 1 && res.data) {
            let urlBGRTemp = res.data.Link ? (appConfig.domain + res.data.Link) : '';
            urlBGRTemp = await Utils.setCacheURL(nkeyCache.imgBgrHomeDH, urlBGRTemp);
            setImageBGR(urlBGRTemp)
        }
    }
    useEffect(() => {
        _GetBackGround();
    }, [])
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
            }]}>
            <Image
                opacity={1}
                // defaultSource={Images.imgNinhKieu}
                source={item.icon ? { uri: appConfig.domain + item.icon } : listImg[index] ? listImg[index] : Images.imgNinhKieu}
                style={{ width: '100%', height: 100, borderRadius: 5 }}
                resizeMode='cover'
            />
            <View style={{ position: 'absolute', left: 10, bottom: 10, zIndex: 100 }}>
                <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: reText(18) }}> {`Quận ${item.TenQuan}`}</Text>
            </View>
            <LinearGradient
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                colors={indexChoose == index ? ['rgba(17,74,38,0.9)', 'rgba(17,171,79,0.1)'] : ['transparent', 'transparent']}
                style={{ position: 'absolute', top: 0, right: 0, height: 100, width: '100%', borderRadius: 5 }}>
            </LinearGradient>

        </TouchableOpacity >
    }
    const onPressStarted = async () => {
        // isStarted: 'isStarted',
        // idDomain: 'idDomain',
        let dataItem = data[indexChoose];
        // await Utils.nsetStore(nkey.QuanSelected, dataItem);
        await Utils.nsetStore(nkey.idDomain, dataItem.IDQuan, AppCodeConfig.APP_ADMIN);
        Utils.goscreen({ props: props }, "sw_Root")

    }

    const link2 = ImageBGR;
    Utils.nlog("giá tị link 00000---------", link2)
    return (
        <ImageBackground
            opacity={0.4}
            // defaultSource={Images.icBgr}
            source={{ uri: link2 }}
            style={{ flex: 1, paddingTop: 50 }}>

            <Image
                // defaultSource={Images.iconApp}
                source={Utils.getGlobal(nGlobalKeys.LogoAppAdmin, undefined, AppCodeConfig.APP_ADMIN) ? { uri: Utils.getGlobal(nGlobalKeys.LogoAppAdmin, undefined, AppCodeConfig.APP_ADMIN) } : Images.iconApp}
                style={{ width: 150, height: 150, alignSelf: 'center' }} resizeMode='contain' />
            {/* <Image
                source={Images.imgTextApp}
                style={{ width: '100%', height: 30, alignSelf: 'center', marginTop: 10 }} resizeMode='contain' /> */}
            <Text style={{
                width: '100%', textAlign: 'center', marginBottom: Platform.OS == 'ios' ? 20 : 14, fontWeight: '600',
                fontSize: 20, color: colors.main, marginTop: isPad ? 4 : 10
            }}>{Tentinh}</Text>
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
                position: 'absolute',
                bottom: isIphoneX() ? 30 : 10,
                left: 0,
                width: '100%',
                paddingHorizontal: 10,
            }}>
                <View style={[nstyles.nrow, { width: '100%' }]}>
                    {
                        indexDefault == -1 ? null :
                            <>
                                <ButtonCom
                                    onPress={() => onPressStarted(true)}
                                    Linear={true}
                                    sizeIcon={30}
                                    styleTouchable={{ flex: 1 }}
                                    txtStyle={{ color: colors.colorTextSelect }}
                                    style={{
                                        marginTop: Height(2), borderRadius: 6,
                                        paddingHorizontal: 20,
                                        backgroundColor: colors.white, width: '100%',
                                    }}
                                    text={'Quay lại'}
                                />
                                <View style={{ width: 10 }} />
                            </>
                    }
                    {
                        indexChoose == -1 ? null :
                            <ButtonCom
                                onPress={onPressStarted}
                                Linear={true}
                                sizeIcon={30}
                                styleTouchable={{ flex: 1 }}
                                txtStyle={{ color: colors.white }}
                                style={[stLogin.contentInput,
                                {
                                    marginTop: Height(2), borderRadius: 6,
                                    paddingHorizontal: 20,
                                    backgroundColor: colors.colorTextSelect, width: '100%',
                                }]}
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
