import React, { Component } from 'react';
import { View, Text, BackHandler, TextInput, PermissionsAndroid, Linking, StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Utils from '../../../app/Utils';
import { ButtonCom, HeaderCus, IsLoading } from '../../../components';
import { colors } from '../../../chat/styles';
import { Images } from '../../images';
import * as Animatable from 'react-native-animatable'
import { reText } from '../../../styles/size';
import Geolocation from 'react-native-geolocation-service';
import apis from '../../apis';
import { Height, isLandscape, nheight, nstyles, nwidth } from '../../../styles/styles';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { appConfig } from '../../../app/Config';
import ImagePickerNew from '../../../components/ComponentApps/ImagePicker/ImagePickerNew';
import RNFS from 'react-native-fs';
import RNCompress from '../../RNcompress'
import ImageResizer from 'react-native-image-resizer';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { Width } from '../../../chat/styles/styles';
import UtilsApp from '../../../app/UtilsApp';
import TextInputForm from '../../../components/TextInputForm';

const ASPECT_RATIO = nwidth() / nheight();
let LATITUDE_DELTA = 0.00922;
let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const Latitude = appConfig.defaultRegion.latitude, Longitude = appConfig.defaultRegion.longitude;

class UngCuuKhanCap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            HoTen: '',
            SoDienThoai: '',
            latlng: {
                latitude: Latitude,
                longitude: Longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            diaDiem: '',
            findLocation: true,
            Mota: '',
            ListHinhAnh: [],
            ListHinhAnhDelete: [],
            ListFileDinhKemNew: []
        };
    }

    async componentDidMount() {
        if (this.props.auth.userCD) {
            this.setState({ HoTen: this.props.auth.userCD.FullName, SoDienThoai: this.props.auth.userCD.PhoneNumber })
        }
        // if (!this.props.auth.tokenCD) {
        //     Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng đăng nhập để sử dụng chức năng này !', 'OK', () => Utils.goscreen(this, 'login'))
        // }
        this._hienTai()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goscreen(this, 'ManHinh_Home')
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    _hienTai = () => {
        this.getCurrentPosition(true);
    }

    onPressFindLocation = async () => {
        let { latlng } = this.state;
        var diaDiem = 'Đang lấy dữ liệu vị trí hiện tại...';
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
                            latlng: {
                                ...latlng,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,
                            }
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
                            latlng: {
                                ...latlng,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,
                            }
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

    _sendSOS = () => {
        let { HoTen, SoDienThoai, Mota } = this.state
        let warning = ''
        if (!HoTen) {
            warning += 'Họ và tên bắt buộc nhập \n'
        }
        if (!SoDienThoai || SoDienThoai.length < 10) {
            warning += 'Số điện thoại chưa hợp lệ'
        }
        // if (!Mota) {
        //     warning += 'Mô tả bắt buộc nhập'
        // }
        if (warning.length > 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', warning, 'Xác nhận')
        } else {
            Utils.showMsgBoxYesNo(this, 'Xác nhận yêu cầu',
                `Chức năng này chỉ phục vụ cho yêu cầu khẩn cấp cần hỗ trợ và thông tin phải đảm bảo chính xác. 
        Việc khai báo thông tin không chính xác, cố tình quậy phá sẽ bị xử lý theo quy định của pháp luật

        Lưu ý: chỉ sử dụng chức năng này khi cần thiết.
        `, 'Gửi yêu cầu', 'Xem lại', () => this.guiUngCuuKhanCap()
            )
        }

    }

    guiUngCuuKhanCap = async () => {
        nthisIsLoading.show()
        let { HoTen, diaDiem, latlng, SoDienThoai, Mota, ListHinhAnhDelete, ListHinhAnh, ListFileDinhKemNew } = this.state
        let DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
        let dataBoDy = new FormData();
        let dem = 0
        // Utils.nlog("giá trị lish hình ảnh", ListHinhAnh);

        //duyệt hình
        for (let index = 0; index < ListFileDinhKemNew.length; index++) {
            let item = ListFileDinhKemNew[index];
            Utils.nlog("Log ra item nè!!", item)
            let file = `File${index == 0 ? '' : index} `;
            dem++;
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
                        Utils.nlog("gia tri err-----------------", err)
                    });
            };
        }

        if (dem == 0) {
            dataBoDy.append("Temp", true);
        }

        dataBoDy.append('HoTen', HoTen)
        dataBoDy.append('DiaDiem', diaDiem)
        dataBoDy.append('SDT', SoDienThoai)
        dataBoDy.append('MoTa', Mota)
        dataBoDy.append('ToaDoX', latlng.latitude)
        dataBoDy.append('ToaDoY', latlng.longitude)
        dataBoDy.append('DevicesToken', DevicesToken)
        Utils.nlog('data body==============', dataBoDy)
        let res = await apis.ApiUpLoad.GuiSOS(dataBoDy)
        nthisIsLoading.hide()
        Utils.nlog('res gui sos=========', res)
        if (res.status == 1) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Gửi ứng cứu khần cấp thành công!', 'Xác nhận', () => {
                Utils.goscreen(this, 'ManHinh_Home')
            })
        } else {
            Utils.showMsgBoxOK(this, 'Thông báo', res.error.message ? res.error.message : 'Gửi ứng cứu khẩn cấp thất bại!', 'Xác nhận')
        }
    }

    ChooseLocation = () => {
        Utils.goscreen(this, 'Modal_BanDo_Root', {
            ...this.state.latlng,
            callbackDataMaps: this.callbackDataMaps
        })
    }

    callbackDataMaps = (diaDiem, latlng) => {
        this.setState({
            diaDiem,
            latlng: {
                ...latlng,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            }
        });
    }
    onCheckErrorInput = (text, type) => {
        switch (type) {
            case 1:
                if (text?.length <= 0) {
                    return 'Họ và tên bắt buộc nhập'
                }
                break;
            case 2:
                if (text?.trim()?.length <= 9) {
                    return 'Số điện thoại chưa hợp lệ'
                }
            case 3:
                if (text?.length <= 0) {
                    return 'Nội dung bắt buộc nhập  '
                }
                break;
            default:
                break;
        }
    }
    render() {
        const { HoTen, SoDienThoai, diaDiem, latlng, Mota, ListHinhAnh, ListHinhAnhDelete } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <HeaderCus
                    title={UtilsApp.getScreenTitle("ManHinh_SOS", 'Ứng cứu khẩn cấp')}
                    styleTitle={{ color: colors.white }}
                    iconLeft={Images.icBack}
                    onPressLeft={() => { Utils.goscreen(this, 'ManHinh_Home') }}
                    iconRight={Images.ichistory}
                    Sright={{ tintColor: 'white' }}
                    onPressRight={() => { Utils.goscreen(this, 'scLichSuSOS') }}
                />
                <View style={{ flex: 1 }}>
                    <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                        <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                            <Text style={{ paddingVertical: 5, fontWeight: 'bold' }}>{'Họ và tên '}<Text style={{ color: colors.redStar }}>*</Text></Text>
                            <TextInputForm
                                styleViewInput={{ borderWidth: 1 }}
                                placeholder='Họ và tên'
                                styleInput={{
                                    padding: 10, backgroundColor: colors.white, fontSize: reText(14),
                                }}
                                value={HoTen}
                                onChangeText={(text) => this.setState({ HoTen: text })}
                                onCheckError={(text) => this.onCheckErrorInput(text, 1)}
                                colorNormal={colors.white}
                            />
                            {/* <TextInput
                                placeholder={'Họ và tên'}
                                value={HoTen}
                                style={{ padding: 10, backgroundColor: colors.white, fontSize: reText(14) }}
                                onChangeText={(text) => this.setState({ HoTen: text })}
                            /> */}
                        </View>
                        <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                            <Text style={{ paddingVertical: 5, fontWeight: 'bold' }}>{'Số điện thoại '}<Text style={{ color: colors.redStar }}>*</Text></Text>
                            <TextInputForm
                                styleViewInput={{ borderWidth: 0.8 }}
                                placeholder={'Số điện thoại'}
                                styleInput={{
                                    padding: 10, backgroundColor: colors.white, fontSize: reText(14),
                                }}
                                value={SoDienThoai}
                                maxLength={11}
                                keyboardType={'phone-pad'}
                                onChangeText={(text) => this.setState({ SoDienThoai: text })}
                                onCheckError={(text) => this.onCheckErrorInput(text, 2)}
                                colorNormal={colors.white}
                            />
                            {/* <TextInput
                                placeholder={'Số điện thoại'}
                                maxLength={11}
                                value={SoDienThoai}
                                keyboardType={'phone-pad'}
                                style={{ padding: 10, backgroundColor: colors.white, fontSize: reText(14) }}
                                onChangeText={(text) => this.setState({ SoDienThoai: text })}
                            /> */}
                        </View>
                        <Text style={{ marginHorizontal: 10, marginTop: 10, fontWeight: 'bold' }}>{'Mô tả'}</Text>
                        <TextInputForm
                            placeholder={'Nội Dung'}
                            styleContainer={{ marginHorizontal: 10, marginTop: 10 }}
                            styleViewInput={{ borderWidth: 1 }}
                            placeholderTextColor={colors.black_20}
                            styleInput={{
                                minHeight: Height(15), maxHeight: Height(20),
                                textAlignVertical: 'top',
                                borderRadius: 3, fontSize: reText(16),
                                backgroundColor: colors.white,
                                justifyContent: 'center',
                            }}
                            multiline={true}
                            value={Mota}
                            onChangeText={text => this.setState({ Mota: text })}
                            onCheckError={(text) => this.onCheckErrorInput(text, 3)}
                            colorNormal={colors.white}
                        />
                        {/* <TextInput
                            style={{
                                minHeight: Height(15), maxHeight: Height(20),
                                textAlignVertical: 'top', backgroundColor: "#F5F5F5",
                                marginTop: 10,
                                marginHorizontal: 10, borderRadius: 3, fontSize: reText(16),
                                color: colors.black, padding: 10, backgroundColor: colors.white,
                            }}
                            multiline={true}
                            value={Mota}
                            onChangeText={text => this.setState({ Mota: text })}
                            placeholder={'Mô tả'}
                            placeholderTextColor={colors.black_20}
                        /> */}
                        <Text style={{ marginHorizontal: 10, marginTop: 10, fontWeight: 'bold' }}>{'Vị trí hiện tại'}</Text>
                        <View pointerEvents={'none'} style={{ width: nwidth() - 20, height: Width(isLandscape() ? 30 : 70), alignSelf: 'center', marginTop: 10, borderWidth: 0.5, borderColor: colors.grayLight }}>
                            <MapView style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                                // mapPadding={{ top: nstyles.Height(80), right: 0, bottom: 0, left: 0 }}
                                provider={PROVIDER_GOOGLE}
                                // showsMyLocationButton={true}
                                ref={ref => this.Map = ref}
                                showsUserLocation={true}
                                initialRegion={latlng}
                                region={latlng}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: latlng.latitude,
                                        longitude: latlng.longitude
                                    }}
                                    title={diaDiem}
                                />
                            </MapView>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' }}>
                            <Image source={Images.icLocation} style={nstyles.nIcon16} resizeMode={'contain'} />
                            <Text style={{ paddingVertical: 5, flex: 1, paddingLeft: 5, fontSize: reText(12), textAlign: 'justify' }}>{diaDiem}</Text>
                        </View>
                        <TouchableOpacity onPress={this.ChooseLocation} style={{ alignSelf: 'flex-start', paddingHorizontal: 10 }}>
                            <Text style={{ fontWeight: 'bold', color: 'red' }}>{'▶︎ Chọn lại vị trí chính xác hơn.'}</Text>
                        </TouchableOpacity>
                        <Text style={{ marginHorizontal: 10, marginTop: 10, fontWeight: 'bold' }}>{'File đính kèm'}</Text>
                        <ImagePickerNew
                            data={ListHinhAnh}
                            dataNew={ListHinhAnh}
                            NumberMax={8}
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
                        >
                        </ImagePickerNew>
                        <ButtonCom
                            text={"Gửi yêu cầu ứng cứu"}
                            onPress={this._sendSOS}
                            style={{ borderRadius: 5, marginHorizontal: 10, }}
                            txtStyle={{ fontSize: reText(14) }}
                        />

                    </KeyboardAwareScrollView>
                    <IsLoading />
                </View>
            </View >
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});
export default Utils.connectRedux(UngCuuKhanCap, mapStateToProps, true);