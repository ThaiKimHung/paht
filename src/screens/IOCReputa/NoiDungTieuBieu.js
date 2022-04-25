import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native'
import Utils from '../../../app/Utils'
import { IsLoading, ListEmpty } from '../../../components'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Height, Width } from '../../../styles/styles'
import apis from '../../apis'
import moment from 'moment'
import HtmlViewCom from '../../../components/HtmlView'
const NoiDungTieuBieu = (props) => {
    const refLoading = useRef(null);
    //Các biến truyền từ props
    const idTopic = props.idTopic ? props.idTopic : ''
    const dateFrom = props.dateFrom ? props.dateFrom : ''
    const dateTo = props.dateTo ? props.dateTo : ''
    //active
    const [type, setType] = useState(1)
    //data
    const [dataNews, setDataNews] = useState([])
    const [dataMXH, setDataMXH] = useState([])
    useEffect(() => {
        getNoiDungTieuBieuBaoChi()
        getNoiDungTieuBieuMXH()
    }, [])

    useEffect(() => {
        getNoiDungTieuBieuBaoChi()
        getNoiDungTieuBieuMXH()
    }, [props])

    const getNoiDungTieuBieuBaoChi = async () => {
        refLoading.current.show()
        let res = await apis.ApiReputa.getReputaNews(1, idTopic, dateFrom, dateTo)
        Utils.nlog("NDTB BAO CHI:", res)
        if (res) {
            refLoading.current.hide()
            setDataNews(res.hits)
        }
        else {
            refLoading.current.hide()
            setDataNews([])
        }
    }

    const getNoiDungTieuBieuMXH = async () => {
        refLoading.current.show()
        let res = await apis.ApiReputa.getReputaNews(2, idTopic, dateFrom, dateTo)
        Utils.nlog("NDTB MXH:", res)
        if (res) {
            refLoading.current.hide()
            setDataMXH(res.hits)
        }
        else {
            refLoading.current.hide()
            setDataMXH([])
        }
    }

    const ActiveType = (id) => {
        setType(id)
    }
    const _renderItem = ({ item, index }) => {
        // Utils.nlog("IMG:", item.image_sources)
        return (
            <TouchableOpacity key={index} onPress={() => Utils.openWeb({ props: props.nthis }, item.url)} style={{ backgroundColor: colors.white, width: Width(85), marginRight: 5, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 5 }}>
                <Text numberOfLines={2} style={{ color: '#4EB4DA', fontSize: reText(16), height: Height(5), fontWeight: 'bold' }}>{item.title}</Text>
                <Text style={{ color: colors.black_60, fontSize: reText(12), marginTop: 5, marginBottom: 5 }}>{moment(item.created_time).format("DD/MM/YYYY HH:mm:ss")}</Text>
                <View style={{ flexDirection: 'row', width: Width(80), height: Width(30) }}>
                    {item.image_sources ?
                        <View style={{ width: Width(25), height: Width(25) }}>
                            <Image source={{ uri: item.image_sources ? item.image_sources[0] ? item.image_sources[0] : null : null }} style={{ width: Width(24), height: Width(24) }} resizeMode='cover' />
                        </View> : null}
                    <View style={{ width: item.image_sources ? Width(55) : Width(80), height: Width(30) }}>
                        <HtmlViewCom html={item.content ? item.content : '<div></div>'} style={{}} />
                    </View>
                </View>
                <Text style={{ fontSize: reText(12), color: colors.black_60 }}>{item.domain}</Text>
            </TouchableOpacity>
        )

    }
    const _renderItemMXH = ({ item, index }) => {
        // Utils.nlog("IMG:", item.image_sources)
        return (
            <TouchableOpacity key={index} onPress={() => Utils.openWeb({ props: props.nthis }, item.url)} style={{ backgroundColor: colors.white, width: Width(85), marginRight: 5, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 5 }}>
                <Text numberOfLines={1} style={{ color: '#4EB4DA', fontSize: reText(16), fontWeight: 'bold' }}>{item.title}</Text>
                <Text style={{ color: colors.black_60, fontSize: reText(12), marginTop: 5, marginBottom: 5 }}>{moment(item.created_time).format("DD/MM/YYYY HH:mm:ss")}</Text>
                <View style={{ flexDirection: 'row', width: Width(80), height: Width(30) }}>
                    <View style={{ width: Width(80), height: Width(30) }}>
                        <HtmlViewCom html={item.content ? item.content : '<div></div>'} style={{}} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.textFB}>Like: <Text style={styles.textChild}>{item.like_count}</Text></Text>
                    <Text style={styles.textFB}>Comment: <Text style={styles.textChild}>{item.comment_count}</Text></Text>
                    <Text style={styles.textFB}>Share: <Text style={styles.textChild}>{item.share_count}</Text></Text>
                </View>
            </TouchableOpacity>
        )

    }
    return (
        <View style={styles.container}>
            <Text style={styles.Title}>{'NỘI DUNG TIÊU BIỂU'}</Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity onPress={() => ActiveType(1)} style={{ backgroundColor: type == 1 ? '#495561' : null, paddingVertical: 10, width: Width(40), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: type == 1 ? colors.white : '#495561', fontSize: reText(14), fontWeight: 'bold' }}>Trên các trang tin</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => ActiveType(2)} style={{ backgroundColor: type == 2 ? '#495561' : null, paddingVertical: 10, width: Width(40), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: type == 2 ? colors.white : '#495561', fontSize: reText(14), fontWeight: 'bold' }}>Trên mạng xã hội</Text>
                </TouchableOpacity>
            </View>
            <View style={{ width: Width(100), height: 0.5, backgroundColor: colors.white, marginBottom: 10 }} />
            {
                type == 1 ?
                    <FlatList
                        horizontal={true}
                        style={{ paddingHorizontal: Width(2) }}
                        data={dataNews}
                        renderItem={_renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={<Text style={{ color: colors.white }}>{'Không có dữ liệu'}</Text>}
                    />
                    :
                    <FlatList
                        horizontal={true}
                        style={{ paddingHorizontal: Width(2) }}
                        data={dataMXH}
                        renderItem={_renderItemMXH}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={<Text style={{ color: colors.white }}>{'Không có dữ liệu'}</Text>}
                    />
            }

            <IsLoading ref={refLoading} />
        </View >
    )
}

export default NoiDungTieuBieu

const styles = StyleSheet.create({
    container: { marginTop: 10 },
    Title: { fontSize: reText(15), alignSelf: 'center', textAlign: 'center', fontWeight: 'bold', color: colors.white },
    textFB: { fontSize: reText(14), color: '#4EB4DA', marginRight: 5 },
    textChild: { color: colors.black_50 }
})
