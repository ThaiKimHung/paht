import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Platform, BackHandler } from 'react-native';
import { colors, nstyles } from '../../../../styles';
import Utils from '../../../../app/Utils';
import YouTubePlay from './YouTubePlay';
import { Images } from '../../../images';
import { isPad, reText, sizes } from '../../../../styles/size';
import { HeaderCus, ListEmpty } from '../../../../components';
import WebViewCus from '../../../../components/WebViewCus';
import { isLandscape, Width } from '../../../../styles/styles';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import UtilsApp from '../../../../app/UtilsApp';


class ListViewVideoPlay extends Component {
    constructor(props) {
        super(props);
        this.title = Utils.ngetParam(this, "title", UtilsApp.getScreenTitle("ManHinh_TuyenTruyen", 'Clip tuyên truyền'));
        this.state = {
            item: Utils.ngetParam(this, "Item", {}),
            listItem: Utils.ngetParam(this, "ListItem", {}),
            textempty: 'Đang tải ...',
            refreshing: false,

        };
    }

    componentDidMount() {
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

    _setItem = (item) => {
        this.setState({ item })
    }
    _renderItem = ({ item, index }) => {
        // https://www.youtube.com/watch?v=5IfYjjccngQ
        let idvdeo = Utils.GetIDyoutobe(item.LinkYoutube)
        if (item.Id == this.state.item.Id) {
            return null;
        }
        return (
            <View
                // onPress={() => this._goScreeen(item)}
                style={[nstyles.nstyles.shadown, {
                    marginVertical: 5, paddingHorizontal: 10, paddingBottom: 5,
                    borderRadius: 5, width: isLandscape() ? '60%' : isPad ? '80%' : '100%',
                    backgroundColor: 'white', alignSelf: 'center'
                }]} >
                <View style={{ width: '100%' }}>
                    {
                        Platform.OS == 'android' ? <WebViewCus
                            style={{ marginLeft: -3 }}
                            scrollEnabled={false}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            source={{ uri: `https://www.youtube.com/embed/${idvdeo}` }}
                        /> : <YouTubePlay idVideo={idvdeo} isPlaying={false} />

                    }
                </View>

                <View style={[nstyles.nstyles.nrow, { width: '100%', alignItems: 'center', marginTop: 30 }]}>
                    <Image source={Images.iconApp} style={[nstyles.nstyles.nIcon40,]} resizeMode='cover' />
                    <View style={{ paddingHorizontal: 10, flex: 1 }}>
                        <Text
                            style={{ fontWeight: 'bold', fontSize: sizes.sText12, width: '100%' }}>
                            {`${item.TieuDe}`}
                        </Text>
                    </View>

                </View>

                {
                    item.Type == 1 ? <TouchableOpacity onPress={() => this._setItem(item)}
                        style={{
                            backgroundColor: "transparent",
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0
                        }}>

                    </TouchableOpacity> : null
                }
            </View>
        )
    }
    _keyExtrac = (item, index) => item.Id.toString();
    _onRefresh = () => {
        this.setState({ refreshing: true, textempty: 'Đang tải...', data: [] }, this._getThongTinTT);
        // this.setState({ refreshing: true, page: 0, textempty: 'Đang tải...' }, () => this._getData(this.state.hocSinhData.IDKhachHang));
    }

    render() {
        const { item } = this.state;
        let idvdeo = Utils.GetIDyoutobe(item.LinkYoutube)

        return (
            <View style={{ flex: 1, backgroundColor: colors.white, }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={this.title}
                    styleTitle={{ color: colors.white }}
                    // iconRight={Images.icHomeMenu}
                    onPressRight={() => Utils.goscreen(this, 'ManHinh_Home')}
                />
                <View style={{ width: '100%', flex: Platform.OS == 'android' ? 1 : null }}>
                    {/* {
                        Platform.OS == 'android' ? <WebViewCus
                            style={{ marginLeft: -3 }}
                            scrollEnabled={false}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            source={{ uri: item.LinkYoutube }}
                        /> : <YouTubePlay idVideo={idvdeo} isPlaying={true} />

                    } */}
                    <YouTubePlay height={isLandscape() ? 450 : isPad ? 430 : 200} idVideo={idvdeo} isPlaying={true} />
                </View>
                {
                    Platform.OS == 'android' ? null :
                        <FlatList
                            scrollEventThrottle={10}
                            numColumns={1}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ padding: 10, paddingBottom: nstyles.paddingBotX + 20 + (Platform.OS === 'android' ? 60 : 0) }}
                            renderItem={this._renderItem}
                            data={this.state.listItem}
                            ListEmptyComponent={<ListEmpty textempty={this.state.textempty} />}
                            keyExtractor={this._keyExtrac}
                            onEndReachedThreshold={0.3}
                        />
                }

            </View>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(ListViewVideoPlay, mapStateToProps, true);
