import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'


import InputRNCom from './InputRNCom';
import { colors } from '../../../../styles';
// import { Images } from '../../../../srcAdmin/images';
import DatePicker from 'react-native-datepicker';
import { Images } from '../../../images';
import Utils from '../../../../app/Utils';
import FontSize from '../../../../styles/FontSize';
// import dataHCM from './dataRender';

const ComponentInput = props => {
    return (
        <InputRNCom
            isDrop={props.isDrop || false}
            onPress={props.isEdit ? props.onPress : () => { }}
            styleContainer={{
                ..._styles.container
            }}
            styleBodyInput={{
                borderColor: colors.blueFaceBook, backgroundColor: colors.white,
                ..._styles.bodyInput,
                ...props.styleBodyInputCus,
            }}
            labelText={props.title}
            styleLabel={{
                color: colors.black_80,
                fontWeight: 'bold',
                fontSize: FontSize.reText(14),
                ...props.styleLabelCus,
            }}

            styleContentLabel={{
                borderRadius: 0,
                paddingHorizontal: FontSize.scale(5),
            }}
            placeholder={props.placeholder}
            styleInput={{
                color: colors.black_80,
            }}
            keyboardType={props.keyboardType}
            styleError={{ backgroundColor: 'white' }}
            styleHelp={{ backgroundColor: 'white' }}
            placeholderTextColor={colors.black_50}
            editable={props.isEdit}

            prefix={null}
            value={props.value}
            onChangeText={props.onChangTextIndex}
            valid={props.valid || true}
            errorText={props.errorText || ''}
            helpText={props.helpText || ''}
            {...props}

        />
    );
};
const ComponentInputView = props => {
    const { icon_prefix_label } = props
    return (
        <InputRNCom
            isDrop={props.isDrop || false}
            onPress={props.isEdit ? props.onPress : () => { }}
            styleContainer={{
                paddingVertical: FontSize.scale(5),
                ..._styles.container
            }}
            styleBodyInput={{
                borderColor: colors.black_60, backgroundColor: colors.white,
                ..._styles.bodyInputView
            }}
            labelText={props.title}
            styleLabel={{
                color: colors.black_50,
                fontWeight: 'bold',
                fontSize: FontSize.reText(14),
                ...props.styleLabel,
            }}

            styleContentLabel={{
                borderRadius: 0,
                paddingHorizontal: FontSize.scale(5),
            }}
            placeholder={props.placeholder}
            styleInput={{
                color: colors.black_80,
                borderRadius: 3, borderWidth: 0,
                borderBottomWidth: 1, borderColor: colors.black_30,
                paddingVertical: FontSize.scale(5)
            }}
            keyboardType={props.keyboardType}
            styleError={{ backgroundColor: 'white' }}
            styleHelp={{ backgroundColor: 'white' }}
            placeholderTextColor={colors.black_50}
            editable={props.isEdit}


            prefixlabel={
                <TouchableOpacity
                    // onPress={() => setisShow(!isShow)}
                    style={{ padding: 0 }}>
                    <Image
                        source={Images[icon_prefix_label ? icon_prefix_label : "icShowPass"]}
                        resizeMode="contain"
                        style={{
                            width: FontSize.scale(15),
                            height: FontSize.scale(15),
                            tintColor: colors.black_50,

                        }}
                    />
                </TouchableOpacity>
            }
            prefix={
                <TouchableOpacity
                    // onPress={() => setisShow(!isShow)}
                    style={{ padding: 0 }}>
                    <Image
                        source={Images.icShowPass}
                        resizeMode="contain"
                        style={{
                            width: FontSize.scale(20),
                            height: FontSize.scale(20),
                            tintColor: colors.white,
                        }}
                    />
                </TouchableOpacity>
            }
            value={props.value}
            onChangeText={props.onChangTextIndex}
            valid={props.valid || true}
            errorText={props.errorText || ''}
            helpText={props.helpText || ''}
            {...props}

        />
    );
};
const ComponentInputPass = props => {
    const [isShow, setisShow] = useState(true);
    return (<InputRNCom
        isDrop={props.isDrop || false}
        onPress={props.isEdit ? props.onPress : () => { }}
        styleContainer={{
            ..._styles.container
        }}
        styleBodyInput={{
            borderColor: colors.black_60, backgroundColor: colors.white,
            ..._styles.bodyInput
        }}
        labelText={props.title}
        styleLabel={{
            color: colors.black_80,
            fontWeight: 'bold',
            fontSize: FontSize.reText(14),
            ...props.styleLabel,
        }}

        styleContentLabel={{
            borderRadius: 0,
            paddingHorizontal: FontSize.scale(5),
        }}
        placeholder={props.placeholder}
        styleInput={{
            color: colors.black_80,
        }}
        keyboardType={props.keyboardType}
        styleError={{ backgroundColor: 'white' }}
        styleHelp={{ backgroundColor: 'white' }}
        placeholderTextColor={colors.black_50}
        editable={props.isEdit}
        prefix={null}
        value={props.value}
        onChangeText={props.onChangTextIndex}
        secureTextEntry={isShow}
        valid={props.valid || false}
        errorText={props.errorText || ''}
        helpText={props.helpText || ''}
        sufix={
            <TouchableOpacity
                onPress={() => setisShow(!isShow)}
                style={{ padding: 10 }}>
                <Image
                    source={isShow ? Images.icHidePass : Images.icShowPass}
                    resizeMode="contain"
                    style={{
                        width: FontSize.scale(20),
                        height: FontSize.scale(20),
                        tintColor: colors.black,
                    }}
                />
            </TouchableOpacity>
        }
        {...props}
    />
    );
};
const ComponentDatePicker = props => {
    const refPK = useRef(null);
    const onPress = () => {
        refPK.current.onPressDate();
    };
    return (
        <InputRNCom
            isDrop={true}
            onPress={onPress}
            styleContainer={{
                ..._styles.container
            }}
            styleBodyInput={{
                borderColor: colors.black_60, backgroundColor: colors.white,
                ..._styles.bodyInput,
                ...props.styleBodyInputCus,
            }}
            labelText={props.title}
            styleLabel={{
                color: colors.black_80,
                fontWeight: 'bold',
                fontSize: FontSize.reText(14),
                ...props.styleLabel,
            }}

            styleContentLabel={{
                borderRadius: 0,
                paddingHorizontal: FontSize.scale(5),
            }}
            placeholder={props.placeholder}
            styleInput={{
                color: colors.black_80,
            }}
            keyboardType={props.keyboardType}
            styleError={{ backgroundColor: 'white' }}
            styleHelp={{ backgroundColor: 'white' }}
            placeholderTextColor={colors.black_50}
            editable={props.isEdit}

            sufix={<View style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                paddingHorizontal: FontSize.scale(10),
            }}>
                <Image
                    source={Images.ic_datepicker_hcm}
                    resizeMode="contain"
                    style={{
                        width: FontSize.scale(20),
                        height: FontSize.scale(20),
                        tintColor: colors.black_30,
                    }}
                />
                <DatePicker
                    style={{ borderWidth: 0, width: '0%' }}
                    date={props.value}
                    mode={props?.mode ? props.mode : "date"}
                    disabled={false}
                    placeholder={''}
                    format={props?.format ? props.format : "DD/MM/YYYY"}
                    confirmBtnText="Xác nhận"
                    cancelBtnText="Huỷ"
                    showIcon={false}
                    androidMode="spinner"
                    hideText={true}
                    locale="vi"
                    ref={refPK}
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
                    }}
                    // hideText={true}

                    onDateChange={props.onChangTextIndex}
                />
            </View>}
            value={props.value}
            onChangeText={props.onChangTextIndex}
            valid={props.valid || true}
            errorText={props.errorText || ''}
            helpText={props.helpText || ''}
            {...props}

        />
    );
};

