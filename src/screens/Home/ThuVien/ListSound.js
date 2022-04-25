import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { color } from 'react-native-reanimated'
import Utils from '../../../../app/Utils'
import { HeaderCus, IsLoading } from '../../../../components'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import { nstyles, paddingBotX, Width } from '../../../../styles/styles'
import { Images } from '../../../images'
import { BlurView } from '@react-native-community/blur'
import { getListThuVien } from '../../../apis/apiThuVien'
import { appConfig } from '../../../../app/Config'

class ListSound extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrSound: [],
            keys: 'Type',
            vals: 2,//Type: 1 (link yotube), 2: Audio (link có sẵn) 3: Uploas file 4: hinh ảnh Nếu ko truyền hệ thống mặc định 1,2,3
            page: 1,
            record: 20,
            AllPage: 1,
            refreshing: false
        }
    }
    componentDidMount() {
        nthisIsLoading.show()
        this.loadListData().then(res => {
            if (res)
                nthisIsLoading.hide()
        })
    }
    loadListData = async (npage = this.state.page) => {
        let { keys, vals, page, record, arrSound } = this.state
        let res = await getListThuVien(keys, vals, npage, record)
        let temp = arrSound
        if (res.status == 1) {
            if (npage != 1)
                temp = temp.concat(res.data)
            else
                temp = res.data
            this.setState({ arrSound: temp, page: res.page.Page, AllPage: res.page.AllPage })
        }
        else
            Utils.showMsgBoxOK(this, 'Thông báo', res.error ? res.error.massage : 'Lỗi truy xuất dữ liệu', 'Xác nhận')
        return true
    }
    onRefresh = () => {
        this.loadListData()
    }
    _renderList = ({ item, index }) => {
        let isDiffMonth = true;
        try {
            let itemLast = this.state.arrSound[index - 1].CreateDate;
            isDiffMonth = item.CreateDate[3] + item.CreateDate[4] != itemLast[3] + itemLast[4];
        } catch (error) {
        }

        return (
            <TouchableOpacity style={{
                flexDirection: 'row', marginVertical: 7.5, borderTopWidth: isDiffMonth && index != 0 ? 2 : 0,
                borderTopColor: isDiffMonth && index != 0 ? colors.greyLight : null, paddingTop: isDiffMonth && index != 0 ? 10 : 0
            }}
                onPress={() => Utils.goscreen(this, 'Modal_SoundPlay', { source: item.LinkYoutube, imagebg: appConfig.domain.slice(0, -1) + item.AvatarPath })}>
                <Image source={Images.icMP3} style={nstyles.nIcon30}></Image>
                <View style={{ marginHorizontal: 5, flex: 1 }}>
                    <Text style={{ fontSize: reText(14), width: '100%' }} numberOfLines={2}>
                        {item.TieuDe}
                    </Text>
                    <Text style={styles.textTime}>{item.CreateDate}</Text>
                </View>
            </ TouchableOpacity>
        )
    }
    onLoadmore = () => {
        var { page, AllPage } = this.state
        if (page < AllPage) {
            this.loadListData(page + 1)
        }
    }
    render() {
        const { arrSound, refreshing } = this.state
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.grayLight }]}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={'Thư viện âm thanh'}
                    styleTitle={{ color: colors.white }}
                // iconRight={Images.icSearch}
                // Sright={{ tintColor: 'white' }}
                />
                <View style={{ flex: 1, backgroundColor: colors.white, paddingHorizontal: 10, paddingTop: 15, paddingBottom: paddingBotX }}>
                    <FlatList
                        data={arrSound}
                        renderItem={this._renderList}
                        keyExtractor={(item, index) => `${index}`}
                        showsHorizontalScrollIndicator={false}
                        ref={(ref) => this.FlatList = ref}
                        onRefresh={this.onRefresh}
                        refreshing={refreshing}
                        onEndReached={() => {
                            if (!this.onEndReachedCalledDuringMomentum) {
                                this.onLoadmore()
                                this.onEndReachedCalledDuringMomentum = true;
                            }
                        }}
                        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
                        onEndReachedThreshold={0.4}
                    />
                    <IsLoading></IsLoading>
                </View>
            </View >
        )
    }
}
const styles = StyleSheet.create({
    groupview: {
        paddingVertical: 10,
    },
    topIcon: {
        alignItems: 'center',
    },
    topText: {
        fontSize: reText(14),
        marginTop: 5
    },
    textGrp: {
        fontSize: reText(16),
        marginVertical: 8,
        fontWeight: 'bold'
    },
    textTime: {
        fontSize: reText(12),
        color: colors.brownGreyFour
    },
    groupVideo: {
        alignItems: 'center',
        paddingVertical: 10,
        marginRight: 10,
        width: 187
    },
    hinhanh: {
        width: Width(40),
        height: Width(40) / 1.6
    }
})

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(ListSound, mapStateToProps, true);
