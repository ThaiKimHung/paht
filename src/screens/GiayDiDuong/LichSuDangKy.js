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
class LichSuDangKy extends Component {
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
        let res = await apis.ApiApp.GetList_GiayDiDuongCongDan(page.Page, page.Size)
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
        Utils.goscreen(this, 'Modal_ChiTietGDD', { ID: item?.Id })
    }

    renderItem = ({ item, index }) => {
        // const { dataHistory } = this.state;
        const trangthai = item?.Status ? item.Status == 0 ? 'Chờ duyệt' : item.Status == 1 ? 'Đã duyệt' : item.Status == 2 ? 'Không duyệt' : '' : 'Chờ duyệt'
        return (
            <View>
                {/* {(index == 0 || moment(item.NgayQuet, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY') != moment(dataHistory[index - 1].NgayQuet, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY')) ?
                    <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 10, marginBottom: 10 }}>
                        <Image source={Images.ic_datepicker_hcm} style={{ tintColor: colors.black_60 }} />
                        <Text style={{ fontSize: reText(16), marginLeft: 5, fontWeight: 'bold', color: colors.black_60 }}>{item?.NgayQuet ? moment(item.NgayQuet, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY') : ''}</Text>
                    </View> : null} */}
                <TouchableOpacity key={index} style={[nstyles.shadow, {
                    backgroundColor: item?.Status ? item.Status == 0 ? '#F0770C11A' : item.Status == 1 ? '#15824B1A' : item.Status == 2 ? '#F500001A' : '' : '#F0770C1A',
                    margin: 10, borderRadius: 3, padding: 5
                }]} onPress={() => { this.goDetails(item) }}>
                    <View style={{ flex: 1, }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: reText(14), marginTop: 5, fontWeight: 'bold' }}>{'Từ: '}
                                <Text style={{ fontWeight: 'normal' }}>{item?.startTime ? item?.startTime : ''} {item?.startDate ? item?.startDate : ''}</Text>
                            </Text>
                            <Text style={{ fontSize: reText(14), marginTop: 5, fontWeight: 'bold' }}>{'Đến: '}
                                <Text style={{ fontWeight: 'normal' }}>{item?.totime ? item?.totime : ''} {item?.endDate ? item?.endDate : ''}</Text>
                            </Text>
                        </View>
                        <Text style={{ fontSize: reText(14), marginTop: 5, fontWeight: 'bold', textAlign: 'justify' }}>{'Điểm đi: '}
                            <Text style={{ fontWeight: 'normal' }}>{item?.startAddress ? item.startAddress : ''}</Text>
                        </Text>
                        <Text style={{ fontSize: reText(14), marginTop: 5, fontWeight: 'bold', textAlign: 'justify' }}>{'Điểm đến: '}
                            <Text style={{ fontWeight: 'normal' }}>{item?.endAddress ? item.endAddress : ''}</Text>
                        </Text>
                        <Text style={{
                            fontSize: reText(14), marginTop: 5, fontWeight: 'bold', textAlign: 'justify', fontStyle: 'italic', fontWeight: 'bold',
                            color: item?.Status ? item.Status == 0 ? colors.orangCB : item.Status == 1 ? colors.greenFE : item.Status == 2 ? colors.redStar : '' : colors.orangCB
                        }}>{'Trạng thái: '}{trangthai}
                        </Text>
                    </View>
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
                    title={`Lịch sử đăng ký`}
                    styleTitle={{ color: colors.white, fontSize: reText(18) }}
                />
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                    <FlatList
                        style={{ backgroundColor: colors.white }}
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

export default LichSuDangKy;
