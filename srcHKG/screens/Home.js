// import React, { Component } from "react";
// import {
//   Footer,
//   Content,
//   Button,
//   Container,
//   Header,
//   Left,
//   Right,
//   Icon,
//   Grid,
//   Col,
//   Row,
//   Item,
//   Input,
//   Title,
//   Body,
//   Thumbnail,
// } from "native-base";
// import PropTypes from "prop-types";
// import BarcodeScan from "../screens/BarcodeScan";
// import Swiper from "react-native-web-swiper";
// import { ifIphoneX } from "react-native-iphone-x-helper";
// import TintucDetail from "../screens/TintucDetail";
// import {
//   Platform,
//   Linking,
//   View,
//   StyleSheet,
//   Image,
//   Text,
//   Dimensions,
//   TouchableHighlight,
//   Alert,
//   ImageBackground,
// } from "react-native";
// import AsyncStorage from "@react-native-community/async-storage";
// import image_nophoso from "../assets/home_icon/nophoso.png";
// import image_tracuu from "../assets/home_icon/tracuu.png";
// import image_hoidap from "../assets/home_icon/hoidap.png";
// import image_ktxh from "../assets/home_icon/ktxh.png";
// import image_egov from "../assets/home_icon/egov.png";
// import image_hkg from "../assets/home_icon/hopkhonggiay.png";
// import image_tintuc from "../assets/home_icon/tintuc.png";
// import image_thongbao from "../assets/home_icon/thongbao.png";
// import image_hotline from "../assets/home_icon/hotline.png";
// import icon1022 from "../assets/home_icon/icon1022.png";
// import trocapcovid from "../assets/home_icon/teamwork.png";

// // import { FlatList } from "react-native-gesture-handler";

// const dataList = [
//   {
//     icon: image_nophoso,
//     title: "Dịch vụ công",
//     screen: "NopHoSoNavigator",
//   },
//   {
//     icon: image_tracuu,
//     title: "Tra cứu hồ sơ",
//     screen: "BarcodeScan",
//   },
//   {
//     icon: image_hoidap,
//     title: "Hỏi đáp trực tuyến", 
//     screen: "HoiDap",
//   },
//   {
//     icon: image_tintuc,
//     title: "Tin tức",
//     screen: "tintucNavigator",
//   },
//   {
//     icon: image_hotline,
//     title: "Phản ánh",
//     screen: "Home",
//   },
//   {
//     icon: image_thongbao,
//     title: "Thông báo",
//     screen: "Home",
//   },
//   {
//     icon: image_egov,
//     title: "Bkav Egov",
//     screen: "eGovNavigator",
//   },
//   {
//     icon: image_ktxh,
//     title: "Kinh tế xã hội",
//     screen: "HomeKTXH",
//   },
//   {
//     icon: image_hkg,
//     title: "Họp không giấy",
//     screen: "CheckHome",
//   },
//   {
//     icon: icon1022,
//     title: "Tây Ninh Smart",
//     screen: "1022",
//   },
//   {
//     icon: trocapcovid,
//     title: "Trợ cấp xã hội",
//     screen: "troCapCovidNavigator",
//   },
// ];

// const columnCount = 3;

// const { width: deviceWidth } = Dimensions.get("window");
// const { height: deviceHeigh } = Dimensions.get("window");
// const imageWidth = deviceWidth;
// const imageHeight = deviceHeigh * 0.3;
// const imageWidth1 = (deviceWidth / 17) * 15;
// const searchHeight = deviceHeigh * 0.1;
// const searchWidth = deviceWidth * 0.6;

// // ---------------------------------SUDOKU GRID-------------------------------//

// export class SudokuGrid extends Component {
//   static propTypes = {
//     rowWidth: PropTypes.number,
//     columnCount: PropTypes.number.isRequired,
//     dataSource: PropTypes.array.isRequired,
//     renderCell: PropTypes.func.isRequired,
//   };

//   constructor(props) {
//     super(props);
//     this.state = {};
//     this._columnWidth = (props.rowWidth || deviceWidth) / props.columnCount;
//   }

//   componentDidMount() {
//     // B
//     if (Platform.OS === "android") {
//       Linking.getInitialURL().then((url) => {
//         this.navigate(url);
//       });
//     } else {
//       //Linking.addEventListener("url", this.handleOpenURL);
//     }
//   }

//   componentWillUnmount() {
//     // C
//     Linking.removeEventListener("url", this.handleOpenURL);
//   }
//   handleOpenURL = (event) => {
//     // D
//     this.navigate(event.url);
//   };
//   navigate = (url) => {
//     // E
//     const { navigate } = this.props.navigation;
//     const route = url.replace(/.*?:\/\//g, "");
//     const id = route.match(/\/([^\/]+)\/?$/)[1];
//     const routeName = route.split("/")[0];
//   };

