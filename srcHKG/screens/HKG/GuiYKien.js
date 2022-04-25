import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,Platform,
  TouchableOpacity,SafeAreaView
} from 'react-native';
import { Container, Textarea, Content, Form, Item, Input, Label, Button, Icon} from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';

export default class GuiYKien extends Component {
  static navigationOptions = {
      header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      hoten: null,
      diachi: null,
      dienthoai: null,
      email: null,
      tieude: null,
      noidung:null
    };
  }
  componentDidMount() {
  }
  pickSingle(cropit, circular=false, mediaType) {
    ImagePicker.openPicker({
      cropping: cropit,
      cropperCircleOverlay: circular,
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
    }).then(image => {
      this.setState({
        file: image
      });
    }).catch(e => {
      console.log(e);
    });
  }
  handleUploadPhoto = () => {
    const data = new FormData();
    data.append('hoten', this.state.hoten); // you can append anyone.
    data.append('diachi', this.state.diachi);
    data.append('sdt', this.state.dienthoai);
    data.append('email', this.state.email);
    data.append('tieude', this.state.tieude);
    data.append('noidung', this.state.noidung);
    if(this.state.file != null){
      data.append('filedinhkem', {
      name: this.state.file.filename,
      type:  this.state.file.mime, // or photo.type
      uri:
        Platform.OS === "android" ? this.state.file.path : this.state.file.path.replace("file://", "")
      });
    }
    fetch(`https://hoidap.tayninh.gov.vn/HoiDapTrucTuyenServices.asmx/DatCauHoi`, {
    method: 'post',
    body: data
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.trangthai === "thanhcong"){
        Alert.alert(
          'Thông báo',
          'Bạn đã gửi câu hỏi thành công',
          [
            { text: 'OK', onPress: () => this.props.navigation.navigate('HoiDap') },
          ]
        );
      } else {
        Alert.alert(
          'Thông báo',
          'Có lỗi trong quá trình xử lý',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ]
        );
      }
    })
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
		<SafeAreaView style={st.container}>
      <View style={st.thanh1}>
				<View style={{ width: 35, height: 35, justifyContent: 'center',zIndex:1}}>
				  <TouchableOpacity onPress={() => navigate('HoiDap')}>
					<Image style={st.icon_menu} source={require('../../assets/HKG/back.png')} />
				  </TouchableOpacity>					
				</View>
				<View style={{marginTop:6,flex:1}}>
					<Text style={{textAlign:'center',fontSize:16,color:'white',fontWeight:'bold',marginLeft:-35,zIndex:0}}>Đặt câu hỏi</Text>
				</View>
			</View>
			<Container>
        <Content>
          <Form style={{paddingLeft:0,paddingRight:10,paddingBottom:10}}>
            <Item floatingLabel>
              <Label style={st.lbtxt}>Cá nhân/Tổ chức</Label>
              <Input value={this.state.hoten} onChangeText={text => this.setState({ hoten: text })}/>
            </Item>
            <Item floatingLabel>
              <Label style={st.lbtxt}>Địa chỉ</Label>
              <Input value={this.state.diachi} onChangeText={text => this.setState({ diachi: text })}/>
            </Item>
            <Item floatingLabel>
              <Label style={st.lbtxt}>Điện thoại</Label>
              <Input value={this.state.dienthoai} onChangeText={text => this.setState({ dienthoai: text })}/>
            </Item>
            <Item floatingLabel>
              <Label style={st.lbtxt}>Email</Label>
              <Input value={this.state.email} onChangeText={text => this.setState({ email: text })}/>
            </Item>
            <Item floatingLabel> 
              <Label style={st.lbtxt}>Tiêu đề câu hỏi</Label>
              <Input value={this.state.tieude} onChangeText={text => this.setState({ tieude: text })}/>
            </Item>
            <Textarea rowSpan={8} bordered placeholder="Nội dung câu hỏi" style={{fontSize:14,marginLeft:15}} value={this.state.noidung} onChangeText={text => this.setState({ noidung: text })}/>               
            <Button iconLeft transparent primary onPress={() => this.pickSingle(false)}>
              <Icon name='camera' />
              <Text style={{fontSize:14,marginLeft:10}}>{this.state.file !== null ? this.state.file.filename :'Đính kèm file'}</Text>
            </Button>         
            <Button block last style={{marginTop:5,marginLeft:15}} onPress={() => this.handleUploadPhoto()}>
              <Text style={{color:'white'}}>Gửi câu hỏi</Text>
            </Button>
          </Form>
        </Content>
      </Container>      
		</SafeAreaView>
    );
  }

}
const st = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ededed'
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
    padding: 5,
    marginBottom: 5,
    backgroundColor: 'white'
  },
  thanh1: {
		backgroundColor: '#3771c3',
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
  lbtxt: {
    fontSize: 14
  }
});
