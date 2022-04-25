
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import { getBottomSpace } from "react-native-iphone-x-helper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Video from "react-native-video";
import Utils from '../../../app/Utils'
import { HeaderCus } from '../../../components'
import ImageCus from "../../../components/ImageCus";
import { colors } from '../../../styles'
import FontSize from '../../../styles/FontSize'
import { reText } from "../../../styles/size";
import { GetDetail_violate } from '../../apis/apiGSGT';
import { Images } from '../../images'

// chi tiết giao thông bên Đồng Hới

const ChiTietGiaoThong = (props) => {

    const filterTrangThai = (_trangThai) => {
        switch (_trangThai) {
            case -1:
                return 'vi phạm không lỗi'
            case 0:
                return 'vi phạm '
            case 1:
                return 'vi phạm đang xử lý'
            case 2:
                return 'vi phạm chờ phê duyệt'
            case 3:
                return 'vi phạm đóng'
            case 4:
                return 'vi phạm đã xử lý'
            default:
                break;
        }
    }

    const TrangThai = (status) => {
        switch (status) {
            case -1:
                return 'vi phạm không lỗi'
            case 0:
                return 'vi phạm chưa xử lý'
            case 1:
                return 'vi phạm đang xử lý'
            case 2:
                return 'vi phạm chờ phê duyệt xử lý'
            case 3:
                return 'vi phạm đang chờ phê duyệt đã xử lý xong'
            case 4:
                return 'vi phạm đã xử lý xong'
            default:
                return 'Đang cập nhập';
        }
    }
    const { dataItem } = props.navigation.state.params
    // Utils.nlog('data', dataItem)

    const infoViPhamGiaoThong = (dataItem) => {
        Utils.nlog('ádadada', dataItem.status)
        return <View style={{ flex: 1, marginTop: 20 }}>
            <Text style={stChiTietGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Biển số xe`} </Text>: {dataItem.plate ? dataItem.plate : null}</Text>
            <Text style={stChiTietGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Địa bàn tỉnh`} </Text>: {dataItem.province ? dataItem.province : null}</Text>
            <Text style={stChiTietGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Thành Phố`}</Text> : {dataItem.district ? dataItem.district : null}</Text>
            <Text style={stChiTietGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Quận/ Huyện`}</Text> : {dataItem.village ? dataItem.village : null}</Text>
            <Text style={stChiTietGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Thời gian vi phạm`} </Text>: {dataItem.vioTime ? dataItem.vioTime : null}</Text>
            <Text style={stChiTietGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Trạng thái`} </Text>: {TrangThai(dataItem.status)}</Text>
            {
                dataItem?.videoLink ? <View
                    style={stChiTietGiaoThong.viewDataItem}>
                    <Text style={[stChiTietGiaoThong.commonText, { fontSize: reText(17) }]}>Video : </Text>
                    <TouchableOpacity
                        onPress={() => {
                            Utils.goscreen({ props }, 'Modal_PlayMedia', { source: dataItem?.videoLink.trim() });
                        }}>
                        <Video
                            source={{ uri: dataItem?.videoLink.trim() }}   // Can be a URL or a local file.
                            // ref={(ref) => {
                            //     this.player = ref
                            // }}                                      // Store reference
                            // onBuffer={this.onBuffer}                // Callback when remote video is buffering
                            // onError={this.videoError}               // Callback when video cannot be loaded
                            style={{ height: 260, width: '100%' }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </View> : null
            }
            {
                dataItem?.imageLink ? <View
                    style={stChiTietGiaoThong.viewDataItem}>
                    <Text style={[stChiTietGiaoThong.commonText, { fontSize: reText(17) }]}>Ảnh 1 : </Text>
                    <TouchableOpacity
                        onPress={() => {
                            Utils.goscreen({ props }, 'Modal_ShowListImage', { ListImages: [{ uri: dataItem?.imageLink.trim() }], index: 0 });
                        }}>
                        <ImageCus
                            resizeMode='cover'
                            source={{ uri: dataItem?.imageLink.trim() }}
                            style={stChiTietGiaoThong.heightImage}
                        />
                    </TouchableOpacity>
                </View> : null
            }
            {
                dataItem?.imageLink2 ? <View
                    style={stChiTietGiaoThong.viewDataItem}>
                    <Text style={[stChiTietGiaoThong.commonText, { fontSize: reText(17) }]}>Ảnh 2 : </Text>
                    <TouchableOpacity
                        onPress={() => {
                            Utils.goscreen({ props }, 'Modal_ShowListImage', { ListImages: [{ uri: dataItem.imageLink2.trim() }], index: 0 });
                        }}>
                        <ImageCus
                            resizeMode='cover'
                            source={{ uri: dataItem?.imageLink2.trim() }}
                            style={stChiTietGiaoThong.heightImage}
                        />
                    </TouchableOpacity>
                </View> : null
            }
            {
                dataItem?.imageLink3 ? <View style={stChiTietGiaoThong.viewDataItem}>
                    <Text style={[stChiTietGiaoThong.commonText, { fontSize: reText(17) }]}>Ảnh 3 : </Text>
                    <TouchableOpacity
                        onPress={() => {
                            Utils.goscreen({ props }, 'Modal_ShowListImage', { ListImages: [{ uri: dataItem?.imageLink3.trim() }], index: 0 });
                        }}>
                        <ImageCus
                            resizeMode='cover'
                            source={{ uri: dataItem?.imageLink3.trim() }}
                            style={stChiTietGiaoThong.heightImage}
                        />
                    </TouchableOpacity>
                </View> : null
            }
            {
                dataItem?.imageLink4 ? <View style={stChiTietGiaoThong.viewDataItem}>
                    <Text style={[stChiTietGiaoThong.commonText, { fontSize: reText(17) }]}>Ảnh 4 : </Text>
                    <TouchableOpacity
                        onPress={() => {
                            Utils.goscreen({ props }, 'Modal_ShowListImage', { ListImages: [{ uri: dataItem?.imageLink4.trim() }], index: 0 });
                        }} >
                        <ImageCus
                            resizeMode='cover'
                            source={{ uri: dataItem?.imageLink4.trim() }}
                            style={stChiTietGiaoThong.heightImage}
                        />
                    </TouchableOpacity>
                </View> : null
            }
            {
                dataItem?.imageLink5 ? <View style={stChiTietGiaoThong.viewDataItem}>
                    <Text style={[stChiTietGiaoThong.commonText, { fontSize: reText(17) }]}>Ảnh 5 : </Text>
                    <TouchableOpacity
                        onPress={() => {
                            Utils.goscreen({ props }, 'Modal_ShowListImage', { ListImages: [{ uri: dataItem?.imageLink5.trim() }], index: 0 });
                        }} >
                        <ImageCus
                            resizeMode='cover'
                            source={{ uri: dataItem?.imageLink5.trim() }}
                            style={stChiTietGiaoThong.heightImage}
                        />
                    </TouchableOpacity>
                </View> : null
            }
        </View>
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderCus
                Sleft={{ tintColor: "white" }}
                onPressLeft={() => Utils.goback({ props })}
                iconLeft={Images.icBack}
                title={`Chi tiết vi phạm`}
                styleTitle={{ color: colors.white }}
            />
            <KeyboardAwareScrollView style={{ backgroundColor: colors.white, paddingHorizontal: FontSize.scale(10) }} showsVerticalScrollIndicator={false} >
                {
                    infoViPhamGiaoThong(dataItem)
                }
                <View style={{ paddingVertical: 10 }} />
            </KeyboardAwareScrollView>
        </View>
    )
}
const stChiTietGiaoThong = StyleSheet.create({
    containerBody: {
        paddingHorizontal: FontSize.scale(10),
        backgroundColor: colors.colorPaleGrey,
        flex: 1,
        paddingBottom: getBottomSpace(),
    },
    containerText: {
        flexDirection: 'row', alignItems: 'center'
    },
    commonTitle: {
        fontWeight: "bold",
        fontSize: FontSize.reText(16),
        color: colors.blueFaceBook,
        textAlign: "center",
        paddingVertical: FontSize.scale(10),
    },
    commonTextLeft: {
        fontSize: FontSize.reText(16),
        flex: 1,
        color: colors.blueFaceBook,
        textAlign: "left",
        fontWeight: '600',
        paddingVertical: FontSize.scale(5)
    },
    commonTextRight: {
        flex: 1,
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
    viewDataItem: {
        // marginTop: FontSize.scale(10), marginBottom: FontSize.scale(10), 
        marginVertical: FontSize.scale(10)
    },
    heightImage: {
        height: FontSize.scale(200),
    },
    commonText: {
        fontSize: reText(15),
        marginBottom: 5
    }
});
export default ChiTietGiaoThong