//   render() {
//     return (
//       <View
//         style={[
//           this.props.style,
//           styles.container,
//           { width: this.props.rowWidth },
//         ]}
//       >
//         {this._renderCells()}
//       </View>
//     );
//   }

//   _renderCells() {
//     return this.props.dataSource.map((data, index, dataList) => {
//       return (
//         <View
//           style={{ width: this._columnWidth }} 
//           key={`cell-${data.key != null ? data.key : index}`}
//         >
//           {this.props.renderCell(data, index, dataList)}
//         </View>
//       );
//     });
//   }
// }
// // ---------------------------------SUDOKU GRID-------------------------------//

// // ---------------------------------HOME-------------------------------//  

// export default class Home extends React.Component {
//   constructor(props) {
//     super(props);
//     barCodeScan = new BarcodeScan();
//     this.state = {
//       sbn: "",
//     };
//   }

//   componentWillMount() {
//     this._preConfigData();
//   }

//   _preConfigData = async () => {
//     const array = [1];
//     const dsTinDangKy = ["dsTinDangKy", JSON.stringify(array)];
//     const tintuc1stConfig = ["tintuc1stConfig", JSON.stringify(false)];
//     const egov1stConfig = ["egov1stConfig", JSON.stringify(false)];
//     try {
//       await AsyncStorage.getItem("dsTinDangKy").then((value) => {
//         if (value == null) {
//           AsyncStorage.multiSet([dsTinDangKy, tintuc1stConfig, egov1stConfig]);
//           console.log("LUU THANH CONG");
//         }
//       });
//       console.log("DA CONFIG");
//     } catch (error) {
//       console.log("KHONG LUU DUOC");
//     }
//   };

//   _onPressCell(data, index) {
//     let phoneNumber = "";

//     if (data.title === "Phản ánh") {
//       if (Platform.OS === "android") {
//         phoneNumber = "tel:02763813363";
//       } else {
//         phoneNumber = "tel://02763813363";
//       }
//       Linking.openURL(phoneNumber);
//     } else if (data.title === "Tây Ninh Smart") {
//       const supportedURL =
//         "https://play.google.com/store/apps/details?id=com.paht.tayninh.app";
//       const unsupportedURL = "gypa70://app/root/home";
//       Linking.openURL(unsupportedURL).catch((err) => {
//         if (err.code === "EUNSPECIFIED") {
//           if (Platform.OS === "ios") {
//             // check if appStoreLocale is set
//             const locale =
//               typeof appStoreLocale === "undefined" ? "us" : appStoreLocale;
//             Linking.openURL(
//               `https://apps.apple.com/app/id1488055863`
//             );
//           } else {
//             Linking.openURL(supportedURL);
//           }
//         } else {
//           throw new Error(`Could not open ${appName}. ${err.toString()}`);
//         }
//       });
//       // if (Platform.OS === 'android') {
//       //   const supportedURL = "https://play.google.com/store/apps/details?id=com.paht.tayninh.app";
//       //   const unsupportedURL = "gypa70://app/root/home";
//       //   // Checking if the link is supported for links with custom URL scheme.
//       //   const supported = Linking.canOpenURL(unsupportedURL);
//       //   console.log('______________');
//       //   console.log(supported);
//       //   console.log('______________');
//       //   if (supported) {
//       //     // Opening the link with some app, if the URL scheme is "http" the web link should be opened
//       //     // by some browser in the mobile
//       //     Linking.openURL(unsupportedURL);
//       //     const moapp = console.log(supported);
//       //     console.log('Mo apppppppp');
//       //     console.log('______________');
//       //     console.log(moapp);
//       //   } else {
//       //     console.log('Mo webbbbbbb');
//       //     console.log(supportedURL);
//       //     Linking.openURL(supportedURL);
//       //   }
//       // }else{
//       //   //IOS
//       // }
//     } else this.props.navigation.navigate(data.screen, { name: data.title });
//   }

//   _renderGridCell = (data, index, list) => {
//     return (
//       <TouchableHighlight
//         underlayColor={"#eee"}
//         onPress={this._onPressCell.bind(this, data, index)}
//       >
//         <View
//           style={{
//             overflow: "hidden",
//             justifyContent: "center",
//             alignItems: "center",
//             height: ifIphoneX(deviceHeigh/8, deviceHeigh/7) ,
//             borderBottomWidth: StyleSheet.hairlineWidth,
//             borderColor: "#fff",
//             borderRightWidth:
//               (index + 1) % columnCount ? StyleSheet.hairlineWidth : 0,
//           }}
//         >
//           <Image
//             source={data.icon}
//             style={{
//               width: 50,
//               height: 50,
//               marginHorizontal: 10,
//               marginBottom: 10,
//             }}
//           />

