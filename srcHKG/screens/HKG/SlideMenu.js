import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,SafeAreaView
} from 'react-native';

import global from '../global';
import saveToken from '../api/saveToken';
import getToken from '../api/getToken';
import checkToken from '../api/checkToken';
import checkThongBao from '../api/checkThongBao';

export function isJson(str) {
  if (str === 'True') { return true; }
  return false;
}
export default class SlideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      id: false,
      active: 'Home',
      config: false,
      tendv: ''
    };
    global.onSignIn = this.onSignIn.bind(this);
    global.activescreen = this.resActive.bind(this);
  }
  componentDidMount() {
    getToken('hkg')
    .then(token => checkToken(token))
      .then(res => {
        if (res.thongbao === 'dung') {
          global.onSignIn(res);
          console.log('Kiem tra lai token dang nhap');
          console.log(res);
        }
        this.setState({ tendv: res.tendv });
      })
    .catch(err => console.log('LOI CHECK LOGIN', err)); 
  }
  SetSwitch(value) {
    this.setState({
      config: value
    });
    getToken('hkg')
    .then(token => checkThongBao(token, this.state.config ? '1' : '0'))
    .then(res => { 
      console.log(res);  
      if (res.thongbao === 'thanhcong') {
        console.log('__________________');
        console.log('dang ky thanh cong');
      }
    }).catch(err => { console.log('Lỗi'); console.log(err); });
}
  onSignIn(id) {
    this.setState({ id });
    console.log('+++++++++++');
    console.log(id);
    this.setState({ config: isJson(id.tb) });
  }
  onSignOut() {
    getToken()
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
    this.setState({ id: false });
    this.setState({ active: 'Home' });
    saveToken('');
    this.props.navigation.navigate('Home', {islogin: false});
    console.log('+++++++++++');
    console.log();
  }
  resActive(active) {
    this.setState({ active });
    console.log('___+++ Man Hinh Hien tai +++___');
    console.log(active);
  }
  render() {
    const { id } = this.state;
    const { navigate } = this.props.navigation;
    const viewbtnLogin = (
      <View style={{marginTop: 50}}>
      <TouchableOpacity style={[styles.btnSignInStyle, (this.state.active === 'Login' ? styles.active : {})]} onPress={() => { navigate('Login'); global.activescreen('Login'); }} >
        <Image style={styles.icon} source={require('../resources/icons-login.png')} />
        <Text style={styles.btnTextSignIn}>Đăng nhập</Text>
      </TouchableOpacity>
      </View>
    );
    const viewbtnUser = (
      <View style={{marginTop: 20}}>
        <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', }}>{id ? id.Ten : ''}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10 }}>
          <Switch
            value={this.state.config}
            onValueChange={(value) => this.SetSwitch(value)}
          />
          <Text>{this.state.config ? 'Tắt thông báo SMS' : 'Bật thông báo SMS'}</Text>
        </View>
        <TouchableOpacity style={[styles.btnSignInStyle, (this.state.active === 'ChangePassword' ? styles.active : {})]} onPress={() => { navigate('ChangePassword'); global.activescreen('ChangePassword'); }}>
        <Image style={styles.icon} source={require('../resources/icons-password.png')} />
        <Text style={styles.btnTextSignIn}>Đổi mật khẩu</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnSignInStyle} onPress={this.onSignOut.bind(this)}>
        <Image style={styles.icon} source={require('../resources/icons-logout-rounded-up.png')} />
        <Text style={styles.btnTextSignIn}>Thoát</Text>
      </TouchableOpacity>
      </View>
    );
    const mainJSX = this.state.id ? viewbtnUser : viewbtnLogin;
    return (
      <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Image
            source={{url:'https://hkg.tayninh.gov.vn/images/logo.png'}}
            style={styles.profile}
          />
          <Text style={{ color: 'blue', fontSize: 8.5, fontWeight: 'bold' }}>{this.state.tendv}</Text>
          <Text style={{ color: 'blue', fontSize: 8.5, fontWeight: 'bold' }}>HỆ THỐNG THÔNG TIN ĐIỀU HÀNH - HỌP KHÔNG GIẤY </Text>
        </View>
        <View style={styles.loginContainer}>
            {mainJSX}
          <ScrollView>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={[styles.btnSignInStyle, (this.state.active === 'Home' ? styles.active : {})]} onPress={() => { navigate('Home'); global.activescreen('Home'); }}>
              <Image style={styles.icon} source={require('../resources/icons-home.png')} />
              <Text style={styles.btnTextSignIn}>Trang chủ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnSignInStyle, (this.state.active === 'MeetingSchedule' ? styles.active : {})]} onPress={() => { navigate('MeetingSchedule',{ idtv: this.state.id ? this.state.id.id: '' }); global.activescreen('MeetingSchedule'); }}>
              <Image style={styles.icon} source={require('../resources/hop-nen.png')} />
              <Text style={styles.btnTextSignIn}>Lịch họp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnSignInStyle, (this.state.active === 'LichCongTac' ? styles.active : {})]} onPress={() => { navigate('LichCongTac',{ idtv: this.state.id ? this.state.id.id: '' }); global.activescreen('LichCongTac'); }}>
              <Image style={styles.icon} source={require('../resources/icons-calendar.png')} />
              <Text style={styles.btnTextSignIn}>Lịch công tác</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnSignInStyle, (this.state.active === 'DayMeeting' ? styles.active : {})]} onPress={() => { navigate('DayMeeting',{ idtv: this.state.id ? this.state.id.id: '' }); global.activescreen('DayMeeting'); }}>
              <Image style={styles.icon} source={require('../resources/icons8-today.png')} />
              <Text style={styles.btnTextSignIn}>Cuộc họp trong ngày</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnSignInStyle, (this.state.active === 'Search' ? styles.active : {})]} onPress={() => { navigate('Search',{ idtv: this.state.id ? this.state.id.id: '' }); global.activescreen('Search'); }}>
              <Image style={styles.icon} source={require('../resources/icons8-new.png')} />
              <Text style={styles.btnTextSignIn}>Tất cả cuộc họp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnSignInStyle, (this.state.active === 'ThongBao' ? styles.active : {})]} onPress={() => { navigate('ThongBao',{ idtv: this.state.id ? this.state.id.id: '' }); global.activescreen('ThongBao'); }}>
              <Image style={styles.icon} source={require('../resources/icons8-checklist.png')} />
              <Text style={styles.btnTextSignIn}>Thông báo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnSignInStyle, (this.state.active === 'Contact' ? styles.active : {})]} onPress={() => { navigate('Contact'); global.activescreen('Contact'); }}>
              <Image style={styles.icon} source={require('../resources/icons-contact.png')} />
              <Text style={styles.btnTextSignIn}>Liên hệ</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1D7E6',
    borderColor: '#fff',
    alignItems: 'center'
  },
  profile: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 8
  },
  btnStyle: {
    height: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 70
  },
  btnText: {
    color: '#183883',
    fontFamily: 'Avenir',
    fontSize: 20
  },
  btnSignInStyle: {
    flexDirection: 'row',
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 5,
    width: 200,
    marginBottom: 10,
    //justifyContent: 'space-between',
    paddingLeft: 10,
    alignItems: 'center'
  },
  active: {
    flexDirection: 'row',
    height: 30,
    backgroundColor: '#507ADE',
    borderRadius: 5,
    width: 200,
    marginBottom: 10,
    //justifyContent: 'space-between',
    paddingLeft: 10,
    alignItems: 'center'
  },
  btnTextSignIn: {
    color: '#183883',
    fontSize: 15,
    textAlign: 'center',
    marginLeft: 15
  },
  loginContainer: {
    flex: 3,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  topContainer: {
    flex: 1,
    alignItems: 'center'
  },
  menuContainer: {
    marginTop: 30,
    flex: 1,
    alignItems: 'center'
  },
  btnContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  username: {
    color: '#fff',
    fontFamily: 'Avenir',
    fontSize: 15,
  },
  icon: {
    width: 25,
    height: 25,
  }
});

AppRegistry.registerComponent('menu', () => SlideMenu);
