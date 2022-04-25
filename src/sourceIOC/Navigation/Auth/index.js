import * as React from 'react';
import LoginScreen from './LoginStack';
import PassCode from '../../Components/Login/PassCode';
import { createStackNavigator } from 'react-navigation';

// const AuthStack = createStackNavigator();
// const AuthScreen = props => {
//     return (
//         <AuthStack.Navigator mode="modal">
//             <AuthStack.Screen
//                 name="Main"
//                 options={{ headerShown: false }}
//             >
//                 {screenProps => <LoginScreen {...screenProps} onLogin={props.onLogin} />}
//             </AuthStack.Screen>
//             <AuthStack.Screen
//                 name="PassCodeModal"
//                 options={{ headerShown: false }}
//             >
//                 {screenProps => <PassCode {...screenProps} onLogin={props.onLogin} />}
//             </AuthStack.Screen>
//         </AuthStack.Navigator>
//     );
// };

const AuthScreen = createStackNavigator({
    Main: {
        screen: LoginScreen,
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    PassCodeModal: {
        screen: PassCode,
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    }
}, {
    headerMode: 'none',
}
)

export default AuthScreen;


