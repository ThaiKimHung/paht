import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Platform, StyleSheet, Alert } from 'react-native'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { appConfig } from '../../../../app/Config'
import Utils from '../../../../app/Utils'
import ImageCus from '../../../../components/ImageCus'
import TextApp from '../../../../components/TextApp'
import { colorsSVL, colors } from '../../../../styles/color'
import FontSize from '../../../../styles/FontSize'
import { reText } from '../../../../styles/size'
import { Height, nstyles, Width } from '../../../../styles/styles'
import { Images } from '../../../images'
import { NopCV } from '../../apis/apiSVL'
import ButtonSVL from '../../components/ButtonSVL'
import { ImagesSVL } from '../../images'

export default class Modal_ConfirmDelTD extends Component {
    constructor(props) {
        super(props)
        this.item = Utils.ngetParam(this, 'item', '')
        this.title = Utils.ngetParam(this, 'title', '')
        this.isDel = Utils.ngetParam(this, 'isDel', false)
        this.callback = Utils.ngetParam(this, 'callback', () => { });

    }

    _goback = () => {
        Utils.goback(this)
    }

    NopHoSo = () => {
        if (this.isDel) {
            this.callback(this.item);
            Utils.goback();
            return;
        }
        this.actionSubmit()
    }

    actionSubmit = async () => {
        let obj =
        {
            "IdDoanhNghiep": 8,
            "IdTinTuyenDung": 1,
            "IdCV": this.item.IdCV
        }
        let res = await NopCV(obj)
        Utils.nlog('ress', res)
        if (res.status == 1) {
            Utils.goscreen(this, 'Modal_ThongBao',
                {
                    title: "Hồ sơ của bạn đã nộp thành công. Công ty sẽ liên hệ và gửi thời gian phỏng vấn sớm nhất.",
                    titleButton: 'Đóng',
                    onThaoTac: () => {
                        Utils.goscreen(this, 'scViecTimNguoi');
                    }
                })
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn đã xoá thất bại', 'Chập nhận')
        }
    }

    TypeThoiGian = (key) => {
        switch (key) {
            case 0:
                {
                    return 'Toàn thời gian'
                }
            case 1:
                {
                    return 'Bán thời gian'
                }
            default:
                break;
        }
    }
 
