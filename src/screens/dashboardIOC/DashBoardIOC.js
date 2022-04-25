import React, { useState, useEffect, Component } from 'react'
import { Text, View, SafeAreaView, FlatList, TouchableOpacity, Modal, Image, ScrollView, StyleSheet } from 'react-native'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import Utils from '../../../app/Utils'
import index from '../../../chat/RoomChat/ActionImae'
import { HeaderCus, IsLoading } from '../../../components'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Width } from '../../../styles/styles'
import apis from '../../apis'
import { Images } from '../../images'
import moment from 'moment'
import UtilsApp from '../../../app/UtilsApp'

const DashboardIOC = (props) => {

    const [selectDate, setselectDate] = useState(new Date())
    const [year, setYear] = useState('2021')
    const [month, setMonth] = useState('04')
    const [departments, setDepartments] = useState([])
    const [selectCoQuan, setSelectCoQuan] = useState({
        "maloaicoquan": "",
        "macoquan": "",
        "tencoquan": "Tất cả cơ quan"
    })
    const [statistics, setStatistics] = useState([])
    //phần này tổng hợp
    const [tong, setTong] = useState(0)
    const [tukidau, setTukidau] = useState(0)
    const [tructiep, setTructiep] = useState(0)
    const [online, setOnline] = useState(0)
    //phần này đã giải quyết
    const [dagq_tong, setDagq_tong] = useState(0)
    const [dagq_truochan, setDagq_truochan] = useState(0)
    const [dagq_tronghan, setDagq_tronghan] = useState(0)
    const [dagq_quahan, setDagq_quahan] = useState(0)
    //Phần này đang giải quyết
    const [danggq_tong, setDanggq_tong] = useState(0)
    const [danggq_tronghan, setDanggq_tronghang] = useState(0)
    const [danggq_quahan, setDanggq_quahan] = useState(0)
    //Max
    const [max_dagq, setMax_dagq] = useState(0)
    const [max_danggq, setMax_danggq] = useState(0)

    const [check_dgq, setCheck_dgq] = useState(true)
    const [check_danggq, setCheck_danggq] = useState(true)
    useEffect(() => {
        _getDepartments()
        _getStatistics()
        _ValueTotal()
    }, [])

    useEffect(() => {
        _getStatistics()
    }, [selectCoQuan, selectDate])

    useEffect(() => {
        _ValueTotal()
    }, [statistics])

    const _getDepartments = async () => {
        let res = await apis.ApiDashBoardIOC.departments();
        if (res.status == 1) {
            setDepartments([{
                "maloaicoquan": "",
                "macoquan": "",
                "tencoquan": "Tất cả cơ quan"
            }, ...res.data])
        }
        else {
            setDepartments([])
        }
    }

    const _getStatistics = async () => {
        nthisIsLoading.show();
        let res = await apis.ApiDashBoardIOC.statistics(moment(selectDate, 'MM/YYYY').format('YYYY') + moment(selectDate, 'MM/YYYY').format('MM'), selectCoQuan.macoquan != "" ? selectCoQuan.macoquan : '')
        if (res.status == 1) {
            nthisIsLoading.hide();
            setStatistics(res.data)
        }
        else {
            nthisIsLoading.hide();
            setStatistics([])
        }
    }

    const DataChart = statistics ? statistics.map((value, index) => (
        {
            ...value,
            w: value.dagq_truochan / max_dagq * 100,
            w1: value.dagq_dunghan / max_dagq * 100,
            w2: value.dagq_quahan / max_dagq * 100,
            w_: value.danggq_tronghan / max_danggq * 100,
            w1_: value.danggq_quahan / max_danggq * 100
        }
    )) : []


    // console.log("---DATA", DataChart)
    const _callbackCoQuan = (val) => {
        //setState
        setSelectCoQuan(val)
    }

    const _viewItemCoQuan = (item, key, value) => {
        return (
            <View
                key={item[key]}
                style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    margin: 2,

                }}>
                <Text style={{ textAlign: 'center', paddingVertical: 10 }} >{item[value]}</Text>
            </View>
        )
    }

    const _dropDownDeparments = () => {
        Utils.goscreen({ props: props }, 'Modal_ComponentSelectProps', {
            callback: (val) => _callbackCoQuan(val), item: selectCoQuan,
            title: 'Tất cả cơ quan',
            AllThaoTac: departments, ViewItem: (item) => _viewItemCoQuan(item, 'macoquan', 'tencoquan'), Search: true, key: 'tencoquan'
        })
    }

    const _ValueTotal = () => {
        let tn_tong = 0
        let tn_dauky = 0
        let tn_tructiep = 0
        let tn_online = 0
        //
        let dagq_tong = 0
        let dagq_truochan = 0
        let dagq_dunghan = 0
        let dagq_quahan = 0
        //
        let danggq_tong = 0
        let danggq_tronghan = 0
        let danggq_quahan = 0
        let max_dagq = 0
        let max_danggq = 0
        statistics.map(data => {
            // console.log("----------data:", data)
            //phần này tổng hợp
            tn_tong += parseInt(data.tn_tong)
            tn_dauky += parseInt(data.tn_dauky)
            tn_tructiep += parseInt(data.tn_tructiep)
            tn_online += parseInt(data.tn_online)
            //Phần này đã giải quyết
            dagq_tong += parseInt(data.dagq_tong)
            dagq_truochan += parseInt(data.dagq_truochan)
            dagq_dunghan += parseInt(data.dagq_dunghan)
            dagq_quahan += parseInt(data.dagq_quahan)
            //Phần này đang giải quyết
            danggq_tong += parseInt(data.danggq_tong)
            danggq_tronghan += parseInt(data.danggq_tronghan)
            danggq_quahan += parseInt(data.danggq_quahan)

            if ((parseInt(data.dagq_truochan) + parseInt(data.dagq_dunghan) + parseInt(data.dagq_quahan)) > max_dagq) {
                max_dagq = parseInt(data.dagq_truochan) + parseInt(data.dagq_dunghan) + parseInt(data.dagq_quahan)
            }
            if ((parseInt(data.danggq_tronghan) + parseInt(data.danggq_quahan)) > max_danggq) {
                max_danggq = parseInt(data.danggq_tronghan) + parseInt(data.danggq_quahan)
            }
        })
        setTong(tn_tong)
        setTukidau(tn_dauky)
        setTructiep(tn_tructiep)
        setOnline(tn_online)
        setDagq_tong(dagq_tong)
        setDagq_truochan(dagq_truochan)
        setDagq_tronghan(dagq_dunghan)
        setDagq_quahan(dagq_quahan)
        setDanggq_tong(danggq_tong)
        setDanggq_tronghang(danggq_tronghan)
        setDanggq_quahan(danggq_quahan)
        setMax_dagq(max_dagq)
        setMax_danggq(max_danggq)
    }

    const _Check_DGQ = () => {
        setCheck_dgq(!check_dgq)
    }
    const _Check_DangGQ = () => {
        setCheck_danggq(!check_danggq)
    }
    const _info = (value) => {
        Utils.showMsgBoxOK({ props: props }, 'Thông báo', `Số lượng hồ sơ là: ${value}`, 'Xác nhận')
    }
    //
    const callbackTuThang = (date) => {
        setselectDate(date)
    }

    const chooseTime = () => {
        Utils.goscreen({ props: props }, 'Modal_MonthYear',
            {
                callback: callbackTuThang,
                DateInput: selectDate,
            })
    }
    console.log("-----------setselectDate:", moment(selectDate, 'MM/YYYY').format('YYYY') + moment(selectDate, 'MM/YYYY').format('MM'))
    return (

        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <HeaderCus
                title={UtilsApp.getScreenTitle("ManHinh_DashBoardDVC", 'DỊCH VỤ CÔNG')}
                styleTitle={{ color: colors.white }}
                iconLeft={Images.icBack}
                onPressLeft={() => { Utils.goscreen({ props: props }, 'ManHinh_Home') }}
            />
            <ScrollView style={{ marginBottom: 10 }}>
                <View style={{ marginTop: 5, marginHorizontal: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        onPress={() => _dropDownDeparments()}
                        style={styles.touch}>
                        <Text numberOfLines={1} style={{ fontSize: reText(14), fontWeight: '500', }}>{selectCoQuan.tencoquan}</Text>
                        <Image source={Images.icDropDown} style={{ width: 10, height: 6 }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => chooseTime()}
                        style={[styles.touch, { width: Width(40) }]}>
                        <Text numberOfLines={1} style={{ fontSize: reText(14), fontWeight: '500' }}>{moment(selectDate, 'MM/YYYY').format('MM/YYYY')}</Text>
                        <Image source={Images.icDropDown} style={{ width: 10, height: 6 }} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginHorizontal: 10 }}>
                    <View style={styles.item}>
                        <Image source={Images.ChartIOC} style={styles.img} />
                        <Text style={styles.title}>Tổng: {tong}</Text>
                    </View>
                    <View style={styles.item}>
                        <Image source={Images.ChartUp} style={styles.img} />
                        <Text style={styles.title}>Từ kì đầu: {tukidau}</Text>
                    </View>
                    <View style={styles.item}>
                        <Image source={Images.BattayIOC} style={styles.img} />
                        <Text style={styles.title}>Trực tiếp: {tructiep}</Text>
                    </View>
                    <View style={styles.item}>
                        <Image source={Images.InternetIOC} style={styles.img} />
                        <Text style={styles.title}>Online: {online}</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.line}></View>
                    <TouchableOpacity
                        onPress={() => _Check_DGQ()}
                        style={{
                            flexDirection: "row", marginVertical: 5, alignSelf: 'center', paddingHorizontal: 15, paddingVertical: 4,
                            borderRadius: 5,
                        }}>
                        <Text style={{ fontSize: reText(16), fontWeight: '400', color: colors.colorKellyGreen }}>Hồ sơ đã giải quyết</Text>
                        <Image source={check_dgq ? Images.icDropDown : Images.icNext} style={{ width: check_dgq ? 9 : 7, height: check_dgq ? 7 : 10, alignSelf: 'center', marginLeft: 5, tintColor: colors.colorKellyGreen }} />
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                        <View style={[styles.itemChil, { backgroundColor: colors.colorKellyGreen }]}>
                            <Text style={{ fontSize: reText(12), color: colors.white, fontWeight: 'bold' }}>Tổng</Text>
                            <Text style={{ fontSize: reText(12), color: colors.white, fontWeight: 'bold' }}>{dagq_tong}</Text>
                        </View>
                        <View style={[styles.itemChil, { backgroundColor: colors.waterBlue }]}>
                            <Text style={styles.text}>Trước hạn</Text>
                            <Text style={styles.text}>{dagq_truochan}</Text>
                        </View>
                        <View style={[styles.itemChil, { backgroundColor: colors.yellowishOrange }]}>
                            <Text style={styles.text}>Trong hạn</Text>
                            <Text style={styles.text}>{dagq_tronghan}</Text>
                        </View>
                        <View style={[styles.itemChil, { backgroundColor: colors.redpink }]}>
                            <Text style={styles.text}>Quá hạn</Text>
                            <Text style={styles.text}>{dagq_quahan}</Text>
                        </View>
                    </View>
                </View>
                {/* Phần render biểu đồ đã giải quyết */}
                {check_dgq ?
                    DataChart.map((value, index) => {
                        // console.log("------Value:", value)
                        return (
                            <View key={index} style={{ width: Width(96), marginHorizontal: Width(2), marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                                    <Text numberOfLines={1} style={{ fontSize: reText(13), fontStyle: 'italic', color: colors.black_60, width: Width(60) }}>{value.tencqdv}</Text>
                                    <Text numberOfLines={1} style={{ fontSize: reText(12), fontStyle: 'italic', color: colors.black_30, width: Width(36), textAlign: 'right' }}>
                                        (
                                        <Text style={{ color: colors.waterBlue }}>{value.dagq_truochan}</Text>
                                        <Text> / </Text>
                                        <Text style={{ color: colors.yellowishOrange }}>{value.dagq_dunghan}</Text>
                                        <Text> / </Text>
                                        <Text style={{ color: colors.redpink }}>{value.dagq_quahan}</Text>
                                        )
                                    </Text>
                                </View>
                                <View style={{ width: Width(96), height: Width(2), backgroundColor: colors.black_11, flexDirection: 'row', borderRadius: 4 }}>
                                    <TouchableOpacity
                                        onPress={() => _info(value.dagq_truochan)}
                                        style={{ height: Width(2), width: `${value.w}%`, backgroundColor: colors.waterBlue, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}>

                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => _info(value.dagq_dunghan)}
                                        style={{ height: Width(2), width: `${value.w1}%`, backgroundColor: colors.yellowishOrange }}>

                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => _info(value.dagq_quahan)}
                                        style={{ height: Width(2), width: `${value.w2}%`, backgroundColor: colors.redpink, borderBottomRightRadius: 4, borderTopRightRadius: 4 }}>

                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })
                    : null}
                < View >
                    <View style={styles.line}></View>
                    <TouchableOpacity
                        onPress={() => _Check_DangGQ()}
                        style={{
                            flexDirection: "row", marginVertical: 5, alignSelf: 'center', paddingHorizontal: 15, paddingVertical: 4,
                            borderRadius: 5,
                        }}>
                        <Text style={{ fontSize: reText(16), fontWeight: '400', color: colors.yellowishOrange }}>Hồ sơ đang giải quyết</Text>
                        <Image source={check_danggq ? Images.icDropDown : Images.icNext} style={{ width: check_danggq ? 9 : 7, height: check_danggq ? 7 : 10, alignSelf: 'center', marginLeft: 5, tintColor: colors.yellowishOrange }} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                        <View style={[styles.itemChil, { backgroundColor: colors.colorKellyGreen }]}>
                            <Text style={styles.text}>Tổng</Text>
                            <Text style={styles.text}>{danggq_tong}</Text>
                        </View>
                        <View style={[styles.itemChil, { backgroundColor: colors.yellowishOrange }]}>
                            <Text style={styles.text}>Trong hạn</Text>
                            <Text style={styles.text}>{danggq_tronghan}</Text>
                        </View>
                        <View style={[styles.itemChil, { backgroundColor: colors.redpink }]}>
                            <Text style={styles.text}>Quá hạn</Text>
                            <Text style={styles.text}>{danggq_quahan}</Text>
                        </View>
                    </View>
                </View>
                {check_danggq ?
                    DataChart.map((value, index) => {
                        // console.log("------Value:", value)
                        return (
                            <View key={index} style={{ width: Width(96), marginHorizontal: Width(2), marginTop: 10, }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                                    <Text numberOfLines={1} style={{ fontSize: reText(13), fontStyle: 'italic', color: colors.black_60, width: Width(60) }}>{value.tencqdv}</Text>
                                    <Text numberOfLines={1} style={{ fontSize: reText(12), fontStyle: 'italic', color: colors.black_30, width: Width(36), textAlign: 'right' }}>
                                        (
                                        <Text style={{ color: colors.yellowishOrange }}>{value.danggq_tronghan}</Text>
                                        <Text> / </Text>
                                        <Text style={{ color: colors.redpink }}>{value.danggq_quahan}</Text>
                                        )
                                    </Text>
                                </View>
                                <View style={{ width: Width(96), height: Width(2), backgroundColor: colors.black_11, flexDirection: 'row', borderRadius: 4 }}>
                                    <TouchableOpacity
                                        onPress={() => _info(value.danggq_tronghan)}
                                        style={{ height: Width(2), width: `${value.w_}%`, backgroundColor: colors.yellowishOrange, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}>

                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => _info(value.danggq_quahan)}
                                        style={{ height: Width(2), width: `${value.w1_}%`, backgroundColor: colors.redpink, borderBottomRightRadius: 4, borderTopRightRadius: 4 }}>

                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }) : null
                }
                <View style={{ marginBottom: 20 }} />
            </ScrollView>
            <IsLoading />
        </View >

    );

}

const styles = StyleSheet.create({
    item: { backgroundColor: colors.black_11, width: Width(23), paddingVertical: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 3 },
    img: { width: Width(6), height: Width(6), marginBottom: 5, tintColor: colors.colorChuyenMuc },
    title: { fontSize: reText(10), fontWeight: 'bold', color: colors.colorChuyenMuc },
    touch: {
        height: Width(10), width: Width(55), backgroundColor: colors.black_11, flexDirection: 'row', justifyContent: 'space-between',
        paddingHorizontal: 10, alignItems: 'center', borderRadius: 5
    },
    itemChil: { width: Width(22), height: Width(10), justifyContent: 'center', alignItems: 'center', borderRadius: 5 },
    text: { fontSize: reText(12), color: colors.white, fontWeight: 'bold' },
    line: { height: 1, width: '100%', backgroundColor: colors.darkTwo, marginTop: 10 }
})

export default DashboardIOC
