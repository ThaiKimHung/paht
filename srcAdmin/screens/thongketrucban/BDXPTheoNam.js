import React, { useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { colors } from '../../../styles'
import apis from '../../apis'
import Utils from '../../../app/Utils'

import { BarChart, Grid, XAxis, LineChart, YAxis, PieChart } from 'react-native-svg-charts'
import { Text as TextSVG } from 'react-native-svg'
import { reSize, reText } from '../../../styles/size'
import InputRNCom from '../../../components/ComponentApps/InputRNCom'
import { Width } from '../../../styles/styles'
import DatePicker from 'react-native-datepicker';
import moment from 'moment'
import { Images } from '../../images'
import { IsLoading } from '../../../components'
import { ConfigScreenDH } from '../../routers/screen'

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
                            confirmBtnText="X??c nh???n"
                            cancelBtnText="Hu???"
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
                // errorText={'Ng??y sinh  kh??ng h???p l???'}
                // helpText={'S??? ??i???n tho???i ph???i t???i thi???u 9 ch??? s???'}
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
                // errorText={'T??n gi??o kh??ng h???p l???'}
                // helpText={'S??? ??i???n tho???i ph???i t???i thi???u 9 ch??? s???'}
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

const dataLoaiBD = [
    {
        id: 1,
        Name: 'Bi???u ????? tr??n'
    },
    {
        id: 2,
        Name: 'Bi???u ????? c???t'

    }
]
const objectFilter = {
    // Year: 2020
}
const BDXPTheoNam = (props) => {
    const [dataThongKe, setdataThongKe] = useState([])
    const refLoading = useRef(null);
    const [selectLoaiBD, setSelectLoaiBD] = useState(dataLoaiBD[0])
    const [dataYear, setdataYear] = useState([])
    const [selectYear, setselectYear] = useState('')
    const getAllYear = async () => {
        let res = await apis.ApiTKXPHC.GetAllYear();
        if (res.status == 1) {
            setdataYear(res.data)
            setselectYear(res.data[0])
        }
    }

    useEffect(() => {
        getData();
    }, [selectYear])

    const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)
    const getData = async () => {
        refLoading.current.show();
        let Year = selectYear && selectYear.Nam ? selectYear.Nam : moment(new Date()).format('YYYY')
        let res = await apis.ApiTKTrucBan.BieuDo_PhanAnhTheoThang(Year);
        refLoading.current.hide();
        if (res.status == 1) {
            const pieData = res.data.map((item, index) => ({
                svg: {
                    fill: randomColor(),
                    onPress: () => console.log('press', index),
                },
                key: `pie-${index}`,
                ...item,
                value: item.SoLuong
            }))
            setdataThongKe(pieData)
        }
    }
    useEffect(() => {
        getAllYear();
        getData();

    }, [])

    const onChangeTextIndex = (val, index) => {
        switch (index) {
            case 1: {
                setselectYear(val)

            } break;
            case 2: {
                setSelectLoaiBD(val)

            } break;

            default:
                break;
        }
    }
    const _viewItem = (item, key) => {

        return (
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    margin: 2,

                }}>
                <Text style={{ textAlign: 'center', paddingVertical: 10 }} >{item[key]}</Text>
            </View>
        )
    }
    const _dropDown = (index) => {
        switch (index) {
            case 1:
                {
                    Utils.goscreen(props.nthis, ConfigScreenDH.Modal_ComponentSelectProps, {
                        callback: (val) => onChangeTextIndex(val, 1), item: selectYear,
                        title: 'Danh s??ch n??m',
                        AllThaoTac: dataYear,
                        ViewItem: (item) => _viewItem(item, 'Nam'), Search: false, key: 'Nam'
                    })
                }
                break;
            case 2:
                {
                    Utils.goscreen(props.nthis, ConfigScreenDH.Modal_ComponentSelectProps, {
                        callback: (val) => onChangeTextIndex(val, 2), item: selectLoaiBD,
                        title: 'Danh s??ch lo???i bi???u ?????',
                        AllThaoTac: dataLoaiBD,
                        ViewItem: (item) => _viewItem(item, "Name"), Search: false, key: 'Name'
                    })
                }
                break;

            default:
                break;
        }

    }
    const CUT_OFF = 20
    const Labels = ({ x, y, bandwidth, data }) => (
        dataThongKe.map((item, index) => {
            return (<TextSVG
                key={index}
                x={x(index) + (bandwidth / 2)}

                y={item.value < CUT_OFF ? y(item.value) - 10 : y(item.value) - 10}
                fontSize={14}
                fill={colors.pumpkinOrange}
                alignmentBaseline={'middle'}
                textAnchor={'middle'}
            >
                {item.value && item.value > 0 ? item.value : ''}
            </TextSVG>)


        }))
    return (
        <View style={{ flex: 1, backgroundColor: colors.white, }}>
            {
                selectLoaiBD.id == 1 ? <View style={{
                    backgroundColor: colors.white,
                    flexDirection: 'row', width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center', paddingHorizontal: 10
                }}>
                    <View style={{ flex: 1 }}>
                        <PieChart style={{ height: 200 }} data={dataThongKe} innerRadius={'0%'} outerRadius={'100%'} />

                    </View>
                    <View style={{
                        paddingHorizontal: 10, flex: 1,
                        flexWrap: 'wrap', flexDirection: 'row'
                    }}>
                        {dataThongKe.map((item, index) => {
                            return (
                                <View key={`pie-${index}`} style={{
                                    flexDirection: 'row',
                                    paddingVertical: 10, flexWrap: 'wrap',
                                }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <View style={{
                                            width: reSize(15), height: reSize(15),
                                            borderRadius: 10, backgroundColor: item.svg.fill
                                        }} />
                                        <Text style={{ paddingHorizontal: 5, color: colors.black, fontSize: 10 }}>
                                            {`Th??ng ${item.thang}(`}<Text style={{ color: colors.redStar }}>{item.value}</Text>{')'}</Text>
                                    </View>

                                </View>
                            )
                        })}
                    </View>
                </View> : <View style={{ paddingHorizontal: 5 }}>
                        <View style={{
                            minHeight: 200,
                            flexDirection: 'row',

                        }}>

                            <YAxis
                                data={dataThongKe && dataThongKe.map(item => item.value)}
                                formatLabel={(value, i) => `${value}`}
                                contentInset={{ top: 30, bottom: 10 }}
                                svg={{
                                    fill: 'grey',
                                    fontSize: 10,
                                }}
                                numberOfTicks={10}
                            />
                            <BarChart style={{ flex: 1, height: '100%', }} data={dataThongKe}
                                formatLabel={"Bi???u ????? nh??"}
                                yAccessor={({ item }) => item.value}
                                // svg={{ fill }}
                                contentInset={{ top: 30, bottom: 10 }}>
                                <Grid />
                                <Labels />
                            </BarChart>

                        </View>

                        <XAxis
                            data={dataThongKe}
                            formatLabel={(value, index) => `${dataThongKe[index].thang}`}
                            contentInset={{ left: 20, right: 10 }}
                            svg={{ fontSize: 10, fill: 'black' }}
                        />
                    </View>
            }
            <View style={{ paddingBottom: 10 }}>
                <ComponentLinhVuc title={'N??m'} placeholder={'Ch???n n??m'} value={selectYear ? selectYear.Nam.toString() : ''} onPress={() => _dropDown(1)} isEdit={true} />
                <ComponentLinhVuc title={'Lo???i bi???u d???'} placeholder={'Ch???n ????n v???'} value={selectLoaiBD.Name} onPress={() => _dropDown(2)} isEdit={true} />
            </View>
            <IsLoading ref={refLoading}></IsLoading>
        </View>

    )
}
export default BDXPTheoNam