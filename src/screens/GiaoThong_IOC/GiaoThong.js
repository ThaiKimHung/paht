import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import { getBottomSpace } from "react-native-iphone-x-helper";
import Utils, { icon_typeToast } from '../../../app/Utils'
import { ButtonCom, HeaderCus } from '../../../components'
import ImageCus from "../../../components/ImageCus";
import { colors } from '../../../styles'
import FontSize from '../../../styles/FontSize'
import { nstyles } from "../../../styles/styles";
import apis from "../../apis";
import { Images } from '../../images'
import { TYPES } from '../user/dangky/Component'
import ThongTinChungRender from "../user/dangky/ThongTinChungRender";

const listComChung = [
    {
        id: 3,
        name: "Biển Số Xe",
        type: TYPES.TextInput,
        check: true,
        key: "bienSoXe",
        placehoder: "Nhập Biển Số Xe",
        errorText: "",
        helpText: "",
        note: ' *',
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabelCus: {
            fontSize: FontSize.reText(16),
        },
    },
    {
        id: 4,
        name: 'Loại vi phạm',
        type: TYPES.DropDown,
        check: true,
        key: 'idViPham',
        keyView: 'value',
        placehoder: '- Vui lòng chọn vi phạm -',
        errorText: '',
        helpText: '',
        isRow: false,
        isEnd: true,
        checkNull: true,
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
            backgroundColor: colors.white,
        },
        styleLabelCus: {
            fontSize: FontSize.reText(16)
        },
        prefixlabelCus: {
            tintColor: colors.cobaltBlue,
        },
        note: ' *'
    },
];

const _DateFrom = [
    {
        id: 1,
        // moment(dateFrom).format('YYYY/MM/DD')
        name: 'Từ ngày : ',
        type: TYPES.DatePicker,
        check: true,
        key: "ngayBatDau",
        placehoder: "Từ ngày",
        errorText: "",
        helpText: "",
        checkNull: true,
        note: '*',
        value: '01/01/2021',
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabelCus: {
            fontSize: FontSize.reText(16),
        },
        styleLabel: {
            fontSize: FontSize.reText(16), fontWeight: 'bold'
        }
    }
];

const _DateTo = [
    {
        id: 2,
        name: "Đến ngày : ",
        type: TYPES.DatePicker,
        check: true,
        key: "ngayKetThuc",
        placehoder: "Đến ngày",
        errorText: "",
        helpText: "",
        checkNull: true,
        note: '*',
        styleBodyInputCus: {
            borderColor: colors.grayLight,
            borderRadius: 7,
        },
        styleLabelCus: {
            fontSize: FontSize.reText(16),
        },
        styleLabel: {
            fontSize: FontSize.reText(16), fontWeight: 'bold'
        }
    }
];

const LoaiVP = [
    {
        idViPham: -1,
        value: 'Vi phạm không lỗi'
    },
    {
        idViPham: 0,
        value: 'Vi phạm chưa xử lý'
    },
    {
        idViPham: 1,
        value: 'Vi phạm đang xử lý'
    },
    {
        idViPham: 2,
        value: 'Vi phạm đang chờ phê duyệt xử lý'
    },
    {
        idViPham: 3,
        value: 'Vi phạm đang chờ phê duyệt đã xử lý xong'
    },
    {
        idViPham: 4,
        value: 'Vi phạm đã xử lý xong'
    }
];

function fn_DateCompare(DateA, DateB) {
    var a = new Date(DateA);
    var b = new Date(DateB);

    var msDateA = Date.UTC(a.getFullYear(), a.getMonth() + 1, a.getDate());
    var msDateB = Date.UTC(b.getFullYear(), b.getMonth() + 1, b.getDate());
    Utils.nlog('msDateA     :     ', msDateA)

    if (parseFloat(msDateA) > parseFloat(msDateB)) {
        return -1;  // greater than
    }
    else
        return 1;  // error
}

