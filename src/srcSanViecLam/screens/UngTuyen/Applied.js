import React, { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, ScrollView, RefreshControl, SectionList } from 'react-native'
import { Transitioning, Transition } from 'react-native-reanimated'
import { colors } from '../../../../styles'
import { ImagesSVL } from '../../images'
import GroupApply from './GroupApply'
import common, { DEFINE_SCREEN_DETAILS } from '../../common'
import { useDispatch, useSelector } from 'react-redux'
import { LikeRecruitment, LikeUnlikeApplied, LoadListApplied, LoadListRecruitmentSaved, SetDataApplied, SetRefreshingApplied, UnLikeRecruitment, UnLikeRecruitmentSaved } from '../../../../srcRedux/actions/sanvieclam/DataSVL'
import { reText } from '../../../../styles/size'
import ItemRecruitment from '../../components/ItemRecruitment'
import TextApp from '../../../../components/TextApp'
import Utils from '../../../../app/Utils'

const transition = (
    <Transition.Together>
        <Transition.In type='fade' durationMs={150} />
        <Transition.Change />
        <Transition.Out type='fade' durationMs={150} />
    </Transition.Together>
)

const Applied = (props) => {
    const refView = useRef(null)
    const dispatch = useDispatch()
    const { LstDataApplied = [], RefreshingDataApplied = true } = useSelector(state => state.dataSVL)
    const [indexSection, setIndexSection] = useState(0)
    let blockUpdateIndex = false
    const [showHeaderSection, setShowHeaderSection] = useState(false)

    useEffect(() => {
        onRefresh()
    }, [])

    const onPressGroup = () => {
        refView?.current.animateNextTransition();
    }

    const onRefresh = () => {
        dispatch(SetRefreshingApplied(true))
        dispatch(SetDataApplied([]))
        dispatch(LoadListApplied())
    }

    const HandleListWithKey = (Data = [], statusFill = []) => {
        if (Data?.length > 0 && statusFill.length > 0) {
            return Data.filter(item => statusFill.includes(item?.Status))
        } else {
            return []
        }
    }

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
        // chi tiết trong ứng tuyển
        Utils.goscreen({ props }, 'ModalCTTuyenDung', {
            Id: `${item.IdUngTuyen}|${DEFINE_SCREEN_DETAILS.TuyenDung_CaNhan.KeyScreen}`
        })
    }

    const onPressSaveTin = (item) => {
        Utils.goscreen({ props }, 'PopupSave', { data: item, isSave: item?.IsLike == 0 ? true : false, callback: callbackPopupSave })
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

    const DATA_SECTION = [
        {
            title: 'Ứng tuyển',
            data: HandleListWithKey(LstDataApplied, common.STATUS_PERSONAL.UNGTUYEN)
        },
        {
            title: 'Đã nhận việc',
            data: HandleListWithKey(LstDataApplied, common.STATUS_PERSONAL.DANHANVIEC)
        },
        {
            title: 'Trước đây',
            data: HandleListWithKey(LstDataApplied, common.STATUS_PERSONAL.TRUOCDO)
        }
    ]


    return (
        <View style={stApplied.container}>

            <Transitioning.View
                ref={refView}
                transition={transition}
                style={{ flex: 1 }}
            >
                {
                    !showHeaderSection ? null :
                        <View style={[stApplied.headerSection, {
                            position: 'absolute',
                            top: 0, left: 0, right: 0, zIndex: 10
                        }]}>
                            <TextApp style={{ fontWeight: 'bold', fontSize: reText(18) }}>
                                {DATA_SECTION[indexSection]?.title} ({DATA_SECTION[indexSection]?.data?.length})
                            </TextApp>
                        </View>
                }
                <SectionList
                    refreshing={RefreshingDataApplied}
                    onRefresh={onRefresh}
                    extraData={LstDataApplied}
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
                        return <ItemRecruitment
                            data={item}
                            onPress={() => onPressDetail(item)}
                            // typeItem={item.status == 0 ? 1 : 2} // Chỉnh sau
                            onPressSave={() => onPressSaveTin(item)}
                        />
                    }}
                    renderSectionHeader={({ section }) => {
                        return <View style={stApplied.headerSection}>
                            <TextApp style={{ fontWeight: 'bold', fontSize: reText(18) }}>{section?.title} ({section?.data?.length})</TextApp>
                        </View>
                    }}
                    onMomentumScrollEnd={() => { blockUpdateIndex = false }}
                    refreshControl={
                        <RefreshControl
                            refreshing={RefreshingDataApplied}
                            onRefresh={onRefresh}
                            title={!RefreshingDataApplied ? 'Vuốt xuống thả ra để cập nhật' : `Đang tải...`}
                        />
                    }
                    scrollEventThrottle={1}
                    onScroll={onScroll}
                />
                {/* <ScrollView
                    contentContainerStyle={{ paddingBottom: 80, paddingTop: 5 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={RefreshingDataApplied}
                            onRefresh={onRefresh}
                            title='Đang tải...'
                        />
                    }>
                    <GroupApply title={'Ứng tuyển'}
                        onPressGroup={onPressGroup}
                        showGroup
                        data={HandleListWithKey(LstDataApplied, common.DEFINE_TYPE.UNGVIENNOP_CV, common.STATUS_PERSONAL.UNGTUYEN)}
                    />
                    <GroupApply
                        title={'Đã nhận việc'} onPressGroup={onPressGroup}
                        style={{ marginTop: 5 }}
                        data={HandleListWithKey(LstDataApplied, common.DEFINE_TYPE.UNGVIENNOP_CV, common.STATUS_PERSONAL.DANHANVIEC)}
                    />
                    <GroupApply
                        title={'Trước đây'}
                        onPressGroup={onPressGroup}
                        style={{ marginTop: 5 }}
                        data={HandleListWithKey(LstDataApplied, common.DEFINE_TYPE.UNGVIENNOP_CV, common.STATUS_PERSONAL.TRUOCDO)}
                    />
                </ScrollView> */}
            </Transitioning.View>
        </View >
    )
}

const stApplied = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.BackgroundHome
    },
    headerSection: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: 10, backgroundColor: colors.BackgroundHome
    }
})
export default Applied
