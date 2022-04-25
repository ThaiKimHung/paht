import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import HeaderModal from './components/HeaderModal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { nstyles, Height, Width } from '../../../styles/styles'
import { IsLoading, WebViewCus } from '../../../components'
import { colors, sizes } from '../../../styles'
import Utils from '../../../app/Utils'
import FileCom from './components/FileCom'
import apis from '../../apis'
import ButtonCus from '../../../components/ComponentApps/ButtonCus'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import { ROOTGlobal } from '../../../app/data/dataGlobal'
import HtmlViewCom from '../../../components/HtmlView'
import { ConfigScreenDH } from '../../routers/screen'


const styles = StyleSheet.create({
    title: {
        color: colors.colorHeaderApp,
        fontSize: sizes.sizes.sText14,
        // paddingTop: 17
    },
    noidung: {
        paddingTop: 8,
        flexDirection: 'row'
    },
})
export class Modal_XemSuaNhatKy extends Component {
    constructor(props) {
        super(props);
        this.dataitem = Utils.ngetParam(this, "data", {}),
            this.state = {
                data: this.dataitem,
                arrImage: [],
                arrAplicaton: [],
                arrFileDelete: [],
                isEdit: Utils.ngetParam(this, "isEdit", false),
                NoiDungXL: this.dataitem.NoiDungXL,
                height: 40,
            }
    }
    componentDidMount() {
        Utils.nlog("gia tri item nhat ky", Utils.ngetParam(this, "data", {})), this.state.data
    }

    _UpdateBeforPublic = async () => {
        if (this.state.NoiDungXL == '') {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn chưa nhập nội dung xử lý", 'Xác nhận');
            return;
        }
        nthisIsLoading.show();
        let LstImg = [], arrVideo = [];
        var { arrImage, arrAplicaton, arrFileDelete } = this.state//list image
        for (let index = 0; index < arrImage.length; index++) {
            let item = arrImage[index];

            //|| temp.includes("mov") || temp.includes("mp4")
            if (item.IsNew == true) {

                let checkImage = Utils.checkIsImage(item.Path) || Utils.checkIsImage(item.filename) || Utils.checkIsImage(item.name);
                if (checkImage == true || item.isImage == true || item.timePlay == 0) {
                    let downSize = 1;
                    if (item.height >= 2000 || item.width >= 2000) {
                        downSize = 0.3;
                    }
                    let strBase64 = await Utils.parseBase64(item.uri, item.height, item.width, downSize, item?.timePlay);
                    LstImg.push({
                        strBase64: strBase64,
                        filename: "hinh" + index + ".png",
                        extension: ".png",
                        type: 1,
                        isnew: true,
                        IdRow: 0,
                        isdelete: false
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
                            strBase64: strBase64,
                            filename: `Video_${index}${Platform.OS == 'ios' ? ".mov" : ".mp4"}`,//("Video_" + index + Platform.OS == 'ios' ? ".mov" : ".mp4"),
                            extension: Platform.OS == 'ios' ? ".mov" : ".mp4",
                            type: 2,
                            isnew: true,
                            IdRow: 0,
                            isdelete: false
                        });
                    }
                }

            }
        }
        for (let index = 0; index < arrAplicaton.length; index++) {

            let item = arrAplicaton[index];
            if (item.IsNew == true) {
                let strBase64;
                // strBase64 = await Utils.parseBase64(item.uri);
                if (item.uri) {
                    var duoiFile = item?.TenFile.split('.')
                    var fi = "." + duoiFile[duoiFile.length - 1]
                    Utils.nlog("gia trị duôi file", fi)
                    LstImg.push({
                        strBase64: item.base64,
                        filename: item.name,
                        extension: fi,
                        type: 2,
                        isnew: true,
                        IdRow: 0,
                        isdelete: false
                    });
                }
            }

        }

