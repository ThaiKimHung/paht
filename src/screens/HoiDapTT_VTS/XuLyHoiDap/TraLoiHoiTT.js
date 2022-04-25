import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import Utils, { icon_typeToast } from '../../../../app/Utils';
import { IsLoading } from '../../../../components';
import ButtonCus from '../../../../components/ComponentApps/ButtonCus';
import HtmlViewCom from '../../../../components/HtmlView';
import HeaderModal from '../../../../srcAdmin/screens/PhanAnhHienTruong/components/HeaderModal';
import { colors } from '../../../../styles';
import { Height, nstyles } from '../../../../styles/styles';
import apis from '../../../apis';
import { Images } from '../../../images';
import ImagePickerNew from '../../../../components/ComponentApps/ImagePicker/ImagePickerNew'
import { reText } from '../../../../styles/size';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import RNCompress from '../../../RNcompress'

const KeyButton = {
    TiepNhan: 1,
    KhongTiepNhan: 2,
    ChinhSua: 3,
    ChuyenXuLy: 4,
    ThuHoi: 5,
    Xoa: 6,
    TraLai: 7,
    TraLoi: 8
}

const arrButton = [
    {
        Key: 'XemLichSu',
        Name: 'Lịch sử',
        Icon: Images.ichistory,
        ColorIcon: colors.blueFaceBook
    },
    {
        Key: 'CapNhat',
        Name: 'Cập nhật',
        Icon: Images.icEditHome,
        ColorIcon: colors.greenFE
    },
    {
        Key: 'Xoa',
        Name: 'Xoá',
        Icon: Images.icDelete,
        ColorIcon: colors.redStar
    },
]

