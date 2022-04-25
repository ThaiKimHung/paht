import React, { Component } from 'react'
import { Text, View, TouchableOpacity, FlatList, ActivityIndicator, Image, Dimensions } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import apis from '../../../apis'
import Utils from '../../../../app/Utils'
import { ListEmpty } from '../../../../components'
import { Images } from '../../../images'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import { Height, nstyles, nwidth, Width } from '../../../../styles/styles'
import * as Animatable from 'react-native-animatable'

export class ScreenTT extends Component {

    constructor(props) {
        super(props)
        this.pageIndex = 0
        this.state = {
            data: [],
            refreshing: true,
            isLoadMore: false,
        }
    }

    componentDidMount() {
        // alert(this.props.title)
        this.GET_DSBaiViet()
    }

    GET_DSBaiViet = async () => {
        let { item } = this.props
        let dataBoDy = {
            'iddv': item.ID,
            'sotin': 5,
            'trang': this.pageIndex
        }
        let res = await apis.ApiDVC.DsBaiViet(dataBoDy)
        Utils.nlog('danh sach bai viet', res)
        if (res.status == 1 && res.data) {
            this.setState({ data: res.data, refreshing: false })
        } else {
            this.setState({ data: [], refreshing: false })
        }
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => Utils.goscreen(this.props.nthis, 'scChiTietTT', { itemTinTuc: item })} style={{ margin: 10 }}>
                <View style={[nstyles.shadown, { padding: 10, backgroundColor: colors.white, borderRadius: 5 }]}>
                    <Image source={{ uri: item.HinhDaiDien }} style={{ width: '100%', height: Height(18) }} resizeMode='cover' />
                    <Text style={{ fontSize: reText(14), fontWeight: 'bold', marginTop: 10, textAlign: 'justify' }}>
                        {item.TieuDe}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 }}>
                        <Text style={{ textAlign: 'left', fontSize: reText(12), flex: 1 }}>{item.TenDonVi}</Text>
                        <Text style={{ textAlign: 'right', fontSize: reText(12) }}>{item.Ngay}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _KeyExtrac = (item, index) => {
        return index.toString()
    }

    _onRefresh = () => {
        this.pageIndex = 0
        this.setState({ refreshing: true }, this.GET_DSBaiViet)
    }

    _ListFooterComponent = () => {
        if (this.state.isLoadMore)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }

    loadMore = async () => {
        // alert(1)
        this.setState({ isLoadMore: true })
        let pageNext = this.pageIndex + 1
        let { item } = this.props
        Utils.nlog('key item', item)
        let dataBoDy = {
            'iddv': item.ID,
            'sotin': 5,
            'trang': pageNext
        }
        let res = await apis.ApiDVC.DsBaiViet(dataBoDy)
        Utils.nlog('loadmore', res)
        if (res.status == 1 && res.data) {
            this.pageIndex = pageNext
            this.setState({ data: [...this.state.data, ...res.data] })
        } else {
            this.setState({ isLoadMore: false })
        }
    }

    render() {
        let { title, item } = this.props
        let { data, refreshing } = this.state
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={data}
                    refreshing={refreshing}
                    keyExtractor={this._KeyExtrac}
                    renderItem={this._renderItem}
                    onRefresh={this._onRefresh}
                    ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={0.4}
                    ListFooterComponent={this._ListFooterComponent}
                />
            </View>
        )
    }
}

export default ScreenTT
