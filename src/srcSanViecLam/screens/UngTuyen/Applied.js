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
        // chi ti???t trong ???ng tuy???n
        Utils.goscreen({ props }, 'ModalCTTuyenDung', {
            Id: `${item.IdUngTuyen}|${DEFINE_SCREEN_DETAILS.TuyenDung_CaNhan.KeyScreen}`
        })
    }

    const onPressSaveTin = (item) => {
        Utils.goscreen({ props }, 'PopupSave', { data: item, isSave: item?.IsLike == 0 ? true : false, callback: callbackPopupSave })
    }

    const callbackPopupSave = (itemcallback) => {
        if (itemcallback?.IsLike == 1) {
            //Item ch??a l??u chuy???n tr???ng th??i th??nh l??u v???i IsLike : 1 -> Load l???i danh s??ch tin tuy???n d???ng ???? l??u
            dispatch(LoadListRecruitmentSaved())
            //Item ch??a l??u chuy???n tr???ng th??i th??nh l??u v???i IsLike : 1 -> Map la??? danh s??ch x??? l?? UI danh s??ch tin tuy???n d???ng
            dispatch(LikeRecruitment(itemcallback))
            //Item ch??a l??u chuy???n tr???ng th??i th??nh l??u v???i IsLike : 1 -> Map la??? danh s??ch x??? l?? UI l???ch s??? ???ng tuy???n
            dispatch(LikeUnlikeApplied(itemcallback))
        }
        else {
            //Item l??u chuy???n tr???ng th??i th??nh ch??a l??u v???i IsLike : 0 -> Map la??? danh s??ch x??? l?? UI danh s??ch tin tuy???n d???ng ???? l??u
            dispatch(UnLikeRecruitmentSaved(itemcallback))
            //Item l??u chuy???n tr???ng th??i th??nh ch??a l??u v???i IsLike : 0 -> Map la??? danh s??ch x??? l?? UI danh s??ch tin tuy???n d???ng
            dispatch(UnLikeRecruitment(itemcallback))
            //Item l??u chuy???n tr???ng th??i th??nh ch??a l??u v???i IsLike : 0 -> Map la??? danh s??ch ??? l?? UI l???ch s??? ???ng tuy???n
            dispatch(LikeUnlikeApplied(itemcallback))
        }
    }

    const DATA_SECTION = [
        {
            title: '???ng tuy???n',
            data: HandleListWithKey(LstDataApplied, common.STATUS_PERSONAL.UNGTUYEN)
        },
        {
            title: '???? nh???n vi???c',
            data: HandleListWithKey(LstDataApplied, common.STATUS_PERSONAL.DANHANVIEC)
        },
        {
            title: 'Tr?????c ????y',
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
                            // typeItem={item.status == 0 ? 1 : 2} // Ch???nh sau
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
                            title={!RefreshingDataApplied ? 'Vu???t xu???ng th??? ra ????? c???p nh???t' : `??ang t???i...`}
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
                            title='??ang t???i...'
                        />
                    }>
                    <GroupApply title={'???ng tuy???n'}
                        onPressGroup={onPressGroup}
                        showGroup
                        data={HandleListWithKey(LstDataApplied, common.DEFINE_TYPE.UNGVIENNOP_CV, common.STATUS_PERSONAL.UNGTUYEN)}
                    />
                    <GroupApply
                        title={'???? nh???n vi???c'} onPressGroup={onPressGroup}
                        style={{ marginTop: 5 }}
                        data={HandleListWithKey(LstDataApplied, common.DEFINE_TYPE.UNGVIENNOP_CV, common.STATUS_PERSONAL.DANHANVIEC)}
                    />
                    <GroupApply
                        title={'Tr?????c ????y'}
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
