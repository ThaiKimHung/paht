import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Platform
} from 'react-native';
import { colors } from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Utils from '../app/Utils';
import { ImagesChat } from './Images';
import PropTypes from 'prop-types';
import { nstyles } from '../styles/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { reText, reSize } from './styles/size';

const InputChat = (props) => {
  const inputRef = useRef();
  const [onValue, setonValue] = useState(true);
  const [valueMessage, setvalueMessage] = useState('');

  // useImperativeHandle(ref, () => ({
  //   reSetValue: () => {
  //     setvalueMessage('');
  //   }
  // }));

  const {
    style,
    containerStyle,
    onChangeText,
    onPressSend,
    onPressCamera,
    onPressIconChat,
    ...propstype
  } = props;
  useEffect(() => {
    if (props.value == '') {
      onChangeText(props.value);
    }
  }, [props.value]);

  return (
    <View
      style={{
        backgroundColor: 'white'
      }}
    >
      <View>{props.ViewProps}</View>
      <View
        style={[
          configstyle.container,
          { containerStyle, paddingHorizontal: 5 }
        ]}
      >
        <View
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <TouchableOpacity
            onPress={() => {
              props.onChooseImgae();
            }}
            style={[{ borderRadius: 30, padding: 5 }]}
          >
            <AntDesign name="appstore-o" size={30} color={colors.peacockBlue} />
          </TouchableOpacity>
        </View>

        <TextInput
          ref={inputRef}
          returnKeyLabel="thêm"
          returnKeyType="done"
          multiline={true}
          style={[configstyle.input, style, {
            // textAlign: 'center'
            // paddingTop: 5
          }]}
          // {...propstype}
          editable={true}
          textAlignVertical='center'
          placeholder={'Aa'}
          autoCorrect={false}
          // value={props.value}
          value={valueMessage}
          onChangeText={text => {
            if (text.length == 0) {
              setonValue(true);
            } else {
              setonValue(false);
            }
            setvalueMessage(text);
          }}
        />
        <View
          style={{
            alignItems: 'center',
            paddingHorizontal: 5,
            paddingVertical: 5,
            justifyContent: 'flex-end'
          }}
        >
          {onValue ? (
            <View
              style={{
                width: 70,
                justifyContent: 'flex-end',
                paddingVertical: 5,
                paddingHorizontal: 5,
                flexDirection: 'row',
                alignItems: 'flex-end'
              }}
            >
              <View
                style={{
                  justifyContent: 'space-evenly',
                  flexDirection: 'row',
                  width: '100%'
                }}
              >
                <TouchableOpacity onPress={onPressCamera}>

                  <AntDesign name="camerao" size={30} color={colors.peacockBlue} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressIconChat}>

                  {/* smileo */}
                  <AntDesign name="smileo" size={30} color={colors.peacockBlue} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
              <TouchableOpacity
                style={{ paddingVertical: 5, }}
                onPress={() => {
                  setonValue(true);
                  onPressSend(valueMessage);
                  setvalueMessage('');
                }}
              >
                <Image
                  source={ImagesChat.icSendMsg}
                  style={[
                    nstyles.nIcon30,
                    { marginBottom: 3, tintColor: colors.peacockBlue, }
                  ]}
                ></Image>
              </TouchableOpacity>
            )}
        </View>
      </View>
    </View>
  );
};
const configstyle = StyleSheet.create({
  input: {
    flex: 1,
    padding: 0,
    fontSize: reText(18),
    color: colors.black_80,
    borderRadius: reSize(20),
    paddingHorizontal: reSize(20),
    backgroundColor: colors.colorGrayBgr,
    paddingTop: Platform.OS == 'ios' ? 15 : 10,
    justifyContent: 'center',
    maxHeight: reSize(120),
  },
  icLeft: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  icIconLeft: {
    tintColor: colors.colorHeaderApp,
    width: 24,
    height: 24
  },
  container: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white'
  }
});

InputChat.propTypes = {
  onPressIconChat: PropTypes.func,
  onPressSend: PropTypes.func,
  onPressCamera: PropTypes.func
};

InputChat.defaultProps = {
  onPressIconChat: () => { },
  onPressSend: () => { },
  onPressCamera: () => { }
};

// const InputChat = forwardRef(_InputChat);
export default InputChat;
