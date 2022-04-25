import React, { forwardRef, Component, useState, useMemo, useImperativeHandle, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ComponentItem, { TYPES } from './Component';
import Utils from '../../../../app/Utils';
import { colors } from '../../../../styles';
import FontSize from '../../../../styles/FontSize';


const ThongTinChungRender = forwardRef((props, ref) => {
    const { isEdit, listCom = [] } = props || {};
    const [objectData, setobjectData] = useState(props.objectData || {});
    const [objectError, setobjectError] = useState('');
    const [objectDataSelect, setobjectDataSelect] = useState({})
    const callBackImage = (val) => {
    }
    const ChangeObjectData = (key, val) => {
        // if (val) {
        setobjectData({ ...objectData, [key]: val })
        if (props?.listenState) {
            props?.listenState({ ...objectData, [key]: val, keyChange: key })
        }
        // }
    }
    const onPickImage = (key) => {
        let options = {
            assetType: 'Photos',//All,Videos,Photos - default
            multi: false,// chọn 1 or nhiều item
            response: (val) => ChangeObjectData(key, val[0]), // callback giá trị trả về khi có chọn item
            limitCheck: 1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
            showTakeCamera: true
        }
        Utils.navigate('Modal_MediaPicker', options);
    }
    useEffect(() => {
        setobjectData({ ...props.objectData })
    }, [props.objectData])
    useImperativeHandle(ref, () => ({
        getData: () => {
            let newObject = { ...objectData }
            for (let index = 0; index < listCom.length; index++) {
                const element = listCom[index];
                if (element.check) {
                    if (element.key in newObject) {

                    } else {
                        newObject = { ...newObject, [element.key]: element.value ? element.value : '' }
                    }
                }
            }
            setobjectData(newObject);
            return newObject;
        },
        setData: (data) => setobjectData({ ...objectData, ...data }),
        setDataDropDown: (key, val) => {
            Utils.nlog("[vao-----11111", key, val);
            setobjectDataSelect({ ...objectDataSelect, [key]: val })
        }
    }));
    const _viewItem = (item, value) => {
        // Utils.nlog('Log [item]', item)
        return (
            <View key={item.id} style={{
                flex: 1,
                paddingVertical: FontSize.scale(15),
                borderBottomColor: colors.black_50,
            }}>
                <Text style={{ textAlign: 'center', color: colors.black_60, marginHorizontal: 8 }} >{item[value]}</Text>
            </View>
        )
    }
    const onPressModal = (item) => {
        const { key, title_drop = 'Danh sách', keyView = '', Edit = false } = item;
        Utils.nlog('Log [item]', item)
        Utils.navigate('Modal_ComponentSelectBottom', {
            callback: (val) => ChangeObjectData(key, val), item: objectData[key] || '',
            title: title_drop,
            AllThaoTac: objectDataSelect[key] || [],
            ViewItem: (item) => _viewItem(item, keyView), Search: true, key: keyView
        })
    }
    const renderCom = (item, index) => {
        const { name, key, keyView, placehoder, errorText, helpText, value, list = [], checkNull = false } = item;

        switch (item.type) {
            case TYPES.Title:
                return useMemo(() => <ComponentItem.ComponentTitle isEdit={isEdit} {...item} key={index} value={item.name} />, [item])
                break;
            case TYPES.ImagePicker:
                return useMemo(() => <ComponentItem.ComponentImagePicker onPress={() => onPickImage(key)} isEdit={isEdit} {...item} key={index} value={objectData[key] || ''} />, [item, objectData])
                break;
            case TYPES.GioiTinh:
                return useMemo(() => <ComponentItem.ComponentGioiTinh {...item} listCom={list} value={objectData[key] || value}
                    onPress={val => {
                        ChangeObjectData(key, val)
                    }}
                    isEdit={isEdit} key={index} />, [item, objectData, objectData[key]])
                break;
            case TYPES.CauHoi:
                return useMemo(() => <ComponentItem.ComponentCauHoi {...item} listCom={list} value={objectData[key] || value}
                    onPress={val => {
                        ChangeObjectData(key, val)
                    }}
                    isEdit={isEdit} key={index} />, [item, objectData, objectData[key]])
                break;
            case TYPES.QuanHe:
                return useMemo(() => <ComponentItem.ComponentQuanHe {...item} listCom={list} value={objectData[key] || value}
                    onPress={val => {
                        ChangeObjectData(key, val)
                    }}
                    isEdit={isEdit} key={index} />, [item, objectData, objectData[key]])
                break;
            case TYPES.TextInput:
                return useMemo(() => <ComponentItem.ComponentInput isEdit={isEdit}  {...item} key={index} value={objectData[key] || ''}
                    onPress={() => { }}
                    onChangTextIndex={val => ChangeObjectData(key, val)}
                    // isEdit={true}
                    placeholder={placehoder}
                    title={name}
                // keyboardType="numeric"
                />, [objectData[key], item, objectData])
                break;
            case TYPES.TextInputView:
                return useMemo(() => {
                    if (checkNull) {
                        if (!objectData[key]) {
                            return <View />
                        }
                    } else {
                        return <ComponentItem.ComponentInputView isEdit={false}  {...item} key={index} value={objectData[key] || ''}
                            onPress={() => { }}
                            onChangTextIndex={val => setobjectData({ ...objectData, [key]: val })}
                            // isEdit={true}
                            placeholder={placehoder}
                            title={name}
                        // keyboardType="numeric"
                        />
                    }
                    // checkNull
                }, [objectData[key], item])
                break;
            case TYPES.TextInputPass:
                return useMemo(() => <ComponentItem.ComponentInputPass isEdit={isEdit}  {...item} key={index} value={objectData[key] || ''}
                    onPress={() => { }}
                    onChangTextIndex={val => ChangeObjectData(key, val)}
                    isEdit={true}
                    placeholder={placehoder}
                    title={name}
                // keyboardType="numeric"
                />, [objectData[key], item, objectData])
                break;
            case TYPES.DatePicker:
                return useMemo(() => <ComponentItem.ComponentDatePicker isDrop={true}  {...item} key={index} value={objectData[key] || ''}
                    onChangTextIndex={val => ChangeObjectData(key, val)}
                    isEdit={true}
                    placeholder={placehoder}
                    title={name}
                // keyboardType="numeric"
                />, [objectData[key], item, objectData])
                break;
            case TYPES.DropDown:
                return useMemo(() => <ComponentItem.ComponentDrop  {...item} isDrop={true} key={index} value={objectData[key] ? objectData[key][keyView] || '' : ''}
                    onPress={() => onPressModal(item)}
                    onChangTextIndex={val => ChangeObjectData(key, val)}
                    isEdit={true}
                    placeholder={placehoder}
                    title={name}
                // keyboardType="numeric"
                />, [objectData[key], item, objectData, onPressModal])
                break;
            case TYPES.Children:
                return props.children;
                break;
            default:
                return <View />
                break;
        }
    }
    // Utils.nlog("data---", objectData);
    return (<View ref={ref} style={{}}>
        {
            listCom.map(renderCom)
        }
    </View>)
});


export default ThongTinChungRender

const styles = StyleSheet.create({})
