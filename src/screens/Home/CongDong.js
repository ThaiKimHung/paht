import React, { PureComponent, Fragment } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ScrollView,
    ActivityIndicator,
    Platform,
    BackHandler,
} from 'react-native';
import apis from '../../apis';
import { nstyles, colors, sizes } from '../../../styles';
import { Images } from '../../images';
import { HeaderCus, ListEmpty } from '../../../components';
import styles from './styles';
import Utils from '../../../app/Utils';
import { appConfig } from '../../../app/Config';
import { Header } from '../../../components';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import ItemDanhSach_Sub from './components/ItemDanhSach_Sub';
import ItemGroupLinhVuc from './components/ItemGroupLinhVuc';
import { reText } from '../../../styles/size';
import { linhvuc_color } from '../../../styles/color';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import moment from 'moment'
import LottieView from 'lottie-react-native';
import { isLandscape, Width } from '../../../styles/styles';
import KeyAnalytics from '../../../app/KeyAnalytics';
import analytics from '@react-native-firebase/analytics';
import ImageCus from '../../../components/ImageCus';
import ListCare from './components/ListCare';
// MÀN HÌNH CỘNG ĐỒNG
class CongDong extends PureComponent {

    // STATE
    constructor(props) {
        super(props);
        this.pageAll = 0;
        this.yNext = 0;
        this.animaDelta = 0; //0-100
        this.isTabStatus = 1; //1 da hien, -1 da an
        this.loadDSCount = 0;
        this.xNext = 0;
        this.animaDeltaX = 0;
        this.IdSource = Utils.getGlobal(nGlobalKeys.IdSource, '')
        this.LogoAppHome = Utils.getGlobal(nGlobalKeys.LogoAppHome, '')
        this.isDropDownChuyenMuc = Utils.getGlobal(nGlobalKeys.isDropDownChuyenMuc, 'false')
        this.state = {
            tabBarToggle: true,
            data: [],
            dataLinhVuc: [],
            dataFilter: this.IdSource == 'CA' ? [{
                key: 'MucDo',
                value: '3',
                title: 'Khẩn cấp',
                icon: Images.icTieuBieu
            },
            {
                key: 'MucDo', // Cũ là TrangThai
                value: '1,2', // Cũ là 6
                title: 'Khác',
                icon: Images.icMenuKhac
            }] : [{
                key: 'TrangThai',
                value: '6',
                title: 'Tất cả',
                icon: Images.icCheckBlack
            },
            {
                key: 'MucDo',
                value: '3',
                title: 'Khẩn',
                icon: Images.icTieuBieu
            }


            ], //Danh sách phản ánh
            textempty: 'Danh sách trống',
            refreshing: true,
            filterChoose: '0',//Mặc định choose Tiêu Biểu
            fillterKeys: 'TrangThai', // Lọc mặc định theo (Key,Val)=>(MucDo,2)
            fillterVals: '6',
            page: 1,
            size: 3,
            datatt: [],
            listChuyenMucPA: [],
            currentLinhVuc: this.IdSource == 'CA' ? { IdLinhVuc: -1, LinhVuc: 'Tổng hợp' } : { IdChuyenMuc: -1, LinhVuc: 'Tổng hợp' },
            dataGroup: [],
            showNext: 1,
            keyID: this.IdSource == 'CA' ? 'IdLinhVuc' : 'IdChuyenMuc'
        };

    };

