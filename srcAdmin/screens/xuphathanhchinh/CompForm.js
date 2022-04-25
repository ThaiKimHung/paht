import React, { Component, useRef } from 'react'
import { TouchableOpacity, View, Text, Image } from "react-native"
import DatePicker from 'react-native-datepicker'
import InputRNCom from "../../../components/ComponentApps/InputRNCom"
import { Images } from '../../images'
import { colors } from "../../../styles"
import { nstyles } from '../../../styles/styles'

const CompCaNhanToChucViPham = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center'
        }}
        sufixlabel={<View>
            <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
        </View>}
        labelText={props.isCheckCaNhan ? 'Cá nhân vi phạm' : 'Người đại diện'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        editable={props.isEdit}
        placeholder={props.isCheckCaNhan ? 'Cá nhân vi phạm' : 'Người đại diện'}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Nơi cấp không hợp lệ'}
        // helpText={'Số định danh sẽ được sử dụng làm ID đăng nhập tài khoản'}
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

const CompTenCongTy = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center'
        }}
        labelText={'Tên công ty'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        sufixlabel={<View>
            <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
        </View>}
        editable={props.isEdit}
        placeholder={"Tên công ty"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Nơi cấp không hợp lệ'}
        // helpText={'Số định danh sẽ được sử dụng làm ID đăng nhập tài khoản'}
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

const CompMaSoCongTy = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center'
        }}
        labelText={'Giấy chứng nhận doanh nghiệp/ mã số doanh nghiệp'}
        sufixlabel={<View>
            <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
        </View>}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        editable={props.isEdit}
        placeholder={"Giấy chứng nhận doanh nghiệp/ mã số doanh nghiệp"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Nơi cấp không hợp lệ'}
        // helpText={'Số định danh sẽ được sử dụng làm ID đăng nhập tài khoản'}
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


const CompCapCoThamQuyenQDXP = (props) => {
    return (<TouchableOpacity disabled={!props.isEdit} onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.brownGreyTwo, borderRadius: 7,
                    minHeight: 40, alignItems: 'center'
                }}
                labelText={'Cấp có thẩm quyền quyết định xử phạt'}
                styleLabel={{}}
                sufixlabel={<View>
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                </View>}
                placeholder={"Cấp có thẩm quyền quyết định xử phạt"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_20}
                // errorText={'Số điện thoại không hợp lệ'}
                // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                editable={props.isEdit}

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
                            // defaultSource={Images.icDropDown}
                            source={Images.icDropDown}
                            style={{ width: 15, height: 15 }} resizeMode='contain' />
                    </View>
                }

            />
        </View>

    </TouchableOpacity>)
}

const CompCaNhanQDXP = (props) => {
    return (<TouchableOpacity disabled={!props.isEdit} onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.brownGreyTwo, borderRadius: 7,
                    minHeight: 40, alignItems: 'center'
                }}
                labelText={'Cá nhân quyết định xử phạt'}
                styleLabel={{}}
                sufixlabel={<View>
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                </View>}
                placeholder={"Cá nhân quyết định xử phạt"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_20}
                // errorText={'Số điện thoại không hợp lệ'}
                // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                editable={props.isEdit}

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
                            // defaultSource={Images.icDropDown}
                            source={Images.icDropDown}
                            style={{ width: 15, height: 15 }} resizeMode='contain' />
                    </View>
                }

            />
        </View>

    </TouchableOpacity>)
}

const CompNgaySinh = (props) => {
    const ref = useRef()
    const onPress = () => {
        ref.current.onPressDate();
    }
    return (<TouchableOpacity disabled={!props.isEdit} onPress={props.isEdit ? onPress : () => { }}>
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
                            showIcon={true}
                            iconSource={Images.icDatePicker}
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

                                },
                                dateIcon: {
                                    right: 5,
                                    ...nstyles.nIcon20
                                }

                            }}
                            // hideText={true}

                            onDateChange={props.onChangTextIndex}
                        />
                    </View>

                }
                sufixlabel={<View>
                    <Text style={{ fontSize: 16, color: colors.redStar }}>{'*'}</Text>
                </View>}
                placeholder={"Ngày sinh"}
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

