import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, Platform, TextInput, Image } from 'react-native';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import Utils from '../../../app/Utils';
import { HeaderCus, ListEmpty } from '../../../components';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { nstyles } from '../../../styles/styles';
import apis from '../../apis';
import { Images } from '../../images';
import ItemHoiDapVTS from './ItemHoiDapVTS';

class TimKiemCauHoi_VTS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            textempty: 'Đang tải...',
            dataCauHoi: [],
            page: { Page: 1, AllPage: 1, Size: 10, Total: 0 },
            keySearch: ''
        };
        ROOTGlobal.dataGlobal._reLoadDSHoiDapVTS = this._onRefresh
    }

    componentDidMount() {
        this.getListHoiDap()
        this.refInput.focus()
    }

    getListHoiDap = async () => {
        const { page, dataCauHoi, keySearch } = this.state
        if (keySearch.length > 0) {
            let res = await apis.apiHoiDapVTS.GetList_HoiTT_App(page.Page, page.Size, keySearch)
            Utils.nlog('[LOG] data list cau hoi', res)
            if (res.status == 1 && res.data) {
                this.setState({
                    dataCauHoi: [...dataCauHoi, ...res.data],
                    refreshing: false,
                    textempty: 'Không có dữ liệu',
                    page: res?.page ? res.page : { Page: 1, AllPage: 1, Size: 10, Total: 0 }
                })
            } else {
                this.setState({
                    dataCauHoi: [],
                    refreshing: false,
                    textempty: 'Không có dữ liệu',
                    page: res?.page ? res.page : { Page: 1, AllPage: 1, Size: 10, Total: 0 }
                })
            }
        } else {
            this.setState({
                dataCauHoi: [],
                refreshing: false,
                textempty: 'Không có dữ liệu',
                page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }
            })
        }
    }

    loadMore = async () => {
        const { page } = this.state
        if (page.Page < page.AllPage) {
            this.setState({ page: { ...page, Page: page.Page + 1 } }, this.getListHoiDap)
        }
    }

    _onRefresh = async () => {
        this.pageIndex = 1
        this.setState({ refreshing: true, textempty: 'Đang tải...', dataCauHoi: [], page: { Page: 1, AllPage: 1, Size: 10, Total: 0 } }, this.getListHoiDap)
    }

    _ListFooterComponent = () => {
        const { page } = this.state
        if (page.Page < page.AllPage)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }

    _renderItem = ({ item, index }) => {
        return (
            <ItemHoiDapVTS item={item} onPress={() => this.onDetails(item)} />
        )
    }

    onDetails = (item) => {
        Utils.goscreen(this, 'Modal_ChiTietCauHoi_VTS', { dataCauHoi: item })
    }

    _KeyExtrac = (item, index) => {
        return index.toString()
    }

    onChangeText = (text) => {
        this.setState({ keySearch: text }, this._onRefresh)
    }

    render() {
        const { refreshing, dataCauHoi, textempty, keySearch } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome, }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`Tìm kiếm hỏi đáp`}
                    styleTitle={{ color: colors.white }}
                />
                <View style={{ flex: 1 }}>
                    <View style={{ borderWidth: 0.5, borderColor: colors.grayLight, flexDirection: 'row', margin: 10, borderRadius: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                        <Image source={Images.icSearch} style={[nstyles.nAva20, { marginLeft: 10 }]} resizeMode={'contain'} />
                        <TextInput
                            // value={keySearch}
                            style={{ padding: Platform.OS == 'android' ? 5 : 10, flex: 1, fontSize: reText(14), }}
                            placeholder={'Tìm kiếm'}
                            onChangeText={this.onChangeText}
                            ref={ref => this.refInput = ref}
                        />
                    </View>
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
            </View>
        );
    }
}

export default TimKiemCauHoi_VTS;
