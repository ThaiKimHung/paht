import React, { useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import { colors } from '../../../styles'
import apis from '../../apis'
import Utils from '../../../app/Utils'
import { BarChart, Grid, PieChart } from 'react-native-svg-charts'
import { reSize, reText } from '../../../styles/size'
import InputRNCom from '../../../components/ComponentApps/InputRNCom'
import { Height, Width } from '../../../styles/styles'
import DatePicker from 'react-native-datepicker';
import moment from 'moment'
import { Images } from '../../images'
import { IsLoading } from '../../../components'

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
//
const ComponentLinhVuc = (props) => {
    return (<TouchableOpacity onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 15, marginTop: 5, }}
                styleBodyInput={{
                    borderColor: colors.colorGrayIcon, borderRadius: 3, borderWidth: 0.5,
                    minHeight: 40, alignItems: 'center', paddingVertical: 0,
                }}
                labelText={props.title}
                styleLabel={{ color: colors.colorGrayText, fontWeight: 'bold', fontSize: reText(14), }}
                // sufixlabel={<View>
                //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                // </View>}
                placeholder={props.placeholder}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_20}
                // errorText={'Tôn giáo không hợp lệ'}
                // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                editable={false}
                valid={true}
                prefix={null}
                value={props.value}
                onChangeText={props.onChangTextIndex}
                sufix={
                    <View style={{
                        height: 30, width: 30,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Image
                            // defaultSource={Images.icDropDown}
                            source={Images.icDropDown}
                            style={{ width: 15, height: 15 }} resizeMode='contain' />
                    </View>
                }

            />
        </View>

    </TouchableOpacity>)
}
const objectFilter = {
    sortOrder: "asc",
    sortField: "id",
    page: 1,
    record: 10,
    OrderBy: "id",
    more: false,
}
const BDXPTheoThoiHan = (props) => {
    const refLoading = useRef(null);
    const [dataThongKe, setdataThongKe] = useState([])
    const [tungay, setTungay] = useState('')
    const [denngay, setdenngay] = useState('')
    useEffect(() => {
        getData();
    }, [tungay, denngay])
    const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)
    const getData = async () => {
        refLoading.current.show();
        let body = {
            ...objectFilter,
            "filter.keys": "tungay|denngay",
            "filter.vals": `${tungay == '' ? '' : moment(tungay, 'DD-MM-YYYY').format('YYYY-MM-DD')}|${denngay == '' ? '' : moment(denngay, 'DD-MM-YYYY').format('YYYY-MM-DD')}`
        }
        let res = await apis.ApiTKTrucBan.GetList_DanhSachDonViPhanAnhQuaHan(body);
        refLoading.current.hide();
        if (res.status == 1 && res.data) {
            const pieData = res.data.map((item, index) => ({
                svg: {
                    fill: randomColor(),
                    onPress: () => Utils.goscreen(props.nthis, 'scThongKeQuaHan_ChiTiet', { tungay: tungay, denngay: denngay, iddonvi: item.IdDVXL }),
                },
                key: `pie-${index}`,
                ...item,
                value: item.SoLuong
            }))
            setdataThongKe(pieData)
        }
        else {
            setdataThongKe([])
        }
    }
    useEffect(() => {
        getData();
    }, [])

    const onChangeTextIndex = (val, index) => {
        switch (index) {
            case 4: {
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
            case 5: {
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
    return (
        <View style={{ flex: 1, backgroundColor: colors.white, }}>
            <View style={{
                backgroundColor: colors.white,
                flexDirection: 'row', width: '100%',
                alignItems: 'center', justifyContent: 'center',
                paddingHorizontal: 10
            }}>
                <View style={{ flex: 1 }}>
                    <PieChart style={{ height: 200 }} data={dataThongKe} innerRadius={'0%'} outerRadius={'100%'} />
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        paddingHorizontal: 10, flex: 1,
                        height: Height(30),
                    }}>
                    {dataThongKe.map((item, index) => {
                        return (
                            <View key={`pie-${index}`} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                                <View style={{ width: reSize(15), height: reSize(15), borderRadius: 10, backgroundColor: item.svg.fill }} />
                                <Text style={{ paddingHorizontal: 5, color: colors.black }}>{`${item.TenPhuongXa} (${item.value})`}</Text>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
            <View style={{ paddingBottom: 10 }}>

                <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    width: '100%',
                }}>
                    <ComponentChonNgay value={tungay} title={`Từ ngày`}
                        placeholder={'Chọn từ ngày'}
                        onChangTextIndex={(val) => onChangeTextIndex(val, 4)}
                        isEdit={true} />
                    <ComponentChonNgay value={denngay} title={`Đến ngày`}
                        placeholder={'Chọn đến ngày'}
                        onChangTextIndex={(val) => onChangeTextIndex(val, 5)}
                        isEdit={true} />
                </View>
            </View>
            <IsLoading ref={refLoading}></IsLoading>
        </View>
    )
}
export default BDXPTheoThoiHan
