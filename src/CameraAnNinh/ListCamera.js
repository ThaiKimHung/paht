import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image, ActivityIndicator, StatusBar, Platform, BackHandler } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Utils from '../../app/Utils';
import { ButtonCom, HeaderCus, ListEmpty } from '../../components';
import InputLogin from '../../components/ComponentApps/InputLogin';
// import { colors } from '../../srcAdmin/screens/chat/styles';
import { reText } from '../../styles/size';
import { heightStatusBar, nstyles, paddingBotX, Width } from '../../styles/styles';
import apis from '../apis';
import { Images } from '../images';
import * as Animatable from 'react-native-animatable';
import { colors } from '../../styles';
import { store } from '../../srcRedux/store';
import { SetListCam } from '../../srcRedux/actions/common/Common';

class ListCamera extends Component {
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
        let res = await apis.ApiApp.GetList_Camera(page.Page, page.Size, keyword);
        this.isLoadding = false;
        Utils.nlog('res cam', res)
        if (res.status == 1 && res.data) {
            this.setState({ dataCamera: this.state.dataCamera.concat(res.data), refreshing: false, page: res.page })
        } else {
            this.setState({ dataCamera: [], refreshing: false, page: { Page: 1, AllPage: 1, Size: 10, Total: 0 } })
        }
    }

    chooseCamera = (item) => {
        let timeCount = 10;
        if (Platform.OS === 'android') { //-- Android phải xoá về Rỗng trước khi set mới để ko bị ĐƠ
            this.deleteCamChoose(this.indexNow);
            timeCount = 100;
        }
        setTimeout(() => {
            this.callback(item)
            Utils.goback(this)
        }, timeCount);

    }

    deleteCamChoose = (index) => {
        let listcam = [...this.props.listCamChoose];
        listcam[index] = { id: index * -1 };
        store.dispatch(SetListCam(listcam))
    }

    _renderItem = ({ item, index }) => {
        const { listCamChoose } = this.props;
        let indexChoose = listCamChoose.findIndex(item1 => item1.Id == item.Id) + 1;
        let isChoosed = indexChoose > 0;
        return (
            <TouchableOpacity
                disabled={isChoosed}
                activeOpacity={0.5}
                onPress={() => this.chooseCamera(item)}
                style={{
                    marginHorizontal: 10, marginTop: 10, flexDirection: 'row', alignItems: 'center',
                    backgroundColor: isChoosed ? (this.indexNow + 1 == indexChoose ? colors.blueZalo : colors.organgeMucDo) : colors.white, padding: 10
                }}>
                <Image style={nstyles.nIcon35} source={Images.icMenuCamera} resizeMode='contain' />
                <Text style={{ padding: 10, flex: 1 }} numberOfLines={1}>{item.Name}</Text>
                {
                    !isChoosed ? null :
                        <TouchableOpacity style={{ padding: 4 }} onPress={() => this.deleteCamChoose(indexChoose - 1)}>
                            <Image source={Images.icClose} style={{ tintColor: colors.colorGrayText }} />
                        </TouchableOpacity>
                }
                <Text style={{ position: 'absolute', top: 0, right: 0, fontWeight: 'bold', padding: 3, color: colors.redStar }}>{isChoosed ? indexChoose : ''}</Text>
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
        const { dataCamera, refreshing } = this.state
        return (
            <View style={[nstyles.ncontainer, { paddingBottom: paddingBotX }]}>
                <HeaderCus
                    title={"Danh sách Camera"}
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
export default Utils.connectRedux(ListCamera, mapStateToProps, true);
