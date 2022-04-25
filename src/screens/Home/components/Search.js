import React, { Component } from 'react';
import {
    View, Text,
    TouchableOpacity,
    Image,
    TextInput,
    Animated,
    Keyboard,
    FlatList,
    ActivityIndicator,
    StatusBar,
    Platform,
    BackHandler
} from 'react-native';
import { Images } from '../../../images';
import { nstyles, colors, sizes } from '../../../../styles';
import styles from '../styles';
import apis from '../../../apis';
import Utils from '../../../../app/Utils';
import { ListEmpty } from '../../../../components';
import ItemDanhSach from './ItemDanhSach';
import { appConfig } from '../../../../app/Config';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import LinearGradient from 'react-native-linear-gradient';

class Search extends Component {
    constructor(props) {
        super(props);
        this.pageAll = 0;
        this.state = {
            page: 1,
            textempty: '...',
            textSearch: '',
            marginRight: new Animated.Value(-nstyles.khoangcach - 40),
            data: [],
            refreshing: false
        };
    }
    _onChangeText = (textSearch) => {
        this.setState({ textSearch });
    }

    _onSearch = async () => {
        const { textSearch } = this.state;
        if (textSearch) {
            this.setState({ refreshing: true }, async () => {
                const res = await apis.ApiPhanAnh.GetDanhSachPAFilter(false, 1, 10, '', '', textSearch);
                Utils.nlog('data search list cong dong', res)
                if (res.status == 1 && res.data) {
                    var { data = [], page = {} } = res;
                    if (page != null) {
                        this.pageAll = page.AllPage
                    };
                    this.setState({ data: data, page: page.Page, refreshing: false })
                } else {
                    this.setState({ refreshing: false, textempty: 'Không có dữ liệu' })
                };
            });
        };
    };

    _clearText = () => {
        this.setState({ textSearch: '', data: [], textempty: '...' });
    }

    _startAnimation = (value) => {
        Animated.timing(this.state.marginRight, {
            toValue: value,
            duration: 100
        }).start();
    };

    _keyboardDidShow = () => {
        this._startAnimation(0);
    }

    _keyboardDidHide = () => {
        this._startAnimation(-nstyles.khoangcach - 40);
    }

    _cancel = () => {
        Keyboard.dismiss();
        this.setState({ textSearch: '' });
    }

    _getListCongDong = async (more = false) => {

    }

    _goBack = () => {
        Utils.goback(this);
    }

