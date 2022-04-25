import React, { Component } from 'react';
import {
    View, TextInput,
    Text, Image, TouchableOpacity,
    StyleSheet, PermissionsAndroid,
    Linking,
    ActivityIndicator, Platform, ScrollView, Alert, Keyboard, BackHandler,
    AppState,
    NativeModules
} from 'react-native';
import { nstyles, Height, paddingTopMul, khoangcach, Width, versionIOS } from '../../../styles/styles';
import { reText, reSize, sizes } from '../../../styles/size';
import { colors } from '../../../styles';
import { Images } from '../../images';
import Utils from '../../../app/Utils';
import { nkey } from '../../../app/keys/keyStore';
import Geolocation from 'react-native-geolocation-service';
import apis from '../../apis';
import { BtnViTri } from './components/BtnViTri';
import { ListHinhAnhCom } from './components/ListHinhAnh';
import IsLoading from '../../../components/IsLoading';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import ImageSize from 'react-native-image-size'
import { appConfig } from '../../../app/Config';
import moment from 'moment';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import RNCompress from '../../RNcompress';
import HeaderCus from '../../../components/HeaderCus';
// import { ProcessingManager } from 'react-native-video-processing';
import Toast from 'react-native-simple-toast';
import ImagePickerNew from '../../../components/ComponentApps/ImagePicker/ImagePickerNew'
import { ButtonCom } from '../../../components';
import analytics from '@react-native-firebase/analytics';
import KeyAnalytics from '../../../app/KeyAnalytics';
import Voice from '@react-native-community/voice';
import LottieView from 'lottie-react-native';
import { check, request, PERMISSIONS } from 'react-native-permissions';
import UtilsApp from '../../../app/UtilsApp';

const Latitude = appConfig.defaultRegion.latitude, Longitude = appConfig.defaultRegion.longitude;
const getImageSize = async uri => new Promise(resolve => {
    Image.getSize(uri, (width, height) => {
        resolve({ width, height });
    });
})
const { OpenSetting } = NativeModules; // gọi tới moudel openSettings tới app Google
class GuiPhanAnhRoot extends Component {
    constructor(props) {
        super(props);
        this.tieuDeGui = '';
        let data = Utils.ngetParam(this, 'data', {});
        Utils.nlog('Gia tri dataa', data)
        this.isEdit = Utils.ngetParam(this, 'isEdit', 0);
        this.isgetFirstLocationOK = false;
        this.isModalGuiPA = Utils.ngetParam(this, 'isModalGuiPA', 0);
        this.sendOpinionNoLogin = Utils.getGlobal(nGlobalKeys.sendOpinionNoLogin, false) // gửi phản ánh không cần đăng nhập
        this.isGuiPADichBenhMDo = Utils.getGlobal(nGlobalKeys.isGuiPADichBenhMDo, false)
        this.showCheckCongKhaiPA = Utils.getGlobal(nGlobalKeys.showCheckCongKhaiPA, false)
        this.isPolicy = Utils.getGlobal(nGlobalKeys.isPolicy, false) // gửi phản ánh không cần đăng nhập
        //----Code nhập nội dụng Voices
        Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
        Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
        Voice.onSpeechError = this.onSpeechError.bind(this);
        this.newContent = '';
        this.oldContent = '';
        //-------
        const {
            IdPA = 0,
            idDraft = 0,
            diaDiem = '',
            noiDungGui = '',
            ListHinhAnh = [],
            latlng = {},
            MucDo = 0,
            NameNoLogin = '',
            PhoneNoLogin = '',
            IdChuyenMuc,
            ChuyenMuc,
            CongKhai,
            IdLinhVuc,
            IdBoPhan,
            LinhVuc,
            TenPhuongXa
        } = data;

        this.tokenLogin = Utils.getGlobal(nGlobalKeys.loginToken, '');

        // let Notify = Utils.getGlobal(nGlobalKeys.SMS, false);
        this.state = {
            idDraft,
            IdPA,
            noiDungGui,
            diaDiem,
            latlng,
            Notify: true,//Utils.getGlobal(nGlobalKeys.SMS, false),
            isFirstEdit: false,
            tuDongViTri: true,
            paKhan: MucDo == 3, //3 là PA Khẩn, 0 là Bình thường
            enableThemDiaDiem: false,
            findLocation: false,
            locationPermisstion: false,
            ListFileDinhKemDelete: [],
            ListFileDinhKemNew: [],
            ListHinhAnh,
            lstMucDoNguyCo: [],
            selectNguyCo: { IdChuyenMuc: 59, TenChuyenMuc: 'Cấp 1 - Nguy cơ thấp' },
            // Gửi phản ánh không cần đăng nhập
            NameNoLogin,
            PhoneNoLogin,
            dataTypeForm: '',
            isLoading: false,
            IdChuyenMuc,
            ChuyenMuc,
            paCongKhai: CongKhai && CongKhai == true ? true : false,

            lstLinhVuc: [],
            selectedLinhVuc: { IdLinhVuc: IdLinhVuc || -1, LinhVuc: LinhVuc || 'Không có dữ liệu' },
            lstChuyenMuc: [],
            selectedChuyenMuc: { IdChuyenMuc: IdChuyenMuc || -1, TenChuyenMuc: ChuyenMuc || 'Không có dữ liệu' },
            lstDonVi: [],
            selectedDonVi: { MaPX: IdBoPhan || -1, TenPhuongXa: TenPhuongXa || 'Không có dữ liệu' },
            IdLinhVuc,
            IdBoPhan,
            LinhVuc,
            TenPhuongXa,
        }
        this.chooseBoPhanLinhVucChuyenMuc = Utils.getGlobal(nGlobalKeys.chooseBoPhanLinhVucChuyenMuc, false)
        this.refPick = React.createRef()

    }
    async componentDidMount() {
        this.getFirstStore();
        ROOTGlobal.dataGlobal._onListeningDataPA = (data) => this.onListeningDataPA(data);
        let { ListHinhAnh, IdPA } = this.state;
        this.handleListImageForUpdate(ListHinhAnh, IdPA);
        this.handleTypeForm()
        this.getListMucDoNguyCo()
        if (this.chooseBoPhanLinhVucChuyenMuc) {
            this.getLinhVuc()
            this.getBoPhan()
        }
        if (IdPA <= 0 && this.tokenLogin.length <= 3)
            this.goToLogin();
        BackHandler.addEventListener("hardwareBackPress", this.backAction);
    }
    componentWillUnmount = () => {
        Voice.destroy().then(Voice.removeAllListeners);
    }
    getListMucDoNguyCo = async () => {
        let res = await apis.ApiPhanAnh.GetChuyenMuc_NguyCo();
        Utils.nlog('Gia tri MucDoNguyCo', res.data)
        if (res.status == 1 && res) {
            this.setState({
                lstMucDoNguyCo: res.data,
                selectNguyCo: res.data && res.data.length > 0 ? res.data[0] : { IdChuyenMuc: 59, TenChuyenMuc: 'Cấp 1 - Nguy cơ thấp' }
            })
        } else {
            this.setState({ lstMucDoNguyCo: [] })
        }
    }

