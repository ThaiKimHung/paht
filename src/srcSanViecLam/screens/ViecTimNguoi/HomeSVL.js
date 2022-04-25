import React, { Component, useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Platform, TextInput, View, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import Utils from '../../../../app/Utils';
import ImageCus from '../../../../components/ImageCus';
import TextApp from '../../../../components/TextApp';
import {
    LikeRecruitment, LikeUnlikeApplied, LoadInitDataFilter, LoadListMailBox, LoadListRecruitment, LoadListRecruitmentSaved,
    SetDataRecruitment, SetPageRecruitment, SetRefreshingRecruitment, UnLikeRecruitment, UnLikeRecruitmentSaved, LoadListCvUserPublic
} from '../../../../srcRedux/actions/sanvieclam/DataSVL';
import { colors } from '../../../../styles';
import { colorsSVL } from '../../../../styles/color';
import { reText } from '../../../../styles/size';
import { nstyles } from '../../../../styles/styles';
import common, { DEFINE_SCREEN_DETAILS } from '../../common';
import EmptySVL from '../../components/EmptySVL';
import HeaderSVL from '../../components/HeaderSVL';
import ItemRecruitment from '../../components/ItemRecruitment';
import { ImagesSVL } from '../../images';

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
    selectKhuVucLamViec: { IdKhuVucLamViec: -1, KhuVucLamViec: '-- Tất cả --', IDQuanHuyen: -1, IdTinh: -1 },
}

