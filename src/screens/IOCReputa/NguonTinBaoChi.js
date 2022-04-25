import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Utils from '../../../app/Utils'
import { IsLoading } from '../../../components'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Height, Width } from '../../../styles/styles'
import apis from '../../apis'

const NguonTinBaoChi = (props) => {
    const refLoading = useRef(null);
    //Các biến truyền từ props
    const idTopic = props.idTopic ? props.idTopic : ''
    const dateFrom = props.dateFrom ? props.dateFrom : ''
    const dateTo = props.dateTo ? props.dateTo : ''
    // 
    const [dataBaoChi, setDatabaoChi] = useState([])
    const [sumBaoChi, setSumBaoChi] = useState(0)
    useEffect(() => {
        getDataMXH()
    }, [])

    useEffect(() => {
        getDataMXH()
    }, [props])

    const getDataMXH = async () => {
        refLoading.current.show()
        let res = await apis.ApiReputa.getNguonBaoChi(idTopic, dateFrom, dateTo)
        if (res) {
            refLoading.current.hide()
            setDatabaoChi(res.hits)
            setSumBaoChi(res.total_count)
        }
        else {
            refLoading.current.hide()
            setDatabaoChi([])
            setSumBaoChi(0)
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.TitleTop}>{'TOP NGUỒN TIN ĐĂNG TẢI'}</Text>
            <Text style={styles.Title}>{'BÁO ĐIỆN TỬ, TRANG TIN NHẮC TỚI TẤT CẢ CHỦ ĐỀ'}</Text>

            <View style={{ width: Width(100), height: Height(5), flexDirection: 'row', backgroundColor: '#212529', marginTop: 10 }}>
                <View style={{ width: Width(60), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.text}>{'Báo, trang tin'}</Text>
                </View>
                <View style={{ height: '100%', width: 1, backgroundColor: colors.white }} />
                <View style={{ width: Width(40), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.text}>{'Số bài báo đề cập'}</Text>
                </View>
            </View>
            {dataBaoChi && dataBaoChi.map((item, index) => {
                return (
                    <View key={index} style={{ width: Width(100), height: Height(5), flexDirection: 'row', backgroundColor: colors.white, marginTop: 1 }}>
                        <TouchableOpacity onPress={() => Utils.openWeb({ props: props.nthis }, 'http://' + item.domain)} style={{ width: Width(60), justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.text, { color: '#42B0D8' }]}>{item.domain}</Text>
                        </TouchableOpacity>
                        <View style={{ height: '100%', width: 1, backgroundColor: '#212529' }} />

                        <View style={{ height: '100%', width: 1, backgroundColor: '#212529' }} />
                        <View style={{ width: Width(40), justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', }}>
                                <View style={{ backgroundColor: colors.black_30, paddingVertical: 5, height: Height(3), width: Width(10), borderRadius: 5, alignItems: 'center' }}>
                                    <Text style={[styles.text, { color: colors.white, fontWeight: 'bold' }]}>{item.count}</Text>
                                </View>
                                <View style={{ height: '100%', width: 1, backgroundColor: colors.black_20, marginHorizontal: 3, alignSelf: 'center' }} />
                                <View style={{ backgroundColor: '#C84847', paddingVertical: 5, width: Width(10), height: Height(3), borderRadius: 5, alignItems: 'center' }}>
                                    <Text style={[styles.text, { color: colors.white, fontWeight: 'bold' }]}>{parseInt(item.count / sumBaoChi * 100)}%</Text>
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

export default NguonTinBaoChi

const styles = StyleSheet.create({
    container: { marginTop: 10 },
    TitleTop: { fontSize: reText(12), alignSelf: 'center', textAlign: 'center', color: colors.white, marginBottom: 5 },
    Title: { fontSize: reText(15), alignSelf: 'center', textAlign: 'center', fontWeight: 'bold', color: colors.white },
    text: { color: colors.white }
})
