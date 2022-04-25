import React, { Component, useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Utils from '../../../../app/Utils';
import ImageCus from '../../../../components/ImageCus';
import TextApp from '../../../../components/TextApp';
import { colors } from '../../../../styles';
import { nstyles } from '../../../../styles/styles';
import { reText } from '../../../../styles/size';
import { colorsSVL } from '../../../../styles/color';
import HeaderSVL from '../../components/HeaderSVL';
import { ImagesSVL } from '../../images';
import ButtonSVL from '../../components/ButtonSVL';
import { dataTinTD } from '../../dataDemo/dataTinTD';

const DetailsNotification = (props) => {
    const data = Utils.ngetParam({ props }, 'data', null)
    const [Data, setData] = useState({})
    const Id = Utils.ngetParam({ props: props }, 'Id', '')

    useEffect(() => {
        if (Id) {
            getDetail(Id)
        }
    }, [Id])

    const getDetail = async (Id) => {
        Utils.setToggleLoading(true)
        // let res = await getDetailThongBao(Id)
        Utils.nlog('Chi tiết hòm thư :', res)
        Utils.setToggleLoading(false)
        if (res.status == 1 && res.data) {
            const { data } = res
            setData(data)
        } else {
            Utils.nlog('lỗi ')
        }
    }

    const openMap = () => {
        Alert.alert("map")
        // Utils.goscreen(this, "Modal_MapChiTietPA", { dataItem: data })
    }

    const onTuChoi = () => {
        // Alert.alert("Tứ chối")
        Utils.goscreen({ props }, 'Modal_ConfirmTuChoi')
    }

    const onXacNhan = () => {
        // Alert.alert("xác nhận")
        Utils.goscreen({ props }, 'Modal_ThongBao',
            {
                title: "Cảm ơn bạn đã tham gia phỏng vấn. Công ty sẽ liên hệ và gửi thời gian phỏng vấn sớm nhất.",
                titleButton: 'Đóng',
                onThaoTac: () => {
                    Utils.goback(this);
                }
            })
    }

    return (
        <View style={[nstyles.ncontainer]}>
            <StatusBar barStyle={'dark-content'} />
            {/* Header */}
            <HeaderSVL
                title={"Chi tiết"}
                iconLeft={ImagesSVL.icBackSVL}
                onPressLeft={() => Utils.goback(this)}
            />
            {/* Body */}
            <View style={nstyles.nbody}>
                <View style={{ flex: 1 }}>
                    <View style={stDetailsNotification.container}>
                        <View style={stDetailsNotification.containerRow}>
                            <ImageCus source={data?.thumbnailUrl} style={stDetailsNotification.contLeft} />
                            <View style={stDetailsNotification.contRight}>
                                <TextApp style={stDetailsNotification.txtTitle}>
                                    {data?.title}
                                </TextApp>
                                <TextApp style={stDetailsNotification.txtCongty}>
                                    {data?.congty}
                                </TextApp>
                            </View>
                        </View>

                        <View style={stDetailsNotification.containerRow}>
                            <ImageCus source={ImagesSVL.icLocation} style={nstyles.nIcon18} resizeMode='contain' />
                            <TouchableOpacity onPress={openMap}>
                                <TextApp style={stDetailsNotification.txtAddress}>
                                    {data?.address}
                                </TextApp>
                            </TouchableOpacity>
                        </View>

                        <View style={stDetailsNotification.contRow}>
                            <View style={stDetailsNotification.contTypeWork}>
                                <TextApp style={stDetailsNotification.txtDateInterview}>
                                    {data?.dateInterview}
                                </TextApp>
                            </View>
                            <View style={stDetailsNotification.containerRow}>
                                <ImageCus source={ImagesSVL.icMap} style={nstyles.nIcon18} resizeMode='contain' />
                                <TextApp style={stDetailsNotification.txtMap}>
                                    {'Xem bản đồ'}
                                </TextApp>
                            </View>
                        </View>
                    </View>

                    <View style={stDetailsNotification.container}>
                        <View style={stDetailsNotification.lineTab}>
                            <TextApp style={stDetailsNotification.txtTab}>{'Ghi chú'}</TextApp>
                        </View>
                        <TextApp style={stDetailsNotification.txtNote}>
                            {data?.note || 'Ghi chú'}
                        </TextApp>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { }}>
                            <View style={{ borderRadius: 25, borderWidth: 2, borderColor: colorsSVL.blueMainSVL, backgroundColor: colorsSVL.white, marginTop: 25, paddingHorizontal: 18, paddingVertical: 5 }}>
                                <TextApp style={{ fontSize: reText(14), color: colorsSVL.blueMainSVL, fontWeight: 'bold' }}>{'Chi tiết công việc'}</TextApp>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ paddingVertical: 20 }}>
                    <View style={[stDetailsNotification.containerButton]}>
                        <ButtonSVL
                            onPress={onTuChoi}
                            style={{ backgroundColor: colorsSVL.organeMainSVL, paddingVertical: 10, flex: 1 }}
                            styleText={{ fontSize: reText(14), fontWeight: 'bold', color: colorsSVL.white }}
                            text='Từ chối'
                            colorText={"black"}
                        />
                        <View style={{ width: 12 }} />
                        <ButtonSVL
                            onPress={onXacNhan}
                            style={{ backgroundColor: colorsSVL.blueMainSVL, paddingVertical: 10, flex: 1 }}
                            styleText={{ fontSize: reText(14), fontWeight: 'bold', color: colorsSVL.white }}
                            text='Xác nhận'
                            colorText={colorsSVL.white}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}

const stDetailsNotification = StyleSheet.create({
    container: {
        backgroundColor: colorsSVL.white,
        marginTop: 5, padding: 10
    },
    containerRow: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5
    },
    containerButton: {
        flexDirection: 'row',
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    contLeft: {
        ...nstyles.nIcon65
    },
    contRight: {
        flex: 1, paddingLeft: 8
    },
    txtTitle: {
        fontWeight: 'bold', textAlign: 'justify'
    },
    txtCongty: {
        fontSize: reText(12), color: colorsSVL.grayText, marginTop: 5
    },
    txtLocal: {
        fontSize: reText(12), color: colorsSVL.blueMainSVL
    },
    txtDateInterview: {
        fontSize: reText(11), color: colorsSVL.blueMainSVL
    },
    txtMap: {
        fontSize: reText(14), color: colorsSVL.blueMainSVL, fontWeight: 'bold', paddingHorizontal: 10
    },
    txtAddress: {
        fontSize: reText(12), color: colorsSVL.blueMainSVL, marginTop: 5, paddingHorizontal: 10
    },
    lineTab: {
        paddingLeft: 8, borderLeftWidth: 3, borderColor: colorsSVL.blueMainSVL
    },
    txtTab: {
        fontSize: reText(20), fontWeight: 'bold'
    },
    txtNote: {
        fontSize: reText(14), textAlign: 'justify', paddingVertical: 5
    },
    contTypeWork: { paddingHorizontal: 10, paddingVertical: 3, backgroundColor: '#cce6f0', borderRadius: 10, marginVertical: 10, alignItems: 'center', justifyContent: 'center' },
    contRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
})

export default DetailsNotification
