import React, { Component, useRef } from 'react'
import { TouchableOpacity, View, Text, Image } from "react-native"
import DatePicker from 'react-native-datepicker'
import InputRNCom from "../../../components/ComponentApps/InputRNCom"
import { Images } from '../../images'
import { colors } from "../../../styles"
import { reText } from '../../../styles/size'

const CompTenDangNhap = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center',
        }}
        labelText={'Tên đăng nhập'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        maxLength={props.maxlength}
        editable={props.isEdit}
        placeholder={"Nhập tên đăng nhập"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        errorText={'Số điện thoại không đúng'}
        // helpText={'CMND: Chứng minh nhân dân, CCCD: Căn cước công dân'}
        editable={true}
        keyboardType='numeric'
        valid={true}
        prefix={null}
        value={props.value}
        sufixlabel={<View>
            <Text style={{ fontSize: 16, color: colors.redStar }}>{'*'}</Text>
        </View>}
        onChangeText={props.onChangTextIndex}
        prefix={
            <View style={{
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            </View>
        }

    />)
}

const CompHoTen = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center', maxHeight: 100
        }}
        labelText={'Họ và tên'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        editable={props.isEdit}
        placeholder={"Nhập họ và tên"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Nơi cấp không hợp lệ'}
        // helpText={'Số định danh sẽ được sử dụng làm ID đăng nhập tài khoản'}
        editable={true}
        // multiline={true}
        sufixlabel={<View>
            <Text style={{ fontSize: 16, color: colors.redStar }}>{'*'}</Text>
        </View>}
        valid={true}
        prefix={null}
        value={props.value}
        onChangeText={props.onChangTextIndex}
        prefix={
            <View style={{
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* <Text style={{ fontWeight: 'bold' }}>{'Nguyên quán:'}</Text> */}
            </View>
        }

    />)
}

const CompNgaySinh = (props) => {
    const ref = useRef()
    const onPress = () => {
        ref.current.onPressDate();
    }
    return (<TouchableOpacity onPress={props.isEdit ? onPress : () => { }}>
        <View pointerEvents='none'>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.brownGreyTwo, borderRadius: 7,
                    alignItems: 'center', paddingVertical: 0
                }}

                labelText={'Ngày sinh'}

                styleLabel={{}}
                sufix={
                    <View style={{}}>
                        <DatePicker
                            style={{ borderWidth: 0, width: '100%', }}
                            date={props.value}
                            mode="date"
                            disabled={false}
                            placeholder="Chọn ngày sinh"
                            format="DD/MM/YYYY"
                            confirmBtnText="Xác nhận"
                            cancelBtnText="Hủy"
                            showIcon={false}
                            hideText={true}
                            locale='vi'
                            ref={ref}
                            customStyles={{
                                datePicker: {
                                    backgroundColor: '#d1d3d8',
                                    justifyContent: 'center',
                                },
                                dateInput: {
                                    paddingHorizontal: 5,
                                    borderWidth: 0,
                                    alignItems: 'flex-start',

                                }

                            }}
                            // hideText={true}

                            onDateChange={props.onChangTextIndex}
                        />
                    </View>

                }
                // sufixlabel={<View>
                //     <Text style={{ fontSize: 16, color: colors.redStar }}>{'*'}</Text>
                // </View>}
                placeholder={"Chọn ngày sinh"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_16}
                errorText={'Ngày sinh không hợp lệ'}
                // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                valid={true}

                value={props.value}
                onChangeText={props.onChangTextIndex}

            />
        </View>
    </TouchableOpacity>)
}


