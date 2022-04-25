import React, { Component } from 'react'
import { Text, TouchableOpacity, View, Image, Keyboard, Platform, ScrollView, TextInput, StatusBar } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Utils, { icon_typeToast } from '../../../app/Utils'
import { colors } from '../../../styles'
import { heightStatusBar, nstyles, nwidth, paddingTopMul } from '../../../styles/styles'
import { Images } from '../../images'
import analytics from '@react-native-firebase/analytics';
import KeyAnalytics from '../../../app/KeyAnalytics';
import { nGlobalKeys } from '../../../app/keys/globalKey'
import { SaveTokenHKG } from '../../../srcHKG/api/saveToken'
import { ListEmpty } from '../../../components'
import { nkey } from '../../../app/keys/keyStore'
import { ROOTGlobal } from '../../../app/data/dataGlobal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImageCus from '../../../components/ImageCus'
import { appConfig } from '../../../app/Config'

const ListDeXuat = ["Phản ánh", "Hỏi đáp", "Camera an ninh"]

export class ModalTimKiemChung extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            resultFilter: []
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.InputSearch.focus()
        }, 100);
    }

    // XỬ LÝ CHUYỂN MÀN HÌNH BUTTON MENU
    _goScreenTab = async (item, param = {}) => {
        //analytic
        await analytics().logEvent(KeyAnalytics.item_menu_press, {
            "data": item.name || item
        })
        //getdata
        if (item.paramsChild && !this.props.auth.tokenCD) {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn cần đăng nhập để gửi phản ánh dịch bệnh", "Xác nhận");
            return;
        }
        const { child = [] } = item;
        if (child && child.length > 0) {
            Utils.navigate("ModalMenuChild", {
                data: item,
                _goScreenTab: this._goScreenTab
            });
        } else {
            Utils.setGlobal(nGlobalKeys.titleForm, param.title);
            if ((item.goscreen == 'ManHinh_ViecTimNguoi' || item.goscreen == 'ManHinh_NguoiTimViec') && !this.props.auth.tokenCD) {
                Utils.showToastMsg('Thông báo', `Bạn cần đăng nhập để sử dụng chức năng ${item.name.toLowerCase()}.`, icon_typeToast.warning, 2000)
                Utils.navigate('login')
                return
            }
            if (item.code == 'HKG') {
                SaveTokenHKG.saveToken('hkg', "0FiDNkSIQiRw94f1UmmZ6P4lwW3XqJ6hce7jY2NUrSMdXYeJs0");
                // 0FiDNkSIQiRw94f1UmmZ6P4lwW3XqJ6hce7jY2NUrSMdXYeJs0
            }
            Utils.nlog('LOG [CLICK CAM]', item, Utils.getGlobal(nGlobalKeys.OnOffCamera, 0))
            if (item.code == "CAM" && Utils.getGlobal(nGlobalKeys.OnOffCamera, 0) != 0) {
                Utils.showMsgBoxOK(this, "Thông báo", "Bạn cần đăng nhập để vào camera", "Xác nhận");
                return;
            }

            if (item.code == 'CHAT') {
                if (this.props.auth.tokenCHAT) {
                    this.props.CheckConnectChat()
                }
                if (this.props.auth.tokenCHAT != '') {
                    StatusBar.setBarStyle('dark-content')
                    // if (this.props.auth.listObjectRuleDH.find(item => item.code == 'CHAT')) {
                    //     Utils.setGlobal(nGlobalKeys.loginToken, this.props.auth.tokenDH, AppCodeConfig.APP_ADMIN)
                    //     Utils.setGlobal(nGlobalKeys.Id_user, this.props.auth.userDH.UserID || this.props.auth.userDH.Id, AppCodeConfig.APP_ADMIN)
                    //     await Utils.nsetStore(nkey.loginToken, this.props.auth.tokenDH, AppCodeConfig.APP_ADMIN)
                    //     await Utils.nsetStore(nkey.Id_user, this.props.auth.userDH.UserID || this.props.auth.userDH.Id, AppCodeConfig.APP_ADMIN);
                    // }
                    // else
                    // {
                    //     Utils.showMsgBoxOK(this, "Thông báo", "Bạn cần có quyền để vào chức năng này", "Xác nhận");
                    // }
                    Utils.goscreen(this, item.goscreen);
                } else {
                    Utils.showMsgBoxOK(this, "Thông báo", "Bạn cần đăng nhập để vào chat", "Xác nhận");
                }
                return;
            }
            //--Các TH còn lại
            if (item.goscreen) {
                item.paramsChild ? Utils.goscreen(this, item.goscreen, { ...JSON.parse(item.paramsChild), keyMenuChild: item.keyMenuChild, title: item.name }) :
                    Utils.goscreen(this, item.goscreen, { ...item.params, keyMenuChild: item.keyMenuChild, title: item.name });
            } else {
                // Utils.openUrl(item.linkWeb)
                //TH có 2 linkWeb thì linkWeb: là IOS, linkWeb2: Android. Còn 1 link thì chạy chung linkWeb.
                //--isLinking để biết đó có phải là link Cần mở deeplink hay ko?
                if (item.linkWeb2 && item.linkWeb2 != "" && Platform.OS == 'android')
                    Utils.openWeb(this, item.linkWeb2, { isLinking: item.isLinking, isShowMenuWeb: item.isShowMenuWeb, title: item.name });
                else
                    if (item.linkWeb && item.linkWeb != "")
                        Utils.openWeb(this, item.linkWeb, { isLinking: item.isLinking, isShowMenuWeb: item.isShowMenuWeb, title: item.name });
            }

            //--
            if (item.Developer && item.Developer?.length != 0) {
                if (item.Developer.length == 2)
                    Utils.showMsgBoxOK(this, "Thông báo", item.Developer[0], item.Developer[1]);
                else
                    Utils.showMsgBoxYesNo(this, "Thông báo", item.Developer[0], item.Developer[1], item.Developer[2], () => Utils.goscreen(this, 'ManHinh_Home'));

            }
        }
    }

    goScreen = (item) => {
        Utils.goscreen(this, item.goscreen);
    }

    onSearch = () => {
        const { search } = this.state
        if (search.length > 0) {
            const { listObjectRuleCD = [], listObjectRuleDichBenh = [], listMenuShowDH = [] } = this.props.auth
            let resFilterCD = listObjectRuleCD.filter(item => Utils.removeAccents(item?.name).toUpperCase().includes(Utils.removeAccents(search.toUpperCase())))
            let resFilterDB = listObjectRuleDichBenh.filter(item => Utils.removeAccents(item?.name).toUpperCase().includes(Utils.removeAccents(search.toUpperCase())))
            let resFilterDH = listMenuShowDH.filter(item => Utils.removeAccents(item?.name).toUpperCase().includes(Utils.removeAccents(search.toUpperCase())))
            const result = [...resFilterCD, ...resFilterDB, ...resFilterDH]
            this.setState({ resultFilter: result })
        } else {
            this.setState({ resultFilter: [] })
        }

    }

    render() {
        let { search, resultFilter } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <LinearGradient
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    colors={this.props.theme.colorLinear.color}
                    style={{ paddingBottom: 10, justifyContent: 'center', paddingTop: Platform.OS == 'android' ? paddingTopMul() + heightStatusBar() : paddingTopMul(), paddingLeft: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, borderRadius: 5, flexDirection: 'row', backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }}>
                            <TextInput
                                ref={ref => this.InputSearch = ref}
                                placeholder='Tìm kiếm tính năng...'
                                value={search}
                                style={{ padding: 10, backgroundColor: colors.white, flex: 1, borderRadius: 5 }}
                                onChangeText={text => this.setState({ search: text }, this.onSearch)}
                            />{
                                search.length > 0 ?
                                    <TouchableOpacity onPress={() => this.setState({ search: '' }, this.onSearch)} style={{ padding: 8 }}>
                                        <Image source={Images.icClose} style={[nstyles.nIcon20, { tintColor: colors.brownGreyThree }]} />
                                    </TouchableOpacity> : null
                            }
                        </View>
                        <TouchableOpacity onPress={() => { Keyboard.dismiss(), Utils.goback(this) }} style={{ padding: 10 }}>
                            <Text style={{ color: colors.white, fontWeight: 'bold' }}>{'Đóng'}</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
                <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                    {
                        resultFilter.length > 0 && search.length > 0 ?
                            <>
                                <Text style={{ fontWeight: 'bold', color: colors.brownGreyTwo, padding: 10 }}>{`Có ${resultFilter.length} kết quả được tìm thấy`}</Text>
                                {resultFilter.map((item, index) => {
                                    return (
                                        <TouchableOpacity style={{ paddingHorizontal: 10, marginTop: 2, backgroundColor: colors.white }} key={index} onPress={() => { this._goScreenTab(item, { title: item.name }) }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5 }}>
                                                <LinearGradient
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    colors={item.linearColor}
                                                    style={{ padding: 10, borderRadius: 5 }}
                                                >
                                                    <ImageCus
                                                        defaultSourceCus={Images[item.icon]}
                                                        source={{ uri: Utils.isUrlCus(item.linkicon) != "" || item.linkicon == "" ? item?.linkicon : (appConfig.domain + item.linkicon) }}
                                                        style={[nstyles.nIcon28]}
                                                    />
                                                </LinearGradient>
                                                <Text style={{ flex: 1, paddingHorizontal: 10 }}>{item?.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                            </> : resultFilter.length == 0 && search.length == 0 ? <View style={{ padding: 10 }}>
                                <Text style={{ fontWeight: 'bold', color: colors.brownGreyTwo }}>Gợi ý</Text>
                                <View style={{ flexWrap: 'wrap', width: nwidth() - 20, flexDirection: 'row' }}>
                                    {ListDeXuat.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => this.setState({ search: item }, this.onSearch)}
                                                key={index} style={{ padding: 8, backgroundColor: colors.grayLight, margin: 5, borderRadius: 15 }}>
                                                <Text style={{ color: colors.white }}>{item}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View> : <ListEmpty textempty={'Không có dữ liệu'} />
                    }
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,
    menu: state.menu
});
export default Utils.connectRedux(ModalTimKiemChung, mapStateToProps, true);
