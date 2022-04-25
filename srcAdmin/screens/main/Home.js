import React, { Component, Fragment } from 'react';
import {
    Image, View, StyleSheet, Text, Platform, Alert, TouchableOpacity,
    ScrollView, ImageBackground, StatusBar, FlatList
} from 'react-native';

import { Height, heightHed, paddingTopMul } from '../../../styles/styles';
import Utils from '../../../app/Utils';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { Images } from '../../images';
import { sizes } from '../../../styles/size';
import { colors } from '../../../styles/color';
import HeaderCom from '../../../components/HeaderCom';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import apis from '../../apis';
import { nstyles } from '../../../styles';
import { appConfig } from '../../../app/Config';
import { IsLoadingCus, IsLoading } from '../../../components';
import { nkey } from '../../../app/keys/keyStore';
import AppCodeConfig from '../../../app/AppCodeConfig';
import { isIphoneX } from 'react-native-iphone-x-helper';


class Home extends Component {
    constructor(props) {
        super(props);
        this.lang = Utils.getGlobal(nGlobalKeys.lang, {}, AppCodeConfig.APP_ADMIN);
        this.AllThaoTac = [];
        this.state = {
            //data globle
            isLoading: false,
            data: [],
            refreshing: true,
            isNoti: true,
            Tentinh: Utils.getGlobal(nGlobalKeys.TenTinh, '', AppCodeConfig.APP_ADMIN)
            //-data local


        }
        ROOTGlobal[nGlobalKeys.HomeDH].getDsThongBao = this._getListThongBao;

    }

    componentDidMount = async () => {
        this.props.GetThongBaoCanBo()
        StatusBar.setHidden(false);
    }

    componentWillUnmount() {
        ROOTGlobal[nGlobalKeys.HomeDH].getDsThongBao = undefined;
    }

    _getListThongBao = (isLoading = false, res = {}) => {
        if (isLoading)
            nthisIsLoading.show();
        else {
            nthisIsLoading.hide();
            if (res && res?.status == 1 && res.data.LstThongBao) {

                let data = res.data.LstThongBao
                this.setState({ data, refreshing: false })
            } else {
                this.setState({ refreshing: false, data: [], textempty: 'Không có dữ liệu...' })
            }
        }
    }

    _getListThongBaoAPI2 = async () => {
        const res = await apis.ThongBao.GetThongBao(); //Xử lý load DS 1 lần
        this._getListThongBao(false, res);
        if (res && res?.status == 1) { //&& res.data.LstThongBao
            let numThongBao = res.data ? (res.data.TongSoThongBao ? res.data.TongSoThongBao : 0) : 0;
        }
    };

    _onRefresh = () => {
        // Utils.nlog("refersh menu");
        //code mới
        this.props.GetThongBaoCanBo()

        //code cũ
        // this.setState({ refreshing: true, textempty: 'Đang tải...' }, () => {
        //     if (ROOTGlobal[nGlobalKeys.HomeDH].getThongBao)
        //         ROOTGlobal[nGlobalKeys.HomeDH].getThongBao();
        //     else
        //         _getListThongBaoAPI2();
        // })

    }

    onUserClick = () => {
        // alert('Thông tin user');
    }

    onMenuClick = () => {
        Utils.goscreen(this, 'scCardCheck')
    }

    renderItemMenu = (icon, text, onPress = () => { }) => {
        return (
            <TouchableOpacity style={[nstyles.nstyles.shadow, {
                backgroundColor: colors.blueTwo, width: '45%', margin: 5, borderRadius: 6,
                alignItems: 'center', justifyContent: 'center', height: 110
            }]} onPress={onPress}>
                <Image style={[nstyles.nstyles.nIcon50, { tintColor: colors.white }]} source={icon} />
                <Text style={{ color: colors.white, fontWeight: '600', marginTop: 15 }}>{text}</Text>
            </TouchableOpacity>
        )
    }

    _openDrawer = () => {
        this.props.navigation.openDrawer();
    }

    _ListFooterComponent = () => {
        if (this.state.page < this.pageAll)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }

