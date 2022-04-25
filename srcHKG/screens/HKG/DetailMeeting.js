import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Linking, SafeAreaView, Platform, ImageBackground,
} from 'react-native';
import TabBar from './TabBar';
import ImagePicker from 'react-native-image-crop-picker';
import RNCalendarEvents from 'react-native-calendar-events';
import getToken from '../../api/getToken';
import HeaderHKG from '../Component/HeaderHKG';
import { Images } from '../../../src/images';
import { appConfig } from '../../../app/Config';

import { getColorItem } from './Search';

import Utils from '../../../app/Utils';
import { colors } from '../../../styles';
import { IsLoading } from '../../../components';
import { nstyles } from '../../../styles/styles';

const newLocal = true;
export default class DetailMeeting extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    console.log("param:---------", params);
    this.state = {
      key: params.idcuochop,
      screen: params.screen,
      dataHop: [],
      dataDV: [],
      dataFile: [],
      dataYKien: [],
      viewtp: true,
      viewyk: false,
      viewtl: false,
      active: 'ThanhPhan',
      file: null,
      tieude: null,
      noidung: null,
      imageview: null,
      checkstyk: 1,
      refreshing: true,
      isCheck: params.isCheck
    };
    this.refLoading = React.createRef(null);
  }
  getdata = () => {
    this.refLoading.current.show();
    const url = appConfig.domain + `api/hop-khong-giay/getcthop?idh=${this.state.key}`;//`https://hkg.tayninh.gov.vn/services/WebService.asmx/getcthop?idh=${this.state.key}`;
    fetch(url, {
      method: 'GET',
      headers: {
        Token: 'rpNuGJebgtBEp0eQL1xKnqQG'
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.refLoading.current.hide();
        Utils.nlog("res ponse -------------", url, responseJson)
        this.state.mang = responseJson.data && responseJson.data.length > 0 ? responseJson.data : [];
        this.setState({
          dataHop: responseJson.data && responseJson.data.length > 0 ? responseJson.data : [],
          refreshing: false
        });

        console.log(this.state.key);
        this.setState({
          checkstyk: this.state.dataHop[0].TT,
          refreshing: false
        });
      })
      .catch((err) => {
        console.log('Loi');
      });
    const urltp = appConfig.domain + `api/hop-khong-giay/gettphop?idh=${this.state.key}`;
    console.log("<><><><><><><><>urltp:", urltp)
    fetch(urltp, {
      method: 'GET',
      headers: {
        Token: 'rpNuGJebgtBEp0eQL1xKnqQG'
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.refLoading.current.hide();
        responseJson = responseJson.data;
        this.state.mang = responseJson;
        this.setState({
          dataDV: responseJson,
          refreshing: false
        });
      })
      .catch((err) => {
        console.log('Loi');
      });
    const urltl = appConfig.domain + `api/hop-khong-giay/gettlhop?idh=${this.state.key}`;
    fetch(urltl, {
      method: 'GET',
      headers: {
        Token: 'rpNuGJebgtBEp0eQL1xKnqQG'
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.refLoading.current.hide();
        responseJson = responseJson.data;
        this.state.mang = responseJson;
        this.setState({
          dataFile: responseJson,
          refreshing: false
        });
      })
      .catch((err) => {
        console.log('Loi');
      });

  }
  componentDidMount() {
    console.log("Id cuộc họp:", this.state.key)
    this.getdata();
  }
  _BamTP() {
    console.log(this.state.active);
    console.log("___________");
    this.setState({
      viewtp: true,
      viewyk: false,
      viewtl: false,
      active: 'ThanhPhan',
    });
    console.log(this.state.active);
  }
  _BamTL() {
    console.log(this.state.active);
    console.log("___________");
    this.setState({
      viewtp: false,
      viewyk: false,
      viewtl: true,
      active: 'TaiLieu',
    });
    console.log(this.state.active);
  }
  // _BamYKien() {
  //   console.log(this.state.active);
  //   console.log("___________");
  //   this.setState({
  //     active: 'YKien',
  //     viewtp: false,
  //     viewtl: false,
  //     viewyk: true,
  //   });
  //   console.log(this.state.active);
  // }
  taifile(key) {
    getToken('hkg')
      .then(token => {
        if (token.length > 0) {
          var paramsString = "id=" + key + "&token=" + token;
          fetch(appConfig.domain + "api/hop-khong-giay/CodeFile", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'token': 'rpNuGJebgtBEp0eQL1xKnqQG'
            },
            body: paramsString
          })
            .then((response) => response.json())
            .then((responseJson) => {
              responseJson = responseJson.data;
              if (responseJson.thongbao == 'dung') {
                var link = appConfig.domain + `api/hop-khong-giay/download?code=${responseJson.code}`;
                Utils
                Linking.canOpenURL(link).then(supported => {
                  if (supported) {
                    Linking.openURL(link);
                  } else {
                    console.log("Don't know how to open URI: " + link);
                  }
                });
              }
            })
            .catch((err) => {
              console.log('Loi');
            });
        } else {
          Alert.alert(
            'Thông báo',
            'Bạn phải đăng nhập để lấy tài liệu',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
          )
        }
      })
      .catch(err => console.log('LOI CHECK LOGIN', err));
  }

  baohop() {
    //   RNCalendarEvents.findEventById('151').then(
    //     id => {
    //        console.log(id)
    //     }
    // );
    var timestar = null;
    var timefn = null;
    if (Platform.OS === "android") {
      timestar = this.state.dataHop[0].Nam + '-' + this.state.dataHop[0].Thang + '-' + this.state.dataHop[0].Ngay + 'T' + this.state.dataHop[0].Gio + ':00.000Z';
      timefn = this.state.dataHop[0].NamK + '-' + this.state.dataHop[0].ThangK + '-' + this.state.dataHop[0].NgayK + 'T' + this.state.dataHop[0].GioK + ':00.000Z';
    } else {
      timestar = this.state.dataHop[0].Nam + '-' + this.state.dataHop[0].Thang + '-' + this.state.dataHop[0].Ngay + 'T' + this.state.dataHop[0].Gio + ':00.000GMT+7';
      timefn = this.state.dataHop[0].NamK + '-' + this.state.dataHop[0].ThangK + '-' + this.state.dataHop[0].NgayK + 'T' + this.state.dataHop[0].GioK + ':00.000GMT+7';
    }

    RNCalendarEvents.requestPermissions(false)
    RNCalendarEvents.checkPermissions(false).then(e => {
      Utils.nlog("e-------", e)

      setTimeout(() => {
        RNCalendarEvents.saveEvent(this.state.dataHop[0].TenCH, {
          location: this.state.dataHop[0].DDHop + ', ' + this.state.dataHop[0].TenDonVi,
          notes: this.state.dataHop[0].NoiDung,
          startDate: timestar,
          endDate: timefn,
          // startDate: this.state.dataHop[0].Nam+'-'+this.state.dataHop[0].Thang+'-'+this.state.dataHop[0].Ngay+'T'+this.state.dataHop[0].Gio+':00.000Z',
          // endDate: this.state.dataHop[0].NamK+'-'+this.state.dataHop[0].ThangK+'-'+this.state.dataHop[0].NgayK+'T'+this.state.dataHop[0].GioK+':00.000Z',
          alarms: [{
            date: -30 // or absolute date - iOS Only
          }]
        })
          .then(id => {
            Alert.alert(
              'Thông báo',
              'Đã lưu vào lịch của bạn',
              [
                { text: 'OK', onPress: () => console.log('OK Pressed' + id) },
              ],
              { cancelable: false }
            )
          })
          .catch(error => {
            Alert.alert(
              'Thông báo',
              'Vui lòng khởi động lại ứng dụng',
              [
                { text: 'OK', onPress: () => console.log('____OK___ ' + error) },
              ],
              { cancelable: false }
            )
          })
      }, 200);

    })

  }
  render() {
    const { navigate, goBack } = this.props.navigation;
    const viewthanhphan = (
      <ScrollView>
        <FlatList
          data={this.state.dataDV}
          renderItem={({ item, index }) =>
            <View style={[st.bao, { borderBottomWidth: this.state.dataDV.length - 1 == index ? 0 : 0.5 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={[st.icon, { tintColor: colors.tangerine }]} source={Images.icJoinHop} />
                <Text style={st.txct}>{item.Ten}</Text>
              </View>
            </View>
          }
        />
      </ScrollView>
    );


    const viewtailieu = (
      <ScrollView>
        <FlatList
          data={this.state.dataFile}
          renderItem={({ item, index }) => {
            return (
              <View style={[st.bao, { borderBottomWidth: this.state.dataFile.length - 1 == index ? 0 : 0.5 }]}>
                <TouchableOpacity onPress={this.taifile.bind(this, item.ID)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Image style={[st.icon, { tintColor: colors.tangerine }]} source={Images.icTaiLieuHKG} />
                    <Text style={[st.txct, { flex: 1 }]}>{item.FileTL}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )
          }

          }
        />
      </ScrollView>
    );
    const mainJSX = this.state.viewtp ? viewthanhphan : viewtailieu;

    console.log("<><><><><><><><>dataHop:", this.state.dataHop)
    return (
      <View style={{ flex: 1 }}>
        <HeaderHKG
          onPressLeft={() => this.state.isCheck == 1 ? goBack() : Utils.navigate('SearchHKG')}
          title={'Chi tiết cuộc họp'}
          iconLeft={Images.icBack}
        />

        <View style={st.container}>
          <ScrollView style={{ flex: 1 }}>
            <View style={st.ngoai}>

              <View style={{ flex: 1, margin: 10 }}>
                {this.state.dataHop.map((item, key) => {
                  return (<View key={key} style={{
                    // backgroundColor: '#F0A14D',
                    width: "100%",
                    borderRadius: 10,
                    //  borderBottomRightRadius: 2,
                    alignItems: 'center',
                    borderWidth: 0.5, borderColor: colors.black_30,
                    flex: 1
                  }}>
                    <View style={{
                      width: '100%', borderRadius: 0, backgroundColor: colors.coral, borderTopRightRadius: 10,
                      borderTopLeftRadius: 10,
                    }}>
                      <Text style={{
                        color: colors.white, fontWeight: 'bold',
                        textAlign: 'center', marginTop: 7
                      }}>{item.Gio}</Text>
                      <Text style={{
                        color: colors.white, fontWeight: 'bold',
                        textAlign: 'center', fontSize: 20,
                      }}>{item.Thu == 1 ? 'Chủ nhật' : 'Thứ ' + item.Thu} </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 7 }} >
                        <Text style={{
                          color: colors.white, fontWeight: 'bold',
                          textAlign: 'center', fontSize: 17
                        }}>{item.Ngay}</Text>
                        <Text style={{
                          color: colors.white, fontWeight: 'bold',
                          textAlign: 'center', fontSize: 12
                        }}>Tháng</Text>
                        <Text style={{
                          color: colors.white, fontWeight: 'bold',
                          textAlign: 'center', fontSize: 17
                        }}>{item.Thang}</Text>
                      </View>
                      <TouchableOpacity style={[st.btluuh, { padding: 10, }]} onPress={this.baohop.bind(this)} >
                        <Image style={[nstyles.nIcon35, { tintColor: colors.tangerine, marginLeft: 3, alignSelf: 'center', transform: [{ rotate: '30deg' }] }]} source={Images.icNotify} />
                      </TouchableOpacity>
                    </View>
                    {/* <View style={{ height: 3, backgroundColor: colors.white, width: '50%' }}></View> */}
                    <View style={{
                      flex: 1,
                      // backgroundColor: 'white',
                      width: '100%',
                    }} >
                      <ImageBackground source={require('../../assets/HKG/TrongDong1.png')} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3 }}></ImageBackground>
                      <View style={{ flex: 1, }} >
                        <View style={{ paddingVertical: 10, alignItems: 'center', paddingHorizontal: 10 }}>
                          <Text style={{
                            fontWeight: 'bold',
                            color: colors.turquoiseBlue, fontSize: 20, textAlign: 'center'
                          }}>{item.TenCH}</Text>
                        </View>
                        <View style={st.bao}>
                          <View style={st.bt}>
                          </View>
                          <View style={st.bct}>
                            <View style={st.ct}>
                              <View style={[st.ct2, { marginTop: 10 }]}>
                                <View style={st.ct3}>
                                  <Text style={st.txct}>Giờ họp: <Text style={{ fontWeight: 'bold' }}>{item.Gio}</Text> </Text>
                                  <Text style={st.txct}>Loại hình họp: <Text style={{ fontWeight: 'bold' }}>{item.TenLHH}</Text></Text>
                                </View>
                                <View style={st.ct3}>
                                  <Text style={st.txct}>Lĩnh vực họp:  <Text style={{ fontWeight: 'bold' }}>{item.TenLV}</Text></Text>
                                  <Text style={st.txct}>Hình thức họp:  <Text style={{ fontWeight: 'bold' }}>{item.TenHT}</Text></Text>
                                </View>
                              </View>
                              <View style={{}}>
                                <Text style={st.txct}>Địa điểm họp:  <Text style={{ fontWeight: 'bold' }}>{item.DDHop}</Text></Text>
                                <Text style={st.txct}>Trạng thái: <Text style={{ color: getColorItem(item), fontWeight: 'bold' }} >{item.TrangThai}</Text> </Text>
                                <Text style={[st.txnd, { marginTop: 10, marginBottom: 5, color: '#F0A14D', }]}> Nội dung cuộc họp</Text>
                                <Text style={[st.txct,]}> <Text style={{ fontWeight: 'bold' }}>{item.NoiDung}</Text></Text>
                              </View>
                              <View style={[st.ct4]}>
                                <TouchableOpacity style={st.tou} onPress={this._BamTP.bind(this)}>
                                  <Text style={[st.txna, (this.state.active === 'TaiLieu' ? st.activetxna : this.state.active === 'YKien' ? st.activetxna : {})]}>Thành phần</Text>
                                </TouchableOpacity >
                                <TouchableOpacity style={st.tou} onPress={this._BamTL.bind(this)}>
                                  <Text style={[st.txna, (this.state.active === 'ThanhPhan' ? st.activetxna : this.state.active === 'YKien' ? st.activetxna : {})]}>Tài liệu</Text>
                                </TouchableOpacity >

                              </View>

                            </View>
                          </View>
                        </View>
                        {mainJSX}
                      </View>
                    </View>

                    <View style={{ paddingVertical: 10, backgroundColor: '#F0A14D', width: '100%', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} >
                      <Text style={{
                        color: colors.white, fontWeight: 'bold',
                        textAlign: 'center', fontSize: 18
                      }}>{item.Nam}</Text>
                    </View>
                  </View>)

                })}
              </View>
              {/* {mainJSX}        */}
            </View>
          </ScrollView>
        </View>
        <IsLoading ref={this.refLoading} />

      </View >
    );
  }
}

const st = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    width: 25,
    height: 25
  },
  bao: {
    flexDirection: 'column',
    padding: 5,
    borderBottomWidth: 0.5
  },
  bct: {
    flexDirection: 'row',
  },
  bt: {
    flexDirection: 'row',
  },
  nd: {
    flex: 1,
    marginLeft: 0,
  },
  td: {
    fontWeight: '700',
    color: colors.colorTextSelect,
    textAlign: 'center'
  },
  bn: {
    marginTop: 2
  },
  thu: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden',
    height: 20,
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
  ct: {
    marginTop: 0,
    flexDirection: 'column',
    flex: 1
  },
  ct2: {
    flexDirection: 'row',

  },
  ct3: {
    flex: 2,
  },
  ct4: {
    flexDirection: 'row',
  },
  txct: {
    marginLeft: 5,
    marginTop: 5,
    color: 'black',
    fontSize: 13
  },
  txnd: {
    marginTop: 5,
    paddingTop: 2,
    paddingBottom: 2,
    paddingVertical: 7,
    paddingLeft: 5,
    fontWeight: 'bold',
    fontSize: 15,
    color: 'black',
    backgroundColor: 'rgba(244,208,171,0.4)',
  },
  ngoai: {
    flexDirection: 'column',
    flex: 1
  },
  txna: {
    textAlign: 'center',
    padding: 5,
    color: 'white',
    backgroundColor: '#F0A14D',
    marginLeft: 1,
    marginRight: 1,
    paddingVertical: 10,
    fontWeight: 'bold'
  },
  activetxna: {
    textAlign: 'center',
    paddingVertical: 10,
    padding: 5,
    color: 'white',
    flex: 1,
    backgroundColor: '#F5D0A9',
    marginLeft: 1,
    marginRight: 1,
  },
  txnn: {
    textAlign: 'center',
    padding: 5,
    color: 'white',
    flex: 1,
    backgroundColor: '#ec6060',
    marginLeft: 1,
    marginRight: 1,
  },
  tou: {
    flex: 1,
    marginTop: 5,
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
  icon_alarm: {
    height: 55,
    width: 55,
  },
  btluuh: {

    position: 'absolute',
    right: 20,
    top: 10,
    backgroundColor: colors.white,
    borderRadius: 100,
    // height: 55,
    // width: 55,
    // borderRadius: 30

  },
  submit: {
    marginRight: 50,
    marginLeft: 50,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#ff0000',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#fff',
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
  },
  txndsubmit: {
    marginTop: 8,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    fontWeight: 'bold',
    color: 'black',
    backgroundColor: '#80ceff'
  },
});
