// import React, { Component } from 'react'
// import { Text, View, Image, TextInput, TouchableOpacity, Animated, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
// import Utils from '../../../app/Utils'
// import { Images } from '../../../images'
// import { colors } from '../../../styles'
// import { reText } from '../../../styles/size'
// import { nstyles, nwidth } from '../../../styles/styles'
// import * as Animatable from 'react-native-animatable'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import moment from 'moment'
// import { GetList_DonVi_TKCH } from '../../../apis/ApiDonVi'
// import { ListEmpty } from '../../../components'
// import { DanhSachCongDan } from '../../../apis/ThongKeBaoCao'
// import { Platform } from 'react-native'
// const widthColumn = (nwidth() - 10) / 5
// const RECORD = 10
// export class ChiTietTKCH extends Component {
//     constructor(props) {
//         super(props);
//         this.isCapDV = Utils.ngetParam(this, 'isCapDV', false)
//         this.isNhomDV = Utils.ngetParam(this, 'isNhomDV', false)
//         this.isDanCu = Utils.ngetParam(this, 'isDanCu', false)
//         this.CapDV = Utils.ngetParam(this, 'CapDV', false)
//         this.NhomDV = Utils.ngetParam(this, 'NhomDV', false)
//         this.DanCu = Utils.ngetParam(this, 'DanCu')
//         this.FromDate = Utils.ngetParam(this, 'FromDate', false)
//         this.ToDate = Utils.ngetParam(this, 'ToDate', false)
//         this.IdRoom = Utils.ngetParam(this, 'IdRoom')
//         this.CapCH = Utils.ngetParam(this, 'CapCH', '77')
//         this.pageAll = 0;
//         this.state = {
//             opacity: new Animated.Value(0),
//             dataCT: [],
//             textempty: 'Không có dữ liệu ...',
//             refreshing: true,
//             page: 1
//         }
//     }

//     componentDidMount() {
//         // Utils.nlog('Gia tri this dan cu truoc', this.DanCu)
//         if (this.DanCu == 3) this.DanCu = 0;
//         else this.DanCu = this.DanCu
//         // Utils.nlog('Gia tri this dan cu sau', this.DanCu)
//         if (this.isDanCu) this._getDanhSachDanCu();
//         else this._getDanhSachDV();
//         this._startAnimation(0.4);
//     }
//     _getDanhSachDV = async () => {
//         let res = await GetList_DonVi_TKCH(
//             moment(this.FromDate, 'DD/MM/YYYY').format('DD-MM-YYYY'),
//             moment(this.ToDate, 'DD/MM/YYYY').format('DD-MM-YYYY'),
//             this.isCapDV ? this.CapDV : -1,
//             this.state.page,
//             RECORD,
//             this.isNhomDV ? this.NhomDV : -1
//         );
//         // Utils.nlog('Gia tria res <><>>', res.data)
//         if (res.status == 1) {
//             this.setState({ dataCT: res.data, refreshing: false, page: res.page.Page })
//             this.pageAll = res.page.AllPage
//         }
//     }
//     _getDanhSachDanCu = async () => {
//         let res = await DanhSachCongDan(
//             moment(this.FromDate, 'DD/MM/YYYY').format('DD-MM-YYYY'),
//             moment(this.ToDate, 'DD/MM/YYYY').format('DD-MM-YYYY'),
//             this.DanCu,
//             this.state.page,
//             RECORD,
//             this.CapCH,
//             this.IdRoom
//         )
//         if (res.status == 1) {
//             this.setState({ dataCT: res.data, refreshing: false, page: res.page.Page })
//         }
//         this.pageAll = res.page.AllPage
//     }
//     _startAnimation = (value) => {
//         setTimeout(() => {
//             Animated.timing(this.state.opacity, {
//                 toValue: value,
//                 duration: 300
//             }).start();
//         }, 350);
//     };
//     _goback = () => {
//         setTimeout(() => {
//             Animated.timing(this.state.opacity, {
//                 toValue: 0,
//                 duration: 250
//             }).start(() => {
//                 Utils.goback(this)
//             });
//         }, 100);
//     }
//     _keyExtrac = (item, index) => index.toString();
//     _renderItem = ({ item, index }) => {
//         const { dataCT } = this.state
//         return (
//             <TouchableOpacity key={index} style={{ flexDirection: 'row', }}>
//                 <View style={{ width: widthColumn - widthColumn / 3, borderWidth: 0.5, borderBottomWidth: 0.5 }}>
//                     <Text style={[styles.title, { fontWeight: 'bold' }]}>{`${index + 1}`}</Text>
//                 </View>
//                 <View style={{ width: widthColumn, borderWidth: 0.5, }}>
//                     <Text style={styles.title}>{item.TenPhuongXa}</Text>
//                 </View>
//                 <View style={{ width: widthColumn, borderWidth: 0.5, }}>
//                     <Text style={styles.title}>{item.DiaChi} </Text>
//                 </View>
//                 <View style={{ width: widthColumn, borderWidth: 0.5, }}>
//                     <Text style={styles.title}>{item.TenVietTat}</Text>
//                 </View>
//                 <View style={{ width: Platform.OS = 'android' ? widthColumn - 6 : widthColumn - 5, borderWidth: 0.5, borderRightWidth: 1 }}>
//                     <Text style={styles.title}>{item.MaDinhDanh}</Text>
//                 </View>
//             </TouchableOpacity>
//         )
//     }
//     _onRefresh = () => {
//         this.setState({ refreshing: true, textempty: 'Đang tải...', page: 1 }, this.isDanCu ? this._getDanhSachDanCu : this._getDanhSachDV);
//     }
//     // ListFooterComponent = () => {
//     //     if (this.state.objectPage.Page < this.state.objectPage.AllPage) {
//     //         return <ActivityIndicator size="small" style={{ marginTop: 10 }} />;
//     //     }

