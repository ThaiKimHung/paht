import React, { Component, useState, useEffect, } from 'react';
import { StatusBar } from 'react-native';
import { View, TouchableOpacity, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import Utils, { icon_typeToast } from '../../../../app/Utils';
import { useDispatch, useSelector } from 'react-redux';
import ImageCus from '../../../../components/ImageCus';
import TextApp from '../../../../components/TextApp';
import { colorsSVL } from '../../../../styles/color';
import { reText } from '../../../../styles/size';
import { nstyles } from '../../../../styles/styles';
import ButtonSVL from '../../components/ButtonSVL';
import EmptySVL from '../../components/EmptySVL';
import HeaderSVL from '../../components/HeaderSVL';
import ItemEmployment from '../../components/ItemEmployment';
import { ImagesSVL } from '../../images';
import { SetDataEmployment, SetRefreshingEmployment, LoadListEmployment, DeleteEmployment, CheckedDeleteEmployment, SetPageEmployment, LoadListRecruitmentPost } from '../../../../srcRedux/actions/sanvieclam/DataSVL';
import { XoaTinTuyenDung } from '../../apis/apiSVL';
import { DEFINE_SCREEN_DETAILS } from '../../common';

const index = (props) => {
    const dispatch = useDispatch()
    const { RefreshingEmployment = true, PageEmployment = { Page: 1, AllPage: 1 }, LstEmployment = [] } = useSelector(state => state.dataSVL)
    const [itemDel, setItemDel] = useState({})
    const [EnableDel, setEnableDel] = useState(false)
    const [data, setData] = useState([])

    useEffect(() => {
        dispatch(LoadListEmployment())
    }, [])

    const onRefresh = () => {
        dispatch(SetPageEmployment({ Page: 1, AllPage: 1 }))
        dispatch(SetRefreshingEmployment(true))
        dispatch(SetDataEmployment([]))
        dispatch(LoadListEmployment())
    }
    // Item
    const renderItem = ({ item, index }) => {
        return (
            <ItemEmployment isList={!EnableDel} data={item} onPress={() => onPressDetail(item)} />
        )
    }
    // nút bấm sự kiện item
    const onPressDetail = (item) => {
        if (!EnableDel) {
            Utils.goscreen({ props }, 'ModalCTTuyenDung', {
                Id: `${item.Id}|${DEFINE_SCREEN_DETAILS.DanhSach_BaiDangDoanhNghiep.KeyScreen}`
            })
        } else {
            dispatch(CheckedDeleteEmployment(item))
        }
    }
    // xoá hay đăng tin
    const handlerConfirm = () => {
        const itemDel = LstEmployment.find(e => e?.isChoose == true)
        Utils.nlog('[ITEM_DELETE]', itemDel)
        if (!EnableDel || LstEmployment?.length == 0) {
            setEnableDel(false)
            Utils.navigate('Sc_TaoTinTD')
        } else {
            if (!itemDel) {
                Alert.alert('Thông báo', 'Bạn hãy chọn một bài đăng nào đó để xoá!');
            } else {
                Utils.goscreen({ props }, 'Modal_ConfirmDelTD', { item: itemDel, title: 'Bạn có chắc muốn xoá bài đăng này hay không?', isDel: true, callback: onDeleteItem })
            }
        }
    }
    const onDeleteItem = async (itemDel) => {
        Utils.nlog('[LOG_DELETE_RECRUITMENT_POST] item delete callback', itemDel)
        let res = await XoaTinTuyenDung(itemDel?.Id)
        Utils.nlog('[LOG_DELETE_RECRUITMENT_POST] res', itemDel.Id)
        if (res?.status == 1) {
            //Xoá thành công map lại dữ liệu hiển thị trên UI
            dispatch(DeleteEmployment(itemDel))
            dispatch(LoadListRecruitmentPost('IsHienThi', 1))
            Utils.showToastMsg('Thông báo', 'Xoá CV thành công', icon_typeToast.success, 2000, icon_typeToast.success)
        } else {
            Utils.showToastMsg('Thông báo', 'Xoá CV thất bại', icon_typeToast.danger, 2000, icon_typeToast.danger)
        }
    }
    // chế độ xoá hay đăng tin
    const TurnOnDel = () => {
        if (EnableDel == true) {
            setEnableDel(false)
        } else {
            setEnableDel(true)
        }
    }
    //loadmore
    const _ListFooterComponent = () => {
        return PageEmployment.Page < PageEmployment.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }
    const loadMore = async () => {
        if (PageEmployment.Page < PageEmployment.AllPage) {
            dispatch(LoadListEmployment(true))
        }
    }

    return (
        <View style={[nstyles.ncontainer]}>
            <StatusBar barStyle={'dark-content'} />
            <HeaderSVL
                title={!EnableDel ? "Danh sách bài đăng" : 'Xoá bài đăng'}
                iconLeft={ImagesSVL.icHome}
                onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
                titleRight={LstEmployment.length > 0 ? !EnableDel ? "Xoá" : "Đóng" : null}
                Sright={{ color: 'grey', fontSize: reText(14) }}
                onPressRight={LstEmployment.length > 0 ? TurnOnDel : () => { }}
            />
            <View style={[nstyles.nbody, { paddingTop: 5 }]}>
                <FlatList
                    contentContainerStyle={{ paddingBottom: 80 }}
                    extraData={LstEmployment}
                    data={LstEmployment}
                    refreshing={RefreshingEmployment}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    onRefresh={onRefresh}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={_ListFooterComponent}
                    ListEmptyComponent={
                        <EmptySVL style={{ flex: 1 }}
                            textEmpty={RefreshingEmployment ? 'Đang tải...' : 'Bạn chưa có bài đăng nào. Hãy tạo ngay!!!'}
                        />}
                />
                <ButtonSVL
                    text={!EnableDel || LstEmployment?.length == 0 ? '+ Đăng tin' : 'Xoá'}
                    style={[!EnableDel || LstEmployment?.length == 0 ? stDangTinTD.btnPosted : stDangTinTD.btnDelete, stDangTinTD.btnBottom]}
                    styleText={!EnableDel || LstEmployment?.length == 0 ? stDangTinTD.txtPosted : stDangTinTD.txtDelete}
                    onPress={handlerConfirm}
                />
            </View>
        </View>
    )
}

const stDangTinTD = StyleSheet.create({
    btnPosted: {
        borderWidth: 1, borderColor: '#0081B2',
        backgroundColor: colorsSVL.white
    },
    btnDelete: {
        borderWidth: 0, borderColor: 'red',
        backgroundColor: 'red'
    },
    btnBottom: {
        borderRadius: 25,
        paddingVertical: 10,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center', marginVertical: 10
    },
    txtPosted: {
        color: colorsSVL.white, color: '#0081B2'
    },
    txtDelete: {
        color: colorsSVL.white, color: 'white'
    }

})

export default index