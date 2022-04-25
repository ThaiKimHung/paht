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
import { ItemCuocHop } from './Search';
import HeaderHKG from '../Component/HeaderHKG';
import { Images } from '../../../src/images';
import { appConfig } from '../../../app/Config';
import { IsLoading } from '../../../components';


const { height } = Dimensions.get('window');

export default class ThongBaoHKG extends Component {
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
    this.refreshing = React.createRef(null)
  }
  componentDidMount() {
    this.makeRemoteRequest();
  }
  onSearch() {
    const { txtSearch } = this.state;
    this.makeRemoteRequest();
  }
  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    this.refreshing.current.show();
    // const url = `https://hkg.tayninh.gov.vn/services/WebService.asmx/getmobile?idtv=${this.state.idcn}&page=${page}&ngay=0&thang=0&nam=0&loai=2&txts=${this.state.txtSearch}`;
    const url = appConfig.domain + `api/hop-khong-giay/getmobile?idtv=${this.state.idcn}&page=0&ngay=0&thang=0&nam=0&loai=2&txts=${this.state.txtSearch}`
    this.setState({ loading: true });
    fetch(url, {
      method: 'GET',
      headers: {
        Token: 'rpNuGJebgtBEp0eQL1xKnqQG'
      },
    })
      .then(res => res.json())
      .then(res => {
        this.refreshing.current.hide();
        res = res.data
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
    // this.setState(
    //   {
    //     page: this.state.page + 1
    //   },
    //   () => {
    //     this.makeRemoteRequest();
    //   }
    // );
  };
  _keyExtractor = (item, index) => index.toString();
  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <View style={{ flex: 1 }}>
        <HeaderHKG
          onPressLeft={() => goBack()}
          iconLeft={Images.icBack}
          componentMid={
            <View style={{ flex: 1, marginVertical: 10, }}>
              <TextInput
                style={styles.textInput}
                placeholder="Nhập tên thông báo"
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
        <View style={styles.container}>
          {/* <View style={styles.wrapper}>
            <View style={styles.row1}>
              <TouchableOpacity onPress={() => navigate('HomeHKG')}>
                <Image style={styles.icon_menu} source={require('../../assets/HKG/back.png')} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập tên thông báo"
              underlineColorAndroid="transparent"
              value={this.state.txtSearch}
              onChangeText={text => this.setState({ txtSearch: text })}
              onSubmitEditing={this.onSearch.bind(this)}
            />
          </View> */}
          <View style={{ flex: 1 }}>
            <FlatList
              onRefresh={this.handleRefresh}
              refreshing={this.state.refreshing}
              keyExtractor={this._keyExtractor}
              onEndReached={this.handleLoadMore}
              onEndReachedThreshold={0.5}
              data={this.state.data}
              renderItem={({ item }) =>
                <ItemCuocHop item={item} />
              }
            />
          </View>
        </View>
        <IsLoading ref={this.refreshing} />
      </View>
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
    color: 'black'
  },
  td: {
    fontWeight: 'bold',
    color: 'black'
  },
  tdb: {
    fontWeight: 'bold',
    color: 'blue'
  },
  tdd: {
    fontWeight: 'bold',
    color: 'red'
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
    marginTop: 5
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


AppRegistry.registerComponent('ThongBao', () => ThongBao);