        if (arrFileDelete.length > 0) {
            for (let index = 0; index < arrFileDelete.length; index++) {
                let item = arrFileDelete[index];
                LstImg.push({
                    ...item,
                    isnew: true,
                    IsDel: true,
                    isdelete: true,
                    IdRow: item.IdRow
                });
            }
        }
        var body = {
            NoiDungXL: this.state.NoiDungXL,
            IdPA: this.state.data.IdPA,
            IdRow: this.state.data.IdRow,
            UploadPA: LstImg,
        }
        Utils.nlog("gia tri body", body);
        const res = await apis.Auto.UpdateBeforPublic(body);
        Utils.nlog("gia tri res upfer ", res)
        if (res.status == 1) {
            if (Platform.OS == 'android' && arrVideo.length > 0) {
                var { IdLS = 0, IdPA = 0, ThaoTac = 0 } = this.state.data;
                const resVideo = await apis.ApiUpLoadVideo.Uploadvideo(arrVideo, IdPA, IdLS, ThaoTac);
                if (resVideo.status == 1) {
                    nthisIsLoading.hide();
                    Utils.nlog("gia tri video", arrVideo)
                    Utils.showMsgBoxOK(this, "Thông báo", "Thực hiện thành công", "Xác nhận", () => {
                        ROOTGlobal[nGlobalKeys.Reload_NhatKyThaoTacPhanAnh]();
                        Utils.goback(this);
                    })
                } else {
                    nthisIsLoading.hide();
                    Utils.nlog("gia tri video", arrVideo)
                    Utils.showMsgBoxOK(this, "Thông báo", "Cập nhật video cho phản ánh thất bại", "Xác nhận", () => {
                        Utils.goback(this);
                    })
                }
            } else {
                nthisIsLoading.hide();
                Utils.nlog("gia tri video", arrVideo)
                Utils.showMsgBoxOK(this, "Thông báo", "Thực hiện thành công", "Xác nhận", () => {
                    ROOTGlobal[nGlobalKeys.Reload_NhatKyThaoTacPhanAnh]();
                    Utils.goback(this);
                    // this.goback(this);
                })
            }

        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Xử lý thất bại", "Xác nhận")
        }
    }
    _UpdateFile = (arrImage = [], arrAplicaton = [], arrFileDelete = []) => {
        Utils.nlog("vao set File Upload")
        this.setState({ arrImage, arrAplicaton, arrFileDelete });
    }
    render() {
        const { data, isEdit, height } = this.state
        Utils.nlog("Data----<<<<:", data)
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
                        _onPress={() => Utils.goback(this)}
                        multiline={true}
                        title='Nhật ký thao tác'
                    />
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 15 }}>
                        {data.ThoiGian != "" ?
                            <View style={[styles.noidung]}>
                                <Text style={{ flex: 1 }}>
                                    {<Text style={[styles.title]}>Ngày thực hiện: </Text>}
                                    {data.ThoiGian}
                                </Text>
                            </View> : null}

                        {data.NguoiTao != "" ?
                            < View style={[styles.noidung]}>
                                <Text style={{ flex: 1 }}>
                                    {<Text style={[styles.title]}>Người thực hiện: </Text>}
                                    {data.NguoiTao}
                                </Text>
                            </View> : null}

                        {data.NguoiTenTrangThaiDaThaoTacTao != "" ?
                            <View style={[styles.noidung]}>
                                <Text style={{ flex: 1 }}>
                                    {<Text style={[styles.title]}>Trạng thái đã thao tác: </Text>}
                                    {data.TenTrangThaiDaThaoTac}
                                </Text>
                            </View> : null}

                        {data.ThaoTacText != "" ?
                            <View style={[styles.noidung]}>
                                <Text style={{ flex: 1 }}>
                                    {<Text style={[styles.title]}>Thao tác: </Text>}
                                    {data.ThaoTacText}
                                </Text>
                            </View> : null}


                        <View style={[{ width: '100%' }]}>
                            <View pointerEvents={isEdit ? 'auto' : 'none'}
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
                                <Text style={[styles.title]}>Nội dung xử lý:</Text>
                                <TouchableOpacity onPress={() => Utils.goscreen(this, ConfigScreenDH.Modal_EditHTML, {
                                    content: this.state.NoiDungXL,
                                    callback: (val) => this.setState({ NoiDungXL: val })
                                })}>
                                    <HtmlViewCom html={this.state.NoiDungXL} style={{ height: '100%' }} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {data.CreatedDateXL != "" ?
                            <View style={[styles.noidung]}>
                                <Text style={{ flex: 1 }}>
                                    {<Text style={[styles.title]}>Ngày thực hiện xử lý: </Text>}
                                    {data.CreatedDateXL}
                                </Text>
                            </View> : null}

                        {data.NguoiTaoXL != "" ?
                            <View style={[styles.noidung]}>
                                <Text style={{ flex: 1 }}>
                                    {<Text style={[styles.title]}>Người thực hiện xử lý: </Text>}
                                    {data.NguoiTaoXL}
                                </Text>
                            </View> : null}

                        {data.CreatedUpdateDateXL != "" ?
                            <View style={[styles.noidung]}>
                                <Text style={{ flex: 1 }}>
                                    {<Text style={[styles.title]}>Ngày cập nhật xử lý: </Text>}
                                    {data.CreatedUpdateDateXL}
                                </Text>
                            </View> : null}

                        {data.NguoiCapNhatXL != "" ?
                            <View style={[styles.noidung]}>
                                <Text style={{ flex: 1 }}>
                                    {<Text style={[styles.title]}>Người cập nhật xử lý: </Text>}
                                    {data.NguoiCapNhatXL}
                                </Text>
                            </View> : null}


                        <View style={{ backgroundColor: 'red' }}>
                            <FileCom arrFile={data.ListFileDinhKem} nthis={this} setFileUpdate={this._UpdateFile}
                                uploadDinhkem={isEdit} isUpload={isEdit} />
                            {/* {this.state.isEdit == false ?
                                <View style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, backgroundColor: 'transparent' }}>

                                </View> : null
                            } */}
                            {/* Tạm thời đóng code vì chưa hiểu mục đích của đoạn này */}
                        </View>

                        {
                            isEdit ?
                                <View>
                                    <ButtonCus
                                        onPressB={this._UpdateBeforPublic}
                                        textTitle="Cập nhật"
                                        stContainerR={{ marginTop: 20.5, width: Width(30), marginBottom: 30 }}
                                    />
                                </View> : null
                        }

                    </KeyboardAwareScrollView>
                    <IsLoading />
                </View>
            </View >
        )
    }
}
export default Modal_XemSuaNhatKy;