//           <Text style={{ fontFamily: "Roboto", fontWeight:"400" }}>{data.title}</Text>
//         </View>
//       </TouchableHighlight>
//     );
//   };

//   render() {
//     return (
//       <Container>
//         {/* Header */}
//         <ImageBackground
//           source={require("../assets/banner/backgroud2_01.png")}
//           resizeMode="cover"
//           style={styles.imgBG}
//         >
//           <Header searchBar style={styles.header}>
//             <Left>
//               <Button
//                 transparent
//                 onPress={() => this.props.navigation.openDrawer()}
//               >
//                 <Icon name="md-menu" style={{ color: "white" }} />
//               </Button>
//             </Left>

//             <Body>
//               <Item style={{ width: searchWidth, borderBottomWidth: 0 }}>
//                 <Icon
//                   name="md-search"
//                   style={{
//                     color: "white",
//                     paddingRight: 0,
//                     paddingLeft: 0,
//                     paddingTop: 4,
//                     fontSize: 24,
//                   }}
//                 />
//                 <Input
//                   placeholder="Nhập số biên nhận để tra cứu"
//                   placeholderTextColor="#B6CAD1"
//                   style={{
//                     fontSize: 14,
//                     fontStyle: "italic",
//                     fontFamily: "roboto",
//                     paddingLeft: 6,
//                     color: "#FFFFFF",
//                   }}
//                   keyboardType="numeric"
//                   onFocus={() => this.props.navigation.navigate("BarcodeScan")}
//                 />
//               </Item>
//             </Body>

//             <Right>
//               <Button
//                 transparent
//                 onPress={() =>
//                   this.props.navigation.navigate("BarcodeScan", {
//                     openQRScan: true,
//                   })
//                 }
//               >
//                 <Icon
//                   type="MaterialCommunityIcons"
//                   name="qrcode-scan"
//                   style={{ color: "white" }}
//                 />
//               </Button>
//             </Right>
//           </Header>
//         </ImageBackground>

//         <Grid>

//           {/* Home Image */}
//           <Row style={{ height: imageHeight, width: imageWidth }}>
//             <ImageBackground
//               source={require("../assets/banner/backgroud2_02.png")}
//               resizeMode="cover"
//               style={{ width: imageWidth, height: imageHeight }}
//             >
//               <Swiper
//                 index={1}
//                 loop={true}
//                 autoplayTimeout={-5.5}
//                 overRangeButtonsOpacity={0.3}
//                 buttonsEnabled={false}
//               >
//                 <View style={styles.contenCard}>
//                   <View style={styles.contenCardNone} />
//                   <ImageBackground
//                     source={require("../assets/banner/home3.jpg")}
//                     resizeMode="cover"
//                     style={styles.contenCardBody}
//                     imageStyle={{ borderRadius: 25 }}
//                   >
//                     <View style={styles.backgroudText}>
//                       <Text style={styles.notetext}>
//                         CHUYÊN NGHIỆP - THÂN THIỆN - TRÁCH NHIỆM
//                       </Text>
//                     </View>
//                   </ImageBackground>
//                   <View style={styles.contenCardNone} />
//                 </View>

//                 <View style={styles.contenCard}>
//                   <View style={styles.contenCardNone} />
//                   <ImageBackground
//                     source={require("../assets/banner/home6.jpg")}
//                     resizeMode="cover"
//                     style={styles.contenCardBody}
//                     imageStyle={{ borderRadius: 25 }}
//                   >
//                     <View style={styles.backgroudText}>
//                       <Text style={styles.notetext}>
//                         CHUYÊN NGHIỆP - THÂN THIỆN - TRÁCH NHIỆM
//                       </Text>
//                     </View>
//                   </ImageBackground>
//                   <View style={styles.contenCardNone} />
//                 </View>

//                 <View style={styles.contenCard}>
//                   <View style={styles.contenCardNone} />
//                   <ImageBackground
//                     source={require("../assets/banner/home1.jpg")}
//                     resizeMode="cover"
//                     style={styles.contenCardBody}
//                     imageStyle={{ borderRadius: 25 }}
//                   >
//                     <View style={styles.backgroudText}>
//                       <Text style={styles.notetext}>
//                         CHUYÊN NGHIỆP - THÂN THIỆN - TRÁCH NHIỆM
//                       </Text>
//                     </View>
//                   </ImageBackground>
//                   <View style={styles.contenCardNone} />
//                 </View>

