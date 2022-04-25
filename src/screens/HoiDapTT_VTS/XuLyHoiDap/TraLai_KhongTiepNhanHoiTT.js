import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import Utils, { icon_typeToast } from '../../../../app/Utils';
import { IsLoading } from '../../../../components';
import ButtonCus from '../../../../components/ComponentApps/ButtonCus';
import HeaderModal from '../../../../srcAdmin/screens/PhanAnhHienTruong/components/HeaderModal';
import { colors } from '../../../../styles';
import { Height, nstyles } from '../../../../styles/styles';
import apis from '../../../apis';
import { Images } from '../../../images';

const KeyButton = {
    TiepNhan: 1,
    KhongTiepNhan: 2,
    ChinhSua: 3,
    ChuyenXuLy: 4,
    ThuHoi: 5,
    Xoa: 6,
    TraLai: 7,
    TraLoi: 8
}

class TraLai_KhongTiepNhanHoiTT extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback', () => { })
        this.item = Utils.ngetParam(this, 'item', '')
        this.action = Utils.ngetParam(this, 'action', '')
        this.state = {
            LyDo: ''
        };
        this.refLoading = React.createRef(null)
    }

    handleButton = () => {
        switch (this.action?.Key) {
            case KeyButton.KhongTiepNhan:
                if (!this.state.LyDo) {
                    return Utils.showToastMsg('Thông báo', 'Vui lòng nhập lý do', icon_typeToast.warning, 2000, icon_typeToast.warning)
                }
                Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn không tiếp nhận.', 'Không tiếp nhận', 'Xem lại', async () => {
                    this.refLoading.current.show()
                    let body = {
                        "IdHoiDap": this.item?.Id,
                        "LyDoHuy": this.state.LyDo
                    }
                    Utils.nlog('[LOG] body khong tiep nhan', body)
                    let res = await apis.apiHoiDapVTS.KhongTiepNhan_HoiTT(body)
                    Utils.nlog('[LOG] khong tiep nhan', res)
                    this.refLoading.current.hide()
                    if (res.status == 1) {
                        Utils.showToastMsg('Thông báo', 'Không tiếp nhận thành công.', icon_typeToast.success, 2000, icon_typeToast.success)
                        ROOTGlobal.dataGlobal._reloadHoiDapAdmin(1, this.item?.Id)
                        this.callback()
                    } else {
                        Utils.showToastMsg('Thông báo', 'Không tiếp nhận thất bại.', icon_typeToast.danger, 2000, icon_typeToast.danger)
                    }

                })
                break;
            case KeyButton.TraLai:
                if (!this.state.LyDo) {
                    return Utils.showToastMsg('Thông báo', 'Vui lòng nhập lý do', icon_typeToast.warning, 2000, icon_typeToast.warning)
                }
                Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn trả lại.', 'Trả lại', 'Xem lại', async () => {
                    this.refLoading.current.show()
                    let body = {
                        "IdHoiDap": this.item?.Id,
                        "LyDoTraLai": this.state.LyDo
                    }
                    Utils.nlog('[LOG] body trả lại', body)
                    let res = await apis.apiHoiDapVTS.TraLai_HoiTT(body)
                    Utils.nlog('[LOG] res trả lại', res)
                    this.refLoading.current.hide()
                    if (res.status == 1) {
                        Utils.showToastMsg('Thông báo', 'Trả lại thành công.', icon_typeToast.success, 2000, icon_typeToast.success)
                        ROOTGlobal.dataGlobal._reloadHoiDapAdmin(1, this.item?.Id)
                        this.callback()
                    } else {
                        Utils.showToastMsg('Thông báo', 'Trả lại nhận thất bại.', icon_typeToast.danger, 2000, icon_typeToast.danger)
                    }

                })
                break;
            default:
                break;
        }
    }

    onChangeText = (text) => {
        this.setState({ LyDo: text })
    }


    render() {
        const { dataDonVi } = this.state
        return (
            <View style={[{ flex: 1, justifyContent: 'center' }]} >
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center',

                }} onTouchEnd={this.goback} />
                <View style={{
                    backgroundColor: colors.white,
                    flex: 1, marginTop: Height(10),
                    borderTopLeftRadius: 30, borderTopRightRadius: 30,

                }}>
                    <HeaderModal
                        title={this.action?.Name}
                        _onPress={() => Utils.goback(this)}
                    />
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>{`Lý do ${this.action?.Name?.toLowerCase()}`}</Text>
                        <TextInput
                            multiline
                            placeholder="Nhập lý do..."
                            style={{ textAlignVertical: 'top', minHeight: 120, maxHeight: 120, backgroundColor: colors.BackgroundHome, borderRadius: 10, padding: 10, marginTop: 10 }}
                            onChangeText={this.onChangeText}
                        />
                        <ButtonCus
                            textTitle={this.action?.Name}
                            onPressB={this.handleButton}
                            stContainerR={{ marginTop: 20.5, marginLeft: 15, marginBottom: 30, flex: 1 }}
                        />
                    </KeyboardAwareScrollView>
                </View>
                <IsLoading ref={this.refLoading} />
            </View >
        );
    }
}

export default TraLai_KhongTiepNhanHoiTT;
