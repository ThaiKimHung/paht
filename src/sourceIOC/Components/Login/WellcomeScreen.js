import React, { useEffect, useState } from 'react';
import { Stack, Color, ButtonColor, Fit, StatusBar, Text, Screen, Font, Button } from '../Kit';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Type from '../../Redux/Type';
import moment from 'moment'
import { Unit } from '../../Interface/Option';
import AsyncStorage from '@react-native-community/async-storage';
import Loading from '../Kit/Loading';
import Utils from '../../../../app/Utils';
import { HeaderCus } from '../../../../components';
import { Images } from '../../../images';
import { colors } from '../../../../styles';
import { nstyles } from '../../../../styles/styles';
import COLOR from '../../../sourcequyhoach/Styles/Colors';

function WellComeScreen({ navigation }) {

    const [IsLoad, setIsLoad] = useState(true)
    const onLoginByPhone = () => navigation.navigate('LoginScreen');
    const dispatch = useDispatch();

    useEffect(() => {
        let onSetInitOption = () => {
            let dsThang = [],
                dsNam = [];
            for (let i = 1; i <= 12; i++) {
                let thang: Unit = {
                    ID: i,
                    Name: `Tháng ${i}`
                };
                dsThang = [...dsThang, thang]
            }

            for (let i = 2020; i <= moment().year(); i++) {
                let nam: Unit = {
                    ID: i,
                    Name: `Năm ${i}`
                };
                dsNam = [...dsNam, nam]
            }

            dispatch({ type: Type.OPTION.NAM.LIST, value: dsNam });
            dispatch({ type: Type.OPTION.NAM.CHON, value: moment().year() });
            dispatch({ type: Type.OPTION.THANG.LIST, value: dsThang });
            dispatch({ type: Type.OPTION.THANG.CHON_TAT_CA });
        }
        onSetInitOption();
        checkToken();
    }, [])

    const checkToken = async () => {
        // await AsyncStorage.setItem(Type.USER.TOKEN, "qmCDAyRazz9jeuAo4edFRrgk5GGZ/ENCS+NlLlWDvGet/dMANWO7msTpXLdXZ4lYAqI3GTqvtns8l3OgPx88UicWfT2xyy79EpkwG0BNu392VOz1xfJUIHjpNd8Ldatjqq3WSxKOefJkADjBlIrXHP/gcH6eShiwPQlEkncEaXw=");
        let token = await AsyncStorage.getItem(Type.USER.TOKEN, '')
        Utils.nlog('token=====', token)
        if (token) {
            setTimeout(() => {
                setIsLoad(false)
                Utils.navigate('scMainApp')
            }, 1000);
        } else {
            setIsLoad(false)
        }
    }
    return (
        <>
            <Stack backgroundColor={Color.white} flexFluid padding={20}>
                <StatusBar />
                <TouchableOpacity onPress={() => navigation.navigate('ManHinh_Home')} style={{ padding: 5 }}>
                    <Image source={Images.icBack} style={[nstyles.nIcon24, { tintColor: COLOR.blue }]} resizeMode={'contain'} />
                </TouchableOpacity>
                <View>
                    <Image
                        style={styles.image}
                        source={require('../../Assets/monitoring.png')}
                    />
                </View>
                <Stack flexFluid>
                    <Text bold size={Font.xxLarge} color={Color.primary}>IOC Tây Ninh</Text>
                    <Text style={styles.description} size={Font.medium}>Chào mừng bạn đến với cổng tra cứu thông tin giám sát điều hành thông minh IOC Tây Ninh.</Text>
                </Stack>
                {/*<Button color={Color.primary}*/}
                {/*        mode="contained"*/}
                {/*        onPress={() => console.log('Pressed')} uppercase = {false}>*/}
                {/*    Đăng nhập bằng Số điện thoại*/}
                {/*</Button>*/}
                <Stack style={styles.bottomView}>
                    <Button
                        disabled={IsLoad}
                        isLoading={IsLoad}
                        fullWidth
                        color={ButtonColor.fillPrimary}
                        title='Đăng nhập bằng Số điện thoại'
                        onPress={onLoginByPhone}
                    />
                </Stack>
            </Stack>
        </>
    )
}

export default WellComeScreen;

const styles = StyleSheet.create({
    image: {
        resizeMode: 'contain',
        width: Screen.width - 40,
        height: Screen.height * 0.4
    },
    description: {
        marginVertical: 3
    },
    bottomView: {
        alignItems: Fit.center,
        marginBottom: 30
    },
    orText: {
        marginTop: 25,
        marginBottom: 16
    }
})


