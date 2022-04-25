import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import Utils from '../../../app/Utils'
import { HeaderCus, IsLoading } from '../../../components'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Width } from '../../../styles/styles'
import apis from '../../apis'
import { Images } from '../../images'
import DAYS from './dataDay'
import NoiDungChinh from './NoiDungChinh'
import moment from 'moment'
import TongQuanSacThai from './TongQuanSacThai'
import NoiDungTieuTuc from './NoiDungTieuTuc'
import NguonTinMXH from './NguonTinMXH'
import NguonTinBaoChi from './NguonTinBaoChi'
import NoiDungTieuBieu from './NoiDungTieuBieu'

const index = (props) => {
    // const refLoading = useRef(null);
    const [dataTopic, setDataTopic] = useState([])
    const [selectedTopic, setSelectedTopic] = useState({
        "topic_id": 509850,
        "name": "Tất cả chủ đề",
        "parent_topic_id": null,
    })
    const [dataDays, setDataDays] = useState(DAYS)
    const [selectedDays, setSelectedDays] = useState({
        "topic_id": 1,
        "name": '7 ngày gần đây',
        "dateFrom": moment(moment().add(-6, 'days')).format('YYYY/MM/DD 00:00:00'),
        "dateTo": moment().format('YYYY/MM/DD 23:59:59')
    })
    const [isLoadding, setIsLoadding] = useState(true)

    useEffect(() => {
        getDataTopic()
    }, [])



    const getDataTopic = async () => {
        // refLoading.current.show()
        setIsLoadding(true)
        let res = await apis.ApiReputa.init()
        // Utils.nlog("DataTopic:", res)
        if (res && res.topics) {
            // refLoading.current.hide()
            setIsLoadding(false)
            res.topics.map(val => {
                if (val.parent_topic_id == null) {
                    val.name = 'Tất cả chủ đề'
                }
            })
            setDataTopic(res.topics)
        }
        else {
            // refLoading.current.hide()
            setIsLoadding(false)
            setDataTopic([])
        }
    }
    const openDropdownTopic = () => {
        Utils.goscreen({ props: props }, 'Modal_ComponentSelectProps', {
            callback: (val) => setSelectedTopic(val),
            item: selectedTopic,
            AllThaoTac: dataTopic, ViewItem: item => _viewItem(item, 'name'), Search: true, key: 'name'
        })
    }

    const _viewItem = (item, value) => {
        // Utils.nlog('Log [item]', item)
        return (
            <View key={item.topic_id} style={{
                flex: 1,
                paddingVertical: 15,
                borderBottomColor: colors.black_50,
            }}>
                <Text style={{ textAlign: 'center', color: colors.colorTextSelect }} >{item[value]}</Text>
            </View>
        )
    }

    const openDropdownDays = () => {
        Utils.goscreen({ props: props }, 'Modal_ComponentSelectProps', {
            callback: (val) => setSelectedDays(val),
            item: selectedDays,
            AllThaoTac: dataDays, ViewItem: item => _viewItem(item, 'name'), Search: true, key: 'name'
        })
    }

    // Utils.nlog("DU LIEU LAY RA DƯỢC:", selectedTopic, selectedDays)
    return (
        <View style={styles.container}>
            <HeaderCus
                Sleft={{ tintColor: 'white' }}
                onPressLeft={() => Utils.goscreen({ props: props }, 'ManHinh_Home')}
                iconLeft={Images.icBack}
                title={`Thông tin truyền thông`.toUpperCase()}
                styleTitle={{ color: colors.white }}
            />
            {isLoadding ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15 }}>
                    <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: reText(16), textAlign: 'center' }}>{'Đang xử lý dữ liệu,\nxin vui lòng đợi trong giây lát!'}</Text>
                </View>
                :
                <>
                    <View style={styles.topic}>
                        <View style={styles.ViewTopic}>
                            <Text style={styles.titleTopic}>Chủ đề</Text>
                            <TouchableOpacity onPress={openDropdownTopic} style={styles.dropdown}>
                                <Text numberOfLines={1} style={styles.TextTopic}>{selectedTopic.name}</Text>
                                <Image source={Images.icDropDown} style={styles.ImageTopic} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.ViewTopic}>
                            <Text style={styles.titleTopic}>Thời gian</Text>
                            <TouchableOpacity onPress={openDropdownDays} style={styles.dropdown}>
                                <Text numberOfLines={1} style={styles.TextTopic}>{selectedDays.name}</Text>
                                <Image source={Images.icDropDown} style={styles.ImageTopic} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView style={{}}>
                        <View style={styles.lineTitle} />
                        <NoiDungChinh idTopic={selectedTopic.topic_id} dateFrom={selectedDays.dateFrom} dateTo={selectedDays.dateTo} />
                        <View style={styles.lineTitle} />
                        <TongQuanSacThai idTopic={selectedTopic.topic_id} dateFrom={selectedDays.dateFrom} dateTo={selectedDays.dateTo} />
                        <View style={styles.lineTitle} />
                        <NoiDungTieuTuc idTopic={selectedTopic.topic_id} dateFrom={selectedDays.dateFrom} dateTo={selectedDays.dateTo} />
                        <View style={styles.lineTitle} />
                        <NguonTinMXH nthis={props} idTopic={selectedTopic.topic_id} dateFrom={selectedDays.dateFrom} dateTo={selectedDays.dateTo} />
                        <View style={styles.lineTitle} />
                        <NguonTinBaoChi nthis={props} idTopic={selectedTopic.topic_id} dateFrom={selectedDays.dateFrom} dateTo={selectedDays.dateTo} />
                        <View style={styles.lineTitle} />
                        <NoiDungTieuBieu nthis={props} idTopic={selectedTopic.topic_id} dateFrom={selectedDays.dateFrom} dateTo={selectedDays.dateTo} />
                        <View style={{ height: 100 }} />
                    </ScrollView>
                </>}
            {/* <IsLoading ref={refLoading} /> */}
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#323B44' },
    topic: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 5, marginTop: 10 },
    titleTopic: { fontSize: reText(12), marginBottom: 3, color: colors.white },
    dropdown: { flexDirection: 'row', backgroundColor: '#444F5C', paddingHorizontal: 5, paddingVertical: 10., borderRadius: 5 },
    TextTopic: { flex: 1, color: colors.white },
    ViewTopic: { width: Width(48) },
    ImageTopic: { width: Width(3), height: Width(1.6), alignSelf: 'center', tintColor: colors.white },
    lineTitle: { width: Width(100), height: 0.5, backgroundColor: colors.white, marginTop: 10 }
})