const CompQuocTich = (props) => {
    return (<TouchableOpacity disabled={!props.isEdit} onPress={props.isEdit ? props.onPress : () => { }}>
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
                placeholder={"Quốc tịch"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_30}
                // errorText={'Số điện thoại không hợp lệ'}
                // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                editable={props.isEdit}

                valid={true}
                prefix={null}
                value={props.value}
                onChangeText={props.onChangTextIndex}
                sufix={
                    <View style={{
                        paddingVertical: 15,
                        // alignItems: 'center',
                        // justifyContent: 'center'
                    }}>
                        {/* <Image
                            defaultSource={Images.iconApp}
                            source={Images.icDropDown}
                            style={{ width: 15, height: 15 }} resizeMode='contain' /> */}
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
        placeholder={"Nguyên quán"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Nơi cấp không hợp lệ'}
        // helpText={'Số định danh sẽ được sử dụng làm ID đăng nhập tài khoản'}
        // multiline={true}
        sufixlabel={<View>
            <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
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

const CompNoiDKHKTT = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center'
        }}
        sufixlabel={<View>
            <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
        </View>}
        labelText={'Nơi đăng ký hộ khẩu thường trú'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        editable={props.isEdit}
        placeholder={"Nơi đăng ký hộ khẩu thường trú"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Nơi cấp không hợp lệ'}
        // helpText={'Số định danh sẽ được sử dụng làm ID đăng nhập tài khoản'}
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
const CompDiaChiHienTai = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center'
        }}
        labelText={props.isCheckCaNhan ? 'Địa chỉ hiện tại' : 'Địa chỉ'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        sufixlabel={<View>
            <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
        </View>}
        editable={props.isEdit}
        placeholder={props.isCheckCaNhan ? 'Địa chỉ hiện tại' : 'Địa chỉ'}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Nơi cấp không hợp lệ'}
        // helpText={'Số định danh sẽ được sử dụng làm ID đăng nhập tài khoản'}
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
        sufixlabel={<View>
            <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
        </View>}
        labelText={'Chứng minh nhân dân'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        maxLength={props.maxlength}
        editable={props.isEdit}
        placeholder={"Số CMND/CCCD"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        errorText={'Số định danh không hợp lệ'}
        // helpText={'CMND: Chứng minh nhân dân, CCCD: Căn cước công dân'}
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

const CompLinhVuc = (props) => {
    return (<TouchableOpacity disabled={!props.isEdit} onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.brownGreyTwo, borderRadius: 7,
                    alignItems: 'center'
                }}
                labelText={'Lĩnh vực'}
                styleLabel={{}}
                sufixlabel={<View>
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                </View>}
                placeholder={"Chọn lĩnh vực"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_30}
                // errorText={'Số điện thoại không hợp lệ'}
                // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                editable={props.isEdit}

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
                            // defaultSource={Images.iconApp}
                            source={Images.icDropDown}
                            style={{ width: 15, height: 15 }} resizeMode='contain' />
                    </View>
                }

            />
        </View>

    </TouchableOpacity>)
}

const CompHanhViViPham = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center',
        }}
        labelText={'Hành vi vi phạm hành chính đã thực hiện'}
        sufixlabel={<View>
            <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
        </View>}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        maxLength={props.maxlength}
        editable={props.isEdit}
        placeholder={"Nhập nội dung vi phạm"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Số định danh không hợp lệ'}
        // helpText={'CMND: Chứng minh nhân dân, CCCD: Căn cước công dân'}
        multiline={true}
        maxHeight={150}
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
const CompCanCuPhapLyXuPhat = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center'
        }}
        labelText={'Căn cứ pháp lý xử phạt'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        sufixlabel={<View>
            <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
        </View>}
        editable={props.isEdit}
        placeholder={"Nhập nội dung căn cứ pháp lý"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Nơi cấp không hợp lệ'}
        // helpText={'Số định danh sẽ được sử dụng làm ID đăng nhập tài khoản'}
        multiline={true}
        maxHeight={150}
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

const CompTongTienPhat = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center',
        }}
        labelText={'Tổng mức tiền phạt'}
        sufixlabel={<View>
            <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
        </View>}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        maxLength={props.maxlength}
        editable={props.isEdit}
        placeholder={"Nhập số tiền phạt"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Số định danh không hợp lệ'}
        // helpText={'CMND: Chứng minh nhân dân, CCCD: Căn cước công dân'}
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

const CompHinhThucPhatBoSung = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center'
        }}
        labelText={'Hình thức phạt bổ sung'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        // sufixlabel={<View>
        //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
        // </View>}
        editable={props.isEdit}
        placeholder={"Nhập hình thức phạt bổ sung"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Nơi cấp không hợp lệ'}
        // helpText={'Số định danh sẽ được sử dụng làm ID đăng nhập tài khoản'}
        multiline={true}
        maxHeight={150}
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

const CompBienPhapNganChan = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center'
        }}
        labelText={'Biện pháp ngăn chặn (nếu có)'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        // sufixlabel={<View>
        //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
        // </View>}
        editable={props.isEdit}
        placeholder={"Nhập biện pháp ngăn chặn"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Nơi cấp không hợp lệ'}
        // helpText={'Số định danh sẽ được sử dụng làm ID đăng nhập tài khoản'}
        multiline={true}
        maxHeight={150}
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

const CompNgayQDXP = (props) => {
    const ref = useRef()
    const onPress = () => {
        ref.current.onPressDate();
    }
    return (<TouchableOpacity disabled={!props.isEdit} onPress={props.isEdit ? onPress : () => { }}>
        <View pointerEvents='none'>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.brownGreyTwo, borderRadius: 7,
                    alignItems: 'center', paddingVertical: 0
                }}
                sufixlabel={<View>
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                </View>}
                labelText={'Ngày quyết định xử phạt có hiệu lực'}
                styleLabel={{}}
                helpText={'Vui lòng nhập ngày quyết định xử phạt có hiệu lực'}
                sufix={
                    <View style={{}}>
                        <DatePicker
                            style={{ borderWidth: 0, width: '100%', }}
                            date={props.value}
                            mode="date"
                            disabled={false}
                            placeholder="Chọn ngày"
                            format="DD/MM/YYYY"
                            confirmBtnText="Xác nhận"
                            cancelBtnText="Hủy"
                            showIcon={true}
                            iconSource={Images.icDatePicker}
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

                                },
                                dateIcon: {
                                    right: 5,
                                    ...nstyles.nIcon20
                                }

                            }}
                            // hideText={true}

                            onDateChange={props.onChangTextIndex}
                        />
                    </View>

                }
                sufixlabel={<View>
                    <Text style={{ fontSize: 16, color: colors.redStar }}>{'*'}</Text>
                </View>}
                placeholder={"Chọn ngày"}
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

