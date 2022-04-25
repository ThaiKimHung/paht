import React, { Component } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View, Dimensions, Platform, TextInput, ScrollView, BackHandler, Keyboard, Alert } from 'react-native'
import { nstyles, paddingTopMul, Width } from '../../../../styles/styles'
import { Images } from '../../../images'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import Utils from '../../../../app/Utils'
import apis from '../../../apis'
import { ButtonCom, HeaderCus, IsLoading } from '../../../../components'
import WebView from 'react-native-webview'
const ItemView = (props) => {
    const { title = '', value = '' } = props
    return (
        <View style={{ flexDirection: 'row', paddingVertical: reText(5) }}>
            <Text style={{ fontSize: reText(15), color: colors.black_50, }}>{title}</Text>
            <Text style={{
                flex: 1, textAlign: 'right', color: colors.black_80,
                fontSize: reText(16), fontWeight: 'bold'
            }}>{value}</Text>
        </View>
    )
}

export class HomeThanhToan extends Component {
    constructor(props) {
        super(props)
        this.callBack = Utils.ngetParam(this, 'callBack')
        this.IdHoSo = Utils.ngetParam(this, 'IdHoSo')
        this.state = {
            searchkey: Utils.ngetParam(this, "IDHS", ''),// Utils.ngetParam(this, "IDHS", ''),
            data: '',
            reFreshing: false,
            linkTT: '',
            isShowChoose: false,
            isAuto: Utils.ngetParam(this, "IDHS", '') ? true : false
        }
        this.refLoading = React.createRef(null);
        this.webview = React.createRef(null);

    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        if (this.state.searchkey != '' || this.IdHoSo) {

            this.apiGet_HSDVC();
        }
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    backAction = () => {
        if (this.state.isShowChoose || this.state.linkTT) {
            this.setState({ linkTT: '', isShowChoose: false })
            return true;
        } else {
            Utils.goscreen(this, 'ManHinh_Home')
            return true;
        }
    };

    goBack = () => {
        Utils.goscreen(this, 'ManHinh_Home')
    }
    apiGet_HSDVC = async () => {
        Keyboard.dismiss()
        const { searchkey } = this.state
        this.refLoading.current.show();
        this.setState({ reFreshing: true })
        let res = await apis.ApiDVC.Get_HSDVC({ idhs: this.IdHoSo ? this.IdHoSo : searchkey });
        Utils.nlog("res thanh toán lấy requesst", res);
        this.refLoading.current.hide();
        if (res.status == 1) {
            this.setState({ data: res.data[0], reFreshing: false })
        } else {
            this.setState({ data: '', reFreshing: false })
        }
    }
    _onChangeTextKey = (val) => {
        this.setState({ searchkey: val })
    }
    _onChonLoaiThanhToan = async () => {
        this.setState({ isShowChoose: true })
    }

    _onThanhToanDVCQG = async () => {
        const { searchkey, data, reFreshing } = this.state
        this.refLoading.current.show();
        let res = await apis.ApiDVC.ThanhToanTrucTuyenXLDVCQG(data);

        this.refLoading.current.hide();
        if (res.status == 1) {
            const { data } = res
            this.setState({ linkTT: data.data })
        } else {
            Utils.showMsgBoxOK(this, "Thông báo", "Đã có lỗi xảy ra,Vui lòng thực hiện lại", "Xác nhận", () => { })
        }
    }
    _onNavigationStateChange = async (webViewState) => {
        const { searchkey } = this.state
        let CodeSSO = webViewState.url.toString()
        if (CodeSSO.includes('https://dichvucong.tayninh.gov.vn/KetQuaThanhToanDVCQG')) {
            //Da dang nhap
            let code = CodeSSO.split('responseCode=')[1].split('&')[0]
            nthisIsLoading.show()
            if (code == '00') {
                this.setState({ linkTT: '' })
                this.refLoading.current.hide();
                Utils.showMsgBoxYesNo(this, 'Thông báo', 'Thanh toán thành công\nbạn có muốn in biên lai không !', 'Xác nhận', "Thoát", () => {
                    Utils.goscreen(this, "scBienLaiTT", {
                        IDHS: searchkey
                    })
                }, () => {
                    Utils.goback(this);
                })
            } else {
                this.refLoading.current.hide();
                Utils.showMsgBoxOK(this, 'Thông báo', 'Thanh toán không thành công !', 'Xác nhận', () => {

                })
            }
        } else {
            this.refLoading.current.hide();
        }

    }
    _cancel = () => {
        this.setState({ linkTT: '' })
    }

    render() {
        const { searchkey, data, reFreshing, linkTT, isShowChoose, isAuto } = this.state;
        // Utils.nlog("giá trị link TTT", linkTT)
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={this.callBack ? this.callBack : () => Utils.goscreen(this, 'ManHinh_Home')}
                    iconLeft={Images.icBack}
                    title={'Thanh toán trực tuyến'}
                    styleTitle={{ color: colors.white }}
                />
                <View style={{ flex: 1, backgroundColor: colors.turquoiseBlue_10, padding: reText(10), }}>
                    {
                        isAuto == false ? <View style={{ backgroundColor: colors.white, padding: reText(10), borderRadius: 5, }}>
                            <Image source={Images.bnCongThanhToan} style={{ width: '100%', height: 100, marginBottom: 10 }} />

                            <View style={{ flexDirection: 'row', backgroundColor: colors.paleGreyThree, padding: 7, borderRadius: 5, borderWidth: 0.5, borderColor: colors.black_11 }}>
                                <View style={{ flex: 1 }}>
                                    <TextInput

                                        placeholder={'Nhập mã hồ sơ'}
                                        style={{
                                            borderRadius: 3, fontSize: reText(15), flex: 1, fontWeight: 'bold', justifyContent: 'center',
                                            paddingHorizontal: reText(15),
                                        }}
                                        value={searchkey}
                                        onChangeText={this._onChangeTextKey}
                                    />
                                </View>
                                <TouchableOpacity style={{
                                    paddingVertical: 10, backgroundColor: colors.colorTextSelect, alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center',
                                    borderRadius: 5
                                }}
                                    onPress={this.apiGet_HSDVC}
                                >
                                    <Text style={{
                                        fontWeight: 'bold',
                                        fontSize: reText(16), color: colors.white, paddingHorizontal: reText(7),
                                    }}>Tìm kiếm</Text>
                                </TouchableOpacity>
                            </View>

                        </View> : false
                    }

                    <View style={{ flex: 1, backgroundColor: 'white', marginTop: 10, paddingHorizontal: reText(10), paddingVertical: reText(10) }}>
                        {
                            reFreshing ? <View>

                            </View> : null
                        }
                        {
                            data ? <ScrollView showsVerticalScrollIndicator={false}>


                                <ItemView title={'Mã hồ sơ :'} value={data.HoSoID} />
                                <ItemView title={'Mã loại hồ sơ :'} value={data.MaLoaiHoSo} />

                                <ItemView title={'Tên loại hồ sơ :'} value={`${data.TenLoaiHoSo}`} />
                                <ItemView title={'Địa chỉ liên hệ :'} value={`${data.DiaChiLienHe}`} />
                                <ItemView title={'Tên lệ phí:'} value={`${data.TenLePhi}`} />
                                <View style={{ flexDirection: 'row', paddingVertical: reText(5) }}>
                                    <Text style={{ fontSize: reText(15), color: colors.black_50, }}>{'Lệ phí'}</Text>
                                    <Text style={{
                                        flex: 1, textAlign: 'right', color: colors.colorRoyal,
                                        fontSize: reText(16), fontWeight: 'bold'
                                    }}>{data.LePhi} vnđ</Text>
                                </View>
                                <View style={{ flexDirection: 'row', paddingVertical: reText(5) }}>
                                    <Text style={{ fontSize: reText(15), color: colors.black_50, }}>{'Mức phí'}</Text>
                                    <Text style={{
                                        flex: 1, textAlign: 'right', color: colors.colorRoyal,
                                        fontSize: reText(16), fontWeight: 'bold'
                                    }}>{data.MucPhi} vnđ</Text>
                                </View>



                                <View style={{ flexDirection: 'row', paddingVertical: reText(5) }}>
                                    <Text style={{ fontSize: reText(15), color: colors.black_50, }}>{'Số tiền thanh toán'}</Text>
                                    <Text style={{
                                        flex: 1, textAlign: 'right', color: colors.colorSalmon,
                                        fontSize: reText(16), fontWeight: 'bold'
                                    }}>{data.SoTienThanhToan} vnđ</Text>
                                </View>
                                <View style={{ flexDirection: 'row', paddingVertical: reText(5) }}>
                                    <Text style={{ fontSize: reText(15), color: colors.black_50, }}>{'Số tiền đã thanh toán'}</Text>
                                    <Text style={{
                                        flex: 1, textAlign: 'right', color: colors.colorSalmon,
                                        fontSize: reText(16), fontWeight: 'bold'
                                    }}>{data.DaThanhToan} vnđ</Text>
                                </View>


                                <View style={{ flexDirection: 'row', backgroundColor: colors.coral, height: 1 }}></View>
                                <ItemView title={'Họ tên người nộp :'} value={data.HoTenNguoiNop} />
                                <ItemView title={'Ngày sinh :'} value={`${data.NgaySinh}-${data.ThangSinh}-${data.NamSinh}`} />
                                <ItemView title={'Sdt người nộp :'} value={`${data.DienThoaiNguoiNop}`} />
                                <ItemView title={'Địa chỉ đăng ký :'} value={`${data.DiaChiDangKy}`} />
                            </ScrollView> : null

                        }
                        {data ? data.DaThanhToan == 1 ? null :
                            <ButtonCom
                                text={"Thanh toán"}
                                style={{ borderRadius: 5 }}
                                onPress={this._onChonLoaiThanhToan}
                            />
                            : null}

                    </View>
                    <IsLoading ref={this.refLoading}></IsLoading>

                </View>
                {
                    isShowChoose ?
                        <View onTouchEnd={() => this.setState({ isShowChoose: false })} style={{
                            width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)',
                            position: 'absolute', justifyContent: 'center', alignContent: 'center'
                        }}>
                            <View style={{ width: '95%', backgroundColor: colors.white, position: 'absolute', alignSelf: 'center', borderRadius: 10 }}>
                                <Text style={{
                                    alignSelf: 'center', fontSize: reText(18), fontWeight: 'bold', marginTop: 10, color: colors.colorTextSelect
                                }}>CHỌN HÌNH THỨC THANH TOÁN</Text>
                                <View style={{ marginHorizontal: 15, marginTop: 10, marginBottom: 15 }}>
                                    <TouchableOpacity style={{ borderWidth: 0.5, borderColor: colors.colorTextSelect, borderRadius: 5 }}
                                        onPress={() => this._onThanhToanDVCQG()}>
                                        {/* <Text style={{ fontSize: reText(15), color: colors.black_80 }}>Thanh toán trên cổng DVCQG</Text> */}
                                        <Image source={Images.bnDVCQC} style={{ width: '100%', height: 70, borderRadius: 5 }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ borderWidth: 0.5, paddingHorizontal: 15, paddingVertical: 10, marginTop: 5, borderColor: colors.colorTextSelect, flexDirection: 'row', borderRadius: 5 }}
                                        onPress={() => Alert.alert('Thông báo', 'Chức năng đang phát triển')}>
                                        <Image source={Images.icDichVC} style={{ width: 50, height: 50 }} />
                                        <Text style={{ fontSize: reText(15), color: colors.colorTextSelect, alignSelf: 'center', marginLeft: 10, fontWeight: 'bold' }}>Thanh toán VCB</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ borderWidth: 0.5, paddingHorizontal: 15, paddingVertical: 10, marginTop: 5, borderColor: colors.colorTextSelect, flexDirection: 'row', borderRadius: 5 }}
                                        onPress={() => Alert.alert('Thông báo', 'Chức năng đang phát triển')}>
                                        <Image source={Images.icDichVC} style={{ width: 50, height: 50 }} />
                                        <Text style={{ fontSize: reText(15), color: colors.colorTextSelect, alignSelf: 'center', marginLeft: 10, fontWeight: 'bold' }}>Thanh toán trên cổng PayGov</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View> : null
                }
                {
                    linkTT ? <View style={{
                        position: 'absolute', top: 0, left: 0, right: 0,
                        bottom: 10, backgroundColor: colors.white,
                    }}>
                        <View style={{ flex: 1 }}>
                            <HeaderCus title={'Thanh toán trực tuyến'} styleTitle={{ color: 'white' }} />
                            <WebView
                                ref={this.webview}
                                source={{ uri: linkTT }}
                                onNavigationStateChange={this._onNavigationStateChange}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                injectedJavaScript={''}
                                startInLoadingState={false}
                                sharedCookiesEnabled={true}
                                incognito={true} // Không sử dụng storge & data trong vòng đời cửa webview
                            />
                        </View>
                        <ButtonCom
                            text={"Hủy thanh toán"}
                            Linear={true}
                            colorChange={[colors.grayLight, colors.brownGreyThree]}
                            style={{ borderRadius: 5, marginHorizontal: 13, paddingVertical: 8 }}
                            onPress={this._cancel}
                        />
                    </View> : null

                }
            </View >
        )
    }
}

export default HomeThanhToan
