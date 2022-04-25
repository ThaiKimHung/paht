import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
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

class ChuyenXuLyHoiDapTT extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback', () => { })
        this.item = Utils.ngetParam(this, 'item', '')
        this.state = {
            dataDonVi: []
        };
        this.refLoading = React.createRef(null)
    }

    componentDidMount() {
        this.getDonViTraLoi()
    }

    handleButton = () => {
        const { dataDonVi = [] } = this.state
        if (dataDonVi?.filter(e => e.choose).length > 0) {
            Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn chuyển xử lý.', 'Chuyển xử lý', 'Xem lại', async () => {
                let donviXuLy = []
                dataDonVi.forEach(e => {
                    if (e.choose) {
                        donviXuLy.push({
                            "IdDonVi": e.IdDonVi,
                            "TenDonVi": e.TenDonVi,
                            "Checked": true
                        })
                    }
                })
                this.refLoading.current.show()
                let body = {
                    "IdHoiDap": this.item?.Id,
                    "DSDVXuLy": donviXuLy
                }
                Utils.nlog('[LOG] body chuyen xu ly', body)
                let res = await apis.apiHoiDapVTS.ChuyenXuLy_HoiTT(body)
                Utils.nlog('[LOG] chuyen xu ly', res)
                this.refLoading.current.hide()
                if (res.status == 1) {
                    Utils.showToastMsg('Thông báo', 'Chuyển xử lý thành công.', icon_typeToast.success, 2000, icon_typeToast.success)
                    ROOTGlobal.dataGlobal._reloadHoiDapAdmin(1, this.item?.Id)
                    this.callback()
                } else {
                    Utils.showToastMsg('Thông báo', 'Chuyển xử lý thất bại.', icon_typeToast.danger, 2000, icon_typeToast.danger)
                }

            })
        } else {
            Utils.showToastMsg('Thông báo', 'Vui lòng chọn phòng ban để chuyển xử lý', icon_typeToast.warning, 2000, icon_typeToast.warning)
        }
    }

    getDonViTraLoi = async () => {
        this.refLoading.current.show()
        let res = await apis.apiHoiDapVTS.QuyenDonViXuLy_HoiTT(this.item?.Id)
        Utils.nlog('[LOG] don vi tra loi', res)
        this.refLoading.current.hide()
        if (res.status == 1 && res.data) {
            this.setState({ dataDonVi: res?.data?.map(e => { return { ...e, choose: false } || [] }) })
        } else {
            this.setState({ dataDonVi: [] })
        }
    }

    chooseDeparment = (item) => {
        this.setState({
            dataDonVi: this.state.dataDonVi.map(e => {
                if (e.IdDonVi == item.IdDonVi) {
                    return { ...e, choose: !item?.choose }
                } else {
                    return { ...e }
                }
            })
        })
    }

    chooseAll = () => {
        const { dataDonVi = [] } = this.state
        const checkAll = dataDonVi.filter(e => e.choose == true)
        if (checkAll.length == dataDonVi.length) {
            this.setState({
                dataDonVi: dataDonVi.map(e => {
                    return { ...e, choose: false }
                })
            })
        } else {
            this.setState({
                dataDonVi: this.state.dataDonVi.map(e => {
                    return { ...e, choose: true }
                })
            })
        }
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
                        title={'Chuyển xử lý'}
                        _onPress={() => Utils.goback(this)}
                    />
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                            <Text style={{ fontWeight: 'bold', color: colors.blueFaceBook }}>{'Phòng ban'}</Text>
                            <Text style={{ fontWeight: 'bold', color: colors.blueFaceBook }}>{'Phụ trách'}</Text>
                        </View>
                        <TouchableOpacity onPress={this.chooseAll} activeOpacity={0.5} style={{ padding: 8, alignSelf: 'flex-end' }}>
                            <Image source={dataDonVi.filter(e => !e.choose).length > 0 ? Images.icUnCheck : Images.icCheck} style={[nstyles.nIcon20]} resizeMode='contain' />
                        </TouchableOpacity>
                        <View style={{ height: 0.5, backgroundColor: colors.grayLight }} />
                        {dataDonVi && dataDonVi?.length > 0 && dataDonVi?.map((item, index) => {
                            return (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                    <Text style={{}}>{item?.TenDonVi}</Text>
                                    <TouchableOpacity activeOpacity={0.5} onPress={() => this.chooseDeparment(item)} style={{ padding: 8 }}>
                                        <Image source={item?.choose ? Images.icCheck : Images.icUnCheck} style={[nstyles.nIcon20]} resizeMode='contain' />
                                    </TouchableOpacity>
                                </View>

                            )
                        })}
                        <ButtonCus
                            textTitle={'Chuyển xử lý'}
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

export default ChuyenXuLyHoiDapTT;
