import React, { Component, Fragment } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
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
import { IsLoading, HeaderCom } from '../../../components'
import apis from '../../apis'
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
        let res = await apis.ApiXuLyHanhChinh.GetDetail_HanhChinh_CD(this.IdXuPhat);
        Utils.nlog("Hoàng1", res)
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
                <Text numberOfLines={3} style={[{ fontSize: reText(12), marginLeft: 5 }, styleValue]}>{Value}</Text>
            </View>
        )
    }
    // _showDanhSachFile = (arrLink = []) => {
    //     Utils.goscreen(this, 'Modal_FileAttachedDH', { data: arrLink })
    // }
    render() {
        const { dataCTXP } = this.state;
        return (
            <View style={nstyles.ncontainer}>
                <HeaderCom
                    nthis={this}
                    titleText={'Chi tiết xử phạt hành chính'}
                    iconLeft={Images.icBack}
                    iconRight={null}
                    onPressLeft={() => Utils.goback(this)} />
                {/* <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 8, flexDirection: 'row' }}>
                        <View style={[nstyles.nIcon35, { justifyContent: 'center', alignItems: 'center', }]}>
                            <TouchableOpacity
                                style={{ padding: 10 }}
                                onPress={() => Utils.goback(this)}>
                                <Image
                                    source={Images.icBack}
                                    style={[nstyles.nIcon20, { tintColor: colors.colorGrayIcon }]} />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: reText(17), fontWeight: '700' }}>Chi tiết xử phạt hành chính </Text>
                    </View> */}
                <View style={{ height: 1, backgroundColor: colors.black_11, }}></View>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps='always'
                    showsVerticalScrollIndicator={false}
                    style={{ paddingHorizontal: 15, backgroundColor: colors.white, paddingTop: 15 }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                        <View style={{ height: 1, backgroundColor: colors.redStar, flex: 1 }} />
                        <Text style={{ fontSize: reText(18), fontWeight: 'bold', color: colors.redStar }}>Thông tin Cá nhân/ Tổ chức vi phạm</Text>
                        <View style={{ height: 1, backgroundColor: colors.redStar, flex: 1 }} />
                    </View>
                    <View style={{ borderWidth: 1, paddingHorizontal: 10, borderColor: colors.black_30, marginVertical: 10, paddingTop: 10, borderRadius: 3 }}>
                        {!dataCTXP.CaNhan ? this.renderItem('Tên công ty:', `${dataCTXP.TenCongTy ? dataCTXP.TenCongTy : '---'}`) : null}
                        {!dataCTXP.CaNhan ? this.renderItem('Mã doanh nghiệp:', `${dataCTXP.MaSoThue ? dataCTXP.MaSoThue : '---'}`) : null}
                        {this.renderItem(dataCTXP.CaNhan ? 'Cá nhân vi phạm:' : 'Người đại diện', `${dataCTXP.ToChucViPham ? dataCTXP.ToChucViPham : '---'}`)}
                        {this.renderItem('Chứng minh nhân dân/Căn cước:', `${dataCTXP.CMND ? dataCTXP.CMND : '---'}`)}
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}> */}
                        {this.renderItem('Ngày sinh:', `${dataCTXP.NgaySinh ? moment(dataCTXP.NgaySinh, 'DD/MM/YYYY').format('DD/MM/YYYY') : '---'}`)}
                        {/* {this.renderItem('Giới tính:', `${dataCTXP?.GioiTinh == 0 ? 'Nam' : 'Nữ'}`)} */}
                        {/* </View> */}
                        {this.renderItem('Nguyên quán:', `${dataCTXP.NguyenQuan ? dataCTXP.NguyenQuan : '---'}`, styleValue = { width: isIphoneX() || Platform.OS == 'android' ? 270 : 240 })}
                        {this.renderItem('Quốc tịch:', `${dataCTXP.TenQuocTich ? dataCTXP?.TenQuocTich : '---'}`)}
                        {this.renderItem('Địa chỉ hiện tại:', `${dataCTXP.DiaChiHienTai ? dataCTXP.DiaChiHienTai : '---'}`, styleValue = { width: isIphoneX() || Platform.OS == 'android' ? 260 : 220 })}
                    </View>
                    {/* Biên bản */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                        <View style={{ height: 1, backgroundColor: colors.redStar, flex: 1 }} />
                        <Text style={{ fontSize: reText(18), fontWeight: 'bold', color: colors.redStar }}>Thông tin biên bản</Text>
                        <View style={{ height: 1, backgroundColor: colors.redStar, flex: 1 }} />
                    </View>
                    <View style={{ borderWidth: 1, paddingHorizontal: 10, borderColor: colors.black_30, marginVertical: 10, paddingTop: 10, borderRadius: 3 }}>
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}> */}
                        {this.renderItem('Mã đơn:', `${dataCTXP.MaDon ? dataCTXP.MaDon : '---'}`, styleValue = { color: colors.redStar, marginRight: 5 })}
                        {this.renderItem('Lĩnh vực:', `${dataCTXP.TenLinhVuc ? dataCTXP.TenLinhVuc : '---'}`, styleValue = { width: Width(70) })}
                        {/* </View> */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            {this.renderItem('Hành vi vi phạm :', `${dataCTXP.HanhVi ? dataCTXP.HanhVi : '---'}`, styleValue = { width: 250 })}
                        </View>
                        {this.renderItem('Ngày quyết định xử phạt có hiệu lực:', `${dataCTXP.NgayHieuLuc ? moment(dataCTXP.NgayHieuLuc, 'DD/MM/YYYY').format('DD/MM/YYYY') : '---'}`)}

                        {this.renderItem('Căn cứ pháp lý xử phạt:', `${dataCTXP.CanCuPhapLy ? dataCTXP.CanCuPhapLy : '---'}`)}
                        {this.renderItem('Hình thức xử phạt bổ sung:', `${dataCTXP.BoSung ? dataCTXP.BoSung : '---'}`)}
                        {this.renderItem('Biện pháp ngăn chặn và đảm bảo:', `${dataCTXP.BienPhap ? dataCTXP.BienPhap : '---'}`, styleValue = { width: isIphoneX() || Platform.OS == 'android' ? 140 : 100 })}
                        {this.renderItem('Tổng mức tiền phạt:', `${dataCTXP.TongMucPhat ? Utils.inputMoney(dataCTXP.TongMucPhat) : '---'}`, styleValue = { color: colors.redpink })}
                        {this.renderItem('Trạng thái:', `${dataCTXP.TenTrangThai ? dataCTXP.TenTrangThai : '---'}`, styleValue = { color: dataCTXP.Status == 2 ? colors.greenFE : colors.colorBlueLight, fontWeight: 'bold' })}

                    </View>
                    {/* Tổ chức */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                        <View style={{ height: 1, backgroundColor: colors.redStar, flex: 1 }} />
                        <Text style={{ fontSize: reText(18), fontWeight: 'bold', color: colors.redStar }}>Thông tin tổ chức thi hành</Text>
                        <View style={{ height: 1, backgroundColor: colors.redStar, flex: 1 }} />
                    </View>
                    <View style={{ borderWidth: 1, paddingHorizontal: 10, borderColor: colors.black_30, marginVertical: 10, paddingTop: 10, borderRadius: 3, }}>
                        {this.renderItem('Cấp có thẩm quyền QĐXP:', `${dataCTXP.TenDonVi ? dataCTXP.TenDonVi : '---'}`, styleValue = { width: isIphoneX() || Platform.OS == 'android' ? 260 : 220 })}
                        {this.renderItem('Cá nhân quyết định xử phạt:', `${dataCTXP.TenCaNhanQDXP ? dataCTXP.TenCaNhanQDXP : '---'}`)}
                        {/* {this.renderItem('Cơ quan thi hành:', `${dataCTXP.TenCoQuanThiHanh ? dataCTXP.TenCoQuanThiHanh : '---'}`, styleValue = { width: isIphoneX() || Platform.OS == 'android' ? 250 : 200 })} */}
                        {this.renderItem('Cá nhân có trách nhiệm TCTH:', `${dataCTXP.TenCaNhanThiHanh ? dataCTXP.TenCaNhanThiHanh : '---'}`)}
                    </View>


                    {/* File */}
                    <View style={{ marginHorizontal: 10, marginTop: 20, flexDirection: 'row', alignItems: 'center' }} >
                        <View style={{ height: 1, backgroundColor: colors.colorBlueLight, flex: 1 }} />
                        <Text style={{ fontWeight: 'bold', color: colors.colorBlueLight }}>
                            File đính kèm
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
