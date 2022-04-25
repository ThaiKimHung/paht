import React, { Component, forwardRef, useState, useMemo, useImperativeHandle, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, FlatList, BackHandler, ActivityIndicator, StyleSheet, TextInput, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Utils from '../../../app/Utils';
import { HeaderCus, ListEmpty } from '../../../components';
import ActionHCM from '../../../srcRedux/actions/datahcm/DataHCMAction';
import { colors } from '../../../styles';
import FontSize from '../../../styles/FontSize';
import { reSize, reText } from '../../../styles/size';
import { nstyles, Width } from '../../../styles/styles';
import apis from '../../apis';
import { Images } from '../../images';
import ComponentItem, { TYPES } from '../../screens/user/dangky/Component';

const ChonDiemTiem = (props) => {
    const { listProvine = [], ChotKiemDich = {}, DiemTiem = {} } = useSelector(state => state.datahcm);
    const isModalFillter = Utils.ngetParam({ props: props }, 'isModalFillter', false)
    const callbackFillter = Utils.ngetParam({ props: props }, 'callbackFillter', () => { })
    const [objectData, setobjectData] = useState({});
    const [objectDataSelect, setobjectDataSelect] = useState({
        "KhuPho": [],
        "Phuong": [],
        "Quan": [],
        "Tinh": listProvine || []
    })
    const [ListDiemTiem, setListDiemTiem] = useState([])
    const [Page, setPage] = useState({ Page: 1, AllPage: 1, Size: 10, Total: 0 })
    const [refreshing, setRefreshing] = useState(true)
    const [textempty, settextempty] = useState('Đang tải...')
    const [keySearch, setkeySearch] = useState('')

    const getListDistric = async (IdDV, idCap = 2) => {
        let res = await apis.ApiHCM.GetListDonVi(idCap, IdDV);
        Utils.nlog("1[LOG] data ------getListDistric-----", res, idCap, IdDV)
        if (res.status == 1) {
            if (idCap == 2) {
                setobjectDataSelect({ ...objectDataSelect, ["Quan"]: res.data })
                if (res?.data && res.data.length == 1) {
                    ChangeObjectData('Quan', res.data[0])
                }
            } else if (idCap == 7) {
                //Khu phố
                setobjectDataSelect({ ...objectDataSelect, ["KhuPho"]: res.data })
            } else {
                setobjectDataSelect({ ...objectDataSelect, ["Phuong"]: res.data })
            }
        }
    }

    const dispatch = useDispatch();
    const getDataCommon = () => {
        dispatch(ActionHCM.getProvince(1, () => {
            //Xử lý callback khi get tỉnh không có
            if (listProvine.length == 0) {
                getListDistric('', 2)
            }
        }))
    }

    useEffect(() => {
        // Đợi có dữ liệu đổi ChotKiemDich thành DiemTiem
        if (!isModalFillter) {
            if (DiemTiem?.IdDiem) {
                Utils.navigate('Modal_SubMenuTiem', { isSaveDiemTiem: true })
            }
        }
        return () => {

        }
    }, [])


    useEffect(() => {
        getDataCommon()
    }, [])

    useEffect(() => {
        if (objectData['Tinh']) {
            setobjectData({ ...objectData, ["Phuong"]: '', ["Quan"]: '' })
            getListDistric(objectData['Tinh']["IdDonVi"], 2)
        } else {
        }
    }, [objectData['Tinh']])

    useEffect(() => {
        if (objectData['Quan']) {
            setobjectData({ ...objectData, ["Phuong"]: '' })
            getListDistric(objectData['Quan']["IdDonVi"], 3)
            Utils.nlog("[LOG] ", objectData['Quan']["IdDonVi"])
        } else {

        }
    }, [objectData['Quan']])

    useEffect(() => {
        if (objectData['Phuong']) {
            setobjectData({ ...objectData, ["KhuPho"]: '' })
            getListDistric(objectData['Phuong']["IdDonVi"], 7)
            Utils.nlog("[LOG] ", objectData['Phuong']["IdDonVi"])
        } else {

        }
    }, [objectData['Phuong']])

    useEffect(() => {
        setobjectDataSelect({
            ...objectDataSelect,
            "Tinh": listProvine
        })
    }, [listProvine])

    useEffect(() => {
        getListDiemTiem()
    }, [objectData['Tinh'], objectData['Quan'], objectData['Phuong'], objectData['KhuPho'], keySearch])

    const getListDiemTiem = async (isNext = false) => {
        //Có dữ liệu mới get danh sách điểm tiêm
        let { Phuong, Quan, Tinh, KhuPho } = objectData
        let objectGet = {
            "query.record": Page.Size,
            "query.more": false,
            "query.page": isNext ? Page.Page + 1 : 1,
            "query.filter.keys": 'DonVi|keyword',
            "query.filter.vals": `${KhuPho?.IdDonVi}|${keySearch}`,
        }
        if (KhuPho && Phuong) {
            setRefreshing(true)
            settextempty('Đang tải...')
            let res = await apis.ApiQLTaiDiemTiem.GetList_DiemTiem_App(objectGet)
            Utils.nlog("[LOG] list diem tiem", res)
            if (res.status == 1 && res.data) {
                setRefreshing(false)
                setListDiemTiem(isNext ? [...ListDiemTiem, ...res.data] : res.data)
                setPage(res.page ? res.page : Page)
            } else {
                setRefreshing(false)
                setListDiemTiem([])
                setPage(res.page ? res.page : Page)
                settextempty('Không có dữ liệu')
            }
        } else {
            setRefreshing(false)
            setListDiemTiem([])
            settextempty('Không có dữ liệu')
        }
    }

    const _viewItem = (item, value) => {
        return (
            <View key={item.id} style={{
                flex: 1,
                paddingVertical: FontSize.scale(15),
                borderBottomColor: colors.black_50,
            }}>
                <Text style={{ textAlign: 'center', color: colors.black_60 }} >{item[value].toUpperCase() || ''}</Text>
            </View>
        )
    }
    const ChangeObjectData = (key, val) => {
        setobjectData({ ...objectData, [key]: val })
    }
    const onPressModal = (item) => {
        const { key, title_drop = 'Danh sách', keyView = '' } = item;
        // Utils.nlog("data---------", item, objectDataSelect)
        Utils.navigate('Modal_ComponentSelectBottom', {
            callback: (val) => ChangeObjectData(key, val),
            "item": objectData[key] || {},
            "title": title_drop,
            "AllThaoTac": objectDataSelect[key] || [],
            "ViewItem": (i) => _viewItem(i, keyView),
            "Search": true,
            "key": keyView
        })
    }


    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backAction)
        return () => {
            try {
                BackHandler.removeEventListener('hardwareBackPress', backAction)
            } catch (error) {

            }
        }
    }, [backAction])

    const backAction = () => {
        if (isModalFillter) {
            goBackIsModal()
            return true
        } else {
            Utils.navigate('ManHinh_Home')
            return true
        }
    }

    const ChonChot = (item) => {
        //Xử lý redux gọi lưu lại địa điểm mặc định cho các lần sau
        if (isModalFillter) {
            goBackIsModal(item)
        } else {
            dispatch(ActionHCM.SaveDiemTiem(item))
            Utils.navigate('Modal_SubMenuTiem', { isSaveDiemTiem: true })
        }
    }

    const renderCom = (item, index) => {
        const { name, key, placehoder, errorText, helpText, isEnd, keyView = '' } = item
        switch (item.type) {
            case TYPES.DropDown:
                if (item.isRow) {
                    return useMemo(() => <ComponentItem.ComponentDrop  {...item} isDrop={true} key={index} value={objectData[key] ? objectData[key][keyView].toUpperCase() : ''}
                        onPress={() => onPressModal(item)}
                        onChangTextIndex={val => ChangeObjectData(key, val)}
                        placeholder={placehoder.toUpperCase()}
                        styleContainer={isEnd ? stChonDiemTiem.dropdownContainerIsEnd : stChonDiemTiem.dropdownContainer}
                        styleContentLabel={{ marginTop: -10 }}
                        styleBodyInput={stChonDiemTiem.compBodyInput}
                    />, [item, objectData, objectDataSelect])
                } else {
                    return useMemo(() => <ComponentItem.ComponentDrop isDrop={true}  {...item} key={index} value={objectData[key] ? objectData[key][keyView].toUpperCase() : ''}
                        onPress={() => onPressModal(item)}
                        onChangTextIndex={val => ChangeObjectData(key, val)}
                        placeholder={placehoder.toUpperCase()}
                        // styleContainer={isEnd ? stChonDiemTiem.dropdownContainerIsEnd : stChonDiemTiem.dropdownContainer}
                        styleContentLabel={{ marginTop: -10 }}
                        styleBodyInput={stChonDiemTiem.compBodyInput}
                    />, [item, objectData, objectDataSelect])
                }

                break;
            default:
                return <View />
                break;
        }
    }

    const RenderItem = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => ChonChot(item)}>
                <View style={stChonDiemTiem.itemList}>
                    <Image source={Images.icDiaDiemTiem} style={nstyles.nIcon20} resizeMode='contain' />
                    <View style={{ flex: 1, paddingLeft: 15 }}>
                        <Text style={stChonDiemTiem.txtChotKiem} numberOfLines={2}>{item?.TenDiemTiem ? item?.TenDiemTiem : ''}</Text>
                        <Text style={stChonDiemTiem.txtDiaChi}>
                            {item.DiaChi ? item.DiaChi : ''}
                        </Text>
                        <Text style={[stChonDiemTiem.txtDiaChi, { fontStyle: 'italic', color: colors.black_50 }]}>
                            {item.PhuongXa ? item.PhuongXa + ', ' : ''}{item.QuanHuyen ? item.QuanHuyen + ', ' : ''}{item.TinhThanh ? item.TinhThanh : ''}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const _onRefresh = async () => {
        getListDiemTiem(false)
    }

    const _keyExtractor = (item, index) => index.toString()

    const _ListFooterComponent = () => {
        return Page.Page < Page.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    const loadMore = async () => {
        if (Page.Page < Page.AllPage) {
            getListDiemTiem(true)
        }
    }

    const goBackIsModal = (item) => {
        callbackFillter(item ? item : null)
        Utils.goback({ props: props })
    }

    const onChangeText = (text) => {
        setListDiemTiem([])
        setkeySearch(text)
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <HeaderCus
                onPressLeft={isModalFillter ? () => goBackIsModal(null) : () => Utils.navigate('ManHinh_Home')}
                iconLeft={Images.icBack}
                title={`CHỌN ĐỊA ĐIỂM TIÊM`}
                styleTitle={{ color: colors.white, fontSize: reText(20) }}
            />
            <View style={stChonDiemTiem.Container}>
                <View style={stChonDiemTiem.HeaderList}>
                    {
                        listCom.map(renderCom)
                    }
                </View>
                <View style={{ borderWidth: 0.5, borderColor: colors.black_50, flexDirection: 'row', margin: 13, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={Images.icSearch} style={[nstyles.nAva16, { marginLeft: 10 }]} resizeMode={'contain'} />
                    <TextInput
                        value={keySearch}
                        style={{ padding: Platform.OS == 'android' ? 5 : 10, flex: 1, fontSize: reText(14), color: colors.black_80 }}
                        placeholder={'Nhập địa điểm cần tìm...'.toUpperCase()}
                        onChangeText={onChangeText}
                    />
                </View>
                <FlatList
                    extraData={ListDiemTiem}
                    style={{ marginTop: 10 }}
                    data={ListDiemTiem}
                    renderItem={RenderItem}
                    keyExtractor={_keyExtractor}
                    ItemSeparatorComponent={() => {
                        return <View style={stChonDiemTiem.ItemSeparatorComponent} />
                    }}
                    onRefresh={_onRefresh}
                    refreshing={refreshing}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.4}
                    ListFooterComponent={_ListFooterComponent}
                    ListEmptyComponent={<ListEmpty textempty={textempty} isImage={!refreshing} />}
                />
            </View>
        </View>
    )
}

const stChonDiemTiem = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: colors.white
    },
    HeaderList: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    dropdownContainer: {
        width: '50%',
        paddingLeft: FontSize.scale(10),
        paddingRight: 0
    },
    dropdownContainerIsEnd: {
        width: '50%',
        paddingLeft: FontSize.scale(10),
        paddingRight: FontSize.scale(10)
    },
    compBodyInput: {
        borderRadius: 3, borderWidth: 0.5, minHeight: FontSize.scale(35),
        alignItems: 'center', paddingVertical: 0, borderColor: colors.brownGreyThree
    },
    itemList: {
        flexDirection: 'row', backgroundColor: colors.white, justifyContent: 'flex-start', padding: 13
    },
    txtChotKiem: {
        fontWeight: 'bold', fontSize: reText(14), textAlign: 'justify'
    },
    txtDiaChi: {
        fontSize: reText(14), marginTop: 10, textAlign: 'justify', lineHeight: 20
    },
    ItemSeparatorComponent: {
        height: 1, backgroundColor: colors.brownGreyThree, marginLeft: reSize(48)
    }
})