const CompCoQuanThiHanh = (props) => {
    return (<TouchableOpacity disabled={!props.isEdit} onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.brownGreyTwo, borderRadius: 7,
                    alignItems: 'center'
                }}
                labelText={'Cơ quan thi hành'}
                styleLabel={{}}
                // sufixlabel={<View>
                //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                // </View>}
                placeholder={"Chọn cơ quan thi hành"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_30}
                // errorText={'Số điện thoại không hợp lệ'}
                // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                editable={props.isEdit}

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
                            // //defaultSource={Images.iconApp}
                            source={Images.icDropDown}
                            style={{ width: 15, height: 15 }} resizeMode='contain' />
                    </View>
                }

            />
        </View>

    </TouchableOpacity>)
}

const CompCaNhanCoTrachNhiemTCTH = (props) => {
    return (<TouchableOpacity disabled={!props.isEdit} onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.brownGreyTwo, borderRadius: 7,
                    alignItems: 'center'
                }}
                labelText={'Cá nhân có trách nhiệm tổ chức thi hành'}
                styleLabel={{}}
                // sufixlabel={<View>
                //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                // </View>}
                placeholder={"Cá nhân có trách nhiệm tổ chức thi hành"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_30}
                // errorText={'Số điện thoại không hợp lệ'}
                // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                editable={props.isEdit}
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
                            // defaultSource={Images.iconApp}
                            source={Images.icDropDown}
                            style={{ width: 15, height: 15 }} resizeMode='contain' />
                    </View>
                }

            />
        </View>

    </TouchableOpacity>)
}

const CompTrangThai = (props) => {
    return (<TouchableOpacity disabled={!props.isEdit} onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.brownGreyTwo, borderRadius: 7,
                    minHeight: 40, alignItems: 'center'
                }}
                labelText={'Trạng thái'}
                styleLabel={{}}
                sufixlabel={<View>
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                </View>}
                placeholder={"Chọn trạng thái"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_20}
                // errorText={'Số điện thoại không hợp lệ'}
                // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                editable={props.isEdit}

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
                            //defaultSource={Images.icDropDown}
                            source={Images.icDropDown}
                            style={{ width: 15, height: 15 }} resizeMode='contain' />
                    </View>
                }

            />
        </View>

    </TouchableOpacity>)
}

