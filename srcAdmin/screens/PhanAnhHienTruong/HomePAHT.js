import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { nstyles, colors, sizes } from '../../../styles';
import HeaderCom from '../../../components/HeaderCom';
import { Images } from '../../images';
import styles from './styles';
import { ItemDanhSach } from './components';
import { ListEmpty, TextInputCom, IsLoading } from '../../../components';
import Utils from '../../../app/Utils';
import apis from '../../apis';
import moment from 'moment';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { NavigationEvents } from 'react-navigation';
import { appConfig } from '../../../app/Config';
import { GetList_TrangThaiPhanAnh } from '../../apis/Autonoibo';
import { ConfigScreenDH } from '../../routers/screen';
import AppCodeConfig from '../../../app/AppCodeConfig';
import { nkey } from '../../../app/keys/keyStore'
import { GetDataPageFacebook, PostFacebook } from '../../../src/apis/apiFaceBook';
import { LoginManager, AccessToken, LoginButton, AppEventsLogger, ShareDialog } from 'react-native-fbsdk';
import { appConfigCus } from '../../../app/Config';

//IdStep : 
// 1 => Tiep nhan
// 2 | 17 => Phan Phoi
// 3 => Xu ly
// 4 => Phe duyet
// 5 => BienTap
class HomePAHT extends Component {
    constructor(props) {
        super(props);
        nthishomePa = this;
        this.pageAll = 0;
        this.AllThaoTac = null;
        this.AllThaoTacKiemSoat = null;
        this.IdStep = Utils.ngetParam(this, 'IdStep', 0)
        this.isMenuMore = Utils.ngetParam(this, 'isMenuMore', 0) //0: Xử lý PA, 1: PA từng tham gia, 2: Kiểm soát PA
        this.LocTheo = Utils.ngetParam(this, 'LocTheo', -1)
        this.dataSetting = {
            selectNguon: { IdNguon: 100, TenNguon: 'Tất cả' },
            selectChuyenMuc: { IdChuyenMuc: 100, TenChuyenMuc: 'Tất cả' },
            selectLinhVuc: { IdLinhVuc: 100, LinhVuc: 'Tất cả' },
            selectMucDo: { IdMucDo: 100, TenMucDo: 'Tất cả' },
            selectLocTheo: [102].includes(this.LocTheo) ? { id: 102, TenQuyen: 'An sinh xã hội' } : { id: -1, TenQuyen: 'Tất cả' },
            selectMucDoKhanCap: { IdKhanCap: 100, TenKhanCap: 'Tất cả' },
            dateTo: '', //moment().startOf('month').add(-15, 'days').format("YYYY-MM-DD"),
            dateFrom: '', //moment(new Date).format("YYYY-MM-DD"),
            keyword: '',
        };
        this.PANB = Utils.ngetParam(this, 'PANB', false); // PANB dungf chung view voi PDPA dung de if else
        this.dataTungThamGia = [
            {
                IdStep: -1,
                TitleStep: 'Phản ánh từng tham gia'
            },
            {
                IdStep: -2,
                TitleStep: 'Phản ánh đơn vị từng phụ trách'
            }
        ]
        this.state = {
            selectBuocXuLy: { IdStep: 100, TitleStep: 'Đang tải...' },
            refreshing: true,
            page: 1,
            dataPA: [],
            sltong: 0,
            textempty: 'Đang tải...',
            isDropDown: false,
            isUseFilter: false,
            rule: false,
        };
        ROOTGlobal[nGlobalKeys.LoadDH].reloadDSPAHome = nthishomePa._onRefreshLoadDS;
        ROOTGlobal[nGlobalKeys.DropDownDH].setDropDown = nthishomePa._setIsDropDown;
        // ROOTGlobal[nGlobalKeys.setDropDownDH].loadItem = nthishomePa.callback;
        ROOTGlobal[nGlobalKeys.setDropDownDH].loadItem = (selectBuocXuLy) => {
            this.setState({ selectBuocXuLy, refreshing: true, isDropDown: true },
                () => this._getListPhanAnh(selectBuocXuLy.IdStep, true));
        }
        // _callback
    };