    getBoPhan = async () => {
        let res = await apis.ApiPhanAnh.GetList_DonVi();
        Utils.nlog('Gia tri GetList_DonVi', res)
        if (res?.status == 1 && res?.data) {
            this.setState({
                lstDonVi: res.data,
                selectedDonVi: this.state.IdBoPhan ? { MaPX: this.state.IdBoPhan, TenPhuongXa: this.state.TenPhuongXa } : res.data && res.data.length > 0 ? res.data[0] : { MaPX: -1, TenPhuongXa: 'Không có dữ liệu' }
            })
        } else {
            this.setState({ lstDonVi: [] })
        }
    }

    getLinhVuc = async () => {
        let res = await apis.ApiPhanAnh.GetList_LinhVucApp();
        Utils.nlog('Gia tri GetList_LinhVucApp', res)
        if (res?.status == 1 && res?.data) {
            this.setState({
                lstLinhVuc: res.data,
                selectedLinhVuc: this.state.IdLinhVuc ?
                    { IdLinhVuc: this.state.IdLinhVuc, LinhVuc: this.state.LinhVuc } :
                    res.data && res.data.length > 0 ? res.data[0] : { IdLinhVuc: -1, LinhVuc: 'Không có dữ liệu' }
            }, () => {
                if (this.state.selectedLinhVuc?.IdLinhVuc) {
                    this.getChuyenMuc()
                }
            })
        } else {
            this.setState({ lstLinhVuc: [] })
        }
    }

    getChuyenMuc = async () => {
        let res = await apis.ApiPhanAnh.GetListChuyenMucLinhVuc(this.state.selectedLinhVuc?.IdLinhVuc);
        Utils.nlog('Gia tri GetListChuyenMucLinhVuc', res)
        if (res?.status == 1 && res?.data) {
            this.setState({
                lstChuyenMuc: res.data,
                selectedChuyenMuc: this.state.IdChuyenMuc && this.state.IdLinhVuc == this.state.selectedLinhVuc?.IdLinhVuc ?
                    { IdChuyenMuc: this.state.IdChuyenMuc, TenChuyenMuc: this.state.ChuyenMuc }
                    : res.data && res.data.length > 0 ? res.data[0] : { IdChuyenMuc: -1, TenChuyenMuc: 'Không có dữ liệu' }
            })
        } else {
            this.setState({ lstChuyenMuc: [] })
        }
    }

    onSpeechError = async (e) => { // sự kiện khi không thu âm được giọng nói
        const result = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
        if (e.error.message === '9/Insufficient permissions' && result === 'granted') { // Trường hợp quyền mircophone bị tắt dưới app Google
            Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn cần cấp quyền nhận dạng giọng nói Google để sử dụng chức năng này.', 'Đến cài đặt', 'Xem lại', () => { OpenSetting.openSetting('com.google.android.googlequicksearchbox') });
        }
    }

    onSpeechEndHandler = (e) => { // sự kiện lắng nghe khi  ngừng nói
        const { isLoading } = this.state
        if (isLoading)
            this.setState({ isLoading: false })
    }

    converStringText = (text = '') => {
        let textTempt = text
        textTempt = textTempt.trimEnd();
        textTempt = Utils.replaceAll(textTempt, '  ', ' ');
        return textTempt;
    }

    onSpeechResultsHandler = (e) => { // sự kiện lắng nghe khi ngừng nói và xuất ra dữ liệu
        let text = e.value[0]
        this.newContent = text;
        if (Platform.OS == 'ios') {
            if (this.oldContent.length != 0) {
                this.setState({ noiDungGui: this.converStringText(this.oldContent) + ' ' + this.newContent.toLocaleLowerCase() })
            } else {
                this.setState({ noiDungGui: this.oldContent + '' + this.newContent })
            }
        } else {
            if (this.oldContent === '') {
                let txtNew = this.newContent.slice(0, 1).toUpperCase() + this.newContent.slice(1).toLowerCase();
                this.setState({ noiDungGui: this.oldContent + '' + txtNew })
            }
            else

                this.setState({ noiDungGui: this.converStringText(this.oldContent) + ' ' + this.newContent.toLowerCase() });
        }

    }
    startRecording = async () => {
        this.setState({ isLoading: true });
        await UtilsApp.StartVoice(this, false, 'noiDungGui');
    }
    stopRecording = async () => {
        this.setState({ isLoading: false });
        await UtilsApp.StartVoice(this, true, 'noiDungGui');
    }

    //Xử lý nhiều trường hợp loại gửi phản ánh
    handleTypeForm = async () => {
        let typeForm = 0 // xử lý type form mac dinh 0 la gửi phản ánh hiện trường
        if (this.isModalGuiPA) {
            typeForm = this.isModalGuiPA
        }
        // alert(typeForm)
        //Mặc định form gửi phản ánh
        let dataType = {
            Warning: 'Vui lòng nhập nội dung phản ánh',
            BodyPost: [],
            ActionsSend: () => Utils.goscreen(this, 'sc_CaNhan'),
            PlaceholderNoiDung: 'Nhập nội dung phản ánh...',
            TextLocation: 'Chọn địa điểm ' + Utils.getGlobal(nGlobalKeys.TieuDe, '').toString().toLowerCase(),
            HeaderTitle: 'Gửi ' + Utils.getGlobal(nGlobalKeys.TieuDe, '').toString().toLowerCase(),
            KeyRenderMore: -1,
            LabelNoiDung: `Nội dung ${Utils.getGlobal(nGlobalKeys.TieuDe, '').toString().toLowerCase()}`,
            TextTuDong: 'Tự động lấy vị trí hiện tại mỗi khi tạo phản ánh',
            textButton: 'phản ánh'
        }
        switch (typeForm) {
            // case 102:
            //     dataType = {
            //         Warning: 'Vui lòng nhập nội dung yêu cầu hỗ trợ',
            //         BodyPost: [
            //             {
            //                 Name: '',
            //                 Key: 'TypeReference',
            //                 Val: 102,
            //                 CheckNull: false, // có check alert không
            //                 IsState: false // có lấy giá trị state hay không hay truyền cứng Key,Val
            //             },
            //             {
            //                 Name: 'Loại hỗ trợ',
            //                 Key: 'NguonPA',
            //                 Val: this.state.NguonPA,
            //                 CheckNull: true,
            //                 IsState: true
            //             }],
            //         ActionsSend: () => Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi yêu cầu hỗ trợ túi anh sinh xã hội thành công', 'Chấp nhận', () => Utils.goscreen(this, 'tab_AnhSinhCaNhan')),
            //         PlaceholderNoiDung: 'Nhập nội dung yêu cầu hỗ trợ',
            //         TextLocation: 'Địa chỉ',
            //         HeaderTitle: 'An sinh xã hội',
            //         KeyRenderMore: 102,
            //         LabelNoiDung: `Nội dung yêu cầu hỗ trợ`,
            //         TextTuDong: 'Tự động lấy vị trí hiện tạo yêu cầu hỗ trợ'
            //     }
            //     break;
            case 1000:
                dataType = {
                    Warning: 'Vui lòng nhập nội dung Phản ánh dịch bệnh',
                    BodyPost: this.isGuiPADichBenhMDo == 'false' ? [{
                        Name: '',
                        Key: 'Dich',
                        Val: true,
                        CheckNull: false,
                        IsState: false
                    }] : [],
                    ActionsSend: () => Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi phản ánh dịch bệnh thành công', 'Chấp nhận', () => Utils.goback(this)),
                    PlaceholderNoiDung: 'Nhập nội dung phản ánh dịch bệnh',
                    TextLocation: 'Vị trí phản ánh dịch bệnh',
                    HeaderTitle: 'Gửi phản ánh dịch bệnh',
                    KeyRenderMore: 1000,
                    LabelNoiDung: 'Nội dung phản ánh dịch bệnh',
                    TextTuDong: 'Tự động lấy vị trí hiện tại mỗi khi tạo phản ánh',
                    textButton: 'phản ánh dịch bệnh'
                }
                break;
            case 101:
                dataType = {
                    Warning: 'Vui lòng nhập nội dung góp ý',
                    BodyPost: [{
                        Name: '',
                        Key: 'TypeReference',
                        Val: 101,
                        CheckNull: false, // có check alert không
                        IsState: false // có lấy giá trị state hay không hay truyền cứng Key,Val
                    }],
                    ActionsSend: () => Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi góp ý dịch vụ công thành công', 'Chấp nhận', () => Utils.goback(this)),
                    PlaceholderNoiDung: 'Nhập nội dung góp ý dịch vụ công',
                    TextLocation: 'Vị trí góp ý dịch vụ công',
                    HeaderTitle: 'Gửi góp ý dịch vụ công',
                    KeyRenderMore: 101,
                    LabelNoiDung: `Nội dung góp ý dịch vụ công`,
                    TextTuDong: 'Tự động lấy vị trí hiện tại mỗi khi tạo góp ý',
                    textButton: 'góp ý dịch vụ công'
                }
                break;
            default:
                break
        }
        this.setState({ dataTypeForm: dataType })

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
            IdPA = 0, idDraft = 0,
            diaDiem = '', noiDungGui = '',
            ListHinhAnh = [], latlng = {}
        } = this.state;

