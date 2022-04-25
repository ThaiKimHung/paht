import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, Platform, Linking } from 'react-native'
import Utils from '../../../app/Utils'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Height, nstyles, Width } from '../../../styles/styles'
import HeaderModal from '../PhanAnhHienTruong/components/HeaderModal'
import { ConfigScreenDH } from '../../routers/screen'
import HtmlViewCom from '../../../components/HtmlView'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ItemNoiDung from '../PhanAnhHienTruong/components/ItemNoiDung'
import FileCom from '../PhanAnhHienTruong/components/FileCom'
import moment from 'moment'
import ModalDrop from '../PhanAnhHienTruong/components/ModalDrop'
import apis from '../../apis'
import { Images } from '../../images'
import { DanhSachNguoiDung_SOS } from '../../apis/Apinochek'
import ButtonCus from '../../../components/ComponentApps/ButtonCus'
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { IsLoading } from '../../../components'
import { appConfig } from '../../../app/Config'
const ListQL = [{ IdCapDonVi: 0, TenCapDonVi: "Tất cả" }];
const KeyButton = {
    ChuyenXuLy: 1,
    ThuHoi: 2,
    ChinhSua: 3,
    Xoa: 4,
    XuLy: 5,
    HoanThanh: 6
}
export class ModalChuyenSuaSOS extends Component {
    constructor(props) {
        super(props)
        this.callback = Utils.ngetParam(this, 'callback', () => {
            ROOTGlobal.dataGlobal._reloadSOS()
            Linking.openURL(appConfig.deeplinkSOSCB_Home)
        });
        this.item = Utils.ngetParam(this, 'item')
        this.title = Utils.ngetParam(this, 'title')
        this.buttonHandle = Utils.ngetParam(this, 'buttonHandle')
        this.isEdit = Utils.ngetParam(this, 'isEdit', false)
        this.arrFile = this.item.FileDinhKem
        this.state = {
            NoiDung: this.item ? this.item.MoTa : '',
            Hoten: this.item ? this.item.HoTen : '',
            SDT: this.item ? this.item.SDT : '',
            DiaDiem: this.item ? this.item.DiaDiem : '',
            NgayTao: this.item ? this.item.CreatedDate : '',
            arrVideo: [],
            arrApplication: [],
            arrImage: [],
            arrAplicaton: [],
            arrFileDelete: [],
            LstCapQuanLy: ListQL,
            selectCapQL: ListQL[0],
            LstDonViXL: [],
            selectDVXL: { MaPX: 0, TenPhuongXa: 'Tất cả' },
            LstNgoiDung: [],
            selectNguoiDung: '',
        }
    }
    componentDidMount() {
        Utils.nlog('Gia tri item chuyen,', this.item, this.buttonHandle.Key)
        this._getLstCapQuanLy()
    }

