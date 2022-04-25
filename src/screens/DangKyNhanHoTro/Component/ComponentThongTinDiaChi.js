import React, { forwardRef, Component, useState, useMemo, useImperativeHandle, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import Utils from '../../../../app/Utils'
import { colors } from '../../../../styles'
import FontSize from '../../../../styles/FontSize'
import apis from '../../../apis'
import ComponentItem, { TYPES } from '../../user/dangky/Component'
const ComponentThongTinDiaChi = forwardRef((props, ref) => {
    const { isEdit, listCom = [], setData = () => { } } = props || {};
    const [objectData, setobjectData] = useState({ 'DiaChi': props['DiaChi'] || '' });
    const [objectError, setobjectError] = useState('');
    const [objectDataSelect, setobjectDataSelect] = useState({
        "to": [],
        "khuPho": [],
        "IdDonVi": [],
        "huyen": [],
        "tinh": [],

    })
    useEffect(() => {
        // chạy hàm init trước khởi tạo vùng dữ liệu
        initDataCheckProps();


    }, [])
    // hàm chạy khơi tạo vùng dữ liệu
    // objectData là object nếu có biến truyền vào trùng id với sẽ gắn biến đó vào objectData
    // objectDataSelect lại object lấy dữ liệu khi get api về để load các dữ liệu sau
    const initDataCheckProps = async () => {
        // Utils.nlog('props init ', props['tinh'])
        // Utils.nlog('props init ', props['huyen'])
        // Utils.nlog('props init ', props['IdDonVi'])
        // Utils.nlog('props init ', props['khuPho'])
        // Utils.nlog('props init ', props['to'])
        let object = {}
        let objectsl = {};
        //Get Tỉnh Thành
        let res = await getListDonViCap('', 1, true);
        // Lay data tinh
        if (res.status == 1) {
            const { data = [] } = res;
            let checkKey = data.find(i => i["IDTinhThanh"] == Number(props['tinh']));
            // Utils.nlog('<><><><><><><><><>', checkKey)
            object = { ...object, ['tinh']: checkKey ? checkKey : '' }
            objectsl = { ...object, ['tinh']: data }
            // Utils.nlog("[initDataCheckProps]TINH <><><><><><><><><><><><>", objectsl);
        }
        // Đây xét những điều kiện khi nhận props ( truyền dữ liệu vào )
        if (props['tinh'] && props['huyen']) {
            let res = await getListDonViCap(props['tinh'], 2, true);
            // Utils.nlog("[HUYEN]", res);
            if (res.status == 1) {
                const { data = [] } = res;
                let checkKey = data.find(i => i["IDQuanHuyen"] == Number(props['huyen']));
                // Utils.nlog("[checkKey]", checkKey);
                object = { ...object, ['huyen']: checkKey ? checkKey : '' }
                objectsl = { ...objectsl, ['huyen']: data }
                // Utils.nlog("[initDataCheckProps]HUYEN <><><><><><><><><><><><>", objectsl);
            }
        }
        // biến chuyền vào là phường và quận
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
        // biến chuyền vào mỗi là huyện
        if (props['huyen']) {
            let res = await getListDonViCap(props['huyen'], 3, true);
            // Utils.nlog("[XA]", res);
            if (res.status == 1) {
                const { data = [] } = res;

                objectsl = { ...objectsl, ['IdDonVi']: data }
                // Utils.nlog("[initDataCheckProps]PHUONG <><><><><><><><><><><><>", objectsl);
            }
        }
        // biến truyền vào là phường và khu phố
        if (props['IdDonVi'] && props['khuPho']) {
            // Utils.nlog(`props['IdDonVi']`, props['IdDonVi'])
            // Utils.nlog(`props['khuPho']`, props['khuPho'])
            let res = await getListDonViCap(props['IdDonVi'], 4, true);
            // Utils.nlog("[KhuPho] res", res);
            if (res.status == 1) {
                const { data = [] } = res;
                let checkKey = data.find(i => i["Id"] == Number(props['khuPho']));
                // Utils.nlog("[checkKey]", checkKey);
                object = { ...object, ['khuPho']: checkKey ? checkKey : '' }
                objectsl = { ...objectsl, ['khuPho']: data }
                // Utils.nlog("[initDataCheckProps]KHUPHO <><><><><><><><><><><><>", objectsl);
                // 
                // object = { ...object, ['to']: '' }
                // objectsl = { ...objectsl, ['to']: [] }
            }
        }
        // biến truyền vào là tổ và khu phố
        if (props['to'] && props['khuPho']) {
            // Utils.nlog(`props['to']===>`, props['to'])
            // Utils.nlog(`props['khuPho']===>`, props['khuPho'])
            let res = await getListDonViCap(props['khuPho'], 5, true);
            // Utils.nlog("[tổ ]", res);
            if (res.status == 1) {
                const { data = [] } = res;
                let checkKey = data.find(i => i["Id"] == Number(props['to']));
                // Utils.nlog("[checkKey]", checkKey);
                object = { ...object, ['to']: checkKey ? checkKey : '' }
                objectsl = { ...objectsl, ['to']: data }
                // Utils.nlog("[initDataCheckProps]TO <><><><><><><><><><><><>", objectsl);
                // setobjectData({ ...objectData, ...object })
                // setobjectDataSelect({ ...objectDataSelect, ...objectsl })
            }
        }
        // Utils.nlog("[data init-----123--object]", object);
        // Utils.nlog("[data init-----123--objectsl]", objectsl);
        setobjectData({ ...objectData, ...object })
        setobjectDataSelect({ ...objectDataSelect, ...objectsl })
    }
    const getListDonViCap = async (IdDV, idCap = 1, isReturn = false) => {
        if (idCap == 1) {
            let res = await apis.ApiApp.GetTinhThanh()
            if (isReturn) {
                return res;
            }
        }
        else if (idCap == 2) {
            if (isReturn) {
                return GetQuanHuyen(IdDV, isReturn)
            } else {
                GetQuanHuyen(IdDV, isReturn)
            }
        }
        else if (idCap == 3) {
            if (isReturn) {
                return GetPhuongXa(IdDV, isReturn)
            } else {
                GetPhuongXa(IdDV, isReturn)
            }
        }
        else if (idCap == 4) {
            if (isReturn) {
                return GetKhuPho(IdDV, isReturn)
            } else {
                GetKhuPho(IdDV, isReturn)
            }
        }
        else if (idCap == 5) {
            if (isReturn) {
                return GetTo(IdDV, isReturn)
            } else {
                GetTo(IdDV, isReturn)
            }
        }
    }
    // api lay quan huyen
    const GetQuanHuyen = async (id, isReturn = false) => {
        let res = await apis.ApiApp.GetQuanHuyen(id || -1)
        if (isReturn) {
            return res;
        }
        // Utils.nlog('Get Api Quan Huyen <><><><><> : ', res.data)
        setobjectDataSelect({ ...objectDataSelect, ["huyen"]: res.data })
        // Utils.nlog('Quan Huyen objectDataSelect : ', objectDataSelect)
    }
    // api lay phuong xa
    const GetPhuongXa = async (id, isReturn = false) => {
        let res = await apis.ApiApp.GetPhuongXa(id || -1)
        if (isReturn) {
            return res;
        }
        // Utils.nlog('Get Api Phuong Xa <><><><><> : ', res.data)
        setobjectDataSelect({ ...objectDataSelect, ["IdDonVi"]: res.data })
        // Utils.nlog('Phuong Xa objectDataSelect : ', objectDataSelect)
    }
    // api lay khu pho
    const GetKhuPho = async (id, isReturn = false) => {
        let res = await apis.ApiApp.GetKhuPho(id);
        if (isReturn) {
            return res;
        }
        // Utils.nlog('Get Api Khu Pho <><><><><> : ', res.data)
        setobjectDataSelect({ ...objectDataSelect, ["khuPho"]: res.data })
        // Utils.nlog('Khu pho objectDataSelect : ', objectDataSelect)
        // Utils.nlog('Khu pho objectData : ', objectData)
    }
    // api lay to
    const GetTo = async (id, isReturn = false) => {
        let res = await apis.ApiApp.GetTo(id);
        if (isReturn) {
            return res;
        }
        // Utils.nlog('Get Api To <><><><><> : ', res.data)
        setobjectDataSelect({ ...objectDataSelect, ["to"]: res.data })
        // Utils.nlog('To objectDataSelect : ', objectDataSelect)
        // Utils.nlog('To objectData : ', objectDataSelect)
    }
    // =========================================================
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
    // Sự kiện khi nhấn object sẽ gắn object đó vào objectData
    const ChangeObjectData = (key, val) => {
        // Utils.nlog("=======BUOC THUC HIEN:========", key, val)
        if (key == 'tinh') {
            setobjectData({ ...objectData, [key]: val, ["IdDonVi"]: '', ["huyen"]: '', ['khuPho']: '', ['to']: '' })
            // get huyen
            getListDonViCap(val["IDTinhThanh"], 2)
        }
        else if (key == 'huyen') {
            setobjectData({ ...objectData, [key]: val, ["IdDonVi"]: '', ['khuPho']: '', ['to']: '' })
            // get phuong
            getListDonViCap(val["IDQuanHuyen"], 3)
        }
        else if (key == 'IdDonVi') {
            setobjectData({ ...objectData, [key]: val, ['khuPho']: '', ['to']: '' })
            // get khu pho
            getListDonViCap(val["IdPhuongXa"], 4)
        }
        else if (key == 'khuPho') {
            // Utils.nlog("BUOC THUC HIEN khuPho:", key, val)
            setobjectData({ ...objectData, [key]: val, ['to']: '' })
            //get to
            getListDonViCap(val["Id"], 5)
        }
        else {
            //set tổ
            setobjectData({ ...objectData, [key]: val })
        }

    }

    const onPressModal = (item) => {
        const { key, title_drop = 'Danh sách', keyView = '' } = item;
        // Utils.nlog("data---------Này nèKEY", item)
        // Utils.nlog("[LOG] key data", key, objectDataSelect[key])
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
                        // xét điều kiện khi cho chỉnh sửa dropdown ( chọn dữ liệu )
                        onPress={item.isEdit ? () => onPressModal(item) : () => { }}

                        onChangTextIndex={val => ChangeObjectData(key, val)}
                        placeholder={placehoder}
                        title={name}
                        styleLabel={{
                            color: colors.black_80,
                            fontWeight: '500',
                            fontSize: FontSize.reText(16),
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
                        // onPress={() => onPressModal(item)}
                        // xét điều kiện khi cho chỉnh sửa dropdown ( chọn dữ liệu )
                        onPress={item.isEdit ? () => onPressModal(item) : () => { }}
                        onChangTextIndex={val => ChangeObjectData(key, val)}
                        isEdit={true}
                        placeholder={placehoder}
                        title={name}
                        styleLabel={{
                            color: colors.black_80,
                            fontWeight: '500',
                            fontSize: FontSize.reText(16),
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
    // Utils.nlog('<><><><> ỌBJECT DATA <><><><><>', objectData)
    return (
        <View>
            {
                listCom.map(renderCom)
            }
        </View>
    )
})

export default ComponentThongTinDiaChi
