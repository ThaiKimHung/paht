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
import { Card, CardItem, Button, ActionSheet, Root } from "native-base";
import { Avatar } from "react-native-elements";
import getToken from "../../api/getToken";

const CancelButton = [
  {
    ID: 9000,
    FileTL: "Huỷ bỏ",
  },
];

export default class ChuDeTraoDoi extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
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
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }
  makeRemoteRequest = () => {
    getToken("hkg").then((token) => {
      const { page, seed } = this.state;
      const url = `https://hkg.tayninh.gov.vn/services/WebService.asmx/congviec?token=${token}&loai=2&trang=${page}`;
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

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Root>
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
              <Title style={styles.title}>Trao đổi</Title>
            </Body>
            <Right>
              {/* <Icon
                name="ios-settings"
                style={{ color: "white", paddingRight: 10 }}
              /> */}
            </Right>
          </Header>
          <Content removeClippedSubviews={true} contentContainerStyle={{ flex: 1 }}>
            <FlatList
              onRefresh={this.handleRefresh}
              refreshing={this.state.refreshing}
              onEndReached={this.handleLoadMore}
              onEndReachedThreshold={1}
              data={this.state.data}
              renderItem={({ item }) => (
                <TouchableOpacity>
                  <Card>
                    <CardItem header>
                      <Left>
                        <Avatar
                          size="medium"
                          rounded
                          overlayContainerStyle={{ backgroundColor: "#E75854" }}
                          title={
                            item.HoTen[0] +
                            item.HoTen[item.HoTen.lastIndexOf(" ") + 1]
                          }
                        />
                        <Body>
                          <Text style={{ color: "#4267B2", fontWeight: "bold", fontSize:17 }}>
                            {item.HoTen}
                          </Text>
                          <Text note>
                            {item.Ngay}/{item.Thang}/{item.Nam}
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
                      </Body>
                    </CardItem>

                    <CardItem style={{ height: 45 }}>
                      <Left>
                        <Button
                          transparent
                          textStyle={{ color: "#87838B" }}
                          onPress={() =>
                            item.TaiLieu.length > 0
                              ? ActionSheet.show(
                                  {
                                    options: item.TaiLieu.concat(
                                      CancelButton
                                    ).map((value) => value.FileTL),
                                    cancelButtonIndex: item.TaiLieu.length,
                                    title: "Tài liệu kèm theo",
                                  },
                                  (buttonIndex) => {
                                    buttonIndex != item.TaiLieu.length
                                      ? this.taifile(
                                          item.TaiLieu[buttonIndex].ID
                                        )
                                      : null;
                                  }
                                )
                              : null
                          }
                        >
                          <Icon name="md-attach" style={{ color: "#E75854",fontSize:25 }} />
                          <Text>
                            {" "}
                            {Object.keys(item.TaiLieu).length} Tài liệu
                          </Text>
                        </Button>
                      </Left>

                      <Right>
                        <Button
                          transparent
                          textStyle={{ color: "#87838B" }}
                          onPress={() =>
                            navigate("BinhLuan", { idcv: item.key })
                          }
                        >
                          <Icon
                            name="ios-chatbubbles"
                            style={{ color: "#E75854", fontSize:25 }}
                          />
                          <Text> {item.SoBL} Bình luận</Text>
                        </Button>
                      </Right>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
              )}
            />
          </Content>
        </Container>
      </Root>
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
