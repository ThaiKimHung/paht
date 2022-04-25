// import React, { Component, Fragment } from 'react';
// import {
//     View, Text, TouchableOpacity, ScrollView,
//     FlatList, Image, Animated, StyleSheet, ActivityIndicator
// } from 'react-native';
// import { nstyles, colors } from '../../styles';
// import styles from './styles';
// import { Images } from '../../images';
// import { sizes } from '../../styles';
// import * as Animatable from 'react-native-animatable';
// import Utils from '../../app/Utils';
// import { appConfig } from '../../app/Config';
// import apis from '../../apis';
// import { Width, heightHed } from '../../styles/styles';
// import { ListEmpty } from '../../components';
// import ItemDanhSach from './components/ItemDanhSach';


// class DanhSachPAFilter extends Component {
//     constructor(props) {
//         super(props);
//         this.pageAll = 0;
//         this.yNext = 0;
//         this.animaDelta = 0; //0-100
//         this.isTabStatus = 1;
//         this.state = {
//             isModalVisible: false,
//             isVisible: true,
//             isOpen: false,
//             text: 'Chọn',
//             isbg: false,
//             refreshing: true,
//             dataChuyenMuc: [],
//             dataLinhVuc: [],
//             chuyenMucChon: Utils.ngetParam(this, "itemChuyenMuc", {}),
//             marginTop: new Animated.Value(0),
//             dataTrangthai: [],
//             idTrangthaiSelect: 1,
//             currentChuyenMuc: { IdChuyenMuc: -1, TenChuyenMuc: "Tất cả" },
//             isDaXuLi: true,
//             textempty: 'Danh sách phản ánh rỗng'

//         };
//     }
//     componentDidMount() {
//         this._getListLinhVuc();
//         // this._getListChuyenMuc()

//         // this._getListCongDong()

//     }
//     handleScroll = (event: Object) => {
//         let ytemp = event.nativeEvent.contentOffset.y;
//         let deltaY = ytemp - this.yNext;
//         this.yNext = ytemp;
//         //----
//         this.animaDelta += deltaY;
//         if (this.animaDelta > 160) {
//             this.animaDelta = 160;
//             if (this.isTabStatus != -1) {
//                 this.isTabStatus = -1;
//                 //run animation 1
//                 nthisTabBarHome._startAnimation(-100);
//                 // this._startAnimation2(-100);

//             };
//         };
//         if (this.animaDelta < 0) {
//             this.animaDelta = 0;
//             if (this.isTabStatus != 1) {
//                 this.isTabStatus = 1;
//                 nthisTabBarHome._startAnimation(0);
//                 // this._startAnimation2(0);
//             };
//         };
//     };
//     compare(a, b) {
//         if (a.STT < b.STT) {
//             return -1;
//         }
//         if (a.STT > b.STT) {
//             return 1;
//         }
//         return 0;
//     }

//     _getListChuyenMuc = async () => {
//         const res = await apis.ApiPhanAnh.GetList_ChuyenMucApp(this.state.chuyenMucChon.IdLinhVuc);
//         Utils.nlog("gia tri chuyên muc--------------------", res)
//         if (res.status == 1) {
//             var { data = [] } = res
//             this.setState({ dataChuyenMuc: [{ IdChuyenMuc: -1, TenChuyenMuc: "Tất cả" }, ...data], currentChuyenMuc: { IdChuyenMuc: -1, TenChuyenMuc: "Tất cả" } }, this._onRefresh)
//         } else {
//             this._onRefresh();
//         }
//     }
//     _getListLinhVuc = async () => {
//         let res = await apis.ApiPhanAnh.GetList_LinhVucApp();
//         Utils.nlog("gai tri res linh vuc----------------------", res)
//         if (res.status == 1 && res.data) {
//             let data = res.data.reverse();
//             data = data.sort(this.compare)
//             this.setState({ dataLinhVuc: data }, this._getListChuyenMuc)
//         }
//     }
//     // GetList_TrangThaiAll
//     _GetList_TrangThaiAll = async () => {
//         const res = await apis.ApiPhanAnh.GetList_TrangThaiAll();
//         Utils.nlog("gia tri trang thái", res)
//         if (res.status == 1) {
//             var { data = [] } = res
//             this.setState({ dataTrangthai: data, idTrangthaiSelect: data[0].Id }, () => this._getListCongDong())
//         }
//     }
//     _ListHeaderComponent = () => {
//         const { dataTrangthai, isDaXuLi } = this.state;
//         return (
//             <Fragment>
//                 <View style={[{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }]}>
//                     <TouchableOpacity onPress={() => this.setState({ isDaXuLi: true }, this._onRefresh)}>
//                         <View style={[{
//                             flexDirection: 'row',
//                             backgroundColor: isDaXuLi == true ? colors.colorBlueLight : colors.black_11,
//                             borderBottomLeftRadius: 3, borderTopLeftRadius: 3,
//                             paddingVertical: 10, paddingHorizontal: 10, elevation: 3
//                         }]}>
//                             <Image source={Images.icCheckBlack}
//                                 style={[nstyles.nstyles.nIcon20, { tintColor: isDaXuLi == true ? colors.white : colors.black_60 }]} resizeMode='contain' />


