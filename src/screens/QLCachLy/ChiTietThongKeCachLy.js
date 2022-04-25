
import React, { Component, createRef } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, TextInput, BackHandler } from 'react-native'
import Utils, { icon_typeToast } from '../../../app/Utils'
import { HeaderCus, ListEmpty, DatePick } from '../../../components'
import ButtonCom from '../../../components/Button/ButtonCom';
import { colors } from '../../../styles'
import { reText, sizes } from '../../../styles/size'
import { Width, nstyles } from '../../../styles/styles'
import apis from '../../apis'
import { Images } from '../../images'
import IsLoading from '../../../components/IsLoading';
import ImageCus from '../../../components/ImageCus';
import moment from 'moment'
import { appConfig } from '../../../app/Config';

const KeyTitle = {
    1: 'Đang xét nghiệm',
    2: 'Dương tính',
    3: 'Âm tính lần 1',
    4: 'Âm tính lần 2',
    5: 'Âm tính lần 3',
    6: 'Đã khỏi bệnh',
    7: 'Chuyển biến nặng',
    8: 'Nhập viện',
}
class ChiTietThongKeCachLy extends Component {
    constructor(props) {
        super(props);
        this.keyDetails = Utils.ngetParam(this, 'keyDetails', '')
        this.state = {
            text: '',
            data: [],
            refreshing: true,
            textempty: 'Đang tải...',
            dateTo: '',
            dateFrom: '',
            page: { Page: 1, AllPage: 1, Size: 10, Total: 1 }
        };
        this.refLoading = createRef()
    }

