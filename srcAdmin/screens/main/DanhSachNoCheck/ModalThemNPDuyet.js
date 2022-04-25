import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import apis from '../../../apis'
import Utils from '../../../../app/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors, nstyles, sizes } from '../../../../styles';
import { Height } from '../../../../styles/styles';
import HeaderModal from '../../PhanAnhHienTruong/components/HeaderModal';
import ModalDrop from '../../PhanAnhHienTruong/components/ModalDrop';
import { Images } from '../../../images';
import ItemNoiDung from '../../PhanAnhHienTruong/components/ItemNoiDung';
import ButtonCus from '../../../../components/ComponentApps/ButtonCus';
import { IsLoading } from '../../../../components';

export class ModalThemNPDuyet extends Component {
    constructor(props) {
        super(props)
        this.callback = Utils.ngetParam(this, "callback", () => { })
        this.state = {
            data: Utils.ngetParam(this, "data", {}),
            dataNXL: [],
            objNguoiXuLi: {},
            dataNXLChon: [],
            dataNXL2: [],
            dataStep: Utils.ngetParam(this, "dataStep", []),
            indexD: 0,
        }
    }
    _getDanhSachNguoiDung = async () => {
        nthisIsLoading.show();
        var { data, dataStep, indexD } = this.state;
        var Idnext = dataStep[0].Next;
        if (dataStep.length > 1) {
            for (let index = 0; index < dataStep.length; index++) {
                const element = dataStep[index];
                if (element.Next > Idnext) {
                    Idnext = element.Next;
                    indexD = index;
                }
            }
            this.setState({ indexD })
        }
        var vals = `${data.IdPA}|${data.IdStep}|${Idnext}|0|0|false`;
        Utils.nlog("gia tri value", vals)
        const res = await apis.Auto.DanhSachNguoiDungXuLyStep(vals);
        Utils.nlog("gia tri nguoi dung", res);
        if (res.status == 1 && res.data) {
            var data = res.data.map(item => {
                return { ...item, icCheck: false }
            })
            nthisIsLoading.hide();
            this.setState({ dataNXL: data })
        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Lỗi lấy danh sách người xử lý", "Xác nhận")
        }
    }

    componentDidMount() {
        this._getDanhSachNguoiDung();
        // this._CheckersByStep();
    }
    goback = () => {
        Utils.goback(this)
    }
    _onClickDVXL = (item, index) => {
        var { dataNXL } = this.state;
        dataNXL[index].icCheck = !dataNXL[index].icCheck;
        this.setState({ dataNXL: dataNXL })
    }
    _renderDonViXL = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => this._onClickDVXL(item, index)}
                key={item.UserID}
                style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                <Text style={{ fontSize: sizes.sText14 }}>{item.Username}</Text>
                <Image
                    source={item.icCheck == true ? Images.icCheck : Images.icUnCheck}
                    style={[nstyles.nstyles.nIcon16, { tintColor: colors.peacockBlue }]}
                />
            </TouchableOpacity>
        )
    }
    _renderHeader = () => {
        return (
            <View>

            </View>
        )
    }
    _XuLythemNguoiPheDuyet = async () => {
        nthisIsLoading.show();
        const { data, dataStep, dataNXL, indexD } = this.state;
        Utils.nlog("gia tr data step", dataNXL);
        var Checkers = [];
        for (let index = 0; index < dataNXL.length; index++) {
            const element = dataNXL[index];
            if (element.icCheck) {
                Checkers.push(element.UserID)
            }
        }
        var body = {
            IdPA: data.IdPA,
            isError: false,
            Next: dataStep[indexD] ? dataStep[indexD].Next : 4,
            ButtonText: dataStep[indexD] ? dataStep[indexD].ButtonText : "Phê duyệt",
            Checkers: Checkers,
            IsComeBack: data.IdStep < dataStep[indexD].Next ? false : true
        }
        Utils.nlog("gia tri body", body)
        const res = await apis.Auto.FixProcess(body);
        if (res.status == 1) {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Thực hiện chỉnh sửa thành công", "Xác nhận", () => {
                this.callback();
                Utils.goback(this);
            });
        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Thực hiện chỉnh sửa thất bại", "Xác nhận");
        }
    }
    render() {
        const { dataStep, indexD } = this.state
        return (
            <View style={[{ flex: 1, justifyContent: 'center' }]} >
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center',
                }} onTouchEnd={this.goback} />
                <View style={{
                    backgroundColor: colors.white,
                    flex: 1, marginTop: Height(5), borderTopLeftRadius: 30, borderTopRightRadius: 30
                }}>
                    <HeaderModal
                        _onPress={() => this.goback()}
                        title="Thêm người xử lý"
                    />
                    <View style={{ padding: 20, height: Height(70) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ paddingVertical: 10, backgroundColor: colors.colorGrayTwo, flex: 1, alignItems: 'center', }}>
                                <Text style={{ fontWeight: 'bold', fontSize: sizes.sizes.sText16 }}>
                                    {'Liên kết đến bước'}
                                </Text>
                                <Text style={{ fontWeight: 'bold', fontSize: sizes.sizes.sText14, color: colors.peacockBlue }}>
                                    {dataStep[indexD] ? dataStep[indexD].Title : ''}
                                </Text>
                            </View>
                            <View style={{ width: 10 }}></View>
                            <View style={{ paddingVertical: 10, backgroundColor: colors.colorGrayTwo, flex: 1, alignItems: 'center', }}>
                                <Text style={{ fontWeight: 'bold', fontSize: sizes.sizes.sText16 }}>
                                    {'Tên nút xử lý'}
                                </Text>
                                <Text style={{ fontWeight: 'bold', fontSize: sizes.sizes.sText14, color: colors.peacockBlue }}>
                                    {dataStep[indexD] ? dataStep[indexD].ButtonText : ''}
                                </Text>
                            </View>
                        </View>
                        <Text style={{
                            marginTop: 20, backgroundColor: colors.colorGrayTwo, fontWeight: 'bold',
                            paddingVertical: 10, textAlign: 'center', borderWidth: 1, borderColor: colors.colorGrayTwo
                        }}>{'Chọn người xử lý'}</Text>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={this.state.dataNXL}
                            renderItem={this._renderDonViXL}
                            keyExtractor={(item, index) => index.toString()}
                            // onEndReached={this.loadMore}
                            onEndReachedThreshold={0.3}
                        // ListFooterComponent={this._ListFooterComponent}
                        />
                    </View>
                    <View style={{ marginBottom: 40 }}>
                        <ButtonCus
                            onPressB={this._XuLythemNguoiPheDuyet}
                            stContainerR={{
                                paddingVertical: 12,
                                marginTop: 0, marginBottom: 30,
                                alignSelf: 'center', justifyContent: 'flex-start'
                            }}
                            textTitle={`Lưu thông tin`}
                        />
                    </View>
                </View>
                <IsLoading></IsLoading>
            </View>
        )
    }
}

export default ModalThemNPDuyet
