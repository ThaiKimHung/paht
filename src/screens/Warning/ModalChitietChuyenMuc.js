import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Platform, StyleSheet, BackHandler } from 'react-native';
import apis from '../../apis';
import Utils from '../../../app/Utils';
import { HeaderCus, IsLoading, ListEmpty } from '../../../components';
import { nstyles, colors } from '../../../styles';
import { Images } from '../../images';
import HtmlViewCom from '../../../components/HtmlView';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { appConfig } from '../../../app/Config';
import moment from 'moment'
import { Height, isLandscape, Width } from '../../../styles/styles';
import { reText } from '../../../styles/size';
import AutoHeightWebViewCus from '../../../components/AutoHeightWebViewCus';
import UtilsApp from '../../../app/UtilsApp';
class ModalChitietChuyenMuc extends Component {
    constructor(props) {
        super(props);
        this.pageAll = 0;

        this.state = {
            data: [],
            textempty: 'Đang tải...',
            refreshing: true,
            page: 0,
            size: 10,
            id: Utils.ngetParam(this, "id", '')
        };
        // this.refLoading = React.createRef(null);
    }
    _getListCanhBao = async () => {
        // this.refLoading.current.show();
        const res = await apis.ApiCanhBao.GetList_CanhBaoAppCT(false, 1, 10, this.state.id);
        // this.refLoading.current.hide();
        Utils.nlog("gia tri canh bao res", res);
        if (res.status == 1 && res.data) {
            this.pageAll = res.page.AllPage
            this.setState({ data: res.data, refreshing: false, page: res.page.Page })
        } else {
            this.setState({ refreshing: false, data: [], textempty: 'Không có dữ liệu...' })
        }
    }
    componentDidMount() {
        this._getListCanhBao();
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goback(this)
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }



    _ListFooterComponent = () => {
        if (this.state.page < this.pageAll)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }

