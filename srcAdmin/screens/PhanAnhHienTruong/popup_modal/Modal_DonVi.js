import apis from "../../../apis";
import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import { sizes } from "../../../../styles/size";
import { nstyles, colors } from "../../../../styles";
import { Images } from "../../../images";
import { ListEmpty, HeaderCom, TextInputCom } from "../../../../components";
import Utils from "../../../../app/Utils";
import { ItemDanhSach } from "..";
import { ROOTGlobal } from "../../../../app/data/dataGlobal";
import ButtonCus from "../../../../components/ComponentApps/ButtonCus";
import { Width } from "../../../../styles/styles";
import { nGlobalKeys } from "../../../../app/keys/globalKey";

class Modal_DonVi extends Component {
    constructor(props) {
        super(props);
        this.listdv = Utils.ngetParam(this, "data", []);
        this.listdvA = Utils.ngetParam(this, "dataView", [])

        this.listdvP = Utils.ngetParam(this, "dataP", []);
        this.listdvAP = Utils.ngetParam(this, "dataViewP", [])

        this.dataDVXL = Utils.ngetParam(this, "dataDVXL", []);

        this.DVXL = Utils.ngetParam(this, "DVXL");

        this.pageAll = 0;
        this.state = {
            data: [],
            textempty: 'Đang tải...',
            refreshing: false,
            page: 0,
            size: 10,
            LstDonViXL: this.listdv,
            LstDVXL: this.listdvA,

            LstDonViXLP: this.listdvP,
            LstDVXLP: this.listdvAP,
            isChange: false
        };
    }
    goback = () => {
        Utils.goback(this)
    }


    _ListFooterComponent = () => {
        if (this.state.page < this.pageAll)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }

    _onClickDVXL = (item, index) => {
        if (this.DVXL) {
            ROOTGlobal[nGlobalKeys.DonViDH].checkDonVi(item, index, item.isCheck);
            this.listdv = Utils.ngetParam(this, "data", []);
            this.listdvA = Utils.ngetParam(this, "dataView", []);
            if (this.state.isChange) {
                this.setState({
                    LstDonViXL: this.listdv,
                    // LstDVXL: this.listdvA
                })
            } else {
                this.setState({
                    LstDonViXL: this.listdv,
                    LstDVXL: this.listdvA
                })

            }


        }
        else {
            ROOTGlobal[nGlobalKeys.DonViDH].checkDonViPhu(item, index);
            this.listdvP = Utils.ngetParam(this, "dataP", []);
            this.listdvAP = Utils.ngetParam(this, "dataViewP", []);


            if (this.state.isChange) {
                this.setState({
                    LstDonViXLP: this.listdvP,
                    // LstDVXL: this.listdvA
                })
            } else {
                this.setState({
                    LstDonViXLP: this.listdvP,
                    LstDVXLP: this.listdvAP
                })
            }
        }
    }
    _renderItem = ({ item, index }) => {
        var {
            IdPA,
        } = item
        let check = false;
        if (this.dataDVXL && this.dataDVXL.length > 0) {
            // Utils.nlog("gia trij item timf kieems ", item, this.dataDVXL)
            let itemCheck = this.dataDVXL.findIndex(itemck => itemck.MaPX == item.MaPX && itemck.isCheck == true);
            if (itemCheck != -1) {
                check = true
            }
        }
        if (check == true && !this.DVXL) return null
        else
            return (
                <TouchableOpacity
                    onPress={() => this._onClickDVXL(item, index)}
                    key={item.MaPX}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 20 }}>
                    <Text style={{ fontSize: sizes.sText14 }}>{item.TenPhuongXa}</Text>
                    <Image
                        source={item.isCheck == true ? Images.icCheck : Images.icUnCheck}
                        style={[nstyles.nIcon14, { tintColor: colors.peacockBlue }]}
                    />
                </TouchableOpacity>

            )
    };


    _keyExtrac = (item, index) => index.toString();
    _onRefresh = () => {
        this.setState({ refreshing: true, textempty: 'Đang tải...' }, this._getListNoCheck)
    }
    _ListHeaderComponent = () => {
        return (
            <View>

            </View>)
    }

    removeAccents = (str) => {
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    }

    _oncChangeText = async (text) => {
        var { LstDonViXL } = this.state
        console.log('bo dau=======', this.removeAccents('Xã Huyện Quận Tỉnh').toLowerCase())
        if (text == '') {
            this.setState({ LstDVXL: LstDonViXL, isChange: false })
        } else {
            const result = await LstDonViXL.filter(item => this.removeAccents(item.TenPhuongXa).toLowerCase().includes(this.removeAccents(text).toLowerCase()));
            this.setState({ LstDVXL: result, isChange: true })
        }
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <HeaderCom
                    styleContent={{ backgroundColor: colors.colorHeaderApp }}
                    titleText='Danh sách đơn vị xử lý'
                    onPressLeft={() => Utils.goback(this)}
                    hiddenIconRight={true}
                    nthis={this} />
                <TextInputCom
                    cusViewContainer={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, marginHorizontal: 5, }}
                    iconRight={Images.icSearchGrey}
                    placeholder={'Tìm kiếm'}
                    onChangeText={this._oncChangeText}
                />
                <FlatList
                    style={{ flex: 1, marginTop: 10, }}
                    // scrollEventThrottle={10}
                    onScroll={this.handleScroll}
                    showsVerticalScrollIndicator={false}
                    renderItem={this._renderItem}
                    data={this.DVXL ? this.state.LstDVXL : this.state.LstDVXLP}
                    ListEmptyComponent={<ListEmpty textempty={this.state.textempty} />}
                    // ListHeaderComponent={this._ListHeaderComponent}
                    keyExtractor={this._keyExtrac}
                    // refreshing={this.state.refreshing}
                    // onRefresh={this._onRefresh}
                    // onEndReached={this.loadMore}
                    onEndReachedThreshold={0.3}
                // ListFooterComponent={this._ListFooterComponent}
                />
                <ButtonCus
                    onPressB={() => Utils.goback(this)}
                    stContainerR={{
                        width: Width(30), paddingVertical: 12,
                        marginTop: 0, marginVertical: 30,
                        alignSelf: 'center', justifyContent: 'flex-start'
                    }}
                    textTitle={`Quay lại`}
                />
            </View>
        );
    }
}

export default Modal_DonVi
