import { StyleSheet, Text, View, Image, ScrollView, Linking, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ImgWidget } from '../../Assets'
import { ButtonWidget, HeaderWidget } from '../../CompWidgets'
import { Height, nstyles, Width } from '../../../../styles/styles'
import ItemVertical from './ItemVertical';
import { colors } from '../../../../styles'
import TextApp from '../../../../components/TextApp'
import { colorsWidget } from '../../../../styles/color'
import { isPad, reText } from '../../../../styles/size'
import Utils from '../../../../app/Utils'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { ApiRaoVat, ApiXeKhanh } from '../../apis';
import { IsLoading } from '../../../../components'
import ImageCus from '../../../../components/ImageCus'


const dataTime = [
    {
        time: '06:00'
    },
    {
        time: '09:30',
    },
    {
        time: '14:30',
    },
    {
        time: '17:00',
    },
    {
        time: '20:30',
    },
]

const dataInFoCar = [
    {
        img: ImgWidget.img1,
    },
    {
        img: ImgWidget.img2,
    },
    {
        img: ImgWidget.img2,
    },
    {
        img: ImgWidget.img2,
    },
]

const ThongTinNhaXe = (props) => {
    const IdXe = Utils.ngetParam({ props }, 'IdXe', 0)
    Utils.nlog('gia tri idxe', IdXe)
    const [data, setData] = useState({})
    const Go_Back = () => {
        Utils.goback()
    }
    useEffect(() => {
        if (IdXe) {
            getApi(IdXe);
        }
    }, [IdXe])

    const getApi = async (Id = 0) => {
        Utils.setToggleLoading(true);
        let res = await ApiXeKhanh.Get_DetaliXeKhanh(Id);
        Utils.nlog('gia tri res', res)
        setData(res?.status === 1 && res?.data ? res.data : [])
        Utils.setToggleLoading(false);
    }


    const Go_CallPhone = () => {
        let phoneNumber = '';
        if (Platform.OS !== 'android') {
            phoneNumber = `telprompt:${data?.SDT}`;
        }
        else {
            phoneNumber = `tel:${data?.SDT}`;
        }
        Linking.openURL(phoneNumber);
    };

    Utils.nlog('gia tri data chi tiet', data)
    return (
        <View style={stThongTinNhaXe.container}>
            <HeaderWidget
                title={'Thông tin nhà xe'}
                iconLeft={ImgWidget.icBack}
                onPressLeft={Go_Back}
            />
            <ScrollView
                showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 15 }} >
                <ImageCus source={{ uri: data?.AnhDaiDien }} defaultSourceCus={ImgWidget.backgroudThongTinXe} style={stThongTinNhaXe.banner} />
                <ItemVertical item={data} keyItem={['TenNhaXe', 'SDT']} showLine={false} showicRight style={{ paddingHorizontal: 0 }} showHoline={false} onPressRight={Go_CallPhone} />
                <View style={stThongTinNhaXe.line} />
                <View style={{ paddingVertical: 15 }} >
                    <TextApp style={stThongTinNhaXe.txtTitle} >Các chuyến xe</TextApp>
                    {data?.ChuyenXe?.map((item, index) => {
                        return (
                            <View key={index} >
                                <View style={{ alignItems: 'flex-start', marginBottom: 15 }} >
                                    <View style={{ backgroundColor: colors.BackgroundHome, padding: 10, borderRadius: 4 }} >
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }} >{item?.TenTinhThanhDi + '-' + item?.TenTinhThanhDen}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', marginBottom: 15 }}  >
                                    <Image source={ImgWidget.icCrile} resizeMode={'contain'} style={nstyles.nIcon16} />
                                    <TextApp style={{ marginLeft: 10 }}>Điểm đi: {item?.TenQuanHuyenDi + ',' + item?.TenTinhThanhDi}</TextApp>
                                </View>
                                <View style={{ flexDirection: 'row' }}  >
                                    <Image source={ImgWidget.icArrow} resizeMode={'contain'} style={nstyles.nIcon16} />
                                    <TextApp style={{ marginLeft: 10 }} >Điểm đến: {item?.TenQuanHuyenDen + ',' + item?.TenTinhThanhDen}</TextApp>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 10 }} >
                                    {dataTime.map((item, index) => {
                                        return (
                                            <View style={{
                                                width: Width(100) / 5 - 20,
                                                marginRight: 10,
                                                paddingVertical: 10,
                                                alignItems: 'center',
                                                backgroundColor: colorsWidget.blue,
                                                borderRadius: 4,
                                            }} >
                                                <Text style={{ color: colorsWidget.blutText, fontSize: reText(14) }} >{item.time}</Text>
                                            </View>
                                        )
                                    })}
                                </View>
                                <View style={{ borderBottomWidth: index === data.length - 1 ? 0 : 2, borderBottomColor: colors.BackgroundHome, marginVertical: 20 }} />
                            </View>
                        )
                    })}
                </View>
                <View style={stThongTinNhaXe.lineV} />
                <View style={{ paddingTop: 15 }} >
                    <TextApp style={stThongTinNhaXe.txtTitle} >Thông tin xe</TextApp>
                    <TextApp>• {data?.ThongTin || ''}</TextApp>
                    <ImageCus style={{ height: 200, marginTop: 5 }} source={{ uri: data?.AnhBia }} defaultSourceCus={ImgWidget.backgroudThongTinXe} />
                </View>
                <View style={stThongTinNhaXe.lineV} />
                <View style={{ paddingVertical: 15 }} >
                    <TextApp style={stThongTinNhaXe.txtTitle} >Qui Định</TextApp>
                    <TextApp>• {data?.QuyDinh || ''}</TextApp>
                </View>
                <View style={stThongTinNhaXe.lineV} />
                <View style={{ paddingVertical: 15 }} >
                    <TextApp style={stThongTinNhaXe.txtTitle} >Liên hệ</TextApp>
                    <View >
                        <View style={stThongTinNhaXe.vItem} >
                            <Image source={ImgWidget.icAddress} style={nstyles.nIcon20} resizeMode='contain' />
                            <TextApp style={{ marginLeft: 10, flex: 1 }} >{data?.DiaChi || ''}</TextApp>
                        </View>
                        <View style={[stThongTinNhaXe.vItem, { marginBottom: 0 }]} >
                            <Image source={ImgWidget.icPhoneWhite} style={nstyles.nIcon20} resizeMode='contain' />
                            <TextApp style={{ marginLeft: 10, flex: 1 }} >{data?.SDT || ''}</TextApp>
                        </View>
                    </View>
                </View>
                <View style={{ padding: 100 }} />
            </ScrollView>
            <ButtonWidget
                text='Liên hệ'
                style={stThongTinNhaXe.btnLienHe}
                onPress={Go_CallPhone}
            />
            <IsLoading />
        </View >
    )
}

export default ThongTinNhaXe

const stThongTinNhaXe = StyleSheet.create({
    container: {
        flex: 1,
    },
    btnLienHe: {
        marginHorizontal: 15,
        borderRadius: 10,
        marginBottom: isPad ? getBottomSpace() + 20 : getBottomSpace() + 10,
    },
    banner: {
        height: Height(25),
        width: Width(100) - 30,
        borderRadius: 4
    },
    lineV: {
        height: 5, backgroundColor: colors.BackgroundHome
    },
    line: {
        height: 5, backgroundColor: colors.BackgroundHome
    },
    vItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    txtTitle: {
        fontWeight: 'bold',
        color: colorsWidget.main, marginBottom: 10,
        fontSize: reText(15)
    }
})