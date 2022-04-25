import React from 'react';
import { Stack, Color, Fit, Text, Font, Dash, IconButton, RadioButton, CheckButton } from '../Kit';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { IReducerType } from '../../Interface/Reducer';
import { OptionState } from '../../Interface/Option';
import { Unit } from '../../Interface/Option';
import Type from '../../Redux/Type';


const TimeOptionPicker = () => {
    const Option: OptionState = useSelector((state: IReducerType) => state.Option);

    const dispatch = useDispatch();

    const onMonthSelected = (value) => () => dispatch({ type: Type.OPTION.THANG.CHON, value: value });

    const onMonthSelectAll = () => dispatch({ type: Type.OPTION.THANG.CHON_TAT_CA });

    const checkSelected = (value) => Option.Thang.Chon.includes(value);

    const onYearSelected = (value) => () => dispatch({ type: Type.OPTION.NAM.CHON, value: value });

    const _renderMonth = (item: Unit) => (
        <CheckButton
            key={item.ID}
            title={item.Name}
            checked={checkSelected(item.ID)}
            onValueChange={onMonthSelected(item.ID)}
        />
    );

    const _renderYear = (item: Unit) => (
        <RadioButton
            key={item.ID}
            title={item.Name}
            checked={(Option.Nam.Chon == item.ID)}
            onValueChange={onYearSelected(item.ID)}
        />
    );

    return (
        <View style={styles.container}>
            <ScrollView>
                <Stack marginHorizontal={20} style={{ paddingBottom: 20 }}>
                    <Stack paddingVertical={10}>
                        <Text style={styles.headerTitle}>Chọn năm</Text>
                        <Stack paddingVertical={10}>
                            {Option.Nam.DanhSach.map(_renderYear)}
                        </Stack>
                    </Stack>
                    <Stack>
                        <Text style={styles.headerTitle}>Chọn tháng</Text>
                        <Stack paddingVertical={10}>
                            <CheckButton
                                title={'Cả năm'}
                                checked={Option.Thang.IsAll}
                                onValueChange={onMonthSelectAll}
                            />
                            {Option.Thang.DanhSach.map(_renderMonth)}
                        </Stack>
                    </Stack>
                </Stack>
            </ScrollView>
        </View>
    );
};

export default TimeOptionPicker;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        backgroundColor: Color.white,
        flex: 1,
        paddingBottom: 30,
        paddingTop: 5
    },
    headerTitle: {
        fontSize: Font.mediumPlus,
        color: Color.gray100
    }
});
