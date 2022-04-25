import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, ScrollView, FlatList, Platform, TextInput, BackHandler } from 'react-native'
import { paddingTopMul, nstyles, Width } from '../../../styles/styles'
import Utils from '../../../app/Utils'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Images } from '../../images'
import apis from '../../apis'
import { ButtonCom, HeaderCus, IsLoadingNew, ListEmpty } from '../../../components'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import { nkey } from '../../../app/keys/keyStore'
import { ROOTGlobal } from '../../../app/data/dataGlobal'
import AppCodeConfig from '../../../app/AppCodeConfig'
const listCap = [
    {
        id: 1,
        name: "Cấp Tỉnh"
    },
    {
        id: 2,
        name: "Cấp Huyện"
    },
    {
        id: 3,
        name: "Cấp Xã"
    }
]
export class DanhSachDonVi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idCap: 1,
            dataCapTinh: [],
            dataCapHuyen: [],
            dataCapXa: [],
            refreshing: true,
            textSearch: '',
            isLogin: false
        }

        ROOTGlobal.dataGlobal._checkLoginSSO = this.checkLoginSSO
    }
    componentDidMount() {
        this.GetDataDonVi_TraCuu()
        this.checkLoginSSO()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goscreen(this, 'ManHinh_Home')
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    checkLoginSSO = async () => {
        let res = await Utils.ngetStore(nkey.InfoUserSSO, '')
        if (res && res.KhachHangID) {
            this.setState({ isLogin: true })
        } else {
            this.setState({ isLogin: false })
        }
    }

    setCap = (index) => {
        this.setState({ idCap: index })
    }

    GetDataDonVi_TraCuu = async () => {
        nthisIsLoading.show();
        const res = await apis.ApiDVC.GetDataDonVi_TraCuu();
        if (res.status == 1) {
            nthisIsLoading.hide();
            const { CT = { V_DICHVUCONG_DONVI_LstStringResult: [] }, CH = { V_DICHVUCONG_DONVI_LstStringResult: [] }, CX = { V_DICHVUCONG_DONVI_LstStringResult: [] } } = res.data;
            let arrCHNew = [];
            for (let index = 0; index < CH.V_DICHVUCONG_DONVI_LstStringResult.length; index++) {
                const element = CH.V_DICHVUCONG_DONVI_LstStringResult[index];
                let arrChild = CX.V_DICHVUCONG_DONVI_LstStringResult.filter(item => item.DonViCapChaID == element.DonViID)
                arrCHNew = [...arrCHNew, { ...element, child: arrChild, level: 2 }];
            }
            // Utils.nlog("giá tị mảng ---------cX----", arrCHNew)

            this.setState({
                dataCapTinh: res.data.CT.V_DICHVUCONG_DONVI_LstStringResult,
                dataCapHuyen: res.data.CH.V_DICHVUCONG_DONVI_LstStringResult,
                dataCapXa: arrCHNew,/// res.data.CX.V_DICHVUCONG_DONVI_LstStringResult,
                refreshing: false,
            })
        }
        else {
            nthisIsLoading.hide();
        }
        // Utils.nlog('Gia tri item <>======', this.state.dataCapHuyen)
    }
    _onRefresh = () => {
        this.setState({ refreshing: true }, this.GetDataDonVi_TraCuu);
    }

    _goScren = (item) => {
        Utils.goscreen(this, 'dslinhvuc', { DonViID: item.DonViID, Title: item.TenDonVi })
    }
    _renderDSDonVi = ({ item, index }) => {
        if (item.level && item.level == 2) {
            return (
                <View key={index} style={{ width: '100%', }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row', paddingHorizontal: 10,
                            paddingVertical: 10, backgroundColor: colors.black_11,
                            marginHorizontal: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5
                        }}>
                        <View style={{ flex: 1, justifyContent: 'center', }}>
                            <Text style={{ marginLeft: 10, fontSize: reText(16), fontWeight: 'bold', color: colors.colorGrayText }} >{item.TenDonVi}</Text>
                        </View>
                    </TouchableOpacity>
                    {
                        item.child && item.child.length > 0 ? item.child.map((itemCon, indexCon) => this._renderDSDonVi({ item: itemCon, index: indexCon })) : null
                    }

                </View>
            )

        } else {
            return (
                <View key={index} style={{ width: '100%' }}>
                    <TouchableOpacity
                        onPress={() => this._goScren(item)}
                        style={{
                            flexDirection: 'row', paddingHorizontal: 10,
                            paddingVertical: 10, backgroundColor: colors.white, marginBottom: 5,
                            marginHorizontal: 10, borderRadius: 5,
                        }}>
                        <Image source={Images.icDichVC} style={[nstyles.nAva40, {}]} />
                        <View style={{ flex: 1, justifyContent: 'center', }}>
                            <Text style={{ marginLeft: 10, fontSize: reText(14), }} >{item.TenDonVi} ({item.NumTTHC})</Text>
                        </View>
                        <Image source={Images.icBack} style={[nstyles.nIcon14, { tintColor: this.props.theme.colorLinear.color[0], alignSelf: 'center', transform: [{ rotate: "180deg" }] }]} resizeMode={'contain'} />
                    </TouchableOpacity>

                </View>
            )
        }


    }

    Search = () => {
        if (this.state.textSearch == '') {
            Utils.showMsgBoxOK(this, "Thông báo", "Nhập tên thủ tục để tìm kiếm", 'Xác nhận')
            return;
        }

        Utils.goscreen(this, 'dsthutuc', {
            DonViID: "0",
            LinhVucID: "0",
            TenThuTuc: this.state.textSearch,
            isCheckScreenSeach: true
        })


    }
    _Clear = () => {
        this.setState({ textSearch: '' })
    }

    logOutSSO = async () => {
        Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn thoát tài khoản dịch vụ công', 'Đăng xuất', 'Xem lại', async () => {
            this.props.SetUserApp(AppCodeConfig.APP_DVC, '')
            this.props.Set_Menu_CanBo([], '')
            this.props.Set_Menu_CongDong([])
            Utils.setGlobal(nGlobalKeys.TokenSSO, '');
            Utils.setGlobal(nGlobalKeys.InfoUserSSO, '');
            Utils.setGlobal(nGlobalKeys.UseCookieSSO, true)
            await Utils.nsetStore(nkey.UseCookieSSO, true)
            await Utils.nsetStore(nkey.InfoUserSSO, '')
            Utils.showMsgBoxOK(this, 'Thông báo', 'Đăng xuất tài khoản dịch vụ công thành công', 'Xác nhận', () => {
                this.checkLoginSSO()
            })
        })
    }

    render() {
        const { idCap, dataCapTinh, dataCapHuyen, dataCapXa, isLogin } = this.state;
        let { theme } = this.props
        return (
            <View style={nstyles.ncontainer}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
                    iconLeft={Images.icBack}
                    title={`Nộp hồ sơ trực tuyến`}
                    styleTitle={{ color: colors.white }}
                // iconRight={Images.icLogOut}
                // onPressRight={this.logOutSSO}
                />
                <View style={[nstyles.nbody, { backgroundColor: colors.BackgroundHome }]}>
                    <View style={{ flexDirection: 'row', marginTop: 5, paddingHorizontal: 10, justifyContent: 'space-between' }}>
                        {/* <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}  > */}
                        {listCap.map((item, index) =>
                            <TouchableOpacity key={index}
                                style={{
                                    alignSelf: 'center', marginHorizontal: index == 1 ? 5 : 0,
                                    backgroundColor: item.id == idCap ? theme.colorLinear.color[0] : colors.black_20,
                                    paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5, flex: 1, alignItems: 'center'
                                }}
                                onPress={() => this.setCap(item.id)} >
                                <Text style={{ fontWeight: '500', color: colors.white }}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        {/* </ScrollView> */}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                        <View style={[nstyles.shadow, { width: Width(70), backgroundColor: colors.white, paddingHorizontal: 10, borderRadius: 5, height: 42 }]}>
                            <TextInput
                                placeholder={'Tên thủ tục hành chính'}
                                placeholderTextColor={colors.black_16}
                                style={{ textAlign: 'left', flex: 1, fontSize: reText(15), color: colors.black_80 }}
                                value={this.state.Search}
                                onChangeText={(text) => this.setState({ textSearch: text })}
                            />
                        </View>
                        <ButtonCom
                            text={'Tìm kiếm'}
                            onPress={() => this.Search()}
                            style={{ borderRadius: 5, flex: 1, marginLeft: 5 }}
                            txtStyle={{ fontSize: reText(14) }}
                        />
                    </View>
                    <FlatList
                        style={{ flex: 1 }}
                        data={idCap == 1 ? dataCapTinh : idCap == 2 ? dataCapHuyen : dataCapXa}
                        renderItem={this._renderDSDonVi}
                        keyExtractor={(item, index) => index.toString()}
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    // ListEmptyComponent={<ListEmpty />}
                    />
                </View>
                {/* <IsLoadingNew /> */}
            </View>

        )
    }
}

const mapStateToProps = state => ({
    theme: state.theme
});

export default Utils.connectRedux(DanhSachDonVi, mapStateToProps, true)
