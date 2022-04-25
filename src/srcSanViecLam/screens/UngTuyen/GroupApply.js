import React, { useEffect, useState, useRef, useMemo } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { View, Text, StyleSheet, FlatList, ScrollView, Easing } from 'react-native'
import Animated from 'react-native-reanimated'
import { colors } from '../../../../styles'
import TextApp from '../../../../components/TextApp'
import { Images } from '../../../images'
import { nstyles } from '../../../../styles/styles'
import { reText } from '../../../../chat/styles/size'
import Utils from '../../../../app/Utils'
import ItemRecruitment from '../../components/ItemRecruitment'
import { LikeRecruitment, LikeUnlikeApplied, LoadListRecruitmentSaved, UnLikeRecruitment, UnLikeRecruitmentSaved } from '../../../../srcRedux/actions/sanvieclam/DataSVL'
import { useDispatch } from 'react-redux'
import { DEFINE_SCREEN_DETAILS } from '../../common'

const GroupApply = (props) => {
    const dispatch = useDispatch()
    const { onPressGroup = () => { }, data = [], title } = props
    const [showGroup, setShowGroup] = useState(props?.showGroup || false)
    const animation = useRef(new Animated.Value(0)).current;

    const rotateDrop = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['-90deg', '0deg'],
    });

    useEffect(() => {
        CallAnimation(showGroup ? 1 : 0);
    }, [showGroup])

    const onPressHanler = () => {
        onPressGroup()
        setShowGroup(!showGroup)

    }

    const CallAnimation = (value) => {
        Animated.timing(animation, {
            toValue: value,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start();
    }

    const onPressDetail = (item) => {
        // chi tiết trong ứng tuyển
        Utils.goscreen({ props }, 'ModalCTTuyenDung', {
            Id: `${item.Id}|${DEFINE_SCREEN_DETAILS.TuyenDung_CaNhan.KeyScreen}`,
            // isNhaTuyenDung: false,
            // isUngTuyen: true
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

    const renderItem = (item, index) => {
        return (
            <ItemRecruitment
                data={item}
                onPress={() => onPressDetail(item)}
                // typeItem={item.status == 0 ? 1 : 2} // Chỉnh sau
                onPressSave={() => onPressSaveTin(item)}
            />
        )
    }


    return (
        <View style={[{ backgroundColor: colors.BackgroundHome }, props?.style]}>
            <TouchableOpacity activeOpacity={0.5} onPress={onPressHanler}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, backgroundColor: colors.white }}>
                <TextApp style={{ paddingRight: 10, fontWeight: 'bold', fontSize: reText(18) }}>{title} ({data.length})</TextApp>
                <Animated.Image
                    source={Images.icDropDown}
                    resizeMode="contain"
                    style={[nstyles.nIcon16, { tintColor: colors.grayLight, transform: [{ rotate: rotateDrop }] }]}
                />
            </TouchableOpacity>
            {showGroup &&
                <View style={{ width: '100%', marginTop: 5 }}>
                    {data.map(renderItem)}
                </View>
            }
        </View>
    )
}

const stGroupApply = StyleSheet.create({
    container: {
        padding: 10
    }
})

export default GroupApply