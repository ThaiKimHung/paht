
import { Animated, Easing, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { nstyles, Width } from '../../../styles/styles'
import Utils from '../../../app/Utils'
import UtilsApp from '../../../app/UtilsApp'
import { reText } from '../../../styles/size'

const ItemShowDrop = (props) => {
    const [show, setShow] = useState(false)
    const animation = useRef(new Animated.Value(0)).current;
    const { item, Call_Back = () => { }, index } = props
    return (
        <View style={styles.container}
            onPress={() => {
                Call_Back();
            }}>
            <View style={{ flexDirection: 'row', marginBottom: 10, width: '100%', justifyContent: 'center' }}>
                {/* <Text style={{ marginRight: 15, textAlign: 'justify' }} >Cấp học: {item.Khoi[0]?.Group?.CapHoc.tenCapHoc}</Text> */}
                <Text style={{ fontSize: reText(15), fontWeight: 'bold' }} >Khối {item?.Khoi[0]?.Group.GroupKhoi?.khoiHoc ? item?.Khoi[0]?.Group?.GroupKhoi?.khoiHoc : ''}</Text>
            </View>
            {item['Khoi']?.map((i, index) => {
                return (
                    <TouchableOpacity key={index} onPress={() => {
                        Utils.navigate('ModaGiaoVien', { Data: i.Group })
                    }} style={{ marginBottom: 25, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.6, borderBottomColor: colors.grayLight }} >
                        <Image source={Images.icClass} style={[nstyles.nIcon29, { marginRight: 10 }]} resizeMode={'contain'} />
                        <Text >{'Tên lớp học: ' + i.Group.GroupKhoi?.tenLopHoc}</Text>
                    </TouchableOpacity>
                )
            })}
            {/* </View> */}
        </View>
    )
}

export default ItemShowDrop

const styles = StyleSheet.create({
    container: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: colors.white,
        marginBottom: 15,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    }
})