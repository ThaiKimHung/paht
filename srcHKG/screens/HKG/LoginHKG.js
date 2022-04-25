import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,SafeAreaView,Platform
} from 'react-native';
// import { BackHandler, DeviceEventEmitter } from 'react-native'
import getToken from '../../api/getToken';
import checkTokenHKG from '../../api/checkTokenHKG';
import DefaultPreference from 'react-native-default-preference';
import checkDangnhap from '../../api/checkDangnhapHKG';
import saveToken from '../../api/saveToken';
import FCM from "react-native-fcm";
import RNRestart from 'react-native-restart';

var tkp = '';
DefaultPreference.get('ToKenPush').then(function(value) {
  tkp = value;          
});

const { width } = Dimensions.get('window');
export default class LoginHKG extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      tk: '',
      mk: '',
      tendv: '',
      fcm_token: ''
    };
    // this.onBackPress = this.onBackPress.bind(this);
}


// componentWillMount() {
//     BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
// }
// componentWillUnmount(){
//     BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
// }
// onBackPress(){
//     this.props.navigation.navigate('Home', {islogin: false})
//     return true;
// }
componentDidMount() {
  if (Platform.OS != "android") {
    if(tkp == null){
      Alert.alert(
        'Thông báo',
        'Ứng dụng sẽ khởi động lại để cập nhật dữ liệu',
        [
          { text: 'OK', onPress: () => RNRestart.Restart() },
        ]
      );
    }
  }
  getToken('hkg')
    .then(token => checkTokenHKG(token))
    .then(res => {
      this.setState({ tendv: res.tendv });
    })
    .catch(err => console.log('LOI CHECK lỗi __________', err));
    Platform.OS === "android" ?FCM.requestPermissions():null;
    Platform.OS === "android" ?FCM.getFCMToken().then(token => {
      this.setState({fcm_token:token});
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.log(this.state.fcm_token);
      //update your fcm token on server.
    }):null;
}
onSignIn() {
  const { tk, mk, fcm_token} = this.state;
  checkDangnhap(tk, mk)
    .then(res => {   
      if (res.thongbao === 'dung') {         
        var paramsString = Platform.OS === "android" ? `token=${res.token}&tkp=${fcm_token}`: `token=${res.token}&tkp=${tkp}`;

        url = 'https://hkg.tayninh.gov.vn/services/WebService.asmx/luutkp';
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: paramsString
        })
        saveToken('hkg',res.token);
        this.props.navigation.navigate('HomeHKG',{islogin: true});
      } else {
        Alert.alert(
          'Thông báo',
          'Sai thông tin đăng nhập',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ]
        );
      }
    })
    .then()
    .catch(err => { console.log('Lỗi'); console.log(err); });
}
  render() {
    const { navigate } = this.props.navigation;
    return (
      <SafeAreaView style={{flex:1}}>
      <View style={styles.thanh1}>
          <View style={{ width: 35, height: 35, justifyContent: 'center',zIndex:1 }}>
            <TouchableOpacity onPress={() => navigate('Home')}>
              <Image style={styles.icon_menu} source={require('../../assets/HKG/back.png')} />
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 6, flex: 1 }}>
            <Text style={{ textAlign: 'center', fontSize: 16, color: 'white', fontWeight: 'bold',marginLeft:-35,zIndex:0 }}>Đăng nhập</Text> 
          </View>
        </View>
        <View style={styles.container} >
			<View>
			  <View style={{marginTop:20, alignItems:'center'}}>
			  <Image
				source={require('../../assets/HKG/logotayninh.png')}
				style={[styles.icon]}
			  />
			  </View>
			  <View style={styles.header}>
				<Text style={{ color: 'blue', fontSize: 11, fontWeight: 'bold' }}>{this.state.tendv}</Text>
				<Text style={{ color: 'blue', fontSize: 11, fontWeight: 'bold' }}>HỆ THỐNG THÔNG TIN ĐIỀU HÀNH - HỌP KHÔNG GIẤY </Text>
			  </View>
			</View>
			<View style={{ justifyContent: 'space-between', flex: 2 }}>
			  <View style={{ alignItems: 'center', marginTop: 25 }}>
				{/* <Text>Tên Đăng nhập</Text> */}
				<TextInput
				  style={styles.inputStyle}
				  placeholder="Nhập tên tài khoản"
				  underlineColorAndroid="transparent"
				  value={this.state.tk}
				  onChangeText={text => this.setState({ tk: text })}
				//secureTextEntry
				/>
				{/* <Text>Mật khẩu</Text> */}
				<TextInput
				  style={styles.inputStyle}
				  placeholder="Nhập mật khẩu"
				  underlineColorAndroid="transparent"
				  value={this.state.mk}
				  onChangeText={text => this.setState({ mk: text })}
				  secureTextEntry
				/>
				<TouchableOpacity style={styles.bigButton} onPress={this.onSignIn.bind(this)}>
				  <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
				</TouchableOpacity>
			  </View>
			  <View style={styles.footer}>
				<Text></Text>
				<Text></Text>
			  </View>
			</View>
        </View >

      </SafeAreaView >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
  },
  icon: {
    // justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: 140,
	paddingTop: 15
  },
  header:
  {
    marginTop: 25,
    alignItems: 'center',
  },
  footer: {
    //flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  inputStyle: {
    height: 50,
    width: (width / 10) * 8,
    marginHorizontal: 1,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 20,
    paddingLeft: 30
  },
  bigButton: {
    height: 50,
    borderRadius: 20,
    width: 200,
    backgroundColor: '#ea321a',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '400'
  },
  thanh1: {
		backgroundColor: 'red',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop:5,
	},
	icon_menu: {
		width: 30,
		height: 30,
		marginBottom: 5,
		marginRight: 10,
		marginLeft: 5,
	},
  footer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
