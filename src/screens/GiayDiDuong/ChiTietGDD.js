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
                        Alert.alert('Thông báo', 'Lưu thành công.')
                    })
                } catch (error) {
                    console.log('errrr====', error)
                    Alert.alert('Thông báo', 'Đã xảy ra lỗi! Vui lòng thử lại sau.')
                }
            },
            error => console.error("Oops, snapshot failed", error)
        );
    }

    confirm = async () => {
        const { LyDo, Duyet, NgayHen, DataDetails } = this.state

        if (Duyet && !NgayHen) {
            Utils.showToastMsg('Thông báo', 'Vui lòng chọn ngày hẹn', icon_typeToast.warning)
            return
        }
        if (!Duyet && !LyDo) {
            Utils.showToastMsg('Thông báo', 'Vui lòng nhập lý di không duyệt', icon_typeToast.warning)
            return
        }

        let body = {//khi duyệt thì bắt buộc chọn ngày hẹn, khi không duyệt thì bắt buộc nhập lý do
            "Id": DataDetails?.Id,
            "Status": Duyet ? "1" : "2",//1 duyệt, 2 không duyệt
            "NgayHen": NgayHen,
            "LyDo": LyDo
        }

        Utils.nlog('BODY xac nhan', body, this.data)
        nthisIsLoading.show()
        let res = await apis.apiIOC.Duyet_GiayDiDuong(body)
        Utils.nlog('res xac nhan', res)
        nthisIsLoading.hide()
        if (res.status == 1) {
            Utils.showToastMsg('Thông báo', res?.error?.message || `Thực hiện ${Duyet ? 'Duyệt' : 'Không duyệt'} thất bại.`, icon_typeToast.success, 3000, icon_typeToast.success)
            this.reloadList(DataDetails?.Id)
            Utils.goback(this)
        } else {
            Utils.showToastMsg('Thông báo', res?.error?.message || `Thực hiện ${Duyet ? 'Duyệt' : 'Không duyệt'} thất bại.`, icon_typeToast.danger, 3000, icon_typeToast.danger)
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
            Utils.openWeb(this, DataDetails?.GiayThongHanh ? DataDetails?.GiayThongHanh : '', { isShowMenuWeb: false, title: 'Giấy thông hành', })
        } else {
            Utils.showToastMsg('Thông báo', 'Không có dữ liệu giấy thông hành', icon_typeToast.info, 3000)
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
        const trangthai = DataDetails?.Status ? DataDetails.Status == 0 ? 'Chờ duyệt' : DataDetails.Status == 1 ? 'Đã duyệt' : DataDetails.Status == 2 ? 'Không duyệt' : '' : 'Chờ duyệt'
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
                    title={"Chi tiết giấy đi đường"}
                    styleTitle={{ color: colors.white }}
                    iconLeft={Images.icBack}
                    onPressLeft={() => { Utils.goback(this) }}
                />
                <View style={{ flex: 1 }}>
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: colors.white }} contentContainerStyle={{ paddingBottom: 50 }}>
                        <View collapsable={false} ref={ref => this.refViewQR = ref} style={{ backgroundColor: colors.white }}>
                            <Text style={{ fontWeight: 'bold', textAlign: 'center', color: colors.redStar, padding: 10, fontSize: reText(20) }}>{'Giấy xác nhận đi đường'.toUpperCase()}</Text>
                            <TextLine title={'Họ và tên'} value={this.isDuyet ? DataDetails?.FullName : userCD?.FullName ? userCD?.FullName : ''} />
                            <TextLine title={'CMND/CCCD/Hộ chiếu'} value={this.isDuyet ? DataDetails?.CMND : userCD?.CMND ? userCD?.CMND : ''} />
                            <TextLine title={'Từ ngày'} value={`${DataDetails?.startDate ? DataDetails.startDate : ''} ${DataDetails?.startTime ? DataDetails.startTime : ''} `} />
                            <TextLine title={'Đền ngày'} value={`${DataDetails?.endDate ? DataDetails.endDate : ''} ${DataDetails?.totime ? DataDetails.totime : ''} `} />
                            <TextLine title={'Cơ quan'} value={DataDetails?.bussiness ? DataDetails.bussiness : ''} styleValue={{ color: colors.redStar, fontWeight: 'bold' }} />
                            <TextLine title={'Địa chỉ cơ quan'} value={`${DataDetails?.bussinessAddress ? DataDetails.bussinessAddress : ''}`} />
                            <TextLine title={'Điểm đi'} value={`${DataDetails?.startAddress ? DataDetails.startAddress : ''}`} />
                            <TextLine title={'Điểm đến'} value={`${DataDetails?.endAddress ? DataDetails.endAddress : ''}`} />
                            <TextLine title={'Tuyến đường'} />
                            <Text style={{ textAlign: 'justify', margin: 10, padding: 10, backgroundColor: colors.BackgroundHome }}>
                                {DataDetails?.route ? DataDetails.route : ''}
                            </Text>
                            <TextLine title={'Mục đích tham gia giao thông'} />
                            <Text style={{ textAlign: 'justify', margin: 10, padding: 10, backgroundColor: colors.BackgroundHome }}>
                                {DataDetails?.purposeInTraffic ? DataDetails.purposeInTraffic : ''}
                            </Text>
                            {
                                this.isDuyet &&
                                <>
                                    <TextLine title={'Ảnh CMND/CCCD/Hộ chiếu'} />
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
                                                !DataDetails?.AnhCMNDT && <Text style={{ fontSize: reText(12), color: colors.black_40, marginVertical: 5 }}>{'Không có dữ liệu'}</Text>
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
                                                !DataDetails?.AnhCMNDS && <Text style={{ fontSize: reText(12), color: colors.black_40, marginVertical: 5 }}>{'Không có dữ liệu'}</Text>
                                            }
                                        </TouchableOpacity>

                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this.openGiayThongHanh()}
                                        style={{ flexDirection: 'row', alignItems: 'center', padding: 10, alignSelf: 'flex-start' }}>
                                        <Text style={{ fontWeight: 'bold' }}>{'Giấy thông hành'}</Text>
                                        <Text style={{ marginLeft: 5, color: colors.redStar, fontStyle: 'italic', textDecorationLine: 'underline' }}>{'(Xem chi tiết tại đây)'}</Text>
                                    </TouchableOpacity>
                                    <TextLine title={'Giấy tờ khác'} value={arrImg.length > 0 || arrLinkFile.length > 0 ? '' : 'Không có'} />
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
                            <TextLine title={'Cơ quan cấp'} value={DataDetails?.TenPhuongXa ? DataDetails?.TenPhuongXa : ''} />
                            {
                                DataDetails?.Status == 2 ?
                                    <TextLine title={'Lý do'} value={DataDetails?.LyDo ? DataDetails?.LyDo : ''} /> : null
                            }
                            {
                                DataDetails?.Status == 1 ?
                                    <TextLine title={'Ngày hẹn'} value={DataDetails?.NgayHen ? DataDetails?.NgayHen : ''} /> : null
                            }
                            <View style={{ flexDirection: 'row', marginTop: 5, margin: 10, }}>
                                <Text style={{
                                    fontSize: reText(14), color: DataDetails?.Status ? DataDetails.Status == 0 ? colors.orangCB : DataDetails.Status == 1 ? colors.greenFE : DataDetails.Status == 2 ? colors.redStar : '' : colors.orangCB,
                                    fontWeight: 'bold'
                                }}>Trạng thái:</Text>
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
                                            <Text style={{ paddingVertical: 5, fontWeight: 'bold', marginLeft: 10 }}>Duyệt</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.setState({ Duyet: false })} style={{ padding: 15 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Image source={Duyet ? Images.icUnCheck : Images.icCheck} resizeMode='contain' />
                                            <Text style={{ paddingVertical: 5, fontWeight: 'bold', marginLeft: 10 }}>Không duyệt</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {
                                    Duyet ?
                                        <View style={{ marginHorizontal: 10 }}>
                                            <Text style={{ paddingVertical: 5, fontWeight: 'bold' }}>Ngày hẹn</Text>
                                            <DatePicker
                                                customStyles={{
                                                    datePicker: {
                                                        backgroundColor: '#d1d3d8',
                                                        justifyContent: 'center',
                                                    },
                                                }}
                                                locale={'vi'}
                                                date={this.state.NgayHen}
                                                confirmBtnText={'Xác nhận'}
                                                cancelBtnText={'Hủy'}
                                                mode="date"
                                                placeholder="Chọn ngày hẹn"
                                                showIcon={false}
                                                format={'DD-MM-YYYY'}
                                                style={{ width: '100%' }}
                                                onDateChange={(date) => this.setState({ NgayHen: date })}

                                            />
                                        </View> : <TextInput
                                            onChangeText={text => this.setState({ LyDo: text })}
                                            placeholder={'Nhập lý do không duyệt'}
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
                                    text={'Xác nhận'}
                                />
                            </View>
                            :
                            <>
                                {
                                    !this.isDuyet ?
                                        <>
                                            <Text style={{ fontWeight: 'bold', textAlign: 'justify', color: colors.redStar, padding: 10, fontSize: reText(14) }}>{'(*) Khuyến nghị: Nên lưu ảnh giấy xác nhận đi đường xuống thiết bị để xử lý nhanh hơn khi qua các chốt kiểm soát'}</Text>
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
                                                text={'Lưu ảnh giấy xác nhận'}
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
                                            text={'Quay lại'}
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
