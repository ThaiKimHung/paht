import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native'
import { nstyles, colors, sizes } from './styles'
import { ImagesChat } from './Images'
import { nGlobalKeys } from '../app/keys/globalKey'
import { reSize } from '../styles/size'
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { heightStatusBar } from '../styles/styles'

// const myIcon = <Icon name="rocket" size={30} color="#900" />;

const HeaderChat = (props) => {
    const {
        Avata = '',
        styleTitle,
        styleContainer,
        isLeft = true,
        isRight = false,
        isBack = false,
        onPressLeft,
        onAddGroup,
        isAddGroup = true,
        isEditMember = false,
        isAddfriend = false,
        textTitle = '',
        onPressAvata,
        onAddMember = () => { },
        onPressNoti = () => { },
        onPressEdit = () => { },
        viewStatus = null
    } = props
    return (
        <View style={[configstyle.container,
        { paddingTop: heightStatusBar(), borderWidth: 0, borderBottomWidth: 1, borderColor: colors.greyLight }]}>
            {
                isLeft ? <TouchableOpacity
                    onPress={onPressLeft}
                    style={[{ paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' }]} >

                    <Icon name="arrow-back" size={30} color={colors.peacockBlue} />
                </TouchableOpacity> : null
            }
            {
                isBack ? <TouchableOpacity
                    onPress={onPressLeft}
                    style={[{ paddingRight: 10, alignItems: 'center', justifyContent: 'center' }]} >
                    <Image source={ImagesChat.icBack}
                        resizeMode='contain'
                        style={[{
                            width: reSize(25), height: reSize(25),
                            tintColor: colors.peacockBlue,
                        }]}>
                    </Image>
                </TouchableOpacity> : null
            }
            <TouchableOpacity onPress={onPressAvata} style={[configstyle.icLeft, { width: 30, height: 30 }]} >
                <Image source={Avata ? { uri: Avata } : ImagesChat.icMember}
                    style={[{ width: 30, height: 30, borderRadius: 20 }]}>
                </Image>
                {viewStatus ? viewStatus : null}
            </TouchableOpacity>
            <View style={{
                alignItems: 'center', justifyContent: 'center',
                flex: 1, flexDirection: 'row'
            }}>
                <Text allowFontScaling={false} style={[configstyle.styleTitle, styleTitle, { flex: 1 }]}>{textTitle ? textTitle : ''}</Text>
                {isRight == false ?
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end', height: '100%',
                        justifyContent: 'flex-end',

                    }}>
                        {
                            isAddGroup == true ? <TouchableOpacity
                                onPress={onAddGroup}
                                style={{}}>
                                <AntDesign name="addusergroup" size={30} color={colors.peacockBlue} />
                            </TouchableOpacity> : null
                        }
                        {
                            isAddfriend == true ? <TouchableOpacity
                                style={{

                                }}
                                onPress={onAddMember}>
                                {/* adduser */}
                                <AntDesign name="adduser" size={30} color={colors.peacockBlue} />
                            </TouchableOpacity> : null
                        }
                        {
                            !isBack ? <TouchableOpacity
                                onPress={onPressNoti}
                                style={{}}>

                                <Icon name="ios-notifications-outline" size={30} color={colors.peacockBlue} />
                            </TouchableOpacity> : null
                        }
                        {
                            isEditMember == true ?
                                <TouchableOpacity
                                    onPress={onPressEdit}
                                    style={{
                                    }}>
                                    <AntDesign name="menufold" size={30} color={colors.peacockBlue} />

                                </TouchableOpacity> : null
                        }
                    </View> : null

                }
            </View>

        </View >
    )
}
const configstyle = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'white',
        flexDirection: 'row', paddingHorizontal: 10,
        elevation: 6,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 6,
        shadowOpacity: 0.2,
        shadowColor: 'black',
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    icLeft: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 0.5
    },
    icIconLeft: {
        tintColor: 'black',
        width: 20,
        height: 20

    },
    styleTitle: {
        fontSize: sizes.sizes.sText17,
        color: 'black',
        fontWeight: '500',
        paddingHorizontal: 5,
    }
})
export default HeaderChat
