import moment from 'moment';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import Utils from '../../../../app/Utils';
import { HeaderCus, ListEmpty } from '../../../../components';
import { Images } from '../../../images';
import { colors } from '../../../../styles';
import { reText } from '../../../../styles/size';
import { nstyles } from '../../../../styles/styles';
import apis from '../../../apis';
import ItemHoiDapVTS from '../ItemHoiDapVTS';

const objFilter = {
  "sortOrder": "asc",
  "sortField": "CreatedDate",
  "pageNumber": "1",
  "pageSize": "10",
  "OrderBy": "CreatedDate",
  "page": "1",
  "record": "10",
  "more": false,
  "filter.keys": "tungay|denngay|status|keyword",
  "filter.vals": "||1|"
}

class HomeHoiDapVTS_Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTinhTrang: [{ Id: 100, TenTrangThai: 'Tất cả' }],
      tinhtrang: { Id: 100, TenTrangThai: 'Tất cả' },
      dateTo: '',
      dateFrom: '',
      keyword: '',

      textempty: 'Đang tải...',
      refreshing: true,
      ListHoiDap: [],
      page: {
        Page: 1,
        AllPage: 1,
        Size: 10,
        Total: 0
      },
      isUseFilter: false,
    };
    ROOTGlobal.dataGlobal._reloadHoiDapAdmin = (isAction = -1, IdHoiDapTT = '') => {
      this._onRefresh(isAction, IdHoiDapTT);
    }

  }

  componentDidMount() {
    this._getListNameStatus()
  }

  _GetListHoiDap = async () => {
    let { tinhtrang, dateTo, dateFrom, keyword, page } = this.state
    let obj = {
      ...objFilter,
      "filter.keys": tinhtrang?.Id == 100 ? "tungay|denngay|keyword" : "tungay|denngay|status|keyword",
      "filter.vals": tinhtrang?.Id == 100 ? `${dateFrom ? moment(dateTo, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''}|${dateFrom ? moment(dateFrom, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''}|${keyword}` : `${dateFrom ? moment(dateTo, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''}|${dateFrom ? moment(dateFrom, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''}|${tinhtrang.Id}|${keyword}`,
      "page": page.Page,
    }
    let res = await apis.apiHoiDapVTS.GetList_HoiTT(obj)
    Utils.nlog('res list sos', res)
    if (res.status == 1 && res.data) {
      this.setState({
        refreshing: false,
        ListHoiDap: this.state.ListHoiDap.concat(res.data),
        page: res.page
      })
    } else {
      this.setState({
        refreshing: false,
        ListHoiDap: [],
        page: {
          Page: 1,
          AllPage: 1,
          Size: 10,
          Total: 0
        },
        textempty: 'Không có dữ liệu'
      })
    }
  }

  _getListNameStatus = async () => {
    let res = await apis.apiHoiDapVTS.GetAllTrangThai()
    Utils.nlog('data tinht trang', res)
    if (res.status == 1 && res.data) {
      this.setState({
        dataTinhTrang: this.state.dataTinhTrang.concat(res.data),
      }, this._GetListHoiDap)
    } else {
      this.setState({
        dataTinhTrang: [{ Id: 100, TenTrangThai: 'Tất cả' }],
      }, this._GetListHoiDap)
    }
  }

  _openSetting = () => {
    // Mở bộ lọc xử lý tại đây
    Utils.goscreen(this, 'ModalFilterHoiDapTT', { dataSetting: { ...this.state }, callbacSetting: this.callbacSetting })
  }

  callbacSetting = (objSetting) => {
    this.setState({ ...objSetting, ListHoiDap: [], refreshing: true, page: { Page: 1, AllPage: 1, Size: 10, Total: 0 } }, this._GetListHoiDap)
    if (objSetting.dateTo || objSetting.dateFrom || objSetting.keyword) {
      this.setState({ isUseFilter: true })
    }
  }

  _DropDown = () => {
    //Show modal chọn tình trạng 
    console.log(this.state.dataTinhTrang)
    Utils.goscreen(this, 'ModalTinhTrangHoiDapTT', { callback: this._callback, item: this.state.tinhtrang, AllThaoTac: this.state.dataTinhTrang })
  }

  _callback = (val) => {
    this.setState({ refreshing: true, tinhtrang: val, ListHoiDap: [], textempty: 'Đang tải...' }, this._GetListHoiDap)
  }

  _renderItem = ({ item, index }) => {
    return (
      <ItemHoiDapVTS
        item={item}
        onPress={() => this._goDetail(item)}
      />
    )
  }

  _goDetail = (item) => {
    Utils.goscreen(this, 'Modal_DetailsHoiDapTT_Admin', { IdHoiDapTT: item.Id, callback: () => Utils.goscreen(this, 'Home_HoiDapTT_Admin') })
  }

  _keyExtractor = (item, index) => {
    return index.toString()
  }

  _onRefresh = (isAction = -1, IdHoiDapTT = '') => {
    if (isAction != -1 && IdHoiDapTT) {
      switch (isAction) {
        case 1: //chuyển xử lý,tiep nhan, xóa, thu hồi sos callback quay lại,chóng reload
          let list = this.state.ListHoiDap.filter(e => e.Id != IdHoiDapTT)
          this.setState({ ListHoiDap: list, textempty: list.length > 0 ? 'Đang tải...' : 'Không có dữ liệu' })
          break;
        default:
          break;
      }

    } else {
      this.setState({
        refreshing: true,
        textempty: 'Đang tải...',
        page: {
          Page: 1,
          AllPage: 1,
          Size: 10,
          Total: 0
        },
        ListHoiDap: []
      }, this._GetListHoiDap)
    }
  }


  _loadMore = () => {
    let { page } = this.state
    if (page.Page < page.AllPage) {
      this.setState({ page: { ...page, Page: page.Page + 1 } }, this._GetListHoiDap)
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

  _clearFilter = () => {
    this.setState({
      dateTo: '',
      dateFrom: '',
      keyword: '',
      textempty: 'Đang tải...',
      refreshing: true,
      ListHoiDap: [],
      page: {
        Page: 1,
        AllPage: 1,
        Size: 10,
        Total: 0
      },
      isUseFilter: false,
    }, this._GetListHoiDap)
  }

  render() {
    const { tinhtrang, ListHoiDap, textempty, refreshing, page, isUseFilter } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
        {/* Header */}
        <HeaderCus
          Sleft={{ tintColor: 'white' }}
          onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
          iconLeft={Images.icBack}
          title={`Hỏi đáp trực tuyến`}
          styleTitle={{ color: colors.white }}
          iconRight={Images.icFilter}
          Sright={{ tintColor: 'white' }}
          onPressRight={this._openSetting}
        />
        {/* Body */}
        <View style={{ flex: 1 }}>
          <View style={{ padding: 10 }}>
            <View style={[nstyles.nrow, nstyles.shadow]}>
              {/* {Phản ánh tung tham gia và của đơn vị} */}
              <TouchableOpacity
                onPress={this._DropDown}
                style={{ flex: 1, padding: 10, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginRight: 5 }}>
                <Text style={{ fontSize: reText(14) }}>{tinhtrang.TenTrangThai}</Text>
                <Image source={Images.icDropDown} style={[nstyles.nIcon15, { tintColor: 'gray' }]} resizeMode='contain' />
              </TouchableOpacity>
              <View
                style={{ padding: 10, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                <Text style={{ fontSize: reText(14) }}>{'Tổng: '}<Text style={{ fontWeight: 'bold', color: colors.orangeFive }}>{page.Total}</Text></Text>
              </View>
            </View>
            {
              isUseFilter ? <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white, marginTop: 10, borderRadius: 20 }} >
                <View style={{ paddingVertical: 10, flex: 1 }}>
                  <Text style={{ fontSize: reText(12), color: colors.yellowishOrange, paddingLeft: 10 }}>{'Đang sử dụng bộ lọc'}</Text>
                </View>
                <View style={{}}>
                  <TouchableOpacity onPress={this._clearFilter} style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                    <Text style={{ fontSize: reText(12), color: colors.yellowishOrange }} >{'Xóa bộ lọc'}</Text>
                    <Image source={Images.icCloseBlack} style={[nstyles.nIcon20, { tintColor: colors.yellowishOrange }]} />
                  </TouchableOpacity>
                </View>
              </View> : null
            }
          </View>
          <FlatList
            // showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20, }}
            extraData={this.state}
            data={ListHoiDap}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            refreshing={refreshing}
            onRefresh={this._onRefresh}
            ListEmptyComponent={<ListEmpty textempty={textempty} isImage={!refreshing} />}
            onEndReached={this._loadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={this._ListFooterComponent}
          />
        </View>
      </View>
    );
  }
}

export default HomeHoiDapVTS_Admin;