    // XỬ LÝ DIDMOUNT
    async componentDidMount() {
        await this._getListLinhVuc();
        ROOTGlobal.dataGlobal._onRefreshCongDong = this._onRefresh;
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goscreen(this, 'ManHinh_Home')
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    // GET DANH SÁCH THEO TỪNG CHUYÊN MỤC MỨC ĐỘ
    _GetListTheoChuyenMucMucDo = async () => {
        const { dataLinhVuc, fillterKeys, res, currentLinhVuc, fillterVals, dataGroup, keyID, size } = this.state
        this.setState({ dataGroup: [], textempty: 'Đang tải...', refreshing: true })
        var data = []
        if (currentLinhVuc[keyID] == -1) { //Xử lý load LẦN ĐẦU
            if (true) { //this.IdSource == 'CA' -- 'CA' Và 'UB' chạy chung khúc này
                if (dataLinhVuc.length > 0) {
                    let valTongHop = dataLinhVuc.filter(item => item.HienThi && !item.IdDel);
                    valTongHop = valTongHop.map(item => item[keyID]);
                    let valTH = valTongHop.join(",");
                    let keys = `LinhVuc|TongHopApp|TopRecord|${fillterKeys}`;
                    if (this.IdSource != 'CA') {
                        keys = `ChuyenMuc|TongHopApp|TopRecord|${fillterKeys}`;
                    }
                    let vals = `${valTH}|${true}|4|${fillterVals}`  //TopRecord lấy dư 1, để tính ra xem item đó có Xêm thêm hay ko!
                    const res = await apis.ApiPhanAnh.GetDanhSachPAFilter(false, 1, 5, keys, vals);
                    Utils.nlog("Gia tri hoang:", valTongHop, valTH, keys, vals, res)
                    if (res.status == 1 && res.data != null) {
                        const dataitem = res.data;
                        for (let index = 0; index < dataLinhVuc.length; index++) {
                            const element = dataLinhVuc[index];
                            let dataItemLV = await dataitem.filter(item => item[keyID] == element[keyID]);
                            let keysItem = `LinhVuc|${fillterKeys}`;
                            if (this.IdSource != 'CA') {
                                keysItem = `ChuyenMuc|${fillterKeys}`;
                            }

                            let valsItem = `${element[keyID]}|${fillterVals}`
                            //end
                            await data.push({
                                IdLinhVuc: element[keyID],
                                LinhVuc: element[this.IdSource == 'CA' ? 'LinhVuc' : 'TenChuyenMuc'],
                                filterKey: keysItem,
                                filterVal: valsItem,
                                Color: index,
                                page: dataItemLV && dataItemLV.length > 0 ? { Page: 1, AllPage: dataItemLV.length > 3 ? 2 : 1 } : null,
                                DataList: dataItemLV && dataItemLV.length > 0 ? dataItemLV.splice(0, 3) : []
                            })

                            if (index == dataLinhVuc.length - 1) {
                                //đến phần tử cuối cùng thì sort rồi setstate;
                                if (data.length > 0) {
                                    data = data.map(item2 => {
                                        // Utils.nlog("vao ", item2);
                                        if (item2.DataList.length > 0) {
                                            return { ...item2, keySrort: new Date(moment(item2.DataList[0].NgayGui, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD')).getTime() }
                                        } else {
                                            return { ...item2, keySrort: 0 }
                                        }
                                    })
                                    await data.sort(this.compare2);

                                    this.setState({ dataGroup: data, refreshing: false })
                                } else {
                                    this.setState({ textempty: 'Không có dữ liệu', refreshing: false })
                                }
                            }
                        }
                    } else {
                        this.setState({ textempty: 'Không có dữ liệu', refreshing: false })
                    }
                } else {

                    this.setState({ textempty: 'Không có dữ liệu', refreshing: false })
                }
            } else { //UB
                // this.loadDSCount = dataLinhVuc.length;
                // for (let index = 0; index < dataLinhVuc.length; index++) {
                //     const item = dataLinhVuc[index];
                //     let keys = `LinhVuc|${fillterKeys}`;
                //     if (this.IdSource != 'CA') {
                //         keys = `ChuyenMuc|${fillterKeys}`;
                //     }
                //     let vals = `${item[keyID]}|${fillterVals}`
                //     const res = await apis.ApiPhanAnh.GetDanhSachPAFilter(false, 1, 3, keys, vals);
                //     if (res.status == 1) {
                //         // Utils.nlog(item[keyID], res)
                //         await data.push({
                //             IdLinhVuc: item[keyID],
                //             LinhVuc: item[this.IdSource == 'CA' ? 'LinhVuc' : 'TenChuyenMuc'],
                //             filterKey: keys,
                //             filterVal: vals,
                //             Color: index,
                //             DataList: res.data ? res.data : [],
                //             page: res.page ? res.page : null
                //         })
                //     } else {
                //         this.loadDSCount--;
                //     }
                //     if ((res.data ? res.data : [].length == 0))
                //         this.loadDSCount--;

                //     if (index == dataLinhVuc.length - 1) {
                //         //đến phần tử cuối cùng thì sort rồi setstate;
                //         if (data.length > 0) {
                //             data = data.map(item2 => {
                //                 if (item2.DataList.length > 0) {
                //                     return { ...item2, keySrort: new Date(moment(item2.DataList[0].NgayGui, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD')).getTime() }
                //                 } else {
                //                     return { ...item2, keySrort: 0 }
                //                 }
                //             })
                //             await data.sort(this.compare2);

                //             this.setState({ dataGroup: data, refreshing: false })
                //         }
                //     }
                //     if (this.loadDSCount == 0)
                //         this.setState({ textempty: 'Không có dữ liệu', refreshing: false })
                // }
            }
        } else { //Xử lý load more
            let keys = `LinhVuc|${fillterKeys}`;
            if (this.IdSource != 'CA') {
                keys = `ChuyenMuc|${fillterKeys}`;
            }
            let vals = `${currentLinhVuc[keyID]}|${fillterVals}`
            const res = await apis.ApiPhanAnh.GetDanhSachPAFilter(false, 1, 3, keys, vals);
            if (res.status == 1 && res.data) {
                data.push({
                    IdLinhVuc: currentLinhVuc[keyID],
                    LinhVuc: currentLinhVuc[this.IdSource == 'CA' ? 'LinhVuc' : 'TenChuyenMuc'],
                    filterKey: keys,
                    filterVal: vals,
                    Color: currentLinhVuc.index,
                    DataList: res.data ? res.data : [],
                    page: res.page ? res.page : null
                })
            }
            this.setState({ dataGroup: data.concat([]), refreshing: false, textempty: 'Không có dữ liệu' })
        }
    }

    // HÀM SO SÁNG SẮP XẾP
    compareKey(a, b, key) {
        if (a[key] < b[key]) {
            return 1;
        } else if (a[key] > b[key]) {
            return -1;
        } else {
            return 0;
        }
    }

    // HÀM SO SÁNG SẮP XẾP
    compare2(a, b) {
        if (a.keySrort < b.keySrort) {
            return 1;
        } else if (a.keySrort > b.keySrort) {
            return -1;
        } else {
            return 0;
        }
    }

    // GET DANH SÁCH CỘNG ĐỒNG
    _getListCongDong = async (more = false) => {
        const { fillterKeys, fillterVals } = this.state
        let res = await apis.ApiPhanAnh.GetDanhSachPAFilter(more, 1, this.state.size, fillterKeys, fillterVals, '', true);
        var { data = [], page = {} } = res;
        if (res.status == 1 && res.data) {
            if (page != null) {
                this.pageAll = page.AllPage
                this.setState({ data, page: page.Page, refreshing: false })
            } else {
                this.setState({ data, refreshing: false, textempty: 'Danh sách trống' })
            };
        } else {
            this.setState({ refreshing: false, data: [], textempty: 'Danh sách trống' })
        };
    }

    // HÀM SO SÁNG SẮP XẾP
    compare(a, b) {
        if ((a.STT < b.STT) || (a.Prior < b.Prior)) {
            return -1;
        }
        if ((a.STT > b.STT) || (a.Prior < b.Prior)) {
            return 1;
        }
        return 0;
    }

    // GET LĨNH VỰC
    _getListLinhVuc = async (isUB = false) => {
        let res = {}
        if (isUB) //'UB'
            res = await apis.ApiPhanAnh.GetList_ChuyenMucAppTN();
        else //'CA'
            res = await apis.ApiPhanAnh.GetList_LinhVucApp();
        if (res.status == 1 && res.data) {
            let data = res.data.reverse();
            data = data.sort(this.compare);
            if (!isUB) // chỉ set GetList_LinhVucApp để hiển thị icon maps.
                ROOTGlobal[nGlobalKeys.dataLV_CM] = data;
            if (this.IdSource != 'CA' && !isUB) {
                this._getListLinhVuc(true);
                return;
            }
            this.props.setListLVFilter(data);
            this.setState({ dataLinhVuc: data }, this._GetListTheoChuyenMucMucDo)
        }
    }

    // GOSCREEN ĐẾN MÀN HÌNH CHI TIẾT PA
    goscreen = (IdPA = {}) => {
        Utils.goscreen(this, 'Modal_ChiTietPhanAnh', { IdPA: IdPA });
    }

    // RENDER ITEM DANH SÁCH CỘNG DỒNG (KIỂU CŨ)
    _renderItem = ({ item, index }) => {
        var {
            ListHinhAnh = [],
            IdPA,
            SoLuongTuongTac = 0,
            ChuyenMuc
        } = item;
        var arrImg = []; var arrLinkFile = [];
        ListHinhAnh.forEach(item => {
            const url = item.Path;
            let checkImage = Utils.checkIsImage(item.Path);
            if (checkImage) {
                arrImg.push({
                    url: appConfig.domain + url
                })
            } else {
                arrLinkFile.push({ url: url, name: item.TenFile })
            }

        });

        return <ItemDanhSach_Sub
            nthis={this}
            numberComent={SoLuongTuongTac}
            dataItem={item}
            goscreen={() => Utils.goscreen(this, 'Modal_ChiTietPhanAnh', { IdPA: IdPA, TenChuyenMuc: ChuyenMuc, SoLuongTuongTac: SoLuongTuongTac })}
            showImages={() => this._showAllImages(arrImg, 0)} />
    }

    // RENDER ITEM DANH SÁCH CỘNG ĐỒNG THEO TỪNG GROUP (KIỂU MỚI)
    _renderGroup = ({ item, index }) => {
        return (
            <View style={{ paddingHorizontal: 15 }}>
                <ItemGroupLinhVuc item={item} nthis={this} />
            </View>
        )
    }

    _keyExtrac = (item, index) => index.toString();

    // RELOAD DANH SÁCH PA
    _onRefresh = () => {
        this.setState({ refreshing: true, textempty: 'Đang tải...' }, async () => await this._GetListTheoChuyenMucMucDo())
    }

    // HÀM HIỂN THỊ LOADING LOADMORE FLATLIST
    _ListFooterComponent = () => {
        if (this.state.page < this.pageAll)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }

    // HÀM THỰC HIỆN LOADMORE DS CỘNG ĐỒNG (KIỂU DS CŨ)
    loadMore = async () => {
        const { page, size, fillterKeys, fillterVals } = this.state;
        Utils.nlog('page', page)
        const pageNumber = page + 1;
        if (page < this.pageAll) {
            let res = await apis.ApiPhanAnh.GetDanhSachPAFilter(false, pageNumber, size, fillterKeys, fillterVals, '', true);
            if (res.status == 1 && res.data) {
                const data = [...this.state.data, ...res.data];
                this.setState({ data, page: pageNumber, });
            };
        };
    };

    // HÀM XỬ LÝ ẨN HIỆN MŨI TÊN CHUYÊN MỤC
    _handleScroll = (event: Object) => {
        // console.log('event.nativeEvent.contentOffset', event.nativeEvent)
        let { contentSize, contentOffset, layoutMeasurement } = event.nativeEvent
        const delta = contentOffset.x + layoutMeasurement.width - contentSize.width
        //1: hien next: ,-1:hien back, 0: hien 2 nut
        if (contentOffset.x <= 0) {
            //an back
            this.setState({ showNext: 1 })
            return;
        }
        if ((delta < 5 && delta > 0) || (delta < 0 && delta > -5) || delta == 0) {
            //an next
            this.setState({ showNext: -1 })
            return;
        }
        if (this.state.showNext != 0) {
            this.setState({ showNext: 0 })
        }


    }

    // RENDER HEDER DANH SÁCH CĐ
    _ListHeaderComponent = () => {
        var { dataLinhVuc, dataFilter, keyID } = this.state;
        let item = this.IdSource == 'CA' ? { IdLinhVuc: -1, LinhVuc: 'Tổng hợp' } : { IdChuyenMuc: -1, LinhVuc: 'Tổng hợp' }
        return (
            <View style={{ backgroundColor: colors.BackgroundHome }}>
                <View style={{ flexDirection: 'row', backgroundColor: colors.white, paddingVertical: 5, paddingHorizontal: 5 }}>
                    <TouchableOpacity
                        onPress={() => this.setState({ currentLinhVuc: item }, this._GetListTheoChuyenMucMucDo)}
                        style={{
                            // IdLinhVuc: -1, LinhVuc: 'Tổng hợp' } : { IdChuyenMuc:
                            flexDirection: 'row', backgroundColor: this.state.currentLinhVuc[keyID] == -1 ? this.props.theme.colorLinear.color[0] + '0D' : colors.white,
                            alignItems: 'center',
                            borderRadius: 3, paddingVertical: 8,
                            paddingHorizontal: 8
                        }}>
                        <ImageCus defaultSourceCus={Images.icNewss} source={this.LogoAppHome ? { uri: this.LogoAppHome } : Images.icNewss} style={nstyles.nstyles.nIcon20} resizeMode='cover' />
                        <Text style={{ marginLeft: 5, fontWeight: 'bold', color: this.state.currentLinhVuc[keyID] == -1 ? this.props.theme.colorLinear.color[0] : colors.black_50 }}>{'Tổng hợp'}</Text>
                    </TouchableOpacity>
                    <View style={{ width: 1, height: '100%', backgroundColor: colors.black_20, marginHorizontal: 5, alignSelf: 'center' }}></View>
                    {this.isDropDownChuyenMuc == 'false' ?
                        <>
                            {this.state.showNext == -1 || this.state.showNext == 0 ?
                                <View style={{ width: 20, alignItems: 'center', justifyContent: 'center', borderTopRightRadius: 5, borderBottomRightRadius: 5, opacity: 0.5 }}>
                                    <Text style={{ color: colors.colorTextSelect, fontWeight: 'bold', fontSize: reText(18) }}>{'«'}</Text>
                                </View>
                                : <View style={{ width: 20 }} />}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEventThrottle={10} onScroll={this._handleScroll} >
                                {dataLinhVuc.map(this._renderChuyenMuc)}
                            </ScrollView>
                            {this.state.showNext == 1 || this.state.showNext == 0 ?
                                <View style={{ width: 20, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, opacity: 0.5 }}>
                                    <Text style={{ color: colors.colorTextSelect, fontWeight: 'bold', fontSize: reText(18) }}>{'»'}</Text>
                                </View>
                                : <View style={{ width: 20 }} />}
                        </> :
                        <TouchableOpacity
                            onPress={() => Utils.goscreen(this, 'ModalDropChuyenMuc',
                                {
                                    dataChuyenMuc: this.state.dataLinhVuc,
                                    currentLinhVuc: this.state.currentLinhVuc,
                                    checkCA: this.IdSource == 'CA' ? 'true' : 'false',
                                    callbackCM: (val) => this.setState({ currentLinhVuc: val }, this._GetListTheoChuyenMucMucDo)
                                })}
                            style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center', paddingHorizontal: 5, backgroundColor: this.state.currentLinhVuc[keyID] != -1 ? this.props.theme.colorLinear.color[0] + '0D' : colors.white }}>
                            <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center' }}>
                                <Image source={Images.icMenuChuyenMuc} style={{ marginRight: 5 }} />
                                <Text numberOfLines={2} style={{
                                    color: this.state.currentLinhVuc[keyID] != -1 ? this.props.theme.colorLinear.color[0] : colors.black_50, fontWeight: 'bold',
                                    textAlign: 'center', flex: 1
                                }}>
                                    {this.state.currentLinhVuc.IdChuyenMuc == '-1' ? (this.IdSource == 'CA' ? 'Chọn lĩnh vực' : 'Chọn chuyên mục') : (this.IdSource == 'CA' ? this.state.currentLinhVuc.LinhVuc : this.state.currentLinhVuc.TenChuyenMuc)}
                                </Text>
                            </View>
                            <Image source={Images.icDropDownMini} style={{ width: Width(3), height: Width(2), tintColor: colors.black_60 }} />
                        </TouchableOpacity>
                    }
                </View>
                <View
                    style={[nstyles.nstyles.nrow, { paddingVertical: 5, width: '100%', marginTop: 10, paddingHorizontal: 15 }]}>
                    {dataFilter.map(this._renderFilter)}
                </View>
                {this.props?.auth?.tokenCD?.length > 0 && <ListCare />}
            </View>
        )
    }

    // XỬ LÝ ẨN HIỆN TABBOTTOM
    handleScroll = (event: Object) => {
        let ytemp = event.nativeEvent.contentOffset.y;

        let deltaY = ytemp - this.yNext;
        this.yNext = ytemp;
        //----
        this.animaDelta += deltaY;
        if (this.animaDelta > 160) {
            this.animaDelta = 160;
            if (this.isTabStatus != -1 && ytemp > 50) {
                this.isTabStatus = -1;
                //run animation 1
                nthisTabBarHome._startAnimation(-100);

            };
        };
        if (this.animaDelta < 0 || ytemp <= 0) {
            this.animaDelta = 0;
            if (this.isTabStatus != 1) {
                this.isTabStatus = 1;
                nthisTabBarHome._startAnimation(0);
            };
        };
    };

    // HIỂN THỊ DANH SÁCH HÌNH ẢNH CỦA MỘT ITEM
    _showAllImages = (arrImage = [], index = 0) => {
        Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: arrImage, index });
    }

    // RENDER CHUYÊN MỤC
    _renderChuyenMuc = (item, index) => {
        const { keyID } = this.state;
        if (index < linhvuc_color.length)
            linhvuc_color[index].IdLV = item.IdLinhVuc;
        if (item[this.IdSource == 'CA' ? 'Display' : 'HienThi'] == true) {
            return (
                <TouchableOpacity
                    onPress={async () => {
                        if (this.state.refreshing == true) {
                            return;
                        } else {
                            await analytics().logEvent(KeyAnalytics.item_category_press, {
                                "data": item
                            })
                            this.setState({ currentLinhVuc: item }, this._GetListTheoChuyenMucMucDo)
                        }
                    }}
                    key={index}
                    style={[stCongDong.containerChuyenMuc, { borderRadius: 4, paddingVertical: 8, backgroundColor: item[keyID] == this.state.currentLinhVuc[this.IdSource == 'CA' ? 'IdLinhVuc' : 'IdChuyenMuc'] ? this.props.theme.colorLinear.color[0] + '0D' : 'white', }]}>
                    <Text style={[styles.text13, {
                        textAlign: 'center',
                        color: item[keyID] == this.state.currentLinhVuc[keyID] ? this.props.theme.colorLinear.color[0] : colors.black_50, fontWeight: 'bold'
                    }]}>{item[this.IdSource == 'CA' ? 'LinhVuc' : 'TenChuyenMuc']}</Text>
                </TouchableOpacity>)
        } else {
            return null
        }
    }

    // RENDER ITEM CHUYÊN MỤC
    _renderFilter = (item, index) => {
        var { key, value, title, icon } = item
        var { filterChoose, dataFilter, keyID } = this.state
        return (
            <TouchableOpacity
                onPress={() => this._chooseFilter(index, key, value)}
                key={index}
                style={[nstyles.nstyles.nmiddle, nstyles.nstyles.nrow,
                {
                    backgroundColor: filterChoose == index ? this.props.theme.colorLinear.color[0] + '0D' : colors.white,
                    paddingVertical: 5,
                    flex: 1,
                    paddingHorizontal: 10,
                    borderTopLeftRadius: index == 0 ? 5 : 0,
                    borderBottomLeftRadius: index == 0 ? 5 : 0,
                    borderTopRightRadius: index == dataFilter.length - 1 ? 5 : 0,
                    borderBottomRightRadius: index == dataFilter.length - 1 ? 5 : 0,
                    borderWidth: 0.5,
                    borderColor: colors.black_11
                }]}>

                {value == '3' ?
                    <LottieView
                        source={require('../../images/red_alert.json')}
                        style={{ width: Width(7), marginRight: -5 }}
                        loop={true}
                        autoPlay={true}
                    /> :
                    <Image source={icon}
                        style={[nstyles.nstyles.nIcon18, { tintColor: filterChoose == index ? this.props.theme.colorLinear.color[0] : colors.black_60 }]} />}
                <Text style={[styles.text16, { color: filterChoose == index ? this.props.theme.colorLinear.color[0] : colors.black_60, paddingLeft: 5, fontWeight: 'bold' }]}>{title}</Text>

            </TouchableOpacity>
        );
    };

    // SELECT CHUYEN MUC
    _chooseFilter = async (id, key, value) => {

        await analytics().logEvent(KeyAnalytics.item_category_press, {
            data: value,
            id: id
        })
        Utils.nlog('Chose', id, key, value);
        if (this.state.refreshing == true) {
            return;
        } else {
            if (this.state.filterChoose != id) {
                this.setState({
                    filterChoose: id,
                    fillterKeys: key,
                    fillterVals: value,
                    refreshing: true,
                }, this._GetListTheoChuyenMucMucDo);
            };
        }

    }

    // MỞ MÀN HÌNH BẢN ĐỒ
    _MapView = () => {
        var { data } = this.state;
        Utils.goscreen(this, 'Modal_MapHome', {
            dataitem: data,
            getListCongDong: this._getListCongDong,
            nthis: this
        });
    }

    // MỞ MÀN HÌNH TÌM KIỂM PHẢN ÁNH
    _search = () => {
        Utils.goscreen(this, 'Search')
    };

    render() {
        const { nrow, nmiddle } = nstyles.nstyles;
        Utils.nlog("dataLinhVUc:", this.state.dataLinhVuc)
        return (
            <View style={[nstyles.nstyles.ncontainer, { backgroundColor: colors.BackgroundHome, }]}>
                <Header
                    isLeft={true}
                    numberIconright={2}
                    onPressMap={this._MapView}
                    onPressSearch={this._search}
                    nthis={this}
                />
                <View style={[nstyles.nstyles.nbody, {
                    width: nstyles.Width(100), marginTop: 1
                }]}>
                    <FlatList
                        getItemLayout={(data, index) => (
                            { length: 0, offset: 0, index }
                        )}
                        extraData={this.state}
                        scrollEventThrottle={10}
                        onScroll={this.handleScroll}
                        contentContainerStyle={{ paddingBottom: nstyles.paddingBotX + 20 + (Platform.OS === 'android' ? 60 : 50), }}
                        renderItem={this._renderGroup}
                        data={this.state.dataGroup}
                        ListEmptyComponent={<ListEmpty textempty={this.state.textempty} isImage={!this.state.refreshing} />}
                        ListHeaderComponent={this._ListHeaderComponent}
                        keyExtractor={this._keyExtrac}
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        // Performance settings
                        removeClippedSubviews={true} // Unmount components when outside of window 
                        initialNumToRender={2} // Reduce initial render amount
                        maxToRenderPerBatch={1} // Reduce number in each render batch
                        updateCellsBatchingPeriod={100} // Increase time between renders
                        windowSize={7} // Reduce the window size
                    />
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    theme: state.theme,
    auth: state.auth
});
export default Utils.connectRedux(CongDong, mapStateToProps, true)
const stCongDong = StyleSheet.create({
    containerChuyenMuc: {
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,
        maxWidth: 140,
        marginRight: 10,

    }
})
