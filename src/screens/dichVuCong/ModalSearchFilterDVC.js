import React, { useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import Utils from '../../../app/Utils'
import * as Animatable from 'react-native-animatable';
import { nstyles, colors } from '../../../styles';
import DatePicker from 'react-native-datepicker';
import InputRNCom from '../../../components/ComponentApps/InputRNCom';
import { Width } from '../../../styles/styles';
import moment from 'moment'
import { Images } from '../../images';
import { reText } from '../../../styles/size';
const ComponentChonNgay = (props) => {
    const ref = useRef()
    const onPress = () => {
        ref.current.onPressDate();
    }
    return (<TouchableOpacity onPress={props.isEdit ? onPress : () => { }}>
        <View pointerEvents='none'>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.colorGrayIcon, borderRadius: 7, borderWidth: 0.5,
                    minHeight: 40, alignItems: 'center', width: Width(40), paddingVertical: 0,
                }}
                labelText={props.TieuDe}
                styleLabel={{ color: colors.colorGrayText, fontWeight: 'bold', fontSize: reText(14), }}
                sufix={
                    <View style={{ alignItems: 'center', flexDirection: 'row', }}>

                        <View style={{
                            height: 30, width: 30,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Image
                                // defaultSource={Images.icCalendarPicker}
                                source={Images.icCalendar}
                                style={{ width: 15, height: 15 }} resizeMode='contain' />
                        </View>
                        <DatePicker
                            style={{ borderWidth: 0, width: '0%', }}
                            date={props.value}
                            mode="date"
                            disabled={false}
                            placeholder="Chọn ngày"
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
                placeholder={"Chọn ngày"}
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
const ComponentDonVi = (props) => {
    return (<TouchableOpacity onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 20, marginTop: 5, }}
                styleBodyInput={{
                    borderColor: colors.colorGrayIcon, borderRadius: 7, borderWidth: 0.5,
                    minHeight: 40, alignItems: 'center', paddingVertical: 0
                }}
                labelText={'Đơn vị'}
                styleLabel={{ color: colors.colorGrayText, fontWeight: 'bold', fontSize: reText(14), }}
                // sufixlabel={<View>
                //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                // </View>}
                placeholder={"-- Tất cả đơn vị --"}
                styleInput={{ color: colors.black }}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_30k}
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

const ComponentTinhTrang = (props) => {
    return (<TouchableOpacity onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 20, marginTop: 5, }}
                styleBodyInput={{
                    borderColor: colors.colorGrayIcon, borderRadius: 7, borderWidth: 0.5,
                    minHeight: 40, alignItems: 'center', paddingVertical: 0,
                }}
                labelText={'Tình trạng'}
                styleLabel={{ color: colors.colorGrayText, fontWeight: 'bold', fontSize: reText(14), }}
                // sufixlabel={<View>
                //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                // </View>}
                placeholder={"-- Tất cả tình trạng --"}
                styleInput={{ color: colors.black }}
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



const ModalSearchFilterDVC = (props) => {
    const dateFrom = Utils.ngetParam({ props: props }, "datefrom", moment(new Date()).add(-15, 'day').format('DD/MM/YYYY'))
    const dateTo = Utils.ngetParam({ props: props }, "dateTo", moment(new Date()).format('DD/MM/YYYY'))

    const dataDV = Utils.ngetParam({ props: props }, "dataDV")
    const selectDV = Utils.ngetParam({ props: props }, "selectDV", {})

    const dataTT = Utils.ngetParam({ props: props }, "dataTT")
    const selectTT = Utils.ngetParam({ props: props }, "selectTT")

    const event = Utils.ngetParam({ props: props }, "event", {});
    const callback = Utils.ngetParam({ props: props }, "callback", () => { })

    const [tungay, setTungay] = useState(dateFrom)
    const [denngay, setDenngay] = useState(dateTo)
    const [donvi, setDonVi] = useState(selectDV)
    const [tinhtrang, setTinhTrang] = useState(selectTT)

    //
    const onSubmit = () => {
        callback(donvi, tinhtrang, tungay, denngay)
        Utils.goback({ props: props })
    }
    const _lamMoi = () => {
        setTungay('');
        setDenngay('');
        setDonVi({
            "DonViCapChaID": null,
            "DonViID": "-1",
            "TenDonVi": "-- Tất cả đơn vị --",
            "NumTTHC": ""
        });
        setTinhTrang({
            "MaTinhTrang": "-1",
            "TenTinhTrang": "-- Tất cả tình trạng --",
            "TinhTrangID": "-1"
        });
    }
    const onChangeTextIndex = (val, index) => {
        switch (index) {
            case 1: {
                setDonVi(val)
            } break;
            case 2: {
                setTinhTrang(val)
            } break;
            case 3: {
                setTungay(val)
            } break;
            case 4: {
                setDenngay(val)
            } break;

            default:
                break;
        }
    }
    //dropdowwn linh vuc
    const _viewItem = (item) => {
        Utils.nlog("giá tị item", item)
        return (
            <View
                key={item.DonViID}
                style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    margin: 2,

                }}>
                <Text style={{ textAlign: 'center', paddingVertical: 10 }} >{item.TenDonVi}</Text>
            </View>
        )
    }
    const _dropDown = () => {
        Utils.nlog("<><>DataDV", dataDV)
        Utils.goscreen({ props: props }, 'Modal_ComponentSelectProps', {
            callback: (val) => onChangeTextIndex(val, 1), item: donvi,
            title: 'Danh sách đơn vị',
            AllThaoTac: dataDV, ViewItem: _viewItem, Search: true, key: 'TenDonVi'
        })
    }
    //dropdown don vi thi hanh
    const _viewItemTinhTrang = (item) => {
        return (
            <View
                key={item.MaTinhTrang}
                style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    margin: 2,

                }}>
                <Text style={{ textAlign: 'center', paddingVertical: 10 }} >{item.TenTinhTrang}</Text>
            </View>
        )
    }
    const _dropDownTinhTrang = () => {
        Utils.goscreen({ props: props }, 'Modal_ComponentSelectProps', {
            callback: (val) => onChangeTextIndex(val, 2), item: tinhtrang,
            title: 'Danh sách trạng thái',
            AllThaoTac: dataTT, ViewItem: _viewItemTinhTrang, Search: true, key: 'TenTinhTrang'
        })
    }


    return (
        <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.1)',
            // backgroundColor: 'blue',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            // paddingTop: '30%',
            height: '100%'
        }}>

            <View onTouchEnd={() => Utils.goback({ props: props })}
                style={{
                    position: 'absolute',
                    top: 0, bottom: 0, left: 0, right: 0,
                }} />
            <Animatable.View animation={'slideInRight'} delay={150} style={{
                backgroundColor: 'white',
                position: 'absolute',
                top: event.pageY,
                minHeight: 200,
                left: 10, right: 10,
                zIndex: 200,
                elevation: 6,
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowRadius: 6,
                shadowOpacity: 0.2,
                shadowColor: colors.black_50, borderRadius: 5, paddingVertical: 10
            }}>
                <ComponentDonVi value={donvi.TenDonVi} onPress={_dropDown} isEdit={true} />

                <ComponentTinhTrang value={tinhtrang.TenTinhTrang} onPress={_dropDownTinhTrang} isEdit={true} />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
                    <ComponentChonNgay value={tungay} TieuDe={`Từ ngày`} onChangTextIndex={(val) => onChangeTextIndex(val, 3)} isEdit={true} />
                    <ComponentChonNgay value={denngay} TieuDe={`Đến ngày`} onChangTextIndex={(val) => onChangeTextIndex(val, 4)} isEdit={true} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginVertical: 15 }}>
                    <TouchableOpacity
                        onPress={_lamMoi}
                        style={{
                            padding: 10, width: Width(35),
                            backgroundColor: colors.textGrayLogin,
                            marginTop: 10, marginRight: 20, borderRadius: 5, minWidth: 100,
                        }}>
                        <Text style={{ color: colors.white, fontSize: reText(14), textAlign: 'center' }}>{`Làm mới`}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onSubmit}
                        style={{
                            padding: 10, width: Width(35),
                            backgroundColor: colors.colorBlueLight,
                            marginTop: 10, borderRadius: 5, minWidth: 100,
                        }}>
                        <Text style={{ color: colors.white, fontSize: reText(14), textAlign: 'center' }}>{`Xác nhận`}</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View >
    )
}
export default ModalSearchFilterDVC