    _getLstCapQuanLy = async () => {
        let res = await apis.Auto.GetCapDonViAll();
        Utils.nlog('data cap quan ly --------------nhé em--------------', res)
        if (res.status == 1 && res.data.length > 0) {
            this.setState({ LstCapQuanLy: [ListQL[0], ...res.data] }, this._getLstDonViXuLy);
        }

    }
    _viewItemDVXL = (item, key, value) => {
        return (
            <View
                key={item[key]}
                style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    margin: 2,

                }}>
                <Text style={{ textAlign: 'center', paddingVertical: 10 }} >{item[value]}</Text>
            </View>
        )
    }

    _callbacDVXL = (val) => {
        Utils.nlog('Gia tri vals tra ve', val)
        this.setState({ selectDVXL: val }, this._getLstNguoiDung)
    }
    _getLstDonViXuLy = async () => {
        let res = await apis.ApiDonVi.GetList_DonVi(this.state.selectCapQL.IdCapDonVi);
        Utils.nlog("gia tri chi tiết phản ánh data--22", res)
        if (res.status == 1) {
            this.setState({ LstDonViXL: res.data })
        } else {
            this.setState({ LstDonViXL: [], selectDVXL: '' })
        }
    }
    _UpdateFile = (arrImage = [], arrAplicaton = [], arrFileDelete = []) => {
        //Utils.nlog("vao set File Upload", arrImage, arrAplicaton)
        this.setState({ arrImage, arrAplicaton, arrFileDelete });
    }
    goback = () => {
        Utils.goback(this)
    }
    _getLstNguoiDung = async () => {
        let res = await DanhSachNguoiDung_SOS(this.state.selectDVXL.MaPX)
        if (res && res.status == 1) {
            this.setState({ LstNgoiDung: res.data })
        } else {
            this.setState({ LstNgoiDung: [] })
        }
        Utils.nlog('Gita tri data NguoiDung =>>>>>>>>', this.state.LstNgoiDung)
    }
    _viewItemImage = (item, keyView, moreInfo_Key = '') => {
        return (
            <View key={item.Id} style={{
                flex: 1,
                padding: 15,
                borderBottomWidth: 0.5,
                borderBottomColor: colors.black_50,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row'
            }}>
                <Text style={{ textAlign: 'center', color: colors.black_80 }} >{`${item[keyView]}`}</Text>
                <Image source={item.isCheck ? Images.icCheck : Images.icUnCheck} style={[nstyles.nIcon16, { tintColor: colors.colorBlueLight, marginRight: 10 }]}></Image>
            </View>
        )
    }
    _deleteItem = (index) => {
        const { selectNguoiDung } = this.state
        var removed = selectNguoiDung.splice(index, 1);
        this.setState({ selectNguoiDung: selectNguoiDung })
    }
    ChuyenXuLySOS = async () => {
        let LstImg = [], arrVideo = [];

        let res = null;
        var { arrImage, arrAplicaton, arrFileDelete, NoiDung, selectNguoiDung } = this.state//list image
        for (let index = 0; index < arrImage.length; index++) {
            let item = arrImage[index];

            if (item.IsNew == false) {
                continue;
            } else {
                let checkImage = Utils.checkIsImage(item.Path) || Utils.checkIsImage(item.filename) || Utils.checkIsImage(item.name);
                //|| temp.includes("mov") || temp.includes("mp4")
                if (checkImage == true || item.isImage == true || item.timePlay == 0) {
                    let downSize = 1;
                    if (item.height >= 2000 || item.width >= 2000) {
                        downSize = 0.3;
                    };
                    let strBase64 = await Utils.parseBase64(item.uri, item.height, item.width, downSize, item?.timePlay);
                    LstImg.push({
                        "type": item.timePlay == 0 ? 1 : 2,
                        "strBase64": strBase64,
                        "filename": "hinh" + index + ".png",
                        "extension": ".png",
                        "isnew": true,
                        isdelete: false,
                    });
                } else {
                    if (Platform.OS == 'android') {
                        arrVideo.push(item);
                    } else {
                        let downSize = 1;
                        if (item.height >= 2000 || item.width >= 2000) {
                            downSize = 0.3;
                        }
                        let strBase64 = await Utils.parseBase64(item.uri, item.height, item.width, downSize, item?.timePlay);
                        LstImg.push({
                            "type": 2,
                            "strBase64": strBase64,
                            "filename": `Video_${index}${Platform.OS == 'ios' ? ".mov" : ".mp4"}`,//("Video_" + index + Platform.OS == 'ios' ? ".mov" : ".mp4"),
                            "extension": Platform.OS == 'ios' ? ".mov" : ".mp4",
                            "isnew": true,
                            isdelete: false,
                        });
                    };
                };
            }
        };

        for (let index = 0; index < arrAplicaton.length; index++) {
            let item = arrAplicaton[index];
            if (item.IsNew == false) {
                continue;
            } {
                let strBase64;
                // strBase64 = await Utils.parseBase64(item.uri);
                if (item.uri) {
                    var duoiFile = item?.TenFile.split('.')
                    var fi = "." + duoiFile[duoiFile.length - 1]
                    //Utils.nlog("gia trị duôi file", fi)
                    LstImg.push({
                        "type": 2,
                        "strBase64": item.base64,
                        "filename": item.name,
                        "extension": fi,
                        "isnew": true,
                        isdelete: false,
                    });
                };
            }

        };

        for (let index = 0; index < arrFileDelete.length; index++) {
            let item = arrFileDelete[index];
            LstImg.push({
                ...item,
                IsDel: true,
                Isnew: false
            });
        }

        let FileDinhKem = [...LstImg, ...arrVideo,]
        Utils.nlog("FileDinhKem", FileDinhKem)

        let body = {}
        nthisIsLoading.show();
        if (!selectNguoiDung && this.buttonHandle.Key != 3) {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", "Vui lòng chọn cán bộ xử lý.", "Xác nhận");
            return;
        }
        switch (this.buttonHandle.Key) {
            case KeyButton.ChuyenXuLy:
                const arrUserID = [
                    ...selectNguoiDung.map(item => {
                        return {
                            "UserID": item.UserID
                        }
                    })
                ]
                body = {
                    ...this.item,
                    "MoTa": this.state.NoiDung,
                    "NoiDungThaoTac": "",
                    "IsDel": 0,
                    "Status_SOS": 2,
                    "Send": 0,
                    "Passed": false,
                    "IsXem": false,
                    "Status": 0,
                    "ListCanBo": arrUserID ? arrUserID : [],
                    "FileDinhKem": FileDinhKem,
                }
                Utils.nlog("body", body)
                res = await apis.ApiSOS.ChuyenXuLySOS(body)
                Utils.nlog("res chuyển xử lý", res)
                if (res.status == 1) {
                    nthisIsLoading.hide()
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Chuyển xử lý thành công !', 'Xác nhận', () => { this.callback(), ROOTGlobal.dataGlobal._reloadSOS(1, this.item.Id) })
                } else {
                    nthisIsLoading.hide()
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Chuyển xử lý thất bại !', 'Xác nhận')
                }

                break;
            case KeyButton.ChinhSua:
                //Gọi api api/sos/HoanThanhSOS
                Utils.nlog('Gia this Status_SOS', this.item.Status_SOS)
                body = {
                    ...this.item,
                    "MoTa": this.state.NoiDung,
                    "NoiDungThaoTac": "",
                    "IsDel": 0,
                    "Status_SOS": this.item?.Status_SOS,
                    "Send": 0,
                    "Passed": false,
                    "IsXem": false,
                    "Status": 0,
                    "ListCanBo": arrUserID ? arrUserID : [],
                    "FileDinhKem": FileDinhKem,
                }
                Utils.nlog("body", body)
                res = await apis.ApiSOS.ChuyenXuLySOS(body)
                Utils.nlog("res chinh sửa sos", res)
                if (res.status == 1) {
                    nthisIsLoading.hide()
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Chỉnh sửa thành công !', 'Xác nhận', () => {
                        ROOTGlobal.dataGlobal._reloadSOS()
                        try {
                            this.callback();
                        } catch (error) {
                            Utils.goback(this);
                        };
                    })
                } else {
                    nthisIsLoading.hide()
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Chỉnh sửa thất bại !', 'Xác nhận')
                }
                break;
            default:
                break;
        }
    }

    render() {
        let titleForm = this.title;
        const { LstCapQuanLy, selectCapQL, LstDonViXL, DemDVXLChon, selectDVXL, LstNgoiDung, selectNguoiDung } = this.state;
        return (
            <View style={[{ flex: 1, justifyContent: 'center' }]} >
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center',
                }} onTouchEnd={this.goback} />
                <View style={{
                    backgroundColor: colors.white,
                    flex: 1, marginTop: Height(10), borderTopLeftRadius: 30, borderTopRightRadius: 20
                }}>
                    <HeaderModal
                        _onPress={() => Utils.goback(this)}
                        multiline={true}
                        title={titleForm} />
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        ref={ref => { this.Scroll = ref }}
                        style={{ paddingHorizontal: 15, }}>
                        <ItemNoiDung
                            editable={this.isEdit ? true : false}
                            // numberOfLines={2}
                            multiline={true}
                            value={this.state.Hoten}
                            onChangeText={(text) => this.setState({ Hoten: text })}
                            textTieuDe={<Text>Họ và tên <Text style={{ color: colors.redStar }}>{this.state.Hoten.length < 2 ? '*' : ''}</Text></Text>}
                            stContaierTT={{ paddingVertical: 8 }}
                            stConainer={{ marginTop: 5 }}
                        />
                        <ItemNoiDung
                            editable={this.isEdit ? true : false}
                            // numberOfLines={2}
                            multiline={true}
                            value={this.state.SDT}
                            onChangeText={(text) => this.setState({ SDT: text })}
                            textTieuDe={<Text>Số điện thoại<Text style={{ color: colors.redStar }}>{this.state.SDT.length < 2 ? '*' : ''}</Text></Text>}
                            stContaierTT={{ paddingVertical: 8 }}
                            stConainer={{ marginTop: 5 }}
                        />
                        <View
                            pointerEvents={
                                'auto'
                            }
                            style={[{
                                paddingTop: 5,
                                paddingLeft: 5,
                                marginVertical: 10,
                                // alignItems: "center",
                                paddingVertical: 5,
                                borderWidth: 1,
                                borderStyle: 'dashed',
                                minHeight: 60,
                                borderColor: colors.colorHeaderApp,
                                borderRadius: 5,
                                backgroundColor: 'rgba(39,98,137,0.1)'
                            }]}
                        >
                            <TouchableOpacity onPress={() => Utils.goscreen(this, ConfigScreenDH.Modal_EditHTML, {
                                content: this.state.NoiDung,
                                callback: (val) => this.setState({ NoiDung: val })
                            })}>
                                <Text style={{
                                    color: colors.colorHeaderApp,
                                    fontSize: reText(14),
                                }}>Nội dung phản ánh: <Text style={{ color: colors.redStar }}>*</Text></Text>

                                <HtmlViewCom html={this.state.NoiDung} style={{ height: '100%' }} />
                            </TouchableOpacity>
                        </View>
                        <ItemNoiDung
                            editable={this.isEdit ? true : false}
                            // numberOfLines={2}
                            multiline={true}
                            value={this.state.DiaDiem}
                            onChangeText={(text) => this.setState({ DiaDiem: text })}
                            textTieuDe={<Text>Địa chỉ sự kiện <Text style={{ color: colors.redStar }}>{this.state.DiaDiem.length < 2 ? '*' : ''}</Text></Text>}
                            stContaierTT={{ paddingVertical: 8 }}
                            stConainer={{ marginTop: 5 }}
                        />
                        {
                            this.buttonHandle.Key == 3 ? null :
                                <>
                                    <ModalDrop
                                        value={selectCapQL}
                                        keyItem={"IdCapDonVi"}
                                        texttitle={'Cấp quản lý'}
                                        textDefault={selectCapQL.TenCapDonVi}
                                        // styleContent={{ marginRight: 5 }}
                                        dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: reText(13) }}
                                        options={LstCapQuanLy}
                                        onselectItem={(item) => this.setState({ selectCapQL: item }, this._getLstDonViXuLy)}
                                        Name={"TenCapDonVi"} />
                                    <View>
                                        <Text style={{ fontSize: reText(13), marginTop: 10 }} >{`Đơn vị xử lý`}</Text>
                                        <TouchableOpacity
                                            onPress={() => Utils.goscreen(this, ConfigScreenDH.Modal_ComponentSelectProps, {
                                                callback: (val) => this._callbacDVXL(val), item: this.state.selectDVXL,
                                                title: 'Đơn vị xử lý',
                                                AllThaoTac: LstDonViXL, ViewItem: (item) => this._viewItemDVXL(item, 'MaPX', 'TenPhuongXa'), Search: true,
                                                key: 'TenPhuongXa'
                                            })}
                                            style={{
                                                marginTop: 5, backgroundColor: colors.colorGrayTwo, flexDirection: 'row',
                                                borderWidth: 0.5, borderRadius: 2, padding: 10, borderColor: colors.brownGreyTwo,
                                            }}
                                        >
                                            <Text style={{ fontSize: reText(14), flex: 1 }}>{` ${selectDVXL ? selectDVXL.TenPhuongXa : 'Đơn vị xử lý'}`}</Text>
                                            <Image source={Images.icDropDown} style={[nstyles.nIcon15, { tintColor: colors.brownGreyThree }]} resizeMode='contain' />
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: reText(13), marginTop: 10 }} >{`Danh sách cán bộ`}</Text>
                                        <TouchableOpacity
                                            onPress={() => Utils.goscreen(this, ConfigScreenDH.Modal_ComponentSelectProps_Multi, {
                                                callback: (val) => this.setState({ selectNguoiDung: val }, Utils.nlog('Gia tri seleNguoiDung', val)), item: this.state.selectNguoiDung, key: 'FullName',
                                                title: 'Danh sách cán bộ', AllThaoTac: this.state.LstNgoiDung, ViewItem: (item) => this._viewItemImage(item, 'FullName'), Search: true, KeyID: 'UserID'
                                            })}
                                            style={{
                                                marginTop: 5, backgroundColor: colors.colorGrayTwo, flexDirection: 'row',
                                                borderWidth: 0.5, borderRadius: 2, padding: 10, borderColor: colors.brownGreyTwo,
                                            }}
                                        >
                                            <Text style={{ fontSize: reText(14), flex: 1 }}>{`Cán bộ xử lý `}<Text style={{ color: colors.redStar }}>*</Text> </Text>
                                            <Image source={Images.icDropDown} style={[nstyles.nIcon15, { tintColor: colors.brownGreyThree }]} resizeMode='contain' />
                                        </TouchableOpacity>
                                        {selectNguoiDung ?
                                            <View style={{ flexDirection: 'row', marginVertical: 5, flexWrap: 'wrap' }}>
                                                {this.state.selectNguoiDung.map((item, index) => {
                                                    return (
                                                        <View key={index} style={{ backgroundColor: colors.colorGrayBgr, borderRadius: 5, marginRight: 5, marginBottom: 3 }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                                                <Text style={{ fontStyle: 'italic', paddingLeft: 10 }}>{item.FullName}</Text>
                                                                <TouchableOpacity
                                                                    onPress={(index => this._deleteItem(index))}
                                                                    style={{ padding: 10 }}
                                                                >
                                                                    <Image source={Images.icClose} style={[nstyles.nIcon16, { tintColor: colors.redStar }]}></Image>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    )
                                                })}
                                            </View> : null}
                                    </View>
                                </>
                        }
                        <View style={{ paddingVertical: 0 }}>
                            <FileCom arrFile={this.arrFile} nthis={this} setFileUpdate={this._UpdateFile} />
                        </View>
                        <ButtonCus
                            textTitle={this.title}
                            onPressB={this.ChuyenXuLySOS}
                            stContainerR={{ marginTop: 20.5, marginLeft: 15, marginBottom: 30, flex: 1 }}
                        />
                    </KeyboardAwareScrollView>
                </View>
                <IsLoading />
            </View>
        )
    }
}

export default ModalChuyenSuaSOS
