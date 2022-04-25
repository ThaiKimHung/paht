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
const ComponentLinhVuc = (props) => {
    return (<TouchableOpacity onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 20, marginTop: 5, }}
                styleBodyInput={{
                    borderColor: colors.colorGrayIcon, borderRadius: 7, borderWidth: 0.5,
                    minHeight: 40, alignItems: 'center', paddingVertical: 0
                }}
                labelText={'Lĩnh vực'}
                styleLabel={{ color: colors.colorGrayText, fontWeight: 'bold', fontSize: reText(14), }}
                // sufixlabel={<View>
                //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                // </View>}
                placeholder={"Chọn lĩnh vực"}
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

const ComponentToChuc = (props) => {
    return (<TouchableOpacity onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 20, marginTop: 5, }}
                styleBodyInput={{
                    borderColor: colors.colorGrayIcon, borderRadius: 7, borderWidth: 0.5,
                    minHeight: 40, alignItems: 'center', paddingVertical: 0,
                }}
                labelText={'Cơ quan tổ chức thi hành'}
                styleLabel={{ color: colors.colorGrayText, fontWeight: 'bold', fontSize: reText(14), }}
                // sufixlabel={<View>
                //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                // </View>}
                placeholder={"Chọn cơ quan tổ chức thi hành"}
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



