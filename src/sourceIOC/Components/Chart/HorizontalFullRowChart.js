import React from 'react';
import { Stack, Color, Text, Fit } from '../Kit';
import { StyleSheet, View } from 'react-native';
import { IRowChart } from '../../Interface/Chart';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FullRowChart = (props: IRowChart) => {
    return (
        <Stack marginVertical={5}>
            <RowChartTitle
                title={props.title}
                rightTitle={props.rightTitle}
                leftTitle={props.leftTitle}
                rightValue={props.rightValue}
                leftValue={props.leftValue}
                color={props.color}
            />
            <View style={styles.rowChartBackground(props.rightPercent != 0 ? props.color[1] : Color.gray30)}>
                {props.leftPercent ?
                    <View style={styles.rowChart(props.leftPercent, props.color[0])} />
                    : null
                }
            </View>
        </Stack>
    )
}

export default FullRowChart;

type IRowChartTitle = {
    title: string,
    leftValue?: string,
    rightValue?: string,
    leftTitle?: string,
    rightTitle?: string,
    color: string[],
    middleTitle?: string,
    middleValue?: string
}

export const RowChartTitle = (props: IRowChartTitle) => {
    return (
        <Stack
            verticalAlign={Fit.center}
            marginVertical={8}
        >
            <Text color={Color.black}>{props.title}</Text>
            <Stack horizontal verticalAlign={Fit.center} marginVertical={5}>
                <Stack flexFluid>
                    <Stack horizontal verticalAlign={Fit.center}>
                        <Icon name='record' color={props.color[0]} style={{ marginRight: 5 }} />
                        <Text numberOfLines={1} color={Color.gray100}>{props.leftTitle}</Text>
                    </Stack>
                    <Text bold style={styles.value}>{props.leftValue}</Text>
                </Stack>
                {props.middleTitle ?
                    <Stack flexFluid horizontalAlign={Fit.center}>
                        <Stack horizontal verticalAlign={Fit.center}>
                            <Icon name='record' color={props.color[2]} style={{ marginRight: 5 }} />
                            <Text numberOfLines={1} color={Color.gray100}>{props.middleTitle}</Text>
                        </Stack>
                        <Text bold style={styles.value}>{props.middleValue}</Text>
                    </Stack>
                    : null
                }
                <Stack flexFluid horizontalAlign={Fit.flexEnd}>
                    <Stack horizontal verticalAlign={Fit.center}>
                        <Icon name='record' color={props.color[1]} style={{ marginRight: 5 }} />
                        <Text numberOfLines={1} color={Color.gray100}>{props.rightTitle}</Text>
                    </Stack>
                    <Text bold style={styles.value}>{props.rightValue}</Text>
                </Stack>
            </Stack>
        </Stack>
    )
}

const styles = StyleSheet.create({
    rowChartBackground: color => ({
        height: 10,
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: color
    }),
    rowChart: (width, color) => ({
        width: `${width}%`,
        backgroundColor: color,
        height: '100%'
    }),
    value: {

    }
})


