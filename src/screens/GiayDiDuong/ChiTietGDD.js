import CameraRoll from '@react-native-community/cameraroll'
import React, { Component } from 'react'
import { FlatList, ScrollView, Text, View, TouchableOpacity, PermissionsAndroid, Alert, TextInput, Image, Linking } from 'react-native'
import { appConfigCus } from '../../../app/Config'
import Utils, { icon_typeToast } from '../../../app/Utils'
import { ButtonCom, HeaderCus, IsLoading } from '../../../components'
import HtmlViewCom from '../../../components/HtmlView'
import ImageFileCus from '../../../srcAdmin/screens/PhanAnhHienTruong/components/ImageFileCus'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Height, nstyles, Width } from '../../../styles/styles'
import apis from '../../apis'
import { Images } from '../../images'
import { captureRef } from "react-native-view-shot";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DatePicker from 'react-native-datepicker'
import DetailsUnit from '../Introduction/DetailsUnit'
import ImageCus from '../../../components/ImageCus'

const TextLine = (props) => {
    let { title = '', value = '', styleValue = {}, onPressValue } = props
    return (
        <View {...props} style={{ flexDirection: 'row', backgroundColor: colors.white, alignItems: 'flex-start', padding: 3, paddingHorizontal: 10, paddingVertical: 8 }}>
            <Text style={{ fontWeight: 'bold', minWidth: Width(25), fontSize: reText(14) }}>{title}: </Text>
            <TouchableOpacity activeOpacity={onPressValue ? 0.5 : 1} onPress={onPressValue} style={{ flex: 1 }}>
                <Text style={[{ flex: 1, textAlign: 'justify', fontSize: reText(14) }, styleValue]}>{value}</Text>
            </TouchableOpacity>
        </View>
    )
}
export class ChiTietGDD extends Component {
    constructor(props) {
        super(props)
        this.ID = Utils.ngetParam(this, 'ID', '')
        this.data = Utils.ngetParam(this, 'data', '')
        this.isDuyet = Utils.ngetParam(this, 'isDuyet', false)
        this.reloadList = Utils.ngetParam(this, 'reloadList', () => { })
        this.state = {
            DataDetails: this.isDuyet ? this.data : '',
            LyDo: '',
            NgayHen: '',
            Duyet: true
        };
    };

    componentDidMount() {
        console.log('[LOG] data params', this.data)
        if (!this.isDuyet) {
            this.GetDetailsIOC()
        }
    }

    GetDetailsIOC = async () => {
        nthisIsLoading.show();
        let res = await apis.ApiApp.ChiTietGiayDiDuong(this.ID)
        nthisIsLoading.hide();
        Utils.nlog('res details giay di duong', res)
        if (res.status == 1 && res.data) {
            this.setState({ DataDetails: res.data, })
        } else {
            nthisIsLoading.hide();
            this.setState({ DataDetails: '', })
        }
    }

