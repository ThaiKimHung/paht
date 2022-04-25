import React, { Component, Fragment } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import Utils from '../../../app/Utils';
import { nstyles, colors, sizes } from '../../../styles';
import { IsLoading, ListEmpty } from '../../../components';
import ButtonCus from '../../../components/ComponentApps/ButtonCus';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Images } from '../../images';
import { Width, Height } from '../../../styles/styles';
import HeaderModal from './components/HeaderModal';
import ItemNoiDung from './components/ItemNoiDung';
import { SwipeListView } from 'react-native-swipe-list-view';
import ItemTraoDoi from './components/ItemTraoDoi';
import apis from '../../apis';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { nGlobalKeys } from '../../../app/keys/globalKey';
class ModalNoiDungTraoDoi extends Component {
    constructor(props) {
        super(props);
        this.editGhiChu = false;
        this.IdPA = Utils.ngetParam(this, 'IdPA', {});
        this.callback = Utils.ngetParam(this, "callback", () => { });
        this.PANB = Utils.ngetParam(this, "PANB");
        this.action = Utils.ngetParam(this, 'action', {})//dataButton
        this.check = false;
        this.state = {
            dataTraoDoi: [],
            noiDung: '',
            idRow: '',
            key: '',
            map: '',
        };
    }

    componentDidMount() {
        this._getChiTietTraoDoi();
        Utils.nlog('ROOTGlobal[nGlobalKeys.Reload_NhatKyThaoTacPhanAnh]', ROOTGlobal[nGlobalKeys.Reload_NhatKyThaoTacPhanAnh])
    }

    goback = () => {
        if (this.check) ROOTGlobal[nGlobalKeys.Reload_NhatKyThaoTacPhanAnh]();
        Utils.goback(this);
    }

    _getChiTietTraoDoi = async () => {
        // Utils.nlog('IDPA', this.IdPA)
        let res = null;
        if (this.PANB) res = await apis.Autonoibo.ChiTietTraoDoi(this.IdPA);
        else res = await apis.Auto.ChiTietTraoDoi(this.IdPA);
        // Utils.nlog('noi dung trao doi', res)
        if (res.status == 1 && res.data.length > 0) {
            var lsttraodoi = res.data.map((item) => {
                return { ...item, key: item.IdRow }
            })
            Utils.nlog('key', lsttraodoi)
            this.setState({ dataTraoDoi: lsttraodoi })
        } else {
            this.setState({ dataTraoDoi: [] })
        }
    }

    onChangeNoiDung = (text) => {
        this.setState({ noiDung: text })
    }

    _ThemXoaSuaTraoDoi = async (isDel = false, IdRowDel = 0, NoiDungDel = '') => {
        let res = null;
        if (this.state.noiDung.trim() == '' && isDel != true) {
            Utils.showMsgBoxOK(this, "Thông báo", "Chưa nhập nội dung trao đổi", 'Xác nhận');
            return;
        }
        this.isLoadding.show();
        let bodyTD = {
            IdPA: this.IdPA,
            NoiDung: this.state.noiDung,
        };

        if (this.state.editGhiChu) {
            //Thuc hien edit
            bodyTD.IdRow = this.state.IdRow;
        }
        if (isDel == true) {
            bodyTD = {
                ...bodyTD,
                IdRow: IdRowDel,
                NoiDung: NoiDungDel,
                IsDel: true
            }
        }

        if (this.PANB) res = await apis.Autonoibo.TraoDoi(bodyTD);
        else res = await apis.Auto.TraoDoi(bodyTD);
        if (res && res.status == 1) {
            this.check = true;
            //Cap nhat lai danh sach
            this._getChiTietTraoDoi();
            this.isLoadding.hide();
            this.setState({ editGhiChu: false, noiDung: '', idRow: '' })
            return;
        }
        this.isLoadding.hide();
        Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại", "Xác nhận")
    }

    _deleteTraoDoiPA = async (IdRow, NoiDung) => {
        Utils.showMsgBoxYesNo(this, "Xóa trao đổi", "Bạn có chắc chắn muốn xóa trao đổi này?", "Xoá", "Hủy", async () => {
            this._ThemXoaSuaTraoDoi(true, IdRow, NoiDung);
        })
    }

    closeRow(key, rowKey) {
        if (key[rowKey]) {
            key[rowKey].closeRow();
        };
    }

