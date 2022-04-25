import React, { Component, createRef } from 'react';
import { View, Text, Animated, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, BackHandler, Platform, PermissionsAndroid, ToastAndroid, Alert } from 'react-native';
import Utils from '../../../app/Utils';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, paddingBotX, Width, nwidth} from '../../../styles/styles';
import { Images } from '../../images';
import { ButtonCom, IsLoading, ListEmpty, HeaderCus,  } from '../../../components';
import moment from 'moment';
import apis from '../../apis';
import { truncate } from 'lodash';
import { getBottomSpace } from 'react-native-iphone-x-helper';
const widthColumn = () => (nwidth() - 10) / 3
const KeyTK = {
    Mota: 0,
    DangXetNghiem: 1,
    DuongTinh: 2,
    AmTinhLan1: 3,
    AmTinhLan2: 4,
    AmTinhLan3: 5,
    DaKhoiBenh: 6,
    ChuyenBienNang: 7,
    NhapVien: 8,
}
class ThongKeCachLyTaiNha extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0),
            text: '',
            data: [],
            refreshing: true,
            textempty: 'Đang tải...',
            page: { Page: 1, AllPage: 1, Size: 10, Total: 1 }
        };
        this.refLoading = createRef()
    }

    componentDidMount() {
        this._startAnimation(0.4)
        this.GetThongKeCachLyTaiNha()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }
    backAction = () => {
        this._goback()
        return true
    }

    GetThongKeCachLyTaiNha = async () => {
        const { page, text, data } = this.state
        let res = await apis.apiQuanLyCachLy.GetThongKeCachLyTaiNha(page.Size, page.Page)
        Utils.nlog("Thong Ke Cach Ly Tai Nha:", res)
        if (res.status == 1 && res.data) {
            this.setState({
                data: [...data, ...res.data],
                refreshing: false,
                textempty: 'Không có dữ liệu',
                page: res.page ? res.page : this.state.page
            })
        } else {
            this.setState({
                data: [],
                refreshing: false,
                textempty: 'Không có dữ liệu',
                page: res.page ? res.page : this.state.page
            })
        }
    }

    loadMore = async () => {
        const { page } = this.state
        if (page.Page < page.AllPage) {
            this.setState({ page: { ...page, Page: page.Page + 1 } }, this.GetThongKeCachLyTaiNha)
        }
    }
    _onRefresh = () => {
        this.setState({ page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }, refreshing: true, textempty: 'Đang tải...', data: [] }, this.GetThongKeCachLyTaiNha)
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
        Utils.navigate('Modal_ChiTietThongKeCachLy', { keyDetails: { ...item, TinhTrangSucKhoe: keys } })
    }
    // fix ----------------
    // RenderBody = () => {
    //     const { opacity, textempty, refreshing, data } = this.state
    //         return <ScrollView
    //             showsHorizontalScrollIndicator={false}
    //             horizontal
    //             style={[{ marginHorizontal: 10, backgroundColor: colors.white, marginTop: 30 }]}>
    //             <View>
    //                 <View style={{
    //                     flexDirection: 'row',
    //                 }}>
    //                     <View style={{ width: widthColumn() / 3, borderWidth: 0.5, borderBottomWidth: 0, }}>
    //                         <Text style={[styles.text, { fontWeight: 'bold', flex: 1, color: colors.black }]}>{`STT`}</Text>
    //                     </View>
    //                     <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0, borderRightWidth: 0, borderLeftWidth: 0 }}>
    //                         <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Cấp bệnh nhân`}</Text>
    //                     </View>
    //                     <View style={{ justifyContent: 'center' }}>
    //                         <View style={{ flexDirection: 'row' }}>

    //                             <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
    //                                 <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Đang xét nghiệm`}</Text>
    //                             </View>

    //                             <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
    //                                 <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Dương tính`}</Text>
    //                             </View>

    //                             <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
    //                                 <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Âm tính lần 1`}</Text>
    //                             </View>

    //                             <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
    //                                 <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Âm tính lần 2`}</Text>
    //                             </View>

    //                             <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
    //                                 <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Âm tính lần 3`}</Text>
    //                             </View>
                                
    //                             <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
    //                                 <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Đã khỏi bệnh`}</Text>
    //                             </View>
                            
    //                             <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
    //                                 <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Chuyển biến nặng`}</Text>
    //                             </View>
                                
    //                             <View style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
    //                                 <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{`Nhập viện`}</Text>
    //                             </View>
                                
    //                         </View>
    //                     </View>
    //                 </View>

    //                 {data.length > 0 && data ?
    //                     data.map((item, index) => {
    //                         return (
    //                             <View key={index} style={{ flexDirection: 'row', flex: 1 }}>
    //                                 <View style={{ width: widthColumn() / 3, borderWidth: 0.5, borderBottomWidth: index == data.length - 1 ? 0.5 : 0 }}>
    //                                     <Text style={[styles.text, { color: colors.black }]}>{index + 1}</Text>
    //                                 </View>
    //                                 <View style={{ width: widthColumn(), borderWidth: 0.5, borderBottomWidth: 0.5, borderRightWidth: 0, borderLeftWidth: 0 }}>
    //                                     <Text style={[styles.text, { fontWeight: 'bold', color: colors.black }]}>{item.Mota}</Text>
    //                                 </View>
    //                                 <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.DangXetNghiem)} style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: data.length == index - 1 ? 0 : 0.5 }}>
    //                                     <Text style={[styles.text, { color: colors.softBlue, fontWeight: 'normal' }]}>{item.DangXetNghiem}</Text>
    //                                 </TouchableOpacity>
    //                                 <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.DuongTinh)} style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: data.length == index - 1 ? 0 : 0.5 }}>
    //                                     <Text style={[styles.text, { color: colors.softBlue, fontWeight: 'normal' }]}>{item.DuongTinh}</Text>
    //                                 </TouchableOpacity>
    //                                 <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.AmTinhLan1)} style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: data.length == index - 1 ? 0 : 0.5 }}>
    //                                     <Text style={[styles.text, { color: colors.softBlue, fontWeight: 'normal' }]}>{item.AmTinhLan1}</Text>
    //                                 </TouchableOpacity>
    //                                 <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.AmTinhLan2)} style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: data.length == index - 1 ? 0 : 0.5 }}>
    //                                     <Text style={[styles.text, { color: colors.softBlue, fontWeight: 'normal' }]}>{item.AmTinhLan2}</Text>
    //                                 </TouchableOpacity>
    //                                 <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.AmTinhLan3)} style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: data.length == index - 1 ? 0 : 0.5 }}>
    //                                     <Text style={[styles.text, { color: colors.softBlue, fontWeight: 'normal' }]}>{item.AmTinhLan3}</Text>
    //                                 </TouchableOpacity>
    //                                 <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.DaKhoiBenh)} style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: data.length == index - 1 ? 0 : 0.5 }}>
    //                                     <Text style={[styles.text, { color:  colors.softBlue, fontWeight:  'normal' }]}>{item.DaKhoiBenh}</Text>
    //                                 </TouchableOpacity>
    //                                 <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.ChuyenBienNang)} style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: data.length == index - 1 ? 0 : 0.5 }}>
    //                                     <Text style={[styles.text, { color:  colors.softBlue, fontWeight:  'normal' }]}>{item.ChuyenBienNang}</Text>
    //                                 </TouchableOpacity>
    //                                 <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.NhapVien)} style={{ width: widthColumn() - widthColumn() / 2, borderWidth: 0.5, borderBottomWidth: data.length == index - 1 ? 0 : 0.5 }}>
    //                                     <Text style={[styles.text, { color:  colors.softBlue, fontWeight:  'normal' }]}>{item.NhapVien}</Text>
    //                                 </TouchableOpacity>
    //                             </View>
    //                         )
    //                     })
    //                     :
    //                     <View style={{ borderTopWidth: 0.5, }}>
    //                         <Text style={{ textAlign: 'center', paddingVertical: 5, fontSize: reText(12) }}>{'Không có dữ liệu...'}</Text>
    //                     </View>
    //                 }

    //             </View>
    //         </ScrollView>
    // }
    _renderItem = ({ item, index }) => {
        const { TenMuc,
            Id,
            Mota,
            TongSL,
            DangXetNghiem,
            DuongTinh,
            AmTinhLan1,
            AmTinhLan2,
            AmTinhLan3,
            DaKhoiBenh,
            ChuyenBienNang,
            NhapVien,
        } = item

        return (
            <View style={{ minHeight: 40, marginVertical: 1, backgroundColor: 'white', width: '100%', flexDirection: 'row', paddingHorizontal: 10 }}>
                {/* <View style={[styles.row, {}]}><Text >{index + 1}</Text></View> */}
                <TouchableOpacity style={[styles.row, { flex: 2, }]}>
                    <Text style={{ fontSize: reText(10), color: colors.black_80, paddingHorizontal: 5 }}>{Mota}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.DangXetNghiem)} style={styles.row}>
                    <Text style={{ fontSize: reText(10), color: colors.orangCB, paddingHorizontal: 5, fontWeight: 'bold' }}>{DangXetNghiem + ""}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.DuongTinh)} style={styles.row}>
                    <Text style={{ fontSize: reText(10), color: colors.peacockBlue, paddingHorizontal: 5, }}>{DuongTinh + ""}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.AmTinhLan1)} style={styles.row}>
                    <Text style={{ fontSize: reText(10), color: colors.peacockBlue, paddingHorizontal: 5, }}>{AmTinhLan1 + ""}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.AmTinhLan2)} style={styles.row} >
                    <Text style={{ fontSize: reText(10), color: colors.peacockBlue, paddingHorizontal: 5, }}>{AmTinhLan2 + ""}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.AmTinhLan3)} style={styles.row} >
                    <Text style={{ fontSize: reText(10), color: colors.peacockBlue, paddingHorizontal: 5, }}>{AmTinhLan3 + ""}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.DaKhoiBenh)} style={styles.row} >
                    <Text style={{ fontSize: reText(10), color: colors.peacockBlue, paddingHorizontal: 5, }}>{DaKhoiBenh + ""}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.ChuyenBienNang)} style={styles.row} >
                    <Text style={{ fontSize: reText(10), color: colors.peacockBlue, paddingHorizontal: 5, }}>{ChuyenBienNang + ""}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goDetails(item, KeyTK.NhapVien)} style={styles.row} >
                    <Text style={{ fontSize: reText(10), color: colors.peacockBlue, paddingHorizontal: 5, }}>{NhapVien + ""}</Text>
                </TouchableOpacity>
            </View >
        )
    }
    render() {
        const { opacity, textempty, refreshing, data } = this.state
        const { colorLinear } = this.props.theme
        return (
            <View style={{ flex: 1, backgroundColor: colors.white }}>
                <HeaderCus
                    onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
                    iconLeft={Images.icBack}
                    title={`Thống kê cách ly tại nhà`}
                    styleTitle={{ color: colors.white, fontSize: reText(16) }}
                />
                <View style={{ flex: 1, marginTop: 30 }}>
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

                            {/* <View style={styles.row}>
                                <Text style={{ fontSize: reText(10), fontWeight: "bold", textAlign: "center", }}>
                                    {"Stt"}
                                </Text>
                            </View> */}
                            <View style={[styles.row, { flex: 2 }]}>
                                <Text style={{ fontSize: reText(10), fontWeight: "bold", textAlign: "center", }}>
                                    {"Cấp bệnh nhân"}
                                </Text>
                            </View>
                            <View style={[styles.row,]}>
                                <Text style={{ fontSize: reText(10), fontWeight: "bold", textAlign: "center", }} >
                                    {"Đang xét nghiệm"}
                                </Text>
                            </View>
                            <View style={[styles.row]}>
                                <Text style={{ fontSize: reText(10), fontWeight: "bold", textAlign: "center", }} >
                                    {"Dương tính"}
                                </Text>
                            </View>
                            <View style={[styles.row]}>
                                <Text style={{ fontSize: reText(10), fontWeight: "bold", textAlign: "center", }} >
                                    {"Âm tính lần 1"}
                                </Text>
                            </View>
                            <View style={[styles.row]}>
                                <Text style={{ fontSize: reText(10), fontWeight: "bold", textAlign: "center", }} >
                                    {"Âm tính lần 2"}
                                </Text>
                            </View>
                            <View style={[styles.row]}>
                                <Text style={{ fontSize: reText(10), fontWeight: "bold", textAlign: "center", }} >
                                    {"Âm tính lần 3"}
                                </Text>
                            </View>
                            <View style={[styles.row]}>
                                <Text style={{ fontSize: reText(10), fontWeight: "bold", textAlign: "center", }} >
                                    {"Đã khỏi bệnh"}
                                </Text>
                            </View>
                            <View style={[styles.row]}>
                                <Text style={{ fontSize: reText(10), fontWeight: "bold", textAlign: "center", }} >
                                    {"Chuyển biến nặng"}
                                </Text>
                            </View>
                            <View style={[styles.row]}>
                                <Text style={{ fontSize: reText(10), fontWeight: "bold", textAlign: "center", }} >
                                    {"Nhập viện"}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, paddingBottom: getBottomSpace() }}>
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
                </View>
                
                 {/* fix ---------------- */}
                {/* <View style={{ flex: 1, paddingBottom: getBottomSpace() }}>
                    <ScrollView style={[nstyles.ncontainer, { backgroundColor: colors.white, flex: 0, }]}>
                        {this.RenderBody()}
                    </ScrollView>
                </View> */}
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
    // text: {
    //     fontSize: reText(12),
    //     textAlign: 'center',
    //     padding: 5,
    //     color: colors.softBlue
    // }
})

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,

});
export default Utils.connectRedux(ThongKeCachLyTaiNha, mapStateToProps, true);
