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
import DatePicker from 'react-native-datepicker';
import FontSize from '../../../styles/FontSize';

const Loai = [
    {
        status: 0,
        name: 'Chưa duyệt'
    },
    {
        status: 1,
        name: 'Duyệt'
    },
    {
        status: 2,
        name: 'Không duyệt'
    }
]
class DSDuyetGDD extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            dataList: [],
            refreshing: true,
            textempty: 'Đang tải...',
            page: { Page: 1, AllPage: 1, Size: 10, Total: 0 },
            ToDate: '',
            FromDate: '',
            selectLoai: Loai[0]
        };
    }

    componentDidMount() {
        this.GetListDangKyGDD()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    GetListDangKyGDD = async () => {
        const { page, text, dataList, selectLoai, FromDate, ToDate } = this.state
        let res = await apis.apiIOC.GetList_GiayDiDuong(page.Page, page.Size, text, selectLoai?.status, FromDate, ToDate)
        Utils.nlog('[LOG] res history', res)
        if (res.status == 1 && res.data) {
            this.setState({
                dataList: [...dataList, ...res.data],
                refreshing: false,
                textempty: 'Không có dữ liệu',
                page: res.page ? res.page : this.state.page
            })
        } else {
            this.setState({
                dataList: [],
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
        Utils.goscreen(this, 'Modal_ChiTietGDD', { data: item, isDuyet: true, reloadList: (id) => this.reloadList(id) })
    }

    reloadList = (Id) => {
        const { dataList } = this.state
        this.setState({
            dataList: dataList.filter(e => e.Id != Id)
        })
    }

    renderItem = ({ item, index }) => {
        // const { dataList } = this.state;
        const trangthai = item?.Status ? item.Status == 0 ? 'Chờ duyệt' : item.Status == 1 ? 'Đã duyệt' : item.Status == 2 ? 'Không duyệt' : '' : 'Chờ duyệt'
        return (
            <View>
                {/* {(index == 0 || moment(item.NgayQuet, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY') != moment(dataList[index - 1].NgayQuet, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY')) ?
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
                            <Text style={{ fontWeight: 'bold' }}>{item?.FullName ? item.FullName : ''}</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item?.PhoneNumber ? item.PhoneNumber : ''}</Text>
                        </View>
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
        this.setState({ page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }, text: text, refreshing: true, textempty: 'Đang tải...', dataList: [] }, this.GetListDangKyGDD)
    }

    _ListFooterComponent = () => {
        const { page } = this.state
        return page.Page < page.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    loadMore = async () => {
        const { page } = this.state
        if (page.Page < page.AllPage) {
            this.setState({ page: { ...page, Page: page.Page + 1 } }, this.GetListDangKyGDD)
        }
    }

    _onRefresh = () => {
        this.setState({ page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }, refreshing: true, textempty: 'Đang tải...', dataList: [] }, this.GetListDangKyGDD)
    }

    TuNgay = async (date) => {
        let { ToDate } = this.state;
        let FromDate = date;
        if (moment(FromDate, "DD-MM-YYYY").isAfter(moment(ToDate, "DD-MM-YYYY"))) {
            FromDate = ToDate
        }
        this.setState({ FromDate: FromDate }, this.GetListDangKyGDD)
    }

    DenNgay = async (date) => {
        let { FromDate } = this.state;
        let ToDate = date;
        if (moment(ToDate, "DD-MM-YYYY").isBefore(moment(FromDate, "DD-MM-YYYY"))) {
            ToDate = FromDate
        }
        this.setState({ ToDate: ToDate }, this.GetListDangKyGDD)
    }

    _viewItem = (item, value) => {
        // Utils.nlog('Log [item]', item)
        return (
            <View key={item.id} style={{
                flex: 1,
                paddingVertical: FontSize.scale(15),
                borderBottomColor: colors.black_50,
            }}>
                <Text style={{ textAlign: 'center', color: colors.black_60 }} >{item[value] || ''}</Text>
            </View>
        )
    }

    onPressLoai = () => {
        Utils.navigate('Modal_ComponentSelectBottom', {
            callback: (val) => this.setState({ selectLoai: val }, this._onRefresh),
            "item": this.state.selectLoai || {},
            "title": 'Tình trạng',
            "AllThaoTac": Loai || [],
            "ViewItem": (i) => this._viewItem(i, 'name'),
            "Search": true,
            "key": 'name'
        })
    }

    render() {
        const { textempty, refreshing, dataList, keySearch, FromDate, ToDate, selectLoai } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <HeaderCus
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`Danh sách đăng ký giấy đi đường`}
                    styleTitle={{ color: colors.white, fontSize: reText(16) }}
                />
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                    {/* <View style={[nstyles.nrow, { paddingHorizontal: 10 }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ paddingVertical: 5 }}>Từ ngày</Text>
                            <DatePicker
                                customStyles={{
                                    datePicker: {
                                        backgroundColor: '#d1d3d8',
                                        justifyContent: 'center'
                                    }
                                }}
                                locale={'vi'}
                                date={FromDate}
                                confirmBtnText={'Xác nhận'}
                                cancelBtnText={'Hủy'}
                                mode="date"
                                placeholder="Chọn ngày"
                                showIcon={false}
                                format={'DD-MM-YYYY'}
                                style={{ width: '100%' }}
                                onDateChange={(date) => this.TuNgay(date)}

                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <Text style={{ paddingVertical: 5 }}>Đến ngày</Text>
                            <DatePicker
                                customStyles={{
                                    datePicker: {
                                        backgroundColor: '#d1d3d8',
                                        justifyContent: 'center'
                                    }
                                }}
                                locale={'vi'}
                                date={ToDate}
                                confirmBtnText={'Xác nhận'}
                                cancelBtnText={'Hủy'}
                                mode="date"
                                placeholder="Chọn ngày"
                                showIcon={false}
                                format={'DD-MM-YYYY'}
                                style={{ width: '100%' }}
                                onDateChange={(date) => this.DenNgay(date)}
                            />
                        </View>
                    </View> */}
                    <TouchableOpacity onPress={this.onPressLoai} activeOpacity={0.5}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderWidth: 0.5, margin: 10, borderColor: colors.black_40, borderRadius: 5 }}>
                            <Text style={{ fontWeight: 'bold' }}>{selectLoai?.name}</Text>
                            <Image source={Images.icDropDown} resizeMode='contain' style={nstyles.nIcon15} />
                        </View>
                    </TouchableOpacity>
                    <TextInput
                        placeholder={'Tìm kiếm...'}
                        style={{ padding: 10, borderWidth: 0.5, marginHorizontal: 10, borderColor: colors.black_40, borderRadius: 5 }}
                        onChangeText={this.onChangeText}
                    />
                    <FlatList
                        style={{ backgroundColor: colors.white }}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        data={dataList}
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

export default DSDuyetGDD;
