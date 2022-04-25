import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, Linking, Platform } from 'react-native'
import DocumentPicker from 'react-native-document-picker';
import { colors } from '../../../../styles';
import { ListImageCom } from './ListImageCom';
import { appConfig } from '../../../../app/Config';
import Utils from '../../../../app/Utils';
import { reSize } from '../../../../styles/size';
import { Images } from '../../../images';
import { Width } from '../../../../styles/styles';
import { ConfigScreenDH } from '../../../routers/screen';
import RNFS from 'react-native-fs';

class FileCom extends Component {
    constructor(props) {
        super(props);
        this._setFileUpdate = props.setFileUpdate;
        this.state = {
            arrApplication: [],
            arrImage: [],
            arrFileDelete: [],
            arrFile: props.arrFile,
            uploadDinhkem: props.uploadDinhkem,
            isUpload: props.isUpload
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.arrFile != prevState.arrFile) {
            return { ...prevState, arrFile: nextProps.arrFile }
        }
        return null;

    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.arrFile !== prevProps.arrFile) {
            this._setUpDauVao();
        }
    }

    _setUpDauVao = async () => {
        // //Utils.nlog("vao set up đầu vào ---------------")
        var { arrFile } = this.state;
        var arrImage = [], arrApplication = [];
        for (let index = 0; index < arrFile.length; index++) {
            const item = arrFile[index];
            Utils.nlog('Gia tri dau vao ArrrFile Tiem', item)
            let checkImage = Utils.checkIsImage(item.Path) || Utils.checkIsImage(item.filename) || Utils.checkIsImage(item.name);
            let checkVideo = Utils.checkIsVideo(item.Path);
            if (checkImage == true || checkVideo == true) {
                arrImage.push(
                    {
                        ...item,
                        width: 500,
                        height: 578,
                        uri: item.Link ? item.Link : appConfig.domain + 'Upload/' + item.Path,
                        IsNew: false,
                        IsDel: false
                    })
            } else {
                arrApplication.push({
                    ...item,
                    uri: item.Link ? item.Link : appConfig.domain + 'Upload/' + item.Path,
                    IsNew: false,
                    IsDel: false,
                    IsVideo: true
                })
            }
            if (index == arrFile.length - 1) {
                this.setState({ arrImage, arrApplication }, () => {
                    this._setFileUpdate(this.state.arrImage, this.state.arrApplication, this.state.arrFileDelete);
                })
            }
        }
        Utils.nlog('Gia tri dau vao this.state.arrApplication', this.state.arrApplication)
    }
    componentDidMount() {
        // //Utils.nlog("vao set up dau vao")
        this._setUpDauVao();
        Utils.nlog('Gia tri dau vao ArrrFile', this.state.arrFile)
    }
    _openFile = async () => {
        var arrImage = [], arrApplication = [];
        try {
            const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.allFiles],
            });
            Utils.nlog('results =>', results)
            const realURI = Platform.select({ android: results[0].uri, ios: decodeURI(results[0].uri), })
            const b64 = await RNFS.readFile(realURI, "base64")
            const strBase64 = await Utils.parseBase64(results[0].uri)
            Utils.nlog(' resolve({ b64, fileTyp, fileExtension, filename });', strBase64)
            var arr = this.state.arrApplication;
            var { arrImage, arrApplication } = this.state

            for (let index = 0; index < results.length; index++) {
                const item = results[index];
                Utils.nlog("gia tri arrApplication 1", item);
                var type = item.type.split('/');
                const sizeFile = (!item?.width || !item?.height) && (type[0].includes('video') || type[0].includes('image')) ? await Utils.getImageSize(item?.uri) : item
                if (type[0].includes('video')) {
                    arrImage.unshift(
                        {
                            ...item,
                            width: 580,
                            height: 500,
                            IsNew: true,
                            IsDel: false,
                            isVideo: true,
                            ...sizeFile
                        })
                } else if (type[0].includes("image")) {
                    arrImage.unshift(
                        {
                            ...item,
                            width: 580,
                            height: 500,
                            IsNew: true,
                            IsDel: false,
                            isImage: true,
                            ...sizeFile
                        })
                }
                else {
                    arrApplication.unshift(
                        {
                            ...item,
                            IsNew: true,
                            IsDel: false,
                            TenFile: Utils.replaceAll(item.name, ' ', '_'),
                            base64: Platform.OS == 'android' ? strBase64 : b64
                        })
                }
                if (index == results.length - 1) {
                    this.setState({ arrImage, arrApplication }, () => {
                        this._setFileUpdate(this.state.arrImage, this.state.arrApplication, this.state.arrFileDelete);
                    })
                }

                // if(item.type=)
            }

            this.setState({ arrApplication: arr })
            Utils.nlog("gia tri arrApplication", this.state.arrApplication);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                throw err;
            }
        }
    }

    response = (res) => {
        if (res.iscancel) {
            //Utils.nlog('--ko chon item or back');
        }
        else if (res.error) {
            //Utils.nlog('--lỗi khi chon media');
        }
        else {
            //--dữ liệu media trả về là 1 item or 1 mảng item
            //--Xử lý dữ liệu trong đây-----

            Utils.nlog('--ko chon item or back----------res ponse nhé --------------------', res);
            res = res.map(item => {
                return {
                    ...item,
                    IsNew: true,
                    IsDel: false
                }
            })
            var { arrImage = [] } = this.state;
            let arrTmp = res.concat(arrImage);
            // Utils.nlog('img-----------------------------arr', arrTmp);
            this.setState({ arrImage: arrTmp }, () => {
                // Utils.nlog('Xong img-----------------------------arr', arrTmp);
                this._setFileUpdate(this.state.arrImage, this.state.arrApplication, this.state.arrFileDelete);
            })
        }
    };
    requestCameraPermission = () => {
        let options = {
            assetType: 'All',//All,Videos,Photos - default
            multi: true,// chọn 1 or nhiều item
            response: this.response, // callback giá trị trả về khi có chọn item
            limitCheck: 4, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
        };
        Utils.goscreen(this.props.nthis, ConfigScreenDH.Modal_MediaPicker, options);
    }
    _onPressDeleteitem = (item) => {
        //Phân hệ để xoá item cũ
        var { arrFileDelete } = this.state
        if (item.IsNew == false) {
            arrFileDelete.push(item);
        }
        this.setState({ arrFileDelete }, () => {
            this._setFileUpdate(this.state.arrImage, this.state.arrApplication, this.state.arrFileDelete);
            // //Utils.nlog("gia tri file vide hoạc image", arrFileDelete)
        })
    }
    _XoaFileTrongDS = (item, index) => {
        var { arrApplication, arrFileDelete } = this.state;
        if (item.IsNew == false) {
            arrFileDelete.push(item);
        }
        arrApplication.splice(index, 1);
        this.setState({ arrApplication, arrFileDelete }, () => {
            this._setFileUpdate(this.state.arrImage, this.state.arrApplication, this.state.arrFileDelete);
            // //Utils.nlog("gia tri file application và filde delet apli", arrApplication, arrFileDelete)
        })
    }
    render() {
        var { arrImage, arrApplication, uploadDinhkem, isUpload } = this.state;
        Utils.nlog("gia tri arrApplication-------", arrApplication)
        return (
            <View style={{ backgroundColor: 'white' }}>
                <View style={{ paddingVertical: 10 }}>
                    <Text>{`File đính kèm video, văn bản, hình ảnh`}</Text>
                    <View style={{ width: '100%', }} >
                        <Text style={{ color: colors.colorTextBlue, width: '100%', }}>{`Hình ảnh`}</Text>
                        <ListImageCom
                            isUpload={isUpload}
                            isView={true}
                            nthis={this.props.nthis}
                            requestCameraPermission={() => this.requestCameraPermission()}
                            onPressDeleteitem={this._onPressDeleteitem}
                            onPressDelete={arr => this.setState({ arrImage: arr })}
                            ListHinhAnh={arrImage} />
                        {uploadDinhkem == false ? null : <View style={{ marginBottom: 10 }}>
                            <TouchableOpacity
                                onPress={this._openFile}
                                style={{
                                    width: Width(25), borderColor: colors.colorGrayIcon, paddingVertical: 8,
                                    borderWidth: 1, borderRadius: 5, alignItems: 'center', justifyContent: 'center'
                                }}>
                                <Image
                                    style={{ width: reSize(20), height: reSize(20), tintColor: colors.black_80 }}
                                    source={Images.icAttached}
                                    resizeMode='contain' />
                            </TouchableOpacity>
                        </View>}


                        {
                            arrApplication.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} style={{ flex: 1, marginRight: 5, marginBottom: 4 }}
                                    // onPress={() => { this._ShowVideo(item) }}
                                    >
                                        <TouchableOpacity onPress={
                                            () => {
                                                Utils.nlog("giatri item file ", item.uri)
                                                if (item.IsNew == false) {
                                                    try {
                                                        Linking.openURL(item.uri)
                                                    } catch (error) {

                                                    }

                                                }
                                            }
                                        }
                                            style={{
                                                flexDirection: 'row',
                                                borderWidth: 1,
                                                borderRadius: 5,
                                                width: '100%', paddingHorizontal: 5,
                                                backgroundColor: colors.colorGrayBgr,
                                                paddingVertical: 5,
                                                alignItems: 'center'
                                            }}>
                                            <Image
                                                style={{ width: reSize(24), height: reSize(24), }}
                                                source={Images.icAttached}
                                                resizeMode='contain' />
                                            <Text style={{ flex: 1, marginRight: 20 }}>
                                                {item.TenFile ? item.TenFile : item.FileName}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            style={{ position: 'absolute', top: 0, right: 0 }}
                                            onPress={() => this._XoaFileTrongDS(item, index)}
                                        >
                                            <Image
                                                style={{ width: reSize(24), height: reSize(24), tintColor: colors.redStar }}
                                                resizeMode='contain'
                                                source={Images.icClose} />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </View>
            </View >
        );
    }
}

export default FileCom;

