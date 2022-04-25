import React, { useState, useImperativeHandle } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import FastImage from 'react-native-fast-image'
import Utils from '../../../app/Utils'
import { colors } from '../../../styles'
import FontSize from '../../../styles/FontSize'
import { Images } from '../../images'

const UploadImage = React.forwardRef((props, ref) => {
    const { name = 'Update image', data, setData = () => { }, customStyleImage = {}, limit = 1, DefaultImages = [], isDelete = true, isEdit = false } = props;
    // Utils.nlog("[data image]", DefaultImages)
    const [DataImages, setDataImages] = useState(DefaultImages)

    const prevMedia = (index) => {
        const dataShow = DataImages.map(item => {
            return { ...item, url: item.uri }
        })
        Utils.navigate('Modal_ShowListImage', { ListImages: dataShow, index: index });
    }
    //xuất data trên ref
    useImperativeHandle(ref, () => ({
        getData: () => {
            return DataImages;
        },
    }));
    //sự kiện press gét image hoặc chụp
    const onPressPicker = (index) => {
        if (!isEdit) {
            return;
        }
        let options = {
            assetType: 'Photos',//All,Videos,Photos - default
            multi: limit > 1 ? true : false,// chọn 1 or nhiều item
            response: (val) => response(val, index), // callback giá trị trả về khi có chọn item
            limitCheck: index != -1 ? 1 : limit - (DataImages?.length || 0), //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
            groupTypes: 'All',
            showTakeCamera: true
        }
        Utils.navigate('Modal_MediaPicker', options);

    }
    //change data add or delete
    const onChangeImage = (image, index, isDelete = false) => {
        if (!isEdit) {
            return;
        }
        //delete
        if (isDelete == true) {
            let newVal = DataImages.filter(item => item.uri != image.uri)
            Utils.nlog("[data image]33333", newVal, DataImages, image)
            setDataImages(newVal)
            return;
        }
        //add
        if (index == -1) {
            setDataImages([...DataImages, ...image])
            // setData(image);
        } else {
            // DataImages[index] = image[0]
            let newVal = DataImages.map((item, i) => {
                if (index != i) {
                    return item
                } else {
                    return image[0]
                }
            })
            setDataImages(newVal)
        }


    }
    const response = async (res, index) => {
        if (res.iscancel) {
            // Utils.nlog('--ko chon item or back');
            return;
        }
        else if (res.error) {
            // Utils.nlog('--lỗi khi chon media');
            return;
        }
        else {
            //--dữ liệu media trả về là 1 item or 1 mảng item
            //--Xử lý dữ liệu trong đây-----
            onChangeImage(res, index);
        }
    };

    // Utils.nlog("item---1111", DataImages);
    const renderItem = (item, index) => {
        return (
            <View ref={ref} style={{ width: '100%', paddingHorizontal: 10 }} >
                <Text style={{ fontWeight: 'bold', fontSize: FontSize.reText(18), color: colors.black_80, paddingVertical: FontSize.scale(10) }}>{name || 'Upload'}</Text>
                <TouchableOpacity onPress={() => onPressPicker(index)} style={{
                    width: '100%', height: 200, backgroundColor: colors.greyLight,
                    alignItems: 'center', justifyContent: 'center', borderRadius: FontSize.scale(7), ...customStyleImage,

                }}>
                    <Image resizeMode={item ? 'cover' : 'contain'} source={item ? { uri: item.uri } : Images.icCamera} style={{ width: item ? '100%' : 40, height: item ? 200 : 40, borderRadius: FontSize.scale(7) }}>
                    </Image>
                    {
                        item ? <TouchableOpacity onPress={() => prevMedia(index)} style={{ position: 'absolute', top: FontSize.scale(7), left: FontSize.scale(7), zIndex: 10, padding: FontSize.scale(10), backgroundColor: colors.lightGreyBlue_50, borderRadius: FontSize.scale(7) }}>
                            <Image resizeMode='contain' source={Images.icShowPass} style={{
                                width: 25, height: 25,
                                borderRadius: FontSize.scale(7), tintColor: 'white'
                            }}>
                            </Image>
                        </TouchableOpacity> : null
                    }
                    {
                        isEdit && item && isDelete ? <TouchableOpacity onPress={() => onChangeImage(item, index, true)} style={{ position: 'absolute', top: FontSize.scale(60), left: FontSize.scale(7), zIndex: 10, padding: FontSize.scale(10), backgroundColor: colors.lightGreyBlue_50, borderRadius: FontSize.scale(7) }}>
                            <Image resizeMode='contain' source={Images.icDelete} style={{
                                width: 25, height: 25,
                                borderRadius: FontSize.scale(7), tintColor: 'white'
                            }}>
                            </Image>
                        </TouchableOpacity> : null
                    }
                </TouchableOpacity>
            </View>
        )
    }
    return <View style={{ backgroundColor: colors.white }}>
        {
            //render data
            DataImages?.map(renderItem)
        }
        {
            //render chọn nếu chưa có image
            isEdit && (DataImages?.length == 0 || DataImages?.length < limit) ? renderItem('', -1) : null
        }
    </View>

})

export default UploadImage

const styles = StyleSheet.create({})
