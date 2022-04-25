import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native"
import InputRNCom from "../../../components/ComponentApps/InputRNCom"
import { Images } from "../../images"
import { colors } from "../../../styles"
import { reText } from "../../../styles/size"
import React, { Component, Fragment, useRef, useEffect, useState } from 'react';
import DatePicker from 'react-native-datepicker';
import Utils from "../../../app/Utils"
import { nGlobalKeys } from "../../../app/keys/globalKey"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { appConfig } from "../../../app/Config"
import { Height, nstyles, Width } from "../../../styles/styles"
import apis from "../../apis"
import TextApp from "../../../components/TextApp"
import ImageCus from "../../../components/ImageCus"
import { useSelector } from "react-redux"


const ComponentHVT = (props) => {
    if (!props.isEdit) {
        return <TextLine title={'Họ và tên'} value={props.value} />
    }
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.deepSkyBlue, borderRadius: 3,
            minHeight: 40, alignItems: 'center'
        }}
        editable={props.isEdit}
        labelText={'Họ và tên'}
        styleLabel={{ fontWeight: 'bold' }}
        sufixlabel={<View>
            <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
        </View>}
        placeholder={"Nhập đầy đủ họ tên"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_16}
        errorText={'Họ và tên không hợp lệ'}
        valid={true}
        prefix={null}
        value={props.value}
        onChangeText={props.onChangTextIndex}


    />)
}
const ComponentNgaySinh = (props) => {
    const ref = useRef()
    const onPress = () => {
        ref.current.onPressDate();
    }
    if (!props.isEdit) {
        return <TextLine title={'Ngày sinh'} value={props.value} />
    }
    return (<TouchableOpacity onPress={props.isEdit ? onPress : () => { }}>
        <View pointerEvents='none'>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.deepSkyBlue, borderRadius: 3,
                    minHeight: 40, alignItems: 'center'
                }}

                labelText={'Ngày sinh'}
                styleLabel={{ fontWeight: 'bold' }}
                sufix={
                    <View style={{}}>
                        <DatePicker
                            style={{ borderWidth: 0, width: '100%', height: 10 }}
                            date={props.value}
                            mode="date"
                            disabled={false}
                            placeholder="Chọn ngày sinh"
                            format="DD/MM/YYYY"
                            confirmBtnText="Xác nhận"
                            cancelBtnText="Thoát"
                            showIcon={false}
                            hideText={true}
                            androidMode='spinner'
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
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
                </View>}
                placeholder={"Chọn ngày sinh"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_16}
                errorText={'Ngày sinh  không hợp lệ'}
                valid={true}

                value={props.value}
                onChangeText={props.onChangTextIndex}

            />
        </View>
    </TouchableOpacity>)
}
const ComponentTypeDD = (props) => {
    if (!props.isEdit) {
        return <TextLine title={'Loại CMMD/CCCD'} value={props.value} />
    }
    return (<TouchableOpacity onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.deepSkyBlue, borderRadius: 3,
                    minHeight: 40, alignItems: 'center'
                }}
                labelText={'Chứng minh nhân dân'}
                styleLabel={{ fontWeight: 'bold' }}
                sufixlabel={<View>
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
                </View>}
                placeholder={"Chọn loại định danh"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_30}
                errorText={'Loại định danh không hợp lệ'}
                editable={false}

                valid={true}
                prefix={null}
                value={props.value}
                // onChangeText={(val) => {
                //     this.onChangTextIndex(val, 1)
                // }}
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
const ComponentInputDD = (props) => {
    if (!props.isEdit) {
        return <TextLine title={'CMND / CCCD / Hộ chiếu'} value={props.value} />
    }
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.deepSkyBlue, borderRadius: 3,
            minHeight: 40, alignItems: 'center'
        }}

        styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        maxLength={props.maxlength}
        editable={props.isEdit}
        placeholder={"CMND / CCCD / Hộ chiếu"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        errorText={'Số định danh không hợp lệ'}
        helpText={'CMND: Chứng minh nhân dân, CCCD: Căn cước công dân'}
        editable={true}
        // keyboardType='numeric'
        valid={true}
        prefix={null}
        value={props.value}
        onChangeText={props.onChangTextIndex}
        // prefix={
        //     <View style={{
        //         height: 30, paddingLeft: 10,
        //         alignItems: 'center',
        //         justifyContent: 'center'
        //     }}>
        //         <Text style={{ fontWeight: 'bold' }}>Số:<Text style={{ fontWeight: 'bold', color: colors.redStar }}>{props.isReq ? '*' : ''}</Text></Text>
        //     </View>
        // }
        labelText={'CMND / CCCD / Hộ chiếu'}
        styleLabel={{ fontWeight: 'bold' }}
        sufixlabel={<View>
            <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
        </View>}

    />)
}
const ComponentNoiCap = (props) => {
    if (!props.isEdit) {
        return <TextLine title={'Nơi cấp'} value={props.value} />
    }
    return (<InputRNCom
        styleContainer={{ paddingHorizontal: 10 }}
        styleBodyInput={{
            borderColor: colors.deepSkyBlue, borderRadius: 3,
            minHeight: 40, alignItems: 'center'
        }}

        styleLabel={{ fontWeight: 'bold', paddingVertical: 0 }}
        editable={props.isEdit}
        placeholder={"Nơi cấp CMND/CCCD"}
        styleInput={{}}
        styleError={{ backgroundColor: 'white', }}
        styleHelp={{ backgroundColor: 'white', }}
        placeholderTextColor={colors.black_30}
        errorText={'Nơi cấp không hợp lệ'}
        // helpText={'Số định danh sẽ được sử dụng làm ID đăng nhập tài khoản'}
        valid={true}
        prefix={null}
        value={props.value}
        onChangeText={props.onChangTextIndex}
        prefix={
            <View style={{
                height: 30, paddingLeft: 10,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Text style={{ fontWeight: 'bold' }}>Nơi cấp:<Text style={{ fontWeight: 'bold', color: colors.redStar }}>{props.isReq ? '*' : ''}</Text> </Text>
            </View>
        }

    />)
}
const ComponentQuocTich = (props) => {
    if (!props.isEdit) {
        return <TextLine title={'Quốc tịch'} value={props.value} />
    }
    return (<TouchableOpacity onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.deepSkyBlue, borderRadius: 3,
                    minHeight: 40, alignItems: 'center'
                }}
                labelText={'Quốc tịch'}
                styleLabel={{ fontWeight: 'bold' }}
                sufixlabel={<View>
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
                </View>}
                placeholder={"Chọn quốc tịch"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_30}
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
                            // defaultSource={Images.iconApp}
                            source={Images.icDropDown}
                            style={{ width: 15, height: 15 }} resizeMode='contain' />
                    </View>
                }

            />
        </View>

    </TouchableOpacity>)
}
const ComponentDanToc = (props) => {
    if (!props.isEdit) {
        return <TextLine title={'Dân tộc'} value={props.value} />
    }
    return (<TouchableOpacity onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.deepSkyBlue, borderRadius: 3,
                    minHeight: 40, alignItems: 'center'
                }}
                labelText={'Dân tộc'}
                styleLabel={{ fontWeight: 'bold' }}
                sufixlabel={<View>
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
                </View>}
                placeholder={"Chọn dân tộc"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_30}
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
                            // defaultSource={Images.iconApp}
                            source={Images.icDropDown}
                            style={{ width: 15, height: 15 }} resizeMode='contain' />
                    </View>
                }

            />
        </View>

    </TouchableOpacity>)
}
const ComponentTonGiao = (props) => {
    if (!props.isEdit) {
        return <TextLine title={'Tôn giáo'} value={props.value} />
    }
    return (<TouchableOpacity onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.deepSkyBlue, borderRadius: 3,
                    minHeight: 40, alignItems: 'center'
                }}
                labelText={'Tôn giáo'}
                styleLabel={{ fontWeight: 'bold' }}
                sufixlabel={<View>
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
                </View>}
                placeholder={"Chọn tôn giáo"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_30}
                errorText={'Tôn giáo không hợp lệ'}
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
                            // defaultSource={Images.iconApp}
                            source={Images.icDropDown}
                            style={{ width: 15, height: 15 }} resizeMode='contain' />
                    </View>
                }

            />
        </View>
    </TouchableOpacity>)
}

