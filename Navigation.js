import {
    createStackNavigator, createBottomTabNavigator,
    createSwitchNavigator, createDrawerNavigator
} from 'react-navigation';
import {
    Easing, Animated, Image, Text, View
} from 'react-native';
import { AppStack } from './src/routers/screen';
import { AppStack_Admin } from './srcAdmin/routers/screen';