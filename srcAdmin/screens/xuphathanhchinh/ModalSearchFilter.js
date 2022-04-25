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
import { ConfigScreenDH } from '../../routers/screen';
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
                                //defaultSource={Images.icCalendar}
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
const ComponentLinhVuc = (props) => {
    return (<TouchableOpacity onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 20, marginTop: 5, }}
                styleBodyInput={{
                    borderColor: colors.colorGrayIcon, borderRadius: 7, borderWidth: 0.5,
                    minHeight: 40, alignItems: 'center', paddingVertical: 0,
                }}
                labelText={'Lĩnh vực'}
                styleLabel={{ color: colors.colorGrayText, fontWeight: 'bold', fontSize: reText(14), }}
                // sufixlabel={<View>
                //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                // </View>}
                placeholder={"Chọn lĩnh vực"}
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

const ModalSearchFilter = (props) => {
    const dateFrom = Utils.ngetParam({ props: props }, "datefrom", moment(new Date()).add(-15, 'day').format('DD/MM/YYYY'))
    const dateTo = Utils.ngetParam({ props: props }, "dateTo", moment(new Date()).format('DD/MM/YYYY'))
    const select = Utils.ngetParam({ props: props }, "selectlv", {})
    const dataLinhVuc = Utils.ngetParam({ props: props }, "dataLinhVuc")
    const event = Utils.ngetParam({ props: props }, "event", {});
    const callback = Utils.ngetParam({ props: props }, "callback", () => { })

    const [tungay, setTungay] = useState(dateFrom)
    const [denngay, setDenngay] = useState(dateTo)
    const [linhvuc, setLinhvuc] = useState(select)
    Utils.nlog("giá trị dataLinhVuc", dataLinhVuc)
    //
    const onChangeTextIndex = (val, index) => {
        switch (index) {
            case 1: {
                setTungay(val)
            } break;
            case 2: {
                setDenngay(val)
            } break;
            case 3: {
                setLinhvuc(val)
            } break;
            default:
                break;
        }
    }
    //
    const _viewItem = (item) => {
        Utils.nlog("giá tị item", item)
        return (
            <View
                key={item.IdLinhVuc}
                style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    margin: 2,

                }}>
                <Text style={{ textAlign: 'center', paddingVertical: 10 }} >{item.LinhVuc}</Text>
            </View>
        )
    }
    //
    const _dropDown = () => {
        Utils.goscreen({ props: props }, ConfigScreenDH.Modal_ComponentSelectProps, {
            callback: (val) => onChangeTextIndex(val, 3), item: linhvuc,
            title: 'Danh sách lĩnh vực',
            AllThaoTac: dataLinhVuc, ViewItem: _viewItem, Search: true, key: 'LinhVuc'
        })
    }
    const onSubmit = () => {
        callback(tungay, denngay, linhvuc)
        Utils.goback({ props: props })
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
                    <ComponentChonNgay value={tungay} TieuDe={`Từ ngày`} onChangTextIndex={(val) => onChangeTextIndex(val, 1)} isEdit={true} />
                    <ComponentChonNgay value={denngay} TieuDe={`Đến ngày`} onChangTextIndex={(val) => onChangeTextIndex(val, 2)} isEdit={true} />
                </View>
                <ComponentLinhVuc value={linhvuc.LinhVuc} onPress={_dropDown} isEdit={true} />
                <TouchableOpacity
                    onPress={onSubmit}
                    style={{
                        alignSelf: 'flex-end', padding: 10,
                        backgroundColor: colors.colorBlueLight,
                        marginTop: 10, marginRight: 20, borderRadius: 5, minWidth: 100,
                    }}>
                    <Text style={{ color: colors.white, fontSize: reText(14), textAlign: 'center' }}>{`Xác nhận`}</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View >
    )
}
export default ModalSearchFilter
