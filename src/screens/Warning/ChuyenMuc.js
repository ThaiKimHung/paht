import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import apis from '../../apis';
import Utils from '../../../app/Utils';
import { HeaderCus, ListEmpty } from '../../../components';
import { nstyles, colors } from '../../../styles';
import { sizes } from '../../../styles/size';
import { Images } from '../../images';

import { appConfig } from '../../../app/Config';
import moment from 'moment';
import { nGlobalKeys } from '../../../app/keys/globalKey';
import UtilsApp from '../../../app/UtilsApp';
class ChuyenMuc extends Component {

  componentDidMount() {
    this.props.GetDataChuyenMuc();
  }

  _ListFooterComponent = () => {

    let { pageChuyenMuc } = this.props.thongbao
    if (pageChuyenMuc.Page < pageChuyenMuc.AllPage && this.props.auth.tokenCD)
      return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
    else return null
  }

  loadMore = async () => {
    let { pageChuyenMuc } = this.props.thongbao
    const pageNumber = pageChuyenMuc.Page + 1;
    if (pageChuyenMuc.Page < pageChuyenMuc.AllPage) {
      this.props.LoadMoreChuyenMuc(pageNumber)
    };
  };

  _goScreeen = (item) => {
    // Utils.nlog("vao on press")
    Utils.goscreen(this, "Modal_ChiTietChuyenMuc", {
      id: item.IdChuyenMuc
    })
  }
  UpdateNoti = async (item) => {
    const { auth = {} } = this.props
    if (auth.tokenCD != '') {
      const res = await apis.ApiCanhBao.OnOffNotifyCanhBao(item.IdChuyenMuc, !item.Notify)
      Utils.nlog("gia tri res,", res)
      if (res.status == 1) {
        this._onRefresh();
      } else {
        Utils.showMsgBoxOK(this, 'Thông báo', "Lỗi thực hiện thao tác", "Xác nhận");
      }
    } else {
      Utils.showMsgBoxOK(this, 'Thông báo', "Để nhận thông báo\nXin vui lòng đăng nhập!", 'Xác nhận')
    }
  }
  _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => this._goScreeen(item)}
        style={[nstyles.nstyles.shadown, {
          marginVertical: 5, paddingVertical: 20, paddingHorizontal: 10, borderRadius: 5,
          borderWidth: item.Prior == 1 ? 2 : 0, borderColor: item.Prior == 1 ? colors.orangCB : colors.colorGrayBGCB,
          backgroundColor: colors.white
        }]} >
        <View style={[nstyles.nstyles.nrow, {}]}>
          <Image source={item.Icon ? { uri: appConfig.domain + item.Icon } : Images.icTabChuyenMuc} style={[nstyles.nstyles.nIcon30,]} resizeMode='cover' />
          <View style={{ paddingHorizontal: 10, flex: 1 }}>

            <View style={[nstyles.nstyles.nrow, { width: '100%', justifyContent: 'space-between' }]}>
              <Text numberOfLines={2} style={{ fontWeight: 'bold', fontSize: sizes.sText12, flex: 1 }}>
                {`${item.TenChuyenMuc}`}
              </Text>
              <TouchableOpacity
                onPress={() => this.props.UpdateNotification(item)}
                style={[nstyles.nstyles.nrow,
                {
                  padding: 5, backgroundColor: item.Notify ? colors.yellowLight : colors.colorGrayBGCB,
                  borderRadius: 5, alignItems: 'center', alignSelf: 'flex-end',
                }]}>
                <Image source={item.Notify ? Images.icThongBaoCBYes : Images.icThongBaoCBNo} style={[nstyles.nstyles.nIcon12, { tintColor: colors.black_60 }]} resizeMode='cover' />
                <Text style={{ textAlign: 'center', fontSize: sizes.sText12 }}>{'Thông báo'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: sizes.sText14, }}>
              {`Thời gian`}
            </Text>
            <Text style={{ fontStyle: 'italic', fontSize: sizes.sText12, }}>
              {`Ngày tạo: ${moment(item.NgayTao).format("DD/MM/YYYY")}`}
            </Text>

          </View>
        </View>
      </TouchableOpacity>
    )
  }
  _keyExtrac = (item, index) => index.toString();
  _onRefresh = () => {
    this.props.GetDataChuyenMuc();
  }
  render() {
    let { isReshingChuyenMuc, dataChuyenMuc, pageChuyenMuc } = this.props.thongbao
    return (
      <View style={{ backgroundColor: colors.BackgroundHome, flex: 1 }}>
        <HeaderCus
          Sleft={{ tintColor: 'white' }}
          onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
          iconLeft={Images.icBack}
          title={UtilsApp.getScreenTitle("ManHinh_Warning", 'Thông tin từ chính quyền')}
          styleTitle={{ color: colors.white }}
        />
        <FlatList
          scrollEventThrottle={10}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 10,
            paddingBottom: nstyles.paddingBotX + 20 + (Platform.OS === 'android' ? 60 : 60)
          }}
          renderItem={this._renderItem}
          data={!this.props.auth.tokenCD ? [] : dataChuyenMuc}
          ListEmptyComponent={<ListEmpty textempty={!this.props.auth.tokenCD ? 'Vui lòng đăng nhập để xem' : isReshingChuyenMuc ? 'Đang tải...' : 'Không có dữ liệu'} isImage={!isReshingChuyenMuc} />}
          keyExtractor={this._keyExtrac}
          refreshing={isReshingChuyenMuc}
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
  auth: state.auth,
  thongbao: state.thongbao
});
export default Utils.connectRedux(ChuyenMuc, mapStateToProps, true);