/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import Login from './Navigation/Auth';
import MainApp from './Navigation/Main';
import { Provider, useDispatch, useSelector } from 'react-redux';

import Type from './Redux/Type';
import moment from 'moment';
import { Unit } from './Interface/Option';
import AsyncStorage from '@react-native-community/async-storage';

import { createSwitchNavigator } from "react-navigation";


// const Container = () => {
//     useEffect(() => {
//         let onSetInitOption = () => {
//             let dsThang = [],
//                 dsNam = [];
//             for (let i = 1; i <= 12; i++) {
//                 let thang: Unit = {
//                     ID: i,
//                     Name: `Tháng ${i}`
//                 };
//                 dsThang = [...dsThang, thang]
//             }

//             for (let i = 2020; i <= moment().year(); i++) {
//                 let nam: Unit = {
//                     ID: i,
//                     Name: `Năm ${i}`
//                 };
//                 dsNam = [...dsNam, nam]
//             }

//             dispatch({ type: Type.OPTION.NAM.LIST, value: dsNam });
//             dispatch({ type: Type.OPTION.NAM.CHON, value: moment().year() });
//             dispatch({ type: Type.OPTION.THANG.LIST, value: dsThang });
//             dispatch({ type: Type.OPTION.THANG.CHON_TAT_CA });
//         }
//         onSetInitOption();
//     }, [])
//     const [isShow, setIsShow] = useState(false);
//     const dispatch = useDispatch();
//     useEffect(() => {
//         let onCheck = async () => {
//             let token = await AsyncStorage.getItem(Type.USER.TOKEN),
//                 userInfo = await AsyncStorage.getItem(Type.USER.USER_INFO);
//             if (token && userInfo) {
//                 userInfo = JSON.parse(userInfo);
//                 dispatch({ type: Type.USER.TOKEN, value: token });
//                 dispatch({ type: Type.USER.USER_INFO, value: userInfo });
//                 dispatch({ type: Type.USER.SIGN_IN_STATE, value: true });
//             }
//             setIsShow(true)
//         };
//         onCheck().catch();

//     }, [dispatch, isShow])

//     const isSignIn = useSelector(state => state.User.SignInState);
//     c
//     const AppContainer = createAppContainer(!isSignIn ? Login : MainApp);
//     return (
//         <View style={{ flex: 1, backgroundColor: '#fff' }}>
//             {
//                 isShow ?
//                     // <NavigationContainer>
//                     //     {!isSignIn ?
//                     //         <Login/>
//                     //         :
//                     //         <MainApp/>
//                     //     }
//                     //     {/* <MainApp/> */}
//                     // </NavigationContainer>
//                     <AppContainer />
//                     :
//                     null
//             }
//         </View>
//     )
// }

// const AppIOC = () => {
//     return (
//         <Provider store={store}>
//             <Container />
//         </Provider>
//     )
// }

// export default AppIOC

const SwitchIOC = createSwitchNavigator({
    scLogin: {
        screen: Login,
    },
    scMainApp: {
        screen: MainApp,
    }
}, {
    initialRouteName: 'scLogin',
    navigationOptions: {
        tabBarVisible: false
    }
});

export default SwitchIOC;