//                 <View style={styles.contenCard}>
//                   <View style={styles.contenCardNone} />
//                   <ImageBackground
//                     source={require("../assets/banner/home2.jpg")}
//                     resizeMode="cover"
//                     style={styles.contenCardBody}
//                     imageStyle={{ borderRadius: 25 }}
//                   >
//                     <View style={styles.backgroudText}>
//                       <Text style={styles.notetext}>
//                         CHUYÊN NGHIỆP - THÂN THIỆN - TRÁCH NHIỆM
//                       </Text>
//                     </View>
//                   </ImageBackground>
//                   <View style={styles.contenCardNone} />
//                 </View>
//                 <View style={styles.contenCard}>
//                   <View style={styles.contenCardNone} />
//                   <ImageBackground
//                     source={require("../assets/banner/home5.jpg")}
//                     resizeMode="cover"
//                     style={styles.contenCardBody}
//                     imageStyle={{ borderRadius: 25 }}
//                   >
//                     <View style={styles.backgroudText}>
//                       <Text style={styles.notetext}>
//                         CHUYÊN NGHIỆP - THÂN THIỆN - TRÁCH NHIỆM
//                       </Text>
//                     </View>
//                   </ImageBackground>
//                   <View style={styles.contenCardNone} />
//                 </View>

//                 <View style={styles.contenCard}>
//                   <View style={styles.contenCardNone} />
//                   <ImageBackground
//                     source={require("../assets/banner/home4.jpg")}
//                     resizeMode="cover"
//                     style={styles.contenCardBody}
//                     imageStyle={{ borderRadius: 25 }}
//                   >
//                     <View style={styles.backgroudText}>
//                       <Text style={styles.notetext}>
//                         CHUYÊN NGHIỆP - THÂN THIỆN - TRÁCH NHIỆM
//                       </Text>
//                     </View>
//                   </ImageBackground>
//                   <View style={styles.contenCardNone} />
//                 </View>
//               </Swiper>
//             </ImageBackground>
//           </Row>

//           <Row style={{ paddingTop: 6, backgroundColor: "#EEEEEE" }}>
//             <ImageBackground
//               source={require("../assets/trongdong.jpg")}
//               style={{ width: null, height: null }}
//               resizeMode="cover"
//               //blurRadius={5}
//             >
//               <View style={{ backgroundColor: "transparent" }}>
//                 <SudokuGrid
//                   containerStyle={{ backgroundColor: "transparent", paddingBottom:30 }}
//                   columnCount={columnCount}
//                   dataSource={dataList}
//                   renderCell={this._renderGridCell}
//                 />
//               </View>
//             </ImageBackground>
//           </Row>
//         </Grid>
//         <Footer hasSegment style={{ backgroundColor: "#0E4AA3", height: 30 }}>
//           <Left></Left>
//           <Body style={{ flex: 3, justifyContent: "center" }}>
//             <Title style={{ color: "white", fontSize: 13, fontWeight: "bold" }}>
//               CỔNG THÔNG TIN TỈNH TÂY NINH
//             </Title>
//           </Body>
//           <Right></Right>
//         </Footer>
//       </Container>
//     );
//   }
// }
// // ---------------------------------HOME-------------------------------//

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     alignItems: "flex-start",
//     flexWrap: "wrap",
//   },

//   homeImage: {
//     backgroundColor: "transparent",
//     width: imageWidth,
//     height: imageHeight,
//     justifyContent: "flex-end",
//   },
//   header: {
//     backgroundColor: "transparent",
//     height: 40,
//     paddingTop: 0.1,
//   },
//   textOverImg: {
//     backgroundColor: "rgba(14, 56, 148, 0.35)",
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//     shadowOpacity: 0.5,
//     textAlign: "center",
//     fontFamily: "Roboto",
//   },
//   notetext: {
//     color: "#FFF",
//     //margin: 24,
//     marginLeft: 24,
//     marginRight: 24,
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   backgroudText: {
//     width: (imageWidth1 / 4) * 3,
//     height: 50,
//     justifyContent: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.55)",
//   },
//   contenCard: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 10,
//     marginBottom: 10,
//   },
//   contenCardNone: {
//     flex: 1,
//     backgroundColor: "transparent",
//   },
//   contenCardBody: {
//     flex: 15,
//     justifyContent: "center",
//     paddingTop: 90,
//     paddingTop: (imageHeight / 4) * 1.5,
//   },
//   imgBG: {
//     width: null,
//     ...ifIphoneX(
//       {
//         height: 80,
//       },
//       {
//         height: 50,
//       }
//     ),
//   },
// });
import React, { Component } from 'react';
import { View, Text } from 'react-native';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', }}>
        <Text> Home </Text>
      </View>
    );
  }
}

export default Home;
