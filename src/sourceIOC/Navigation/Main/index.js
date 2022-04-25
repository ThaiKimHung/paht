import * as React from 'react';
import { StyleSheet } from 'react-native';
// import {createStackNavigator} from '@react-navigation/stack';
import AppScreen from './MainApp';
import { modalOption } from './ModalAnim';
import TabBarDvcFilterOption from './TabbarDvcFilterOption';
import MenuTabPicker from '../../Components/DichVuCong/MenuTabPicker';
import { Screen } from '../../Components/Kit';
import { createStackNavigator } from 'react-navigation';


// const RootStack = createStackNavigator();

// const RootStackScreen = () => {
//     return (
//         <RootStack.Navigator
//             mode="modal"
//             screenOptions={modalOption}
//             headerMode="none"
//         >
//             <RootStack.Screen name="AppScreen" component={AppScreen}/>
//             <RootStack.Screen
//                 name="FilterOption"
//                 component={TabBarDvcFilterOption}
//                 options={{
//                     gestureResponseDistance: {vertical: 120},
//                     cardStyle:styles.search
//                 }}
//             />
//             <RootStack.Screen
//                 name="MenuTabPicker"
//                 component={MenuTabPicker}
//                 options={{
//                     gestureResponseDistance: {vertical: Screen.height}
//                 }}
//             />
//         </RootStack.Navigator>
//     );
// };

const RootStackScreen = createStackNavigator({
    AppScreen: {
        screen: AppScreen,
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    FilterOption: {
        screen: TabBarDvcFilterOption,
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    },
    MenuTabPicker: {
        screen: MenuTabPicker,
        navigationOptions: {
            header: null,
            animationEnabled: true
        },
    }
}, {
    mode: 'modal',
    headerMode: 'none',
    transitionConfig: () => ({
        containerStyle: {
            backgroundColor: 'transparent'
        }
    }),
    transparentCard: true,
    cardStyle: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        opacity: 1
    }
})

export default RootStackScreen;

const styles = {
    search: {
        ...StyleSheet.absoluteFill,
        top: 20,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12
    }
};
