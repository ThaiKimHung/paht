import React from 'react';
import { Color, Font, CheckButton } from '../Kit';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { IReducerType } from '../../Interface/Reducer';
import { OptionState } from '../../Interface/Option';
import { Unit } from '../../Interface/Option';
import Type from '../../Redux/Type';


const UnitOptionPicker = () => {
    const Option: OptionState = useSelector((state: IReducerType) => state.Option);

    const dispatch = useDispatch();

    const onUnitSelected = (value) => () => dispatch({ type: Type.OPTION.DONVI.CHON, value: value });
    const onUnitSelectedAll = () => dispatch({ type: Type.OPTION.DONVI.CHON_TAT_CA });

    const checkSelected = (value) => Option.DonVi.Chon.includes(value);

    const _renderUnit = (item: Unit) => (
        <CheckButton
            key={item.ID}
            title={item.Name}
            checked={checkSelected(item.ID)}
            onValueChange={onUnitSelected(item.ID)}
        />
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.body}>
                <CheckButton
                    title={'Tất cả'}
                    checked={Option.DonVi.IsAll}
                    onValueChange={onUnitSelectedAll}
                />
                {Option.DonVi.DanhSach.map(_renderUnit)}
            </ScrollView>
        </View>
    );
};

export default UnitOptionPicker;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
    },
    body: {
        paddingHorizontal: 16,
        paddingBottom: 30,
        paddingTop: 20
    },
    headerTitle: {
        fontSize: Font.mediumPlus,
        color: Color.gray100
    }
});
