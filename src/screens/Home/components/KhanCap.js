import React, { Component, createRef } from 'react'
import { Text, View, Image, TouchableOpacity, Linking, Platform, ScrollView, Animated, TextInput } from 'react-native'
import apis from '../../../apis'
import { nGlobalKeys } from '../../../../app/keys/globalKey'
import Utils from '../../../../app/Utils'
import { Images } from '../../../images'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import { nstyles, Height } from '../../../../styles/styles'
import * as Animatable from 'react-native-animatable'
import LinearGradient from 'react-native-linear-gradient'
import { appConfig } from '../../../../app/Config'
import UtilsApp from '../../../../app/UtilsApp'
import { IsLoading } from '../../../../components'

export class KhanCap extends Component {
    constructor(props) {
        super(props)
        //--check: Cài config có tìm kiếm số liên hệ? Hiện tại chỉ có Long An là bật true. 
        //--Và bật Chức năng này để NGhiệm Thu (hiện tại là Pleiku)
        this.check = Utils.getGlobal(nGlobalKeys.ChucNangNghiemThu, {}).hotlineDonVi;
        this.isSDTYTe = Utils.getGlobal(nGlobalKeys.isSDTYTe, false)
        this.state = {
            sodienthoai: [],
            title: Utils.getGlobal(nGlobalKeys.titleHoTro, 'AN NINH, TRẬT TỰ'),
            datatp: [],
            itemtp: {
                "children": [],
                "data": {},
                "state": { selected: false },
                "text": "Nhấn để chọn",
                // "check": true
            },
            itemdv: {
                "children": [],
                "data": {},
                "state": { selected: false },
                "text": "Nhấn để chọn",
                // "check": true
            },

            opacity: new Animated.Value(0),
            isHoTroYTe: false, // chọn gọi cho hỗ trợ y tế
            sodienthoaiYTe: [],
            lstDanhMuc: [],
            selectDanhMuc: { Id: 1, TenLoai: 'Phản ánh hiện trường' },
            filterPhone: '',
        }
        this.refLoading = createRef()
    }

