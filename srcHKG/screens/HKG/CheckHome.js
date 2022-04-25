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
import {Spinner,Container,Header,Content,Left,Right,Body,Icon} from 'native-base';
import getToken from '../../api/getToken';
import checkTokenHKG from '../../api/checkTokenHKG';
import DefaultPreference from 'react-native-default-preference';
import checkDangnhap from '../../api/checkDangnhapHKG';
import saveToken from '../../api/saveToken';
import HomeHKG from './HomeHKG';
import LoginHKG from './LoginHKG';
var tkp = '';
DefaultPreference.get('ToKenPush').then(function(value) {
  tkp = value;          
});

const { width } = Dimensions.get('window');
export default class CheckHome extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      islogin: false,
    };
    // this.cheklogin();
}
componentDidMount() {
    getToken('hkg')
    .then(token => {
      if (token.length > 0) {
        console.log('OK có tookent');
        this.props.navigation.navigate('HomeHKG', {islogin: true})
      }else{
        console.log('OK méo có tokent');
        this.props.navigation.navigate('LoginHKG', {islogin: false})
      }
    })
}
onSignIn() {
  const { tk, mk } = this.state;
  checkDangnhap(tk, mk)
    .then(res => {   
      if (res.thongbao === 'dung') {         
        var paramsString = `token=${res.token}&tkp=${tkp}`;
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
    return (
      <Container>
      <Header hasTabs style={styles.header}>

      </Header>
      <Content>
        <Spinner/>
      </Content>
    </Container>
    )
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#0E4AA3",
    height:40,
    justifyContent: 'center',
    paddingTop:0.1   
  },
});
