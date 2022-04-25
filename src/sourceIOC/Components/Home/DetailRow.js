import React from 'react';
import {Stack, Color, Text, Font, Fit,Screen} from '../Kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet} from 'react-native';

type Props = {
    leftIcon?:string,
    leftTitle?:string,
    rightIcon?:string,
    rightTitle?:string,
    leftColor?:string,
    rightColor?:string,
    leftContent?:string,
    rightContent?:string
}

const DetailRow = (props:Props)=>
{
    return (
        <Stack horizontal style={styles.container} horizontalAlign={Fit.spaceBetween}>
            <Stack style={styles.boxView}>
                <Text color={Color.black}>{props.leftTitle}</Text>
                <Stack style={{marginVertical:10}} horizontal verticalAlign={Fit.center}>
                    <Stack horizontalAlign={Fit.center} verticalAlign={Fit.center} style={styles.boxIcon}>
                        <Icon name ={props.leftIcon} size={20} color={props.leftColor}/>
                    </Stack>
                    <Stack flexFluid style={{marginLeft:10}}>
                        <Text bold color={Color.black} size={Font.mediumPlus}>{props.leftContent}</Text>
                    </Stack>
                </Stack>
            </Stack>
            {props.rightTitle ?
                <Stack style={styles.boxView}>
                    <Text color={Color.black}>{props.rightTitle}</Text>
                    <Stack style={{marginVertical:10}} horizontal verticalAlign={Fit.center}>
                        <Stack horizontalAlign={Fit.center} verticalAlign={Fit.center} style={styles.boxIcon}>
                            <Icon name ={props.rightIcon} size={20} color={props.rightColor}/>
                        </Stack>
                        <Stack flexFluid style={{marginLeft:10}}>
                            <Text bold color={Color.black} size={Font.mediumPlus}>{props.rightContent}</Text>
                        </Stack>
                    </Stack>
                </Stack>
                : null
            }
        </Stack>
    )
}

export default DetailRow;

const SIZE = (Screen.width/2) - 18

const styles = StyleSheet.create({
    container:{
        marginVertical:5
    },
    boxView:{
        width:SIZE,
    },
    boxIcon:{
        height:36,
        width: 36,
        borderRadius:21,
        backgroundColor:Color.gray30
    }
})