    async componentDidMount() {
        this.GetSDT_DonVi()
        this._startAnimation(0.4)
        this.GetList_HeThong()
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 350);
    };

    _goback = () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                // this.comeback();
                Utils.goback(this)
            });
        }, 100);
    }

    GetList_LienHe = async (keywword) => {
        const { selectDanhMuc } = this.state;
        this.refLoading.current.show()
        let res = await apis.ApiApp.GetList_LienHe(selectDanhMuc.Id, keywword)
        this.refLoading.current.hide()
        Utils.nlog("GetList_LienHe:", res);
        if (res.status == 1) {
            this.setState({ sodienthoai: res.data })
        } else {
            this.setState({ sodienthoai: [] })
        }
    }
    GetList_HeThong = async () => {
        this.refLoading.current.show()
        let res = await apis.ApiApp.GetList_DM_HeThong()
        this.refLoading.current.hide()
        Utils.nlog("GetList_DM_HeThong:", res);
        if (res.status == 1) {
            this.setState({
                lstDanhMuc: res.data,
                selectDanhMuc: res.data && res.data.length > 0 ? res.data[0] : { Id: 1, TenLoai: 'Phản ánh hiện trường' }
            }, this.GetList_LienHe)
        } else {
            this.setState({ lstDanhMuc: [] }, this.GetList_LienHe)
        }
    }
    AddYTe = async () => {
        this.setState({ isHoTroYTe: !this.state.isHoTroYTe }, async () => {
            if (this.state.isHoTroYTe) {
                let res = await apis.ApiApp.GetList_LienHe(3)
                if (res.status == 1) {
                    this.setState({ sodienthoaiYTe: res.data })
                }
                else {
                    this.setState({ sodienthoaiYTe: [] })
                }
            }
            else {
                this.setState({ sodienthoaiYTe: [] })
            }
        })

    }

    GetSDT_DonVi = async () => {
        let res = await apis.ApiXuPhatCD.LayTreeDonViCD();
        Utils.nlog("Xử lý< ", res)
        Utils.nlog("Xử lý2< ", res.data?.children)
        if (res.status == 1) {
            this.setState({
                datatp: res.data.children
            })
        }
    }

    dialCall = (number) => {
        Utils.nlog("<><><>", number)
        let phoneNumber = '';
        if (number == undefined) {
            Utils.showMsgBoxOK(this, "Thông báo", "Chưa có số điện thoại", 'Xác nhận')
            return;
        }
        if (Utils.validateEmail(number)) {
            phoneNumber = `mailto:${number}`;
        } else if (Platform.OS === 'android') {
            phoneNumber = `tel:${number}`;
        }
        else {
            phoneNumber = `telprompt:${number}`;
        }
        Linking.openURL(phoneNumber)

    };

    OpenModalDrop = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectProps', {
            callback: (val) => this.setState({
                itemtp: val, itemdv: {
                    "children": [],
                    "data": {},
                    "state": { selected: false },
                    "text": "Nhấn để chọn",
                    // "check": true
                }
            }), item: this.state.itemtp,
            AllThaoTac: this.state.datatp, ViewItem: item => this._viewItem(item, 'text'), Search: true, key: 'text'
        })
    }

    _viewItem = (item, value) => {
        Utils.nlog('Log [item]', item)
        return (
            <View key={item.id} style={{
                flex: 1,
                paddingVertical: 15,
                borderBottomColor: colors.black_50,
            }}>
                <Text style={{ textAlign: 'center', color: colors.colorTextSelect }} >{item[value]}</Text>
            </View>
        )
    }

    OpenModalDrop_DV = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectProps', {
            callback: (val) => this.setState({ itemdv: val }), item: this.state.itemdv,
            AllThaoTac: this.state.itemtp.children, ViewItem: item => this._viewItem(item, 'text'), Search: true, key: 'text'
        })
    }
    OpenModalDrop_DM = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectProps', {
            callback: (val) => this.setState({ selectDanhMuc: val }, this.GetList_LienHe), item: this.state.selectDanhMuc,
            AllThaoTac: this.state.lstDanhMuc, ViewItem: item => this._viewItem(item, 'TenLoai'), Search: true, key: 'TenLoai',
            title: 'Danh mục hỗ trợ',
        })
    }

    onTextChange = (val) => {
        // callAPI(val)
        this.setState({ filterPhone: val })
        Utils.searchTimer(this, () => this.GetList_LienHe(val));
    }

    render() {
        const { sodienthoai, sodienthoaiYTe, title, itemdv, itemtp, opacity, lstDanhMuc, selectDanhMuc, filterPhone } = this.state
        // Utils.showMsgBoxOK("Test")
        Utils.nlog("<><><>", lstDanhMuc, selectDanhMuc.Id)
        return (
            <View style={[nstyles.ncontainer, {
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                paddingVertical: this.check ? Height(10) : Height(20),
            }]}
            >
                <Animated.View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'black', opacity }} onTouchEnd={this._goback} />
                <Animatable.View animation={'zoomInDown'} style={{
                    width: this.check ? '90%' : '80%', height: '100%',
                    minHeight: Height(65), maxHeight: Height(80), backgroundColor: colors.redStar, borderRadius: 15
                }}>

                    <View style={{
                        backgroundColor: colors.nocolor,
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                        borderTopRightRadius: 15, borderTopLeftRadius: 15, borderWidth: 2,
                        borderColor: colors.yellowLight, borderBottomWidth: 0.5,
                    }}>
                        <Image source={Images.icKhanCap} style={[nstyles.nIcon30, { tintColor: colors.yellowLight }]} />
                        <Text style={{ fontWeight: 'bold', fontSize: reText(15), color: colors.yellowLight, padding: 15, alignSelf: 'center' }}>
                            {UtilsApp.getScreenTitle("Modal_KhanCap", 'Hỗ trợ khẩn cấp').toUpperCase()}
                        </Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} style={[nstyles.shadown, {
                        zIndex: 1000,
                        borderRadius: 15, borderWidth: 2, borderTopRightRadius: 0, borderTopLeftRadius: 0,
                        borderBottomRightRadius: 0, borderBottomLeftRadius: 0, borderBottomWidth: 0,
                        borderColor: colors.yellowLight,
                        backgroundColor: colors.nocolor,
                        borderTopWidth: 0
                    }]}>
                        {
                            lstDanhMuc && lstDanhMuc.length ? <TouchableOpacity
                                onPress={this.OpenModalDrop_DM}
                                style={{
                                    flexDirection: 'row', paddingHorizontal: 10,
                                    borderColor: colors.yellowLight, borderWidth: 1,
                                    justifyContent: 'space-between',
                                    alignItems: 'center', borderRadius: 3,
                                    margin: 5
                                }}>
                                <Text style={{ padding: 10, color: colors.white }}>
                                    {selectDanhMuc.TenLoai}
                                </Text>
                                <Image source={Images.icNext} style={[{ tintColor: colors.white, width: 14, height: 12, transform: [{ rotate: '90deg' }] }]} />
                            </TouchableOpacity> : null
                        }
                        <View style={{
                            marginVertical: 7,
                            marginHorizontal: 5,
                            flexDirection: 'row',
                            borderWidth: 1,
                            borderRadius: 3,
                            borderColor: colors.yellowLight,
                            alignItems: 'center'
                        }}>
                            <TextInput
                                style={{
                                    height: 40,
                                    paddingHorizontal: 10,
                                    color: colors.white,
                                    flex: 1 // để lấy full fouces
                                }}
                                value={filterPhone}
                                placeholderTextColor={colors.white}
                                onChangeText={this.onTextChange}
                                placeholder={'Tìm kiếm'}
                            />
                        </View>
                        {this.isSDTYTe ?
                            <TouchableOpacity onPress={() => this.AddYTe()} style={{ marginLeft: 10, flexDirection: 'row', marginTop: 10 }}>
                                <Image source={this.state.isHoTroYTe ? Images.icCheck : Images.icUnCheck} style={{ tintColor: colors.yellowLight, width: 18, height: 18, alignSelf: 'center' }} />
                                <Text style={{ marginLeft: 5, fontSize: reText(15), alignSelf: 'center', color: colors.yellowLight, fontWeight: 'bold' }}>Hỗ trợ y tế</Text>
                            </TouchableOpacity> : null}
                        {
                            sodienthoai ?
                                sodienthoai.map((item, index) => {
                                    let DanhSachSDT = item.NoiDung.split('_');
                                    return (
                                        <View key={index} style={{ paddingHorizontal: 15, paddingVertical: 0, justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
                                            <Text allowFontScaling={false} style={{ fontSize: reText(14), fontWeight: 'bold', textAlign: 'center', color: colors.yellowLight }}>{item.TieuDe.toUpperCase()}</Text>
                                            {
                                                DanhSachSDT.map((item2, index2) => {
                                                    return (
                                                        <TouchableOpacity key={item2} onPress={() => this.dialCall(item2)} style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                                                            <Image source={Images.icCall} style={[nstyles.nIcon20, { tintColor: colors.white, marginHorizontal: 10, transform: [{ rotate: '90deg' }] }]} />
                                                            <Text allowFontScaling={false} style={{ fontWeight: 'bold', color: colors.white, paddingVertical: 5, fontSize: reText(20), }}>{item2}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                            {
                                                sodienthoai.length - 1 == index ? null : <View style={{ height: 0.5, backgroundColor: colors.yellowLight, marginBottom: 10, width: '15%' }} />
                                            }
                                        </View>
                                    )
                                })
                                : null
                        }
                        {this.check ?
                            <View style={{ borderWidth: 1, paddingVertical: 10, marginHorizontal: 10, borderColor: colors.white }}>
                                <Text style={{ fontWeight: 'bold', fontSize: reText(16), color: colors.yellowLight, marginBottom: 5, alignSelf: 'center' }}>{'Tìm kiếm số điện thoại'.toUpperCase()}</Text>

                                <Text style={{ marginHorizontal: 5, color: colors.white, marginBottom: 5, fontStyle: 'italic' }}>{appConfig.IdSource == 'CA' ? 'Công an' : 'Liên hệ'} địa phương</Text>
                                <TouchableOpacity onPress={() => this.OpenModalDrop()} style={{
                                    flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.yellowLight,
                                    paddingVertical: 5, paddingHorizontal: 5, marginHorizontal: 5, borderRadius: 3
                                }}>
                                    <Text numberOfLines={1} style={{ color: colors.white, fontWeight: 'bold' }}>{this.state.itemtp.text}</Text>
                                    <Image source={Images.icDropDown} style={{ width: 10, height: 7, tintColor: colors.white, alignSelf: 'center' }} />
                                </TouchableOpacity>
                                {itemtp.data.DienThoai ?
                                    <TouchableOpacity onPress={() => this.dialCall(itemtp.data.DienThoai ? itemtp.data.DienThoai : '')} style={{ marginVertical: 5, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                                        <Text allowFontScaling={false} style={{
                                            fontWeight: 'bold', color: colors.white, paddingVertical: 5, fontSize: reText(20)
                                        }}>SĐT: {itemtp.data.DienThoai ? itemtp.data.DienThoai : ''}</Text>
                                        < Image source={Images.icCall} style={[nstyles.nIcon20, { tintColor: colors.white, marginHorizontal: 10 }]} />
                                    </TouchableOpacity> : null}
                                <Text style={{ marginHorizontal: 5, color: colors.white, marginBottom: 5, fontStyle: 'italic', marginTop: 5 }}>{appConfig.IdSource == 'CA' ? 'Công an' : 'Liên hệ'} các đội, xã, phường, thị trấn</Text>
                                <TouchableOpacity onPress={() => this.OpenModalDrop_DV()} style={{
                                    flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.yellowLight,
                                    paddingVertical: 5, paddingHorizontal: 5, marginHorizontal: 5, borderRadius: 3
                                }}>
                                    <Text numberOfLines={1} style={{ color: colors.white, fontWeight: 'bold' }}>{this.state.itemdv.text}</Text>
                                    <Image source={Images.icDropDown} style={{ width: 10, height: 7, tintColor: colors.white, alignSelf: 'center' }} />
                                </TouchableOpacity>
                                {itemdv.data.DienThoai ?
                                    <TouchableOpacity onPress={() => this.dialCall(itemdv.data.DienThoai ? itemdv.data.DienThoai : '')} style={{ paddingVertical: 5, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                                        <Text allowFontScaling={false} style={{
                                            fontWeight: 'bold', color: colors.white, fontSize: reText(20), paddingVertical: 5
                                        }}>SĐT: {itemdv.data.DienThoai ? itemdv.data.DienThoai : ''}</Text>
                                        < Image source={Images.icCall} style={[nstyles.nIcon20, { tintColor: colors.white, marginHorizontal: 10 }]} />
                                    </TouchableOpacity> : null}
                            </View> : null}

                        {
                            sodienthoaiYTe ?
                                sodienthoaiYTe.map((item, index) => {
                                    return (
                                        <View key={index} style={{ paddingHorizontal: 15, paddingVertical: 0, justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
                                            <Text allowFontScaling={false} style={{ fontSize: reText(14), fontWeight: 'bold', textAlign: 'center', color: colors.yellowLight }}>{item.TieuDe.toUpperCase()}</Text>
                                            <TouchableOpacity onPress={() => this.dialCall(item.NoiDung)} style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                                                <Image source={Images.icCall} style={[nstyles.nIcon20, { tintColor: colors.white, marginHorizontal: 10, transform: [{ rotate: '90deg' }] }]} />
                                                <Text allowFontScaling={false} style={{ fontWeight: 'bold', color: colors.white, paddingVertical: 5, fontSize: reText(20), }}>{item.NoiDung}</Text>
                                            </TouchableOpacity>
                                            {
                                                sodienthoaiYTe.length - 1 == index ? null : <View style={{ height: 0.5, backgroundColor: colors.yellowLight, marginBottom: 10, width: '15%' }} />
                                            }
                                        </View>
                                    )
                                })
                                : null
                        }
                        {
                            sodienthoaiYTe ?
                                sodienthoaiYTe.map((item, index) => {
                                    return (
                                        <View key={index} style={{ paddingHorizontal: 15, paddingVertical: 0, justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
                                            <Text allowFontScaling={false} style={{ fontSize: reText(14), fontWeight: 'bold', textAlign: 'center', color: colors.yellowLight }}>{item.TieuDe.toUpperCase()}</Text>
                                            <TouchableOpacity onPress={() => this.dialCall(item.NoiDung)} style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                                                <Image source={Images.icCall} style={[nstyles.nIcon20, { tintColor: colors.white, marginHorizontal: 10, transform: [{ rotate: '90deg' }] }]} />
                                                <Text allowFontScaling={false} style={{ fontWeight: 'bold', color: colors.white, paddingVertical: 5, fontSize: reText(20), }}>{item.NoiDung}</Text>
                                            </TouchableOpacity>
                                            {
                                                sodienthoaiYTe.length - 1 == index ? null : <View style={{ height: 0.5, backgroundColor: colors.yellowLight, marginBottom: 10, width: '15%' }} />
                                            }
                                        </View>
                                    )
                                })
                                : null
                        }
                    </ScrollView>
                    <IsLoading ref={this.refLoading} />
                    <TouchableOpacity onPress={() => this._goback()} activeOpacity={0.5}
                        style={{
                            backgroundColor: colors.nocolor,
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                            borderBottomRightRadius: 15, borderBottomLeftRadius: 15, borderWidth: 2,
                            borderColor: colors.yellowLight, borderTopWidth: 1,
                        }}>
                        <Text style={{ fontWeight: 'bold', fontSize: reText(18), color: colors.white, padding: 15 }}>{'Đóng'}</Text>
                    </TouchableOpacity>
                </Animatable.View>
            </View>
        )
    }
}

export default KhanCap
