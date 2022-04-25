import React, { Component } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { nstyles, paddingTopMul, Height, nwidth, Width, paddingBotX } from '../../../styles/styles';
import { colors, sizes } from '../../../styles';
import Utils from '../../../app/Utils';
import { Images } from '../../images';
import Avatar from './components/Avatar';
import apis from '../../apis';
import moment from 'moment';
import { appConfig } from '../../../app/Config';
import { IsLoading } from '../../../components';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { reSize, reText } from '../../../styles/size';
import ButtonCom from '../../../components/Button/ButtonCom';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { FlatList } from 'react-native-gesture-handler';
import { GetDeailTrangTinh } from '../../apis/apiapp';
import { nkey } from '../../../app/keys/keyStore';
import Slogan from './Slogan';
import { nkeyCache } from '../../../app/keys/nkeyCache';

// import { Images } from '../../images';
const styler = StyleSheet.create({
    txtH2: {
        color: colors.white,
        fontWeight: 'bold'
    },
    txtH1: {
        fontSize: sizes.reSize(16),
        color: colors.white,
        fontWeight: 'bold'
    },
    borderMenu: {
        paddingTop: 5,
        borderColor: colors.whiteTwo,
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 5
    }
})

const titleMenuDefault = 'Phản ánh tố giác,Thông tin cảnh báo,Thông tin tuyên truyền,Thông báo,Hỗ trợ khẩn cấp, Cài đặt'

class HomeDrawerNew extends Component {
    constructor(props) {
        super(props);
        this.colorBackgroundMenu = Utils.getGlobal(nGlobalKeys.colorBackgroundMenu, 'rgba(255,255,255,0.6)');
        this.colorTextMenu = Utils.getGlobal(nGlobalKeys.colorTextMenu, colors.black)
        this.dataSlogan = Utils.getGlobal(nGlobalKeys.dataSlogan, undefined);
        this.menu = Utils.getGlobal(nGlobalKeys.objMenu, []);
        this.state = {
            dataThoiTiet: [],
            ImageBG: Utils.getCacheURL(nkeyCache.imgBgrHomeCD),
            dataHuongDan: null,
            QuanSelected: ''
        };
    }

    async componentDidMount() {
        // this._getThoiTiet();
        this._GetBackGround();
        this.checkVersion();
        if (this.menu.filter((item) => item.goscreen == 'Modal_HuongDanVT').length == 0)
            this.GetTTHuongDan();

        //Bổ sung chọn quận
        const quanhuyen = Utils.getGlobal(nGlobalKeys.QuanSelected, null);
        const isStarted = await Utils.ngetStore(nkey.idDomain, -1);
        if (quanhuyen && isStarted != -1) {
            this.setState({ QuanSelected: quanhuyen })
        }
    }

    GetTTHuongDan = async () => {
        let res = await GetDeailTrangTinh(1);
        if (res && res.status == 1 && res.data) {
            this.setState({ dataHuongDan: res.data })
        }
        Utils.nlog('Gia tri data huong dan=====ssssss', this.state.dataHuongDan)
    }

    _goScreenTab = async (item, param = {}) => {
        Utils.setGlobal(nGlobalKeys.titleForm, param.title);
        if (item.id == 5) { //ID: 5 là Tuyên truyền
            if (ROOTGlobal.dataGlobal._onLoadTuyenTruyen) {
                ROOTGlobal.dataGlobal._onLoadTuyenTruyen();
            }
        }
        if (item.linkWeb != "" && item.linkWeb) {
            Utils.openUrl(item.linkWeb);
        }
        Utils.goscreen(this, item.goscreen);
    }

