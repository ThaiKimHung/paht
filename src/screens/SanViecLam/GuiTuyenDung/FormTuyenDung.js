import React, { Component } from 'react';
import {
    View, TextInput,
    Text, Image, TouchableOpacity,
    StyleSheet, PermissionsAndroid,
    Linking,
    ActivityIndicator, Platform, ScrollView, Alert, Keyboard, BackHandler,
    AppState
} from 'react-native';
import { nstyles, Height, paddingTopMul, khoangcach, Width } from '../../../../styles/styles';
import { reText, reSize, sizes } from '../../../../styles/size';
import { colors } from '../../../../styles';
import { Images } from '../../../images';
import Utils, { icon_typeToast } from '../../../../app/Utils';
import { nkey } from '../../../../app/keys/keyStore';
import Geolocation from 'react-native-geolocation-service';
import apis from '../../../apis';
import { BtnViTri } from './components/BtnViTri';
import { ListHinhAnhCom } from './components/ListHinhAnh';
import IsLoading from '../../../../components/IsLoading';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import ImageSize from 'react-native-image-size'
import { appConfig } from '../../../../app/Config';
import moment from 'moment';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import RNCompress from '../../../RNcompress';
import HeaderCus from '../../../../components/HeaderCus';
import Toast from 'react-native-simple-toast';
import ImagePickerNew from '../../../../components/ComponentApps/ImagePicker/ImagePickerNew'
import { ButtonCom, DatePick } from '../../../../components';
import HtmlViewCom from '../../../../components/HtmlView';
import AutoHeightWebViewCus from '../../../../components/AutoHeightWebViewCus';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Latitude = appConfig.defaultRegion.latitude, Longitude = appConfig.defaultRegion.longitude;
const getImageSize = async uri => new Promise(resolve => {
    Image.getSize(uri, (width, height) => {
        resolve({ width, height });
    });
})
class FormTuyenDung extends Component {
    constructor(props) {
        super(props);
        let data = Utils.ngetParam(this, 'data', {});
        this.isEdit = Utils.ngetParam(this, 'isEdit', 0);
        this.isgetFirstLocationOK = false;
        //-------
        const { Id = 0, idDraft = 0, DiaDiem = '', NoiDung = '', ListHinhAnh = [],
            latlng = {}, TuNgay = '', DenNgay = '', TieuDe = '' } = data;

        console.log(data)

        this.state = {
            idDraft,
            Id,
            NoiDung,
            DiaDiem,
            latlng,
            isFirstEdit: false,
            tuDongViTri: true,
            enableThemDiaDiem: true,
            findLocation: false,
            locationPermisstion: false,
            ListFileDinhKemDelete: [],
            ListFileDinhKemNew: [],
            ListHinhAnh,

            // Gửi phản ánh không cần đăng nhập
            isLoading: false,
            TuNgay: TuNgay,
            DenNgay: DenNgay,
            TieuDe: TieuDe
        }
        this.refPick = React.createRef()

    }
    componentDidMount() {
        const { tokenCD } = this.props.auth
        if (!tokenCD) {
            Utils.showMsgBoxYesNo(this, 'Thông báo', 'Vui lòng đăng nhập để tạo tin tuyển dụng', 'Đăng nhập', 'Quay lại', () => {
                Utils.goscreen(this, 'login');
            }, () => { Utils.goback(this) })
        }
        this.getFirstStore();
        ROOTGlobal.dataGlobal._onListeningDataTuyenDung = (data) => this.onListeningDataPA(data);
        let { ListHinhAnh, Id } = this.state;
        this.handleListImageForUpdate(ListHinhAnh, Id);
        BackHandler.addEventListener("hardwareBackPress", this.backAction);
    }


    componentDidUpdate() {
        this.onRealTime();
    }

