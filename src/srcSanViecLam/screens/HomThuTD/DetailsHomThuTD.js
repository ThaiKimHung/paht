import React, { useState, useEffect } from 'react';
import { ScrollView, StatusBar } from 'react-native';
import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Utils from '../../../../app/Utils';
import ImageCus from '../../../../components/ImageCus';
import TextApp from '../../../../components/TextApp';
import { nstyles, Width } from '../../../../styles/styles';
import { reText } from '../../../../styles/size';
import { colorsSVL } from '../../../../styles/color';
import HeaderSVL from '../../components/HeaderSVL';
import { ImagesSVL } from '../../images';
import ButtonSVL from '../../components/ButtonSVL';
import { dataTinTD } from '../../dataDemo/dataTinTD';

const DetailsHomThuTD = (props) => {
    const data = Utils.ngetParam({ props }, 'data',
        {
            name: 'Huỳnh Thị Tiên',
            thumbnailUrl: ImagesSVL.imgHoaSen,
            title: 'Nhân viên quản lý kho, khuc vực củ chi. Từ tháng 1 - tháng 3 hỗ trợ xét nghiệm tại công ty',
            congty: 'Công Ty Cổ Phần Tập Đoàn Hoa Sen',
            address: 'Số 9, Đại Lộ Thống Nhất, Khu công nghiệp Sóng Thần II, P. Dĩ An, TP.Dĩ An, tỉnh Bình Dương',
            dateInterview: 'Phỏng vấn: 09:00 ngày 12/12/2021',
            lydo: '',
            note: 'Thông tin công việc: CTV Phân loại hàng ca 08h- 12h (Hỗ trợ xét nghiệp tại công ty)',
            time: '17:30',
            hannop: '30/01/2022',
            typework: 'Bán thời gian',
            check: true,
            status: 0,
        },
    )
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
        Utils.nlog('Chi tiết hòm thư tuyển dụng :', res)
        Utils.setToggleLoading(false)
        if (res.status == 1 && res.data) {
            const { data } = res
            setData(data)
        } else {
            Utils.nlog('lỗi ')
        }
    }

    const onSendInterviewAgain = () => {
        Utils.goscreen({ props }, 'Modal_MoiPhongVan', { isGoOnHomThu: true })
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
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={nstyles.nbody}>
                    <View style={stDetailsHomThuTD.container}>
                        <View style={stDetailsHomThuTD.containerRow}>
                            <View style={{ paddingHorizontal: 10 }}>
                                <ImageCus
                                    source={data?.Avata || ImagesSVL.icUser1}
                                    style={nstyles.nAva80}
                                    resizeMode='cover'
                                />
                            </View>
                            <View style={{ flex: 1, paddingLeft: 30 }}>
                                <TextApp style={[stDetailsHomThuTD.txtInfor, { fontSize: reText(14), fontWeight: 'bold' }]}>{data?.HoTen}</TextApp>
                                <TextApp style={stDetailsHomThuTD.txtInfor} >{'Ngành nghề:'} {data?.NganhNghe}</TextApp>
                                <TextApp style={[stDetailsHomThuTD.txtInfor, { fontWeight: 'bold', color: colorsSVL.organeMainSVL }]} >{'Lương: '}<TextApp>{'Thoả thuận'}</TextApp></TextApp>
                                <TextApp style={stDetailsHomThuTD.txtInfor} >{'Khu vực:'}<TextApp>{' TP. Hồ Chí Minh'}</TextApp></TextApp>
                                <TextApp style={stDetailsHomThuTD.txtInfor} >{'Loại hồ sơ:'}<TextApp>{" Học sinh, sinh viên"}</TextApp></TextApp>
                                <View style={stDetailsHomThuTD.contRow}>
                                    <View style={[stDetailsHomThuTD.contTypeWork, { backgroundColor: colorsSVL.grayBgrInput }]}>
                                        <TextApp style={[stDetailsHomThuTD.txtDateInterview, { color: colorsSVL.grayText }]}>
                                            {data?.typework}
                                        </TextApp>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    {
                        // từ chối phỏng vấn
                        data?.check ? null :
                            <View style={stDetailsHomThuTD.container}>
                                <View style={stDetailsHomThuTD.lineTab}>
                                    <TextApp style={stDetailsHomThuTD.txtTab}>{'Lý do từ chối'}</TextApp>
                                </View>
                                <TextApp style={stDetailsHomThuTD.txtNote}>
                                    {data?.lydo || ''}
                                </TextApp>
                            </View>
                    }
                    <View style={stDetailsHomThuTD.container}>
                        <View style={stDetailsHomThuTD.containerRow}>
                            <ImageCus source={data?.thumbnailUrl} style={stDetailsHomThuTD.contLeft} />
                            <View style={stDetailsHomThuTD.contRight}>
                                {/* tên công ty */}
                                <TextApp style={stDetailsHomThuTD.txtTitle}>
                                    {data?.title}
                                </TextApp>
                                {/* Địa chỉ */}
                                <TextApp style={stDetailsHomThuTD.txtCongty}>
                                    {data?.congty}
                                </TextApp>
                            </View>
                        </View>
                        <View style={stDetailsHomThuTD.contRow}>
                            {
                                // thời gian phỏng vấn
                                data?.check ?
                                    <View style={stDetailsHomThuTD.contTypeWork}>
                                        <TextApp style={stDetailsHomThuTD.txtDateInterview}>
                                            {data?.dateInterview}
                                        </TextApp>
                                    </View> :
                                    <View style={[stDetailsHomThuTD.contTypeWork, { backgroundColor: '#f7e4cb' }]}>
                                        <TextApp style={[stDetailsHomThuTD.txtDateInterview, { color: colorsSVL.organeMainSVL }]}>
                                            {data?.dateInterview}
                                        </TextApp>
                                    </View>
                            }
                            {/* hạn nộp hồ sơ */}
                            <View style={stDetailsHomThuTD.containerRow}>
                                <TextApp style={stDetailsHomThuTD.txtHanNop}>
                                    {'Hạn nộp hồ sơ :'} {data?.hannop}
                                </TextApp>
                            </View>
                        </View>
                    </View>
                    <View style={[stDetailsHomThuTD.container, { flex: 1 }]}>
                        {/* Chi tiết công việc */}
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <TouchableOpacity onPress={() => {

                            }}>
                                <View style={{ borderRadius: 25, borderWidth: 2, borderColor: colorsSVL.blueMainSVL, backgroundColor: colorsSVL.white, marginTop: 10, marginBottom: 100, paddingHorizontal: 18, paddingVertical: 5 }}>
                                    <TextApp style={{ fontSize: reText(14), color: colorsSVL.blueMainSVL, fontWeight: 'bold' }}>{'Chi tiết công việc'}</TextApp>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[stDetailsHomThuTD.containerButton]}>
                            <ButtonSVL
                                onPress={() => Utils.goback(this)}
                                style={{ backgroundColor: colorsSVL.grayBgrInput, paddingVertical: 10, flex: 1 }}
                                styleText={{ fontSize: reText(14), fontWeight: 'bold', color: colorsSVL.black }}
                                text='Đóng'
                                colorText={"black"}
                            />
                            <View style={{ width: 12 }} />
                            <ButtonSVL
                                onPress={onSendInterviewAgain}
                                style={{ backgroundColor: colorsSVL.blueMainSVL, paddingVertical: 10, flex: 1 }}
                                styleText={{ fontSize: reText(14), fontWeight: 'bold', color: colorsSVL.white }}
                                text='Gửi lại lịch PV'
                                colorText={colorsSVL.white}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView >
        </View >
    )
}

