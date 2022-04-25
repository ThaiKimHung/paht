import React, { Fragment, Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';
import Utils from '../../../app/Utils';
import InputRNCom from '../../../components/ComponentApps/InputRNCom';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
import { ImgComp } from '../../../components/ImagesComponent';
import { TextInput } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import apis from '../../apis'
import HtmlViewCom from '../../../components/HtmlView';
import { HeaderCus } from '../../../components';
import { Images } from '../../images';
import moment from 'moment'
import LottieView from 'lottie-react-native';


class DSChiTietThongKe extends Component {
  constructor(props) {
    super(props);
    this.Title = Utils.ngetParam(this, 'title', "Chi tiết");
    this.IdTopic = Utils.ngetParam(this, 'IdTopic', 0);
    this.fromdate = Utils.ngetParam(this, 'fromdate', '');
    this.todate = Utils.ngetParam(this, 'todate', '');
    this.SacThai = Utils.ngetParam(this, 'SacThai', []);
    this.LoaiTinTuc = Utils.ngetParam(this, 'LoaiTinTuc', []);
    this.LoaiBaiViet = Utils.ngetParam(this, 'LoaiBaiViet', []);

    this.state = {
      textempty: 'Không có dữ liệu',
      opacity: new Animated.Value(0),
      dataDS: [],
      refreshing: true,
      page: {
        Page: 1,
        AllPage: 1,
        Total: 0
      },
    }
  };

  componentDidMount() {
    this.GetList_ThongKe();
  }

  // GetList_ThongKe = async () => {
  //     let { page } = this.state
  //     let res = await apis.ApiReputa.getReputaNewsSearch(this.IdTopic, this.fromdate, this.todate, page.Page, this.LoaiTinTuc, this.SacThai)
  //     Utils.nlog('getReputaNewsSearch:', res)
  //     if (res == -1) {
  //         Utils.showMsgBoxOK({ props }, "Thông báo", "Tải dữ liệu thất bại. Vui lòng thử lại!")
  //     }
  //     if (res?.hits && res?.hits.length > 0) {
  //         this.setState({ dataDS: this.state.dataDS.concat(res.hits), refreshing: false, page: { ...page, AllPage: res.total / 10, Total: res.total } })
  //     } else {
  //         this.setState({ refreshing: false });
  //     }
  // }
  GetList_ThongKe = async () => {
    let { page } = this.state;
    console.log()
    let res = await apis.ApiReputa.getReputaNewsSearch(
      this.IdTopic,
      this.fromdate,
      this.todate,
      page.Page,
      this.LoaiTinTuc, // sources
      this.SacThai,  //  sentiments,
      this.LoaiBaiViet
    );
    Utils.nlog('getReputaNewsSearch:', res);
    if (res == -1) {
      Utils.showMsgBoxOK(
        { props },
        'Thông báo',
        'Tải dữ liệu thất bại. Vui lòng thử lại!',
      );
    }
    if (res?.hits && res?.hits.length > 0) {
      this.setState({
        dataDS: this.state.dataDS.concat(res.hits),
        refreshing: false,
        page: { ...page, AllPage: res.total / 10, Total: res.total },
      });
    } else {
      this.setState({ refreshing: false });
    }
  };

  _renderItemNews = ({ item, index }) => {
    // Utils.nlog("IMG:", item.image_sources)
    return (
      <TouchableOpacity
        key={index}
        onPress={() => Utils.openWeb({ ...this.props }, item.url)}
        style={{
          backgroundColor: colors.white,
          width: Width(100),
          marginRight: 5,
          paddingVertical: 10,
          paddingHorizontal: 10,
          borderRadius: 5,
        }}>
        <Text
          numberOfLines={2}
          style={{
            color: '#4EB4DA',
            fontSize: reText(16),
            height: Height(5),
            fontWeight: 'bold',
          }}>
          {item.title}
        </Text>
        <Text
          style={{
            color: colors.black_60,
            fontSize: reText(12),
            marginTop: 5,
            marginBottom: 5,
          }}>
          {moment(item.created_time).format('DD/MM/YYYY HH:mm:ss')}
        </Text>
        <View
          style={{ flexDirection: 'row', width: Width(100), height: Width(30) }}>
          {item.image_sources ? (
            <View style={{ width: Width(25), height: Width(25) }}>
              <Image
                source={{
                  uri: item.image_sources
                    ? item.image_sources[0]
                      ? item.image_sources[0]
                      : null
                    : null,
                }}
                style={{ width: Width(24), height: Width(24) }}
                resizeMode="cover"
              />
            </View>
          ) : null}
          {/* <View
  style={{
    width: item.image_sources ? Width(55) : Width(80),
    height: Width(30),
  }}>
</View> */}
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <HtmlViewCom
              html={item.content ? item.content : '<div></div>'}
              style={{}}
            />
          </View>
        </View>
        <Text style={{ fontSize: reText(12), color: colors.black_60 }}>
          {item.domain}
        </Text>
      </TouchableOpacity>
    );
  }
  _renderItemMXH = ({ item, index }) => {
    // Utils.nlog("IMG:", item.image_sources)
    return (
      <TouchableOpacity
        key={index}
        onPress={() => Utils.openWeb({ ...this.props }, item.url)}
        style={{
          backgroundColor: colors.white,
          width: Width(100),
          marginRight: 5,
          paddingHorizontal: 10,
          borderRadius: 5,
          paddingVertical: 10,
          // backgroundColor: 'red'
        }}>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Text
            numberOfLines={1}
            style={{ color: '#4EB4DA', fontSize: reText(16), width: Width(100), fontWeight: 'bold' }}>
            {item.title}
          </Text>
          <View style={{ position: 'absolute', left: Width(60) }}>
            <LottieView source={Images.icFacbook} style={{ paddingVertical: 10, width: 160, height: 160 }} autoPlay />
          </View>
        </View >
        <Text
          style={{
            color: colors.black_60,
            fontSize: reText(12),
            marginTop: 5,
            marginBottom: 5,
          }}>
          {moment(item.created_time).format('DD/MM/YYYY HH:mm:ss')}
        </Text>
        <View
          style={{ flexDirection: 'row', width: Width(100), height: Width(30) }}>
          <View style={{ width: Width(80), height: Width(30) }}>
            <HtmlViewCom
              html={item.content ? item.content : '<div></div>'}
              style={{}}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
          <Text style={styles.textFB}>
            Like: <Text style={styles.textChild}>{item.like_count}</Text>
          </Text>
          <Text style={styles.textFB}>
            Comment: <Text style={styles.textChild}>{item.comment_count}</Text>
          </Text>
          <Text style={styles.textFB}>
            Share: <Text style={styles.textChild}>{item.share_count}</Text>
          </Text>
        </View>
      </TouchableOpacity >
    );
  }

  _renderItem = ({ item, index }) => {
    if (item.source_id == '2') //--MXH
      return this._renderItemMXH({ item, index });
    else
      return this._renderItemNews({ item, index });
  }

  _onRefresh = () => {
    this.setState({ refreshing: true, page: { Page: 1, AllPage: 1, Total: 0 } }, this.GetList_ThongKe)
  }

  loadMore = () => {
    var { page } = this.state;
    let nextPage = page.Page + 1
    if (page.Page < page.AllPage) {
      this.setState({ page: { ...page, Page: nextPage } }, this.GetList_ThongKe);
    }
  };

  _ListFooterComponent = () => {
    var { page } = this.state;
    return page.Page < page.AllPage ? <ActivityIndicator size='small' style={{ marginVertical: 10 }} /> : null;
  }
  render() {
    return (
      // <View style={{ flex: 1, backgroundColor: 'red' }}></View>
      <View style={[{ flex: 1, backgroundColor: colors.grayLight }]}>
        <HeaderCus
          Sleft={{ tintColor: 'white' }}
          onPressLeft={() => Utils.goback(this)}
          iconLeft={Images.icBack}
          title={this.Title}
          styleTitle={{ color: colors.white }}
        />
        <FlatList
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
          style={{ backgroundColor: 'white', borderRadius: 3, paddingVertical: 10, height: Height(65) }}
          numColumns={1}
          ListEmptyComponent={<Text style={{ textAlign: 'center' }}>{this.state.refreshing ? "" : "Không có dữ liệu"}</Text>}
          data={this.state.dataDS}
          renderItem={this._renderItem}
          ItemSeparatorComponent={() => {
            return <View style={{ height: 1, width: '100%', backgroundColor: colors.black_16 }} />
          }}
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
  theme: state.theme
});
export default Utils.connectRedux(DSChiTietThongKe, mapStateToProps, true);

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  Title: { fontSize: reText(15), alignSelf: 'center', textAlign: 'center', fontWeight: 'bold', color: colors.white },
  textFB: { fontSize: reText(14), color: '#4EB4DA', marginRight: 5 },
  textChild: { color: colors.black_50 }
})
