import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import {
    createStackNavigator, createBottomTabNavigator,
    createSwitchNavigator, createDrawerNavigator
} from 'react-navigation';
import {
    Easing, Animated, Image, Text, View
} from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import Main from '../Components/MapView/MapView';
import Login from '../Components/Profile/Login';
import Search from '../Components/Search/SearchPanel';
import Location from '../Components/Location';
import ProfileMenu from '../Components/Profile/MenuAction';
import MenuLayer from '../Components/Layer/MenuLayer';
{/* <RootStack.Screen */}
//                     name="ChangePassword"
//                     component={Login}
//                     options={{cardStyle: styles.search}}
//                 />
const MainStackScreenQuyhoach = createStackNavigator(
    {
        MainQH: {
            screen: Main,
            path: 'mainquyhoach',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        ProfileMenu: {
            screen: ProfileMenu,
            path: 'ProfileMenu',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        Location: {
            screen: Location,
            path: 'Location',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        Search: {
            screen: Search,
            path: 'Search',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        MenuLayer: {
            screen: MenuLayer,
            path: 'ProfileMenu',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        LoginQH: {
            screen: Login,
            path: 'LoginQH',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
        // <RootStack.Screen
        // //                     name="ProfileMenu"
        // //                     component={ProfileMenu}
        // //                 />
    },
    {
        headerMode: 'none',

    }
);
const RootStackScreenQuyhoach = createStackNavigator(
    {
        RootMainQH: {
            screen: MainStackScreenQuyhoach,
            path: 'mainquyhoach',
            navigationOptions: {
                header: null,
                animationEnabled: true
            },
        },
    },
    {
        mode: 'modal',
        headerMode: 'none',
        navigationOptions: {
            tabBarVisible: false
        }
    }
);
export default RootStackScreenQuyhoach




// const modalOption = {
//     headerShown: false,
//     cardOverlayEnabled: true,
//     swipeEnabled: true,
//     cardStyle: {backgroundColor: 'transparent'},
//     gestureEnabled: true,
//     cardStyleInterpolator: ({ current, layouts }) => ({
//         cardStyle: {
//             transform: [
//                 {
//                     translateY: current.progress.interpolate({
//                         inputRange: [0, 1],
//                         outputRange: [layouts.screen.height, 0],
//                     }),
//                 },
//             ],
//         },
//         overlayStyle: {
//             opacity: current.progress.interpolate({
//                 inputRange: [0, 1],
//                 outputRange: [0, .6],
//             })
//         }
//     }),
//     gestureResponseDistance: {vertical: 300},
// };

// const RootStack = createStackNavigator();


// const RootStackScreen = () => {
//     return (
//         <NavigationContainer>
//             <RootStack.Navigator mode="modal" screenOptions={modalOption}>
//                 <RootStack.Screen name="Main" component={MainStackScreen}/>
//                 <RootStack.Screen
//                     name="Login"
//                     component={Login}
//                     options={{cardStyle: styles.search}}
//                 />
//                 <RootStack.Screen
//                     name="ChangePassword"
//                     component={Login}
//                     options={{cardStyle: styles.search}}
//                 />
//                 <RootStack.Screen
//                     name="Search"
//                     component={Search}
//                     options={{
//                         cardStyle: styles.search,
//                         gestureResponseDistance: {vertical: 120},
//                     }}
//                 />
//                 <RootStack.Screen
//                     name="Location"
//                     component={Location}
//                     options={{cardStyle: styles.search}}
//                 />
//                 <RootStack.Screen
//                     name="ProfileMenu"
//                     component={ProfileMenu}
//                 />
//                 <RootStack.Screen
//                     name="MenuLayer"
//                     component={MenuLayer}
//                     options={{cardStyle: styles.search}}
//                 />
//             </RootStack.Navigator>
//         </NavigationContainer>
//     );
// };

// const MainStack = createStackNavigator();
// const MainStackScreen = () => {
//     return (
//         <MainStack.Navigator initialRouteName="Note" headerMode="none">
//             <MainStack.Screen name="Home" component={Main}/>
//         </MainStack.Navigator>
//     );
// };

// export default RootStackScreen;

// const styles = {
//     search: {
//         ...StyleSheet.absoluteFill,
//         top: 20,
//         borderTopLeftRadius: 12,
//         borderTopRightRadius: 12
//     },
// };
