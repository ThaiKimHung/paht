import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Platform, StyleSheet, Alert } from 'react-native'
import { appConfig } from '../../../../app/Config'
import Utils from '../../../../app/Utils'
import ImageCus from '../../../../components/ImageCus'
import TextApp from '../../../../components/TextApp'
import { colorsSVL } from '../../../../styles/color'
import FontSize from '../../../../styles/FontSize'
import { reText } from '../../../../styles/size'
import { Height, nstyles, Width } from '../../../../styles/styles'
import { NopCV } from '../../apis/apiSVL'
import ButtonSVL from '../../components/ButtonSVL'
import { ImagesSVL } from '../../images'

class Modal_ConfirmDel extends Component {
    constructor(props) {
        super(props)
        this.item = Utils.ngetParam(this, 'item', '')
        this.title = Utils.ngetParam(this, 'title', '')
        this.isDel = Utils.ngetParam(this, 'isDel', false)
        this.callback = Utils.ngetParam(this, 'callback', () => { });
        this.dataDetails = Utils.ngetParam(this, 'dataDetails', '')
        console.log('dataDetails', this.dataDetails)
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
            "IdDoanhNghiep": this.dataDetails.IdDoanhNghiep,
            "IdTinTuyenDung": this.dataDetails.Id,
            "IdCV": this.item.IdCV
        }
        Utils.nlog('body', obj)
        let res = await NopCV(obj)
        Utils.nlog('ress', res)
        if (res.status == 1) {
            this.props.LoadListApplied()
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
                    break;
                }
            case 1:
                {
                    return 'Bán thời gian'
                    break;
                }
            default:
                break;
        }
    }

    render() {
        Utils.nlog('thisItem : ', this.item)
        const thumbnailUrl = this.item?.Avata ? appConfig.domain + `${this.item?.Avata}` : ''
        let thoiGian = this.TypeThoiGian(this.item?.TypeCV)
        let DiaChi = (this.item?.TenQuanHuyen ? this.item.TenQuanHuyen : '') + (this.item?.TenTinhThanh ? this.item?.TenTinhThanh : '')
        return (
            <View style={{ flex: 1 }}>
                <View
                    // view có absolute để ẩn view
                    onTouchEnd={() => { this._goback() }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)' }}></View>
                <View
                    style={[stModalConfirmDel.stContainer]}>
                    <View style={{ paddingVertical: 10, justifyContent: 'center', alignItems: 'center', }}>
                        <View style={{ height: 5, backgroundColor: 'grey', width: Width(30), borderRadius: 25 }} />
                    </View>
                    <View style={{ ...stModalConfirmDel.stView, marginTop: 33 }}>
                        <TextApp style={[stModalConfirmDel.stTextBold]}>Xác nhận</TextApp>
                    </View>
                    <View style={{ ...stModalConfirmDel.stView, marginHorizontal: 15 }}>
                        <TextApp numberOfLines={2} style={{ fontSize: reText(14), textAlign: 'center' }}>{this.title}</TextApp>
                    </View>
                    <View style={[stModalConfirmDel.stView]}>
                        <ImageCus
                            defaultSourceCus={ImagesSVL.icUser1}
                            source={{ uri: thumbnailUrl }}
                            style={nstyles.nAva60}
                            resizeMode='cover'
                        />
                    </View>
                    <View style={[stModalConfirmDel.stViewNormal]}>
                        <TextApp numberOfLines={2} style={[stModalConfirmDel.stTextNameBold]}>{this.item.HoTen}</TextApp>
                    </View>
                    <View style={[stModalConfirmDel.stViewNormal]}>
                        <TextApp numberOfLines={2} style={[stModalConfirmDel.stTextNormal]}>Nghành nghề : {this.item?.LoaiNganhNghe}</TextApp>
                    </View>
                    {
                        this.item?.MucLuongMongMuonFrom != null && this.item?.MucLuongMongMuonTo != null ? <View style={[stModalConfirmDel.stViewNormal]}>
                            <TextApp numberOfLines={2} style={[stModalConfirmDel.stTextNormal]}>Lương từ : {this.item?.MucLuongMongMuonFrom} - {this.item?.MucLuongMongMuonTo}</TextApp>
                        </View> : null
                    }

                    <View style={[stModalConfirmDel.stViewNormal]}>
                        <TextApp numberOfLines={2} style={[stModalConfirmDel.stTextNormal]}>Khu vực : {DiaChi}</TextApp>
                    </View>
                    <View style={[stModalConfirmDel.stViewBS]}>
                        <View style={[stModalConfirmDel.stViewBS1]}>
                            <TextApp numberOfLines={1} style={[stModalConfirmDel.stTextBS1]}>{thoiGian}</TextApp>
                        </View>
                        <View style={{ width: FontSize.scale(5) }} />
                        {
                            !this.item?.IsPublic ? null : <View
                                style={[stModalConfirmDel.stViewBS2]}>
                                <TextApp style={[stModalConfirmDel.stTextBS2]}>Hồ sơ công khai</TextApp>
                            </View>
                        }

                    </View>
                    <View style={[stModalConfirmDel.stViewButton]}>
                        <ButtonSVL
                            onPress={this._goback}
                            style={{ backgroundColor: colorsSVL.grayBgrInput, paddingVertical: 10, paddingHorizontal: 70, }}
                            styleText={[stModalConfirmDel.stTextNameBold]}
                            text='Huỷ'
                            colorText={"black"}
                        />
                        <View style={{ width: FontSize.scale(11) }} />
                        <ButtonSVL
                            onPress={this.NopHoSo}
                            style={{ backgroundColor: colorsSVL.blueMainSVL, paddingVertical: 10, paddingHorizontal: 50, }}
                            styleText={[stModalConfirmDel.stTextNameBold]}
                            text='Xác nhận'
                            colorText={colorsSVL.white}
                        />
                    </View>
                </View>
            </View>
        )
    }
}


const mapStateToProps = state => ({

});

export default Utils.connectRedux(Modal_ConfirmDel, null, true);

const stModalConfirmDel = StyleSheet.create({
    stContainer: {
        flex: 1, paddingHorizontal: 10, borderTopLeftRadius: 15,
        borderTopRightRadius: 15, backgroundColor: colorsSVL.white,
        height: Platform.OS == 'ios' ? Height(55) : Height(64),
        position: 'absolute', bottom: 0, left: 0, right: 0,

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
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
