import apis from "../../../apis";
import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import { sizes } from "../../../../styles/size";
import { nstyles, colors } from "../../../../styles";
import { Images } from "../../../images";
import { ListEmpty, HeaderCom } from "../../../../components";
import Utils from "../../../../app/Utils";

class ThongBao extends Component {
    constructor(props) {
        super(props);
        this.pageAll = 0;
        this.state = {
            data: [],
            textempty: 'Đang tải...',
            refreshing: true,
            page: 0,
            size: 10
        };
    }
    goback = () => {
        Utils.goback(this)
    }
    _getListCanhBao = async () => {
        const res = await apis.ThongBao.GetThongBao();
        Utils.nlog("gia tri canh bao res", res);
        if (res.status == 1 && res.data.LstThongBao) {
            this.setState({ data: res.data.LstThongBao, refreshing: false })
        } else {
            this.setState({ refreshing: false, data: [], textempty: 'Không có dữ liệu...' })
        }

    }
    componentDidMount() {
        this._getListCanhBao();
    }
    _ListFooterComponent = () => {
        if (this.state.page < this.pageAll)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }

    loadMore = async () => {
        // const { page, size, } = this.state;
        // Utils.nlog('page', page)
        // const pageNumber = page + 1;
        // if (page < this.pageAll) {
        //     let res = await apis.ApiCanhBao.GetList_CanhBaoApp(false, pageNumber, size);
        //     Utils.nlog('data list canh bao 2', res)

        //     if (res.status == 1 && res.data) {
        //         const data = [...this.state.data, ...res.data];
        //         this.setState({ data, page: pageNumber, });
        //     };
        // };
    };
    _goScreeen = (item) => {
        // Utils.nlog("vao on press")
        // Utils.goscreen(this, "Modal_ChiTietCanhBao", {
        //     item: item
        // })
    }
    _renderItem = ({ item, index }) => {
        return (

            <TouchableOpacity
                // onPress={() => this.goscreen()}
                style={[nstyles.nstyles.shadown, {
                    marginVertical: 5,
                    paddingVertical: 20, paddingHorizontal: 10, borderRadius: 10,
                    backgroundColor: colors.whiteTwo
                }]} >
                <View style={[nstyles.nstyles.nrow, {}]}>
                    <Image source={Images.icNoti} style={[nstyles.nstyles.nIcon30, { tintColor: colors.peacockBlue }]} resizeMode='cover' />
                    <View style={{ paddingHorizontal: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: sizes.sText12, }}>
                            {`${item.Title}`}
                        </Text>
                        <Text style={{ fontStyle: 'italic', fontSize: sizes.sText12, }}>
                            {`${item.Number}`}
                        </Text>
                    </View>
                </View>

            </TouchableOpacity>
        )
    }
    _keyExtrac = (item, index) => index.toString();
    _onRefresh = () => {
        this.setState({ refreshing: true, textempty: 'Đang tải...' }, this._getListCanhBao)
    }
    _ListHeaderComponent = () => {
        return (
            <View>

            </View>)
    }
    render() {
        return (
            <View style={{ flex: 1, }}>
                <HeaderCom
                    styleContent={{ backgroundColor: colors.colorHeaderApp }}
                    titleText='Thông báo'
                    onPressLeft={() => Utils.goscreen(this, 'scHome')}
                    hiddenIconRight={true}
                    // onPressRight={() => Utils.goscreen(this, "Modal_MapChiTietPADH", {
                    //     dataItem: this.state.dataCTPA
                    // })}
                    // iconRight={Images.icLocation}
                    nthis={this} />
                <FlatList
                    scrollEventThrottle={10}
                    onScroll={this.handleScroll}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 10, paddingBottom: nstyles.paddingBotX + 20 + (Platform.OS === 'android' ? 60 : 0) }}
                    renderItem={this._renderItem}
                    data={this.state.data}
                    ListEmptyComponent={<ListEmpty textempty={this.state.textempty} />}
                    ListHeaderComponent={this._ListHeaderComponent}
                    keyExtractor={this._keyExtrac}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    // onEndReached={this.loadMore}
                    onEndReachedThreshold={0.3}
                // ListFooterComponent={this._ListFooterComponent}
                />
            </View>
        );
    }
}

export default ThongBao