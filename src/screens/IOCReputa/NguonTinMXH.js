import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Utils from '../../../app/Utils'
import { IsLoading } from '../../../components'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Height, Width } from '../../../styles/styles'
import apis from '../../apis'

const NguonTinMXH = (props) => {
    const refLoading = useRef(null);
    //Các biến truyền từ props
    const idTopic = props.idTopic ? props.idTopic : ''
    const dateFrom = props.dateFrom ? props.dateFrom : ''
    const dateTo = props.dateTo ? props.dateTo : ''
    // 
    const [dataMXH, setDataMXH] = useState([])
    const [sumMXH, setSumMXH] = useState(0)
    useEffect(() => {
        getDataMXH()
    }, [])

    useEffect(() => {
        getDataMXH()
    }, [props])

    const getDataMXH = async () => {
        refLoading.current.show()
        let res = await apis.ApiReputa.getNguonMXH(idTopic, dateFrom, dateTo)
        if (res) {
            refLoading.current.hide()
            setDataMXH(res.hits)
            setSumMXH(res.total_interaction)
        }
        else {
            refLoading.current.hide()
            setDataMXH([])
            setSumMXH(0)
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.TitleTop}>{'TOP NGUỒN TIN CÓ TƯƠNG TÁC CAO'}</Text>
            <Text style={styles.Title}>{'NHẮC TỚI TẤT CẢ CHỦ ĐỀ TRÊN MẠNG XÃ HỘ'}</Text>

            <View style={{ width: Width(100), height: Height(5), flexDirection: 'row', backgroundColor: '#212529', marginTop: 10 }}>
                <View style={{ width: Width(55), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.text}>{'Facebook Profile & Page'}</Text>
                </View>
                <View style={{ height: '100%', width: 1, backgroundColor: colors.white }} />
                <View style={{ width: Width(15), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.text}>{'Số bài\nđăng'}</Text>
                </View>
                <View style={{ height: '100%', width: 1, backgroundColor: colors.white }} />
                <View style={{ width: Width(30), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.text}>{'Lượng\ntương tác'}</Text>
                </View>
            </View>
            {dataMXH?.map((item, index) => {
                Utils.nlog("HOANGNE:", item)
                return (
                    <View key={index} style={{ width: Width(100), height: Height(5), flexDirection: 'row', backgroundColor: colors.white, marginTop: 1 }}>
                        <TouchableOpacity onPress={() => Utils.openWeb({ props: props.nthis }, 'https://www.facebook.com/' + item.id)} style={{ width: Width(55), justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.text, { color: '#42B0D8' }]}>{item.name}</Text>
                        </TouchableOpacity>
                        <View style={{ height: '100%', width: 1, backgroundColor: '#212529' }} />
                        <View style={{ width: Width(15), justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#1BB19D', width: Width(5), height: Width(5), borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[styles.text, { color: colors.white, fontWeight: 'bold' }]}>{item.post_count}</Text>
                            </View>
                        </View>
                        <View style={{ height: '100%', width: 1, backgroundColor: '#212529' }} />
                        <View style={{ width: Width(30), justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', }}>
                                <View style={{ backgroundColor: colors.black_30, paddingVertical: 5, width: Width(10), borderRadius: 5, alignItems: 'center' }}>
                                    <Text style={[styles.text, { color: colors.white, fontWeight: 'bold' }]}>{item.interaction_count}</Text>
                                </View>
                                <View style={{ height: '100%', width: 1, backgroundColor: colors.black_20, marginHorizontal: 3, alignSelf: 'center' }} />
                                <View style={{ backgroundColor: '#C84847', paddingVertical: 5, width: Width(10), borderRadius: 5, alignItems: 'center' }}>
                                    <Text style={[styles.text, { color: colors.white, fontWeight: 'bold' }]}>{parseInt(item.interaction_count / sumMXH * 100)}%</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )
            })}
            <IsLoading ref={refLoading} />
        </View>
    )
}

export default NguonTinMXH

const styles = StyleSheet.create({
    container: { marginTop: 10 },
    TitleTop: { fontSize: reText(12), alignSelf: 'center', textAlign: 'center', color: colors.white, marginBottom: 5 },
    Title: { fontSize: reText(15), alignSelf: 'center', textAlign: 'center', fontWeight: 'bold', color: colors.white },
    text: { color: colors.white }
})
