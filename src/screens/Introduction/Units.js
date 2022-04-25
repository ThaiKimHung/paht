import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { appConfig } from '../../../app/Config';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import Utils from '../../../app/Utils';
import { ListEmpty } from '../../../components';
import ImageCus from '../../../components/ImageCus';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { Height, isLandscape, Width } from '../../../styles/styles';
import apis from '../../apis';
import { Images } from '../../images';

class Units extends Component {
    constructor(props) {
        super(props);
        this.state = {
            route: this.props.route,
            refreshing: true,
            dataDonVi: [],
            page: { Page: 1, AllPage: 1, Size: 10, Total: 0 },
            MaPX: '',
            data: ''
        };
        this.IdTinh_GioiThieu = Utils.getGlobal(nGlobalKeys.IdTinh_GioiThieu, 'IdTinh_GioiThieu', '')
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log(nextProps, prevState)
        if (nextProps?.MaPX != prevState?.MaPX || nextProps?.data != prevState?.data) {
            return {
                MaPX: nextProps?.MaPX,
                data: nextProps?.data
            }
        } else {
            return null
        }
    }

    componentDidMount() {
        this.getListDonViHanhChinh()
    }



    getListDonViHanhChinh = async () => {
        const { page } = this.state
        let res = await apis.ApiIntroduction.GetListDonViHanhChinh(page.Page, page.Size)
        Utils.nlog('[LOG] res list don vi', res)
        if (res.status == 1 && res.data) {
            this.setState({
                dataDonVi: res.data,
                page: res.page,
                refreshing: false
            })
        } else {
            this.setState({
                dataDonVi: [],
                page: page,
                refreshing: false
            })
        }
    }

    goDetails = (item) => {
        // Utils.goscreen(this.props.nthis,'scDetailsUnit')
        Utils.push('Modal_ChiTietGioiThieu', { MaPX: item.MaPX })
    }

    _renderItem = ({ item, index }) => {
        let { FileDinhKem = [] } = item
        // Bên ngoài list FileDinhKem là obj , còn chi tiêt FileDinhKem là array
        let urlDaiDien = appConfig.domain + FileDinhKem?.Path
        const findIndex = FileDinhKem?.length > 0 ? FileDinhKem.findIndex(e => e?.IsHinhDaiDien && e.IsHinhDaiDien) : -1
        if (findIndex != -1) {
            urlDaiDien = appConfig.domain + FileDinhKem[findIndex].Path
        }
        // style={{ flex: 1, margin: (index - 1) % 3 == 0 ? 0 : 10, marginVertical: 10 }}
        return (
            <View style={{ width: Width(31), padding: Width(1), marginLeft: Width(1.8), }}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => this.goDetails(item)} style={{}}>
                    <ImageCus defaultSourceCus={Images.icNoImage} source={{ uri: urlDaiDien }} style={[stUnits.imageTP, { height: isLandscape() ? Height(20) : Height(11) }]} resizeMode={'cover'} />
                    <Text style={stUnits.txtTP}>{item.TenPhuongXa}</Text>
                </TouchableOpacity>
            </View>

        )

    }
    _KeyExtrac = (item, index) => index.toString()

    _header = () => {
        return (
            <Text style={stUnits.header}>{'Các đơn vị hành chính'}</Text>
        )
    }

    _onRefresh = () => {
        this.setState({ refreshing: true, page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }, dataDonVi: [] }, this.getListDonViHanhChinh)
    }

    _loadMore = () => {
        let { page } = this.state
        if (page.Page < page.AllPage) {
            this.setState({ page: { ...page, Page: page.Page + 1 } }, this.getListDonViHanhChinh)
        }
    }

    _ListFooterComponent = () => {
        let { page } = this.state
        if (page.Page < page.AllPage) {
            return <ActivityIndicator size={'small'} style={{ marginTop: 10 }} />
        } else {
            return null
        }
    }
    render() {
        const { dataDonVi, refreshing, MaPX, data } = this.state
        console.log('[LOG] state unit', this.state)
        return (
            <View style={stUnits.container}>
                {this._header()}
                {
                    MaPX == '' || MaPX == this.IdTinh_GioiThieu ? <FlatList
                        style={{}}
                        contentContainerStyle={{ paddingBottom: 50 }}
                        numColumns={3}
                        data={dataDonVi}
                        renderItem={this._renderItem}
                        keyExtractor={this._KeyExtrac}
                        refreshing={refreshing}
                        onRefresh={this._onRefresh}
                        ListEmptyComponent={<ListEmpty textempty={refreshing ? 'Đang tải...' : 'Không có dữ liệu'} isImage={!refreshing} />}
                        onEndReached={this._loadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={this._ListFooterComponent}
                        ItemSeparatorComponent={() => {
                            return <View style={{ padding: 5 }} />
                        }}

                    /> : <FlatList
                        contentContainerStyle={{ paddingBottom: 50 }}
                        numColumns={3}
                        data={data?.DonViCapDuoi?.length > 0 ? data?.DonViCapDuoi : []}
                        renderItem={this._renderItem}
                        keyExtractor={this._KeyExtrac}
                        ListEmptyComponent={<ListEmpty textempty={refreshing ? 'Đang tải...' : 'Không có dữ liệu'} isImage={!refreshing} />}
                    />
                }

            </View>
        );
    }
}

const stUnits = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    imageTP: { width: '100%', borderWidth: 0.5, borderRadius: 5, borderColor: colors.grayLight },
    txtTP: { textAlign: 'left', paddingVertical: 5, fontWeight: 'bold', fontSize: reText(12) },
    header: { padding: 10, fontWeight: 'bold', fontSize: reText(14) }
})

const mapStateToProps = state => ({
    theme: state.theme
});

export default Utils.connectRedux(Units, mapStateToProps, true)
