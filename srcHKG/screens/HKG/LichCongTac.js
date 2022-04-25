/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert, FlatList, TouchableOpacity, Image, ScrollView, SafeAreaView
} from 'react-native';
import Modal from "react-native-modal";
// import { CheckBox } from 'react-native-elements';
import getToken from '../../api/getToken';
import HeaderHKG from '../Component/HeaderHKG';
import { Images } from '../../../src/images';
import { IsLoading } from '../../../components';



type Props = {};
export default class LichCongTac extends Component<Props> {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      refresh: false,
      page: 0,
      dataSource: [],
      idcn: '',
      crl: true,
      loading: false,
      refreshing: false,
      error: null,
      datatp: [],
      viewtp: true,
      datapc: [],
      idh: null,
      tk: null,
      modalVisible: false,
    };
    this.refreshing = React.createRef(null)
  }
  getdata = () => {
    getToken('hkg')
      .then(token => {
        if (token.length == 0) {
          Alert.alert(
            'Thông báo',
            'Bạn cần đăng nhập trước để xem',
            [
              { text: 'Đồng ý', onPress: () => console.log('OK Pressed') },
            ]
          );
        }
        else
          this.makeRemoteRequest();
      })
  }
  componentDidMount() {
    this.getdata();
  }
  _onPressTP(key) {
    var paramsString = "idh=" + key + "&kieu=CT";
    url = `https://hkg.tayninh.gov.vn/services/WebService.asmx/gettpct`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: paramsString
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.length !== 0) {
          this.setState({
            datatp: responseJson,
            modalVisible: true,
            viewtp: true
          });
          console.log(responseJson);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  _onPressTL(key) {
    var url = ``;
    getToken('hkg')
      .then(token => {
        if (token.length > 0) {
          this.setState({
            tk: token
          });
          var paramsString = "token=" + token + "&idct=" + key;
          url = `https://hkg.tayninh.gov.vn/services/WebService.asmx/gettppc`;
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: paramsString
          })
            .then((response) => response.json())
            .then((responseJson) => {
              if (responseJson.length !== 0) {
                this.setState({
                  datapc: responseJson,
                  modalVisible: true,
                  viewtp: false,
                  idh: key,
                  refreshing: false,
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
  }
  makeRemoteRequest = () => {
    var url = ``;
    this.refreshing.current.show()
    getToken('hkg')
      .then(token => {
        var paramsString = "token=" + token;
        url = `https://hkg.tayninh.gov.vn/services/WebService.asmx/dslichct`;
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: paramsString
        })
          .then((response) => response.json())
          .then((responseJson) => {
            this.refreshing.current.hide()
            if (responseJson.length !== 0) {
              this.setState({
                dataSource: responseJson,
                refreshing: false,
              });
              console.log(responseJson);
            }
            else {
              this.setState(previousState => ({
                dataSource: false
              }));
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
  };
  handleRefresh = () => {
    this.setState(
      {
        page: 0,
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
        this._onPressTL(this.state.idh);
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
  checkpc(key) {
    var url = ``;
    var paramsString = "token=" + this.state.tk + "&idh=" + this.state.idh + "&idtv=" + key;
    url = `https://hkg.tayninh.gov.vn/services/WebService.asmx/cntp`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: paramsString
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.length !== 0) {
          if (responseJson.thongbao != "sai") {
            Alert.alert(
              'Thông báo',
              responseJson.thongbao,
              [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
              ]
            );
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    this.handleRefresh()
  }
  componentWillReceiveProps() {
    setTimeout(() => {
      this.getdata();
    }, 100);
  }
  render() {
    const { navigate, goBack } = this.props.navigation;
    const viewnoitem = (
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Text style={{ fontSize: 18, }}>Không có lịch công tác</Text>
      </View>
    );
    const viewthanhphan = (
      <ScrollView>
        <FlatList
          data={this.state.datatp}
          renderItem={({ item }) =>
            <View style={styles.bao1}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={styles.icon} source={require('../../assets/HKG/organizationwf.png')} />
                <Text style={styles.txct}>{item.Ten}</Text>
              </View>
            </View>
          }
        />
      </ScrollView>
    );
    const viewphancong = (
      <ScrollView>
        <FlatList
          data={this.state.datapc}
          renderItem={({ item }) =>
            <View style={styles.bao1}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <CheckBox
                  title={item.Ten}
                  checked={item.pc}
                  onPress={this.checkpc.bind(this,item.key)}
                /> */}
              </View>
            </View>
          }
          keyExtractor={item => item.key}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
        />
      </ScrollView>
    );
    const viewwithitem = (
      <FlatList
        refreshing={this.state.refreshing}
        onRefresh={this.handleRefresh}
        onEndReached={this.handleLoadMore}
        onEndReachedThreshold={0.5}
        data={this.state.dataSource}
        renderItem={({ item }) =>
          <View>
            <View style={styles.bao1}>
              <View style={styles.bn}>
                <View style={styles.thu}>
                  <Text style={styles.textw}>{item.Gio}</Text>
                  <Text style={styles.textw}>{item.Thu == 1 ? 'Chủ nhật' : 'Thứ' + item.Thu}</Text>
                </View>
                <View style={styles.ngay}>
                  <Text style={styles.textb}>{item.Ngay}</Text>
                  <Text style={styles.textb}>Tháng {item.Thang}</Text>
                </View>
                <View style={styles.nam}>
                  <Text style={styles.textw}>{item.Nam}</Text>
                </View>
              </View>
              <View style={styles.nd}>
                <View style={styles.bnd}>
                  <Text style={item.TrangThai == 'Chờ họp' ? styles.td : item.TrangThai == 'Tạm hoãn' ? styles.tdd : styles.tdb}>{item.Ten}</Text>
                </View>
                <View style={styles.bct}>
                  <View style={styles.ct}>
                    <Image style={styles.icon} source={require('../../assets/HKG/marker.png')} />
                    <Image style={styles.icon} source={require('../../assets/HKG/info.png')} />
                    <Image style={styles.icon2} source={require('../../assets/HKG/sedan.png')} />
                  </View>
                  <View style={styles.ct}>
                    <Text style={styles.txct}>{item.DiaDiem}</Text>
                    <Text style={styles.txct2}>{item.TrangThai}</Text>
                    <Text style={styles.txct2}>Phương tiện: {item.PT} {item.PT != "Tự túc" ? item.Gio != item.GioX ? "- Xuất phát: " + item.GioX + " " + item.NgayX + "/" + item.ThangX + "/" + item.NamX : null : null}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.bao}>
              <View style={styles.ct4}>
                <TouchableOpacity style={styles.tou} onPress={this._onPressTP.bind(this, item.key)}>
                  <Text style={styles.txna}>Thành phần</Text>
                </TouchableOpacity >
                <TouchableOpacity style={styles.tou} onPress={this._onPressTL.bind(this, item.key)}>
                  <Text style={styles.txna}>Phân công tham dự</Text>
                </TouchableOpacity >
              </View>
            </View>
          </View>
        }
      />
    );
    const mainJSX2 = this.state.dataSource ? viewwithitem : viewnoitem;
    const mainJSX = this.state.viewtp ? viewthanhphan : viewphancong;
    return (
      <View style={{ flex: 1 }}>
        {/* <View style={styles.thanh1}>
          <View style={{ width: 35, height: 35, justifyContent: 'center', zIndex: 1 }}>
            <TouchableOpacity onPress={() => navigate('HomeHKG')}>
              <Image style={styles.icon_menu} source={require('../../assets/HKG/back.png')} />
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 6, flex: 1 }}>
            <Text style={{ textAlign: 'center', fontSize: 16, color: 'white', fontWeight: 'bold', marginLeft: -35, zIndex: 0 }}>Lịch công tác</Text>
          </View>
        </View> */}
        <HeaderHKG
          onPressLeft={() => goBack()}
          title={'Lịch công tác'}
          iconLeft={Images.icBack}
        />
        {mainJSX2}
        <Modal isVisible={this.state.modalVisible}
          onBackdropPress={() => this.setState({ modalVisible: null })}
        >
          <View style={styles.modalContent}>
            {mainJSX}
          </View>
        </Modal>
        <IsLoading ref={this.refreshing} />
      </View>
    );
  }

}
const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bao: {
    flexDirection: 'row',
    padding: 5,
    // marginLeft:10,
    // marginTop:,
    // marginBottom:5,
    borderBottomWidth: 0.5
  },
  bao1: {
    flexDirection: 'row',
    padding: 5,
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
    marginTop: 2,
    marginLeft: 5
  },
  bnd: {
    minHeight: 30
  },
  thu: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden',
    height: 40,
    width: 65,
    backgroundColor: 'red',
  },
  ngay: {
    height: 40,
    width: 65,
    backgroundColor: 'white',
  },
  nam: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    overflow: 'hidden',
    height: 20,
    width: 65,
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
  icon2: {
    width: 30,
    height: 20,
    marginTop: 5
  },
  ct: {
    marginTop: 0
  },
  txct: {
    marginLeft: 5,
    marginTop: 7,
    color: 'black',
    fontSize: 12,
  },
  txct2: {
    marginLeft: 5,
    marginTop: 10,
    color: 'black',
    fontSize: 12,
  },
  icon_menu: {
    width: 30,
    height: 30,
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 5,
  },
  ct4: {
    flex: 1,
    flexDirection: 'row',
  },
  tou: {
    flex: 1,
    marginTop: 5,
  },
  txna: {
    textAlign: 'center',
    padding: 5,
    color: 'white',
    flex: 1,
    backgroundColor: '#fb1c1c',
    marginLeft: 1,
    marginRight: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  thanh1: {
    backgroundColor: 'red',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 5,
  },
});