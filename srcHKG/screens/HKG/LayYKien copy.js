import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, StatusBar,TouchableOpacity,Image, Text,FlatList} from 'react-native';
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
  import { Card, CardItem, Button } from 'native-base';
  import getToken from '../../api/getToken';
  import DialogInput from './DialogInput';
  import Modal from "react-native-modal";
  // import CardComponent from './CardComponent';
  import { TINT_COLOR } from './Colors'

export default class LayYKien extends Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
      super(props);
      this.state = {
        dataSource: [],
        page: 0,
        refreshing: false,
        error: null,
        td: null,
        followings: null,
        feeds:null,
        onScroll:true,
        isDialogVisible: false,
        keyselect:null,
        datadownload:[],
        modalVisible:false,
      };
    }
    
    showDialog(isShow){
      this.setState({isDialogVisible: isShow
      });
    }
    showModal(isShow){
      this.setState({ modalVisible: isShow
      });
    }
    setkeyselect(key,data){
      this.setState({keyselect:key},function () {
        console.log("get key");
        console.log(this.state.keyselect);
       });
       this.setState({datadownload:data},function () {
        console.log("get download");
        console.log(this.state.keyselect);
       });
    };
    
    sendInput(inputText){
      console.log("sendInput (DialogInput#1): "+inputText);
      getToken('hkg').then(token => {
        if(token.length > 0){
        var paramsString = "token=EANC21ZJrMLXtHW9ih8SXQ3pk9NraOKamNH9zywVQupiRwLfdz" + "&idcv="+ this.state.keyselect + "&idtc=3&noidung=" + inputText;
        console.log(paramsString);
        console.log("sendInput (DialogInput#1): "+inputText);
        fetch("https://hkg.tayninh.gov.vn/Services/WebService.asmx/Them_Y_Kien", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: paramsString
        })
        .then((response) => response.json()).then((responseJson) => {
          console.log('____POSTTTTTTTTTTT');
          console.log(responseJson);
        })
     }})
    }
    componentDidMount() {
        this.makeRemoteRequest();
    }
    makeRemoteRequest = () => {
        const { page, seed } = this.state;
        const url = `https://hkg.tayninh.gov.vn/services/WebService.asmx/congviec?token=EANC21ZJrMLXtHW9ih8SXQ3pk9NraOKamNH9zywVQupiRwLfdz&loai=1&trang=${page}`;
        this.setState({ loading: true });
        fetch(url)
          .then(res => res.json()) 
          .then(res => {
            res = res.map(item => {
              item.isSelect = false;
              item.selectedClass = styles.list;
              return item;
            });
            this.setState({
              dataSource: page === 0 ? res : [...this.state.dataSource, ...res],
              error: res.error || null,
              loading: false,
              refreshing: false
            });
          })
          .catch(error => {
            this.setState({ error, loading: false });
          });
      };
      handleRefresh = () => {
        this.setState(
          {
            page: 0,
            refreshing: true
          },
          () => {
            this.makeRemoteRequest();
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

      selectItem = data => {
        data.item.isSelect = !data.item.isSelect;
        data.item.selectedClass = data.item.isSelect ? styles.selected : styles.list;
        const index = this.state.dataSource.findIndex(
          item => data.item.key === item.key
        );
        this.state.dataSource[index] = data.item;
        this.setState({
          dataSource: this.state.dataSource,
        });
      };

      renderItem = data =>
      <TouchableOpacity>
          <Card>
            <CardItem>
              <Left>
                <Thumbnail 
                  source={{ uri: `http://anhbiafb.com/uploads/ctv_3/FILE-20170819-1658UJALJP54P84Z.jpg` }} />
                <Body>
                  <Text>{data.item.HoTen}</Text>
                  <Text note>{data.item.Ngay}/{data.item.Thang}/{data.item.Nam}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <Text style={{ fontSize: 20, fontWeight:'900', color:'black', marginBottom: 5}}>{data.item.NoiDung}</Text>
                <Text numberOfLines={5} ellipsizeMode="tail">
                Đơn vị tạo: {data.item.DVTao}
                </Text>
              </Body>
            </CardItem>
            <CardItem style={{ height:45 }}>
              <Left>
                <Button transparent onPress={() => this.CheckDongY(data.item.key)}>
                  <Icon name='ios-thumbs-up' style={[styles.list, data.item.selectedClass]}  onPress={() => this.selectItem(data)}/> 
                  <Text>Đồng Ý</Text>
                </Button>
                <Button transparent onPress={() => this.CheckKhongDongY(data.item.key)}>
                  <Icon name='ios-thumbs-down' style={[styles.list, data.item.selectedClass]}  onPress={() => this.selectItem(data)}/>
                  <Text>Phản đối</Text>
                </Button>
                <Button transparent  onPress={()=>{this.setkeyselect(data.item.key,data.item.TaiLieu);this.showDialog(true);}}>
                  <Icon name='ios-chatbubbles' style={[styles.list, data.item.selectedClass]} />
                  <Text>Ý kiến khác</Text>
                </Button>
              </Left>
              <Right>
              <Button transparent textStyle={{color: '#87838B'}} onPress={()=>{this.setkeyselect(data.item.key,data.item.TaiLieu);this.showModal(true);}}>
                  <Icon name='ios-send' style={{ color:'black' }}/>
                <Text> {Object.keys(data.item.TaiLieu).length}</Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
        </TouchableOpacity>

    //   <TouchableOpacity
    //     style={[styles.list, data.item.selectedClass]}      
    //     onPress={() => this.selectItem(data)}
    //   >
    //   <Image
    //     source={{ uri: data.item.thumbnailUrl }}
    //     style={{ width: 40, height: 40, margin: 6 }}
    //   />
    //   <Text style={styles.lightText}>  {data.item.title.charAt(0).toUpperCase() + data.item.title.slice(1)}  </Text>
    // </TouchableOpacity>

      getTextStyle = (value, conditional) =>{
        if(value == conditional ) {
         return {
          color:'red', marginRight: 5 
         }
        } else {
          return {
            color:'black', marginRight: 5 
          }
        }
       };

       CheckDongY(key) {
        getToken('hkg').then(token => {
          console.log("tokentttttttttttttttttttttttttttttttttt");
          console.log(token);
          if(token.length > 0){
          var paramsString = "token=EANC21ZJrMLXtHW9ih8SXQ3pk9NraOKamNH9zywVQupiRwLfdz" + "&idcv="+ key + "&idtc=1&noidung=";
          console.log('IIIIIIIIIIIIIIIIIIIIIIIIIIIII');
          console.log(paramsString);
          fetch("https://hkg.tayninh.gov.vn/Services/WebService.asmx/Them_Y_Kien", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: paramsString
          })
          .then((response) => response.json()).then((responseJson) => {
            console.log('____POSTTTTTTTTTTT');
            console.log(responseJson);
          })
       }})};
       CheckKhongDongY(key) {
        getToken('hkg').then(token => {
          console.log("tokentttttttttttttttttttttttttttttttttt");
          console.log(token);
          if(token.length > 0){
          var paramsString = "token=EANC21ZJrMLXtHW9ih8SXQ3pk9NraOKamNH9zywVQupiRwLfdz" + "&idcv="+ key + "&idtc=2&noidung=";
          console.log('IIIIIIIIIIIIIIIIIIIIIIIIIIIII');
          console.log(paramsString);
          fetch("https://hkg.tayninh.gov.vn/Services/WebService.asmx/Them_Y_Kien", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: paramsString
          })
          .then((response) => response.json()).then((responseJson) => {
            console.log('____POSTTTTTTTTTTT');
            console.log(responseJson);
          })
       }})};



       taifileYK(key) {
        console.log('Tai file......');
        getToken('hkg')
        .then(token => {
          if(token.length > 0){
          var paramsString = "idykien="+ key +"&token="+ token;
          fetch("https://hkg.tayninh.gov.vn/services/WebService.asmx/CodeFileGY", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: paramsString
          })
          .then((response) => response.json())
          .then((responseJson) => {
            if(responseJson.thongbao == 'dung'){
              var link = 'https://hkg.tayninh.gov.vn/services/WebService.asmx/downloadgy?code='+responseJson.code;
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
            {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
        }
        })
        .catch(err => console.log('LOI CHECK LOGIN', err));
      };
  render() {
    const { navigate } = this.props.navigation;
    const download = (
      <ScrollView>
        <Container>
        <Header />
        <Content>
          <Card>
          <FlatList
          data={this.state.datadownload}
          renderItem={({ item }) =>
          <CardItem>
          <Icon active name="ios-cloud-download" />
            <Text>{item.FileTL}</Text>
         </CardItem>
          }
          keyExtractor={item => item.key}
        />
           </Card>
        </Content>
      </Container>
        
      </ScrollView> 
    );
      return (
        <Container style={styles.container}>        
        <Header 
          style={{backgroundColor:'white'}}
          androidStatusBarColor="white">
          <StatusBar 
            backgroundColor="white" 
            barStyle="dark-content"/>
          <Left><Icon name='ios-camera' style={{ paddingLeft:10 }}/></Left>
          <Body>
            <Title style={styles.title}>여기부터 스토리 헤더 시작</Title>
          </Body>
          <Right><Icon name='ios-send' style={{ paddingRight:10 }}/></Right>
        </Header>
        <Content 
        //   scrollEventThrottle={300} 
        //   onScroll={onScroll}
          removeClippedSubviews={true}>
          {/* 여기부터 스토리 헤더 시작 */}
          <View style={{ height: 100 }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 7 }}>
              <Text style={{ fontWeight: 'bold' }}>Stories</Text>
              <View style={{ flexDirection: 'row', 'alignItems': 'center' }}>
                <Icon name="md-play" style={{ fontSize: 14 }}></Icon>
                <Text style={{ fontWeight: 'bold' }}> Watch All</Text>
              </View>
            </View>
            <View style={{ flex: 3 }}>

                    <Modal isVisible={this.state.modalVisible}
                            onBackdropPress={() => this.setState({ modalVisible: null })}>
                        
                          {download}    

                    </Modal>

                <DialogInput isDialogVisible={this.state.isDialogVisible}
                title={"Ý kiến khác"}
                hintInput ={"nhập ý kiến ... "}
                submitInput={ (inputText) => {this.sendInput(inputText)} }
                closeDialog={ () => {this.showDialog(false)}}>
                </DialogInput>

                <TouchableOpacity onPress={()=>{this.showDialog(true,key)}} style={{padding:10}}>
                <Text>Show DialogInput #1</Text>
                </TouchableOpacity>

              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  alignItems: 'center',
                  paddingStart: 5,
                  paddingEnd: 5
                }}>
                  <Thumbnail 
                      style={{ marginHorizontal: 5, borderColor: 'pink', borderWidth: 2 }}
                      source={{uri: `http://anhbiafb.com/uploads/ctv_3/FILE-20170819-1658UJALJP54P84Z.jpg` }} />
                {/* {
                  (followings||[]).map(following => (
                    <Thumbnail 
                      key={ following }
                      style={{ marginHorizontal: 5, borderColor: 'pink', borderWidth: 2 }}
                      source={{uri: `https://steemitimages.com/u/${following}/avatar` }} />
                  ))
                } */}
              </ScrollView>
            </View>
          </View>
          {/* 여기까지 스토리 헤더 끝 */}
          <FlatList
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={1}
            data={this.state.dataSource}
            renderItem={item => this.renderItem(item)}
            keyExtractor={item => item.key.toString()}
            extraData={this.state}
          />
        
        
        {/* <TouchableOpacity>
          <Card>
            <CardItem>
              <Left>
                <Thumbnail 
                  source={{ uri: `http://anhbiafb.com/uploads/ctv_3/FILE-20170819-1658UJALJP54P84Z.jpg` }} />
                <Body>
                  <Text>Son doan</Text>
                  <Text note>Ngay tao </Text>
                </Body>
              </Left>
            </CardItem>
  
            <CardItem style={{ height: 20 }}>
              <Text>123241 likes</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text style={{ fontSize: 20, fontWeight:'900', color:'black', marginBottom: 5}}>Báo chí châu Âu ngạc nhiên về hiệu quả chống dịch của Việt Nam Báo chí châu Âu ngạc nhiên về hiệu quả chống dịch của Việt Nam</Text>
                <Text numberOfLines={5} ellipsizeMode="tail">
                Tóm tắt ngan17 ngandsada
                </Text>
              </Body>
            </CardItem>
            <CardItem style={{ height:45 }}>
              <Left>
                <Button transparent>
                  <Icon name='ios-heart' style={{ color:'black', marginRight: 5 }}/> 
                  <Text>vote}</Text>
                </Button>
                <Button transparent>
                  <Icon name='ios-chatbubbles' style={{ color:'black', marginRight: 5 }}/>
                  <Text>test con</Text>
                </Button>
                <Button transparent textStyle={{color: '#87838B'}}>
                  <Icon name='ios-send' style={{ color:'black' }}/>
                </Button>
              </Left>
              <Right>
                <Text>valu gì đó</Text>
              </Right>
            </CardItem>
          </Card>
        </TouchableOpacity> */}
          {/* {
            (feeds||[]).map(record => {
              if (!record.isSettled) {
                return <Spinner color={ TINT_COLOR } key={ Math.random() }/>;
              }
              const { content } = record;
              return <CardComponent 
                key={ content.post_id }
                data={ content } 
                onPress={
                  (event) => {
                    event.stopPropagation();
                    props.navigation.navigate('Details', { content });
                  }
                }
              />
            })
          } */}
        </Content>
      </Container>
      );
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white'
    },
    title: {
      fontFamily: 'Sweet Sensations Persona Use', 
      fontSize: 30,
      color: '#242424',
    },
    selected: { color:'red', marginRight: 5 },
    list: { color:'black', marginRight: 5 },
  });