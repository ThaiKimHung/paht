import React, { Component } from 'react';
import {
    View
} from 'react-native';
import Utils from '../../../app/Utils';
import { nstyles, colors, sizes } from '../../../styles';
import HeaderModal from './components/HeaderModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ButtonCus from '../../../components/ComponentApps/ButtonCus';
import { Width } from '../../../styles/styles';

import { IsLoading, DatePick } from '../../../components';
import apis from '../../apis';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import moment from 'moment';
import { nGlobalKeys } from '../../../app/keys/globalKey';
class ModalCapNhatHanXuLy extends Component {
    constructor(props) {
        super(props);
        const HXL = Utils.ngetParam(this, "HanXuLy", '');
        this.callback = Utils.ngetParam(this, "callback", () => { });
        this.state = {
            arrVideo: [],
            arrImage: [],
            arrApplication: [],
            NoiDungXL: '',
            data: Utils.ngetParam(this, "data", {}),
            HanXuLy: HXL ? moment(HXL, 'DD/MM/YYYY HH:mm') : ''
        };
    }
    goback = () => {
        Utils.goback(this)
    }

    _XuLiPhanAnh = async () => {
        nthisIsLoading.show();
        const { IdPA } = this.state.data
        var body = {
            IdPA: IdPA,
            HanXuLy: moment(this.state.HanXuLy).format('DD/MM/YYYY')
        }
        const res = await apis.Auto.UpdateHanXuLyPA(body);
        Utils.nlog("gia tri res cap nhat han xu ly", res);
        if (res.status == 1) {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Thực hiện cập nhật hạn xử lý thành công", "Xác nhận", async () => {
                await ROOTGlobal[nGlobalKeys.Reload_ChiTietPa]();
                ROOTGlobal[nGlobalKeys.Reload_NhatKyThaoTacPhanAnh]();
                Utils.goback(this);
            });
        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Thực hiện cập nhật hạn xử lý thất bại", "Xác nhận");
        }
    }

    render() {
        var { HanXuLy } = this.state
        // Utils.nlog("gia tri han xu ly", HanXuLy)
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
                        title='Cập nhật hạn xử lý'
                    />
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

                        <View
                            style={[nstyles.nstyles.nrow,
                            {
                                justifyContent: 'space-between',
                                borderWidth: 0.5,
                                paddingVertical: 10,
                                marginTop: 5,
                                backgroundColor: colors.BackgroundHome, marginHorizontal: 10
                            }]}>
                            <DatePick
                                style={{ width: "100%" }}
                                // style={{ marginLeft: 10 }}
                                value={HanXuLy}
                                onValueChange={HanXuLy => this.setState({ HanXuLy })}
                            />
                        </View>
                        <View style={{ height: 0.6, backgroundColor: colors.veryLightPink, marginTop: 20.5, marginHorizontal: 15 }}></View>
                        <View>
                            <ButtonCus
                                onPressB={this._XuLiPhanAnh}
                                textTitle="Cập nhật"
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
export default ModalCapNhatHanXuLy
