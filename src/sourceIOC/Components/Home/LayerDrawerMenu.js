import React from 'react';
import { Stack, Color, Fit, Text, Font, StatusBar } from '../Kit';
import { StyleSheet, View } from 'react-native';
import DrawerItem from '../Kit/Drawer';
import { useDispatch, useSelector } from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Type from '../../Redux/Type';
import { UserInfo } from '../../Interface/User';
import { DrawerItemItf } from '../Kit/Drawer';
import AsyncStorage from '@react-native-community/async-storage';
import Utils from '../../../../app/Utils';

const menu: DrawerItemItf[] = [
    {
        ID: "HomeDrawer",
        Name: "Dịch vụ công",
        IconName: "account-settings",
        SubMenu: []
    },
    {
        ID: "YteDrawer",
        Name: "Y tế",
        IconName: "account-settings",
        SubMenu: []
    }
]


const LayerDrawerMenu = ({ navigation, state }) => {
    const user: UserInfo = useSelector(state => state.User.UserInfo)
    const dispatch = useDispatch();
    const signOut = async () => {
        await AsyncStorage.multiRemove([Type.USER.USER_INFO, Type.USER.TOKEN])
        dispatch({ type: Type.USER.SIGN_IN_STATE, value: false })
        Utils.navigate('WellComeScreen')
    };

    const onMenuPress = (item) => () => {
        navigation.toggleDrawer();

        setTimeout(() =>
            navigation.navigate(item.ID)
            , 150)
    }

    Utils.nlog('data map drawer', navigation.state)
    return (
        <Stack flexFluid backgroundColor={Color.white}>
            <StatusBar />
            <View style={styles.topViewImage}>
                {/* <Text size={Font.mediumPlus} style={{marginBottom: 5}}>{user.FullName}</Text> */}
                {/* <Text color={Color.gray100}>{user.PhoneName}</Text> */}
            </View>
            <View style={{ paddingVertical: 10 }}>
                {menu.map((item, index) => (
                    <DrawerItem
                        key={item.ID}
                        title={item.Name}
                        iconName={item.IconName}
                        subMenu={item.SubMenu}
                        onPress={onMenuPress(item)}
                        isActive={navigation.state.index === index}
                    />
                ))}
            </View>
            <View style={styles.horizontalDivider} />
            <View style={{ height: 10 }} />
            <DrawerItem
                title={'Đăng xuất'}
                onPress={signOut}
                iconName='account-arrow-right'
                color={Color.primary}
            />
        </Stack>
    )
}

export default LayerDrawerMenu;

const styles = StyleSheet.create({
    topViewImage: {
        paddingVertical: 20,
        justifyContent: Fit.center,
        borderBottomColor: Color.gray50,
        borderBottomWidth: 1,
        paddingHorizontal: 16
    },
    image: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
        marginTop: 10,
        marginBottom: 8
    },
    horizontalDivider: {
        height: 1,
        backgroundColor: Color.gray30
    },

})
