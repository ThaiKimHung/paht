import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, TextInput, Platform, BackHandler, ActivityIndicator, ScrollView } from 'react-native';
import { appConfig } from '../../../../app/Config';
import Utils, { icon_typeToast } from '../../../../app/Utils';
import { ButtonCom, HeaderCus, ListEmpty, IsLoading } from '../../../../components';
import ImageCus from '../../../../components/ImageCus';
import { colors } from '../../../../styles';
import { reSize, reText } from '../../../../styles/size';
import { Height, nstyles, Width } from '../../../../styles/styles';
import apis from '../../../apis';
import { Images } from '../../../images';
import ModalDrop from '../../../../srcAdmin/screens/PhanAnhHienTruong/components/ModalDrop'
import moment from 'moment'
import { ListHinhAnhCom } from '../GuiYCTuiAnSinh/components/ListHinhAnh';
import FontSize from '../../../../styles/FontSize';
import * as Animatable from 'react-native-animatable';
import ImagePickerNew from '../../../../components/ComponentApps/ImagePicker/ImagePickerNew';

const dataLocTheo = [
    {
        Key: 1,
        Value: 'Giúp đỡ',
    },
    {
        Key: 0,
        Value: 'Được giúp đỡ',
    },
]

const KeyFeedBack = {
    DaNhan: 2,
    ChuaNhan: 3
}

class LichSuGiupDo extends Component {
    constructor(props) {
        super(props);
        this.NoiDungGiupDo = ''
        this.state = {
            text: '',
            dataHistory: [],
            refreshing: true,
            textempty: 'Đang tải...',
            page: { Page: 1, AllPage: 1, Size: 10, Total: 0 },
            selectFilter: dataLocTheo[0],
            ListFileDinhKem: [],
            ListFileDinhKemNew: [],
            ListFileDinhKemDelete: [],
            IdRowPhanHoi: -1
        };
        this.refPick = React.createRef(null)
        this.refLoading = React.createRef(null)
    }