    _showAllImages = (arrImage = [], index = 0) => {
        // const imagesURL = [];
        // if (!Array.isArray(arrImage)) {
        //     const obj = {
        //         url: `${appConfig.domainImg}${arrImage}`,
        //         // width: item.width,
        //         // height: item.height
        //         // Optional, if you know the image size, you can set the optimization performance
        //     };
        //     imagesURL.push(obj);
        // } else
        //     for (let index = 0; index < arrImage.length; index++) {
        //         const item = arrImage[index];
        //         const obj = {
        //             url: item.uri,
        //             width: item.width,
        //             height: item.height
        //             // Optional, if you know the image size, you can set the optimization performance
        //         };
        //         imagesURL.push(obj);
        //     };
        // const imagesURL = [
        //     {
        //         url: 'https://img2.infonet.vn/w490/Uploaded/2020/pjauldz/2018_06_19/5.jpg',
        //     },
        // ];
        // if (arrImage.length != 0) {
        Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: arrImage, index });
        // }
        // else {
        //     Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: imagesURL, index });
        // }
    }

    //Handle Flatlist
    _renderItem = ({ item, index }) => {
        var {
            ListHinhAnh = [],
            IdPA,
            SoLuongTuongTac = 0,
            ChuyenMuc
        } = item;
        var arrImg = []
        ListHinhAnh.forEach(item => {
            arrImg.push({ url: appConfig.domain + item.Path })
        });
        return <ItemDanhSach
            nthis={this}
            numberComent={SoLuongTuongTac}
            dataItem={item}
            // type={ListHinhAnh.length > 0 ? 1 : 2}
            goscreen={() => Utils.goscreen(this, 'Modal_ChiTietPhanAnh', { IdPA: IdPA, TenChuyenMuc: ChuyenMuc })}
            showImages={() => this._showAllImages(arrImg, 0)} />
    }

    _keyExtrac = (item, index) => item.IdPA.toString();

    _onRefresh = () => {
        this.setState({ refreshing: true }, this._onSearch);
        // this.setState({ refreshing: true, page: 0, textempty: 'Đang tải...' }, () => this._getData(this.state.hocSinhData.IDKhachHang));
    }

    _ListFooterComponent = () => {
        if (this.state.page < this.pageAll)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }

    loadMore = async () => {
        const { page, textSearch } = this.state;
        Utils.nlog('page', page)
        const pageNumber = page + 1;
        if (page < this.pageAll) {
            let res = await apis.ApiPhanAnh.GetDanhSachPAFilter(false, pageNumber, 10, '', '', textSearch);
            Utils.nlog('data list cong dong2', res)
            if (res.status == 1 && res.data) {
                const data = [...this.state.data, ...res.data];
                this.setState({ data, page: pageNumber });
            };
        };
    };

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goback(this)
        return true
    }

    componentWillUnmount() {
        try {
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }
    render() {
        const { nrow } = nstyles.nstyles;
        const { textSearch } = this.state;
        return (
            <View style={nstyles.nstyles.ncontainerX}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={this.props.theme.colorLinear.color}
                >
                    <View style={[nstyles.nstyles.shadown, { paddingTop: Platform.OS == 'android' ? nstyles.paddingTopMul() + 26 : nstyles.paddingTopMul() + 9, backgroundColor: colors.nocolor }]}>
                        <View style={[nrow, { alignItems: 'center', justifyContent: 'center', paddingBottom: 10, paddingRight: 10 }]}>
                            <TouchableOpacity
                                style={{ padding: 10 }}
                                onPress={this._goBack}>
                                <Image
                                    source={Images.icBack}
                                    resizeMode='contain'
                                    style={[nstyles.nstyles.nIcon20, { tintColor: colors.white }]} />
                            </TouchableOpacity>
                            <View style={[nrow, {
                                flex: 1,
                                borderRadius: 6,
                                backgroundColor: 'rgba(0,0,0,0.05)',
                                padding: 10,
                                marginHorizontal: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: colors.white,
                            }]}>
                                <Image source={Images.icSearch} style={[nstyles.nstyles.nIcon18, {}]} resizeMode='contain' />
                                <TextInput
                                    style={[styles.text16, { paddingVertical: 0, flex: 1, paddingVertical: 0, }]}
                                    returnKeyType='search'
                                    underlineColorAndroid='transparent'
                                    placeholder={'Tìm ' + Utils.getGlobal(nGlobalKeys.TieuDe).toLowerCase()}
                                    value={textSearch}
                                    onChangeText={this._onChangeText}
                                    onSubmitEditing={this._onSearch}
                                />
                                {textSearch ? <TouchableOpacity onPress={this._clearText}>
                                    <Image source={Images.icClose} style={[nstyles.nstyles.nIcon16, { tintColor: 'gray' }]} resizeMode='contain' />
                                </TouchableOpacity> : null}
                            </View>
                            <Animated.View style={{ marginRight: this.state.marginRight }}>
                                <TouchableOpacity onPress={this._cancel}
                                    style={{ paddingHorizontal: 5, paddingLeft: nstyles.khoangcach }}>
                                    <Text style={[styles.text14, { color: colors.white, fontWeight: '700' }]}>Huỷ</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </View>
                </LinearGradient>
                <View style={[nstyles.nstyles.nbody, { backgroundColor: colors.BackgroundHome, }]}>
                    <FlatList
                        // scrollEventThrottle={10}
                        // onScroll={this.handleScroll}
                        // contentContainerStyle={{ backgroundColor: 'red', paddingBottom: 100 }} 
                        style={{ paddingHorizontal: 15, paddingVertical: 10 }}
                        renderItem={this._renderItem}
                        data={this.state.data}
                        ListEmptyComponent={<ListEmpty textempty={this.state.textempty} />}
                        // ListHeaderComponent={this._ListHeaderComponent}
                        keyExtractor={this._keyExtrac}
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={0.3}
                        ListFooterComponent={this._ListFooterComponent}
                    />
                </View>
                <StatusBar barStyle={'light-content'} />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    theme: state.theme
});

export default Utils.connectRedux(Search, mapStateToProps, true)