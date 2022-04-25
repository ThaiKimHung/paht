import * as React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Platform,
  Keyboard
} from 'react-native';
import * as shape from 'd3-shape';
import { Svg, Path } from 'react-native-svg';

import StaticTabbar from './StaticTabbar';
import Utils from '../../app/Utils';
import { colors } from '../../styles';
import { nheight, nstyles, nwidth, paddingBotX } from '../../styles/styles';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const height = 62;

const tabs = [
  {
    name: 'bell',
    screen: 'tab_Notificafion',
    title: 'Thông báo',
    isHome: false
  },
  {
    name: 'qrcode',
    screen: 'tab_QR_Home',
    title: 'Quét QR',
    isHome: false
  },
  {
    name: 'home',
    screen: 'ManHinh_Home',
    title: 'Trang chủ',
    isHome: true
  },
  {
    name: 'user',
    screen: 'tab_Person',
    title: 'Đăng nhập',
    isHome: false
  },
  {
    name: 'gear',
    screen: 'tab_Setting',
    title: 'Cài đặt',
    isHome: false
  }
];
const backgroundColor = 'white';

const getPath = (width, tabWidth): string => {
  let paddingBotXTemp = paddingBotX == 0 ? 0 : paddingBotX - 10;
  const left = shape
    .line()
    .x(d => d.x)
    .y(d => d.y)([
      { x: 0, y: 0 },
      { x: nwidth(), y: 0 }
    ]);
  const tab = shape
    .line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(shape.curveBasis)(
      [
        { x: nwidth() - 10, y: 0 },
        { x: nwidth() + 5, y: -1 },
        { x: nwidth() + 10, y: Platform.OS == 'android' ? 11 : 10 },
        { x: nwidth() + 15, y: Platform.OS == 'android' ? 23 : 25 },
        { x: nwidth() + tabWidth / 2, y: Platform.OS == 'android' ? 33 : 35 },
        { x: nwidth() + tabWidth - 15, y: Platform.OS == 'android' ? 23 : 25 },
        { x: nwidth() + tabWidth - 10, y: Platform.OS == 'android' ? 12 : 10 },
        { x: nwidth() + tabWidth - 5, y: -1 },
        { x: nwidth() + tabWidth + 10, y: 0 }
      ]);
  const right = shape
    .line()
    .x(d => d.x)
    .y(d => d.y)([
      { x: nwidth() + tabWidth, y: 0 },
      { x: nwidth() * 2, y: 0 },
      { x: nwidth() * 2, y: height + paddingBotXTemp },
      { x: 0, y: height + paddingBotXTemp },
      { x: 0, y: 0 }
    ]);
  return `${left} ${tab} ${right}`;
};

interface TabbarProps { }

// eslint-disable-next-line react/prefer-stateless-function
class Tabbar extends React.Component<TabbarProps> {
  constructor(props) {
    super(props);
    this.refTabs = React.createRef(null)
    this.state = {
      index: this.props.navigation.state.index,
      showTab: true,
    }
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    if (Platform.OS === 'android')
      this.setState({ showTab: false });
  }

  _keyboardDidHide = () => {
    if (Platform.OS === 'android')
      this.setState({ showTab: true });
  }
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.navigation.state.index !== this.props.navigation.state.index) {
  //     //Perform some operation
  //     this.setState({ index: nextProps.navigation.state.index, });
  //     this.refTabs.current.onPress(nextProps.navigation.state.index)
  //   }
  // }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.navigation.state.index != prevState.index) {
      // this.refTabs.current.onPress(nextProps.navigation.state.index)
      return {
        index: nextProps.navigation.state.index,
        // value: new Animated.Value(nextProps.navigation.state.index * nwidth() / tabs.length)
      }
    } else {
      return null
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.index !== this.state.index) {
      this.refTabs.onPress(this.state.index)
    }
  }
  render() {
    let paddingBotXTemp = paddingBotX == 0 ? 0 : paddingBotX - 10;
    const { Windows, isLandscape } = this.props.theme
    const { value = new Animated.Value(this.props.navigation.state.index * nwidth() / tabs.length) } = this.state;
    const translateX = value.interpolate({
      inputRange: [0, nwidth()],
      outputRange: [-nwidth(), 0]
    });
    const { index } = this.state;

    const { tokenCD, tokenDH, userDVC } = this.props.auth
    if (tokenCD.length > 0 || tokenDH.length > 0 || userDVC) {
      tabs[3].title = 'Cá nhân'
    } else {
      tabs[3].title = 'Đăng nhập'
    }

    return (
      <View style={[nstyles.shadow, { backgroundColor: colors.nocolor, position: 'absolute', bottom: 0, left: 0, right: 0 }]}>
        <View {...{ ...nheight(), ...nwidth() }} style={[{ marginTop: 1, height: this.state.showTab ? height + paddingBotXTemp : 0 }]}>
          <AnimatedSvg
            width={nwidth() * 2}
            {...{ height: height + paddingBotXTemp }}
            style={{ backgroundColor: colors.nocolor, transform: [{ translateX, }] }}
          >
            <Path fill={backgroundColor} {...{ d: getPath(nwidth(), nwidth() / tabs.length) }} />
          </AnimatedSvg>
          {
            this.state.showTab ? <View style={[StyleSheet.absoluteFill]}>
              <StaticTabbar ref={ref => this.refTabs = ref} {...{ tabs, value }} stateIndex={index} />
            </View> : null
          }
        </View>
      </View >
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor
  }
});

const mapStateToProps = state => ({
  auth: state.auth,
  theme: state.theme
});

export default Utils.connectRedux(Tabbar, mapStateToProps, true)