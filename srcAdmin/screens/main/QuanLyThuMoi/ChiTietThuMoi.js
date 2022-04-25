import React, { Component, Fragment } from 'react'
import { ScrollView, Text, View, StyleSheet, Image, FlatList, TouchableOpacity, Alert } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { nstyles, nwidth, Width, paddingBotX } from '../../../../styles/styles';
import { HeaderCom, IsLoading, ListEmpty } from '../../../../components';
import { Images } from '../../../../src/images';
import { getCTThuMoi, GetListNK } from '../../../apis/ApiQLThuMoi';
import Utils from '../../../../app/Utils';
import moment from 'moment'
import { colors } from '../../../../styles';
import HtmlViewCom from '../../../../components/HtmlView';
import { reText } from '../../../../styles/size';
import InputRNCom from '../../../../components/ComponentApps/InputRNCom';
import DatePicker from 'react-native-datepicker'
import RNCalendarEvents from 'react-native-calendar-events';
import ImagePicker from '../../../../components/ComponentApps/ImagePicker/ImagePicker';
const widthColumn = () => (nwidth() - 10) / 3
export class ChiTietThuMoi extends Component {
    constructor(props) {
        super(props)
        this.Id = Utils.ngetParam(this, 'Id')
        this.state = {
            dataCT: {},
            dataNguoiKy: [],
            lstNguoiThamDu: [],
            textempty: 'Không có dữ liệu',
            tabView: 1,
            refreshing: true,
        }
    }
    componentDidMount() {
        this._getChiTietThuMoi()
        this._getListNguoiKy()
    }
    _getChiTietThuMoi = async () => {
        nthisIsLoading.show();
        let res = await getCTThuMoi(this.Id)
        if (res && res.status == 1) {
            nthisIsLoading.hide();
            this.setState({ dataCT: res.data, lstNguoiThamDu: res.data.ListThamDu, refreshing: false })
        }
    }
    _getListNguoiKy = async () => {
        let res = await GetListNK()
        if (res && res.status == 1) {
            this.setState({ dataNguoiKy: res.data })
        }
    }
    _goBack = () => { Utils.goback(this) }
    _renderItem = ({ item, index }) => {
        const { lstNguoiThamDu } = this.state;
        return (
            <View key={index} style={{ flexDirection: 'row', }}>
                <View style={{ width: widthColumn() - 20, borderWidth: 0.5, borderBottomWidth: lstNguoiThamDu.length - 1 == index ? 0.5 : 0 }}>
                    <Text style={styles.title}>{item.FullName}</Text>
                </View>
                <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: lstNguoiThamDu.length - 1 == index ? 0.5 : 0 }}>
                    <Text style={styles.title}>{item.TenPhuongXa} </Text>
                </View>
                <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: lstNguoiThamDu.length - 1 == index ? 0.5 : 0 }}>
                    <Text style={styles.title}>{item.ChucVu}</Text>
                </View>
                <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: lstNguoiThamDu.length - 1 == index ? 0.5 : 0 }}>
                    <Text style={styles.title}>{item.ChuTri ? 'Chủ trì' : 'Tham gia'}</Text>
                </View>
            </View>
        )
    }
    _keyExtrac = (item, index) => index.toString();
    onChangTab = (index) => {
        this.setState({ tabView: index })
    }

    render() {
        const { dataCT, dataNguoiKy, lstNguoiThamDu, tabView, refreshing } = this.state;
        const dataNKTemp = dataNguoiKy.filter(e => e.UserID == dataCT.NguoiKy)
        Utils.nlog('Gai tra data temmmm =>>>>>', dataCT)
        const LenDate = dataCT?.ThoiGian?.length
        const days = dataCT?.ThoiGian?.slice(0, 10)
        const time = dataCT?.ThoiGian?.slice(11, LenDate)
        const NgayHT = new Date();
        const timeHT = moment(NgayHT, 'HH:mm:ss').format('HH:mm:ss');
        const songay = moment(NgayHT, 'DD/MM/YYYY').diff(
            moment(days, 'DD/MM/YYYY'),
            'days'
        );
        const sophut = moment(timeHT, 'HH:mm:ss').diff(
            moment(time, 'HH:mm:ss'),
            'minutes'
        );
        const sothang = Math.floor(songay / 30);
        const sogio = Math.floor(sophut / 60);
        const thu = moment(days, 'DD/MM/YYYY').weekday();
        const formatNgay = time => {
            switch (time) {
                case 0:
                    return 'Thứ 2';
                case 1:
                    return 'Thứ 3';
                case 2:
                    return 'Thứ 4';
                case 3:
                    return 'Thứ 5';
                case 4:
                    return 'Thứ 6';
                case 5:
                    return 'Thứ 7';
                case 6:
                    return 'CN';
            }
        };
        const Ngay = moment(dataCT?.ThoiGian, 'DD/MM/YYYY').date()
        const Thang = moment(dataCT?.ThoiGian, 'DD/MM/YYYY').month() + 1
        const Nam = moment(dataCT?.ThoiGian, 'DD/MM/YYYY').year()
        const NgayK = moment(dataCT?.ThoiGianKetThuc, 'DD/MM/YYYY').date()
        const ThangK = moment(dataCT?.ThoiGianKetThuc, 'DD/MM/YYYY').month() + 1
        const NamK = moment(dataCT?.ThoiGianKetThuc, 'DD/MM/YYYY').year()
        const GioK = dataCT?.ThoiGianKetThuc?.slice(11, dataCT?.ThoiGianKetThuc?.length)
        const NoiDung = dataCT?.TrichYeu?.replace(/(<([^>]+)>)/gi, "")
        // Utils.nlog('Gia tri Ngay - Thang - Nam Bat Dau', Ngay, Thang, Nam, time)
        // Utils.nlog('Gia tri Ngay - Thang - Nam Ket Thuc', NgayK, ThangK, NamK, GioK, Utils.ConvertHtmlToText(dataCT?.TrichYeu))
        const baohop = () => {
            var timestar = null;
            var timefn = null;
            if (Platform.OS === "android") {
                timestar = Nam + '-' + Thang + '-' + Ngay + 'T' + time + ':00.000Z';
                timefn = NamK + '-' + ThangK + '-' + NgayK + 'T' + GioK + ':00.000Z';
            } else {
                timestar = Nam + '-' + Thang + '-' + Ngay + 'T' + time + ':00.000GMT+7';
                timefn = NamK + '-' + ThangK + '-' + NgayK + 'T' + GioK + ':00.000GMT+7';
            }

            RNCalendarEvents.requestPermissions(false)
            RNCalendarEvents.checkPermissions(false).then(e => {
                Utils.nlog("e-------", e)

                setTimeout(() => {
                    RNCalendarEvents.saveEvent(dataCT?.TieuDe, {
                        location: dataCT?.DiaDiem,
                        notes: Utils.ConvertHtmlToText(dataCT?.TrichYeu),
                        startDate: timestar,
                        endDate: timefn,
                        // startDate: this.state.dataHop[0].Nam+'-'+this.state.dataHop[0].Thang+'-'+this.state.dataHop[0].Ngay+'T'+this.state.dataHop[0].Gio+':00.000Z',
                        // endDate: this.state.dataHop[0].NamK+'-'+this.state.dataHop[0].ThangK+'-'+this.state.dataHop[0].NgayK+'T'+this.state.dataHop[0].GioK+':00.000Z',
                        alarms: [{
                            date: -30 // or absolute date - iOS Only
                        }]
                    })
                        .then(id => {
                            Utils.showMsgBoxOK(this, 'Thông báo', 'Đã lưu lịch họp của bạn', 'Xác nhận')
                        })
                        .catch(error => {
                            Utils.showMsgBoxOK(this, 'Thông báo', 'Vui lòng khởi động lại ứng dụng', 'Xác nhận')
                        })
                }, 200);

            })

        }
        return (
            <View style={nstyles.ncontainer}>
                <HeaderCom
                    titleText='Chi tiết thư mời'
                    iconLeft={Images.icBack}
                    nthis={this}
                    onPressLeft={this._goBack}
                    iconRight={Images.icThongbao}
                    onPressRight={baohop}
                    customStyleIconRight={{ width: 26, height: 26, alignSelf: 'center', tintColor: 'white' }}
                />
                <View style={[nstyles.nbody, { backgroundColor: colors.white }]}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps='always'
                        style={{ flex: 1 }}
                        extraHeight={100}
                        contentContainerStyle={{ paddingBottom: paddingBotX + 10 }}
                        showsVerticalScrollIndicator={false} style={{ backgroundColor: '#FFFFFF' }}>
                        <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                            <View style={{ flexDirection: 'row' }}>
                                {/* View Trai */}
                                <View style={{}}>
                                    <View style={{ backgroundColor: colors.colorRed, padding: 5, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                                        {/* <Text style={{ color: colors.white, textAlign: 'center', fontSize: reText(13) }} >{time}</Text> */}
                                        <Text style={{ color: colors.white, textAlign: 'center', fontSize: reText(13) }} >{formatNgay(thu)}</Text>
                                    </View>
                                    <View style={{ backgroundColor: colors.white, padding: 5, }}>
                                        <Text style={{ textAlign: 'center', fontSize: reText(13) }} >{Ngay ? Ngay : ''}</Text>
                                        <Text style={{ textAlign: 'center', fontSize: reText(13) }} >{`Tháng ${Thang ? Thang : ''}`}</Text>
                                    </View>
                                    <View style={{ backgroundColor: colors.greenFE, padding: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                                        <Text style={{ color: colors.white, textAlign: 'center', fontSize: reText(13) }} >{Nam ? Nam : ''}</Text>
                                    </View>
                                </View>
                                <View style={{ marginLeft: 10, flex: 1 }}>
                                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                        <Text style={[styles.stTitle, { marginRight: 5, fontWeight: 'bold' }]} >{`Tiêu đề:`}</Text>
                                        <Text style={{ fontSize: reText(14), marginRight: 5, }} >{dataCT.TieuDe}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                        <Text style={[styles.stTitle, { marginRight: 5, fontWeight: 'bold', }]} >{`Người ký:`}</Text>
                                        <Text style={{ fontSize: reText(14), marginRight: 5, }} >{dataNKTemp[0]?.FullName}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={[styles.stTitle, { marginRight: 5, fontWeight: 'bold', marginBottom: 10 }]} >{`Ngày ban hành:`}</Text>
                                        <Text style={{ fontSize: reText(14), marginRight: 5, }} >{dataCT.NgayBanHanh ? moment(dataCT.NgayBanHanh, 'DD/MM/YYYY').format('DD/MM/YYYY') : ''}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', width: '100%' }}>
                                        <Text style={[styles.stTitle, { marginRight: 5, fontWeight: 'bold' }]} >{`Đia điểm họp:`}</Text>
                                        <Text style={{ fontSize: reText(14), flex: 1 }}>{dataCT.DiaDiem}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ height: 1, backgroundColor: colors.black_20, marginVertical: 10 }} />
                            <View style={{
                                paddingTop: 5,
                                paddingHorizontal: 5,
                                // alignItems: "center",
                                marginVertical: 5,
                                paddingVertical: 5,
                                borderWidth: 1,
                                borderStyle: 'dashed',
                                minHeight: 50,
                                borderColor: 'rgba(235,200,0,1)',
                                borderRadius: 5,
                                backgroundColor: 'rgba(235,200,0,0.1)'
                            }}>
                                <Text style={[{ fontWeight: 'bold', fontWeight: 'bold', color: colors.colorHeaderApp }]}>Nội dung cuộc họp: </Text>
                                <HtmlViewCom
                                    html={dataCT && dataCT.TrichYeu ? dataCT.TrichYeu : "<div></div>"}
                                    style={{ height: '100%' }}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                <Text style={[styles.stTitle, { marginRight: 5, }]} >{`Giờ họp:`}</Text>
                                <Text style={{ fontSize: reText(14), marginRight: 5, }} >{dataCT.ThoiGian}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                <Text style={[styles.stTitle, { marginRight: 5, }]} >{`Kết thúc:`}</Text>
                                <Text style={{ fontSize: reText(14), marginRight: 5, }} >{dataCT.ThoiGianKetThuc}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                <Text style={[styles.stTitle, { marginRight: 5, }]} >{`Trạng thái:`}</Text>
                                <Text style={{ fontSize: reText(14), marginRight: 5, }} >{dataCT.IsFinish ? 'Kết thúc' : 'Chưa xong'}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => this.onChangTab(1)}
                                    style={{ backgroundColor: tabView == 1 ? colors.redStar : colors.black_50, padding: 10, width: '50%', borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}>
                                    <Text style={{ textAlign: 'center', color: colors.white }}>{`Thành phần tham dự`}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.onChangTab(2)}
                                    style={{ backgroundColor: tabView == 2 ? colors.redStar : colors.black_50, padding: 10, width: '50%', borderTopRightRadius: 5, borderBottomRightRadius: 5 }}>
                                    <Text style={{ textAlign: 'center', color: colors.white }}>{`Tài liệu`}</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                tabView == 1 ?
                                    <View style={{ marginTop: 5 }}>
                                        <View style={{ flexDirection: 'row', borderBottomWidth: 0.5 }}>
                                            <View style={{ width: widthColumn() - 20, borderWidth: 0.5, borderBottomWidth: 0, }}>
                                                <Text style={[styles.title, { fontWeight: 'bold', textAlign: 'center' }]}>{`Người tham dự`}</Text>
                                            </View>
                                            <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0, }}>
                                                <Text style={[styles.title, { fontWeight: 'bold', textAlign: 'center' }]}>{`Trực thuộc`}</Text>
                                            </View>

                                            <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0, }}>
                                                <Text style={[styles.title, { fontWeight: 'bold', textAlign: 'center' }]}>{`Chức vụ`}</Text>
                                            </View>
                                            <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0, }}>
                                                <Text style={[styles.title, { fontWeight: 'bold', textAlign: 'center' }]}>{`Vai trò`}</Text>
                                            </View>
                                        </View>
                                        <FlatList
                                            data={lstNguoiThamDu}
                                            style={{}}
                                            renderItem={this._renderItem}
                                            keyExtractor={this._keyExtrac}
                                            // refreshing={refreshing}
                                            ListEmptyComponent={<ListEmpty textempty={this.state.textempty} />}
                                        // onRefresh={this._onRefresh}
                                        />
                                    </View> :
                                    <View style={{ marginHorizontal: -10 }}>
                                        <ImagePicker data={dataCT.FileDinhKem ? dataCT.FileDinhKem.map(item => { return { ...item, Link: item.Link } }) : []}
                                            NumberMax={4}
                                            isEdit={false}
                                            keyname={"TenFile"} uniqueKey={'Link'} nthis={this}
                                            // onDeleteFileOld={(data) => {
                                            //     let dataNew = [...ListFileDinhKemDelete].push(data)
                                            //     this.setState({ ListFileDinhKemDelete: dataNew })
                                            // }}
                                            // onAddFileNew={(data) => {
                                            //     this.setState({ ListFileDinhKemNew: data })
                                            // }}
                                            ShowTitle={false}
                                        >
                                        </ImagePicker>
                                    </View>

                            }
                        </View>
                    </KeyboardAwareScrollView>
                </View>
                {
                    refreshing == true ? <IsLoading /> : null
                }
            </View >
        )
    }
}
const styles = StyleSheet.create({
    stTitle: {
        fontSize: reText(14),
        color: colors.colorHeaderApp,
    },
    title: {
        fontSize: reText(12),
        textAlign: 'center',
        paddingVertical: 10
    }
})
export default ChiTietThuMoi
