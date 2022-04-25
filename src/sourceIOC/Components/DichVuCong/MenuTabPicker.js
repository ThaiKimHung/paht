import React from 'react';
import { Stack, Color, Fit, Text, Font, Divider, ButtonColor } from '../Kit';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { IReducerType } from '../../Interface/Reducer';
import Type from '../../Redux/Type';
import Utils from '../../../../app/Utils';

export const menuTab = [
    { id: 0, name: 'Thông tin chung' },
    { id: 1, name: 'Cấp Sở-Ban-Ngành' },
    { id: 2, name: 'Cấp Huyện/TP/TX' },
    { id: 3, name: 'Cấp Xã/Phường' },
    { id: 4, name: 'Hồ sơ mức độ 3,4' }
]

const MenuTabPicker = (props) => {
    const idActive = useSelector((state: IReducerType) => state.Option.TypeOption);
    const dispatch = useDispatch();

    const onBack = () => {
        Utils.nlog('props 1 =======', props)
        Utils.BackStack()
    };

    const onChangeTab = (value) => () => {
        dispatch({ type: Type.OPTION.TYPE_OPTION, value })
        onBack()
    }

    const _renderMenu = (item) => {
        return (
            <SubItem
                key={item.id}
                title={item.name}
                isActive={idActive === item.id}
                onPress={onChangeTab(item.id)}
            />
        )
    }

    return (
        <View style={styles.background}>
            <View style={{ flex: 1 }} />
            <View style={styles.container}>
                <Stack horizontal>
                    <TouchableOpacity onPress={onBack}>
                        <Stack padding={16}>
                            <Text color={Color.primary} style={{ marginLeft: 4 }}>Quay lại</Text>
                        </Stack>
                    </TouchableOpacity>
                    <Stack flexFluid horizontalAlign={Fit.center}>
                        <View style={styles.dash} />
                    </Stack>
                    <View style={{ width: 90 }} />
                </Stack>
                <Divider.Horizontal />
                <Stack padding={16}>
                    {menuTab.map(_renderMenu)}
                </Stack>
            </View>
        </View>
    );
};

export default MenuTabPicker;


type SubProps = {
    title?: string,
    isActive?: boolean,
    onPress(): void
}

const SubItem = (props: SubProps) => {
    return (
        <TouchableOpacity onPress={props.onPress} style={styles.subView(props.isActive)}>
            {props.isActive ?
                <Text color={Color.primary}>{props.title}</Text>
                :
                <Text>{props.title}</Text>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        backgroundColor: Color.white,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12
    },
    headerTitle: {
        fontSize: Font.mediumPlus,
        color: Color.gray100
    },
    dash: {
        height: 6,
        width: 40,
        borderRadius: 2,
        backgroundColor: Color.gray50,
        marginTop: 10
    },
    subView: (isActive) => ({
        height: 38,
        paddingHorizontal: 8,
        justifyContent: 'center',
        backgroundColor: isActive ? ButtonColor.smoothPrimary.backgroundColor : null,
        borderRadius: 5,
        marginVertical: 5
    })
});