const HomeSVL = (props) => {
    const dispatch = useDispatch()
    const { RefreshingRecruitment = true, PageRecruitment = { Page: 1, AllPage: 1 }, LstRecruitment = [], LstCVOfUserPublic = [] } = useSelector(state => state.dataSVL)
    const [search, setSearch] = useState('')
    const [ObjFillter, setObjFillter] = useState(defaultFilter)
    const [isUseFilter, setIsUseFilter] = useState(false)
    let firstApp = false;
    useEffect(() => {
        dispatch(LoadInitDataFilter())
        dispatch(LoadListMailBox())
        dispatch(LoadListCvUserPublic())
        firstApp = true;
        // Move_ModalThongBao();
    }, [])

    useEffect(() => {
        onRefresh()
    }, [ObjFillter, search])

    const onRefresh = () => {
        dispatch(SetPageRecruitment({ Page: 1, AllPage: 1 }))
        dispatch(SetRefreshingRecruitment(true))
        dispatch(SetDataRecruitment([]))
        dispatch(LoadListRecruitment(ObjFillter, search))
    }

    useEffect(() => {
        trackingFilter()
    }, [ObjFillter])

    useEffect(() => {
        Move_ModalThongBao()
    }, [LstCVOfUserPublic, dispatch])

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


    const Move_ModalThongBao = () => {
        if (firstApp) {
            return;
        }
        if (LstCVOfUserPublic.length == 0 && Utils.getGlobal(nGlobalKeys.FirstAlert_ViecTimNguoi, 0) == 0) {
            Utils.setGlobal(nGlobalKeys.FirstAlert_ViecTimNguoi, 1);
            Utils.navigate('ScreenRequestCreate', {
                _image: ImagesSVL.icError,
                _title: 'Bạn chưa có CV trên hệ thống để có thể ứng tuyển!!!',
                _subTitle: 'Tạo hồ sơ xin việc chỉ 4 bước!!',
                _titleButtonRight: 'Tạo CV Ngay!',
                _titleButtonLeft: 'Đóng',
                _actionButtonRight: onCreateCV,
                // _actionButtonLeft:{}
            })
        }
    }

    const onPressSaveTin = (item) => {
        Utils.goscreen({ props }, 'PopupSave', { data: item, isSave: item?.IsLike == 0 ? true : false, callback: callbackPopupSave })
    }

    const onPressDetail = (item) => {
        Utils.goscreen({ props }, 'ModalCTTuyenDung', {
            Id: `${item.Id}|${DEFINE_SCREEN_DETAILS.DanhSach_TinTuyenDung.KeyScreen}`
        })
    }

    const callbackPopupSave = (itemcallback) => {
        if (itemcallback?.IsLike == 1) {
            //Item chưa lưu chuyển trạng thái thành lưu với IsLike : 1 -> Load lại danh sách tin tuyển dụng đã lưu
            dispatch(LoadListRecruitmentSaved())
            //Item chưa lưu chuyển trạng thái thành lưu với IsLike : 1 -> Map laị danh sách xử lý UI danh sách tin tuyển dụng
            dispatch(LikeRecruitment(itemcallback))
            //Item chưa lưu chuyển trạng thái thành lưu với IsLike : 1 -> Map laị danh sách xử lý UI lịch sử ứng tuyển
            dispatch(LikeUnlikeApplied(itemcallback))
        }
        else {
            //Item lưu chuyển trạng thái thành chưa lưu với IsLike : 0 -> Map laị danh sách xử lý UI danh sách tin tuyển dụng đã lưu
            dispatch(UnLikeRecruitmentSaved(itemcallback))
            //Item lưu chuyển trạng thái thành chưa lưu với IsLike : 0 -> Map laị danh sách xử lý UI danh sách tin tuyển dụng
            dispatch(UnLikeRecruitment(itemcallback))
            //Item lưu chuyển trạng thái thành chưa lưu với IsLike : 0 -> Map laị danh sách ử lý UI lịch sử ứng tuyển
            dispatch(LikeUnlikeApplied(itemcallback))
        }
    }

    const renderItem = ({ item, index }) => {
        return (
            <ItemRecruitment data={item} index={index} onPress={() => onPressDetail(item)} onPressSave={() => onPressSaveTin(item)} />
        )
    }

    const onCreateCV = () => {
        Utils.navigate('Sc_CreateCv')
    }

    const _CallBackFillter = (filter) => {
        Utils.nlog('Gia tri item _CallBackFillter ', filter)
        setObjFillter(filter)
    }

    const onClearFillter = () => {
        setObjFillter(defaultFilter)
    }

    const onFillter = () => {
        Utils.goscreen(this, 'Modal_Fillter', { ObjFillter: _CallBackFillter, dataFillter: ObjFillter })
    }

    const _CallBack = (item) => {
        Utils.nlog('[LOG] callback search', item)
        setSearch(item)
    }

    const onSearch = () => {
        Utils.goscreen(this, 'Modal_Search', { CallBack: _CallBack, })
    }

    const onClear = () => {
        setSearch('')
    }

    const _ListFooterComponent = () => {
        return PageRecruitment.Page < PageRecruitment.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    const loadMore = async () => {
        if (PageRecruitment.Page < PageRecruitment.AllPage) {
            dispatch(LoadListRecruitment(ObjFillter, search, true))
        }
    }
    const HeaderNoti = () => {
        Utils.nlog('Gia tri search ', search)
        if (LstCVOfUserPublic.length == 0)
            return (
                <View style={{ backgroundColor: colors.white }}>
                    <View style={{
                        flexDirection: 'row', justifyContent: 'space-between',
                        alignItems: 'center', padding: 10,
                        backgroundColor: '#828282', margin: 10, borderRadius: 5
                    }}>
                        <View style={{
                            flexDirection: 'row', justifyContent: 'space-between',
                            alignItems: 'center', flex: 1
                        }}>
                            <ImageCus source={ImagesSVL.icNotiHome} style={{ ...nstyles.nIcon20 }} resizeMode='contain' />
                            <TextApp style={{ flex: 1, color: colors.white, fontWeight: 'bold', marginLeft: 10 }}>
                                {'Bạn chưa có CV!'}
                            </TextApp>
                        </View>
                        <View style={{ width: 1, height: '100%', backgroundColor: colors.white }} />
                        <TouchableOpacity activeOpacity={0.5} onPress={onCreateCV}>
                            <TextApp style={{ marginLeft: 10, color: '#FFA022', fontWeight: 'bold' }}>
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
                title={"Người tìm việc"}
                iconLeft={ImagesSVL.icHome}
                onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
            // onPressLeft={() => Utils.goback(this, null)}
            />
            <View style={stHomeSVL.contSearch}>
                <TouchableOpacity activeOpacity={0.5} onPress={onSearch} style={stHomeSVL.search}>
                    <View style={[stHomeSVL.search, { marginLeft: 0 }]}>
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
                        <View style={stHomeSVL.fillter} >
                            <TextApp style={stHomeSVL.textfillter}>{'Đang sử dụng bộ lọc'}</TextApp>
                            <TouchableOpacity onPress={onClearFillter} style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                                <ImageCus source={ImagesSVL.icCloseSVL} style={[nstyles.nIcon10, { tintColor: colorsSVL.red }]} />
                            </TouchableOpacity>
                        </View>
                        <View style={stHomeSVL.gachngang} />
                    </>
                    : null
            }
            {/* Body */}
            <View style={nstyles.nbody}>
                <FlatList
                    extraData={LstRecruitment}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    data={LstRecruitment}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    refreshing={RefreshingRecruitment}
                    onRefresh={onRefresh}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={_ListFooterComponent}
                    ListEmptyComponent={<EmptySVL style={{ flex: 1, marginTop: 20 }} textEmpty={RefreshingRecruitment ? 'Đang tải...' : 'Không có dữ liệu'} />}
                />
            </View>
        </View>
    )
}

const stHomeSVL = StyleSheet.create({
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

export default HomeSVL
