import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert, SafeAreaView, ImageBackground
} from 'react-native';
// import { Icon} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import getToken from '../../api/getToken';
import checkToken from '../../api/checkTokenHKG';
import saveToken from '../../api/saveToken';
import { ConfigScreen } from '../../navigation';
import HeaderHKG from '../Component/HeaderHKG';
import { Images } from '../../../src/images';

import Utils from '../../../app/Utils';
import { appConfig } from '../../../app/Config';
export default class HomeHKG extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      tb: 0,
      id: '',
      modalVisible: false,
    };
  }
  async componentDidMount() {
    // await saveToken('hkg', 'lPboAIZC6kP7XsgMmqBzPL3G2iCX6yoaMYNn7M2jHwmQQyFVa5')
    //get thong tin dang nhap
    setTimeout(() => {

      getToken('hkg')
        .then(token => {
          if (token.length > 0) {
            var paramsString = "token=" + token;
            // url = `https://hkg.tayninh.gov.vn/services/WebService.asmx/dshopmoi`;
            url = appConfig.domain + `api/hop-khong-giay/dshopmoi`;
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
                responseJson = responseJson.data
                this.setState({ tb: responseJson.length })
              })
              .catch((err) => {
                console.log(err);
              });
          }
          checkToken(token)
            .then(res => {
              Utils.nlog("thông tin user --------res", res)
              if (res.status === 1) {
                res = res.data
                //global.onSignIn(res);
                this.setState(previousState => {
                  return { id: res };
                });
                // this.setState({ id: res });
              } else {
                this.setState(previousState => {
                  return { id: false };
                });
              }
              this.setState({ tendv: res.tendv });
            })
            .catch(err => console.log('LOI CHECK lỗi __________', err));
        })
    }, 100);
  }
  componentWillReceiveProps() {
    getToken('hkg')
      .then(token => checkToken(token))
      .then(res => {

        if (res.thongbao === 'dung') {
          this.setState(previousState => {
            return { id: res };
          });
        } else {
          this.setState(previousState => {
            return { id: '' };
          });
        }
      })
      .catch(err => console.log('LOI CHECK lỗi __________', err));
  }
  onSignOut() {
    getToken('hkg')
      .then(token => {
        const paramsString = `token=${token}`;
        fetch('https://hkg.tayninh.gov.vn/services/WebService.asmx/deletetoken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: paramsString
        });
      })
      .catch(err => console.log('LOI xoa token', err));
    this.setState({ id: '' });
    this.setState({ active: 'Home' });
    this.setState({ modalVisible: false });
    saveToken('hkg', '');
    this.props.navigation.navigate('Home', { islogin: false });
    console.log('+++++++++++');
    console.log();
  }
  mo = () => {
    this.setState({ modalVisible: true });
  }
  doimk = () => {
    this.setState({ modalVisible: false });
    this.props.navigation.navigate('ChangePasswordHKG');
  }
  render() {
    const { id } = this.state;
    const { navigate } = this.props.navigation;
    const viewbtnLogin = (
      <View style={st.thanhphai}>
        <TouchableOpacity onPress={() => navigate('LoginHKG')}>
          <Image style={st.icon_thanh} source={require('../../assets/HKG/large-icon-user.png')} />
        </TouchableOpacity>
      </View>
    );
    const viewbtnUser = (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={this.mo}>
          <Text style={st.text_thanh}>{id ? id.Ten : ''}</Text>
        </TouchableOpacity>
      </View>
    );

    const mainJSX = this.state.id ? viewbtnUser : viewbtnLogin;
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground source={require('../../assets/HKG/TrongDong1.png')} style={{ position: 'absolute', top: 100, width: '100%', height: '100%', opacity: 0.5, }} />
        {/* <Modal isVisible={this.state.modalVisible} onBackdropPress={() => this.setState({ modalVisible: null })}>
          <View style={st.modalContent}>
            <TouchableOpacity onPress={this.doimk}>
              <View style={st.button}>
                <Text>Đổi mật khẩu</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onSignOut.bind(this)}>
              <View style={st.button}>
                <Text>Thoát</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal> */}
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View >
            {/* <View style={st.thanh1}>
              <View style={{ width: 35, height: 35, justifyContent: 'center', zIndex: 1 }}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
                  <Icon name="backburger" style={st.icon_menu} />
                </TouchableOpacity>
              </View>
              {mainJSX}
            </View> */}
            <HeaderHKG
              // onPressLeft={() => this.props.navigation.goBack(null)}
              onPressLeft={() => Utils.navigate('ManHinh_Home')}
              title={id ? id.Ten : ''}
              iconLeft={Images.icBack}
            />
            <View style={st.thanh2}>
              <Image style={st.icon_logo} source={require('../../assets/HKG/logotayninh.png')} />
            </View>
            <View style={[st.thanh3, { marginTop: 20 }]}>
              <Text style={{ color: '#F0A14D', fontSize: 15, fontWeight: 'bold' }}>{this.state.tendv}</Text>
            </View>
            <View style={[st.thanh2, { marginTop: 5 }]}>
              <Text style={{ color: '#F0A14D', fontSize: 13, fontWeight: 'bold' }}>HỆ THỐNG THÔNG TIN ĐIỀU HÀNH - HỌP KHÔNG GIẤY </Text>
            </View>
          </View>

          <View >
            <View style={st.thanh2}>
              <TouchableOpacity onPress={() => navigate(ConfigScreen.DSCuocHop, { idtv: id ? id.id : '' })}>
                <Image style={st.icon} source={require('../../assets/HKG/ctl.png')} />
                <Text style={st.textDS}>Danh Sách</Text>
                <Text style={st.textDS2}>Cuộc Họp</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigate(ConfigScreen.MeetingSchedule, { idtv: id ? id.id : '' })}>
                <Image style={st.icon} source={require('../../assets/HKG/hopp.png')} />
                <Text style={st.textDS2}>Lịch Họp</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigate(ConfigScreen.DayMeeting, { idtv: id ? id.id : '' })}>
                <Image style={st.icon} source={require('../../assets/HKG/icLich.png')} />
                <Text style={st.textDS}>Cuộc Họp</Text>
                <Text style={st.textDS}>Trong Ngày</Text>
              </TouchableOpacity>
            </View>
            <View style={st.thanh2} />
            <View style={st.thanh2}>
              <TouchableOpacity onPress={() => navigate(ConfigScreen.NewMeeting, { a: 's' })}>
                <Image style={st.icon} source={require('../../assets/HKG/user.png')} />
                <Text style={st.textDS}>Cuộc Họp Mới</Text>
                <Text style={st.tbnb}>{this.state.tb}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigate(ConfigScreen.ThongBao, { idtv: id ? id.id : '' })}>
                <Image style={st.icon} source={require('../../assets/HKG/thongbao.png')} />
                <Text style={st.textDS}>Thông Báo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigate(ConfigScreen.LichCongTac, { a: 's' })}>
                <Image style={st.icon} source={require('../../assets/HKG/calendaricon1.png')} />
                <Text style={st.textDS2}>Lịch Công Tác</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={st.thanh2}>
              <TouchableOpacity onPress={() => navigate('LayYKien', { a: 's' })}>
                <Image style={st.icon} source={require('../../assets/HKG/LayYKien.png')} />
                <Text style={st.textDS}>Lấy ý Kiến</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigate('ChuDeTraoDoi', { a: 's' })}>
                <Image style={st.icon} source={require('../../assets/HKG/chudetraodoi.png')} />
                <Text style={st.textDS}>Trao đổi</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image style={st.icon} source={require('../../assets/HKG/hdsd.png')} />
                <Text style={st.textDS}>Hướng dẫn sử dụng</Text>
              </TouchableOpacity>
            </View> */}
          </View>
          <View >
            <View style={st.footer}>
              <Text></Text>
              <Text></Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const st = StyleSheet.create({
  thanh1: {
    flexDirection: 'row',
    padding: 0,
    backgroundColor: 'red',
    // height: 55,
    justifyContent: 'space-between',
    paddingTop: 0,
  },
  thanhphai: {
    flexDirection: 'row',
    padding: 0,
    // backgroundColor: 'red',
    // borderBottomWidth: 1,
    // height: 55,
    justifyContent: 'flex-end',
  },
  thanhtrai: {
    // flexDirection: 'row',
    // padding: 0,
    // backgroundColor: 'red',
    // borderBottomWidth: 1,
    // height: 55,
    // justifyContent: 'flex-end',
  },
  thanh2: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 0,
  },
  thanh3: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 0,
    marginTop: 20
  },
  icon: {
    width: 70,
    height: 70,
    marginTop: 15,
    marginRight: 25,
    marginLeft: 25,
    marginBottom: 1,
    borderRadius: 10
  },
  icon_thanh: {
    width: 30,
    height: 30,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 3
  },
  text_thanh: {
    marginTop: 10,
    marginBottom: 8,
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: -35,
    zIndex: 0
  },
  icon_menu: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 3,
    color: 'white',
    fontSize: 30
  },
  icon_logo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 10,
    height: 150,
    width: 150,
  },
  textDS: {
    marginTop: 0,
    marginLeft: 0,
    color: '#F0A14D',
    fontWeight: 'bold',
    fontSize: 12,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  tbnb: {
    width: 20,
    height: 20,
    marginTop: -85,
    marginLeft: 75,
    color: 'white',
    backgroundColor: 'red',
    fontWeight: 'bold',
    fontSize: 10,
    borderRadius: 10,
    overflow: 'hidden',
    textAlign: 'center',
    paddingTop: 3,
  },
  textDS2: {
    marginTop: 0,
    marginLeft: 0,
    color: '#F0A14D',
    fontWeight: 'bold',
    fontSize: 12,
    justifyContent: 'center',
    textAlign: 'center'
  },
  footer: {
    marginTop: 0,
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});
