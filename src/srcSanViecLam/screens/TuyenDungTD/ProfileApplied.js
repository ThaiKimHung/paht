import React, { useEffect, useState, useRef } from 'react'
import { View, StyleSheet, ScrollView, RefreshControl, SectionList, Easing } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, { Transitioning, Transition } from 'react-native-reanimated'
import { colors } from '../../../../styles'
import { ImagesSVL } from '../../images'
import TextApp from '../../../../components/TextApp'
import { nstyles } from '../../../../styles/styles'
import GroupApply from './GroupApply'
import ImageCus from '../../../../components/ImageCus'
import { reText } from '../../../../styles/size'
import Utils from '../../../../app/Utils'
import common, { DEFINE_SCREEN_DETAILS } from '../../common'
import { useDispatch, useSelector } from 'react-redux'
import {
    LikeProfileEnterprise, LikeUnlikeProfileApplied, LoadListCvSaved, LoadListProfileApplied,
    LoadListRecruitmentPost, SetDataProfileApplied, SetRefreshingProfileApplied, UnLikeProfileEnterprise, UnLikeCvSaved
} from '../../../../srcRedux/actions/sanvieclam/DataSVL'
import ItemPersonal from '../HoSo/components/ItemPersonal'

const transition = (
    <Transition.Together>
        <Transition.In type='fade' durationMs={150} />
        <Transition.Change />
        <Transition.Out type='fade' durationMs={150} />
    </Transition.Together>
)

