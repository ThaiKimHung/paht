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
  Alert,SafeAreaView
} from 'react-native';
import getToken from '../../api/getToken';
import checkToken from '../../api/checkTokenHKG';

const { width } = Dimensions.get('window');
export default class ChangePasswordHKG extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      mkc: '',
      mkm1: '',
      mkm2: '',
      tendv: ''
    };
  }
  static navigationOptions = {
    drawerLabel: 'Đổi mật khẩu',
    // drawerIcon: () => (
    //   <Image
    //     source={require('./notif-icon.png')}
    //   />
    // ),
  };
  componentDidMount() {
    getToken('hkg')
      .then(token => checkToken(token))
      .then(res => {
        this.setState({ tendv: res.tendv });
      })
      .catch(err => console.log('LOI CHECK lỗi __________', err));
  }
  chpas() {
    if (this.state.mkm1 != this.state.mkm2) {
      Alert.alert(
        'Thông báo',
        'Nhập lại mật khẩu mới không đúng',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
    } else {
      getToken('hkg')
        .then(token => {
          var paramsString = "token=" + token + "&mkc=" + this.state.mkc + "&mkm=" + this.state.mkm1;
          fetch("https://hkg.tayninh.gov.vn/services/WebService.asmx/doimatkhau", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: paramsString
          })
            .then((response) => response.json())
            .then((responseJson) => {
              console.log(responseJson);
              if (responseJson.thongbao == '') {
                Alert.alert(
                  'Thông báo',
                  'Thay đổi mật khẩu thành công',
                  [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                  ],
                  { cancelable: false }
                );
                this.props.navigation.navigate('Home');
              } else {
                Alert.alert(
                  'Thông báo',
                  'Mật khẩu hiện tại không đúng',
                  [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                  ],
                  { cancelable: false }
                )
              }
            })
            .catch(err => console.log('LOI ', err));
        })
    }
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.thanh1}>
          <View style={{ width: 35, height: 35, justifyContent: 'center',zIndex:1}}>
            <TouchableOpacity onPress={() => navigate('HomeHKG')}>
              <Image style={styles.icon_menu} source={require('../../assets/HKG/back.png')} />
            </TouchableOpacity>
          </View>
          <View style={{marginTop:6,flex:1}}>
            <Text style={{textAlign:'center',fontSize:16,color:'white',fontWeight:'bold',marginLeft:-35,zIndex:0}}>Thay đổi mật khẩu</Text>
          </View>
        </View>
        <View style={styles.container} >
          <View style={styles.container}>
            <Image
              source={require('../../assets/HKG/logotayninh.png')}
              style={[styles.icon]}
            />
            <View style={styles.header}>
              <Text style={{ color: 'blue', fontSize: 11, fontWeight: 'bold' }}>{this.state.tendv}</Text>
              <Text style={{ color: 'blue', fontSize: 11, fontWeight: 'bold' }}>HỆ THỐNG THÔNG TIN ĐIỀU HÀNH - HỌP KHÔNG GIẤY </Text>
            </View>
          </View>
          <View style={{ justifyContent: 'space-between', flex: 2 }}>
            <View style={{ alignItems: 'center', marginTop: 25 }}>
              <TextInput
                style={styles.inputStyle}
                placeholder="Mật khẩu hiện tại"
                secureTextEntry
                underlineColorAndroid="transparent"
                onChangeText={text => this.setState({ mkc: text })}
              />
              <TextInput
                style={styles.inputStyle}
                placeholder="Mật khẩu mới"
                secureTextEntry
                underlineColorAndroid="transparent"
                onChangeText={text => this.setState({ mkm1: text })}
              />
              <TextInput
                style={styles.inputStyle}
                placeholder="Nhập lại mật khẩu mới"
                secureTextEntry
                underlineColorAndroid="transparent"
                onChangeText={text => this.setState({ mkm2: text })}
              />
              <TouchableOpacity style={styles.bigButton} onPress={this.chpas.bind(this)}>
                <Text style={styles.buttonText}>ĐỔI MẬT KHẨU</Text>
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
    marginTop: 5
  },
  icon: {
    // justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 150,
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
