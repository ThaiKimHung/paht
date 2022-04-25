import React, { useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import Utils from '../../../app/Utils'
import * as Animatable from 'react-native-animatable';
import { colors } from '../../../styles';
import { Width } from '../../../styles/styles';
import { reText } from '../../../styles/size';


const ModalSearchHoSo = (props) => {


    const event = Utils.ngetParam({ props: props }, "event", {});

    const [textSearch, setTextSearch] = useState('')

    const Search = () => {
        if (textSearch == '') {
            Utils.showMsgBoxOK({ props: props }, "Thông báo", "Nhập tên thủ tục để tìm kiếm", 'Xác nhận')
            return;
        }

        Utils.goscreen({ props: props }, 'dsthutuc', {
            DonViID: "0",
            LinhVucID: "0",
            TenThuTuc: textSearch,
            isCheckScreenSeach: true
        })


    }
    return (
        <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.2)',
            // backgroundColor: 'blue',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            // paddingTop: '30%',
            height: '100%'
        }}>

            <View onTouchEnd={() => Utils.goback({ props: props })}
                style={{
                    position: 'absolute',
                    top: 0, bottom: 0, left: 0, right: 0,
                }} />
            <Animatable.View animation={'slideInRight'} delay={150} style={{
                backgroundColor: 'white',
                position: 'absolute',
                top: event.pageY,
                minHeight: 150,
                left: 10, right: 10,
                zIndex: 200,
                elevation: 6,
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowRadius: 6,
                shadowOpacity: 0.2,
                shadowColor: colors.black_50, borderRadius: 5, paddingVertical: 10
            }}>
                <Text style={{ marginTop: 10, marginHorizontal: 15, marginBottom: 5, color: colors.colorBlueP, fontSize: reText(15), fontWeight: 'bold' }}>Tên thủ tục</Text>
                <View style={{ backgroundColor: colors.black_11, marginHorizontal: 15, paddingHorizontal: 10 }}>
                    <TextInput
                        multiline={true}
                        placeholder={'Nhập chính xác tên thủ tục'}
                        style={{
                            paddingVertical: 10, orderRadius: 3, fontSize: reText(14),
                        }}
                        value={textSearch}
                        onChangeText={(val) => setTextSearch(val)}
                    />
                </View>
                <TouchableOpacity style={{
                    paddingVertical: 10, backgroundColor: colors.colorBlueP, width: Width(25), alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center',
                    borderRadius: 5, marginTop: 10, marginHorizontal: 15
                }} onPress={Search}>
                    <Text style={{ fontWeight: 'bold', fontSize: reText(14), color: colors.white }}>Tìm kiếm</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View >
    )
}
export default ModalSearchHoSo
