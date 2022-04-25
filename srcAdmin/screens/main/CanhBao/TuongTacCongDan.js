import React, { Component, Fragment } from 'react'
import { Text, View, FlatList, Image, TextInput, TouchableOpacity, Modal, StyleSheet, TouchableHighlight, KeyboardAvoidingView, Platform } from 'react-native'
import { colors, nstyles } from '../../../../styles'
import { HeaderCom, DatePick, IsLoading, ListEmpty, } from '../../../../components'
import Utils, { icon_typeToast } from '../../../../app/Utils'
import { Images } from '../../../images'
import apis from '../../../apis'
import { sizes, reSize } from '../../../../styles/size'
// import {  } from 'react-native-gesture-handler'
import { Width } from '../../../../styles/styles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { nkey } from '../../../../app/keys/keyStore'
import { nGlobalKeys } from '../../../../app/keys/globalKey'
import AppCodeConfig from '../../../../app/AppCodeConfig'

class ChiTietTuongTac extends Component {
    constructor(props) {
        super(props)

        this.state = {
            refreshing: false,
            Id: Utils.ngetParam(this, "id", {}),
            dataInfo: {},
            textNoiDungTTC: '',
            textNoiDungTTR: '',
            modalVisible: false,
            idSelect: -1,
            isEdit: false,
            itemEdit: {}
        }
    }
    _getInFoCanhBao = async () => {
        nthisIsLoading.show();
        const { Id } = this.state;
        const res = await apis.ApiCanhBao.InfoCanhBao(Id);
        Utils.nlog("gia tri res nfo cnah báo", res.data);
        if (res.status == 1 && res.data) {
            nthisIsLoading.hide();
            this.setState({ refreshing: false, dataInfo: res.data })
        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Lấy thông tin cảnh báo thất bại", "Xác nhận");
        }
    }
    _InsertCanhBaoTuongtac = async (IdParent = -1) => {
        // console.log("vao insert", IdParent)
        const { dataInfo, textNoiDungTTC,
            textNoiDungTTR } = this.state;
        let body = {}
        if (IdParent == -1) {
            if (textNoiDungTTC.length == 0) {
                // Utils.showMsgBoxOK(this, "thông báo", "Bạn chưa nhập nội dung tương tác");
                Utils.showToastMsg("Thông báo", "Bạn chưa nhập nội dung tương tác", icon_typeToast.info);
                return;
            } else {
                body = {
                    "NoiDung": textNoiDungTTC,
                    "IdCanhBao": dataInfo.Id,
                }

            }

        } else {
            if (textNoiDungTTR.length == 0) {
                // Utils.showMsgBoxOK(this, "thông báo", "Bạn chưa nhập nội dung tương tác");
                Utils.showToastMsg("Thông báo", "Bạn chưa nhập nội dung tương tác", icon_typeToast.info);
                return;
            } else {
                body = {
                    "NoiDung": textNoiDungTTR,
                    "IdCanhBao": dataInfo.Id,
                    "IdParent": IdParent
                };
            }


        }
        let res = await apis.ApiCanhBao.InsertCanhBaoTuongtac(body);
        Utils.nlog("gia tri res inser", res)
        if (res.status == 1) {
            Utils.showToastMsg("Thông báo", "Tương tác thành công", icon_typeToast.success);
            this.setState({
                textNoiDungTTC: '',
                textNoiDungTTR: '',
                modalVisible: false,
            })
            this._getInFoCanhBao();

        }



    }
    _DuyetCBTTCongDan = async (item, val = false) => {
        let rules = [];
        rules = Utils.getGlobal(nGlobalKeys.rules, [], AppCodeConfig.APP_ADMIN) ? Utils.getGlobal(nGlobalKeys.rules, [], AppCodeConfig.APP_ADMIN) : []
        // console.log("gia trị rule", rules);
        let CONSTRULE = 167
        let checkrule = rules.find((item) => item == CONSTRULE);
        if (checkrule) {
            let body = { ...item, HienThi: val };
            let res = await apis.ApiCanhBao.DuyetCBTTCongDan(body);
            if (res.status == 1) {
                Utils.showToastMsg("Thông báo", "Duyệt thành công", icon_typeToast.success);
                this._getInFoCanhBao();
            } else {
                Utils.showToastMsg("Thông báo", "Duyệt thất bại", icon_typeToast.warning);
                this._getInFoCanhBao();
            }
        } else {
            Utils.showToastMsg("Thông báo", "Bạn không có quyền", icon_typeToast.success);
        }

    }
    componentDidMount() {

        this._getInFoCanhBao();

    }

