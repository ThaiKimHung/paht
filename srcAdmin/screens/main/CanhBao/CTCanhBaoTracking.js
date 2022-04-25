import React, { Component } from 'react'
import { Text, View, ScrollView, StyleSheet } from 'react-native'
import apis from '../../../apis'
import Utils from '../../../../app/Utils'
import { nstyles, sizes, colors } from '../../../../styles'
import { HeaderCom, IsLoading } from '../../../../components'
import { Images } from '../../../images'

export class CTCanhBaoTracking extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            id: Utils.ngetParam(this, "id", 0)
        }

    }
    _getChiTietTracking = async () => {
        nthisIsLoading.show();
        var id = Utils.ngetParam(this, "id", 0);
        const res = await apis.ApiApp.GetDetail_TTAcc(id);
        Utils.nlog("giá tri của res tracking admin", res);
        if (res.status == 1 && res.data) {
            nthisIsLoading.hide();
            this.setState({ data: res.data, id: id })
        } else {
            nthisIsLoading.hide();
            Utils.nlog(this, "Thông báo", res.error ? res.error.message : "Lấy dữ liệu thất bại", "Xác nhận");
        }

    }
    // componentWillReceiveProps(nextProps) {
    //     Utils.nlog("vao componentWillReceiveProps")
    //     if (this.props.data !== nextProps.data) {


    //     }

    // }
    componentWillReceiveProps(nextProps, prevState) {
        var id = Utils.ngetParam(this, "id", 0);
        if (id != prevState.id) {
            this._getChiTietTracking();
        }
    }
    componentDidMount() {
        this._getChiTietTracking();

    }
    render() {
        const { data } = this.state;
        return (
            <View style={[nstyles.nstyles.ncontainer, nstyles.paddingTopMul()]}>
                <HeaderCom
                    titleText='Thông tin người nhiễm/cách ly'
                    iconLeft={Images.icBack}
                    nthis={this}
                    iconRight={Images.icNewCB}
                    onPressLeft={() => Utils.goback(this)}
                    hiddenIconRight={true}
                />
                <ScrollView style={{ backgroundColor: colors.white, flex: 1, width: '100%' }}>

                    <View style={{ width: '100%', paddingHorizontal: 10, paddingVertical: 10 }}>

                        <View style={[styler.viewcontai, nstyles.nstyles.shadow, { justifyContent: 'space-between', width: '100%', alignItems: 'center' }]}>
                            <View style={[styler.viewcontai, { flex: 1 }]}>
                                <Text style={styler.tieude}>{`Họ và tên :`}</Text>
                                <Text style={[styler.noidung, { flex: 1, color: colors.peacockBlue, }]}>{`${data.HoTen}`}</Text>
                            </View>

                            {/* <Text style={[{ color: colors.redStar, fontSize: sizes.reSize(16), fontWeight: 'bold', textAlign: 'center' }]}>{`${data.Id}`}</Text> */}
                        </View>
                        <View style={[styler.viewcontai, nstyles.nstyles.shadow]}>
                            <View style={[{
                                flexDirection: 'row',
                                paddingVertical: 10, paddingHorizontal: 5,
                                marginVertical: 1, flex: 1
                            }]}>
                                <Text style={styler.tieude}>{`Đời lấy nhiễm :`}</Text>
                                <Text style={styler.noidung}>{`${data.DoiLayNhiem}`}</Text>

                            </View>
                            <View style={styler.viewcontai}>
                                <Text style={styler.tieude}>{`Số thứ tự :`}</Text>
                                <Text style={styler.noidung}>{`${data.SttLayNhiem}`}</Text>
                            </View>
                        </View>
                        <View style={[styler.viewcontai, nstyles.nstyles.shadow]}>
                            <Text style={styler.tieude}>{`Mô tả đời lấy nhiễm :`}</Text>
                            <Text style={styler.noidung}>{`${data.MotaDoiLayNhiem}`}</Text>
                        </View>
                        <View style={[styler.viewcontai, nstyles.nstyles.shadow]}>
                            <Text style={styler.tieude}>{`Địa điểm :`}</Text>
                            <Text style={[styler.noidung, { color: colors.peacockBlue }]}>{`${data.DiaDiem}`}</Text>
                        </View>
                        <View style={[styler.viewcontai, nstyles.nstyles.shadow]}>
                            <Text style={styler.tieude}>{`Thời gian :`}</Text>
                            <Text style={styler.noidung}>{`${data.Time}`}</Text>
                        </View>
                        <View style={[styler.viewcontai, nstyles.nstyles.shadow]}>
                            <Text style={styler.tieude}>{`Trạng thái :`}</Text>
                            <Text style={[styler.noidung, { color: data.Color }]}>{`${data.TrangThai}`}</Text>
                        </View>
                        <Text style={[styler.tieude, { paddingHorizontal: 5, }]}>{`Vị trí cách ly :`}</Text>
                        <View style={[styler.viewcontai, nstyles.nstyles.shadow]}>

                            <View style={[{

                                paddingVertical: 10, paddingHorizontal: 5,
                                marginVertical: 1, flex: 1
                            }]}>
                                <Text style={styler.tieude}>{`Toạ độ X :`}</Text>
                                <Text style={styler.noidung}>{`${data.CoDinhX}`}</Text>

                            </View>
                            <View style={[{

                                paddingVertical: 10, paddingHorizontal: 5,
                                marginVertical: 1, flex: 1
                            }]}>
                                <Text style={styler.tieude}>{`Toạ độ Y  :`}</Text>
                                <Text style={styler.noidung}>{`${data.CoDinhY}`}</Text>
                            </View>
                        </View>
                        <Text style={[styler.tieude, { paddingHorizontal: 5, }]}>{`Vị trí hiện tại :`}</Text>
                        <View style={[styler.viewcontai, nstyles.nstyles.shadow]}>
                            <View style={[{
                                paddingVertical: 10, paddingHorizontal: 5,
                                marginVertical: 1, flex: 1
                            }]}>
                                <Text style={styler.tieude}>{`Toạ độ X :`}</Text>
                                <Text style={styler.noidung}>{`${data.ToaDoX}`}</Text>

                            </View>
                            <View style={[{

                                paddingVertical: 10, paddingHorizontal: 5,
                                marginVertical: 1, flex: 1
                            }]}>
                                <Text style={styler.tieude}>{`Toạ độ Y  :`}</Text>
                                <Text style={styler.noidung}>{`${data.ToaDoY}`}</Text>
                            </View>
                        </View>

                    </View>
                </ScrollView>
                <IsLoading></IsLoading>
            </View >
        )
    }
}
const styler = StyleSheet.create({
    tieude: { fontSize: sizes.reSize(14), color: colors.colorBrownGrey },
    noidung: {
        fontSize: sizes.reSize(16), fontWeight: 'bold',
        paddingHorizontal: 5, flex: 1, color: colors.peacockBlue
    },
    viewcontai: {
        flexDirection: 'row',
        paddingVertical: 10, flex: 1,
        paddingHorizontal: 5, marginVertical: 1, backgroundColor: colors.white
    }
})
export default CTCanhBaoTracking
