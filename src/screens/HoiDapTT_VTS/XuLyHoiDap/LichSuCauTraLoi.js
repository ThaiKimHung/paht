import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import Utils, { icon_typeToast } from '../../../../app/Utils';
import { IsLoading } from '../../../../components';
import ButtonCus from '../../../../components/ComponentApps/ButtonCus';
import HeaderModal from '../../../../srcAdmin/screens/PhanAnhHienTruong/components/HeaderModal';
import { colors } from '../../../../styles';
import { reText } from '../../../../styles/size';
import { Height, nstyles } from '../../../../styles/styles';
import apis from '../../../apis';
import { Images } from '../../../images';

class LichSuCauTraLoi extends Component {
    constructor(props) {
        super(props);
        this.dataTraLoi = Utils.ngetParam(this, 'dataTraLoi', '')
        this.state = {
            DataNhatKy: []
        };
        this.refLoading = React.createRef(null)
    }

    componentDidMount() {
        this.getLichSuThaoTac_TraLoi()
    }

    getLichSuThaoTac_TraLoi = async () => {
        this.refLoading.current.show()
        let res = await apis.apiHoiDapVTS.GetList_NhatKyThaoTac_DapTT(this.dataTraLoi?.IdRow)
        this.refLoading.current.hide()
        Utils.nlog('[LOG] res thao tac cau tra loi', res)
        if (res.status == 1 && res.data) {
            this.setState({ DataNhatKy: res.data })
        } else {
            this.setState({ DataNhatKy: [] })
        }
    }




    render() {
        const { DataNhatKy } = this.state
        const { TenPhuongXa } = this.dataTraLoi
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
                        title={'Nhật ký thao tác - câu trả lời'}
                        _onPress={() => Utils.goback(this)}
                    />
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 10 }}>
                        <View style={{ margin: 5, borderWidth: 1, borderColor: colors.listColorBtnChan[0], backgroundColor: colors.white }}>
                            <Text style={{ backgroundColor: colors.listColorBtnChan[0], color: colors.white, padding: 10, textAlign: 'center' }}>{'Nhật ký thao tác'}</Text>
                            {DataNhatKy.length > 0 ? DataNhatKy.map((item, index) => {
                                return (
                                    <View key={index} style={{ marginTop: 10, backgroundColor: '#01638D1A', padding: 10 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ fontWeight: 'bold' }}>{item?.FullName || '---'}</Text>
                                            <Text style={{ fontStyle: 'italic' }}>{item?.CreatedDate || '---'}</Text>
                                        </View>
                                        <Text style={{ fontSize: reText(12), lineHeight: 20 }}>{item?.TenPhuongXa || '---'}</Text>
                                        <Text style={{ marginTop: 10 }}>{'Thao tác: '}{item?.NoiDungThaoTac || '---'}</Text>
                                        {
                                            item?.lstDonViXuLy && item?.lstDonViXuLy.length > 0 && <Text style={{ fontWeight: 'bold', marginTop: 10 }}>{'Đơn vị xử lý:'}</Text>
                                        }
                                        {
                                            item?.lstDonViXuLy && item?.lstDonViXuLy.length > 0 && item?.lstDonViXuLy?.map((item, index) => {
                                                return (
                                                    <View key={`xuly${index}`} style={{ padding: 5 }}>
                                                        <Text>{index + 1}/ {item?.TenDonVi}</Text>
                                                    </View>
                                                )
                                            })}
                                    </View>
                                )
                            }) :
                                <Text style={{ padding: 10 }}>{'Không có dữ liệu'}</Text>
                            }
                        </View>
                        <ButtonCus
                            textTitle={'Quay lại'}
                            onPressB={() => Utils.goback(this)}
                            stContainerR={{ marginTop: 20.5, marginLeft: 15, marginBottom: 30, flex: 1, backgroundColor: colors.grayLight }}
                        />
                    </KeyboardAwareScrollView>
                </View>
                <IsLoading ref={this.refLoading} />
            </View >
        );
    }
}

export default LichSuCauTraLoi;
