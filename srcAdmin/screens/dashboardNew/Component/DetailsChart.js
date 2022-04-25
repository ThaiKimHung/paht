import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import Utils from '../../../../app/Utils'
import { HeaderCom, IsLoading, ListEmpty } from '../../../../components'
import HtmlViewCom from '../../../../components/HtmlView'
import { Images } from '../../../../src/images'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import { nstyles } from '../../../../styles/styles'
import {
    GetList_DienBienXuLyPATrong6Thang_ChiTiet,
    GetList_PATongQuanTheoDanhGia_ChiTiet,
    GetList_PATongQuanTheoThoiHan_ChiTiet,
    GetList_PATongQuanTheoTrangThai_ChiTiet,
    GetList_Top5DonViPhanHoiDanhGiaTot_ChiTiet,
    GetList_Top5DonViPhanHoiDanhGia_ChiTiet,
    GetList_Top5DonViXuLyTheoHenTot_ChiTiet,
    GetList_Top5DonViXuLyTheoHen_ChiTiet,
    GetList_Top5LinhVucBiPANhieuNhat_ChiTiet,
    GetList_Top5LinhVucTonNhieuPA_ChiTiet,
    GetList_Top5LinhVucXuLyNhieuPA_ChiTiet,
    Get_BieuDo_Top5KhuVucPA_Chitiet
} from '../../../apis/apiDashboardPA'
import { ConfigScreenDH } from '../../../routers/screen'


