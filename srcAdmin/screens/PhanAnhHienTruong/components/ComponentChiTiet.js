import React, { Component, Fragment } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    Linking,
    TextInput,
    Platform,
    ScrollView
} from 'react-native';
import { nstyles, Width, paddingBotX, khoangcach, Height } from '../../../../styles/styles'
import { colors, sizes } from '../../../../styles';
import Utils from '../../../../app/Utils';
import HtmlViewCom from '../../../../components/HtmlView';
import { appConfig } from '../../../../app/Config';
import AutoHeightWebViewCus from '../../../../components/AutoHeightWebViewCus';
import ImageFileCus from './ImageFileCus';

const ComponentEmailDiaChi = ({ dataCTPA }) => {
    return (<>
        <View style={[styles.noidung]}>
            <Text style={{ flex: 1 }}>
                {<Text style={[styles.title]}>Email: </Text>}
                {dataCTPA.EmailCD}
            </Text>
        </View>
        <View style={[styles.noidung]}>
            <Text style={{ flex: 1 }}>
                {<Text style={[styles.title]}>Địa chỉ: </Text>}
                {dataCTPA.DiaChiCD}
            </Text>
        </View>
    </>)
}
//id=2
const ComponentTieuDe = ({ dataCTPA }) => {
    return (<>{
        dataCTPA && dataCTPA.TieuDe ? <View style={[styles.noidung, { paddingTop: 5 }]}>
            <Text style={{ flex: 1, fontWeight: 'bold' }}>
                <Text style={[styles.title]}>Tiêu đề: </Text>
                <Text style={{ fontWeight: 'bold' }}>{dataCTPA.TieuDe}</Text>
            </Text>
        </View> : null
    }

    </>)
}
//id =3
const ComponentCMLVHTN = ({ dataCTPA }) => {
    return (<>
        {
            dataCTPA.TenChuyenMuc ? <View style={[styles.noidung]}>
                <Text style={{ flex: 1 }}>
                    {<Text style={[styles.title]}>Chuyên mục: </Text>}
                    {dataCTPA.TenChuyenMuc}
                </Text>
            </View> : null
        }

        {dataCTPA.TenLinhVuc ?
            <View style={[styles.noidung]}>
                <Text style={{ flex: 1 }}>
                    {<Text style={[styles.title]}>Lĩnh vực: </Text>}
                    {dataCTPA.TenLinhVuc}
                </Text>
            </View> : null
        }
        <View style={[styles.noidung]}>
            <Text style={{ flex: 1 }}>
                {<Text style={[styles.title]}>Hình thức: </Text>}
                {dataCTPA.TenHinhThuc}
            </Text>
        </View>
        <View style={[styles.noidung]}>
            <Text style={{ flex: 1 }}>
                {<Text style={[styles.title]}>Nguồn: </Text>}
                {dataCTPA.TenNguon}
            </Text>
        </View>
    </>)
}
//id =4
const ComponentHanXuLy = ({ dataCTPA }) => {
    return (<>
        {
            dataCTPA.HanXuLy == '' ? null :
                <View style={[styles.noidung]}>
                    <Text style={{ flex: 1, fontWeight: 'bold' }}>
                        {<Text style={[styles.title]}>Hạn xử lý: </Text>}
                        {dataCTPA.HanXuLy} {dataCTPA?.TreHen > 0 ? <Text style={{ color: colors.redStar }}>(Quá hạn)</Text> : ''}
                    </Text>
                </View>
        }
    </>)
}
//id =5
const ComponentHanCongKhai = ({ dataCTPA }) => {
    // Utils.nlog("giá trị công khái", dataCTPA.CongKhai)
    return (<>
        <View
            style={[nstyles.nrow, { paddingTop: 15, alignItems: "center", paddingVertical: 5 }]}
        // onPress={() => this._congKhai()}
        >

            <Text style={{ marginLeft: 5, fontWeight: 'bold', color: dataCTPA.CongKhai ? colors.colorTrueGreen : colors.lightGreyBlue }}>
                {
                    dataCTPA.CongKhai ? '◆ Phản ánh sẽ [Công khai]' : '◆ Phản ánh sẽ [Không công khai]'
                }
            </Text>
        </View>
    </>)
}
const ComponentNoiDungXL = ({ dataCTPA, IsComeBackProcess }) => {
    const { ListFileDinhKem = [], TraoDoi } = dataCTPA;
    var arrImg = [], arrFile = [];
    if (ListFileDinhKem.length > 0) {
        ListFileDinhKem.forEach(item => {
            let checkImage = Utils.checkIsImage(item.Link);

            if (checkImage == true) {
                arrImg.push({ url: item.Link })
            } else {
                arrFile.push({ FileName: item.TenFile, Link: item.Link })
            }
            Utils.nlog("gia tri image chi tiết", arrImg);
        });
    }
    return (<>{
        dataCTPA.TraoDoi && dataCTPA.TraoDoi.NoiDung &&
            (dataCTPA.TraoDoi.Creator != 0 && dataCTPA.TraoDoi.Status == 1 || dataCTPA.TraoDoi.Status != 1) ? <View
                style={[{
                    paddingTop: 5,
                    paddingHorizontal: 5,
                    marginVertical: 5,
                    // alignItems: "center",
                    paddingVertical: 5,
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    minHeight: 60,
                    borderColor: colors.colorHeaderApp,
                    borderRadius: 5,
                    backgroundColor: 'rgba(39,98,137,0.1)'
                }]}
            >
            <Text style={{ fontSize: sizes.sizes.sText14, color: colors.colorHeaderApp, fontWeight: 'bold' }}>{'Nội dung xử lý bước trước:'}</Text>
            {/* <HtmlViewCom
                    html={dataCTPA.TraoDoi && dataCTPA.TraoDoi.NoiDung ? dataCTPA.TraoDoi.NoiDung : "<div></div>"}
                    style={{ height: '100%' }}
                /> */}
            <AutoHeightWebViewCus style={{ width: '100%' }} scrollEnabled={false}
                source={{ html: dataCTPA.TraoDoi && dataCTPA.TraoDoi.NoiDung ? dataCTPA.TraoDoi.NoiDung : "<div></div>" }} textLoading={'Đang tải nội dung...'} />
            {
                ListFileDinhKem?.length > 0 && TraoDoi?.Status == 4 && !IsComeBackProcess ? <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                    <ImageFileCus styleFile={{ width: Width(90), marginHorizontal: 5 }} dataMedia={arrImg} dataFile={arrFile} nthis={this} />
                </ScrollView> : null
            }

        </View> : null
    }

    </>)
}
const ComponentNoiDungDVXuLy = ({ dataCTPA }) => {
    return (<>
        {
            dataCTPA.NoiDungDVXuLy ? <View
                style={[{
                    paddingTop: 5,
                    paddingHorizontal: 5,
                    marginVertical: 5,
                    // alignItems: "center",
                    paddingVertical: 5,
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    minHeight: 60,
                    borderColor: "#DC0910",
                    borderRadius: 5,
                    backgroundColor: "#F8E2E3"
                }]}
            >
                <Text style={{ fontSize: sizes.sizes.sText14, color: colors.colorHeaderApp, fontWeight: 'bold' }}>{'Nội dung đơn vị đã xử lý:'}</Text>
                {/* <HtmlViewCom
                    html={dataCTPA && dataCTPA.NoiDungDVXuLy ? dataCTPA.NoiDungDVXuLy : "<div></div>"}
                    style={{ height: '100%' }}
                /> */}
                <AutoHeightWebViewCus style={{ width: '100%' }} scrollEnabled={false}
                    source={{ html: dataCTPA && dataCTPA.NoiDungDVXuLy ? dataCTPA.NoiDungDVXuLy : "<div></div>" }} textLoading={'Đang tải nội dung...'} />
            </View> : null
        }

    </>)
}
//danh sách xử lý chính,danh sách xử lý phụ
const ComponentDVXuLyChinhVaPhu = ({ dataCTPA }) => {
    // Utils.nlog("Dataa->>>>>>>", dataCTPA)
    return (<>
        {
            (dataCTPA.DVXuLy && dataCTPA.DVXuLy.length > 0) || (dataCTPA.DVXuLyHT && dataCTPA.DVXuLyHT.length > 0) ?

                <View
                    style={[{
                        paddingTop: 5,
                        paddingLeft: 5,
                        marginVertical: 5,
                        // alignItems: "center",
                        paddingVertical: 8,
                        borderWidth: 1,
                        borderStyle: 'dashed',
                        borderColor: colors.colorHeaderApp,
                        borderRadius: 5,
                        backgroundColor: 'rgba(39,98,137,0.1)'
                    }]}
                >
                    {dataCTPA.DVXuLy && dataCTPA.DVXuLy.length > 0 ?
                        <>
                            <Text style={{ fontSize: sizes.sizes.sText14, color: colors.colorHeaderApp, fontWeight: 'bold' }}>{'Đơn vị ' + (appConfig.IdSource == 'CA' ? 'chủ trì ' : '') + 'xử lý:'}</Text>
                            {dataCTPA.DVXuLy && dataCTPA.DVXuLy.length > 0 ? dataCTPA.DVXuLy.map((item, index) => {
                                return (
                                    <View key={index} >
                                        <Text style={{ paddingLeft: 10, fontSize: sizes.sizes.sText14, paddingTop: 5, textAlign: 'justify', paddingRight: 10 }}>• {item.TenPhuongXa}</Text>
                                    </View>
                                )
                            }) : null}
                        </>
                        : null
                    }
                    {
                        dataCTPA.DVXuLyHT && dataCTPA.DVXuLyHT.length > 0 ?
                            <>
                                <Text style={{ fontSize: sizes.sizes.sText14, color: colors.colorHeaderApp, fontWeight: 'bold', paddingTop: 20 }}>{'Đơn vị phối hợp xử lý:'}</Text>
                                {dataCTPA.DVXuLyHT && dataCTPA.DVXuLyHT.length > 0 ? dataCTPA.DVXuLyHT.map((item, index) => {
                                    return (
                                        <View key={index} style={{ flexDirection: 'row' }}>
                                            <Text style={{ paddingLeft: 10, fontSize: sizes.sizes.sText14, paddingTop: 5, textAlign: 'justify', paddingRight: 10 }}>• {item.TenPhuongXa}</Text>
                                        </View>
                                    )
                                }) : null}
                            </>
                            : null
                    }

                </View> : null
        }

    </>)
}
const ComponentChiTiet = {
    ComponentEmailDiaChi,
    ComponentTieuDe,
    ComponentCMLVHTN,
    ComponentHanXuLy,
    ComponentHanCongKhai,
    ComponentNoiDungXL,
    ComponentDVXuLyChinhVaPhu,
    ComponentNoiDungDVXuLy
}
export default ComponentChiTiet