    hasAndroidRequestReadStoragePermission = async () => {
        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
            return true;
        }
        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
    }

    saveQR = async () => {
        if (Platform.OS == 'android') {
            let granted = await this.hasAndroidRequestReadStoragePermission();
            if (!granted)
                return
        }
        captureRef(this.refViewQR, {
            format: "jpg",
            quality: 1
        }).then(
            async uri => {
                try {
                    await CameraRoll.save(uri, { type: 'photo' }).then(link => {
                        Alert.alert('Th??ng b??o', 'L??u th??nh c??ng.')
                    })
                } catch (error) {
                    console.log('errrr====', error)
                    Alert.alert('Th??ng b??o', '???? x???y ra l???i! Vui l??ng th??? l???i sau.')
                }
            },
            error => console.error("Oops, snapshot failed", error)
        );
    }

    confirm = async () => {
        const { LyDo, Duyet, NgayHen, DataDetails } = this.state

        if (Duyet && !NgayHen) {
            Utils.showToastMsg('Th??ng b??o', 'Vui l??ng ch???n ng??y h???n', icon_typeToast.warning)
            return
        }
        if (!Duyet && !LyDo) {
            Utils.showToastMsg('Th??ng b??o', 'Vui l??ng nh???p l?? di kh??ng duy???t', icon_typeToast.warning)
            return
        }

        let body = {//khi duy???t th?? b???t bu???c ch???n ng??y h???n, khi kh??ng duy???t th?? b???t bu???c nh???p l?? do
            "Id": DataDetails?.Id,
            "Status": Duyet ? "1" : "2",//1 duy???t, 2 kh??ng duy???t
            "NgayHen": NgayHen,
            "LyDo": LyDo
        }

        Utils.nlog('BODY xac nhan', body, this.data)
        nthisIsLoading.show()
        let res = await apis.apiIOC.Duyet_GiayDiDuong(body)
        Utils.nlog('res xac nhan', res)
        nthisIsLoading.hide()
        if (res.status == 1) {
            Utils.showToastMsg('Th??ng b??o', res?.error?.message || `Th???c hi???n ${Duyet ? 'Duy???t' : 'Kh??ng duy???t'} th???t b???i.`, icon_typeToast.success, 3000, icon_typeToast.success)
            this.reloadList(DataDetails?.Id)
            Utils.goback(this)
        } else {
            Utils.showToastMsg('Th??ng b??o', res?.error?.message || `Th???c hi???n ${Duyet ? 'Duy???t' : 'Kh??ng duy???t'} th???t b???i.`, icon_typeToast.danger, 3000, icon_typeToast.danger)
        }
    }

    showImage = (link = '', index = 0) => {
        if (link) {
            Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: [{ url: link }], index });
        }
    }

    openGiayThongHanh = () => {
        const { DataDetails } = this.state
        if (DataDetails?.GiayThongHanh) {
            Utils.openWeb(this, DataDetails?.GiayThongHanh ? DataDetails?.GiayThongHanh : '', { isShowMenuWeb: false, title: 'Gi???y th??ng h??nh', })
        } else {
            Utils.showToastMsg('Th??ng b??o', 'Kh??ng c?? d??? li???u gi???y th??ng h??nh', icon_typeToast.info, 3000)
        }

    }

    onOpenFile = (uri = '') => () => {
        let temp = uri.toLowerCase();
        if (temp.includes(".avi") || temp.includes(".mp4") || temp.includes(".mov") || temp.includes(".wmv") || temp.includes(".flv"))
            Utils.goscreen(this, 'Modal_PlayMedia', { source: uri });
        else
            Linking.openURL(uri);
    }

    render() {
        const { DataDetails, Duyet } = this.state
        const { userCD, tokenCD, tokenDH } = this.props.auth
        const trangthai = DataDetails?.Status ? DataDetails.Status == 0 ? 'Ch??? duy???t' : DataDetails.Status == 1 ? '???? duy???t' : DataDetails.Status == 2 ? 'Kh??ng duy???t' : '' : 'Ch??? duy???t'
        let arrImg = [], arrLinkFile = [];
        if (DataDetails?.HinhAnhDinhKem && DataDetails?.HinhAnhDinhKem.length > 0) {
            DataDetails?.HinhAnhDinhKem.forEach(item => {
                const url = item.Path;
                let checkImage = Utils.checkIsImage(url);
                if (checkImage) {
                    arrImg.push({
                        url: url
                    })
                } else {
                    arrLinkFile.push({ ...item, url: url, name: item.FileName })
                }
            });
        }
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                {/* Header */}
                <HeaderCus
                    title={"Chi ti???t gi???y ??i ???????ng"}
                    styleTitle={{ color: colors.white }}
                    iconLeft={Images.icBack}
                    onPressLeft={() => { Utils.goback(this) }}
                />
                <View style={{ flex: 1 }}>
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: colors.white }} contentContainerStyle={{ paddingBottom: 50 }}>
                        <View collapsable={false} ref={ref => this.refViewQR = ref} style={{ backgroundColor: colors.white }}>
                            <Text style={{ fontWeight: 'bold', textAlign: 'center', color: colors.redStar, padding: 10, fontSize: reText(20) }}>{'Gi???y x??c nh???n ??i ???????ng'.toUpperCase()}</Text>
                            <TextLine title={'H??? v?? t??n'} value={this.isDuyet ? DataDetails?.FullName : userCD?.FullName ? userCD?.FullName : ''} />
                            <TextLine title={'CMND/CCCD/H??? chi???u'} value={this.isDuyet ? DataDetails?.CMND : userCD?.CMND ? userCD?.CMND : ''} />
                            <TextLine title={'T??? ng??y'} value={`${DataDetails?.startDate ? DataDetails.startDate : ''} ${DataDetails?.startTime ? DataDetails.startTime : ''} `} />
                            <TextLine title={'?????n ng??y'} value={`${DataDetails?.endDate ? DataDetails.endDate : ''} ${DataDetails?.totime ? DataDetails.totime : ''} `} />
                            <TextLine title={'C?? quan'} value={DataDetails?.bussiness ? DataDetails.bussiness : ''} styleValue={{ color: colors.redStar, fontWeight: 'bold' }} />
                            <TextLine title={'?????a ch??? c?? quan'} value={`${DataDetails?.bussinessAddress ? DataDetails.bussinessAddress : ''}`} />
                            <TextLine title={'??i???m ??i'} value={`${DataDetails?.startAddress ? DataDetails.startAddress : ''}`} />
                            <TextLine title={'??i???m ?????n'} value={`${DataDetails?.endAddress ? DataDetails.endAddress : ''}`} />
                            <TextLine title={'Tuy???n ???????ng'} />
                            <Text style={{ textAlign: 'justify', margin: 10, padding: 10, backgroundColor: colors.BackgroundHome }}>
                                {DataDetails?.route ? DataDetails.route : ''}
                            </Text>
                            <TextLine title={'M???c ????ch tham gia giao th??ng'} />
                            <Text style={{ textAlign: 'justify', margin: 10, padding: 10, backgroundColor: colors.BackgroundHome }}>
                                {DataDetails?.purposeInTraffic ? DataDetails.purposeInTraffic : ''}
                            </Text>
                            {
                                this.isDuyet &&
                                <>
                                    <TextLine title={'???nh CMND/CCCD/H??? chi???u'} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <TouchableOpacity
                                            onPress={() => { this.showImage(DataDetails?.AnhCMNDT ? DataDetails?.AnhCMNDT : '') }}
                                            style={{
                                                flex: 1, height: Height(15), backgroundColor: colors.colorPaleGrey,
                                                marginRight: 5, alignItems: 'center', justifyContent: 'center'
                                            }}>
                                            <ImageCus
                                                defaultSourceCus={Images.icUser}
                                                source={{ uri: DataDetails?.AnhCMNDT ? DataDetails?.AnhCMNDT : '' }}
                                                style={DataDetails?.AnhCMNDT ? { width: '100%', height: '100%' } : {}}
                                                resizeMode='contain'
                                            />
                                            {
                                                !DataDetails?.AnhCMNDT && <Text style={{ fontSize: reText(12), color: colors.black_40, marginVertical: 5 }}>{'Kh??ng c?? d??? li???u'}</Text>
                                            }

                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => { this.showImage(DataDetails?.AnhCMNDS ? DataDetails?.AnhCMNDS : '') }}
                                            style={{
                                                flex: 1, height: Height(15), backgroundColor: colors.colorPaleGrey,
                                                marginLeft: 5, alignItems: 'center', justifyContent: 'center'
                                            }}>
                                            <ImageCus
                                                defaultSourceCus={Images.icUser}
                                                source={{ uri: DataDetails?.AnhCMNDS ? DataDetails?.AnhCMNDS : '' }}
                                                style={DataDetails?.AnhCMNDS ? { width: '100%', height: '100%' } : {}}
                                                resizeMode='contain'
                                            />
                                            {
                                                !DataDetails?.AnhCMNDS && <Text style={{ fontSize: reText(12), color: colors.black_40, marginVertical: 5 }}>{'Kh??ng c?? d??? li???u'}</Text>
                                            }
                                        </TouchableOpacity>

                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this.openGiayThongHanh()}
                                        style={{ flexDirection: 'row', alignItems: 'center', padding: 10, alignSelf: 'flex-start' }}>
                                        <Text style={{ fontWeight: 'bold' }}>{'Gi???y th??ng h??nh'}</Text>
                                        <Text style={{ marginLeft: 5, color: colors.redStar, fontStyle: 'italic', textDecorationLine: 'underline' }}>{'(Xem chi ti???t t???i ????y)'}</Text>
                                    </TouchableOpacity>
                                    <TextLine title={'Gi???y t??? kh??c'} value={arrImg.length > 0 || arrLinkFile.length > 0 ? '' : 'Kh??ng c??'} />
                                    <ScrollView horizontal style={{}}>
                                        {arrImg.length > 0 && arrImg.map((item, index) => {
                                            return <TouchableOpacity onPress={() => { Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: arrImg, index }); }} style={{ backgroundColor: colors.colorPaleGrey, marginLeft: 10 }}>
                                                <ImageCus source={{ uri: item?.url }} resizeMode='contain' style={{ width: Width(25), height: Width(20) }} />
                                            </TouchableOpacity>
                                        })}
                                    </ScrollView>
                                    <View style={{ paddingHorizontal: 10, marginTop: 5 }}>
                                        {
                                            arrLinkFile.length > 0 && arrLinkFile.map((item, index) => {
                                                <TouchableOpacity
                                                    onPress={this.onOpenFile(item.url)}
                                                    style={{ padding: 10, alignSelf: 'flex-start' }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Image source={Images.icAttached} style={{ width: Width(2), height: Width(4), marginRight: 10, alignSelf: 'center' }} resizeMode='stretch' />
                                                        <Text style={{ color: colors.colorBlueLight }} numberOfLines={2}>{item?.name ? item?.name : '---'}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            })
                                        }
                                    </View>
                                </>
                            }
                            <TextLine title={'C?? quan c???p'} value={DataDetails?.TenPhuongXa ? DataDetails?.TenPhuongXa : ''} />
                            {
                                DataDetails?.Status == 2 ?
                                    <TextLine title={'L?? do'} value={DataDetails?.LyDo ? DataDetails?.LyDo : ''} /> : null
                            }
                            {
                                DataDetails?.Status == 1 ?
                                    <TextLine title={'Ng??y h???n'} value={DataDetails?.NgayHen ? DataDetails?.NgayHen : ''} /> : null
                            }
                            <View style={{ flexDirection: 'row', marginTop: 5, margin: 10, }}>
                                <Text style={{
                                    fontSize: reText(14), color: DataDetails?.Status ? DataDetails.Status == 0 ? colors.orangCB : DataDetails.Status == 1 ? colors.greenFE : DataDetails.Status == 2 ? colors.redStar : '' : colors.orangCB,
                                    fontWeight: 'bold'
                                }}>Tr???ng th??i:</Text>
                                <Text style={{
                                    fontSize: reText(14), flex: 1, paddingLeft: 10, fontWeight: 'bold',
                                    color: DataDetails?.Status ? DataDetails.Status == 0 ? colors.orangCB : DataDetails.Status == 1 ? colors.greenFE : DataDetails.Status == 2 ? colors.redStar : '' : colors.orangCB
                                }}> {trangthai}</Text>
                            </View>

                        </View>
                        {this.isDuyet && DataDetails?.Status == 0 ?
                            <View>
                                <View style={{ flexDirection: 'row', }}>
                                    <TouchableOpacity onPress={() => this.setState({ Duyet: true })} style={{ padding: 15 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Image source={Duyet ? Images.icCheck : Images.icUnCheck} resizeMode='contain' />
                                            <Text style={{ paddingVertical: 5, fontWeight: 'bold', marginLeft: 10 }}>Duy???t</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.setState({ Duyet: false })} style={{ padding: 15 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Image source={Duyet ? Images.icUnCheck : Images.icCheck} resizeMode='contain' />
                                            <Text style={{ paddingVertical: 5, fontWeight: 'bold', marginLeft: 10 }}>Kh??ng duy???t</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {
                                    Duyet ?
                                        <View style={{ marginHorizontal: 10 }}>
                                            <Text style={{ paddingVertical: 5, fontWeight: 'bold' }}>Ng??y h???n</Text>
                                            <DatePicker
                                                customStyles={{
                                                    datePicker: {
                                                        backgroundColor: '#d1d3d8',
                                                        justifyContent: 'center',
                                                    },
                                                }}
                                                locale={'vi'}
                                                date={this.state.NgayHen}
                                                confirmBtnText={'X??c nh???n'}
                                                cancelBtnText={'H???y'}
                                                mode="date"
                                                placeholder="Ch???n ng??y h???n"
                                                showIcon={false}
                                                format={'DD-MM-YYYY'}
                                                style={{ width: '100%' }}
                                                onDateChange={(date) => this.setState({ NgayHen: date })}

                                            />
                                        </View> : <TextInput
                                            onChangeText={text => this.setState({ LyDo: text })}
                                            placeholder={'Nh???p l?? do kh??ng duy???t'}
                                            multiline
                                            style={{ padding: 10, textAlignVertical: 'top', margin: 10, backgroundColor: colors.BackgroundHome, minHeight: 100, borderRadius: 5, maxHeight: 150 }}
                                        />
                                }
                                <ButtonCom
                                    onPress={() => this.confirm()}
                                    Linear={true}
                                    disabled={!(tokenDH && tokenDH.length > 3)}
                                    colorChange={this.props.theme.colorLinear.color}
                                    shadow={false}
                                    txtStyle={{ color: colors.white, fontSize: reText(13) }}
                                    style={{
                                        margin: Height(1), borderRadius: 5,
                                        alignSelf: 'center',
                                        width: Width(95)
                                    }}
                                    text={'X??c nh???n'}
                                />
                            </View>
                            :
                            <>
                                {
                                    !this.isDuyet ?
                                        <>
                                            <Text style={{ fontWeight: 'bold', textAlign: 'justify', color: colors.redStar, padding: 10, fontSize: reText(14) }}>{'(*) Khuy???n ngh???: N??n l??u ???nh gi???y x??c nh???n ??i ???????ng xu???ng thi???t b??? ????? x??? l?? nhanh h??n khi qua c??c ch???t ki???m so??t'}</Text>
                                            <ButtonCom
                                                onPress={() => this.saveQR()}
                                                Linear={true}
                                                disabled={!(tokenCD && tokenCD.length > 3)}
                                                colorChange={this.props.theme.colorLinear.color}
                                                shadow={false}
                                                txtStyle={{ color: colors.white, fontSize: reText(13) }}
                                                style={{
                                                    margin: Height(1), borderRadius: 5,
                                                    alignSelf: 'center',
                                                    width: Width(90)
                                                }}
                                                text={'L??u ???nh gi???y x??c nh???n'}
                                            />
                                        </>
                                        :
                                        <ButtonCom
                                            onPress={() => Utils.goback(this)}
                                            Linear={true}
                                            disabled={!(tokenCD && tokenCD.length > 3)}
                                            colorChange={[colors.grayLight, colors.grayLight]}
                                            shadow={false}
                                            txtStyle={{ color: colors.white, fontSize: reText(13) }}
                                            style={{
                                                margin: Height(1), borderRadius: 5,
                                                alignSelf: 'center',
                                                width: Width(90)
                                            }}
                                            text={'Quay l???i'}
                                        />
                                }
                            </>
                        }
                    </KeyboardAwareScrollView>
                </View>
                <IsLoading />
            </View >
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,

});
export default Utils.connectRedux(ChiTietGDD, mapStateToProps, true);