const GiaoThong = (props) => {
    const refTTChung = useRef(null);

    const refDateStart = useRef(null);
    const refDateEnd = useRef(null);

    const [page, setpage] = useState(0)
    const [dataViPham, setdataViPham] = useState([])
    const [dateNow, setdateNow] = useState('')

    const [DateStart, setDateStart] = useState('')
    const [DateEnd, setDateEnd] = useState('')

    useEffect(() => {
        Utils.showMsgBoxOK({ props }, 'Thông báo', 'Hệ thống đang trong quá trình thử nghiệm chỉ tra cứu', 'Xác nhận')
        setdateNow(moment(new Date()).format('DD/MM/YYYY'))
        setDateStart(moment(new Date()).add(-15, 'day').format('DD/MM/YYYY'))
        setDateEnd(moment(new Date()).format('DD/MM/YYYY'))
        refTTChung?.current?.setDataDropDown('idViPham', LoaiVP)
    }, []);
    useEffect(() => {

    }, [dataViPham]);


    const getListGiaoThong = async (isReturn = false, isNext = false, newdateFrom, newdateTo, bienSoXe, IdViPham) => {
        let objectTTC = refTTChung.current.getData();
        if (isNext) {
            setpage(page + 1)
        }
        let dateFrom = newdateFrom ? newdateFrom : objectTTC.ngayBatDau.split("/").reverse().join("/");
        let dateTo = newdateTo ? newdateTo : objectTTC.ngayKetThuc.split("/").reverse().join("/");
        let plate = bienSoXe ? bienSoXe : objectTTC.bienSoXe;

        Utils.setToggleLoading(true);
        let res = await apis.ApiReputa.getListViPham(IdViPham, plate, moment(dateFrom).format('YYYY-MM-DD 00:00:00'), moment(dateTo).format('YYYY-MM-DD 00:00:00'), page, 20)
        Utils.nlog('data list vi pham ', res.data)
        Utils.setToggleLoading(false);
        if (isReturn) {
            return res;
        } else {
            setdataViPham([])
            setdataViPham(res.data)
            Utils.nlog('data sự kiện refeshing : ', dataViPham)
        }
    }

    const infoItemViPhamGiaoThong = (item) => {
        return <View style={{ flex: 1 }}>
            <Text style={stGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Biển số xe`} </Text>: {item?.plate}</Text>
            <Text style={stGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Địa bàn tỉnh`} </Text>: {item?.province}</Text>
            <Text style={stGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Thành Phố`}</Text> : {item?.district}</Text>
            <Text style={stGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Quận/ Huyện`}</Text> : {item?.village}</Text>
            <Text style={stGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Thời gian vi phạm`} </Text>: {item?.vioTime}</Text>
        </View>

    }


    const _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    Utils.navigate('Modal_ChiTietGiaoThong', { dataItem: item })
                }} style={stGiaoThong._item}>

                <View style={{ flexDirection: 'row' }}>
                    {
                        infoItemViPhamGiaoThong(item)
                    }
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <ImageCus
                            style={{ height: FontSize.scale(120), width: FontSize.scale(120) }}
                            resizeMode={'contain'}
                            source={{ uri: item?.imageLink.trim() }}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };


    const _OnPress = async () => {
        // Utils.nlog('Ngày hiện tại', dateNow) 
        let objectDS = refDateStart?.current.getData();
        let objectDE = refDateEnd?.current.getData();
        let objectTTC = refTTChung?.current.getData();
        Utils.nlog('objectDS : ' + JSON.stringify(objectDS) + ' ' + 'objectDE : ' + JSON.stringify(objectDE) + ' ' + 'objectTTC : ' + JSON.stringify(objectTTC))

        for (const element of listComChung) {
            if (element["checkNull"] == true && !objectTTC[element["key"]]) {
                Utils.showToastMsg('Thông báo', "Vui lòng kiểm tra điền đầy đủ thông tin " + `${element.name}`,
                    icon_typeToast.warning, 3000, icon_typeToast.warning)
                return;
            }
        }
        let _DateStart = objectDS.ngayBatDau.split("/").reverse().join("-");
        let _DateEnd = objectDE.ngayKetThuc.split("/").reverse().join("-");
        let bienSoXe = objectTTC.bienSoXe + '';
        let loaiViPham = objectTTC.idViPham

        Utils.nlog('_DateStart : ', _DateStart + ' _DateEnd : ' + _DateEnd + ' Bien so xe : ' + bienSoXe)

        let kq = fn_DateCompare(_DateStart, _DateEnd);
        if (kq == -1) {
            Utils.showToastMsg('Thông báo', "Bạn nhập sai định dạng ngày từ và ngày đến ", icon_typeToast.warning, 3000, icon_typeToast.warning)
            return;
        }
        if (bienSoXe.length < 6) {
            Utils.showToastMsg('Thông báo', "Biển số xe không hợp lệ ", icon_typeToast.warning, 3000, icon_typeToast.warning)
            return;
        }
        let res = await getListGiaoThong(true, false, _DateStart, _DateEnd, bienSoXe, loaiViPham.idViPham)

        if (res.data == null) {
            Utils.showToastMsg('Thông báo', res?.error?.message || "Không có dữ liệu", icon_typeToast.warning, 3000, icon_typeToast.warning)
            return;
        }
        // data rong
        if (res.data.length == 0) {
            Utils.showToastMsg('Thông báo', "Dữ liệu rỗng ", icon_typeToast.warning, 3000, icon_typeToast.warning)
            setdataViPham([])
            setdataViPham(res.data)
            return;
        }
        setdataViPham(res.data)
        Utils.nlog('data sự kiện nhấn : ', dataViPham)
    }

    return (
        <View style={nstyles.ncontainer}>
            <HeaderCus
                Sleft={{ tintColor: "white" }}
                onPressLeft={() => Utils.goback({ props })}
                iconLeft={Images.icBack}
                title={`Vi phạm giao thông`}
                styleTitle={{ color: colors.white }}
            />
            <View style={{ ...stGiaoThong.containerBody }}>
                {/*---------- View thông tin chung bao gồm giới tính, CMND, năm sinh, doanh nghiệp, STK, đối tượng, địa chỉ tạm trú và những khó khăn khác ----------*/}
                <Text style={[stGiaoThong.commonTitle, { color: colors.redStar, fontStyle: 'italic' }]}>Hệ thống trong qua trình thử nghiệm chỉ tra cứu!</Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '50%' }}>
                        <ThongTinChungRender ref={refDateStart} listCom={_DateFrom} objectData={{ ngayBatDau: DateStart }} isEdit={true} />
                    </View>
                    <View style={{ width: '50%' }}>
                        <ThongTinChungRender ref={refDateEnd} listCom={_DateTo} objectData={{ ngayKetThuc: DateEnd }} isEdit={true} />
                    </View>
                </View>
                <View>
                    <ThongTinChungRender ref={refTTChung} listCom={listComChung}
                        //  objectData={{ ngayBatDau: '01/01/2021', ngayKetThuc: dateNow }}
                        isEdit={true} />
                </View>


                <View style={[stGiaoThong.ViewButton]}  >
                    <ButtonCom
                        onPress={_OnPress}
                        sizeIcon={30}
                        txtStyle={{ color: colors.white, alignItems: 'center' }}
                        style={{ ...stGiaoThong.buttonSubmit, alignItems: 'center', justifyContent: 'center', fontSize: FontSize.reText(19) }}
                        text={"Tìm Kiếm"}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    {
                        dataViPham.length == 0 || dataViPham ? <FlatList
                            renderItem={_renderItem}
                            data={dataViPham ? dataViPham : []}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={dataViPham}
                            showsVerticalScrollIndicator={false}
                        /> : null
                    }
                </View>
            </View>
        </View>
    )
}


const stGiaoThong = StyleSheet.create({
    containerBody: {
        paddingHorizontal: FontSize.scale(10),
        backgroundColor: colors.colorPaleGrey,
        flex: 1,
        paddingBottom: getBottomSpace(),
    },
    commonTitle: {
        fontWeight: "bold",
        fontSize: FontSize.reText(16),
        color: colors.blueFaceBook,
        textAlign: "center",
        paddingVertical: FontSize.scale(10),
    },
    commonText: {
        fontSize: FontSize.reText(16),
        color: colors.black,
        textAlign: "left",
        fontWeight: '600',
        paddingVertical: FontSize.scale(5)
    },
    buttonSubmit: {
        borderRadius: FontSize.scale(5),
        alignSelf: "center",
        flex: 1,
        padding: FontSize.scale(15),
        width: "100%",
    },
    _item: {
        backgroundColor: colors.white,
        paddingVertical: FontSize.scale(15),
        paddingHorizontal: FontSize.scale(10),
        borderRadius: FontSize.scale(5),
        marginBottom: FontSize.scale(7),
        marginTop: FontSize.scale(7),
        elevation: 6,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 5,
        shadowOpacity: 0.4,
        shadowColor: 'black',
    },
    ViewButton: {
        padding: FontSize.scale(10), flexDirection: "row", height: FontSize.scale(55)
    }
});
export default GiaoThong