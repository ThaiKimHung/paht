import React, { Component } from 'react'
import { Platform, Text, View, TouchableOpacity, Image, FlatList, ActivityIndicator, BackHandler } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import apis from '../../apis'
import Utils from '../../../app/Utils'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { nstyles, paddingTopMul, Width } from '../../../styles/styles'
import ItemHoiDap from './ItemHoiDap'
import { ButtonCom, HeaderCus, ListEmpty } from '../../../components'
import * as Animatable from 'react-native-animatable'

export class HoiDapTT extends Component {
    constructor(props) {
        super(props)
        this.pageIndex = 1
        this.state = {
            refreshing: true,
            dataCauHoi: [],
            isLoadMore: false,
            textempty: 'Đang tải...'
        }
    }

    componentDidMount() {
        this.GET_DanhSachCauHoi()
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

    GET_DanhSachCauHoi = async () => {
        let res = await apis.ApiDVC.DanhSachCauHoi(15, this.pageIndex)
        Utils.nlog('res danh sach cau hoi', res)
        if (res.status == 1 && res.data) {
            this.pageIndex = 1
            this.setState({ dataCauHoi: res.data, refreshing: false, })
        } else {
            this.pageIndex = 1
            this.setState({ dataCauHoi: [], refreshing: false, textempty: 'Không có dữ liệu' })
        }
    }

    AddQuestion = () => {
        Utils.goscreen(this, 'scDatCauHoi', { callback: this._onRefresh })
    }

    _KeyExtrac = (item, index) => {
        return index.toString()
    }

    _renderItem = ({ item, index }) => {
        return (
            <ItemHoiDap nthis={this} item={item} onPress={() => this.goDetailQuestion(item)} />
        )
    }

    goDetailQuestion = (item) => {
        Utils.goscreen(this, 'scCTCauHoi', { dataCauHoi: item })
    }

    loadMore = async () => {
        // alert(1)
        this.setState({ isLoadMore: true })
        let pageNext = this.pageIndex + 1
        let res = await apis.ApiDVC.DanhSachCauHoi(15, pageNext)
        Utils.nlog('loadmore', res)
        if (res.status == 1 && res.data) {
            this.pageIndex = pageNext
            this.setState({ dataCauHoi: [...this.state.dataCauHoi, ...res.data], refreshing: false })
        } else {
            this.setState({ isLoadMore: false })
        }
    }

    _onRefresh = async () => {
        this.pageIndex = 1
        this.setState({ refreshing: true, textempty: 'Đang tải...', dataCauHoi: [], isLoadMore: false }, this.GET_DanhSachCauHoi)
    }

    _ListFooterComponent = () => {
        if (this.state.isLoadMore)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }

    viewHistory = () => {
        Utils.goscreen(this, 'Modal_LichSuHoiDap')
    }
    render() {
        let { refreshing, dataCauHoi, textempty } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome, paddingBottom: isIphoneX() ? 20 : 5 }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
                    iconLeft={Images.icBack}
                    title={`Hỏi đáp trực tuyến`}
                    styleTitle={{ color: colors.white }}
                />
                <View style={{ flex: 1, }}>
                    <FlatList
                        data={dataCauHoi}
                        refreshing={refreshing}
                        keyExtractor={this._KeyExtrac}
                        renderItem={this._renderItem}
                        onRefresh={this._onRefresh}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={0.4}
                        ListFooterComponent={this._ListFooterComponent}
                        ListEmptyComponent={<ListEmpty textempty={textempty} isImage={!refreshing} />}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                    <ButtonCom
                        text={"Đặt câu hỏi"}
                        onPress={this.AddQuestion}
                        style={{ borderRadius: 5, marginHorizontal: 10, marginTop: 8 }}
                        styleTouchable={{ flex: 1 }}
                        txtStyle={{ fontSize: reText(14) }}
                    />
                    <ButtonCom
                        Linear={true}
                        colorChange={[colors.grayLight, colors.grayLight]}
                        text={"Lịch sử"}
                        onPress={this.viewHistory}
                        styleTouchable={{ flex: 1 }}
                        style={{ borderRadius: 5, marginHorizontal: 10, marginTop: 8 }}
                        txtStyle={{ fontSize: reText(14) }}
                    />
                </View>

            </View>
        )
    }
}

const mapStateToProps = state => ({
    theme: state.theme

});
export default Utils.connectRedux(HoiDapTT, mapStateToProps, true);