const ComponentDiaChi = (props) => {
    const [dataMap, setdataMap] = useState([])
    const [isLoad, setisLoad] = useState(false)

    const ref = useRef();
    let _selectAdd = (data, details = null) => {
        Utils.nlog('location:', data, details.geometry.location)
        props.onChangTextIndex({ val: data.description, location: details.geometry.location });
        setTimeout(() => {
            ref.current?._handleChangeText('');
        }, 100);
    }

    const [isFocus, setisFocus] = useState(false);

    if (!props.isEdit) {
        return <TextLine title={'Địa chỉ'} value={props.value} />
    }

    const getListAddress = async (input) => {
        if (input) {
            setisLoad(true)
            let res = await apis.ApiApp.getListAddressViettel(input)
            // Utils.nlog('[LOG data list address', res)
            if (res && res.data && res.data.length != 0) {
                setdataMap(res.data)
                setisLoad(false)
            } else {
                setdataMap([])
                setisLoad(false)
            }
        } else {
            setdataMap([])
        }
    }

    const ItemAddress = (item, index) => {
        return (
            <TouchableOpacity
                onPress={() => getDetails(item, index)}
                style={{ marginBottom: 5 }} key={item.placeId}>
                <View style={[nstyles.shadow, { backgroundColor: colors.white, padding: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }]} >
                    <Image source={Images.icAddrress} style={nstyles.nIcon20} resizeMode='contain' />
                    <Text style={{ fontSize: reText(13), color: 'gray', paddingHorizontal: 10, textAlign: 'justify', flex: 1 }}>{item.text}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const getDetails = async (item, index) => {
        setisLoad(true)
        let res = await apis.ApiApp.getDetailsAddress(item.placeId)
        setisLoad(false)
        let results = {
            geometry: {
                location: { lat: appConfig.defaultRegion.latitude, lng: appConfig.defaultRegion.longitude }
            }
        }
        if (res && res.data) {
            const { geometry, properties } = res.data
            if (geometry.coordinates && geometry?.coordinates.length != 0 && (properties.full_address || properties.name)) {
                results = {
                    geometry: {
                        location: { lat: geometry.coordinates[1], lng: geometry.coordinates[0] }
                    }
                }
                _selectAdd({ description: properties.full_address ? properties.full_address : properties.name ? properties.name : `${geometry.coordinates[1]}, ${geometry.coordinates[0]}` }, results)
                setdataMap([])
                props.onFocus();
            } else {
                setdataMap([])
                props.onFocus();
            }

        } else {
            setdataMap([])
        }
    }

    return (
        <Fragment>
            <View style={[{ width: '100%' }, isFocus ? {} : {}]}>
                <InputRNCom
                    styleContainer={{ paddingHorizontal: 10 }}
                    styleBodyInput={{
                        borderColor: colors.deepSkyBlue, borderRadius: 3,
                        minHeight: 40, alignItems: 'center'
                    }}
                    labelText={'Địa chỉ thường trú'}
                    styleLabel={{ fontWeight: 'bold' }}
                    sufixlabel={<View>
                        <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
                    </View>}
                    editable={props.isEdit}
                    placeholder={"Nhập địa chỉ"}
                    styleInput={{}}
                    styleError={{ backgroundColor: 'white', }}
                    styleHelp={{ backgroundColor: 'white', }}
                    placeholderTextColor={colors.black_16}
                    errorText={'Địa chỉ hợp lệ'}
                    onFocus={() => {
                        ref.current?._handleChangeText(props.value);
                        setisFocus(true);
                        props.onFocus();
                    }}
                    onBlur={() => {
                        setisFocus(false); setTimeout(() => {
                            ref.current?._handleChangeText('');
                        }, 100);
                    }}
                    // onFoscus
                    // helpText={'OTP xác thực sẽ gửi về số này'}
                    valid={true}
                    prefix={null}
                    value={props.value}
                    onChangeText={(val) => {
                        ref.current?._handleChangeText(val);
                        getListAddress(val)
                        props.onChangTextIndex({ val });
                        if (val == '') {
                            props.onFocus();
                        }
                    }}
                />

                {appConfig.useKeyMap ?
                    <View style={{ flex: 1, padding: 10 }}>
                        {
                            isLoad ?
                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', margin: 10 }}>
                                    <ActivityIndicator size={'small'} />
                                    <Text style={{ fontSize: reText(12), color: colors.colorTextGray, paddingLeft: 10 }}>{'Đang tìm kiếm địa chỉ...'}</Text>
                                </View>
                                : null
                        }
                        {
                            dataMap.length > 0 ? dataMap.map((item, index) => {
                                return ItemAddress(item, index)
                            })
                                : null
                        }
                    </View> :
                    <GooglePlacesAutocomplete
                        ref={ref}
                        placeholder='Tìm kiếm'
                        minLength={2} // minimum length of text to search
                        // autoFocus={true}
                        returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                        keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                        listViewDisplayed={true}    // true/false/undefined
                        fetchDetails={true}
                        // renderDescription={row => row.description} // custom description render
                        onPress={_selectAdd}
                        getDefaultValue={() => ''}

                        query={{
                            // available options: https://developers.google.com/places/web-service/autocomplete
                            key: appConfig.apiKeyGoogle,
                            language: 'vi', // language of the results
                            types: 'address' // default: 'geocode'
                        }}
                        textInputHide={true}
                        styles={{
                            // textInputContainer: {
                            //     width: '100%'
                            // },
                            description: {
                                fontWeight: 'bold'
                            },
                            predefinedPlacesDescription: {
                                color: '#1faadb'
                            },
                            container: { backgroundColor: 'rgba(255,255,255,0.6)' },
                            poweredContainer: { backgroundColor: 'transparent' },
                        }}
                        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                        GoogleReverseGeocodingQuery={{
                            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                        }}
                        GooglePlacesSearchQuery={{
                            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                            rankby: 'distance',
                            type: 'cafe'
                        }}
                        GooglePlacesDetailsQuery={{
                            // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                            fields: 'geometry',
                        }}
                        filterReverseGeocodingByTypes={['street_address']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                        debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                    // renderRightButton={this._rightButton}
                    />}
            </View>
        </Fragment>
    )
}


//
const ComponentMK = (props) => {
    let textEror = Utils.getGlobal(nGlobalKeys.txtErrPass, '');
    return (
        <InputRNCom
            styleContainer={{ paddingHorizontal: 10 }}
            styleBodyInput={{
                borderColor: colors.deepSkyBlue, borderRadius: 3,
                minHeight: 40, alignItems: 'center'
            }}
            labelText={'Mật khẩu'}
            styleLabel={{ fontWeight: 'bold' }}
            sufixlabel={<View>
                <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
            </View>}
            placeholder={"Mật khẩu"}
            editable={props.isEdit}
            styleInput={{}}
            styleError={{ backgroundColor: 'white', }}
            styleHelp={{ backgroundColor: 'white', }}
            placeholderTextColor={colors.black_16}
            errorText={textEror}
            helpText={textEror}
            valid={true}
            prefix={null}
            value={props.value}
            secureTextEntry={!props.isShow}
            onChangeText={props.onChangTextIndex}
            sufix={
                <TouchableOpacity onPress={props.onPressChange} style={{
                    height: 30,
                    alignItems: 'center',
                    justifyContent: 'center', paddingHorizontal: 10
                }}>
                    <Image

                        source={props.isShow ? Images.icHidePass : Images.icShowPass}
                        style={{ width: 20, height: 20 }} resizeMode='contain' />
                </TouchableOpacity>
            }

        />
    )
}
//
const ComponentNhapMK = props => {
    let textEror = Utils.getGlobal(nGlobalKeys.txtErrPass, '');
    return (

        <InputRNCom
            styleContainer={{ paddingHorizontal: 10 }}
            styleBodyInput={{
                borderColor: colors.deepSkyBlue, borderRadius: 3,
                minHeight: 40, alignItems: 'center'
            }}
            labelText={'Nhập lại mật khẩu'}
            styleLabel={{ fontWeight: 'bold' }}
            sufixlabel={<View>
                <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
            </View>}
            editable={props.isEdit}
            placeholder={"Nhập lại mật khẩu"}
            styleInput={{}}
            styleError={{ backgroundColor: 'white', }}
            styleHelp={{ backgroundColor: 'white', }}
            placeholderTextColor={colors.black_16}
            errorText={textEror}
            helpText={"Mật khẩu phải giống mật khẩu ở trên"}
            valid={true}
            prefix={null}
            value={props.value}
            onChangeText={props.onChangTextIndex}
            secureTextEntry={!props.isShow}
            sufix={
                <TouchableOpacity onPress={props.onPressChange} style={{
                    height: 30,
                    alignItems: 'center',
                    justifyContent: 'center', paddingHorizontal: 10
                }}>
                    <Image

                        source={props.isShow ? Images.icHidePass : Images.icShowPass}
                        style={{ width: 25, height: 25 }} resizeMode='contain' />
                </TouchableOpacity>
            }

        />
    )
}
const ComponentNgayCap = (props) => {
    const ref = useRef()
    const onPress = () => {
        ref.current.onPressDate();
    }
    if (!props.isEdit) {
        return <TextLine title={'Ngày cấp'} value={props.value} />
    }
    return (<TouchableOpacity onPress={props.isEdit ? onPress : () => { }}>
        <View pointerEvents='none'>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.deepSkyBlue, borderRadius: 3,
                    minHeight: 40, alignItems: 'center'
                }}

                labelText={'Ngày cấp'}
                styleLabel={{ fontWeight: 'bold' }}
                sufix={
                    <View style={{}}>
                        <DatePicker
                            style={{ borderWidth: 0, width: '100%', height: 10 }}
                            date={props.value}
                            mode="date"
                            disabled={false}
                            placeholder="Chọn ngày cấp"
                            format="DD/MM/YYYY"
                            confirmBtnText="Xác nhận"
                            cancelBtnText="Thoát"
                            showIcon={false}
                            hideText={true}
                            androidMode='spinner'
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
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
                </View>}
                placeholder={"Chọn ngày cấp"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_16}
                errorText={'Ngày sinh không hợp lệ'}
                valid={true}

                value={props.value}
                onChangeText={props.onChangTextIndex}

            />
        </View>
    </TouchableOpacity>)
}
//
const ComponentDienThoai = props => {
    if (!props.isEdit) {
        return <TextLine title={'Điện thoại'} value={props.value} />
    }
    return (
        <InputRNCom
            styleContainer={{ paddingHorizontal: 10 }}
            styleBodyInput={{
                borderColor: colors.deepSkyBlue, borderRadius: 3,
                minHeight: 40, alignItems: 'center'
            }}
            labelText={'Điện thoại'}
            styleLabel={{ fontWeight: 'bold' }}
            sufixlabel={<View>
                <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
            </View>}
            editable={props.isEdit}
            maxLength={props.maxlength}
            keyboardType='numeric'
            placeholder={"Nhập số điện thoại di động"}
            styleInput={{}}
            styleError={{ backgroundColor: 'white', }}
            styleHelp={{ backgroundColor: 'white', }}
            placeholderTextColor={colors.black_16}
            errorText={'Số điện thoại không hợp lệ'}
            valid={true}
            prefix={null}
            value={props.value}
            onChangeText={props.onChangTextIndex}
        />
    )
}

const TextLine = (props) => {
    let { title = '', value = '' } = props
    return (
        <>
            <View {...props} style={{
                flexDirection: 'row', backgroundColor: colors.white,
                alignItems: 'center', padding: 3,
                paddingHorizontal: 10, borderRadius: 15
            }}>
                <Text style={{ fontWeight: 'bold', minWidth: Width(25), fontSize: reText(14) }}>{title}: </Text>
                <Text style={{ flex: 1, textAlign: 'right', paddingVertical: 8 }}>{value}</Text>
            </View>
            <View style={{ backgroundColor: colors.black_10, height: 0.5, marginHorizontal: 10 }} />
        </>

    )
}
const ComponentUserName = props => {
    if (!props.isEdit) {
        return <TextLine title={'Số điện thoại'} value={props.value} />
    } else {
        return (
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.deepSkyBlue, borderRadius: 3,
                    minHeight: 40, alignItems: 'center'
                }}
                labelText={'Số điện thoại đăng nhập'}
                styleLabel={{ fontWeight: 'bold' }}
                sufixlabel={<View>
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
                </View>}
                keyboardType='numeric'
                editable={props.isEdit}
                placeholder={"Nhập số điện thoại di động"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_16}
                errorText={'Số điện thoại không hợp lệ'}
                valid={true}
                prefix={null}
                value={props.value}
                onChangeText={props.onChangTextIndex}
            />
        )
    }
}
const ComponentEmail = props => {
    if (!props.isEdit) {
        return <TextLine title={'Email'} value={props.value} />
    }
    return (
        <InputRNCom
            styleContainer={{ paddingHorizontal: 10 }}
            styleBodyInput={{
                borderColor: colors.deepSkyBlue, borderRadius: 3,
                minHeight: 40, alignItems: 'center'
            }}
            labelText={'Email'}
            styleLabel={{ fontWeight: 'bold' }}
            sufixlabel={<View>
                <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
            </View>}
            editable={props.isEdit}
            placeholder={"Email"}
            styleInput={{}}
            styleError={{ backgroundColor: 'white', }}
            styleHelp={{ backgroundColor: 'white', fontSize: reText(12) }}
            placeholderTextColor={colors.black_16}
            errorText={'SDT không hợp lệ'}
            helpText={'Nhập email chính xác để nhận các thông báo: đổi mật khẩu, thông tin phản ánh'}
            valid={true}
            prefix={null}
            value={props.value}
            onChangeText={props.onChangTextIndex}
        />
    )
}
//
const ComponentGioiTinh = props => {
    if (!props.isEdit) {
        return <TextLine title={'Giới tính'} value={props.value == 0 ? 'Nam' : 'Nữ'} />
    }
    return (
        <View pointerEvents={props.isEdit ? 'auto' : 'none'} style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10, alignItems: 'center', backgroundColor: 'white' }}>
            <Text style={{ fontWeight: 'bold' }}>Giới tính<Text style={{ color: colors.redStar }}> {props.isReq ? '*' : ''} </Text></Text>
            <TouchableOpacity onPress={() => props.onChangeGT(0)} style={{ flexDirection: 'row' }}>
                <Image source={props.value == 0 ? Images.icRadioCheck : Images.icRadioUnCheck} style={{ marginLeft: 30, }} />
                <Text style={{ marginLeft: 15, fontSize: reText(14), marginTop: 1 }}>Nam</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.onChangeGT(1)} style={{ flexDirection: 'row' }}>
                <Image source={props.value == 1 ? Images.icRadioCheck : Images.icRadioUnCheck} style={{ marginLeft: 40 }} />
                <Text style={{ marginLeft: 15, fontSize: reText(14), marginTop: 1 }}>Nữ</Text>
            </TouchableOpacity>
        </View>
    )
}