//     //     else return null;
//     // };

//     // loadMore = async () => {
//     //     if (this.state.objectPage.Page < this.state.objectPage.AllPage) {
//     //         this._getSoTay(true)
//     //     }

//     // }
//     _ListFooterComponent = () => {
//         if (this.state.page < this.pageAll && this.state.dataCT.length > 0)
//             return <ActivityIndicator size='small' style={{ colors: colors.redStar }} />;
//         else return null
//     }
//     loadMore = async () => {
//         const { page, dataCT } = this.state;
//         const pageNumber = page + 1;
//         if (page < this.pageAll) {
//             let res
//             if (this.isDanCu) res = await DanhSachCongDan(moment(this.FromDate, 'DD/MM/YYYY').format('DD-MM-YYYY'), moment(this.ToDate, 'DD/MM/YYYY').format('DD-MM-YYYY'), this.DanCu, pageNumber, RECORD, this.CapCH, this.IdRoom)
//             else res = await GetList_DonVi_TKCH(moment(this.FromDate, 'DD/MM/YYYY').format('DD-MM-YYYY'), moment(this.ToDate, 'DD/MM/YYYY').format('DD-MM-YYYY'), this.CapDV, pageNumber, RECORD);
//             if (res.status == 1 && res.data.length) {
//                 const temp = dataCT.concat(...res.data);
//                 this.setState({ dataCT: temp, page: pageNumber });
//             };
//             // Utils.nlog('Gia tri data lore', this.state.dataCT, this.isDanCu)
//         };
//     };
//     _renderItemCanHo = ({ item, index }) => {
//         return (
//             <View key={index} style={{ flexDirection: 'row', }}>
//                 <View style={{ width: widthColumn - widthColumn / 2 + 10, borderWidth: 0.5, borderBottomWidth: 0.5, }}>
//                     <Text style={styles.title}>{index + 1}</Text>
//                 </View>
//                 <View style={{ width: widthColumn, borderWidth: 0.5, borderRightWidth: 0, borderLeftWidth: 0 }}>
//                     <Text style={styles.title}>{item.Username}</Text>
//                 </View>
//                 <View style={{ width: widthColumn, borderWidth: 0.5, }}>
//                     <Text style={[styles.title, { fontWeight: 'bold', }]}>{item.FullName}</Text>
//                 </View>
//                 <View style={{ width: widthColumn, borderWidth: 0.5, }}>
//                     <Text style={styles.title}>{item.PhoneNumber}</Text>
//                 </View>
//                 <View style={{ width: Platform.OS = 'android' ? widthColumn - 5 : widthColumn - 3, borderWidth: 0.5, borderRightWidth: 1 }}>
//                     <Text style={[styles.title, { fontWeight: 'bold' }]}>{item.NgayTao}</Text>
//                 </View>
//             </View>
//         )
//     }
//     _renderCanHo = () => {
//         const { dataCT, refreshing } = this.state
//         return (
//             <View style={{}}>
//                 <View style={{ flexDirection: 'row', marginBottom: 20, paddingHorizontal: 10, alignItems: 'center' }}>
//                     <TouchableOpacity onPress={this._goback}>
//                         <Image source={Images.icBack} style={[{ tintColor: colors.black, width: 16, height: 12 }]} />
//                     </TouchableOpacity>
//                     <Text style={{ fontSize: reText(15), fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
//                         {`Danh sách cư dân ${this.DanCu == 1 ? 'có căn hộ' : this.DanCu == 2 ? 'là thành viên' : 'không có căn hộ'}`}
//                     </Text>
//                 </View>
//                 <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, width: widthColumn * 4 + 40 }}>
//                     <View style={{ width: widthColumn - widthColumn / 2 + 10, borderWidth: 0.5, borderBottomWidth: 0 }}>
//                         <Text style={[styles.title, { fontWeight: 'bold' }]}>{`STT`}</Text>
//                     </View>
//                     <View style={{ width: widthColumn, borderWidth: 0.5, borderBottomWidth: 0 }}>
//                         <Text style={[styles.title, { fontWeight: 'bold' }]}>{`Tên đăng nhập`}</Text>
//                     </View>