const CompNgayThucThi = (props) => {
    const ref = useRef()
    const onPress = () => {
        ref.current.onPressDate();
    }
    return (<TouchableOpacity disabled={!props.isEdit} onPress={props.isEdit ? onPress : () => { }}>
        <View pointerEvents='none'>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.brownGreyTwo, borderRadius: 7,
                    alignItems: 'center', paddingVertical: 0
                }}

                labelText={'Ngày thực thi'}
                styleLabel={{}}
                sufix={
                    <View style={{}}>
                        <DatePicker
                            style={{ borderWidth: 0, width: '100%', }}
                            date={props.value}
                            mode="date"
                            disabled={false}
                            placeholder="Chọn ngày thực thi"
                            format="DD/MM/YYYY"
                            confirmBtnText="Xác nhận"
                            cancelBtnText="Hủy"
                            showIcon={true}
                            iconSource={Images.icDatePicker}
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

                                },
                                dateIcon: {
                                    right: 5,
                                    ...nstyles.nIcon20
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
                placeholder={"Chọn ngày thực thi"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_16}
                // errorText={'Ngày sinh không hợp lệ'}
                // helpText={'Số điện thoại phải tối thiểu 9 chữ số'}
                valid={true}

                value={props.value}
                onChangeText={props.onChangTextIndex}

            />
        </View>
    </TouchableOpacity>)
}

const CompSoNgayQuaHan = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center',
        }}
        labelText={'Số ngày quá hạn'}
        // sufixlabel={<View>
        //     <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
        // </View>}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        maxLength={props.maxlength}
        editable={props.isEdit}
        placeholder={"Số ngày quá hạn"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Số định danh không hợp lệ'}
        // helpText={'CMND: Chứng minh nhân dân, CCCD: Căn cước công dân'}
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
//==============
const ComNoiCap = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center'
        }}
        sufixlabel={<View>
            <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
        </View>}
        labelText={'Nơi cấp'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        editable={props.isEdit}
        placeholder={"Nơi cấp"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        // errorText={'Nơi cấp không hợp lệ'}
        // helpText={'Số định danh sẽ được sử dụng làm ID đăng nhập tài khoản'}
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

const CompNgayCap = (props) => {
    const ref = useRef()
    const onPress = () => {
        ref.current.onPressDate();
    }
    return (<TouchableOpacity disabled={!props.isEdit} onPress={props.isEdit ? onPress : () => { }}>
        <View pointerEvents='none'>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.brownGreyTwo, borderRadius: 7,
                    alignItems: 'center', paddingVertical: 0
                }}
                sufixlabel={<View>
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
                </View>}
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
                            showIcon={true}
                            iconSource={Images.icDatePicker}
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

                                },
                                dateIcon: {
                                    right: 5,
                                    ...nstyles.nIcon20
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
                placeholder={"Ngày cấp"}
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

const CompSoDienThoai = (props) => {
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.brownGreyTwo, borderRadius: 7,
            alignItems: 'center',
        }}
        sufixlabel={<View>
            <Text style={{ fontSize: 18, color: colors.redStar }}>{'*'}</Text>
        </View>}
        labelText={'Số điện thoại'}
        // styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        maxLength={props.maxlength}
        editable={props.isEdit}
        placeholder={"Số điện thoại"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        errorText={'Số điện thoại không hợp lệ'}
        // helpText={'CMND: Chứng minh nhân dân, CCCD: Căn cước công dân'}
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

const CompForm = {
    CompCaNhanToChucViPham, CompCapCoThamQuyenQDXP, CompCaNhanQDXP, CompNgaySinh, CompQuocTich, CompNguyenQuan, CompNoiDKHKTT, CompDiaChiHienTai, CompCMND,
    CompLinhVuc, CompHanhViViPham, CompCanCuPhapLyXuPhat, CompTongTienPhat, CompHinhThucPhatBoSung, CompBienPhapNganChan, CompNgayQDXP, CompCoQuanThiHanh,
    CompCaNhanCoTrachNhiemTCTH, CompTrangThai, CompNgayThucThi, CompSoNgayQuaHan, ComNoiCap, CompNgayCap, CompSoDienThoai, CompTenCongTy, CompMaSoCongTy
}
export default CompForm