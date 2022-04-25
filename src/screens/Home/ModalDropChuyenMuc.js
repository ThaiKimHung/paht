import React, { Component } from 'react';
import { View, Animated, StyleSheet, BackHandler, Image, Text, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Utils from '../../../app/Utils';
import index from '../../../chat/RoomChat/ActionImae';
import { ListEmpty } from '../../../components';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { Height, paddingBotX, Width } from '../../../styles/styles';
import { Images } from '../../images';


class ModalDropChuyenMuc extends Component {
    constructor(props) {
        super(props);
        this.dataChuyenMuc = Utils.ngetParam(this, 'dataChuyenMuc')
        this.callbackCM = Utils.ngetParam(this, 'callbackCM')
        this.currentLinhVuc = Utils.ngetParam(this, 'currentLinhVuc')
        this.checkCA = Utils.ngetParam(this, 'checkCA')
        this.state = {
            opacity: new Animated.Value(0),
        };
    }

    componentDidMount() {
        this._startAnimation(0.4)
        // BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        this._goback()
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 250
            }).start();
        }, 300);
    }

    _goback = () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                Utils.goback(this)
            });
        }, 100);
    }
    _keyExtrac = (item, index) => index.toString();

    _renderItem = ({ item, index }) => {
        Utils.nlog("-------:", this.checkCA)
        if (item[this.checkCA == 'true' ? 'Display' : 'HienThi'] == true)
            return (
                <TouchableOpacity key={index} onPress={() => this._xuLyCallBack(item)}>
                    <Text style={{
                        fontSize: reText(16), alignSelf: 'center',
                        color: (this.checkCA == 'true' ? this.currentLinhVuc.IdLinhVuc == item.IdLinhVuc : this.currentLinhVuc.IdChuyenMuc == item.IdChuyenMuc) ? colors.black_80 : colors.black_50,
                        fontWeight: (this.checkCA == 'true' ? this.currentLinhVuc.IdLinhVuc == item.IdLinhVuc : this.currentLinhVuc.IdChuyenMuc == item.IdChuyenMuc) ? 'bold' : null
                    }}>{this.checkCA == 'true' ? item.LinhVuc : item.TenChuyenMuc}</Text>
                    <View style={{ backgroundColor: colors.colorGrayBgr, width: Width(80), height: 1, marginVertical: 10, alignSelf: 'center' }} />
                </TouchableOpacity>
            )
        else
            return null

    }
    _xuLyCallBack = (item) => {
        this.callbackCM(item)
        Utils.goback(this)
    }
    render() {
        const { opacity } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.nocolor, justifyContent: 'flex-end' }}>
                <Animated.View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity }} />
                <View style={{ flexGrow: 1 }}>
                    <Animated.View onTouchEnd={() => this._goback()} style={{ flex: 1, backgroundColor: 'tranparent' }} />
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => this._goback()}>
                                <Image source={Images.icBack} style={{ tintColor: colors.black_80, }} />
                            </TouchableOpacity>
                            <Text style={{ color: colors.black_80, fontWeight: 'bold', fontSize: reText(18) }}>{this.checkCA == 'true' ? 'CHỌN LĨNH VỰC' : 'CHỌN CHUYÊN MỤC'}</Text>
                            <View style={{ width: Width(6) }} />
                        </View>
                        <FlatList
                            style={{ marginTop: 25 }}
                            renderItem={this._renderItem}
                            data={this.dataChuyenMuc}
                            ListEmptyComponent={<ListEmpty textempty={'Không có dữ liệu'} />}
                            keyExtractor={this._keyExtrac}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 10,
        paddingBottom: paddingBotX,
        height: Height(75),
        paddingTop: 15
        // maxHeight: Height(75)
    },
    topBar: {
        height: 5,
        width: 80,
        alignSelf: 'center',
        backgroundColor: colors.grayLight,
        borderRadius: 10,
        marginTop: 10
    }
})

export default ModalDropChuyenMuc