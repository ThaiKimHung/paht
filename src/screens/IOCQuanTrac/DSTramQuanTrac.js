import React, { Component, createRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Utils from '../../../app/Utils';
import { HeaderCus, IsLoading, ListEmpty } from '../../../components';
import { colors } from '../../../styles';
import { nstyles } from '../../../styles/styles';
import { Images } from '../../images';
import apiQuanTrac from './apiQuanTrac';
import TypeQuanTrac from './TypeQuanTrac';

class DSTramQuanTrac extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataTramNuoc: [],
            dataTramKhongKhi: []
        };
        this.refLoading = createRef()
    }

    async componentDidMount() {
        this.refLoading.current.show()
        await this.getDSTramKhongKhi()
        await this.getDSTramNuoc()
        this.refLoading.current.hide()
    }

    getDSTramNuoc = async () => {
        let res = await apiQuanTrac.DanhSachTramQuanTrac(TypeQuanTrac.TYPESTRAM.NUOC)
        Utils.nlog('[LOG] DS TRAM NUOC', res)
        if (res && res.data) {
            Utils.nlog('[LOG] data pase NUOC', JSON.parse(res.data))
            this.setState({ dataTramNuoc: JSON.parse(res.data) })
        } else {
            this.setState({ dataTramNuoc: [] })
        }

    }

    getDSTramKhongKhi = async () => {
        let res = await apiQuanTrac.DanhSachTramQuanTrac(TypeQuanTrac.TYPESTRAM.KHONGKHI)
        Utils.nlog('[LOG] DS TRAM KHONG KHI', res)
        if (res && res.data) {
            Utils.nlog('[LOG] data parese KK', JSON.parse(res.data))
            this.setState({ dataTramKhongKhi: JSON.parse(res.data) })
        } else {
            this.setState({ dataTramKhongKhi: [] })
        }
    }

    onPressTram = (item, type) => {
        Utils.goscreen(this, 'Modal_BieuDoQuanTrac', { item: { ...item, TYPESTRAM: type } })
    }

    render() {
        const { dataTramKhongKhi, dataTramNuoc } = this.state
        return (
            <View style={stDSTram.cover}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`Danh sách trạm quan trắc`}
                    styleTitle={{ color: colors.white }}
                />
                <View style={stDSTram.container}>
                    {
                        dataTramKhongKhi.length == 0 && dataTramNuoc.length == 0 ?
                            <ListEmpty textempty={'Không có dữ liệu'} />
                            : null
                    }
                    <ScrollView contentContainerStyle={stDSTram.scrollList}>
                        <GroupTram data={dataTramKhongKhi} titleGroup={'không khí'.toUpperCase()} onPressTram={(item) => this.onPressTram(item, TypeQuanTrac.TYPESTRAM.KHONGKHI)} />
                        <GroupTram data={dataTramNuoc} titleGroup={'nước'.toUpperCase()} onPressTram={(item) => this.onPressTram(item, TypeQuanTrac.TYPESTRAM.NUOC)} />
                    </ScrollView>
                    <IsLoading ref={this.refLoading} />
                </View>
            </View>
        );
    }
}

const GroupTram = (props) => {
    const { data = [], titleGroup = '', onPressTram = () => { } } = props
    return (
        <View style={stDSTram.groupCover}>
            {data.length > 0 ?
                <Text style={stDSTram.titleGroup}>{titleGroup}</Text>
                : null}
            <View>
                {data.map((item, index) => {
                    return (
                        <TouchableOpacity key={index} onPress={() => onPressTram(item)} style={stDSTram.btnTram}>
                            <View style={stDSTram.btnContain}>
                                <Image source={Images.icTramQuanTrac} style={nstyles.nIcon40} resizeMode='contain' />
                                <Text style={stDSTram.txtStationName}>{item?.station_name}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    )
}

const stDSTram = StyleSheet.create({
    cover: {
        flex: 1,
        backgroundColor: colors.BackgroundHome
    },
    container: {
        flex: 1
    },
    groupCover: {
        paddingHorizontal: 10,
    },
    titleGroup: {
        fontWeight: 'bold',
        paddingVertical: 10,
        color: '#ff7e00'
    },
    txtStationName: {
        textAlign: 'justify',
        lineHeight: 20,
        flex: 1,
        paddingLeft: 10
    },
    btnTram: {
        padding: 10,
        backgroundColor: colors.white,
        marginBottom: 10,
        borderRadius: 5,
        ...nstyles.shadown
    },
    btnContain: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        alignItems: 'center'
    },
    scrollList: {
        paddingBottom: 50
    }
})

const mapStateToProps = state => ({
    theme: state.theme
});
export default Utils.connectRedux(DSTramQuanTrac, mapStateToProps, true);