    render() {
        Utils.nlog('thisItem.Avata : ',this.item?.Avata)
        let thoiGian = this.TypeThoiGian(this.item?.TypeCV)
        let DiaChi = this.item?.TenQuanHuyen + this.item?.TenTinhThanh
        const thumbnailUrl = this.item?.Avata ? appConfig.domain + `${this.item?.Avata}` : ''
        return (
            <View style={{ flex: 1 }}>
                <View
                    // view có absolute để ẩn view
                    onTouchEnd={() => { this._goback() }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)' }}></View>
                <View
                    style={[stModal_ConfirmDelTD.stContainer]}>
                    <View style={{ paddingVertical: 10, justifyContent: 'center', alignItems: 'center', }}>
                        <View style={{ height: 5, backgroundColor: 'grey', width: Width(30), borderRadius: 25 }} />
                    </View>
                    <View style={{ ...stModal_ConfirmDelTD.stView, marginTop: 33 }}>
                        <TextApp style={[stModal_ConfirmDelTD.stTextBold]}>Xác nhận</TextApp>
                    </View>
                    <View style={{ ...stModal_ConfirmDelTD.stView, marginHorizontal: 15 }}>
                        <TextApp numberOfLines={2} style={{ fontSize: reText(14), textAlign: 'center' }}>{this.title}</TextApp>
                    </View>
                    <View style={[stModal_ConfirmDelTD.stView]}>
                        <ImageCus
                            defaultSourceCus={Images.imgViettelTuyenDung}
                            source={{ uri: thumbnailUrl }}
                            style={nstyles.nIcon65}
                            resizeMode='contain'
                        />
                    </View>
                    <View style={[stModal_ConfirmDelTD.stViewNormal]}>
                        <TextApp numberOfLines={2} style={[stModal_ConfirmDelTD.stTextNameBold]}>{this.item.TieuDe}</TextApp>
                    </View>
                    <View style={[stModal_ConfirmDelTD.stViewNormal]}>
                        <TextApp numberOfLines={2} style={[stModal_ConfirmDelTD.stTextNormal]}>Tên doanh nghiệp : {this.item?.TenDoanhNghiep}</TextApp>
                    </View>
                    <View style={[stModal_ConfirmDelTD.stViewNormal]}>
                        <TextApp numberOfLines={2} style={[stModal_ConfirmDelTD.stTextNormal]}>Địa chỉ : {this.item?.DiaChi}</TextApp>
                    </View>
                    <View style={[stModal_ConfirmDelTD.stViewNormal]}>
                        <TextApp numberOfLines={2} style={[stModal_ConfirmDelTD.stTextNormal]}>Mức lương : {this.item?.MucLuong}</TextApp>
                    </View>
                  
                    <View style={[stModal_ConfirmDelTD.stViewBS]}>
                        <View style={[stModal_ConfirmDelTD.contTypeWork]}>
                            <TextApp numberOfLines={1} style={[stModal_ConfirmDelTD.lblTypeWork, { marginLeft: 5 }]}>
                                {this.item?.TypeTinTuyenDung == 0 ? 'Toàn thời gian' : 'Bán thời gian'}
                            </TextApp>
                        </View>
                        <View style={{ width: FontSize.scale(5) }} />
                        {
                            !this.item?.IsHienThi && <View
                                style={[stModal_ConfirmDelTD.contTypeWork, { marginLeft: 5 }]}>
                                <TextApp style={[stModal_ConfirmDelTD.lblTypeWork]}>{'Đã ẩn'}</TextApp>
                            </View>
                        }
                    </View>
                    <View style={{
                        flexDirection: 'row', flex: 1,
                        justifyContent: 'center', alignItems: 'center',
                        marginTop: 10,
                        marginBottom: Platform.OS === 'ios' ? getBottomSpace() + 10 : 12,
                    }} >
                        <ButtonSVL
                            onPress={this._goback}
                            style={{ backgroundColor: colorsSVL.grayBgrInput, paddingVertical: 12, flex: 1, }}
                            styleText={[stModal_ConfirmDelTD.stTextNameBold]}
                            text='Huỷ'
                            colorText={"black"}
                        />
                        <View style={{ width: FontSize.scale(11) }} />
                        <ButtonSVL
                            onPress={this.NopHoSo}
                            style={{ backgroundColor: colorsSVL.blueMainSVL, paddingVertical: 12, flex: 1, }}
                            styleText={[stModal_ConfirmDelTD.stTextNameBold]}
                            text='Xác nhận'
                            colorText={colorsSVL.white}
                        />
                    </View>
                    {/* </View> */}
                </View>
            </View>
        )
    }
}
const stModal_ConfirmDelTD = StyleSheet.create({
    stContainer: {
        flex: 1, paddingHorizontal: 10,
        borderTopLeftRadius: 15, borderTopRightRadius: 15,
        backgroundColor: colorsSVL.white,
        // height: Platform.OS == 'ios' ? Height(60) : Height(64),
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
    },
    stView: {
        alignItems: 'center', justifyContent: 'center', marginTop: 23
    },
    stViewNormal: {
        alignItems: 'center', justifyContent: 'center', marginTop: 8
    },
    stTextBold: {
        fontWeight: 'bold', fontSize: reText(18)
    },
    stTextNormal: {
        fontSize: reText(12),
    },
    stTextNameBold: {
        fontSize: reText(14), fontWeight: 'bold'
    },
    stViewBS: {
        marginTop: 8, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'
    },
    stViewBS1: {
        paddingVertical: 2,
        backgroundColor: colorsSVL.grayBgrInput,
        borderRadius: 5,
        paddingHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    stTextBS1: {
        fontSize: reText(12), color: colorsSVL.grayTextLight
    },
    stViewBS2: {
        paddingVertical: 2,
        backgroundColor: colorsSVL.white,
        borderColor: colorsSVL.organeMainSVL,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    stTextBS2: {
        fontSize: reText(12),
        color: colorsSVL.organeMainSVL
    },
    stViewButton: {
        flexDirection: 'row',
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    lblTypeWork: {
        fontSize: reText(11), color: '#828282', paddingHorizontal: 4
    },
    contTypeWork: { paddingHorizontal: 5, paddingVertical: 3, backgroundColor: colors.BackgroundHome, borderRadius: 10, marginTop: 5 }
})