class TraLoiHoiTT extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback', () => { })
        this.item = Utils.ngetParam(this, 'item', '')
        this.state = {
            NoiDungTraLoi: '',
            ListFileDinhKemNew: [],
            ListHinhAnh: [],
            ListHinhAnhDelete: [],
            isUpdate: false,
            AnswerUpdate: {},
            DetailsQuestion: this.item
        };
        this.refLoading = React.createRef(null)
    }

    componentDidMount() {
        this.getInfoCauHoi()
    }

    getInfoCauHoi = async () => {
        this.refLoading.current.show()
        Utils.nlog('[LOG] id cau hoi', this.item.Id)
        let res = await apis.apiHoiDapVTS.Info_HoiTT(this.item?.Id || '')
        Utils.nlog('[LOG] cau hoi', res)
        this.refLoading.current.hide()
        if (res.status == 1 && res.data) {
            this.setState({ DetailsQuestion: res.data })
        } else {
            this.setState({ DetailsQuestion: '' })

        }
    }

    handleButton = (item, dataTraLoi) => {
        switch (item.Key) {
            case 'XemLichSu':
                Utils.goscreen(this, 'Modal_LichSuCauTraLoi', { dataTraLoi: dataTraLoi })
                break;
            case 'CapNhat':
                const { lstDinhKem_Dap = [], NoiDungTraLoi } = dataTraLoi
                let dataFile = lstDinhKem_Dap.map(e => { return { ...e, uri: e.Link } })
                this.setState({ NoiDungTraLoi: NoiDungTraLoi, ListHinhAnh: dataFile, isUpdate: true, AnswerUpdate: dataTraLoi })
                break;
            case 'Xoa':
                Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn xoá câu trả lời.', 'Xoá', 'Xem lại', async () => {
                    this.refLoading.current.show()
                    let body = {
                        "IdRow": dataTraLoi?.IdRow,
                        "IdHoi": dataTraLoi?.IdHoi
                    }
                    let res = await apis.apiHoiDapVTS.Delete_DapTT(body)
                    Utils.nlog("[LOG] res xoa cau tra loi", res)
                    this.refLoading.current.hide()
                    if (res.status == 1) {
                        Utils.showToastMsg('Thông báo', 'Xoá câu trả lời thành công.', icon_typeToast.success, 2000, icon_typeToast.success)
                        await this.getInfoCauHoi()
                    } else {
                        Utils.showToastMsg('Thông báo', res?.error?.message ? res?.error?.message : 'Xoá câu trả lời thất bại.', icon_typeToast.danger, 2000, icon_typeToast.danger)
                    }
                })
                break;

            default:
                break;
        }
    }

    Add_UpdateAnswer = async () => {
        const { AnswerUpdate, isUpdate, NoiDungTraLoi, ListFileDinhKemNew, ListHinhAnh, ListHinhAnhDelete, DetailsQuestion } = this.state
        const { TrangThai, Id } = DetailsQuestion

        if (!NoiDungTraLoi) {
            return Utils.showToastMsg('Thông báo', 'Vui lòng nhập nội dung trả lời', icon_typeToast.warning, 2000, icon_typeToast.warning)
        }
        if (isUpdate) {
            this.refLoading.current.show()
            let dem = 0;
            let dataBoDy = new FormData();

            // Utils.nlog("giá trị lish hình ảnh", ListHinhAnh);

            //duyệt hình
            for (let index = 0; index < ListFileDinhKemNew.length; index++) {
                dem++;
                let item = ListFileDinhKemNew[index];
                Utils.nlog("Log ra item nè!!", item)
                let file = `File${index == 0 ? '' : index} `;

                if (item.type == 2) {
                    if (Platform.OS == 'ios') {
                        const dest = `${RNFS.TemporaryDirectoryPath}${Math.random().toString(36).substring(7)}.mp4`;
                        let uriReturn = await RNFS.copyAssetsVideoIOS(item.uri, dest);
                        await RNCompress.compressVideo(uriReturn, 'medium').then(uri => {
                            console.log("uri mới nhe", uri);
                            dataBoDy.append(file,
                                {
                                    name: "filename" + index + '.mp4',
                                    type: "video/mp4",
                                    uri: uri.path

                                });
                        })
                    } else {
                        dataBoDy.append(file,
                            {
                                name: "filename" + index + '.mp4',
                                type: "video/mp4",
                                uri: item.uri
                            });
                    }
                }
                else if (item.type == 3) {
                    dataBoDy.append(file,
                        {
                            name: item.name,
                            type: item.typeAplication || "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            uri: item.uri
                        });
                }
                else {
                    await ImageResizer.createResizedImage(item.uri, item.width, item.height, 'JPEG', Platform.OS == 'android' ? 60 : 40, 0)
                        .then(async (response) => {
                            dataBoDy.append(file,
                                {
                                    name: "file" + index + '.png',
                                    type: "image/png",
                                    uri: response.uri
                                });
                        })
                        .catch(err => {
                            dem--;
                            Utils.nlog("gia tri err-----------------", err)
                        });
                };
            }
            if (dem == 0) {
                dataBoDy.append("FileDinhKem", true);
            }
            dataBoDy.append("IdRow", AnswerUpdate?.IdRow);
            dataBoDy.append("IdHoi", AnswerUpdate?.IdHoi);
            dataBoDy.append("TrangThai", TrangThai);
            dataBoDy.append("NoiDungTraLoi", NoiDungTraLoi);
            Utils.nlog('BODY UPDATE CAU TRA LOI', dataBoDy)
            let res = await apis.apiHoiDapVTS.Edit_DapTT(dataBoDy)
            this.refLoading.current.hide()
            Utils.nlog('[LOG] res cap nhat cau tra loi', res)
            if (res.status == 1) {
                Utils.showToastMsg('Thông báo', 'Cập nhật câu trả lời thành công.', icon_typeToast.success, 2000, icon_typeToast.success)
                await this.getInfoCauHoi()
                this.setState({ NoiDungTraLoi: '', ListHinhAnh: [], isUpdate: false, AnswerUpdate: '' })
            } else {
                Utils.showToastMsg('Thông báo', res?.error?.message ? res?.error?.message : 'Cập nhật câu trả lời thất bại.', icon_typeToast.danger, 2000, icon_typeToast.danger)
            }

        } else {
            this.refLoading.current.show()
            let dem = 0;
            let dataBoDy = new FormData();

            // Utils.nlog("giá trị lish hình ảnh", ListHinhAnh);

            //duyệt hình
            for (let index = 0; index < ListFileDinhKemNew.length; index++) {
                dem++;
                let item = ListFileDinhKemNew[index];
                Utils.nlog("Log ra item nè!!", item)
                let file = `File${index == 0 ? '' : index} `;

                if (item.type == 2) {
                    if (Platform.OS == 'ios') {
                        const dest = `${RNFS.TemporaryDirectoryPath}${Math.random().toString(36).substring(7)}.mp4`;
                        let uriReturn = await RNFS.copyAssetsVideoIOS(item.uri, dest);
                        await RNCompress.compressVideo(uriReturn, 'medium').then(uri => {
                            console.log("uri mới nhe", uri);
                            dataBoDy.append(file,
                                {
                                    name: "filename" + index + '.mp4',
                                    type: "video/mp4",
                                    uri: uri.path

                                });
                        })
                    } else {
                        dataBoDy.append(file,
                            {
                                name: "filename" + index + '.mp4',
                                type: "video/mp4",
                                uri: item.uri
                            });
                    }
                }
                else if (item.type == 3) {
                    dataBoDy.append(file,
                        {
                            name: item.name,
                            type: item.typeAplication || "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            uri: item.uri
                        });
                }
                else {
                    await ImageResizer.createResizedImage(item.uri, item.width, item.height, 'JPEG', Platform.OS == 'android' ? 60 : 40, 0)
                        .then(async (response) => {
                            dataBoDy.append(file,
                                {
                                    name: "file" + index + '.png',
                                    type: "image/png",
                                    uri: response.uri
                                });
                        })
                        .catch(err => {
                            dem--;
                            Utils.nlog("gia tri err-----------------", err)
                        });
                };
            }
            if (dem == 0) {
                dataBoDy.append("FileDinhKem", true);
            }
            dataBoDy.append("IdRow", 0);
            dataBoDy.append("IdHoi", Id);
            dataBoDy.append("TrangThai", TrangThai);
            dataBoDy.append("NoiDungTraLoi", NoiDungTraLoi);
            Utils.nlog('BODY ADD CAU TRA LOI', dataBoDy)
            let res = await apis.apiHoiDapVTS.Add_DapTT(dataBoDy)
            this.refLoading.current.hide()
            Utils.nlog('[LOG] res them cau tra loi', res)
            if (res.status == 1) {
                Utils.showToastMsg('Thông báo', 'Thêm câu trả lời thành công.', icon_typeToast.success, 2000, icon_typeToast.success)
                this.getInfoCauHoi()
            } else {
                Utils.showToastMsg('Thông báo', res?.error?.message ? res?.error?.message : 'Thêm câu trả lời thất bại.', icon_typeToast.danger, 2000, icon_typeToast.danger)
            }
        }
    }

    onChangeContent = (text) => {
        Utils.goscreen(this, "Modal_EditHTML", {
            content: this.state.NoiDungTraLoi,
            callback: (val) => this.setState({ NoiDungTraLoi: val })
        })
    }


    render() {
        const { NoiDungTraLoi, ListHinhAnh, ListHinhAnhDelete, ListFileDinhKemNew, isUpdate, AnswerUpdate, DetailsQuestion } = this.state
        const { lstDap = [], TieuDe, AddRole } = DetailsQuestion
        console.log('data cau hoi', DetailsQuestion)
        return (
            <View style={[{ flex: 1, justifyContent: 'center' }]} >
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center',

                }} onTouchEnd={this.goback} />
                <View style={{
                    backgroundColor: colors.white,
                    flex: 1, marginTop: Height(10),
                    borderTopLeftRadius: 30, borderTopRightRadius: 30,

                }}>
                    <HeaderModal
                        title={'Trả lời câu hỏi'}
                        _onPress={() => Utils.goback(this)}
                    />
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 10 }}>
                        {
                            AddRole == '1' && !isUpdate ? null :
                                <View>
                                    <Text style={{ fontWeight: 'bold' }}>{isUpdate ? `Cập nhật câu trả lời: ${AnswerUpdate?.TenPhuongXa ? AnswerUpdate?.TenPhuongXa + ' - ' : ''}${AnswerUpdate?.FullName ? AnswerUpdate.FullName : ''}` : `Nội dung trả lời`}</Text>
                                    <TouchableOpacity onPress={this.onChangeContent}>
                                        {NoiDungTraLoi ?
                                            <HtmlViewCom html={NoiDungTraLoi} style={{ height: '100%', backgroundColor: colors.BackgroundHome, padding: 10, minHeight: 100, marginTop: 10, borderRadius: 5 }} /> :
                                            <View style={{ padding: 10, backgroundColor: colors.BackgroundHome, height: 100, marginTop: 10, borderRadius: 5 }}>
                                                <Text style={{ color: colors.brownGreyTwo }}>Nhập nội dung</Text>
                                            </View>}
                                    </TouchableOpacity>
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={{ paddingVertical: 5, paddingLeft: 10 }}>Đính kèm file (tối đa 1 file):</Text>
                                        <ImagePickerNew
                                            data={isUpdate ? ListHinhAnh : []}
                                            dataNew={!isUpdate ? ListHinhAnh : []}
                                            NumberMax={1}
                                            isEdit={true}
                                            keyname={"TenFile"} uniqueKey={'uri'} nthis={this}
                                            onDeleteFileOld={(data) => {
                                                let dataNew = [].concat(ListHinhAnhDelete).concat(data)
                                                this.setState({ ListHinhAnhDelete: dataNew })
                                            }}
                                            onAddFileNew={(data) => {
                                                Utils.nlog("Data list image mớ", data)
                                                this.setState({ ListFileDinhKemNew: data })
                                            }}
                                            onUpdateDataOld={(data) => {
                                                this.setState({ ListHinhAnh: data })
                                            }}
                                            isPickOne={true}
                                            nthis={this}
                                        >
                                        </ImagePickerNew>
                                    </View>
                                    <ButtonCus
                                        textTitle={isUpdate ? 'Cập nhật' : 'Trả lời'}
                                        onPressB={this.Add_UpdateAnswer}
                                        stContainerR={{ marginTop: 20.5, marginLeft: 15, marginBottom: 30, flex: 1 }}
                                    />
                                </View>
                        }
                        <View style={{ backgroundColor: colors.blueFaceBook, padding: 8, borderRadius: 5 }}>
                            <Text style={{ fontSize: reText(16), textAlign: 'center', color: 'white' }}>Danh sách phản hồi</Text>
                        </View>
                        {
                            lstDap?.length > 0 && lstDap ?
                                lstDap.map((item, index) => {
                                    return (
                                        <View key={index} style={{ backgroundColor: colors.BackgroundHome, padding: 10, borderRadius: 5, marginTop: 10 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ paddingRight: 10, fontSize: reText(13), textAlign: 'justify', flex: 1 }}>Người trả lời: {item?.TenPhuongXa ? item?.TenPhuongXa + ' - ' : ''}{item?.FullName ? item.FullName : ''}</Text>
                                                <Text style={{ paddingVertical: 2, fontSize: reText(13), textAlign: 'justify' }}>{item?.CreatedDate ? item.CreatedDate : ''}</Text>
                                            </View>
                                            <Text style={{ fontWeight: 'bold', fontSize: reText(12), textAlign: 'justify', marginBottom: 10 }}>Nội dung trả lời:</Text>
                                            <View style={{ flex: 1, backgroundColor: colors.white, padding: 8, borderRadius: 5 }}>
                                                <HtmlViewCom html={item.NoiDungTraLoi ? item.NoiDungTraLoi : '<div></div>'} style={{}} />
                                                {
                                                    item?.lstDinhKem_Dap?.length > 0 && item?.lstDinhKem_Dap ?
                                                        <TouchableOpacity
                                                            onPress={() => { Utils.openWeb(this, item.lstDinhKem_Dap[0]?.Link, { title: 'File đính kèm' }) }}
                                                            style={{ alignSelf: 'flex-start', marginTop: 10 }}>
                                                            <Text style={{ fontSize: reText(14), color: colors.blueFaceBook, fontWeight: 'bold', textAlign: 'justify' }}>{'📂 File đính kèm (nhấn vào đây để xem chi tiết)'}</Text>
                                                        </TouchableOpacity>
                                                        : null
                                                }
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                                {item.EditRole == '1' && arrButton.map((btn, idbtn) => {
                                                    return (
                                                        <TouchableOpacity key={idbtn} onPress={() => this.handleButton(btn, item)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Image source={btn.Icon} style={[nstyles.nIcon16, { tintColor: btn.ColorIcon }]} resizeMode='contain' />
                                                            <Text style={{ paddingHorizontal: 5 }}>{btn.Name}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                })}
                                            </View>
                                        </View>
                                    )
                                })
                                : <Text style={{ fontSize: reText(14), color: 'black', paddingVertical: 10, textAlign: 'center' }}>Không có dữ liệu</Text>
                        }
                    </KeyboardAwareScrollView>
                </View>
                <IsLoading ref={this.refLoading} />
            </View >
        );
    }
}

export default TraLoiHoiTT;