const ComponentTinh = (props) => {
    if (!props.isEdit) {
        return <TextLine title={'Tỉnh'} value={props.value} />
    }
    return (<TouchableOpacity onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.deepSkyBlue, borderRadius: 3,
                    minHeight: 40, alignItems: 'center'
                }}
                labelText={'Tỉnh'}
                styleLabel={{ fontWeight: 'bold' }}
                sufixlabel={<View>
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
                </View>}
                placeholder={"Chọn tỉnh"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_30}
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
                            // defaultSource={Images.iconApp}
                            source={Images.icDropDown}
                            style={{ width: 15, height: 15 }} resizeMode='contain' />
                    </View>
                }

            />
        </View>

    </TouchableOpacity>)
}

const ComponentQuanHuyen = (props) => {
    if (!props.isEdit) {
        return <TextLine title={'Quận/Huyện'} value={props.value} />
    }
    return (<TouchableOpacity onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.deepSkyBlue, borderRadius: 3,
                    minHeight: 40, alignItems: 'center'
                }}
                labelText={'Quận/Huyện'}
                styleLabel={{ fontWeight: 'bold' }}
                sufixlabel={<View>
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
                </View>}
                placeholder={"Chọn Quận/Huyện"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_30}
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
                            // defaultSource={Images.iconApp}
                            source={Images.icDropDown}
                            style={{ width: 15, height: 15 }} resizeMode='contain' />
                    </View>
                }

            />
        </View>

    </TouchableOpacity>)
}