    loadMore = async () => {
        const { page, size, } = this.state;
        Utils.nlog('page', page)
        const pageNumber = page + 1;
        if (page < this.pageAll) {
            let res = await apis.ApiCanhBao.GetList_CanhBaoAppCT(false, pageNumber, size);
            Utils.nlog('data list canh bao 2', res)

            if (res.status == 1 && res.data) {
                const data = [...this.state.data, ...res.data];
                this.setState({ data, page: pageNumber, });
            };
        };
    };
    _goScreeen = (item) => () => {
        Utils.nlog("vao on press")
        Utils.goscreen(this, "Modal_ChiTietCanhBao", {
            item: item.Id,
            data: item,
            tuongtac: item.TuongTac,
            TenCM: item.TenChuyenMuc,
            _callback: this._callback
        })
    }
    _callback = () => {
        // this._onRefresh()
    }
    _renderItem = ({ item, index }) => {
        const { ListFile = [] } = item
        const { dataLinhVuc } = this.state;
        let icon = ListFile.find(e => e.Type == 1)
        // let lstChuyenMuc = dataLinhVuc.find(e => e.IdChuyenMuc == item.IdChuyenMuc)
        const days = item?.TuNgay.slice(0, 10)
        const time = item?.TuNgay.slice(11, 16)
        const NgayHT = new Date;
        const timeHT = moment(NgayHT, 'HH:mm:ss').format('HH:mm:ss');
        const songay = (moment(NgayHT, 'DD/MM/YYYY')).diff(moment(days, 'DD/MM/YYYY'), "days")
        const sophut = moment(timeHT, 'HH:mm:ss').diff(moment(time, 'HH:mm:ss'), 'minutes');
        const sogio = Math.floor(sophut / 60);
        // Utils.nlog('Gia tri Ngay - Gio', days, time, timeHT, sophut, sogio)

        return (
            <TouchableOpacity
                key={index}
                onPress={this._goScreeen({ ...item, TenChuyenMuc: item.TenChuyenMuc })}
                style={[{ margin: 10 }, isLandscape() ? { marginHorizontal: "20%" } : {}]}>
                <View style={[nstyles.nstyles.shadown, { backgroundColor: colors.white, borderRadius: 5 }]}>
                    <Text numberOfLines={2} style={{ fontWeight: 'bold', fontSize: 14, width: '100%', paddingVertical: 15, paddingHorizontal: 10 }}>
                        {`${item.TieuDe}`}
                    </Text>
                    {
                        icon && icon.Path ?
                            <Image source={icon ? { uri: appConfig.domain + icon.Path } : Images.iconApp}
                                style={[{ width: '100%', height: isLandscape() ? Width(20) : Width(40) }]} resizeMode='cover' /> : null
                    }
                    <View style={[nstyles.nstyles.nrow, { width: '100%', alignItems: 'center' }]}>
                        <View style={{ paddingHorizontal: 10, flex: 1, paddingVertical: 9 }}>
                            <View style={{ flex: 1 }}>
                                <HtmlViewCom limitedLine={3} html={item.NoiDung} style={{ height: Platform.OS == 'ios' ? 55 : 51 }} />
                            </View>
                        </View>
                    </View>
                    {/* <View style={{ paddingHorizontal: 10, height: Platform.OS == "ios" ? Height(7) : Height(9), paddingTop: 5 }}>
                        <AutoHeightWebViewCus source={{ html: item.NoiDung ? item.NoiDung : '<div></div>' }} textLoading={'Đang tải nội dung'} />
                    </View> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{
                                fontStyle: 'italic', fontSize: reText(12), lineHeight: reText(20),
                                paddingHorizontal: 10, paddingBottom: 10
                            }}>
                                {item.TenChuyenMuc}
                            </Text>
                            <View style={[nstyles.nstyles.nrow, {}]}>
                                <Image source={Images.icShowPass} style={[nstyles.nstyles.nIcon20, { tintColor: colors.colorTextSelect }]} resizeMode='contain' />
                                <Text style={{ fontSize: reText(12), fontWeight: 'bold', paddingHorizontal: 10, marginTop: 2, color: colors.colorTextSelect }} numberOfLines={1}>{item.LuotXemCD}</Text>
                            </View>
                        </View>
                        <Text style={{
                            fontStyle: 'italic', fontSize: reText(12), lineHeight: reText(20),
                            paddingHorizontal: 10, paddingBottom: 10
                        }}>
                            {`${songay == 0 && sophut < 60 ? `${sophut} phút trước` : sogio >= 1 && songay < 1 ? `${sogio} giờ trước` : songay >= 30 ? +Math.floor(songay / 30) + ' tháng trước' : +songay + ' ngày trước'}`}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    _keyExtrac = (item, index) => index.toString();
    _onRefresh = () => {
        this.setState({ refreshing: true, textempty: 'Đang tải...', data: [] }, this._getListCanhBao)
        // this.setState({ refreshing: true, page: 0, textempty: 'Đang tải...' }, () => this._getData(this.state.hocSinhData.IDKhachHang));
    }
    render() {
        return (
            <View style={{ backgroundColor: colors.BackgroundHome, flex: 1 }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={UtilsApp.getScreenTitle("ManHinh_Warning", 'Thông tin từ chính quyền')}
                    styleTitle={{ color: colors.white }}
                    iconRight={Images.icHomeMenu}
                    onPressRight={() => Utils.goscreen(this, 'ManHinh_Home')}
                />
                <FlatList
                    scrollEventThrottle={10}
                    // onScroll={this.handleScroll}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: nstyles.paddingBotX + 20 + (Platform.OS === 'android' ? 60 : 0) }}
                    renderItem={this._renderItem}
                    data={this.state.data}
                    ListEmptyComponent={<ListEmpty textempty={this.state.textempty} isImage={!this.state.refreshing} />}
                    // ListHeaderComponent={this._ListHeaderComponent}
                    keyExtractor={this._keyExtrac}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={0.3}
                // ListFooterComponent={this._ListFooterComponent}
                />
                {/* <IsLoading ref={this.refLoading} /> */}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    auth: state.auth

});
const stQUanTam = StyleSheet.create({
    containerItem: {
        // ...nstyles.nstyles.shadown,
        // marginVertical: 5,
        // paddingVertical: 20,
        // paddingHorizontal: 10,
        borderRadius: 2,
        width: '100%'

    }
});

export default Utils.connectRedux(ModalChitietChuyenMuc, mapStateToProps, true);


