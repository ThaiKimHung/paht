import React, { Component, createRef } from 'react';
import { View, Text, Animated, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, BackHandler } from 'react-native';
import Utils, { icon_typeToast } from '../../../../app/Utils';
import { colors } from '../../../../styles';
import { reText } from '../../../../styles/size';
import { Height, nstyles, paddingBotX, Width } from '../../../../styles/styles';
import { Images } from '../../../images';
import { ButtonCom, IsLoading } from '../../../../components';
import { store } from '../../../../srcRedux/store';
import { GetDataUserCD } from '../../../../srcRedux/actions/auth/Auth';
import apis from '../../../apis';
import FontSize from '../../../../styles/FontSize';

class ListCauHoi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0),
            dataCauHoi: []
        };
        this.refLoading = createRef()
    }

    componentDidMount() {
        this.getCauHoi()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }
    getCauHoi = async () => {
        this.refLoading.current.show();
        let res = await apis.ApiHCM.List_CauHoi_KhaiBaoYTe(this.props?.type || 1) // mặc đinh 1, (1 KBYT, 2 KB Sức khoẻ)
        this.refLoading.current.hide();
        Utils.nlog('[LOG] data cau hoi', res)
        if (res.status == 1 && res.data) {
            this.setState({
                dataCauHoi: res.data.map(e => {
                    return { ...e, TraLoi: false }
                })
            })
        } else {
            this.setState({ dataCauHoi: [] })
        }
    }

    backAction = () => {
        this._goback()
        return true
    }
    getData = () => {
        return this.state.dataCauHoi;
    }
    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    ChooseNo = (item) => {
        let { dataCauHoi = [] } = this.state
        this.setState({
            dataCauHoi: dataCauHoi.map(e => {
                if (item.Id == e.Id)
                    return { ...e, TraLoi: false }
                return { ...e }
            })
        })
    }

    ChooseYes = (item) => {
        let { dataCauHoi = [] } = this.state
        this.setState({
            dataCauHoi: dataCauHoi.map(e => {
                if (item.Id == e.Id)
                    return { ...e, TraLoi: true }
                return { ...e }
            })
        })
    }

    renderCauHoi = (item, index) => {
        return (
            <View>
                <Text style={{ textAlign: 'justify', lineHeight: 20, fontWeight: Platform.OS == 'android' ? 'bold' : '500', fontSize: reText(14), marginTop: 10 }}>{index + 1 + '.'} {item.CauHoi}</Text>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <TouchableOpacity onPress={() => this.ChooseNo(item)} style={{ flexDirection: 'row', padding: 10 }}>
                        <Image source={item.TraLoi ? Images.icCheckboxUnActive : Images.icCheckboxActive} style={nstyles.nIcon18} resizeMode='contain' />
                        <Text style={{ fontWeight: Platform.OS == 'android' ? 'bold' : '500', fontSize: reText(14), marginLeft: 10 }}>{'Không'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.ChooseYes(item)} style={{ flexDirection: 'row', padding: 10, marginLeft: 20 }}>
                        <Image source={item.TraLoi ? Images.icCheckboxActive : Images.icCheckboxUnActive} style={nstyles.nIcon18} resizeMode='contain' />
                        <Text style={{ fontWeight: Platform.OS == 'android' ? 'bold' : '500', fontSize: reText(14), marginLeft: 10 }}>{'Có'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    GuiToKhai = async () => {
        this.refLoading.current.show()
        const { dataCauHoi } = this.state
        const { userCD } = this.props.auth
        let body = {
            "LstTraLoi": dataCauHoi.map(e => {
                return {
                    "Id": e.Id,
                    "TraLoi": e.TraLoi
                }
            })
        }
        Utils.nlog('[LOG] Body To Khai ', body)
        // let res = await apis.ApiHCM.GuiToKhaiYTe(body)
        let res = await apis.ApiHCM.Confirm_KhaiBaoYTe(body)
        Utils.nlog('[LOG] Res To Khai ', res)
        if (res.status == 1) {
            // store.dispatch(GetDataUserCD(userCD.UserID)); // get lai info  - HCM
            Utils.showToastMsg("Thông báo", "Gửi tờ khai y tế thành công!", icon_typeToast.success);
            return Utils.goback(this)
        } else {
            Utils.showToastMsg("Thông báo", "Gửi tờ khai y tế thất bại!", icon_typeToast.danger);
        }
        this.refLoading.current.hide()
    }

    render() {
        const { opacity, dataCauHoi } = this.state
        const { colorLinear } = this.props.theme
        return (
            <View style={{ backgroundColor: colors.white, paddingHorizontal: 10 }}>
                {dataCauHoi && dataCauHoi.map(this.renderCauHoi)}
                <IsLoading ref={this.refLoading} />
            </View>
        );
    }
}

const dataKhaiBao = [
    {
        Id: 1,
        CauHoi: 'Trong vòng 14 ngày qua, Anh/Chị có đến tỉnh/thành phố, quốc gia/vùng lãnh thổ nào không (Có thể đi qua nhiều nơi)?',
        Value: false,
        Key: 'DenVungDich14Ngay'
    },
    {
        Id: 2,
        CauHoi: 'Trong vòng 14 ngày qua, Anh/Chị có thấy xuất hiện ít nhất 1 trong các dấu hiệu: sốt, ho, khó thở, viêm phổi, đau họng, mệt mỏi (viêm phổi) không?',
        Value: false,
        Key: 'DauHienBenh14Ngay'
    },
    {
        Id: 3,
        CauHoi: 'Trong vòng 14 ngày qua, Anh/Chị có tiếp xúc với người bệnh hoặc nghi ngờ, mắc bệnh COVID-19?',
        Value: false,
        Key: 'TiepXucNguoiBenh14Ngay'
    },
    {
        Id: 4,
        CauHoi: 'Trong vòng 14 ngày qua, Anh/Chị có tiếp xúc với người từ nước có bệnh COVID-19?',
        Value: false,
        Key: 'TiepXucNguoiNuocCoBenh14Ngay'
    },
    {
        Id: 5,
        CauHoi: 'Trong vòng 14 ngày qua, Anh/Chị có tiếp xúc với người có biểu hiện (Sốt, ho, khó thở , Viêm phổi)?',
        Value: false,
        Key: 'TiepXucNguoiCoBieuHienBenh14Ngay'
    },
]

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 10,
        paddingBottom: paddingBotX,
        minHeight: Height(50),
        maxHeight: Height(95)
    },
    topBar: {
        height: 5,
        width: 80,
        alignSelf: 'center',
        backgroundColor: colors.grayLight,
        borderRadius: 10,
        marginTop: 10
    }
})

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,

});


export default Utils.connectRedux(ListCauHoi, mapStateToProps, true);
