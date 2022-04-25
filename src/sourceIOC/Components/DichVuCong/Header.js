import React, { useEffect } from 'react';
import { ButtonColor, Color, Fit, Font, IconButton, Stack, StatusBar, Text, Divider } from '../Kit';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { IReducerType } from '../../Interface/Reducer';
import { menuTab } from './MenuTabPicker';
import Utils from '../../../../app/Utils';
import { paddingTopMul } from '../../../../styles/styles';

const HeaderBar = (props) => {

    const timeTitle = useSelector((state: IReducerType) => state.Option.TimeTitle);
    const unitTitle = useSelector((state: IReducerType) => state.Option.DonViTitle);
    const option = useSelector((state: IReducerType) => state.Option.TypeOption);

    const onOpenDrawerMenu = () => {
        Utils.nlog('props headerbar', props)
        props.toggleDrawer()
    };

    const onFilterOptionPress = () => Utils.navigate("FilterOption");

    const onMenuTabPress = () => Utils.navigate("MenuTabPicker");

    return (
        <View>
            <StatusBar color={Color.gray10} />
            <View style={styles.headerView}>
                <IconButton
                    iconName={'arrow-left'}
                    color={Color.primary}
                    onPress={() => props.navigate('ManHinh_Home')}
                />
                <Stack flexFluid>
                    <Text numberOfLines={1} size={Font.mediumPlus} color={Color.gray100} >Dịch vụ công</Text>
                    <TouchableOpacity onPress={onMenuTabPress}>
                        <Stack horizontal verticalAlign={Fit.center} paddingVertical={3}>
                            <Text bold size={Font.xLarge} color={Color.black}>{menuTab[option].name}</Text>
                            <Icon name='arrow-down-drop-circle' style={styles.topIcon} />
                        </Stack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onFilterOptionPress} style={{ marginRight: 5 }}>
                        <Stack horizontal verticalAlign={Fit.center}>
                            <Text color={Color.primary}>{timeTitle}</Text>
                            <Icon name='record' style={styles.titleIcon} />
                            <Text style={{ flex: 1 }} numberOfLines={1} color={Color.primary}>{unitTitle}</Text>
                            <Icon name='menu-down' size={25} color={Color.primary} />
                        </Stack>
                    </TouchableOpacity>
                </Stack>
                {/*<TouchableOpacity onPress={onDateOptionPress} style={styles.dateFilter}>*/}
                {/*    <Icon name={'calendar'} color={Color.primary} size={Font.large} />*/}
                {/*    <Text color={Color.primary} style={{ marginLeft: 5 }}>{timeTitle}</Text>*/}
                {/*    <Icon name={'menu-down'} color={Color.primary} size={Font.large} />*/}
                {/*</TouchableOpacity>*/}
                <IconButton
                    iconName={'apps'}
                    color={Color.primary}
                    onPress={onOpenDrawerMenu}
                />
            </View>
            <Divider.Horizontal />
        </View>
    )
}

export default HeaderBar;


const styles = StyleSheet.create({
    headerView: {
        paddingVertical: 10,
        paddingLeft: 10,
        flexDirection: Fit.row,
        backgroundColor: Color.gray10,
        paddingTop: paddingTopMul() - 10
    },
    dateFilter: {
        paddingHorizontal: 8,
        justifyContent: Fit.center,
        alignItems: Fit.center,
        marginRight: 10,
        height: 36,
        borderRadius: 5,
        flexDirection: Fit.row,
        borderColor: ButtonColor.outlinePrimary.borderColor,
        borderWidth: 1
    },
    topIcon: {
        marginTop: 3,
        marginLeft: 10,
        color: Color.primary,
        fontSize: 16
    },
    titleIcon: {
        fontSize: 10,
        color: Color.primary,
        marginHorizontal: 5
    }
})
