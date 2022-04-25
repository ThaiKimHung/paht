import React, { Component, useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Platform, TextInput, View, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Utils from '../../../../app/Utils';
import ImageCus from '../../../../components/ImageCus';
import TextApp from '../../../../components/TextApp';
import { colors } from '../../../../styles';
import { colorsSVL } from '../../../../styles/color';
import { nstyles } from '../../../../styles/styles';
import EmptySVL from '../../components/EmptySVL';
import HeaderSVL from '../../components/HeaderSVL';
import ItemPersonal from '../HoSo/components/ItemPersonal';
import { ImagesSVL } from '../../images';
import { reText } from '../../../../styles/size';
import { dataHoSoCV } from '../../dataDemo/dataHoSoCV';
import {
    LoadInitDataFilter, LoadListProfileEnterprise, SetDataProfileEnterprise,
    SetRefreshingProfileEnterprise, LikeProfileEnterprise, UnLikeProfileEnterprise, LoadListCvSaved, UnLikeCvSaved, LikeUnlikeProfileApplied, SetPageProfileEnterprise, LoadListMailBoxEnterprise, LoadListRecruitmentPost
} from '../../../../srcRedux/actions/sanvieclam/DataSVL';
import { DEFINE_SCREEN_DETAILS } from '../../common';

const defaultFilter = {
    selectNganhNghe: { Id: -1, LoaiNganhNghe: '-- Tất cả --' },
    selectHinhThucLV: { IdHinhThuc: -1, TenHinhThuc: '-- Tất cả --' },
    selectMucLuong: { Id: -1, MucLuong: '-- Tất cả --' },
    selectCapBac: { Id: -1, ChucVu: '-- Tất cả --' },
    selectDiaDiem: { IDTinhThanh: -1, TenTinhThanh: '-- Tất cả --' },
    selectKinhNghiem: { Id: -1, KinhNghiem: '-- Tất cả --' },
    selectGioiTinh: { IdGioiTinh: -1, TenGioiTinh: '-- Tất cả --' },
    selectTrinhDo: { Id: -1, TrinhDoVanHoa: '-- Tất cả --' },
    //NguoiTimViec
    selectDoTuoi: { Id: -1, DoTuoi: '-- Tất cả --' },
    selectLoaiHoSo: { IdLoaiHoSo: -1, TenLoaiHoSo: '-- Tất cả --' },
    selectKhuVucLamViec: { IdKhuVucLamViec: -1, KhuVucLamViec: '-- Tất cả --', IDQuanHuyen: -1, IdTinh: -1, TenTinhThanh: '-- Tất cả --', TenQuanHuyen: '-- Tất cả --' },
}

const index = (props) => {
    const dispatch = useDispatch()
    const {
        RefreshingProfileEnterprise = true,
        PageProfileEnterprise = { Page: 1, AllPage: 1 },
        LstProfileEnterprise = [],
        LstRecruitmentPost = []
    } = useSelector(state => state.dataSVL)
    const [search, setSearch] = useState('')
    const [ObjFillter, setObjFillter] = useState(defaultFilter)
    const [isUseFilter, setIsUseFilter] = useState(false)

    useEffect(() => {
        dispatch(LoadInitDataFilter())
        dispatch(LoadListMailBoxEnterprise())
        dispatch(LoadListRecruitmentPost('IsHienThi', 1))
    }, [])

    useEffect(() => {
        onRefresh()
    }, [ObjFillter, search])

    const onRefresh = () => {
        dispatch(SetPageProfileEnterprise({ Page: 1, AllPage: 1 }))
        dispatch(SetRefreshingProfileEnterprise(true))
        dispatch(SetDataProfileEnterprise([]))
        dispatch(LoadListProfileEnterprise(ObjFillter, search))
    }

    useEffect(() => {
        trackingFilter()
    }, [ObjFillter])

    const trackingFilter = () => {
        if (ObjFillter?.selectCapBac?.Id != -1 || ObjFillter?.selectDiaDiem?.IDTinhThanh != -1 || ObjFillter?.selectDoTuoi?.Id != -1
            || ObjFillter?.selectGioiTinh?.IdGioiTinh != -1 || ObjFillter?.selectHinhThucLV.IdHinhThuc != -1 || ObjFillter?.selectKinhNghiem?.Id != -1
            || ObjFillter?.selectLoaiHoSo?.IdLoaiHoSo != -1 || ObjFillter?.selectMucLuong?.Id != -1 || ObjFillter?.selectNganhNghe?.Id != -1
            || ObjFillter?.selectTrinhDo?.Id != -1 || (ObjFillter?.selectKhuVucLamViec?.IdTinh != -1 && ObjFillter?.selectKhuVucLamViec?.IdTinh)) {
            setIsUseFilter(true)
        } else {
            setIsUseFilter(false)
        }
    }

    const onPressSaveProfile = (item) => {
        Utils.goscreen({ props }, 'PopupSaveTD', { data: item, isSave: item?.IsLike == 0 ? true : false, callback: callbackPopupSave })
    }

    const onPressDetail = (item) => {
        Utils.navigate('Modal_DetalisUngVien', {
            Id: `${item?.IdCV}|${DEFINE_SCREEN_DETAILS.DanhSach_CVDoanhNghiep.KeyScreen}`
        })
    }

    const callbackPopupSave = (itemcallback) => {
        if (itemcallback?.IsLike == 1) {
            //Item chưa lưu chuyển trạng thái thành lưu với IsLike : 1 -> Load lại danh sách hồ sơ (CV) đã lưu
            dispatch(LoadListCvSaved())
            //Item chưa lưu chuyển trạng thái thành lưu với IsLike : 1 -> Map laị danh sách xử lý UI danh sách hồ sơ (CV)
            dispatch(LikeProfileEnterprise(itemcallback))
            //Item chưa lưu chuyển trạng thái thành lưu với IsLike : 1 -> Map laị danh sách xử lý UI lịch sử ứng tuyển
            dispatch(LikeUnlikeProfileApplied(itemcallback))
        }
        else {
            //Item lưu chuyển trạng thái thành chưa lưu với IsLike : 0 -> Map laị danh sách xử lý UI danh sách hồ sơ (CV) đã lưu
            dispatch(UnLikeCvSaved(itemcallback))
            //Item lưu chuyển trạng thái thành chưa lưu với IsLike : 0 -> Map laị danh sách xử lý UI danh sách hồ sơ (CV)
            dispatch(UnLikeProfileEnterprise(itemcallback))
            //Item lưu chuyển trạng thái thành chưa lưu với IsLike : 0 -> Map laị danh sách ử lý UI lịch sử ứng tuyển
            dispatch(LikeUnlikeProfileApplied(itemcallback))
        }
    }

    const renderItem = ({ item, index }) => {
        return (
            <ItemPersonal onPressSave={() => onPressSaveProfile(item)} isNhaTuyenDung item={item} index={index} onChoose={() => onPressDetail(item)} />
        )
    }

    const onCreateRecruitment = () => {
        Utils.navigate('Sc_TaoTinTD')
    }

    const _CallBackFillter = (filter) => {
        Utils.nlog('[LOG_ENTERPRISE] call back fillter', filter)
        setObjFillter(filter)
    }

    const onClearFillter = () => {
        setObjFillter(defaultFilter)
    }

    const onFillter = () => {
        Utils.goscreen(this, 'Modal_Fillter', { TypeNguoiTimViec: true, ObjFillter: _CallBackFillter, dataFillter: ObjFillter })
    }

    const _CallBack = (item) => {
        Utils.nlog('Gia tri item call ', item)
        setSearch(item)
    }

    const onSearch = () => {
        Utils.goscreen(this, 'Modal_Search', { CallBack: _CallBack, })
    }

    const onClear = () => {
        setSearch('')
    }

    const _ListFooterComponent = () => {
        return PageProfileEnterprise.Page < PageProfileEnterprise.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    const loadMore = async () => {
        if (PageProfileEnterprise.Page < PageProfileEnterprise.AllPage) {
            dispatch(LoadListProfileEnterprise(ObjFillter, search, true))
        }
    }

    const HeaderNoti = () => {
        Utils.nlog('Gia tri search ', search)
        // Utils.nlog('Gia tri ObjFillter ', ObjFillter.length, ObjFillter)
        if (LstRecruitmentPost.length == 0)
            return (
                <View style={{ backgroundColor: colors.white }}>
                    <View style={{
                        flexDirection: 'row', justifyContent: 'space-between',
                        alignItems: 'center', padding: 10,
                        backgroundColor: colors.colorsSVL, margin: 10, borderRadius: 5
                    }}>
                        <View style={{
                            flexDirection: 'row', justifyContent: 'space-between',
                            alignItems: 'center', flex: 1
                        }}>
                            <ImageCus source={ImagesSVL.icNotiHome} style={{ ...nstyles.nIcon20 }} resizeMode='contain' />
                            <TextApp style={{ flex: 1, color: colors.white, fontWeight: 'bold', marginLeft: 10 }}>
                                {'Bạn cần tuyển dụng lao động!'}
                            </TextApp>
                        </View>
                        <View style={{ width: 1, height: '100%', backgroundColor: colors.white }} />
                        <TouchableOpacity activeOpacity={0.5} onPress={onCreateRecruitment}>
                            <TextApp style={{ marginLeft: 10, color: colors.white, fontWeight: 'bold' }}>
                                {'Tạo ngay'}
                            </TextApp>
                        </TouchableOpacity>
                    </View>
                </View>

            )
        else return null
    }
    return (
        <View style={[nstyles.ncontainer]}>
            <StatusBar barStyle={'dark-content'} />
            {/* Header */}
            <HeaderSVL
                title={"Việc tìm người"}
                iconLeft={ImagesSVL.icHome}
                onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
            // onPressLeft={() => Utils.goback(this, null)}
            />
            <View style={stTuyenDungTD.contSearch}>
                <TouchableOpacity activeOpacity={0.5} onPress={onSearch} style={stTuyenDungTD.search}>
                    <View style={[stTuyenDungTD.search, { marginLeft: 0 }]}>
                        <ImageCus source={ImagesSVL.icSearchSVL} resizeMode='contain' style={{ ...nstyles.nIcon20 }} />
                        <TextApp style={{ paddingVertical: 10, marginLeft: 5, color: search ? colorsSVL.black : colorsSVL.grayTextLight }}>{`${search ? search : 'Tìm kiếm công việc, công ty...'}`}</TextApp>
                    </View>
                    {
                        !search ? null :
                            <TouchableOpacity onPress={onClear} style={{ padding: 10 }} >
                                <ImageCus source={ImagesSVL.icCloseBlackSVL} style={[nstyles.nIcon20]} />
                            </TouchableOpacity>
                    }
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={onFillter} style={{ paddingHorizontal: 10 }}>
                    <ImageCus source={ImagesSVL.icFillterSVL} resizeMode='contain' style={{ ...nstyles.nIcon20 }} />
                </TouchableOpacity>
            </View>

            {HeaderNoti()}
            {
                isUseFilter ?
                    <>
                        <View style={stTuyenDungTD.fillter} >
                            <TextApp style={stTuyenDungTD.textfillter}>{'Đang sử dụng bộ lọc'}</TextApp>
                            <TouchableOpacity onPress={onClearFillter} style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                                <ImageCus source={ImagesSVL.icCloseSVL} style={[nstyles.nIcon10, { tintColor: colorsSVL.red }]} />
                            </TouchableOpacity>
                        </View>
                        <View style={stTuyenDungTD.gachngang} />
                    </>
                    : null
            }
            {/* Body */}
            <View style={nstyles.nbody}>
                <FlatList
                    extraData={LstProfileEnterprise}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    data={LstProfileEnterprise}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    refreshing={RefreshingProfileEnterprise}
                    onRefresh={onRefresh}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={_ListFooterComponent}
                    ListEmptyComponent={<EmptySVL style={{ flex: 1, marginTop: 20 }} textEmpty={RefreshingProfileEnterprise ? 'Đang tải...' : 'Không có dữ liệu'} />}
                />
            </View>
        </View>
    )
}

const stTuyenDungTD = StyleSheet.create({
    contSearch: {
        backgroundColor: colors.white, paddingLeft: 10, paddingBottom: 10,
        flexDirection: 'row', alignItems: 'center',
        borderBottomWidth: 0.5, borderColor: colors.grayLight
    },
    search: { flexDirection: 'row', alignItems: 'center', backgroundColor: colorsSVL.grayBgrInput, borderRadius: 25, paddingHorizontal: 10, flex: 1, marginLeft: 10 },
    gachngang: { height: 1, backgroundColor: colorsSVL.grayBgrInput, marginHorizontal: 13, width: '100%' },
    fillter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colorsSVL.white, },
    textfillter: { fontSize: reText(12), color: colorsSVL.organeMainSVL, paddingLeft: 15 }
})

export default index
