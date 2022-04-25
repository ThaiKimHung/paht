import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, nstyles } from './styles';
import { Images } from '../srcAdmin/images';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { sizes } from '../styles/size';
import Utils from '../app/Utils';
import moment from 'moment';
import { PulseIndicator } from 'react-native-indicators';

const ItemDSChat = props => {
  const { data = {} } = props;
  const { NewMessInfo = {}, LastSeenMessString } = data;
  const { CreatedDateString = '', setNew = false } = NewMessInfo ? NewMessInfo : {};
  const { styleTitle, styleContainer, isLeft, isRight, onPress } = props;
  const LenDate = CreatedDateString ? CreatedDateString.length : LastSeenMessString;
  const days = CreatedDateString ? CreatedDateString.slice(0, 10) : LastSeenMessString.slice(0, 10);
  const time = CreatedDateString ? CreatedDateString.slice(11, LenDate) : LastSeenMessString.slice(11, LenDate);
  const NgayHT = new Date();
  const timeHT = moment(NgayHT, 'HH:mm:ss').format('HH:mm:ss');
  const songay = moment(NgayHT, 'DD/MM/YYYY').diff(
    moment(days, 'DD/MM/YYYY'),
    'days'
  );
  const sophut = moment(timeHT, 'HH:mm:ss').diff(
    moment(time, 'HH:mm:ss'),
    'minutes'
  );
  const sothang = Math.floor(songay / 30);
  const sogio = Math.floor(sophut / 60);
  const thu = moment(days, 'DD/MM/YYYY').weekday();
  const formatHour = time => {
    if (time > '12:00') return time + ' PM';
    else return time + ' AM';
  };
  const formatNgay = time => {
    switch (time) {
      case 0:
        return 'T2';
      case 1:
        return 'T3';
      case 2:
        return 'T4';
      case 3:
        return 'T5';
      case 4:
        return 'T6';
      case 5:
        return 'T7';
      case 6:
        return 'CN';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        configstyle.container,
        { paddingVertical: 10, backgroundColor: 'white' }
      ]}
    >

      <View
        style={[
          {
            paddingVertical: 10,
            alignItems: 'center',
            justifyContent: 'center'
          }
        ]}
      >

        <View style={[configstyle.icLeft, {}]}>
          <Image
            resizeMode='cover'
            source={{ uri: `${data.Avata}` }}
            style={[configstyle.icIconLeft, { borderRadius: 50, borderColor: data.Active == 1 ? colors.colorBlueLight : colors.grayLight, borderWidth: 2 }]}
          ></Image>
          {data.NumMessage > 0 ? (
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: -5,
                paddingHorizontal: 5,
                borderRadius: 30,
                backgroundColor: 'green',
                zIndex: 1000,
                elevation: 1000
              }}
            >
              <Text
                style={{ fontSize: 14, color: 'white', fontWeight: 'bold' }}
              >
                {data.NumMessage}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      <View style={{ flex: 1, paddingLeft: 10, justifyContent: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Text
            allowFontScaling={false}
            style={[configstyle.styleTitle, styleTitle]}
          >
            {' '}
            {data.GroupName ? data.GroupName : ''}
          </Text>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text
              allowFontScaling={false}
              style={[
                { color: colors.brownGreyTwo, fontSize: sizes.sText12 },
                styleTitle
              ]}
            >
              {`${
                songay == 0 && sophut < 60
                  ? `${sophut} phút`
                  : sogio >= 1 && sothang < 1 && songay < 1
                    ? formatHour(time)
                    : songay <= 6
                      ? formatNgay(thu)
                      : days
                }`}
            </Text>

          </View>

        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text allowFontScaling={false} numberOfLines={1}
            style={[configstyle.chat, styleTitle, { flex: 1 }]}>
            {' '}
            {data.NewMessInfo
              ? data.NewMessInfo.Comment || data.NewMessInfo.MessShow
              : 'Các bạn hiện đã được kết nối trên Chat'}
          </Text>
          <View>
            {
              setNew ? <PulseIndicator
                color={colors.colorBlue}
                size={20} count={15} /> : null
            }
          </View>

        </View>
      </View>
    </TouchableOpacity>
  );
};
const configstyle = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 10
  },

  icLeft: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 0.5
    // padding: 5
  },
  icIconLeft: {
    // tintColor: 'black',
    borderRadius: 20,
    width: 50,
    height: 50
  },
  styleTitle: {
    flex: 1,
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold'
  },
  chat: {
    color: 'gray'
  }
});
export default ItemDSChat;
