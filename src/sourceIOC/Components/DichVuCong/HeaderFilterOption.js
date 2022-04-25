import React, { useState } from 'react';
import { Stack, Color, Fit, Text } from '../Kit';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import Segment from '../Kit/Segment';
import Utils from '../../../../app/Utils';

const DataSegment = [
    { id: 'TimeOptionPicker', title: "Thời gian", key: 0 }, //TimeOptionPicker
    { id: 'UnitOptionPicker', title: "Đơn vị", key: 1 } //UnitOptionPicker
]


const HeaderFilterOption = (props) => {
    const onBack = () => {

        props.navigation.pop()
    };
    const [activeTab, setActiveTab] = useState(DataSegment[0].id)

    const onTabChange = (key) => {
        Utils.navigate(key);
        setActiveTab(key);
    }

    console.log('props tab', props.navigationState)

    return (
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
            <View style={styles.segmentView}>
                <Segment
                    data={DataSegment}
                    onChange={onTabChange}
                    active={props.navigationState}
                />
            </View>
        </View>
    );
};

export default HeaderFilterOption;



const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.white,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: Color.gray30
    },
    segmentView: {
        marginHorizontal: 16
    },
    dash: {
        height: 6,
        width: 40,
        borderRadius: 2,
        backgroundColor: Color.gray50,
        marginTop: 10
    }
});
