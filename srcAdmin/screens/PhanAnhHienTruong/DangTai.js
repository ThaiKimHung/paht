import React, { Component } from 'react';
import { View } from 'react-native';
import Utils from '../../../app/Utils';
import { nstyles, colors, sizes, styles } from '../../../styles';
import ButtonCus from '../../../components/ComponentApps/ButtonCus';
import { Width, Height } from '../../../styles/styles';
import HeaderModal from './components/HeaderModal';
import ItemNoiDung from './components/ItemNoiDung';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Apis from '../../apis'

import apis from '../../apis';
import FileCom from './components/FileCom';
import { nGlobalKeys } from '../../../app/keys/globalKey';


class DangTai extends Component {
    constructor(props) {
        super(props);
        this.data = Utils.ngetParam(this, 'data', {})//body
        this.action = Utils.ngetParam(this, 'action', {})//dataButton
        this.state = {
            noidung: '',
            arrVideo: [],
            arrApplication: [],

            arrImage: [],
            arrAplicaton: [],
            arrFileDelete: []
        };

    }
    goback = () => {
        Utils.goback(this)
    }
    _XuLiPhanAnh = async () => {
        Utils.nlog("gia tri action", this.action)
        this.data.ActionFormChon = this.action
        let LstImg = [], arrVideo = [];
        var { arrImage, arrAplicaton } = this.state//list image
        for (let index = 0; index < arrImage.length; index++) {
            let item = arrImage[index];
            let checkImage = Utils.checkIsImage(item.Path) || Utils.checkIsImage(item.filename) || Utils.checkIsImage(item.name);
            if (checkImage == true || item.isImage == true || item.timePlay == 0) {

                let downSize = 1;
                if (item.height >= 2000 || item.width >= 2000) {
                    downSize = 0.3;
                }
                let strBase64 = await Utils.parseBase64(item.uri, item.height, item.width, downSize, item?.timePlay);
                LstImg.push({
                    "type": item.timePlay == 0 ? 1 : 2,
                    "strBase64": strBase64,
                    "filename": "hinh" + index + ".png",
                    "extension": ".png",
                    "isnew": true
                });
            } else {
                if (Platform.OS == 'android') {
                    arrVideo.push(item);
                } else {
                    let downSize = 1;
                    if (item.height >= 2000 || item.width >= 2000) {
                        downSize = 0.3;
                    }
                    let strBase64 = await Utils.parseBase64(item.uri, item.height, item.width, downSize, item?.timePlay);
                    LstImg.push({
                        "type": 2,
                        "strBase64": strBase64,
                        "filename": `Video_${index}${Platform.OS == 'ios' ? ".mov" : ".mp4"}`,// ("Video_" + index + Platform.OS == 'ios' ? ".mov" : ".mp4"),
                        "extension": Platform.OS == 'ios' ? ".mov" : ".mp4",
                        "isnew": true
                    });
                }
            }
        }
        for (let index = 0; index < arrAplicaton.length; index++) {
            let item = arrAplicaton[index];
            let strBase64;
            // strBase64 = await Utils.parseBase64(item.uri);
            if (item.uri) {
                var duoiFile = item?.TenFile.split('.')
                var fi = "." + duoiFile[duoiFile.length - 1]
                Utils.nlog("gia trị duôi file", fi)
                LstImg.push({
                    "type": 2,
                    "strBase64": item.base64,
                    "filename": item.name,
                    "extension": fi,
                    "isnew": true
                });
            }
        }
        var body = {
            ...this.data,
            // ...this.CTPA,

            NoiDungXL: this.state.noidung,
            UploadPA: LstImg,
        }
        const res = await apis.Auto.XuLyQuyTrinhPhanAnh(body);
        Utils.nlog("gia tri res xu li phan anh", res)
        if (res.status == 1) {
            //Thong bao thanh cong, CALLBACK ve homepaht
            // Utils.showMsgBoxOK(this, "Thông báo", res.error.message)
            if (res.status == 1) {
                Utils.showMsgBoxOK(this, "Thông báo", res.error.message, "Xác nhận", () => {
                    ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome();
                    Utils.goscreen(this, "scHomePAHT");
                })

            }
        }
        else {
            Utils.showMsgBoxOK(this, "Thông báo", res.error.message, 'Xác nhận')
        }
    }
    _huyPhanAnh = async () => {
        if (this.state.noidung == '') {
            Utils.showMsgBoxOK(this, "Thông báo", "Vui lòng nhập nội dung hủy.", 'Xác nhận');
            return;
        }
        const body = {
            ...this.CTPA,
            ActionFormChon: this.ActionData,
            NoiDungXL: this.state.noidung,
            UploadPA: this.state.UploadPA
        }
        // Utils.nlog('body huy', body)
        let res = await Apis.Auto.XuLyQuyTrinhPhanAnh(body);
        if (res.status == 1) {
            //Thong bao thanh cong, CALLBACK ve homepaht
            Utils.showMsgBoxOK(this, "Thông báo", res.error.message, 'Xác nhận')
            // Utils.nlog('result cancel', res)
        }
        else {
            Utils.showMsgBoxOK(this, "Thông báo", res.error.message, 'Xác nhận')
        }
    }
    onChangeNoiDung = (text) => {
        this.setState({ noidung: text })
    }




