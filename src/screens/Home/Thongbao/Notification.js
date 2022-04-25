import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity,
    Image, ImageBackground, FlatList, Animated, Platform, ActivityIndicator
} from 'react-native';
import { Images } from '../../../images';
import { nstyles, colors, sizes } from '../../../../styles';
import { HeaderCus, ListEmpty } from '../../../../components';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../styles';
import Utils from '../../../../app/Utils';
import apis from '../../../apis';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import { nkey } from '../../../../app/keys/keyStore';
import { reText } from '../../../../styles/size';
import moment from 'moment'
import { Width } from '../../../../styles/styles';
class Notification extends Component {
    constructor(props) {
        super(props);
        this.pageAll = 0;
        this.yNext = 0;
        this.animaDelta = 0; //0-100
        this.isTabStatus = 1;
        this.state = {
            refreshing: true,
            data: [],
            page: 0,
            size: 10,
            marginTop: new Animated.Value(0),
            marginTop2: new Animated.Value(0),
        };
    }
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
                // nthisTabBarHome._startAnimation(-100);
                this._startAnimation2(-150);
                this._startAnimation3(-120)

            };
        };
        if (this.animaDelta < 0 || ytemp <= 0) {
            this.animaDelta = 0;
            if (this.isTabStatus != 1) {
                this.isTabStatus = 1;
                // nthisTabBarHome._startAnimation(0);
                this._startAnimation2(0);
                this._startAnimation3(-10)
            };
        };
    };
    componentDidMount() {
        this._getNoti()
    }
    _getNoti = async () => {
        const { size } = this.state
        const res = await apis.ApiPhanAnh.GetList_ThongBaoApp(Platform.OS == 'ios' ? '1' : '0', 1, size);
        // Utils.nlog("res gia tri thong bao lan dau", res)
        if (res.status == 1 && res.data) {
            // Utils.nlog("vao co data=====Notification", res)
            var { data = [] } = res
            res.page ? this.pageAll = res.page.AllPage : this.pageAll = 0
            this.setState({ data: data, page: res.page ? res.page.Page : 0, refreshing: false });
        } else {
            this.setState({ refreshing: false, data: [] })
        }
    }
    _startAnimation2 = (value) => {
        Animated.timing(this.state.marginTop, {
            toValue: value,
            duration: 300
        }).start();


    };
    _startAnimation3 = (value) => {
        Animated.timing(this.state.marginTop2, {
            toValue: value,
            duration: 300
        }).start();

    };
    loadMore = async () => {
        const { page, size } = this.state;
        Utils.nlog('page', page)
        const pageNumber = page + 1;
        if (page < this.pageAll) {
            // const res = await apis.ApiPhanAnh.GetList_ThongBaoApp(tungay, pageNumber, size);
            const res = await apis.ApiPhanAnh.GetList_ThongBaoApp(Platform.OS == 'ios' ? '1' : '0', pageNumber, size);
            Utils.nlog('data list tb', res)
            if (res.status == 1 && res.data) {
                const data = [...this.state.data, ...res.data];
                this.setState({ data, page: pageNumber });
            };
        };
    };
    _setIsSeen = () => {

    }
    _goChitietPA = async (item) => {
        var {
            IdPA,
            ChuyenMuc = ''
        } = item;
        if (item.IsSeen == false) {
            const res = await apis.ApiPhanAnh.IsSeen(item.IdNotify);
            // Utils.nlog("gia tri  update is  ", res)
            await this._getNoti();
            Utils.goscreen(this, 'Modal_ChiTietPhanAnh', { IdPA: IdPA, TenChuyenMuc: ChuyenMuc })
        } else {
            Utils.goscreen(this, 'Modal_ChiTietPhanAnh', { IdPA: IdPA, TenChuyenMuc: ChuyenMuc })
        }
    }
    _deleteAll = async () => {
        Utils.showMsgBoxYesNo(this, "Thông báo", "Bạn có muốn xoá hết thông báo này không", "Xoá", "Thoát", async () => {
            let arr = await this.state.data.map((num, index) => {
                return num.IdNotify;
            });
            // Utils.nlog("giá tri arr", arr);
            if (arr.length > 0) {
                const res = await apis.ApiPhanAnh.XoaThongBao(arr);
                if (res.status == 1) {
                    Utils.showMsgBoxOK(this, "Thông báo", "Xoá thành công", "Xác nhận", this._onRefresh);
                } else {
                    Utils.showMsgBoxOK(this, "Thông báo", "Xoá thất bại", "Xác nhận");
                }
            }

        })
    }
    _DeleteNoti = async (item) => {
        Utils.showMsgBoxYesNo(this, "Thông báo", "Bạn có muốn xoá thông báo này không", "Xoá", "Thoát", async () => {
            let id = [item.IdNotify]
            const res = await apis.ApiPhanAnh.XoaThongBao(id);
            if (res.status == 1) {
                Utils.showMsgBoxOK(this, "Thông báo", "Xoá thành công", "Xác nhận", this._onRefresh);
            } else {
                Utils.showMsgBoxOK(this, "Thông báo", "Xoá thất bại", "Xác nhận");
            }
        })
    }
    _renderItem = ({ item, index }) => {
        const days = item?.NgayGui.slice(0, 10)
        const time = item?.NgayGui.slice(11, 16)
        const NgayHT = new Date;
        const songay = (moment(NgayHT, 'DD/MM/YYYY')).diff(moment(days, 'DD/MM/YYYY'), "days")
        return (
            <TouchableOpacity onPress={() => this._goChitietPA(item)}>
                <View key={index} style={{
                    paddingVertical: 10,
                    backgroundColor: item.IsSeen ? colors.white : colors.colorGrayBgr,
                    paddingHorizontal: 10, borderRadius: 5, margin: 10, borderColor: colors.colorGrayLight
                }}>
                    {/* <Image source={Images.icThongbao} /> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text
                            numberOfLines={1}
                            style={{ color: colors.colorBlueLight, lineHeight: reText(21) }}>{item.TieuDe}</Text>
                        <Text style={{ lineHeight: reText(21), color: colors.black, fontWeight: 'bold', textAlign: 'right' }}>
                            {time}
                        </Text>
                    </View>
                    <Text
                        numberOfLines={2}
                        style={{ lineHeight: reText(21), paddingVertical: 5, color: colors.black_80, }}>
                        {item.NoiDung}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ lineHeight: reText(21), color: colors.black_50, fontStyle: 'italic', }}>
                            {`${songay == 0 ? "Hôm nay" : songay >= 30 ? +Math.floor(songay / 30) + ' tháng trước' : +songay + ' ngày trước'}`}
                        </Text>
                        <TouchableOpacity onPress={() => this._DeleteNoti(item, index)}>
                            <Image source={Images.icDelete} style={[nstyles.nstyles.nIcon20, { tintColor: item.IsSeen ? null : colors.redStar }]} resizeMode='cover' />
                        </TouchableOpacity>
                    </View>

                    {/* <View style={{
                        height: 1,
                        backgroundColor: colors.black_11, marginTop: 15
                    }}>
                    </View> */}
                </View>

            </TouchableOpacity >
        )
    }
    _onRefresh = () => {
        this.setState({ refreshing: true }, this._getNoti)
        // this.setState({ refreshing: true, page: 0, textempty: 'Đang tải...' }, () => this._getData(this.state.hocSinhData.IDKhachHang));
    }
    _ListFooterComponent = () => {
        if (this.state.page < this.pageAll)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }
    render() {
        const { nrow, nmiddle, ncontainerX } = nstyles.nstyles;
        return (
            <View style={ncontainerX}>
                <ImageBackground
                    // defaultSource={Images.icBGDrawer}
                    source={{ uri: Utils.getGlobal(nGlobalKeys.SideMenu) }}
                    style={[
                        { height: 230 }]}>
                    <HeaderCus
                        Sleft={{ tintColor: 'white' }}
                        onPressLeft={() => Utils.goback(this)}
                        iconLeft={Images.icBack}
                        title={'Thông báo'}
                        styleTitle={{ color: colors.white }}
                        titleRight={'Xóa hết'}
                        Sright={{ fontSize: 10 }}
                    />
                    {/* <View style={[{ paddingTop: nstyles.paddingTopMul(), backgroundColor: colors.colorTextSelect }]}>
                        <View style={[nrow, { alignItems: 'center', paddingHorizontal: nstyles.khoangcach, marginTop: 10, marginBottom: 8 }]}>
                            <View style={[nrow, { flex: 1, alignItems: 'center', justifyContent: 'space-between' }]}>
                                <TouchableOpacity onPress={() => Utils.goback(this)} style={{ padding: 5, width: Width(20) }}>
                                    <Image source={Images.icBack} style={[nstyles.nstyles.nIcon20, { tintColor: colors.white }]} resizeMode='contain' />
                                </TouchableOpacity>
                                <Text style={{ fontSize: sizes.reText(16), fontWeight: 'bold', textAlign: 'center', flex: 1, color: colors.white }}>{'Thông báo'}</Text>
                                <TouchableOpacity onPress={this._deleteAll} style={{ padding: 5, width: Width(20), alignItems: 'flex-end' }}>
                                    <Text style={{
                                        fontSize: sizes.reText(14),
                                        fontWeight: 'bold',
                                        color: colors.white,
                                    }}>{`Xoá hết`}</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View> */}
                </ImageBackground>
                <Animated.View style={{ marginTop: this.state.marginTop2, zIndex: 10, flex: 1 }}>
                    <View style={[styles.shadown,
                    {
                        position: 'absolute', left: 10, right: 10,
                        top: -10, elevation: 3, zIndex: 10,
                        backgroundColor: colors.colorGrayBGCB,
                        bottom: 10,
                    }]}>
                        <FlatList
                            scrollEventThrottle={10}
                            onScroll={this.handleScroll}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={[this.state.data.length > 0 ? {} : { flex: 1 }, {
                                paddingBottom: nstyles.paddingBotX + 20 + (Platform.OS === 'android' ? 60 : 0),
                            }]}
                            renderItem={this._renderItem}
                            data={this.state.data}
                            // ListEmptyComponent={<ListEmpty textempty={this.state.textempty} />}
                            ListEmptyComponent={<ListEmpty textempty='Không có dữ liệu' handleScroll={this.handleScroll} />}
                            keyExtractor={(item, index) => index.toString()}
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                            onEndReached={this.loadMore}
                            onEndReachedThreshold={1}
                            ListFooterComponent={this._ListFooterComponent}
                        />
                    </View>
                </Animated.View>

            </View >
        );
    }
}

export default Notification;
