import { values } from 'lodash'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, View, Dimensions, TouchableOpacity, Image, FlatList, TextInput } from 'react-native'
import Video from 'react-native-video'
import { nGlobalKeys } from '../../app/keys/globalKey'
import Utils from '../../app/Utils'
import { ListEmpty } from '../../components'
import { colors } from '../../styles'
import { reSize, reText } from '../../styles/size'
import { nstyles, nwidth } from '../../styles/styles'
import { ImagesChat } from '../Images'
import InputChat from '../InPutChat'
import ConnectSocket from './Connecttion'
import VideoCus from '../../components/Video/VideoCus'
import AppCodeConfig from '../../app/AppCodeConfig'
import { useSelector } from 'react-redux'

const ModalChuyenTiepTin = props => {
    const [dataSelect, setdataSelect] = useState([]);
    const [loginToken, setLoginToken] = useState(Utils.getGlobal(nGlobalKeys.loginToken, '', AppCodeConfig.APP_ADMIN));
    const { userCHAT } = useSelector(state => state.auth)
    const [data, setData] = useState(Utils.ngetParam({ props }, 'item', {}));
    const onSendFile = (item) => {
        if (data.IsVideoFile) {
            let video = {
                type: "video/mp4",
                name: "Video.mp4",
                uri: data.PathFile,
                url: data.PathFile
            }
            props.SendFileOfGroup([{ ...video }]);
        }
        else {
            let img = {
                type: 'image/png',
                name: `ImagePhoto.png`,
                uri: data.PathFile,
                url: data.PathFile
            }
            props.SendFileOfGroup([{ ...img }]);
        }

    }
    const _AcctionTouch = async (item) => {
        let isChoose = dataSelect.findIndex(item2 => item.IdGroup == item2.IdGroup);
        if (isChoose == -1) {
            setdataSelect([...dataSelect, item])
            data.PathFile ? onSendFile(item) : ChatForward(item)
        } else {
            // await dataSelect.splice(isChoose, 1);
            // setdataSelect([].concat(dataSelect));
        }

    }
    const ChatForward = (itemChon) => {
        try {
            let chatinfo = {
                IdChat: 0,
                IdGroup: itemChon.IdGroup,
                UserID: userCHAT.Id,
                Comment: data.Comment,
                PathFile: '',
                IsDelAll: false,
                IsHidenAll: false,
                TypeFile: 0,
                TenFile: '',
                IsVideoFile: false,
                CreatedDate: new Date(),
                // IdChatReplay: item.IdChat ? item.IdChat : 0,
                IconChat: 0,
                FileUpload: null,
                IsGroup: itemChon.IsGroup,
                SendKey: 0
            };
            ConnectSocket.onPressSendSocket(chatinfo);
        } catch (error) { }
    };
    useEffect(() => {
        props.ApiGet_ListGroupChat();
    }, []);

    const renderItem = ({ item, index }) => {
        let isChoose = dataSelect.find(item2 => item.IdGroup == item2.IdGroup);
        return (
            <View key={index} style={{ flexDirection: 'row', marginBottom: 20, alignItems: 'center' }}>
                <Image source={{ uri: item.Avata }} style={[nstyles.nAva50]} />
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between', flex: 1,
                    alignItems: 'center', borderBottomWidth: 0.5, paddingBottom: 10,
                    marginLeft: 10, borderColor: colors.black_80
                }}>
                    <Text style={{ fontWeight: 'bold', fontSize: reText(16) }} >{item.GroupName}</Text>
                    {
                        isChoose ?
                            <TouchableOpacity
                                disabled={true}
                                onPress={() => _AcctionTouch(item)}
                                style={{
                                    paddingHorizontal: 10, borderWidth: 0.5, borderColor: colors.colorBlue, borderRadius: 20,
                                    flexDirection: 'row',
                                }}>
                                <Image source={ImagesChat.icCheck} style={[nstyles.nIcon14, { alignSelf: 'center', tintColor: colors.colorBlue, }]} />
                                <Text style={{ color: colors.colorBlue, paddingVertical: 5, paddingHorizontal: 10, }}>{`Đã gửi`}</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={() => _AcctionTouch(item)}
                                style={{ paddingHorizontal: 10, backgroundColor: colors.colorBlue, borderRadius: 20 }}>
                                <Text style={{ color: colors.white, paddingVertical: 5, paddingHorizontal: 15, }}>{`Gửi`}</Text>
                            </TouchableOpacity>
                    }

                </View>
            </View>
        )
    }
    const _keyExtrac = (item, index) => index.toString();
    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.white,
            marginTop: nwidth() / 2,
        }}>
            <View style={{ flexDirection: 'row', padding: 15, justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => Utils.goback({ props })}>
                    <Image source={ImagesChat.icCloseImg} style={[nstyles.nIcon14, { tintColor: colors.black_50 }]} />
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', fontSize: reText(16) }}>{`Chuyển tiếp tin nhắn`}</Text>
                <TouchableOpacity onPress={() => Utils.goback({ props })} disabled={dataSelect.length > 0 ? false : true} style={{ opacity: dataSelect.length > 0 ? 1 : 0.4, paddingHorizontal: 10, backgroundColor: '#137AD1', borderRadius: 20 }}>
                    <Text style={{ color: colors.white, paddingVertical: 5 }}>{`Xong`}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ height: 1, backgroundColor: colors.black_50 }} />
            <View style={{
                backgroundColor: colors.black_11, margin: 10, borderRadius: 10,
                padding: 10, width: nwidth() - 20,
            }}>
                {
                    data.PathFile && data.IsVideoFile == false ?
                        <Image source={{ uri: data.PathFile }} style={{ width: 100, height: 100 }} /> :
                        data.IsVideoFile ?
                            <View>
                                <VideoCus
                                    source={{ uri: data.PathFile }}
                                    paused={true}
                                    resizeMode={'cover'} // Store reference
                                    style={{
                                        width: reSize(150),
                                        height: reSize(150),
                                    }}
                                    repeat={true}
                                />
                                <View style={{ position: 'absolute', bottom: nwidth() / 6, left: nwidth() / 6 }}>
                                    <Image
                                        source={ImagesChat.icPlayButton}
                                        style={[
                                            {
                                                width: 15,
                                                height: 15,
                                                borderRadius: 5,
                                            }
                                        ]}
                                    ></Image>
                                </View>
                            </View>

                            :
                            <View style={{ flexDirection: 'row', borderBottomWidth: 0.5 }}>
                                <Image source={ImagesChat.icDauPhayCT} style={[nstyles.nIcon20, {}]} />
                                <Text numberOfLines={1} style={{ marginLeft: 10, fontSize: reText(16), marginRight: 15, paddingBottom: 15 }}>{data.Comment}</Text>
                            </View>
                }


            </View>
            <View style={{ marginHorizontal: 10, flex: 1 }}>
                <Text style={{ fontWeight: 'bold', fontSize: reText(14), color: colors.colorGrayText, marginBottom: 15 }}>{`ĐƯỢC ĐỀ XUẤT`}</Text>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    data={props.objectdataGroup.data}
                    extraData={props.objectdataGroup}
                    ListEmptyComponent={<ListEmpty textempty={'....'} />}
                    keyExtractor={_keyExtrac}
                    onEndReachedThreshold={0.3}
                />
            </View>
        </View >
    )

}
const mapStateToProps = state => ({
    objectdataGroup: state.ReducerGroupChat.ObjectListGroup,
    auth: state.auth,
});
export default Utils.connectRedux(ModalChuyenTiepTin, mapStateToProps, true);