    _UpdateFile = (arrImage = [], arrAplicaton = [], arrFileDelete = []) => {
        Utils.nlog("vao set File Upload", arrImage, arrAplicaton)
        this.setState({ arrImage, arrAplicaton, arrFileDelete });
    }
    render() {
        // Utils.nlog('dataBody', this.CTPA)
        // Utils.nlog('action', this.ActionData)
        var { LstDVXL, CaNhanToChuc, DienThoai, Email, DiaChi, TieuDe, NoiDung, DiaChiSuKien,
            Log, Lat, ChiTietNguon, CongKhai, arrImage, arrVideo, arrApplication, dataPhanAnh } = this.state
        return (

            <View style={[{ flex: 1, justifyContent: 'center' }]} >
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center',
                }} onTouchEnd={this.goback} />
                <View style={{
                    backgroundColor: colors.white,
                    flex: 1, marginTop: nstyles.Height(5), borderTopLeftRadius: 30, borderTopRightRadius: 30
                }}>
                    <HeaderModal
                        title={this.action.ButtonText}
                        _onPress={this.goback}
                    />
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                        <ItemNoiDung
                            textTieuDe='Nội dung đăng tải'
                            placeholder={`Nội dung`}
                            multiline={true}
                            //stNoiDung={{ marginLeft: -10 }}
                            numberOfLines={2}
                            stTitle={{ marginLeft: 15 }}
                            stConaier={{ paddingVertical: 0 }}
                            onChangeText={(text) => this.onChangeNoiDung(text)}
                            stContaierTT={{ backgroundColor: colors.veryLightPink, width: Width(90), marginLeft: 15 }}
                        />

                        <View style={{ paddingVertical: 20, marginLeft: 15 }}>
                            <FileCom arrFile={[]} nthis={this} setFileUpdate={this._UpdateFile} />
                        </View>

                        <View>
                            <ButtonCus
                                onPressB={this._openFile}
                                stContainerR={{
                                    width: Width(35), borderRadius: 2, paddingVertical: 15,
                                    backgroundColor: colors.peacockBlue, marginTop: 27,
                                    alignSelf: 'center', justifyContent: 'flex-start',
                                    marginLeft: 15
                                }}
                                textTitle={`Chọn file`}
                            />
                        </View>
                        <View style={{
                            height: 2, width: Width(90),
                            backgroundColor: colors.veryLightPink, marginTop: 30, marginLeft: 15
                        }}></View>
                        <ButtonCus
                            textTitle={`Đăng tải`}
                            onPressB={this._XuLiPhanAnh}
                            stContainerR={{ marginTop: 20.5, marginLeft: 15, marginBottom: 30 }}
                        />
                    </KeyboardAwareScrollView>
                </View>
            </View >
        );
    }
}
export default DangTai
