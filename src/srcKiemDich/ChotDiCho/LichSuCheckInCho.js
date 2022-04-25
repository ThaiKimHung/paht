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
import moment from 'moment'
class LichSuCheckInCho extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            dataHistory: [],
            refreshing: true,
            textempty: 'Đang tải...',
            page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }
        };
    }

    componentDidMount() {
        this.GetListHistoryScan()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    GetListHistoryScan = async () => {
        const { page, text, dataHistory } = this.state
        let res = await apis.ApiChotKiem.GetListHistoryScanMarket(text, page.Page, page.Size, 1)
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

    goDetails = (item) => {
        Utils.goscreen(this, 'Modal_ChiTietLichSuChotCho', { data: item })
    }

    renderItem = ({ item, index }) => {
        const { dataHistory } = this.state;
        // Utils.nlog("DỮ LIỆU:", item)
        Utils.nlog("DỮ LIỆU222:", dataHistory)
        return (
            <View>
                {(index == 0 || moment(item.NgayQuet, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY') != moment(dataHistory[index - 1].NgayQuet, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY')) ?
                    <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 10, marginBottom: 10 }}>
                        <Image source={Images.ic_datepicker_hcm} style={{ tintColor: colors.black_60 }} />
                        <Text style={{ fontSize: reText(16), marginLeft: 5, fontWeight: 'bold', color: colors.black_60 }}>{item?.NgayQuet ? moment(item.NgayQuet, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY') : ''}</Text>
                    </View> : null}
                <TouchableOpacity key={index} style={{ backgroundColor: colors.white }} onPress={() => { this.goDetails(item) }}>
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
                                <Text style={{ fontWeight: 'bold', fontSize: reText(14), flex: 1 }} numberOfLines={1}>{item?.TenCongDan ? item.TenCongDan : ''}</Text>
                            </View>
                            <Text style={{ fontSize: reText(14), marginTop: 5 }}>{item?.NgayQuet ? moment(item.NgayQuet, 'DD/MM/YYYY hh:mm:ss').format('HH:mm:ss') : ''}</Text>
                            <Text style={{ fontSize: reText(14), marginTop: 5 }}>{item?.TenTram ? item.TenTram : ''}</Text>
                            <Text numberOfLines={2} style={{ fontSize: reText(14), marginTop: 5, textAlign: 'justify', lineHeight: 20 }}>
                                Địa chỉ trạm: {item?.DiaChi ? item.DiaChi + ', ' : ''}{item?.Phuong ? item.Phuong + ', ' : ''}{item?.Quan ? item.Quan : ''}{item?.ThanhPho ? ', ' + item.ThanhPho : ''}
                            </Text>
                        </View>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: colors.grayLight, marginHorizontal: 10 }} />
                </TouchableOpacity>
            </View>
        )
    }

    _keyExtractor = (item, index) => index.toString()

    onChangeText = (text) => {
        this.setState({ page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }, text: text, refreshing: true, textempty: 'Đang tải...', dataHistory: [] }, this.GetListHistoryScan)
    }

    _ListFooterComponent = () => {
        const { page } = this.state
        return page.Page < page.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    loadMore = async () => {
        const { page } = this.state
        if (page.Page < page.AllPage) {
            this.setState({ page: { ...page, Page: page.Page + 1 } }, this.GetListHistoryScan)
        }
    }

    _onRefresh = () => {
        this.setState({ page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }, refreshing: true, textempty: 'Đang tải...', dataHistory: [] }, this.GetListHistoryScan)
    }

    render() {
        const { textempty, refreshing, dataHistory, keySearch } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <HeaderCus
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`Lịch sử đi chợ`}
                    styleTitle={{ color: colors.white, fontSize: reText(20) }}
                />
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                    <View style={{ borderWidth: 0.5, borderColor: colors.grayLight, flexDirection: 'row', margin: 10, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={Images.icSearch} style={[nstyles.nAva16, { marginLeft: 10 }]} resizeMode={'contain'} />
                        <TextInput
                            value={keySearch}
                            style={{ padding: Platform.OS == 'android' ? 5 : 10, flex: 1, fontSize: reText(14), }}
                            placeholder={'Tìm kiếm'}
                            onChangeText={this.onChangeText}
                        />
                    </View>

                    <FlatList
                        style={{ backgroundColor: colors.black_16 }}
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

export default LichSuCheckInCho;