export default ChonDiemTiem

const listCom = [
    // {
    //     id: 4,
    //     name: 'Tỉnh',
    //     type: TYPES.DropDown,
    //     check: false,
    //     key: 'Tinh',
    //     placehoder: '- Chọn tỉnh -',
    //     errorText: '',
    //     helpText: '',
    //     isRow: true,
    //     isEnd: false,
    //     keyView: 'TenPhuongXa'
    // },
    {
        id: 5,
        name: 'Huyện',
        type: TYPES.DropDown,
        check: false,
        key: 'Quan',
        placehoder: '- Chọn quận/huyện -',
        errorText: '',
        helpText: '',
        isRow: false,
        isEnd: false,
        keyView: 'TenPhuongXa'
    },
    {
        id: 6,
        name: 'Xã',
        type: TYPES.DropDown,
        check: true,
        key: 'Phuong',
        placehoder: '- Chọn xã/phường -',
        errorText: '',
        helpText: '',
        isRow: true,
        isEnd: false,
        keyView: 'TenPhuongXa'
    },
    {
        id: 7,
        name: 'Khu phố/tổ/ấp',
        type: TYPES.DropDown,
        check: true,
        key: 'KhuPho',
        placehoder: '- Chọn khu phố/tổ/ấp -',
        errorText: '',
        helpText: '',
        isRow: true,
        isEnd: true,
        keyView: 'TenPhuongXa'
    }
];