const ComponentPhuongXa = (props) => {
    if (!props.isEdit) {
        return <TextLine title={'Phường/Xã'} value={props.value} />
    }
    return (<TouchableOpacity onPress={props.isEdit ? props.onPress : () => { }}>
        <View pointerEvents={'none'}>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.deepSkyBlue, borderRadius: 3,
                    minHeight: 40, alignItems: 'center'
                }}
                labelText={'Phường/Xã'}
                styleLabel={{ fontWeight: 'bold' }}
                sufixlabel={<View>
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
                </View>}
                placeholder={"Chọn Phường/Xã"}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_30}
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
                            // defaultSource={Images.iconApp}
                            source={Images.icDropDown}
                            style={{ width: 15, height: 15 }} resizeMode='contain' />
                    </View>
                }

            />
        </View>

    </TouchableOpacity>)
}

const UploadCMND = (props) => {
    const userCD = useSelector(state => state.auth.userCD)
    const [AnhCMNDT, setAnhCMNDT] = useState('')
    const [AnhCMNDS, setAnhCMNDS] = useState('')

    const TypeFaceImage = {
        'FaceInFrontOf': 'FaceInFrontOf',
        'FaceBehind': 'FaceBehind'
    }

    const onChooseImage = (typeFace = '') => {
        let options = {
            assetType: 'Photos',//All,Videos,Photos - default
            multi: false,// chọn 1 or nhiều item
            response: data => callbackChooseImage(data, typeFace), // callback giá trị trả về khi có chọn item
            limitCheck: 1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
        };
        Utils.navigate('Modal_MediaPicker', options);
    }

    const callbackChooseImage = (data, typeFace) => {
        switch (typeFace) {
            case TypeFaceImage.FaceInFrontOf:
                setAnhCMNDT({
                    ...data[0],
                    filename: 'CMND_MatTruoc.png'
                })
                break;
            case TypeFaceImage.FaceBehind:
                setAnhCMNDS({
                    ...data[0],
                    filename: 'CMND_MatSau.png'
                })
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        if (props?.callback) {
            props?.callback({
                AnhCMNDT: AnhCMNDT,
                AnhCMNDS: AnhCMNDS,
            })
        }
    }, [AnhCMNDT, AnhCMNDS])

    const stUploadCMND = StyleSheet.create({
        viewID: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: colors.black_10,
            paddingTop: 10
        },
        addViewId: {
            height: 100,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center'
        },
        container: {
            marginHorizontal: 10,
            borderWidth: 0.5,
            borderColor: colors.deepSkyBlue,
            borderRadius: 3,
            padding: 10
        },
        viewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
    })
    if (!props.isEdit) {
        return <TextLine title={'Ảnh CMND/CCCD'} value={'Đã xác thực danh tính'} />
    }
    return (
        <>
            <TextApp style={{ margin: 10, fontWeight: 'bold', fontSize: reText(14) }}>{'Ảnh CMND/CCCD'}<Text style={{ color: colors.redStar }}>*</Text></TextApp>
            <View style={stUploadCMND.container}>
                <View style={stUploadCMND.viewRow}>
                    <TouchableOpacity onPress={() => { onChooseImage(TypeFaceImage.FaceInFrontOf) }} style={stUploadCMND.viewID}>
                        {
                            AnhCMNDT?.uri || userCD?.AnhCMNDT ? <ImageCus
                                source={userCD?.AnhCMNDT && props.isEdit && !AnhCMNDT?.uri ? { uri: appConfig.domain + userCD?.AnhCMNDT } : { uri: AnhCMNDT?.uri }}
                                style={{
                                    height: 100, width: '100%'
                                }} resizeMode={'contain'}
                            /> :
                                <TouchableOpacity onPress={() => { onChooseImage(TypeFaceImage.FaceInFrontOf) }} style={stUploadCMND.addViewId}>
                                    <ImageCus source={Images.icUploadImage} style={nstyles.nIcon40} />
                                </TouchableOpacity>
                        }
                        <TextApp style={{ marginVertical: 5 }}>{'Mặt trước'}</TextApp>
                    </TouchableOpacity>
                    <View style={{ width: 10 }} />
                    <TouchableOpacity onPress={() => { onChooseImage(TypeFaceImage.FaceBehind) }} style={stUploadCMND.viewID}>
                        {
                            AnhCMNDS?.uri || userCD?.AnhCMNDS ? <ImageCus
                                source={userCD?.AnhCMNDS && props.isEdit && !AnhCMNDS?.uri ? { uri: appConfig.domain + userCD?.AnhCMNDS } : { uri: AnhCMNDS?.uri }}
                                style={{
                                    height: 100, width: '100%'
                                }} resizeMode={'contain'}
                            /> :
                                <TouchableOpacity onPress={() => { onChooseImage(TypeFaceImage.FaceBehind) }} style={stUploadCMND.addViewId}>
                                    <ImageCus source={Images.icUploadImage} style={nstyles.nIcon40} />
                                </TouchableOpacity>
                        }
                        <TextApp style={{ marginVertical: 5 }}>{'Mặt sau'}</TextApp>
                    </TouchableOpacity>
                </View>
            </View >
        </>
    )
}
const ComponentIndex = {
    ComponentHVT, ComponentTypeDD, ComponentInputDD, ComponentNoiCap, ComponentMK, ComponentNgayCap, ComponentNhapMK, ComponentDienThoai, ComponentGioiTinh
    , ComponentQuocTich, ComponentDanToc, ComponentTonGiao, ComponentDiaChi, ComponentNgaySinh, ComponentEmail, ComponentUserName, ComponentTinh, ComponentQuanHuyen,
    ComponentPhuongXa, UploadCMND
}
export default ComponentIndex