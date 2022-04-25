import React, { Component, useRef } from 'react'
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { nstyles, nwidth, Width } from '../../../../styles/styles';
import { HeaderCom, IsLoading, ListEmpty } from '../../../../components';
import { getDSThuMoi, GetListCQBH } from '../../../apis/ApiQLThuMoi';
import Utils from '../../../../app/Utils';

import moment from 'moment'
import { colors } from '../../../../styles';
import HtmlViewCom from '../../../../components/HtmlView';
import { reText } from '../../../../styles/size';
import InputRNCom from '../../../../components/ComponentApps/InputRNCom';
import DatePicker from 'react-native-datepicker'
import { Images } from '../../../images';
const ComponentChonNgay = (props) => {
    const ref = useRef();
    const onPress = () => {
        ref.current.onPressDate();
    };
    return (
        <TouchableOpacity
            onPress={props.isEdit ? onPress : () => { }}
            style={{ width: "50%" }}
        >
            <View pointerEvents="none" style={{ width: "100%" }}>
                <InputRNCom
                    styleContainer={{ paddingHorizontal: 5, width: "100%" }}
                    styleBodyInput={{
                        borderColor: colors.colorGrayIcon,
                        borderRadius: 3,
                        borderWidth: 0.5,
                        minHeight: 40,
                        alignItems: "center",
                        paddingVertical: 0,
                        width: "100%",
                    }}
                    labelText={props.title}
                    styleLabel={{
                        color: colors.colorGrayText,
                        fontWeight: "bold",
                        fontSize: reText(14),
                    }}
                    sufix={
                        <View style={{ alignItems: "center", flexDirection: "row" }}>
                            <View
                                style={{
                                    height: 30,
                                    width: 30,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Image
                                    // defaultSource={Images.icCalendar}
                                    source={Images.icCalendar}
                                    style={{ width: 15, height: 15 }}
                                    resizeMode="contain"
                                />
                            </View>
                            <DatePicker
                                style={{ borderWidth: 0, width: "0%" }}
                                date={props.value}
                                mode="date"
                                disabled={false}
                                placeholder={props.placeholder}
                                format="DD/MM/YYYY"
                                confirmBtnText="Xác nhận"
                                cancelBtnText="Huỷ"
                                showIcon={false}
                                androidMode="spinner"
                                hideText={true}
                                locale="vi"
                                ref={ref}
                                customStyles={{
                                    datePicker: {
                                        backgroundColor: "#d1d3d8",
                                        justifyContent: "center",
                                    },
                                    dateInput: {
                                        paddingHorizontal: 5,
                                        borderWidth: 0,
                                        alignItems: "flex-start",
                                    },
                                }}
                                // hideText={true}

                                onDateChange={props.onChangTextIndex}
                            />
                        </View>
                    }
                    placeholder={props.placeholder}
                    styleInput={{}}
                    styleError={{ backgroundColor: "white" }}
                    styleHelp={{ backgroundColor: "white" }}
                    placeholderTextColor={colors.black_16}
                    // errorText={'Ngày sinh  không hợp lệ'}
                    // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                    valid={true}
                    value={props.value}
                    onChangeText={props.onChangTextIndex}
                />
            </View>
        </TouchableOpacity>
    );
};
//
const ComponentLinhVuc = (props) => {
    return (
        <TouchableOpacity style={{ width: "50%" }} onPress={props.isEdit ? props.onPress : () => { }}>
            <View pointerEvents={"none"}>
                <InputRNCom
                    styleContainer={{ paddingHorizontal: 5, marginTop: 5 }}
                    styleBodyInput={{
                        borderColor: colors.colorGrayIcon,
                        borderRadius: 3,
                        borderWidth: 0.5,
                        minHeight: 40,
                        alignItems: "center",
                        paddingVertical: 0,
                    }}
                    labelText={props.title}
                    styleLabel={{
                        color: colors.colorGrayText,
                        fontWeight: "bold",
                        fontSize: reText(14),
                    }}
                    // sufixlabel={<View>
                    //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                    // </View>}
                    placeholder={props.placeholder}
                    styleInput={{}}
                    styleError={{ backgroundColor: "white" }}
                    styleHelp={{ backgroundColor: "white" }}
                    placeholderTextColor={colors.black_30}
                    // errorText={'Tôn giáo không hợp lệ'}
                    // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                    editable={false}
                    valid={true}
                    prefix={null}
                    value={props.value}
                    onChangeText={props.onChangTextIndex}
                    sufix={
                        <View
                            style={{
                                height: 30,
                                width: 30,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Image
                                // defaultSource={Images.icDropDown}
                                source={Images.icDropDown}
                                style={{ width: 15, height: 15 }}
                                resizeMode="contain"
                            />
                        </View>
                    }
                />
            </View>
        </TouchableOpacity>
    );
};
const dataTrangThai = [
    {
        IdTrangThai: -1,
        TenTrangThai: 'Tất cả'
    },
    {
        IdTrangThai: 1,
        TenTrangThai: 'Đã xem'
    },
    {
        IdTrangThai: 0,
        TenTrangThai: 'Chưa xem'
    },
]
export class ThuMoiHome extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dataThuMoi: [],
            refreshing: true,
            textempty: 'Không có dữ liệu',
            keyword: '',
            tungay: moment(new Date(), "DD/MM/YYYY").add(-90, 'days').format('DD/MM/YYYY'),
            denngay: moment(new Date(), "DD/MM/YYYY").format('DD/MM/YYYY'),
            selectTrangThai: [{ IdTrangThai: -1, TenTrangThai: "Tất cả" }],
            dataCoquan: [],
            selectCoQuan: [{ MaPX: -1, TenPhuongXa: "Tất cả" }]
        }
    }
    componentDidMount() {
        this._getDSThuMoi()
        this._getDSCoQuan()
    }
    _getDSThuMoi = async () => {
        const { tungay, denngay, keyword, selectCoQuan, selectTrangThai } = this.state;
        nthisIsLoading.show();
        let res = await getDSThuMoi(moment(tungay, "DD/MM/YYYY").format('DD-MM-YYYY'), moment(denngay, "DD/MM/YYYY").format('DD-MM-YYYY'), keyword, selectTrangThai.IdTrangThai, selectCoQuan.MaPX)
        if (res && res.status == 1) {
            nthisIsLoading.hide();
            this.setState({ dataThuMoi: res.data, refreshing: false })
        }
    }
    _getDSCoQuan = async () => {
        let res = await GetListCQBH()
        if (res && res.status == 1) {
            this.setState({ dataCoquan: [{ MaPX: -1, TenPhuongXa: 'Tất cả' }, ...res.data ? res.data : []] })
        }
    }
    _openMenu = () => {
        this.props.navigation.openDrawer();
    }
    _onRefresh = () => {
        this.setState({ refreshing: true, textempty: 'Đang tải...', }, this._getDSThuMoi);
    }
    renderItem = ({ item, index }) => {
        const LenDate = item?.TGH.length
        const days = item?.TGH.slice(0, 10)
        const time = item?.TGH.slice(11, LenDate)
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
        const Ngay = moment(item.TGH, 'DD/MM/YYYY').date()
        const Thang = moment(item.TGH, 'DD/MM/YYYY').month() + 1
        const Nam = moment(item.TGH, 'DD/MM/YYYY').year()
        return (
            <TouchableOpacity key={index}
                onPress={() => Utils.goscreen(this, 'scChiTietThuMoi', { Id: item.IdRow })}
                style={{
                    flex: 1, backgroundColor: colors.white, marginBottom: 10,
                    padding: 10, borderRadius: 5, flexDirection: 'row'
                }}>
                {/*View trai */}
                <View style={{}}>
                    <View style={{ backgroundColor: colors.colorRed, padding: 5, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                        <Text style={{ color: colors.white, textAlign: 'center', fontSize: reText(13) }} >{time}</Text>
                        <Text style={{ color: colors.white, textAlign: 'center', fontSize: reText(13) }} >{formatNgay(thu)}</Text>
                    </View>
                    <View style={{ backgroundColor: colors.white, padding: 5, }}>
                        <Text style={{ textAlign: 'center', fontSize: reText(13) }} >{Ngay}</Text>
                        <Text style={{ textAlign: 'center', fontSize: reText(13) }} >{`Tháng ${Thang}`}</Text>
                    </View>
                    <View style={{ backgroundColor: colors.greenFE, padding: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
                        <Text style={{ color: colors.white, textAlign: 'center', fontSize: reText(13) }} >{Nam}</Text>
                    </View>
                </View>
                {/*View phai */}
                <View style={{ marginLeft: 10, flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text numberOfLines={2} style={{ fontSize: reText(14), fontWeight: 'bold', flex: 1 }} >{item.SoThuMoi}</Text>
                        <Text style={{ fontSize: reText(14) }} >{moment(item.NgayBanHanh).format('DD/MM/YYYY')}</Text>
                    </View>
                    <View style={{ height: Platform.OS == 'ios' ? 55 : 62 }}>
                        <HtmlViewCom
                            html={item.TrichYeu ? item.TrichYeu : '<div></div>'}
                            style={{ height: '100%' }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={Images.icHoTro} style={[nstyles.nIcon20, { tintColor: colors.colorGrayIcon }]} />
                            <Text style={{ fontSize: reText(14), marginLeft: 5 }}>{item.TPTD}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Image source={Images.icLocation} style={[{ tintColor: colors.colorGrayIcon, }]} />
                        <Text style={{ fontSize: reText(12), marginLeft: 10, flex: 1 }}>{item.DiaDiem}</Text>
                        <View style={{
                            justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: colors.greenFE,
                            paddingHorizontal: 5, paddingVertical: 3, borderRadius: 5,
                            backgroundColor: item.Status == 1 ? colors.colorBlue : colors.greenFE, maxHeight: 30
                        }}>
                            <Text style={{ fontSize: reText(12), fontWeight: 'bold', color: colors.white }}>{item.Status == 1 ? 'Đã gửi' : 'Đã thu hồi'}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity >

        )
    }
    _keyExtrac = (item, index) => index.toString();
    onChangeTextIndex = (val, index) => {
        const { tungay, denngay, selectCoQuan, selectTrangThai } = this.state
        Utils.nlog('Gia tri vall tra ve', val)
        switch (index) {
            case 1: {
                this.setState({ selectTrangThai: val, refreshing: true }, this._getDSThuMoi)
            }
            case 2: {
                this.setState({ selectCoQuan: val, refreshing: true }, this._getDSThuMoi)
            }
            case 4:
                {
                    if (denngay != "") {
                        let check = moment(denngay, "DD/MM/YYYY").isAfter(
                            moment(val, "DD/MM/YYYY")
                        );
                        if (check == true) {
                            this.setState({ tungay: val, refreshing: true }, this._getDSThuMoi);
                        } else {
                            Utils.showMsgBoxOK(
                                this,
                                "Thông báo",
                                "Từ ngày phải nhỏ hơn đến ngày",
                                "Xác nhận"
                            );
                            return;
                        }
                    } else {
                        this.setState({ tungay: val, refreshing: true }, this._getDSThuMoi);
                    }
                }
                break;
            case 5:
                {
                    if (tungay != "") {
                        let check = moment(tungay, "DD/MM/YYYY").isBefore(
                            moment(val, "DD/MM/YYYY")
                        );
                        if (check == true) {
                            this.setState({ denngay: val, refreshing: true }, this._getDSThuMoi);
                        } else {
                            Utils.showMsgBoxOK(
                                this,
                                "Thông báo",
                                "Đến ngày phải lớn hơn từ ngày",
                                "Xác nhận"
                            );
                            return;
                        }
                    } else {
                        this.setState({ denngay: val, refreshing: true }, this._getDSThuMoi);
                    }
                }
                break;
            default:
                break;
        }
    };
    _viewItem = (item, key) => {
        // Utils.nlog("giá tị item", item)
        return (
            <View
                // key={item}
                style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    margin: 2,
                }}
            >
                <Text style={{ textAlign: "center", paddingVertical: 10 }}>
                    {item[key]}
                </Text>
            </View>
        );
    };
    _dropDown = (index) => {
        switch (index) {
            case 1:
                {
                    Utils.goscreen(this, "Modal_ComponentSelectProps", {
                        callback: (val) => this.onChangeTextIndex(val, 1),
                        item: this.state.selectTrangThai,
                        title: "Danh sách trạng thái",
                        AllThaoTac: dataTrangThai,
                        ViewItem: (item) => this._viewItem(item, "TenTrangThai"),
                        Search: true,
                        key: "TenTrangThai",
                    });
                }
                break;
            case 2:
                {
                    Utils.goscreen(this, "Modal_ComponentSelectProps", {
                        callback: (val) => this.onChangeTextIndex(val, 2),
                        item: this.state.selectCoQuan,
                        title: "Danh sách cơ quan ban hành",
                        AllThaoTac: this.state.dataCoquan,
                        ViewItem: (item) => this._viewItem(item, "TenPhuongXa"),
                        Search: true,
                        key: "TenPhuongXa",
                    });
                }
                break;
            default:
                break;
        }
    };
    _onChange = (vals) => {
        this.setState({ keyword: vals }, this._getDSThuMoi)
    }
    render() {
        const { dataThuMoi, refreshing, keyword, tungay, denngay, selectCoQuan, selectTrangThai } = this.state;
        Utils.nlog('Gia tri data thu moi ', dataThuMoi)
        return (
            <View style={nstyles.ncontainer}>
                <HeaderCom
                    titleText='Danh sách thư mời'
                    iconLeft={Images.icSlideMenu}
                    nthis={this}
                    onPressLeft={this._openMenu}
                    iconRight={null}
                />
                <View style={[nstyles.nbody]}>
                    <View
                        style={{
                            paddingBottom: 10, borderWidth: 0.5, marginHorizontal: 10,
                            borderRadius: 10, marginTop: 10,
                            borderColor: colors.colorBlueLight, backgroundColor: colors.white
                        }} >
                        <View style={{ flexDirection: "row", paddingHorizontal: 10, width: "100%", }}>
                            <ComponentChonNgay
                                value={tungay}
                                title={`Từ ngày`}
                                placeholder={"Chọn từ ngày"}
                                onChangTextIndex={(val) => this.onChangeTextIndex(val, 4)}
                                isEdit={true}
                            />
                            <ComponentChonNgay
                                value={denngay}
                                title={`Đến ngày`}
                                placeholder={"Chọn đến ngày"}
                                onChangTextIndex={(val) => this.onChangeTextIndex(val, 5)}
                                isEdit={true}
                            />
                        </View>
                        <View style={{ flexDirection: "row", paddingHorizontal: 10, width: "100%", }}>
                            <ComponentLinhVuc
                                title={"Trạng thái"}
                                placeholder={"Chọn trạng thái"}
                                value={selectTrangThai?.TenTrangThai}
                                onPress={() => this._dropDown(1)}
                                isEdit={true}
                            />
                            <ComponentLinhVuc
                                title={"Cơ quan thi hành"}
                                placeholder={"Chọn cơ quan"}
                                value={selectCoQuan?.TenPhuongXa}
                                onPress={() => this._dropDown(2)}
                                isEdit={true}
                            />
                        </View>
                        <View style={{ marginHorizontal: 15, backgroundColor: colors.colorGrayBgr, paddingVertical: 10, marginTop: 5, borderRadius: 5 }}>
                            <TextInput
                                placeholder={`Tìm kiếm `}
                                style={{ paddingHorizontal: 10, paddingVertical: 0 }}
                                value={keyword}
                                onChangeText={text => this._onChange(text)}
                            />
                        </View>
                    </View>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={{ marginVertical: 10, marginHorizontal: 15 }}
                        data={dataThuMoi}
                        renderItem={this.renderItem}
                        keyExtractor={this._keyExtrac}
                        refreshing={refreshing}
                        ListEmptyComponent={<ListEmpty textempty={this.state.textempty} />}
                        onRefresh={this._onRefresh}
                    />
                </View>
                {
                    refreshing == true ? <IsLoading /> : null
                }
            </View>
        )
    }
}

export default ThuMoiHome
