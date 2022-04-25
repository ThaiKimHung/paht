import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native'
import InputRNCom from '../../../../components/ComponentApps/InputRNCom';
import { colors } from '../../../../styles';
import { reText } from '../../../../styles/size';
import DatePicker from 'react-native-datepicker';
import { Images } from '../../../../src/images';
export const ComponentLinhVuc = (props) => {
    return (
        <TouchableOpacity onPress={props.isEdit ? props.onPress : () => { }}>
            <View pointerEvents={"none"}>
                <InputRNCom
                    styleContainer={{ paddingHorizontal: 15, marginTop: 5 }}
                    styleBodyInput={{
                        borderColor: colors.colorGrayIcon,
                        borderRadius: 3,
                        borderWidth: 0.5,
                        minHeight: 40,
                        alignItems: "center",
                        paddingVertical: 0,
                    }}
                    labelText={props.title}
                    styleLabel={{
                        color: colors.colorGrayText,
                        fontWeight: "bold",
                        fontSize: reText(14),
                    }}
                    // sufixlabel={<View>
                    //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                    // </View>}
                    placeholder={props.placeholder}
                    styleInput={{}}
                    styleError={{ backgroundColor: "white" }}
                    styleHelp={{ backgroundColor: "white" }}
                    placeholderTextColor={colors.black_20}
                    // errorText={'Tôn giáo không hợp lệ'}
                    // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                    editable={false}
                    valid={true}
                    prefix={null}
                    value={props.value}
                    onChangeText={props.onChangTextIndex}
                    sufix={
                        <View
                            style={{
                                height: 30,
                                width: 30,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Image
                                // defaultSource={Images.icDropDown}
                                source={Images.icDropDown}
                                style={{ width: 15, height: 15 }}
                                resizeMode="contain"
                            />
                        </View>
                    }
                />
            </View>
        </TouchableOpacity>
    );
};
export const ComponentChonNgay = (props) => {
    const ref = useRef();
    const onPress = () => {
        ref.current.onPressDate();
    };
    return (
        <TouchableOpacity
            onPress={props.isEdit ? onPress : () => { }}
            style={{ width: "50%" }}
        >
            <View pointerEvents="none" style={{ width: "100%" }}>
                <InputRNCom
                    styleContainer={{ paddingHorizontal: 5, width: "100%" }}
                    styleBodyInput={{
                        borderColor: colors.colorGrayIcon,
                        borderRadius: 3,
                        borderWidth: 0.5,
                        minHeight: 40,
                        alignItems: "center",
                        paddingVertical: 0,
                        width: "100%",
                    }}
                    labelText={props.title}
                    styleLabel={{
                        color: colors.colorGrayText,
                        fontWeight: "bold",
                        fontSize: reText(14),
                    }}
                    sufix={
                        <View style={{ alignItems: "center", flexDirection: "row" }}>
                            <View
                                style={{
                                    height: 30,
                                    width: 30,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Image
                                    // defaultSource={Images.icCalendar}
                                    source={Images.icCalendar}
                                    style={{ width: 15, height: 15 }}
                                    resizeMode="contain"
                                />
                            </View>
                            <DatePicker
                                style={{ borderWidth: 0, width: "0%" }}
                                date={props.value}
                                mode="date"
                                disabled={false}
                                placeholder={props.placeholder}
                                format="DD/MM/YYYY"
                                confirmBtnText="Xác nhận"
                                cancelBtnText="Huỷ"
                                showIcon={false}
                                androidMode="spinner"
                                hideText={true}
                                locale="vi"
                                ref={ref}
                                customStyles={{
                                    datePicker: {
                                        backgroundColor: "#d1d3d8",
                                        justifyContent: "center",
                                    },
                                    dateInput: {
                                        paddingHorizontal: 5,
                                        borderWidth: 0,
                                        alignItems: "flex-start",
                                    },
                                }}
                                // hideText={true}

                                onDateChange={props.onChangTextIndex}
                            />
                        </View>
                    }
                    placeholder={props.placeholder}
                    styleInput={{}}
                    styleError={{ backgroundColor: "white" }}
                    styleHelp={{ backgroundColor: "white" }}
                    placeholderTextColor={colors.black_16}
                    // errorText={'Ngày sinh  không hợp lệ'}
                    // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                    valid={true}
                    value={props.value}
                    onChangeText={props.onChangTextIndex}
                />
            </View>
        </TouchableOpacity>
    );
};