        let data = {
            IdPA, idDraft,
            diaDiem, noiDungGui,
            ListHinhAnh, latlng
        }
        await Utils.nsetStore(nkey.realTimeDataPA, data)
    }

    onClearRealTime = async () => {
        await Utils.nsetStore(nkey.realTimeDataPA, {})
    }

    handleListImageForUpdate = async (ListHinhAnh, IdPA) => {
        let tmpHinhAnh = [];
        if (IdPA > 0) {
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
            IdPA = 0,
            idDraft = 0,
            diaDiem = '',
            noiDungGui = '',
            ListHinhAnh = [],
            ToaDoX = Latitude,
            ToaDoY = Longitude
        } = data;
        this.handleListImageForUpdate(ListHinhAnh, IdPA);

        let latlng = {
            latitude: ToaDoX,
            longitude: ToaDoY
        };

        this.setState({
            isFirstEdit: true,
            IdPA,
            idDraft,
            diaDiem,
            noiDungGui,
            latlng,
        });
    }

    getFirstStore = async () => {
        const { tokenCD, userCD } = this.props.auth
        const tuDongViTri = await Utils.ngetStore(nkey.tuDongViTri, true);
        this.setState({ tuDongViTri: tuDongViTri });
        if (tuDongViTri == true && !this.isEdit) {
            this.getCurrentPosition(true, true, 1);
        }
        // Hiển thị sđt với th đã đăng nhập
        if (tokenCD.length > 0 && this.sendOpinionNoLogin) {
            const { NameNoLogin, PhoneNoLogin } = this.state
            this.setState({
                NameNoLogin: NameNoLogin ? NameNoLogin : userCD.FullName,
                PhoneNoLogin: PhoneNoLogin ? PhoneNoLogin : userCD.PhoneNumber
            })
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
                message: 'Bạn có muốn lưu động lấy thông tin vị trí hiện tại để gửi kèm phản ánh?\n' +
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
                        Utils.showMsgBoxYesNo(this, 'Dịch vụ vị trí bị tắt', configHome.TenAppHome + ' cần truy cập vị trí của bạn. Hãy bật Dịch vụ vị trí trong phần cài đặt điện thoại của bạn.',
                            'Đến cài đặt', 'Không, cảm ơn',
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
                    setTimeout(() => {
                        if (code == 1 && AppState.currentState == 'active') {
                            Utils.showMsgBoxYesNo(this, 'Dịch vụ vị trí bị tắt',
                                'Ứng dụng cần truy cập vị trí của bạn. Hãy bật dịch vụ vị trí trong phần cài đặt điện thoại của bạn.',
                                'Đến cài đặt', 'Không, cảm ơn',
                                () => {
                                    Linking.openURL('app-settings:').catch((err) => {
                                        nlog('app-settings:', err);
                                    });
                                });
                        }
                    }, 200);
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

    callbackDataMaps = (diaDiem, latlng) => {
        this.setState({ diaDiem, latlng });
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
            diaDiem = '',
            noiDungGui = '',
            ListHinhAnh = [],
            ListFileDinhKemNew = [],
            latlng,
            paKhan,
            PhoneNoLogin,
            NameNoLogin,
            selectedChuyenMuc,
            selectedLinhVuc,
            selectedDonVi
        } = this.state;
        // Utils.nlog("Nguyên list nháp", ListFileDinhKemNew)

        let draftList = await Utils.ngetStore(nkey.draftList, []);
        let idDraft = new Date().getTime();
        let draft = {
            idDraft: idDraft,
            diaDiem: diaDiem,
            noiDungGui: noiDungGui,
            ListHinhAnh: ListFileDinhKemNew,
            latlng: latlng,
            paKhan: paKhan,
            ToaDoX: latlng.latitude,
            ToaDoY: latlng.longitude,
            PhoneNoLogin: PhoneNoLogin ? PhoneNoLogin : '',
            NameNoLogin: NameNoLogin ? NameNoLogin : '',
            ChuyenMuc: selectedChuyenMuc?.TenChuyenMuc,
            IdChuyenMuc: selectedChuyenMuc?.IdChuyenMuc,
            IdLinhVuc: selectedLinhVuc?.IdLinhVuc,
            IdBoPhan: selectedDonVi?.MaPX,
            LinhVuc: selectedLinhVuc?.LinhVuc,
            TenPhuongXa: selectedDonVi?.TenPhuongXa,
        }
        draftList.unshift(draft);
        this.setState({ noiDungGui: '', ListFileDinhKemNew: [], diaDiem: '', latlng: {} })
        await Utils.nsetStore(nkey.draftList, draftList);
        ROOTGlobal.dataGlobal._onRefreshBanNhap();
        Utils.goback(this);

    }

    handleRemoveDraft = async () => {
        let { idDraft } = this.state;
        let draftList = await Utils.ngetStore(nkey.draftList, []);
        let draftIndex = draftList.findIndex(item => item.idDraft == idDraft)
        if (draftIndex != -1) {
            draftList.splice(draftIndex, 1);
        }
        await Utils.nsetStore(nkey.draftList, draftList);
        ROOTGlobal.dataGlobal._onRefreshBanNhap();
        Utils.goback(this);
    }

    handleUpdateDraft = async () => {
        let {
            diaDiem = '',
            noiDungGui = '',
            ListHinhAnh = [],
            ListFileDinhKemNew = [],
            idDraft,
            latlng,
            paKhan,
            PhoneNoLogin,
            NameNoLogin,
            selectedChuyenMuc,
            selectedLinhVuc,
            selectedDonVi
        } = this.state;

        let draftList = await Utils.ngetStore(nkey.draftList, []);
        let draftIndex = draftList.findIndex(item => item.idDraft == idDraft)
        if (draftIndex != -1) {
            let itemUpdate = {
                idDraft: idDraft,
                diaDiem: diaDiem,
                noiDungGui: noiDungGui,
                ListHinhAnh: [...ListHinhAnh, ...ListFileDinhKemNew],
                latlng: latlng,
                ToaDoX: latlng.latitude,
                ToaDoY: latlng.longitude,
                paKhan: paKhan,
                PhoneNoLogin: PhoneNoLogin ? PhoneNoLogin : '',
                NameNoLogin: NameNoLogin ? NameNoLogin : '',
                ChuyenMuc: selectedChuyenMuc?.TenChuyenMuc,
                IdChuyenMuc: selectedChuyenMuc?.IdChuyenMuc,
                IdLinhVuc: selectedLinhVuc?.IdLinhVuc,
                IdBoPhan: selectedDonVi?.MaPX,
                LinhVuc: selectedLinhVuc?.LinhVuc,
                TenPhuongXa: selectedDonVi?.TenPhuongXa,
            }
            // Utils.nlog('handleUpdateDraft', itemUpdate);
            draftList[draftIndex] = itemUpdate;
        }
        await Utils.nsetStore(nkey.draftList, draftList);
        ROOTGlobal.dataGlobal._onRefreshBanNhap();
        Utils.goback(this);
    }

    handleRefreshDataSend = () => {
        this.setState({
            IdPA: 0,
            idDraft: 0,
            diaDiem: '',
            noiDungGui: '',
            ListHinhAnh: [],
            ListFileDinhKemNew: [],
            paKhan: false,
            PhoneNoLogin: '',
            NameNoLogin: ''
            // latlng: {}
        })
        this.refPick?.current?.refreshData([])
    }

    onPressBack = () => {
        let {
            noiDungGui = '',
            ListHinhAnh = [],
            ListFileDinhKemNew = [],
            idDraft,
            IdPA
        } = this.state;
        if (IdPA > 0) {
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
                'Bạn đang thực hiện chỉnh sửa bản nháp phản ánh. ' +
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
        } else if (noiDungGui.length > 0 || ListFileDinhKemNew.length > 0) {
            Alert.alert(
                'Lưu nháp',
                'Nội dung phản ánh sẽ mất sau khi bạn thoát. ' +
                'Bạn có muốn lưu nháp phản ánh để gửi sau không?',
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
            Utils.showMsgBoxOK(this, '', 'Chỉ được gửi tối đa 8 hình ảnh!');
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
        let { idDraft, IdPA, isFirstEdit, latlng } = this.state;
        let isEdit = (idDraft > 0 || IdPA > 0) && isFirstEdit;
        if (isEdit) {
            this.setState({
                isFirstEdit: false
            })
            return;
        }

        var diaDiem = 'Đang lấy dữ liệu vị trí hiện tại';
        this.setState({
            findLocation: true,
            diaDiem: diaDiem,
        });

        //---
        let {
            latitude,
            longitude
        } = latlng
        let res = await apis.ApiApp.getAddressGG(latitude, longitude);
        if (res && res.full_address) {
            this.setState({ findLocation: false, diaDiem: res.full_address });
        } else {
            this.setState({ findLocation: false, diaDiem: res.latitude + ', ' + res.longitude });
        }
    }

    onPressStopFindLocation = () => {
        this.setState({ findLocation: false, diaDiem: '' });
    }

    onPressClearLocation = () => {
        this.setState({
            diaDiem: '',
            latlng: {
                latitude: Latitude,
                longitude: Longitude
            }
        });
    }
    goToLogin = () => {
        Utils.showMsgBoxYesNo(this,
            'Cung cấp thông tin cá nhân',
            'Vui lòng đăng nhập để cung cấp thông tin cá nhân của bạn gửi kèm ' +
            'phản ánh. Đơn vị xử lý có thể liên hệ để yêu cầu cung cấp thêm thông tin ' +
            'nếu cần. Ngoài ra đăng nhập cũng giúp bạn có thể theo dõi được kết quả xử lý phản ánh.',
            'Đăng nhập', 'Quay lại', () => {
                let {
                    noiDungGui = '',
                    ListHinhAnh = [],
                    idDraft
                } = this.state;
                if (idDraft > 0)
                    this.handleUpdateDraft();
                else
                    if (noiDungGui.length > 0 || ListHinhAnh.length > 0)
                        this.handleAddDraft();
                Utils.goscreen(this, 'login', { isSendPA: true });
            });
    }
    onPressSubmit = () => {
        const { NameNoLogin, PhoneNoLogin, IdPA, noiDungGui } = this.state;
        if (this.isPolicy && IdPA == 0 && NameNoLogin != '' && PhoneNoLogin != '' && noiDungGui != '') {
            Utils.navigate("Modal_Policy", {
                "callback": this.onPressSend
            });
        } else {
            this.onPressSend()
        }

    }

    onPressSend = async () => {
        await analytics().logEvent(KeyAnalytics.send_phananh, {
            "user": "userCD"
        })
        console.log("gia trị time bắt đầu", moment(new Date()).format('HH:mm:ss'))
        Utils.nlog("List image nè:", this.state.ListFileDinhKemNew)
        let {
            IdPA,
            noiDungGui,
            diaDiem,
            ListHinhAnh,
            ListFileDinhKemNew,
            Notify,
            latlng,
            paKhan,
            paCongKhai,
            PhoneNoLogin,
            NameNoLogin,
            dataTypeForm,
            selectNguyCo,
            IdChuyenMuc,
            ChuyenMuc
        } = this.state;
        diaDiem = diaDiem ? diaDiem : Utils.getGlobal(nGlobalKeys.isDiaChi, '') ? appConfig.TenTinh : '';
        if (this.sendOpinionNoLogin && this.props.auth.tokenCD.length < 3) {
            if (!NameNoLogin) {
                Toast.show('Vui lòng nhập họ và tên', Toast.LONG);
                return;
            }
            if (!PhoneNoLogin || PhoneNoLogin.length < 10) {
                Toast.show('Vui lòng nhập số điện thoại hoặc số điện thoại không hợp lệ', Toast.LONG);
                return;
            }
        }

        if (this.chooseBoPhanLinhVucChuyenMuc) {
            if (this.state.selectedDonVi?.MaPX == -1 && this.state.lstDonVi.length > 0) {
                Toast.show('Vui lòng chọn phường / xã', Toast.LONG);
                return;
            }
            if (this.state.selectedLinhVuc?.IdLinhVuc == -1 && this.state.lstLinhVuc.length > 0) {
                Toast.show('Vui lòng chọn lĩnh vực', Toast.LONG);
                return;
            }
            if (this.state.selectedChuyenMuc?.IdChuyenMuc == -1 && this.state.lstChuyenMuc.length > 0) {
                Toast.show('Vui lòng chọn chuyên mục', Toast.LONG);
                return;
            }
        }

        if (!noiDungGui && this.isGuiPADichBenhMDo == 'false') {
            // Toast.show('Vui lòng nhập nội dung ' + Utils.getGlobal(nGlobalKeys.TieuDe).toLowerCase(), Toast.LONG);
            Toast.show(dataTypeForm?.Warning ? dataTypeForm?.Warning : '', Toast.LONG);
            return;
        }
        if (this.isEdit == 1) {
            if (this.state.ListHinhAnh.length == 0 && appConfig.isImage) {
                Toast.show('Vui lòng chọn hình ảnh/ video/ file đính kèm để chỉnh sửa phản ánh', Toast.LONG);
                return;
            }
        } else {
            if (ListFileDinhKemNew.length == 0 && appConfig.isImage) {
                Toast.show('Vui lòng chọn hình ảnh/ video/ file đính kèm để gửi phản ánh', Toast.LONG);
                return;
            }
        }
        if (!diaDiem) {
            Toast.show('Vui lòng chọn vị trí phản ánh', Toast.LONG);
            return;
        }
        if (dataTypeForm?.BodyPost?.length > 0) {
            for (const item of dataTypeForm?.BodyPost) {
                if (item.CheckNull && !this.state[item?.Key]) {
                    Toast.show('Vui lòng chọn/nhập ' + item.Name.toLowerCase(), Toast.LONG);
                    return
                }
            }
        }
        this.enableLoading(true);
        const DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
        let dem = 0;
        if (IdPA > 0) {
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
            //Trường hợp không login có thêm các thông tin sau
            if (this.sendOpinionNoLogin && this.props.auth.tokenCD.length < 3) {
                dataBoDy.append('DevicesToken', DevicesToken)
                dataBoDy.append('HoTen', NameNoLogin)
                dataBoDy.append('PhoneNumber', PhoneNoLogin)
            }
            //Chinh Sua Phan Anh
            let NoiDungDichBenh = ChuyenMuc ? ChuyenMuc : selectNguyCo?.TenChuyenMuc;
            Utils.nlog('Gia tri noi dung gui PhanAnh', NoiDungDichBenh)
            dataBoDy.append("NoiDung", this.isGuiPADichBenhMDo == 'true' && IdChuyenMuc >= 59 ? `Phản ánh dịch bệnh ${NoiDungDichBenh} ` : noiDungGui)
            dataBoDy.append("TieuDe", this.tieuDeGui)
            dataBoDy.append("ToaDoX", latitude)
            dataBoDy.append("ToaDoY", longitude)
            dataBoDy.append("Notify", Notify)
            dataBoDy.append('DiaDiem', diaDiem)
            dataBoDy.append('IdPA', IdPA)
            dataBoDy.append("MucDo", paKhan ? 3 : 0);
            dataBoDy.append("IdFileDel", idDelete)
            if (this.isGuiPADichBenhMDo == 'true' && IdChuyenMuc >= 59) {
                dataBoDy.append('IdChuyenMuc', IdChuyenMuc ? IdChuyenMuc : selectNguyCo?.IdChuyenMuc)
                dataBoDy.append('CongKhai', true)
            } else {
                if (this.showCheckCongKhaiPA) dataBoDy.append("CongKhai", paCongKhai)
            }
            //Xử lý mới theo loại form
            if (dataTypeForm?.BodyPost?.length > 0) {
                dataTypeForm?.BodyPost?.forEach(e => {
                    if (e?.IsState) {
                        dataBoDy.append(e?.Key, this.state[e?.Key])
                    } else {
                        dataBoDy.append(e?.Key, e?.Val)
                    }

                });
            }
            if (this.chooseBoPhanLinhVucChuyenMuc) {
                dataBoDy.append('IdBoPhan',
                    this.state.IdBoPhan && this.state.IdBoPhan == this.state.selectedDonVi?.MaPX ? this.state.IdBoPhan
                        : this.state.lstDonVi.length > 0 && this.state.selectedDonVi?.MaPX != -1 ? this.state.selectedDonVi?.MaPX : 0)
                dataBoDy.append('LinhVuc',
                    this.state.IdLinhVuc && this.state.IdLinhVuc == this.state.selectedLinhVuc?.IdLinhVuc ? this.state.IdLinhVuc
                        : this.state.lstLinhVuc.length > 0 && this.state.selectedLinhVuc?.IdLinhVuc != -1 ? this.state.selectedLinhVuc?.IdLinhVuc : 0)
                dataBoDy.append('IdChuyenMuc',
                    this.state.IdChuyenMuc && this.state.IdChuyenMuc == this.state.selectedChuyenMuc?.IdChuyenMuc ? this.state.IdChuyenMuc
                        : this.state.lstChuyenMuc.length > 0 && this.state.selectedChuyenMuc?.IdChuyenMuc != -1 ? this.state.selectedChuyenMuc?.IdChuyenMuc : 0)
            }
            Utils.nlog("gia trị time bắt đầu gửi ----------------------------------", moment(new Date()).format('HH:mm:ss'))
            await apis.ApiUpLoad.EditPA_FormData(dataBoDy).then(
                async (res) => {
                    dem = 0;
                    Utils.nlog("gia trị time hoàn thành ----------------------------------", moment(new Date()).format('HH:mm:ss'))
                    if (res == -2) {
                        this.enableLoading(false);
                        this.goToLogin();
                    }
                    if (res.status == 1) {
                        this.enableLoading(false);
                        if (this.state.idDraft > 0) {
                            this.handleRemoveDraft();
                        }
                        this.setState({
                            IdPA: 0,
                            idDraft: 0,
                            noiDungGui: '',
                            ListHinhAnh: [],
                            diaDiem: '',
                            ListHinhAnhDelete: []
                        }, this.goToListingSent)
                    } else {
                        const { error } = res;
                        this.enableLoading(false);
                        let message = `Gửi thất bại\n${error && error.message ? error.message : "Bạn hãy thử lại"}`
                        Utils.showMsgBoxOK(this, "Thông báo", message, "Xác nhận");
                    }
                }
            );


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
                            Utils.nlog("uri mới nhe", uri);
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
            //GUi Phan Anh
            let NoiDungDichBenh = "Phản ánh dịch bệnh " + selectNguyCo?.TenChuyenMuc;
            Utils.nlog('Gia tri noi dung gui PhanAnh', NoiDungDichBenh)
            dataBoDy.append("NoiDung", this.isGuiPADichBenhMDo == 'true' && this.isModalGuiPA == 1000 ? NoiDungDichBenh : noiDungGui)
            dataBoDy.append("TieuDe", this.tieuDeGui)
            // dataBoDy.append("NumberPhone", NumberPhone)
            dataBoDy.append("Email", Email)
            dataBoDy.append("ToaDoX", latitude)
            dataBoDy.append("ToaDoY", longitude)
            dataBoDy.append("Notify", Notify)
            dataBoDy.append('DiaDiem', diaDiem)
            dataBoDy.append('IdPA', 0)
            dataBoDy.append("MucDo", paKhan ? 3 : 0)
            if (this.isGuiPADichBenhMDo == 'true' && this.isModalGuiPA == 1000) {
                dataBoDy.append('IdChuyenMuc', selectNguyCo?.IdChuyenMuc)
                dataBoDy.append('CongKhai', true)
            } else {
                if (this.showCheckCongKhaiPA) dataBoDy.append("CongKhai", paCongKhai)
            }
            //Xử lý mới theo loại form
            if (dataTypeForm?.BodyPost?.length > 0) {
                dataTypeForm?.BodyPost?.forEach(e => {
                    if (e?.IsState) {
                        dataBoDy.append(e?.Key, this.state[e?.Key])
                    } else {
                        dataBoDy.append(e?.Key, e?.Val)
                    }

                });
            }
            //Trường hợp không login có thêm các thông tin sau
            if (this.sendOpinionNoLogin && this.props.auth.tokenCD.length < 3) {
                dataBoDy.append('DevicesToken', DevicesToken)
                dataBoDy.append('HoTen', NameNoLogin)
                dataBoDy.append('PhoneNumber', PhoneNoLogin)
            } else {
                dataBoDy.append("NguoiGopY", IdUser);
                dataBoDy.append("NumberPhone", NumberPhone)
            }
            if (this.chooseBoPhanLinhVucChuyenMuc) {
                dataBoDy.append('IdBoPhan',
                    this.state.IdBoPhan && this.state.IdBoPhan == this.state.selectedDonVi?.MaPX ? this.state.IdBoPhan
                        : this.state.lstDonVi.length > 0 && this.state.selectedDonVi?.MaPX != -1 ? this.state.selectedDonVi?.MaPX : 0)
                dataBoDy.append('LinhVuc',
                    this.state.IdLinhVuc && this.state.IdLinhVuc == this.state.selectedLinhVuc?.IdLinhVuc ? this.state.IdLinhVuc
                        : this.state.lstLinhVuc.length > 0 && this.state.selectedLinhVuc?.IdLinhVuc != -1 ? this.state.selectedLinhVuc?.IdLinhVuc : 0)
                dataBoDy.append('IdChuyenMuc',
                    this.state.IdChuyenMuc && this.state.IdChuyenMuc == this.state.selectedChuyenMuc?.IdChuyenMuc ? this.state.IdChuyenMuc
                        : this.state.lstChuyenMuc.length > 0 && this.state.selectedChuyenMuc?.IdChuyenMuc != -1 ? this.state.selectedChuyenMuc?.IdChuyenMuc : 0)
            }
            Utils.nlog("gia trị time bắt đầu gửi ----------------------------------", moment(new Date()).format('HH:mm:ss'))
            Utils.nlog("Kêt qua hoàn tahnh èn:", dataBoDy)
            await apis.ApiUpLoad.GuiPA_FormData(dataBoDy).then(
                async (res) => {
                    Utils.nlog("gia trị time hoàn thành ----------------------------------", moment(new Date()).format('HH:mm:ss'), res)
                    if (res == -2) {
                        this.enableLoading(false);
                        this.goToLogin();
                    }
                    if (res.status == 1) {
                        this.enableLoading(false);
                        if (this.state.idDraft > 0) {
                            this.handleRemoveDraft();
                        }
                        this.setState({
                            IdPA: 0,
                            idDraft: 0,
                            noiDungGui: '',
                            ListHinhAnh: [],
                            diaDiem: '',
                            ListHinhAnhDelete: []
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
        ROOTGlobal.dataGlobal._onRefreshDaGui();
        this.state.dataTypeForm?.ActionsSend ? this.state.dataTypeForm?.ActionsSend() : null
        await Utils.nsetStore(nkey.realTimeDataPA, {})

    }
    onPressSetNotify = (Notify) => {
        this.setState({ Notify: Notify });
    }
    onCheckKhan = () => {
        this.setState({ paKhan: !this.state.paKhan });
    }

    onChangeNameNoLogin = (text) => { this.setState({ NameNoLogin: text }) }

    onChangePhoneNoLogin = (phone) => { this.setState({ PhoneNoLogin: phone }) }

    OpenModalDrop_MucDoNguyCo = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectProps', {
            callback: (val) => this.setState({ selectNguyCo: val, ChuyenMuc: val.TenChuyenMuc, IdChuyenMuc: val.IdChuyenMuc }, Utils.nlog('Gia tri vals', val)), item: this.state.selectNguyCo,
            AllThaoTac: this.state.lstMucDoNguyCo, ViewItem: item => this._viewItem(item, 'TenChuyenMuc'),
            title: 'Danh sách mức độ nguy cơ',
        })
    }

    ChooseBoPhan = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectBottom', {
            callback: (val) => this.setState({ selectedDonVi: val },
                Utils.nlog('Gia tri don vi', val)),
            item: this.state.selectedDonVi,
            AllThaoTac: this.state.lstDonVi, ViewItem: item => this._viewItem(item, 'TenPhuongXa'),
            title: 'Danh sách phường xã',
            key: 'TenPhuongXa',
            Search: true,
        })
    }

    ChooseLinhVuc = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectBottom', {
            callback: (val) => this.setState({ selectedLinhVuc: val }, () => {
                Utils.nlog('Gia tri linh vuc', val)
                this.getChuyenMuc()
            }),
            item: this.state.selectedLinhVuc,
            AllThaoTac: this.state.lstLinhVuc, ViewItem: item => this._viewItem(item, 'LinhVuc'),
            title: 'Danh sách lĩnh vực',
            key: 'LinhVuc',
            Search: true,
        })
    }

    ChooseChuyenMuc = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectBottom', {
            callback: (val) => this.setState({ selectedChuyenMuc: val }, () => {
                Utils.nlog('Gia tri chuyen muc', val)
            }),
            item: this.state.selectedChuyenMuc,
            AllThaoTac: this.state.lstChuyenMuc, ViewItem: item => this._viewItem(item, 'TenChuyenMuc'),
            title: 'Danh sách chuyên mục',
            key: 'TenChuyenMuc',
            Search: true,
        })
    }

    _viewItem = (item, value) => {
        Utils.nlog('Log [item]', item)
        return (
            <View key={item[value || 'id']} style={{
                flex: 1,
                paddingVertical: 15,
                borderBottomColor: colors.black_50,
            }}>
                <Text style={{ textAlign: 'center', color: colors.colorTextSelect }} >{item[value]}</Text>
            </View>
        )
    }

    onCheckCongKhai = () => {
        this.setState({ paCongKhai: !this.state.paCongKhai });
    }

    renderKhuVucLinhVucChuyenMuc = () => {
        const { IdPA, lstDonVi, selectedDonVi, lstChuyenMuc, selectedChuyenMuc, lstLinhVuc, selectedLinhVuc, ChuyenMuc, LinhVuc, TenPhuongXa, IdChuyenMuc, IdLinhVuc, IdBoPhan } = this.state
        console.log('log', IdBoPhan, selectedDonVi.MaPX)
        return (<>
            <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>{`Chọn phường/xã`}<Text style={{ color: colors.redStar }}>{`*`}</Text></Text>
            <TouchableOpacity
                onPress={this.ChooseBoPhan}
                style={{
                    flexDirection: 'row', paddingHorizontal: 10,
                    borderColor: colors.black_50, borderWidth: 0.5,
                    justifyContent: 'space-between',
                    alignItems: 'center', borderRadius: 3,

                }}>
                <Text style={{ padding: 10, color: colors.black }}>
                    {selectedDonVi?.TenPhuongXa}
                </Text>
                <Image source={Images.icNext} style={[{ tintColor: colors.colorGrayIcon, width: 14, height: 12, transform: [{ rotate: '90deg' }] }]} />
            </TouchableOpacity>
            <Text style={{ fontWeight: 'bold', marginTop: 10, marginBottom: 10 }}>{`Chọn lĩnh vực`}<Text style={{ color: colors.redStar }}>{`*`}</Text></Text>
            <TouchableOpacity
                onPress={this.ChooseLinhVuc}
                style={{
                    flexDirection: 'row', paddingHorizontal: 10,
                    borderColor: colors.black_50, borderWidth: 0.5,
                    justifyContent: 'space-between',
                    alignItems: 'center', borderRadius: 3,

                }}>
                <Text style={{ padding: 10, color: colors.black }}>
                    {selectedLinhVuc?.LinhVuc}
                </Text>
                <Image source={Images.icNext} style={[{ tintColor: colors.colorGrayIcon, width: 14, height: 12, transform: [{ rotate: '90deg' }] }]} />
            </TouchableOpacity>
            <Text style={{ fontWeight: 'bold', marginTop: 10, marginBottom: 10 }}>{`Chọn chuyên mục`}<Text style={{ color: colors.redStar }}>{`*`}</Text></Text>
            <TouchableOpacity
                onPress={this.ChooseChuyenMuc}
                style={{
                    flexDirection: 'row', paddingHorizontal: 10,
                    borderColor: colors.black_50, borderWidth: 0.5,
                    justifyContent: 'space-between',
                    alignItems: 'center', borderRadius: 3,

                }}>
                <Text style={{ padding: 10, color: colors.black }}>
                    {selectedChuyenMuc?.TenChuyenMuc}
                </Text>
                <Image source={Images.icNext} style={[{ tintColor: colors.colorGrayIcon, width: 14, height: 12, transform: [{ rotate: '90deg' }] }]} />
            </TouchableOpacity>
        </>
        )
    }

    render() {
        let {
            tuDongViTri,
            enableThemDiaDiem,
            diaDiem, findLocation,
            noiDungGui,
            ListHinhAnh,
            IdPA,
            paKhan, ListHinhAnhDelete = [],
            ListFileDinhKemDelete, ListFileDinhKemNew,
            NameNoLogin, PhoneNoLogin, dataTypeForm,
            isLoading,
            lstMucDoNguyCo,
            selectNguyCo,
            IdChuyenMuc,
            ChuyenMuc, paCongKhai,
        } = this.state;
        let placeholderNoiDung = dataTypeForm?.PlaceholderNoiDung
        let booleanViTri = tuDongViTri && !this.isEdit || enableThemDiaDiem || this.isEdit
        let txtThemViTri = booleanViTri ? dataTypeForm?.TextLocation : 'Chọn địa điểm ' + Utils.getGlobal(nGlobalKeys.TieuDe).toLowerCase();
        let txtTuDong = dataTypeForm?.TextTuDong
        // let headertitle = 'Gửi ' + Utils.getGlobal(nGlobalKeys.TieuDe).toLowerCase();
        let headertitle = dataTypeForm?.HeaderTitle
        let txtNhapViTri = diaDiem.length == 0 ? 'Chọn vị trí' : 'Nhập vị trí';
        const NumberPhone = Utils.getGlobal(nGlobalKeys.NumberPhone, "");
        let {
            stTextInput, stThemViTri, stViewTuDong,
            stTxtTuDong, stViewBanDo,
        } = styles;
        const { tokenCD } = this.props.auth

        // Utils.nlog("<><><>", lstMucDoNguyCo, this.isEdit, selectNguyCo, this.isModalGuiPA)
        return (
            <View style={nstyles.ncontainer}>
                <View style={[nstyles.nbody, { backgroundColor: 'white' }]}>
                    {/* Header */}
                    <HeaderCus
                        Sleft={{ width: 18, height: 18, tintColor: colors.white }}
                        iconLeft={Images.icBack}
                        styleTitle={{ color: colors.white }}
                        onPressLeft={this.onPressBack}
                        title={headertitle}
                    />
                    <View style={{ height: 3, backgroundColor: "#F8F8F8" }}></View>
                    {/* Body */}

                    <ScrollView
                        style={[nstyles.nbody]}>
                        <View style={[nstyles.nbody]}>
                            <View style={[nstyles.nbody, { paddingHorizontal: 13 }]}>
                                <View style={nstyles.nbody}>
                                    {/* {Thành phần hiển thị khi gửi không có login} */}
                                    {
                                        this.sendOpinionNoLogin ?
                                            tokenCD ? null :
                                                <>
                                                    <Text style={styles.txtNameNoLogin}>{'Họ và tên'}</Text>
                                                    <TextInput
                                                        placeholder={'Nhập họ tên'}
                                                        style={styles.inputHoTen}
                                                        value={NameNoLogin}
                                                        onChangeText={this.onChangeNameNoLogin}
                                                        editable={this.sendOpinionNoLogin && tokenCD.length > 0 || this.isEdit ? false : true}
                                                    />
                                                    <Text style={styles.txtNameNoLogin}>{'Số điện thoại'}</Text>
                                                    <TextInput
                                                        placeholder={'Nhập số điện thoại'}
                                                        style={styles.inputHoTen}
                                                        value={PhoneNoLogin}
                                                        onChangeText={this.onChangePhoneNoLogin}
                                                        keyboardType={'numeric'}
                                                        maxLength={11}
                                                        editable={this.sendOpinionNoLogin && tokenCD.length > 0 || this.isEdit ? false : true}
                                                    />
                                                </>
                                            : null
                                    }
                                    {dataTypeForm?.KeyRenderMore == 1000 ?

                                        <>
                                            <Text style={styles.txtNameNoLogin}>{'Số điện thoại'}</Text>
                                            <TextInput
                                                placeholder={'Nhập số điện thoại'}
                                                style={styles.inputHoTen}
                                                value={NumberPhone}
                                                onChangeText={this.onChangePhoneNoLogin}
                                                keyboardType={'numeric'}
                                                maxLength={11}
                                                editable={false}
                                            />
                                        </> : null
                                    }
                                    {this.chooseBoPhanLinhVucChuyenMuc ? this.renderKhuVucLinhVucChuyenMuc() : null}
                                    {
                                        (this.isGuiPADichBenhMDo == 'true' && dataTypeForm?.KeyRenderMore == 1000) || (this.isEdit && IdChuyenMuc >= 59) ?
                                            <>
                                                <Text style={{ fontWeight: 'bold', marginTop: 10, marginBottom: 10 }}>{`Mức độ nguy cơ`}</Text>
                                                {
                                                    lstMucDoNguyCo && lstMucDoNguyCo.length ? <TouchableOpacity
                                                        onPress={this.OpenModalDrop_MucDoNguyCo}
                                                        style={{
                                                            flexDirection: 'row', paddingHorizontal: 10,
                                                            borderColor: colors.black_50, borderWidth: 0.5,
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center', borderRadius: 3,

                                                        }}>
                                                        <Text style={{ padding: 10, color: colors.black }}>
                                                            {ChuyenMuc ? ChuyenMuc : selectNguyCo?.TenChuyenMuc}
                                                        </Text>
                                                        <Image source={Images.icNext} style={[{ tintColor: colors.colorGrayIcon, width: 14, height: 12, transform: [{ rotate: '90deg' }] }]} />
                                                    </TouchableOpacity> : null
                                                }
                                            </>
                                            :
                                            <>
                                                <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>{dataTypeForm?.LabelNoiDung}</Text>
                                                <TextInput
                                                    style={[stTextInput, {
                                                        minHeight: Height(15), maxHeight: Height(20), textAlignVertical: 'top', backgroundColor: "#F5F5F5",
                                                        paddingHorizontal: 15, borderRadius: 3
                                                    }]}
                                                    multiline={true}
                                                    value={noiDungGui}
                                                    onFocus={() => this.setState({ contenFocus: true })}
                                                    onBlur={() => this.setState({ contenFocus: false })}
                                                    onChangeText={text => this.setState({ noiDungGui: text })}
                                                    placeholder={placeholderNoiDung}
                                                    placeholderTextColor={colors.black_20}
                                                />
                                                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                                    {isLoading ? <LottieView source={Images.icVoice} autoPlay style={{ height: Height(12) / 1.5, alignItems: 'center', justifyContent: 'center' }} /> : null}
                                                    <TouchableOpacity
                                                        onPressIn={this.startRecording}
                                                        onPressOut={this.stopRecording}
                                                        style={{ paddingVertical: 10, flexDirection: 'row' }}
                                                    >
                                                        <Image
                                                            source={Images.icMicro}
                                                            style={nstyles.nIcon32}
                                                        />
                                                    </TouchableOpacity>
                                                    {isLoading ? <LottieView source={Images.icVoice} autoPlay style={{ height: Height(12) / 1.5, alignItems: 'center', justifyContent: 'center' }} /> : null}
                                                </View>

                                                <Text style={{ marginTop: 5, fontSize: reText(15), textAlign: 'center' }} >{'Ấn giữ để nhập nội dung bằng giọng nói'}</Text>
                                                {
                                                    !this.state.contenFocus ? null :
                                                        <View style={{ alignItems: 'flex-end' }}>
                                                            <TouchableOpacity style={{
                                                                padding: 5, paddingHorizontal: 10, borderWidth: 0.5,
                                                                borderRadius: 5, borderColor: colors.colorBlueP, marginTop: 5
                                                            }} onPress={() => { Keyboard.dismiss() }}>
                                                                <Text style={{ fontSize: reText(16), color: colors.colorBlueP, fontWeight: 'bold' }}>Xong</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                }
                                            </>
                                    }
                                </View>
                                {
                                    [1000, 102].includes(dataTypeForm?.KeyRenderMore) ? null :
                                        <>
                                            {
                                                ![1001].includes(dataTypeForm?.KeyRenderMore) &&
                                                <TouchableOpacity
                                                    activeOpacity={0.5}
                                                    onPress={this.onCheckKhan}>
                                                    <View style={stViewTuDong}>
                                                        <View
                                                            style={[nstyles.nIcon18, {
                                                                borderColor: paKhan == 3 ? colors.colorRed : colors.black_30,
                                                                borderWidth: 1, backgroundColor: paKhan ? colors.colorRed : colors.white
                                                            }]}
                                                        />
                                                        <Text style={{ color: colors.black_50, fontSize: reText(16), marginLeft: 5 }}>
                                                            {Utils.getGlobal(nGlobalKeys.TieuDe, '') + ' '} <Text style={{ color: colors.redStar }}>KHẨN</Text>
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            }
                                            {
                                                this.showCheckCongKhaiPA && <TouchableOpacity
                                                    style={{ marginTop: 10 }}
                                                    activeOpacity={0.5}
                                                    onPress={this.onCheckCongKhai}>
                                                    <View style={stViewTuDong}>
                                                        <View
                                                            style={[nstyles.nIcon18, {
                                                                borderColor: paCongKhai ? colors.colorRed : colors.black_30,
                                                                borderWidth: 1, backgroundColor: paCongKhai ? colors.colorRed : colors.white
                                                            }]}
                                                        />
                                                        <Text style={{ color: colors.black_50, fontSize: reText(16), marginLeft: 5 }}>
                                                            {'Công khai phản ánh'}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            }
                                            {paCongKhai && <Text style={{ marginTop: 10, fontStyle: 'italic', fontWeight: 'bold', color: colors.greenButton, textAlign: 'justify' }}>{'Kết quả xử lý sẽ công khai trên ứng dụng và cổng thông tin'}</Text>}
                                        </>
                                }
                                <View style={{ marginTop: 10, }}>
                                    {
                                        booleanViTri ? <Text style={{ color: colors.black, fontWeight: 'bold' }}>{txtThemViTri}</Text>
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
                                                        {txtThemViTri}
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
                                                            {txtTuDong}
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
                                                editable={!findLocation && diaDiem.length != 0}
                                                placeholder={txtNhapViTri}
                                                placeholderTextColor={colors.colorBlueP}
                                                multiline={true}
                                                value={diaDiem}
                                                onChangeText={text => this.setState({ diaDiem: text })}
                                                style={[stTextInput, {
                                                    flex: 2,
                                                    color: colors.colorBlueP,
                                                    paddingLeft: 4, paddingTop: 6,
                                                    paddingBottom: 6, maxHeight: 80
                                                }]} />
                                            {diaDiem.length > 0 && !findLocation ?
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
                                                <Text style={{ color: colors.colorPink, fontSize: reText(20), fontWeight: 'bold' }}>
                                                    {'Dừng'}
                                                </Text>
                                            </TouchableOpacity> : null}
                                            {diaDiem.length == 0 ?
                                                <BtnViTri
                                                    onPress={this._hienTai}
                                                    source={Images.icHere}
                                                    text={'Hiện tại'} /> : null}
                                            {diaDiem.length == 0 ?
                                                <BtnViTri
                                                    onPress={this.onPressMaps}
                                                    source={Images.icBanDo}
                                                    text={'Bản đồ'} />
                                                : null}
                                        </View>
                                    </View>
                                ) : null}
                            </View>
                            <Text style={{ fontWeight: 'bold', marginHorizontal: 10, marginTop: 15 }}>Hình ảnh, Video, File đính kèm</Text>
                            {/* <View>
                                <ListHinhAnhCom
                                    nthis={this}
                                    requestCameraPermission={() => this.requestCameraPermission()}
                                    onPressDelete={(arr, itemDelete) => {
                                        if (itemDelete.isOld == true) {
                                            this.setState({ ListHinhAnh: arr, ListHinhAnhDelete: ListHinhAnhDelete.concat(itemDelete) });
                                        } else {
                                            this.setState({ ListHinhAnh: arr });
                                        }
                                    }}
                                    ListHinhAnh={ListHinhAnh} />
                            </View> */}

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
                            text={`${IdPA > 0 ? 'Cập nhật' : 'Gửi'} ${dataTypeForm?.textButton}`}
                            onPress={this.onPressSubmit}
                            style={{ borderRadius: 5, marginHorizontal: 10, marginBottom: 30 }}
                            txtStyle={{ fontSize: reText(14) }}
                        />
                    </ScrollView>
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
export default Utils.connectRedux(GuiPhanAnhRoot, mapStateToProps, true)

const styles = StyleSheet.create({
    stTextInput: {
        fontSize: reText(16),
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
        fontSize: reText(15),
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
    }
})
