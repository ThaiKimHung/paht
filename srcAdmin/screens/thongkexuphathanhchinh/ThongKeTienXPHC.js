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
                placeholderTextColor={colors.black_30}
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

const dataLoaiDV = [
    {
        id: 1,
        Name: 'Đơn vị thi hành'
    },
    {
        id: 2,
        Name: 'Cấp có thẩm quyền quyết định xử phạt'

    }
]
const dataLoaiBD = [
    {
        id: 1,
        Name: "Biểu đồ tròn",
    },
    {
        id: 2,
        Name: "Biểu đồ cột",
    },
];
const objectFilter = {
    "sortOrder": "asc",
    "sortField": "",
    "page": 1,
    "record": 10,
    "OrderBy": "",
}
const ThongKeTienXPHC = (props) => {
    const [dataThongKe, setdataThongKe] = useState([])
    const [tungay, setTungay] = useState(moment(new Date()).add(-30, 'days').format('DD/MM/YYYY'))
    const [denngay, setdenngay] = useState(moment(new Date()).format('DD/MM/YYYY'))

    const [selectLoaiDV, setselectLoaiDV] = useState(dataLoaiDV[0])

    const [selectLoaiBD, setSelectLoaiBD] = useState(dataLoaiBD[0]);
    const [dataTienThongKe, setdataTienThongKe] = useState([]);

    const [dataDonVi, setdataDonVi] = useState([{ IdDonVi: 0, DonVi: 'Tất cả' }])
    const [selectDv, setselectDv] = useState({ MaPX: 0, TenPhuongXa: 'Tất cả' });
    const [dataCapXP, setdataCapXP] = useState([])
    const [selectCapXP, setselectCapXP] = useState({ IdThamQuyen: 0, TenCap: 'Tất cả' })

    // const GetList_DonVi = async () => {
    //     let body = {
    //         sortOrder: "desc",
    //         sortField: "CreatedDate",
    //         page: 1,
    //         record: 10,
    //         OrderBy: "CreatedDate",
    //         more: true,
    //         "filter.keys": "tungay|denngay|loaithongke",
    //         "filter.vals": tungay + "|" + denngay + "|" + selectLoaiDV.id
    //     }
    //     let res = await apis.ApiTKXPHC.GetList_ThongKeTienXPHC(body);
    //     Utils.nlog("gía trị don vị---<><><><><>555", res)
    //     if (res.status == 1) {
    //         setdataDonVi([{ IdDonVi: 0, DonVi: 'Tất cả' }].concat(res.data))
    //     }
    //     else {
    //         setdataDonVi([{ IdDonVi: 0, DonVi: 'Tất cả' }])
    //     }
    // }

    const GetList_DonVi = async () => {
        let res = await apis.ApiTKXPHC.GetList_DonVi();
        Utils.nlog("gía trị don vị----", res)
        if (res.status == 1) {
            setdataDonVi([{ MaPX: 0, TenPhuongXa: 'Tất cả' }].concat(res.data))
        }
    }

    const GetCapCoThamQuyenXuPhat = async () => {
        let res = await apis.ApiXuLyHanhChinh.GetList_CapThamQuyen()
        Utils.nlog('Cấp có thẩm quyền quyết định xử phạt,Cơ quan thi hành', res)
        if (res.status == 1 && res.data) {
            setdataCapXP([{ IdThamQuyen: 0, TenCap: 'Tất cả' }].concat(res.data))
        }
    }

    const getTienXuPhatTheoDonVi = async () => {
        const dayFrom = moment(tungay, "DD/MM/YYYY").format("YYYY-MM-DD");
        const dayTo = moment(denngay, "DD/MM/YYYY").format("YYYY-MM-DD");
        const ChooseLoaiTK = selectLoaiDV ? `${selectLoaiDV.id}` : "";
        const ChooseIdDV = selectLoaiDV.IdDonVi == 1 ? `${selectDv.MaPX}` : selectCapXP.IdThamQuyen
        let res = await apis.ApiTKXPHC.BieuDo_TienXuPhatTheoDonVi_Tron(
            dayFrom,
            dayTo,
            ChooseLoaiTK,
            ChooseIdDV
        );
        Utils.nlog("giá trị dâta-----=======---- tien - res", res);
        if (res.status == 1) {
            const { ChuaThiHanh, DaThiHanh, ThiHanh1Phan } = res.data;
            let data = [
                {
                    value: DaThiHanh,
                    svg: {
                        fill: colors.greenyBlue, // màu của biểu đồ
                        // onPress: () => alert(1),
                    },
                    key: `pie-${1}`,
                    name: "Đã thi hành",
                },
                {
                    value: ChuaThiHanh,
                    svg: {
                        fill: colors.yellowishOrange, // màu của biểu đồ
                        // onPress: () => alert(2),
                    },
                    key: `pie-${2}`,
                    name: "Chưa thi hành",
                },
                {
                    value: ThiHanh1Phan ? ThiHanh1Phan : 0,
                    svg: {
                        fill: colors.redStar, // màu của biểu đồ
                        // onPress: () => alert(2),
                    },
                    key: `pie-${3}`,
                    name: "Thi Hành 1 phần",
                },
            ];
            setdataTienThongKe(data);
        } else {
            let data = [
                {
                    value: 0,
                    svg: {
                        fill: colors.greenyBlue, // màu của biểu đồ
                        // onPress: () => alert(1),
                    },
                    key: `pie-${1}`,
                    name: "Đã thi hành",
                },
                {
                    value: 0,
                    svg: {
                        fill: colors.colorBlueLight, // màu của biểu đồ
                        // onPress: () => alert(2),
                    },
                    key: `pie-${2}`,
                    name: "Chưa thi hành",
                },
                {
                    value: 0,
                    svg: {
                        fill: colors.redStar, // màu của biểu đồ
                        // onPress: () => alert(3),
                    },
                    key: `pie-${3}`,
                    name: "Thi Hành 1 phần",
                },
            ];
            setdataTienThongKe(data);
        }
    };
    useEffect(() => {
        Utils.nlog('Gia tri dataaaa=====iten', dataTienThongKe)
        getTienXuPhatTheoDonVi();
        getData();
    }, [tungay, denngay, selectLoaiDV, selectLoaiDV.id == 1 ? selectDv : selectCapXP, selectLoaiDV, selectDv, selectLoaiBD]);
    const getData = async () => {
        Utils.nlog("><><><><><>", selectDv.MaPX)
        let body = {
            ...objectFilter,
            "filter.keys": `tungay|denngay|loaithongke|iddonvi`,
            "filter.vals": `${moment(tungay, 'DD/MM/YYYY').format('DD-MM-YYYY')}|${moment(denngay, 'DD/MM/YYYY').format('DD-MM-YYYY')}|${(selectLoaiDV && selectLoaiDV.id != 0) ? selectLoaiDV.id : ''}|${selectLoaiDV.id == 1 ? selectDv.MaPX : selectCapXP.IdThamQuyen}`,
        }
        Utils.nlog("giá trị body nè", body)
        let res = await apis.ApiTKXPHC.GetList_ThongKeTienXPHC(body);
        Utils.nlog("giá trị res nè", res)
        if (res.status == 1) {
            setdataThongKe(res.data)
        }
        else {
            setdataThongKe([])
        }
    }
    useEffect(() => {
        setselectDv({ MaPX: 0, TenPhuongXa: 'Tất cả' });
        GetList_DonVi();
        GetCapCoThamQuyenXuPhat();
    }, [selectLoaiDV])

    useEffect(() => {
        getData();
        getTienXuPhatTheoDonVi();
    }, [])

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
        // Utils.nlog("giá tị item", item)
        return (
            <View
                // key={item}
                style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    margin: 2,

                }}>
                <Text style={{ textAlign: 'center', paddingVertical: 10 }} >{item[key]}</Text>
            </View>
        )
    }
    //
    const _dropDown = (index) => {
        switch (index) {
            case 1:
                {
                    Utils.goscreen(props.nthis, ConfigScreenDH.Modal_ComponentSelectProps, {
                        callback: (val) => onChangeTextIndex(val, 3), item: selectLoaiDV,
                        title: 'Danh sách loại đơn vị',
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
                        title: "Danh sách loại biểu đồ",
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
                        title: 'Danh sách đơn vị',
                        AllThaoTac: dataDonVi,
                        ViewItem: (item) => _viewItem(item, "TenPhuongXa"), Search: true, key: 'TenPhuongXa'
                    })
                }
                break;
            case 5:
                {
                    Utils.goscreen(props.nthis, ConfigScreenDH.Modal_ComponentSelectProps, {
                        callback: (val) => onChangeTextIndex(val, 7), item: selectCapXP,
                        title: 'Danh sách cấp có thẩm quyền',
                        AllThaoTac: dataCapXP,
                        ViewItem: (item) => _viewItem(item, "TenCap"), Search: true, key: 'TenCap'
                    })
                }
                break;
            default:
                break;
        }

    }
    const renderItem = ({ item, index }) => {
        const { DonVi,
            IdDonVi,
            TongTien_DaThiHanh,
            TongTien_ChuaThiHanh,
            TongTien_ThiHanhMotPhan,
            Tong,
        } = item
        return (
            <TouchableOpacity style={{
                minHeight: 40, marginVertical: 1, backgroundColor: 'white',
                width: '100%', flexDirection: 'row', paddingHorizontal: 10, flex: 1
            }} onPress={() => Utils.goscreen(props.nthis, 'sc_ThongKeTienXPHC_ChiTiet', {
                tungay: tungay, denngay: denngay, loaithongke: selectLoaiDV.id, iddonvi: IdDonVi
            })}>
                <View style={[styles.row, { flex: 1 }]}>
                    <Text style={{

                    }}>{index}</Text>
                </View>
                <View style={[styles.row, { flex: 3 }]}>
                    <Text style={{
                        fontSize: reText(10),
                        color: colors.redStar, paddingHorizontal: 5
                    }}>{DonVi}</Text>
                </View>
                <View style={[styles.rowTien, { flex: 6, paddingVertical: 3 }]}>
                    <View style={{ flexDirection: 'row', marginHorizontal: 5, marginBottom: 2 }}>
                        <Text style={{
                            fontSize: reText(10),
                        }}>Tổng tiền đã thi hành : <Text style={{ color: colors.redStar, fontSize: reText(11), }}> {TongTien_DaThiHanh}</Text></Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: 5, marginBottom: 2 }}>
                        <Text style={{
                            fontSize: reText(10),
                        }}>Tổng tiền chưa thi hành :<Text style={{ color: colors.redStar, fontSize: reText(11), }}> {TongTien_ChuaThiHanh}</Text></Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: 5, marginBottom: 2 }}>
                        <Text style={{
                            fontSize: reText(10),
                        }}>Tổng tiền thi hành 1 phần :<Text style={{ color: colors.redStar, fontSize: reText(11), }}> {TongTien_ThiHanhMotPhan}</Text></Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                        <Text style={{
                            fontSize: reText(10),
                        }}>Tổng : <Text style={{ color: colors.redStar, fontSize: reText(11), }}> {Tong}</Text></Text>
                    </View>
                </View>

            </TouchableOpacity>
        )
    }
    const renderHeader = () => {

        let DonVi = 'Đơn vị',
            tien = 'Tiền xử phạt';
        // Utils.nlog("<><><><>Log", selectDv)
        return (
            <View>
                <View style={{
                    paddingBottom: 10,
                    borderWidth: 0.5,
                    marginHorizontal: 10,
                    borderRadius: 10,
                    marginBottom: 5,
                    borderColor: colors.colorBlueLight,
                }}>

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
                    {/* <ComponentLinhVuc title={'Loại đơn vị thống kê'} placeholder={'Chọn loại đơn vị'} value={selectLoaiDV?.Name} onPress={() => _dropDown(1)} isEdit={true} />
                    <ComponentLinhVuc title={'Tên đơn vị'} placeholder={'Chọn đơn vị'} value={selectDv?.DonVi} onPress={() => _dropDown(2)} isEdit={true} /> */}

                    <ComponentLinhVuc title={'Loại đơn vị thống kê'} placeholder={'Chọn loại đơn vị'} value={selectLoaiDV?.Name} onPress={() => _dropDown(1)} isEdit={true} />
                    {selectLoaiDV.id == 0 ? null :
                        selectLoaiDV.id == 1 ?
                            <ComponentLinhVuc title={'Tên đơn vị'} placeholder={'Chọn đơn vị'} value={selectDv?.TenPhuongXa} onPress={() => _dropDown(4)} isEdit={true} />
                            :
                            <ComponentLinhVuc title={'Tên cấp có thẩm quyền'} placeholder={'Chọn cấp có thẩm quyền'} value={selectCapXP?.TenCap} onPress={() => _dropDown(5)} isEdit={true} />
                    }
                </View>
                <View style={{
                    minHeight: 40, marginVertical: 1, backgroundColor: 'white',
                    width: '100%', flexDirection: 'row', paddingHorizontal: 10
                }}>
                    <View style={[styles.row, { flex: 1 }]}>
                        <Text style={{
                            fontSize: reText(10),
                            fontWeight: 'bold', textAlign: 'center'
                        }}>{'Stt'}</Text>
                    </View>
                    <View style={[styles.row, { flex: 3 }]}>
                        <Text style={{
                            fontSize: reText(10),
                            fontWeight: 'bold', textAlign: 'center'
                        }}>{DonVi}</Text>
                    </View>
                    <View style={[styles.row, { flex: 6 }]}>
                        <Text style={{
                            fontSize: reText(10),
                            fontWeight: 'bold', textAlign: 'center'
                        }}>{tien}</Text>
                    </View>



                </View>
            </View>)
    }
    const CUT_OFF = 20;
    // const Labels = ({ x, y, bandwidth, data }) =>
    //     dataTienThongKe.map((item, index) => {
    //         return (
    //             <TextSVG
    //                 key={index}
    //                 x={x(index) + bandwidth / 2}
    //                 y={item.value < CUT_OFF ? y(item.value) - 10 : y(item.value) - 10}
    //                 fontSize={14}
    //                 fill={colors.colorBlue}
    //                 alignmentBaseline={"middle"}
    //                 textAnchor={"middle"}
    //             >
    //                 {item.value && item.value > 0 ? Utils.inputMoney(item.value) : ""}
    //             </TextSVG>
    //         );
    //     });
    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.white, }}>

            <FlatList
                data={dataThongKe}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
            >
            </FlatList>

        </ScrollView>

    )
}



export default ThongKeTienXPHC


const styles = StyleSheet.create({
    row: {
        flex: 1, borderWidth: 0.5, borderColor: colors.peacockBlue,
        alignItems: 'center', justifyContent: 'center'
    },
    rowTien: {
        flex: 1, borderWidth: 0.5, borderColor: colors.peacockBlue,

    }
})
