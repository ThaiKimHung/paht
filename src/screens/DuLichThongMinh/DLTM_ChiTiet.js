import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, FlatList, StatusBar, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Utils from '../../../app/Utils'
import { HeaderCus } from '../../../components'
import AutoHeightWebViewCus from '../../../components/AutoHeightWebViewCus'
import VideoCus from '../../../components/Video/VideoCus'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { heightStatusBar, nstyles, paddingTopMul, Width } from '../../../styles/styles'
import { Images } from '../../images'
import MapShow from './MapShow'


export class DLTM_ChiTiet extends Component {

    constructor(props) {
        super(props)
        this.IdDuLich = Utils.ngetParam(this, 'IdDuLich')
        this.state = {
            dataChiTiet: {},
            lstPhoto: [],
            indexImageChose: 0
        }
    }

    componentDidMount() {
        this.GetChiTiet_DuLich()
    }
    GetChiTiet_DuLich = async () => {
        try {
            const response = await fetch(`https://sonlacity.vietnaminfo.net/api/Place/GetByID?lang=vi&placeId=${this.IdDuLich}`,
                {
                    method: 'GET',
                });
            const res = await response.json();
            this.setState({ dataChiTiet: res.data, lstPhoto: res.photos });
        } catch (error) {
            console.log(error);
        }

    }
    _showAllImages = (arrImage = [], index = 0) => {
        Utils.goscreen(this, 'Modal_ShowListImage', { ListImages: arrImage, index });
    }
    _showVideo = (url) => {
        Utils.goscreen(this, 'Modal_PlayMedia', { source: url });
    }
    changImage = async (index, arrImage) => {
        await this.setState({ indexImageChose: index })
        // this._showAllImages(arrImage, index)
        Utils.nlog('Gia trissss>>>>>>>>>>>>>', index, this.state.indexImageChose)
    }
    _renderItemImage = (item, index, arrImage) => {
        let isVideo = item.url.includes('.mp4')
        const { lstPhoto } = this.state;
        Utils.nlog('Gia tri isVideo =>>>>>>', index, lstPhoto?.length)
        return (
            <View key={index}   >
                <TouchableOpacity style={{ marginRight: 10, }} onPress={() => { this.changImage(index) }}>
                    {
                        isVideo ?
                            <VideoCus
                                source={{ uri: item.url }}
                                style={{ width: Width(30), height: Width(30), borderRadius: 5, }}
                                resizeMode='cover'
                                paused={true}
                            />
                            : <Image
                                // defaultSource={Images.icPhotoBlack}
                                source={{ uri: item.url }}
                                style={{ height: Width(25), width: Width(25), borderRadius: 15 }}
                                resizeMode='cover'
                            />
                    }
                    {
                        isVideo ?
                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={Images.icVideoBlack} style={[nstyles.nIcon30, { padding: 5, borderRadius: 8 }]} />
                            </View> : null
                    }

                </TouchableOpacity>
            </View >
        );
    };


