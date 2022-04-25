import React, { Component } from 'react'
import { Text, View, StyleSheet, Platform, Alert } from 'react-native'
import Utils from '../../../../app/Utils';
import ImageCus from '../../../../components/ImageCus';
import TextApp from '../../../../components/TextApp';
import { colorsSVL } from '../../../../styles/color';
import FontSize from '../../../../styles/FontSize';
import { reText } from '../../../../styles/size';
import { Height, nstyles } from '../../../../styles/styles';
import ButtonSVL from '../../components/ButtonSVL';
import { ImagesSVL } from '../../images';

export default class YeuCauTao extends Component {
    constructor(props) {
        super(props);
        this.imageYCT_Basic = Utils.ngetParam(this, '_image', ImagesSVL.imgNonRecruitment)
        this.title = Utils.ngetParam(this, '_title', 'Bạn chưa có tin tuyển dụng nào?')
        this.subTitle = Utils.ngetParam(this, '_subTitle', 'Đăng tin tuyển dụng chỉ có 4 bước!!')
        this.titleButtonRight = Utils.ngetParam(this, '_titleButtonRight', 'Đăng tin ngay')
        this.titleButtonLeft = Utils.ngetParam(this, '_titleButtonLeft', 'Đóng')
        this.actionButtonRight = Utils.ngetParam(this, '_actionButtonRight', this._goscreen)
        this.actionButtonLeft = Utils.ngetParam(this, '_actionButtonLeft', this._goback)
    }

    _goback = () => {
        Utils.goback(this)
    }
    _goscreen = () => {
        // Alert.alert('Thông báo', 'Đăng tin ngay')
    }
    componentDidMount() {
    }

    render() {
        // let { _image, _title, _subTitle } = this.props.state
        Utils.nlog(this.props.navigation.state)
        return (
            <View style={[stYeuCauTao.stContainer]}>
                <View
                    // view có absolute để ẩn view
                    onTouchEnd={() => { this._goback() }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)' }}></View>
                <View style={{
                    flex: 1,
                    borderRadius: 5,
                    marginHorizontal: 10,
                    backgroundColor: colorsSVL.white,
                    height: Platform.OS == 'ios' ? Height(55) : Height(64),
                    position: 'absolute', left: 0, right: 0,
                    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10
                }}>
                    <ImageCus
                        defaultSourceCus={this.imageYCT_Basic}
                        style={[stYeuCauTao.stImage]}
                        resizeMode='cover'
                    />
                    <TextApp numberOfLines={2} style={[stYeuCauTao.stTextTitle]}>{this.title}</TextApp>
                    <TextApp numberOfLines={2} style={[stYeuCauTao.stTextSubTitle]}>{this.subTitle}</TextApp>
                    <View style={[stYeuCauTao.stViewButton]}>
                        <ButtonSVL
                            onPress={this.actionButtonLeft}
                            style={[stYeuCauTao.stButtonDong]}
                            styleText={{ fontSize: reText(18), color: colorsSVL.black }}
                            text={this.titleButtonLeft}
                            colorText={"black"}
                        />
                        <View style={{ width: FontSize.scale(11) }} />
                        <ButtonSVL
                            onPress={this.actionButtonRight}
                            style={[stYeuCauTao.stButtonDangTin]}
                            styleText={{ fontSize: reText(18), color: colorsSVL.white }}
                            text={this.titleButtonRight}
                            colorText={colorsSVL.white}
                        />
                    </View>

                </View>
            </View>
        )
    }
}

const stYeuCauTao = StyleSheet.create({
    stContainer: {
        flex: 1,
        alignItems: 'center', justifyContent: 'center'
        // backgroundColor: colorsSVL.grayBgrInput,
    },
    stTextTitle: {
        fontSize: reText(18), fontWeight: Platform.OS == 'ios' ? '700' : 'bold', marginTop: 31, textAlign: 'center'
    },
    stTextSubTitle: {
        fontSize: reText(18), fontWeight: Platform.OS == 'ios' ? '700' : 'bold', marginTop: 20, color: colorsSVL.organeMainSVL
    },
    stViewButton: {
        flexDirection: 'row', marginTop: 58, marginBottom: 25
    },
    stImage: {
        width: FontSize.scale(163), height: FontSize.scale(140), marginTop: 20
    },
    stView: {
        alignItems: 'center', justifyContent: 'center', backgroundColor: colorsSVL.white, width: '100%', borderRadius: 5
    },
    stButtonDong: {
        backgroundColor: colorsSVL.grayBgrInput, paddingVertical: 10, paddingHorizontal: 55,
    },
    stButtonDangTin: {
        backgroundColor: colorsSVL.blueMainSVL, paddingVertical: 10, paddingHorizontal: 20,
    }
})

