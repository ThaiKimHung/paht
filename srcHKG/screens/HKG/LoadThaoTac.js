import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, StatusBar,TouchableOpacity,Image, Text,FlatList,RefreshControl,Linking} from 'react-native';
import { 
    Container, 
    Content, 
    Icon, 
    Thumbnail, 
    Header, 
    Title, 
    Left, 
    Right, 
    Body, 
    Spinner 
  } from 'native-base';
  import { Card, CardItem, Button,Toast } from 'native-base';

class LoadThaoTac extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idkey:null,
      idtieuchi: null,
      tailieu:[],
    };
  }

  componentDidMount(){
    this.setState({idtieuchi: this.props.idtieuchi})
  }
  componentDidUpdate(){

  }

  toggleCheck1() {
    this.setState({ idtieuchi: 1 },function (){
      console.log("id tieu chi da chon: "+this.state.idtieuchi )
    });
  }
  toggleCheck2() {
    this.setState({ idtieuchi: 2 },function (){
      console.log("id tieu chi da chon: "+this.state.idtieuchi )
    });
  }
  toggleCheck3() {
    this.setState({ idtieuchi: 3 },function (){
      console.log("id tieu chi da chon: "+this.state.idtieuchi )
    });
  }

  render() {
    let value = null;
    let valuetl = null;
    if (this.state.idtieuchi != null) {
      value = this.state.idtieuchi;
    }else{
      value = null;
    }
    if (!this.state.tailieu) {
        valuetl = this.state.tailieu;
      }else{
        valuetl = null;
    }
    return (
        <Left style={{flex:8}}>
        <Button transparent onPress={() =>{this.props.CheckDongY(value);this.toggleCheck1();}}>
          <Icon name='ios-thumbs-up' style={[styles.list, (this.state.idtieuchi === 1 ? styles.selected : styles.list)]}/> 
          <Text>Đồng Ý</Text>
        </Button>
        <Button transparent onPress={() => {this.props.CheckKhongDongY(value),this.toggleCheck2();}}>
          <Icon name='ios-thumbs-down' style={[styles.list, (this.state.idtieuchi === 2 ? styles.selected : styles.list)]}/>
          <Text>Phản đối</Text>
        </Button>
        <Button transparent  onPress={()=>{this.props.setkeyselect(value,valuetl);this.props.showDialog(true),this.toggleCheck3();}}>
          <Icon name='ios-chatbubbles' style={[styles.list, (this.state.idtieuchi === 3 ? styles.selected : styles.list)]} />
          <Text>Ý kiến khác</Text>
        </Button>
        </Left>
    );
  }
}

const styles = StyleSheet.create({
    selected: { color:'red', marginRight: 5 },
    list: { color:'black', marginRight: 5 },
  });
export default LoadThaoTac;