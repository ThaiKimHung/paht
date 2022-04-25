import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Utils from '../../../app/Utils';
import { nstyles, colors, sizes } from '../../../styles';
import ButtonCus from '../../../components/ComponentApps/ButtonCus';
import HeaderModal from './components/HeaderModal';
import ItemNoiDung from './components/ItemNoiDung';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Apis from '../../apis'
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { IsLoading } from '../../../components';
import HtmlViewCom from '../../../components/HtmlView';
import { getConfigNoiDung } from '../../apis/apiapp';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { ConfigScreenDH } from '../../routers/screen';

class ModalHuyPA extends Component {
    constructor(props) {
        super(props);
        this.CTPA = Utils.ngetParam(this, 'CTPA', {})//body
        this.ActionData = Utils.ngetParam(this, 'ActionData', {})//dataButton
        this.callback = Utils.ngetParam(this, "callback", () => { });
        this.PANB = Utils.ngetParam(this, "PANB");
        this.state = {
            noidung: '',
        };
    }
    componentDidMount = () => {
        this.getConfigND()
    };

    getConfigND = async () => {
        let res = await getConfigNoiDung();
        if (res.status == 1 && res.data) {
            this.setState({ noidung: res.data.DEFAULT_TXT_HUY })
        }
    }
    goback = () => {
        Utils.goback(this);
    }

    onChangeNoiDung = (text) => {
        this.setState({ noidung: text })
    }

    _huyPhanAnh = async () => {

        let res = null;
        if (this.state.noidung == '') {
            Utils.showMsgBoxOK(this, "Thông báo", "Vui lòng nhập nội dung hủy.", "Xác nhận");
            return;
        };
        nthisIsLoading.show();
        const body = {
            ...this.CTPA,
            ActionFormChon: this.ActionData,
            NoiDungXL: this.state.noidung
        };
        if (this.PANB) res = await Apis.Autonoibo.XuLyQuyTrinhPhanAnh(body);
        else res = await Apis.Auto.XuLyQuyTrinhPhanAnh(body);
        if (res.status == 1) {
            //Thong bao thanh cong, CALLBACK ve homepaht
            Utils.showMsgBoxOK(this, "Thông báo", res.error.message, "Xác nhận", () => {
                if (ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome) {
                    ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome();
                }
                try {
                    this.callback(this);
                } catch (error) {
                    Utils.goback(this);
                };
            })
        } else {
            Utils.showMsgBoxOK(this, "Thông báo", res.error.message, 'Xác nhận')
        };
        nthisIsLoading.hide();
    }

    render() {
        return (
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false} >
                <View style={{
                    flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center',
                }} onTouchEnd={this.goback} />
                <View style={{ backgroundColor: colors.backgroundModal }}>
                    <View style={{
                        backgroundColor: colors.white,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                    }}>
                        <HeaderModal
                            _onPress={() => Utils.goback(this)}
                            // title='Hủy phản ánh'
                            title={this.ActionData.ButtonText}
                        />

                        {/* <ItemNoiDung
                            // textTieuDe='Nội dung hủy'
                            textTieuDe={<Text>Nội dung {(this.ActionData.ButtonText).toLowerCase()} <Text style={{ color: colors.redStar }}>*</Text></Text>}
                            placeholder={`Nội dung ${(this.ActionData.ButtonText).toLowerCase()}`}
                            numberOfLines={2}
                            multiline={true}
                            stTitle={{ marginLeft: 15 }}
                            stNoiDung={{ textAlignVertical: "top", fontSize: sizes.sizes.sText14 }}
                            stContaierTT={{
                                backgroundColor: colors.veryLightPink,
                                height: nstyles.Height(8), marginHorizontal: 15,
                                marginBottom: -10,
                            }}
                            onChangeText={(text) => this.onChangeNoiDung(text)}
                        /> */}
                        <View style={{ marginHorizontal: 15, }}>
                            <Text>Nội dung {(this.ActionData.ButtonText).toLowerCase()} <Text style={{ color: colors.redStar }}>*</Text></Text>
                            <TouchableOpacity
                                onPress={() => Utils.goscreen(this, ConfigScreenDH.Modal_EditHTML, {
                                    content: this.state.noidung,
                                    callback: (val) => this.setState({ noidung: val })
                                })}
                                pointerEvents={
                                    'auto'
                                }
                                style={[{
                                    paddingTop: 5,
                                    paddingLeft: 5,
                                    marginTop: 5,
                                    // alignItems: "center",
                                    paddingVertical: 5,
                                    borderWidth: 1,
                                    // borderStyle: 'dashed',
                                    minHeight: 60,
                                    borderColor: colors.grayLight,
                                    borderRadius: 5,
                                    backgroundColor: colors.veryLightPink,
                                }]}>
                                {/* <TouchableOpacity > */}
                                <HtmlViewCom html={this.state.noidung ? this.state.noidung : '<div></div>'} style={{ height: '100%' }} />
                                {/* </TouchableOpacity> */}
                            </TouchableOpacity>
                        </View>

                        <ButtonCus
                            onPressB={this._huyPhanAnh}
                            textTitle={`Thực hiện`}
                            stContainerR={{ marginVertical: 30 }}
                        />
                    </View>
                </View>
                <IsLoading />
            </KeyboardAwareScrollView>

        );
    }
}
export default ModalHuyPA
