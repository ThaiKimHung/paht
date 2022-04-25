import React, { Component, Fragment } from 'react';
import { View, Text, Image, ImageBackground, Platform, ScrollView, Linking, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../../../styles';
import { nstyles, paddingTopMul, Height, paddingBotX } from '../../../styles/styles';
import Utils from '../../../app/Utils';
import Avatar from '../Home/components/Avatar';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { Images } from '../../images';
import { appConfig } from '../../../app/Config';
import { sizes, reText } from '../../../styles/size';
import { ROOTGlobal } from '../../../app/data/dataGlobal'
import { nkey } from '../../../app/keys/keyStore';
import LinearGradient from 'react-native-linear-gradient';
// ManHinh_TrangChu: TabBottom,
//     ManHinh_Warning: TabBottomWarning,

const titleMenuDefault = 'Phản ánh tố giác,Thông tin từ chính quyền,Clip tuyên truyền,Thông báo,Hỗ trợ khẩn cấp, Cài đặt'

class Drawer extends Component {
    constructor(props) {
        super(props);
        this.icMenuConfig = Utils.getGlobal(nGlobalKeys.LinkIcons, '').split(',');
        this.listTitleMenu = Utils.getGlobal(nGlobalKeys.listTitleMenu, titleMenuDefault).split('|');
        this.menu = Utils.getGlobal(nGlobalKeys.objMenu, [])
        this.state = {
            // tabIndex: Utils.getGlobal(nGlobalKeys.tabIndex, '')
            MaAppCanBoDVC: [],
            menuDrawer: [],
            menuAdmin: [],
            menuCD: [],
        };
        ROOTGlobal.dataGlobal._ReLoadMenuDrawer = this._GetMaAppCanBo
    }

    _goScreenTab = (item, param = {}) => () => {
        // Utils.setGlobal(nGlobalKeys.tabIndex, item.id)
        Utils.toggleDrawer(this, true);
        // if (item.id == 4) {
        //     Utils.nlog("vao onPress cổng tông tin -----")
        //     let result = Utils.openUrl('tayninh.app://tayninh');
        //     if (!result) {
        //         // setTimeout(() => {
        //         if (Platform.OS == 'ios')
        //             Linking.openURL('https://apps.apple.com/vn/app/c%E1%BB%95ng-th%C3%B4ng-tin-t%E1%BB%89nh-t%C3%A2y-ninh/id1475070726');
        //         else {
        //             Utils.nlog("vao linking tay ninh android")
        //             Linking.openURL('https://play.google.com/store/apps/details?id=com.apptayninhent')
        //         }
        //     }
        // }
        // Utils.setGlobal(nGlobalKeys.titleForm, param.title);
        // if (item.id == 5) { //ID: 5 là Tuyên truyền
        //     if (ROOTGlobal.dataGlobal._onLoadTuyenTruyen) {
        //         ROOTGlobal.dataGlobal._onLoadTuyenTruyen();
        //     }
        // }
        if (item.id == 12) {
            if (Platform.OS == 'android') {
                Linking.openURL('market://details?id=com.hopkhonggiaysonganhtn')
            } else {
                Linking.openURL('https://itunes.apple.com/us/app/expo-client/id1460357688?mt=8')
            }
            return
        }
        if (item.id == 1) {
            // APP Dieu Hanh
            ROOTGlobal.dataGlobal._XuLyPhanAnh(2)
            return;
        }
        if (item.id == 2) {
            // APP CD
            Utils.goscreen(this, 'ManHinh_TrangChu')
            return;
        }
        if (item.linkWeb != "" && item.linkWeb) {
            // Utils.openUrl(item.linkWeb);
            Utils.openWeb(this, item.linkWeb)
        }
        if (item.goscreen == '') {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Chức năng đang phát triển', 'Xác nhận')
            return
        }
        Utils.goscreen(this, item.goscreen);
    }

    componentDidMount() {
        this._GetMaAppCanBo()
    }
    _GetMaAppCanBo = async () => {
        let userSSO = await Utils.ngetStore(nkey.InfoUserSSO, [])
        Utils.nlog('user', userSSO)
        userSSO = {
            AppCanBo: [
                {
                    "Ten": "Họp Không Giấy",
                    "Ma": "HKG"
                },
                {
                    "Ten": "Quản lý đất đai",
                    "Ma": "ILIS"
                },
                {
                    "Ten": "Điều hành",
                    "Ma": "IOC"
                },
                {
                    "Ten": "Tây Ninh G",
                    "Ma": "TNG"
                }
            ]
        }
        let ListMenuAdmin = [], ListMenuCD = []
        if (userSSO && userSSO.AppCanBo) {
            let AppCanBo = userSSO.AppCanBo
            if (AppCanBo.length > 0) {
                for (let i = 0; i < this.menu.length; i++) {
                    const item = this.menu[i];
                    if (item.code == '' && item.hasOwnProperty('code')) {
                        ListMenuCD.push(item)
                    } else {
                        for (let j = 0; j < AppCanBo.length; j++) {
                            const element = AppCanBo[j];
                            if (item.code == element.Ma && item.hasOwnProperty('code')) {
                                ListMenuAdmin.push(item)
                            }
                        }
                    }
                }
            } else {
                for (let i = 0; i < this.menu.length; i++) {
                    const item = this.menu[i];
                    if (item.code == '' && item.hasOwnProperty('code')) {
                        ListMenuCD.push(item)
                    }
                }
            }
            this.setState({ MaAppCanBoDVC: userSSO.AppCanBo, menuAdmin: ListMenuAdmin, menuCD: ListMenuCD })
        } else {
            for (let i = 0; i < this.menu.length; i++) {
                const item = this.menu[i];
                if (item.code == '' && item.hasOwnProperty('code')) {
                    ListMenuCD.push(item)
                }
            }
            this.setState({ MaAppCanBoDVC: [], menuAdmin: ListMenuAdmin, menuCD: ListMenuCD })
        }
    }

    _renderMenu = (item, index, typeMenu = 1, isCD = false) => {
        let menuName = this.listTitleMenu[index] ? this.listTitleMenu[index] : item.name;
        // let menuDisable = item.id == 11 || item.id == 12;
        // let iconSourceMenu = this.icMenuConfig[index - 1] ? { uri: (appConfig.domain + this.icMenuConfig[index]) } : item.icon;
        // let iconDefSourceMenu = item.icon;
        // if (typeMenu == 2) { //MenuNew
        //     if (!(item.isShow == 1 || item.isShow == 3)) //0: Ẩn, 1: Hiển thị all, 2: Hiện thị MenuHome, 3: Hiển thị MenuDrawer
        //         return null;
        //     menuDisable = item.id == 0 || item.id == -99;
        //     menuName = item.name;
        //     iconDefSourceMenu = Images[item.icon] ? Images[item.icon] : Images.icPhotoBlack;
        //     iconSourceMenu = item.linkicon == '' || !item.linkicon ? iconDefSourceMenu : { uri: appConfig.domain + item.linkicon };
        // }
        return (
            <Fragment key={index + '_' + typeMenu}>
                {index == 0 && typeMenu == 2 ? this._renderMenu(this.menu[0], 0) : null}
                <View>
                    <TouchableOpacity
                        disabled={false}
                        style={[{ flexDirection: 'row', paddingVertical: 5, opacity: 1 }]}
                        onPress={this._goScreenTab(item, { title: menuName })}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={isCD ? [colors.colorBlueBT, colors.colorBlue] : colors.colorLinearButton}
                            style={{ paddingHorizontal: 5, paddingVertical: 5, borderRadius: 5, marginRight: 10 }}
                        >
                            <Image
                                // source={iconSourceMenu}
                                source={item.icon}
                                style={[nstyles.nIcon24, { alignSelf: 'center', }]} />
                        </LinearGradient>
                        <Text style={{ fontSize: reText(15), marginTop: 5 }}>{item.name}</Text>
                    </TouchableOpacity>
                    <View style={{ height: 1, width: '100%', backgroundColor: colors.black_11, marginVertical: 8 }} />
                </View>
            </Fragment>
        )
    }


    render() {
        const { nrow, nmiddle } = nstyles;
        let isMenuNew = Utils.getGlobal(nGlobalKeys.key_menuHome, '') == 'ManHinh_HomeNew';
        return (
            <View style={{ backgroundColor: colors.white, flex: 1 }}>
                <View style={{ flex: 1, paddingBottom: paddingBotX + 10 }}>
                    <View style={{ backgroundColor: colors.colorTextSelect }}>
                        <ImageBackground
                            style={{}}
                            // defaultSource={Images.icBGDrawer}
                            source={{ uri: Utils.getGlobal(nGlobalKeys.SideMenu) }}
                            resizeMode='cover'
                        >
                            <View style={{ padding: 20 }}>
                                <View style={{ marginTop: 20, alignItems: 'flex-start' }}>
                                    <Avatar nthis={this} styImage={nstyles.nAva50} />
                                </View>
                            </View>
                            <View style={{ width: '100%', height: 50, marginHorizontal: 15, flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => Utils.goscreen(this, 'ManHinh_Home')} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.colorBlue, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={Images.icHomeMenu} style={{ width: 25, height: 25 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_Notification')} style={{ marginLeft: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.colorBlue, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={Images.icMenuThongBao} style={{ width: 25, height: 25 }} />
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </View>
                    <Text style={{ fontSize: sizes.sText17, fontWeight: 'bold', padding: 15 }}>{Utils.getGlobal(nGlobalKeys.TenApp, '')}</Text>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 15 }}>
                        {/* {
                            isMenuNew ?
                                menuNew.map((item, index) => this._renderMenu(item, index, 2)) :
                                // this.state.menuDrawer.map((item, index) => this._renderMenu(item, index))
                                // <FlatList
                                //     extraData={this.state}
                                //     data={this.state.menuDrawer}
                                //     renderItem={({ item, index }) => this._renderMenu(item, index)}
                                //     keyExtractor={(item, index) => index.toString()}
                                // />
                                <Fragment>
                                    {
                                        this.state.menuAdmin.length > 0 ? <Text style={{ fontSize: sizes.sText17, fontWeight: 'bold', paddingVertical: 10 }}>{'Cán bộ'}</Text> : null
                                    }

                                    <FlatList
                                        extraData={this.state}
                                        data={this.state.menuAdmin}
                                        renderItem={({ item, index }) => this._renderMenu(item, index)}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                    {
                                        this.state.menuCD.length > 0 ? <Text style={{ fontSize: sizes.sText17, fontWeight: 'bold', paddingVertical: 10 }}>{'Cộng đồng'}</Text> : null
                                    }
                                    <FlatList
                                        extraData={this.state}
                                        data={this.state.menuCD}
                                        renderItem={({ item, index }) => this._renderMenu(item, index, 1, true)}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </Fragment>
                        } */}
                        <Fragment>
                            {/* {
                                this.state.menuAdmin.length > 0 ? <Text style={{ fontSize: sizes.sText17, fontWeight: 'bold', paddingVertical: 10 }}>{'Cán bộ'}</Text> : null
                            }
                            <FlatList
                                extraData={this.state}
                                data={this.state.menuAdmin}
                                renderItem={({ item, index }) => this._renderMenu(item, index)}
                                keyExtractor={(item, index) => index.toString()}
                            /> */}
                            {
                                this.state.menuCD.length > 0 ? <Text style={{ fontSize: sizes.sText17, fontWeight: 'bold', paddingVertical: 10 }}>{'Cộng đồng'}</Text> : null
                            }
                            <FlatList
                                extraData={this.state}
                                data={this.state.menuCD}
                                renderItem={({ item, index }) => this._renderMenu(item, index, 1, true)}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </Fragment>
                        <Text style={{ fontSize: sizes.sText12, color: colors.black_30, marginTop: 30 }}>
                            {appConfig.version + ' - ' + appConfig.mode}
                        </Text>
                    </ScrollView>
                </View>
            </View>
        );
    }
}
export default Drawer;