    _goScreeen = async (item) => {
        Utils.nlog("giá trị item--------------------acctiion", item)
        if (item.checkChat == true) {
            Utils.goscreen(this, "Home_Chat");
            return;
        }
        switch (item.SelectDropdown) {
            case -4:
            case -3:
                {
                    Utils.goscreen(this, "stackTuongTac");
                } break;
            case -2: {
                Utils.goscreen(this, "stackHomePAMR");
            } break;
            case -1: {
                Utils.goscreen(this, "stackDSHuy")
            } break;
            default: {
                if (ROOTGlobal[nGlobalKeys.DropDownDH].setDropDown) {
                    ROOTGlobal[nGlobalKeys.DropDownDH].setDropDown();
                }
                Utils.goscreen(this, "scHomePAHT", { id: item.SelectDropdown })
            } break;
        }
    }
    _renderItem = ({ item, index }) => {
        Utils.nlog("giá trị item <<><><>", item)
        return (

            <TouchableOpacity
                onPress={() => this._goScreeen(item)}
                style={[nstyles.nstyles.shadown, {
                    marginVertical: 5,
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderRadius: 5,
                    backgroundColor: colors.whiteTwo, flex: 1
                }]} >
                <View style={[nstyles.nstyles.nrow, { flex: 1 }]}>
                    <Image source={Images.icNoti} style={[nstyles.nstyles.nIcon30, { tintColor: colors.peacockBlue }]} resizeMode='cover' />
                    <View style={{ paddingHorizontal: 10, flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: sizes.sText12, flex: 1 }}>
                            {`${item.Title}`}
                        </Text>
                        <Text style={{ fontStyle: 'italic', fontSize: sizes.sText12, }}>
                            {`${item.Number}`}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    _keyExtrac = (item, index) => index.toString();

    _ListHeaderComponent = () => {
        return (
            <View>

            </View>)
    }
    render() {
        let { dataNotificationCanBo, isRefreshCanBo, tongSoThongBaoCanBo } = this.props.thongbao
        return (
            // ncontainerX support iPhoneX, ncontainer + nfooter mới sp iphoneX 
            <Fragment>
                <View style={nstyles.nstyles.ncontainer}>
                    {/* Header  */}

                    {/* BODY */}
                    < View style={[nstyles.nstyles.nbody]} >
                        <ImageBackground source={isIphoneX() ? Images.imgBackgroundHomeMax : Images.icBgrHome} style={[nstyles.nbody, { alignItems: 'center', flex: 1, backgroundColor: this.props.theme.colorHeaderAdmin[0] }]} >
                            <Image
                                // defaultSource={Images.icCongAnAG}
                                source={Utils.getGlobal(nGlobalKeys.LogoAppAdmin, undefined, AppCodeConfig.APP_ADMIN) ? { uri: Utils.getGlobal(nGlobalKeys.LogoAppAdmin, undefined, AppCodeConfig.APP_ADMIN) } : Images.icCongAnAG} style={{ width: 120, height: 120, marginTop: Height(15) }}></Image>
                            <Text style={{ fontSize: sizes.sText26, fontWeight: 'bold', marginTop: 20, color: colors.white }}>{appConfig.TieuDeApp}</Text>
                            <Text style={{ fontSize: sizes.sText18, marginTop: 10, color: colors.white, fontWeight: 'bold', marginBottom: 10 }}>{this.state.Tentinh}</Text>
                            <View style={{
                                width: nstyles.Width(100),
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginTop: 20,
                                marginBottom: 60,
                                flex: 1,
                            }}>
                                <FlatList
                                    style={{ width: '100%', paddingHorizontal: 15 }}
                                    scrollEventThrottle={10}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={this._renderItem}
                                    // data={this.state.data}
                                    data={dataNotificationCanBo}
                                    keyExtractor={this._keyExtrac}
                                    refreshing={isRefreshCanBo}
                                    // refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh}
                                    onEndReachedThreshold={0.3}
                                />
                            </View>
                            <IsLoadingCus />
                        </ImageBackground>
                    </View>
                </View >
                {/* <HeaderApp /> */}
                <HeaderCom
                    titleText=''
                    style={{ position: 'absolute', left: 0, right: 0 }}
                    shadown={false}
                    isTransparent={true}
                    tintColorLeft={'white'}
                    onPressLeft={this._openDrawer}
                    onPressRight={() => {
                        Utils.goscreen(this, 'ManHinh_Home')
                    }}
                    iconRight={Images.icHome}
                    iconLeft={Images.icSlideMenu}
                    customStyleIconRight={[nstyles.nstyles.nIcon20, { tintColor: colors.white }]}
                    nthis={this} />
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,
    thongbao: state.thongbao
});
export default Utils.connectRedux(Home, mapStateToProps, true);
