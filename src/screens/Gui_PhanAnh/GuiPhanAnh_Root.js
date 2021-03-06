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
const { OpenSetting } = NativeModules; // g???i t???i moudel openSettings t???i app Google
class GuiPhanAnhRoot extends Component {
    constructor(props) {
        super(props);
        this.tieuDeGui = '';
        let data = Utils.ngetParam(this, 'data', {});
        Utils.nlog('Gia tri dataa', data)
        this.isEdit = Utils.ngetParam(this, 'isEdit', 0);
        this.isgetFirstLocationOK = false;
        this.isModalGuiPA = Utils.ngetParam(this, 'isModalGuiPA', 0);
        this.sendOpinionNoLogin = Utils.getGlobal(nGlobalKeys.sendOpinionNoLogin, false) // g???i ph???n ??nh kh??ng c???n ????ng nh???p
        this.isGuiPADichBenhMDo = Utils.getGlobal(nGlobalKeys.isGuiPADichBenhMDo, false)
        this.showCheckCongKhaiPA = Utils.getGlobal(nGlobalKeys.showCheckCongKhaiPA, false)
        this.isPolicy = Utils.getGlobal(nGlobalKeys.isPolicy, false) // g???i ph???n ??nh kh??ng c???n ????ng nh???p
        //----Code nh???p n???i d???ng Voices
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
            paKhan: MucDo == 3, //3 l?? PA Kh???n, 0 l?? B??nh th?????ng
            enableThemDiaDiem: false,
            findLocation: false,
            locationPermisstion: false,
            ListFileDinhKemDelete: [],
            ListFileDinhKemNew: [],
            ListHinhAnh,
            lstMucDoNguyCo: [],
            selectNguyCo: { IdChuyenMuc: 59, TenChuyenMuc: 'C???p 1 - Nguy c?? th???p' },
            // G???i ph???n ??nh kh??ng c???n ????ng nh???p
            NameNoLogin,
            PhoneNoLogin,
            dataTypeForm: '',
            isLoading: false,
            IdChuyenMuc,
            ChuyenMuc,
            paCongKhai: CongKhai && CongKhai == true ? true : false,

            lstLinhVuc: [],
            selectedLinhVuc: { IdLinhVuc: IdLinhVuc || -1, LinhVuc: LinhVuc || 'Kh??ng c?? d??? li???u' },
            lstChuyenMuc: [],
            selectedChuyenMuc: { IdChuyenMuc: IdChuyenMuc || -1, TenChuyenMuc: ChuyenMuc || 'Kh??ng c?? d??? li???u' },
            lstDonVi: [],
            selectedDonVi: { MaPX: IdBoPhan || -1, TenPhuongXa: TenPhuongXa || 'Kh??ng c?? d??? li???u' },
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
                selectNguyCo: res.data && res.data.length > 0 ? res.data[0] : { IdChuyenMuc: 59, TenChuyenMuc: 'C???p 1 - Nguy c?? th???p' }
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
                selectedDonVi: this.state.IdBoPhan ? { MaPX: this.state.IdBoPhan, TenPhuongXa: this.state.TenPhuongXa } : res.data && res.data.length > 0 ? res.data[0] : { MaPX: -1, TenPhuongXa: 'Kh??ng c?? d??? li???u' }
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
                    res.data && res.data.length > 0 ? res.data[0] : { IdLinhVuc: -1, LinhVuc: 'Kh??ng c?? d??? li???u' }
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
                    : res.data && res.data.length > 0 ? res.data[0] : { IdChuyenMuc: -1, TenChuyenMuc: 'Kh??ng c?? d??? li???u' }
            })
        } else {
            this.setState({ lstChuyenMuc: [] })
        }
    }

    onSpeechError = async (e) => { // s??? ki???n khi kh??ng thu ??m ???????c gi???ng n??i
        const result = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
        if (e.error.message === '9/Insufficient permissions' && result === 'granted') { // Tr?????ng h???p quy???n mircophone b??? t???t d?????i app Google
            Utils.showMsgBoxYesNo(this, 'Th??ng b??o', 'B???n c???n c???p quy???n nh???n d???ng gi???ng n??i Google ????? s??? d???ng ch???c n??ng n??y.', '?????n c??i ?????t', 'Xem l???i', () => { OpenSetting.openSetting('com.google.android.googlequicksearchbox') });
        }
    }

    onSpeechEndHandler = (e) => { // s??? ki???n l???ng nghe khi  ng???ng n??i
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

    onSpeechResultsHandler = (e) => { // s??? ki???n l???ng nghe khi ng???ng n??i v?? xu???t ra d??? li???u
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

    //X??? l?? nhi???u tr?????ng h???p lo???i g???i ph???n ??nh
    handleTypeForm = async () => {
        let typeForm = 0 // x??? l?? type form mac dinh 0 la g???i ph???n ??nh hi???n tr?????ng
        if (this.isModalGuiPA) {
            typeForm = this.isModalGuiPA
        }
        // alert(typeForm)
        //M???c ?????nh form g???i ph???n ??nh
        let dataType = {
            Warning: 'Vui l??ng nh???p n???i dung ph???n ??nh',
            BodyPost: [],
            ActionsSend: () => Utils.goscreen(this, 'sc_CaNhan'),
            PlaceholderNoiDung: 'Nh???p n???i dung ph???n ??nh...',
            TextLocation: 'Ch???n ?????a ??i???m ' + Utils.getGlobal(nGlobalKeys.TieuDe, '').toString().toLowerCase(),
            HeaderTitle: 'G???i ' + Utils.getGlobal(nGlobalKeys.TieuDe, '').toString().toLowerCase(),
            KeyRenderMore: -1,
            LabelNoiDung: `N???i dung ${Utils.getGlobal(nGlobalKeys.TieuDe, '').toString().toLowerCase()}`,
            TextTuDong: 'T??? ?????ng l???y v??? tr?? hi???n t???i m???i khi t???o ph???n ??nh',
            textButton: 'ph???n ??nh'
        }
        switch (typeForm) {
            // case 102:
            //     dataType = {
            //         Warning: 'Vui l??ng nh???p n???i dung y??u c???u h??? tr???',
            //         BodyPost: [
            //             {
            //                 Name: '',
            //                 Key: 'TypeReference',
            //                 Val: 102,
            //                 CheckNull: false, // c?? check alert kh??ng
            //                 IsState: false // c?? l???y gi?? tr??? state hay kh??ng hay truy???n c???ng Key,Val
            //             },
            //             {
            //                 Name: 'Lo???i h??? tr???',
            //                 Key: 'NguonPA',
            //                 Val: this.state.NguonPA,
            //                 CheckNull: true,
            //                 IsState: true
            //             }],
            //         ActionsSend: () => Utils.showMsgBoxOK(this, 'Th??ng b??o', 'G???i y??u c???u h??? tr??? t??i anh sinh x?? h???i th??nh c??ng', 'Ch???p nh???n', () => Utils.goscreen(this, 'tab_AnhSinhCaNhan')),
            //         PlaceholderNoiDung: 'Nh???p n???i dung y??u c???u h??? tr???',
            //         TextLocation: '?????a ch???',
            //         HeaderTitle: 'An sinh x?? h???i',
            //         KeyRenderMore: 102,
            //         LabelNoiDung: `N???i dung y??u c???u h??? tr???`,
            //         TextTuDong: 'T??? ?????ng l???y v??? tr?? hi???n t???o y??u c???u h??? tr???'
            //     }
            //     break;
            case 1000:
                dataType = {
                    Warning: 'Vui l??ng nh???p n???i dung Ph???n ??nh d???ch b???nh',
                    BodyPost: this.isGuiPADichBenhMDo == 'false' ? [{
                        Name: '',
                        Key: 'Dich',
                        Val: true,
                        CheckNull: false,
                        IsState: false
                    }] : [],
                    ActionsSend: () => Utils.showMsgBoxOK(this, 'Th??ng b??o', 'G???i ph???n ??nh d???ch b???nh th??nh c??ng', 'Ch???p nh???n', () => Utils.goback(this)),
                    PlaceholderNoiDung: 'Nh???p n???i dung ph???n ??nh d???ch b???nh',
                    TextLocation: 'V??? tr?? ph???n ??nh d???ch b???nh',
                    HeaderTitle: 'G???i ph???n ??nh d???ch b???nh',
                    KeyRenderMore: 1000,
                    LabelNoiDung: 'N???i dung ph???n ??nh d???ch b???nh',
                    TextTuDong: 'T??? ?????ng l???y v??? tr?? hi???n t???i m???i khi t???o ph???n ??nh',
                    textButton: 'ph???n ??nh d???ch b???nh'
                }
                break;
            case 101:
                dataType = {
                    Warning: 'Vui l??ng nh???p n???i dung g??p ??',
                    BodyPost: [{
                        Name: '',
                        Key: 'TypeReference',
                        Val: 101,
                        CheckNull: false, // c?? check alert kh??ng
                        IsState: false // c?? l???y gi?? tr??? state hay kh??ng hay truy???n c???ng Key,Val
                    }],
                    ActionsSend: () => Utils.showMsgBoxOK(this, 'Th??ng b??o', 'G???i g??p ?? d???ch v??? c??ng th??nh c??ng', 'Ch???p nh???n', () => Utils.goback(this)),
                    PlaceholderNoiDung: 'Nh???p n???i dung g??p ?? d???ch v??? c??ng',
                    TextLocation: 'V??? tr?? g??p ?? d???ch v??? c??ng',
                    HeaderTitle: 'G???i g??p ?? d???ch v??? c??ng',
                    KeyRenderMore: 101,
                    LabelNoiDung: `N???i dung g??p ?? d???ch v??? c??ng`,
                    TextTuDong: 'T??? ?????ng l???y v??? tr?? hi???n t???i m???i khi t???o g??p ??',
                    textButton: 'g??p ?? d???ch v??? c??ng'
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
        // Hi???n th??? s??t v???i th ???? ????ng nh???p
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
                title: 'T??? ?????ng l???y v??? tr??',
                message: 'B???n c?? mu???n l??u ?????ng l???y th??ng tin v??? tr?? hi???n t???i ????? g???i k??m ph???n ??nh?\n' +
                    '????? t??? ?????ng l???y v??? tr?? th?? b???n c???n c???p quy???n truy c???p v??? tri cho ???ng d???ng.',
                buttonNegative: '????? sau',
                buttonPositive: 'C???p quy???n'
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
                        Utils.showMsgBoxYesNo(this, 'D???ch v??? v??? tr?? b??? t???t', configHome.TenAppHome + ' c???n truy c???p v??? tr?? c???a b???n. H??y b???t D???ch v??? v??? tr?? trong ph???n c??i ?????t ??i???n tho???i c???a b???n.',
                            '?????n c??i ?????t', 'Kh??ng, c???m ??n',
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
                            Utils.showMsgBoxYesNo(this, 'D???ch v??? v??? tr?? b??? t???t',
                                '???ng d???ng c???n truy c???p v??? tr?? c???a b???n. H??y b???t d???ch v??? v??? tr?? trong ph???n c??i ?????t ??i???n tho???i c???a b???n.',
                                '?????n c??i ?????t', 'Kh??ng, c???m ??n',
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

            //--T??? ?????ng l???y vi tr?? l???n ?????u h???i IOS, Android check l??m sau
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
        // Utils.nlog("Nguy??n list nh??p", ListFileDinhKemNew)

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
            text: 'Ch???nh s???a',
            onPress: () => this.onRealTime()
        } : null;
        let cancelable = {
            cancelable: true,
            onDismiss: () => this.onRealTime()
        };

        if (idDraft > 0) {
            Alert.alert(
                'Ch???nh s???a nh??p',
                'B???n ??ang th???c hi???n ch???nh s???a b???n nh??p ph???n ??nh. ' +
                'B???n c?? mu???n l??u l???i n???i dung ???? ch???nh s???a kh??ng?',
                [
                    {
                        text: 'L??u',//.toUpperCase(), 
                        onPress: () => this.handleUpdateDraft(),
                        //style: 'default'
                    },
                    {
                        text: 'B??? qua',
                        onPress: () => { this.onClearRealTime(); Utils.goback(this); },
                        // style: 'cancel',
                    },
                    {
                        text: 'X??a nh??p',
                        onPress: () => this.handleRemoveDraft(),
                        //style: 'cancel',
                    },
                    Editing
                ],
                cancelable
            );
        } else if (noiDungGui.length > 0 || ListFileDinhKemNew.length > 0) {
            Alert.alert(
                'L??u nh??p',
                'N???i dung ph???n ??nh s??? m???t sau khi b???n tho??t. ' +
                'B???n c?? mu???n l??u nh??p ph???n ??nh ????? g???i sau kh??ng?',
                [
                    {
                        text: 'L??u nh??p',
                        onPress: () => this.handleAddDraft(),
                    },
                    {
                        text: 'Tho??t',
                        onPress: () => { this.onClearRealTime(); Utils.goback(this); },
                    },
                    {
                        text: 'L??m m???i',
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
            // Utils.nlog('--l???i khi chon media');
        }
        else {
            //--d??? li???u media tr??? v??? l?? 1 item or 1 m???ng item
            //--X??? l?? d??? li???u trong ????y-----
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
                multi: true,// ch???n 1 or nhi???u item
                response: this.response, // callback gi?? tr??? tr??? v??? khi c?? ch???n item
                limitCheck: limitCheck, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
                groupTypes: 'All',
            };
            Utils.goscreen(this, 'Modal_MediaPicker', options);
        } else {
            Utils.showMsgBoxOK(this, '', 'Ch??? ???????c g???i t???i ??a 8 h??nh ???nh!');
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

        var diaDiem = '??ang l???y d??? li???u v??? tr?? hi???n t???i';
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
            'Cung c???p th??ng tin c?? nh??n',
            'Vui l??ng ????ng nh???p ????? cung c???p th??ng tin c?? nh??n c???a b???n g???i k??m ' +
            'ph???n ??nh. ????n v??? x??? l?? c?? th??? li??n h??? ????? y??u c???u cung c???p th??m th??ng tin ' +
            'n???u c???n. Ngo??i ra ????ng nh???p c??ng gi??p b???n c?? th??? theo d??i ???????c k???t qu??? x??? l?? ph???n ??nh.',
            '????ng nh???p', 'Quay l???i', () => {
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
        console.log("gia tr??? time b???t ?????u", moment(new Date()).format('HH:mm:ss'))
        Utils.nlog("List image n??:", this.state.ListFileDinhKemNew)
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
                Toast.show('Vui l??ng nh???p h??? v?? t??n', Toast.LONG);
                return;
            }
            if (!PhoneNoLogin || PhoneNoLogin.length < 10) {
                Toast.show('Vui l??ng nh???p s??? ??i???n tho???i ho???c s??? ??i???n tho???i kh??ng h???p l???', Toast.LONG);
                return;
            }
        }

        if (this.chooseBoPhanLinhVucChuyenMuc) {
            if (this.state.selectedDonVi?.MaPX == -1 && this.state.lstDonVi.length > 0) {
                Toast.show('Vui l??ng ch???n ph?????ng / x??', Toast.LONG);
                return;
            }
            if (this.state.selectedLinhVuc?.IdLinhVuc == -1 && this.state.lstLinhVuc.length > 0) {
                Toast.show('Vui l??ng ch???n l??nh v???c', Toast.LONG);
                return;
            }
            if (this.state.selectedChuyenMuc?.IdChuyenMuc == -1 && this.state.lstChuyenMuc.length > 0) {
                Toast.show('Vui l??ng ch???n chuy??n m???c', Toast.LONG);
                return;
            }
        }

        if (!noiDungGui && this.isGuiPADichBenhMDo == 'false') {
            // Toast.show('Vui l??ng nh???p n???i dung ' + Utils.getGlobal(nGlobalKeys.TieuDe).toLowerCase(), Toast.LONG);
            Toast.show(dataTypeForm?.Warning ? dataTypeForm?.Warning : '', Toast.LONG);
            return;
        }
        if (this.isEdit == 1) {
            if (this.state.ListHinhAnh.length == 0 && appConfig.isImage) {
                Toast.show('Vui l??ng ch???n h??nh ???nh/ video/ file ????nh k??m ????? ch???nh s???a ph???n ??nh', Toast.LONG);
                return;
            }
        } else {
            if (ListFileDinhKemNew.length == 0 && appConfig.isImage) {
                Toast.show('Vui l??ng ch???n h??nh ???nh/ video/ file ????nh k??m ????? g???i ph???n ??nh', Toast.LONG);
                return;
            }
        }
        if (!diaDiem) {
            Toast.show('Vui l??ng ch???n v??? tr?? ph???n ??nh', Toast.LONG);
            return;
        }
        if (dataTypeForm?.BodyPost?.length > 0) {
            for (const item of dataTypeForm?.BodyPost) {
                if (item.CheckNull && !this.state[item?.Key]) {
                    Toast.show('Vui l??ng ch???n/nh???p ' + item.Name.toLowerCase(), Toast.LONG);
                    return
                }
            }
        }
        this.enableLoading(true);
        const DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
        let dem = 0;
        if (IdPA > 0) {
            let dataBoDy = new FormData();
            //duy???t h??nh
            for (let index = 0; index < ListFileDinhKemNew.length; index++) {
                let item = ListFileDinhKemNew[index];
                if (!item.isOld) {
                    dem++;
                    // console.log("gia tr??? time b???t ?????u----------------", item);
                    let file = `File${index == 0 ? '' : index} `;
                    if (item.type == 2) {//lo???i video
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
                    else if (item.type == 3) {//lo???i file
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
            //Tr?????ng h???p kh??ng login c?? th??m c??c th??ng tin sau
            if (this.sendOpinionNoLogin && this.props.auth.tokenCD.length < 3) {
                dataBoDy.append('DevicesToken', DevicesToken)
                dataBoDy.append('HoTen', NameNoLogin)
                dataBoDy.append('PhoneNumber', PhoneNoLogin)
            }
            //Chinh Sua Phan Anh
            let NoiDungDichBenh = ChuyenMuc ? ChuyenMuc : selectNguyCo?.TenChuyenMuc;
            Utils.nlog('Gia tri noi dung gui PhanAnh', NoiDungDichBenh)
            dataBoDy.append("NoiDung", this.isGuiPADichBenhMDo == 'true' && IdChuyenMuc >= 59 ? `Ph???n ??nh d???ch b???nh ${NoiDungDichBenh} ` : noiDungGui)
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
            //X??? l?? m???i theo lo???i form
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
            Utils.nlog("gia tr??? time b???t ?????u g???i ----------------------------------", moment(new Date()).format('HH:mm:ss'))
            await apis.ApiUpLoad.EditPA_FormData(dataBoDy).then(
                async (res) => {
                    dem = 0;
                    Utils.nlog("gia tr??? time ho??n th??nh ----------------------------------", moment(new Date()).format('HH:mm:ss'))
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
                        let message = `G???i th???t b???i\n${error && error.message ? error.message : "B???n h??y th??? l???i"}`
                        Utils.showMsgBoxOK(this, "Th??ng b??o", message, "X??c nh???n");
                    }
                }
            );


        } else {
            let dataBoDy = new FormData();

            // Utils.nlog("gi?? tr??? lish h??nh ???nh", ListHinhAnh);
            let dem = 0
            //duy???t h??nh
            for (let index = 0; index < ListFileDinhKemNew.length; index++) {
                let item = ListFileDinhKemNew[index];
                Utils.nlog("Log ra item n??!!", item)
                let file = `File${index == 0 ? '' : index} `;
                dem++
                if (item.type == 2) {
                    if (Platform.OS == 'ios') {
                        const dest = `${RNFS.TemporaryDirectoryPath} ${Math.random().toString(36).substring(7)}.mp4`;
                        let uriReturn = await RNFS.copyAssetsVideoIOS(item.uri, dest);
                        await RNCompress.compressVideo(uriReturn, 'medium').then(uri => {
                            Utils.nlog("uri m???i nhe", uri);
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
            let NoiDungDichBenh = "Ph???n ??nh d???ch b???nh " + selectNguyCo?.TenChuyenMuc;
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
            //X??? l?? m???i theo lo???i form
            if (dataTypeForm?.BodyPost?.length > 0) {
                dataTypeForm?.BodyPost?.forEach(e => {
                    if (e?.IsState) {
                        dataBoDy.append(e?.Key, this.state[e?.Key])
                    } else {
                        dataBoDy.append(e?.Key, e?.Val)
                    }

                });
            }
            //Tr?????ng h???p kh??ng login c?? th??m c??c th??ng tin sau
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
            Utils.nlog("gia tr??? time b???t ?????u g???i ----------------------------------", moment(new Date()).format('HH:mm:ss'))
            Utils.nlog("K??t qua ho??n tahnh ??n:", dataBoDy)
            await apis.ApiUpLoad.GuiPA_FormData(dataBoDy).then(
                async (res) => {
                    Utils.nlog("gia tr??? time ho??n th??nh ----------------------------------", moment(new Date()).format('HH:mm:ss'), res)
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
                        let message = `G???i th???t b???i\n${error && error.message ? error.message : "B???n h??y th??? l???i"}`
                        Utils.showMsgBoxOK(this, "Th??ng b??o", message, "X??c nh???n");
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
            title: 'Danh s??ch m???c ????? nguy c??',
        })
    }

    ChooseBoPhan = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectBottom', {
            callback: (val) => this.setState({ selectedDonVi: val },
                Utils.nlog('Gia tri don vi', val)),
            item: this.state.selectedDonVi,
            AllThaoTac: this.state.lstDonVi, ViewItem: item => this._viewItem(item, 'TenPhuongXa'),
            title: 'Danh s??ch ph?????ng x??',
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
            title: 'Danh s??ch l??nh v???c',
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
            title: 'Danh s??ch chuy??n m???c',
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
            <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>{`Ch???n ph?????ng/x??`}<Text style={{ color: colors.redStar }}>{`*`}</Text></Text>
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
            <Text style={{ fontWeight: 'bold', marginTop: 10, marginBottom: 10 }}>{`Ch???n l??nh v???c`}<Text style={{ color: colors.redStar }}>{`*`}</Text></Text>
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
            <Text style={{ fontWeight: 'bold', marginTop: 10, marginBottom: 10 }}>{`Ch???n chuy??n m???c`}<Text style={{ color: colors.redStar }}>{`*`}</Text></Text>
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
        let txtThemViTri = booleanViTri ? dataTypeForm?.TextLocation : 'Ch???n ?????a ??i???m ' + Utils.getGlobal(nGlobalKeys.TieuDe).toLowerCase();
        let txtTuDong = dataTypeForm?.TextTuDong
        // let headertitle = 'G???i ' + Utils.getGlobal(nGlobalKeys.TieuDe).toLowerCase();
        let headertitle = dataTypeForm?.HeaderTitle
        let txtNhapViTri = diaDiem.length == 0 ? 'Ch???n v??? tr??' : 'Nh???p v??? tr??';
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
                                    {/* {Th??nh ph???n hi???n th??? khi g???i kh??ng c?? login} */}
                                    {
                                        this.sendOpinionNoLogin ?
                                            tokenCD ? null :
                                                <>
                                                    <Text style={styles.txtNameNoLogin}>{'H??? v?? t??n'}</Text>
                                                    <TextInput
                                                        placeholder={'Nh???p h??? t??n'}
                                                        style={styles.inputHoTen}
                                                        value={NameNoLogin}
                                                        onChangeText={this.onChangeNameNoLogin}
                                                        editable={this.sendOpinionNoLogin && tokenCD.length > 0 || this.isEdit ? false : true}
                                                    />
                                                    <Text style={styles.txtNameNoLogin}>{'S??? ??i???n tho???i'}</Text>
                                                    <TextInput
                                                        placeholder={'Nh???p s??? ??i???n tho???i'}
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
                                            <Text style={styles.txtNameNoLogin}>{'S??? ??i???n tho???i'}</Text>
                                            <TextInput
                                                placeholder={'Nh???p s??? ??i???n tho???i'}
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
                                                <Text style={{ fontWeight: 'bold', marginTop: 10, marginBottom: 10 }}>{`M???c ????? nguy c??`}</Text>
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

                                                <Text style={{ marginTop: 5, fontSize: reText(15), textAlign: 'center' }} >{'???n gi??? ????? nh???p n???i dung b???ng gi???ng n??i'}</Text>
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
                                                            {Utils.getGlobal(nGlobalKeys.TieuDe, '') + ' '} <Text style={{ color: colors.redStar }}>KH???N</Text>
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
                                                            {'C??ng khai ph???n ??nh'}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            }
                                            {paCongKhai && <Text style={{ marginTop: 10, fontStyle: 'italic', fontWeight: 'bold', color: colors.greenButton, textAlign: 'justify' }}>{'K???t qu??? x??? l?? s??? c??ng khai tr??n ???ng d???ng v?? c???ng th??ng tin'}</Text>}
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
                                                    {'D???ng'}
                                                </Text>
                                            </TouchableOpacity> : null}
                                            {diaDiem.length == 0 ?
                                                <BtnViTri
                                                    onPress={this._hienTai}
                                                    source={Images.icHere}
                                                    text={'Hi???n t???i'} /> : null}
                                            {diaDiem.length == 0 ?
                                                <BtnViTri
                                                    onPress={this.onPressMaps}
                                                    source={Images.icBanDo}
                                                    text={'B???n ?????'} />
                                                : null}
                                        </View>
                                    </View>
                                ) : null}
                            </View>
                            <Text style={{ fontWeight: 'bold', marginHorizontal: 10, marginTop: 15 }}>H??nh ???nh, Video, File ????nh k??m</Text>
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
                                Utils.nlog("Data list image m???", data)
                                this.setState({ ListFileDinhKemNew: data })
                            }}
                            onUpdateDataOld={(data) => {
                                this.setState({ ListHinhAnh: data })
                            }}
                            isPickOne={true}
                        >
                        </ImagePickerNew>
                        <ButtonCom
                            text={`${IdPA > 0 ? 'C???p nh???t' : 'G???i'} ${dataTypeForm?.textButton}`}
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
