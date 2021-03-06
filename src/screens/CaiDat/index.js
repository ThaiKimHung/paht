import React, { Component } from 'react'
import { Image, Platform, Switch, Text, TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Utils from '../../../app/Utils'
import { HeaderCom, HeaderCus } from '../../../components'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { reSize, reText } from '../../../styles/size'
import { nstyles, nwidth, paddingTopMul, Width } from '../../../styles/styles'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appConfig } from '../../../app/Config'
import InputLogin from '../../../components/ComponentApps/InputLogin'
import { ROOTGlobal } from '../../../app/data/dataGlobal'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import InAppReview from 'react-native-in-app-review';
import { openSettings } from 'react-native-permissions'

const stSetting = StyleSheet.create({
    contentInput: {
        backgroundColor: 'transparent'
    },
    contentBtn: {
        backgroundColor: colors.greenButton,
        paddingHorizontal: 3,
        paddingVertical: 15,
        borderRadius: 6,
        marginHorizontal: 2,
        minWidth: 50
    },
    txtBtnCode: {
        textAlign: 'center',
        width: '100%',
        color: colors.white,
        fontWeight: 'bold'
    },
    btnSetting: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', padding: 10,
        backgroundColor: colors.white,
    }
});

class index extends Component {
    constructor(props) {
        super(props)
        this.configUpdate = Utils.getGlobal(nGlobalKeys.resconfig, {});
        this.state = {
            ruleSetting: [1, 2, 3, 4, 5, 6, 7, 8, 99, 100, 101, 102],
            dem: 0,
            ShowPassCode: true
        }
    }

    _setShowPass = () => {
        this.setState({ ShowPassCode: !this.state.ShowPassCode })
    }