    render() {
        const { dataChiTiet, lstPhoto, indexImageChose } = this.state
        let listImg = [], listFiles = [];
        if (!lstPhoto)
            lstPhoto = [];
        for (let i = 0; i < lstPhoto.length; i++) {
            const itemTemp = lstPhoto[i];
            itemTemp.DuongDan = itemTemp.DuongDan.toLowerCase();
            if ((itemTemp.DuongDan.includes('.png') || itemTemp.DuongDan.includes('.jpg')
                || itemTemp.DuongDan.includes('.jpeg') || itemTemp.DuongDan.includes('.gif')
                || itemTemp.DuongDan.includes('.mp4'))) {
                listImg.push(itemTemp);
            } else
                listFiles.push(itemTemp);
        };

        listImg = listImg.map((item) => {
            return { ...item, url: item.DuongDan, uri: '' }
        });

        let isVideo = listImg[indexImageChose]?.url.includes('.mp4')
        Utils.nlog('Gia tri dalaChiTiet - lstPhoto', dataChiTiet, lstPhoto, listImg)
        return (
            <View style={[nstyles.ncontainer, {}]}>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='always'
                    contentContainerStyle={{ paddingBottom: paddingTopMul() }}
                    ref={refs => this.dulichContenRef = refs}
                    style={[nstyles.nbody, { width: '100%', backgroundColor: colors.white }]}
                >
                    {
                        listImg && listImg.length >= 1 ?
                            <View style={{}}>
                                <TouchableOpacity
                                    onPress={() => { this._showAllImages(listImg, indexImageChose) }}
                                    style={{ width: '100%', }}>
                                    {
                                        isVideo ?
                                            <VideoCus
                                                source={{ uri: listImg[indexImageChose]?.url }}
                                                style={{ height: Width(60), marginBottom: 10 }}
                                                resizeMode="cover"
                                                paused={true}
                                            />
                                            : <Image source={{ uri: listImg[indexImageChose]?.url }}
                                                style={{ height: Width(80), marginBottom: 10, borderBottomRightRadius: 15, borderBottomLeftRadius: 15 }}
                                                resizeMode="cover"
                                            />
                                    }
                                </TouchableOpacity>
                                {
                                    isVideo ?
                                        <TouchableOpacity onPress={() => this._showVideo(listImg[indexImageChose]?.url)}
                                            style={{
                                                backgroundColor: "transparent", justifyContent: 'center', alignItems: 'center',
                                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0
                                            }}>
                                            <Image source={Images.icVideoBlack} style={[nstyles.nIcon40]} />
                                        </TouchableOpacity>
                                        : null
                                }
                            </View> : null

                    }
                    {
                        listImg && listImg.length >= 2 ? <FlatList
                            data={listImg}
                            horizontal
                            style={{ marginHorizontal: 15, }}
                            renderItem={({ item, index }) => this._renderItemImage(item, index, listImg)}
                            keyExtractor={(item, index) => `${index}`}
                            showsHorizontalScrollIndicator={false}
                        /> : null
                    }
                    <TouchableOpacity onPress={() => Utils.goback(this)}
                        style={listImg && listImg.length >= 1 ?
                            { position: 'absolute', top: 50, left: 30, backgroundColor: colors.black_20_2, padding: 10, paddingHorizontal: 15, borderRadius: 6, alignItems: 'center' }
                            : {
                                paddingTop: Platform.OS == 'android' ? paddingTopMul() + heightStatusBar() : paddingTopMul(),
                                marginLeft: 15
                            }}
                    >
                        <Image source={Images.icArrowBack} style={{ tintColor: listImg && listImg.length >= 1 ? colors.white : colors.black }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 15 }}>
                        <View style={{ flexDirection: 'row', flex: 1, width: '100%', justifyContent: 'space-between', paddingHorizontal: 15, }}>
                            <View style={{ maxWidth: Width(70) }}>
                                <Text style={stDLTM_ChiTiet.tieude}>{dataChiTiet ? dataChiTiet.TenDiaDiemDuLich : ''}</Text>
                                <View style={stDLTM_ChiTiet.view} >
                                    <Image source={Images.icLocation} style={{ tintColor: colors.blueLightHign, width: 10, height: 14, marginRight: 5 }} />
                                    <Text style={{ fontSize: reText(12), color: colors.grayText }} >{dataChiTiet ? dataChiTiet.DiaChi : ''}</Text>
                                </View>
                                <View style={stDLTM_ChiTiet.view}>
                                    <Image source={Images.icLuotXem} style={{ tintColor: colors.blueLightHign, marginRight: 5 }} />
                                    <Text style={{ color: colors.colorGrayText, fontSize: reText(10), }} >{dataChiTiet ? dataChiTiet.LuotXem : 0} </Text>
                                </View>
                            </View>

                            <Image source={dataChiTiet ? { uri: dataChiTiet.AnhDaiDien } : Images.icUserDefault} style={[nstyles.nIcon65, { borderRadius: 6 }]} />
                        </View>
                        <View style={{ height: 1, backgroundColor: colors.colorGrayBgr, paddingVertical: 2, width: '100%', flex: 1, marginTop: 10 }} />
                        <View style={{ paddingHorizontal: 15, }}>
                            <AutoHeightWebViewCus style={{ width: '100%', }} scrollEnabled={false} onLoadEndCus={() => { this.dulichContenRef.scrollToPosition(0, 0) }} source={{ html: dataChiTiet.GioiThieu ? dataChiTiet.GioiThieu : '<div></div>' }} textLoading={'Đang tải nội dung'} />
                        </View>
                        <Text style={[stDLTM_ChiTiet.tieude, { paddingHorizontal: 15, marginBottom: 15 }]}>Thông tin địa điểm</Text>
                        {
                            dataChiTiet && dataChiTiet?.Lon & dataChiTiet?.Lat ? <MapShow
                                long={dataChiTiet.Lon}
                                lat={dataChiTiet.Lat}
                                titleText={dataChiTiet.TenDiaDiemDuLich}
                                description={dataChiTiet.DiaChi}
                                styleMap={{ height: 100, paddingHorizontal: 15, }}
                            /> : null
                        }
                    </View>
                </KeyboardAwareScrollView>
                <StatusBar barStyle='dark-content' />
            </View>
        )
    }
}

export default DLTM_ChiTiet
const stDLTM_ChiTiet = StyleSheet.create({
    tieude: { fontWeight: 'bold', fontSize: reText(18) },
    view: { flexDirection: 'row', alignItems: "center", marginTop: 10 }
})