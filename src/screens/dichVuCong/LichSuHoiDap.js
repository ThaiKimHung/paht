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

export class LichSuHoiDap extends Component {
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
        this.GET_DanhSachLichSuCauHoi()
    }

    GET_DanhSachLichSuCauHoi = async () => {
        let res = await apis.ApiDVC.DanhSachCauHoiByDienThoai(10, this.pageIndex)
        Utils.nlog('res danh sach lich su cau hoi', res)
        if (res && res.length > 0) {
            this.pageIndex = 1
            this.setState({ dataCauHoi: res, refreshing: false, })
        } else {
            this.pageIndex = 1
            this.setState({ dataCauHoi: [], refreshing: false, textempty: 'Không có dữ liệu' })
        }
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
        Utils.goscreen(this, 'Modal_ChiTietCauHoiLS', { dataCauHoi: item })
    }

    loadMore = async () => {
        // alert(1)
        // this.setState({ isLoadMore: true })
        // let pageNext = this.pageIndex + 1
        // let res = await apis.ApiDVC.DanhSachCauHoiByDienThoai(10, pageNext)
        // Utils.nlog('loadmore', res)
        // if (res && res.length > 0) {
        //     this.pageIndex = pageNext
        //     this.setState({ dataCauHoi: [...this.state.dataCauHoi, ...res], refreshing: false })
        // } else {
        //     this.setState({ isLoadMore: false })
        // }
    }

    _onRefresh = async () => {
        this.pageIndex = 1
        this.setState({ refreshing: true, textempty: 'Đang tải...', dataCauHoi: [], isLoadMore: false }, this.GET_DanhSachLichSuCauHoi)
    }

    _ListFooterComponent = () => {
        if (this.state.isLoadMore)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }

    render() {
        let { refreshing, dataCauHoi, textempty } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome, paddingBottom: isIphoneX() ? 20 : 5 }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`Lịch sử hỏi đáp`}
                    styleTitle={{ color: colors.white }}
                />
                <View style={{ flex: 1, }}>
                    <FlatList
                        data={dataCauHoi}
                        refreshing={refreshing}
                        keyExtractor={this._KeyExtrac}
                        renderItem={this._renderItem}
                        onRefresh={this._onRefresh}
                        // onEndReached={this.loadMore}
                        // onEndReachedThreshold={0.4}
                        // ListFooterComponent={this._ListFooterComponent}
                        ListEmptyComponent={<ListEmpty textempty={textempty} isImage={!refreshing} />}
                    />
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    theme: state.theme

});
export default Utils.connectRedux(LichSuHoiDap, mapStateToProps, true);