const styles = StyleSheet.create({
    title: {
        color: colors.colorHeaderApp,
        fontSize: sizes.sizes.sText14,
        // paddingTop: 17
    },
    text12: {
        fontSize: sizes.reText(12)
    },
    text13: {
        fontSize: sizes.reText(13)
    },
    text14: {
        fontSize: sizes.reText(14)
    },
    containerComment: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 4,
        alignSelf: 'flex-start',
        padding: 5,
        marginTop: 10,
        marginLeft: 20
    },
    noidung: {
        paddingTop: 8,
        flexDirection: 'row'
    },
    container_button: {
        flexDirection: 'row',
        width: Width(90),
        paddingTop: 20
    },
    btnLeft: {
        borderRadius: 2,
        backgroundColor: colors.colorHeaderApp,
        flex: 1,
        marginRight: 5,
        marginTop: 10
    },
    btnRight: {
        borderRadius: 2,
        flex: 1,
        marginLeft: 5,
        marginTop: 10,
    },
    tab_touch: {
        backgroundColor: colors.colorHeaderApp,
        flex: 1,
        paddingVertical: 12,
        ...nstyles.nmiddle
    },
    tab: {
        marginTop: 20,
        paddingHorizontal: khoangcach,
        ...nstyles.nrow,
        borderBottomWidth: 1,
        borderBottomColor: colors.colorHeaderApp,
        backgroundColor: '#EFEFEF',
        ...nstyles.nmiddle
    },


    rowBack: {
        flex: 1,
        ...nstyles.nrow,
        justifyContent: 'flex-end'
    },
    backRightBtn: {
        bottom: 0,
        ...nstyles.nmiddle,
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        ...nstyles.nmiddle,
        backgroundColor: colors.colorBlueLight,
        width: 75,
    },
    backRightBtnRight: {
        ...nstyles.nmiddle,
        backgroundColor: colors.grayLight,
        width: 75,
    },



})



