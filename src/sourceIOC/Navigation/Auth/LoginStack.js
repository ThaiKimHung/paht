import * as React from 'react';

import WellComeScreen from '../../Components/Login/WellcomeScreen';
import Login from '../../Components/Login/Login';
import { createStackNavigator } from 'react-navigation';

// const LoginStack = createStackNavigator();
// const LoginScreen = ({onLogin}) =>
// {
//     return (
//         <LoginStack.Navigator>
//             <LoginStack.Screen
//                 name="WellComeScreen"
//                 options={{headerShown:false}}
//             >
//                 {screenProps => <WellComeScreen {...screenProps} onLogin={onLogin}/>}
//             </LoginStack.Screen>
//             <LoginStack.Screen
//                 name="LoginScreen"
//                 options={{headerShown:false}}
//                 component = {Login}
//             />
//         </LoginStack.Navigator>
//     )
// }

const LoginScreen = createStackNavigator({
    WellComeScreen: {
        screen: WellComeScreen,
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    LoginScreen: {
        screen: Login,
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    }
}, {
    headerMode: 'none',
}
)

export default LoginScreen