    onPressTuongTac = (item) => {

        this.setState({ idSelect: item.IdRow, modalVisible: true })
    }
    onPressTuongTacEdit = (item) => {
        this.setState({ idSelect: item.IdRow, modalVisible: true, isEdit: true, textNoiDungTTR: item.NoiDung, itemEdit: item })
    }
    //TuongTacCB_Update
    _DeleteCB_TuongTac = async (item) => {
        Utils.showMsgBoxYesNo(this, "Thông báo", "Bạn có muốn xoá tương tác trên không ?", "Xác nhận", "Thoát", async () => {
            let IDuser = Utils.getGlobal(nGlobalKeys.Id_user, -1, AppCodeConfig.APP_ADMIN);
            // console.log("gia tri id user", IDuser);
            let type = item.IsCongDan && item.IsCongDan == true ? 2 : (item.Creator && item.Creator == IDuser ? 0 : 1);
            let res = await apis.ApiCanhBao.DeleteCB_TuongTac(item.IdRow, type);
            Utils.nlog("gia tri res delete tuong tac", res)
            if (res.status == 1) {
                Utils.showToastMsg("Thông báo", "Xoá thành công", icon_typeToast.success);
                this._getInFoCanhBao();
            } else {
                Utils.showToastMsg("Thông báo", "Xoá thất bại", icon_typeToast.warning);
                this._getInFoCanhBao();
            }
        })

    }
    _TuongTacCB_Update = async () => {
        const { dataInfo, textNoiDungTTC,
            textNoiDungTTR, idSelect, itemEdit } = this.state;
        let IDuser = Utils.getGlobal(nGlobalKeys.Id_user, -1, AppCodeConfig.APP_ADMIN);
        // console.log("gia tri id user", IDuser);
        let type = itemEdit.IsCongDan && itemEdit.IsCongDan == true ? 1 : (itemEdit.Creator && itemEdit.Creator == IDuser ? 0 : 1);
        if (textNoiDungTTR.length == 0) {
            // Utils.showMsgBoxOK(this, "thông báo", "Bạn chưa nhập nội dung tương tác");
            Utils.showToastMsg("Thông báo", "Bạn chưa nhập nội dung tương tác", icon_typeToast.info);
            return;
        } else {
            let body = {
                ...itemEdit,
                "NoiDung": textNoiDungTTR,
                "IdCanhBao": dataInfo.Id,
                key: type,
                NoiDungEdit: textNoiDungTTR,
                isEditing: true
            };
            let res = await apis.ApiCanhBao.TuongTacCB_Update(body);
            Utils.nlog("gia tri res inser", res)
            if (res.status == 1) {
                Utils.showToastMsg("Thông báo", "Cập nhật tương tác thành công", icon_typeToast.success);
                this.setState({
                    textNoiDungTTC: '',
                    textNoiDungTTR: '',
                    modalVisible: false,
                    isEdit: false
                })
                this._getInFoCanhBao();

            } else {
                Utils.showToastMsg("Thông báo", "Cập nhật tương tác thất bại", icon_typeToast.warning);


            }
        }
    }