//                             <Text style={{
//                                 fontSize: 16, paddingHorizontal: 10,
//                                 color: isDaXuLi == true ? colors.white : colors.black_60,
//                             }}>{'Đã xử lý'}</Text>
//                         </View>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => this.setState({ isDaXuLi: false }, this._onRefresh)}>
//                         <View style={[{
//                             flexDirection: 'row',
//                             backgroundColor: isDaXuLi == false ? colors.colorBlueLight : colors.black_11,
//                             borderBottomRightRadius: 3, borderTopRightRadius: 3,
//                             paddingVertical: 10, paddingHorizontal: 10, elevation: 3
//                         }]}>

//                             <Image source={Images.icSetTingBlack} style={[nstyles.nstyles.nIcon20, { tintColor: isDaXuLi == false ? colors.white : colors.black_60 }]} resizeMode='contain' />
//                             <Text style={{
//                                 fontSize: 16, paddingHorizontal: 10,
//                                 color: isDaXuLi == false ? colors.white : colors.black_60,
//                             }}>{'Đang xử lý'}</Text>
//                         </View>
//                     </TouchableOpacity>
//                 </View>

//             </Fragment>
//         )
//     }

//     _chooseFilter = async (item) => {
//         this.setState({ idTrangthaiSelect: item.Id }, () => this._onRefresh())
//     }
//     _showAllImages = (arrImage = [], index = 0) => {
//         const imagesURL = [
//             {
//                 url: 'https://img2.infonet.vn/w490/Uploaded/2020/pjauldz/2018_06_19/5.jpg',
//             },
//         ];
//         if (arrImage.length != 0) {
//             Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: arrImage, index });
//         }
//         else {
//             Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: imagesURL, index });
//         }
//     }
//     _getListCongDong = async () => {
//         const { size, chuyenMucChon, idTrangthaiSelect, isDaXuLi, currentChuyenMuc } = this.state
//         Utils.nlog("vao co trang thai");
//         var keys = "LinhVuc|TrangThaiS";
//         if (currentChuyenMuc.IdChuyenMuc != -1) {
//             keys = "LinhVuc|ChuyenMuc|TrangThaiS";
//         }

//         if (isDaXuLi == true) {
//             var vals = `${chuyenMucChon.IdLinhVuc}|6`
//             if (currentChuyenMuc.IdChuyenMuc != -1) {
//                 vals = `${chuyenMucChon.IdLinhVuc}|${currentChuyenMuc.IdChuyenMuc}|6`
//             }

//         } else {
//             var vals = `${chuyenMucChon.IdLinhVuc}|2,3,4,5`
//             if (currentChuyenMuc.IdChuyenMuc != -1) {
//                 vals = `${chuyenMucChon.IdLinhVuc}|${currentChuyenMuc.IdChuyenMuc}|2,3,4,5`
//             }
//         }
//         const res = await apis.ApiPhanAnh.GetDanhSachPAFilter(false, 1, size, keys, vals);
//         console.log('data', res)
//         var { data = [], } = res
//         if (res.status == 1 && data != null) {
//             res.page ? this.pageAll = res.page.AllPage : this.pageAll = 0

