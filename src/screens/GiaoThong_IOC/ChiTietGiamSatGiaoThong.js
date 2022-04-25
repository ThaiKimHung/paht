
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native'
import { getBottomSpace } from "react-native-iphone-x-helper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Video from "react-native-video";
import Utils from '../../../app/Utils'
import { HeaderCus } from '../../../components'
import ImageCus from "../../../components/ImageCus";
import { colors } from '../../../styles'
import FontSize from '../../../styles/FontSize'
import { reText } from "../../../styles/size";
import { GetDetail_violate, GetToken_GSGT } from '../../apis/apiGSGT';
import { Images } from '../../images'

// const DATA = {
//     id: 3939783,
//     plate: "65C16216",
//     vinId: 101,
//     camId: 304202,
//     areaId: 312053,
//     province: "Cần Thơ",
//     district: "Quận Cái Răng",
//     village: "Ba Láng",
//     vioTime: "2022-01-21 21:38:21",
//     status: 0,
//     processTime: null,
//     cash: 999999,
//     licenseStatus: 0,
//     description: null,
//     realSpeed: 2,
//     maxSpeed: 0,
//     videoLink: "https://beta.mytrafficid.com/tnn/videodata/CTO_CAIRANG_CAM0401/CTO_CAIRANG_CAM0401_VIN02_1642775900_127020_1642775901063_65C16216.mp4",
//     imageLink: "https://beta.mytrafficid.com/tnn/FileViewerUrl.do?folder=CTO_CAIRANG_CAM0401&name=CTO_CAIRANG_CAM0401_VIN02_1642775900_127020_lpn_1642775901063_65C16216&type=jpg",
//     imageLink2: "https://beta.mytrafficid.com/tnn/FileViewerUrl.do?folder=CTO_CAIRANG_CAM0401&name=CTO_CAIRANG_CAM0401_VIN02_1642775900_127020_1642775901063_65C16216&type=jpg",
//     imageLink3: "https://beta.mytrafficid.com/tnn/FileViewerUrl.do?folder=CTO_CAIRANG_CAM0401&name=CTO_CAIRANG_CAM0401_VIN02_1642775900_127020_vehicle_1642775901063_65C16216&type=jpg",
//     imageLink4: "https://beta.mytrafficid.com/tnn/FileViewerUrl.do?folder=CTO_CAIRANG_CAM0401&name=CTO_CAIRANG_CAM0401_VIN02_1642775900_127020_before_1642775901063_65C16216&type=jpg",
//     imageLink5: "https://beta.mytrafficid.com/tnn/FileViewerUrl.do?folder=CTO_CAIRANG_CAM0401&name=CTO_CAIRANG_CAM0401_VIN02_1642775900_127020_1642775901063_65C16216&type=jpg",
//     keepLicense: null,
//     verhicleType: 61,
//     matchTemplate: 1
// }

