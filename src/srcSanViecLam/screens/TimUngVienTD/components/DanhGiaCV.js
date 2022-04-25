import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import TextInputApp from '../../../../../components/TextInputApp'
import { Rating, AirbnbRating } from 'react-native-ratings';
import { reText } from '../../../../../styles/size';
import TextApp from '../../../../../components/TextApp';
import { colors } from '../../../../../chat/styles';
import ButtonSVL from '../../../components/ButtonSVL';
import { colorsSVL } from '../../../../../styles/color';
import ImageCus from '../../../../../components/ImageCus';
import { Images } from '../../../../images';
import { nstyles } from '../../../../../styles/styles';
import Utils, { icon_typeToast } from '../../../../../app/Utils';
import { GetListDanhGia, PostDanhGia } from '../../../apis/apiSVL';
import { IsLoading, ListEmpty } from '../../../../../components';

const DanhGiaCV = (props) => {
    const [rate, setRate] = useState(0)
    const flatlistDanhGia = useRef();
    const [Page, setPage] = useState({ Page: 1, AllPage: 1 })
    const [data, setData] = useState([])
    const [SaoTrungBinh, setSaoTrungBinh] = useState(props?.itemCV?.SaoTrungBinh)
    const [isDaDanhGia, setisDaDanhGia] = useState(props?.itemCV?.IsDaDanhGia)
    const [NoiDung, setNoiDung] = useState('')
    const [isLoadmore, setIsLoadmore] = useState(false)
    const [IDCV, setIDCV] = useState(props?.itemCV?.IdCV)
    Utils.nlog('props data tin tuyen dung', props.itemCV)

    const sendRating = async () => {
        // Gửi đánh giá
        let obj = {
            "Id": IDCV, //type=1: Id Tin tuyển dụng, type=0: Id CV
            "DanhGia": rate,//số sao
            "LyDo": NoiDung,//ghi lời đánh giá
            "Type": 0 //1: tin tuyển dụng, 0: cv
        }
        let res = await PostDanhGia(obj)
        if (res.status == 1) {
            setNoiDung('')
            setisDaDanhGia(1)
            setSaoTrungBinh(rate)
            // setPage({ Page: 1, AllPage: 1 })
            getDataRating()
            Utils.showToastMsg("Thông báo chat", "Thực hiện thành công", icon_typeToast.success);
        } else {
            Utils.showToastMsg('Thông báo', 'Đáng giá thất bại', icon_typeToast.warning);
        }
    }

    const getDataRating = async (isNext = false) => {
        // Lấy danh sách đánh giá người dùng
        let page = 1
        if (isNext) {
            page = Page.Page + 1
        }
        let res = await GetListDanhGia(props?.itemCV?.IdCV, page, 0, 5)
        if (res.data && res.status == 1) {
            if (isNext) {
                setData(data.concat(res.data))
                setPage({
                    Page: res.page.Page,
                    AllPage: res.page.AllPage
                })
            }
            else {
                setData(res.data)
                setPage({
                    Page: res.page.Page,
                    AllPage: res.page.AllPage
                })
            }
        } else {
            setData([])
            setPage({
                Page: 1,
                AllPage: 1
            })
        }
        setIsLoadmore(false)

    }

    useEffect(() => {
        getDataRating()
    }, [props.itemCV])

    useEffect(() => {

    }, [data])


    // item đánh giá
    const renderRating = ({ item, index }) => {

        return (
            <View style={{ paddingVertical: 10 }}>
                <View style={[stDanhGiaCV.stViewItemDSDanhGia]}>
                    {/* {Người đánh giá, thời gian, rate đánh giá, nội dung đánh giá} */}
                    <TextApp numberOfLines={1} style={[stDanhGiaCV.stTextNormal, { marginRight: 5, flex: 1 }]}>
                        {item?.FullName}
                    </TextApp>
                    <TextApp style={[stDanhGiaCV.stTextDate]}> {item?.CreatedDate}</TextApp>
                </View>
                <View style={[stDanhGiaCV.stViewDanhGia]}>
                    {renderStartRating(item?.DanhGia)}
                </View>
                <TextApp style={[stDanhGiaCV.stTextNormal, { textAlign: 'justify' }]}>{item?.LyDo}</TextApp>
            </View>
        )
    }

    //comp render star đánh giá
    const renderStartRating = (rate = 3) => {
        let max = 5
        return (
            <View style={{
                flexDirection: 'row',
                // flexWrap: 'wrap',
                // alignSelf: 'center',
                // justifyContent: 'flex-start'
            }}>
                {Array.from(Array(parseInt(rate))).map((item, index) =>
                    <ImageCus source={Images.icStar} style={[nstyles.nIcon14, { marginRight: 2 }]} resizeMode='contain' />
                )}
                {Array.from(Array(max - parseInt(rate))).map((item, index) =>
                    <ImageCus source={Images.icStarUnActive} style={[nstyles.nIcon14, { marginRight: 2, tintColor: colorsSVL.grayBgrBtn }]} tintColor={colors.grayLight} resizeMode='contain' />
                )}
            </View>
        )

    }

    // button loadmore
    const renderButtonLoadMore = () => {
        Utils.nlog('renderButtonLoadMore Page', Page.Page)
        Utils.nlog('renderButtonLoadMore AllPage', Page.AllPage)
        return (
            <View>
                {isLoadmore && <ActivityIndicator size={'small'} color={colorsSVL.blueMainSVL} />}
                {Page.Page < Page.AllPage && <TouchableOpacity activeOpacity={0.5} onPress={loadMore} style={[stDanhGiaCV.stButton]}>
                    <TextApp style={[stDanhGiaCV.stTextButton]}>{'Xem thêm'}</TextApp>
                </TouchableOpacity>}
            </View>

        )
    }

    const itemSeparatorComponent = () => {
        return (<View style={{ height: 3, backgroundColor: colors.BackgroundHome }} />)
    }

    const loadMore = () => {
        Utils.nlog('Page : ', Page.Page)
        Utils.nlog('AllPage : ', Page.AllPage)
        if (Page.Page < Page.AllPage) {
            setIsLoadmore(true)
            getDataRating(true)
        }
    }

    return (
        <View>

            {
                isDaDanhGia == 0 ? <View>
                    <AirbnbRating
                        count={5}
                        reviews={["Rất không hài lòng", "Không hài lòng", "Bình thường", "Hài lòng", "Rất hài lòng"]}
                        defaultRating={3}
                        reviewSize={reText(18)}
                        size={25}
                        starStyle={{ marginHorizontal: 5 }}
                        onFinishRating={rating => setRate(rating)}
                    />
                    <TextApp style={{ color: colorsSVL.grayText }}>
                        {'Nội dung đánh giá:'}
                    </TextApp>
                    <TextInputApp
                        multiline
                        placeholder="Nhập nội dung đánh giá"
                        onChangeText={(text) => {
                            Utils.nlog(text)
                            setNoiDung(text)
                        }}
                        value={NoiDung}
                        style={[stDanhGiaCV.stTextInput]}
                    />
                    <ButtonSVL
                        onPress={sendRating}
                        text={'Gửi đánh giá'}
                        colorText={colorsSVL.white}
                        style={[stDanhGiaCV.stButtonGui]}
                    /></View> : null
            }


            <View style={[stDanhGiaCV.stViewTrungBinhDG]}>
                <Text style={[stDanhGiaCV.stTextNormal]}>{'Trung bình lượt đánh giá'} : </Text>
                {renderStartRating(SaoTrungBinh)}
            </View>


            {/* {Danh sach đánh giá} */}
            <FlatList
                style={{}}
                contentContainerStyle={{}}
                ref={flatlistDanhGia}
                data={data}
                keyExtractor={(item, index) => `DanhGia-${index}`}
                renderItem={renderRating}
                ListFooterComponent={renderButtonLoadMore}
                ItemSeparatorComponent={itemSeparatorComponent}
                ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
            />
        </View>
    )
}

const stDanhGiaCV = StyleSheet.create({
    stViewTrungBinhDG: {
        alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginVertical: 5,
    },
    stTextNormal: {
        fontSize: reText(14)
    },
    stTextButton: {
        color: colorsSVL.blueMainSVL, textDecorationLine: 'underline'
    },
    stButton: {
        alignSelf: 'center', padding: 10
    },
    stButtonGui: {
        fontSize: reText(18),
        borderRadius: 18,
        backgroundColor: colorsSVL.organeMainSVL,
        alignSelf: 'center',
        paddingHorizontal: 30,
        marginBottom: 10
    },
    stTextInput: {
        padding: 10,
        maxHeight: 120,
        minHeight: 120,
        backgroundColor: colors.BackgroundHome,
        marginVertical: 10,
        borderRadius: 10,
        textAlignVertical: 'top'
    },
    stViewDanhGia: {
        justifyContent: 'flex-start', alignItems: 'flex-start', marginVertical: 5
    },
    stTextDate: {
        color: colorsSVL.grayText, fontSize: reText(12)
    },
    stViewItemDSDanhGia: {
        flexDirection: 'row', alignItems: 'center'
    },
})

export default DanhGiaCV