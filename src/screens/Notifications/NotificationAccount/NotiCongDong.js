import React, { Component } from 'react'
import { Text, View, ScrollView, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import Utils from '../../../../app/Utils';
import { ListEmpty } from '../../../../components';
import { colors } from '../../../../styles';
import { reText } from '../../../../styles/size';
import { nstyles } from '../../../../styles/styles';
import apis from '../../../apis'
import { Images } from '../../../images';
import moment from 'moment'
import { NavigationEvents } from 'react-navigation';

class NotiCongDong extends Component {

    componentDidMount() {
        this.props.GetThongBaoCongDong()
    }

    _renderItem = ({ item, index }) => {
        const days = item?.NgayGui.slice(0, 10)
        const time = item?.NgayGui.slice(11, 16)
        const NgayHT = new Date;
        const songay = (moment(NgayHT, 'DD/MM/YYYY')).diff(moment(days, 'DD/MM/YYYY'), "days")
        return (
            <TouchableOpacity onPress={() => this._goChitietPA(item)} style={nstyles.shadown}>
                <View key={index} style={{
                    paddingVertical: 10,
                    backgroundColor: colors.white,
                    paddingHorizontal: 10, borderRadius: 5,
                    marginHorizontal: 10, marginBottom: 5, borderColor: colors.colorGrayLight,
                    marginTop: index == 0 ? 5 : 0,
                    opacity: item.IsSeen ? 0.5 : 1
                }}>
                    {/* <Image source={Images.icThongbao} /> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text
                            numberOfLines={2}
                            style={{ color: colors.colorBlueLight, lineHeight: reText(21), flex: 1 }}>{item.TieuDe}</Text>
                        <Text style={{ lineHeight: reText(21), color: colors.black, fontWeight: 'bold', textAlign: 'right' }}>
                            {time}
                        </Text>
                    </View>
                    <Text
                        numberOfLines={2}
                        style={{ lineHeight: reText(21), paddingVertical: 5, color: colors.black_80, }}>
                        {item.NoiDung}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ lineHeight: reText(21), color: colors.black_50, fontStyle: 'italic', }}>
                            {`${songay == 0 ? "H??m nay" : songay >= 30 ? +Math.floor(songay / 30) + ' th??ng tr?????c' : +songay + ' ng??y tr?????c'}`}
                        </Text>
                        <TouchableOpacity onPress={() => this._DeleteNoti(item, index)} style={{ padding: 10 }}>
                            <Image source={Images.icDelete} style={[nstyles.nIcon20, { tintColor: item.IsSeen ? null : colors.redStar }]} resizeMode='cover' />
                        </TouchableOpacity>
                    </View>
                </View>

            </TouchableOpacity >
        )
    }

    _goChitietPA = async (item) => {
        var { IdPA, ChuyenMuc = '', TypeReference } = item;
        await this.props.SeenThongBaoCongDong(item.IdNotify)
        if (TypeReference == 102) {
            Utils.goscreen(this.props.nthis, 'Modal_ChiTietTuiAnSinh', { IdPA: IdPA, TenChuyenMuc: ChuyenMuc })
        } else {
            Utils.goscreen(this.props.nthis, 'Modal_ChiTietPhanAnh', { IdPA: IdPA, TenChuyenMuc: ChuyenMuc })
        }

    }

    _DeleteNoti = async (item) => {
        Utils.showMsgBoxYesNo(this.props.nthis, "Th??ng b??o", "B???n c?? mu???n xo?? th??ng b??o n??y kh??ng", "X??c nh???n", "Tho??t", () => {
            this.props.DeleteThongBaoCongDong(item.IdNotify)
        })
    }

    _onRefresh = () => {
        this.props.GetThongBaoCongDong()
    }
    _ListFooterComponent = () => {
        let { Page, AllPage } = this.props.thongbao
        if (Page < AllPage)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return <View style={{ height: 50 }} />
    }

    loadMore = async () => {
        let { Page, AllPage } = this.props.thongbao
        const pageNumber = Page + 1;
        if (Page < AllPage) {
            this.props.LoadMoreThongBaoCongDong(pageNumber)
        };
    };

    render() {
        let { dataNotification, isRefresh } = this.props.thongbao
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    scrollEventThrottle={10}
                    showsVerticalScrollIndicator={false}
                    renderItem={this._renderItem}
                    data={dataNotification}
                    ListEmptyComponent={<ListEmpty textempty={isRefresh ? '??ang t???i' : 'Kh??ng c?? d??? li???u'} isImage={!isRefresh} />}
                    keyExtractor={(item, index) => index.toString()}
                    refreshing={isRefresh}
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
export default Utils.connectRedux(NotiCongDong, mapStateToProps, true);