const ChiTietGiamSatGiaoThong = (props) => {
    const Id = Utils.ngetParam({ props }, 'Id', 3939783)
    const [data, setData] = useState('')
    const [Token, setToken] = useState('')
    const [refresh, setRefresh] = useState(true)

    useEffect(() => {
        GetDetails()
    }, [Id])

    const GetDetails = async () => {
        let token = await GetToken_GSGT()

        if (token) {
            // Utils.nlog('true')
            const res = await GetDetail_violate(Id, token.id_token)
            Utils.nlog('res details', res)
            if (res) {
                setData(res)
                setRefresh(false);
            } else {
                setData('')
                setRefresh(false);
            }
        } else {
            // Utils.nlog('false')
            Utils.showMsgBoxOK(this, 'Thông báo', 'Lỗi kết nối')
        }
    }

    const onRefresh = () => {
        setRefresh(true);
        GetDetails();
    }

    const TrangThai = (status) => {
        switch (status) {
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

    const LoaiPhuongTien = (verhicleType) => {
        switch (verhicleType) {
            case 21:
                return 'ô tô'
            case 31:
                return 'xe máy'
            case 41:
                return 'xe tải'
            case 51:
                return 'xe khách'
            case 61:
                return 'xe tải'
            default:
                break;
        }
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
            <KeyboardAwareScrollView
                style={{ backgroundColor: colors.white, paddingHorizontal: FontSize.scale(10) }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={onRefresh}
                        title={!refresh ? 'Vuốt xuống thả ra để cập nhật' : `Đang tải thông tin tuyển dụng...`}
                    />
                }
            >
                <View style={{ flex: 1, marginTop: 20 }}>
                    <View style={stChiTietGiamSatGiaoThong.containerText}>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextLeft]}>{`Biển số xe: `}</Text>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextRight, { fontWeight: 'bold' }]}>{data.plate ? data.plate : 'Đang cập nhật'}</Text>
                    </View>
                    <View style={stChiTietGiamSatGiaoThong.containerText}>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextLeft]}>{`Tên tỉnh: `}</Text>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextRight]}>{data.province ? data.province : 'Đang cập nhật'}</Text>
                    </View>
                    <View style={stChiTietGiamSatGiaoThong.containerText}>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextLeft]}>{`Tên Quận: `}</Text>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextRight]}>{data.district ? data.district : 'Đang cập nhật'}</Text>
                    </View>
                    <View style={stChiTietGiamSatGiaoThong.containerText}>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextLeft]}>{`Tên phường xã: `}</Text>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextRight]}>{data.village ? data.village : 'Đang cập nhật'}</Text>
                    </View>
                    <View style={stChiTietGiamSatGiaoThong.containerText}>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextLeft]}>{`Thời gian vi phạm: `}</Text>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextRight]}>{data.vioTime ? data.vioTime : 'Đang cập nhật'}</Text>
                    </View>
                    <View style={stChiTietGiamSatGiaoThong.containerText}>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextLeft]}>{`Trạng thái: `}</Text>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextRight]}>{TrangThai(data.status ? data.status : 'Đang cập nhật')}</Text>
                    </View>
                    <View style={stChiTietGiamSatGiaoThong.containerText}>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextLeft]}>{`Số tiền phạt: `}</Text>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextRight]}>{data.cash ? data.cash : '0'}</Text>
                    </View>
                    <View style={stChiTietGiamSatGiaoThong.containerText}>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextLeft]}>{`Tốc độ ghi nhận: `}</Text>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextRight]}>{data.realSpeed ? data.realSpeed : '0'}</Text>
                    </View>
                    <View style={stChiTietGiamSatGiaoThong.containerText}>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextLeft]}>{`Tốc độ cho phép tối đa: `}</Text>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextRight]}>{data.maxSpeed ? data.maxSpeed : '0'}</Text>
                    </View>
                    <View style={stChiTietGiamSatGiaoThong.containerText}>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextLeft]}>{`Loại phương tiện: `}</Text>
                        <Text style={[stChiTietGiamSatGiaoThong.commonTextRight]}>{LoaiPhuongTien(data.verhicleType ? data.verhicleType : 'Đang cập nhật')}</Text>
                    </View>

                    {/* <Text style={stChiTietGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Tên tỉnh: `} </Text> {data.province ? data.province : null}</Text>
                    <Text style={stChiTietGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Tên Quận: `}</Text> {data.district ? data.district : null}</Text>
                    <Text style={stChiTietGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Tên phường xã: `}</Text> {data.village ? data.village : null}</Text>
                    <Text style={stChiTietGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Thời gian vi phạm: `} </Text> {data.vioTime ? data.vioTime : null}</Text>
                    <Text style={stChiTietGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Trạng thái: `} </Text> {TrangThai(data.status ? data.status : null)}</Text>
                    <Text style={stChiTietGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Số tiền phạt: `} </Text> {data.status ? data.status : null}</Text>
                    <Text style={stChiTietGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Tốc độ ghi nhận: `} </Text> {data.realSpeed ? data.realSpeed : null}</Text>
                    <Text style={stChiTietGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Tốc độ cho phép tối đa: `} </Text> {data.maxSpeed ? data.maxSpeed : null}</Text>
                    <Text style={stChiTietGiaoThong.commonText}><Text style={{ color: colors.blueFaceBook }}>{`Loại phương tiện: `} </Text> {LoaiPhuongTien(data.verhicleType ? data.verhicleType : null)}</Text> */}
                </View>
                {
                    data.videoLink ? <View
                        style={stChiTietGiamSatGiaoThong.viewDataItem}>
                        <Text style={[stChiTietGiamSatGiaoThong.commonText, { fontSize: reText(17) }]}>Video bằng chứng vi phạm: </Text>
                        <TouchableOpacity
                            onPress={() => {
                                Utils.goscreen({ props }, 'Modal_PlayMedia', { source: data.videoLink });
                            }}>
                            <Video
                                source={{ uri: data.videoLink }}   // Can be a URL or a local file.
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
                    data.imageLink ? <View
                        style={stChiTietGiamSatGiaoThong.viewDataItem}>
                        <Text style={[stChiTietGiamSatGiaoThong.commonText, { fontSize: reText(17) }]}>Ảnh cắt vào biển số: </Text>
                        <TouchableOpacity
                            onPress={() => {
                                Utils.goscreen({ props }, 'Modal_ShowListImage', { ListImages: [{ uri: data.imageLink }], index: 0 });
                            }}>
                            <ImageCus
                                resizeMode='cover'
                                source={{ uri: data.imageLink }}
                                style={stChiTietGiamSatGiaoThong.heightImage}
                            />
                        </TouchableOpacity>
                    </View> : null
                }
                {
                    data.imageLink2 ? <View
                        style={stChiTietGiamSatGiaoThong.viewDataItem}>
                        <Text style={[stChiTietGiamSatGiaoThong.commonText, { fontSize: reText(17) }]}>Ảnh sau vi phạm: </Text>
                        <TouchableOpacity
                            onPress={() => {
                                Utils.goscreen({ props }, 'Modal_ShowListImage', { ListImages: [{ uri: data.imageLink2 }], index: 0 });
                            }}>
                            <ImageCus
                                resizeMode='cover'
                                source={{ uri: data.imageLink2 }}
                                style={stChiTietGiamSatGiaoThong.heightImage}
                            />
                        </TouchableOpacity>
                    </View> : null
                }
                {
                    data.imageLink3 ? <View style={stChiTietGiamSatGiaoThong.viewDataItem}>
                        <Text style={[stChiTietGiamSatGiaoThong.commonText, { fontSize: reText(17) }]}>Ảnh cắt vào phương tiện: </Text>
                        <TouchableOpacity
                            onPress={() => {
                                Utils.goscreen({ props }, 'Modal_ShowListImage', { ListImages: [{ uri: data.imageLink3 }], index: 0 });
                            }}>
                            <ImageCus
                                resizeMode='cover'
                                source={{ uri: data.imageLink3 }}
                                style={stChiTietGiamSatGiaoThong.heightImage}
                            />
                        </TouchableOpacity>
                    </View> : null
                }
                {
                    data.imageLink4 ? <View style={stChiTietGiamSatGiaoThong.viewDataItem}>
                        <Text style={[stChiTietGiamSatGiaoThong.commonText, { fontSize: reText(17) }]}>Ảnh đang vi phạm: </Text>
                        <TouchableOpacity
                            onPress={() => {
                                Utils.goscreen({ props }, 'Modal_ShowListImage', { ListImages: [{ uri: data.imageLink4 }], index: 0 });
                            }} >
                            <ImageCus
                                resizeMode='cover'
                                source={{ uri: data.imageLink4 }}
                                style={stChiTietGiamSatGiaoThong.heightImage}
                            />
                        </TouchableOpacity>
                    </View> : null
                }
                {
                    data.imageLink5 ? <View style={stChiTietGiamSatGiaoThong.viewDataItem}>
                        <Text style={[stChiTietGiamSatGiaoThong.commonText, { fontSize: reText(17) }]}>Ảnh ảnh toàn cảnh: </Text>
                        <TouchableOpacity
                            onPress={() => {
                                Utils.goscreen({ props }, 'Modal_ShowListImage', { ListImages: [{ uri: data.imageLink5 }], index: 0 });
                            }} >
                            <ImageCus
                                resizeMode='cover'
                                source={{ uri: data.imageLink5 }}
                                style={stChiTietGiamSatGiaoThong.heightImage}
                            />
                        </TouchableOpacity>
                    </View> : null
                }
                <View style={{ paddingVertical: 5 }} />
            </KeyboardAwareScrollView>
        </View>
    )
}
const stChiTietGiamSatGiaoThong = StyleSheet.create({
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
        marginTop: FontSize.scale(10), marginBottom: FontSize.scale(10),
    },
    heightImage: {
        height: FontSize.scale(200),
    },
    commonText: {
        marginBottom: 5,
        fontSize: FontSize.reText(15)
    }
});
export default ChiTietGiamSatGiaoThong