    backAction = () => {
        this.onPressBack();
        return true;
    };

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener("hardwareBackPress", this.backAction);
        } catch (error) {
        }
    }

    onRealTime = async () => {
        let {
            Id = 0, idDraft = 0,
            DiaDiem = '', NoiDung = '',
            ListHinhAnh = [], latlng = {}
        } = this.state;

        let data = {
            Id, idDraft,
            DiaDiem, NoiDung,
            ListHinhAnh, latlng
        }
        await Utils.nsetStore(nkey.realTimeDataTuyenDung, data)
    }

    onClearRealTime = async () => {
        await Utils.nsetStore(nkey.realTimeDataTuyenDung, {})
    }

    handleListImageForUpdate = async (ListHinhAnh, Id) => {
        let tmpHinhAnh = [];
        if (Id > 0) {
            for (let i = 0; i < ListHinhAnh.length; i++) {
                let item = ListHinhAnh[i];
                let t = item.url.split('.');
                if (`${t[t.length - 1]}`.toUpperCase() == 'MP4' || `${t[t.length - 1]}`.toUpperCase() == 'MOV') {
                    tmpHinhAnh.push({
                        ...item,
                        timePlay: 10,
                        video: true,
                        // width: 50,
                        // height: 50
                    })
                } else {
                    const { width, height } = await ImageSize.getSize(item.url);
                    tmpHinhAnh.push({
                        ...item,
                        width: width,
                        height: height
                    })
                }
            }
        } else {
            tmpHinhAnh = ListHinhAnh;
        }
        this.setState({ ListHinhAnh: tmpHinhAnh });
    }

    onListeningDataPA = async (data = {}) => {
        let {
            Id = 0,
            idDraft = 0,
            DiaDiem = '',
            NoiDung = '',
            ListHinhAnh = [],
            Lat = Latitude,
            Lng = Longitude,
            TieuDe = '',
            TuNgay = '',
            DenNgay = '',
        } = data;
        this.handleListImageForUpdate(ListHinhAnh, Id);

        let latlng = {
            latitude: Lat,
            longitude: Lng
        };

        this.setState({
            isFirstEdit: true,
            Id,
            idDraft,
            DiaDiem,
            NoiDung,
            latlng,
            TieuDe,
            TuNgay,
            DenNgay,
        });
    }

    getFirstStore = async () => {
        const tuDongViTri = await Utils.ngetStore(nkey.tuDongViTri, true);
        this.setState({ tuDongViTri: tuDongViTri });
        if (tuDongViTri == true && !this.isEdit) {
            this.getCurrentPosition(true, true, 1);
        }
    }
    _hienTai = () => {
        this.getCurrentPosition(true);
    }


    getCurrentPosition = async (enableThemDiaDiem, tuDongViTri = this.state.tuDongViTri, isEndFirstRequest = 0) => {
        Geolocation.setRNConfiguration({ skipPermissionRequests: true, authorizationLevel: 'whenInUse' });
        Geolocation.requestAuthorization();

        if (Platform.OS == 'android') {
            this.granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: 'Tự động lấy vị trí',
                message: 'Bạn có muốn lưu động lấy thông tin vị trí hiện tại để gửi kèm tin tuyển dụng?\n' +
                    'Để tự động lấy vị trí thì bạn cần cấp quyền truy cập vị tri cho ứng dụng.',
                buttonNegative: 'Để sau',
                buttonPositive: 'Cấp quyền'
            })
            if (this.granted == PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(
                    (position) => {
                        Utils.nlog('geolocation-android', JSON.stringify(position));
                        var { coords = {} } = position;
                        var { latitude, longitude } = coords;
                        let latlng = {
                            latitude: latitude,
                            longitude: longitude
                        };
                        this.setState({
                            tuDongViTri,
                            enableThemDiaDiem,
                            latlng: latlng
                        }, this.onPressFindLocation)
                    },
                    error => Utils.nlog('getCurrentPosition error: ', JSON.stringify(error)),
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            }
        } else {
            Geolocation.getCurrentPosition(
                (position) => {
                    this.isgetFirstLocationOK = true;
                    Utils.nlog('geolocation-ios', JSON.stringify(position));
                    var { coords = {} } = position;
                    var { latitude, longitude } = coords;
                    if (Platform.OS == 'ios' && (!latitude || !longitude)) {
                        Utils.showMsgBoxYesNo(this, 'Dịch vụ vị trí bị tắt', appConfig.TenAppHome + ' cần truy cập vị trí của bạn. Hãy bật Dịch vụ vị trí trong phần cài đặt điện thoại của bạn.',
                            'Chuyển tới cài đặt', 'Không, cảm ơn',
                            () => {
                                Linking.openURL('app-settings:').catch((err) => {
                                    Utils.nlog('app-settings:', err);
                                });
                            });
                    } else {
                        this.granted = 'granted';
                        let latlng = {
                            latitude: latitude,
                            longitude: longitude
                        }
                        this.setState({
                            tuDongViTri,
                            enableThemDiaDiem,
                            latlng: latlng
                        }, this.onPressFindLocation)
                    }
                },
                (error) => {
                    let {
                        code
                    } = error;
                    if (AppState.currentState == 'active')
                        this.isgetFirstLocationOK = true;
                    if (code == 1) {
                        Utils.showMsgBoxYesNo(this, 'Dịch vụ vị trí bị tắt',
                            'Ứng dụng cần truy cập vị trí của bạn. Hãy bật dịch vụ vị trí trong phần cài đặt điện thoại của bạn.',
                            'Chuyển tới cài đặt', 'Không, cảm ơn',
                            () => {
                                Linking.openURL('app-settings:').catch((err) => {
                                    nlog('app-settings:', err);
                                });
                            });
                    }
                    Utils.nlog('getCurrentPosition error: ', JSON.stringify(error))
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
            );

            //--Tự động lấy vi trí lần đầu hỏi IOS, Android check làm sau
            if (isEndFirstRequest == 1 && tuDongViTri) {
                setTimeout(() => {
                    if (!this.isgetFirstLocationOK) {
                        this.getCurrentPosition(true, tuDongViTri, 1);
                    }
                }, 2000);
            }
            //--End auto check first--
        }
    }

    callbackDataMaps = (DiaDiem, latlng) => {
        this.setState({ DiaDiem, latlng });
    }

    chonTuDongViTri = async () => {
        const { tuDongViTri } = this.state;
        const tuDong = !tuDongViTri;
        await Utils.nsetStore(nkey.tuDongViTri, tuDong);
        if (tuDong == true) {
            this.getCurrentPosition(true, true);
        } else {
            this.setState({ tuDongViTri: false });
        };
    }

    handleAddDraft = async () => {
        let {
            DiaDiem = '',
            NoiDung = '',
            ListHinhAnh = [],
            ListFileDinhKemNew = [],
            latlng,
            TuNgay,
            DenNgay,
            TieuDe
        } = this.state;
        // Utils.nlog("Nguyên list nháp", ListFileDinhKemNew)

        let draftListTuyenDung = await Utils.ngetStore(nkey.draftListTuyenDung, []);
        let idDraft = new Date().getTime();
        let draft = {
            idDraft: idDraft,
            DiaDiem: DiaDiem,
            NoiDung: NoiDung,
            ListHinhAnh: ListFileDinhKemNew,
            latlng: latlng,
            Lat: latlng.latitude,
            Lng: latlng.longitude,
            TuNgay: TuNgay,
            DenNgay: DenNgay,
            TieuDe: TieuDe

        }
        draftListTuyenDung.unshift(draft);
        this.setState({ NoiDung: '', ListFileDinhKemNew: [], DiaDiem: '', latlng: {} })
        await Utils.nsetStore(nkey.draftListTuyenDung, draftListTuyenDung);
        ROOTGlobal.dataGlobal._onRefreshBanNhapTuyenDung();
        Utils.goback(this);

    }

    handleRemoveDraft = async () => {
        let { idDraft } = this.state;
        let draftListTuyenDung = await Utils.ngetStore(nkey.draftListTuyenDung, []);
        let draftIndex = draftListTuyenDung.findIndex(item => item.idDraft == idDraft)
        if (draftIndex != -1) {
            draftListTuyenDung.splice(draftIndex, 1);
        }
        await Utils.nsetStore(nkey.draftListTuyenDung, draftListTuyenDung);
        ROOTGlobal.dataGlobal._onRefreshBanNhapTuyenDung();
        Utils.goback(this);
    }

    handleUpdateDraft = async () => {
        let {
            DiaDiem = '',
            NoiDung = '',
            ListHinhAnh = [],
            ListFileDinhKemNew = [],
            idDraft,
            latlng,
            TuNgay,
            DenNgay,
            TieuDe
        } = this.state;

        let draftListTuyenDung = await Utils.ngetStore(nkey.draftListTuyenDung, []);
        let draftIndex = draftListTuyenDung.findIndex(item => item.idDraft == idDraft)
        if (draftIndex != -1) {
            let itemUpdate = {
                idDraft: idDraft,
                DiaDiem: DiaDiem,
                NoiDung: NoiDung,
                ListHinhAnh: [...ListHinhAnh, ...ListFileDinhKemNew],
                latlng: latlng,
                Lat: latlng.latitude,
                Lng: latlng.longitude,
                TuNgay,
                DenNgay,
                TieuDe
            }
            // Utils.nlog('handleUpdateDraft', itemUpdate);
            draftListTuyenDung[draftIndex] = itemUpdate;
        }
        await Utils.nsetStore(nkey.draftListTuyenDung, draftListTuyenDung);
        ROOTGlobal.dataGlobal._onRefreshBanNhapTuyenDung();
        Utils.goback(this);
    }

    handleRefreshDataSend = () => {
        this.setState({
            Id: 0,
            idDraft: 0,
            DiaDiem: '',
            NoiDung: '',
            ListHinhAnh: [],
            ListFileDinhKemNew: [],
            // latlng: {}
        })
        this.refPick?.current?.refreshData([])
    }

    onPressBack = () => {
        let {
            NoiDung = '',
            ListHinhAnh = [],
            ListFileDinhKemNew = [],
            idDraft,
            Id
        } = this.state;
        if (Id > 0) {
            this.onClearRealTime();
            Utils.goback(this);
            return;
        }
        let Editing = Platform.OS == 'ios' ? {
            text: 'Chỉnh sửa',
            onPress: () => this.onRealTime()
        } : null;
        let cancelable = {
            cancelable: true,
            onDismiss: () => this.onRealTime()
        };

        if (idDraft > 0) {
            Alert.alert(
                'Chỉnh sửa nháp',
                'Bạn đang thực hiện chỉnh sửa bản nháp tin tuyển dụng. ' +
                'Bạn có muốn lưu lại nội dung đã chỉnh sửa không?',
                [
                    {
                        text: 'Lưu',//.toUpperCase(), 
                        onPress: () => this.handleUpdateDraft(),
                        //style: 'default'
                    },
                    {
                        text: 'Bỏ qua',
                        onPress: () => { this.onClearRealTime(); Utils.goback(this); },
                        // style: 'cancel',
                    },
                    {
                        text: 'Xóa nháp',
                        onPress: () => this.handleRemoveDraft(),
                        //style: 'cancel',
                    },
                    Editing
                ],
                cancelable
            );
        } else if (NoiDung.length > 0 || ListFileDinhKemNew.length > 0) {
            Alert.alert(
                'Lưu nháp',
                'Thông tin mô tả sẽ mất sau khi bạn thoát' +
                'Bạn có muốn lưu nháp bản này để gửi sau không?',
                [
                    {
                        text: 'Lưu nháp',
                        onPress: () => this.handleAddDraft(),
                    },
                    {
                        text: 'Thoát',
                        onPress: () => { this.onClearRealTime(); Utils.goback(this); },
                    },
                    {
                        text: 'Làm mới',
                        onPress: () => this.handleRefreshDataSend(),
                    },
                ],
                cancelable
            );
        } else {
            this.onClearRealTime();
            Utils.goback(this);
        }
    }

    response = (res) => {
        if (res.iscancel) {
            // Utils.nlog('--ko chon item or back');
        }
        else if (res.error) {
            // Utils.nlog('--lỗi khi chon media');
        }
        else {
            //--dữ liệu media trả về là 1 item or 1 mảng item
            //--Xử lý dữ liệu trong đây-----
            res = res.map(item => {
                return {
                    ...item,
                    url: item.uri,
                    uri: item.uri,
                    imagePart: { uri: item.uri }
                }
            })
            var { ListHinhAnh = [] } = this.state;
            let arrTmp = ListHinhAnh.concat(res);
            // Utils.nlog('img', arrTmp);
            this.setState({ ListHinhAnh: arrTmp })
        }
    };

    requestCameraPermission = () => {
        let { ListHinhAnh = [] } = this.state;
        let limitCheck = 8 - ListHinhAnh.length;
        if (limitCheck >= 1) {
            let options = {
                assetType: 'All',//All,Videos,Photos - default
                multi: true,// chọn 1 or nhiều item
                response: this.response, // callback giá trị trả về khi có chọn item
                limitCheck: limitCheck, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
                groupTypes: 'All',
            };
            Utils.goscreen(this, 'Modal_MediaPicker', options);
        } else {
            Utils.showMsgBoxOK(this, '', 'Chỉ được gửi tối đa 8 hình ảnh!', 'Xác nhận');
        }
    }
    onPressMaps = async () => {
        // await this.getCurrentPosition();
        Utils.goscreen(this, 'Modal_BanDo_Root', {
            ...this.state.latlng,
            callbackDataMaps: this.callbackDataMaps
        })
    }

    enableLoading = (enable = false) => {
        if (!this.waiting)
            return;
        if (enable)
            this.waiting.show();
        else
            this.waiting.hide();
    }

    onPressFindLocation = async () => {
        let { idDraft, Id, isFirstEdit, latlng } = this.state;
        let isEdit = (idDraft > 0 || Id > 0) && isFirstEdit;
        if (isEdit) {
            this.setState({
                isFirstEdit: false
            })
            return;
        }

        var DiaDiem = 'Đang lấy dữ liệu vị trí hiện tại';
        this.setState({
            findLocation: true,
            DiaDiem: DiaDiem,
        });

        //---
        let {
            latitude,
            longitude
        } = latlng
        let res = await apis.ApiApp.getAddressGG(latitude, longitude);
        if (res && res.full_address) {
            this.setState({ findLocation: false, DiaDiem: res.full_address });
        } else {
            this.setState({ findLocation: false, DiaDiem: res.latitude + ', ' + res.longitude });
        }
    }

    onPressStopFindLocation = () => {
        this.setState({ findLocation: false, DiaDiem: '' });
    }

    onPressClearLocation = () => {
        this.setState({
            DiaDiem: '',
            latlng: {
                latitude: Latitude,
                longitude: Longitude
            }
        });
    }
    goToLogin = () => {
        Utils.showMsgBoxYesNo(this,
            'Thông báo',
            'Vui lòng đăng nhập để tạo tin tuyển dụng.',
            'Đăng nhập', 'Quay lại', () => {
                let {
                    NoiDung = '',
                    ListHinhAnh = [],
                    idDraft
                } = this.state;
                if (idDraft > 0)
                    this.handleUpdateDraft();
                else
                    if (NoiDung.length > 0 || ListHinhAnh.length > 0)
                        this.handleAddDraft();
                if (this.props.auth.tokenCD && this.props.auth?.tokenCD?.length > 0) {
                    Utils.goback(this)
                } else {
                    Utils.goscreen(this, 'login');
                }
            });
    }

    onPressSend = async () => {
        console.log("gia trị time bắt đầu", moment(new Date()).format('HH:mm:ss'))
        Utils.nlog("List image nè:", this.state.ListFileDinhKemNew)
        let {
            Id,
            NoiDung,
            DiaDiem,
            ListHinhAnh,
            ListFileDinhKemNew,
            latlng,
            TieuDe,
            DenNgay,
            TuNgay,
        } = this.state;

        if (!TieuDe) {
            Toast.show('Vui lòng nhập tiêu đề tin', Toast.LONG);
            return;
        }

        if (!DenNgay || !TuNgay) {
            Toast.show('Vui lòng nhập thời hạn tuyển dụng bao gồm từ ngày, đến ngày', Toast.LONG);
            return;
        }

        if (!NoiDung) {
            Toast.show('Vui lòng nhập thông tin mô tả', Toast.LONG);
            return;
        }

        if (this.isEdit == 1) {
            if (this.state.ListHinhAnh.length == 0 && appConfig.isImage) {
                Toast.show('Vui lòng chọn hình ảnh/ video/ file đính kèm để chỉnh sửa.', Toast.LONG);
                return;
            }
        } else {
            if (ListFileDinhKemNew.length == 0 && appConfig.isImage) {
                Toast.show('Vui lòng chọn hình ảnh/ video/ file đính kèm để gửi.', Toast.LONG);
                return;
            }
        }

        this.enableLoading(true);
        let dem = 0;
        if (Id > 0) {
            let dataBoDy = new FormData();
            //duyệt hình
            for (let index = 0; index < ListFileDinhKemNew.length; index++) {
                let item = ListFileDinhKemNew[index];
                if (!item.isOld) {
                    dem++;
                    // console.log("gia trị time bắt đầu----------------", item);
                    let file = `File${index == 0 ? '' : index} `;
                    if (item.type == 2) {//loại video
                        if (Platform.OS == 'ios') {
                            const dest = `${RNFS.TemporaryDirectoryPath} ${Math.random().toString(36).substring(7)}.mp4`;
                            let uriReturn = await RNFS.copyAssetsVideoIOS(item.uri, dest);
                            await RNCompress.compressVideo(uriReturn, 'medium').then(uri => {
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
                    else if (item.type == 3) {//loại file
                        dataBoDy.append(file,
                            {
                                name: item.name,
                                type: item.typeAplication || "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                uri: item.uri
                            });
                    }
                    else {
                        const { width, height } = await getImageSize(item?.uri);
                        // Utils.nlog("gia tri err-----------------", resWH);
                        await ImageResizer.createResizedImage(item?.uri, width || 0, height || 0, 'JPEG', Platform.OS == 'android' ? 60 : 40, 0)
                            .then(async (response) => {
                                await dataBoDy.append(file,
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

            }
            const {
                latitude,
                longitude
            } = latlng;
            const { ListHinhAnhDelete = [] } = this.state;
            let idDelete = '';
            for (let index = 0; index < ListHinhAnhDelete.length; index++) {
                const element = ListHinhAnhDelete[index];
                if (index != ListHinhAnhDelete.length - 1) {
                    idDelete += element.IdRow + ","
                } else {
                    idDelete += element.IdRow;
                }
            }
            if (dem == 0) {
                dataBoDy.append("Temp", true);
            }
            dataBoDy.append("NoiDung", NoiDung)
            dataBoDy.append("TieuDe", TieuDe)
            dataBoDy.append("Lat", latitude)
            dataBoDy.append("Lng", longitude)
            dataBoDy.append('DiaDiem', DiaDiem)
            dataBoDy.append('Id', Id)
            dataBoDy.append("IdFileDel", idDelete)
            dataBoDy.append("TuNgay", TuNgay)
            dataBoDy.append("DenNgay", DenNgay)


            console.log('[LOG] body update', dataBoDy)
            // await apis.ApiUpLoad.EditPA_FormData(dataBoDy).then(
            //     async (res) => {
            //         dem = 0;
            //         if (res == -2) {
            //             this.enableLoading(false);
            //             this.goToLogin();
            //         }
            //         if (res.status == 1) {
            //             this.enableLoading(false);
            //             if (this.state.idDraft > 0) {
            //                 this.handleRemoveDraft();
            //             }
            //             this.setState({
            //                 Id: 0,
            //                 idDraft: 0,
            //                 NoiDung: '',
            //                 ListHinhAnh: [],
            //                 DiaDiem: '',
            //                 ListHinhAnhDelete: []
            //             }, this.goToListingSent)
            //         } else {
            //             const { error } = res;
            //             this.enableLoading(false);
            //             let message = `Gửi thất bại\n${error && error.message ? error.message : "Bạn hãy thử lại"}`
            //             Utils.showMsgBoxOK(this, "Thông báo", message, "Xác nhận");
            //         }
            //     }
            // );
        } else {
            let dataBoDy = new FormData();

            // Utils.nlog("giá trị lish hình ảnh", ListHinhAnh);
            let dem = 0
            //duyệt hình
            for (let index = 0; index < ListFileDinhKemNew.length; index++) {
                let item = ListFileDinhKemNew[index];
                Utils.nlog("Log ra item nè!!", item)
                let file = `File${index == 0 ? '' : index} `;
                dem++
                if (item.type == 2) {
                    if (Platform.OS == 'ios') {
                        const dest = `${RNFS.TemporaryDirectoryPath} ${Math.random().toString(36).substring(7)}.mp4`;
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
                    const { width, height } = await getImageSize(item?.uri);
                    // Utils.nlog("gia tri err-----------------", resWH);
                    await ImageResizer.createResizedImage(item?.uri, width || 0, height || 0, 'JPEG', Platform.OS == 'android' ? 60 : 40, 0)
                        .then(async (response) => {
                            await dataBoDy.append(file,
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
                dataBoDy.append("Temp", true);
            }

            const {
                latitude,
                longitude
            } = latlng;
            const IdUser = Utils.getGlobal(nGlobalKeys.Id_user, 0);
            const Email = Utils.getGlobal(nGlobalKeys.Email, "");
            const NumberPhone = Utils.getGlobal(nGlobalKeys.NumberPhone, "");
            // dataBoDy.append("NguoiGopY", IdUser);
            dataBoDy.append("NoiDung", NoiDung)
            dataBoDy.append("TieuDe", TieuDe)
            dataBoDy.append("Lat", latitude)
            dataBoDy.append("Lng", longitude)
            dataBoDy.append('DiaDiem', DiaDiem)
            dataBoDy.append("TuNgay", TuNgay)
            dataBoDy.append("DenNgay", DenNgay)
            // dataBoDy.append('Id', 0)
            Utils.nlog("Kêt qua hoàn tahnh èn:", dataBoDy)
            await apis.ApiSanLamViec.Create_TinTucCongDan(dataBoDy).then(
                async (res) => {
                    console.log('[LOG] gui tuyen dung', res)
                    if (res == -2) {
                        this.enableLoading(false);
                        this.goToLogin();
                    }
                    if (res?.Result?.status == 1) {
                        this.enableLoading(false);
                        if (this.state.idDraft > 0) {
                            this.handleRemoveDraft();
                        }
                        this.setState({
                            Id: 0,
                            idDraft: 0,
                            NoiDung: '',
                            ListHinhAnh: [],
                            DiaDiem: '',
                            ListHinhAnhDelete: [],
                            TuNgay: '',
                            DenNgay: '',
                        }, this.goToListingSent)
                    } else {
                        const { error } = res
                        this.enableLoading(false);
                        let message = `Gửi thất bại\n${error && error.message ? error.message : "Bạn hãy thử lại"}`
                        Utils.showMsgBoxOK(this, "Thông báo", message, "Xác nhận");
                    }

                }
            );

        }
    }

    goToListingSent = async () => {
        ROOTGlobal.dataGlobal._tabbarChange(true);
        ROOTGlobal.dataGlobal._onRefreshDaGuiTuyenDung();
        Utils.goscreen(this, 'scTinCaNhan')
        Utils.showToastMsg('Thông báo', 'Gửi tuyển dụng thành công.', icon_typeToast.success, 2000, icon_typeToast.success)
        await Utils.nsetStore(nkey.realTimeDataTuyenDung, {})

    }


    onChangeDate = (val, isFrom = true) => {

        const { TuNgay, DenNgay } = this.state
        if (isFrom) {
            if (DenNgay) {
                let number = moment(val, 'YYYY-MM-DD').diff(moment(DenNgay, 'YYYY-MM-DD'))
                if (number <= 0) {
                    this.setState({ TuNgay: val })
                } else {
                    Utils.showToastMsg("Thông báo", "Từ ngày phải nhỏ hơn đến ngày", icon_typeToast.warning);
                }

            } else {
                this.setState({ TuNgay: val })
            }

        } else {
            if (TuNgay) {
                let number = moment(TuNgay, 'YYYY-MM-DD').diff(moment(val, 'YYYY-MM-DD'))
                if (number <= 0) {
                    this.setState({ DenNgay: val })
                } else {
                    Utils.showToastMsg("Thông báo", "Đến ngày phải lớn hơn từ ngày", icon_typeToast.warning);
                }


            } else {
                this.setState({ DenNgay: val })
            }
        }

    }

    render() {
        let {
            tuDongViTri,
            enableThemDiaDiem,
            DiaDiem, findLocation,
            NoiDung,
            ListHinhAnh,
            Id, ListHinhAnhDelete = [], TuNgay,
            DenNgay, TieuDe
        } = this.state;
        let booleanViTri = tuDongViTri && !this.isEdit || enableThemDiaDiem || this.isEdit
        let txtNhapViTri = DiaDiem.length == 0 ? 'Chọn vị trí' : 'Nhập vị trí';
        let {
            stTextInput, stViewTuDong,
            stTxtTuDong,
        } = styles;
        const { tokenCD } = this.props.auth
        return (
            <View style={nstyles.ncontainer}>
                <View style={[nstyles.nbody, { backgroundColor: 'white' }]}>
                    {/* Header */}
                    <HeaderCus
                        Sleft={{ width: 18, height: 18, tintColor: colors.white }}
                        iconLeft={Images.icBack}
                        styleTitle={{ color: colors.white }}
                        onPressLeft={this.onPressBack}
                        title={'Gửi tuyển dụng'}
                    />
                    <View style={{ height: 3, backgroundColor: "#F8F8F8" }}></View>
                    {/* Body */}

                    <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 50 }}>
                        <View style={[nstyles.nbody]}>
                            <View style={[nstyles.nbody, { paddingHorizontal: 13 }]}>
                                <Text style={{ marginTop: 10 }}>{'Tiêu đề'}<Text style={{ color: colors.redStar }}>*</Text></Text>
                                <TextInput
                                    placeholder="Tiêu đề tin"
                                    style={{ padding: Platform?.OS == 'android' ? 5 : 10, backgroundColor: colors.white, marginTop: 10, borderWidth: 0.5, borderRadius: 5, borderColor: colors.grayLight }}
                                    value={TieuDe}
                                    onChangeText={text => this.setState({ TieuDe: text })}
                                />
                                <Text style={{ marginTop: 10 }}>{'Thời hạn tuyển dụng'}<Text style={{ color: colors.redStar }}>*</Text></Text>
                                <View style={[nstyles.nrow, { alignItems: 'center' }]}>
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.btnCalendar}>
                                            <DatePick
                                                style={{ width: "100%" }}
                                                value={TuNgay}
                                                onValueChange={TuNgay => this.onChangeDate(TuNgay, true)}
                                                placeholder={'Từ ngày'}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ width: 5, backgroundColor: colors.grayLight, marginHorizontal: 5, height: 1, }} />
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.btnCalendar}>
                                            <DatePick
                                                style={{ width: "100%", backgroundColor: colors.white }}
                                                value={DenNgay}
                                                onValueChange={DenNgay => this.onChangeDate(DenNgay, false)}
                                                placeholder={'Đến ngày'}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ marginTop: 10, }}>
                                    {
                                        booleanViTri ? <Text style={{ color: colors.black }}>{'Chọn địa điểm tạo tin tuyển dụng'}</Text>
                                            :
                                            <TouchableOpacity
                                                disabled={enableThemDiaDiem}
                                                onPress={() => this.setState({ enableThemDiaDiem: !enableThemDiaDiem })}
                                                activeOpacity={0.5}>
                                                <View style={[nstyles.nrow, { alignItems: 'center' }]}>
                                                    <Image
                                                        source={Images.icAddrress}
                                                        resizeMode={'contain'}
                                                        style={{ marginRight: 5 }} />
                                                    <Text style={{ color: colors.colorBlueP }}>
                                                        {'Chọn địa điểm đăng tin tuyển dụng'}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                    }
                                </View>
                                {booleanViTri ? (
                                    <View>
                                        {
                                            this.isEdit ? null :
                                                <TouchableOpacity
                                                    activeOpacity={0.5}
                                                    onPress={this.chonTuDongViTri}>
                                                    <View style={stViewTuDong}>
                                                        <View
                                                            style={[nstyles.nIcon16, {
                                                                borderRadius: sizes.nImgSize8, borderColor: tuDongViTri ? colors.colorRed : colors.black_30,
                                                                borderWidth: 1, backgroundColor: tuDongViTri ? colors.colorRed : colors.white
                                                            }]}
                                                        />
                                                        <Text style={stTxtTuDong}>
                                                            {'Tự động lấy vị trí hiện tại mỗi khi tạo tin tuyển dụng'}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                        }
                                        <View style={[nstyles.nrow, nstyles.nmiddle, { maxHeight: 80 }]}>
                                            {findLocation ?
                                                <ActivityIndicator
                                                    size={'small'}
                                                    color={colors.lightSalmon} /> :
                                                <Image
                                                    source={Images.icAddrress}
                                                    resizeMode={'contain'}
                                                    style={{}} />
                                            }
                                            <TextInput
                                                editable={!findLocation && DiaDiem.length != 0}
                                                placeholder={txtNhapViTri}
                                                placeholderTextColor={colors.colorBlueP}
                                                multiline={true}
                                                value={DiaDiem}
                                                onChangeText={text => this.setState({ DiaDiem: text })}
                                                style={[stTextInput, {
                                                    flex: 2,
                                                    color: colors.colorBlueP,
                                                    paddingLeft: 4, paddingTop: 6,
                                                    paddingBottom: 6, maxHeight: 80
                                                }]} />
                                            {DiaDiem.length > 0 && !findLocation ?
                                                <TouchableOpacity
                                                    onPress={this.onPressClearLocation}
                                                    activeOpacity={0.5}>
                                                    <Image
                                                        source={Images.icClose}
                                                        resizeMode={'contain'}
                                                        style={{
                                                            width: reSize(20), height: reSize(20),
                                                            tintColor: colors.black,
                                                        }} />
                                                </TouchableOpacity> : null}
                                            {findLocation ? <TouchableOpacity
                                                onPress={this.onPressStopFindLocation}
                                                activeOpacity={0.5}>
                                                <Text style={{ color: colors.colorPink, fontSize: reText(14), fontWeight: 'bold' }}>
                                                    {'Dừng'}
                                                </Text>
                                            </TouchableOpacity> : null}
                                            {DiaDiem.length == 0 ?
                                                <BtnViTri
                                                    onPress={this._hienTai}
                                                    source={Images.icHere}
                                                    text={'Hiện tại'} /> : null}
                                            {DiaDiem.length == 0 ?
                                                <BtnViTri
                                                    onPress={this.onPressMaps}
                                                    source={Images.icBanDo}
                                                    text={'Bản đồ'} />
                                                : null}
                                        </View>
                                    </View>
                                ) : null}
                                <View style={nstyles.nbody}>
                                    <Text style={{ marginTop: 20, marginBottom: 10 }}>{'Thông tin mô tả'}<Text style={{ color: colors.redStar }}>*</Text>({1000 - NoiDung?.length} kí tự)</Text>
                                    <TextInput
                                        style={[stTextInput, {
                                            minHeight: Height(25), maxHeight: Height(50), textAlignVertical: 'top', backgroundColor: "#F5F5F5",
                                            paddingHorizontal: 15, borderRadius: 3
                                        }]}
                                        multiline={true}
                                        value={NoiDung}
                                        onFocus={() => this.setState({ contenFocus: true })}
                                        onBlur={() => this.setState({ contenFocus: false })}
                                        onChangeText={text => this.setState({ NoiDung: text })}
                                        placeholder={'Nhập thông tin mô tả'}
                                        placeholderTextColor={colors.black_20}
                                        maxLength={1000}
                                    />
                                    {/* <TouchableOpacity onPress={() => Utils.goscreen(this, "Modal_EditHTML", {
                                        content: NoiDung,
                                        callback: (val) => this.setState({ NoiDung: val })
                                    })}>
                                        {NoiDung ?
                                            <View pointerEvents={'none'} style={{ width: '100%', backgroundColor: colors.BackgroundHome, paddingBottom: 10, borderRadius: 5 }}>
                                                <AutoHeightWebViewCus source={{ html: NoiDung }}
                                                    style={{ width: '100%', borderRadius: 5, paddingBottom: 5 }}
                                                    customStyle={`
                                                    * {
                                                        resize: both;
                                                        overflow: auto;
                                                        font-size: 15px;
                                                        line-height:20px;
                                                        text-align: justify;
                                                    }
                                                    body {
                                                        padding: 10px;
                                                        background-color: #F2F2F2;
                                                        border-radius: 5px;
                                                        padding-bottom: 20px
                                                    }
                                                `}
                                                    files={[{
                                                        type: 'text/css',
                                                        rel: 'stylesheet'
                                                    }]}
                                                    textLoading={'Đang cập nhật nội dung chỉnh sửa...'}
                                                />
                                            </View>
                                            :
                                            <View style={{ padding: 10, backgroundColor: colors.BackgroundHome, height: 100, borderRadius: 3 }}>
                                                <Text style={{ color: colors.brownGreyTwo }}>Nhập thông tin mô tả (tối đa 1000 kí tự)...</Text>
                                            </View>}
                                    </TouchableOpacity> */}
                                </View>

                            </View>
                            <Text style={{ marginHorizontal: 10, marginTop: 15, fontSize: reText(14) }}>Chọn file</Text>
                        </View>
                        <ImagePickerNew
                            data={this.isEdit == 1 ? ListHinhAnh : []}
                            dataNew={this.isEdit == -1 ? ListHinhAnh : []}
                            ref={this.refPick}
                            NumberMax={8}
                            isEdit={!this.isRead}
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
                        >
                        </ImagePickerNew>
                        <ButtonCom
                            text={Id > 0 ? 'Cập nhật tuyển dụng' : 'Gửi tuyển dụng'}
                            onPress={this.onPressSend}
                            style={{ borderRadius: 5, marginHorizontal: 10, }}
                            txtStyle={{ fontSize: reText(14) }}
                        />
                    </KeyboardAwareScrollView>
                </View>
                <IsLoading ref={ref => this.waiting = ref} />
            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme,
    auth: state.auth,
});
export default Utils.connectRedux(FormTuyenDung, mapStateToProps, true)

const styles = StyleSheet.create({
    stTextInput: {
        fontSize: reText(14),
        color: colors.black,
        paddingTop: 10,
        width: '100%',
        // alignItems: 'flex-start'

    },
    stThemViTri: {
        // color: colors.blueTwo,
        // fontWeight: 'bold'
    },
    stViewTuDong: {
        ...nstyles.nrow,
        marginTop: 10,
    },
    stTxtTuDong: {
        marginLeft: 10,
        marginBottom: 8,
        fontSize: reText(14),
        color: colors.colorGrayText
    },
    stViewBanDo: {
        ...nstyles.nrow,
        ...nstyles.nmiddle,
        flex: 1,
        borderColor: colors.deepSkyBlue,
        borderRadius: 5,
        borderWidth: 1,
        paddingHorizontal: 10,
        marginLeft: 10,
    },
    inputHoTen: {
        padding: 10,
        backgroundColor: colors.BackgroundHome,
        borderRadius: 5
    },
    txtNameNoLogin: {
        fontWeight: 'bold',
        fontSize: reText(14),
        paddingVertical: 5,
    },
    text12: {
        fontSize: reText(12)
    },
    btnCalendar: {
        ...nstyles.nrow,
        padding: 10,
        backgroundColor: colors.white,
        // alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
        borderWidth: 0.5, borderRadius: 5, borderColor: colors.grayLight
    },
})