const CompSoDienThoai = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center',
        }}
        labelText={'Số điện thoại'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        maxLength={props.maxlength}
        editable={props.isEdit}
        placeholder={"Nhập số điện thoại"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        errorText={'Số điện thoại không đúng'}
        // helpText={'CMND: Chứng minh nhân dân, CCCD: Căn cước công dân'}
        editable={true}
        keyboardType='numeric'
        valid={true}
        prefix={null}
        value={props.value}
        onChangeText={props.onChangTextIndex}
        prefix={
            <View style={{
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            </View>
        }

    />)
}


const CompEmail = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center', maxHeight: 100
        }}
        labelText={'Email'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        editable={props.isEdit}
        placeholder={"Abc123@gmail.com"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Nơi cấp không hợp lệ'}
        // helpText={'Số định danh sẽ được sử dụng làm ID đăng nhập tài khoản'}
        editable={true}
        // multiline={true}
        valid={true}
        prefix={null}
        value={props.value}
        onChangeText={props.onChangTextIndex}
        prefix={
            <View style={{
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* <Text style={{ fontWeight: 'bold' }}>{'Nguyên quán:'}</Text> */}
            </View>
        }

    />)
}

const CompQuocTich = (props) => {
    return (<TouchableOpacity onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.brownGreyTwo, borderRadius: 7,
                    alignItems: 'center'
                }}
                labelText={'Quốc tịch'}

                styleLabel={{}}
                sufixlabel={<View>
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                </View>}
                placeholder={"Chọn quốc tịch"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_30}
                // errorText={'Số điện thoại không hợp lệ'}
                // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                editable={false}

                valid={true}
                prefix={null}
                value={props.value}
                onChangeText={props.onChangTextIndex}
                sufix={
                    <View style={{
                        height: 30, width: 30,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Image
                            defaultSource={Images.iconApp}
                            source={Images.icDropDown}
                            style={{ width: 15, height: 15 }} resizeMode='contain' />
                    </View>
                }

            />
        </View>

    </TouchableOpacity>)
}

const CompNguyenQuan = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center', maxHeight: 100
        }}
        labelText={'Nguyên quán'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        editable={props.isEdit}
        placeholder={"Nhập nguyên quán"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Nơi cấp không hợp lệ'}
        // helpText={'Số định danh sẽ được sử dụng làm ID đăng nhập tài khoản'}
        editable={true}
        // multiline={true}
        valid={true}
        prefix={null}
        value={props.value}
        onChangeText={props.onChangTextIndex}
        sufixlabel={<View>
            <Text style={{ fontSize: 16, color: colors.redStar }}>{'*'}</Text>
        </View>}
        prefix={
            <View style={{
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* <Text style={{ fontWeight: 'bold' }}>{'Nguyên quán:'}</Text> */}
            </View>
        }

    />)
}

const CompDiaChiThuongTru = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center', maxHeight: 100
        }}
        labelText={'Địa chỉ thường trú'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        editable={props.isEdit}
        placeholder={"Nhập địa chỉ thường trú"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Nơi cấp không hợp lệ'}
        // helpText={'Số định danh sẽ được sử dụng làm ID đăng nhập tài khoản'}
        sufixlabel={<View>
            <Text style={{ fontSize: 16, color: colors.redStar }}>{'*'}</Text>
        </View>}
        editable={true}
        // multiline={true}
        valid={true}
        prefix={null}
        value={props.value}
        onChangeText={props.onChangTextIndex}
        prefix={
            <View style={{
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* <Text style={{ fontWeight: 'bold' }}>{'Nguyên quán:'}</Text> */}
            </View>
        }

    />)
}

const CompNhapDiaChiHienTai = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center', maxHeight: 100
        }}
        labelText={'Địa chỉ hiện tại'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        editable={props.isEdit}
        placeholder={"Nhập địa chỉ hiện tại"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Nơi cấp không hợp lệ'}   
        // helpText={'Số định danh sẽ được sử dụng làm ID đăng nhập tài khoản'}
        editable={true}
        sufixlabel={<View>
            <Text style={{ fontSize: 16, color: colors.redStar }}>{'*'}</Text>
        </View>}
        // multiline={true}
        valid={true}
        prefix={null}
        value={props.value}
        onChangeText={props.onChangTextIndex}
        prefix={
            <View style={{
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* <Text style={{ fontWeight: 'bold' }}>{'Nguyên quán:'}</Text> */}
            </View>
        }

    />)
}

const CompCMND = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center',
        }}
        labelText={'Chứng minh nhân dân'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        maxLength={props.maxlength}
        editable={props.isEdit}
        placeholder={"Nhập số CMND/CCCD"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        errorText={'Số định danh không hợp lệ'}
        // helpText={'CMND: Chứng minh nhân dân, CCCD: Căn cước công dân'}
        editable={true}
        keyboardType='numeric'
        valid={true}
        prefix={null}
        value={props.value}
        onChangeText={props.onChangTextIndex}
        prefix={
            <View style={{
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            </View>
        }

    />)
}

const CompNgayCap = (props) => {
    const ref = useRef()
    const onPress = () => {
        ref.current.onPressDate();
    }
    return (<TouchableOpacity onPress={props.isEdit ? onPress : () => { }}>
        <View pointerEvents='none'>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.brownGreyTwo, borderRadius: 7,
                    alignItems: 'center', paddingVertical: 0
                }}

                labelText={'Ngày cấp'}
                styleLabel={{}}
                sufix={
                    <View style={{}}>
                        <DatePicker
                            style={{ borderWidth: 0, width: '100%', }}
                            date={props.value}
                            mode="date"
                            disabled={false}
                            placeholder="Chọn ngày cấp"
                            format="DD/MM/YYYY"
                            confirmBtnText="Xác nhận"
                            cancelBtnText="Hủy"
                            showIcon={false}
                            hideText={true}
                            locale='vi'
                            ref={ref}
                            customStyles={{
                                datePicker: {
                                    backgroundColor: '#d1d3d8',
                                    justifyContent: 'center',
                                },
                                dateInput: {
                                    paddingHorizontal: 5,
                                    borderWidth: 0,
                                    alignItems: 'flex-start',

                                }

                            }}
                            // hideText={true}

                            onDateChange={props.onChangTextIndex}
                        />
                    </View>

                }
                sufixlabel={<View>
                    {/* <Text style={{ fontSize: 16, color: colors.redStar }}>{'*'}</Text> */}
                </View>}
                placeholder={"Chọn ngày cấp"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_16}
                errorText={'Ngày cấp không hợp lệ'}
                // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                valid={true}

                value={props.value}
                onChangeText={props.onChangTextIndex}

            />
        </View>
    </TouchableOpacity>)
}

