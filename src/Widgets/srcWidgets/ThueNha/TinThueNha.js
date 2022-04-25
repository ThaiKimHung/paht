import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect, useImperativeHandle, useMemo, } from 'react'
import { ButtonWidget, DropWidget, InputWidget, EmptyWidgets } from '../../CompWidgets'
import { colorsWidget, colors } from '../../../../styles/color'
import { FlatList, ScrollView } from 'react-navigation'
import ExampleCompWidget from '../../CompWidgets/ExampleCompWidget'
import Utils from "../../../../app/Utils";
import { ApiRaoVat } from '../../apis'
import ItemThueNha from './ItemThueNha'
import { formatNumber, onChangeDropdown } from '../RaoVat/DangTin/HandlerDangTin'
import TextApp from '../../../../components/TextApp';
import { reText } from '../../../../styles/size'
import { loadListTinThueNha, setDataTinThueNha, setPageTinThueNha, setRefreshingTinThueNha } from '../../../../srcRedux/actions/widgets'
import { useDispatch, useSelector } from 'react-redux'
import { nstyles } from '../../../../styles/styles'
import { Images } from '../../../images'

const KEY_COMP = {
    TINH: 'TINH',
    LOAINHA: 'LOAINHA'
}
const TinThueNha = (props) => {
    const [selectedTinh, setSelectedTinh] = useState('')
    const [dataTinh, setDataTinh] = useState([])
    const [selectedMucGia, setSelectedMucGia] = useState('')
    const [selectedLoaiNha, setSelectedLoaiNha] = useState('')
    const [dataLoaiNha, setDataLoaiNha] = useState([])
    const [tuDienTich, setTuDienTich] = useState('')
    const [denDienTich, setDenDienTich] = useState('')
    const [selectedDienTich, setSelectedDienTich] = useState('')
    const [showDienTich, setShowDienTich] = useState(false)
    const [trackingNext, setTrackingNext] = useState(false)
    const [tuGia, setTuGia] = useState('')
    const [denGia, setDenGia] = useState('')
    const [showMucGia, setShowMucGia] = useState(false)
    const [trackingNextGia, setTrackingNextGia] = useState(false)
    const {
        LstTinThueNha = [],
        RefreshingTinThueNha = true,
        PageTinThueNha = { Page: 1, AllPage: 1 }
    } = useSelector(state => state.Widgets)
    const dispatch = useDispatch()

    useEffect(() => {
        onRefresh()
    }, [selectedTinh, selectedLoaiNha, props?.textSearch])

    const getData = async (isNext = false) => {
        let objFilter = {
            "TinhThanh": selectedTinh?.IDTinhThanh == -1 ? '' : selectedTinh?.IDTinhThanh || '',
            "LoaiNha": selectedLoaiNha?.Id == -1 ? '' : selectedLoaiNha?.Id || '',
            "GiaTu": tuGia?.replace(/,/g, '') || '',
            "GiaDen": denGia?.replace(/,/g, '') || '',
            "DTTu": tuDienTich || '',
            "DTDen": denDienTich || '',
            "keyword": props?.textSearch || '',
        }
        let keyFilter = '', valFilter = ''
        for (const property in objFilter) {
            keyFilter += `${property}|`
            valFilter += `${objFilter[property]}|`
        }
        console.log('objfilter', keyFilter, valFilter)
        dispatch(loadListTinThueNha(isNext, keyFilter, valFilter))
    }

    const onRefresh = () => {
        dispatch(setPageTinThueNha({ Page: 1, AllPage: 1 }))
        dispatch(setRefreshingTinThueNha(true))
        dispatch(setDataTinThueNha([]))
        getData()
    }

    const _ListFooterComponent = () => {
        return PageTinThueNha.Page < PageTinThueNha.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    const loadMore = async () => {
        if (PageTinThueNha.Page < PageTinThueNha.AllPage) {
            getData(true)
        }
    }

    useEffect(() => {
        if (tuDienTich && denDienTich && tuDienTich <= denDienTich)
            setTrackingNext(true)
        else
            setTrackingNext(false)
    }, [tuDienTich, denDienTich])

    useEffect(() => {
        if (tuGia && denGia && tuGia <= denGia)
            setTrackingNextGia(true)
        else
            setTrackingNextGia(false)
    }, [tuGia, denGia])

    useEffect(() => {
        getInitProps()
    }, [])

    const getInitProps = async () => {
        let resTinh = await ApiRaoVat.GetAllListDMTinhThanh()
        let resLoaiNha = await ApiRaoVat.GetAllList_DM_LoaiNha()
        if (resTinh.status == 1) {
            setDataTinh([{ IDTinhThanh: -1, TenTinhThanh: "Tất cả" }, ...resTinh?.data])
        } else {
            setDataTinh([])
        }

        if (resLoaiNha.status == 1) {
            setDataLoaiNha([{ Id: -1, TenLoai: 'Tất cả' }, ...resLoaiNha?.data])
        } else {
            setDataLoaiNha([])
        }
    }

    function nFormatter(num, digits) {
        const lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "nghìn" },
            { value: 1e6, symbol: "triệu" },
            { value: 1e9, symbol: "tỉ" },
            { value: 1e12, symbol: "nghìn tỉ" },
            // { value: 1e15, symbol: "P" },
            // { value: 1e18, symbol: "E" }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var item = lookup.slice().reverse().find(function (item) {
            return num >= item.value;
        });
        return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + ' ' + item.symbol : "0";
    }

    function renderFilter() {
        return (
            <>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', paddingVertical: 5, paddingHorizontal: 12, justifyContent: 'flex-start' }}>
                    <DropWidget
                        placeholder={'Dropdown'}
                        value={selectedTinh?.TenTinhThanh || 'Tất cả'}
                        onPress={onPressTinh}
                        style={{
                            borderWidth: 0,
                            paddingVertical: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-start'
                        }}
                        label={'Khu vực:'}
                        styleIcon={{ marginLeft: 10 }}
                        styleValue={{ flex: 0 }}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 0, paddingHorizontal: 10 }}>
                    <DropWidget
                        placeholder={'Dropdown'}
                        value={selectedMucGia || 'Mức giá'}
                        style={stTinThueNha.dropdownFilter}
                        hideLabel
                        onPress={() => {
                            setShowDienTich(false)
                            setShowMucGia(!showMucGia)
                        }}
                    />
                    <DropWidget
                        placeholder={'Dropdown'}
                        value={selectedLoaiNha?.TenLoai || 'Loại nhà'}
                        onPress={onPressLoaiNha}
                        style={stTinThueNha.dropdownFilter}
                        hideLabel
                    />
                    <DropWidget
                        placeholder={'Chọn tình trạng'}
                        value={selectedDienTich || 'Diện tích'}
                        //value={tuDienTich}
                        style={stTinThueNha.dropdownFilter}
                        onPress={() => {
                            setShowDienTich(!showDienTich);
                            setShowMucGia(false)
                        }}
                        hideLabel
                    />
                </View>
                {showDienTich &&
                    <View style={{ paddingHorizontal: 15, padding: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <InputWidget
                                    keyboardType="numeric"
                                    styleInput={{ padding: 10, marginTop: 0 }}
                                    label='' placeholder='Từ (m2)'
                                    value={tuDienTich}
                                    onChangeText={(text) => setTuDienTich(text)}
                                />
                            </View>
                            <View style={{ flex: 1, marginHorizontal: 5 }}>
                                <InputWidget
                                    keyboardType="numeric"
                                    styleInput={{ padding: 10, marginTop: 0 }}
                                    label=''
                                    value={denDienTich}
                                    placeholder='Đến (m2)'
                                    onChangeText={(text1) => setDenDienTich(text1)}
                                />
                            </View>
                            <ButtonWidget
                                disabled={!trackingNext}
                                styleText={{ color: !trackingNext ? colorsWidget.placeholderInput : colorsWidget.main }}
                                style={{
                                    backgroundColor: !trackingNext ? colorsWidget.grayDropdown : colorsWidget.mainOpacity,
                                    width: 50, justifyContent: 'center', position: 'relative'
                                }} text='Lọc'
                                onPress={() => {
                                    setSelectedDienTich(tuDienTich + ' - ' + denDienTich + ' m2')
                                    setShowDienTich(false)
                                    setTrackingNext(true)
                                    onRefresh()
                                }}
                            />
                        </View>
                        <TextApp style={{ color: colorsWidget.main, fontSize: reText(12), marginTop: 3 }}>{'(*) Giá trị từ phải nhỏ hơn giá trị đến'}</TextApp>
                    </View>
                }
                {showMucGia &&
                    <View style={{ paddingHorizontal: 15, padding: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <InputWidget
                                    keyboardType="numeric"
                                    styleInput={{ padding: 10, marginTop: 0 }}
                                    label='' placeholder='Từ (VND)'
                                    value={formatNumber(tuGia)}
                                    onChangeText={(text) => setTuGia(text)}
                                    maxLength={16}
                                />
                            </View>
                            <View style={{ flex: 1, marginHorizontal: 5 }}>
                                <InputWidget
                                    keyboardType="numeric"
                                    styleInput={{ padding: 10, marginTop: 0 }}
                                    label=''
                                    value={formatNumber(denGia)}
                                    placeholder='Đến (VND)'
                                    onChangeText={(text1) => setDenGia(text1)}
                                    maxLength={16}
                                />
                            </View>
                            <ButtonWidget
                                disabled={!trackingNextGia}
                                styleText={{ color: !trackingNextGia ? colorsWidget.placeholderInput : colorsWidget.main }}
                                style={{
                                    backgroundColor: !trackingNextGia ? colorsWidget.grayDropdown : colorsWidget.mainOpacity,
                                    width: 50, justifyContent: 'center', position: 'relative'
                                }} text='Lọc'
                                onPress={() => {
                                    setSelectedMucGia(nFormatter(tuGia.replace(/,/g, ''), 1) + ' - ' + nFormatter(denGia.replace(/,/g, ''), 1))
                                    setShowMucGia(false)
                                    setTrackingNextGia(true)
                                    onRefresh()
                                }}
                            />
                        </View>
                        <TextApp style={{ color: colorsWidget.main, fontSize: reText(12), marginTop: 3 }}>{'(*) Giá trị từ phải nhỏ hơn giá trị đến'}</TextApp>
                    </View>
                }
                {props?.textSearch && props?.textSearch?.length > 0 ?
                    <View style={{ paddingHorizontal: 15, paddingTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TextApp style={{
                            color: colorsWidget.main, fontStyle: 'italic', flex: 1
                        }} numberOfLines={1}>
                            {`Kết quả tìm kiếm: ${props?.textSearch}`}</TextApp>
                        <TouchableOpacity onPress={() => { props?.reloadSearch() }} style={{ paddingLeft: 10 }}>
                            <Image source={Images.icClose} style={[nstyles.nIcon14, { tintColor: colorsWidget.main }]} />
                        </TouchableOpacity>
                    </View>
                    : null
                }
            </>
        )
    }

    const onGoDetails = (item) => {
        Utils.navigate('scChiTietTinThueNha', { IdThueNha: item?.Id })
    }

    const onSaved = (item) => {

    }


    const renderItem = ({ item }) => (
        <ItemThueNha
            dataItem={item}
            onPress={() => onGoDetails(item)}
            onPressLike={() => onSaved(item)}
        />
    );

    function renderListRaoVat() {
        return <View style={{ flex: 1, paddingTop: 10 }}>
            <FlatList
                contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 15, flex: LstTinThueNha.length > 0 ? null : 1 }}
                data={LstTinThueNha}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                keyExtractor={(item, index) => index.toString()}
                refreshing={RefreshingTinThueNha}
                onRefresh={onRefresh}
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={_ListFooterComponent}
                ListEmptyComponent={<EmptyWidgets style={{ flex: 1, justifyContent: 'center' }} textEmpty={RefreshingTinThueNha ? 'Đang tải...' : 'Không có dữ liệu'} />}
            />
        </View>
    }
    const viewItemList = (item, value, keyId, currentSelected) => {
        // Utils.nlog('Log [item]', item, value, keyId, currentSelected)
        return (
            <View key={item.id} style={{
                flex: 1,
                paddingVertical: 12,
                borderBottomColor: colors.black_50,
                backgroundColor: item[keyId] == currentSelected[keyId] ? colorsWidget.mainOpacity : 'white',
                paddingHorizontal: 10
            }}>
                <Text style={{ textAlign: 'left', color: item[keyId] == currentSelected[keyId] ? colorsWidget.main : colorsWidget.textDropdown, }} >{item[value] || ''}</Text>
            </View>
        )
    }

    const changeData = (key, val) => {
        switch (key) {
            case KEY_COMP.TINH:
                setSelectedTinh(val)
                break;
            case KEY_COMP.LOAINHA:
                setSelectedLoaiNha(val)
                break;
            default:
                break;
        }
    }

    const onPressChoose = (config) => {
        const { title_drop = 'Danh sách', keyView = '', key, currentSelected, data = [], keyID, isWhiteHeader } = config
        Utils.navigate('Modal_ComponentSelectBottom', {
            callback: (val) => changeData(key, val),
            "item": currentSelected || {},
            "title": title_drop,
            "AllThaoTac": data || [],
            "ViewItem": (item, currentSelected) => viewItemList(item, keyView, keyID, currentSelected),
            "Search": true,
            "key": keyView,
            "isWhiteHeader": isWhiteHeader
        })
    }
    const onPressTinh = () => {
        onPressChoose({
            title_drop: 'Khu vực tỉnh thành',
            keyView: 'TenTinhThanh',
            key: KEY_COMP.TINH,
            currentSelected: selectedTinh,
            data: dataTinh,
            keyID: 'IDTinhThanh',
            isWhiteHeader: true,
        })
    }

    const onPressLoaiNha = () => {
        onPressChoose({
            title_drop: 'Loại nhà',
            keyView: 'TenLoai',
            key: KEY_COMP.LOAINHA,
            currentSelected: selectedLoaiNha,
            data: dataLoaiNha,
            keyID: 'Id',
            isWhiteHeader: true
        })
    }

    return (
        <View style={{ flex: 1 }}>
            {/* {render filter} */}
            {renderFilter()}
            {/* {render danh sách rao vặt} */}
            {renderListRaoVat()}
        </View >

    )
}

const stTinThueNha = StyleSheet.create({
    dropdownFilter: {
        flex: 1,
        paddingVertical: 8,
        padding: 10,
        marginHorizontal: 2
    }
})


export default TinThueNha