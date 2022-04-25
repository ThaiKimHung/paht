import React, { forwardRef, Component, useState, useMemo, useImperativeHandle, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ComponentItem, { TYPES } from './Component';
import Utils from '../../../../app/Utils';
import { colors } from '../../../../styles';
import { useSelector } from 'react-redux';
import apis from '../../../apis';
import FontSize from '../../../../styles/FontSize';


const ThongTinDiaChi = forwardRef((props, ref) => {
    const { isEdit, listCom = [] } = props || {};
    const [objectData, setobjectData] = useState({ 'DiaChi': props['DiaChi'] || '' });
    const [objectError, setobjectError] = useState('');
    const [objectDataSelect, setobjectDataSelect] = useState({
        "IdDonVi": [],
        "huyen": [],
        "tinh": [],

    })
    const initDataCheckProps = async () => {
        // Utils.nlog("[data init-----]", props);
        let object = {};
        let objectsl = {};
        let res = await getListDonViCap('', 1, true);
        // Utils.nlog("res----", res)
        if (res.status == 1) {
            const { data = [] } = res;
            let checkKey = data.find(i => i["IDTinhThanh"] == Number(props['tinh']));
            // Utils.nlog("[checkKey]", checkKey);
            object = { ...object, ['tinh']: checkKey ? checkKey : '' };
            objectsl = { ...objectsl, ['tinh']: data }
        }
        if (props['tinh'] && props['huyen']) {
            let res = await getListDonViCap(props['tinh'], 2, true);
            // Utils.nlog("[HUYEN]", res);
            if (res.status == 1) {
                const { data = [] } = res;
                let checkKey = data.find(i => i["IDQuanHuyen"] == Number(props['huyen']));
                object = { ...object, ['huyen']: checkKey ? checkKey : '' }
                objectsl = { ...objectsl, ['huyen']: data }
            }
        }
        if (props['IdDonVi'] && props['huyen']) {
            let res = await getListDonViCap(props['huyen'], 3, true);
            // Utils.nlog("[XA]", res);
            if (res.status == 1) {
                const { data = [] } = res;
                let checkKey = data.find(i => i["IdPhuongXa"] == Number(props['IdDonVi']));
                object = { ...object, ['IdDonVi']: checkKey ? checkKey : '' }
                objectsl = { ...objectsl, ['IdDonVi']: data }
            }
        }
        // Utils.nlog("[data init-----123]", object, objectsl);
        setobjectData({ ...objectData, ...object })
        setobjectDataSelect({ ...objectDataSelect, ...objectsl })
    }
    useEffect(() => {
        initDataCheckProps();
    }, [])
    const getListDonViCap = async (IdDV, idCap = 1, isReturn = false) => {
        if (idCap == 1) {
            let res = await apis.ApiApp.GetTinhThanh()
            if (isReturn) {
                return res;
            }
        } else if (idCap == 2) {
            if (isReturn) {
                return GetQuanHuyen(IdDV, isReturn)
            } else {
                GetQuanHuyen(IdDV, isReturn)
            }

        } else if (idCap == 3) {
            if (isReturn) {
                return GetPhuongXa(IdDV, isReturn)
            } else {
                GetPhuongXa(IdDV, isReturn)
            }
        }
    }
    const GetQuanHuyen = async (id, isReturn = false) => {
        let res = await apis.ApiApp.GetQuanHuyen(id || -1)
        // Utils.nlog("QUAN TRONG:", id, res)
        if (isReturn) {
            return res;
        }
        // if (res && res.length > 0) {
        setobjectDataSelect({ ...objectDataSelect, ["huyen"]: res.data })
        // } else {
        // }
    }
    const GetPhuongXa = async (id, isReturn = false) => {
        let res = await apis.ApiApp.GetPhuongXa(id || -1)
        // Utils.nlog('[LOG] res phuong xa', id, res)
        if (isReturn) {
            return res;
        }
        // if (res && res.length > 0) {
        setobjectDataSelect({ ...objectDataSelect, ["IdDonVi"]: res.data })
        // } else {
        //     this.setState({ listPhuongXa: [], phuongxa: '' })
        // }
    }
    // useEffect(() => {
    //     setobjectDataSelect({
    //         ...objectDataSelect,
    //         "tinh": listProvine
    //     })
    // }, [listProvine])

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
        // Utils.nlog("BUOC THUC HIEN:", key, val)
        if (key == 'tinh') {
            setobjectData({ ...objectData, [key]: val, ["IdDonVi"]: '', ["huyen"]: '' })
            getListDonViCap(val["IDTinhThanh"], 2)
        }
        else if (key == 'huyen') {
            setobjectData({ ...objectData, [key]: val, ["IdDonVi"]: '' })
            getListDonViCap(val["IDQuanHuyen"], 3)
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
    Utils.nlog("data---", objectData);
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



export default ThongTinDiaChi

const styles = StyleSheet.create({})
