import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Text,
  FlatList,
  Alert, SafeAreaView
} from 'react-native';
import { ConfigScreen } from '../../navigation';
import { nstyles } from '../../../styles/styles';
import { Images } from '../../../src/images';
import HeaderHKG from '../Component/HeaderHKG';
import { appConfig } from '../../../app/Config';

import Utils from '../../../app/Utils';
import { colors } from '../../../styles';
import { IsLoading } from '../../../components';

const { height } = Dimensions.get('window');
export const getColorItem = (item) => {
  switch (item.TrangThai) {
    case 'Chờ họp':
      return colors.colorSunflower
      break;
    case 'Tạm hoãn':
      return colors.white
      break;
    case 'Kết thúc':
      return colors.colorSalmon

      break;
    case 'Đang họp':
      return colors.colorKellyGreen
      break;

    default:
      return colors.coral
      break;
  }
}
export const ItemCuocHop = (props) => {
  const { item, index } = props;
  // Utils.nlog("giá tị item -----", item);
  return (
    <TouchableOpacity style={{
      backgroundColor: 'white',
      margin: 3, borderRadius: 10,
      // borderWidth: 1, 
      marginHorizontal: 5,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }}
      onPress={() => Utils.navigate(ConfigScreen.DetailMeeting,
        { idcuochop: item.key, screen: 'Search', isCheck: 1 })}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{
          backgroundColor: '#F0A14D', width: "23%",
          borderRadius: 10, borderBottomRightRadius: 2, alignItems: 'center',
          borderWidth: 1, borderColor: colors.turquoiseBlue_10
        }}>
          <View style={{ width: '100%', borderRadius: 0, backgroundColor: colors.coral, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}>
            <Text style={{
              color: colors.white, fontWeight: 'bold',
              textAlign: 'center', paddingVertical: 7
            }}>{item.Gio}</Text>
          </View>
          {/* <View style={{ height: 3, backgroundColor: colors.white, width: '50%' }}></View> */}
          <View style={{
            flex: 1, justifyContent: 'center', backgroundColor: 'white',
            width: '100%', alignItems: 'center'
          }} >
            <Text style={{
              color: colors.black_80, fontWeight: 'bold',
              textAlign: 'center', fontSize: 20,
            }}>{item.Thu == 1 ? 'Chủ nhật' : 'Thứ ' + item.Thu}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }} >
              <Text style={{
                color: colors.black_80, fontWeight: 'bold',
                textAlign: 'center', fontSize: 17
              }}>{item.Ngay}</Text>
              <Text style={{
                color: colors.black_80, fontWeight: 'bold',
                textAlign: 'center', fontSize: 12
              }}>Tháng</Text>
              <Text style={{
                color: colors.black_80, fontWeight: 'bold',
                textAlign: 'center', fontSize: 17
              }}>{item.Thang}</Text>
            </View>
          </View>
          {/* <View style={{ height: 2, backgroundColor: colors.white, width: '80%' }}></View> */}
          <View style={{ paddingVertical: 7 }} >
            <Text style={{
              color: colors.white, fontWeight: 'bold',
              textAlign: 'center'
            }}>{item.Nam}</Text>
          </View>
        </View>
        <View style={{
          flex: 1, backgroundColor: 'white',
          borderTopRightRadius: 10, borderBottomRightRadius: 10,
          paddingVertical: 10, paddingHorizontal: 7
        }}>
          <View style={styles.bnd}>
            <Text style={item.TrangThai == 'Chờ họp' ? styles.td : item.TrangThai == 'Tạm hoãn' ? styles.tdd : styles.tdb}>{item.TenCH}</Text>
          </View>
          <View style={styles.bct}>
            <View style={styles.ct}>
              <Image style={styles.icon} source={require('../../assets/HKG/company.png')} />
              <Image style={styles.icon} source={require('../../assets/HKG/marker.png')} />
              <Image style={styles.icon} source={require('../../assets/HKG/info.png')} />
            </View>
            <View style={styles.ct}>
              <Text style={{ ...styles.txct }}>{item.DonViToChuc}</Text>
              <Text style={styles.txct}>{item.DiaDiem}</Text>
              <Text style={styles.txct}>{item.TrangThai}</Text>
            </View>
          </View>
        </View>
        <View style={{ width: 10, backgroundColor: getColorItem(item), borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
        </View>
      </View>
    </TouchableOpacity >
  )
}