//             this.setState({ data: data, page: res.page ? res.page.Page : 0, refreshing: false });
//         } else {
//             this.setState({ refreshing: false, data: [] });
//         };
//     }
//     goscreen = (IdPA = {}) => {
//         Utils.goscreen(this, 'Modal_ChiTietPhanAnh', { IdPA: IdPA });
//     }
//     _renderItemChuyenMuc = ({ item, index }) => {
//         Utils.nlog("gia tri item chọn", item)
//         const { chuyenMucChon } = this.state
//         if (item.Display == true) {
//             return <TouchableOpacity onPress={() => this.setState({ chuyenMucChon: item, isOpen: false }, this._getListChuyenMuc)}>
//                 <View style={{ paddingHorizontal: 30, paddingVertical: 7, justifyContent: 'center', alignItems: 'center' }}>
//                     <Text style={{ color: colors.black_80, fontWeight: item.IdLinhVuc == chuyenMucChon.IdLinhVuc ? 'bold' : '500' }}>{item.LinhVuc}</Text>
//                 </View>
//             </TouchableOpacity>
//         } else {
//             return null
//         }

//     }
//     _renderItem = ({ item, index }) => {
//         var {
//             ListHinhAnh = [],
//             IdPA,
//             ChuyenMuc
//         } = item;
//         // var arrImg = []
//         // ListHinhAnh.forEach(item => {
//         //     arrImg.push({ url: appConfig.domain + item.Path })
//         // });
//         var arrImg = []; var arrLinkFile = [];
//         ListHinhAnh.forEach(item => {
//             const url = item.Path;
//             let checkImage = Utils.checkIsImage(item.Path);
//             if (checkImage) {
//                 arrImg.push({
//                     url: appConfig.domain + url
//                 })
//             } else {
//                 arrLinkFile.push({ url: url, name: item.TenFile })
//             }
//             // Utils.nlog("gia tri image chi tiết", arrImg);
//         });
//         return <ItemDanhSach
//             nthis={this}
//             dataItem={item}
//             type={ListHinhAnh.length > 0 ? 1 : 2}
//             goscreen={() => Utils.goscreen(this, 'Modal_ChiTietPhanAnh', { IdPA: IdPA, TenChuyenMuc: ChuyenMuc })}
//             showImages={() => this._showAllImages(arrImg, 0)} />
//     }
//     _onRefresh = () => {
//         this.setState({ refreshing: true }, this._getListCongDong)
//     }
//     _ListFooterComponent = () => {
//         if (this.state.page + 1 < this.pageAll)
//             return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
//         else return null
//     }
//     loadMore = async () => {
//         const { page, size, chuyenMucChon, isDaXuLi } = this.state;
//         var keys = "LinhVuc|TrangThaiS";
//         if (isDaXuLi == true) {
//             var vals = `${chuyenMucChon.IdLinhVuc}|100`
//         } else {
//             var vals = `${chuyenMucChon.IdLinhVuc}|2,3,4,5,6,99`
//         }
//         const pageNumber = page + 1;
//         if (page < this.pageAll) {
//             let res = await apis.ApiPhanAnh.GetDanhSachPAFilter(false, pageNumber, size, keys, vals);
//             Utils.nlog('loadmore', res)
//             if (res.status == 1 && res.data) {
//                 const data = [...this.state.data, ...res.data];
//                 this.setState({ data, page: pageNumber });
//             };
//         };
//     };
//     _startAnimation2 = (value) => {
//         Animated.timing(this.state.marginTop, {
//             toValue: value,
//             duration: 200
//         }).start();
//     };
//     _keyExtrac = (item, index) => index.toString();
//     _DropDown = () => {
//         Utils.goscreen(this, 'ModalChuyenMuc', { callback: this._callback, item: this.state.currentChuyenMuc, AllThaoTac: this.state.dataChuyenMuc, Key: 'IdChuyenMuc', Value: 'TenChuyenMuc' })
//     }