    _renderMenu = (menu = 1) => {
        if (menu == 1) {
            return (
                <View key={index} style={{
                    width: '25%', alignItems: 'center',
                    justifyContent: 'center', marginTop: 5
                }}>
                    <TouchableOpacity
                        disabled={false}
                        activeOpacity={0.5}
                        style={[{
                            marginBottom: 0,
                            opacity: 1, alignItems: 'center', justifyContent: 'center',
                            height: Width(22),// nwidth() / (Platform.isPad ? 7 : 4),
                        }]}
                        onPress={() => this._goScreenTab(item, { title: item.name })}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={[colors.nocolor, colors.nocolor]}
                            style={[{ flex: 1, alignItems: 'center' }]}>
                            <View style={{ height: Width(12), width: Width(25), justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={item.linearColor}
                                    style={{ height: Width(12), width: Width(12), justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}
                                >
                                    <Image source={Images[`${item.icon}`]} style={[{ width: '50%', height: '60%' }]} resizeMode='contain' />
                                </LinearGradient>
                            </View>
                            <View style={{ height: Width(10), width: Width(25), alignItems: 'center', }}>
                                <Text style={[
                                    {
                                        fontSize: reText(12), color: colors.black, fontWeight: Platform.OS == 'ios' ? '600' : 'bold',
                                        width: reSize(78), textAlign: 'center',
                                        marginTop: 5
                                    }]}>
                                    {'Ti??u ?????'}
                                </Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View >
            )
        } else {
            return (
                <View key={index} style={{
                    width: '25%', alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    borderWidth: 1, borderColor: colors.white,
                }}>
                    <TouchableOpacity
                        disabled={false}
                        activeOpacity={0.5}
                        style={[{
                            marginBottom: 0,
                            opacity: 1, alignItems: 'center', justifyContent: 'center',
                            height: Width(22),// nwidth() / (Platform.isPad ? 7 : 4),
                        }]}
                        onPress={() => this._goScreenTab(item, { title: item.name })}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={[colors.nocolor, colors.nocolor]}
                            style={[{ flex: 1, alignItems: 'center' }]}>
                            <View style={{ height: Width(12), width: Width(25), justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={Images.icPaymenTt} style={[{ width: '50%', height: '60%' }]} resizeMode='contain' />
                            </View>
                            <View style={{ height: Width(10), width: Width(25), alignItems: 'center', }}>
                                <Text style={[
                                    {
                                        fontSize: reText(12), color: colors.black, fontWeight: Platform.OS == 'ios' ? '600' : 'bold',
                                        width: reSize(78), textAlign: 'center',
                                        marginTop: 5
                                    }]}>
                                    {'Ti??u ?????'}
                                </Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View >
            )
        }
    }

    onPressApi = (isLongPress = false) => {
        const { dem = 0 } = this.state
        if (dem > 0 && dem % 5 == 0) {
            if (isLongPress == true) {
                alert(Utils.getGlobal("ERROR_LOG:", "---"));
                return;
            }
            this.setState({ showInputCode: true });
        } else {
            Utils.openUrl(this.configUpdate.linkStore);
        }
    }
    onOpenLog = () => {
        if (this.state.PassCode === "vts@123") {
            Utils.navigate("Modal_NetworkLogger");
        }
    }

    onDanhGiaApp = () => {
        try {
            if (InAppReview.isAvailable()) {
                InAppReview.RequestInAppReview()
                    .then((hasFlowFinishingSuccessful) => {
                        //--TH??NH c??ng M??? POPUP ????nh gi?? trong APP, c?? ??i???u ki???n OS c??? th???. Ko h??? tr??? to??n booj
                        if (!hasFlowFinishingSuccessful || Platform.OS == 'ios')
                            Utils.openUrl(this.configUpdate.linkStore);
                    })
                    .catch((error) => {
                        //--C??C TH ???? qua store
                        Utils.openUrl(this.configUpdate.linkStore);
                    });
            } else
                Utils.openUrl(this.configUpdate.linkStore);
        } catch (error) {
            //--C??C TH ???? qua store
            Utils.openUrl(this.configUpdate.linkStore);
        }

    }

    renderSetting = (idRule) => {
        let { theme } = this.props
        switch (idRule) {
            case 1:
                return (
                    <View key={idRule}>
                        <View style={stSetting.btnSetting}>
                            <Image source={Images.icSettingTransparen} style={nstyles.nIcon28} />
                            <Text style={{ flex: 1, paddingLeft: 10, color: colors.black_80 }}>{'Trong su???t header trang ch???'}</Text>
                            <Switch value={theme.imgHeaderMenu} onValueChange={val => this.props.Set_Image_Header_Menu(val)} />
                        </View>
                        <Text style={{ fontSize: reText(12), padding: 10, lineHeight: 20 }}>
                            {'Ch???c n??ng n??y s??? l??m trong su???t header trang ch??? thay v??o ???? s??? th???y ???????c ???nh n???n b??n d?????i. ???nh n???n header n??y s??? thay ?????i t??? ?????ng. Ch???c n??ng ???nh n???n trang ch??? online s??? t???t n???u ch???c n??ng n??y ???????c b???t.'}
                        </Text>
                    </View>
                )
            case 2: {
                return (
                    <View key={idRule} style={{ opacity: theme.imgHeaderMenu ? 0.5 : 1, }} pointerEvents={theme.imgHeaderMenu ? 'none' : 'auto'}>
                        <View style={stSetting.btnSetting}>
                            <Image source={Images.icSettingBgr} style={nstyles.nIcon28} />
                            <Text style={{ flex: 1, paddingLeft: 10, color: colors.black_80 }}>???nh n???n trang ch??? online</Text>
                            <Switch value={theme.backGroundOnline} onValueChange={val => this.props.Set_Background_Online(val)} />
                        </View>
                        <Text style={{ fontSize: reText(12), padding: 10, lineHeight: 20 }}>{'Ch???c n??ng ?????i ???nh n???n trang ch??? s??? b???t khi ???nh n???n trang ch??? online ???????c t???t.'}</Text>
                    </View>
                )
            }
            case 3: {
                return (
                    <TouchableOpacity key={idRule} style={{ opacity: theme.backGroundOnline ? 0.5 : 1 }} disabled={theme.backGroundOnline} activeOpacity={0.5} onPress={() => { Utils.goscreen(this, 'scChangeBgr') }}>
                        <View style={stSetting.btnSetting}>
                            <Image source={Images.icSettingBgr} style={nstyles.nIcon28} />
                            <Text style={{ flex: 1, paddingLeft: 10, color: colors.black_80 }}>?????i h??nh n???n trang ch???</Text>
                            <Image source={Images.icSettingArowRight} style={[nstyles.nIcon18, { tintColor: colors.black_80 }]} resizeMode='contain' />
                        </View>
                    </TouchableOpacity>
                )
            }
            case 4: {
                return (
                    <TouchableOpacity key={idRule} activeOpacity={0.5} onPress={() => { Utils.goscreen(this, 'scChangeHeaderHome') }}>
                        <View style={[stSetting.btnSetting, { borderTopLeftRadius: 15, borderTopRightRadius: 15 }]}>
                            <Image source={Images.icSettingColor} style={nstyles.nIcon28} />
                            <Text style={{ flex: 1, paddingLeft: 10, color: colors.black_80 }}>?????i m??u giao di???n</Text>
                            <Image source={Images.icSettingArowRight} style={[nstyles.nIcon18, { tintColor: colors.black_80 }]} resizeMode='contain' />
                        </View>
                    </TouchableOpacity>
                )
            }
            case 5: {
                return (
                    <View key={idRule} style={{ marginTop: 10 }}>
                        <View style={stSetting.btnSetting}>
                            <Image source={Images.icSettingTypeMenu} style={nstyles.nIcon28} resizeMode='contain' />
                            <Text style={{ flex: 1, paddingLeft: 10, color: colors.black_80 }}>{'Ki???u menu'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', padding: 10, backgroundColor: colors.BackgroundHome, }}>
                            <TouchableOpacity onPress={() => this.props.Set_Type_Menu(1)} style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                                <View key={index} style={{
                                    width: nwidth() / 4, alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(255,255,255,0.7)',
                                    borderWidth: 1, borderColor: colors.grayLight,
                                    marginHorizontal: 10
                                }}>
                                    <View
                                        style={[{
                                            marginBottom: 0,
                                            opacity: 1, alignItems: 'center', justifyContent: 'center',
                                            height: Width(22),// nwidth() / (Platform.isPad ? 7 : 4),
                                        }]}
                                    >
                                        <LinearGradient
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={[colors.nocolor, colors.nocolor]}
                                            style={[{ flex: 1, alignItems: 'center' }]}>
                                            <View style={{ height: Width(12), width: Width(25), justifyContent: 'center', alignItems: 'center' }}>
                                                <Image source={Images.icHomeMenu} style={[{ width: '50%', height: '60%' }]} resizeMode='contain' />
                                            </View>
                                            <View style={{ height: Width(10), width: Width(25), alignItems: 'center', }}>
                                                <Text style={[
                                                    {
                                                        fontSize: reText(12), color: colors.black, fontWeight: Platform.OS == 'ios' ? '600' : 'bold',
                                                        width: reSize(78), textAlign: 'center',
                                                        marginTop: 5
                                                    }]}>
                                                    {'Ti??u ?????'}
                                                </Text>
                                            </View>
                                        </LinearGradient>
                                    </View>
                                    {
                                        theme.typeMenu == 1 ? <Icon name={'check'} size={30} style={{ position: 'absolute', bottom: 0, right: 0 }} color={'green'} /> : null
                                    }
                                </View >
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.Set_Type_Menu(2)} style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                                <View key={index} style={{
                                    width: nwidth() / 4, alignItems: 'center',
                                    justifyContent: 'center', marginTop: 5,
                                    marginHorizontal: 10,
                                }}>
                                    <View style={[{ opacity: 1, alignItems: 'center', justifyContent: 'center', height: Width(22), }]} >
                                        <LinearGradient
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={[colors.nocolor, colors.nocolor]}
                                            style={[{ flex: 1, alignItems: 'center' }]}>
                                            <View style={{ height: Width(12), width: Width(25), justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                                <LinearGradient
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    colors={this.props.theme.colorLinear.color}
                                                    style={{ height: Width(12), width: Width(12), justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}
                                                >
                                                    <Image source={Images.icHomeMenu} style={[{ width: '50%', height: '60%' }]} resizeMode='contain' />
                                                </LinearGradient>
                                            </View>
                                            <View style={{ height: Width(10), width: Width(25), alignItems: 'center', }}>
                                                <Text style={[
                                                    {
                                                        fontSize: reText(12), color: colors.black, fontWeight: Platform.OS == 'ios' ? '600' : 'bold',
                                                        width: reSize(78), textAlign: 'center',
                                                        marginTop: 5
                                                    }]}>
                                                    {'Ti??u ?????'}
                                                </Text>
                                            </View>
                                        </LinearGradient>
                                    </View>
                                    {
                                        theme.typeMenu == 2 ? <Icon name={'check'} size={30} style={{ position: 'absolute', bottom: 0, right: 0 }} color={'green'} /> : null
                                    }
                                </View >
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: reText(12), padding: 10, lineHeight: 20 }}>{'?????i ki???u hi???n th??? t???ng ch???c n??ng tr??n menu ch??nh.'}</Text>
                    </View>
                )
            }
            case 6: {
                return (
                    <TouchableOpacity key={idRule} activeOpacity={0.5} onPress={() => { Utils.goscreen(this, 'Modal_HuongDanVT') }}>
                        <View style={stSetting.btnSetting}>
                            <Image source={Images.icSettingHuongDan} style={nstyles.nIcon28} />
                            <Text style={{ flex: 1, paddingLeft: 10, color: colors.black_80 }}>Gi???i thi???u v?? h?????ng d???n</Text>
                            <Image source={Images.icSettingArowRight} style={[nstyles.nIcon18, { tintColor: colors.black_80 }]} resizeMode='contain' />
                        </View>
                    </TouchableOpacity>
                )
            }
            case 7:
                return (
                    <View key={idRule}>
                        <View style={stSetting.btnSetting}>
                            <Image source={Images.icSettingTransparen} style={nstyles.nIcon28} />
                            <Text style={{ flex: 1, paddingLeft: 10, color: colors.black_80 }}>{'Trong su???t v??ng c??c ch???c n??ng'}</Text>
                            <Switch value={theme.transparentMenuCongAn} onValueChange={val => this.props.Set_Transparent_Area_Menu(val)} />
                        </View>
                        <Text style={{ fontSize: reText(12), padding: 10, lineHeight: 20 }}>
                            {'L??m trong su???t n???n c???a v??ng ch???a c??c ch???c n??ng ??? menu trang ch???. D??ng cho menu c???a c??ng an.'}
                        </Text>
                    </View>
                )
            case 8: {
                return (
                    <TouchableOpacity key={idRule} activeOpacity={0.5} onPress={this.onDanhGiaApp}>
                        <View style={stSetting.btnSetting}>
                            <Image source={Images.icRateApp} style={nstyles.nIcon28} />
                            <Text style={{ flex: 1, paddingLeft: 10, color: colors.black_80 }}>X???p h???ng ???ng d???ng</Text>
                            <Image source={Images.icSettingArowRight} style={[nstyles.nIcon18, { tintColor: colors.black_80 }]} resizeMode='contain' />
                        </View>
                    </TouchableOpacity>
                )
            }
            case 99: {
                return (
                    <TouchableOpacity key={idRule} activeOpacity={0.5} onPress={() => {
                        Utils.onShare(`Xin ch??o b???n, h??y t???i v?? c??i ?????t ???ng d???ng ${appConfig.TenAppHome} ????? c???p nh???t nh???ng th??ng tin t??? ch??nh quy???n v?? s??? d???ng c??c t??nh n??ng mi???n ph??`, appConfig.linkWeb + "vi/tai-app")
                    }}>
                        <View style={stSetting.btnSetting}>
                            <Image source={Images.icShareApp} style={nstyles.nIcon28} />
                            <Text style={{ flex: 1, paddingLeft: 10, color: colors.black_80 }}>Gi???i thi???u v???i b???n b??</Text>
                            <Image source={Images.icSettingArowRight} style={[nstyles.nIcon18, { tintColor: colors.black_80 }]} resizeMode='contain' />
                        </View>
                    </TouchableOpacity>
                )
            }

            case 100: {
                return (
                    <TouchableOpacity key={idRule} activeOpacity={0.5} onPress={() => Utils.goscreen(this, 'ManHinh_GopYIOC')}>
                        <View style={stSetting.btnSetting}>
                            <Image source={Images.icGopYIOC} style={nstyles.nIcon28} />
                            <Text style={{ flex: 1, paddingLeft: 10, color: colors.black_80 }}>G??p ?? ???ng d???ng</Text>
                            <Image source={Images.icSettingArowRight} style={[nstyles.nIcon18, { tintColor: colors.black_80 }]} resizeMode='contain' />
                        </View>
                    </TouchableOpacity>
                )
            }
            case 101: {
                return (
                    <TouchableOpacity key={idRule} activeOpacity={0.5} onPress={() => openSettings()}>
                        <View style={[stSetting.btnSetting, { paddingVertical: 0 }]}>
                            <Image source={Images.icSwitchThongbao} style={nstyles.nIcon28} />
                            <Text style={{ flex: 1, paddingLeft: 10, color: colors.black_80 }}>Nh???n th??ng b??o</Text>
                            <Image source={Images.icSwitchActive} style={[nstyles.nIcon50, {}]} resizeMode='contain' />
                        </View>
                    </TouchableOpacity>
                )
            }
            case 102: {
                return (
                    <View key={idRule} >
                        <View style={[stSetting.btnSetting, { borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }]}>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ dem: this.state.dem + 1 })}>
                                <Image source={Images.icVersion} style={nstyles.nIcon28} />
                            </TouchableOpacity>
                            <Text style={{ flex: 1, paddingLeft: 10, color: colors.black_80 }}>Phi??n b???n</Text>
                            <TouchableOpacity activeOpacity={1} onPress={this.onPressApi} onLongPress={() => this.onPressApi(true)}>
                                <Text style={{ color: colors.black_80 }}>
                                    {appConfig.version + ' - ' + appConfig.mode}{<Text
                                        style={{ fontWeight: 'bold', color: this.configUpdate.isUpdate ? colors.yellowishOrange : colors.greenishTeal }}>
                                        {this.configUpdate.isUpdate ? ' (C???p nh???t)' : ' (M???i nh???t)'}</Text>}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
            default:
                break;
        }

    }

    renderLine = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 1, backgroundColor: colors.white, paddingHorizontal: 5 }}>
                <View style={{ height: 1, backgroundColor: colors.white, flex: 1 }} />
                <View style={{ height: 1, backgroundColor: colors.black_10, flex: 8 }} />
            </View>

        )
    }
    render() {
        const { theme } = this.props
        return (
            <View style={{ flex: 1 }}>
                {/* {HEADER} */}
                <HeaderCus
                    title={'C??i ?????t'}
                    styleTitle={{ color: 'white' }}
                />
                {/* {BODY} */}

                <ScrollView contentContainerStyle={{ paddingBottom: Platform.OS == 'android' ? 95 : 100 }} style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                    <View style={{ padding: 13 }}>
                        {
                            this.state.ruleSetting.map((item, index) => {
                                return (
                                    <>
                                        {this.renderSetting(item, index)}
                                        {index == this.state.ruleSetting.length - 1 ? null :
                                            this.renderLine()}
                                    </>
                                )
                            })
                        }

                        {
                            !this.state.showInputCode ? null :
                                <View>
                                    <View style={[stSetting.btnSetting, { borderRadius: 15, marginTop: 10 }]}>
                                        <View style={{ flex: 1 }}>
                                            <InputLogin
                                                Fcref={refs => this.refPass = refs}
                                                value={this.state.PassCode}
                                                icon={Images.icPass}
                                                icShowPass={true}
                                                isShowPassOn={this.state.ShowPassCode}
                                                iconShowPass={this.state.ShowPassCode == true ? Images.icHidePass : Images.icShowPass}
                                                showIcon={true}
                                                secureTextEntry={this.state.ShowPassCode}
                                                placeholder={"Nh???p code b???o m???t"}
                                                setShowPass={this._setShowPass}
                                                onChangeText={text => this.setState({ PassCode: text.trim() })}
                                                customStyle={stSetting.contentInput}
                                                colorUnline={colors.brownGreyThree || 'transparent'}
                                                colorUnlineFoCus={"red" || 'transparent'}
                                                placeholderTextColor={colors.brownGreyTwo}
                                                styleInput={{ color: "red" }}
                                                colorPassOn={"red"}
                                            />
                                        </View>
                                        <TouchableOpacity style={stSetting.contentBtn}
                                            onPress={this.onOpenLog}>
                                            <Text style={stSetting.txtBtnCode}>Nh???p</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                        }
                    </View>
                    <Text style={{ textAlign: "center", fontSize: reText(12), marginHorizontal: 50 }}>
                        {`??? Viettel Information and Communications Technology Solutions Center`}
                    </Text>
                </ScrollView>
            </View >
        )
    }
}

const mapStateToProps = state => ({
    theme: state.theme
});

export default Utils.connectRedux(index, mapStateToProps, true)
