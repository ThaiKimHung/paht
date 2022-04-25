import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  RefreshControl,
  Alert,
  TouchableOpacity, SafeAreaView
} from 'react-native';
import getToken from '../../api/getToken';
import HeaderHKG from '../Component/HeaderHKG';
import { Images } from '../../../src/images';
import { appConfig } from '../../../app/Config';
import { ItemCuocHop } from './Search';
import Utils from '../../../app/Utils';

export default class NewMeeting extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      idcn: '',
      crl: true
    };
  }
  componentDidMount() {
    this.getdata();
  }
  getdata = () => {
    var url = ``;

    getToken('hkg')
      .then(token => {
        if (token.length > 0) {
          var paramsString = "token=" + token;
          url = appConfig.domain + `api/hop-khong-giay/dshopmoi`;// `https://hkg.tayninh.gov.vn/services/WebService.asmx/dshopmoi`;
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              Token: 'rpNuGJebgtBEp0eQL1xKnqQG'
            },
            body: paramsString
          })
            .then((response) => response.json())
            .then((responseJson) => {
              Utils.nlog("giá trị response json", responseJson)
              responseJson = responseJson.data;
              if (responseJson && responseJson.length !== 0) {
                this.setState({
                  dataSource: responseJson
                });
              }
              else {
                Alert.alert(
                  'Thông báo',
                  'Không có cuộc họp mới',
                  [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                  ]
                );
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          Alert.alert(
            'Thông báo',
            'Bạn cần đăng nhập trước để xem',
            [
              { text: 'Đồng ý', onPress: () => console.log('OK Pressed') },
            ]
          );
        }
      })
  }
  _keyExtractor = (item, index) => index.toString();
  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <View style={{ flex: 1 }}>
        {/* <View style={st.thanh1}>
          <View style={{ width: 35, height: 35, justifyContent: 'center', zIndex: 1 }}>
            <TouchableOpacity onPress={() => navigate('HomeHKG')}>
              <Image style={st.icon_menu} source={require('../../assets/HKG/back.png')} />
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 6, flex: 1 }}>
            <Text style={{ textAlign: 'center', fontSize: 16, color: 'white', fontWeight: 'bold', marginLeft: -35, zIndex: 0 }}>Cuộc họp mới</Text>
          </View>
        </View> */}
        <HeaderHKG
          onPressLeft={() => goBack()}
          title={'Cuộc họp mới'}
          iconLeft={Images.icBack}
        />
        <FlatList
          data={this.state.dataSource}
          renderItem={({ item }) =>
            <ItemCuocHop item={item} />
          }
          keyExtractor={this._keyExtractor}
        />

      </View>
    );
  }

}
const st = StyleSheet.create({
  container: {
    flex: 1,
  },
  thanhphai: {
    flexDirection: 'row',
    padding: 0,
    justifyContent: 'flex-end',
  },
  thanhtrai: {

  },
  icon_thanh: {
    width: 30,
    height: 30,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 5,
  },
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
  thanh1: {
    backgroundColor: 'red',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 5,
  },
  icon_menu: {
    width: 30,
    height: 30,
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 5,
  },
});
