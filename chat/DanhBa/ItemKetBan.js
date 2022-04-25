import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { colors, sizes } from '../styles';
import Icon, { TypeIcon } from '../Component/icon/Icon';
import { reSize, reText } from '../../styles/size';
import Utils, { icon_typeToast } from '../../app/Utils';
import apiChat from '../api/apis';
// import { TouchableOpacity } from 'react-native-gesture-handler';

const ItemKetBan = (props) => {
    const [isShow, setisShow] = useState(false);
    const { item, index } = props;
    const [data, setdata] = useState([])
    const [page, setpage] = useState({
        Page: 1,
        AllPage: 1,
    })
    const { TenPhuongXa = 'Tên Đơn vị', IDdv, Child = [], MaDinhDanh, IdDonVi } = item || {};

    const getBanBe = async (isNext = false) => {
        let pageload = page.Page + isNext ? 1 : 0
        let res = await apiChat.GetList_Chat_FindNewFriends_Test('', 10, pageload, IdDonVi, MaDinhDanh);
        if (res.status == 1) {
            setpage(res.page ? res.page : {
                Page: 1,
                AllPage: 1
            })
            if (isNext) {
                setdata([...data, ...res.data])
            } else {
                setdata(res.data)
            }
        } else {
            if (isNext) {

            } else {
                setdata([])
            }
        }
    }
    const _Chat_SendRequestFriend = async item => {
        Utils.showMsgBoxYesNo(
            props.nthis,
            'Thông báo',
            'Bạn có muốn gửi lời mời kết bạn không?',
            'Kết bạn',
            'Xem lại',
            async () => {
                let res = await apiChat.Chat_SendRequestFriend(item);
                Utils.nlog("gia tri res ket bạn--------------", res)
                if (res.status == 1) {
                    Utils.showToastMsg("Thông báo chat", "Thực hiện thành công", icon_typeToast.success);
                    let newdata = data.map((i, e) => {
                        if (i.UserID == item.UserID) {
                            return { ...i, IsRequest: true }
                        } else {
                            return { ...i }
                        }
                    })
                    Utils.nlog("data------", newdata)
                    setdata(newdata);
                } else {
                    Utils.showMsgBoxOK(
                        props.nthis,
                        'Thông báo',
                        res.error ? res.error.message : 'Gửi kết bạn thất bại',
                        'Xác nhận'
                    );
                }
            },
            () => { }
        );
    };
    useEffect(() => {
        getBanBe()
    }, [])
    const renderItem = (e, i) => {
        const { FullName, ChucVu } = e;
        return <View style={{ paddingLeft: 15 }} key={`dv-${i}`}>
            <ItemKetBan item={e} index={i} nthis={props.nthis} />
        </View>

    }
    const renderItemPX = (e, i) => {
        const { FullName, ChucVu } = e;
        return <View style={{
            paddingVertical: 10, borderWidth: 0,
            borderTopWidth: i == 0 ? 0 : 3, borderColor: colors.white,
            paddingHorizontal: 10,
        }} key={i}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 5
                // justifyContent: 'center'
            }}>
                <Text
                    style={{
                        lineHeight: 20, fontSize: 16, borderRadius: 5, fontWeight: 'bold',
                    }}
                >
                    {FullName}
                </Text>
                <Text
                    style={{
                        lineHeight: 20, fontSize: 16, borderRadius: 5, paddingHorizontal: 10,
                        color: colors.colorGreyishBrown
                    }}>
                    ({ChucVu})
                    
              </Text>
            </View>

            {e.IsRequest == false ? (
                <TouchableOpacity
                    onPress={() => _Chat_SendRequestFriend(e)}
                    style={{
                        backgroundColor: '#3582FD',
                        padding: 10,
                        borderRadius: 5,
                        paddingHorizontal: 25,
                        alignSelf: 'flex-start'
                    }}>
                    <Text
                        style={{
                            fontSize: reText(14),
                            textAlign: 'center',
                            color: colors.white,
                            fontWeight: 'bold'
                        }}>
                        {'Thêm bạn bè'}
                    </Text>
                </TouchableOpacity>
            ) : (
                    <View
                        style={{
                            backgroundColor: colors.colorGrayBgr,
                            padding: 10,
                            borderRadius: 5,
                            paddingHorizontal: 25,
                            alignSelf: 'flex-start'
                        }}>
                        <Text
                            style={{
                                fontSize: reText(14),
                                textAlign: 'center',
                                color: colors.white,
                                fontWeight: 'bold'
                            }}>
                            {'Chờ xác nhận'}
                        </Text>
                    </View>
                )}
        </View>
    }
    Utils.nlog("page", page);
    return (
        <View style={{ backgroundColor: colors.white, marginTop: 5 }}>
            <TouchableOpacity onPress={() => setisShow(!isShow)} style={{
                flexDirection: 'row', alignItems: 'center',
                paddingVertical: 10, justifyContent: 'space-between',
                paddingHorizontal: 20
            }}>
                <Text style={{ color: colors.pumpkinOrange, fontSize: reSize(16) }}>{TenPhuongXa}</Text>
                <Icon name={isShow ? 'remove-outline' : 'add-outline'} type={TypeIcon.Ionicons} size={reSize(30)} color={colors.black_50} />
            </TouchableOpacity>
            <View style={{
                paddingHorizontal: 0,
                backgroundColor: colors.BackgroundHome,
            }}>
                {
                    isShow && <View style={{
                        paddingHorizontal: 0,
                        backgroundColor: colors.BackgroundHome,
                    }}>
                        {
                            data && data.length > 0 ? data.map(renderItemPX) : null
                        }
                        {
                            data && data.length > 0 && page.Page && page.Page && page.AllPage < page.AllPage ? <TouchableOpacity onPress={() => {
                                getBanBe(true)
                            }} style={{ paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: colors.oceanBlue, fontSize: reSize(16) }}>{'Xem thêm'}</Text>
                            </TouchableOpacity> : null
                        }
                        {
                            Child && Child.length > 0 && Child.map(renderItem)
                        }
                    </View>
                }
            </View>

        </View>
    )
}

export default ItemKetBan

const styles = StyleSheet.create({})