export default class Search extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      loading: false,
      data: [],
      page: 0,
      error: null,
      refreshing: false,
      idcn: params.idtv,
      txtSearch: '',
    };
    this.refLoading = React.createRef(null);
  }
  componentDidMount() {
    this.makeRemoteRequest();
  }
  onSearch() {
    const { txtSearch } = this.state;
    this.handleRefresh()
    // this.setState({ refreshing: false }, this.makeRemoteRequest)
  }
  makeRemoteRequest = async () => {
    const { page, seed } = this.state;
    // this.refLoading.current.show()
    // nthisIsLoading.show();
    // const url = `https://hkg.tayninh.gov.vn/services/WebService.asmx/getmobile?idtv=${this.state.idcn}&page=${page}&ngay=0&thang=0&nam=0&loai=1&txts=${this.state.txtSearch}`;
    const url = appConfig.domain + `api/hop-khong-giay/getmobile?idtv=${this.state.idcn}&page=${page}&ngay=0&thang=0&nam=0&loai=1&txts=${this.state.txtSearch}`
    this.setState({ loading: true });
    await fetch(url,
      {
        method: 'GET',
        headers: {
          Token: 'rpNuGJebgtBEp0eQL1xKnqQG'
        },
      })
      .then(res => res.json())
      .then(res => {
        // nthisIsLoading.hide();
        // this.refLoading.current.hide()
        // Utils.nlog("giá trị res------------Search", res)
        // Utils.nlog("giá trị res------------Search", res)
        res = res.data;
        this.setState({
          data: page === 0 ? res : [...this.state.data, ...res],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };
  handleRefresh = () => {
    // this.refLoading.current.hide()
    this.setState(
      {
        page: 0,
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };
  _keyExtractor = (item, index) => index.toString();
  render() {
    const { navigate } = this.props.navigation;
    console.log("------Danh sách cụôc họp:", this.state.data)
    return (
      <View style={nstyles.ncontainer}>
        <HeaderHKG
          onPressLeft={() => navigate(ConfigScreen.HomeHKG)}
          iconLeft={Images.icBack}
          componentMid={
            <View style={{ flex: 1, marginVertical: 10 }}>
              <TextInput
                style={styles.textInput}
                placeholder="Nhập tên cuộc họp"
                underlineColorAndroid="transparent"
                value={this.state.txtSearch}
                onChangeText={text => this.setState({ txtSearch: text })}
                onSubmitEditing={this.onSearch.bind(this)}
              />
            </View>
          }
          iconRight={Images.icSearch}
          onPressRight={() => this.onSearch()}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <FlatList
              onRefresh={this.handleRefresh}
              refreshing={this.state.refreshing}
              onEndReached={this.handleLoadMore}
              onEndReachedThreshold={0.5}
              keyExtractor={this._keyExtractor}
              data={this.state.data}
              keyExtractor={this._keyExtractor}
              renderItem={({ item }) =>
                <ItemCuocHop item={item} />
              }
            />
          </View>
        </SafeAreaView>
        <IsLoading ref={this.refLoading} />
      </View >

    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    backgroundColor: 'red',
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  row1: { justifyContent: 'space-between' },
  textInput: {
    borderRadius: 5,
    backgroundColor: '#FFF',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  titleStyle: { color: '#FFF', fontFamily: 'Avenir', fontSize: 20 },
  bao: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 0.5
  },
  bct: {
    flexDirection: 'row',
  },
  nd: {
    marginLeft: 10,
    flex: 1
  },
  td: {
    fontWeight: 'bold',
    color: colors.turquoiseBlue
  },

  tdb: {
    fontWeight: 'bold',
    color: colors.turquoiseBlue
  },
  tdd: {
    fontWeight: 'bold',
    color: colors.turquoiseBlue
  },
  bn: {
    marginTop: 2
  },
  bnd: {
    minHeight: 30
  },
  thu: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden',
    height: 40,
    width: 60,
    backgroundColor: 'red',
  },
  ngay: {
    height: 40,
    width: 60,
    backgroundColor: 'white',
  },
  nam: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    overflow: 'hidden',
    height: 20,
    width: 60,
    backgroundColor: 'green',
  },
  textw: {
    textAlign: 'center',
    color: 'white'
  },
  textb: {
    textAlign: 'center',
    color: 'black'
  },
  icon: {
    width: 20,
    height: 20,
    marginTop: 5,
    tintColor: colors.royal
  },
  ct: {
    marginTop: 0
  },
  txct: {
    marginLeft: 5,
    marginTop: 10,
    color: 'black',
    fontSize: 12,
  },
  icon_menu: {
    width: 30,
    height: 30,
    marginTop: -2
  },
});


AppRegistry.registerComponent('search', () => Search);