const stDetailsHomThuTD = StyleSheet.create({
    container: {
        backgroundColor: colorsSVL.white,
        marginTop: 5, padding: 10
    },
    containerRow: {
        flexDirection: 'row',
        paddingVertical: 5
    },
    containerButton: {
        flexDirection: 'row',
        marginHorizontal: 10,
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    contLeft: {
        ...nstyles.nIcon65
    },
    contRight: {
        flex: 1, paddingLeft: 8
    },
    txtTitle: {
        fontSize: reText(14), fontWeight: 'bold', textAlign: 'justify'
    },
    txtInfor: {
        fontSize: reText(12), marginBottom: 10,
    },
    txtCongty: {
        fontSize: reText(12), color: colorsSVL.grayText, marginTop: 5
    },
    txtDateInterview: {
        fontSize: reText(12), color: colorsSVL.blueMainSVL
    },
    txtHanNop: {
        fontSize: reText(12), color: colorsSVL.grayText, paddingHorizontal: 10
    },
    lineTab: {
        paddingLeft: 8, borderLeftWidth: 3, borderColor: colorsSVL.blueMainSVL
    },
    txtTab: {
        fontSize: reText(18), fontWeight: 'bold', color: '#333333'
    },
    txtNote: {
        fontSize: reText(15), textAlign: 'justify', paddingTop: 10, color: colorsSVL.grayText
    },
    contTypeWork: { paddingHorizontal: 10, paddingVertical: 3, backgroundColor: '#cce6f0', borderRadius: 10, marginVertical: 10, alignItems: 'center', justifyContent: 'center' },
    contRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignItems: 'center' },
})

export default DetailsHomThuTD