const DetailsChart = (props) => {
    const item = Utils.ngetParam({ props }, 'item')
    const refFlatList = useRef(null)
    const [itemDrop, setItemDrop] = useState({
        ID: 0,
        value: 'Tất Cả',
    });
    const [state, setState] = useState({
        refreshing: true,
        data: [],
        page: {
            AllPage: 0,
            Page: 0,
            Size: 0,
            Total: 0,
        }
    })

    useEffect(() => {
        onRefresh();
    }, [onRefresh, itemDrop])

    useEffect(() => {
        if (state.page.Page === 1 || state.data.length <= 0)
            nthisIsLoading.hide();
    }, [state])

    const onRefresh = async () => {
        setState({
            ...state,
            refreshing: true,
        })
        await CallApi(item['keyApi'], 1);
    }

    const ConverDate = (date) => {
        let month = date?.getMonth() < 9 ? '0' + (date?.getMonth() + 1) : (date?.getMonth() + 1);
        let datenew = month + '/' + date.getFullYear();
        return datenew;
    }

    const setStates = (res, page) => {
        if (res.status === 1 && res.data) {
            console.log(res)
            setState({
                ...state,
                refreshing: false,
                data: page === 1 ? res.data : state.data.concat(res.data),
                page: {
                    ...res.page,
                },
            })
        }
        else {
            setState({
                refreshing: false,
                data: [],
                page: {
                    AllPage: 0,
                    Page: 0,
                    Size: 0,
                    Total: 0,
                },
            })
        }
    }

    const CallApi = async (key, page = 0) => {
        let date = ConverDate(item['date']);
        let res;
        let itemType;
        if (page === 1) {
            nthisIsLoading.show();
            if (state.data.length > 0)
                refFlatList.current?.scrollToIndex({ animated: false, index: 0 });
        }
        switch (key) {
            case 'Top5KhuVucPA':
                res = await Get_BieuDo_Top5KhuVucPA_Chitiet(page, 10, item['IdDVXL'], date, item['linhvuc'])
                setStates(res, page)
                return;
            case 'Top5LinhVucXuLyNhieuPA':
                res = await GetList_Top5LinhVucXuLyNhieuPA_ChiTiet(page, 10, date, item['IdLinhVuc'])// lấy lĩnh vực từ item
                setStates(res, page);
                return;
            case 'Top5LinhVucTonNhieuPA':
                res = await GetList_Top5LinhVucTonNhieuPA_ChiTiet(page, 10, date, item['IdLinhVuc'])// lấy lĩnh vực từ item
                setStates(res, page);
                return;
            case 'DienBienXuLyPATrong6Thang':
                let month = item['Thang'];
                res = await GetList_DienBienXuLyPATrong6Thang_ChiTiet(page, 10, month, item['linhvuc'], itemDrop.ID === 0 ? -1 : itemDrop.ID)
                setStates(res, page);
                return;
            case 'Top5LinhVucBiPANhieuNhat':
                console.log('vao get api sau khi setstate')
                res = await GetList_Top5LinhVucBiPANhieuNhat_ChiTiet(page, 10, date, item['IdLinhVuc'],// lấy lĩnh vực từ item
                    itemDrop.ID === 0 ? 0 : itemDrop.ID)
                setStates(res, page);
                break;
            case 'Top5DonViXuLyTheoHen':
                res = await GetList_Top5DonViXuLyTheoHen_ChiTiet(page, 10, date, item['linhvuc'], item['IdDVXL'],
                    itemDrop.ID === 0 ? -1 : itemDrop.ID)
                setStates(res, page);
                return;
            case 'Top5DonViXuLyTheoHenTot':
                res = await GetList_Top5DonViXuLyTheoHenTot_ChiTiet(page, 10, date, item['linhvuc'], item['IdDVXL'],
                    itemDrop.ID === 0 ? -1 : itemDrop.ID)
                setStates(res, page);
                return;
            case 'Top5DonViPhanHoiDanhGia':
                itemType = item['ItemType'] === 'KhongHaiLong' ? '0' : '1,2';
                res = await GetList_Top5DonViPhanHoiDanhGia_ChiTiet(page, 10, date, item['linhvuc'], item['IdDVXL'], itemType)
                setStates(res, page);
                return;
            case 'Top5DonViPhanHoiDanhGiaTot':
                itemType = item['ItemType'] === 'KhongHaiLong' ? '0' : '1,2';
                res = await GetList_Top5DonViPhanHoiDanhGiaTot_ChiTiet(page, 10, date, item['linhvuc'], item['IdDVXL'], itemType)
                setStates(res, page);
                return;
            case 'PATongQuan':
                switch (item['keyApiChildren']) { // nhận key api từ hàm FilterPie
                    case 'PATongQuanTheoTrangThai_ChiTiet':
                        itemType = item['keyPie'] === 'DangXuLy' ? '3' : '4,5,6,100'; // đã xử lý và chưa xử lý
                        res = await GetList_PATongQuanTheoTrangThai_ChiTiet(page, 10, date, item['linhvuc'], -1, itemType)
                        setStates(res, page);
                        return;
                    case 'PATongQuanTheoThoiHan_ChiTiet':
                        itemType = item['keyPie'] === 'SLQuaHanDaXLTQ' ? '1' : item['keyPie'] === 'SLQuaHanDaXLTT' ? 1 :
                            item['keyPie'] === 'SLTrongHanDaXLTQ' ? '0' : item['keyPie'] === 'SLTrongHanDaXLTT' ? '0' : - 1 // đã xử lý và chưa xử lý
                        res = await GetList_PATongQuanTheoThoiHan_ChiTiet(page, 10, date, item['linhvuc'], itemType)
                        setStates(res, page);
                        return;
                    case 'PATongQuanTheoDanhGia_ChiTiet':
                        itemType = item['keyPie'] === 'HaiLong' ? 'Hài lòng' : 'Không hài lòng'
                        res = await GetList_PATongQuanTheoDanhGia_ChiTiet(page, 10, date, item['linhvuc'], itemType)
                        setStates(res, page);
                        return;
                    default:
                        break;
                }
                return;
            default:
                break;
        }
    }

    const _keyExtractor = (item, index) => {
        return index.toString()
    }

    const loadMore = () => {
        const { page } = state;
        if (page?.Page < page?.AllPage) {
            CallApi(item['keyApi'], page.Page + 1);
        }
    };

    const Go_Screen = (id) => {
        Utils.goscreen(props.navigation, ConfigScreenDH.Modal_ChiTietPA,
            {
                IdPA: id,
                isMenuMore: -1,
            })
    }
    const _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={[nstyles.shadown, {
                backgroundColor: colors.white,
                marginBottom: 17, paddingHorizontal: 15,
                paddingVertical: 10, elevation: 3, borderRadius: 8,
            }]}
                onPress={() => Go_Screen(item?.IdPA)}
            >
                <Text style={{ ...stDetailsChart.txtTileItem, color: colors.peacockBlue, paddingVertical: 5 }}>{item?.TieuDe}</Text>
                <View style={{ height: Platform.OS == 'ios' ? 55 : 62, paddingHorizontal: 5 }}>
                    <HtmlViewCom
                        html={item?.NoiDung}
                        style={{ height: '100%' }}
                    />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                    <Text style={{ ...stDetailsChart.txtTile, marginTop: 10, fontWeight: 'bold', color: colors.greenyBlue }} >
                        {'Mã: ' + item?.MaPhanAnh}</Text>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text style={{ ...stDetailsChart.txtTile, marginTop: 10, fontWeight: 'bold' }} >{item?.FullName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    const ListFooterComponent = () => {
        const { page } = state;
        return page?.Page < page?.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    const ConverDataDropDown = (data, type) => {
        let dataNew = [];
        switch (type) {
            case 'Top5LinhVucBiPANhieuNhat':
                for (let index = 0; index < data.length; index++) {
                    dataNew = [...dataNew, {
                        ID: data[index] === 'SLTChuaXuLy' ? '3' : '4,5,6,100',
                        value: data[index] === 'SLTChuaXuLy' ? 'Chưa xử lý' : 'Đã xử lý',
                    }]
                }
                dataNew.unshift({ ID: 0, value: 'Tất Cả' })
                return dataNew;
            case 'Top5DonViXuLyTheoHen':
                for (let index = 0; index < data.length; index++) {
                    dataNew = [...dataNew, {
                        ID: data[index] === 'SLQuaHanDaXL' ? '1' : '-1',
                        value: data[index] === 'SLQuaHanDaXL' ? 'Quá Hạn' : '',
                    }]
                }
                dataNew.unshift({ ID: 0, value: 'Tất Cả' })
                return dataNew;
            case 'Top5DonViXuLyTheoHenTot':
                for (let index = 0; index < data.length; index++) {
                    dataNew = [...dataNew, {
                        ID: data[index] === 'SLQuaHanDaXL' ? '-1' : '0',
                        value: data[index] === 'SLQuaHanDaXL' ? '' : 'Đúng Hạn',
                    }]
                }
                dataNew.unshift({ ID: 0, value: 'Tất Cả' })
                return dataNew;
            case 'DienBienXuLyPATrong6Thang':
                for (let index = 0; index < data.length; index++) {
                    dataNew = [...dataNew, {
                        ID: data[index] === 'SLTrongHanDaXL' ? '0' : '1',
                        value: data[index] === 'SLTrongHanDaXL' ? 'Đúng Hạn' : 'Quá Hạn',
                    }]
                }
                dataNew.unshift({ ID: 0, value: 'Tất Cả' })
                return dataNew;
            default:
                break;
        }
    }
    const _callback = async (selectBuocXuLy) => { // lấy ra key để lọc api
        setItemDrop(
            {
                ID: selectBuocXuLy.ID,
                value: selectBuocXuLy.value,
            }
        )
    }

    const OnDropDown = () => {
        let data = item['dataDrop'];
        let keyApi = item['keyApi']// lấy giá trị key api 
        let dataNew = ConverDataDropDown(data, keyApi);
        Utils.goscreen(props.navigation, ConfigScreenDH.Modal_List_LinhVuc, {
            callback: _callback, item: state.value,
            AllLinhVuc: dataNew, KeyValue: 'value', KeyId: 'ID'
        })
    }
    const ListEmptyComponent = () => {
        return (
            <ListEmpty textempty={'Không có dữ liệu'} />
        )
    }
    console.log(state);
    return (
        <View style={stDetailsChart.container}>
            <HeaderCom
                titleText={'Chi tiết thống kê'}
                iconLeft={Images.icBack}
                onPressLeft={() => { Utils.goback({ props }) }}
                hiddenIconRight={true}

            />
            {item['typeDrop'] ?
                <View style={{ flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center' }}>
                    <View style={[nstyles.shadown, {
                        flex: 0.7, flexDirection: 'row',
                        backgroundColor: colors.white,
                        borderRadius: 10,
                        marginTop: 10,
                        paddingVertical: 10, paddingHorizontal: 10,
                        elevation: 3
                    }]}>
                        <Text style={stDetailsChart.txtTile}>{itemDrop.value}</Text>
                        <TouchableOpacity onPress={OnDropDown} style={{
                            flex: 1, alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                        }}>
                            <Image source={Images.icDropDown} style={[nstyles.nIcon15, { tintColor: 'gray' }]} resizeMode='contain' />
                        </TouchableOpacity>
                    </View>
                    <View style={[nstyles.shadown, {
                        flex: 0.3, marginTop: 10,
                        paddingVertical: 10, paddingHorizontal: 10,
                        borderRadius: 10,
                        marginLeft: 5, backgroundColor: colors.white, elevation: 3
                    }]}>
                        <View style={{ backgroundColor: 'white' }}>
                            <Text style={stDetailsChart.txtTile}  >{'Tổng:'} <Text style={{ color: colors.orange }} >{state.page?.Total}</Text> </Text>
                        </View>
                    </View>
                </View>
                :
                <View style={[nstyles.shadown, { paddingVertical: 10, backgroundColor: 'white', paddingHorizontal: 15, elevation: 3 }]}>
                    <Text style={stDetailsChart.txtTile}  >{'Tổng:'} <Text style={stDetailsChart.txtTotal} >{state.page?.Total}</Text> </Text>
                </View>
            }
            <View style={{ paddingTop: 10, flex: 1 }} >
                <FlatList
                    ref={refFlatList}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={ListFooterComponent}
                    contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 15 }}
                    refreshing={state.refreshing}
                    onEndReached={loadMore}
                    onRefresh={onRefresh}
                    onEndReachedThreshold={0.5}
                    data={state.data}
                    renderItem={_renderItem}
                    keyExtractor={_keyExtractor}
                    ListEmptyComponent={ListEmptyComponent}
                />
            </View>
            <IsLoading />
        </View >
    )
}

export default DetailsChart

const stDetailsChart = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    txtTile: {
        fontSize: reText(15),
    },
    txtTileItem: {
        fontSize: reText(15),
        fontWeight: 'bold',
    },
    txtTotal: {
        color: colors.orange,
        fontWeight: 'bold',
    }


})