    _renderMenu = (item, index, type = 1) => {
        if (!(item.isShow == 1 || item.isShow == 2)) //0: Ẩn, 1: Hiển thị all, 2: Hiện thị MenuHome, 3: Hiển thị MenuDrawer
            return null;
        let urlIcon = item.linkicon == '' || !item.linkicon ? undefined : appConfig.domain + item.linkicon;
        if (type == 1 && item.id >= 0)
            return null;
        if (type == 2 && item.id < 0)
            return null;
        let heightItem = nwidth() / (Platform.isPad ? 7 : (type == 1 ? 3.8 : 3.89));
        let isDisable = item.id == 0 || item.id == -99;
        let nameMenu = item.name;
        let imgDefault = Images[item.icon] ? Images[item.icon] : Images.icPhotoBlack;
        return (
            <View key={index} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                    disabled={isDisable ? true : false}
                    style={[nstyles.shadown_nobgr, {
                        marginBottom: 10, width: Platform.isPad ? '70%' : '90%',
                        opacity: isDisable ? 0.5 : 1, alignItems: 'center',
                        backgroundColor: this.colorBackgroundMenu,
                        height: (type == 1 ? heightItem : (heightItem - Height(0.37) * Height(0.37))),
                        padding: 6,
                        borderRadius: 14
                    }]}
                    onPress={() => this._goScreenTab(item, { title: nameMenu })}
                >
                    <Image source={urlIcon ? { uri: urlIcon } : imgDefault}
                        // defaultSource={imgDefault}
                        style={[(type == 1 ? nstyles.nAva40 : nstyles.nIcon32), { borderRadius: 7 }]}
                        resizeMode='contain' />
                    <Text style={[
                        {
                            color: this.colorTextMenu, fontSize: reText(type == 1 ? 13 : 12), fontWeight: 'bold',
                            width: '100%', textAlign: 'center', marginTop: 8
                        }]}>
                        {nameMenu}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    // _renderTT = (item, index) => {
    //     var do_c = ((item.Temperature.Value - 31) / 1.8).toFixed(0);
    //     var time = moment(new Date(item.EpochDateTime * 1000)).format('hh:mm');
    //     var image = item.Icon
    //     return (
    //         <View key={index.toString()} style={{ paddingHorizontal: 10, alignItems: 'center' }} >
    //             <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: sizes.sizes.sText16 }}>
    //                 {`${do_c}°`}
    //             </Text>
    //             <View style={[nstyles.nAva40, { alignItems: 'center', justifyContent: 'center' }]}>
    //                 <Image source={image ? { uri: image } : Images.o1} style={[nstyles.nAva35]} resizeMode='cover' />
    //             </View>
    //             <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: sizes.sizes.sText16 }}>
    //                 {time}
    //             </Text>
    //         </View>)
    // }

    _getThoiTiet = async () => {
        nthisIsLoading.show();
        const res = await apis.ApiApp.GetThoiTiet();
        Utils.nlog("gia tri ress thoi tiets", res)
        if (res && res.status == 1 && res.data) {
            this.setState({ dataThoiTiet: res.data })
        } else {
            // Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Lỗi truy xuất dữ liệu", "Xác nhận")
        }

        nthisIsLoading.hide();
    }
    //check version
    checkVersion = () => {
        let resconfig = Utils.getGlobal(nGlobalKeys.resconfig, {})
        try {
            let { verIOS = '0', verAndroid = '0', linkIOS = '', linkAndroid = '',
                reqUpdateIOS = '0', reqUpdateAndroid = '0' } = resconfig;
            verIOS = parseInt(verIOS);
            verAndroid = parseInt(verAndroid);
            reqUpdateIOS = parseInt(reqUpdateIOS);
            reqUpdateAndroid = parseInt(reqUpdateAndroid);
            let isUpdate = false;
            let linkStore = '';
            let isRequire = false;
            if (Platform.OS == 'ios') {
                isUpdate = appConfig.verIOS < verIOS;
                isRequire = appConfig.verIOS < reqUpdateIOS;
                linkStore = linkIOS;
            } else {
                isUpdate = appConfig.verAndroid < verAndroid;
                isRequire = appConfig.verAndroid < reqUpdateAndroid;
                linkStore = linkAndroid;
            }
            if (isUpdate) {
                setTimeout(() => {
                    if (isRequire)
                        Utils.showMsgBoxOK(this, 'Thông báo cập nhật', 'Phiên bản hiện tại đã không còn sử dụng. Vui lòng cập nhật phiên bản mới!', 'Cập nhật', () => {
                            if (linkStore != '') {
                                Utils.openUrl(linkStore);
                            }
                        }, false);
                    else
                        Utils.showMsgBoxYesNo(this, 'Thông báo cập nhật', 'Đã có bản cập nhật mới. Vui lòng cập nhật ứng dụng!', 'Cập nhật', "Để sau", () => {
                            if (linkStore != '') {
                                Utils.openUrl(linkStore);
                            }
                        });
                }, 600);
            }
        } catch (error) {
        }
    }

    _GetBackGround = async () => {
        const res = await apis.ApiUser.Get_AnhNen();
        Utils.nlog("gia tri bg", res)
        if (res.status == 1 && res.data) {
            let urlBGRTemp = res.data.Link ? (appConfig.domain + res.data.Link) : '';
            urlBGRTemp = await Utils.setCacheURL(nkeyCache.imgBgrHomeCD, urlBGRTemp);
            this.setState({ ImageBG: urlBGRTemp }, () => {
                nthisIsLoading.hide();
            })
        }
    }

    _onChangeArea = async () => {
        let loginToken = Utils.getGlobal(nGlobalKeys.loginToken, '')
        Utils.nlog('info', loginToken)
        if (loginToken) {
            Utils.showMsgBoxYesNo(this, 'Thông báo', 'Đổi khu vực bạn sẽ phải đăng nhập lại !', 'Đồng ý', 'Hủy', async () => {
                let IDTemp = this.state.QuanSelected.IDQuan;
                await Utils.nsetStore(nkey.idDomain, '');
                Utils.goscreen(this, 'sw_Root', { IdDomainSelect: IDTemp })
            })
        } else {
            let IDTemp = this.state.QuanSelected.IDQuan;
            await Utils.nsetStore(nkey.idDomain, '');
            Utils.goscreen(this, 'sw_Root', { IdDomainSelect: IDTemp })
        }
    }

    render() {
        var { ImageBG, dataHuongDan } = this.state
        var link = appConfig.domain + ImageBG;
        const { nrow, nmiddle } = nstyles;
        let isGrpMenu1 = this.menu.filter((item) => item.id < 0 && (item.isShow == 1 || item.isShow == 2)).length > 0;
        let isGrpMenu2 = this.menu.filter((item) => item.id >= 0 && (item.isShow == 1 || item.isShow == 2)).length > 0;
        let is2GrpMenu = isGrpMenu1 && isGrpMenu2;
        let isShowSlogan = this.dataSlogan && this.dataSlogan.data && this.dataSlogan.data.length != 0;
        let sizeMargin = isShowSlogan ? 0.48 : 0.83;
        const { auth } = this.props
        return (
            <ImageBackground
                // defaultSource={Images.icBgr}
                source={ImageBG ? { uri: link } : Images.icBgr} style={[nstyles.ncontainer]}>
                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}></View>
                <Image
                    // defaultSource={Images.iconApp}
                    source={{ uri: Utils.getGlobal(nGlobalKeys.LogoAppHome, undefined) }}
                    style={{
                        width: Width(90), height: Height(is2GrpMenu ? 20 : 25),
                        alignSelf: 'center', marginTop: Height(5)
                    }} resizeMode='contain' />
                <View style={{ position: 'absolute', top: Height(5), right: 10, }}>
                    {
                        this.state.QuanSelected ?
                            <View>
                                <TouchableOpacity onPress={this._onChangeArea} opacity={0.5} style={{ padding: 10 }}>
                                    <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: reText(16) }}>
                                        {/* {`${this.TenQuan ? this.TenQuan.TenQuan : 'Khu vực'}▼`} */}
                                        {`${this.state.QuanSelected ? this.state.QuanSelected.TenQuan : 'Chọn khu vực'} ▼`}
                                    </Text>
                                </TouchableOpacity>
                            </View> : null
                    }
                </View>
                {
                    isShowSlogan ? <Slogan dataSlogan={this.dataSlogan} /> : null
                }
                <View style={is2GrpMenu ? { height: (Height(sizeMargin) * Height(sizeMargin)) + (is2GrpMenu ? 0 : Height(3)) } : {}} />
                {/* MENU 1 */}
                {
                    !isGrpMenu1 ? null :
                        <View style={[is2GrpMenu ? styler.borderMenu : {}, {
                            marginHorizontal: Height(1.6),
                        }, is2GrpMenu ? {} : { flex: 1 }]}>
                            {
                                !is2GrpMenu ? null :
                                    <View style={{
                                        position: 'absolute', top: -15, alignSelf: 'center', backgroundColor: colors.whitegay,
                                        padding: 4, paddingHorizontal: 10, borderRadius: 6
                                    }}>
                                        <Text style={[styler.txtH1, { color: colors.redStar }]}>
                                            {Utils.getGlobal(nGlobalKeys.TieuDe, '').toUpperCase()}
                                        </Text>
                                    </View>
                            }
                            <FlatList
                                style={{ paddingHorizontal: Platform.isPad ? 90 : 15, paddingTop: 20 }}
                                contentContainerStyle={{ paddingBottom: is2GrpMenu ? 0 : 20, justifyContent: 'flex-end', flexGrow: 1 }}
                                // contentContainerStyle={{ paddingBottom: is2GrpMenu ? 0 : 20 }}
                                numColumns={3}
                                data={this.menu}
                                scrollEnabled={is2GrpMenu ? false : true}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => this._renderMenu(item, index)}
                            />
                        </View>
                }

