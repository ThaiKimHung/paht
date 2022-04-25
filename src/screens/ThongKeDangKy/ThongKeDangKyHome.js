import React, { Component, createRef } from 'react';
import { View, Text, Animated, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, BackHandler, Platform, PermissionsAndroid, ToastAndroid, Alert } from 'react-native';
import Utils from '../../../app/Utils';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, paddingBotX, Width, nwidth } from '../../../styles/styles';
import { Images } from '../../images';
import { ButtonCom, IsLoading, ListEmpty, HeaderCus, } from '../../../components';
import moment from 'moment';
import apis from '../../apis';
import { truncate } from 'lodash';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment'
const widthColumn = () => (nwidth() - 10) / 3
const KeyTK = {
    TenPhuongXa: 0,
    DaDuyet: 1,
    ChuaDuyet: 2,
    KhongDuyet: 3,
}
class ThongKeDangKyHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0),
            text: '',
            data: [],
            refreshing: true,
            textempty: 'Đang tải...',
            page: { Page: 1, AllPage: 1, Size: 10, Total: 1 },
            ToDate: '',
            FromDate: '',
            dataTongThongKe: []

        };
        this.refLoading = createRef()
    }

    componentDidMount() {
        this._startAnimation(0.4)
        this.GetThongKeDangKy()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }
    backAction = () => {
        this._goback()
        return true
    }
    TuNgay = async (date) => {
        let { ToDate } = this.state;
        let FromDate = date;
        if (Moment(FromDate, "DD-MM-YYYY").isAfter(Moment(ToDate, "DD-MM-YYYY"))) {
            FromDate = ToDate
        }
        this.setState({ FromDate: FromDate }, this.GetThongKeDangKy)
    }

    DenNgay = async (date) => {
        let { FromDate } = this.state;
        let ToDate = date;
        if (Moment(ToDate, "DD-MM-YYYY").isBefore(Moment(FromDate, "DD-MM-YYYY"))) {
            ToDate = FromDate
        }
        this.setState({ ToDate: ToDate }, this.GetThongKeDangKy)
    }
    GetThongKeDangKy = async () => {
        const { data, FromDate, ToDate } = this.state
        let res
        this.refLoading.current.show()
        if (FromDate && ToDate) {
            res = await apis.apiIOC.ThongKe_TrangThai_GiayDiDuong(FromDate, ToDate)
        } else {
            res = await apis.apiIOC.ThongKe_TrangThai_GiayDiDuong()
        }
        this.refLoading.current.hide()
        Utils.nlog("Thong Ke Dang Ky:", res)
        if (res.status == 1 && res.data) {
            let { data = {} } = res;
            let TongDuyet = 0, TongChuaDuyet = 0, TongKhongDuyet = 0
            for (let index = 0; index < data.length; index++) {
                TongDuyet = TongDuyet + data[index].DaDuyet;
                TongChuaDuyet = TongChuaDuyet + data[index].ChuaDuyet;
                TongKhongDuyet = TongKhongDuyet + data[index].KhongDuyet;
            }
            let dataTK = [{
                TongDuyet,
                TongChuaDuyet,
                TongKhongDuyet,
            }
            ]
            this.setState({
                data: res.data,
                refreshing: false,
                textempty: 'Không có dữ liệu',
                dataTongThongKe: dataTK
            })
        } else {
            this.setState({
                data: [],
                refreshing: false,
                textempty: 'Không có dữ liệu',
                dataTongThongKe: []
            })
        }
    }

    loadMore = async () => {
        const { page } = this.state
        if (page.Page < page.AllPage) {
            this.setState({ page: { ...page, Page: page.Page + 1 } }, this.GetThongKeDangKy)
        }
    }
    _onRefresh = () => {
        this.setState({ page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }, refreshing: true, textempty: 'Đang tải...', data: [] }, this.GetThongKeDangKy)
    }
    _ListFooterComponent = () => {
        const { page } = this.state
        return page.Page < page.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }
    _keyExtractor = (item, index) => index.toString()


    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 250
            }).start();
        }, 200);
    };

    _goback = () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                Utils.goback(this)
            });
        }, 100);
    }

    goDetails = (item, keys) => {
        // Utils.navigate('Modal_ChiTietThongKeCachLy', { keyDetails: { ...item, TinhTrangSucKhoe: keys } })
    }
    _renderItem = ({ item, index }) => {
        const {
            MaPX,
            TenPhuongXa,
            DaDuyet,
            ChuaDuyet,
            KhongDuyet
        } = item

        return (
            <View style={{ minHeight: 40, marginVertical: 1, backgroundColor: 'white', width: '100%', flexDirection: 'row', paddingHorizontal: 10 }}>
                {/* <View style={[styles.row, {}]}><Text >{index + 1}</Text></View> */}
                <TouchableOpacity style={[styles.row, { flex: 2, }]}>
                    <Text style={{ fontSize: reText(10), color: colors.black_80, paddingHorizontal: 5 }}>{TenPhuongXa}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.DaDuyet)} style={styles.row}>
                    <Text style={{ fontSize: reText(10), color: colors.greenFE, paddingHorizontal: 5, fontWeight: 'bold' }}>{DaDuyet + ""}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.ChuaDuyet)} style={styles.row}>
                    <Text style={{ fontSize: reText(10), color: colors.orangCB, paddingHorizontal: 5, }}>{ChuaDuyet + ""}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.KhongDuyet)} style={styles.row}>
                    <Text style={{ fontSize: reText(10), color: colors.redStar, paddingHorizontal: 5, }}>{KhongDuyet + ""}</Text>
                </TouchableOpacity>
            </View >
        )
    }

    render() {
        const { opacity, textempty, refreshing, data, dataTongThongKe } = this.state
        const { colorLinear } = this.props.theme
        Utils.nlog('Gia tri data TongThongke', dataTongThongKe)
        return (
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <HeaderCus
                    onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
                    iconLeft={Images.icBack}
                    title={`Thống kê đăng ký`}
                    styleTitle={{ color: colors.white, fontSize: reText(16) }}
                />
                <View>
                    <View style={[nstyles.nrow, { paddingHorizontal: 10 }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ paddingVertical: 5 }}>Từ ngày</Text>
                            <DatePicker
                                customStyles={{
                                    datePicker: {
                                        backgroundColor: '#d1d3d8',
                                        justifyContent: 'center'
                                    }
                                }}
                                locale={'vi'}
                                date={this.state.FromDate}
                                confirmBtnText={'Xác nhận'}
                                cancelBtnText={'Hủy'}
                                mode="date"
                                placeholder="Chọn ngày"
                                showIcon={false}
                                format={'DD-MM-YYYY'}
                                style={{ flex: 1, width: '100%' }}
                                onDateChange={(date) => this.TuNgay(date)}

                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <Text style={{ paddingVertical: 5 }}>Đến ngày</Text>
                            <DatePicker
                                customStyles={{
                                    datePicker: {
                                        backgroundColor: '#d1d3d8',
                                        justifyContent: 'center'
                                    }
                                }}
                                locale={'vi'}
                                date={this.state.ToDate}
                                confirmBtnText={'Xác nhận'}
                                cancelBtnText={'Hủy'}
                                mode="date"
                                placeholder="Chọn ngày"
                                showIcon={false}
                                format={'DD-MM-YYYY'}
                                style={{ flex: 1, width: '100%' }}
                                onDateChange={(date) => this.DenNgay(date)}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, marginTop: 50 }}>
                    <View>
                        <View
                            style={{
                                minHeight: 40,
                                marginVertical: 1,
                                backgroundColor: "white",
                                width: "100%",
                                flexDirection: "row",
                                paddingHorizontal: 10,
                            }} >

                            <View style={[styles.row, { flex: 2 }]}>
                                <Text style={{ fontSize: reText(10), fontWeight: "bold", textAlign: "center", }}>
                                    {"Tên phường xã"}
                                </Text>
                            </View>
                            <View style={[styles.row,]}>
                                <Text style={{ fontSize: reText(10), fontWeight: "bold", textAlign: "center", }} >
                                    {"Đã duyệt"}
                                </Text>
                            </View>
                            <View style={[styles.row]}>
                                <Text style={{ fontSize: reText(10), fontWeight: "bold", textAlign: "center", }} >
                                    {"Chưa duyệt"}
                                </Text>
                            </View>
                            <View style={[styles.row]}>
                                <Text style={{ fontSize: reText(10), fontWeight: "bold", textAlign: "center", }} >
                                    {"Không duyệt"}
                                </Text>
                            </View>
                        </View>

                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={data}
                            refreshing={refreshing}
                            onRefresh={this._onRefresh}
                            renderItem={this._renderItem}
                            keyExtractor={this._keyExtractor}
                            onEndReached={this.loadMore}
                            onEndReachedThreshold={0.4}
                            ListFooterComponent={this._ListFooterComponent}
                            ListEmptyComponent={<ListEmpty textempty={textempty} isImage={!refreshing} />}
                        />
                    </View>
                    {
                        dataTongThongKe && dataTongThongKe.length ?
                            <View style={{ paddingBottom: getBottomSpace() }}>
                                <View
                                    style={{
                                        minHeight: 40,
                                        marginVertical: 1,
                                        backgroundColor: "white",
                                        width: "100%",
                                        flexDirection: "row",
                                        paddingHorizontal: 10,
                                    }} >

                                    <View style={[styles.row, { flex: 2 }]}>
                                        <Text style={[styles.tong, { color: colors.redStar }]} >
                                            {"Tổng"}
                                        </Text>
                                    </View>
                                    <View style={[styles.row,]}>
                                        <Text style={[styles.tong, { color: colors.greenFE }]} >
                                            {dataTongThongKe ? dataTongThongKe[0].TongDuyet : 0}
                                        </Text>
                                    </View>
                                    <View style={[styles.row]}>
                                        <Text style={[styles.tong, { color: colors.orangCB }]} >
                                            {dataTongThongKe ? dataTongThongKe[0].TongChuaDuyet : 0}
                                        </Text>
                                    </View>
                                    <View style={[styles.row]}>
                                        <Text style={[styles.tong, { color: colors.redStar }]} >
                                            {dataTongThongKe ? dataTongThongKe[0].TongKhongDuyet : 0}
                                        </Text>
                                    </View>
                                </View>

                            </View> : null
                    }
                </View>
                <IsLoading ref={this.refLoading} />
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 10,
        paddingBottom: paddingBotX,
        minHeight: Height(90),
        maxHeight: Height(90)
    },
    topBar: {
        height: 5,
        width: 80,
        alignSelf: 'center',
        backgroundColor: colors.grayLight,
        borderRadius: 10,
        marginTop: 10
    },
    row: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: colors.peacockBlue,
        alignItems: "center",
        justifyContent: "center",
    },
    tong: {
        fontSize: reText(10),
        fontWeight: "bold",
        textAlign: "center",
    }
})

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,

});
export default Utils.connectRedux(ThongKeDangKyHome, mapStateToProps, true);
