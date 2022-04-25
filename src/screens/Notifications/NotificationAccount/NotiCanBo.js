import React, { Component } from 'react'
import { Text, View, ScrollView, FlatList, TouchableOpacity, Image, ActivityIndicator, Linking, StatusBar, RefreshControl } from 'react-native'
import Utils from '../../../../app/Utils';
import { ListEmpty } from '../../../../components';
import { colors } from '../../../../styles';
import { reText, sizes } from '../../../../styles/size';
import { nheight, nstyles, nwidth } from '../../../../styles/styles';
import apis from '../../../apis'
import { Images } from '../../../images';
import moment from 'moment'
import { appConfig } from '../../../../app/Config';
import LottieView from 'lottie-react-native';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import { nGlobalKeys } from '../../../../app/keys/globalKey';


class NotiCanBo extends Component {

    componentDidMount() {
        this.props.GetThongBaoDichVuCong()
        this.props.GetThongBaoCanBo()
    }

    _renderItemCB = (item, index) => {
        // Utils.nlog("giá trị item <<><><>", item)
        let { auth } = this.props
        let find = auth.listObjectRuleDH.filter(item => item.code == 'CHAT')
        if (find.length == 0 && item.checkChat == true) {
            return null
        }
        return (

            <TouchableOpacity
                onPress={() => this._goScreeenCB(item)}
                style={[nstyles.shadow, {
                    marginHorizontal: 10, marginBottom: 5, borderColor: colors.colorGrayLight,
                    marginTop: index == 0 ? 5 : 0,
                    padding: 5,
                    borderRadius: 5,
                    backgroundColor: colors.white,
                    flex: 1,
                    minHeight: 70
                }]} >
                <View style={[nstyles.nrow, { flex: 1, alignItems: 'center', height: '100%' }]}>
                    <Image source={Images.icThongBaoCBYes} style={[nstyles.nIcon30, { tintColor: this.props.theme.colorLinear.color[0], padding: 10 }]} resizeMode='cover' />
                    <View style={{ paddingHorizontal: 10, flex: 1 }}>
                        <Text style={{ fontSize: sizes.sText14, textAlign: 'justify', paddingVertical: 5 }}>
                            {`${item.Title}`}
                        </Text>
                        <Text style={{ fontStyle: 'italic', fontSize: sizes.sText14, lineHeight: 25 }}>
                            {`${item.Number}`}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _goScreeenCB = async (item) => {
        Utils.nlog("giá trị item--------------------acctiion", item)
        if (item.checkChat == true) {
            StatusBar.setBarStyle('dark-content')
            Utils.goscreen(this.props.nthis, "Home_Chat");
            return;
        }
        switch (item.SelectDropdown) {
            case -4: {
                //Phản ánh cần duyệt tương tác
                Utils.navigate("sw_RootDH", {
                    callback: appConfig.deeplinkDSTT + item.SelectDropdown
                })
            }
                break;
            case -3: {
                //Phản ánh tương tác chưa được phản hồi
                Utils.navigate("sw_RootDH", {
                    callback: appConfig.deeplinkDSTT + item.SelectDropdown
                })
            }
                break;
            case -2: {
                Utils.navigate("sw_RootDH", {
                    callback: appConfig.deeplinkPAMR
                })
            } break;
            case -1: {
                Utils.navigate("sw_RootDH", {
                    callback: appConfig.deeplinkDSHuy
                })
            } break;
            default: {
                if (ROOTGlobal[nGlobalKeys.DropDownDH].setDropDown) {
                    ROOTGlobal[nGlobalKeys.DropDownDH].setDropDown();
                }
                Utils.navigate("sw_RootDH", {
                    callback: appConfig.deeplinkHomePAHT + item.SelectDropdown
                })
            } break;
        }
    }

    _renderItem = ({ item, index }) => {
        const days = item?.CreateDate.slice(0, 10)
        const time = item?.CreateDate.slice(11, 16)
        const NgayHT = new Date;
        const songay = (moment(NgayHT, 'DD/MM/YYYY')).diff(moment(days, 'DD/MM/YYYY'), "days")
        return (
            <TouchableOpacity disabled={true} onPress={() => this._goChiTiet(item)} style={nstyles.shadown}>
                <View key={index} style={{
                    paddingVertical: 10,
                    backgroundColor: colors.white,
                    paddingHorizontal: 10, borderRadius: 5, margin: 10, borderColor: colors.colorGrayLight,
                    opacity: item.IsSeen ? 0.5 : 1
                }}>
                    {/* <Image source={Images.icThongbao} /> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text
                            numberOfLines={2}
                            style={{ color: colors.colorBlueLight, lineHeight: reText(21), flex: 1 }}>{item.Title}</Text>
                        <Text style={{ lineHeight: reText(21), color: colors.black, fontWeight: 'bold', textAlign: 'right' }}>
                            {time}
                        </Text>
                    </View>
                    <Text
                        numberOfLines={2}
                        style={{ lineHeight: reText(21), paddingVertical: 5, color: colors.black_80, }}>
                        {item.Description}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ lineHeight: reText(21), color: colors.black_50, fontStyle: 'italic', }}>
                            {`${songay == 0 ? "Hôm nay" : songay >= 30 ? +Math.floor(songay / 30) + ' tháng trước' : +songay + ' ngày trước'}`}
                        </Text>
                    </View>
                </View>

            </TouchableOpacity >
        )
    }

    _goChiTiet = (item) => {
        Utils.nlog('[LOG] json request', JSON.parse(item.JsonRequest))
        const Data = JSON.parse(item.JsonRequest)
        if (Data.data && Data.data.ID && Data.MaScreen) {
            // Với NV5 phải về Home mới vào đc deeplink
            // await Utils.goscreen(this.props.nthis, 'ManHinh_Home')
            // Linking.openURL('gypa70://app/root/main/home/stcongdan/tintuc/cttintuc/2')
            // ----------------------Cấu trúc tạo trước bắt notifi Thông báo Tây Ninh
            if (Data.MaScreen == appConfig.manHinhHKG) { //Họp không giấy
                var url = appConfig.deeplinkchitietHKG + `${Data.data.ID}`
                Linking.openURL(url)
                return;
            }
            if (Data.MaScreen == appConfig.manHinhHoiDap) { //Hỏi đáp
                var url = appConfig.deeplinkHoiDap + `${Data.data.ID}`
                Linking.openURL(url)
                return;
            }
            if (Data.MaScreen == appConfig.manHinhHoSo) { //Gửi hồ sơ
                var url = appConfig.deeplinkGuiHoSo + `${Data.data.ID}`
                Linking.openURL(url)
                return;
            }
            if (Data.MaScreen == appConfig.manHinhThanhToan) { //Thanh Toán DVC
                var url = appConfig.deeplinkThanhToan + `${Data.data.ID}`
                Linking.openURL(url)
                return;
            }
            if (Data.MaScreen == appConfig.manHinhTinTuc) { //Thanh Toán DVC
                var url = appConfig.deeplinkTinTuc + `${Data.data.ID}`
                Linking.openURL(url)
                return;
            }
        }
        // ----------------------------------------------------------------------
    }

    _onRefresh = () => {
        this.props.GetThongBaoDichVuCong()
        this.props.GetThongBaoCanBo()
    }
    _ListFooterComponent = () => {
        let { pageDVC } = this.props.thongbao
        if (pageDVC.Page < pageDVC.AllPage)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return <View style={{ height: 50 }} />
    }

    loadMore = async () => {
        let { pageDVC } = this.props.thongbao
        const pageNumber = pageDVC.Page + 1;
        if (pageDVC.Page < pageDVC.AllPage) {
            this.props.LoadMoreThongBaoDichVuCong(pageNumber)
        };
    };

    ListNoTiCanBo = () => {
        let { dataNotificationCanBo, isRefreshCanBo, tongSoThongBaoCanBo } = this.props.thongbao
        return (
            <View>
                {dataNotificationCanBo.map((item, index) => {
                    return (
                        this._renderItemCB(item, index)
                    )
                })}
            </View >
        )
    }

    render() {
        let { dataNotiDVC, isRefreshDVC, dataNotificationCanBo, isRefreshCanBo, tongSoThongBaoCanBo } = this.props.thongbao
        return (
            <View style={{ flex: 1 }}>
                {
                    dataNotiDVC.length != 0 || dataNotificationCanBo.length != 0 ?
                        <FlatList
                            style={{ flex: 1 }}
                            ListHeaderComponent={this.ListNoTiCanBo}
                            contentContainerStyle={{ paddingBottom: 50 }}
                            scrollEventThrottle={10}
                            showsVerticalScrollIndicator={false}
                            renderItem={this._renderItem}
                            data={dataNotiDVC}
                            // ListEmptyComponent={<ListEmpty textempty={isRefreshDVC ? 'Đang tải' : 'Không có dữ liệu'} isImage={!isRefreshDVC} />}
                            keyExtractor={(item, index) => index.toString()}
                            refreshing={isRefreshDVC}
                            onRefresh={this._onRefresh}
                            onEndReached={this.loadMore}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={this._ListFooterComponent}
                        /> :
                        <ScrollView refreshControl={
                            <RefreshControl
                                refreshing={isRefreshCanBo}
                                onRefresh={this._onRefresh}
                            />
                        }>
                            <LottieView
                                source={require('../../../images/emptyBox.json')}
                                style={{ width: nwidth(), height: nheight() / 5, justifyContent: "center", alignSelf: 'center' }}
                                loop={true}
                                autoPlay={true}
                            />
                            <Text style={[{
                                textAlign: 'center', marginVertical: 20, color: colors.colorGrayText,
                                width: '100%', fontWeight: 'bold', opacity: 0.7
                            }]}>{'Không có dữ liệu'}</Text>
                        </ScrollView>
                }
            </View>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,
    thongbao: state.thongbao
});
export default Utils.connectRedux(NotiCanBo, mapStateToProps, true);
