import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Platform, StyleSheet, ScrollView, BackHandler } from 'react-native';
import apis from '../../apis';
import Utils from '../../../app/Utils';
import { HeaderCus, IsLoading, ListEmpty } from '../../../components';
import { nstyles, colors } from '../../../styles';
import { Images } from '../../images';
import HtmlViewCom from '../../../components/HtmlView';
import { appConfig } from '../../../app/Config';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { Height, isLandscape, Width } from '../../../styles/styles';
import { reText } from '../../../styles/size';
import moment from 'moment'
import HomeTuyenTruyen from '../Home/tuyentruyen/HomeTuyenTruyen';
import AutoHeightWebViewCus from '../../../components/AutoHeightWebViewCus';
import UtilsApp from '../../../app/UtilsApp';
import ImageCus from '../../../components/ImageCus';
class QuanTam extends Component {
    constructor(props) {
        super(props);
        this.pageAll = 0;
        this.IdSource = Utils.getGlobal(nGlobalKeys.IdSource, '')
        this.isDropDownCanhBao = Utils.getGlobal(nGlobalKeys.isDropDownCanhBao, 'false')
        this.IdChuyenMuc = Utils.ngetParam(this, 'IdChuyenMuc', 0)

        this.state = {
            data: [],
            textempty: 'Đang tải...',
            refreshing: true,
            page: 0,
            size: 10,
            dataLinhVuc: [],
            keyID: this.IdSource == 'CA' ? 'IdLinhVuc' : 'IdChuyenMuc',
            currentLinhVuc: this.IdSource == 'CA' ? { IdLinhVuc: -1, LinhVuc: 'Tổng hợp' } : { IdChuyenMuc: -1, TenChuyenMuc: 'Tổng hợp' },
        };
        // this.refLoading = React.createRef(null);
    }

    compare(a, b) {
        if ((a.STT < b.STT) || (a.Prior < b.Prior)) {
            return -1;
        }
        if ((a.STT > b.STT) || (a.Prior < b.Prior)) {
            return 1;
        }
        return 0;
    }

    _getListLinhVuc = async (isUB = false) => {
        let res = {}
        if (isUB) { //'UB'
            let params = '&query.filter.keys=CanhBao&query.filter.vals=1'; //--Chuyển về dạng dropdown
            res = await apis.ApiPhanAnh.GetList_ChuyenMucAppTN(this.isDropDownCanhBao == 'true' ? params : '');
        }
        else //'CA'
            res = await apis.ApiPhanAnh.GetList_LinhVucApp();
        if (res.status == 1 && res.data) {
            let data = res.data.reverse();
            data = data.sort(this.compare);
            if (!isUB) // chỉ set GetList_LinhVucApp để hiển thị icon maps.
                if (this.IdSource != 'CA' && !isUB) {
                    this._getListLinhVuc(true);
                    return;
                }
            this.setState({ dataLinhVuc: data })
            if (this.IdChuyenMuc > 0) {
                let TenChuyenMucTat = [];
                Utils.nlog('Gia tria res.data', data)
                TenChuyenMucTat = res.data ? res.data.find(e => e.IdChuyenMuc == this.IdChuyenMuc) : []
                // Utils.nlog('Gia tri TenChuyenMucTat', TenChuyenMucTat.IdChuyenMuc)
                this.setState({ currentLinhVuc: { IdChuyenMuc: TenChuyenMucTat?.IdChuyenMuc, TenChuyenMuc: TenChuyenMucTat?.TenChuyenMuc } })
            }
        }
    }
    _getListCanhBao = async () => {
        this.setState({ refreshing: true, textempty: 'Đang tải...' })
        const { currentLinhVuc, keyID } = this.state;
        // this.refLoading.current.show();
        const res = await apis.ApiCanhBao.GetList_CanhBaoApp(false, 1, 10, this.IdChuyenMuc ? this.IdChuyenMuc : currentLinhVuc[keyID]);
        // this.refLoading.current.hide();
        if (res.status == 1 && res.data) {
            this.pageAll = res.page.AllPage
            this.setState({ data: res.data, refreshing: false, page: res.page.Page })
        } else {
            nthisIsLoading.hide();
            this.setState({ refreshing: false, data: [], textempty: 'Không có dữ liệu...' })
        }
    }
    componentDidMount() {
        this._getListCanhBao();
        this._getListLinhVuc();
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
        Utils.nlog('Gia trij this.IdChuyenMuc ', this.IdChuyenMuc)
    }