                {is2GrpMenu ? <View style={{ height: 18 }} /> : null}
                {/* MENU 2 */}
                {
                    !isGrpMenu2 ? null :
                        <View style={[is2GrpMenu ? styler.borderMenu : {}, {
                            marginHorizontal: Height(1.6),
                            paddingBottom: 2, paddingHorizontal: (Height(1.2) + 5)
                        }, is2GrpMenu ? { flex: 1 } : { flex: 1 }]}>
                            {
                                !is2GrpMenu ? null :
                                    <View style={{
                                        position: 'absolute', top: -15, alignSelf: 'center', backgroundColor: colors.whitegay,
                                        padding: 4, paddingHorizontal: 10, borderRadius: 6
                                    }}>
                                        <Text style={[styler.txtH1, { color: colors.redStar }]}>
                                            {'TIỆN ÍCH'}
                                        </Text>
                                    </View>
                            }
                            <FlatList
                                style={{ paddingHorizontal: Platform.isPad ? 90 : 15, paddingTop: 20 }}
                                contentContainerStyle={{ paddingBottom: 20, justifyContent: 'flex-end', flexGrow: 1 }}
                                numColumns={3}
                                data={this.menu}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => this._renderMenu(item, index, 2)}
                            />
                        </View>
                }
                <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10 + paddingBotX }}>
                    <View style={{ paddingHorizontal: 20, justifyContent: 'center', marginTop: Height(1.8) }}>
                        {
                            auth.tokenCD != '' ? <Avatar isNotify={this.menu.findIndex(item => item.goscreen == 'Modal_Notification') < 0} nthis={this} styImage={nstyles.nAva50} textstyle={{ fontSize: sizes.reSize(16) }} /> :
                                <View style={{ flexDirection: "row" }}>
                                    <ButtonCom
                                        onPress={() => Utils.goscreen(this, 'sw_Login')}
                                        Linear={true}
                                        // icon={Images.icFE}
                                        sizeIcon={30}
                                        style={{
                                            width: Width(40),
                                            borderRadius: 6,
                                            alignSelf: 'center'
                                        }}
                                        txtStyle={{ color: colors.white }}
                                        text={'ĐĂNG NHẬP'}
                                    />
                                    <View style={{ marginHorizontal: 3 }}></View>
                                    <ButtonCom
                                        onPress={() => Utils.goscreen(this, 'dangkytk')}
                                        Linear={false}
                                        // icon={Images.icFE}
                                        sizeIcon={30}
                                        style={
                                            {
                                                width: Width(40),
                                                borderRadius: 6,
                                                alignSelf: 'center'
                                            }}
                                        text={'ĐĂNG KÝ'}
                                        txtStyle={{ color: colors.selected }}
                                    />
                                </View>
                        }
                    </View>
                    {dataHuongDan ?
                        <TouchableOpacity onPress={() => Utils.goscreen(this, 'Modal_HuongDanVT', { dataHD: dataHuongDan })} style={{ marginTop: 10 }} >
                            <Text style={{ fontSize: reSize(16), fontWeight: 'bold', color: colors.white }}>{`Hướng dẫn`}</Text>
                        </TouchableOpacity> : null
                    }
                </View>
                <IsLoading />
            </ImageBackground>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});
export default Utils.connectRedux(HomeDrawerNew, mapStateToProps, true);

