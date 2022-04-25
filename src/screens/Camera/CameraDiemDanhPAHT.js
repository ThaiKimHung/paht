
//******CHÚ Ý ********/
//Xem file Note_FixCAM_IosAndroid.js và kiểm tra trước khi build.
//********************/

import React, { PureComponent } from 'react';
import {
    ActivityIndicator, Alert, BackHandler,
    Dimensions,
    Image, Keyboard, Linking, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import Geolocation from 'react-native-geolocation-service';
import { openSettings } from 'react-native-permissions';
// import Tts from 'react-native-tts';
import AppCodeConfig from '../../../app/AppCodeConfig';
// let res = await apis.ApiApp.getAddressGG(latitude, longitude);
// import { getAddressGG, updateStatusFaceID, updateStatusFaceID_EM } from '../../../apis/apiDuLieuChamCong';
// import { CheckInOut_Location, CheckInOut_LocationCCNV, CheckInOut_LocationMCC, CheckLocation, WriteLog } from '../../../apis/apiUser';
import { appConfig } from '../../../app/Config';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
// import { RootLang } from '../../../app/data/locales';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { nkey } from '../../../app/keys/keyStore';
import Utils from '../../../app/Utils';
import ButtonCom from '../../../components/Button/ButtonCom';
import InputLogin from '../../../components/ComponentApps/InputLogin';
import { colors } from '../../../styles';
import { reSize } from '../../../styles/size';
import { nstyles, paddingTopMul, Width } from '../../../styles/styles';
import apis from '../../apis';
import apiAI from '../../apis/apiAIPAHT';
// import UtilsApp from '../../../app/UtilsApp';
import { Images } from '../../images';



const Permissions = require('react-native-permissions');
const { width, height } = Dimensions.get('screen');
const ASPECT_RATIO = width / height;
const LONGITUDE = 106.6228077;
const LATITUDE = 10.8123274;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const TIME_FRAME = Platform.OS == 'ios' ? 800 : 800;
const TIMEOUT_SEND = 7;
const MODE_TEST_DEV = false;

//--StatusFace: SMILE, CLOSE_EYES, TILT_LEFT, TILT_RIGHT, ROTATE_LEFT, ROTATE_RIGHT

const stCamXacThuc = StyleSheet.create({
    contentInput: {
        backgroundColor: 'transparent'
    },
    contentBtn: {
        backgroundColor: colors.greenButton,
        paddingHorizontal: 3,
        paddingVertical: 15,
        borderRadius: 6,
        marginHorizontal: 2,
        minWidth: 50
    },
    txtBtnCode: {
        textAlign: 'center',
        width: '100%',
        color: colors.white,
        fontWeight: 'bold'
    }
});


class CameraDiemDanhPAHT extends PureComponent {
    constructor(props) {
        super(props)
        StatusFace = {
            "SMILE": 'CƯỜI',
            "NOSMILE": 'Không CƯỜI',
            "CLOSE_EYES": 'Chớp MẮT',
            "OPEN_EYES": 'Chớp MẮT',
            // "TILT_LEFT": 'Nghiêng đầu TRÁI',
            // "TILT_RIGHT": 'Nghiêng đầu PHẢI',
            "ROTATE_LEFT": 'Quay đầu qua TRÁI',
            "ROTATE_RIGHT": 'Quay đầu qua PHẢI'
        }
        //isMode 1: Xác thực 1 người | 2: Xác thực nhân viên 
        this.isMode = Utils.ngetParam(this, 'isMode', 1);
        this.callback = Utils.ngetParam(this, 'callback', () => { });
        // this.CapNhatLaiDuLieu = Utils.ngetParam(this, 'CapNhatLaiDuLieu', () => { })

        //---
        this.IdNV = Utils.getGlobal(nGlobalKeys.NumberPhone, '');
        console.log("=-=-this.IdNV", this.IdNV)
        this.IdCty = ROOTGlobal.IdTinh;
        this.codeDel = Utils.getGlobal(nGlobalKeys.codeAdminYTe, '');
        //----

        // this.allowRegister = Utils.getGlobal(nGlobalKeys.allowRegister, false);
        this.sessionCheck = Date.now() + '_' + this.IdNV;
        this.isAlert = false;
        this.granted = '';
        this.dataFaceTemp = {};
        this.statusFace = '';
        this.isTimeOutFace = false; // hết thời gian check mặt mà ko đc thì cho thử lại
        this.countProcessing = []; // biến tạm để check khi nào chạy send hết frame cuối
        this.resultCount = 0; // biến kết quả để kiểm trả 2 hàm chạy 2 luồng.
        //--
        this.isCheckLocal = true; // test
        this.latlongLocation = Utils.ngetParam(this, 'lat', '10.0'); //Hiện tại chưa cần truyền lat, long này
        this.latlongAddress = Utils.ngetParam(this, 'long', '10.0');
        this.latlongitude = '';
        //--
        this.isLoadApiLocation = false;
        this.onRunTimer = false;
        this.isHaveFace = false;
        this.isLoadHaveFace = 0;
        //--Gửi fame liên tục ko cần biết có Face hay ko. Sử dụng cho IOS do cam sau ko Hoạt động. (Hiện tại đã hoạt động nên = false)
        this.noFaceDetected = false //this.isMode == 2 && Platform.OS == 'ios' ? true : false;
        this.firstLoad = false;
        this.regisType = ""; //register_image - register_image
        this.frameNow = "";
        //--
        this.Rules_CheckCapcha = Utils.getGlobal("nGlobalKeys.isCheckCapcha", true); //*
        this.isReCapcha = false;
        this.arrSaveCapchaTemp = [];
        //--
        this.state = {
            User: {
                HoTen: '',
                Image: undefined,
                MaNV: ''
            },
            latitude: LATITUDE,
            longitude: LONGITUDE,
            cameraType: this.isMode == 2 ? true : false, // Nếu true - back , false - front 
            mirrorMode: true,
            delRegister: false,
            textGoiY: 'Vui lòng ĐẶT khuôn mặt trong khung XANH',
            isCheckFace: 0, //-1: trang thai dk, -2: trang thai cham cong, 0: tắt, 1: đăng ký, 2: check xác thực
            isLoad: false,
            isShowRefreshLocation: false,
            showLocation: false,
            status: "",
            PassCode: "",
            ShowPassCode: true,
            bachdeptrai: true // này không quan trọng nhưng đừng xoá 

        }

    }

    async componentDidMount() {
        Keyboard.dismiss;
        await Permissions.check('ios.permission.CAMERA')
            .then(res => {
                if (res == 'blocked')
                    return this.onGoSetingCamera()
                else null
            });
        // alert(Object.keys(StatusFace)[0])

        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );

        if (!this.IdNV || this.IdNV == "") {
            Utils.showMsgBoxOK(this, "Thông báo", "Vui lòng đăng nhập để tiếp tục", "Xác nhận", () => Utils.goback(this), false);
            return;
        }
        this.IdNV = parseInt(this.IdNV);

        //--Chưa set vị trí nên bỏ khúc này 
        // Platform.OS == 'ios' ? await Permissions.request('ios.permission.LOCATION_WHEN_IN_USE').then(async res => {
        //     if (res == "blocked") {
        //         this.onGoSeting()
        //     }
        //     else this.onGetFrame(null)

        // }) : this.onGetFrame(null)
        this.onGetFrame(null);

        // this.kiemTraQuyenViTri();

        // await this.onGetFrame(null)

        // Tts.setDefaultLanguage('en-US');

    }

    backAction = () => {

    };

    componentWillUnmount() {
        this.backHandler.remove();
        this.onClearTimer();
    }


    onGoSetingCamera = () => {
        Utils.showMsgBoxYesNo(this, 'Xin quyền truy cập máy ảnh', 'Chúng tôi cần bạn cho phép để sử dụng máy ảnh của bạn',
            'Chuyển tới cài đặt', 'Không, cảm ơn',
            async () => {
                if (Platform.OS == 'ios') {
                    Linking.openURL('app-settings:').catch((err) => {
                        Utils.nlog('app-settings:', err);
                    });
                }
                else
                    openSettings();
            })
    }


    onSpeaker = (text) => {
        if (!text || text == '' || this.isMode == 1)
            return;
        // Tts.getInitStatus().then(async () => {
        //     Tts.setDucking(true);
        //     Tts.speak(text, {
        //         rate: 0.58 //IOS only
        //     });
        // });
    }

    onClearTimer = () => {
        clearInterval(this.camtake);
        this.onRunTimer = false;
    }

    onGetFrame = async (isRegis = false) => {
        if (this.isLoadHaveFace == 0 && isRegis == false && !this.noFaceDetected || this.frameNow == "" && isRegis != null) {
            return;
        }
        if (this.regisType == "register_image" && this.countProcessing.length != 0 && isRegis)
            return;
        if (MODE_TEST_DEV) {
            this.setState({ imgTemp: "data:image/png;base64," + this.frameNow });
        }
        this.isLoadHaveFace = 0;
        if (this.countProcessing.length + 1 >= TIMEOUT_SEND && !isRegis)
            this.isTimeOutFace = true;
        if (this.isTimeOutFace) {
            this.onClearTimer();
        }
        if (this.camera) {
            // const options = { quality: 0.16, base64: false, mirrorImage: true };
            if (isRegis != null && this.state.status == 'not_existed') { //--xử lý get Frame IMG để gửi đi
                //--Xử lý send Frame face các lần sau.

                this.countProcessing.push(1);
                let indexTemp = this.countProcessing.length;
                const { uri } = await this.camera.takePictureAsync({
                    base64: true,
                    quality: 0.5,
                    doNotSave: true,
                    orientation: "portrait",
                })
                this.frameNow = "data:image/png;base64," + uri
                return;
            }
            if (isRegis != null && this.state.status != 'not_existed') {
                this.countProcessing.push(1);
                let indexTemp = this.countProcessing.length;
                this.onSendAPI_Face(isRegis, this.frameNow, indexTemp - 1);
                //----
                return;
            }

            //--Xử lý check lần đầu xem đã ĐK chưa
            this.onSendAPI_Face(isRegis, '');
        }
    };

    reCheckRegister = async (timeout = 10) => {
        this.sessionCheck = Date.now() + '_' + this.IdNV;
        let resFace = {};
        //--api check or SendSocket
        resFace = await apiAI.sendFrameForm(this.sessionCheck, "",
            (this.isMode == 1 ? this.IdNV : -1), this.IdCty, 'recognizer');
        if (resFace < 0 || resFace.status == "0")
            return 0;

        if (resFace.status == "1" && resFace.data.status == "on-register_image") {
            await Utils.PendingPromise(1000);
            if (timeout == 0)
                return -1;
            return this.reCheckRegister(timeout - 1);
        }
        if (resFace.status == "1" && (resFace.data.status == "not_existed"
            || resFace.data.status == "not_existed_company"))
            return 0;
        return 1;
    }

    onSendAPI_Face = async (isRegis, dataImg = "", indexProcessing = 0) => {
        let resFace = {};
        //--api check or SendSocket
        resFace = await apiAI.sendFrameForm(this.sessionCheck, dataImg,
            (this.isMode == 1 ? this.IdNV : -1), this.IdCty, (isRegis ? "register_image" : 'recognizer'));
        this.firstLoad = true;
        console.log("=-=-=onSendAPI_Face", resFace)
        if (this.countProcessing.length != 0)
            this.countProcessing[indexProcessing] = 0;

        try {
            Utils.nlog('FACE - OK:', resFace.data.status);
        } catch (error) {
        }

        if (resFace < 0 || resFace.status == "0") {
            // this.onClearTimer();
            if (this.isMode != 1 || !this.isRegis && this.state.isCheckFace == 2) {
                this.statusFace = 'Có lỗi xảy ra khi xác thực khuôn mặt';
                this.setState({ a: Date.now() });
            }
            else
                this.onResultCheck('CẢNH BÁO', 'Có lỗi xảy ra khi xác thực khuôn mặt', 'Thoát');
            return;
        }

        if (resFace.status == "1") {
            if (resFace.data.status == "received" && isRegis != null) {
                this.onResultCheck("", "");
                return;
            }
            this.onClearTimer();
            if (isRegis) { //--Đăng ký Face
                setTimeout(async () => {
                    switch (resFace.data.status) {
                        case "register_done":
                            this.setState({ status: '' })
                            if (this.isAlert)
                                break;
                            //----code
                            if (this.regisType == 'register_image') {
                                let isReCheckRegis = await this.reCheckRegister();
                                console.log("=-=-=isReCheckRegis", isReCheckRegis)
                                if (isReCheckRegis <= 0) {
                                    this.setState({ isCheckFace: -1 });
                                    // WriteLog('[DK]' + 'Try_again');
                                    if (isReCheckRegis == 0) {

                                        this.onResultCheck('Không thể nhận diện khuôn mặt này!',
                                            'Xin vui lòng gửi đăng ký lại!', 'OK', false, true);
                                        this.onGetFrame(null)
                                    }
                                    if (isReCheckRegis == -1) {
                                        this.onResultCheck('Cảnh báo',
                                            'Quá trình đăng ký đang được xử lý. Vui lòng đợi trong giây lát!', 'OK', false, true);
                                        this.onGetFrame(null)
                                    }
                                    setTimeout(() => {
                                        this.setState({ isCheckFace: -1 });
                                        this.frameNow = "";
                                        this.isHaveFace = false;
                                        this.isLoadHaveFace = 0;
                                    }, 500);
                                    return;
                                }
                                // WriteLog('[DK]' + 'OK');
                            }
                            this.isAlert = true;
                            // let kqDK = await this.updateDaDangKy(this.IdNV);
                            let kqDK = true
                            //--Xoa face AI khi update trang thai that bai
                            if (!kqDK) {
                                let kqDelFace = false;
                                kqDelFace = await apiAI.delRegisFace(this.IdNV, this.IdCty);
                                Utils.nlog('kqDelFace:', kqDelFace);
                                if (kqDelFace && kqDelFace.status == "1" && kqDelFace.data.status == "success")
                                    kqDelFace = true;
                                if (!kqDelFace)
                                    alert('Xoá đăng ký khuôn mặt thất bại');
                            }
                            //---
                            this.statusFace = (!kqDK) ? this.state.textGoiY : '';
                            if (kqDK) {
                                this.setState({ cameraType: !this.state.cameraType }, () => {
                                    setTimeout(() => {
                                        this.setState({ cameraType: !this.state.cameraType })
                                    }, 500);
                                })
                                this.setState({ isCheckFace: 0 });

                                this.onGetFrame(null)
                            } else {
                                this.setState({ isCheckFace: -1 });
                            }
                            break;
                        case "existed":
                            this.onResultCheck('Cảnh báo', 'Nhân viên này đã được đăng ký!');
                            break;
                    }
                }, this.regisType == 'register_image' ? 1500 : 200);
                return;
            }
            //--Check Face đã đăng ký chưa. Check lần đầu khi mở app
            if (isRegis == null) {
                this.statusFace = '[textGoiY]';
                var tempIsCheckRegis = true;
                if ((resFace.data.status == "not_existed" || resFace.data.status == "not_existed_company") && this.isMode == 1) {
                    if (tempIsCheckRegis) {
                        this.regisType = "register_image"; //register_image -or- register_image;
                        this.setState({
                            isCheckFace: -1,
                            textGoiY: "Vui lòng giữ thẳng khuôn mặt nhìn vào màn hình "
                        }, () => this.changeCameraType()); // chế độ đăng ký, ở PAHT Chế độ DK mặc định là cam sau.

                        if (resFace.data.status == "not_existed") {
                            this.setState({ status: "not_existed" })
                        }
                    }



                    return resFace.data.status

                }
                else {
                    //--Cập nhât JEEHR nếu đã ĐK AI lần đầu mở 
                    if (this.isMode == 1)
                        // this.updateDaDangKy(this.IdNV, true, true);
                        //----
                        this.setState({
                            isCheckFace: -2, textGoiY: 'Vui lòng ĐẶT khuôn mặt trong khung XANH',
                            delRegister: true
                        }, () => setTimeout(() => {
                            this.onChamCongFace();
                        }, 200)); // chế độ xác thực
                    if (Platform.OS == 'ios') {
                        // this.kiemTraQuyenViTri();
                    }
                    else
                        this.onTimer_Locations(1);
                }
                if (tempIsCheckRegis)
                    return;


            }
            //--Send frame kiểm tra xác thực
            switch (resFace.data.status) {
                case "recognizer_done":
                    if (this.isAlert || this.isCheckLocal)
                        break;

                    this.isReCapcha = true && this.Rules_CheckCapcha && this.isMode == 1; //--code phân quyền ở đây(nếu có)
                    this.resultCount++;
                    //+++++Xác thực AI và Xác thực FACE OK
                    this.onResultCheck("", "");
                    if (this.isMode == 1)
                        this.onCheckLocation(isRegis, dataImg, 1) // Check kết quả local bất đồng bộ 
                    //--
                    //+++++
                    break;
                default:
                    if (this.isMode == 1) {
                        this.statusFace = '[textGoiY]';
                        this.setState({ isCheckFace: -2 });
                    }
                    let textMsg = "";
                    if (resFace.data.status == "not_existed" || resFace.data.status == "not_existed_company") {
                        textMsg = 'Tài khoản này chưa đăng ký khuôn mặt xác thực';
                    }
                    if (resFace.data.status == "mask_detected")
                        textMsg = 'Không thể nhận diện khi bạn đeo khẩu trang.';
                    if (resFace.data.status == "cheat_detected")
                        textMsg = 'CẢNH BÁO: Phát hiện bạn đang gian lận khuôn mặt.';

                    if (textMsg != "")
                        this.onResultCheck('Cảnh báo', textMsg, 'OK', this.isMode == 1 ? true : false);
                    else
                        this.onResultCheck('Xác thực thất bại', 'Không thể nhận diện khuôn mặt này!', 'OK', false);
                    break;
            }
        }

    }

    updateDaDangKy = async (IdNV, isDK = true, isBackground = false) => {
        let res = {};

        res = await updateStatusFaceID(IdNV, isDK);
        if (isBackground) //Chế độ chạy ngầm
            return;
        Utils.nlog("updateStatusFaceID:", res);
        if (res < 0 || !res || res.status == 0) {
            this.onResultCheck('Cảnh báo',
                'Cập nhật trạng thái đăng ký thất bại', 'OK', true, true);
            return false;
        }
        if (res.status == 1) {
            if (isDK) {
                //--Cho xem lại ảnh đã Đăng Kỹ
                Utils.PendingPromise(500);
                let res2 = await apiAI.getFaceRegister(IdNV, Utils.getGlobal(nGlobalKeys.IDKH_VTS, 0));
                Utils.nlog('getFaceRegister', res2);
                this.dataMsgBox = {};
                if (res2 && res2.status == "1" && res2.data.frames.length != 0)
                    this.dataMsgBox.img = 'data:image/jpg;base64,' + res2.data.frames[0].face;
                else
                    this.dataMsgBox.img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Image_of_none.svg/1200px-Image_of_none.svg.png';
                //--------
                this.onResultCheck('Thông báo',
                    'Đăng ký khuôn mặt thành công', 'OK', true, true);
            }

            return true;
        }
    }

    onCheckCapcha = (keyCapcha, tempIndex, apiSaveChamCong = () => { }, limidCheck = 7) => {
        //Tối đa limidCheck: 7 = 3.5s
        if (limidCheck == 0) {
            //--code: Xác thực thất bại
            if (!this.isXT_OK)
                this.statusFace = 'Xác thực THẤT BẠI';
            this.isReCapcha = false;
            this.isTimeOutFace = true;
            this.isLoadApiLocation = false;
            this.countProcessing[tempIndex] = 0;
            this.setState({ a: Date.now() });
            setTimeout(() => {
                this.onRestartChamCong(true);
            }, 500);
            //--
            return;
        }

        setTimeout(async () => {
            //--Code Capcha
            let isChopMat = keyCapcha == 'CLOSE_EYES' || keyCapcha == 'OPEN_EYES';
            let isXACTHUC = isChopMat ? this.arrSaveCapchaTemp.includes('CLOSE_EYES') && this.arrSaveCapchaTemp.includes('OPEN_EYES')
                : this.arrSaveCapchaTemp.includes(keyCapcha);
            if (isXACTHUC) {
                this.isXT_OK = true;
                this.statusFace = 'Xác thực THÀNH CÔNG';
                this.isReCapcha = false;
                apiSaveChamCong();
            }
            //--end capcha--
            if (!this.isXT_OK)
                this.onCheckCapcha(keyCapcha, tempIndex, apiSaveChamCong, limidCheck - 1);
        }, 500);
    }

    onCheckLocation = async (isRegis, base64, mode = 1, IdNV_AI = -1) => {
        //--Code Capcha
        this.statusFace = 'Đã xác thực khuôn mặt...';
        let keyCapcha = "";
        if (this.isReCapcha) { //--Code Show random xác thực FACE
            while (true) {
                let tempRandom = Math.floor(Math.random() * Object.keys(StatusFace).length);
                keyCapcha = Object.keys(StatusFace)[tempRandom];
                if (!this.detectionFaceStatusNow.includes(keyCapcha))
                    break;
            }
            this.statusFace = 'Xác thực: Vui lòng ' + StatusFace[keyCapcha].toUpperCase();
        }

        //--
        this.setState({ isCheckFace: 0 });
        if (isRegis == false) { // Check kết quả local bất đồng bộ 
            //--impotant - Bắt đầu lưu API JeeHR
            this.isCheckLocal = true;
            this.countProcessing.push(1);
            let tempIndex = this.countProcessing.length - 1;
            this.isLoadApiLocation = true;
            //-----
            //--Khai báo để dùng chung
            let apiSaveChamCong = async () => {
                await this.onCheckLocal(base64, this.latlongLocation, tempIndex, IdNV_AI);
                this.isLoadApiLocation = false;
                this.setState({ a: Date.now() });
            }
            //--
            if (this.isReCapcha)
                this.onCheckCapcha(keyCapcha, tempIndex, apiSaveChamCong);
            else {
                apiSaveChamCong();
            }
        }

    }

    onRestartChamCong = (isXacThuc = false) => {
        if (this.isTimeOutFace && !this.countProcessing.includes(1) && this.countProcessing.length != 0 && this.resultCount < 3) {
            this.onClearTimer();
            this.statusFace = 'Xin vui lòng thử lại!';
            // if (!isXacThuc)
            //     WriteLog('[CC]' + 'Try_again');
            this.onSpeaker('Please try again');
            this.setState({ a: Date.now(), isCheckFace: this.isMode == 1 || this.noFaceDetected ? -2 : 2 });
            if (this.isMode != 1 && !this.noFaceDetected)
                setTimeout(() => {
                    this.onChamCongFace();
                }, 1800);
        }
    }

    onResultCheck = (title, msg, btnOK = 'OK', isBack = true, allwayShow = false) => {
        console.log("=-=-=this.resultCount", this.resultCount)
        console.log("=-=-=this", this.isAlert)
        if (title == "" && msg == "") {
            if (this.resultCount >= 3 && !this.isAlert) {
                console.log("=-=123123123", 213)
                this.isAlert = true;
                this.statusFace = '';
                if (this.noFaceDetected) {
                    this.statusFace = '...';
                    this.setState({ isCheckFace: -2 });
                }
                else
                    this.setState({ a: Date.now() });
                this.onSpeaker('OK Thank you');



                // this.onShowAlert((this.isMode == 1 ? '' : this.dataName + ': ') + 'Đã gửi xác thực',
                //     'Xác nhận', btnOK, this.isMode == 1 ? true : false);
            }

            this.onRestartChamCong();
            return;
        }

        if (!this.isAlert || allwayShow) {
            this.isAlert = true;
            if (title != "" && msg != "")
                this.onShowAlert(title, msg, btnOK, isBack);
        }
    }

    onShowAlert = (title, msg, btnOK = 'OK', isBack = true) => {
        Utils.showMsgBoxOK(this, title, msg, btnOK,
            () => {
                Utils.goback(this);
                // this.callback();
            })

        if (!isBack && this.isMode != 1 && !this.noFaceDetected)
            setTimeout(() => {
                this.onChamCongFace();
                if (this.isMode == 1)
                    Utils.goscreen(this, 'sc_ChamCongCamera', { isMode: 1 });
            }, 2200);
    }

    onSendFrame = async (isRegis = false) => {
        this.sessionCheck = Date.now() + '_' + this.IdNV;
        this.resultCount = 0;
        this.countProcessing = [];
        if (this.camera) {
            this.isAlert = false;
            this.isTimeOutFace = false;
            this.statusFace = '...';
            this.setState({ isCheckFace: isRegis ? 1 : 2, a: Date.now() }, () => {
                this.onGetFrame(isRegis);
                this.camtake = setInterval(() => this.onGetFrame(isRegis), TIME_FRAME);
            });
        }
    };
    onDangKyFace = () => {
        this.onSendFrame(true);
    };

    onChamCongFace = async () => {
        if (this.state.isCheckFace == 1 || this.state.isCheckFace == -1)
            return;
        if (this.onRunTimer && !this.countProcessing.includes(1) && this.countProcessing.length != 0)
            this.onRunTimer = false;
        if (this.onRunTimer)
            return;
        this.detectionFaceStatusNow = [];
        this.onClearTimer();
        this.onRunTimer = true;
        this.isCheckLocal = false;
        this.onSendFrame();
    };

    onTakePicture = async () => { // Chức năng để test tạm ko XOÁ
        if (MODE_TEST_DEV) {
            this.setState({ imgTemp: "data:image/png;base64," + this.frameNow });
        }
        //--or--
        // this.isLoadHaveFace = 1;
        // this.onGetFrame();
    };

    onCheckLocal = async (strBase64, stLocation, indexProcessing = -1, IdNV_AI = -1) => {
        // if (stLocation != '') {
        //     let res = {};
        //     if (this.isMode == 1)
        //         res = await CheckInOut_Location(strBase64, stLocation);
        //     // Utils.nlog("RESS API:", res);
        //     if (indexProcessing >= 0)
        //         this.countProcessing[indexProcessing] = 0;
        //     if (res.status == 1) {
        //         this.dataName = res.data;
        //         this.resultCount += 2;
        //         this.onResultCheck("", "");
        //     } else {
        //         this.onSpeaker('Please try again');
        //         this.onShowAlert((res.error && res.error.message ? res.error.message :
        //             RootLang.lang.scchamcong.guichamcongthatbai), "", RootLang.lang.scchamcong.dongy, this.isMode == 1 ? true : false)
        //     }
        // }

        this.resultCount += 2;
        this.onResultCheck("", "");
        //--NewCode PAHT
        Utils.goback(this);
        this.callback(strBase64); //Riêg TayNinh ko truyền base64: this.callback();
        //----

    }

    onTimer_Locations = (time = 0) => {
        if (time == 0 || this.granted != "")
            return;
        setTimeout(() => {
            if (this.granted != "")
                return;
            //--code xu ly
            // this.kiemTraQuyenViTri();
            //---------
            this.onTimer_Num(time - 1);
        }, 2000);
    }
    // bách
    isCheckLocation = async () => {
        // let res = await CheckLocation(this.latlongLocation, this.IdNV);
        // Utils.nlog('CheckLocation:', res, this.latlongLocation)

        // if (!res || res < 0)
        //     return true;
        // if (res.status == 1) {
        //     return res.data;
        // } else {
        //     try {
        //         Utils.showMsgBoxOK(this, RootLang.lang.thongbaochung.canhbao, res.error.message);
        //     } catch (error) {
        //         Utils.showMsgBoxOK(this, RootLang.lang.thongbaochung.canhbao, RootLang.lang.thongbaochung.loilaydulieu);
        //     }
        //     return res.data;
        // }
    }

    kiemTraQuyenViTri = async () => {
        this.setState({ isLoad: true, isShowRefreshLocation: true });
        Geolocation.setRNConfiguration({ skipPermissionRequests: true, authorizationLevel: 'whenInUse' });
        Geolocation.requestAuthorization();
        if (Platform.OS == 'android') {
            this.granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: 'Cung cấp vị trí',
                message: 'Để thực hiện xác thực vui lòng cung cấp vị trí hiện tại của bạn.',
                buttonPositive: 'OK'
            })
            if (this.granted == 'never_ask_again') {
                this.onBack_Logout(50);
                setTimeout(() => {
                    this.onGoSeting();
                }, 1100);
            }
            if (this.granted == PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(
                    async (position) => {
                        this.latlongLocation = `${position.coords.latitude}`;
                        this.latlongitude = `${position.coords.longitude}`;
                        let istempCheck = await this.isCheckLocation();
                        if (this.state.showLocation)
                            this.onShowLocation(true);
                        else
                            this.setState({ isLoad: false, isCheckLocation: istempCheck });
                    },
                    error => {
                        Utils.nlog('error Location:', error);
                        this.latlongLocation = '';
                        this.latlongitude = '';
                        this.setState({ isLoad: false });
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            } else {
                this.granted = 'off';
                this.latlongLocation = '';
                this.latlongitude = '';
            }
            // Utils.nlog('this.granted:', this.granted);
        }
        else {
            Geolocation.getCurrentPosition(
                async (position) => {
                    // Utils.nlog('geolocation-ios', JSON.stringify(position));
                    var { coords = {} } = position;
                    var { latitude, longitude } = coords;
                    if (!latitude || !longitude) {
                        this.onGoSeting();
                        this.latlongLocation = '';
                        this.latlongitude = '';
                    } else {
                        this.granted = 'granted';
                        this.latlongLocation = `${latitude}`;
                        this.latlongitude = `${longitude}`;
                        let istempCheck = await this.isCheckLocation();
                        if (this.state.showLocation)
                            this.onShowLocation(true);
                        else
                            this.setState({ isLoad: false, isCheckLocation: istempCheck });
                    }
                },
                (error) => {
                    this.onGoSeting();
                    Utils.nlog('error Location:', error);
                    this.latlongLocation = '';
                    this.latlongitude = '';
                    this.setState({ error: error.message, isLoad: false });
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
            );
        }
    }

    onGoSeting = () => {
        this.granted = 'off';
        Utils.showMsgBoxYesNo(this, 'Dịch vụ vị trí bị tắt', appConfig.TenAppHome + ' ' + 'cần truy cập vị trí của bạn. Hãy bật Dịch vụ vị trí trong phần cài đặt điện thoại của bạn.',
            'Chuyển tới cài đặt', 'Không, cảm ơn',
            () => {
                if (Platform.OS == 'ios') {
                    this.onBack_Logout(200);
                    Linking.openURL('app-settings:').catch((err) => {
                        Utils.nlog('app-settings:', err);
                    });
                }
                else
                    openSettings();
            });
    }

    changeCameraType() {
        if (this.state.cameraType === true) {
            // this.noFaceDetected = false;
            this.setState({
                cameraType: false,
                mirrorMode: true
            });
        } else {
            // this.noFaceDetected = Platform.OS == 'ios';
            this.setState({
                cameraType: true,
                mirrorMode: false
            });
        }
    }

    onCheckEndFace_Android = (valFace = {}, timeOut = 0, isTrue = false, isIOS = false) => {
        if (Platform.OS == 'android' || isIOS) {
            setTimeout(() => {
                if (valFace.origin.x == this.dataFaceTemp.origin.x && valFace.origin.y == this.dataFaceTemp.origin.y
                    && valFace.size.width == this.dataFaceTemp.size.width && valFace.size.height == this.dataFaceTemp.size.height &&
                    (this.isLoadHaveFace == 1 && isIOS || this.isLoadHaveFace == 0 && !isIOS)) {
                    this.isHaveFace = false;

                    if (!(this.isMode == 1 && this.statusFace == 'Xin vui lòng thử lại!') && !this.isReCapcha) {
                        this.statusFace = '...';
                    }
                    this.setState({ a: this.isLoadHaveFace + '_' + this.isHaveFace });

                    this.onTimer_Num(10);
                    //-----------
                    // ko XOÁ
                    // this.setState({
                    //     dataFace: {
                    //         origin: { x: 0, y: 0 }, size: { width: 0, height: 0 }
                    //     }
                    // });
                }
                else if (isTrue)
                    this.onTimer_Num(1);
            }, timeOut);
        }
    }

    onCheckFaceStatus = (dataFace = {}) => {
        let resultCheck = [];
        if (dataFace.smilingProbability > 0.55)
            resultCheck.push('SMILE');
        else
            resultCheck.push('NOSMILE');

        if (dataFace.rightEyeOpenProbability < 0.4 && dataFace.leftEyeOpenProbability < 0.4)
            resultCheck.push('CLOSE_EYES');
        else
            resultCheck.push('OPEN_EYES');

        //Tạm bỏ do ko có tác dụng trong check Ảnh
        // if (dataFace.rollAngle < - 15)
        //     resultCheck.push(StatusFace.TILT_LEFT);
        // if (dataFace.rollAngle > 15)
        //     resultCheck.push(StatusFace.TILT_RIGHT);

        if (dataFace.yawAngle < -20)
            resultCheck.push(Platform.OS == 'ios' ? 'ROTATE_LEFT' : 'ROTATE_RIGHT');
        if (dataFace.yawAngle > 20)
            resultCheck.push(Platform.OS == 'ios' ? 'ROTATE_RIGHT' : 'ROTATE_LEFT');
        return resultCheck;
    }

    checkFace_GanNhat_Xa = (arrFace = []) => {
        let indexMax = -1;
        let TempstatusSizeFaceDK = 0; //0: Chua xac dinh, -1: Quá xa, -2 Quá gần, 1: Đạt yêu cầu
        this.statusSizeFaceDK = 0;
        for (let i = 0; i < arrFace.length; i++) {
            const item = arrFace[i].bounds;
            let s1 = item.size.width * item.size.height;
            let hsCamBack = 0.2; //He so Cam sau
            //--Xử lý FACE: Không lấy mặt quá XA
            if (Platform.OS == 'ios') {
                //IOS : Smin = 20000
                if (s1 <= 15000 * (this.state.cameraType == true ? hsCamBack : 1)) { TempstatusSizeFaceDK = -1; continue; }
            }
            else {  //ANDROID : Smin = 30000
                if (s1 <= 23000 * (this.state.cameraType == true ? hsCamBack : 1)) { TempstatusSizeFaceDK = -1; continue; }
            }
            //--Xử lý FACE: Không lấy mặt quá GẦN - CHỈ ÁP DỤNG CHO ĐĂNG KÝ
            if (this.state.status == 'not_existed') {
                hsCamBack = 0.75
                if (Platform.OS == 'ios') {
                    //IOS : Smax = 20000
                    if (s1 > 39000 * (this.state.cameraType == true ? hsCamBack : 1)) { TempstatusSizeFaceDK = -2; continue; }
                }
                else {  //ANDROID : Smax = 30000
                    if (s1 > 49000 * (this.state.cameraType == true ? hsCamBack : 1)) { TempstatusSizeFaceDK = -2; continue; }
                }
            }

            let s2 = arrFace[indexMax < 0 ? 0 : indexMax].bounds.size.width * arrFace[indexMax < 0 ? 0 : indexMax].bounds.size.height;
            if (s1 >= s2) {
                indexMax = i;
            }
        }
        //--Xử lý Status: CHỈ ÁP DỤNG CHO ĐĂNG KÝ

        if (this.state.status == 'not_existed') {
            this.statusSizeFaceDK = TempstatusSizeFaceDK;
            if (indexMax >= 0)
                this.statusSizeFaceDK = 1;

            if (this.statusSizeFaceDK == -1) {
                this.setState({ textGoiY: "Vui lòng đặt khuôn mặt GẦN hơn" });
            } else
                if (this.statusSizeFaceDK == -2) {
                    this.setState({ textGoiY: "Vui lòng đặt khuôn mặt XA hơn" });
                } else
                    if (this.statusSizeFaceDK == 0) {
                        this.setState({ textGoiY: "Vui lòng đặt khuôn mặt TRONG khung xanh" });
                    } else
                        this.setState({ textGoiY: "Vui lòng giữ thẳng khuôn mặt nhìn vào màn hình" });
        }
        return indexMax;
    }

    onFacesDetected = (faces) => {
        let tempdataFace = faces.faces;
        //--Xử lý FACE: lấy mặt gần nhất; Không lấy mặt quá xa
        let indexMax = this.checkFace_GanNhat_Xa(tempdataFace);
        this.isHaveFace = indexMax;
        //--tình trạng Face gần nhất(Cười, nhắm măt, nghiêng,....)
        if (indexMax >= 0)
            this.detectionFaceStatusNow = this.onCheckFaceStatus(tempdataFace[indexMax]);
        else
            this.detectionFaceStatusNow = [];
        if (this.isReCapcha)
            this.arrSaveCapchaTemp = [...this.arrSaveCapchaTemp, ...this.detectionFaceStatusNow]
        else
            this.arrSaveCapchaTemp = [];

        // Utils.nlog('XXX:', this.detectionFaceStatusNow, this.arrSaveCapchaTemp);
        //----CODE ở dưới đoạn này---

        // if (faces.faces.length > 0) {
        // let restemp = this.onCheckFaceStatus(faces.faces[0]);
        // if (restemp.length != 0)
        //     Utils.nlog('XXX:', restemp, faces.faces[0]);
        // }
        if (MODE_TEST_DEV) {
            if (tempdataFace.length > 0) {
                Utils.nlog("Size Frame:", this.frameNow.length);
            }
            this.frameNow = faces.frame;
        }
        if (this.noFaceDetected)
            return;
        if (this.camtake == undefined || this.state.isCheckFace == -1
            || this.state.isCheckFace == -2 || this.state.isCheckFace == 0)
            return;


        if (tempdataFace.length > 0) {
            this.isHaveFace = true;
            if (indexMax < 0) {
                this.statusFace = 'Vui lòng đặt khuôn mặt GẦN hơn!';
                this.setState({ a: this.isLoadHaveFace + '_' + this.isHaveFace });
                //--Xoá khung Android khi không có mặt
                // tempdataFace = tempdataFace[0].bounds;
                this.dataFaceTemp = tempdataFace[0].bounds;
                this.onCheckEndFace_Android(tempdataFace[0].bounds, 800, this.isMode == 1 ? false : true, Platform.OS == 'ios');
                this.isLoadHaveFace = 0;
                return;
            }
            this.frameNow = faces.frame; // base64 1 Frame tại thời điểm hiện tại.
            this.isLoadHaveFace = 1;

            if (this.statusFace != 'Xin vui lòng thử lại!');
            this.statusFace = '...'
            let temprotateFace = { rotateX: tempdataFace[indexMax].yawAngle, rotateZ: tempdataFace[indexMax].rollAngle };

            // tempdataFace = tempdataFace[indexMax].bounds;
            this.dataFaceTemp = tempdataFace[indexMax].bounds;
            this.setState({ a: this.isLoadHaveFace + '_' + this.isHaveFace });
            // this.setState({ dataFace: tempdataFace, rotateFace: temprotateFace }); // ko XOÁ

            //--Xoá khung Android khi không có mặt
            this.onCheckEndFace_Android(tempdataFace[indexMax].bounds, 800);
        }
        else { //--Xoá khung IOS khi không có mặt
            if (!this.countProcessing.includes(1) && this.countProcessing.length != 0) {
                //--code
                this.statusFace = '...';
                this.onChamCongFace();
                this.isLoadHaveFace = 0;
                // this.setState({ a: Date.now() })
            }
            if (this.isHaveFace) {
                this.isHaveFace = false;
                this.statusFace = '...';
                this.setState({ a: Date.now() })
            }

            // this.setState({
            //     dataFace: {
            //         origin: { x: 0, y: 0 }, size: { width: 0, height: 0 }
            //     }
            // });
        }
    }

    onTimer_Num = (time = 0) => {
        if (time == 0)
            return;
        setTimeout(() => {
            //--code xu ly
            if (this.isMode == 1 && this.state.isCheckFace == -2 || this.state.isCheckFace == 0) return;
            if (!this.countProcessing.includes(1) && this.countProcessing.length != 0 && this.state.isCheckFace != 1) {
                //--code
                this.statusFace = '...';
                this.onChamCongFace();
                // this.isLoadHaveFace = 0;
                return;
            }
            //--
            this.onTimer_Num(time - 1);
        }, 350);
    }

    onDelRegisFace = () => {
        Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn xoá đăng ký khuôn mặt này?',
            'Xoá', 'Xem lại', this.ondelRegisFaceAI)
    }

    ondelRegisFaceAI = async () => {
        if (this.codeDel != "" && this.codeDel != this.state.PassCode) { //Check quyền theo code trước khi Xoá FACE - Cho nhân viên y tế nhập
            if (this.state.isNhapCode)
                Utils.showMsgBoxOK(this, "Thông báo", "Code bảo mật không chính xác!", 'Xác nhận');
            this.setState({ isNhapCode: true });
            return;
        }
        if (this.state.isNhapCode)
            this.setState({ isNhapCode: false, PassCode: "" });
        let kqDelFace = await apiAI.delRegisFace(this.IdNV, this.IdCty);
        Utils.nlog("delRegisFace:", kqDelFace);
        if (kqDelFace && kqDelFace.status == "1" && kqDelFace.data.status == "success") {
            // await this.updateDaDangKy(this.IdNV, false);
            setTimeout(() => {
                Utils.showMsgBoxOK(this, "Thông báo", "Xoá đăng ký khuôn mặt thành công", 'Xác nhận', () => {
                    this.frameNow = ''
                    this.onGetFrame(null)
                });
            }, 200);
        } else
            setTimeout(() => {
                Utils.showMsgBoxOK(this, "Thông báo", "Xoá đăng ký thất bại, vui lòng thử lại", 'Xác nhận');
            }, 200);
    }

    onGetLocation = () => {
        this.latlongLocation = "";
        this.latlongitude = "";
        // this.kiemTraQuyenViTri();
    }

    onBack_Logout = (timeOut = 0) => {

        this.onClearTimer();
        this.camtake = undefined;
        Utils.goback(this, null)


    }

    onShowLocation = async (isShow = null) => {
        if (this.latlongAddress != this.latlongLocation)
            this.addressCC = '--' + 'Vị trí không xác định' + '--';
        if (this.latlongLocation != '' && (!this.state.showLocation || isShow)
            && this.latlongAddress != this.latlongLocation) {
            this.latlongAddress = this.latlongLocation;
            let resTemp = await apis.ApiApp.getAddressGG(this.latlongLocation, this.latlongitude);
            if (resTemp && resTemp.status == 'OK' && resTemp.results.length > 0)
                this.addressCC = resTemp.results[0].formatted_address;
            Utils.nlog('getAddressGG', resTemp);
        }
        this.setState({ isLoad: false, showLocation: isShow == null ? !this.state.showLocation : isShow });

    }

    _setShowPass = () => {
        this.setState({ ShowPassCode: !this.state.ShowPassCode })
    }


    render() {
        // Utils.nlog('--RENDER--');
        var {
            isLoad, isCheckLocation = false, modalVisible = true, isCheckFace, rotateFace = { rotateX: 0, rotateZ: 0 }, delRegister,
            dataFace = { origin: { x: 0, y: 0 }, size: { width: 0, height: 0 } }, showLocation, isNhapCode, status, ShowPassCode
        } = this.state;
        let tempRotate = [
            { rotateX: "0deg" },
            { rotateZ: rotateFace.rotateZ + "deg" }];

        let iscolorDK = this.statusSizeFaceDK != 1 && status == "not_existed";
        return (
            <View style={styles.container}>
                {
                    this.frameNow != '' && this.state.status == 'not_existed' ? this.renderImage() :
                        <>
                            <RNCamera
                                ref={ref => {
                                    this.camera = ref;
                                }}
                                style={styles.preview}
                                type={this.state.cameraType == true ? "back" : "front"}
                                flashMode={RNCamera.Constants.FlashMode.off}
                                captureAudio={false}
                                androidCameraPermissionOptions={{
                                    title: 'Xin quyền truy cập máy ảnh',
                                    message: 'Chúng tôi cần bạn cho phép để sử dụng máy ảnh của bạn',
                                    buttonPositive: 'Đồng ý',
                                    buttonNegative: 'Huỷ',
                                }}
                                androidRecordAudioPermissionOptions={{
                                    title: 'Xin quyền truy cập ghi âm',
                                    message: 'Xin quyền truy cập ghi âm',
                                    buttonPositive: 'Đồng ý',
                                    buttonNegative: 'Huỷ',
                                }}
                                onFacesDetected={this.onFacesDetected}
                                // onFaceDetectionError={response => console.log('resp', response)}
                                faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
                                faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
                                faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
                            // onFaceDetectionError={error => Utils.nlog('FDError:', error)}
                            >

                                {/* Không XOÁ code này */}
                                {/* <View style={{
                            position: 'absolute', top: dataFace.origin.y, left: dataFace.origin.x - (Platform.OS == 'ios' ? 0 : Width(9.5)),
                            height: dataFace.size.height, width: dataFace.size.width, borderRadius: dataFace.size.width / 2,
                            borderWidth: 1, borderColor: colors.greenButton, transform: tempRotate
                        }} /> */}
                                <View style={{
                                    marginBottom: 10, backgroundColor: colors.black_50, paddingVertical: 5, borderRadius: 4,
                                    marginHorizontal: 8, paddingHorizontal: 5
                                }}>
                                    {
                                        this.statusFace != '...' ?
                                            <View style={[this.isReCapcha ? { backgroundColor: iscolorDK ? colors.white : 'red', borderRadius: 18, paddingVertical: 5 } :
                                                iscolorDK ? { backgroundColor: colors.white, borderRadius: 4, paddingVertical: 5, marginHorizontal: 5 } : {}]}>
                                                <Text style={[{
                                                    color: iscolorDK ? colors.redDark : colors.white, fontWeight: 'bold',
                                                    fontSize: 17, textAlign: 'center', marginHorizontal: 8
                                                }]}>{this.latlongLocation == '' && !isLoad && isCheckFace != -1 ?
                                                    (this.firstLoad ? 'Không thể xác thực.\nVui lòng kiểm tra lại dịch vụ vị trí!' : 'Đang kết nối AI xác thực...')
                                                    : (isLoad ? 'Đang lấy dữ liệu vị trí hiện tại...' : (this.statusFace == '[textGoiY]' ? this.state.textGoiY : this.statusFace))}</Text>
                                            </View>
                                            :
                                            <Text style={{
                                                color: colors.white, fontWeight: 'bold',
                                                fontSize: 17, marginHorizontal: 8, textAlign: 'center'
                                            }}>{this.state.textGoiY}</Text>
                                    }
                                </View>
                                <View style={{
                                    height: Width(90), width: Width(90), borderRadius: 6, marginBottom: 40,
                                    borderWidth: 3, borderColor: colors.greenButton
                                }} />
                                {
                                    iscolorDK ? null :
                                        <View style={{ backgroundColor: colors.black_50, paddingVertical: 5, borderRadius: 4 }}>
                                            {
                                                (this.statusFace == '...' || isLoad || this.isLoadApiLocation || this.isHaveFace || this.isLoadHaveFace == 1)
                                                    && (this.isLoadHaveFace == 1 || this.isHaveFace || this.isLoadApiLocation) || (this.noFaceDetected && this.state.isCheckFace > 0) ?
                                                    (this.statusFace == '...' && !this.countProcessing.includes(1)
                                                        && this.isLoadHaveFace == 0 && !this.noFaceDetected || this.isMode == 1 && this.state.isCheckFace < 0 ?
                                                        <Text style={{
                                                            color: colors.white, fontWeight: 'bold', lineHeight: 30,
                                                            fontSize: 20, marginHorizontal: 30, textAlign: 'center'
                                                        }}>{'SẴN SÀNG'}</Text> : <ActivityIndicator color={colors.white} />) :
                                                    <Text style={{
                                                        color: colors.white, fontWeight: 'bold',
                                                        fontSize: 20, marginHorizontal: 30, textAlign: 'center', lineHeight: 30,
                                                    }}>{this.latlongLocation == '' ? '' : 'SẴN SÀNG'} </Text>
                                            }
                                        </View>
                                }
                            </RNCamera>

                            {
                                !MODE_TEST_DEV ? null :
                                    <Image source={{
                                        uri: this.state.imgTemp
                                    }}
                                        style={{
                                            width: 100, height: 100, backgroundColor: 'red',
                                            position: 'absolute', top: 0, left: 0
                                        }} resizeMode='contain' />
                            }
                            <View style={{
                                flex: 0, flexDirection: 'row', position: 'absolute',
                                bottom: 70, alignSelf: 'center', justifyContent: 'space-between',
                                alignItems: 'center', zIndex: 0
                            }}>

                            </View>
                            {
                                isCheckFace > 0 ? null :
                                    <View style={{
                                        position: 'absolute', bottom: 0, top: 0, right: 0, left: 0, zIndex: 3,
                                        justifyContent: 'center', alignItems: 'center', backgroundColor: colors.black_5
                                    }}>
                                        {
                                            // isCheckFace == -2 && !isLoad && this.latlongLocation != '' && !this.isLoadApiLocation ?  // mở dòng này nếu có check latlong

                                            isCheckFace == -2 ?
                                                <TouchableOpacity onPress={this.onChamCongFace} style={[styles.capture, nstyles.shadow]}>
                                                    <Image
                                                        style={[nstyles.nIcon50]}
                                                        source={Images.icSnapCamera}
                                                        resizeMode={'contain'}>
                                                    </Image>
                                                    <Text
                                                        style={{ color: colors.white, fontWeight: 'bold', fontSize: 18 }}>{'XÁC THỰC LẠI'}</Text>
                                                </TouchableOpacity> : null
                                        }
                                        {
                                            this.state.status != 'not_existed' ? null :
                                                <TouchableOpacity onPress={() => {
                                                    if (iscolorDK || this.isHaveFace < 0)
                                                        Alert.alert("Thông báo", this.state.textGoiY);
                                                    else
                                                        this.onDangKyFace();
                                                }} style={[nstyles.shadow,
                                                {
                                                    padding: 10, paddingHorizontal: 20, marginTop: 25, borderRadius: 90,
                                                    backgroundColor: colors.black_50, height: 180, width: 180, alignItems: 'center', justifyContent: 'center'
                                                }]}>
                                                    <Text
                                                        style={{
                                                            color: colors.white, fontWeight: 'bold',
                                                            fontSize: 16, textAlign: 'center'
                                                        }}><Text style={{ fontSize: 18, color: colors.greenishTeal, lineHeight: 30 }}>
                                                            {'\n' + 'CHỤP HÌNH'}</Text>{'\n' + 'ĐĂNG KÝ'}</Text>
                                                    <Text style={{ color: 'red', textAlign: 'center', marginBottom: 20, fontSize: 12 }}>(Cán bộ y tế thực hiện)</Text>
                                                </TouchableOpacity>
                                        }
                                    </View>
                            }

                            <View style={{
                                flex: 0, position: 'absolute',
                                bottom: 0, alignSelf: 'center',
                                zIndex: 4
                            }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => this.onBack_Logout()}
                                        style={[styles.btnBack_Switch, { padding: 10, backgroundColor: colors.black_5 },]}>
                                        <View>
                                            <Image
                                                resizeMode='contain'
                                                style={[nstyles.nIcon40]}
                                                source={Images.icBackCamera}
                                                resizeMode={'contain'}>
                                            </Image>
                                        </View>
                                    </TouchableOpacity>
                                    {
                                        !MODE_TEST_DEV ? null :
                                            <TouchableOpacity onPress={this.onTakePicture}>
                                                <Image
                                                    style={[nstyles.nIcon56]}
                                                    source={Images.icSnapCamera}
                                                    resizeMode={'contain'}>
                                                </Image>
                                            </TouchableOpacity>
                                    }
                                    {/* {
                                        !this.state.isShowRefreshLocation ? null :
                                            <TouchableOpacity style={{ marginHorizontal: 10, backgroundColor: colors.black_5 }} disabled={this.state.isLoad}
                                                onPress={this.onGetLocation}>
                                                <Image
                                                    style={[nstyles.nIcon30, { tintColor: isCheckLocation ? colors.greenButton : colors.redFresh }]}
                                                    source={Images.icLocationRefresh}
                                                    resizeMode={'contain'}>
                                                </Image>
                                            </TouchableOpacity>
                                    } */}
                                    {this.state.status == 'not_existed' ? null :
                                        <TouchableOpacity style={{ marginHorizontal: 10, backgroundColor: colors.black_5 }} onPress={this.onDelRegisFace}>
                                            <Image
                                                style={[nstyles.nIcon30, { tintColor: colors.redStar }]}
                                                source={Images.icDelFace}
                                                resizeMode={'contain'}>
                                            </Image>
                                        </TouchableOpacity>
                                    }

                                    <TouchableOpacity onPress={() => this.changeCameraType()}
                                        style={styles.btnBack_Switch}>
                                        <View>
                                            <Image
                                                resizeMode='contain'
                                                style={[nstyles.nIcon40]}
                                                source={Images.icChangeCameraAI}
                                                resizeMode={'contain'}>
                                            </Image>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* {
                                !this.state.isShowRefreshLocation ? null :
                                    <View style={{
                                        position: 'absolute', left: 0, top: paddingTopMul() + 10, alignSelf: 'center',
                                        justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10,
                                        flexDirection: 'row', zIndex: 5
                                    }}>
                                        <Text
                                            numberOfLines={1}
                                            style={{ color: isCheckLocation ? colors.greenButton : colors.redFresh, fontStyle: 'italic', maxWidth: '92%', fontSize: 12 }}>
                                            {showLocation ? this.addressCC : ''}
                                        </Text>
                                        <TouchableOpacity disabled={isLoad} style={{ padding: 5, borderRadius: 15 }}
                                            onPress={() => this.onShowLocation()}>
                                            <Image
                                                resizeMode='contain'
                                                style={[nstyles.nIcon24, { tintColor: isCheckLocation ? colors.greenButton : colors.redStar }]}
                                                source={Images.icShowLocation} />
                                        </TouchableOpacity>
                                    </View>
                            } */}

                            {
                                !isNhapCode ? null :
                                    <View style={{
                                        backgroundColor: colors.white, borderRadius: 4, flexDirection: 'row', alignItems: 'center',
                                        position: 'absolute', top: paddingTopMul() + 10, left: 20, right: 20, zIndex: 5, paddingHorizontal: 5
                                    }}>
                                        <View style={{ flex: 1 }}>
                                            <InputLogin
                                                Fcref={refs => this.refPass = refs}
                                                value={this.state.PassCode}
                                                icon={Images.icPass}
                                                icShowPass={true}
                                                isShowPassOn={ShowPassCode}
                                                iconShowPass={ShowPassCode == true ? Images.icHidePass : Images.icShowPass}
                                                showIcon={true}
                                                secureTextEntry={ShowPassCode}
                                                placeholder={"Nhập code bảo mật"}
                                                setShowPass={this._setShowPass}
                                                onChangeText={text => this.setState({ PassCode: text.trim() })}
                                                customStyle={stCamXacThuc.contentInput}
                                                colorUnline={colors.brownGreyThree || 'transparent'}
                                                colorUnlineFoCus={"red" || 'transparent'}
                                                placeholderTextColor={colors.brownGreyTwo}
                                                styleInput={{ color: "red" }}
                                                colorPassOn={"red"}
                                            />
                                        </View>
                                        <TouchableOpacity style={[stCamXacThuc.contentBtn, { backgroundColor: colors.colorGrayText }]}
                                            onPress={() => this.setState({ isNhapCode: false })}>
                                            <Text style={stCamXacThuc.txtBtnCode}>Huỷ</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={stCamXacThuc.contentBtn}
                                            onPress={this.ondelRegisFaceAI}>
                                            <Text style={stCamXacThuc.txtBtnCode}>Nhập</Text>
                                        </TouchableOpacity>
                                    </View>
                            }

                            {/* xxx */}
                        </>
                }
            </View>

        );
    }


    renderImage() {
        let indexTemp = this.countProcessing.length;
        return (
            <View style={{ flex: 1 }}>
                <Image
                    source={{ uri: `data:image/gif;base64,${this.frameNow}` }}
                    style={styles.preview}
                />

                <View style={{
                    flex: 0, flexDirection: 'row', position: 'absolute',
                    bottom: 100, alignSelf: 'center', justifyContent: 'space-between',
                    alignItems: 'center', zIndex: 0
                }}>
                    <View>
                        <View style={{ backgroundColor: colors.black_30, marginHorizontal: 10, borderRadius: 6, paddingHorizontal: 20 }}>
                            <Text style={{
                                color: colors.white, fontWeight: 'bold',
                                fontSize: 18, marginTop: 15, textAlign: 'center'
                            }}>{'Bạn có muốn chọn ảnh này?'} </Text>
                            <Text style={{
                                color: colors.whiteTwo, marginTop: 8,
                                fontSize: 13, marginBottom: 15, textAlign: 'center'
                            }}>{'Lưu ý: Hình ảnh gửi đi là chất lượng thấp. Bạn không cần phải lo lắng về chất lượng này.'} </Text>
                        </View>

                    </View>
                </View>
                <View style={{
                    flex: 0, flexDirection: 'row', position: 'absolute',
                    bottom: 0, alignContent: "space-around", alignItems: "center", alignSelf: "center"
                }}>
                    <ButtonCom
                        text={'Chụp lại'}
                        style={{
                            width: reSize(100), marginTop: 20, marginBottom: 30,
                            // backgroundColor: colors.colorBtnOrange,
                            // backgroundColor1: colors.colorBtnOrange,
                        }}
                        onPress={() =>
                        (
                            this.setState({ isCheckFace: -1 }),
                            this.frameNow = "",
                            this.isHaveFace = false,
                            this.isLoadHaveFace = 0,
                            this.statusFace = '[textGoiY]'
                        )
                        } />
                    <View style={{ paddingHorizontal: 20 }} />
                    <ButtonCom
                        text={'Đồng ý'}
                        style={{
                            width: reSize(100), marginTop: 20, marginBottom: 30,
                            // backgroundColor: colors.colorButtomleft,
                            // backgroundColor1: colors.colorButtomright,
                        }}
                        onPress={() => this.onSendAPI_Face(true, this.frameNow, indexTemp - 1)}
                    />
                </View>
            </View >
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    capture: {
        opacity: 0.8,
        borderRadius: 15,
        height: Width(45),
        width: Width(45),
        borderRadius: Width(45) / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.greenButton
    },
    btnBack_Switch: {
        opacity: 0.8,
        borderRadius: 5,
        padding: 6,
        margin: 20
    }
});
// export default CameraDiemDanh
// const mapStateToProps = state => ({
//     lang: state.changeLanguage.language
// });
export default CameraDiemDanhPAHT