import React from 'react'
import { TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View } from 'react-native'
import Utils from '../../../../app/Utils';
import { colors } from '../../../../styles';
import { paddingBotX } from '../../../../styles/styles';

const tabTKIOC = [
    {
        keyScreen: "tab_TongQuan",
        label: 'Tổng quan',
    },
    {
        keyScreen: "tab_DonVi",
        label: 'Đơn vị xử lý',
    },
    {
        keyScreen: "tab_LinhVuc",
        label: 'Lĩnh vực',
    }
]

const TabBarBieuDo = (props) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                height: 40 + paddingBotX,
                backgroundColor: colors.black,
                paddingBottom: paddingBotX
            }}
        >
            {tabTKIOC.map((item, index) => {
                const isFocused = props.navigation?.state?.index === index;
                const onPress = () => {
                    if (!isFocused) {
                        Utils.goscreen({ props }, item.keyScreen)
                    }
                };
                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        onPress={onPress}
                        style={{
                            flex: 1, alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isFocused ? '#5E5CE6' : colors.black,
                            borderRadius: 5,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                color: colors.white
                            }}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

export default TabBarBieuDo

const styles = StyleSheet.create({})

