import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Utils from '../../../app/Utils'
import { IsLoading } from '../../../components'
import { colors } from '../../../styles'
import { reSize, reText } from '../../../styles/size'
import { Width } from '../../../styles/styles'
import apis from '../../apis'
import ChartCotChong from './component/ChartCotChong'

const NoiDungTieuTuc = (props) => {
    const refLoading = useRef(null);
    // const [data, setData] = useState([])  //data tổng
    //Các biến truyền từ props
    const idTopic = props.idTopic ? props.idTopic : ''
    const dateFrom = props.dateFrom ? props.dateFrom : ''
    const dateTo = props.dateTo ? props.dateTo : ''
    //Biến lưu data từng cụm
    const [socialPost, setSocialPost] = useState([])
    const [socialComment, setSocialComment] = useState([])
    const [news, setNews] = useState([])
    const [other, setOther] = useState([])
    //
    const [sumCountSocialPost, setSumCountSocialPost] = useState('---')
    const [sumCountSocialComment, setSumCountSocialComment] = useState('---')
    const [sumCountNews, setSumCountNews] = useState('---')
    const [sumCountOther, setSumCountOther] = useState('---')
    //Biến tiêu cực
    const [socialPost_negative, setSocialPost_negative] = useState(0)
    const [socialComment_negative, setSocialComment_negative] = useState(0)
    const [news_negative, setNews_negative] = useState(0)
    const [other_negative, setOther_negative] = useState(0)

    const CHART_WIDTH_HEIGHT = {
        WIDTH: reSize(15),
        HEIGHT: reSize(200)
    }
    useEffect(() => {
        getDataNoiDungTH()
    }, [])

    useEffect(() => {
        getDataNoiDungTH()
    }, [props])
    const SrerachChietiet = () => {

    }
    const getDataNoiDungTH = async () => {
        refLoading.current.show()
        let res = await apis.ApiReputa.getNoiDungTH(idTopic, dateFrom, dateTo)
        // Utils.nlog("Du Lieu tiêu cực:", res)
        if (res) {
            refLoading.current.hide()
            setSocialPost(res.socialPost?.data)
            setSocialComment(res.socialComment?.data)
            setNews(res.news?.data)
            setOther(res.other?.data)
            let sumPost = 0
            let sumComment = 0
            let sumNews = 0
            let sumOther = 0

            let sumPost_negative = 0
            let sumComment_negative = 0
            let sumNews_negative = 0
            let sumOther_negative = 0

            res.socialPost?.data?.map(val => {
                sumPost += val.total_count
                sumPost_negative += val.negative_count
            })
            res.socialComment?.data?.map(val => {
                sumComment += val.total_count
                sumComment_negative += val.negative_count
            })
            res.news?.data?.map(val => {
                sumNews += val.total_count
                sumNews_negative += val.negative_count
            })
            res.other?.data?.map(val => {
                sumOther += val.total_count
                sumOther_negative += val.negative_count
            })
            setSumCountSocialPost(sumPost)
            setSumCountSocialComment(sumComment)
            setSumCountNews(sumNews)
            setSumCountOther(sumOther)

            setSocialPost_negative(sumPost_negative)
            setSocialComment_negative(sumComment_negative)
            setNews_negative(sumNews_negative)
            setOther_negative(sumOther_negative)
        }
        else {
            setSocialPost([])
            setSocialComment([])
            setNews([])
            setOther([])
            refLoading.current.hide()
        }
    }
    // Utils.nlog("POST:", socialPost)
    return (
        <View style={styles.container}>
            <Text style={styles.Title}>{'TIN TIÊU CỰC KHI NHẮC TỚI\nTHEO DÕI AN NINH TRẬT TỰ'}</Text>
            <View style={{ width: Width(70), height: 0.5, backgroundColor: colors.white, alignSelf: 'center', marginVertical: 10 }} />
            <View style={{ marginLeft: 10 }}>
                <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: reText(15) }}><Text style={{ color: '#DC5178' }}>{socialPost_negative}</Text> / {sumCountSocialPost}</Text>
                <Text style={{ color: colors.white, fontSize: reText(13) }}><Text style={{ color: '#DC5178' }}>{parseInt(socialPost_negative / sumCountSocialPost * 100)}%</Text> Số bài đăng nhắc tới Tất cả chủ đề trên mạng xã hội</Text>
            </View>
            <ChartCotChong
                // data={datatest}
                data={socialPost}
                // nameBD={'chua đặt tên'}
                listKey={['total_count', 'negative_count']}
                listGhichu={["Các bài đề cập", "Các bài có nội dung tiêu cực"]}
                listColor={["#DCE6E8", "#DC5178"]}
                keylabel={'date'}
                isLoading={false}
                idTopic={idTopic}
                LoaiTinTuc={[2]} //  mạng xã hội
                Title={'Mạng Xã Hội'}
                // heightLabel={1000}
                width={CHART_WIDTH_HEIGHT.WIDTH} height={CHART_WIDTH_HEIGHT.HEIGHT}
            />

            <View style={{ width: Width(70), height: 0.5, backgroundColor: colors.white, alignSelf: 'center', marginVertical: 10 }} />
            <View style={{ marginLeft: 10 }}>
                <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: reText(15) }}><Text style={{ color: '#DC5178' }}>{socialComment_negative}</Text> / {sumCountSocialComment}</Text>
                <Text style={{ color: colors.white, fontSize: reText(13) }}><Text style={{ color: '#DC5178' }}>{parseInt(socialComment_negative / sumCountSocialComment * 100)}%</Text> Số bình luận nhắc tới Tất cả chủ đề trên mạng xã hội</Text>
            </View>
            <ChartCotChong
                // data={datatest}
                data={socialComment}
                // nameBD={'chua đặt tên'}
                listKey={['total_count', 'negative_count']}
                listGhichu={["Các bài đề cập", "Các bài có nội dung tiêu cực"]}
                listColor={["#DCE6E8", "#DC5178"]}
                keylabel={'date'}
                isLoading={false}
                idTopic={idTopic}
                LoaiTinTuc={[2]} //  mạng xã hội
                Title={'Mạng Xã Hội'}
                LoaiBaiViet={[1, 2, 4, 5, 7, 8, 10]}
                // heightLabel={1000}
                width={CHART_WIDTH_HEIGHT.WIDTH} height={CHART_WIDTH_HEIGHT.HEIGHT}
            />

            <View style={{ width: Width(70), height: 0.5, backgroundColor: colors.white, alignSelf: 'center', marginVertical: 10 }} />
            <View style={{ marginLeft: 10 }}>
                <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: reText(15) }}><Text style={{ color: '#DC5178' }}>{news_negative}</Text> / {sumCountNews}</Text>
                <Text style={{ color: colors.white, fontSize: reText(13) }}><Text style={{ color: '#DC5178' }}>{parseInt(news_negative / sumCountNews * 100)}%</Text> Số bài báo, tin tức nhắc tới Tất cả chủ đề</Text>
            </View>
            <ChartCotChong
                // data={datatest}
                data={news}
                // nameBD={'chua đặt tên'}
                listKey={['total_count', 'negative_count']}
                listGhichu={["Các bài đề cập", "Các bài có nội dung tiêu cực"]}
                listColor={["#DCE6E8", "#DC5178"]}
                keylabel={'date'}
                isLoading={false}
                idTopic={idTopic}
                Title={'Báo Chí'}
                LoaiTinTuc={[101, 104, 102, 103, 105]} // bài báo

                // heightLabel={1000}
                width={CHART_WIDTH_HEIGHT.WIDTH} height={CHART_WIDTH_HEIGHT.HEIGHT}
            />

            <View style={{ width: Width(70), height: 0.5, backgroundColor: colors.white, alignSelf: 'center', marginVertical: 10 }} />
            <View style={{ marginLeft: 10 }}>
                <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: reText(15) }}><Text style={{ color: '#DC5178' }}>{other_negative}</Text> / {sumCountOther}</Text>
                <Text style={{ color: colors.white, fontSize: reText(13) }}><Text style={{ color: '#DC5178' }}>{parseInt(other_negative / sumCountOther * 100)}%</Text> {'Nội dung nhắc tới Tất cả chủ đề trên diễn đàn, blog & website'}</Text>
            </View>
            <ChartCotChong
                // data={datatest}
                data={other}
                // nameBD={'chua đặt tên'}
                listKey={['total_count', 'negative_count']}
                listGhichu={["Các bài đề cập", "Các bài có nội dung tiêu cực"]}
                listColor={["#DCE6E8", "#DC5178"]}
                keylabel={'date'}
                isLoading={false}
                idTopic={idTopic}
                Title={'Diễn Đàn và Blog && Website'}
                LoaiTinTuc={[4, 3, 5]} // blog website
                width={CHART_WIDTH_HEIGHT.WIDTH} height={CHART_WIDTH_HEIGHT.HEIGHT}
            />
            <IsLoading ref={refLoading} />
        </View>
    )
}

export default NoiDungTieuTuc

const styles = StyleSheet.create({
    container: { marginTop: 10, flex: 1 },
    Title: { fontSize: reText(15), alignSelf: 'center', textAlign: 'center', fontWeight: 'bold', color: colors.white },
})
