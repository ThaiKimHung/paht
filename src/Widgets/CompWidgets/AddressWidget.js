import { View, Text, StyleSheet } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { DropWidget, InputWidget } from '../CompWidgets'
import { colorsWidget, colors } from '../../../styles/color';
import { ApiRaoVat } from '../apis';
import Utils from '../../../app/Utils';

const KEY_COMP = {
    TINH: 'TINH',
    QUAN: 'QUAN',
    PHUONG: 'PHUONG'
}

const AddressWidget = forwardRef((props, ref) => {
    const [selectedTinh, setSelectedTinh] = useState('')
    const [selectedQuan, setSelectedQuan] = useState('')
    const [selectedPhuong, setSelectedPhuong] = useState('')
    const [dataTinh, setDataTinh] = useState([])
    const [dataQuan, setDataQuan] = useState([])
    const [dataPhuong, setDataPhuong] = useState([])
    const [DiaChi, setDiaChi] = useState(props?.DiaChi || '')

    useEffect(() => {
        getInitProps()
    }, [])

    useEffect(() => {
        if (props?.trackingChange)
            props?.trackingChange({
                Tinh: selectedTinh,
                Quan: selectedQuan,
                Phuong: selectedPhuong,
                DiaChi: DiaChi
            })
    }, [selectedTinh, selectedQuan, selectedPhuong, DiaChi])

    const getInitProps = async () => {
        let resTinh = await ApiRaoVat.GetAllListDMTinhThanh()
        console.log('[LOG] res tinh thanh', resTinh);
        if (resTinh.status == 1) {
            setDataTinh(resTinh?.data)
            let checkTinh = resTinh?.data?.find(tinh => tinh["IDTinhThanh"] == Number(props['IDTinhThanh']));
            setSelectedTinh(checkTinh ? checkTinh : '')
        }

        if (props['IDTinhThanh'] && props['IDQuanHuyen']) {
            let resQuan = await ApiRaoVat.GetListDMQuanHuyenById(props['IDTinhThanh'])
            console.log('[LOG] res quan huyen', resQuan);
            setDataQuan(resQuan?.data)
            let checkQuan = resQuan?.data?.find(quan => quan["IDQuanHuyen"] == Number(props['IDQuanHuyen']));
            setSelectedQuan(checkQuan ? checkQuan : '')
        }

        if (props['IDQuanHuyen'] && props['IdXaPhuong']) {
            let resPhuong = await ApiRaoVat.GetListDMXaPhuongById(props['IDQuanHuyen'])
            console.log('[LOG] res phuong', resPhuong);
            setDataPhuong(resPhuong?.data)
            let checkPhuong = resPhuong?.data?.find(phuong => phuong["IdXaPhuong"] == Number(props['IdXaPhuong']));
            setSelectedPhuong(checkPhuong ? checkPhuong : '')
        }
    }

    const getQuanHuyen = async (val) => {
        let resQuan = await ApiRaoVat.GetListDMQuanHuyenById(val?.IDTinhThanh)
        console.log('[LOG] res get quan huyen', resQuan);
        setDataQuan(resQuan?.data)
        setSelectedQuan('')
        setDataPhuong([])
        setSelectedPhuong('')
    }

    const getPhuong = async (val) => {
        let resPhuong = await ApiRaoVat.GetListDMXaPhuongById(val?.IDQuanHuyen)
        console.log('[LOG] res get phuong', resPhuong);
        setDataPhuong(resPhuong?.data)
        setSelectedPhuong('')
    }

    useImperativeHandle(ref, () => ({
        getData: () => {
            return {
                Tinh: selectedTinh,
                Quan: selectedQuan,
                Phuong: selectedPhuong,
                DiaChi: DiaChi
            }
        }
    }));

    const viewItemList = (item, value, keyId, currentSelected) => {
        // Utils.nlog('Log [item]', item, value, keyId, currentSelected)
        return (
            <View key={item.id} style={{
                flex: 1,
                paddingVertical: 12,
                borderBottomColor: colors.black_50,
                backgroundColor: item[keyId] == currentSelected[keyId] ? colorsWidget.mainOpacity : 'white',
                paddingHorizontal: 10
            }}>
                <Text style={{ textAlign: 'left', color: item[keyId] == currentSelected[keyId] ? colorsWidget.main : colorsWidget.textDropdown, }} >{item[value] || ''}</Text>
            </View>
        )
    }

    const changeData = (key, val) => {
        console.log('[LOG] change data', key, val)
        switch (key) {
            case KEY_COMP.TINH:
                setSelectedTinh(val)
                getQuanHuyen(val)
                break;
            case KEY_COMP.QUAN:
                setSelectedQuan(val)
                getPhuong(val)
                break;
            case KEY_COMP.PHUONG:
                setSelectedPhuong(val)
                break;
            default:
                break;
        }
    }

    const onPressChoose = (config) => {
        const { title_drop = 'Danh sách', keyView = '', key, currentSelected, data = [], keyID, isWhiteHeader } = config
        Utils.navigate('Modal_ComponentSelectBottom', {
            callback: (val) => changeData(key, val),
            "item": currentSelected || {},
            "title": title_drop,
            "AllThaoTac": data || [],
            "ViewItem": (item, currentSelected) => viewItemList(item, keyView, keyID, currentSelected),
            "Search": true,
            "key": keyView,
            "isWhiteHeader": isWhiteHeader
        })
    }

    const onPressTinh = () => {
        onPressChoose({
            title_drop: 'Danh sách tỉnh / thành phố',
            keyView: 'TenTinhThanh',
            key: KEY_COMP.TINH,
            currentSelected: selectedTinh,
            data: dataTinh,
            keyID: 'IDTinhThanh',
            isWhiteHeader: true
        })
    }

    const onPressQuan = () => {
        onPressChoose({
            title_drop: 'Danh sách quận / huyện',
            keyView: 'TenQuanHuyen',
            key: KEY_COMP.QUAN,
            currentSelected: selectedQuan,
            data: dataQuan,
            keyID: 'IDQuanHuyen',
            isWhiteHeader: true
        })
    }

    const onPressPhuong = () => {
        onPressChoose({
            title_drop: 'Danh sách phường / xã',
            keyView: 'TenXaPhuong',
            key: KEY_COMP.PHUONG,
            currentSelected: selectedPhuong,
            data: dataPhuong,
            keyID: 'IdXaPhuong',
            isWhiteHeader: true
        })
    }

    return (
        <View>
            <DropWidget
                placeholder={'Chọn tỉnh / thành phố'}
                value={selectedTinh?.TenTinhThanh}
                onPress={onPressTinh}
                style={stAddressWidget.drop}
                label={'Tỉnh/Thành phố'}
                required
                styleLabel={stAddressWidget.label}
            />
            <DropWidget
                placeholder={'Chọn quận / huyện'}
                value={selectedQuan?.TenQuanHuyen}
                onPress={onPressQuan}
                style={stAddressWidget.drop}
                label={'Quận/Huyện'}
                required
                styleLabel={stAddressWidget.label}
            />
            <DropWidget
                placeholder={'Chọn phường / xã'}
                value={selectedPhuong?.TenXaPhuong}
                onPress={onPressPhuong}
                style={stAddressWidget.drop}
                label={'Phường / Xã'}
                required
                styleLabel={stAddressWidget.label}
            />
            <InputWidget
                onChangeText={text => setDiaChi(text)}
                label={'Địa chỉ'}
                required
                placeholder={'Địa chỉ'}
                styleLabel={{ marginTop: 5 }}
                value={DiaChi}
            />
        </View>
    )
})

const stAddressWidget = StyleSheet.create({
    drop: {
        backgroundColor: colorsWidget.grayDropdown,
        borderRadius: 6,
        borderWidth: 0
    },
    label: {
        marginTop: 15
    }
})

export default AddressWidget