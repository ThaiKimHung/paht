import React, { Component, forwardRef, useState, useMemo, useImperativeHandle, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, FlatList, BackHandler, ActivityIndicator, StyleSheet } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useDispatch, useSelector } from 'react-redux';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import Utils from '../../../app/Utils';
import { ButtonCom, HeaderCus, ListEmpty } from '../../../components';
import ActionHCM from '../../../srcRedux/actions/datahcm/DataHCMAction';
import { colors } from '../../../styles';
import FontSize from '../../../styles/FontSize';
import { reSize, reText } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
import apis from '../../apis';
import { Images } from '../../images';
import ComponentItem, { TYPES } from '../../screens/user/dangky/Component';

const DanhSachChot = (props) => {
    const { listProvine = [], ChotKiemDich = {} } = useSelector(state => state.datahcm);
    const [objectData, setobjectData] = useState({});
    const [objectDataSelect, setobjectDataSelect] = useState({
        "Phuong": [],
        "Quan": [],
        "Tinh": listProvine || []
    })
    const [ListChot, setListChot] = useState([])
    const [Page, setPage] = useState({ Page: 1, AllPage: 1, Size: 10, Total: 0 })
    const [refreshing, setRefreshing] = useState(true)
    const [textempty, settextempty] = useState('Đang tải...')
    const checkQuayDau_ChotKiemDich = Utils.getGlobal(nGlobalKeys.checkQuayDau_ChotKiemDich, false)

    const getListDistric = async (IdDV, idCap = 2) => {
        let res = await apis.ApiHCM.GetListDonVi(idCap, IdDV);
        Utils.nlog("[LOG] data ------getListDistric-----", res, idCap, IdDV)
        if (res.status == 1) {
            if (idCap == 2) {
                setobjectDataSelect({ ...objectDataSelect, ["Quan"]: res.data })
                if (res?.data && res.data.length == 1) {
                    ChangeObjectData('Quan', res.data[0])
                }
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
        if (ChotKiemDich?.IdTram) {
            Utils.navigate('Modal_QuetMaKiemDich', { isSaveChotKiem: true })
        }
        return () => {

        }
    }, [])


    useEffect(() => {
        getDataCommon()
        getListDistric('', 2)
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
        setobjectDataSelect({
            ...objectDataSelect,
            "Tinh": listProvine
        })
    }, [listProvine])

    useEffect(() => {
        getListChot()
    }, [objectData['Tinh'], objectData['Quan'], objectData['Phuong']])

    const getListChot = async (isNext = false) => {
        //Có dữ liệu mới get danh sách chốt
        let { Phuong, Quan, Tinh } = objectData
        if (Quan && Phuong) { // cũ là (Tinh && Quan)
            setRefreshing(true)
            settextempty('Đang tải...')
            let res = await apis.ApiChotKiem.GetListDSChotKiem(isNext ? Page.Page + 1 : 1, 10, Tinh?.IdDonVi ? Tinh.IdDonVi : '', Quan?.IdDonVi ? Quan.IdDonVi : '', Phuong?.IdDonVi ? Phuong.IdDonVi : '')
            Utils.nlog("[LOG] list chot kiem dich", res)
            if (res.status == 1 && res.data) {
                setRefreshing(false)
                setListChot(isNext ? [...ListChot, ...res.data] : res.data)
                setPage(res.Page ? res.Page : Page)
            } else {
                setRefreshing(false)
                setListChot([])
                setPage(res.Page ? res.Page : Page)
                settextempty('Không có dữ liệu')
            }
        } else {
            setRefreshing(false)
            setListChot([])
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
        Utils.navigate('ManHinh_Home')
        return true
    }

    const ChonChot = (item) => {
        //Xử lý redux gọi lưu lại địa điểm mặc định cho các lần sau
        dispatch(ActionHCM.SaveChotKiemDich(item))
        Utils.navigate('Modal_QuetMaKiemDich', { isSaveChotKiem: true })
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
                        styleContainer={isEnd ? stDanhSachChot.dropdownContainerIsEnd : stDanhSachChot.dropdownContainer}
                        styleContentLabel={{ marginTop: -10 }}
                        styleBodyInput={stDanhSachChot.compBodyInput}
                    />, [item, objectData, objectDataSelect])
                } else {
                    return useMemo(() => <ComponentItem.ComponentDrop isDrop={true}  {...item} key={index} value={objectData[key] ? objectData[key][keyView].toUpperCase() : ''}
                        onPress={() => onPressModal(item)}
                        onChangTextIndex={val => ChangeObjectData(key, val)}
                        placeholder={placehoder.toUpperCase()}
                        styleContainer={isEnd ? stDanhSachChot.dropdownContainerIsEnd : stDanhSachChot.dropdownContainer}
                        styleContentLabel={{ marginTop: -10 }}
                        styleBodyInput={stDanhSachChot.compBodyInput}
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
                <View style={stDanhSachChot.itemList}>
                    <Image source={Images.icChotKiemDich} style={nstyles.nIcon20} resizeMode='contain' />
                    <View style={{ flex: 1, paddingLeft: 15 }}>
                        <Text style={stDanhSachChot.txtChotKiem} numberOfLines={2}>{'Chốt kiểm ' + item.DiaChi}</Text>
                        <Text style={stDanhSachChot.txtDiaChi}>
                            {item.DiaChi ? item.DiaChi : ''}, {item.Phuong ? item.Phuong : ''}, {item.Quan ? item.Quan : ''}{item.ThanhPho ? ', ' + item.ThanhPho : ''}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const _onRefresh = async () => {
        getListChot(false)
    }

    const _keyExtractor = (item, index) => index.toString()

    const _ListFooterComponent = () => {
        return Page.Page < Page.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    const loadMore = async () => {
        if (Page.Page < Page.AllPage) {
            getListChot(true)
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <HeaderCus
                onPressLeft={() => Utils.navigate('ManHinh_Home')}
                iconLeft={Images.icBack}
                title={`CHỐT KIỂM TRA`}
                styleTitle={{ color: colors.white, fontSize: reText(20) }}
            />
            <View style={stDanhSachChot.Container}>
                <View style={stDanhSachChot.HeaderList}>
                    {
                        listCom.map(renderCom)
                    }
                </View>
                <FlatList
                    extraData={ListChot}
                    style={{ marginTop: 10 }}
                    data={ListChot}
                    renderItem={RenderItem}
                    keyExtractor={_keyExtractor}
                    ItemSeparatorComponent={() => {
                        return <View style={stDanhSachChot.ItemSeparatorComponent} />
                    }}
                    onRefresh={_onRefresh}
                    refreshing={refreshing}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.4}
                    ListFooterComponent={_ListFooterComponent}
                    ListEmptyComponent={<ListEmpty textempty={textempty} isImage={!refreshing} />}
                />
                {
                    checkQuayDau_ChotKiemDich &&
                    <ButtonCom
                        onPress={() => {
                            Utils.goscreen(this, 'Modal_CheckGiayThongHanh')
                        }}
                        shadow={false}
                        txtStyle={{ color: colors.white }}
                        style={
                            {
                                borderRadius: 5,
                                alignSelf: 'center',
                                marginBottom: getBottomSpace(),
                                width: Width(60),
                            }}
                        text={'Kiểm giấy thông hành'}
                    />
                }
            </View>
        </View>
    )
}

const stDanhSachChot = StyleSheet.create({
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

export default DanhSachChot

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
        isRow: true,
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
        isRow: false,
        isEnd: true,
        keyView: 'TenPhuongXa'
    }
];
