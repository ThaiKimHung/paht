import React from 'react';
import { Stack, Color, Text } from '../Kit';
import { StyleSheet, View } from 'react-native';
import { IRowChart } from '../../Interface/Chart';
import { RowChartTitle } from './HorizontalFullRowChart';


const DoubleContentRowChart = (props: IRowChart) => {
    return (
        <Stack marginVertical={5}>
            <RowChartTitle
                title={props.title}
                rightTitle={props.rightTitle}
                leftTitle={props.leftTitle}
                rightValue={props.rightValue}
                leftValue={props.leftValue}
                color={props.color}
                middleTitle={props.middleTitle}
                middleValue={props.middleValue}
            />
            <View style={styles.rowChartBackground}>
                {props.rootPercent ?
                    <View style={styles.rowChart(props.rootPercent, Math.round(props.rightPercent) == 0 ? Color.gray30 : props.color[1])}>
                        {props.leftPercent ?
                            <View style={styles.rowChart(props.leftPercent, props.color[0])} />
                            : null
                        }
                        {props.middleValue ?
                            <View style={styles.rowChart(props.middlePercent, props.color[2])} />
                            : null
                        }
                    </View>
                    : null
                }
            </View>
        </Stack>
    )
}

export default DoubleContentRowChart

const styles = StyleSheet.create({
    rowChartBackground: {
        height: 10,
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: Color.gray30
    },
    rowChart: (width, color) => ({
        width: `${width}%`,
        backgroundColor: color,
        height: '100%',
        flexDirection: 'row'
    })
})


