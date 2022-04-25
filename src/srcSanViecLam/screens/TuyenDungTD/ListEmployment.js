import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet, FlatList, StatusBar, TextInput, Platform } from 'react-native'
import Utils from '../../../../app/Utils'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import { Height, khoangcach, nstyles, paddingBotX } from '../../../../styles/styles'
import TextApp from '../../../../components/TextApp'
import ButtonSVL from '../../components/ButtonSVL'
import ImageCus from '../../../../components/ImageCus'
import { colorsSVL } from '../../../../styles/color'
import HeaderSVL from '../../components/HeaderSVL'
import { ImagesSVL } from '../../images'
import ItemEmployment from '../../components/ItemEmployment';
import EmptySVL from '../../components/EmptySVL'
import { useDispatch, useSelector } from 'react-redux';
import { CheckedRecruitmentPost, SelectRecruitmentPost } from '../../../../srcRedux/actions/sanvieclam/DataSVL';

const ListEmployment = (props) => {
    const dispatch = useDispatch()
    const { RefreshingDataListRecruitmentPost = true, LstRecruitmentPost = [], SelectRecruitmentPostItem = {} } = useSelector(state => state.dataSVL)
    const [search, setSearch] = useState('')

    const onGoBack = () => {
        Utils.goback({ props })
    }

    const onCheckItem = (item) => {
        Utils.nlog("[item]", item)
        dispatch(CheckedRecruitmentPost(item))
    }

    const renderItem = ({ item, index }) => {
        return (
            <ItemEmployment data={item} onPress={() => onCheckItem(item)} />
        )
    }

    const handlerConfirm = (item) => {
        dispatch(SelectRecruitmentPost())
        Utils.goback({ props })
    }

    const onSearch = (text) => {
        setSearch(text)
    }

    const conditionSearch = (item, textSearch) => {
        return item?.TieuDe && Utils.removeAccents(item?.TieuDe?.toUpperCase()).includes(Utils.removeAccents(textSearch?.toUpperCase())) ||
            item?.ChucVu && Utils.removeAccents(item?.ChucVu?.toUpperCase()).includes(Utils.removeAccents(textSearch?.toUpperCase())) ||
            item?.LoaiNganhNghe && Utils.removeAccents(item?.LoaiNganhNghe?.toUpperCase()).includes(Utils.removeAccents(textSearch?.toUpperCase()))
    }

    return (
        <View style={stListEmployment.container}>
            <StatusBar barStyle='dark-content' />
            <HeaderSVL
                title={"Thông tin tuyển dụng"}
                iconLeft={ImagesSVL.icBackSVL}
                onPressLeft={onGoBack}
            />
            <View style={stListEmployment.body}>
                <TextInput
                    placeholder={'Tìm kiếm bài đăng...'}
                    style={{
                        padding: Platform.OS == 'android' ? 5 : 10, marginHorizontal: 10,
                        backgroundColor: colors.white, borderRadius: 20, marginTop: 5, marginBottom: 5
                    }}
                    onChangeText={onSearch}
                />
                <FlatList
                    data={
                        search.length > 0 ?
                            LstRecruitmentPost.filter(e => conditionSearch(e, search))
                            : LstRecruitmentPost
                    }
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    // refreshing={RefreshingDataListRecruitmentPost}
                    ListEmptyComponent={<EmptySVL style={{ flex: 1, marginTop: 20 }} textEmpty={'Không có dữ liệu'} />}
                    // removeClippedSubviews={true} // Unmount components when outside of window 
                    initialNumToRender={10} // Reduce initial render amount
                    maxToRenderPerBatch={5} // Reduce number in each render batch
                    updateCellsBatchingPeriod={100} // Increase time between renders
                    windowSize={7} // Reduce the window size
                />
                <ButtonSVL
                    disabled={SelectRecruitmentPostItem?.Id ? false : true}
                    onPress={handlerConfirm}
                    text={'Xác nhận'}
                    styleText={{ fontSize: reText(14) }}
                    style={{ marginHorizontal: 10, borderRadius: 50, marginVertical: 10,
                        backgroundColor: SelectRecruitmentPostItem?.Id ? colorsSVL.blueMainSVL : colorsSVL.grayLine }}
                />
            </View>
        </View>
    )
}

const stListEmployment = StyleSheet.create({
    container: {
        flex: 1
    },
    body: {
        flex: 1, backgroundColor: colors.BackgroundHome, paddingBottom: paddingBotX
    }
})

export default ListEmployment
