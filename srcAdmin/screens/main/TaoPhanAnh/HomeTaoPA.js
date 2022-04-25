




import React, { Component } from 'react';
import {
    View, TextInput,
    Text, Image, TouchableOpacity,
    StyleSheet, PermissionsAndroid,
    Linking,
    ActivityIndicator, Platform, ScrollView, Alert, Keyboard, BackHandler
} from 'react-native';
import apis from '../../../apis';
import { Images } from '../../../images';
import { Images as ImagesCD } from '../../../../src/images'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Geolocation from 'react-native-geolocation-service';
import { BtnViTri } from './BtnViTri';
import ImageSize from 'react-native-image-size'
import moment from 'moment';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import Toast from 'react-native-simple-toast';
import ImagePicker from '../../../../components/ComponentApps/ImagePicker/ImagePicker';
import RNCompress from '../../../../src/RNcompress';
import { reText, reSize, sizes } from '../../../../styles/size';
import { nstyles, Height, paddingTopMul, khoangcach, Width } from '../../../../styles/styles';
import { appConfig } from '../../../../app/Config';
import { IsLoading, HeaderCom } from '../../../../components';
import { colors } from '../../../../styles';
import Utils from '../../../../app/Utils';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import AppCodeConfig from '../../../../app/AppCodeConfig';
const Latitude = appConfig.defaultRegion.latitude, Longitude = appConfig.defaultRegion.longitude;
class HomeTaoPA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // idDraft,
            // IdPA,
            noiDungGui: '',
            diaDiem: '',
            latlng: {
                latitude: Latitude,
                longitude: Longitude
            },
            Notify: true,//Utils.getGlobal(nGlobalKeys.SMS, false),
            isFirstEdit: false,
            tuDongViTri: false,
            paKhan: 0 == 3, //3 là PA Khẩn, 0 là Bình thường
            enableThemDiaDiem: false,
            findLocation: false,
            locationPermisstion: false,

            ListFileDinhKemDelete: [],
            ListFileDinhKemNew: [],
            ListHinhAnh: [],
            username: '',
            dataUser: '',
            isLoadUser: false,
            isShowScreat: false

        };
        this.refPick = React.createRef()

    }
    componentDidMount() {
        let rules = Utils.getGlobal(nGlobalKeys.rules, [], AppCodeConfig.APP_ADMIN);
        let check = rules.includes(91) || rules.includes('91');
        this.setState({ isShowScreat: check })
    }
    onCheckKhan = () => {
        this.setState({ paKhan: !this.state.paKhan });
    }
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
        // const _latitude = Utils.ngetParam(this, 'latitude');
        // const _longitude = Utils.ngetParam(this, 'longitude');
        await this.getCurrentPosition();
        Utils.goscreen(this, 'Modal_BanDo_Root2', {
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
        //---
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

    _hienTai = () => {
        this.getCurrentPosition(true);
    }


    getCurrentPosition = async (enableThemDiaDiem, tuDongViTri = this.state.tuDongViTri) => {
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
                    Utils.nlog('geolocation-ios', JSON.stringify(position));
                    var { coords = {} } = position;
                    var { latitude, longitude } = coords;
                    if (Platform.OS == 'ios' && (!latitude || !longitude)) {
                        Utils.showMsgBoxYesNo(this, 'Dịch vụ vị trí bị tắt', configHome.TenAppHome + ' cần truy cập vị trí của bạn. Hãy bật Dịch vụ vị trí trong phần cài đặt điện thoại của bạn.',
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
        }
    }

    callbackDataMaps = (diaDiem, latlng) => {
        this.setState({ diaDiem, latlng });
    }

    chonTuDongViTri = async () => {
        const { tuDongViTri } = this.state;
        const tuDong = !tuDongViTri;
        if (tuDong == true) {
            this.getCurrentPosition(true, true);
        } else {
            this.setState({ tuDongViTri: false });
        };
    }

    onPressSend = async () => {
        // console.log("gia trị time bắt đầu", moment(new Date()).format('HH:mm:ss'))
        Utils.nlog("List image nè:", this.state.ListFileDinhKemNew)
        let {
            IdPA,
            noiDungGui,
            diaDiem,
            ListHinhAnh,
            ListFileDinhKemNew,
            Notify,
            latlng,
            paKhan, dataUser
        } = this.state;
        diaDiem = diaDiem ? diaDiem : appConfig.TenTinh;
        if (!dataUser) {
            Toast.show('Vui lòng nhập người góp ý ', Toast.LONG);
            return;
        }
        if (!noiDungGui) {
            Toast.show('Vui lòng nhập nội dung ' + appConfig.TieuDeApp.toLowerCase(), Toast.LONG);
            return;
        }
        this.enableLoading(true);
        let dem = 0;

        let dataBoDy = new FormData();
        //duyệt hình
        for (let index = 0; index < ListFileDinhKemNew.length; index++) {
            dem++
            let item = ListFileDinhKemNew[index];
            Utils.nlog("Log ra item nè!!", item)
            let file = `File${index == 0 ? '' : index} `;

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
                        // Utils.nlog("gia tri err-----------------", err)
                    });
            };
        }
        const {
            latitude,
            longitude
        } = latlng;
        // const IdUser = Utils.getGlobal(nGlobalKeys.Id_user, 0);
        const Email = Utils.getGlobal(nGlobalKeys.Email, "");
        const NumberPhone = Utils.getGlobal(nGlobalKeys.NumberPhone, "");
        if (dem == 0) {
            dataBoDy.append("Temp", true);

        }
        dataBoDy.append("NguoiGopY", this.state.dataUser.UserID);
        dataBoDy.append("NoiDung", noiDungGui)
        dataBoDy.append("TieuDe", '')
        dataBoDy.append("NumberPhone", this.state.dataUser.PhoneNumber)
        dataBoDy.append("Email", this.state.dataUser.Email)
        dataBoDy.append("ToaDoX", latitude)
        dataBoDy.append("ToaDoY", longitude)
        dataBoDy.append("Notify", Notify)
        dataBoDy.append('DiaDiem', diaDiem)
        dataBoDy.append('IdPA', 0)
        dataBoDy.append("MucDo", paKhan ? 3 : 0)
        // Utils.nlog("gia trị time bắt đầu gửi ----------------------------------", moment(new Date()).format('HH:mm:ss'))
        // Utils.nlog("Kêt qua hoàn tahnh èn:", dataBoDy)
        await apis.ApiGuiPA.GuiPA_FormData(dataBoDy).then(
            async (res) => {
                // Utils.nlog("gia trị time hoàn thành ----------------------------------", moment(new Date()).format('HH:mm:ss'), res)
                if (res.status == 1) {
                    this.enableLoading(false);
                    this.refPick?.current?.refreshData([])
                    this.setState({
                        noiDungGui: '',
                        diaDiem: '',
                        ListFileDinhKemDelete: [],
                        ListFileDinhKemNew: [],
                        ListHinhAnh: [],
                        username: '',
                        dataUser: '',
                        isLoadUser: false
                    })
                    Utils.showMsgBoxOK(this, "Thông báo", "Gửi phản ánh thành công", "Xác nhận", () => {

                    })


                } else {
                    const { error } = res
                    this.enableLoading(false);
                    let message = `Gửi thất bại\n${error && error.message ? error.message : "Bạn hãy thử lại"}`
                    Utils.showMsgBoxOK(this, "Thông báo", message, "Xác nhận");
                }

            }
        );


    }
    CheckInfoAccount = async () => {
        if (this.state.username) {
            this.setState({ isLoadUser: true })
            let res = await apis.ApiGuiPA.CheckInfoAccount(this.state.username);
            this.setState({ isLoadUser: false })
            if (res.status == 1 && res.data && res.data.length == 1) {
                // Utils.nlog("ress--------aaa", res)
                this.setState({ dataUser: res.data[0] })
            } else {
                this.setState({ dataUser: -1 })
            }
        } else {
            this.setState({ username: '', dataUser: '' })

        }

    }
    callback = (username) => {
        this.setState({ username: username }, this.CheckInfoAccount)
    }
    _openMenu = () => {
        this.props.navigation.goBack();
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
            username = '', isLoadUser, dataUser = '', isShowScreat
        } = this.state;

        let placeholderNoiDung = 'Nhập nội dung ' + appConfig.TieuDeApp.toLowerCase() + '...';
        let booleanViTri = tuDongViTri || enableThemDiaDiem || diaDiem
        let txtThemViTri = booleanViTri ? ('Vị trí ' + appConfig.TieuDeApp.toLowerCase()) : 'Địa điểm ' + appConfig.TieuDeApp.toLowerCase();
        let txtTuDong = 'Tự động lấy vị trí hiện tại mỗi khi tạo phản ánh';
        let headertitle = 'Gửi ' + appConfig.TieuDeApp.toLowerCase();
        let txtNhapViTri = diaDiem.length == 0 ? 'Chọn vị trí' : 'Nhập vị trí';
        let {
            stTextInput, stThemViTri, stViewTuDong,
            stTxtTuDong, stViewBanDo,
        } = styles;
        return (
            <View style={nstyles.ncontainer}>
                <View style={[nstyles.nbody, { backgroundColor: 'white' }]}>
                    <HeaderCom
                        titleText='Tạo phản ánh'
                        iconLeft={Images.icBack}
                        nthis={this}
                        onPressLeft={this._openMenu}
                        iconRight={null}
                    />
                    <View style={{ height: 3, backgroundColor: "#F8F8F8" }}></View>
                    {/* Body */}
                    <ScrollView
                        style={[nstyles.nbody]}>
                        <View style={[nstyles.nbody]}>
                            <View style={[nstyles.nbody, { paddingHorizontal: 13 }]}>
                                <View style={nstyles.nbody}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{
                                            fontWeight: 'bold',
                                            marginTop: 20, marginBottom: 10, flex: 1
                                        }}>TK người góp ý(sdt)</Text>
                                        {
                                            isShowScreat ? <TouchableOpacity onPress={() => Utils.navigate("Modal_AddUserCongDan", {
                                                callback: this.callback
                                            })}>
                                                <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: colors.softBlue }}>{'Tạo tài khoản'}</Text>
                                            </TouchableOpacity> : null
                                        }
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        <View style={{ flex: 1, }}>
                                            <TextInput
                                                style={[stTextInput, {
                                                    backgroundColor: "#F5F5F5",
                                                    paddingHorizontal: 15, borderRadius: 3, paddingVertical: 5
                                                }]}
                                                multiline={false}
                                                value={username}
                                                onChangeText={text => this.setState({ username: text })}
                                                placeholder={'Nhập username'}
                                                placeholderTextColor={colors.black_20}
                                                onBlur={this.CheckInfoAccount}
                                            />
                                        </View>

                                        {dataUser && dataUser != -1 ?
                                            < View >
                                                <Image
                                                    source={Images.iccheckgreen}
                                                    resizeMode={'contain'}
                                                    style={{
                                                        marginLeft: 5,
                                                        width: reSize(20), height: reSize(20),


                                                    }} />
                                            </View> : null
                                        }
                                        {dataUser == -1 ?
                                            < View >
                                                <Image
                                                    source={Images.icClose}
                                                    resizeMode={'contain'}
                                                    style={{
                                                        marginLeft: 5,
                                                        width: reSize(20), height: reSize(20),
                                                        tintColor: colors.redStar,

                                                    }} />
                                            </View> : null
                                        }
                                    </View>
                                    {
                                        isLoadUser ? <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.backgroundModal, }}>
                                            <ActivityIndicator size="large" color={colors.greenFE} style={{ marginBottom: 20, marginTop: 20 }} />
                                        </View> : null
                                    }
                                </View>
                                <View style={nstyles.nbody}>
                                    <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>Nội dung {appConfig.TieuDeApp.toLowerCase()}</Text>
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
                                </View>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={this.onCheckKhan}>
                                    <View style={stViewTuDong}>
                                        <View
                                            style={[nstyles.nIcon18, {
                                                borderColor: paKhan ? colors.colorRed : colors.black_30,
                                                borderWidth: 1, backgroundColor: paKhan ? colors.colorRed : colors.white
                                            }]}
                                        />
                                        <Text style={{ color: colors.black_50, fontSize: reText(16), marginLeft: 5 }}>
                                            {appConfig.TieuDeApp + ' '} <Text style={{ color: colors.redStar }}>KHẨN</Text>
                                        </Text>
                                    </View>
                                </TouchableOpacity>
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
                                                        source={Images.icLocation}
                                                        resizeMode={'contain'}
                                                        style={{
                                                            marginRight: 5, width: reSize(20), height: reSize(20),
                                                            tintColor: colors.black,
                                                        }} />
                                                    <Text style={{ color: colors.colorBlueP }}>
                                                        {txtThemViTri}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                    }
                                </View>
                                {booleanViTri ? (
                                    <View>
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
                                        <View style={[nstyles.nrow, nstyles.nmiddle, { maxHeight: 80 }]}>
                                            {findLocation ?
                                                <ActivityIndicator
                                                    size={'small'}
                                                    color={colors.lightSalmon} /> :
                                                <Image
                                                    source={Images.icLocation}
                                                    resizeMode={'contain'}
                                                    style={{
                                                        width: reSize(20), height: reSize(20),
                                                        tintColor: colors.black,
                                                    }} />
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
                                                    source={ImagesCD.icHere}
                                                    text={'Hiện tại'} /> : null}
                                            {diaDiem.length == 0 ?
                                                <BtnViTri
                                                    onPress={this.onPressMaps}
                                                    source={ImagesCD.icBanDo}
                                                    text={'Bản đồ'} />
                                                : null}
                                        </View>
                                    </View>
                                ) : null}
                            </View>
                            <Text style={{ fontWeight: 'bold', marginHorizontal: 10, marginTop: 15 }}>Hình ảnh, Video, File đính kèm</Text>
                        </View>
                        <ImagePicker
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
                        </ImagePicker>
                        <TouchableOpacity style={{
                            width: Width(30), paddingVertical: 10, backgroundColor: colors.peacockBlue, justifyContent: 'center',
                            alignItems: 'center', borderRadius: 5, alignSelf: 'center', marginTop: 20, marginBottom: 20
                        }} onPress={this.onPressSend}>
                            <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: reText(15) }}>
                                {IdPA > 0 ? 'Cập nhật' : 'Gửi'}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <IsLoading ref={ref => this.waiting = ref} />
            </View >
        );
    }
}

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
    }
})
export default HomeTaoPA;
