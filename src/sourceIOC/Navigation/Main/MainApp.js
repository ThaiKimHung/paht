import React from 'react';
import { View, Text } from 'react-native'
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../Components/Home';
import LayerDrawerMenu from '../../Components/Home/LayerDrawerMenu';
import Detail from '../../Components/DichVuCong/Detail';
import { modalOptionHorizontalSlide } from './ModalAnim';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import { Width } from '../../../../styles/styles';


const YTe = () => {
    return (
        <View>
            <Text>aweuqio</Text>
        </View>
    )
}


// const AppDrawer = createDrawerNavigator();
// const AppDrawerScreen = ({ onLogOut }) => (
//     <AppDrawer.Navigator
//         drawerContent={(props) => <LayerDrawerMenu {...props} onLogOut={onLogOut} />}
//         drawerStyle={{ width: '80%' }}
//     >
//         <AppDrawer.Screen name="HomeDrawer" component={Home} />
//         <AppDrawer.Screen name="YteDrawer" component={YTe} />
//     </AppDrawer.Navigator>
// );

const AppDrawerScreen = createDrawerNavigator({
    HomeDrawer: {
        screen: Home,
    },
    YteDrawer: {
        screen: YTe,
    },
}, {
    drawerWidth: Width(80),
    drawerPosition: 'right',
    contentComponent: props => <LayerDrawerMenu {...props} />,
    disableGestures: true,
    overlayColor: 'rgba(0,0,0,0.5)',
    drawerBackgroundColor: 'transparent'
})

// const AppStack = createStackNavigator();
// const AppScreen = () => {
//     return (
//         <AppStack.Navigator
//             headerMode="none"
//             mode="modal"
//             screenOptions={modalOptionHorizontalSlide}
//         >
//             <AppStack.Screen name="Home" component={AppDrawerScreen} />
//             <AppStack.Screen name="DVCDetail" component={Detail} />
//         </AppStack.Navigator>
//     )
// }

const AppScreen = createStackNavigator({
    Home: {
        screen: AppDrawerScreen
    },
    DVCDetail: {
        screen: Detail
    }
}, {
    headerMode: 'none',
    mode: 'modal',
})

export default AppScreen;
