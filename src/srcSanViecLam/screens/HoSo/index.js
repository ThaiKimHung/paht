import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, FlatList, Alert, Platform, BackHandler } from 'react-native'
import { NavigationEvents } from 'react-navigation';
import AppCodeConfig from '../../../../app/AppCodeConfig';
import { nkey } from '../../../../app/keys/keyStore';
import Utils, { icon_typeToast } from '../../../../app/Utils';
import { IsLoading } from '../../../../components';
import ImageCus from '../../../../components/ImageCus';
import TextApp from '../../../../components/TextApp';
import { colorsSVL } from '../../../../styles/color'
import { reText } from '../../../../styles/size';
import { Height, nstyles, Width } from '../../../../styles/styles';
import { DeleteCV, GetListCVByUserId } from '../../apis/apiSVL';
import { DEFINE_SCREEN_DETAILS } from '../../common';
import ButtonSVL from '../../components/ButtonSVL';
import EmptySVL from '../../components/EmptySVL';
import HeaderSVL from '../../components/HeaderSVL';
import { dataHoSoCV } from '../../dataDemo/dataHoSoCV';
import { ImagesSVL } from '../../images';
import ItemPersonal from './components/ItemPersonal';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataCV: [],
            itemDel: {},
            EnableDel: false,
            isLoading: true
        }
    }

    componentDidMount = () => {
        this.props.LoadListCvUser()
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBack)
    }

    onRefresh = () => {
        this.props.SetRefreshingCvUser(true)
        this.props.SetDataCvUser([])
        this.props.LoadListCvUser()
    }

    onDelItem = async (itemDel) => {
        Utils.nlog('[LOG_DELETE_CV] item delete callback', itemDel)
        let res = await DeleteCV(itemDel?.IdCV)
        Utils.nlog('[LOG_DELETE_CV] res', res)
        if (res?.status == 1) {
            //Xoá thành công map lại dữ liệu hiển thị trên UI
            this.props.DeleteCvUser(itemDel)
            Utils.showToastMsg('Thông báo', 'Xoá CV thành công', icon_typeToast.success, 2000, icon_typeToast.success)
            // this.setState()
        } else {
            Utils.showToastMsg('Thông báo', 'Xoá CV thất bại', icon_typeToast.danger, 2000, icon_typeToast.danger)
        }
    }

    onChooseItem = (item) => {
        let { EnableDel } = this.state
        if (EnableDel) {
            //Trạng thái xoá , click nào đổi trạng thái 1 item
            //redux đổi trạng thái item cần xoá ( đã chọn )
            this.props.CheckedDeleteCvUser(item)
        } else {
            Utils.navigate('Sc_DetalisHoSo', { Id: `${item?.IdCV}|${DEFINE_SCREEN_DETAILS.DanhSach_CVNguoiLaoDong.KeyScreen}` })
        }
    }

    TurnOnDel = () => {
        let { EnableDel } = this.state
        if (EnableDel == true) {
            this.setState({ EnableDel: false })
        } else {
            this.setState({ EnableDel: true })
        }
    }

    _renderItem = ({ item, index }) => {
        return <ItemPersonal
            item={item}
            index={index}
            isKiemDuyet
            isChoose={this.state.EnableDel}
            onChoose={(item) => {
                this.onChooseItem(item)
            }}
        />

    }

    onSubmit = () => {
        const { LstCVOfUser = [] } = this.props.dataSVL
        const itemDel = LstCVOfUser.find(e => e?.isChoose == true) // tìm item cần xoá
        Utils.nlog('[ITEM_DELETE]', itemDel)
        if (!this.state.EnableDel || LstCVOfUser.length == 0) {
            this.setState({ EnableDel: false })
            this._goCreateCV()
        } else {
            if (!itemDel) {
                Alert.alert('Thông báo', 'Bạn hãy chọn 1 cv nào đó để xoá!');
            } else {
                Utils.navigate('Modal_ConfirmDel', { item: itemDel, title: 'Bạn có chắc muốn xoá CV này hay không?', isDel: true, callback: this.onDelItem })
            }
        }
    }

    _goCreateCV = () => {
        const { LstCVOfUser } = this.props.dataSVL
        if (LstCVOfUser?.length < 10) {
            Utils.navigate('Sc_CreateCv', { IsAdd: true })
            return
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn chỉ có thể tạo tối đa 10 CV', 'Xác nhận')
            return
        }
    }


    onBack = () => {
        Utils.goback(this)
        return true;
    }

    onHome = () => {
        Utils.goscreen(this, 'ManHinh_Home')
    }

    render() {
        let { EnableDel } = this.state
        const { LstCVOfUser = [], RefreshingDataListCVOfUser = true } = this.props.dataSVL
        return (
            <View style={stHoSoCaNhan.stContainer}>
                <HeaderSVL
                    title={!EnableDel ? "Hồ sơ cá nhân" : 'Xoá CV'}
                    iconLeft={ImagesSVL.icHome}
                    onPressLeft={this.onHome}
                    titleRight={LstCVOfUser.length > 0 ? !EnableDel ? "Xoá" : "Đóng" : ''}
                    Sright={{ color: 'grey', fontSize: reText(14) }}
                    onPressRight={LstCVOfUser.length > 0 ? this.TurnOnDel : () => { }}
                />
                <View style={{ flex: 1, paddingTop: 5 }}>
                    <FlatList
                        data={LstCVOfUser}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        refreshing={RefreshingDataListCVOfUser}
                        renderItem={this._renderItem}
                        onRefresh={this.onRefresh}
                        ListEmptyComponent={<EmptySVL textEmpty={RefreshingDataListCVOfUser ? 'Đang tải hồ sơ...' : "Bạn chưa có CV nào. Hãy tạo CV ngay!!!"} />}

                    />
                </View>
                <ButtonSVL
                    text={!EnableDel || LstCVOfUser.length == 0 ? '+ Tạo CV mới' : 'Xoá'}
                    style={[!EnableDel || LstCVOfUser.length == 0 ? stHoSoCaNhan.btnCreateCV : stHoSoCaNhan.btnDelete, stHoSoCaNhan.btnBottom]}
                    styleText={!EnableDel || LstCVOfUser.length == 0 ? stHoSoCaNhan.txtCreateCV : stHoSoCaNhan.txtDelete}
                    onPress={this.onSubmit}
                />
                <IsLoading />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    theme: state.theme,
    auth: state.auth,
    dataSVL: state.dataSVL

});
export default Utils.connectRedux(index, mapStateToProps, true)

const stHoSoCaNhan = StyleSheet.create({
    stContainer: {
        backgroundColor: colorsSVL.grayBgrInput, flex: 1
    },
    btnCreateCV: {
        borderWidth: 1, borderColor: '#0081B2',
        backgroundColor: colorsSVL.white
    },
    btnDelete: {
        borderWidth: 0, borderColor: 'red',
        backgroundColor: 'red'
    },
    btnBottom: {
        borderRadius: 25,
        paddingVertical: 10,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center', marginVertical: 10
    },
    txtCreateCV: {
        color: colorsSVL.white, color: '#0081B2'
    },
    txtDelete: {
        color: colorsSVL.white, color: 'white'
    }
})
