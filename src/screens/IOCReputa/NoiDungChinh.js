import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { Grid, LineChart, XAxis, YAxis } from 'react-native-svg-charts'
import Utils from '../../../app/Utils'
import { IsLoading } from '../../../components'
import { colors } from '../../../styles'
import { reSize, reText } from '../../../styles/size'
import { Height, Width } from '../../../styles/styles'
import apis from '../../apis'
import moment from 'moment'
import { Images } from '../../images'
const NoiDungChinh = (props) => {
    const refLoading = useRef(null);
    const [data, setData] = useState([])  //data tổng
    //Các biến truyền từ props
    const idTopic = props.idTopic ? props.idTopic : ''
    const dateFrom = props.dateFrom ? props.dateFrom : ''
    const dateTo = props.dateTo ? props.dateTo : ''
    //Biến lưu data từng cụm
    const [socialPost, setSocialPost] = useState([])
    const [socialComment, setSocialComment] = useState([])
    const [news, setNews] = useState([])
    const [other, setOther] = useState([])
    //SumCount biến tổng từng cụm
    const [sumCountSocialPost, setSumCountSocialPost] = useState('---')
    const [sumCountSocialComment, setSumCountSocialComment] = useState('---')
    const [sumCountNews, setSumCountNews] = useState('---')
    const [sumCountOther, setSumCountOther] = useState('---')
    //Dữ liệu từng đường data theo cụm
    const [dataLineSocicalPost, setDataLineSocicalPost] = useState([])
    const [dataLineSocicalComment, setDataLineSocicalComment] = useState([])
    const [dataLineNews, setDataLineNews] = useState([])
    const [dataLineOther, setDataLineOther] = useState([])
    // Dữ liệu % mỗi cụm
    const [dataPercentPost, setDataPercentPost] = useState({})
    const [dataPercentComment, setDataPercentComment] = useState({})
    const [dataPercentNews, setDataPercentNews] = useState({})
    const [dataPercentOther, setDataPercentOther] = useState({})
    useEffect(() => {
        getDataNoiDungTH()
        getPhanTramCum()
    }, [])

    useEffect(() => {
        getDataNoiDungTH()
        getPhanTramCum()
    }, [props])

    const getDataNoiDungTH = async () => {
        refLoading.current.show()
        let res = await apis.ApiReputa.getNoiDungTH(idTopic, dateFrom, dateTo)
        Utils.nlog("NOIDUNGTH:", res)
        if (res) {
            setData(res)
            setSocialPost(res.socialPost?.data)
            setSocialComment(res.socialComment?.data)
            setNews(res.news?.data)
            setOther(res.other?.data)
            let sumPost = 0
            let sumComment = 0
            let sumNews = 0
            let sumOther = 0

            let linePost = []
            let lineComment = []
            let lineNews = []
            let lineOther = []

            res.socialPost?.data?.map(val => {
                sumPost += val.total_count
                linePost.push(val.total_count)
            })
            res.socialComment?.data?.map(val => {
                sumComment += val.total_count
                lineComment.push(val.total_count)
            })
            res.news?.data?.map(val => {
                sumNews += val.total_count
                lineNews.push(val.total_count)
            })
            res.other?.data?.map(val => {
                sumOther += val.total_count
                lineOther.push(val.total_count)
            })
            setSumCountSocialPost(sumPost)
            setSumCountSocialComment(sumComment)
            setSumCountNews(sumNews)
            setSumCountOther(sumOther)

            setDataLineSocicalPost(linePost)
            setDataLineSocicalComment(lineComment)
            setDataLineNews(lineNews)
            setDataLineOther(lineOther)

            refLoading.current.hide()
        }
        else {
            setData([])
            setSocialPost([])
            setSocialComment([])
            setNews([])
            setOther([])
            refLoading.current.hide()
        }
    }

    const getPhanTramCum = async () => {
        let res = await apis.ApiReputa.getPhanTramCum(idTopic, dateFrom, dateTo)
        Utils.nlog("GET CUM:", res)
        if (res) {
            setDataPercentPost(res.socialPost)
            setDataPercentComment(res.socialComment)
            setDataPercentNews(res.news)
            setDataPercentOther(res.other)
        }
        else {
            setDataPercentPost({})
            setDataPercentComment({})
            setDataPercentNews({})
            setDataPercentOther({})
        }
    }

    const dataChart = [
        {
            data: dataLineSocicalPost,
            svg: { stroke: '#2F6EC3' },
        },
        {
            data: dataLineSocicalComment,
            svg: { stroke: '#30AACC' },
        },
        {
            data: dataLineNews,
            svg: { stroke: '#DA7B3E' },
        },
        {
            data: dataLineOther,
            svg: { stroke: '#93A920' },
        }
    ]
    return (
        <View style={styles.container}>
            <Text style={styles.Title}>SỐ LƯỢNG NỘI DUNG CÓ ĐỀ CẬP</Text>
            <View style={styles.containerItem}>
                <View style={[styles.item, { backgroundColor: '#2F6EC3' }]}>
                    <View style={styles.line}>
                        <View style={styles.itemChild}>
                            <Text style={styles.textCount}>{sumCountSocialPost} | {dataPercentPost?.percent}%</Text>
                            {dataPercentPost?.percent == 0 || dataPercentPost?.percent == null ? null : <Image source={Images.icArrow} style={[styles.icon, { tintColor: dataPercentPost?.percent >= 0 ? colors.greenishTeal : colors.redStar, transform: [{ rotate: dataPercentPost?.percent >= 0 ? '0 deg' : '180 deg' }] }]} />}
                        </View>

                    </View>
                    <Text style={styles.textItem}>BÀI ĐĂNG TRÊN MXH</Text>
                </View>
                <View style={[styles.item, { backgroundColor: '#30AACC' }]}>
                    <View style={styles.line}>
                        <View style={styles.itemChild}>
                            <Text style={styles.textCount}>{sumCountSocialComment} | {dataPercentComment?.percent}%</Text>
                            {dataPercentComment?.percent == 0 || dataPercentComment?.percent == null ? null : <Image source={Images.icArrow} style={[styles.icon, { tintColor: dataPercentComment?.percent >= 0 ? colors.greenishTeal : colors.redStar, transform: [{ rotate: dataPercentComment?.percent >= 0 ? '0 deg' : '180 deg' }] }]} />}
                        </View>
                    </View>
                    <Text style={styles.textItem}>BÌNH LUẬN TRÊN MXH</Text>
                </View>
            </View>
            <View style={styles.containerItem}>
                <View style={[styles.item, { backgroundColor: '#DA7B3E' }]}>
                    <View style={styles.line}>
                        <View style={styles.itemChild}>
                            <Text style={styles.textCount}>{sumCountNews} | {dataPercentNews?.percent}%</Text>
                            {dataPercentNews?.percent == 0 || dataPercentNews?.percent == null ? null : <Image source={Images.icArrow} style={[styles.icon, { tintColor: dataPercentNews?.percent >= 0 ? colors.greenishTeal : colors.redStar, transform: [{ rotate: dataPercentNews?.percent >= 0 ? '0 deg' : '180 deg' }] }]} />}
                        </View>
                    </View>
                    <Text style={styles.textItem}>BÁO CHÍ, TIN TỨC</Text>
                </View>
                <View style={[styles.item, { backgroundColor: '#93A920' }]}>
                    <View style={styles.itemChild}>
                        <View style={styles.line}>
                            <Text style={styles.textCount}>{sumCountOther} | {dataPercentOther?.percent}%</Text>
                            {dataPercentOther?.percent == 0 || dataPercentOther?.percent == null ? null : <Image source={Images.icArrow} style={[styles.icon, { tintColor: dataPercentOther?.percent >= 0 ? colors.greenishTeal : colors.redStar, transform: [{ rotate: dataPercentOther?.percent >= 0 ? '0 deg' : '180 deg' }] }]} />}
                        </View>
                    </View>
                    <Text style={styles.textItem}>NGUỒN KHÁC</Text>
                </View>
            </View>
            <Text style={styles.textDate}>Từ ngày {moment(dateFrom).format('DD/MM/YYYY')} - Đến ngày: {moment(dateTo).format('DD/MM/YYYY')}</Text>
            {dataChart.length > 0 && dataLineSocicalPost.length > 0 && dataLineSocicalComment.length > 0 && dataLineNews.length > 0 && dataLineOther.length > 0 ?
                <View style={styles.containerChart}>
                    <YAxis
                        data={[...dataLineSocicalPost, ...dataLineSocicalComment, ...dataLineNews, ...dataLineOther]}
                        // key={}
                        // formatLabel={(value, i) => `${value}`}
                        contentInset={{ top: reSize(20), bottom: reSize(20) }}
                        svg={{
                            fill: 'grey',
                            fontSize: 10,
                        }}
                        numberOfTicks={5}
                    />
                    <LineChart
                        style={{ height: 200, flex: 1 }}
                        data={dataChart}
                        contentInset={{ top: 20, bottom: 20 }}
                    >
                        <Grid />
                    </LineChart>
                </View> : null}
            {/* <XAxis
                style={{ width: Width(100), height: 20 }}
                data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]}
                formatLabel={(value, index) => `${moment().format('DD/MM/YYYY')}`}
                contentInset={{ left: reSize(20), right: reSize(20) }}
                svg={{ fontSize: 8, fill: 'black' }}
            /> */}
            <View style={styles.stChuThich}>
                <Text style={styles.chuthich}>Chú thích:</Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: 10, height: 10, backgroundColor: '#2F6EC3' }} />
                    <Text style={styles.textChuThich}> Bài đăng trên mạng xã hội</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: 10, height: 10, backgroundColor: '#30AACC' }} />
                    <Text style={styles.textChuThich}> Bình luận trên mạng xã hội</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: 10, height: 10, backgroundColor: '#DA7B3E' }} />
                    <Text style={styles.textChuThich}> Báo chí, tin tức</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: 10, height: 10, backgroundColor: '#93A920' }} />
                    <Text style={styles.textChuThich}> Nguồn khác (Diễn đàn,W....)</Text>
                </View>
            </View>
            <IsLoading ref={refLoading} />
        </View>
    )
}

export default NoiDungChinh

const styles = StyleSheet.create({
    container: { marginTop: 10 },
    Title: { fontSize: reText(15), alignSelf: 'center', textAlign: 'center', fontWeight: 'bold', color: colors.white },
    containerItem: { flexDirection: 'row', marginHorizontal: 10, justifyContent: 'space-between', marginTop: 10 },
    item: {
        width: Width(46), backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10
    },
    itemChild: { flexDirection: 'row', alignSelf: 'center' },
    textItem: { alignSelf: 'center', fontWeight: 'bold', color: colors.white, fontSize: reText(12) },
    textCount: { color: colors.white, fontWeight: 'bold' },
    stChuThich: { marginHorizontal: 10, marginTop: 10 },
    chuthich: { color: colors.white, fontSize: reText(12), fontWeight: 'bold' },
    textChuThich: { fontSize: reText(12), color: colors.white, alignSelf: 'center' },
    containerChart: { flexDirection: 'row' },
    textDate: { color: colors.white, alignSelf: 'center', marginTop: 10 },
    icon: { width: Width(3), height: Width(3), tintColor: 'red', marginLeft: 3 },
    line: { flexDirection: 'row', alignSelf: 'center' }
})
