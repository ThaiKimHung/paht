import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Color, Fit, Font, Stack, Text } from '../Kit';
import Background from '../Kit/Background';
import LeftRowChart from './LeftRowChart';
import FullRowChart from './HorizontalFullRowChart';
import DoubleContentRowChart from './DoubleContentRowChart';
import { IChart } from '../../Interface/Chart';
import Utils from '../../../../app/Utils';


export const TYPE = {
    'LEFT_ROW': 'LEFT_ROW',
    'FULL_ROW': 'FULL_ROW',
    'DOUBLE_CONTENT_ROW': 'DOUBLE_CONTENT_ROW',
};

const Chart = (props: IChart) => {
    const { isError, isEmpty, isLoading } = props;
    const [chart, setChart] = useState(null);
    const data = props.data;
    const isDetail = props.isDetail;

    useEffect(() => {
        if (Array.isArray(data)) {
            let renderChart = _renderChart(data, props);
            setChart(renderChart);
        }
    }, [data]);

    Utils.navigate()
    const onShowAllPress = () => {
        let routeProps: IChart = {
            ...props,
            onLoadData: null,
            data: null,
            fullData: null,
        };
        Utils.navigate('DVCDetail', {
            title: props.title,
            routeProps,
            data: props.fullData,
        });
    };


    return (
        <Stack>
            {
                !isDetail ?
                    <Stack
                        horizontal
                        horizontalAlign={Fit.spaceBetween}
                        verticalAlign={Fit.center}
                        marginVertical={10}
                    >
                        <Text bold size={Font.mediumPlus}>{props.title}</Text>
                        {!(isError || isEmpty || isLoading) ?
                            <TouchableOpacity onPress={onShowAllPress}>
                                <Text color={Color.primary}>Tất cả</Text>
                            </TouchableOpacity>
                            : null
                        }
                    </Stack> : null
            }
            {(isError || isLoading || isEmpty) ?
                <Background
                    isLoading={isLoading}
                    isEmpty={isEmpty}
                    isError={isError}
                    onTryPress={props.onLoadData}
                    height={320}
                />
                :
                <View style={styles.container}>
                    {chart}
                </View>
            }
        </Stack>
    );
};

export default Chart;

export const _renderChart = (dataList, props) => {
    return dataList.map((item) => {
        switch (props.chartType) {
            case TYPE.LEFT_ROW: {
                return (
                    <LeftRowChart
                        key={item.ID}
                        color={props.color[0]}
                        percent={item.percent}
                        value={item.value}
                        title={item.title}
                    />
                );
            }
            case TYPE.FULL_ROW: {
                const leftPercent = item.leftPercent ? item.leftPercent : 0;
                const rightPercent = (item.rightValue != 0) ? (100 - leftPercent) : 0;
                return (
                    <FullRowChart
                        key={item.ID}
                        color={props.color}
                        leftPercent={item.leftPercent}
                        leftValue={item.leftValue + ' (' + leftPercent.toFixed(1) + '%)'}
                        rightValue={item.rightValue + ' (' + rightPercent.toFixed(1) + '%)'}
                        rightPercent={rightPercent}
                        title={item.title}
                        leftTitle={props.leftTitle}
                        rightTitle={props.rightTitle}
                    />
                );
            }
            case TYPE.DOUBLE_CONTENT_ROW: {
                const rootPercent = item.rootPercent;
                const leftPercent = item.leftPercent ? item.leftPercent : 0;
                const rightPercent = item.rightPercent ? item.rightPercent : 0;
                const middlePercent = item.middlePercent ? item.middlePercent : 0;
                const leftValue = (rootPercent == 100) ? (item.leftValue + " (" + leftPercent.toFixed(1) + ' %)') : item.leftValue;
                const rightValue = (rootPercent == 100) ? (item.rightValue + " (" + rightPercent.toFixed(1) + ' %)') : item.rightValue;
                const middleValue = (rootPercent == 100) ? (item.middleValue + " (" + middlePercent.toFixed(1) + ' %)') : item.middleValue;

                return (
                    <DoubleContentRowChart
                        key={item.ID}
                        color={props.color}
                        leftPercent={leftPercent}
                        leftValue={leftValue}
                        rightValue={rightValue}
                        rightPercent={rightPercent}
                        title={item.title}
                        leftTitle={props.leftTitle}
                        rightTitle={props.rightTitle}
                        rootPercent={rootPercent}
                        middleTitle={props.middleTitle}
                        middleValue={middleValue}
                        middlePercent={middlePercent}
                    />
                );
            }
            default:
                return null;
        }
    });
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        paddingBottom: 10
    },
});


