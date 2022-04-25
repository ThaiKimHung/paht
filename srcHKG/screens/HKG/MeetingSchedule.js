import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image, SafeAreaView
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Images } from '../../../src/images';
import { nstyles } from '../../../styles/styles';
import { ConfigScreen } from '../../navigation';
import HeaderHKG from '../Component/HeaderHKG';
import { appConfig } from '../../../app/Config';
import moment from 'moment'
import Utils from '../../../app/Utils';
const { height } = Dimensions.get('window');


class MeetingSchedule extends Component {
  constructor(props) {
    super(props);
    this.idcn = Utils.ngetParam(this, "idtv", ''); //: params.idtv,
    this.state = {
      items: {},
      date: moment(new Date()).format('YYYY-MM-DD'),
      refresh: false,
      dataSource: [],
      refreshing: true,
    }
    this.listflag = {};
  }

  loadItems = (day) => {
    // let thang = day.month;
    // let nam = day.year;
    // if (this.listflag[thang + "_" + nam]) {
    //   return;
    // }
    // this.listflag[thang + "_" + nam] = true;
    console.log(`Load Items for -------`, day);
    // setTimeout(() => {
    const url = appConfig.domain + `api/hop-khong-giay/getngay?nam=${day.year}&thang=${day.month}&idtv=${this.idcn}`;
    console.log("urrl---------", url);
    fetch(url, {
      method: 'GET',
      headers: {
        Token: 'rpNuGJebgtBEp0eQL1xKnqQG'
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        Utils.nlog("mang", responseJson.data)
        responseJson = responseJson.data;
        if (responseJson) {
          this.setState({
            items: { ...this.state.items, ...responseJson },
          });
        }
      });
    console.log(`Load Items for ${day.year}-${moment(day).format('MM')} `);
    // }, 1000);

  }

  componentDidMount() {
    // this.loadItems(new Date())
  }
  renderItem = (item) => {
    return (
      <TouchableOpacity style={styles.btnSignInStyle} onPress={() => Utils.navigate('DetailMeeting', { idcuochop: item.ID, screen: 'MeetingSchedule', isCheck: 1 })}>
        <View style={[styles.item,]}>
          <Text onlayout={this.handleTexlayout}>{item.TenCH}</Text>
        </View>
      </TouchableOpacity >
    );
  }

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}><Text>Không có lịch họp</Text></View>
    );
  }
  rowHasChanged = (r1, r2) => {
    // Utils.nlog("r0", r1)
    return r1.ID !== r2.ID;
  }

  timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={nstyles.ncontainer}>
        <HeaderHKG
          onPressLeft={() => navigate(ConfigScreen.HomeHKG)}
          title={'Lịch họp'}
          iconLeft={Images.icBack}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <Agenda
            // onDayPress={this.onDayPress}
            items={this.state.items}
            loadItemsForMonth={this.loadItems}
            selected={this.state.date}
            renderItem={this.renderItem}
            renderEmptyDate={this.renderEmptyDate}
            renderEmptyData={() => null}
            rowHasChanged={this.rowHasChanged}
            pastScrollRange={10}
            onDayChange={(day) => {
              this.setState({
                date: `${day.year}-${day.month}-${day.day}`
              });
              // Utils.nlog("on change day", date)
            }}
            refreshing={false}
            refreshControl={null}
            theme={{
              agendaDayTextColor: '#eb432d',
              agendaDayNumColor: '#eb432d',
              agendaTodayColor: '#eb432d',
              agendaKnobColor: '#eb432d'
            }}
          />
        </SafeAreaView>
      </View>

    );
  }
}
export default MeetingSchedule

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 40
  },
  thanh1: {
    backgroundColor: 'red',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 5,
  },
  icon_menu: {
    width: 30,
    height: 30,
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 5,
  },
});
