import React, { Component } from 'react'
import { Text, View, ScrollView, FlatList, TouchableOpacity, Image, ActivityIndicator, Linking } from 'react-native'
import Utils from '../../../../app/Utils';
import { ListEmpty } from '../../../../components';
import { colors } from '../../../../styles';
import { reText } from '../../../../styles/size';
import { nstyles } from '../../../../styles/styles';
import apis from '../../../apis'
import { Images } from '../../../images';
import moment from 'moment'
import { NavigationEvents } from 'react-navigation';
import { appConfig } from '../../../../app/Config';

class NotiDichVuCong extends Component {

    componentDidMount() {
        this.props.GetThongBaoDichVuCong()
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

    render() {
        let { dataNotiDVC, isRefreshDVC } = this.props.thongbao
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    scrollEventThrottle={10}
                    showsVerticalScrollIndicator={false}
                    renderItem={this._renderItem}
                    data={dataNotiDVC}
                    ListEmptyComponent={<ListEmpty textempty={isRefreshDVC ? 'Đang tải' : 'Không có dữ liệu'} isImage={!isRefreshDVC} />}
                    keyExtractor={(item, index) => index.toString()}
                    refreshing={isRefreshDVC}
                    onRefresh={this._onRefresh}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={this._ListFooterComponent}
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,
    thongbao: state.thongbao
});
export default Utils.connectRedux(NotiDichVuCong, mapStateToProps, true);