const ProfileApplied = (props) => {
    const dispatch = useDispatch()
    const { LstDataProfileApplied = [], RefreshingDataProfileApplied = true, SelectRecruitmentPostItem = {} } = useSelector(state => state.dataSVL)
    const refView = useRef(null)
    const [indexSection, setIndexSection] = useState(0)
    let blockUpdateIndex = false
    const [showHeaderSection, setShowHeaderSection] = useState(false)

    useEffect(() => {
        dispatch(LoadListRecruitmentPost('IsHienThi', 1))
    }, [])

    useEffect(() => {
        if (SelectRecruitmentPostItem?.Id) {
            onRefresh() // đợi hùng làm xong ds chọn bài đăng thì gắn id động vào
        } else {
            dispatch(SetRefreshingProfileApplied(false))
        }
    }, [SelectRecruitmentPostItem])

    const onRefresh = () => {
        dispatch(SetRefreshingProfileApplied(true))
        dispatch(SetDataProfileApplied([]))
        dispatch(LoadListProfileApplied(SelectRecruitmentPostItem?.Id))
    }

    const onPressGroup = () => {
        refView?.current.animateNextTransition();
    }

    const onSelectEmployment = () => {
        Utils.goscreen(this, 'Modal_ListEmployment', { data: [] })
    }

    const DropDownEmployment = () => {
        let titlePosted = ''
        if (SelectRecruitmentPostItem?.TieuDe) {
            titlePosted += SelectRecruitmentPostItem?.TieuDe ? SelectRecruitmentPostItem?.TieuDe + ' - ' : ''
        }
        if (SelectRecruitmentPostItem?.NganhNghe) {
            titlePosted += SelectRecruitmentPostItem?.NganhNghe ? SelectRecruitmentPostItem?.NganhNghe + ' - ' : ''
        }
        if (SelectRecruitmentPostItem?.ChucVu) {
            titlePosted += SelectRecruitmentPostItem?.ChucVu ? SelectRecruitmentPostItem?.ChucVu + ' - ' : ''
        }
        if (SelectRecruitmentPostItem?.TenQuanHuyen) {
            titlePosted += SelectRecruitmentPostItem?.TenQuanHuyen ? SelectRecruitmentPostItem?.TenQuanHuyen + ' - ' : ''
        }
        if (SelectRecruitmentPostItem?.HanNopHoSo) {
            titlePosted += SelectRecruitmentPostItem?.HanNopHoSo ? 'Hạn nộp: ' + SelectRecruitmentPostItem?.HanNopHoSo : ''
        }
        return (
            <View style={{ padding: 10, backgroundColor: colors.white }}>
                <TextApp style={{ fontSize: reText(14) }}>
                    {'Thông tin tuyển dụng'}
                </TextApp>
                <TouchableOpacity onPress={onSelectEmployment} activeOpacity={0.5} style={stProfileApplied.dropEmployment}>
                    <TextApp numberOfLines={2} style={stProfileApplied.txtSelectEmployment}>{`${SelectRecruitmentPostItem?.Id ? `[${SelectRecruitmentPostItem?.Id}].` : ''}`}{titlePosted || 'Không có dữ liệu'}</TextApp>
                    <ImageCus source={ImagesSVL.icDrop} resizeMode='contain' style={[nstyles.nIcon10]} />
                </TouchableOpacity>
            </View>
        )
    }

    const HandleListWithKey = (Data = [], statusFill = []) => {
        if (Data?.length > 0 && statusFill.length > 0) {
            return Data.filter(item => statusFill.includes(item?.Status))
        } else {
            return []
        }
    }

    const DATA_SECTION = [
        {
            title: 'Hồ sơ đã nhận',
            data: HandleListWithKey(LstDataProfileApplied, common.STATUS_ENTERPRISE.HOSODANHAN)
        },
        {
            title: 'Mời phỏng vấn',
            data: HandleListWithKey(LstDataProfileApplied, common.STATUS_ENTERPRISE.MOIPHONGVAN)
        },
        {
            title: 'Hoàn tất phỏng vấn',
            data: HandleListWithKey(LstDataProfileApplied, common.STATUS_ENTERPRISE.HOANTATPHONGVAN)
        },
        {
            title: 'Trúng tuyển',
            data: HandleListWithKey(LstDataProfileApplied, common.STATUS_ENTERPRISE.TRUNGTUYEN)
        },
        {
            title: 'Đã từ chối',
            data: HandleListWithKey(LstDataProfileApplied, common.STATUS_ENTERPRISE.DATUCHOI)
        }
    ]

    const onScroll = (e) => {
        // console.log('onScroll', e.nativeEvent.contentOffset)
        const { y } = e.nativeEvent.contentOffset
        if (y <= 0) {
            setShowHeaderSection(false)
        } else {
            setShowHeaderSection(true)
        }
    }

    const onPressDetail = (item) => {
        Utils.navigate('Modal_DetalisUngVien', { Id: `${item?.IdUngTuyen}|${DEFINE_SCREEN_DETAILS.TuyenDung_DoanhNghiep.KeyScreen}` })
    }

    const onPressSaveProfile = (item) => {
        Utils.goscreen({ props }, 'PopupSaveTD', { data: item, isSave: item?.IsLike == 0 ? true : false, callback: callbackPopupSave })
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

    return (
        <View style={stProfileApplied.container}>
            <DropDownEmployment />
            <Transitioning.View
                ref={refView}
                transition={transition}
                style={{ flex: 1 }}
            >
                {
                    !showHeaderSection ? null :
                        <View style={[stProfileApplied.headerSection, {
                            position: 'absolute',
                            top: 0, left: 0, right: 0, zIndex: 10
                        }]}>
                            <TextApp style={{ fontWeight: 'bold', fontSize: reText(18) }}>
                                {DATA_SECTION[indexSection]?.title} ({DATA_SECTION[indexSection]?.data?.length})
                            </TextApp>
                        </View>
                }
                <SectionList
                    refreshing={RefreshingDataProfileApplied}
                    onRefresh={onRefresh}
                    extraData={LstDataProfileApplied}
                    sections={DATA_SECTION.map((item, index) => ({ ...item, index }))}
                    onViewableItemsChanged={({ viewableItems }) => {
                        if (!blockUpdateIndex && viewableItems[0]) {
                            const currentIndex = viewableItems[0].section.index;
                            if (indexSection !== currentIndex) {
                                setIndexSection(currentIndex)
                            }
                        }
                    }}
                    stickySectionHeadersEnabled={false}
                    viewabilityConfig={{
                        minimumViewTime: 10,
                        itemVisiblePercentThreshold: 10
                    }}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) => {
                        return <ItemPersonal
                            isNhaTuyenDung
                            item={item}
                            onPressSave={() => onPressSaveProfile(item)}
                            index={index}
                            onChoose={() => onPressDetail(item)}
                        />
                    }}
                    renderSectionHeader={({ section }) => {
                        return <View style={stProfileApplied.headerSection}>
                            <TextApp style={{ fontWeight: 'bold', fontSize: reText(18) }}>{section?.title} ({section?.data?.length})</TextApp>
                        </View>
                    }}
                    onMomentumScrollEnd={() => { blockUpdateIndex = false }}
                    refreshControl={
                        <RefreshControl
                            refreshing={RefreshingDataProfileApplied}
                            onRefresh={onRefresh}
                            title={!RefreshingDataProfileApplied ? 'Vuốt xuống thả ra để cập nhật' : `Đang tải...`}
                        />
                    }
                    scrollEventThrottle={1}
                    onScroll={onScroll}
                />

                {/* <ScrollView
                    style={{ marginTop: 5 }}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={RefreshingDataProfileApplied}
                            onRefresh={onRefresh}
                            title={!RefreshingDataProfileApplied ? 'Vuốt xuống thả ra để cập nhật' : `Đang tải...`}
                        />
                    }
                    stickyHeaderIndices={[0, 1, 2, 3]}
                >

                    <GroupApply title={'Hồ sơ đã nhận'}
                        onPressGroup={onPressGroup}
                        showGroup
                        data={HandleListWithKey(LstDataProfileApplied, common.STATUS_ENTERPRISE.HOSODANHAN)}
                    />
                    <GroupApply
                        title={'Mời phỏng vấn'} onPressGroup={onPressGroup}
                        style={{ marginTop: 5 }}
                        data={HandleListWithKey(LstDataProfileApplied, common.STATUS_ENTERPRISE.MOIPHONGVAN)}
                    />
                    <GroupApply
                        title={'Đã từ chối'}
                        onPressGroup={onPressGroup}
                        style={{ marginTop: 5 }}
                        data={HandleListWithKey(LstDataProfileApplied, common.STATUS_ENTERPRISE.DATUCHOI)}
                    />
                    <GroupApply
                        title={'Trúng tuyển'}
                        onPressGroup={onPressGroup}
                        style={{ marginTop: 5 }}
                        data={HandleListWithKey(LstDataProfileApplied, common.STATUS_ENTERPRISE.TRUNGTUYEN)}
                    />
                </ScrollView> */}
            </Transitioning.View>
        </View >
    )
}

const stProfileApplied = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.BackgroundHome, paddingTop: 5
    },
    dropEmployment: {
        borderRadius: 5, marginTop: 5, padding: 10, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F5F5F5'
    },
    txtSelectEmployment: { fontSize: reText(14), flex: 5, textAlign: 'justify', paddingRight: 20 },
    headerSection: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: 10, backgroundColor: colors.BackgroundHome
    }
})

export default ProfileApplied
