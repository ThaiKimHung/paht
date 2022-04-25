import React, { useRef, useState } from 'react'
import { Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Utils from '../../../../app/Utils'
import index from '../../../../chat/RoomChat/ActionImae'
import TextApp from '../../../../components/TextApp'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import { nstyles } from '../../../../styles/styles'
import { Images } from '../../../images'
import HeaderTitle from '../HoSo/components/HeaderTitle'
import ImageCus from '../../../../components/ImageCus'
import { ImagesSVL } from '../../images'
import { colorsSVL } from '../../../../styles/color'
import Animated from 'react-native-reanimated'
import { StatusHinhThucLamViec, StatusNguoiLaoDong } from '../HoSo/components/StatusCv'

const ItemDetalis = (props) => {
    const { item, CallBack = () => { }, itemValue, indexItem, type = 1 } = props
    const [show, setshow] = useState(true)
    const animation = useRef(new Animated.Value(0)).current;

    const rotateDrop = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-90deg'],
    });

    const CallAnimation = (value) => {
        Animated.timing(animation, {
            toValue: value,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start();
    }

    const Get_Value = (value) => {
        // Utils.nlog('gia tri item value', itemValue)
        switch (value) {
            case 'Loại hồ sơ':
                return StatusNguoiLaoDong(itemValue?.TypePerson);
            case 'Hình thước làm việc':
                return StatusHinhThucLamViec(itemValue?.TypeCV);
            case 'Ngành nghề':
                return itemValue?.NganhNghe || itemValue?.NganhNgheKhac || itemValue?.NganhNgheShow || 'Đang cập nhật';
            case 'Kinh nghiệm':
                return itemValue?.KinhNghiem ? itemValue?.KinhNghiem : 'Đang cập nhật';
            case 'Vị trí mong muốn':
                return itemValue?.ChucVu || itemValue?.ChucVuKhac || itemValue?.ChucVuShow || 'Đang cập nhật';
            case 'Ngày sinh':
                return itemValue?.NgaySinh ? itemValue?.NgaySinh : 'Đang cập nhật';
            case 'Giới tính':
                return itemValue?.GioiTinh === 0 ? 'Nam' : 'Nữ'
            case 'Số điện thoại':
                return itemValue?.PhoneNumber ? itemValue?.PhoneNumber : 'Đang cập nhật';
            case 'Địa chỉ':
                return itemValue?.DiaChi ? itemValue?.DiaChi : 'Đang cập nhật';
            case 'Email':
                return itemValue?.Email ? itemValue?.Email : 'Đang cập nhật';
            default:
                return '';
        }
    }

    const Conver_MucLuong = (value = 0) => {
        return parseInt(value).toLocaleString('it-IT') + '';
    }

    return (
        <View >
            <View style={{ height: 5, backgroundColor: colors.whitegay }} />
            <View style={{
                paddingHorizontal: 15, marginTop: 15,
                //  paddingVertical: item.title === 'Học vấn' ? 10 : 0
            }}>
                <TouchableOpacity activeOpacity={0.5}
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
                    onPress={() => {
                        if (type != 1) {
                            return;
                        }
                        setshow(!show)
                        CallAnimation(show ? 1 : 0)
                        CallBack();
                    }
                    }>
                    <HeaderTitle text={item.title} />
                    {type === 1 && <View style={{ alignItems: 'flex-end', flex: 1 }}>
                        <Animated.Image source={Images.icDropDown} style={[nstyles.nIcon13, { transform: [{ rotate: rotateDrop }] }]}
                            resizeMode='contain'
                        />
                    </View>}
                </TouchableOpacity>
                {show && <View style={{ paddingHorizontal: 10 }} >
                    {item.title === 'Học vấn' &&
                        <View >
                            {itemValue?.TrinhDoVanHoa ?
                                <View key={index} style={{
                                    flexDirection: 'row', alignItems: 'center',
                                    marginBottom: 5,
                                }} >
                                    <View style={{
                                        width: 5, height: 5, borderRadius: 5,
                                        backgroundColor: colors.black, marginRight: 8
                                    }} />
                                    <TextApp style={stItemDetalis.titleSub} >Trình độ học vấn: {itemValue.TrinhDoVanHoa}</TextApp>
                                </View> : <Text style={{ marginHorizontal: 10, marginBottom: 10 }} >Đang cập nhật</Text>
                            }
                            {itemValue.ChiTietHocVan && itemValue.ChiTietHocVan.map((i, index) => {
                                return (
                                    <View key={index} style={{ borderLeftWidth: 4, borderLeftColor: colorsSVL.grayTextLight, paddingHorizontal: 10, marginBottom: 10 }}  >
                                        <TextApp style={{ marginBottom: 5 }} >Từ năm: {i?.TuNam ? i.TuNam + ' ' : 'Đang cập nhật'}<TextApp style={{ marginBottom: 5 }}>-{i?.DenNam ? i?.DenNam : ' Đang cập nhật'}</TextApp></TextApp>
                                        {i.TenTruongHoc ?
                                            <TextApp style={{ marginBottom: 5 }} >Trường lớp: {i.TenTruongHoc}</TextApp> : <Text style={{ marginBottom: 5 }}>Trường lớp: Đang cập nhật</Text>
                                        }
                                        {i.TrinhDoVanHoa ?
                                            <TextApp style={{ marginBottom: 5 }} >Ngành học: {i.TrinhDoVanHoa}</TextApp> : <Text style={{ marginBottom: 5 }}>Ngành học: Đang cập nhật</Text>
                                        }
                                        {i.NganhHoc ?
                                            <TextApp style={{ marginBottom: 5 }} >Ngành học: {i.NganhHoc}</TextApp> : <Text style={{ marginBottom: 5 }}>Ngành học: Đang cập nhật</Text>
                                        }
                                        {i.LoaiTotNghiep ?
                                            <TextApp style={{ marginBottom: 5 }} >Loại tốt nghiệp: {i.LoaiTotNghiep}</TextApp> : <Text style={{ marginBottom: 5 }}>Loại tốt nghiệp: Đang cập nhật</Text>
                                        }
                                    </View>
                                )
                            })
                            }
                        </View>
                    }
                    {item.title === 'Kinh nhgiệm' &&
                        <View>
                            {itemValue.MoTaKinhNghiem ? itemValue.MoTaKinhNghiem?.split('\n').map((i, index) => {
                                return (
                                    <View
                                        key={index}
                                        style={{
                                            flexDirection: 'row', alignItems: 'center',
                                            marginBottom: 10,
                                        }} >
                                        <TextApp style={stItemDetalis.titleSub} >
                                            {i}
                                        </TextApp>
                                    </View>
                                )
                            }) : <Text style={{ marginHorizontal: 10, marginBottom: 10 }} >Đang cập nhật</Text>
                            }
                        </View>
                    }
                    {item.title === 'Kỹ năng' &&
                        <View>
                            {itemValue.MoTaKyNang ? itemValue.MoTaKyNang?.split('\n').map((i, index) => {
                                return (
                                    <View
                                        key={index}
                                        style={{
                                            flexDirection: 'row', alignItems: 'center',
                                            marginBottom: 10,
                                        }} >
                                        <TextApp style={stItemDetalis.titleSub} >
                                            {i}
                                        </TextApp>
                                    </View>
                                )
                            }) : <Text style={{ marginHorizontal: 10, marginBottom: 10 }} >Đang cập nhật</Text>
                            }
                        </View>
                    }
                    {item.title === 'Mong muốn khác' &&
                        <View>
                            {itemValue.GhiChu ? itemValue.GhiChu?.split('\n').map((i, index) => {
                                return (
                                    <View
                                        key={index}
                                        style={{
                                            flexDirection: 'row', alignItems: 'center',
                                            marginBottom: 10,
                                        }} >
                                        <TextApp style={stItemDetalis.titleSub} >
                                            {i}
                                        </TextApp>
                                    </View>
                                )
                            }) : <Text style={{ marginHorizontal: 10, marginBottom: 10 }} >Đang cập nhật</Text>
                            }
                        </View>
                    }
                    {item.title === 'Lương' &&
                        <View style={{
                            flexDirection: 'row', alignItems: 'center',
                            marginBottom: 10,
                        }} >
                            <Text>{'• '}</Text>
                            <TextApp style={stItemDetalis.titleSub} >Mức lương:
                                {itemValue?.MucLuong || (Conver_MucLuong(itemValue?.MucLuongMongMuonFrom) + '-' + Conver_MucLuong(itemValue.MucLuongMongMuonTo)) || ' Đang cập nhật'}
                            </TextApp>
                        </View>
                    }
                    {item.title === 'Thời gian làm việc' &&
                        <View style={{
                            flexDirection: 'row', alignItems: 'center',
                            marginBottom: 10,
                        }} >
                            <Text>{'• '}</Text>
                            <TextApp style={stItemDetalis.titleSub} >
                                {itemValue?.NgayBatDauLamViec ? itemValue?.NgayBatDauLamViec : 'Có thể làm việc ngay'}
                            </TextApp>
                        </View>
                    }
                    {item?.dataItem?.map((i, indexsub) => {
                        return (
                            <View key={indexsub} >
                                {indexItem === 0 && indexsub === 6 && type === 1 ?
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}  >
                                        <ImageCus source={itemValue?.loaiHoSo ? ImagesSVL.icSwtichOn : ImagesSVL.icSwitchOff}
                                            style={nstyles.nIcon35}
                                            resizeMode='contain'
                                        />
                                        <TextApp style={[stItemDetalis.titleSub, { marginLeft: 10 }]} >{'Công khai hồ sơ xin việc'}</TextApp>
                                    </View>
                                    : item.title === 'Tổng quan' && indexsub === item.dataItem.length - 1 ? null :
                                        <View style={{
                                            flexDirection: 'row', alignItems: 'center',
                                            marginBottom: 10,
                                        }} >
                                            <Text>{'• '}</Text>
                                            <TextApp style={stItemDetalis.titleSub} >
                                                {i.title + ': ' + Get_Value(i.title)}
                                            </TextApp>
                                        </View>
                                }
                            </View>
                        )
                    })}
                </View>}
            </View>
        </View >
    )
}

export default ItemDetalis

const stItemDetalis = StyleSheet.create({
    titleSub: {
        fontSize: reText(14)
    },
})
