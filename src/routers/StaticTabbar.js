import * as React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions, Text, Image, Platform
} from 'react-native';
import Utils, { icon_typeToast } from '../../app/Utils';
import { colors } from '../../styles';
// import { Feather as Icon } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { reSize, reText, sizes } from '../../styles/size';
import LinearGradient from 'react-native-linear-gradient'
import MaskedView from '@react-native-community/masked-view'
import { showMessage, hideMessage } from "react-native-flash-message";
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { nwidth } from '../../styles/styles';


interface Tab {
  name: string;
  title: String
}

interface StaticTabbarProps {
  tabs: Tab[];
  value: Animated.Value;
}

class StaticTabbar2 extends React.PureComponent<StaticTabbarProps> {
  values: Animated.Value[] = [];

  constructor(props: StaticTabbarProps) {
    super(props);
    const { tabs, stateIndex } = this.props;
    this.values = tabs.map(
      (tab, index) => new Animated.Value(index === stateIndex ? 1 : 0)
    );
  }

  onPress = (index: number) => {
    const { value, tabs, stateIndex } = this.props;
    const tabWidth = nwidth() / tabs.length;
    // if (index == 1) {
    //   showMessage({
    //     message: 'Thông báo',
    //     description: 'Chức năng đang phát triển.',
    //     icon: 'info',
    //     titleStyle: { color: 'white', fontWeight: 'bold', fontSize: reText(14) },
    //     textStyle: { fontSize: reText(12), paddingRight: 5 },
    //     duration: 1000,

    //     type: "info",
    //   });
    //   return;
    // }
    Utils.navigate(tabs[index].screen)
    Animated.sequence([
      Animated.parallel(
        this.values.map(v =>
          Animated.timing(v, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true
          })
        )
      ),
      Animated.parallel([
        Animated.spring(value, {
          toValue: tabWidth * index,
          useNativeDriver: true
        }),
        Animated.spring(this.values[index], {
          toValue: 1,
          useNativeDriver: true
        })
      ])
    ]).start();

  };
  componentDidMount() {

  }
  render() {
    const { isLandscape } = this.props.theme
    const { onPress } = this;
    const { tabs, value, stateIndex } = this.props;
    const { tongSoThongBaoCongDong = 0, tongSoThongBaoCanBo = 0 } = this.props.thongbao
    const { tokenDH, tokenCD } = this.props.auth
    const countNoti = tongSoThongBaoCanBo + tongSoThongBaoCongDong
    if (Platform.OS == 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(countNoti);
    }
    return (
      <View style={styles.container}>
        {tabs.map((tab, key) => {
          const tabWidth = nwidth() / tabs.length;
          const cursor = tabWidth * key;
          const opacity = value.interpolate({
            inputRange: [cursor - tabWidth, cursor, cursor + tabWidth],
            outputRange: [1, 0, 1],
            extrapolate: 'clamp'
          });
          const translateY = this.values[key].interpolate({
            inputRange: [0, 1],
            outputRange: [64, 0],
            extrapolate: 'clamp'
          });
          const opacity1 = this.values[key].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'extend'
          });
          return (
            <React.Fragment {...{ key }}>
              <TouchableWithoutFeedback onPress={() => onPress(key)}>
                <Animated.View style={[styles.tab, {
                  opacity, backgroundColor: 'white', shadowColor: 'red',
                }]}>
                  <Icon name={tab.name} color={colors.brownGreyTwo} size={22} />
                  <Text style={{ fontSize: reText(10), textAlign: 'center', color: colors.brownGreyTwo }}>{tab.title}</Text>
                  {
                    (tokenDH.length > 0 || tokenCD.length > 0) && key == 0 && countNoti > 0 ?
                      <View style={{
                        position: 'absolute', top: reSize(5), right: isLandscape ? tabWidth / 3 : tabWidth / 4.5,
                        backgroundColor: 'red', padding: reSize(3),
                        alignItems: 'center', justifyContent: 'center',
                        borderRadius: reSize(10), width: reSize(18), height: reSize(18)
                      }}>
                        <Text style={{ fontSize: reText(9), color: 'white', textAlign: 'center', fontWeight: 'bold' }}>{countNoti > 9 ? '9+' : countNoti}</Text>
                      </View>
                      : null
                  }
                </Animated.View>
              </TouchableWithoutFeedback>
              <Animated.View
                style={{
                  position: 'absolute',
                  top: -8,
                  left: tabWidth * key,
                  width: tabWidth,
                  height: 64,
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: opacity1,
                  transform: [{ translateY }]
                }}
              >
                <View style={styles.activeIcon}>
                  {/* <Icon name={tab.name} color="black" size={25} /> */}
                  <View
                    style={{
                      width: 50, height: 50,
                      borderRadius: 30, position: 'absolute', top: -30, alignItems: 'center', justifyContent: 'center',
                      shadowColor: this.props.theme.colorLinear.color[0],
                      shadowOffset: { width: 1, height: 1 },
                      shadowOpacity: 0.3,
                      shadowRadius: 2,
                      elevation: 4,// do itemdanhsach shadow k hiện rõ trên android
                      backgroundColor: 'white'
                    }}
                  >
                    {
                      (tokenDH.length > 0 || tokenCD.length > 0) && key == 0 && countNoti > 0 ?
                        <View style={{
                          position: 'absolute', top: -reSize(5), right: 0,
                          backgroundColor: 'red', padding: reSize(3),
                          alignItems: 'center', justifyContent: 'center',
                          borderRadius: reSize(10), width: reSize(18), height: reSize(18), zIndex: 1000
                        }}>
                          <Text style={{ fontSize: reText(9), color: 'white', textAlign: 'center', fontWeight: 'bold' }}>{countNoti > 9 ? '9+' : countNoti}</Text>
                        </View>
                        : null
                    }
                    <MaskedView
                      style={{ flexDirection: 'row', height: 25 }}
                      maskElement={
                        <View
                          style={{
                            backgroundColor: 'transparent',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Icon name={tab.name} color='red' size={25} style={styles.shadow} />
                        </View>
                      }>
                      <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={this.props.theme.colorLinear.color}
                        style={{ flex: 1 }}
                      />
                    </MaskedView>
                  </View>
                </View>
              </Animated.View>
            </React.Fragment>
          );
        })}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  theme: state.theme,
  thongbao: state.thongbao,
  auth: state.auth
});

export default Utils.connectRedux(StaticTabbar2, mapStateToProps, true)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 64
  },
  activeIcon: {
    // backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  shadow: {
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  }
});
