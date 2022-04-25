import React, { Component } from 'react';
import {
  Keyboard,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Platform,
  Animated
} from 'react-native';

import { Images } from '../../srcAdmin/images';
import { nstyles, colors } from '../styles';
import { sizes } from '../../styles/size';
import Utils from '../../app/Utils';
import { ImagesChat } from '../Images';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

// const myIcon = <AntDesign name="rocket" size={30} color="#900" />;

class TabBarChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    };
    keyboardDidShowListener = {};
    keyboardDidHideListener = {};
  }
  componentWillMount() {
    // Keyboard.addListener('keyboardDidShow', e => this.keyboardDidShow(e));
    // Keyboard.addListener('keyboardDidHide', e => this.keyboardDidHide(e));
  }

  componentWillUnmount() {
    // this.keyboardDidShowListener.remove();
    // this.keyboardDidHideListener.remove();
  }

  keyboardDidShow(e) {
    this.setState({ visible: false });
  }
  keyboardDidHide(e) {
    this.setState({ visible: true });
  }

  tabClick = (screen, index) => () => {
    switch (screen) {
      case 'st_QuanTam':
        break;
      case 'st_ChuyenMuc':
        break;
      default:
        break;
    }
    Utils.goscreen(this, screen);
  };
  render() {
    if (!this.state.visible && Platform.OS == 'android') return null;
    else {
      const { nrow, nmiddle, shadown } = nstyles.nstyles;
      const { index } = this.props.navigation.state;
      let tempIndex = index;
      if (index == 0 || index > 1) tempIndex = 0;
      return (
        <View
          style={[
            nstyles.nstyles.nfooter,
            nrow,
            nstyles.nstyles.shadow,
            {
              width: '100%',
              height: nstyles.heightBot + 10 - (Platform.OS == 'ios' ? 10 : 15),
              shadowOffset: { width: 0, height: 0 },
              backgroundColor: colors.white
            }
          ]}
        >
          <View
            style={[
              {
                flex: 1,
                marginTop: 10
              }
            ]}
          >
            <TouchableOpacity
              onPress={this.tabClick('sc_MainChat')}
              style={[{ alignItems: 'center' }]}
            >
              {/* <Image
                source={ImagesChat.icMessage}
                style={[
                  {
                    tintColor:
                      tempIndex === 0
                        ? colors.colorHeaderApp
                        : colors.colorGrayText
                  },
                  ,
                  nstyles.nstyles.nIcon24
                ]}
                resizeMode="contain"
              /> */}
              <AntDesign name="message1" size={24} color={tempIndex === 0
                ? colors.colorHeaderApp
                : colors.colorGrayText} />
              <Text
                style={[
                  {
                    color:
                      tempIndex === 0
                        ? colors.colorHeaderApp
                        : colors.colorGrayText
                  },
                  {
                    alignSelf: 'center',
                    marginLeft: 5,
                    fontSize: sizes.sText12
                  }
                ]}
              >
                {'Tin nhắn'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, marginTop: 10 }}>
            <TouchableOpacity
              onPress={this.tabClick('sc_MainDanhBa')}
              style={[{ alignItems: 'center' }]}
            >
              {/* contacts */}
              <AntDesign name="contacts" size={24} color={tempIndex === 1
                ? colors.colorHeaderApp
                : colors.colorGrayText} />
              <Text
                style={[
                  {
                    color:
                      tempIndex === 1
                        ? colors.colorHeaderApp
                        : colors.colorGrayText
                  },
                  {
                    alignSelf: 'center',
                    marginLeft: 5,
                    fontSize: sizes.sText12
                  }
                ]}
              >
                {'Danh bạ'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}
export default TabBarChat;
