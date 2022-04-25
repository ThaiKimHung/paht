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
  Alert,
  Linking,
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
import {
  Card,
  CardItem,
  Button,
  ActionSheet,
  Root,
  List,
  ListItem,
  Item,
  Input,
  Footer,
  FooterTab,
  Form,
} from "native-base";
import { Avatar } from "react-native-elements";
import getToken from "../../api/getToken";

const CancelButton = [
  {
    ID: 9000,
    FileTL: "Huỷ bỏ",
  },
];

export default class BinhLuan extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      data: [],
      page: 0,
      refreshing: false,
      error: null,
      td: null,
      followings: null,
      feeds: null,
      onScroll: true,
      clicked: null,
      viewMore: false,
      liked: false,
      noidung: null,
      idcv: params.idcv,
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    getToken("hkg").then((token) => {
      const { page, seed,idcv } = this.state;
      const url = `https://hkg.tayninh.gov.vn/Services/WebService.asmx/ThaoLuan_CongViec?token=${token}&idcv=${idcv}&trang=${page}`;
      this.setState({ loading: true });
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          this.setState({
            data: page === 0 ? res : [...this.state.data, ...res],
            error: res.error || null,
            loading: false,
            refreshing: false,
          });
        })
        .catch((error) => {
          this.setState({ error, loading: false });
        });
    });
  };

  sendLike(idtl) {
    getToken("hkg")
      .then((token) => {
        if (token.length > 0) {
          var paramsString = "idtl=" + idtl + "&token=" + token;
          fetch(
            "https://hkg.tayninh.gov.vn/Services/WebService.asmx/Them_Cam_Xuc",
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
              console.log(responseJson);
            });
        }
      })
      .catch((err) => console.log("LOI SEND LIKE", err));
  }

  sendSubLike(idtl) {
    getToken("hkg")
      .then((token) => {
        if (token.length > 0) {
          var paramsString = "idtl=" + idtl + "&token=" + token;
          fetch(
            "https://hkg.tayninh.gov.vn/Services/WebService.asmx/Them_Cam_Xuc",
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
              this.handleRefresh();
            });
        }
      })
      .catch((err) => console.log("LOI SEND LIKE", err));
  }

  sendComment(idcv, noidung, idtlcha) {
    getToken("hkg")
      .then((token) => {
        if (token.length > 0) {
          var paramsString =
            "idcv=" +
            idcv +
            "&token=" +
            token +
            "&noidung=" +
            noidung +
            "&idtlcha=" +
            idtlcha;
          fetch(
            "https://hkg.tayninh.gov.vn/Services/WebService.asmx/Them_ThaoLuan_CongViec",
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
              if (responseJson.trangthai === "thanhcong") {
                this.setState({ noidung: null });
                this.handleRefresh();
              }
            });
        }
      })
      .catch((err) => console.log("LOI", err));
  }

  onInputChange(value) {
    this.setState({ noidung: value });
  }

  taifile(key) {
    getToken("hkg")
      .then((token) => {
        if (token.length > 0) {
          var paramsString = "id=" + key + "&token=" + token;
          fetch(
            "https://hkg.tayninh.gov.vn/Services/WebService.asmx/CodeFileCV",
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
                  "https://hkg.tayninh.gov.vn/Services/WebService.asmx/downloadCV?code=" +
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

  handleRefresh = () => {
    this.setState(
      {
        page: 0,
        refreshing: true,
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  toggleViewMore() {
    this.setState({ viewMore: !this.state.viewMore });
  }

  // Render

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: "red", height: 40, paddingTop: 0.1 }}>
          <Left>
            <Icon
              name="md-arrow-back"
              style={{ color: "white", paddingLeft: 10 }}
              onPress={() => this.props.navigation.goBack()}
            />
          </Left>
          <Body>
            <Title style={styles.title}>Bình luận</Title>
          </Body>
          <Right></Right>
        </Header>
        <Content contentContainerStyle={{ flex: 1 }}>
        <FlatList
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.5}
          data={this.state.data}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => {
            let traloiData = [];
            if (item.TraLoi.length > 0) {
              traloiData = item.TraLoi;
            }
            return (
              <Card transparent>
                <CardItem cardBody>
                  <Left style={{alignItems:"flex-start"}}> 
                    <Avatar
                      size="medium"
                      rounded
                      overlayContainerStyle={{ backgroundColor: "#DB4F47" }}
                      title={
                        item.HoTen[0] +
                        item.HoTen[item.HoTen.lastIndexOf(" ") + 1]
                      }
                    />
                    <Body
                      style={{
                        backgroundColor: "#F2F3F5",
                        borderRadius: 15,
                        paddingBottom: 10,
                        paddingTop: 10,
                        
                      }}
                    >
                      <Text
                        style={{
                          color: "#4267B2",
                          fontWeight: "bold",
                          marginLeft: 10,
                          fontSize: 15,
                        }}
                      >
                        {item.HoTen}
                      </Text>
                      <Text
                        style={{
                          color: "black",
                          marginLeft: 10,
                          fontSize: 13,
                        }}
                      >
                        {item.NOIDUNG}
                      </Text>
                    </Body>
                  </Left>
                </CardItem>

                <TraLoi
                  liked={item.DaLike}
                  countLike={item.SoLike}
                  sendLike={() => this.sendLike(item.key)}
                  sendSubLike={(value) => this.sendSubLike(value)}
                  countTraloi={item.TraLoi.length}
                  viewMore={this.state.viewMore}
                  idcv={this.state.idcv}
                  idtlcha={item.key}
                  traloiData={traloiData}
                  handleRefresh={() => this.handleRefresh()}
                />
              </Card>
            );
          }}
        />
        <Form>
          <Item>
            <Input
              placeholder="Viết bình luận..."
              onChangeText={(value) => this.onInputChange(value)}
              value={this.state.noidung}
              onSubmitEditing={() => {
                this.sendComment(this.state.idcv, this.state.noidung, 0);
              }}
            ></Input>
            {/* <Button transparent>
              <Icon name="md-attach" style={{ color: "black" }} />
            </Button> */}
          </Item>
        </Form>
        </Content>
      </Container>
    );
  }
}

// ================ Tra Loi Component ==============================================================//
// ================ Tra Loi Component ==============================================================//
// ================ Tra Loi Component ==============================================================//

class TraLoi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMore: false,
      liked: false,
      countLike: null,
      noidung: null,
    };
  }

  componentDidMount() {
    this.setState({ viewMore: this.props.viewMore });
    this.setState({ liked: this.props.liked });
    this.setState({ countLike: this.props.countLike });
  }
  componentDidUpdate() {}

  toggleCheck() {
    this.setState({ viewMore: !this.state.viewMore });
  }

  toggleLike() {
    this.setState({ liked: !this.state.liked });
    this.props.sendLike();
    if (this.state.liked) {
      this.setState({ countLike: this.state.countLike - 1 });
    }
    if (!this.state.liked) {
      this.setState({ countLike: this.state.countLike + 1 });
    }
  }

  onInputChange(value) {
    this.setState({ noidung: value });
  }

  sendComment(idcv, noidung, idtlcha) {
    getToken("hkg")
      .then((token) => {
        if (token.length > 0) {
          var paramsString =
            "idcv=" +
            idcv +
            "&token=" +
            token +
            "&noidung=" +
            noidung +
            "&idtlcha=" +
            idtlcha;
          fetch(
            "https://hkg.tayninh.gov.vn/Services/WebService.asmx/Them_ThaoLuan_CongViec",
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
              if (responseJson.trangthai === "thanhcong") {
                this.setState({ noidung: null });
                this.props.handleRefresh();
              }
            });
        }
      })
      .catch((err) => console.log("LOI", err));
  }

  render() {
    return (
      // Buttons
      <>
        <CardItem style={{ paddingLeft: 70, height: 15,marginTop:10 }} cardBody>
          <Left>
            <Button
              transparent
              textStyle={{ color: "#87838B" }}
              onPress={() => this.toggleLike()}
            >
              <Icon
                name="ios-thumbs-up"
                style={{ color: this.state.liked ? "red" : "#BDBDBD" }}
              />
              <Text> {this.state.countLike} Thích</Text>
            </Button>

            <Button
              transparent
              textStyle={{ color: "#87838B" }}
              onPress={() => this.toggleCheck()}
            >
              <Icon name="ios-chatbubbles" style={{ color: "#BDBDBD" }} />
              <Text> {this.props.countTraloi} Trả lời</Text>
            </Button>
          </Left>
          <Right></Right>
        </CardItem>

        {this.state.viewMore && this.props.traloiData.length > 0 ? (
          this.props.traloiData.map((value, index, arr) => {
            if (arr.length - 1 === index) {
              return (
                <>
                  <CardItem style={{ paddingLeft: 70 }}>
                    <Left>
                      <Avatar
                        size="small"
                        rounded
                        overlayContainerStyle={{ backgroundColor: "#DB4F47" }}
                        title={
                          value.HoTen[0] +
                          value.HoTen[value.HoTen.lastIndexOf(" ") + 1]
                        }
                      />
                      <Body
                        style={{
                          backgroundColor: "#F2F3F5",
                          borderRadius: 15,
                          paddingTop: 5,
                          paddingBottom: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: "#4267B2",
                            fontWeight: "bold",
                            marginLeft: 10,
                          }}
                        >
                          {value.HoTen}
                        </Text>
                        <Text style={{ color: "black", marginLeft: 10 }}>
                          {value.NOIDUNG}
                        </Text>
                      </Body>
                    </Left>
                  </CardItem>

                  <CardItem style={{ paddingLeft: 120, height: 15 }} cardBody>
                    <Left>
                      <Button
                        transparent
                        textStyle={{
                          color: value.DaLike ? "red" : "#87838B",
                        }}
                        onPress={() => this.props.sendSubLike(value.key)}
                      >
                        <Icon
                          name="ios-thumbs-up"
                          style={{ color: value.DaLike ? "red" : "#87838B" }}
                        />
                        <Text> {value.SoLike} Thích</Text>
                      </Button>
                    </Left>

                    <Right></Right>
                  </CardItem>

                  <Form style={{ paddingLeft: 70, width: "100%" }}>
                    <Item>
                      <Input
                        placeholder="Viết trả lời..."
                        onChangeText={(value) => this.onInputChange(value)}
                        value={this.state.noidung}
                        onSubmitEditing={() => {
                          this.sendComment(
                            this.props.idcv,
                            this.state.noidung,
                            this.props.idtlcha
                          );
                        }}
                      ></Input>
                    </Item>
                  </Form>
                </>
              );
            } else
              return (
                <>
                  <CardItem style={{ paddingLeft: 70 }}>
                    <Left>
                      <Avatar
                        size="small"
                        overlayContainerStyle={{ backgroundColor: "#DB4F47" }}
                        rounded
                        title={
                          value.HoTen[0] +
                          value.HoTen[value.HoTen.lastIndexOf(" ") + 1]
                        }
                      />
                      <Body
                        style={{
                          backgroundColor: "#F2F3F5",
                          borderRadius: 15,
                          paddingBottom: 5,
                          paddingTop: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: "#4267B2",
                            fontWeight: "bold",
                            marginLeft: 10,
                          }}
                        >
                          {value.HoTen}
                        </Text>
                        <Text style={{ color: "black", marginLeft: 10 }}>
                          {value.NOIDUNG}
                        </Text>
                      </Body>
                    </Left>
                  </CardItem>

                  <CardItem style={{ paddingLeft: 120, height: 15 }} cardBody>
                    <Left>
                      <Button
                        transparent
                        textStyle={{
                          color: value.DaLike ? "red" : "#87838B",
                        }}
                        onPress={() => this.props.sendSubLike(value.key)}
                      >
                        <Icon
                          name="ios-thumbs-up"
                          style={{ color: value.DaLike ? "red" : "#87838B" }}
                        />
                        <Text> {value.SoLike} Thích</Text>
                      </Button>
                    </Left>

                    <Right></Right>
                  </CardItem>
                </>
              );
          })
        ) : this.state.viewMore ? (
          <Form style={{ paddingLeft: 70, width: "100%" }}>
            <Item>
              <Input
                placeholder="Viết trả lời..."
                onChangeText={(value) => this.onInputChange(value)}
                value={this.state.noidung}
                onSubmitEditing={() => {
                  this.sendComment(
                    this.props.idcv,
                    this.state.noidung,
                    this.props.idtlcha
                  );
                }}
              ></Input>
            </Item>
          </Form>
        ) : null}
      </>
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
    color: "#ffff",
  },
});