    componentDidMount() {
        this.getDanhSachCachLyTaiNha()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goback(this)
        return true
    }
    // api 
    getDanhSachCachLyTaiNha = async () => {
        const { page, text, data, dateFrom, dateTo } = this.state
        const tungay = dateTo ? moment(dateTo, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''
        const denngay = dateFrom ? moment(dateFrom, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''
        let dataBoDy = {
            "TuNgay": "",// tungay,
            "DenNgay": "",//denngay,
            "keyword": text,
            "IdPhanCapBenh": this.keyDetails && this.keyDetails?.Id ? this.keyDetails.Id : '',
            "IdTinhTrangSucKhoe": this.keyDetails && this.keyDetails?.TinhTrangSucKhoe ? this.keyDetails.TinhTrangSucKhoe : '',
        }
        let res = await apis.apiQuanLyCachLy.GetListCachLyTaiNha(page.Size, page.Page, dataBoDy)
        Utils.nlog("Details ListCachLyTaiNha:", res)
        if (res.status == 1 && res.data) {
            this.setState({
                data: [...data, ...res.data],
                refreshing: false,
                textempty: 'Không có dữ liệu',
                page: res.page ? res.page : this.state.page
            })
        } else {
            this.setState({
                data: [],
                refreshing: false,
                textempty: 'Không có dữ liệu',
                page: res.page ? res.page : this.state.page
            })
        }
    }
    // flatllist
    loadMore = async () => {
        const { page } = this.state
        if (page.Page < page.AllPage) {
            this.setState({ page: { ...page, Page: page.Page + 1 } }, this.getDanhSachCachLyTaiNha)
        }
    }
    _onRefresh = () => {
        this.setState({ page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }, refreshing: true, textempty: 'Đang tải...', data: [] }, this.getDanhSachCachLyTaiNha)
    }
    _ListFooterComponent = () => {
        const { page } = this.state
        return page.Page < page.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }
    _keyExtractor = (item, index) => index.toString()
    // Utils.goscreen
    
    goDetails = (item) => {
        Utils.goscreen(this, 'Modal_ChiTietQuanLyCachLy', { item: item })
    }
    

    _renderItem = ({ item, index }) => {
        const { data } = this.state
        return (
            <View>
                {(index == 0 || moment(item.CreatedDate, 'DD/MM/YYYY hh:mm').format('DD/MM/YYYY') != moment(data[index - 1].CreatedDate, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY')) ?
                    <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 10, marginBottom: 10 }}>
                        <Image source={Images.ic_datepicker_hcm} style={{ tintColor: colors.black_60 }} />
                        <Text style={{ fontSize: reText(16), marginLeft: 5, fontWeight: 'bold', color: colors.black_60 }}>{item?.CreatedDate ? moment(item.CreatedDate, 'DD/MM/YYYY hh:mm').format('DD/MM/YYYY') : ''}</Text>
                    </View> : null}
                <TouchableOpacity  key={index} style={{ backgroundColor: colors.white }} onPress={() => { this.goDetails(item) }}>
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
                                <Text style={{ fontWeight: 'bold', fontSize: reText(14), flex: 1 }} numberOfLines={1}>{item?.FullName ? item.FullName : ''}</Text>
                            </View>
                            <Text style={{ fontSize: reText(14), marginTop: 5 }}>
                                Số điện thoại: {item?.PhoneNumber_CD ? item.PhoneNumber_CD : ''}
                            </Text>
                            <Text numberOfLines={2} style={{ fontSize: reText(14), marginTop: 5, textAlign: 'justify', lineHeight: 20 }}>
                                Địa chỉ : {item?.DiaChi_CD ? item.DiaChi_CD + ', ' : ''}
                            </Text>
                            <Text numberOfLines={2} style={{ fontSize: reText(14), marginTop: 5, textAlign: 'justify', lineHeight: 20 }}>
                                cấp bệnh : <Text style={{ color: item.CapBenhNhan == 'F0' ? colors.redStar : colors.black }}>{item?.CapBenhNhan ? item.CapBenhNhan + ' ,' : ''}</Text> Tình trạng : <Text style={{ color: item.TinhTrangSucKhoe == 'Dương tính' ? colors.redStar : colors.black }}>{item?.TinhTrangSucKhoe ? item.TinhTrangSucKhoe : ''}</Text>
                            </Text>
                        </View>
                    </View>
                    {/* <TouchableOpacity onPress={() => this.remind(item)} style={{ backgroundColor: colors.redFresh, alignSelf: 'flex-end', padding: 10, margin: 5, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={Images.icThongbao} style={[nstyles.nIcon20, { tintColor: colors.white }]} resizeMode={'contain'} />
                        <Text style={{ color: colors.white, fontWeight: 'bold', paddingHorizontal: 5 }}>{'Thông báo bệnh nặng'}</Text>
                    </TouchableOpacity> */}
                    <View style={{ height: 0.5, backgroundColor: colors.grayLight, marginHorizontal: 10 }} />
                </TouchableOpacity>
            </View>
        )
    }
    // datepicker
    onChangeDate = (val, isFrom = true) => {
        const { dateTo, dateFrom } = this.state
        if (isFrom) {
            if (dateFrom) {
                let number = moment(val, 'YYYY-MM-DD').diff(moment(dateFrom, 'YYYY-MM-DD'))
                if (number <= 0) {
                    this.setState({ dateTo: val }, this._onRefresh)
                } else {
                    Utils.showToastMsg("Thông báo", "Từ ngày phải nhỏ hơn đến ngày", icon_typeToast.warning);
                }

            } else {
                this.setState({ dateTo: val }, this._onRefresh)
            }

        } else {
            if (dateTo) {
                let number = moment(dateTo, 'YYYY-MM-DD').diff(moment(val, 'YYYY-MM-DD'))
                if (number <= 0) {
                    this.setState({ dateFrom: val }, this._onRefresh)
                } else {
                    Utils.showToastMsg("Thông báo", "Đến ngày phải lớn hơn từ ngày", icon_typeToast.warning);
                }


            } else {
                this.setState({ dateFrom: val }, this._onRefresh)
            }
        }

    }

    render() {
        const { textempty, refreshing, data, dateTo, dateFrom } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <HeaderCus
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`Danh sách ${this.keyDetails?.Mota}-${KeyTitle[this.keyDetails?.TinhTrangSucKhoe]}`}
                    styleTitle={{ color: colors.white, fontSize: reText(15) }}
                />
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                    {/* <View style={[nstyles.nrow, { padding: 10 }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: reText(12) }}>Từ ngày</Text>
                            <View style={styles.btnCalendar}>
                                <DatePick
                                    style={{ width: "100%" }}
                                    value={dateTo}
                                    onValueChange={dateTo => this.onChangeDate(dateTo, true)}
                                />
                            </View>
                        </View>
                        <View style={{ width: 5 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: reText(12) }}>Đến ngày</Text>
                            <View style={styles.btnCalendar}>
                                <DatePick
                                    style={{ width: "100%" }}
                                    value={dateFrom}
                                    onValueChange={dateFrom => this.onChangeDate(dateFrom, false)}
                                />
                            </View>
                        </View>
                    </View> */}
                    <TextInput
                        placeholder="Từ khoá..."
                        style={{ padding: 10, marginHorizontal: 10, marginVertical: 10, backgroundColor: colors.white, borderWidth: 0.5, borderRadius: 5, borderColor: colors.black_40 }}
                        onChangeText={text => this.setState({ text: text }, this._onRefresh)}
                    />

                    <FlatList
                        style={{ backgroundColor: colors.black_16 }}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        data={data}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                        onRefresh={this._onRefresh}
                        refreshing={refreshing}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={0.4}
                        ListFooterComponent={this._ListFooterComponent}
                        ListEmptyComponent={<ListEmpty textempty={textempty} isImage={!refreshing} />}
                    />
                </View>
                <IsLoading ref={this.refLoading} />
            </View>
        );
    }
}

export default ChiTietThongKeCachLy

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.BackgroundHome,

    },
    btnCalendar: {
        ...nstyles.nrow,
        padding: 10,
        backgroundColor: colors.veryLightPink,
        // alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
        borderRadius: 2
    },
})