    componentDidMount() {
        this.GetListHistoryHelp()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    GetListHistoryHelp = async () => {
        const { page, text, dataHistory, selectFilter } = this.state
        let res = await apis.TuongTac.DanhSachAnSinhHoTro(page.Page, page.Size, selectFilter?.Key)
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
        // Utils.goscreen(this, 'Modal_ChiTietLichSuChotCho', { data: item })
    }

    onFeedBackHelp = async (item, Key) => {
        this.refLoading.current.show()
        if (!this.NoiDungGiupDo) {
            Utils.showToastMsg('Thông báo', 'Vui lòng nhập nội dung phản hồi', icon_typeToast.warning, 3000)
        }
        const listFileAdd = await this._handleListFileNew()
        let strBody = {
            "idRow": item?.IdRow,//Id ticket giúp đỡ k cacn truyen
            "IdPA": item.IdPA,
            "noiDung": this.NoiDungGiupDo,
            "IsCongDan": true,
            "status": Key,
            "UploadFile": listFileAdd,
        }
        Utils.nlog('[LOG] res body', strBody)
        const res = await apis.TuongTac.GiupDoYeuCau(strBody);
        this.refLoading.current.hide()
        Utils.nlog('[LOG] res phan hoi', res)
        if (res == -1 || res == -3) Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết mạng, vui lòng kiểm tra lại kết nối Internet', 'Xác nhận');
        else {
            if (res.status == 0) {
                Utils.showMsgBoxOK(this, 'Thông báo', res?.error?.message || 'Gửi phản hồi thất bại.', 'Xác nhận')

            } else {
                Utils.showMsgBoxOK(this, 'Thông báo', res?.error?.message || 'Gửi phản hồi thành công.', 'Xác nhận', () => { })
            };
            this.refInputGiupDo.clear()
            this.refPick?.current?.refreshData()
            this.setState({
                IdRowPhanHoi: -1,
                ListFileDinhKem: [],
                ListFileDinhKemNew: [],
                ListFileDinhKemDelete: []

            }, () => { this.NoiDungGiupDo = '', this.handleFlatlist(item, Key) })
        };
    }

    handleFlatlist = (item, Key) => {
        const { dataHistory } = this.state
        this.setState({
            dataHistory: dataHistory.map((e) => {
                if (e?.IdRow == item?.IdRow) {
                    return {
                        ...item,
                        Status: Key
                    }
                } else {
                    return {
                        ...e
                    }
                }
            })
        })
    }


    //Xử lý các file thêm mới
    _handleListFileNew = async () => {
        const { ListFileDinhKemNew } = this.state;
        let arrFileNew = [], arrFileDelete = []
        if (ListFileDinhKemNew.length > 0) {
            for (let index = 0; index < ListFileDinhKemNew.length; index++) {
                const element = ListFileDinhKemNew[index];
                let str64 = '', extent = ''
                if (element.type == 3) {
                    str64 = await Utils.parseBase64_File(element.uri)
                } else {
                    str64 = await Utils.parseBase64(element.uri, element.height ? element.height : 2000, element.width ? element.width : 2000, 0.5, element.type == 2 ? true : false)
                }

                if (element.type == 1) {
                    extent = '.png'
                } else if (element.type == 2) {
                    extent = '.mp4'
                } else {
                    extent = '.' + element.name.split('.')[element.name.split('.').length - 1]
                }
                arrFileNew.push({
                    filename: element.type == 3 ? element.name : `filename${index}${extent}`,
                    Type: element.type,
                    extension: extent,
                    strBase64: str64,
                })
            }
        }
        return arrFileNew;
    }

    renderItem = ({ item, index }) => {
        const { dataHistory, ListFileDinhKem, ListFileDinhKemNew, ListFileDinhKemDelete, IdRowPhanHoi, selectFilter } = this.state;
        // Utils.nlog("DỮ LIỆU:", item)
        // Utils.nlog("DỮ LIỆU222:", dataHistory)
        const check = (index == 0 || moment(item.NgayGui, 'DD/MM/YYYY hh:mm').format('DD/MM/YYYY') != moment(dataHistory[index - 1].NgayGui, 'DD/MM/YYYY hh:mm').format('DD/MM/YYYY'))
        return (
            <View>
                {check ?
                    <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 10 }}>
                        <Image source={Images.ic_datepicker_hcm} style={{ tintColor: colors.black_60 }} />
                        <Text style={{ fontSize: reText(16), marginLeft: 5, fontWeight: 'bold', color: colors.black_60 }}>{item?.NgayGui ? moment(item.NgayGui, 'DD/MM/YYYY hh:mm').format('DD/MM/YYYY') : ''}</Text>
                    </View> : null}
                <TouchableOpacity key={index} style={{}} disabled={true} onPress={() => { this.goDetails(item) }}>
                    <View style={{ marginHorizontal: 10, backgroundColor: colors.white, padding: 10, marginTop: check ? 10 : 0 }}>
                        <Text numberOfLines={2} style={{ fontWeight: 'bold', fontSize: reText(14), color: colors.colorHeaderApp, textAlign: 'justify' }}>{item?.TieuDe ? item?.TieuDe.trim() : 'Không có tiêu đề'}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: reText(14), flex: 1 }} numberOfLines={1}>{item?.FullName ? item.FullName : ''}</Text>
                                    <Text style={{ fontSize: reText(14) }}>{item?.NgayGui ? item?.NgayGui : ''}</Text>
                                </View>
                                {/* <Text style={{ fontSize: reText(14), marginTop: 5, fontWeight: 'bold' }}>{'Nội dung'}</Text> */}
                                <Text style={{ fontSize: reText(14), marginTop: 5, textAlign: 'justify', lineHeight: 20 }}>
                                    {'Nội dung giúp đỡ:'} {item?.NoiDung ? item?.NoiDung : ''}
                                </Text>
                            </View>
                        </View>
                        {item && item.DinkKem.length > 0 ?
                            <ListHinhAnhCom
                                buttonDelete={false}
                                buttonCamera={false}
                                link={true}
                                nthis={this}
                                ListHinhAnh={item.DinkKem} />
                            : null}
                        {
                            IdRowPhanHoi == item?.IdRow && item.Status == 1 ?
                                <Animatable.View animation={"fadeInUp"}>
                                    <Text style={{ fontWeight: 'bold', paddingVertical: 10 }}>{'Gửi phản hồi đền người giúp đỡ'}</Text>
                                    <View style={{ padding: 5, borderRadius: 5 }}>
                                        <TextInput
                                            multiline={true}
                                            style={{
                                                maxHeight: Height(10), minHeight: Height(10), textAlignVertical: 'top',
                                                padding: 8, borderRadius: 5, backgroundColor: colors.BackgroundHome
                                            }}
                                            placeholder={'Nhập nội dung phản hồi...'}
                                            onChangeText={text => this.NoiDungGiupDo = text}
                                            ref={ref => this.refInputGiupDo = ref}
                                            onFocus={e => this.refList.scrollToIndex({ index: index})}
                                        />
                                        <View style={{ borderRadius: 20 }}>
                                            <ImagePickerNew
                                                styleContainer={{ paddingHorizontal: 0 }}
                                                styleMenu={{ backgroundColor: 'white' }}
                                                data={this.isEdit == 1 ? ListFileDinhKem : []}
                                                dataNew={this.isEdit == -1 ? ListFileDinhKem : []}
                                                ref={this.refPick}
                                                NumberMax={8}
                                                isEdit={!this.isRead}
                                                keyname={"TenFile"} uniqueKey={'uri'} nthis={this}
                                                onDeleteFileOld={(data) => {
                                                    let dataNew = [].concat(ListFileDinhKemDelete).concat(data)
                                                    this.setState({ ListFileDinhKemDelete: dataNew })
                                                }}
                                                onAddFileNew={(data) => {
                                                    Utils.nlog("Data list image mớ", data)
                                                    this.setState({ ListFileDinhKemNew: data })
                                                }}
                                                onUpdateDataOld={(data) => {
                                                    this.setState({ ListFileDinhKem: data })
                                                }}
                                                isPickOne={true}
                                            >
                                            </ImagePickerNew>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                        <TouchableOpacity onPress={() => this.onFeedBackHelp(item, KeyFeedBack.DaNhan)} activeOpacity={0.5} style={{ marginRight: 5, flex: 1, padding: 10, backgroundColor: colors.greenishTeal, alignItems: 'center', borderRadius: 5 }}>
                                            <Text style={{ color: colors.white }}>{'Đã nhận'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.onFeedBackHelp(item, KeyFeedBack.ChuaNhan)} style={{ marginLeft: 5, flex: 1, padding: 10, backgroundColor: colors.redFresh, alignItems: 'center', borderRadius: 5 }}>
                                            <Text style={{ color: colors.white }}>{'Chưa nhận'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Animatable.View>
                                : selectFilter?.Key == 0 && item?.Status == 1 ? <TouchableOpacity
                                    onPress={() => { this.setState({ IdRowPhanHoi: item?.IdRow }) }}
                                    activeOpacity={0.5}
                                    style={{ marginRight: 5, padding: 10, backgroundColor: colors.redStar, alignItems: 'center', borderRadius: 5, marginTop: 10 }}>
                                    <Text style={{ color: colors.white, fontWeight: 'bold' }}>{'Phản hồi'}</Text>
                                </TouchableOpacity> : null
                        }

                    </View>
                    <View style={{ height: 0.5, backgroundColor: colors.grayLight, marginHorizontal: 10 }} />
                </TouchableOpacity>
            </View>
        )
    }

    _keyExtractor = (item, index) => index.toString()

    onChangeText = (text) => {
        this.setState({ page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }, text: text, refreshing: true, textempty: 'Đang tải...', dataHistory: [] }, this.GetListHistoryHelp)
    }

    _ListFooterComponent = () => {
        const { page } = this.state
        return page.Page < page.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    loadMore = async () => {
        const { page } = this.state
        if (page.Page < page.AllPage) {
            this.setState({ page: { ...page, Page: page.Page + 1 } }, this.GetListHistoryHelp)
        }
    }

    _onRefresh = () => {
        this.setState({ page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }, refreshing: true, textempty: 'Đang tải...', dataHistory: [] }, this.GetListHistoryHelp)
    }

    render() {
        const { textempty, refreshing, dataHistory, keySearch, selectFilter } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <HeaderCus
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`Lịch sử an sinh xã hội`}
                    styleTitle={{ color: colors.white, fontSize: reText(16) }}
                />
                <View style={{ flex: 1, backgroundColor: colors.colorPaleGrey }}>
                    <View style={[nstyles.shadow, { paddingHorizontal: 10, paddingTop: 5, backgroundColor: colors.white }]}>
                        <ScrollView scrollEnabled={false} style={{ paddingBottom: 10 }}>
                            <ModalDrop
                                value={selectFilter}
                                keyItem={'Key'}
                                texttitle={'Lọc theo'}
                                styleLabel={{ fontSize: reText(14) }}
                                // styleContent={{ }}
                                dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: reText(13) }}
                                options={dataLocTheo}
                                onselectItem={(item) => this.setState({ selectFilter: item }, this._onRefresh)}
                                Name={"Value"} />
                        </ScrollView>
                    </View>
                    <FlatList
                        ref={ref => this.refList = ref}
                        style={{ backgroundColor: colors.black_16 }}
                        contentContainerStyle={{ paddingBottom: Height(50) }}
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
                    <IsLoading ref={this.refLoading} />
                </View>
            </View>
        );
    }
}

export default LichSuGiupDo;
