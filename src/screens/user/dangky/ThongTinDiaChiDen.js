import React, { forwardRef, Component, useState, useMemo, useImperativeHandle, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ComponentItem, { TYPES } from './Component';
import Utils from '../../../../app/Utils';
import { colors } from '../../../../styles';
import { useSelector } from 'react-redux';
import apis from '../../../apis';
import FontSize from '../../../../styles/FontSize';


const ThongTinDiaChiDen = forwardRef((props, ref) => {
    const { isEdit, listCom = [] } = props || {};
    const [objectData, setobjectData] = useState({ 'DiaChi': props['DiaChi'] || '' });
    const [objectError, setobjectError] = useState('');
    const [objectDataSelect, setobjectDataSelect] = useState({
        // "tinh": [],
        "huyen": [],
        "phuongxa": [],
        "khupho": []

    })
    const initDataCheckProps = async () => {
        // Utils.nlog("[data init-----]", props);
        let object = {};
        let objectsl = {};
        let res = await getListDonViCap('', 2, true);
        Utils.nlog("[HUYEN--dem]", res);
        if (res.status == 1) {
            const { data = [] } = res;
            let checkKey = data.find(i => i["IDQuanHuyen"] == Number(props['huyen']));
            object = { ...object, ['huyen']: checkKey ? checkKey : '' }
            objectsl = { ...objectsl, ['huyen']: data }
        }
        // Utils.nlog("[data init-----123]", object, objectsl);
        setobjectData({ ...objectData, ...object })
        setobjectDataSelect({ ...objectDataSelect, ...objectsl })
    }
    useEffect(() => {
        initDataCheckProps();
    }, [])
    const getListDonViCap = async (IdDV, idCap = 1, isReturn = false) => {
        let res = await apis.ApiHCM.GetDanhSachDonVi(idCap, IdDV)
        if (isReturn) {
            return res;
        }
        setobjectDataSelect({ ...objectDataSelect, [idCap == 3 ? "phuongxa" : 'khupho']: res.data })
    }
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
        setData: setobjectData
    }));
    const _viewItem = (item, value) => {
        // Utils.nlog('Log [item]', item)
        return (
            <View key={item.id} style={{
                flex: 1,
                paddingVertical: FontSize.scale(15),
                borderBottomColor: colors.black_50,
            }}>
                <Text style={{ textAlign: 'center', color: colors.black_60 }} >{item[value] || ''}</Text>
            </View>
        )
    }
    const ChangeObjectData = (key, val) => {
        Utils.nlog("BUOC THUC HIEN:", key, val)
        if (key == 'huyen') {
            setobjectData({ ...objectData, [key]: val, ["phuongxa"]: '', ["khupho"]: '' })
            getListDonViCap(val["IdDonVi"], 3)
        }
        else if (key == 'phuongxa') {
            setobjectData({ ...objectData, [key]: val, ["khupho"]: '' })
            getListDonViCap(val["IdDonVi"], 7)
        }
        else {
            setobjectData({ ...objectData, [key]: val })
        }
    }
    const onPressModal = (item) => {
        const { key, title_drop = 'Danh sách', keyView = '' } = item;
        // Utils.nlog("data---------Này nèKEY", item)
        // Utils.nlog("data---------Này nè", objectDataSelect)
        Utils.navigate('Modal_ComponentSelectBottom', {
            callback: (val) => ChangeObjectData(key, val),
            "item": objectData[key] || {},
            "title": title_drop,
            "AllThaoTac": objectDataSelect[key] || [],
            "ViewItem": (i) => _viewItem(i, keyView),
            "Search": true,
            "key": keyView
        })
    }
    const renderCom = (item, index) => {
        const { name, key, placehoder, errorText, helpText, isEnd, keyView = '' } = item
        // Utils.nlog("HOANG:", objectData[key])
        switch (item.type) {
            case TYPES.Title:
                return useMemo(() => <ComponentItem.ComponentTitle isEdit={isEdit} {...item} key={index} value={item.name} />, [item])
                break;
            case TYPES.TextInput:
                return useMemo(() => <ComponentItem.ComponentInput isEdit={isEdit}  {...item} key={index} value={objectData[key] || ''}
                    onPress={() => { }}
                    onChangTextIndex={val => setobjectData({ ...objectData, [key]: val })}
                    isEdit={true}
                    placeholder={placehoder}
                    title={name}
                // keyboardType="numeric"
                />, [objectData[key], item, objectData, objectDataSelect])
                break;
            case TYPES.DropDown:
                if (item.isRow) {
                    return useMemo(() => <ComponentItem.ComponentDrop  {...item} isDrop={true} key={index} value={objectData[key] ? objectData[key][keyView] : ''}
                        onPress={() => onPressModal(item)}
                        onChangTextIndex={val => ChangeObjectData(key, val)}
                        isEdit={true}
                        placeholder={placehoder}
                        title={name}
                        styleLabel={{
                            color: colors.black_80,
                            fontWeight: '500',
                            fontSize: FontSize.reText(14),
                            ...props.styleLabel,
                        }}
                        styleContainer={{
                            width: '50%',
                            paddingLeft: FontSize.scale(10),
                            paddingRight: isEnd ? FontSize.scale(10) : 0
                        }}
                    // keyboardType="numeric"
                    />, [item, objectData, objectDataSelect])
                } else {
                    return useMemo(() => <ComponentItem.ComponentDrop isDrop={true} isEdit={false}  {...item} key={index} value={objectData[key] ? objectData[key][keyView] : ''}
                        onPress={() => onPressModal(item)}
                        onChangTextIndex={val => ChangeObjectData(key, val)}
                        isEdit={true}
                        placeholder={placehoder}
                        title={name}
                        styleLabel={{
                            color: colors.black_80,
                            fontWeight: '500',
                            fontSize: FontSize.reText(14),
                            ...props.styleLabel,
                        }}
                    // keyboardType="numeric"
                    />, [item, objectData, objectDataSelect])
                }

                break;
            default:
                return <View />
                break;
        }
    }
    // Utils.nlog("data---", objectData);
    return (
        <View ref={ref} style={{
            // paddingHorizontal: FontSize.scale(10),
            flexDirection: 'row', flexWrap: 'wrap',

        }}>
            {
                listCom.map(renderCom)
            }
        </View>
    )
});



export default ThongTinDiaChiDen

const styles = StyleSheet.create({})
