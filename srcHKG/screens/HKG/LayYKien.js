import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  RefreshControl,
  Linking,
  Dimensions,
} from "react-native";
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
  Spinner,
} from "native-base";
import { Card, CardItem, Button, Toast } from "native-base";
import getToken from "../../api/getToken";
import DialogInput from "./DialogInput";
import Modal from "react-native-modal";
import LoadThaoTac from "./LoadThaoTac";
import { TINT_COLOR } from "./Colors";
import { Avatar } from "react-native-elements";

const { width: deviceWidth } = Dimensions.get("window");
const { height: deviceHeigh } = Dimensions.get("window");

export default class LayYKien extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.trang = 0;
    this.state = {
      dataList: [],
      loading: false,
      isRefreshing: false,
      isDialogVisible: false,
      keyselect: null,
      datadownload: [],
      modalVisible: false,
      showToast: false,
    };
  }
  showDialog(isShow) {
    this.setState({ isDialogVisible: isShow });
  }
  showModal(isShow) {
    this.setState({ modalVisible: isShow });
  }
  setkeyselect(key, data) {
    this.setState({ keyselect: key }, function () {
      console.log("get key");
      console.log(this.state.keyselect);
    });
    this.setState({ datadownload: data }, function () {
      console.log("get download");
      console.log(this.state.keyselect);
    });
  }
  sendInput(inputText) {
    console.log("sendInput (DialogInput#1): " + inputText);
    getToken("hkg").then((token) => {
      if (token.length > 0) {
        var paramsString =
          "token=" +
          token +
          "&idcv=" +
          this.state.keyselect +
          "&idtc=3&noidung=" +
          inputText;
        console.log(paramsString);
        console.log("sendInput (DialogInput#1): " + inputText);
        fetch(
          "https://hkg.tayninh.gov.vn/Services/WebService.asmx/Them_Y_Kien",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: paramsString,
          }
        )
          .then((response) => response.json())
          .then((responseJson) => {
            console.log("____POSTTTTTTTTTTT");
            console.log(responseJson);
            this.onRefresh();
          });
      }
    });
  }
  componentWillMount() {
    this._fetchMore(this.trang);
  }
  componentWillUnmount() {
    Toast.toastInstance = null;
  }
  _fetchMore(index) {
    getToken("hkg").then((token) => {
      var bodyParams = `token=${token}&loai=1&trang=${index}`;
      const serviceUrl =
        "https://hkg.tayninh.gov.vn/services/WebService.asmx/congviec";
      this.setState({ loading: true });
      fetch(serviceUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: bodyParams,
      })
        .then((response) => response.json())
        .then((responseData) => {
          let listData = this.state.dataList;
          let data = listData.concat(responseData);
          this.setState({ dataList: data, loading: false });
          console.log(data);
          // let listData = this.state.dataList;
          // let data  = listData;
          // console.log("danhs ach tin");
          // console.log(responseData.length);
          // (responseData.length === 0) ? data  = listData : data = listData.concat(responseData);
          // this.setState({dataList:data,loading:false});
        });
    });
  }
  handleLoadMore = () => {
    console.log("-------------BEGIN LOAD MORE-----------------");

    if (!this.state.loading) {
      this.trang = this.trang + 1;
      this._fetchMore(this.trang);
    }
    console.log("-------------SO TRANG-----------------");
    console.log(this.trang);
  };

  renderFooter = () => {
    if (!this.state.loading) return null;
    return <Spinner color="#0E4AA3" />;
  };

  onRefresh() {
    console.log("============BEGIN REFRESH==============");
    this.trang = 0;
    this._fetchTin(this.trang);
    console.log(this.trang);
  }
  _fetchTin(index) {
    getToken("hkg").then((token) => {
      var bodyParams = `token=${token}&loai=1&trang=${index}`;
      const serviceUrl =
        "https://hkg.tayninh.gov.vn/services/WebService.asmx/congviec";
      this.setState({ isRefreshing: true });
      fetch(serviceUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: bodyParams,
      })
        .then((response) => response.json())
        .then((responseData) => {
          this.trang = 0;
          this.setState({ dataList: responseData, isRefreshing: false });
        });
    });
  }
  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  getTextStyle = (value, conditional) => {
    if (value == conditional) {
      return {
        color: "red",
        marginRight: 5,
      };
    } else {
      return {
        color: "black",
        marginRight: 5,
      };
    }
  };
  CheckDongY(key) {
    getToken("hkg").then((token) => {
      console.log("tokentttttttttttttttttttttttttttttttttt");
      console.log(token);
      if (token.length > 0) {
        var paramsString =
          "token=" + token + "&idcv=" + key + "&idtc=1&noidung=";
        console.log("IIIIIIIIIIIIIIIIIIIIIIIIIIIII");
        console.log(paramsString);
        fetch(
          "https://hkg.tayninh.gov.vn/Services/WebService.asmx/Them_Y_Kien",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: paramsString,
          }
        )
          .then((response) => response.json())
          .then((responseJson) => {
            console.log("____POSTTTTTTTTTTT");
            console.log(responseJson);
            Toast.show({
              text: "Đồng ý với ý kiến trên!",
              buttonText: "Ok",
              duration: 3000,
            });
          });
      }
    });
  }
  CheckKhongDongY(key) {
    getToken("hkg").then((token) => {
      console.log("tokentttttttttttttttttttttttttttttttttt");
      console.log(token);
      if (token.length > 0) {
        var paramsString =
          "token=" + token + "&idcv=" + key + "&idtc=2&noidung=";
        console.log("IIIIIIIIIIIIIIIIIIIIIIIIIIIII");
        console.log(paramsString);
        fetch(
          "https://hkg.tayninh.gov.vn/Services/WebService.asmx/Them_Y_Kien",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: paramsString,
          }
        )
          .then((response) => response.json())
          .then((responseJson) => {
            console.log("____POSTTTTTTTTTTT");
            console.log(responseJson);
            Toast.show({
              text: "Không đồng ý với ý kiến trên!",
              buttonText: "Ok",
              duration: 3000,
            });
          });
      }
    });
  }
  taifile(key) {
    console.log("Tai file......");
    getToken("hkg")
      .then((token) => {
        if (token.length > 0) {
          var paramsString = "id=" + key + "&token=" + token;
          fetch(
            "https://hkg.tayninh.gov.vn/services/WebService.asmx/CodeFileCV",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded;charset=UTF-8",
              },
              body: paramsString,
            }
          )
            .then((response) => response.json())
            .then((responseJson) => {
              if (responseJson.thongbao == "dung") {
                var link =
                  "https://hkg.tayninh.gov.vn/services/WebService.asmx/downloadCV?code=" +
                  responseJson.code;
                Linking.canOpenURL(link).then((supported) => {
                  if (supported) {
                    Linking.openURL(link);
                  } else {
                    console.log("Don't know how to open URI: " + link);
                  }
                });
              }
            })
            .catch((err) => {
              console.log("Loi");
              console.log(err);
            });
        } else {
          Alert.alert(
            "Thông báo",
            "Bạn phải đăng nhập để lấy tài liệu",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
          );
        }
      })
      .catch((err) => console.log("LOI CHECK LOGIN", err));
  }

  render() {
    const { navigate } = this.props.navigation;
    const download = (
      <View>
        <ScrollView>
          <Content>
            <Card>
              <FlatList
                data={this.state.datadownload}
                renderItem={({ item }) => (
                  <CardItem>
                    <Icon active name="ios-cloud-download" />
                    <Text onPress={() => this.taifile(item.ID)}>
                      {item.FileTL}
                    </Text>
                  </CardItem>
                )}
                keyExtractor={(item) => item.key}
              />
            </Card>
          </Content>
        </ScrollView>
      </View>
    );
    if (this.state.loading && this.trang === 0) {
      return (
        <View
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Spinner color="#0E4AA3" />
        </View>
      );
    }
    return (
      <Container style={styles.container}>
        <Header
            style={{ backgroundColor: "red", paddingTop: 0.1, height: 40 }}
          >
            <Left>
              <Icon
                name="md-arrow-back"
                style={{ color: "white", paddingLeft: 10 }}
                onPress={() => this.props.navigation.goBack()}
              />
            </Left>
            <Body>
              <Title style={styles.title}>Lấy ý kiến</Title>
            </Body>
            <Right>
              {/* <Icon
                name="ios-settings"
                style={{ color: "white", paddingRight: 10 }}
              /> */}
            </Right>
          </Header>
        {/* <Header style={{ backgroundColor: "red" }} androidStatusBarColor="red">
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <Left>
          <Icon
                name="md-arrow-back"
                style={{ color: "white", paddingLeft: 10 }}
                onPress={() => this.props.navigation.goBack()}
              />
          </Left>
          <Body>
            <Title style={styles.title}>Lấy ý kiến</Title>
          </Body>
          <Right>
            <Icon name="ios-send" style={{ paddingRight: 10 }} />
          </Right>
        </Header> */}

        <Modal
          isVisible={this.state.modalVisible}
          onBackdropPress={() => this.setState({ modalVisible: null })}
        >
          {download}
        </Modal>

        <DialogInput
          isDialogVisible={this.state.isDialogVisible}
          title={"Ý kiến khác"}
          hintInput={"nhập ý kiến ... "}
          submitInput={(inputText) => {
            this.sendInput(inputText);
          }}
          closeDialog={() => {
            this.showDialog(false);
          }}
        ></DialogInput>
        <Content contentContainerStyle={{ flex: 1 }}>
          <FlatList
            data={this.state.dataList}
            extraData={this.state}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
            renderItem={({ item }) => {
              if (item != "")
                return (
                    <Card>
                      <CardItem>
                        <Left>
                          <Avatar
                            size="medium"
                            rounded
                            title={item.HoTen[0] + item.HoTen[item.HoTen.lastIndexOf(" ")+1]}
                            //onPress={() => console.log("Works!")}
                            activeOpacity={0.7}
                            overlayContainerStyle={{ backgroundColor: 'red' }}
                          />
                          {/* <Thumbnail
                            source={{
                              uri: `http://anhbiafb.com/uploads/ctv_3/FILE-20170819-1658UJALJP54P84Z.jpg`,
                            }}
                          /> */}
                          <Body>
                            <Text>{item.HoTen}</Text>
                            <Text note>
                              {item.Ngay}/{item.Thang}/{item.Nam} - (
                              {item.GioKT}) {item.NgayKT}/{item.ThangKT}/
                              {item.NamKT}
                            </Text>
                          </Body>
                        </Left>
                      </CardItem>
                      <CardItem>
                        <Body>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: "400",
                              color: "black",
                              marginBottom: 5,
                            }}
                          >
                            {item.NoiDung}
                          </Text>
                          <Text numberOfLines={5} ellipsizeMode="tail">
                            Đơn vị tạo: {item.DVTao}
                          </Text>
                          {/* <Card style={styles.card}> */}
                            {item.NoiDungYKien != "" ? <Text style={styles.text8}>{item.NoiDungYKien}</Text> : null}
                          {/* </Card> */}
                        </Body>
                      </CardItem>
                      <CardItem style={{ height: 45 }}>
                        <LoadThaoTac
                          idtieuchi={item.YKien}
                          tailieu={item.TaiLieu}
                          CheckDongY={(key) => {
                            this.CheckDongY(item.key);
                          }}
                          CheckKhongDongY={(key) => {
                            this.CheckKhongDongY(item.key);
                          }}
                          setkeyselect={(key) => {
                            this.setkeyselect(item.key, item.TaiLieu);
                          }}
                          showDialog={() => {
                            this.showDialog(true);
                          }}
                        />

                        <Right style={{flex:2}}>
                          <Button
                            transparent
                            textStyle={{ color: "#87838B" }}
                            onPress={() => {
                              this.setkeyselect(item.key, item.TaiLieu);
                              this.showModal(true);
                            }}
                          >
                            <Icon
                              name="ios-attach"
                              style={{ color: "black" }}
                            />
                            <Text>
                              {" "}
                              {item.key > 0
                                ? Object.keys(item.TaiLieu).length
                                : ""}
                            </Text>
                          </Button>
                        </Right>
                      </CardItem>
                    </Card>
                );
            }}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.3}
            onEndReached={this.handleLoadMore.bind(this)}
            // ListFooterComponent={this.renderFooter.bind(this)}
          />
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    // fontFamily: "Sweet Sensations Persona Use",
    fontSize: 18,
    color: "white",
  },
  selected: { color: "red", marginRight: 5 },
  list: { color: "black", marginRight: 5 },
  card: {
    flexDirection: "row",
    height: 50,
    width: (deviceWidth / 10) * 8,
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 3,
    marginTop: 3,
    borderLeftWidth: 5,
    borderLeftColor: "#ea7e7a",
  },
  text8: {
    color: "rgba(128,128,128,1)",
    fontSize: 18,
    // fontFamily: "ibm-plex-sans-700",
    letterSpacing: 1,
    marginLeft: 6,
    marginTop: 6
  },
});
