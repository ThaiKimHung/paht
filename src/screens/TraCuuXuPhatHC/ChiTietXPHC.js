import React, { Component, Fragment } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { GetDetail_HanhChinh } from '../../apis/apiXuPhatCD'
import { appConfig } from '../../../app/Config'
import Utils from '../../../app/Utils'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { nstyles, paddingTopMul, Width } from '../../../styles/styles'
import ImagePicker from '../../../components/ComponentApps/ImagePicker/ImagePicker'
import moment from 'moment'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { Platform } from 'react-native'
import { IsLoading } from '../../../components'

export class ChiTietXPHC extends Component {
    constructor(props) {
        super(props)
        this.IdXuPhat = Utils.ngetParam(this, 'IdXuPhat', '')
        this.state = {
            dataCTXP: []
        }
    }
    componentDidMount() {
        this.GetDetailHanhChinh();

    }

    GetDetailHanhChinh = async () => {
        nthisIsLoading.show();
        let res = await GetDetail_HanhChinh(this.IdXuPhat);
        if (res.status == 1) {
            nthisIsLoading.hide();
            this.setState({ dataCTXP: res.data })
        }
        else {
            nthisIsLoading.hide();
            this.setState({ dataCTXP: [] })
        }
        Utils.nlog('Gia tri item data =====', this.state.dataCTXP)
    }
    renderItem = (Tieude = '', Value = '', styleValue = {}) => {
        return (
            <View style={[{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }]}>
                <Text style={[{ fontSize: reText(14), fontWeight: 'bold' }]}>{Tieude}</Text>
                <Text numberOfLines={2} style={[{ fontSize: reText(12), marginLeft: 5 }, styleValue]}>{Value}</Text>
            </View>
        )
    }

