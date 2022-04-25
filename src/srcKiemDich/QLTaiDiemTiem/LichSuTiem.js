import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, TextInput, Platform, BackHandler, ActivityIndicator } from 'react-native';
import { appConfig } from '../../../app/Config';
import Utils from '../../../app/Utils';
import { HeaderCus, ListEmpty } from '../../../components';
import ImageCus from '../../../components/ImageCus';
import { colors } from '../../../styles';
import { reSize, reText } from '../../../styles/size';
import { nstyles } from '../../../styles/styles';
import apis from '../../apis';
import { Images } from '../../images';
import { KeyTiem } from './KeyTiem';

class LichSuTiem extends Component {
    constructor(props) {
        super(props);
        this.isModal = Utils.ngetParam(this, 'isModal', false);
        this.item = Utils.ngetParam(this, 'item', '')
        this.state = {
            text: '',
            dataHistory: [],
            refreshing: true,
            textempty: 'Đang tải...',
            page: { Page: 1, AllPage: 1, Size: 10, Total: 0 },
            item: this.item ? this.item : '', // item menu chức năng chưa keytiem
            selectedDiaDiem: ''
        };
    }

    componentDidMount() {
        this.getLichSuTiem()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    getLichSuTiem = async () => {
        const { page, text, dataHistory, item, selectedDiaDiem, } = this.state
        const { DiemTiem = {} } = this.props.datahcm
        let res = ``
        let objectGet = {
            "query.more": false,
            "query.page": page.Page,
            "query.record": page.Size,
            "query.filter.keys": 'Action|keyword|DiemTiem',
            "query.filter.vals": `${item.KeyTiem}|${text}|${selectedDiaDiem ? selectedDiaDiem.IdDiem : DiemTiem.IdDiem}`,
        }
        res = await apis.ApiChotKiem.List_LichSu_CheckInQRCode(objectGet)
        Utils.nlog('[LOG] res history', res)
        if (res.status == 1 && res.data) {
            this.setState({
                dataHistory: [...dataHistory, ...res.data],
                refreshing: false,
                textempty: 'Không có dữ liệu',
                page: res.page ? res.page : this.state.page
            })
        } else {
            this.setState({
                dataHistory: [],
                refreshing: false,
                textempty: 'Không có dữ liệu',
                page: res.page ? res.page : this.state.page
            })
        }
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

    goDetails = (dataHistory) => {
        //Chi tiet lich su check in
        Utils.goscreen(this, 'Modal_ChiTietLichSuTiem', { item: this.item, dataHistory: dataHistory })

    }

    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => { this.goDetails(item) }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                    <View style={[nstyles.nAva50, { backgroundColor: colors.BackgroundHome, marginTop: 5 }]}>
                        <ImageCus
                            defaultSourceCus={Images.imgAvatar}
                            source={item?.Avata ? { uri: appConfig.domain + item.Avata } : Images.imgAvatar}
                            style={[nstyles.nAva50, { alignSelf: 'center' }]}
                            resizeMode={'cover'} />
                    </View>
                    <View style={{ flex: 1, paddingLeft: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: reText(14), flex: 1 }} numberOfLines={1}>{item?.HoTen ? item.HoTen : ''}</Text>
                            {/* {
                                item?.IsNganHan && item.IsNganHan ?
                                    <View style={{ backgroundColor: '#FFD35C', borderRadius: 3, padding: 3, marginTop: 5 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: reText(14), color: colors.white }}>{'Ngắn hạn'}</Text>
                                    </View>
                                    : null
                            } */}
                        </View>
                        <Text style={{ fontSize: reText(14), marginTop: 8 }}>{item?.NgayQuet ? item.NgayQuet : ''}</Text>
                        <Text numberOfLines={2} style={{ fontSize: reText(14), marginTop: 5, textAlign: 'justify', lineHeight: 20 }}>
                            {/* Điểm tiêm: {item?.DiaChiDen ? item.DiaChiDen + ', ' : ''}{item?.Phuong_DiemDen ? item.Phuong_DiemDen + ', ' : ''}{item?.Quan_DiemDen ? item.Quan_DiemDen + ', ' : ''}{item?.ThanhPho_DiemDen ? item.ThanhPho_DiemDen : ''} */}
                            Điểm tiêm: {item?.TenDiemTiem}
                        </Text>
                    </View>
                </View>
                <View style={{ height: 0.5, backgroundColor: colors.grayLight, marginHorizontal: 10 }} />
            </TouchableOpacity>
        )
    }

    _keyExtractor = (item, index) => index.toString()

    onChangeText = (text) => {
        this.setState({ page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }, text: text, refreshing: true, textempty: 'Đang tải...', dataHistory: [] }, this.getLichSuTiem)
    }

    _ListFooterComponent = () => {
        const { page } = this.state
        return page.Page < page.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    loadMore = async () => {
        const { page } = this.state
        if (page.Page < page.AllPage) {
            this.setState({ page: { ...page, Page: page.Page + 1 } }, this.getLichSuTiem)
        }
    }

    _onRefresh = () => {
        this.setState({ page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }, refreshing: true, textempty: 'Đang tải...', dataHistory: [] }, this.getLichSuTiem)
    }

    goFillterDiemTiem = () => {
        Utils.navigate('Modal_FillterDiemTiem', { isModalFillter: true, callbackFillter: this.callbackFillter })
    }

    callbackFillter = (diadiem) => {
        this.setState({ selectedDiaDiem: diadiem }, () => this._onRefresh())
    }

    render() {
        const { textempty, refreshing, dataHistory, keySearch, item, selectedDiaDiem } = this.state
        const { DiemTiem = {} } = this.props.datahcm
        return (
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <HeaderCus
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`LỊCH SỬ ${item?.name.replace('\n', ' ').toUpperCase()}`}
                    styleTitle={{ color: colors.white, fontSize: reText(20) }}
                />
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => { this.goFillterDiemTiem() }}>
                        <View style={{ borderWidth: 0.5, borderColor: colors.grayLight, flexDirection: 'row', margin: 10, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={Images.icMap} style={[nstyles.nAva16, { marginLeft: 10 }]} resizeMode={'contain'} />
                            {
                                selectedDiaDiem ? <Text style={{ flex: 1, padding: 10, color: colors.black_50 }} numberOfLines={1}>{`${selectedDiaDiem?.DiaChi + ', ' + selectedDiaDiem?.PhuongXa + ', ' + selectedDiaDiem?.QuanHuyen + ', ' + selectedDiaDiem?.TinhThanh}`}</Text> :
                                    // <Text style={{ flex: 1, padding: 10, color: colors.black_50 }} numberOfLines={1}>{'Chọn điểm tiêm'}</Text>
                                    <Text style={{ flex: 1, padding: 10, color: colors.black_50 }} numberOfLines={1}>{`${DiemTiem?.DiaChi + ', ' + DiemTiem?.PhuongXa + ', ' + DiemTiem?.QuanHuyen + ', ' + DiemTiem?.TinhThanh}`}</Text>
                            }
                        </View>
                    </TouchableOpacity>
                    <FlatList
                        contentContainerStyle={{ paddingBottom: 40 }}
                        data={dataHistory}
                        renderItem={this.renderItem}
                        keyExtractor={this._keyExtractor}
                        onRefresh={this._onRefresh}
                        refreshing={refreshing}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={0.4}
                        ListFooterComponent={this._ListFooterComponent}
                        ListEmptyComponent={<ListEmpty textempty={textempty} isImage={!refreshing} />}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,
    datahcm: state.datahcm
});
export default Utils.connectRedux(LichSuTiem, mapStateToProps, true);