const ComponentTitle = (props) => {
    const { value, note } = props
    return <View style={{ ..._styles.container, paddingVertical: FontSize.scale(7), }}>
        <Text style={{ fontSize: FontSize.reText(20), fontWeight: 'bold' }}>{value}<Text style={{ color: colors.redStar }}>{note ? `${note}` : ''}</Text></Text>
    </View>
}
const ComponentDrop = props => {
    const [isShow, setisShow] = useState(true);
    return (<InputRNCom
        isDrop={true}
        onPress={props.isEdit ? props.onPress : () => { }}
        styleContainer={{
            ..._styles.container
        }}
        styleBodyInput={{
            borderColor: colors.blueFaceBook, backgroundColor: colors.white,
            ..._styles.bodyInput,
            ...props.styleBodyInputCus,
        }}
        labelText={props.title}
        styleLabel={{
            color: colors.black_80,
            fontWeight: 'bold',
            fontSize: FontSize.reText(14),
            ...props.styleLabelCus,
        }}

        styleContentLabel={{
            borderRadius: 0,
            paddingHorizontal: FontSize.scale(5),
        }}
        placeholder={props.placeholder}
        styleInput={{
            color: colors.black_80,
        }}
        keyboardType={props.keyboardType}
        styleError={{ backgroundColor: 'white' }}
        styleHelp={{ backgroundColor: 'white' }}
        placeholderTextColor={colors.black_50}
        editable={props.isEdit}
        prefix={null}
        value={props.value}
        onChangeText={props.onChangTextIndex}
        secureTextEntry={false}
        valid={props.valid || false}
        errorText={props.errorText || ''}
        helpText={props.helpText || ''}
        sufix={
            <TouchableOpacity
                // onPress={() => setisShow(!isShow)}
                style={{ padding: FontSize.scale(10), }}>
                <Image
                    source={Images.icDropDown}
                    resizeMode="contain"
                    style={{
                        width: FontSize.reSize(12),
                        height: FontSize.reSize(12),
                        tintColor: colors.black_50,
                        ...props.prefixlabelCus
                    }}
                />
            </TouchableOpacity>
        }
        {...props}
    />
    );
};
const ComponentImagePicker = (props) => {
    const { value, onPress = () => { }, name = '' } = props
    return <View style={{
        ..._styles.container,
        paddingVertical: FontSize.scale(7),
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <Text style={{ fontSize: FontSize.reText(14), color: colors.black_20 }}>{name || ''}</Text>
        <TouchableOpacity onPress={onPress} style={{
            borderWidth: 0.5,
            borderColor: colors.black_20,
            width: FontSize.verticalScale(130),
            height: FontSize.verticalScale(140),
            borderRadius: FontSize.scale(10),
            alignItems: 'center', justifyContent: 'center'
        }}>
            <Image
                source={value ? { uri: value.uri } : Images.ic_camera_hcm}
                resizeMode="cover"
                style={{
                    width: value ? '100%' : FontSize.verticalScale(66),
                    height: value ? '100%' : FontSize.verticalScale(60),
                    borderRadius: FontSize.scale(10),
                    // tintColor: value ? 'transparent' : colors.black_50,
                }}
            />
        </TouchableOpacity>
    </View >
}
const listGT = [
    {
        id: 0,
        name: "Nam"
    },
    {
        id: 1,
        name: "Nữ"
    }
]
const ComponentGioiTinh = (props) => {
    const { value = {}, onPress = () => { }, listCom = [] } = props;

    const renderItemChoose = (item, i) => {
        return <TouchableOpacity key={'i' + i} onPress={() => {
            Utils.nlog("value:", item)
            onPress(item)
        }} style={{ flexDirection: 'row', alignItems: 'center', }}>
            <Image
                source={value && item.id == value.id ? Images.icRadioCheck : Images.icRadioUnCheck}
                resizeMode="contain"
                style={{
                    width: FontSize.reSize(15),
                    height: FontSize.reSize(15),
                    // tintColor: colors.main,
                }}
            />
            <Text style={{ paddingHorizontal: FontSize.scale(10), fontSize: FontSize.reText(16) }}>{item.name}</Text>
        </TouchableOpacity>
    }
    return <View style={{
        ..._styles.container,
        paddingVertical: FontSize.scale(7),
        flexDirection: 'row', alignItems: 'center',
    }}>
        <Text style={{ paddingRight: FontSize.scale(10), fontSize: FontSize.reText(16) }}>{'Giới tính'}</Text>

        {
            listCom.map(renderItemChoose)
        }
    </View >
}
const ComponentQuanHe = (props) => {
    const { value = {}, onPress = () => { }, listCom = [], name } = props;

    const renderItemChoose = (item, i) => {
        return <TouchableOpacity key={'i' + i} onPress={() => {
            Utils.nlog("value:", item)
            onPress(item)
        }} style={{ flexDirection: 'row', alignItems: 'center', }}>
            <Image
                source={value && item.id == value.id ? Images.ic_check_hcm : Images.ic_uncheck_hcm}
                resizeMode="contain"
                style={{
                    width: FontSize.reSize(15),
                    height: FontSize.reSize(15),
                    // tintColor: colors.main,
                }}
            />
            <Text style={{ paddingHorizontal: FontSize.scale(10), fontSize: FontSize.reText(16) }}>{item.name}</Text>
        </TouchableOpacity>
    }
    return <View style={{
        ..._styles.container,
        paddingVertical: FontSize.scale(7),
        flexDirection: 'row', alignItems: 'center',
        flexWrap: 'wrap'
    }}>
        <Text style={{ paddingRight: FontSize.scale(10), fontSize: FontSize.reText(16), width: '100%', paddingVertical: FontSize.scale(5) }}>{name}</Text>
        {
            listCom.map(renderItemChoose)
        }

    </View >
}
const ComponentCauHoi = (props) => {
    const { value = {}, onPress = () => { }, listCom = [], name, note } = props;

    const renderItemChoose = (item, i) => {
        return <TouchableOpacity key={'i' + i} onPress={() => {
            Utils.nlog("value:", item)
            onPress(item)
        }} style={{ flexDirection: 'row', alignItems: 'center', }}>
            <Image
                source={value && item.id == value.id ? Images.icRadioCheck : Images.icRadioUnCheck}
                resizeMode="contain"
                style={{
                    width: FontSize.reSize(15),
                    height: FontSize.reSize(15),
                    // tintColor: colors.main,
                }}
            />
            <Text style={{ paddingHorizontal: FontSize.scale(10), fontSize: FontSize.reText(16) }}>{item.name}</Text>
        </TouchableOpacity>
    }
    return <View style={{
        ..._styles.container,
        paddingVertical: FontSize.scale(7),
        // alignItems: 'center',
    }}>
        <Text style={[{
            paddingRight: FontSize.scale(10),
            fontSize: FontSize.reText(16), fontWeight: 'bold', paddingVertical: 10
        }, props.styleLabel]}>{name}<Text style={{ color: colors.redStar }}>{note ? `\n${note || `*`}` : '*'}</Text></Text>
        <View style={{ flexDirection: 'row' }}>
            {
                listCom.map(renderItemChoose)
            }
        </View>
    </View >
}
const _styles = StyleSheet.create({
    bodyInput: {
        borderRadius: 3, borderWidth: 0.5, minHeight: FontSize.scale(40),
        alignItems: 'center', paddingVertical: 0,
    },
    bodyInputView: {
        borderRadius: 3, borderWidth: 0,
        // borderBottomWidth: 1,
        minHeight: FontSize.scale(30),
        alignItems: 'center', paddingVertical: 0,
    },
    container: {
        paddingHorizontal: FontSize.scale(10)
    }
});
export const TYPES = {
    Title: 'Title',
    TextInput: 'TextInput',
    TextInputView: 'TextInputView',
    TextInputPass: 'TextInputPass',
    DropDown: 'DropDown',
    RadioButton: 'RadioButton',
    ImagePicker: 'ImagePicker',
    DatePicker: 'DatePicker',
    Space: 'Space',
    GioiTinh: 'GioiTinh',
    QuanHe: 'QuanHe',
    Children: 'Children',
    CauHoi: 'CauHoi',
}
const ComponentItem = {
    ComponentInput,
    ComponentInputPass,
    ComponentTitle,
    ComponentDatePicker,
    ComponentDrop,
    ComponentImagePicker,
    ComponentGioiTinh,
    ComponentQuanHe,
    ComponentInputView,
    ComponentCauHoi,

}
export default ComponentItem;



