import React, { useEffect, useState } from 'react';
import { Stack, Color, Text, Fit, IconButton, Divider, Font, StatusBar } from '../Kit';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { _renderChart } from '../Chart';
import { paddingTopMul } from '../../../../styles/styles';



const Detail = ({ navigation, route }) => {


    const [chart, setChart] = useState(null);
    // {
    //     title: props.title,
    //     routeProps,
    //     data: props.fullData,
    // }
    useEffect(() => {
        let renderChart = _renderChart(navigation.getParam('data'), navigation.getParam('routeProps'))
        setChart(renderChart);
    }, [])
    const onBack = () => navigation.goBack();


    return (
        <View style={styles.container}>
            <StatusBar />
            <Stack style={styles.headerBar}>
                <IconButton
                    iconName={'arrow-left'}
                    onPress={onBack}
                />
                <Text size={Font.mediumPlus} bold style={styles.headerTitle}>{navigation.getParam('title')}</Text>
            </Stack>
            <Divider.Horizontal />
            <ScrollView>
                <Stack padding={16} style={{ marginBottom: 20 }}>
                    {chart}
                    {/* {chart ? chart : <ActivityIndicator size="small" color={Color.secondary} />} */}
                </Stack>
            </ScrollView>
        </View>
    )
}

export default Detail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
    },
    headerBar: {
        height: 57,
        paddingTop: paddingTopMul() - 10,
        flexDirection: Fit.row,
        alignItems: Fit.center,
        paddingHorizontal: 5
    },
    headerTitle: {
        flex: 1,
        marginLeft: 5,
    },
})
