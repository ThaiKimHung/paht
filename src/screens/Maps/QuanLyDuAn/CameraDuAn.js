import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image, ActivityIndicator, StatusBar, Platform, BackHandler } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ButtonCom, HeaderCus, ListEmpty } from '../../../../components';
import InputLogin from '../../../../components/ComponentApps/InputLogin';
import { reText } from '../../../../styles/size';
import { heightStatusBar, nstyles, Width } from '../../../../styles/styles';
import * as Animatable from 'react-native-animatable';
import { colors } from '../../../../styles';
import Utils from '../../../../app/Utils';
import { Images } from '../../../images';
import apis from '../../../apis';

class CameraDuAn extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback');
        this.indexNow = Utils.ngetParam(this, 'indexNow', -1);
        this.state = {
            dataCamera: [],
            refreshing: true,
            page: {
                Page: 1,
                AllPage: 1,
                Size: 10,
                Total: 0
            },
            keyword: '',
            ShowMKhau: true,
            UserName: '',
            MKhau: '',
            LoginCam: false,
            CameraSelect: '',
            TextErr: ''
        };
    }

    componentDidMount() {
        this.GetList_Camera()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    componentWillUnmount = async () => {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }
    backAction = () => {
        Utils.goback(this)
        return true
    }

    GetList_Camera = async () => {
        let { page, keyword } = this.state
        this.isLoadding = true;
        let res = await apis.ApiQLDuAn.GetList_Camera_DuAn(page.Page, page.Size, keyword);
        this.isLoadding = false;
        Utils.nlog('res cam', res)
        if (res.status == 1 && res.data) {
            this.setState({ dataCamera: this.state.dataCamera.concat(res.data), refreshing: false, page: res.page })
        } else {
            this.setState({ dataCamera: [], refreshing: false, page: { Page: 1, AllPage: 1, Size: 10, Total: 0 } })
        }
    }

    chooseCamera = (item) => {
        // const a = { "Id": 560, "Username": null, "LinkWSS": "wss://camera-rec3.ioc.thinghub.vn/evup/12598_1638957444/339a40a1b927xyz113486?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJncG9pZCI6MTI1OTgsInVzZXJuYW1lIjoiaW9jX3RoYWluZ3V5ZW4iLCJmdWxsbmFtZSI6IklPQyBUaMOhaSBOZ3V5w6puIiwiYWN0aXZlIjoiMSIsImlkX3NpdGVzIjo5NDMwLCJyb2xlX2FkbWluIjoxLCJpcF9hZGRyIjoiwrp3Xn4pw550XHUwMDAwXHUwMDAwIiwiaWF0IjoxNjM4OTU3NDQ0LCJleHAiOjE2Mzg5NTkyNDR9.KkSGS49vU0sX6oN-iY7bhCDqYEmkyl8Zm9_47PW6QK8", "Password": "", "Name": "Cao Tốc Hà Nội Tái Nguyên", "Status": true, "Rtsp": null, "Lat": 21.361415863, "Long": 105.888092041, "DiaDiem": "28 Trần Thiện Chánh, Phường 12, Quận 10, Thành phố Hồ Chí Minh, Vietnam" }
        Utils.goscreen(this, 'Modal_SeenCamera', { itemCamera: item, callback: () => { } })
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.chooseCamera(item)}
                style={{
                    marginHorizontal: 10, marginTop: 10, flexDirection: 'row', alignItems: 'center',
                    backgroundColor: colors.white, padding: 10
                }}>
                <Image style={[nstyles.nIcon35, { tintColor: '#0089FF' }]} source={Images.icCameraNew} resizeMode='contain' />
                <Text style={{ padding: 10, flex: 1 }} numberOfLines={1}>{item.Name}</Text>
            </TouchableOpacity>
        )
    }

    _onRefresh = () => {
        this.setState({ refreshing: true, dataCamera: [], page: { Page: 1, AllPage: 1, Size: 10, Total: 0 } }, this.GetList_Camera)
    }

    loadMore = () => {
        var { page } = this.state;
        let nextPage = page.Page + 1
        if (page.Page < page.AllPage && !this.isLoadding) {
            this.setState({ page: { ...page, Page: nextPage } }, this.GetList_Camera);
        }
    };

    _ListFooterComponent = () => {
        var { page } = this.state;
        return page.Page < page.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
    }

    search = (val) => {
        Utils.searchTimer(this, () => {
            this.setState({ refreshing: true, dataCamera: [], page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }, keyword: val },
                this.GetList_Camera);
        }
        )
    }

    render() {
        const { dataCamera, refreshing, ShowMKhau, UserName, LoginCam, CameraSelect, TextErr } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <HeaderCus
                    title={"Camera Dự Án"}
                    styleTitle={{ color: 'white' }}
                    iconLeft={Images.icBack}
                    onPressLeft={() => Utils.goback(this)}
                />
                <View style={[nstyles.shadow, { margin: 10, borderRadius: 5, backgroundColor: colors.white, borderColor: colors.brownGreyTwo, flexDirection: 'row', alignItems: 'center', paddingRight: 10 }]}>
                    <TextInput
                        style={{ padding: 10, flex: 1, backgroundColor: colors.white, borderRadius: 5 }}
                        placeholder={"Từ khóa..."}
                        onChangeText={text => this.search(text)}
                    />
                    <Image source={Images.icSearch} />
                </View>
                <FlatList
                    data={dataCamera}
                    key={(item, index) => index.toString()}
                    renderItem={this._renderItem}
                    ListEmptyComponent={refreshing ? <ListEmpty textempty={'Đang tải dữ liệu'} isImage={false} /> : <ListEmpty textempty={'Không có dữ liệu'} />}
                    refreshing={refreshing}
                    onRefresh={this._onRefresh}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={this._ListFooterComponent}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    listCamChoose: state.common.listCamChoose
});
export default Utils.connectRedux(CameraDuAn, mapStateToProps, true);
