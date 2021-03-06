import React, { Component, createRef } from 'react';
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

let LATITUDE_DELTA = 0.00922;
let LONGITUDE_DELTA = () => LATITUDE_DELTA * nwidth() / nheight();
const Latitude = appConfig.defaultRegion.latitude, Longitude = appConfig.defaultRegion.longitude;

class GuiCanhBaoCovid extends Component {
    constructor(props) {
        super(props);
        this.refLoading = createRef()
        this.state = {
            HoTen: '',
            SoDienThoai: '',
            latlng: {
                latitude: Latitude,
                longitude: Longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA(),
            },
            diaDiem: '',
            findLocation: true,
            Mota: '',
            ListHinhAnh: [],
            ListHinhAnhDelete: [],
            ListFileDinhKemNew: [],
            dataLyDo: [],
            selectLyDo: {}
        };
    }

    async componentDidMount() {
        if (this.props.auth.userCD) {
            this.setState({ HoTen: this.props.auth.userCD.FullName, SoDienThoai: this.props.auth.userCD.PhoneNumber })
        }
        // if (!this.props.auth.tokenCD) {
        //     Utils.showMsgBoxOK(this, 'Th??ng b??o', 'Vui l??ng ????ng nh???p ????? s??? d???ng ch???c n??ng n??y !', 'OK', () => Utils.goscreen(this, 'login'))
        // }
        this.GetList_SOS_LyDoAll()
        this._hienTai()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    GetList_SOS_LyDoAll = async () => {
        let res = await apis.ApiCBCV.GetList_SOS_LyDoAll()
        Utils.nlog('[LOG] ly do', res)
        if (res.status == 1 && res.data) {
            this.setState({ dataLyDo: res.data })
        } else {
            this.setState({ dataLyDo: [] })
        }
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
        var diaDiem = '??ang l???y d??? li???u v??? tr?? hi???n t???i...';
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


    getCurrentPosition = async (enableThemDiaDiem, tuDongViTri = this.state.tuDongViTri) => {
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
                            latlng: {
                                ...latlng,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA(),
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
                        Utils.showMsgBoxYesNo(this, 'D???ch v??? v??? tr?? b??? t???t', configHome.TenAppHome + ' c???n truy c???p v??? tr?? c???a b???n. H??y b???t D???ch v??? v??? tr?? trong ph???n c??i ?????t ??i???n tho???i c???a b???n.',
                            'Chuy???n t???i c??i ?????t', 'Kh??ng, c???m ??n',
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
                                longitudeDelta: LONGITUDE_DELTA(),
                            }
                        }, this.onPressFindLocation)
                    }
                },
                (error) => {
                    let {
                        code
                    } = error;
                    if (code == 1) {
                        Utils.showMsgBoxYesNo(this, 'D???ch v??? v??? tr?? b??? t???t',
                            '???ng d???ng c???n truy c???p v??? tr?? c???a b???n. H??y b???t d???ch v??? v??? tr?? trong ph???n c??i ?????t ??i???n tho???i c???a b???n.',
                            'Chuy???n t???i c??i ?????t', 'Kh??ng, c???m ??n',
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
            warning += 'H??? v?? t??n b???t bu???c nh???p \n'
        }
        if (!SoDienThoai || SoDienThoai.length < 10) {
            warning += 'S??? ??i???n tho???i ch??a h???p l???'
        }
        // if (!Mota) {
        //     warning += 'M?? t??? b???t bu???c nh???p'
        // }
        if (warning.length > 0) {
            Utils.showMsgBoxOK(this, 'Th??ng b??o', warning)
        } else {
            Utils.showMsgBoxYesNo(this, 'X??c nh???n y??u c???u',
                `Ch???c n??ng n??y ch??? ph???c v??? cho vi???c c???nh b???o covid v?? th??ng tin ph???i ?????m b???o ch??nh x??c. 
        Vi???c khai b??o th??ng tin kh??ng ch??nh x??c, c??? t??nh qu???y ph?? s??? b??? x??? l?? theo quy ?????nh c???a ph??p lu???t

        L??u ??: ch??? s??? d???ng ch???c n??ng n??y khi c???n thi???t.
        `, 'G???i c???nh b??o', 'Xem l???i', () => this.guiCanhBaoCovid()
            )
        }

    }

    guiCanhBaoCovid = async () => {
        this.refLoading.current.show()
        let { HoTen, diaDiem, latlng, SoDienThoai, Mota, ListHinhAnhDelete, ListHinhAnh, ListFileDinhKemNew } = this.state
        let DevicesToken = await Utils.ngetStore(nGlobalKeys.userId_OneSignal, '');
        let dataBoDy = new FormData();
        let dem = 0
        // Utils.nlog("gi?? tr??? lish h??nh ???nh", ListHinhAnh);

        //duy???t h??nh
        for (let index = 0; index < ListFileDinhKemNew.length; index++) {
            let item = ListFileDinhKemNew[index];
            Utils.nlog("Log ra item n??!!", item)
            let file = `File${index == 0 ? '' : index} `;
            dem++;
            if (item.type == 2) {
                if (Platform.OS == 'ios') {
                    const dest = `${RNFS.TemporaryDirectoryPath}${Math.random().toString(36).substring(7)}.mp4`;
                    let uriReturn = await RNFS.copyAssetsVideoIOS(item.uri, dest);
                    await RNCompress.compressVideo(uriReturn, 'medium').then(uri => {
                        console.log("uri m???i nhe", uri);
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
        let res = await apis.ApiCBCV.GuiCanhBaoCovid(dataBoDy)
        this.refLoading.current.hide()
        Utils.nlog('res gui sos=========', res)
        if (res.status == 1) {
            Utils.showMsgBoxOK(this, 'Th??ng b??o', 'G???i c???nh b??o covid th??nh c??ng!', 'X??c nh???n', () => {
                Utils.goscreen(this, 'ManHinh_Home')
            })
        } else {
            Utils.showMsgBoxOK(this, 'Th??ng b??o', res.error?.message ? res.error.message : 'G???i c???nh b??o covid th???t b???i!', 'X??c nh???n')
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
                longitudeDelta: LONGITUDE_DELTA(),
            }
        });
    }

    choseLyDo = (item) => {
        this.setState({ selectLyDo: item })
        if (item && item.Id != 3) {
            this.setState({ Mota: item.Value })
        } else {
            this.setState({ Mota: '' })
        }
    }

    render() {
        const { HoTen, SoDienThoai, diaDiem, latlng, Mota, ListHinhAnh, ListHinhAnhDelete, dataLyDo, selectLyDo } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <HeaderCus
                    title={UtilsApp.getScreenTitle("ManHinh_CanhBaoCovid", 'C???nh b??o Covid')}
                    styleTitle={{ color: colors.white }}
                    iconLeft={Images.icBack}
                    onPressLeft={() => { Utils.goscreen(this, 'ManHinh_Home') }}
                    iconRight={Images.ichistory}
                    Sright={{ tintColor: 'white' }}
                    onPressRight={() => { Utils.goscreen(this, 'scLichSuCanhBaoCovid') }}
                />
                <View style={{ flex: 1 }}>
                    <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                        <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                            <Text style={{ paddingVertical: 5, fontWeight: 'bold' }}>{'H??? v?? t??n '}<Text style={{ color: colors.redStar }}>*</Text></Text>
                            <TextInput
                                placeholder={'H??? v?? t??n'}
                                value={HoTen}
                                style={{ padding: 10, backgroundColor: colors.white, fontSize: reText(14) }}
                                onChangeText={(text) => this.setState({ HoTen: text })}
                            />
                        </View>
                        <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                            <Text style={{ paddingVertical: 5, fontWeight: 'bold' }}>{'S??? ??i???n tho???i '}<Text style={{ color: colors.redStar }}>*</Text></Text>
                            <TextInput
                                placeholder={'S??? ??i???n tho???i'}
                                maxLength={11}
                                value={SoDienThoai}
                                keyboardType={'phone-pad'}
                                style={{ padding: 10, backgroundColor: colors.white, fontSize: reText(14) }}
                                onChangeText={(text) => this.setState({ SoDienThoai: text })}
                            />
                        </View>
                        <Text style={{ marginHorizontal: 10, marginTop: 10, fontWeight: 'bold' }}>{'M?? t???'}</Text>
                        <View>
                            {dataLyDo && dataLyDo.length > 0 ?
                                dataLyDo.map((item, index) => {
                                    return (
                                        <TouchableOpacity onPress={() => this.choseLyDo(item)} key={index} style={{ flexDirection: 'row', padding: 10, alignSelf: 'flex-start' }}>
                                            <Image source={selectLyDo && selectLyDo.Id == item.Id ? Images.icCheck : Images.icUnCheck} />
                                            <Text style={{ fontSize: reText(14), paddingLeft: 10 }}>{item?.Value}</Text>
                                        </TouchableOpacity>
                                    )
                                }) : null
                            }
                        </View>
                        {selectLyDo && selectLyDo.Id == 3 ? <TextInput
                            style={{
                                minHeight: Height(15), maxHeight: Height(20),
                                textAlignVertical: 'top', backgroundColor: "#F5F5F5",
                                marginTop: 10,
                                marginHorizontal: 10, borderRadius: 3, fontSize: reText(16),
                                color: colors.black, padding: 10, backgroundColor: colors.white
                            }}
                            multiline={true}
                            value={Mota}
                            onChangeText={text => this.setState({ Mota: text })}
                            placeholder={'M?? t???'}
                            placeholderTextColor={colors.black_20}
                        /> : null}
                        <Text style={{ marginHorizontal: 10, marginTop: 10, fontWeight: 'bold' }}>{'V??? tr?? hi???n t???i'}</Text>
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
                            <Text style={{ fontWeight: 'bold', color: 'red' }}>{'?????? Ch???n l???i v??? tr?? ch??nh x??c h??n.'}</Text>
                        </TouchableOpacity>
                        <Text style={{ marginHorizontal: 10, marginTop: 10, fontWeight: 'bold' }}>{'File ????nh k??m'}</Text>
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
                            text={"G???i c???nh b??o Covid"}
                            onPress={this._sendSOS}
                            style={{ borderRadius: 5, marginHorizontal: 10, }}
                            txtStyle={{ fontSize: reText(14) }}
                        />

                    </KeyboardAwareScrollView>
                    <IsLoading ref={this.refLoading} />
                </View>
            </View >
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});
export default Utils.connectRedux(GuiCanhBaoCovid, mapStateToProps, true);