    _editTraoDoiPA = (key, item) => {
        var rowKey = item.IdRow;
        Utils.nlog("Noi dung:", item)

        if (this.state.editGhiChu) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Trao đổi đang được chỉnh sửa, vui lòng cập nhật', 'Đồng ý');
            this.closeRow(key, rowKey);
        } else {
            this.setState({
                noiDung: item.NoiDung, editGhiChu: true,
                IdRow: item.IdRow
            })
            this.closeRow(key, rowKey);
            this.GHICHU.focus();
        };

    }
    huyEdit = () => {
        this.setState({ editGhiChu: false, noiDung: '', idRow: '' })
    }
    _onFoCus = () => {
        var { editGhiChu, key, map } = this.state;
        if (editGhiChu != true && key && map) {
            this.closeRow(map, key)
        }
    }
    _renderHide = (data, rowMap) => <View style={stylesTD.rowBack}>
        <TouchableOpacity
            style={stylesTD.backRightBtnLeft}
            onPress={() => this._editTraoDoiPA(rowMap, data.item)}
        >
            <Image source={Images.icPen} style={[nstyles.nstyles.nIcon20, { tintColor: 'white' }]} />
            <Text style={{ color: '#FFF', fontSize: sizes.sizes.sText14 }}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={stylesTD.backRightBtnRight}
            onPress={() => this._deleteTraoDoiPA(data.item.IdRow, data.item.NoiDung)}
        >
            <Image source={Images.icDelete} style={[nstyles.nstyles.nIcon20, { tintColor: 'white' }]} />
            <Text style={{ color: '#FFF', fontSize: sizes.sizes.sText14 }}>Xóa</Text>
        </TouchableOpacity>
    </View>

    _renderItem = data => <ItemTraoDoi item={data.item} />

    _keyExtractor = (item, index) => index.toString();

    _onRowOpen = (rowKey, rowMap) => this.setState({ key: rowKey, map: rowMap })

    render() {
        var { dataTraoDoi, noiDung } = this.state
        return (
            <View style={[{ flex: 1, justifyContent: 'center' }]} >
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center',
                }} />
                <View style={{
                    backgroundColor: colors.white,
                    flex: 1, marginTop: nstyles.Height(5), borderTopLeftRadius: 30, borderTopRightRadius: 30
                }}>
                    <HeaderModal
                        title={this.action ? this.action.ButtonText : 'Nội dung trao đổi'}
                        _onPress={this.goback}
                    />
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

                        <ItemNoiDung
                            value={noiDung}
                            refin={ref => this.GHICHU = ref}
                            onFocus={this._onFoCus}
                            textTieuDe={<Text>Nội dung <Text style={{ color: colors.redStar }}>*</Text></Text>}
                            placeholder='Nội dung trao đổi'
                            numberOfLines={2}
                            multiline={true}
                            stConainer={{ marginHorizontal: 15 }}
                            stNoiDung={{ fontSize: sizes.sizes.sText14, height: Height(8), textAlignVertical: 'top', paddingTop: 5 }}
                            onChangeText={(text) => this.onChangeNoiDung(text)}
                        />
                        <View style={[nstyles.nstyles.nrow, { justifyContent: 'space-evenly' }]}>
                            {
                                this.state.editGhiChu ? <ButtonCus
                                    stContainerR={{ backgroundColor: colors.grayLight }}
                                    onPressB={this.huyEdit}
                                    textTitle={'Hủy'}
                                /> : null
                            }
                            <ButtonCus
                                onPressB={this._ThemXoaSuaTraoDoi}
                                textTitle={this.state.editGhiChu ? "Cập nhật" : `Thêm mới`}
                            />
                        </View>

                        <View style={{
                            height: 1,
                            backgroundColor: colors.veryLightPink, marginTop: 30, marginHorizontal: 15
                        }} />

                        {dataTraoDoi.length > 0 ? <Fragment >
                            <SwipeListView
                                disableRightSwipe
                                onRowOpen={this._onRowOpen}
                                data={dataTraoDoi}
                                renderItem={this._renderItem}
                                keyExtractor={this._keyExtractor}
                                renderHiddenItem={this._renderHide}
                                leftOpenValue={75}
                                rightOpenValue={-150}
                                previewRowKey={`${dataTraoDoi[0].key}`}
                                previewOpenValue={-40}
                                previewOpenDelay={3000}
                                onRowDidOpen={this.onRowDidOpen}
                                onSwipeValueChange={this.onSwipeValueChange}
                            />
                            {/* <View style={{
                                height: 1, width: Width(90), marginLeft: 15,
                                backgroundColor: colors.veryLightPink, marginTop: 5
                            }} /> */}
                        </Fragment> : <ListEmpty textempty={'Không có dữ liệu'} />}
                    </KeyboardAwareScrollView>
                    <IsLoading ref={refs => this.isLoadding = refs} />
                </View>
            </View>
        );
    }
}
export default ModalNoiDungTraoDoi

const stylesTD = StyleSheet.create({
    rowBack: {
        flex: 1,
        ...nstyles.nstyles.nrow,
        justifyContent: 'flex-end'
    },
    backRightBtn: {
        bottom: 0,
        ...nstyles.nstyles.nmiddle,
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        ...nstyles.nstyles.nmiddle,
        backgroundColor: colors.colorBlueLight,
        width: 75,
    },
    backRightBtnRight: {
        ...nstyles.nstyles.nmiddle,
        backgroundColor: colors.grayLight,
        width: 75,
    },
});