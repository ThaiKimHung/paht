import React, { Component, useState, useRef, useMemo } from 'react';
import { View, Image, FlatList, ActivityIndicator, TouchableOpacity, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { nstyles, sizes, colors } from '../styles';
import Utils from '../../app/Utils';
import { ImagesChat } from '../Images';
import { nheight, nwidth } from '../../styles/styles';

const COLOR_ICON = '#41ADF0'
const ViewImage = (props) => {
    const [dataImage, setDataImage] = useState(Utils.ngetParam({ props }, "data", []));
    // Utils.nlog("gia tri data view Image", dataImage)
    return (
        <View style={{
            flex: 1, backgroundColor: colors.white,
            paddingBottom: 30,
        }}>
            <ImageViewer
                swipeDownThreshold={200}
                index={0}
                loadingRender={() => <ActivityIndicator color="white" size="large" />}
                enablePreload={false}
                imageUrls={dataImage}
            />
            <View
                style={{
                    position: 'absolute',
                    top: nstyles.paddingTopMul(), right: 0, left: 0,
                    padding: 5,
                    height: 50,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    backgroundColor: colors.backgroundModal,
                }}>
                <TouchableOpacity
                    onPress={() => Utils.goback({ props })}
                    style={{
                        width: 50,
                        padding: 5,

                        alignItems: 'center',
                        justifyContent: 'center',

                    }}>
                    <Image
                        resizeMode='cover'
                        source={ImagesChat.icBack} style={[{ width: 25, height: 20, }]}>
                    </Image>
                </TouchableOpacity>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    child: {
        height: nheight() * 1,
        width: nwidth(),
        justifyContent: 'center'
    },
    text: {
        fontSize: nwidth() * 0.5,
        textAlign: 'center'
    }
});
const mapStateToProps = state => ({
    dataInFo: state.ReducerGroupChat.InFoGroup,
    // SetMessage: state.SetMessage,
});
export default Utils.connectRedux(ViewImage, mapStateToProps, true)