    backAction = () => {
        Utils.goscreen(this, 'ManHinh_Home')
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
        const { page, size, currentLinhVuc, keyID } = this.state;
        Utils.nlog('page', page)
        const pageNumber = page + 1;
        if (page < this.pageAll) {
            let res = await apis.ApiCanhBao.GetList_CanhBaoApp(false, pageNumber, size, this.IdChuyenMuc ? this.IdChuyenMuc : currentLinhVuc[keyID]);
            Utils.nlog('data list canh bao 2', res)
            if (res.status == 1 && res.data) {
                const data = [...this.state.data, ...res.data];
                this.setState({ data, page: pageNumber, });
            };
        };
    };
    _goScreeen = (item) => () => {
        Utils.nlog("vao on press", item)
        Utils.goscreen(this, "Modal_ChiTietCanhBao", {
            item: item.Id,
            data: item,
            tuongtac: item.TuongTac,
            TenCM: item.TenChuyenMuc,
            _callback: this._callback
        })
    }
    _callback = () => {
        this._onRefresh();
    }
    _renderChuyenMuc = (item, index) => {
        const { keyID, data, currentLinhVuc, dataLinhVuc } = this.state;
        // Utils.nlog('Gia tri daata ChuyenMuc', item[keyID])
        let TenChuyenMucTat = [];
        TenChuyenMucTat = dataLinhVuc ? dataLinhVuc.find(e => e.IdChuyenMuc == this.IdChuyenMuc) : []
        // Utils.nlog('Gia tri _renderChuyenMuc', dataLinhVuc, TenChuyenMucTat, currentLinhVuc)
        // this.setState({ currentLinhVuc: { IdChuyenMuc: TenChuyenMucTat?.IdChuyenMuc, TenChuyenMuc: TenChuyenMucTat?.TenChuyenMuc } })
        if (item[this.IdSource == 'CA' ? 'Display' : 'HienThi'] == true) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        if (this.state.refreshing == true) {
                            return;
                        } else {
                            if (index == -1) {
                                this.IdChuyenMuc = 0
                                this.setState({ currentLinhVuc: item });

                            }
                            else {
                                this.IdChuyenMuc = 0
                                this.setState({ currentLinhVuc: item }, this._getListCanhBao)
                            }

                        }
                    }}
                    key={index}
                    style={[stQUanTam.containerChuyenMuc, { borderRadius: 4, paddingVertical: 8, backgroundColor: item[keyID] == this.state.currentLinhVuc[this.IdSource == 'CA' ? 'IdLinhVuc' : 'IdChuyenMuc'] ? colors.colorbackgroundSelect : 'white' }]}>
                    <Text style={[{
                        textAlign: 'center', fontSize: reText(13),
                        color: item[keyID] == this.state.currentLinhVuc[keyID] ? colors.colorTextSelect : colors.black_50, fontWeight: 'bold'
                    }]}>{item[this.IdSource == 'CA' ? 'LinhVuc' : 'TenChuyenMuc']}</Text>
                </TouchableOpacity>)
        } else {
            return null
        }
    }
    _ListHeaderComponent = () => {
        var { dataLinhVuc, keyID, currentLinhVuc } = this.state;
        let item = this.IdSource == 'CA' ? { IdLinhVuc: -1, LinhVuc: 'Tổng hợp' } : { IdChuyenMuc: -1, LinhVuc: 'Tổng hợp' }
        let itemVideo = this.IdSource == 'CA' ? { IdLinhVuc: -2, LinhVuc: 'Video tuyên truyền', Display: true } :
            { IdChuyenMuc: -2, TenChuyenMuc: 'Video tuyên truyền', HienThi: true };
        let TenChuyenMucTat = [];
        TenChuyenMucTat = dataLinhVuc ? dataLinhVuc.find(e => e.IdChuyenMuc == this.IdChuyenMuc) : []
        // Utils.nlog('Gia tri dataLinhVuc', dataLinhVuc, TenChuyenMucTat)

        return (
            <View style={{ backgroundColor: colors.BackgroundHome }}>
                <View style={[stQUanTam.containerItem, { flexDirection: 'row', backgroundColor: colors.white, paddingVertical: 5, paddingHorizontal: 5, marginBottom: 1 }]}>
                    <TouchableOpacity
                        onPress={() => this.setState({ currentLinhVuc: item }, this._getListCanhBao)}
                        style={{
                            flexDirection: 'row', backgroundColor: this.IdChuyenMuc > 0 ? colors.white : this.state.currentLinhVuc[keyID] == -1 ? colors.colorbackgroundSelect : colors.white,
                            alignItems: 'center',
                            borderRadius: 3, paddingVertical: 8,
                            paddingHorizontal: 8
                        }}>
                        <ImageCus defaultSourceCus={Images.iconApp} source={this.LogoAppHome ? { uri: this.LogoAppHome } : Images.iconApp} style={nstyles.nstyles.nIcon20} resizeMode='cover' />
                        <Text style={{ marginLeft: 5, fontWeight: 'bold', color: this.IdChuyenMuc > 0 ? colors.black_50 : this.state.currentLinhVuc[keyID] == -1 ? colors.colorTextSelect : colors.black_50 }}>{'Tổng hợp'}</Text>
                    </TouchableOpacity>
                    <View style={{ width: 1, height: '100%', backgroundColor: colors.black_20, marginHorizontal: 5, alignSelf: 'center' }}></View>
                    {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEventThrottle={10}  >
                        {dataLinhVuc.map(this._renderChuyenMuc)}

                        Render video tuyên truyền gộp chung vào Tin Cảnh báo
                        {dataLinhVuc && dataLinhVuc.length ?
                            this._renderChuyenMuc(itemVideo, -1) : null}
                    </ScrollView> */}
                    {this.isDropDownCanhBao == 'false' ?
                        <>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEventThrottle={10} onScroll={this._handleScroll} >
                                {dataLinhVuc.map(this._renderChuyenMuc)}
                                {dataLinhVuc && dataLinhVuc.length ?
                                    this._renderChuyenMuc(itemVideo, -1) : null}
                            </ScrollView>
                        </> :
                        <TouchableOpacity
                            onPress={() => Utils.goscreen(this, 'ModalDropChuyenMuc',
                                {
                                    dataChuyenMuc: this.state.dataLinhVuc,
                                    currentLinhVuc: this.state.currentLinhVuc,
                                    checkCA: this.IdSource == 'CA' ? 'true' : 'false',
                                    callbackCM: (val) => this.setState({ currentLinhVuc: val }, () => {
                                        this.IdChuyenMuc = 0
                                        this.setState({ currentLinhVuc: val }, this._getListCanhBao)
                                    })
                                })}
                            style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center', paddingHorizontal: 5, backgroundColor: this.state.currentLinhVuc[keyID] != -1 || this.IdChuyenMuc > 0 ? this.props.theme.colorLinear.color[0] + '0D' : colors.white }}>
                            <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center' }}>
                                <Image source={Images.icMenuChuyenMuc} style={{ marginRight: 5 }} />
                                <Text numberOfLines={2} style={{
                                    color: this.state.currentLinhVuc[keyID] != -1 || this.IdChuyenMuc > 0 ? this.props.theme.colorLinear.color[0] : colors.black_50, fontWeight: 'bold',
                                    textAlign: 'center', flex: 1
                                }}>
                                    {this.state.currentLinhVuc.IdChuyenMuc == '-1' ? (this.IdSource == 'CA' ? 'Chọn lĩnh vực' : this.IdChuyenMuc > 0 ? `${TenChuyenMucTat ? TenChuyenMucTat.TenChuyenMuc : ''}` : 'Chọn chuyên mục') : (this.IdSource == 'CA' ? this.state.currentLinhVuc.LinhVuc : this.state.currentLinhVuc.TenChuyenMuc)}
                                </Text>
                            </View>
                            <Image source={Images.icDropDownMini} style={{ width: Width(3), height: Width(2), tintColor: colors.black_60 }} />
                        </TouchableOpacity>
                    }
                </View>
            </View >
        )
    }
    _renderItem = ({ item, index }) => {
        const { ListFile = [] } = item
        const { dataLinhVuc } = this.state;
        let icon = ListFile.find(e => e.Type == 1)
        let lstChuyenMuc = dataLinhVuc.find(e => e.IdChuyenMuc == item.IdChuyenMuc)
        const days = item?.TuNgay.slice(0, 10)
        const time = item?.TuNgay.slice(11, 16)
        const NgayHT = new Date;
        const timeHT = moment(NgayHT, 'HH:mm:ss').format('HH:mm:ss');
        const songay = (moment(NgayHT, 'DD/MM/YYYY')).diff(moment(days, 'DD/MM/YYYY'), "days")
        const sophut = Math.abs(moment(timeHT, 'HH:mm:ss').diff(moment(time, 'HH:mm:ss'), 'minutes'));
        const sogio = Math.floor(sophut / 60);
        // Utils.nlog('Gia tri Ngay - Gio', days, time, timeHT, sophut, sogio)
        return (
            <TouchableOpacity
                key={index}
                onPress={this._goScreeen({ ...item, TenChuyenMuc: lstChuyenMuc?.TenChuyenMuc })}
                style={[{ margin: 10 }, isLandscape() ? { marginHorizontal: "20%" } : {}]}>
                <View style={[nstyles.nstyles.shadown, { backgroundColor: colors.white, borderRadius: 5 }]}>
                    <Text numberOfLines={2} style={{ fontWeight: 'bold', fontSize: 14, width: '100%', paddingVertical: 15, paddingHorizontal: 10 }}>
                        {`${item.TieuDe}`}
                    </Text>
                    {item.Avatar ?
                        //  <ImageCus defaultSourceCus={Images.iconApp} source={this.LogoAppHome ? { uri: this.LogoAppHome } : Images.iconApp} style={[nstyles.nstyles.nIcon40, { marginVertical: 5 }]} resizeMode='cover' />
                        <ImageCus defaultSourceCus={Images.iconApp} source={{ uri: appConfig.domain + item.Avatar.Path }}
                            style={[{ width: '100%', height: isLandscape() ? Width(20) : Width(50) }]} resizeMode='cover' /> :
                        icon && icon.Path ?
                            <ImageCus defaultSourceCus={Images.iconApp} source={icon ? { uri: appConfig.domain + icon.Path } : Images.iconApp}
                                style={[{ width: '100%', height: isLandscape() ? Width(20) : Width(50) }]} resizeMode='cover' /> : null
                    }
                    <View style={[nstyles.nstyles.nrow, { width: '100%', alignItems: 'center' }]}>
                        <View style={{ paddingHorizontal: 10, flex: 1, paddingVertical: 9 }}>
                            <View style={{ flex: 1 }}>
                                <HtmlViewCom limitedLine={3} html={item.NoiDung} style={{ height: Platform.OS == 'ios' ? 55 : 51 }} />
                            </View>
                        </View>
                    </View>
                    {/* <View style={{ paddingHorizontal: 10, height: Platform.OS == "ios" ? Height(7) : Height(9), paddingTop: 5 }}>
                        <AutoHeightWebViewCus style={{ marginTop: -18 }} source={{ html: item.NoiDung ? item.NoiDung : '<div></div>' }} textLoading={'Đang tải nội dung'} />
                    </View> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{
                                fontStyle: 'italic', fontSize: reText(12), lineHeight: reText(20),
                                paddingHorizontal: 10, paddingBottom: 10
                            }}>
                                {lstChuyenMuc?.TenChuyenMuc}
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
                            {/* {`${songay == 0 && sophut < 60 ? `${sophut} phút trước` : sogio >= 1 && songay < 1 ? `${sogio} giờ trước` : songay >= 30 ? +Math.floor(songay / 30) + ' tháng trước' : +songay + ' ngày trước'}`} */}
                            {item?.TuNgay ? moment(item?.TuNgay, 'DD/MM/YYYY HH:mm').fromNow() : '---'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity >
        )
    }
    _keyExtrac = (item, index) => index.toString();
    _onRefresh = () => {
        this.setState({ refreshing: true, textempty: 'Đang tải...' }, this._getListCanhBao)
    }
    render() {
        const { dataLinhVuc, data, currentLinhVuc, keyID } = this.state;
        Utils.nlog('Gia tri data<>>>>>>>>>>>>> TinTuc', data, keyID)
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome, }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
                    iconLeft={Images.icBack}
                    title={UtilsApp.getScreenTitle("ManHinh_Warning", 'Tin tức mới')}
                    styleTitle={{ color: colors.white }}
                />
                {this._ListHeaderComponent()}
                {currentLinhVuc[keyID] == -2 ? <HomeTuyenTruyen navigation={this.props.navigation} isQuanTam={true} /> :
                    <FlatList
                        scrollEventThrottle={10}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: nstyles.paddingBotX + 20 + (Platform.OS === 'android' ? 60 : 0) }}
                        renderItem={this._renderItem}
                        data={data}
                        ListEmptyComponent={<ListEmpty textempty={this.state.textempty} isImage={!this.state.refreshing} />}
                        keyExtractor={this._keyExtrac}
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={0.3}
                        removeClippedSubviews={true} // Unmount components when outside of window 
                        initialNumToRender={2} // Reduce initial render amount
                        maxToRenderPerBatch={1} // Reduce number in each render batch
                        updateCellsBatchingPeriod={100} // Increase time between renders
                        windowSize={7} // Reduce the window size
                    />
                }

                {/* <IsLoading ref={this.refLoading} /> */}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme

});

export default Utils.connectRedux(QuanTam, mapStateToProps, true);
const stQUanTam = StyleSheet.create({
    containerItem: {
        // ...nstyles.nstyles.shadown,
        marginBottom: 5,
        // paddingVertical: 20,
        // paddingHorizontal: 10,
        borderRadius: 2,
        width: '100%'
    },
    containerChuyenMuc: {
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,
        maxWidth: 140,
        marginRight: 10,

    }
});