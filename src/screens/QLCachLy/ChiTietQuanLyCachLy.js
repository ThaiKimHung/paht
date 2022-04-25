
import React, { Component, createRef } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, TextInput, BackHandler, ScrollView } from 'react-native'
import Utils, { icon_typeToast } from '../../../app/Utils'
import { HeaderCus, ListEmpty, DatePick } from '../../../components'
import ButtonCom from '../../../components/Button/ButtonCom';
import { colors } from '../../../styles'
import { reText, sizes } from '../../../styles/size'
import { Width, nstyles } from '../../../styles/styles'
import apis from '../../apis'
import { Images } from '../../images'
import IsLoading from '../../../components/IsLoading';
import ImageCus from '../../../components/ImageCus';
import moment from 'moment'

import { appConfig } from '../../../app/Config';
import { getBottomSpace } from 'react-native-iphone-x-helper';

class ChiTietQuanLyCachLy extends Component {
    constructor(props) {
        super(props);
        this.item = Utils.ngetParam(this, 'item', {})
        this.state = {
            text: '',
            data: [],
            refreshing: true,
            textempty: 'Đang tải...',

            page: { Page: 1, AllPage: 1, Size: 10, Total: 1 }
        };
        this.refLoading = createRef()
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goback(this)
        return true
    }

    remind = (item) => {
        Utils.showMsgBoxYesNo(this, "Gửi thông báo chuyển bệnh nặng", "Bạn có chắc muốn gửi thông báo này?", "Xác nhận", "Xem lại", async () => {
            let body = {
                "HoTen": item?.FullName,
                "PhoneNumber": item?.PhoneNumber_CD,
                "DiaChi": item?.DiaChi_CD
            }
            this.refLoading.current.show()
            let res = await apis.apiQuanLyCachLy.NhacNhoBenhNhanChuyenBienNang(body)
            Utils.nlog(res)
            this.refLoading.current.hide()
            if (res?.status == 1) {
                Utils.showToastMsg("Thông báo", "Gửi thông báo thành công.", icon_typeToast.success);
            } else {
                Utils.showToastMsg("Thông báo", "Gửi thông báo thất bại", icon_typeToast.warning);
            }
        });
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <HeaderCus
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`Thông tin chi tiết`}
                    styleTitle={{ color: colors.white, fontSize: reText(15) }}
                />

                {/* Thêm comment */}
                <View style={{ flex: 1, paddingBottom: getBottomSpace() }}>
                    <ScrollView style={[nstyles.ncontainer, { backgroundColor: colors.white, flex: 0, padding: 10 }]} contentContainerStyle={{ paddingBottom: 30 }}>
                        <View style={[nstyles.nAva120, { backgroundColor: colors.BackgroundHome, marginTop: 5, alignSelf: 'center' }]}>
                            <ImageCus
                                defaultSourceCus={Images.imgAvatar}
                                source={this.item?.Avata ? { uri: appConfig.domain + this.item?.Avata } : Images.imgAvatar}
                                style={[nstyles.nAva120, { alignSelf: 'center' }]}
                                resizeMode={'cover'} />
                        </View>
                        <TextLine title={'Họ và tên'} value={this.item?.HoTen ? this.item?.HoTen : this.item?.FullName} />
                        <TextLine title={'Giới tính'} value={this.item?.GioiTinhText ? this.item?.GioiTinhText : this.item?.GioiTinhText_CD} />
                        <TextLine title={'Số điện thoại'} value={this.item?.PhoneNumber ? this.item?.PhoneNumber : this.item?.PhoneNumber_CD} />
                        <TextLine title={'Địa chỉ'} value={this.item?.DiaChi ? this.item?.DiaChi : this.item?.DiaChi_CD} />
                        <TextLine title={'CMND'} value={this.item?.CMND ? this.item?.CMND : this.item?.CMND_CD} />
                        <TextLine title={'Tình trạng sức khoẻ'} value={this.item?.TinhTrangSucKhoe ? this.item?.TinhTrangSucKhoe : ''} styleValue={{ color: colors.redStar }} />
                        <TextLine title={'Cấp bệnh nhân'} value={this.item?.TinhTrangSucKhoe ? this.item?.CapBenhNhan : ''} styleValue={{ color: colors.redStar }} />
                        {/* <TouchableOpacity onPress={() => this.remind(item)} style={{ backgroundColor: colors.redFresh, alignSelf: 'flex-end', padding: 10, margin: 5, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={Images.icThongbao} style={[nstyles.nIcon20, { tintColor: colors.white }]} resizeMode={'contain'} />
                            <Text style={{ color: colors.white, fontWeight: 'bold', paddingHorizontal: 5 }}>{'Thông báo bệnh nặng'}</Text>
                        </TouchableOpacity> */}
                    </ScrollView>
                </View>
            </View>
        );
    }
}
const TextLine = (props) => {
    let { title = '', value = '', styleValue, styleTitle } = props
    return (
        <View {...props} style={{ backgroundColor: colors.white, alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.grayLight }}>
            <Text style={[{ fontWeight: '300', fontSize: reText(14), color: '#8F9294' }, styleTitle]}>{title}</Text>
            <Text style={[{ fontSize: reText(14), fontWeight: '400', textAlign: 'justify', marginTop: 10, marginHorizontal: 10 }, styleValue]}>{value}</Text>
        </View>
    )
}
export default ChiTietQuanLyCachLy

const stChiTietQuanLyCachLy = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.BackgroundHome,

    },
})
