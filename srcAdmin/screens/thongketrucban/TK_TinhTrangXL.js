import React, { useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import { colors } from '../../../styles'
import apis from '../../apis'
import Utils from '../../../app/Utils'
import { BarChart, Grid, PieChart } from 'react-native-svg-charts'
import { reSize, reText } from '../../../styles/size'
import InputRNCom from '../../../components/ComponentApps/InputRNCom'
import { Width } from '../../../styles/styles'
import DatePicker from 'react-native-datepicker';
import moment from 'moment'
import { Images } from '../../images'

const ComponentChonNgay = (props) => {
    const ref = useRef()
    const onPress = () => {
        ref.current.onPressDate();
    }
    return (<TouchableOpacity onPress={props.isEdit ? onPress : () => { }} style={{ width: '50%' }}>
        <View pointerEvents='none' style={{ width: '100%' }}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 5, width: '100%' }}
                styleBodyInput={{
                    borderColor: colors.colorGrayIcon, borderRadius: 3, borderWidth: 0.5,
                    minHeight: 40, alignItems: 'center', paddingVertical: 0, width: '100%'
                }}

                labelText={props.title}
                styleLabel={{ color: colors.colorGrayText, fontWeight: 'bold', fontSize: reText(14), }}
                sufix={
                    <View style={{ alignItems: 'center', flexDirection: 'row', }}>

                        <View style={{
                            height: 30, width: 30,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Image
                                // defaultSource={Images.icCalendar}
                                source={Images.icCalendar}
                                style={{ width: 15, height: 15 }} resizeMode='contain' />
                        </View>
                        <DatePicker
                            style={{ borderWidth: 0, width: '0%', }}
                            date={props.value}
                            mode="date"
                            disabled={false}
                            placeholder={props.placeholder}
                            format="DD/MM/YYYY"
                            confirmBtnText="Xác nhận"
                            cancelBtnText="Huỷ"
                            showIcon={false}
                            androidMode='spinner'
                            hideText={true}
                            locale='vi'
                            ref={ref}
                            customStyles={{
                                datePicker: {
                                    backgroundColor: '#d1d3d8',
                                    justifyContent: 'center',
                                },
                                dateInput: {
                                    paddingHorizontal: 5,
                                    borderWidth: 0,
                                    alignItems: 'flex-start',
                                }
                            }}
                            // hideText={true}

                            onDateChange={props.onChangTextIndex}
                        />
                    </View>
                }
                placeholder={props.placeholder}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_16}
                // errorText={'Ngày sinh  không hợp lệ'}
                // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                valid={true}
                value={props.value}
                onChangeText={props.onChangTextIndex}
            />
        </View>
    </TouchableOpacity>)
}
const objectFilter = {
    // tungay: '2020 - 01 - 03',
    // denngay: '2020 - 11 - 07',
    // linhvuc: '30',
    // iddonvi: '31000',
    // loaithongke: '1'
}
const TK_TinhTrangXL = (props) => {
    const [dataThongKe, setdataThongKe] = useState([])
    const [tungay, setTungay] = useState('')
    const [denngay, setdenngay] = useState('')



    useEffect(() => {

        getData();
    }, [tungay, denngay])

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        let body = {
            ...objectFilter,
            // tungay: '2020 - 01 - 03',
            // denngay: '2020 - 11 - 07',
            // linhvuc: '30',
            // iddonvi: '31000',
            // loaithongke: '1'
        }
        if (tungay) {
            body.tungay = moment(tungay, 'DD/MM/YYYY').format('YYYY-MM-DD')
        }
        if (denngay) {
            body.denngay = moment(denngay, 'DD/MM/YYYY').format('YYYY-MM-DD')
        }
        let res = await apis.ApiTKTrucBan.BieuDo_PhanAnhTheoTinhTrangXuLy(body);
        if (res.status == 1) {
            setdataThongKe(res.data)
        }
        else {
            setdataThongKe([])
        }
    }


    const onChangeTextIndex = (val, index) => {
        switch (index) {
            case 1: {
                if (denngay != '') {
                    let check = moment(denngay, 'DD/MM/YYYY').isAfter(moment(val, 'DD/MM/YYYY'));
                    if (check == true) {
                        setTungay(val)
                    } else {
                        Utils.showMsgBoxOK(props.nthis, "Thông báo", "Từ ngày phải nhỏ hơn đến ngày", "Xác nhận");
                        return;
                    }
                } else {
                    setTungay(val)
                }

                setTungay(val)
            } break;
            case 2: {
                if (tungay != '') {
                    let check = moment(tungay, 'DD/MM/YYYY').isBefore(moment(val, 'DD/MM/YYYY'));
                    if (check == true) {
                        setdenngay(val)
                    } else {
                        Utils.showMsgBoxOK(props.nthis, "Thông báo", "Đến ngày phải lớn hơn từ ngày", "Xác nhận");
                        return;
                    }
                } else {
                    setdenngay(val)
                }
            } break;
            default:
                break;
        }
    }

    const renderItem = (TypeFilter, title, data) => {
        return (
            <View>
                <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 15, }}
                    onPress={() => Utils.goscreen(props.nthis, 'Modal_ChiTietTKTT', { TypeFilter: TypeFilter, tungay: tungay ? tungay : '', denngay: denngay ? denngay : '' })}>
                    <Text style={{ width: Width(72.5), borderWidth: 0.5, paddingHorizontal: 10, paddingVertical: 10, textAlign: 'center', backgroundColor: colors.turquoiseBlue_10 }}>{title}</Text>
                    <Text style={{
                        width: Width(20), borderWidth: 0.5, paddingHorizontal: 10, paddingVertical: 10, textAlign: 'center', backgroundColor: colors.turquoiseBlue_10,
                        color: colors.redStar, fontWeight: 'bold'
                    }}>{data}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const renderItemChil = (TypeFilter, title, data) => {
        return (
            <View>
                <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: colors.turquoiseBlue_10 }}
                    onPress={() => Utils.goscreen(props.nthis, 'Modal_ChiTietTKTT', { TypeFilter: TypeFilter, tungay: tungay ? tungay : '', denngay: denngay ? denngay : '' })}>
                    <Text style={{ width: Width(52.5), borderWidth: 0.5, paddingHorizontal: 10, paddingVertical: 10, textAlign: 'center' }}>{title}</Text>
                    <Text style={{
                        width: Width(20), borderWidth: 0.5, paddingHorizontal: 10, paddingVertical: 10, textAlign: 'center',
                        color: colors.redStar, fontWeight: 'bold'
                    }}>{data}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.white, }}>
            <View style={{ paddingBottom: 10 }}>

                <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    width: '100%',
                }}>
                    <ComponentChonNgay value={tungay} title={`Từ ngày`}
                        placeholder={'Chọn từ ngày'}
                        onChangTextIndex={(val) => onChangeTextIndex(val, 1)}
                        isEdit={true} />
                    <ComponentChonNgay value={denngay} title={`Đến ngày`}
                        placeholder={'Chọn đến ngày'}
                        onChangTextIndex={(val) => onChangeTextIndex(val, 2)}
                        isEdit={true} />


                </View>
                <View >
                    <View style={{ flexDirection: 'row', marginHorizontal: 15, marginTop: 15, }}>
                        <Text style={{
                            width: Width(72.5), borderWidth: 0.5, paddingHorizontal: 10, paddingVertical: 10, fontSize: reText(14), fontWeight: 'bold',
                            textAlign: 'center', color: colors.white, backgroundColor: colors.peacockBlue
                        }}> Trạng thái xử lý</Text>
                        <Text style={{
                            width: Width(20), borderWidth: 0.5, paddingHorizontal: 10, paddingVertical: 10, fontSize: reText(14), fontWeight: 'bold',
                            textAlign: 'center', color: colors.white, backgroundColor: colors.peacockBlue
                        }}>Số lượng</Text>
                    </View>
                    <ScrollView style={{ paddingBottom: 10, }}>
                        {renderItem(1, 'Tổng số', dataThongKe.Tong ? dataThongKe.Tong : 0)}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: Width(20), marginLeft: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, backgroundColor: colors.turquoiseBlue_10 }}>
                                <Text >Đã xử lý</Text>
                            </View>
                            <View>
                                {renderItemChil(7, 'Tổng', dataThongKe.DaXuLy ? dataThongKe.DaXuLy : 0)}
                                {renderItemChil(4, 'Trong hạn', dataThongKe.TrongDaXuLy ? dataThongKe.TrongDaXuLy : 0)}
                                {renderItemChil(5, 'Quá hạn', dataThongKe.QuahanDaXuLy ? dataThongKe.QuahanDaXuLy : 0)}
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: Width(20), marginLeft: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, backgroundColor: colors.turquoiseBlue_10 }}>
                                <Text >Đang xử lý</Text>
                            </View>
                            <View>
                                {renderItemChil(6, 'Tổng', dataThongKe.DangXuLy ? dataThongKe.DangXuLy : 0)}
                                {renderItemChil(2, 'Trong hạn', dataThongKe.TrongHanXuLy ? dataThongKe.TrongHanXuLy : 0)}
                                {renderItemChil(3, 'Quá hạn', dataThongKe.QuaHanXuLy ? dataThongKe.QuaHanXuLy : 0)}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </View>

    )
}


export default TK_TinhTrangXL