    _renderChildItem = (item, index) => {
        return (
            <View key={index} style={{
                marginLeft: 30, flexDirection: 'row', justifyContent: 'space-between',
                paddingHorizontal: 10, paddingVertical: 10,
                backgroundColor: colors.colorGrayTwo, borderRadius: 5, marginVertical: 2
            }}>

                <View style={{}}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={{ uri: item.Avata }}
                            resizeMode='contain'
                            style={{ width: 15, height: 15, borderRadius: 15, borderWidth: 0.5 }}
                        />
                        <Text style={{ paddingLeft: 10, fontSize: sizes.sText12, fontWeight: 'bold' }}>
                            {item.CreatorName}
                        </Text>
                    </View>
                    <Text style={{ paddingLeft: 10, fontSize: sizes.sText10 }}>{item.NoiDung}</Text>
                    <Text style={{ paddingLeft: 10, fontSize: sizes.sText10, color: colors.peacockBlue }}>{item.CreatedDateString}</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 }} >
                    <TouchableOpacity onPress={() => {
                        this.onPressTuongTacEdit(item)
                    }}>
                        <Text style={{ paddingHorizontal: 10, paddingVertical: 5, fontSize: sizes.sText10, color: colors.peacockBlue }}>{'Cập nhật'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this._DuyetCBTTCongDan(item, !item.HienThi)
                    }}>
                        <Text style={{ paddingHorizontal: 10, paddingVertical: 5, fontSize: sizes.sText10, color: colors.peacockBlue }}>{item.HienThi == true ? 'Ẩn' : 'Hiện'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this._DeleteCB_TuongTac(item);
                    }}>
                        <Text style={{ paddingHorizontal: 10, paddingVertical: 5, fontSize: sizes.sText10, color: colors.redStar }}>{'Xoá'}</Text>
                    </TouchableOpacity>
                </View>
            </View >)
    }
    _renderItem = ({ item, index }) => {
        // console.log("gia tri item", item);
        let { lstChildTT = [] } = item
        // console.log("gia tri item", lstChildTT);
        return (
            <View key={index}
                style={{ backgroundColor: colors.colorGrayBgr, paddingHorizontal: 5 }}
            >
                <View style={{
                    paddingHorizontal: 10
                    , paddingVertical: 10, backgroundColor: colors.colorGrayBgr,
                }}>

                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={{ uri: item.Avata }}
                            resizeMode='contain'
                            style={{ width: 20, height: 20, borderRadius: 20 }}
                        />
                        <Text style={{ paddingLeft: 10, fontSize: sizes.sText12, fontWeight: 'bold' }}>
                            {item.CreatorName}
                        </Text>
                    </View>
                    <Text style={{ paddingLeft: 10, fontSize: sizes.sText10 }}>{item.NoiDung}</Text>
                    <Text style={{ paddingLeft: 10, fontSize: sizes.sText10, color: colors.peacockBlue }}>{item.CreatedDateString}</Text>
                </View>
                {
                    lstChildTT.map(this._renderChildItem)
                }
                <View style={{
                    alignItems: 'center', justifyContent: 'center',
                    width: '100%', paddingVertical: 10, flexDirection: 'row'
                }} >
                    <TouchableOpacity onPress={() => {
                        this.onPressTuongTacEdit(item)
                    }}>
                        <Text style={{ paddingHorizontal: 10, paddingVertical: 5, fontSize: sizes.sText10, color: colors.peacockBlue }}>{'Cập nhật'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this._DuyetCBTTCongDan(item, !item.HienThi)
                    }}>
                        <Text style={{ padding: 10, fontSize: sizes.sText10, color: colors.peacockBlue }}>{item.HienThi == true ? 'Ẩn' : 'Hiện'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this._DeleteCB_TuongTac(item);
                    }}>
                        <Text style={{ padding: 10, fontSize: sizes.sText10, color: colors.redStar }}>{'Xoá'}</Text>
                    </TouchableOpacity>
                    {/* //HienThi: */}
                    <TouchableOpacity onPress={() => this.onPressTuongTac(item)}>
                        <Text style={{ paddingLeft: 10, fontSize: sizes.sText10, color: colors.peacockBlue }}>{'Trả lời tương tác'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };
    _keyExtrac = (item, index) => index.toString();
    _onRefresh = () => {
        this.setState({ refreshing: true, textempty: 'Đang tải...' }, this._getInFoCanhBao)
    }
    _ItemSeparatorComponent = () => {
        return (<View style={{ height: 5 }}></View>)
    }
    render() {
        // Utils.nlog("gia tri list don vi", this.props.dataDonVi)
        const { dataInfo, modalVisible } = this.state
        const { nrow } = nstyles.nstyles;
        // Utils.nlog("gia tri chuyen muc", this.state.objChuyenMuc)
        return (
            <View style={{ flex: 1, backgroundColor: colors.white, }}>
                <HeaderCom
                    titleText='Tương tác cảnh báo'
                    iconLeft={Images.icBack}
                    nthis={this}
                    onPressLeft={() => Utils.goback(this)}
                    hiddenIconRight={true}
                />
                <View style={{ padding: 10 }}>
                    <Text style={{ fontSize: sizes.sText16, fontWeight: 'bold', color: colors.peacockBlue }}>Cảnh báo:{dataInfo.TieuDe}</Text>

                </View>
                <View style={{
                    paddingVertical: 20, backgroundColor: colors.colorGrayBgr,
                    paddingHorizontal: 10, width: '100%', marginBottom: 10
                }}>
                    <TextInput
                        value={this.state.textNoiDungTTC}
                        onChangeText={text => this.setState({ textNoiDungTTC: text })}
                        placeholder="Nội dung tương tác"
                        style={{ backgroundColor: colors.white, paddingVertical: 20, borderRadius: 5, paddingHorizontal: 10 }}>
                    </TextInput>
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <TouchableOpacity onPress={() => this._InsertCanhBaoTuongtac()}
                            style={{
                                width: Width(50), marginVertical: 10, backgroundColor: colors.peacockBlue,
                                alignSelf: 'center', alignContent: 'center', alignItems: 'center', justifyContent: 'center',
                                paddingVertical: 15, borderRadius: 5
                            }}>
                            <Text style={{ fontSize: sizes.sText14, color: colors.white }}>Gửi tương tác</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 1, backgroundColor: colors.peacockBlue, width: '100%' }}></View>
                </View>

                <FlatList
                    style={{ flex: 1, marginHorizontal: 10 }}
                    // scrollEventThrottle={10}
                    onScroll={this.handleScroll}
                    showsVerticalScrollIndicator={false}
                    renderItem={this._renderItem}
                    data={this.state.dataInfo.lstTuongtac}
                    ListEmptyComponent={<ListEmpty textempty={this.state.textempty} />}
                    ItemSeparatorComponent={this._ItemSeparatorComponent}
                    // ListHeaderComponent={this._ListHeaderComponent}
                    keyExtractor={this._keyExtrac}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={0.3}
                // ListFooterComponent={this._ListFooterComponent}
                />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}

                    onRequestClose={() => {
                        // Alert.alert("Modal has been closed.");
                    }}>
                    <KeyboardAvoidingView behavior={Platform.OS == 'android' ? 'height' : "padding"} style={{ flex: 1, }}>
                        <View style={styles.centeredView}>

                            <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.backgroundModal }} onPress={() => {
                                this.setState({ modalVisible: !modalVisible, textNoiDungTTR: '' });
                            }}>
                            </TouchableOpacity>
                            <View style={styles.modalView}>
                                <View style={{
                                    paddingVertical: 20, backgroundColor: colors.colorGrayBgr,
                                    paddingHorizontal: 10, width: '100%', marginBottom: 10
                                }}>
                                    <TextInput
                                        autoFocus={true}
                                        value={this.state.textNoiDungTTR}
                                        onChangeText={text => this.setState({ textNoiDungTTR: text })}
                                        placeholder="Nội dung tương tác"
                                        style={{ backgroundColor: colors.white, paddingVertical: 20, borderRadius: 5, paddingHorizontal: 10 }}>
                                    </TextInput>
                                    <View style={{ alignItems: 'center', justifyContent: 'space-between', width: '100%', flexDirection: 'row' }}>
                                        <View>
                                            <TouchableOpacity onPress={() => this.setState({ textNoiDungTTR: '', modalVisible: false })}
                                                style={{
                                                    width: Width(30), marginVertical: 10, backgroundColor: colors.colorGrayTwo,
                                                    alignSelf: 'center', alignContent: 'center', alignItems: 'center', justifyContent: 'center',
                                                    paddingVertical: 15, borderRadius: 5
                                                }}>
                                                <Text style={{ fontSize: sizes.sText14, color: colors.black_80 }}>Thoát</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <TouchableOpacity onPress={() => {
                                                this.state.isEdit == true ? this._TuongTacCB_Update() : this._InsertCanhBaoTuongtac(this.state.idSelect)
                                            }}
                                                style={{
                                                    width: Width(30), marginVertical: 10, backgroundColor: colors.peacockBlue,
                                                    alignSelf: 'center', alignContent: 'center', alignItems: 'center', justifyContent: 'center',
                                                    paddingVertical: 15, borderRadius: 5
                                                }}>
                                                <Text style={{ fontSize: sizes.sText14, color: colors.white }}>{this.state.isEdit == true ? "Cập nhật" : "Gửi tương tác"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ height: 1, backgroundColor: colors.peacockBlue, width: '100%' }}></View>
                                </View>
                            </View>

                        </View>
                    </KeyboardAvoidingView>

                </Modal>
                <IsLoading />
            </View >
        )
    }
}

const mapStateToProps = state => ({
    dataNguon: state.GetList_NguonPhanAnh,
    dataChuyenMuc: state.GetList_ChuyenMuc,
    dataMucDo: state.GetList_MucDoAll,
    dataLinhVuc: state.GetList_LinhVuc,
    dataDonVi: state.GetList_DonVi,
});
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        marginTop: 22,
        // backgroundColor: 'blue',
    },
    modalView: {
        paddingBottom: 30,
        backgroundColor: colors.colorGrayBgr,
        width: '100%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {

        textAlign: "center"
    }
});

export default Utils.connectRedux(ChiTietTuongTac, mapStateToProps, false);