    componentDidMount() {
        this._getListThaoTac();
        // this._getListPhanAnh(this.IdStep, true)
        if (this.PANB) // goi lai API cap nhat muc do theo panb
            this._GetList_MucDoAll()
        //Lưu dữ liệu global
        Utils.nlog('GIa tri iDSettpp =>>', this.IdStep)
        Utils.setGlobal(nGlobalKeys.dataSetting, this.dataSetting, AppCodeConfig.APP_ADMIN);
        // this._checkRule();
    }

    _openMenu = () => {
        //Dem lai so thong bao
        this.props.GetCountNotification()
        this.props.navigation.openDrawer();
    }
    _openSetting = () => {
        Utils.goscreen(this, 'Modal_HomeSettingDH', { callbacSetting: this._callbackSetting, dataSetting: this.dataSetting });
    }
    _callback = (selectBuocXuLy) => {
        this.setState({ selectBuocXuLy, refreshing: true, isDropDown: true }, () => this._getListPhanAnh(selectBuocXuLy.IdStep, true));
    }

    _callbackSetting = (obj) => {
        Utils.nlog('setting', obj);
        console.log("setting======", obj)
        this.dataSetting = obj;
        Utils.setGlobal(nGlobalKeys.dataSetting, this.dataSetting, AppCodeConfig.APP_ADMIN);
        this._checkUseFilter();
        this.setState({ refreshing: true }, () => this._getListPhanAnh(this.state.selectBuocXuLy.IdStep, true));

    }

    _DropDown = () => {

        let thaotac = []
        if (this.isMenuMore == 1) {
            thaotac = this.dataTungThamGia
        }
        else if (this.isMenuMore == 2) {
            thaotac = this.AllThaoTacKiemSoat //Data của kiểm soát
        }
        else {
            thaotac = this.AllThaoTac
        }
        if (thaotac) {
            Utils.nlog("thao tác nè-----", thaotac)
            Utils.goscreen(this, 'Modal_ListTrangThaiDH', { callback: this._callback, item: this.state.selectBuocXuLy, AllThaoTac: thaotac })
        } else {
            Utils.showMsgBoxOK(this, "Thông báo", "Bạn không có quyền", "Xác nhận");
        }
    }
    _selectTrangThai = (IdStep) => () => {
        this.setState({ selectTrangThai: [IdStep] })
    }
    _renderItem = ({ item, index }) => {
        return (
            <ItemDanhSach
                ThoiGian={this.state.selectBuocXuLy.IdStep == -2 ? 'NgayChuyen' : undefined}
                type={1}
                item={item}
                nthis={this}
                goscreen={() => this._touchItem(item, this.IdStep)}
                goTuongTu={() => this._onTuongTu(item.IdPA, item.NoiDung)}
                goShare={() => this._onShare(item.IdPA)}
                IsDaXyLy={this.isMenuMore}
                check={this.state.rule}
                isCheckTinhTrang={this.isMenuMore == 2 ? 0 : 1} // check tinh trang có phải kiểm soát phản ánh
            />
        )
    };
    _onTuongTu = (IdPA, NoiDung) => {
        Utils.goscreen(this, ConfigScreenDH.Modal_TuongTu, { IdPA, NoiDung })
    }