    render() {
        const { dataCTXP } = this.state;
        return (
            <View style={[nstyles.ncontainerX, {
                backgroundColor: colors.white,
                paddingHorizontal: 10,
                paddingTop: paddingTopMul()
            }]}>
                <View style={{
                    backgroundColor: 'white'
                }}>
                    <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 8, flexDirection: 'row' }}>
                        <View style={[nstyles.nIcon35, { justifyContent: 'center', alignItems: 'center', }]}>
                            <TouchableOpacity
                                style={{ padding: 10 }}
                                onPress={() => Utils.goback(this)}>
                                <Image
                                    source={Images.icBack}
                                    style={[nstyles.nIcon20, { tintColor: colors.colorGrayIcon }]} />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: reText(17), fontWeight: '700' }}>Chi ti???t x??? ph???t h??nh ch??nh </Text>
                    </View>
                    <View style={{ height: 1, backgroundColor: colors.black_11, }}></View>
                </View>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps='always'
                    showsVerticalScrollIndicator={false}
                    style={{ marginTop: 10 }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                        <View style={{ height: 1, backgroundColor: colors.redStar, flex: 1 }} />
                        <Text style={{ fontSize: reText(18), fontWeight: 'bold', color: colors.redStar }}>Th??ng tin c?? nh??n vi ph???m</Text>
                        <View style={{ height: 1, backgroundColor: colors.redStar, flex: 1 }} />
                    </View>
                    <View style={{ borderWidth: 1, paddingHorizontal: 10, borderColor: colors.black_30, marginVertical: 10, paddingTop: 10, borderRadius: 3 }}>
                        {this.renderItem('C?? nh??n/T??? ch???c vi ph???m:', `${dataCTXP.ToChucViPham ? dataCTXP.ToChucViPham : '---'}`)}
                        {this.renderItem('Ch???ng minh nh??n d??n/C??n c?????c:', `${dataCTXP.CMND ? dataCTXP.CMND : '---'}`)}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            {this.renderItem('Ng??y sinh:', `${dataCTXP.NgaySinh ? moment(dataCTXP.NgaySinh, 'DD/MM/YYYY').format('DD/MM/YYYY') : '---'}`)}
                            {this.renderItem('Gi???i t??nh:', `${dataCTXP?.GioiTinh == "False" ? 'Nam' : 'N???'}`)}
                        </View>
                        {this.renderItem('Nguy??n qu??n:', `${dataCTXP.NguyenQuan ? dataCTXP.NguyenQuan : '---'}`, styleValue = { width: isIphoneX() || Platform.OS == 'android' ? 270 : 240 })}
                        {this.renderItem('Qu???c t???ch:', `${dataCTXP.TenQuocTich ? dataCTXP?.TenQuocTich : '---'}`)}
                        {this.renderItem('?????a ch??? hi???n t???i:', `${dataCTXP.DiaChiHienTai ? dataCTXP.DiaChiHienTai : '---'}`, styleValue = { width: isIphoneX() || Platform.OS == 'android' ? 260 : 220 })}
                    </View>
                    {/* Bi??n b???n */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                        <View style={{ height: 1, backgroundColor: colors.redStar, flex: 1 }} />
                        <Text style={{ fontSize: reText(18), fontWeight: 'bold', color: colors.redStar }}>Th??ng tin bi??n b???n</Text>
                        <View style={{ height: 1, backgroundColor: colors.redStar, flex: 1 }} />
                    </View>
                    <View style={{ borderWidth: 1, paddingHorizontal: 10, borderColor: colors.black_30, marginVertical: 10, paddingTop: 10, borderRadius: 3 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            {this.renderItem('M?? ????n:', `${dataCTXP.MaDon ? dataCTXP.MaDon : '---'}`, styleValue = { color: colors.redStar, marginRight: 5, maxWidth: 120 })}
                            {this.renderItem('Tr???ng th??i:', `${dataCTXP.TenTrangThai ? dataCTXP.TenTrangThai : '---'}`, styleValue = { color: dataCTXP.Status == 2 ? colors.greenFE : colors.colorBlueLight, fontWeight: 'bold', maxWidth: 100 })}
                        </View>
                        {this.renderItem('L??nh v???c:', `${dataCTXP.TenLinhVuc ? dataCTXP.TenLinhVuc : '---'}`, styleValue = { width: Width(75) })}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            {this.renderItem('H??nh vi vi ph???m :', `${dataCTXP.HanhVi ? dataCTXP.HanhVi : '---'}`, styleValue = { width: isIphoneX() ? Width(60) : Width(55) })}
                        </View>
                        {this.renderItem('Ng??y quy???t ?????nh x??? ph???t c?? hi???u l???c:', `${dataCTXP.NgayHieuLuc ? moment(dataCTXP.NgayHieuLuc, 'DD/MM/YYYY').format('DD/MM/YYYY') : '---'}`)}
                        {this.renderItem('C??n c??? ph??p l?? x??? ph???t:', `${dataCTXP.CanCuPhapLy ? dataCTXP.CanCuPhapLy : '---'}`)}
                        {this.renderItem('H??nh th???c x??? ph???t b??? sung:', `${dataCTXP.BoSung ? dataCTXP.BoSung : '---'}`)}
                        {this.renderItem('Bi???n ph??p ng??n ch???n v?? ?????m b???o:', `${dataCTXP.BienPhap ? dataCTXP.BienPhap : '---'}`, styleValue = { width: isIphoneX() || Platform.OS == 'android' ? 140 : 100 })}
                        {this.renderItem('T???ng m???c ti???n ph???t:', `${dataCTXP.TongMucPhat ? Utils.inputMoney(dataCTXP.TongMucPhat) : '---'}`, styleValue = { color: colors.redpink })}
                    </View>
                    {/* T??? ch???c */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                        <View style={{ height: 1, backgroundColor: colors.redStar, flex: 1 }} />
                        <Text style={{ fontSize: reText(18), fontWeight: 'bold', color: colors.redStar }}>Th??ng tin t??? ch???c thi h??nh</Text>
                        <View style={{ height: 1, backgroundColor: colors.redStar, flex: 1 }} />
                    </View>
                    <View style={{ borderWidth: 1, paddingHorizontal: 10, borderColor: colors.black_30, marginVertical: 10, paddingTop: 10, borderRadius: 3, }}>
                        {this.renderItem('????n v??? thi h??nh:', `${dataCTXP.TenDonVi ? dataCTXP.TenDonVi : '---'}`, styleValue = { width: isIphoneX() || Platform.OS == 'android' ? 260 : 220 })}
                        {this.renderItem('C?? nh??n quy???t ?????nh x??? ph???t:', `${dataCTXP.TenCaNhanQDXP ? dataCTXP.TenCaNhanQDXP : '---'}`)}
                        {this.renderItem('Ng??y ra quy???t ?????nh:', `${dataCTXP.CreatedDate ? moment(dataCTXP.CreatedDate, 'DD/MM/YYYY').format('DD/MM/YYYY') : '---'}`)}
                        {this.renderItem('C?? quan thi h??nh:', `${dataCTXP.TenCoQuanThiHanh ? dataCTXP.TenCoQuanThiHanh : '---'}`, styleValue = { width: isIphoneX() || Platform.OS == 'android' ? 250 : 200 })}
                        {this.renderItem('C?? nh??n c?? tr??ch nhi???m TCTH:', `${dataCTXP.TenCaNhanThiHanh ? dataCTXP.TenCaNhanThiHanh : '---'}`)}
                    </View>


                    {/* File */}
                    <View style={{ marginHorizontal: 10, marginTop: 20, flexDirection: 'row', alignItems: 'center' }} >
                        <View style={{ height: 1, backgroundColor: colors.colorBlueLight, flex: 1 }} />
                        <Text style={{ fontWeight: 'bold', color: colors.colorBlueLight }}>
                            File ????nh k??m
                            </Text>
                        <View style={{ height: 1, backgroundColor: colors.colorBlueLight, flex: 1 }} />
                    </View>
                    <ImagePicker data={dataCTXP.ListFileDinhKem ? dataCTXP.ListFileDinhKem.map(item => { return { ...item, Link: appConfig.domain + item.Link } }) : []}
                        NumberMax={4}
                        isEdit={false}
                        keyname={"TenFile"} uniqueKey={'Link'} nthis={this}
                        // onDeleteFileOld={(data) => {
                        //     let dataNew = [...ListFileDinhKemDelete].push(data)
                        //     this.setState({ ListFileDinhKemDelete: dataNew })
                        // }}
                        // onAddFileNew={(data) => {
                        //     this.setState({ ListFileDinhKemNew: data })
                        // }}
                        ShowTitle={false}
                    >

                    </ImagePicker>
                </KeyboardAwareScrollView>
                <IsLoading />
            </View>
        )
    }
}

export default ChiTietXPHC
