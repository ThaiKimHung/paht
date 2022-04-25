import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import ImageCus from '../../../../components/ImageCus';
import { Images } from '../../../images';
import { nstyles, Width } from '../../../../styles/styles';
import TextApp from '../../../../components/TextApp';
import { colors } from '../../../../styles';
import apis from '../../../apis';
import Utils from '../../../../app/Utils';
import { appConfig } from '../../../../app/Config';
import { reText } from '../../../../styles/size';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';


const ListCare = (props) => {
    const [Data, setData] = useState([]);
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        getDataListCare()
    }, []);

    const getDataListCare = async () => {
        const res = await apis.ApiPhanAnh.GetPALinhVucQuanTam()
        Utils.nlog('[LOG] res data quan tam', res)
        if (res?.status == 1 && res?.data) {
            setData(res?.data)
            setShowLoading(false)
        } else {
            setData([]);
            setShowLoading(false)
        }
    }

    const onTouchItem = (item) => {
        Utils.goscreen({ props }, 'Modal_ChiTietPhanAnh', { IdPA: item?.IdPA, TenChuyenMuc: item?.ChuyenMuc, SoLuongTuongTac: item?.SoLuongTuongTac })
    }

    const ItemCare = (props) => {
        const { item, index } = props
        var { ListHinhAnh = [] } = item;
        let uriTitle = '';
        let urlAPITitle = '';
        var arrImg = [];
        if (ListHinhAnh.length > 0) {
            ListHinhAnh.forEach(item => {
                const url = item.Path;
                let checkImage = Utils.checkIsImage(item.Path);
                let checkVideo = Utils.checkIsVideo(item.Path);
                if (checkImage) {
                    arrImg.push({
                        url: appConfig.domain + url
                    })
                }
                if (uriTitle == '' && (checkVideo || arrImg.length != 0)) {
                    urlAPITitle = item.GetThumbnail;
                    uriTitle = appConfig.domain + url
                }
            });
            if (arrImg.length > 0) {

            }
        }
        let isVideo = Utils.checkIsVideo(uriTitle);
        if (!isVideo && urlAPITitle)
            uriTitle = appConfig.domain + urlAPITitle;
        return (
            <TouchableOpacity key={index} onPress={() => onTouchItem(item)} activeOpacity={0.5} style={stListCare.container_item}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {
                        isVideo ?
                            <View
                                style={{
                                    width: Width(45),
                                    height: Width(20),
                                    backgroundColor: colors.black_10,
                                    borderTopLeftRadius: 5,
                                    borderTopRightRadius: 5
                                }}
                            >
                                <Video source={{ uri: uriTitle }}   // Can be a URL or a local file.
                                    style={{
                                        width: '100%', height: '100%',
                                        backgroundColor: colors.black_10,
                                        borderTopLeftRadius: 5,
                                        borderTopRightRadius: 5
                                    }}
                                    resizeMode='cover'
                                    paused={true} />
                            </View>
                            :
                            <ImageCus
                                defaultSourceCus={Images.iconApp}
                                style={{
                                    width: Width(45),
                                    height: Width(20),
                                    backgroundColor: colors.black_10,
                                    borderTopLeftRadius: 5,
                                    borderTopRightRadius: 5
                                }}
                                source={{ uri: uriTitle }}
                                resizeMode={uriTitle ? 'cover' : 'contain'}
                            />
                    }
                    <TextApp numberOfLines={3} style={stListCare.title_item}>{item?.TieuDe || 'Không có tiêu đề'}</TextApp>
                    <TextApp style={stListCare.time}>{item?.NgayGui || 'Đang cập nhật'}</TextApp>
                </View>
            </TouchableOpacity>
        )
    }


    return (
        <>
            {showLoading ? <View pointerEvents={showLoading ? 'none' : 'auto'}
                style={stListCare.loading}>
                <ActivityIndicator size={'small'} />
                <TextApp style={{ color: colors.grayText, marginTop: 5 }}>{`Đang tải nội dung quan tâm`}</TextApp>
            </View> :
                Data && Data.length > 0 &&
                <>
                    <View style={{
                        alignSelf: 'flex-start', padding: 5, paddingHorizontal: 10, marginTop: 10,
                        borderTopLeftRadius: 6, borderTopRightRadius: 6, borderBottomWidth: 1,
                        borderColor: colors.colorGrayBgr, backgroundColor: colors.white, marginLeft: 14
                    }}>
                        <TextApp allowFontScaling={false} style={{
                            fontSize: reText(14), fontWeight: 'bold', color: colors.orangCB
                        }}>{`Quan tâm nhiều nhất`}</TextApp>
                    </View>
                    <ScrollView
                        horizontal
                        style={[stListCare.container, props?.style]}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 7 }}
                    >
                        {
                            Data.map((item, index) => {
                                return <ItemCare {...{ item, index }} />
                            })
                        }
                    </ScrollView>
                </>
            }
        </>
    );
};

const stListCare = StyleSheet.create({
    container: {
        backgroundColor: colors.nocolor, paddingVertical: 8
    },
    container_item: {
        backgroundColor: colors.white,
        maxWidth: Width(45),
        marginLeft: 8,
        borderRadius: 5,
        ...nstyles.shadown,
    },
    title_item: {
        textAlign: 'justify',
        flex: 1,
        margin: 5,
        alignSelf: 'flex-start',
    },
    time: {
        margin: 8,
        alignSelf: 'flex-start',
        fontSize: reText(12)
    },
    title: {
        paddingHorizontal: 13,
        marginTop: 5,
        fontStyle: 'italic',
        color: colors.blueLightHign,
    },
    loading: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
        marginHorizontal: 13,
        backgroundColor: colors.white,
        borderRadius: 5,
        marginTop: 5
    }
})

export default ListCare;
