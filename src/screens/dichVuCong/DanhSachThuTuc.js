import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, FlatList, Platform, ActivityIndicator, BackHandler } from 'react-native'
import { nstyles, paddingTopMul } from '../../../styles/styles';
import { colors } from '../../../styles';
import { Images } from '../../images';
import { reText } from '../../../styles/size';
import Utils from '../../../app/Utils';
import apis from '../../apis';
import { HeaderCus, IsLoadingNew, ListEmpty } from '../../../components';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { nkey } from '../../../app/keys/keyStore';
import { appConfig } from '../../../app/Config';
export class DanhSachThuTuc extends Component {
    constructor(props) {
        super(props);
        this.DonViID = Utils.ngetParam(this, 'DonViID');
        this.LinhVucID = Utils.ngetParam(this, 'LinhVucID');
        this.TenLinhVuc = Utils.ngetParam(this, 'TenLinhVuc');
        this.TenThuTuc = Utils.ngetParam(this, 'TenThuTuc', "");
        this.isCheckScreenSeach = Utils.ngetParam(this, 'isCheckScreenSeach', false);
        this.state = {
            refreshing: true,
            dataThuTuc: [],
            pageAll: 0,
            page: 1,
            DataInfo: Utils.getGlobal(nGlobalKeys.InfoUserSSO, ''),
            textempty: 'Đang tải...'
        }

    }
    componentDidMount() {
        Utils.nlog("1.", this.DonViID)
        Utils.nlog("2.", this.LinhVucID)
        Utils.nlog("3.", this.TenThuTuc)
        Utils.nlog("4.", this.isCheckScreenSeach)


        this.LoadCBoLinhVuc()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goback(this)
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    _onRefresh = () => {
        this.setState({ page: 1, refreshing: true }, () => this.LoadCBoLinhVuc());
    }

    LoadCBoLinhVuc = async () => {
        nthisIsLoading.show();
        let dataBoDy = new FormData();
        let obj = JSON.stringify({
            "DonViID": this.DonViID,
            "LinhVucID": this.LinhVucID,
            "TenThuTuc": this.TenThuTuc,
            "MucDo": "0",
            "PageNum": this.state.page,
            "PageSize": 9
        })
        dataBoDy.append("data", obj)
        Utils.nlog("123456", obj)
        const res = await apis.ApiDVC.GetDanhSachTTHCDVC(dataBoDy);
        Utils.nlog("<><>LoadCBoLinhVuc123", res)
        if (res.status == 1) {
            nthisIsLoading.hide();
            this.setState({
                dataThuTuc: res.data.data.DICHVUCONG_THUTUCHANHCHINH_PResult,
                refreshing: false,
                pageAll: res.data.data.DICHVUCONG_THUTUCHANHCHINH_PResult[0].TotalCount,
                page: 1,
                textempty: 'Không có dữ liệu'
            })
        }
        else {
            this.setState({
                dataThuTuc: [],
                refreshing: false,
                pageAll: 0,
                textempty: 'Không có dữ liệu'
            })
            nthisIsLoading.hide();
        }
    }

    goSreenDetail_ThuTuc = async (item) => {
        Utils.goscreen(this, 'ctthutuc', {
            DonViID: this.DonViID,
            LinhVucID: this.LinhVucID,
            TenThuTuc: item.TenThuTuc,
            MucDo: item.MucDo,
            ThuTucID: item.ThuTucHanhChinhID,
            DataInfo: this.state.DataInfo,
            itemThuTuc: item
        })
    }

    _renderDSThuTuc = ({ item, index }) => {
        return (
            <TouchableOpacity key={index}
                onPress={() => this.goSreenDetail_ThuTuc(item)}
                style={{
                    paddingHorizontal: 10,
                    paddingVertical: 10, backgroundColor: colors.white, marginBottom: 5,
                    marginHorizontal: 15, borderRadius: 5,
                }}>
                <View style={{ paddingVertical: 3, backgroundColor: colors.organgeMucDo, width: 90, borderRadius: 3, alignSelf: 'flex-end', marginBottom: 5 }}>
                    <Text style={{ color: colors.white, alignSelf: 'center', fontSize: reText(13), fontWeight: '600' }}>Mức độ: {item.MucDo}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={Images.icDichVC} style={[nstyles.nAva40, {}]} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignSelf: 'center' }}>
                        <Text style={{ marginLeft: 10, fontSize: reText(14), flex: 10 }} >{item.TenThuTuc}</Text>
                        <Image source={Images.icBack} style={[nstyles.nIcon14, { tintColor: this.props.theme.colorLinear.color[0], alignSelf: 'center', transform: [{ rotate: "180deg" }] }]} resizeMode='contain' />
                    </View>
                </View>

            </TouchableOpacity>
        )
    }
    _goBack = () => {
        if (this.isCheckScreenSeach) {
            Utils.goscreen(this, 'dsdonvi')
        }
        else {
            Utils.goback(this);
        }
    }

    loadMore = async () => {
        if ((this.state.page) * 10 < this.state.pageAll) {
            const pageNumber = this.state.page + 1;

            let dataBoDy = new FormData();
            let obj = JSON.stringify({
                "DonViID": this.DonViID,
                "LinhVucID": this.LinhVucID,
                "TenThuTuc": this.TenThuTuc,
                "MucDo": "0",
                "PageNum": pageNumber,
                "PageSize": "10"
            })
            dataBoDy.append("data", obj)
            Utils.nlog("123456", obj)
            const res = await apis.ApiDVC.GetDanhSachTTHCDVC(dataBoDy);
            // if (page < this.pageAll) {
            Utils.nlog('data list cong dong2', res)
            if (res.status == 1) {
                const data = [...this.state.dataThuTuc, ...res.data.data.DICHVUCONG_THUTUCHANHCHINH_PResult];
                this.setState({ dataThuTuc: data, page: pageNumber });
            }
            // }    
        };
    };
    _ListFooterComponent = () => {
        if (this.state.page * 10 < this.state.pageAll)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }

    render() {
        const { dataThuTuc, refreshing } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={'Danh sách thủ tục'}
                    styleTitle={{ color: colors.white }}
                />
                <View style={{ backgroundColor: colors.BackgroundHome, flex: 1 }}>
                    <FlatList
                        style={{ marginVertical: 10 }}
                        data={dataThuTuc}
                        renderItem={this._renderDSThuTuc}
                        ListEmptyComponent={<ListEmpty textempty={this.state.textempty} isImage={false} />}
                        keyExtractor={(item, index) => index.toString()}
                        refreshing={refreshing}
                        onRefresh={this._onRefresh}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={0.2}
                        ListFooterComponent={this._ListFooterComponent}
                    />
                </View>
                {/* <IsLoadingNew /> */}
            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme
});

export default Utils.connectRedux(DanhSachThuTuc, mapStateToProps, true)
