import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import Utils from '../../../app/Utils';
import { nstyles, colors, sizes } from '../../../styles';
import HeaderModal from './components/HeaderModal';
import ItemNoiDung from './components/ItemNoiDung';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ButtonCus from '../../../components/ComponentApps/ButtonCus';
import { Width } from '../../../styles/styles';
import { IsLoading } from '../../../components';
import apis from '../../apis';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { nGlobalKeys } from '../../../app/keys/globalKey';
class ModalTraBuocTruoc extends Component {
    constructor(props) {
        super(props);
        this.data = Utils.ngetParam(this, "data", {})
        this.action = Utils.ngetParam(this, "action", {})
        this.callback = Utils.ngetParam(this, "callback", () => { });
        this.state = {
            arrVideo: [],
            arrImage: [],
            arrApplication: [],
            NoiDungXL: ''
        };
    }
    goback = () => {
        Utils.goback(this)
    }

    _XuLiPhanAnh = async () => {
        if (this.state.NoiDungXL == '') {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập nội dung bước xử lý", "Xác nhận");
            return;
        }
        nthisIsLoading.show();
        //Utils.nlog("gia tri action", this.action)
        this.data.ActionFormChon = this.action
        var body = {
            ...this.data,
            NoiDungXL: this.state.NoiDungXL,
        }
        //Utils.nlog("gia tri action")
        const res = await apis.Auto.XuLyQuyTrinhPhanAnh(body);
        //Utils.nlog("gia tri res xu li phan anh", res)
        if (res.status == 1) {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Thực hiện thành công", "Xác nhận", () => {
                if (ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome) {
                    ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome();
                }
                // Utils.goscreen(this, "scHomePAHT");
                try {
                    this.callback(this);
                } catch (error) {
                    Utils.goback(this);
                };
            })
        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", res.message ? res.message : "Thực hiện không thành công", "Xác nhận", () => {
                // ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome();
                // Utils.goscreen(this, "scHomePAHT");
            })
        }

    }

    render() {
        var { arrImage, arrApplication } = this.state
        Utils.nlog("Giá trị data:", this.data)
        Utils.nlog("Giá trị action:", this.action.ButtonText)
        Utils.nlog("Giá trị callback:", this.callback)
        return (
            <View style={[{ flex: 1, justifyContent: 'center' }]} >
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center',
                }} onTouchEnd={this.goback} />
                <View style={{
                    backgroundColor: colors.white,
                    flex: 1, marginTop: nstyles.Height(35), borderTopLeftRadius: 30, borderTopRightRadius: 30
                }}>

                    <HeaderModal
                        _onPress={() => Utils.goback(this)}
                        multiline={true}
                        title={this.action ? this.action.ButtonText : 'Trả bước trước'}
                    />
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                        <ItemNoiDung
                            value={this.state.NoiDungXL}
                            stNoiDung={{ fontSize: sizes.sizes.sText14, height: Width(10) }}
                            // textTieuDe="Nội dung trả"
                            textTieuDe={<Text>Lý do trả lại<Text style={{ color: colors.redStar }}>*</Text></Text>}
                            placeholder={'Nhập lý do trả lại'}
                            stTitle={{ marginLeft: 15 }}
                            stContaierTT={{ marginHorizontal: 15 }}
                            multiline={true}
                            onChangeText={(text) => this.setState({ NoiDungXL: text })}
                        />
                        <View style={{ height: 0.6, backgroundColor: colors.veryLightPink, marginTop: 20.5, marginHorizontal: 15 }}></View>
                        <View>
                            <ButtonCus
                                onPressB={this._XuLiPhanAnh}
                                textTitle="Thực hiện"
                                stContainerR={{ marginTop: 20.5, width: Width(30), marginBottom: 30 }}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                    <IsLoading />
                </View>
            </View >
        );
    }
}
export default ModalTraBuocTruoc