    //dropdowwn linh vuc
    _viewItem = (item) => {
        Utils.nlog("giá tị item", item)
        return (
            <View
                key={item.id}
                style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    margin: 2,

                }}>
                <Text style={{ paddingVertical: 10 }} >{item.name}</Text>
            </View>
        )
    }
    onChange = async (dataFB, IdPA) => {
        nthisIsLoading.show();

        let id = dataFB.id;
        let accessToken = dataFB.access_token;
        let itemIdPA = IdPA;
        nthisIsLoading.show();
        const postFB = await PostFacebook(id, accessToken, itemIdPA);
        nthisIsLoading.hide();
        console.log('post fb', postFB)
        if (postFB.id) {
            Utils.showMsgBoxOK(this, "Chia sẻ bài viết thành công", 'Xác nhận');
            nthisIsLoading.hide();
        }
        else {
            Utils.showMsgBoxOK(this, "Chia sẻ bài viết thất bại", 'Xác nhận');
            nthisIsLoading.hide();
        }
    }

    _postBai = async (dataFB, IdPA) => {
        // let id = dataFB.data[0].id;
        // let accessToken = dataFB.data[0].access_token;
        console.log('=-=-=-= dataFB', dataFB)
        let id = dataFB.id;
        let accessToken = dataFB.access_token;
        let itemIdPA = IdPA;
        const postFB = await PostFacebook(id, accessToken, itemIdPA);
        nthisIsLoading.show();
        console.log('post fb', postFB)
        if (postFB?.id) {
            Utils.showMsgBoxOK(this, "Chia sẻ bài viết thành công", 'Xác nhận');
            nthisIsLoading.hide();
        }
        else {
            Utils.showMsgBoxOK(this, "Chia sẻ bài viết thất bại", 'Xác nhận');
            nthisIsLoading.hide();
        }
    }

    //share lên facebook
    _onShare = async (IdPA) => {
        LoginManager.setLoginBehavior(Platform.OS == 'ios' ? 'browser' : 'native_with_fallback')
        let FbAPI = await apis.ApiApp.GetConfigByCodeBy('FbApi')
        let domainGraphFb = await apis.ApiApp.GetConfigByCodeBy('DOMAIN_GRAPH_FB')
        // Utils.nlog('FbAPI', FbAPI)
        // Utils.nlog('domainGraphFb', domainGraphFb)

        if (Number.isInteger(FbAPI) && FbAPI < 0 || Number.isInteger(domainGraphFb) && domainGraphFb < 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại', 'Xác nhận');
            return;
        }
        else {
            let accesToken = await Utils.ngetStore(nkey.accessToken);
            Utils.nlog('accesToken: ', accesToken)
            const dataFB = await GetDataPageFacebook(accesToken);
            console.log("=-=-= dataFB", dataFB)
            // trường hợp bắt dăng nhập lại
            if (dataFB?.error) {
                Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn cần tiến hành đăng nhập Facebook!', 'Đăng nhập', async () => {
                    // this.callback();
                    const login = await LoginManager.logInWithPermissions(['pages_show_list', 'pages_manage_instant_articles', 'pages_manage_posts']);
                    console.log("=-=-= login", login)
                    const data1 = await AccessToken.getCurrentAccessToken();
                    if (login.isCancelled == true) {
                        return null
                    }
                    else {

                        console.log('======-=-=-=- data 1', data1)
                        await Utils.nsetStore(nkey.accessToken, data1.accessToken);
                        Utils.goback(this)
                    }
                })
            }
            else {
                if (dataFB?.data?.length == 0) {
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Bạn cần tạo page và cấp quyền!', 'Xác nhận', async () => {
                        // this.callback();
                        const login = await LoginManager.logInWithPermissions(['pages_show_list', 'pages_manage_instant_articles', 'pages_manage_posts']);
                        console.log("=-=-= login", login)
                        const data1 = await AccessToken.getCurrentAccessToken();
                        if (login.isCancelled == true) {
                            return null
                        }
                        else {
                            console.log('======-=-=-=- data 1', data1)
                            await Utils.nsetStore(nkey.accessToken, data1.accessToken);
                            Utils.goback(this);
                        }
                    })

                }
                else {
                    if (dataFB?.data?.length == 1) {
                        this._postBai(dataFB, IdPA)
                    }
                    else {
                        Utils.goscreen(this, 'Modal_ComponentSelectProps', {
                            callback: (val) => this.onChange(val, IdPA), item: dataFB,
                            title: 'Bạn muốn sử dụng Trang nào để tiến hành chia sẻ thông tin?',
                            AllThaoTac: dataFB.data, ViewItem: this._viewItem, Search: false, key: 'không'
                        })
                    }

                }
            }

        }
    }
    _checkRule = async () => {
        var rules = this.props.auth.userDH.Rules;
        Utils.nlog("list ------------Rulus redux", rules)
        let checkRules = rules.find(item1 => item1 == 1033) ? true : false
        if (checkRules) {
            await this.setState({
                rule: checkRules
            })
        }
        // await console.log('this.state', this.state.rule)
    }

    _callbackThis = (nthis) => {
        let screen = 'scHomePAHT'
        if (this.isMenuMore == 2) {
            screen = 'scHomeKiemSoat'
        }
        if (this.isMenuMore == 1) {
            screen = 'scHomePADXL'
        }
        if (this.isMenuMore == 0 && this.LocTheo == 102) {
            screen = 'scHomeAnSinh'
        }

        // if (this.isMenuMore == -1) {
        //     scHomeDL = 'scHomeDL'
        // } // merge xuống du lich an giang thì mở dòng n
        Utils.goscreen(nthis, screen)

    }
    _touchItem = (item, idStep) => {
        const { IdPA, IsComeBackProcess = false } = item;
        let Param = {
            IdPA,
            callback: this._callbackThis,
            PANB: this.PANB,
            isMenuMore: this.isMenuMore,
            DesignDefault: this.state.selectBuocXuLy.IdStep > 0 ? this.state.selectBuocXuLy.IdStep : "0",
            IsComeBackProcess: IsComeBackProcess,
            idStep: this.IdStep
        }
        switch (idStep) {
            case 1:
                Utils.goscreen(this, "sc_ChiTietPAChoTN", Param);
                break;
            case 2:
                Utils.goscreen(this, "sc_ChiTietPAChoPP", Param);
                break;
            case 3:
                Utils.goscreen(this, "sc_ChiTietPAChoXL", Param);
                break;
            case 4:
                Utils.goscreen(this, "sc_ChiTietPAChoPD", Param);
                break;
            case 5:
                Utils.goscreen(this, "sc_ChiTietPAChoDT", Param);
                break;
            default:
                if (this.LocTheo == 102) {
                    Utils.goscreen(this, 'sc_ChiTietAnSinhXaHoi', Param);
                } else {
                    Utils.goscreen(this, this.PANB ? 'sc_ChiTietPhanAnhNB' : this.isMenuMore == 0 ? 'sc_ChiTietPhanAnh' : this.isMenuMore == 1 ? 'sc_ChiTietPhanAnhDXL' : this.isMenuMore == 2 ? 'sc_ChiTietPADonViTungPhuTrach' : 'sc_ChiTietKiemSoatPA',
                        Param);
                }
                break;
        }
        // // const GoDetail = (index) => {

        // // }
        // Utils.nlog('Gia tri nlog =>>>> Item Touch', GoDetail(idStep))

        // Utils.nlog("gia triparam-----------------:-----------------:)", Param);
        //check Project comeback

        // this._onRefresh();
    }
    _keyExtrac = (item, index) => `${item.IdPA + '_' + index}`;
    _onRefresh = () => {
        this.setState({ refreshing: true, textempty: 'Đang tải...', isDropDown: true },
            () => this._getListPhanAnh(this.state.selectBuocXuLy.IdStep, true));
    }
    //dành cho onessignal
    _onRefreshLoadDS = () => {
        this.setState({ refreshing: true, textempty: 'Đang tải...', isDropDown: true },
            () => this._getListPhanAnh(this.state.selectBuocXuLy.IdStep, true, false));
    }
    _ListFooterComponent = () => {
        if (this.state.page < this.pageAll && this.state.dataPA.length > 0)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }
    loadMore = async () => {
        const { page } = this.state;
        const pageNumber = page + 1;
        if (page < this.pageAll) {
            let res = await this.loadDSPA(pageNumber)
            if (res.status == 1 && res.data.length) {
                const dataPA = [...this.state.dataPA, ...res.data];
                this.setState({ dataPA, page: pageNumber });
            };
        };
    };

    loadDSPA = async (pageNumber = 1, idStep = this.state.selectBuocXuLy.IdStep) => {
        let {
            selectNguon,
            selectChuyenMuc,
            selectLinhVuc,
            selectMucDo,
            selectLocTheo,
            selectMucDoKhanCap,
            dateTo,
            dateFrom,
            keyword
        } = this.dataSetting;
        Utils.nlog('Gia tri load PA - Strep Load DS ', idStep)
        const IdLinhVuc = selectLinhVuc.IdLinhVuc == 100 ? '' : selectLinhVuc.IdLinhVuc;
        const IdChuyenMuc = selectChuyenMuc.IdChuyenMuc == 100 ? '' : selectChuyenMuc.IdChuyenMuc;
        const IdMucDo = selectMucDo.IdMucDo == 100 ? '' : selectMucDo.IdMucDo;
        const IdNguon = selectNguon.IdNguon == 100 ? '' : selectNguon.IdNguon;
        const IdQuyen = 1;
        const IdKhanCap = selectMucDoKhanCap.IdKhanCap;
        dateTo = dateTo ? moment(dateTo).format('DD-MM-YYYY') : dateTo;
        dateFrom = dateFrom ? moment(dateFrom).format('DD-MM-YYYY') : dateFrom;
        let res = await apis.Auto.DanhSachPA(
            idStep,  // Phản ánh từng tham gia đang truyền idStep == ""
            pageNumber,
            false,
            10,
            keyword,
            IdLinhVuc,
            IdChuyenMuc,
            IdMucDo,
            IdNguon,
            dateTo,
            dateFrom,
            IdQuyen,
            IdKhanCap,
            selectLocTheo.id,
            this.PANB,
            this.isMenuMore == 2 ? 1 : 0 // 1: kiem soat phan anh
        );
        Utils.nlog('data ds phan anh - XXX:', res);
        if (this.isMenuMore)
            res.sltong = res.page?.Total ? res.page.Total : 0;
        return res;
    }

    _ItemSeparatorComponent() {
        return <View style={{ height: 5, backgroundColor: 'transparent' }} />
    }

    _setIsDropDown = () => {
        this.setState({ isDropDown: false })
    }
    _getListThaoTac = async () => {
        this.setState({ refreshing: true })
        //Thao tác của các Phan anh tung tham gia va phan anh tung phu trach cua don vi
        if (this.isMenuMore) {
            if (this.isMenuMore == 1) {
                const listPA = await this._getListPhanAnh(this.IdStep == -2 ? this.dataTungThamGia[1].IdStep : this.dataTungThamGia[0].IdStep);
                if (listPA) {
                    this.pageAll = listPA.page.AllPage;
                    this.setState({ selectBuocXuLy: this.IdStep == -2 ? this.dataTungThamGia[1] : this.dataTungThamGia[0], dataPA: listPA.data, page: listPA.page.Page, refreshing: false, isDropDown: false }, () => {
                        this.DF_TrangThai = '';
                        this.props.navigation.setParams('id', '');
                    });
                } else {
                    this.setState({ selectBuocXuLy: this.IdStep == -2 ? this.dataTungThamGia[1] : this.dataTungThamGia[0], textempty: 'Không có dữ liệu', refreshing: false, isDropDown: false }, () => {
                        this.DF_TrangThai = '';
                        this.props.navigation.setParams('id', '');
                    });
                };
                return;
            } else {
                //Data của kiểm soát this.isMenuMore == 2 
                const res = await GetList_TrangThaiPhanAnh();
                // Utils.nlog("<><><><>GetList_TrangThaiPhanAnh", res)
                if (res.status == 1) {
                    this.AllThaoTacKiemSoat = [{ "IdStep": '', "TitleStep": "Tất cả", "IdForm": 0, "TenForm": "Tất cả" }];
                    res.data.map((item) => { this.AllThaoTacKiemSoat.push({ "IdStep": item.IdTrangThai, "TitleStep": item.TenTrangThai }) })
                    // Utils.nlog("<><><><> this.AllThaoTacKiemSoat", this.AllThaoTacKiemSoat)
                    const listPA = await this._getListPhanAnh(this.AllThaoTacKiemSoat[0].IdStep);
                    // Utils.nlog("<><><><> this.listPA", listPA)
                    if (listPA && listPA.status == 1) {
                        this.pageAll = listPA.page.AllPage;
                        this.setState({ selectBuocXuLy: this.AllThaoTacKiemSoat[0], dataPA: listPA.data, page: listPA.page.Page, refreshing: false, isDropDown: false });
                    } else {
                        this.setState({ selectBuocXuLy: this.AllThaoTacKiemSoat[0], textempty: 'Không có dữ liệu', refreshing: false, isDropDown: false });
                    };
                }
                // Utils.nlog(">>>>>>>>>>>>>>>>)()()", listPA)
                return;
            }
        }
        //Đây là các thao tác bình thường
        let res = null;
        if (this.PANB) res = await apis.Autonoibo.GetList_ThaoTacXuLy();
        else res = await apis.Auto.GetList_ThaoTacXuLy();

        // Utils.nlog('res noi bo<><><><><><><>', res)

        if (Number.isInteger(res) && res < 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại', 'Xác nhận');
            return;
        };
        if (res.status == 1 && res.data.length > 0) {
            const data = res.data;
            this.AllThaoTac = data;
            this.DF_TrangThai = Utils.ngetParam(this, "id", "");
            // Utils.nlog('this.DF_TrangThai ', this.DF_TrangThai)
            if (this.DF_TrangThai) {
                var selectBuocXuLy = data.find(item => item.IdStep == this.DF_TrangThai);
                // Utils.nlog("gia tri selectbuoc", selectBuocXuLy)
                if (selectBuocXuLy) {
                    const listPA = await this._getListPhanAnh(this.DF_TrangThai);
                    if (listPA) {
                        this.pageAll = listPA.page.AllPage;
                        this.setState({ selectBuocXuLy, dataPA: listPA.data, page: listPA.page.Page, refreshing: false, isDropDown: true }, () => {
                            this.DF_TrangThai = '';
                            this.props.navigation.setParams('id', '');
                        });
                    } else {
                        this.setState({ selectBuocXuLy, textempty: 'Không có dữ liệu', refreshing: false, isDropDown: true }, () => {
                            this.DF_TrangThai = '';
                            this.props.navigation.setParams('id', '');
                        });
                    };
                } else {
                    selectBuocXuLy = res.data[0];
                    const listPA = await this._getListPhanAnh(res.data[0].IdStep);
                    if (listPA) {
                        this.pageAll = listPA.page.AllPage;
                        this.setState({ selectBuocXuLy, dataPA: listPA.data, page: listPA.page.Page, refreshing: false, isDropDown: true }, () => {
                            this.DF_TrangThai = '';
                            this.props.navigation.setParams('id', '');
                        });
                    } else {
                        this.setState({ selectBuocXuLy, textempty: 'Không có dữ liệu', refreshing: false, isDropDown: true }, () => {
                            this.DF_TrangThai = '';
                            this.props.navigation.setParams('id', '')
                        });
                    };
                    // Utils.goback(this);
                }
            } else {
                const listPA = await this._getListPhanAnh(data[0].IdStep);
                if (listPA) {
                    this.pageAll = listPA.page.AllPage;
                    this.setState({ selectBuocXuLy: data[0], dataPA: listPA.data, page: listPA.page.Page, refreshing: false, isDropDown: true });
                } else {
                    this.setState({ selectBuocXuLy: data[0], dataPA: [], textempty: 'Không có dữ liệu', refreshing: false, isDropDown: true });
                };
            }
        } else {
            this.setState({ textempty: 'Không có dữ liệu', refreshing: false })
        };
        // nthisIsLoading.hide()
    }

    _getListPhanAnh = async (nidStep, callback = false, showLoad = true) => {
        if (showLoad == true) {
            nthisIsLoading.show();
        }

        // Utils.nlog('Gia tri all Thao tao =>', this.AllThaoTac.filter(item => item.IdStep == this.IdStep))
        // this.setState({ refreshing: true });
        Utils.nlog('nidStep', nidStep)
        const res = await this.loadDSPA(1, this.IdStep ? this.IdStep : nidStep);
        if (callback) {
            if (Number.isInteger(res) && res < 0) {
                if (showLoad == true) {
                    nthisIsLoading.hide();
                }

                this.setState({ refreshing: false, isDropDown: false })
                Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại', 'Xác nhận');
            } else {
                if (res.status == 1 && res.data.length > 0) {
                    if (showLoad == true) {
                        nthisIsLoading.hide();
                    }
                    this.pageAll = res.page.AllPage;
                    this.setState({ dataPA: res.data, sltong: res.sltong, refreshing: false, page: res.page.Page, isDropDown: true })
                } else {
                    if (showLoad == true) {
                        nthisIsLoading.hide();
                    }
                    this.setState({ dataPA: [], sltong: res.sltong, refreshing: false, textempty: 'Không có dữ liệu', isDropDown: true })
                };
            };
        } else {
            if (Number.isInteger(res) && res < 0) {
                if (showLoad == true) {
                    nthisIsLoading.hide();
                }
                this.setState({ refreshing: false, sltong: '--', isDropDown: true })
                Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại', 'Xác nhận');
                return null;
            };
            if (showLoad == true) {
                nthisIsLoading.hide();
            }
            this.setState({ refreshing: false, sltong: res.sltong });
            if (res.status == 1 && res.data.length > 0) {
                return res;
            } else {
                return null
            }
        };
    }


    _GetList_MucDoAll = async () => {
        const res = await apis.Autonoibo.GetList_MucDoAll();
        Utils.nlog('get list noi bo', res)
        if (Number.isInteger(res) && res < 0) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi mạng, vui lòng kiểm tra lại kết nối và thử lại', 'Xác nhận');
            return;
        };
        if (res.status == 1 && res.data) {
            this.props.GetList_MucDoAll(res.data);
        }
        // Utils.nlog('GetList_MucDoAll', res)
    }

    //Check có sử dụng bộ lọc hay không
    _checkUseFilter = () => {
        let {
            selectNguon,
            selectChuyenMuc,
            selectLinhVuc,
            selectMucDo,
            selectLocTheo,
            selectMucDoKhanCap,
            dateTo,
            dateFrom,
            keyword
        } = this.dataSetting;
        if (selectNguon.IdNguon != 100 || selectChuyenMuc.IdChuyenMuc != 100 || selectLinhVuc.IdLinhVuc != 100 ||
            selectMucDo.IdMucDo != 100 || selectLocTheo.id != -1 || selectMucDoKhanCap.IdKhanCap != 100 ||
            dateTo != '' || dateFrom != '' || keyword != '') {
            this.setState({ isUseFilter: true })
        } else {
            this.setState({ isUseFilter: false })
        }
    }

    //clear bo loc
    _clearFilter = async () => {
        const filter = {
            selectNguon: { IdNguon: 100, TenNguon: 'Tất cả' },
            selectChuyenMuc: { IdChuyenMuc: 100, TenChuyenMuc: 'Tất cả' },
            selectLinhVuc: { IdLinhVuc: 100, LinhVuc: 'Tất cả' },
            selectMucDo: { IdMucDo: 100, TenMucDo: 'Tất cả' },
            selectLocTheo: { id: -1, TenQuyen: 'Tất cả' },
            selectMucDoKhanCap: { IdKhanCap: 100, TenKhanCap: 'Tất cả' },
            dateTo: '',
            dateFrom: '',
            keyword: '',
        };
        this.dataSetting = filter
        Utils.setGlobal(nGlobalKeys.dataSetting, filter, AppCodeConfig.APP_ADMIN);
        this.setState({ refreshing: true, isUseFilter: false }, () => this._getListPhanAnh(this.state.selectBuocXuLy.IdStep, true));
    }

    render() {
        const { nrow, nmiddle } = nstyles.nstyles;
        const { selectBuocXuLy, isUseFilter } = this.state;
        const { txt14 } = styles;
        var dataTemp = [];
        // Utils.nlog("------------- this.isMenuMore", this.isMenuMore)
        if (this.IdStep) {
            var dataTemp = this.AllThaoTac?.filter(item => item.IdStep == this.IdStep)
        }
        Utils.nlog('Gia tri all Thao tao =>', dataTemp)
        return (
            <View style={nstyles.nstyles.ncontainer}>
                <NavigationEvents
                    onWillFocus={payload => {
                        if (this.state.isDropDown == true) {
                            this._onRefresh();
                        } else {
                            this._getListThaoTac()
                        }
                    }}

                />
                <HeaderCom
                    titleText={this.PANB ? 'Phản ánh nội bộ' : this.LocTheo == 102 ? "An sinh xã hội" : 'Phản ánh thông tin'}
                    iconLeft={Images.icSlideMenu}
                    onPressLeft={this._openMenu}
                    onPressRight={this._openSetting}
                />
                <View style={[nstyles.nstyles.nbody, { padding: 10 }]}>
                    <View style={[nstyles.nstyles.nrow]}>
                        {/* {Phản ánh tung tham gia và của đơn vị} */}
                        <TouchableOpacity
                            onPress={this._DropDown}
                            disabled={this.IdStep ? true : false}
                            style={[nrow, stHome.buttonDropDown, { flex: 1 }]}>
                            <Text style={txt14}>{dataTemp && this.IdStep ? dataTemp[0].TitleStep : selectBuocXuLy.TitleStep}</Text>
                            <Image source={Images.icDropDown} style={[nstyles.nstyles.nIcon15, { tintColor: 'gray' }]} resizeMode='contain' />
                        </TouchableOpacity>
                        <View
                            style={[nrow, stHome.buttonDropDown, { marginLeft: 5 }]}>
                            <Text style={txt14}>{this.isMenuMore ? 'Tổng:' : 'Còn lại:'} <Text style={{ fontWeight: 'bold', color: colors.orangeFive }}>{this.state.sltong}</Text></Text>
                        </View>
                    </View>
                    {
                        isUseFilter ?
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white, marginTop: 10, borderRadius: 20 }} >
                                <View style={{ paddingVertical: 10, flex: 1 }}>
                                    <Text style={{ fontSize: sizes.sizes.sText12, color: colors.yellowishOrange, paddingLeft: 10 }}>{'Đang sử dụng bộ lọc'}</Text>
                                </View>
                                <View style={{}}>
                                    <TouchableOpacity onPress={this._clearFilter} style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                                        <Text style={{ fontSize: sizes.sizes.sText12, color: colors.yellowishOrange }} >{'Xóa bộ lọc'}</Text>
                                        <Image source={Images.icCloseBlack} style={[nstyles.nstyles.nIcon20, { tintColor: colors.yellowishOrange }]} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            : null
                    }
                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10 }} >
                        <Text style={{ fontSize: sizes.sizes.sText12, fontStyle: 'italic', color: colors.yellowishOrange }}>{'Đang sử dụng bộ lọc'}</Text>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 5, paddingTop: 5, paddingBottom: 5 }}>
                            <Text style={{ fontSize: sizes.sizes.sText12, fontStyle: 'italic', color: colors.yellowishOrange }} >{'Xóa bộ lọc'}</Text>
                            <Image source={Images.icCloseBlack} style={[nstyles.nstyles.nIcon20, { tintColor: colors.yellowishOrange }]} />
                        </TouchableOpacity>
                    </View> */}

                    <FlatList
                        style={{ flex: 1, marginTop: 10 }}
                        showsVerticalScrollIndicator={false}
                        data={this.state.dataPA}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtrac}
                        ListEmptyComponent={<ListEmpty textempty={this.state.textempty} isImage={!this.state.refreshing} />}
                        ItemSeparatorComponent={this._ItemSeparatorComponent}
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={0.3}
                        ListFooterComponent={this._ListFooterComponent}
                    />
                </View>
                {/* {
                    this.state.refreshing == true ? <IsLoading /> : null
                } */}

            </View>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default Utils.connectRedux(HomePAHT, mapStateToProps, true);
const stHome = StyleSheet.create({
    buttonDropDown: {
        padding: 10,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});