const CompNoiCap = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center', maxHeight: 100
        }}
        labelText={'Nơi cấp'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        editable={props.isEdit}
        placeholder={"Nhập nơi cấp"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Nơi cấp không hợp lệ'}
        // helpText={'Số định danh sẽ được sử dụng làm ID đăng nhập tài khoản'}
        editable={true}
        // multiline={true}
        valid={true}
        prefix={null}
        value={props.value}
        onChangeText={props.onChangTextIndex}
        prefix={
            <View style={{
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* <Text style={{ fontWeight: 'bold' }}>{'Nguyên quán:'}</Text> */}
            </View>
        }

    />)
}

const CompGioiTinh = props => {
    return (
        <View pointerEvents={props.isEdit ? 'auto' : 'none'} style={{ flexDirection: 'row', marginHorizontal: 10, marginVertical: 10, alignItems: 'center', marginTop: 15 }}>
            <Text style={{ fontSize: reText(14) }}>Giới tính</Text>
            <TouchableOpacity onPress={() => props.onChangeGT(0)} style={{ flexDirection: 'row' }}>
                <Image source={props.value == 0 ? Images.icRadioChk : Images.icRadioUnChk} style={{ marginLeft: 20, }} />
                <Text style={{ marginLeft: 5, fontSize: reText(14), marginTop: 1 }}>Nam</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.onChangeGT(1)} style={{ flexDirection: 'row', }}>
                <Image source={props.value == 1 ? Images.icRadioChk : Images.icRadioUnChk} style={{ marginLeft: 20, }} />
                <Text style={{ marginLeft: 5, fontSize: reText(14), marginTop: 1 }}>Nữ</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.onChangeGT(2)} style={{ flexDirection: 'row', }}>
                <Image source={props.value == 2 ? Images.icRadioChk : Images.icRadioUnChk} style={{ marginLeft: 20, }} />
                <Text style={{ marginLeft: 5, fontSize: reText(14), marginTop: 1 }}>Khác</Text>
            </TouchableOpacity>

        </View>
    )
}
const CompForm = {
    CompTenDangNhap, CompHoTen, CompNgaySinh, CompSoDienThoai, CompEmail, CompQuocTich, CompNguyenQuan, CompDiaChiThuongTru, CompNhapDiaChiHienTai,
    CompCMND, CompNgayCap, CompNoiCap, CompGioiTinh
}
export default CompForm