const ModalSearchFilter = (props) => {
    const dateFrom = Utils.ngetParam({ props: props }, "datefrom", moment(new Date()).add(-15, 'day').format('DD/MM/YYYY'))
    const dateTo = Utils.ngetParam({ props: props }, "dateTo", moment(new Date()).format('DD/MM/YYYY'))

    const dataLinhVuc = Utils.ngetParam({ props: props }, "dataLinhVuc")
    const selectLinhVuc = Utils.ngetParam({ props: props }, "selectLinhVuc", {})

    const dataToChucThiHanh = Utils.ngetParam({ props: props }, "dataToChucThiHanh")
    const selectToChucThiHanh = Utils.ngetParam({ props: props }, "selectToChucThiHanh")


    const event = Utils.ngetParam({ props: props }, "event", {});
    const callback = Utils.ngetParam({ props: props }, "callback", () => { })

    const [tungay, setTungay] = useState(dateFrom)
    const [denngay, setDenngay] = useState(dateTo)
    const [linhvuc, setLinhvuc] = useState(selectLinhVuc)
    const [tochuc, settoChuc] = useState(selectToChucThiHanh)
    const [trangthai, setTrangThai] = useState(-1)
    const [hethan, setHetHan] = useState(-1)

    //
    const onSubmit = () => {
        callback(tungay, denngay, linhvuc, tochuc, trangthai, hethan)
        Utils.goback({ props: props })
    }
    const _lamMoi = () => {
        setTungay('');
        setDenngay('');
        setLinhvuc({ "IdLinhVuc": '', "LinhVuc": "Tất cả" });
        settoChuc({ "MaPX": '', "TenPhuongXa": "Tất cả" });
        setTrangThai(-1);
        setHetHan(-1)
    }
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
            case 4: {
                settoChuc(val)
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
    const _dropDown = () => {
        Utils.goscreen({ props: props }, ConfigScreenDH.Modal_ComponentSelectProps, {
            callback: (val) => onChangeTextIndex(val, 3), item: linhvuc,
            title: 'Danh sách lĩnh vực',
            AllThaoTac: dataLinhVuc, ViewItem: _viewItem, Search: true, key: 'LinhVuc'
        })
    }
    //dropdown don vi thi hanh
    const _viewItemToChuc = (item) => {
        return (
            <View
                key={item.MaPX}
                style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    margin: 2,

                }}>
                <Text style={{ textAlign: 'center', paddingVertical: 10 }} >{item.TenPhuongXa}</Text>
            </View>
        )
    }
    const _dropDownToChuc = () => {
        Utils.goscreen({ props: props }, ConfigScreenDH.Modal_ComponentSelectProps, {
            callback: (val) => onChangeTextIndex(val, 4), item: tochuc,
            title: 'Danh sách cơ quan tổ chức thi hành',
            AllThaoTac: dataToChucThiHanh, ViewItem: _viewItemToChuc, Search: true, key: 'TenPhuongXa'
        })
    }


    const ViewTinhTrang = () => {
        return (
            <View style={{ marginTop: 20, marginHorizontal: 20, }}>
                <View style={{ borderWidth: 0.5, paddingVertical: 10, paddingHorizontal: 5, borderColor: colors.black_20, borderRadius: 5 }}>
                    <Text style={{ fontSize: reText(14), fontWeight: 'bold', color: colors.black_50, }}>Tình trạng: </Text>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', maxWidth: Width(25) }} onPress={() => setTrangThai(1)}>
                            <Image source={trangthai == 1 ? Images.icRadioChk : Images.icRadioUnChk} style={{ marginRight: 3 }} />
                            <Text style={{ alignSelf: 'center', fontSize: reText(12), fontWeight: 'bold', color: colors.black_60 }}>Chưa thi hành</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 10, maxWidth: Width(25) }} onPress={() => setTrangThai(2)} >
                            <Image source={trangthai == 2 ? Images.icRadioChk : Images.icRadioUnChk} style={{ marginRight: 3 }} />
                            <Text style={{ alignSelf: 'center', fontSize: reText(12), fontWeight: 'bold', color: colors.black_60 }}>Đã thi hành</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 10, maxWidth: Width(25) }} onPress={() => setTrangThai(3)} >
                            <Image source={trangthai == 3 ? Images.icRadioChk : Images.icRadioUnChk} style={{ marginRight: 3 }} />
                            <Text style={{ alignSelf: 'center', fontSize: reText(12), fontWeight: 'bold', color: colors.black_60 }}>Thi hành 1 phần</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    const checkTreHan = () => {
        if (hethan == -1)
            setHetHan(1)
        else if (hethan == 1)
            setHetHan(0)
        else setHetHan(1)
    }
    const ViewHetHan = () => {
        return (
            <View style={{ marginVertical: 20, marginHorizontal: 20, flexDirection: 'row' }}>
                <Text style={{ fontSize: reText(14), fontWeight: 'bold', color: colors.black_50 }}>Hết hạn</Text>
                <TouchableOpacity onPress={() => checkTreHan()}>
                    <Image source={hethan == 1 ? Images.icCheck : Images.icUnCheck} style={{ marginLeft: 10, alignSelf: 'center', tintColor: colors.peacockBlue, width: 20, height: 20 }} />
                </TouchableOpacity>
            </View>
        )
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
                <ComponentLinhVuc value={linhvuc.LinhVuc} onPress={_dropDown} isEdit={true} />

                {/* <ComponentToChuc value={tochuc.TenPhuongXa} onPress={_dropDownToChuc} isEdit={true} /> */}

                <ViewTinhTrang />

                <ViewHetHan />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
                    <ComponentChonNgay value={tungay} TieuDe={`Từ ngày`} onChangTextIndex={(val) => onChangeTextIndex(val, 1)} isEdit={true} />
                    <ComponentChonNgay value={denngay} TieuDe={`Đến ngày`} onChangTextIndex={(val) => onChangeTextIndex(val, 2)} isEdit={true} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginVertical: 15 }}>
                    <TouchableOpacity
                        onPress={_lamMoi}
                        style={{
                            padding: 10, width: Width(35),
                            backgroundColor: colors.black_20,
                            marginTop: 10, marginRight: 20, borderRadius: 5, minWidth: 100,
                        }}>
                        <Text style={{ color: colors.white, fontSize: reText(14), textAlign: 'center' }}>{`Làm mới`}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onSubmit}
                        style={{
                            padding: 10, width: Width(35),
                            backgroundColor: colors.peacockBlue,
                            marginTop: 10, borderRadius: 5, minWidth: 100,
                        }}>
                        <Text style={{ color: colors.white, fontSize: reText(14), textAlign: 'center' }}>{`Xác nhận`}</Text>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View >
    )
}
export default ModalSearchFilter
