import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View, Dimensions, Platform } from 'react-native';
import apis from '../apis';
import { ROOTGlobal } from '../../app/data/dataGlobal';
import Utils from '../../app/Utils';
import { Images } from '../images';
import { colors } from '../../styles';
import { reText } from '../../styles/size';
import { nGlobalKeys } from '../../app/keys/globalKey';
import { nstyles, nwidth } from '../../styles/styles';


export class ModalThongBaoHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numNotifi: 0
        };
        ROOTGlobal[nGlobalKeys.HomeDH].getThongBao = this._getListThongBao;
    }

    componentDidMount() {
        this._getListThongBao();
    }

    _onRefresh = () => {
        Utils.navigate('scHome');
        this._getListThongBao();
    };

    _getListThongBao = async () => {
        if (ROOTGlobal[nGlobalKeys.HomeDH].getDsThongBao)
            ROOTGlobal[nGlobalKeys.HomeDH].getDsThongBao(true);
        const res = await apis.ThongBao.GetThongBao(); //Xử lý load DS 1 lần
        if (ROOTGlobal[nGlobalKeys.HomeDH].getDsThongBao) //Xử lý đồng bộ DL Home
            ROOTGlobal[nGlobalKeys.HomeDH].getDsThongBao(false, res);
        if (res && res?.status == 1) { //&& res.data.LstThongBao
            let numThongBao = res.data ? (res.data.TongSoThongBao ? res.data.TongSoThongBao : 0) : 0;
            this.setState({ numNotifi: numThongBao });
        } else {
            this.setState({ numNotifi: 0 });
        }
        Utils.nlog(' Gia tri dataaa=====', res);
    };

    render() {
        if (this.props.DataNotify?.status == 1 && this.props.theme.showModalNoti == true && Utils.getGlobal(nGlobalKeys.showHomeNoti, false)) {
            return (
                <View
                    style={{
                        opacity: 0.8,
                        position: 'absolute',
                        bottom: nwidth() / 7,
                        right: 0,
                        width: 36,
                        height: 36,
                        elevation: 3,
                        shadowOffset: {
                            width: 2,
                            height: 2
                        },
                        shadowRadius: 5,
                        shadowOpacity: 1,
                        shadowColor: colors.black_80,
                        backgroundColor: colors.colorBlue,
                        borderTopLeftRadius: 18,
                        borderBottomLeftRadius: 18,
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => this._onRefresh()}
                        onLongPress={() => {
                            Utils.showMsgBoxYesNo(nthisApp, "Ẩn thông báo", "Bạn có chắc muốn ẩn nút thông báo này?", "Ẩn", "Xem lại",
                                () => {
                                    Utils.setGlobal(nGlobalKeys.anHomeAdmin, true);
                                    this.props.SetShowModalNoti(false);
                                });
                        }}

                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Image resizeMode="contain" style={[nstyles.nIcon18]} source={Images.icHome} />
                        <View
                            style={{
                                backgroundColor: colors.redStar,
                                borderRadius: 12,
                                position: 'absolute',
                                top: -15,
                                right: 0,
                                zIndex: 3,
                                width: 24,
                                height: 24,
                                // paddingHorizontal: 10,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.white,
                                    fontSize: reText(10),
                                    textAlign: 'center',
                                    fontWeight: 'bold'
                                }}
                            >
                                {this.state.numNotifi >= 100 ? '99+' : this.state.numNotifi}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return null;
        }
    }
}
const mapStateToProps = state => ({
    DataNotify: state.DataNotify,
    theme: state.theme
});
export default Utils.connectRedux(ModalThongBaoHome, mapStateToProps, true);
