import React, { Component } from 'react';
import {
    FlatList,
    View, Text, ActivityIndicator, Platform
} from 'react-native';
import ItemDanhSach from '../../Home/components/ItemDanhSach';
import apis from '../../../apis';
import { ListEmpty, IsLoading } from '../../../../components';
import Utils from '../../../../app/Utils';
import { appConfig } from '../../../../app/Config';
import { nstyles, colors } from '../../../../styles';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import { nGlobalKeys } from '../../../../app/keys/globalKey';

const RECORD = 10
class DaGuiAnSinh extends Component {
    constructor(props) {
        super(props);
        this.nthis = props.nthis;
        this.isXoaPA = Utils.getGlobal(nGlobalKeys.XoaPA, '1'); //0: Ko dc xoa PA; 1: dc Xoa PA
        this.state = {
            daGuiList: [],
            _page: 1,
            _allPage: 1,
            refreshing: false,
            textempty: 'Đang tải...',
        }
        this.refLoading = React.createRef(null);
    }
    componentDidMount() {
        this.getFirstData();
        ROOTGlobal.dataGlobal._onRefreshDaGuiAnSinh = this._onRefresh;
    }
    getFirstData = async () => {
        await this.getListDaGuiAnSinh();
    }

    getListDaGuiAnSinh = async () => {
        var {
            daGuiList,
            textempty,
            _page,
            _allPage,
        } = this.state;
        this.setState({ refreshing: true });
        // this.refLoading.current.show();
        let res = await apis.ApiPhanAnh.GetDanhSachPAFilterDaGuiAnSinh(_page, 10, this.props.objectfilter);
        // this.refLoading.current.hide();
        Utils.nlog("DS DaGuiAnSinh:", res);

        if (res.status == 1) {
            let { data = [], page = {} } = res;

            if (Array.isArray(data) && data.length > 0) {
                if (_page == 1) {
                    daGuiList = data;
                } else {
                    daGuiList = daGuiList.concat(data);
                }
            } else {
                textempty = 'Không có dữ liệu';
                daGuiList = []
            }

            if (page) {
                var {
                    AllPage
                } = page;
                _allPage = AllPage;
            }
        } else {
            if (res == -2) {
                textempty = 'Bạn cần đăng nhập để lấy danh sách đã gửi';
                daGuiList = [];
            }
            if (res.error) {
                let { message = '' } = res.error;
                textempty = `${textempty}`
            }
        };

        this.setState({
            daGuiList,
            textempty,
            _page,
            _allPage,
            refreshing: false
        })
    }
    _onRefresh = () => {
        this.setState({ _page: 1, _allPage: 1, refreshing: true, textempty: 'Đang tải...', daGuiList: [] }, async () => {
            await this.getListDaGuiAnSinh();
            this.setState({ refreshing: false });
        });
    }

    _ListFooterComponent = () => {
        var {
            _page,
            _allPage
        } = this.state;
        return _page < _allPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    _showAllImages = (arrImage = [], index = 0) => {
        Utils.goscreen(this.nthis, 'Modal_ShowListImage', { ListImages: arrImage, index });
    }

    onEdit = async (item) => {
        let {
            IdPA,
            NoiDung,
            DiaDiem,
            ToaDoX,
            ToaDoY,
            ListHinhAnh,
            MucDo,
            NameNoLogin = '',
            PhoneNoLogin = ''
        } = item;
        let tmpHinhAnh = [];
        for (let i = 0; i < ListHinhAnh.length; i++) {
            // Utils.nlog("dataLisstImage", ListHinhAnh[i])
            let item = ListHinhAnh[i];
            if (item.Type == 1) {
                let link = appConfig.domain + item.Path;
                if (link.split(".").pop().toLocaleUpperCase() == 'MP4' || link.split(".").pop().toLocaleUpperCase() == 'MOV') {
                    tmpHinhAnh.push({
                        ...item,
                        url: link,
                        uri: link,
                        // imagePart: { uri: link },
                        isOld: true,
                        video: true
                    })
                } else {
                    tmpHinhAnh.push({
                        ...item,
                        url: link,
                        uri: link,
                        // imagePart: { uri: link },
                        isOld: true
                    })
                }
            }
            else {
                let link = appConfig.domain + item.Path;
                tmpHinhAnh.push({
                    ...item,
                    url: link,
                    uri: link,
                    isOld: true,
                })
            }
        }

        let data = {
            IdPA: IdPA,
            diaDiem: DiaDiem,
            noiDungGui: NoiDung,
            ListHinhAnh: tmpHinhAnh,
            latlng: {
                latitude: ToaDoX,
                longitude: ToaDoY
            },
            MucDo,
            NameNoLogin,
            PhoneNoLogin
        }

        Utils.goscreen(this.nthis, 'Modal_YeuCauHoTroTuiAnSinh', { "isModalGuiPA": 102, data: data, isEdit: 1 });
        let onListeningDataPA = ROOTGlobal.dataGlobal._onListeningDataTuiAnSinh
        if (onListeningDataPA) {
            onListeningDataPA(data);
        }
    }

    _renderItem = (item, index) => {
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
                // arrLinkFile.push({ url: url, name: item.TenFile })
            }

        });

        let showEdit = item.Status == 1
        return (
            <ItemDanhSach
                isAnSinhXaHoi={true}
                _onRefresh={this._onRefresh}
                showDel={this.isXoaPA == '1'}
                showEdit={showEdit}
                onEdit={this.onEdit}
                nthis={this.nthis}
                numberComent={SoLuongTuongTac}
                dataItem={item}
                // type={arrImg.length > 0 ? 1 : 2}
                isShare={false}
                goscreen={() => Utils.goscreen(this.nthis, 'Modal_ChiTietTuiAnSinh', { IdPA: IdPA, TenChuyenMuc: ChuyenMuc })}
                showImages={() => this._showAllImages(arrImg)}
            />
        )
    }

    loadMore = () => {
        let { _page, _allPage } = this.state;
        if (_page < _allPage) {
            this.setState({ _page: _page + 1 }, this.getListDaGuiAnSinh);
        }
    };

    render() {
        var { daGuiList, refreshing, textempty } = this.state;
        return (
            <View style={nstyles.nstyles.ncontainer}>
                <View style={[nstyles.nstyles.nbody, { backgroundColor: '#F4F4F4' }]}>
                    <FlatList
                        // style={nstyles.nstyles.nbody}
                        data={daGuiList}
                        //  scrollEventThrottle={10}
                        onScroll={this.props.handleScroll}
                        style={{ marginTop: 10 }}
                        contentContainerStyle={{ padding: 10, paddingBottom: nstyles.paddingBotX + 20 + (Platform.OS === 'android' ? 60 : 0) }}
                        renderItem={({ item, index }) => this._renderItem(item, index)}
                        ItemSeparatorComponent={() => <View style={{ height: 10, }}></View>}
                        ListEmptyComponent={<ListEmpty textempty={textempty} isImage={false} />}
                        keyExtractor={(item, index) => index.toString()}
                        refreshing={refreshing}
                        onRefresh={this._onRefresh}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={1}
                        ListFooterComponent={this._ListFooterComponent}
                    />
                </View>
                <IsLoading ref={this.refLoading} />
            </View>
        )
    }

}
const mapStateToProps = state => ({
    theme: state.theme
});
export default Utils.connectRedux(DaGuiAnSinh, mapStateToProps, true)


