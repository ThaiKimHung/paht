import React, { useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
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

const dataLoaiDV = [
    {
        id: 0,
        Name: 'T???t c???'
    },
    {
        id: 1,
        Name: '????n v??? thi h??nh'
    },
    {
        id: 2,
        Name: 'C???p c?? th???m quy???n quy???t ?????nh x??? ph???t'

    }
]
const objectFilter = {
    // linhvuc: 31
    // iddonvi: 30999
    // loaithongke: 1
}
const BDXPTheoThoiHan = (props) => {
    const [dataThongKe, setdataThongKe] = useState([])
    const [tungay, setTungay] = useState('')
    const [denngay, setdenngay] = useState('')

    const [dataLinhVuc, setdataLinhVuc] = useState([])
    const [dataDonVi, setdataDonVi] = useState([])
    const [selectLv, setselectLv] = useState({ IdLinhVuc: 0, LinhVuc: 'T???t c???' });
    const [selectLoaiDV, setselectLoaiDV] = useState({ id: 0, Name: 'T???t c???' })
    const [selectDv, setselectDv] = useState('')

    const [dataCapXP, setdataCapXP] = useState([])
    const [selectCapXP, setselectCapXP] = useState('')

    const getLinhVuc = async () => {
        // let res = await apis.LinhVuc.GetList_LinhVuc();
        let res = await apis.ApiXuLyHanhChinh.GetList_LinhVuc_New()
        Utils.nlog("g??a tr??? linh vuc", res)
        if (res.status == 1) {
            setdataLinhVuc([{ IdLinhVuc: 0, LinhVuc: 'T???t c???' }].concat(res.data))
        }
    }
    const GetList_DonVi = async () => {
        let res = await apis.ApiTKXPHC.GetList_DonVi();
        Utils.nlog("g??a tr??? don v???----", res)
        if (res.status == 1) {
            setdataDonVi([{ MaPX: 0, TenPhuongXa: 'T???t c???' }].concat(res.data))
        }
    }

    const GetCapCoThamQuyenXuPhat = async () => {
        let res = await apis.ApiXuLyHanhChinh.GetList_CapThamQuyen()
        Utils.nlog('C???p c?? th???m quy???n quy???t ?????nh x??? ph???t,C?? quan thi h??nh', res)
        if (res.status == 1 && res.data) {
            setdataCapXP(res.data)
        }
    }


    useEffect(() => {

        getData();
    }, [tungay, denngay, selectLv, selectLoaiDV, selectLoaiDV.id == 1 ? selectDv : selectCapXP])
    const getData = async () => {
        let body = {
            ...objectFilter,
            // linhvuc: '30',
            // iddonvi: '31000',
            // loaithongke: '1'
        }

        if (selectLv && selectLv.IdLinhVuc != 0) {
            body.linhvuc = selectLv.IdLinhVuc
        }
        if (selectLoaiDV && selectLoaiDV.id != 0) {
            body.loaithongke = selectLoaiDV.id
        }
        if (selectDv.MaPX || selectCapXP.IdThamQuyen) {
            body.iddonvi = selectLoaiDV.id == 1 ? selectDv?.MaPX : selectCapXP?.IdThamQuyen
        }

        Utils.nlog("gi?? t??? body2", body)
        let res = await apis.ApiTKXPHC.BieuDo_XuPhatHC_ThoiHan(body);

        Utils.nlog("gi?? tr??? d??ta-----=======---------2", res)
        if (res.status == 1) {
            const { DungHan,
                SapHetHan,
                TreHan } = res.data;
            let data = [{
                value: DungHan,
                svg: {
                    fill: colors.greenyBlue, // m??u c???a bi???u ????? 
                    onPress: () => Utils.goscreen(props.nthis, 'DanhSachCTChung', { Key: 2, Type: 2, linhvuc: selectLv.IdLinhVuc, donvi: selectLoaiDV.id == 1 ? selectDv.MaPX : selectCapXP.IdThamQuyen, loaithongke: selectLoaiDV.id }),
                },
                key: `pie-${1}`,
                name: '????ng h???n'

            }, {
                value: SapHetHan,
                svg: {
                    fill: colors.colorBlueLight, // m??u c???a bi???u ????? 
                    onPress: () => Utils.goscreen(props.nthis, 'DanhSachCTChung', { Key: 2, Type: 1, linhvuc: selectLv.IdLinhVuc, donvi: selectLoaiDV.id == 1 ? selectDv.MaPX : selectCapXP.IdThamQuyen, loaithongke: selectLoaiDV.id }),
                },
                key: `pie-${2}`,
                name: 'S???p h???t h???n'
            },
            {
                value: TreHan,
                svg: {
                    fill: colors.colorPink2, // m??u c???a bi???u ????? 
                    onPress: () => Utils.goscreen(props.nthis, 'DanhSachCTChung', { Key: 2, Type: 3, linhvuc: selectLv.IdLinhVuc, donvi: selectLoaiDV.id == 1 ? selectDv.MaPX : selectCapXP.IdThamQuyen, loaithongke: selectLoaiDV.id }),
                },
                key: `pie-${3}`,
                name: 'Tr??? h???n'
            }
            ];
            setdataThongKe(data)
        }
    }
    useEffect(() => {
        getData();
        getLinhVuc();
        GetList_DonVi();
        GetCapCoThamQuyenXuPhat();
    }, [])

    const onChangeTextIndex = (val, index) => {
        switch (index) {
            case 1: {
                setselectLv(val)

            } break;
            case 2: {
                setselectDv(val)

            }
            case 3: {
                setselectCapXP(val)

            } break;
            case 4: {
                setTungay(val)

            } break;
            case 5: {
                setdenngay(val)

            } break;
            case 6: {
                setselectLoaiDV(val)
                setselectDv({})
                setselectCapXP({})
            } break;
            default:
                break;
        }
    }
    const _viewItem = (item, key) => {
        // Utils.nlog("gi?? t??? item", item)
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
                        callback: (val) => onChangeTextIndex(val, 1), item: selectLv,
                        title: 'Danh s??ch l??nh v???c',
                        AllThaoTac: dataLinhVuc,
                        ViewItem: (item) => _viewItem(item, 'LinhVuc'), Search: true, key: 'LinhVuc'
                    })
                }
                break;
            case 2:
                {
                    Utils.goscreen(props.nthis, ConfigScreenDH.Modal_ComponentSelectProps, {
                        callback: (val) => onChangeTextIndex(val, 6), item: selectLoaiDV,
                        title: 'Danh s??ch lo???i ????n v???',
                        AllThaoTac: dataLoaiDV,
                        ViewItem: (item) => _viewItem(item, "Name"), Search: true, key: 'Name'
                    })
                }
                break;
            case 3:
                {
                    Utils.goscreen(props.nthis, ConfigScreenDH.Modal_ComponentSelectProps, {
                        callback: (val) => onChangeTextIndex(val, 2), item: setselectDv,
                        title: 'Danh s??ch ????n v???',
                        AllThaoTac: dataDonVi,
                        ViewItem: (item) => _viewItem(item, "TenPhuongXa"), Search: true, key: 'TenPhuongXa'
                    })
                }
                break;
            case 4:
                {
                    Utils.goscreen(props.nthis, ConfigScreenDH.Modal_ComponentSelectProps, {
                        callback: (val) => onChangeTextIndex(val, 3), item: selectCapXP,
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
    return (
        <View style={{ flex: 1, backgroundColor: colors.white, }}>
            <View style={{
                backgroundColor: colors.white,
                flexDirection: 'row', width: '100%',
                alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10
            }}>
                <View style={{ flex: 1 }}>
                    <PieChart style={{ height: 200 }} data={dataThongKe} innerRadius={'0%'} outerRadius={'100%'} />

                </View>
                <View style={{
                    paddingHorizontal: 10, flex: 1,
                    justifyContent: 'center', height: 200
                }}>
                    {dataThongKe.map((item, index) => {
                        return (
                            <View key={`pie-${index}`} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                                <View style={{ width: reSize(15), height: reSize(15), borderRadius: 10, backgroundColor: item.svg.fill }} />
                                <Text style={{ paddingHorizontal: 5, color: colors.black }}>{`${item.name} (${item.value})`}</Text>
                            </View>
                        )
                    })}
                </View>
            </View>
            <View style={{ paddingBottom: 10 }}>

                {/* <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    width: '100%',
                }}>
                    <ComponentChonNgay value={tungay} title={`T??? ng??y`}
                        placeholder={'Ch???n t??? ng??y'}
                        onChangTextIndex={(val) => onChangeTextIndex(val, 4)}
                        isEdit={true} />
                    <ComponentChonNgay value={denngay} title={`?????n ng??y`}
                        placeholder={'Ch???n ?????n ng??y'}
                        onChangTextIndex={(val) => onChangeTextIndex(val, 5)}
                        isEdit={true} />
                </View> */}
                <ComponentLinhVuc title={'L??nh v???c'} placeholder={'Ch???n l??nh v???c'} value={selectLv.LinhVuc} onPress={() => _dropDown(1)} isEdit={true} />
                <ComponentLinhVuc title={'Lo???i ????n v??? th???ng k??'} placeholder={'Ch???n lo???i ????n v???'} value={selectLoaiDV?.Name} onPress={() => _dropDown(2)} isEdit={true} />
                {selectLoaiDV.id == 0 ? null :
                    selectLoaiDV.id == 1 ?
                        <ComponentLinhVuc title={'T??n ????n v???'} placeholder={'Ch???n ????n v???'} value={selectDv?.TenPhuongXa} onPress={() => _dropDown(3)} isEdit={true} />
                        :
                        <ComponentLinhVuc title={'T??n c???p c?? th???m quy???n'} placeholder={'Ch???n c???p c?? th???m quy???n'} value={selectCapXP?.TenCap} onPress={() => _dropDown(4)} isEdit={true} />
                }

            </View>
        </View>

    )
}


export default BDXPTheoThoiHan


const styles = StyleSheet.create({})