//                     <View style={{ width: widthColumn, borderWidth: 0.5, borderBottomWidth: 0 }}>
//                         <Text style={[styles.title, { fontWeight: 'bold' }]}>{`Họ tên`}</Text>
//                     </View>
//                     <View style={{ width: widthColumn, borderWidth: 0.5, borderBottomWidth: 0 }}>
//                         <Text style={[styles.title, { fontWeight: 'bold' }]}>{`Số điện thoại`}</Text>
//                     </View>
//                     <View style={{ width: Platform.OS = 'android' ? widthColumn - 5 : widthColumn - 3, borderWidth: 0.5, borderBottomWidth: 0 }}>
//                         <Text style={[styles.title, { fontWeight: 'bold' }]}>{`Ngày tạo`}</Text>
//                     </View>
//                 </View>
//                 <FlatList
//                     showsVerticalScrollIndicator={false}
//                     data={dataCT}
//                     style={{ height: widthColumn * 5 }}
//                     renderItem={this._renderItemCanHo}
//                     keyExtractor={this._keyExtrac}
//                     refreshing={refreshing}
//                     ListEmptyComponent={<ListEmpty textempty={this.state.textempty} />}
//                     onRefresh={this._onRefresh}
//                     onEndReached={this.loadMore}
//                     onEndReachedThreshold={0.5}
//                     ListFooterComponent={this._ListFooterComponent}
//                 />

//             </View>
//         )
//     }
//     render() {
//         const { opacity, dataCT, refreshing } = this.state;
//         return (
//             <View
//                 style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 100, }]}>
//                 <Animated.View onTouchEnd={this._goback} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'black', opacity }} />
//                 <Animatable.View animation={'zoomInDown'} style={{ backgroundColor: colors.white, borderRadius: 10, zIndex: 1, padding: 10, paddingBottom: 20 }}>

//                     {
//                         this.isDanCu ? this._renderCanHo()
//                             :
//                             <>
//                                 <View style={{ flexDirection: 'row', marginBottom: 20, paddingHorizontal: 10, alignItems: 'center' }}>
//                                     <TouchableOpacity onPress={this._goback}>
//                                         <Image source={Images.icBack} style={[{ tintColor: colors.black, width: 16, height: 12 }]} />
//                                     </TouchableOpacity>
//                                     <Text style={{ fontSize: reText(15), fontWeight: 'bold', flex: 1, textAlign: 'center' }}>{`Danh sách căn hộ theo ${this.isCapDV ? 'cấp đơn vị' : 'nhóm đơn vị'}`}</Text>
//                                 </View>
//                                 <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, }}>
//                                     <View style={{ width: widthColumn - widthColumn / 3, borderWidth: 0.5, borderBottomWidth: 0 }}>
//                                         <Text style={[styles.title, { fontWeight: 'bold' }]}>{`STT`}</Text>
//                                     </View>
//                                     <View style={{ width: widthColumn, borderWidth: 0.5, borderBottomWidth: 0 }}>
//                                         <Text style={[styles.title, { fontWeight: 'bold' }]}>{`Tên căn hộ`}</Text>
//                                     </View>

//                                     <View style={{ width: widthColumn, borderWidth: 0.5, borderBottomWidth: 0 }}>
//                                         <Text style={[styles.title, { fontWeight: 'bold' }]}>{`Địa chỉ`}</Text>
//                                     </View>
//                                     <View style={{ width: widthColumn, borderWidth: 0.5, borderBottomWidth: 0 }}>
//                                         <Text style={[styles.title, { fontWeight: 'bold' }]}>{`Tên viết tắt`}</Text>
//                                     </View>
//                                     <View style={{ width: Platform.OS = 'android' ? widthColumn - 6 : widthColumn - 5, borderWidth: 0.5, borderBottomWidth: 0 }}>
//                                         <Text style={[styles.title, { fontWeight: 'bold' }]}>{`Mã căn hộ`}</Text>
//                                     </View>
//                                 </View>
//                                 <FlatList
//                                     showsVerticalScrollIndicator={false}
//                                     data={dataCT}
//                                     style={{}}
//                                     renderItem={this._renderItem}
//                                     keyExtractor={this._keyExtrac}
//                                     refreshing={refreshing}
//                                     ListEmptyComponent={<ListEmpty textempty={this.state.textempty} />}
//                                     onRefresh={this._onRefresh}
//                                     onEndReached={this.loadMore}
//                                     onEndReachedThreshold={0.5}
//                                     ListFooterComponent={this._ListFooterComponent}
//                                 />
//                             </>
//                     }

//                 </Animatable.View>
//             </View>
//         )
//     }
// }
// const styles = StyleSheet.create({
//     title: {
//         fontSize: reText(12),
//         textAlign: 'center',
//         padding: 10
//     }
// })
// export default ChiTietTKCH
import React, { Component } from 'react';
import { View, Text } from 'react-native';

class ChiTietTKCH extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View>
                <Text> ChiTietTKCH </Text>
            </View>
        );
    }
}

export default ChiTietTKCH;

