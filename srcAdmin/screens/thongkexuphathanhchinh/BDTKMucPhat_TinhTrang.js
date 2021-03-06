import React, { useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ScrollView, Platform, Dimensions } from 'react-native'
import { colors } from '../../../styles'
import apis from '../../apis'
import Utils from '../../../app/Utils'
import { BarChart, Grid, PieChart, XAxis, YAxis } from 'react-native-svg-charts'
import { reSize, reText } from '../../../styles/size'
import InputRNCom from '../../../components/ComponentApps/InputRNCom'
import { Width } from '../../../styles/styles'
import DatePicker from 'react-native-datepicker';
import moment from 'moment'
import { Images } from '../../images'
import { Text as TextSVG } from 'react-native-svg'
import { isIphoneX } from 'react-native-iphone-x-helper'
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
                placeholderTextColor={colors.black_30}
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

const dataLoaiDV = [
    {
        id: 1,
        Name: '????n v??? thi h??nh'
    },
    {
        id: 2,
        Name: 'C???p c?? th???m quy???n quy???t ?????nh x??? ph???t'

    }
]
const dataLoaiBD = [
    {
        id: 1,
        Name: "Bi???u ????? tr??n",
    },
    {
        id: 2,
        Name: "Bi???u ????? c???t",
    },
];
const objectFilter = {
    "sortOrder": "asc",
    "sortField": "",
    "page": 1,
    "record": 10,
    "OrderBy": "",
}
const DataChart = [
    { name: 'Ch??a thi h??nh', fill: '#ECEDEF' },
    { name: '???? thi h??nh', fill: '#8AC8F1' },
    { name: 'Thi h??nh m???t ph???n', fill: '#FEE1A9' },
]
const BDTKMucPhat_TinhTrang = (props) => {
    const [numMax, setNumMax] = useState(0)
    const [tungay, setTungay] = useState('')
    const [denngay, setdenngay] = useState('')
    const [selectLoaiDV, setselectLoaiDV] = useState(dataLoaiDV[0])
    const [selectLoaiBD, setSelectLoaiBD] = useState(dataLoaiBD[0]);
    const [dataTienThongKe, setdataTienThongKe] = useState([]);
    const [dataTienThongKe_cot, setdataTienThongKe_Cot] = useState([]);
    const [dataDonVi, setdataDonVi] = useState([{ IdDonVi: 0, DonVi: 'T???t c???' }])
    const [selectDv, setselectDv] = useState({ MaPX: 0, TenPhuongXa: 'T???t c???' });
    const [dataCapXP, setdataCapXP] = useState([])
    const [selectCapXP, setselectCapXP] = useState({ IdThamQuyen: 0, TenCap: 'T???t c???' })

    const GetList_DonVi = async () => {
        let res = await apis.ApiTKXPHC.GetList_DonVi();
        // Utils.nlog("g??a tr??? don v???----", res)
        if (res.status == 1) {
            setdataDonVi([{ MaPX: 0, TenPhuongXa: 'T???t c???' }].concat(res.data))
        }
    }
    const GetCapCoThamQuyenXuPhat = async () => {
        let res = await apis.ApiXuLyHanhChinh.GetList_CapThamQuyen()
        // Utils.nlog('C???p c?? th???m quy???n quy???t ?????nh x??? ph???t,C?? quan thi h??nh', res)
        if (res.status == 1 && res.data) {
            setdataCapXP([{ IdThamQuyen: 0, TenCap: 'T???t c???' }].concat(res.data))
        }
    }
    const getTienXuPhatTheoDonVi_tron = async () => {
        const dayFrom = tungay ? moment(tungay, "DD/MM/YYYY").format("YYYY-MM-DD") : '';
        const dayTo = denngay ? moment(denngay, "DD/MM/YYYY").format("YYYY-MM-DD") : '';
        const ChooseLoaiTK = selectLoaiDV ? `${selectLoaiDV.id}` : "";
        const ChooseIdDV = selectDv.MaPX ? selectDv.MaPX : selectCapXP.IdThamQuyen
        let res = await apis.ApiTKXPHC.BieuDo_TienXuPhatTheoDonVi_Tron(
            dayFrom,
            dayTo,
            ChooseLoaiTK,
            ChooseIdDV
        )
        if (res.status == 1) {
            const { ChuaThiHanh, DaThiHanh, ThiHanh1Phan } = res.data;

            var data = [
                {
                    value: DaThiHanh,
                    svg: {
                        fill: colors.greenyBlue, // m??u c???a bi???u ?????
                        onPress: () => Utils.goscreen(props.nthis, 'DanhSachCTChung', {
                            Key: 4, Type: 2, tungay: tungay, denngay: denngay, donvi: selectLoaiDV.id == 1 ? selectDv.MaPX : selectCapXP.IdThamQuyen, loaithongke: selectLoaiDV.id
                        }),
                    },
                    key: `pie-${1}`,
                    name: "???? thi h??nh",
                },
                {
                    value: ChuaThiHanh,
                    svg: {
                        fill: colors.yellowishOrange, // m??u c???a bi???u ?????
                        onPress: () => Utils.goscreen(props.nthis, 'DanhSachCTChung', {
                            Key: 4, Type: 1, tungay: tungay, denngay: denngay, donvi: selectLoaiDV.id == 1 ? selectDv.MaPX : selectCapXP.IdThamQuyen, loaithongke: selectLoaiDV.id
                        }),
                    },
                    key: `pie-${2}`,
                    name: "Ch??a thi h??nh",
                },
                {
                    value: ThiHanh1Phan ? ThiHanh1Phan : 0,
                    svg: {
                        fill: colors.redStar, // m??u c???a bi???u ?????
                        onPress: () => Utils.goscreen(props.nthis, 'DanhSachCTChung', {
                            Key: 4, Type: 3, tungay: tungay, denngay: denngay, donvi: selectLoaiDV.id == 1 ? selectDv.MaPX : selectCapXP.IdThamQuyen, loaithongke: selectLoaiDV.id
                        }),
                    },
                    key: `pie-${3}`,
                    name: "Thi H??nh 1 ph???n",
                },
            ]
            setdataTienThongKe(data);
        } else {
            setdataTienThongKe([]);
        }
    };

    const getTienXuPhatTheoDonVi_cot = async () => {
        const dayFrom = tungay ? moment(tungay, "DD/MM/YYYY").format("YYYY-MM-DD") : '';
        const dayTo = denngay ? moment(denngay, "DD/MM/YYYY").format("YYYY-MM-DD") : '';
        const ChooseLoaiTK = selectLoaiDV ? `${selectLoaiDV.id}` : "";
        const ChooseIdDV = selectDv.MaPX ? selectDv.MaPX : selectCapXP.IdThamQuyen
        let res = await apis.ApiTKXPHC.BieuDo_TienXuPhatTheoDonVi_Cot(
            dayFrom,
            dayTo,
            ChooseLoaiTK,
            ChooseIdDV
        );
        if (res.status == 1) {
            var data = res.data ?
                res.data.map((value, index) => {
                    return [
                        {
                            value: value.TongTien_ChuaThiHanh,
                            TenDonVi: value.TenPhuongXa,
                            svg: {
                                fill: '#ECEDEF',
                                onPress: () => Utils.goscreen(props.nthis, 'DanhSachCTChung', {
                                    Key: 5, Type: 1, tungay: tungay, denngay: denngay, donvi: value.MaPX, loaithongke: selectLoaiDV.id
                                }),
                            },
                            key: `pie-1`,
                        },
                        {
                            value: value.TongTien_DaThiHanh,
                            TenDonVi: value.TenPhuongXa,
                            svg: {
                                fill: '#8AC8F1',
                                onPress: () => Utils.goscreen(props.nthis, 'DanhSachCTChung', {
                                    Key: 5, Type: 2, tungay: tungay, denngay: denngay, donvi: value.MaPX, loaithongke: selectLoaiDV.id
                                }),
                            },
                            key: `pie-2`,
                        },
                        {
                            value: value.TongTien_ThiHanh1Phan,
                            TenDonVi: value.TenPhuongXa,
                            svg: {
                                fill: '#FEE1A9',
                                onPress: () => Utils.goscreen(props.nthis, 'DanhSachCTChung', {
                                    Key: 5, Type: 3, tungay: tungay, denngay: denngay, donvi: value.MaPX, loaithongke: selectLoaiDV.id
                                }),
                            },
                            key: `pie-3`,
                        }
                    ]
                })
                : []
            setdataTienThongKe_Cot(data);
        } else {
            setdataTienThongKe_Cot([]);
        }
    };
    useEffect(() => {
        getTienXuPhatTheoDonVi_cot();
        getTienXuPhatTheoDonVi_tron();
    }, [tungay, denngay, selectLoaiDV, selectLoaiDV.id == 1 ? selectDv : selectCapXP, selectLoaiDV, selectDv, selectLoaiBD]);

    useEffect(() => {
        numberMax();
    }, [dataTienThongKe_cot])

    useEffect(() => {
        setselectDv({ MaPX: 0, TenPhuongXa: 'T???t c???' });
        GetList_DonVi();
        GetCapCoThamQuyenXuPhat();
    }, [selectLoaiDV])

    useEffect(() => {
        getTienXuPhatTheoDonVi_tron();
        getTienXuPhatTheoDonVi_cot();
    }, [])

    const onChangeTextIndex = (val, index) => {
        switch (index) {
            case 1: {
                if (denngay != '') {
                    let check = moment(denngay, 'DD/MM/YYYY').isAfter(moment(val, 'DD/MM/YYYY'));
                    if (check == true) {
                        setTungay(val)
                    } else {
                        Utils.showMsgBoxOK(props.nthis, "Th??ng b??o", "T??? ng??y ph???i nh??? h??n ?????n ng??y", "X??c nh???n");
                        return;
                    }
                } else {
                    setTungay(val)
                }
            } break;
            case 2: {

                if (tungay != '') {
                    let check = moment(tungay, 'DD/MM/YYYY').isBefore(moment(val, 'DD/MM/YYYY'));
                    if (check == true) {
                        setdenngay(val)
                    } else {
                        Utils.showMsgBoxOK(props.nthis, "Th??ng b??o", "?????n ng??y ph???i l???n h??n t??? ng??y", "X??c nh???n");
                        return;
                    }
                } else {
                    setdenngay(val)
                }
            } break;
            case 3: {
                setselectLoaiDV(val)
            } break;

            case 5:
                {
                    setSelectLoaiBD(val);
                }
                break;
            case 6: {
                setselectDv(val)
            } break;
            case 7: {
                setselectCapXP(val)
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
                        callback: (val) => onChangeTextIndex(val, 3), item: selectLoaiDV,
                        title: 'Danh s??ch lo???i ????n v???',
                        AllThaoTac: dataLoaiDV,
                        ViewItem: (item) => _viewItem(item, "Name"), Search: true, key: 'Name'
                    })
                }
                break;

            case 3:
                {
                    Utils.goscreen(props.nthis, ConfigScreenDH.Modal_ComponentSelectProps, {
                        callback: (val) => onChangeTextIndex(val, 5),
                        item: selectLoaiBD,
                        title: "Danh s??ch lo???i bi???u ?????",
                        AllThaoTac: dataLoaiBD,
                        ViewItem: (item) => _viewItem(item, "Name"),
                        Search: false,
                        key: "Name",
                    });
                }
                break;
            case 4:
                {
                    Utils.goscreen(props.nthis, ConfigScreenDH.Modal_ComponentSelectProps, {
                        callback: (val) => onChangeTextIndex(val, 6), item: setselectDv,
                        title: 'Danh s??ch ????n v???',
                        AllThaoTac: dataDonVi,
                        ViewItem: (item) => _viewItem(item, "TenPhuongXa"), Search: true, key: 'TenPhuongXa'
                    })
                }
                break;
            case 5:
                {
                    Utils.goscreen(props.nthis, ConfigScreenDH.Modal_ComponentSelectProps, {
                        callback: (val) => onChangeTextIndex(val, 7), item: selectCapXP,
                        title: 'Danh s??ch c???p c?? th???m quy???n',
                        AllThaoTac: dataCapXP,
                        ViewItem: (item) => _viewItem(item, "TenCap"), Search: true, key: 'TenCap'
                    })
                }
                break;
            default:
                break;
        }

    }
    const renderHeader = () => {

        return (
            <View>
                <View style={{
                    paddingBottom: 10, marginHorizontal: 0, borderRadius: 10, marginBottom: 5,
                }}>
                    <ComponentLinhVuc
                        title={"Lo???i bi???u ?????"}
                        placeholder={"Ch???n ????n v???"}
                        value={selectLoaiBD.Name}
                        onPress={() => _dropDown(3)}
                        isEdit={true}
                    />
                    <View style={{
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                        width: '100%',
                    }}>

                        <ComponentChonNgay value={tungay} title={`T??? ng??y`}
                            placeholder={'Ch???n t??? ng??y'}
                            onChangTextIndex={(val) => onChangeTextIndex(val, 1)}
                            isEdit={true} />
                        <ComponentChonNgay value={denngay} title={`?????n ng??y`}
                            placeholder={'Ch???n ?????n ng??y'}
                            onChangTextIndex={(val) => onChangeTextIndex(val, 2)}
                            isEdit={true} />
                    </View>
                    <ComponentLinhVuc title={'Lo???i ????n v??? th???ng k??'} placeholder={'Ch???n lo???i ????n v???'} value={selectLoaiDV?.Name} onPress={() => _dropDown(1)} isEdit={true} />
                    {selectLoaiDV.id == 0 ? null :
                        selectLoaiDV.id == 1 ?
                            <ComponentLinhVuc title={'T??n ????n v???'} placeholder={'Ch???n ????n v???'} value={selectDv?.TenPhuongXa} onPress={() => _dropDown(4)} isEdit={true} />
                            :
                            <ComponentLinhVuc title={'T??n c???p c?? th???m quy???n'} placeholder={'Ch???n c???p c?? th???m quy???n'} value={selectCapXP?.TenCap} onPress={() => _dropDown(5)} isEdit={true} />
                    }

                </View>
            </View>)
    }
    const CUT_OFF = 20;
    const Labels_cot = ({ x, y, bandwidth, data }) => {
        return data.map((value, index) => {
            return (
                <TextSVG
                    key={index}
                    x={x(index) + (bandwidth / 2)}
                    y={y(value.value) - 10}
                    fontSize={10}
                    fill={'black'}
                    alignmentBaseline={'middle'}
                    textAnchor={'middle'}
                >
                    {value.value}
                </TextSVG>
            )
        })
    }
    const numberMax = () => {
        var max = 0;
        for (let index = 0; index < dataTienThongKe_cot.length; index++) {
            for (let i = 0; i < dataTienThongKe_cot[index].length; i++) {
                if (dataTienThongKe_cot[index][i].value > max)
                    max = dataTienThongKe_cot[index][i].value
            }
        }
        setNumMax(max)
        // console.log("----------------------------dataTienThongKe.length", dataTienThongKe)
        console.log("S?? mac l??n nhat", max)
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.white, }}>

            {
                selectLoaiBD.id == 1 ? (
                    <View
                        style={{
                            backgroundColor: colors.white,
                            flexDirection: "row",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingHorizontal: 10,
                            marginBottom: 20,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <PieChart
                                style={{ height: 200 }}
                                data={dataTienThongKe}
                                innerRadius={"0%"}
                                outerRadius={"100%"}
                            />
                        </View>
                        <View
                            style={{
                                paddingHorizontal: 10,
                                flex: 1,
                                justifyContent: "center",
                                height: 200,
                            }}
                        >
                            {dataTienThongKe.map((item, index) => {
                                return (
                                    <View
                                        key={`pie-${index}`}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            paddingVertical: 10,
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: reSize(15),
                                                height: reSize(15),
                                                borderRadius: 10,
                                                backgroundColor: item.svg.fill,
                                            }}
                                        />
                                        <Text
                                            style={{ paddingHorizontal: 5, color: colors.black }}
                                        >{`${item.name} (${Utils.inputMoney(item.value)})`}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                ) : (
                        <>
                            <View style={{
                                height: 300,
                                flexDirection: 'row',
                                paddingHorizontal: 10
                            }}>

                                <YAxis
                                    data={[0, numMax]}
                                    // key={}
                                    formatLabel={(value, i) => `${value}`}
                                    contentInset={{ top: 30, bottom: 10 }}
                                    svg={{
                                        fill: 'grey',
                                        fontSize: 10,
                                    }}
                                    numberOfTicks={5}
                                />
                                <ScrollView horizontal={true} style={{ flexDirection: 'row', flex: 1, }}>
                                    {
                                        dataTienThongKe_cot.map((value, index) => {
                                            return (
                                                <View key={index} style={{ flex: 1, flexDirection: 'row' }}>
                                                    <BarChart style={{ height: '100%', width: 150 }}
                                                        yMin={0}
                                                        yMax={numMax}
                                                        data={dataTienThongKe_cot[index]}
                                                        formatLabel={"Bi???u ????? nh??"}
                                                        yAccessor={({ item }) => item.value}

                                                        contentInset={{ top: 30, bottom: 10 }}
                                                        gridMin={0}
                                                    >
                                                        <Grid direction={Grid.Direction.HORIZONTAL} />
                                                        <Labels_cot />
                                                    </BarChart>
                                                    <Text style={{
                                                        position: 'absolute', top: 120, left: -15, fontSize: 16, width: 200, color: colors.colorGrayIcon, transform: [{
                                                            rotate: '310deg',
                                                        }]
                                                    }}>
                                                        {value[0].TenDonVi}
                                                    </Text>
                                                    <View style={{ height: '90%', width: 1, backgroundColor: colors.black_20, marginTop: 30 }}></View>
                                                </View>
                                            )
                                        })
                                    }
                                </ScrollView>
                            </View>
                            <FlatList
                                data={DataChart}
                                style={{ marginTop: 20 }}
                                numColumns={3}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => {
                                    return (<View style={{ flex: 1, marginHorizontal: 5, minHeight: 40, paddingVertical: 2 }}>
                                        <View style={{ height: 10, width: 50, backgroundColor: item.fill }}></View>
                                        <Text style={{ color: 'black', fontSize: reText(12), paddingVertical: 2 }}>{item.name}</Text></View>)
                                }}>

                            </FlatList>
                        </>
                    )

            }
            {
                renderHeader()
            }
        </ScrollView >

    )
}



export default BDTKMucPhat_TinhTrang


const styles = StyleSheet.create({
    row: {
        flex: 1, borderWidth: 0.5, borderColor: colors.peacockBlue,
        alignItems: 'center', justifyContent: 'center'
    },
    rowTien: {
        flex: 1, borderWidth: 0.5, borderColor: colors.peacockBlue,

    }
})