//     _callback = (currentChuyenMuc) => {
//         this.setState({ currentChuyenMuc }, this._getListCongDong);
//     }
//     render() {
//         var { isOpen, dataChuyenMuc, chuyenMucChon, dataLinhVuc, currentChuyenMuc } = this.state
//         const { nrow, nmiddle } = nstyles.nstyles;
//         return (
//             <View style={nstyles.nstyles.ncontainer}>
//                 <View style={[isOpen == false ? styles.shadown : {}, nstyles.nstyles.nhead, {
//                 }]}>
//                     <View style={[nrow, nstyles.nstyles.nHcontent, { backgroundColor: colors.white }]}>
//                         <TouchableOpacity style={[nstyles.nstyles.nHleft]} onPress={() => Utils.goback(this)} >
//                             <Image source={Images.icBack} style={nstyles.nstyles.nIcon18} resizeMode='contain' />
//                         </TouchableOpacity>
//                         <TouchableOpacity style={[nstyles.nstyles.nHmid]} onPress={() => this.setState({ isOpen: !isOpen })}>
//                             <Text numberOfLines={1} style={{
//                                 fontSize: sizes.reText(17),
//                                 fontWeight: 'bold',
//                                 textAlign: 'justify',
//                             }}>{chuyenMucChon.LinhVuc}</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             onPress={() => this.setState({ isOpen: !isOpen })}
//                             style={[nstyles.nstyles.nHright]} >
//                             <Image source={Images.icDropDown} style={[nstyles.nstyles.nIcon18, {}]} resizeMode='contain' />
//                         </TouchableOpacity>
//                     </View>
//                 </View>

//                 <View style={[nstyles.nstyles.nbody, { width: Width(100) }]}>
//                     <FlatList
//                         scrollEventThrottle={10}
//                         onScroll={this.handleScroll}
//                         contentContainerStyle={{ paddingBottom: nstyles.paddingBotX + 20 + (Platform.OS === 'android' ? 60 : 0) }}
//                         renderItem={this._renderItem}
//                         data={this.state.data}
//                         ListEmptyComponent={<ListEmpty textempty={this.state.textempty} />}
//                         ListHeaderComponent={this._ListHeaderComponent}
//                         ItemSeparatorComponent={() => <View style={{ height: 10, backgroundColor: colors.black_11, }}></View>}
//                         keyExtractor={this._keyExtrac}
//                         refreshing={this.state.refreshing}
//                         onRefresh={this._onRefresh}
//                         onEndReached={this.loadMore}
//                         onEndReachedThreshold={0.3}
//                         ListFooterComponent={this._ListFooterComponent}
//                     />
//                 </View>
//                 {/* <DropDown /> */}
//                 {
//                     isOpen == true ? <Animatable.View
//                         animation="fadeInDownBig" direction="normal"
//                         duration={300}
//                         style={stDSPAFilter.viewdropDown}>
//                         <View style={stDSPAFilter.containerDropDown}
//                             onTouchEnd={() => this.setState({ isOpen: !isOpen })} />
//                         <View style={[styles.shadown, { flexDirection: 'column', backgroundColor: colors.white, }]}>
//                             <FlatList

//                                 contentContainerStyle={{ padding: 10, paddingBottom: nstyles.paddingBotX + 20 }}
//                                 renderItem={this._renderItemChuyenMuc}
//                                 data={dataLinhVuc}
//                                 ListEmptyComponent={<ListEmpty textempty={this.state.textempty} />}
//                                 // ListHeaderComponent={this._ListHeaderComponent}
//                                 keyExtractor={(item, index) => index.toString()}

//                             />


//                         </View>

//                     </Animatable.View> : null
//                 }


//             </View>
//         );
//     }
// }
// const stDSPAFilter = StyleSheet.create({
//     containerDropDown: {
//         position: 'absolute',
//         left: 0,
//         top: 0,
//         bottom: 0,
//         right: 0,
//         flex: 1,
//         backgroundColor: "transparent",
//         alignItems: 'center',
//     },
//     viewdropDown: {
//         flex: 1,
//         zIndex: 1,
//         position: 'absolute',
//         top: heightHed(),
//         bottom: 0,
//         left: 0,
//         right: 0,
//     },
//     viewHeader: {
//         ...nstyles.nstyles.nhead,
//         paddingHorizontal: nstyles.khoangcach,
//         //  marginTop: 20,
//         // marginBottom: 8,
//         justifyContent: 'center',
//         backgroundColor: colors.white,
//     },

// })

// export default DanhSachPAFilter;
