// import React from 'react';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import HeaderFilterOption from '../../Components/DichVuCong/HeaderFilterOption';
// import TimeOptionPicker from '../../Components/DichVuCong/TimeOptionPicker';
// import UnitOptionPicker from '../../Components/DichVuCong/UnitOptionPicker';

// const Tab = createMaterialTopTabNavigator();
// const Drawer = createDrawerNavigator();

// const TabBarDvcFilterOption = ()=>{
//     return (
//         <React.Fragment>
//             <HeaderFilterOption/>
//             <Drawer.Navigator
//                 screenOptions = {{
//                     swipeEnabled:false,
//                     gestureEnabled:false
//                 }}
//             >
//                 <Tab.Screen name="TimeOptionPicker" component={TimeOptionPicker} />
//                 <Tab.Screen name="UnitOptionPicker" component={UnitOptionPicker} />
//             </Drawer.Navigator>
//         </React.Fragment>

//     );
// }

// export default TabBarDvcFilterOption;

import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator, createAppContainer } from 'react-navigation'
import TimeOptionPicker from '../../Components/DichVuCong/TimeOptionPicker';
import UnitOptionPicker from '../../Components/DichVuCong/UnitOptionPicker';
import HeaderFilterOption from '../../Components/DichVuCong/HeaderFilterOption';

const TabScreen = createMaterialTopTabNavigator(
    {
        TimeOptionPicker: { screen: TimeOptionPicker },
        UnitOptionPicker: { screen: UnitOptionPicker },
    },
    {
        tabBarPosition: 'top',
        swipeEnabled: false,
        animationEnabled: true,
        tabBarComponent: HeaderFilterOption,
    }
);

const TabBarDvcFilterOption = createStackNavigator({
    TabScreen: {
        screen: TabScreen,
        navigationOptions: {
            headerStyle: {
                backgroundColor: 'transparent',
            },
        },
    },
}, {
    mode: 'modal',
    // headerMode: 'none',
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
});

export default TabBarDvcFilterOption;
