import React, { useState, useEffect, useRef } from 'react'
import { heightStatusBar, isLandscape, nstyles, nwidth, Width } from '../../styles/styles';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView, BackHandler, Platform, AppState } from 'react-native';
import { HeaderCus } from '../../components';
import { Images } from '../images';
import { colors } from '../../styles';
import Utils from '../../app/Utils';
import { isPad, reText } from '../../styles/size';
import apis from '../apis';
import PlayerWSSAndroid from '../../android-native-component/PlayerWSSAndroid';
// import { Height } from '../../srcAdmin/screens/chat/styles/styles';
import { store } from '../../srcRedux/store';
import { SetListCam } from '../../srcRedux/actions/common/Common';
import PlayerWSS from '../../ios-native-component/PlayerWSS';
import { nGlobalKeys } from '../../app/keys/globalKey';
const DSLoadAPIDetails = {};

const ItemCamera = (props) => {
    const { item, index } = props;
    const [appState, setAppState] = useState(AppState.currentState)
    var [data, setdata] = useState(item);
    var [isLoadDetail, setDetail] = useState(true);
    const refsVLC = useRef(null) // Dùng cho nhánh AddVLC ko dc xoá
    const [errdata, seterrdata] = useState(true);
    DSLoadAPIDetails[[index]] = item.Id;
    const Getdata = async () => {
        let tempId = item?.Id;
        if (!tempId)
            return;
        setDetail(true);
        let res = await apis.ApiApp.GetDetailCamera(tempId)
        setDetail(false);
        //Check để tránh tình trạng Change CAM nhanh, và API load chậm sẽ khiến data load SAI
        if (DSLoadAPIDetails[[index]] != tempId) {
            return;
        }
        Utils.nlog('[CAM]: GetDetailCamera:', tempId, res)
        if (res.status == 1 && res.data) {
            const dataRes = res?.data || {}
            // if (dataRes.LinkWSS != item.LinkWSS || dataRes.Rtsp != item.Rtsp) {
            // setdata(res.data)
            props.callBack({ ...dataRes }, index)
            // }
        } else {
            deleteCamChoose(index);
            // setdata(item);
        }
    }

    const deleteCamChoose = (index) => {
        let listcam = [...props.listCamChoose];
        listcam[index] = { id: index * -1 };
        store.dispatch(SetListCam(listcam))
    }

    const _handleAppStateChange = nextAppState => {
        if (appState.match(/inactive|background/) && nextAppState === "active") {
            nextAppState === 'active'
            setAppState(nextAppState)
        }
        setAppState(nextAppState)
    };

    useEffect(() => {
        //-DidMount
        AppState.addEventListener('change', _handleAppStateChange);
        Utils.nlog('[CAM]:-DidMount->>>');
        Getdata();
        return () => {
            //-UnMount
            Utils.nlog('[CAM]:-UnMount');
            setdata({ LinkWSS: 'wss://...', Rtsp: 'rtsp://...' });
            if (refsVLC && refsVLC.current) {
                refsVLC.current.paused = true;
            }
        }
    }, [])

    useEffect(() => {
        //-Didupdate
        Utils.nlog('[CAM]:-Update');
        if (!data || (data && data.Id != item.Id)) {
            setdata(item);
            Getdata();
        }
    }, [item.Id, item.LinkWSS, item.Rtsp, item.timeCallBack, item.Status]);

    let tyleCamera = [16, 9]; // Tỷ lê WSS, và VLC chỉnh chung ở đây.
    let sizePlayer = Width(props.common.keyCamera > 2 ? 50 : 100) - 2;
    let sizeHeighPlayer = props.common.keyCamera <= 2 || isLandscape() || isPad ? sizePlayer * tyleCamera[1] / tyleCamera[0] : sizePlayer; // ty le 12:16

    let isHaveVideo = false;
    if (data != '' && data.LinkWSS || data != '' && data.Rtsp) {
        isHaveVideo = true;
    }

    let is_topWSS = Utils.getGlobal(nGlobalKeys.topWSS, true);
    let isRtstLink = data.Rtsp && !data.LinkWSS && !data.Rtsp?.includes("wss://"); // đang ưu tiên wss 
    isRtstLink = !is_topWSS && !isRtstLink && data.Rtsp && !data.Rtsp?.includes("wss://") ? true : isRtstLink
    if (isRtstLink) {
        if (data.hasOwnProperty('Username') && data.Username && item.Password) {
            let arr = data.Rtsp?.split('rtsp://')
            let rtspAuth = ''
            rtspAuth = `rtsp://${data.Username}:${data.Password}@${arr[1]}`
            data = { ...data, Rtsp: rtspAuth };
            Utils.nlog('rtspAuth:', data)
        }
    }
    let isCameraOff = item?.Status == false || data?.Status == false;
    // Utils.nlog("data111", data)

    if (!isHaveVideo || isRtstLink || isCameraOff || appState === 'background') {
        return <View style={{ borderWidth: 1, borderColor: colors.white }}>
            {
                !item.Id ? <TouchableOpacity
                    onPress={() => props.addCam(index)}
                    activeOpacity={0.5}
                    style={{
                        width: sizePlayer,
                        height: sizeHeighPlayer,
                        backgroundColor: colors.backgroundModal,
                        alignItems: 'center', justifyContent: 'center',
                        borderLeftWidth: 0, borderLeftColor: colors.white
                    }}>
                    <Image source={Images.icAddBT} style={[nstyles.nIcon30, { tintColor: colors.white }]} />
                </TouchableOpacity> :
                    <View style={{
                        width: sizePlayer, height: sizeHeighPlayer, backgroundColor: 'black',
                        alignContent: 'center', justifyContent: 'center'
                    }}>
                        <Text style={{ color: colors.white, textAlign: 'center' }}>{isCameraOff ? "Camera hiện không hoạt động." : (isRtstLink || !isHaveVideo) && !isLoadDetail ? '⚠ Không có dữ liệu' : 'Đang load \n dữ liệu camera...'}</Text>
                    </View>
            }
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: colors.white }}>
                <TouchableOpacity onPress={() => { props.addCam(index) }} style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={Images.icChangeCamera} style={nstyles.nIcon20} />
                </TouchableOpacity>
                {
                    !item.Id || !isHaveVideo || isCameraOff ? null : <TouchableOpacity
                        onPress={() => Utils.goscreen({ props: props }, 'scSeenCamera', { itemCamera: data })}
                        style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={Images.icExpand} style={nstyles.nIcon20} />
                    </TouchableOpacity>
                }
            </View>
        </View>
    } else {
        return (
            <View
                style={{ borderWidth: 1, borderColor: colors.white }}>
                {
                    Platform.OS == 'android' ? <PlayerWSSAndroid tyleScreen={tyleCamera[0] / tyleCamera[1]}
                        style={{
                            width: sizePlayer,
                            height: sizeHeighPlayer
                        }} url={data.LinkWSS || data.Rtsp || ''} /> :
                        <PlayerWSS tyleScreen={tyleCamera[0] / tyleCamera[1]} style={{ width: sizePlayer, height: sizeHeighPlayer }} url={data.LinkWSS || data.Rtsp || ''} />
                }
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: colors.white }}>
                    <TouchableOpacity onPress={() => { props.addCam(index) }} style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={Images.icChangeCamera} style={nstyles.nIcon20} />
                        {/* <Text style={{ paddingLeft: 4, color: colors.colorBlue, fontSize: reText(12) }}>Đổi Camera</Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (!isRtstLink)
                                setdata('');
                            Utils.goscreen({ props: props }, 'scSeenCamera', { itemCamera: data, callback: () => props.callBack({ ...item, timeCallBack: Date.now() }, index) });
                        }}
                        style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={Images.icExpand} style={nstyles.nIcon20} />
                        {/* <Text style={{ color: colors.redStar, fontSize: reText(12) }}>Mở rộng</Text> */}
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}

const mapStateToProps = state => ({
    theme: state.theme,
    listCamChoose: state.common.listCamChoose
});

export default Utils.connectRedux(ItemCamera, mapStateToProps, true)
