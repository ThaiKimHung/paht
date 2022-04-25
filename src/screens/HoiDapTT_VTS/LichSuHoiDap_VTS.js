import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import Utils from '../../../app/Utils';
import { HeaderCus, ListEmpty } from '../../../components';
import { colors } from '../../../styles';
import { nstyles } from '../../../styles/styles';
import apis from '../../apis';
import { Images } from '../../images';
import ItemHoiDapVTS from './ItemHoiDapVTS';

class LichSuHoiDap_VTS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      textempty: 'Đang tải...',
      dataLichSu: [],
      page: { Page: 1, AllPage: 1, Size: 10, Total: 0 }
    };
    ROOTGlobal.dataGlobal._reLoadLichSuHoiDapVTS = this._onRefresh
  }

  componentDidMount() {
    this.getListLichSuHoiDap()
  }

  getListLichSuHoiDap = async () => {
    const { page, dataLichSu } = this.state
    let res = await apis.apiHoiDapVTS.GetList_LichSuHoiTT(page.Page, page.Size)
    Utils.nlog('[LOG] data lich su cau hoi', res)
    if (res.status == 1 && res.data) {
      this.setState({
        dataLichSu: [...dataLichSu, ...res.data],
        refreshing: false,
        textempty: 'Không có dữ liệu',
        page: res?.page ? res.page : { Page: 1, AllPage: 1, Size: 10, Total: 0 }
      })
    } else {
      this.setState({
        dataLichSu: [],
        refreshing: false,
        textempty: 'Không có dữ liệu',
        page: res?.page ? res.page : { Page: 1, AllPage: 1, Size: 10, Total: 0 }
      })
    }
  }

  loadMore = async () => {
    const { page } = this.state
    if (page.Page < page.AllPage) {
      this.setState({ page: { ...page, Page: page.Page + 1 } }, this.getListLichSuHoiDap)
    }
  }

  _onRefresh = async () => {
    this.pageIndex = 1
    this.setState({ refreshing: true, textempty: 'Đang tải...', dataLichSu: [], page: { Page: 1, AllPage: 1, Size: 10, Total: 0 } }, this.getListLichSuHoiDap)
  }

  _ListFooterComponent = () => {
    const { page } = this.state
    if (page.Page < page.AllPage)
      return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
    else return null
  }

  _renderItem = ({ item, index }) => {
    return (
      <ItemHoiDapVTS item={item}
        onPress={() => this.onDetails(item)}
        onUpdate={() => { Utils.goscreen(this, 'Modal_GuiCauHoi_VTS', { itemEdit: item }) }}
        isCaNhan />
    )
  }

  onDetails = (item) => {
    Utils.goscreen(this, 'Modal_ChiTietCauHoi_VTS', { dataCauHoi: item })
  }

  _KeyExtrac = (item, index) => {
    return index.toString()
  }

  render() {
    const { refreshing, dataLichSu, textempty } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: colors.BackgroundHome, }}>
        <HeaderCus
          Sleft={{ tintColor: 'white' }}
          onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
          iconLeft={Images.icBack}
          title={`Lịch sử hỏi đáp`}
          styleTitle={{ color: colors.white }}
        />
        <View style={{ flex: 1 }}>
          <FlatList
            data={dataLichSu}
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

export default LichSuHoiDap_VTS;
