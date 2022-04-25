import {
    createStackNavigator, createBottomTabNavigator,
    createSwitchNavigator, createDrawerNavigator
} from 'react-navigation';
import {
    Easing, Animated, Image, Text, View
} from 'react-native';
import HomeHKG from '../screens/HKG/HomeHKG';
import Search from '../screens/HKG/Search';
import MeetingSchedule from '../screens/HKG/MeetingSchedule';
import HopTrongNgay from '../screens/HKG/DayMeeting';
import NewMeeting from '../screens/HKG/NewMeeting';
import ThongBaoHKG from '../screens/HKG/ThongBao';
import LichCongTac from '../screens/HKG/LichCongTac';
import DetailMeeting from '../screens/HKG/DetailMeeting';
export const ConfigScreen = {
    HomeHKG: 'HomeHKG',
    DSCuocHop: 'SearchHKG',
    MeetingSchedule: 'MeetingSchedule',
    DayMeeting: 'DayMeeting',
    NewMeeting: 'NewMeeting',
    ThongBao: 'ThongBaoHKG',
    LichCongTac: 'LichCongTacHKG',
    DetailMeeting: 'DetailMeeting'

}

const stackHKG = createStackNavigator(
    {

        [ConfigScreen.HomeHKG]: {
            screen: HomeHKG,
            navigationOptions: {
                header: null,
                animationEnabled: true,
            },
        },
        [ConfigScreen.DSCuocHop]: {
            screen: Search,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        [ConfigScreen.MeetingSchedule]: {
            screen: MeetingSchedule,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        [ConfigScreen.DayMeeting]: {
            screen: HopTrongNgay,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        [ConfigScreen.NewMeeting]: {
            screen: NewMeeting,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        [ConfigScreen.ThongBao]: {
            screen: ThongBaoHKG,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        [ConfigScreen.LichCongTac]: {
            screen: LichCongTac,
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        [ConfigScreen.DetailMeeting]: {
            screen: DetailMeeting,
            path: 'chitiethkg/:idcuochop',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        // LichCongTac lich công tac cònig check box DetailMeeting
        // NewMeeting ThongBaoHKG
        // MeetingSchedule
    },
    {
        // initialRouteName: [ConfigScreen.HomeHKG],
        headerMode: 'none',
        navigationOptions: {
            tabBarVisible: false
        }
    }
);
export default stackHKG