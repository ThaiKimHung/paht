import React, { Component } from 'react'
import { Image, Text, View } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import LinearGradient from 'react-native-linear-gradient'
import Utils from '../../../app/Utils'
import { HeaderCus, IsLoading } from '../../../components'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { nstyles } from '../../../styles/styles'

export class ChangeHeaderHome extends Component {
    constructor(props) {
        super(props)
        const { theme } = this.props
        this.state = {
            selected: theme.colorLinear.color.key,
            colorSelect: theme.colorLinear
        }
    }

    // LƯU MÀU XUỐNG REDUX,STORE
    selectColor = (item) => {
        this.props.Set_Color_Linear(item)
    }

    render() {
        const { theme } = this.props
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`Đổi màu trang chủ`}
                    styleTitle={{ color: colors.white }}
                />
                <View style={{ flex: 1 }}>
                    <FlatList
                        contentContainerStyle={{ paddingBottom: Platform.OS == 'android' ? 65 : 70, padding: 13 }}
                        data={theme.ListColor}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity onPress={() => this.selectColor(item)} activeOpacity={0.5} style={{}}>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                        colors={item.color}
                                        style={{ height: 70, justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}
                                    >
                                        {
                                            item.key == this.props.theme.colorLinear.key ?
                                                <Image source={Images.icSettingTick} style={nstyles.nIcon28} />
                                                : null
                                        }

                                    </LinearGradient>
                                </TouchableOpacity>
                            )
                        }}
                        ItemSeparatorComponent={() => { return <View style={{ height: 10 }} /> }}
                        ListFooterComponent={<View style={{ height: 30 }} />}
                    />
                </View>
                <IsLoading />
            </View>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.theme
});

export default Utils.connectRedux(ChangeHeaderHome, mapStateToProps, true)
