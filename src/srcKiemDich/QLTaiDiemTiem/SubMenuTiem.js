import React, { Component, createRef } from 'react';
import { View, Text, Animated, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, BackHandler, Platform } from 'react-native';
import Utils from '../../../app/Utils';
import { colors } from '../../../styles';
import { reSize, reText, sizes } from '../../../styles/size';
import { Height, nstyles, paddingBotX, Width } from '../../../styles/styles';
import { Images } from '../../images';
import { ButtonCom, HeaderCus, IsLoading } from '../../../components';
import LinearGradient from 'react-native-linear-gradient';
import ImageCus from '../../../components/ImageCus';
import { appConfig } from '../../../app/Config';
import { KeyTiem } from './KeyTiem';


const numcolumns = 4
const ratio = 1.6
class SubMenuTiem extends Component {
    constructor(props) {
        super(props);
        this.isSaveDiemTiem = Utils.ngetParam(this, 'isSaveDiemTiem', false)
        this.state = {
            opacity: new Animated.Value(0),
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
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

    _goback = (doidiadiem = false) => {
        if (this.isSaveDiemTiem && doidiadiem == false) {
            Utils.goscreen(this, 'ManHinh_Home')
        } else {
            Utils.goback(this)
        }
    }

    goScreen = (item) => {
        Utils.goscreen(this, item.goscreen, { item: item })
    }

    renderMenu = (item, index) => {
        return (
            <View key={index} style={{
                width: Width(100 / numcolumns), alignItems: 'center',
                justifyContent: 'center', marginTop: 10,
            }}>
                <TouchableOpacity
                    disabled={false}
                    activeOpacity={0.5}
                    style={[{
                        marginBottom: 0,
                        opacity: 1, alignItems: 'center', justifyContent: 'center',
                        height: Width(100 / numcolumns),
                    }]}
                    onPress={() => this.goScreen(item)}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={[colors.nocolor, colors.nocolor]}
                        style={[{ flex: 1, alignItems: 'center' }]}>
                        <View style={{ height: Width(100 / numcolumns / ratio), width: Width(100 / numcolumns), justifyContent: 'center', alignItems: 'center', borderRadius: Width(100 / numcolumns) }}>
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={item.linearColor}
                                style={{ height: Width(100 / numcolumns / ratio), width: Width(100 / numcolumns / ratio), justifyContent: 'center', alignItems: 'center', borderRadius: Width(100 / numcolumns) }}
                            >
                                <View style={[{ width: '50%', height: '60%' }]}>
                                    <ImageCus defaultSourceCus={Images[item.icon]} source={{ uri: Utils.isUrlCus(item.linkicon) ? item.linkicon : (appConfig.domain + item.linkicon) }}
                                        style={[{ width: '100%', height: '100%' }]} resizeMode='contain'
                                    />
                                </View>
                            </LinearGradient>
                        </View>
                        <View style={{ height: Width(100 / numcolumns / ratio), width: Width(100 / numcolumns), alignItems: 'center', }}>
                            <Text style={[
                                {
                                    fontSize: reText(100 / numcolumns / ratio / ratio), color: colors.black, fontWeight: Platform.OS == 'ios' ? '600' : 'bold',
                                    width: reSize(78), textAlign: 'center',
                                    marginTop: 5, width: '100%', flex: 1
                                }]}>
                                {item.name}
                            </Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </View >
        )
    }

    renderHeader = () => {
        const { DiemTiem = {} } = this.props.datahcm
        return (
            <View style={styles.header}>
                <Text style={styles.txtHeader}>{'Điểm tiêm hiện tại: '}{`${DiemTiem.DiaChi + ', ' + DiemTiem.PhuongXa + ', ' + DiemTiem.QuanHuyen + ', ' + DiemTiem.TinhThanh}`}</Text>
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <HeaderCus
                    onPressLeft={this.isSaveDiemTiem ? () => Utils.navigate('ManHinh_Home') : () => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`QUẢN LÍ TẠI ĐIỂM TIÊM`}
                    styleTitle={styles.titleHeader}
                />
                <View style={styles.container}>
                    <ScrollView style={{ marginTop: 10 }}>
                        <FlatList
                            ListHeaderComponent={this.renderHeader}
                            showsVerticalScrollIndicator={false}
                            // style={{ marginHorizontal: Platform.isPad ? 80 : 0, }}
                            numColumns={numcolumns}
                            data={SubMenu}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => this.renderMenu(item, index)}
                        />
                    </ScrollView>
                    <View style={styles.footer}>
                        <ButtonCom
                            onPress={() => {
                                this._goback(true)
                            }}
                            shadow={false}
                            txtStyle={{ color: colors.white }}
                            style={
                                {
                                    marginTop: Height(5), borderRadius: 5,
                                    alignSelf: 'center', paddingHorizontal: 20,
                                    width: Width(45),
                                }}
                            text={'Đổi địa điểm tiêm'}
                        />
                    </View>
                </View>
            </View>
        );
    }
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    topBar: {
        height: 5,
        width: 80,
        alignSelf: 'center',
        backgroundColor: colors.grayLight,
        borderRadius: 10,
        marginTop: 10
    },
    header: {
        padding: 10
    },
    txtHeader: {
        textAlign: 'justify',
        fontStyle: 'italic',
        color: '#ee0033',
        lineHeight: 20
    },
    footer: {
        backgroundColor: colors.white,
        paddingBottom: paddingBotX,
    },
    titleHeader: {
        color: colors.white, fontSize: reText(20)
    },
})


const SubMenu = [
    {
        "id": 1,
        "name": "Chek in\nđiểm tiêm",
        "goscreen": "Modal_QuetMaTiem",
        "icon": "menutiem_checkin",
        "code": "",
        "linkicon": "",
        "linkWeb": "",
        "linearColor": ["#F2F2F2", "#F2F2F2"],
        "prior": 1,
        "rule": -2,
        "isShow": 0,
        "KeyTiem": KeyTiem.CHECKIN
    },
    {
        "id": 2,
        "name": "Kết quả\nlâm sàng",
        "goscreen": "Modal_QuetMaTiem",
        "icon": "menutiem_kqlamsan",
        "code": "",
        "linkicon": "",
        "linkWeb": "",
        "linearColor": ["#F2F2F2", "#F2F2F2"],
        "prior": 1,
        "rule": -2,
        "isShow": 0,
        "KeyTiem": KeyTiem.KQLAMSAN
    },
    {
        "id": 3,
        "name": "Xác nhận\ntiêm chủng",
        "goscreen": "Modal_QuetMaTiem",
        "icon": "menutiem_xntiemchung",
        "code": "",
        "linkicon": "",
        "linkWeb": "",
        "linearColor": ["#F2F2F2", "#F2F2F2"],
        "prior": 1,
        "rule": -2,
        "isShow": 0,
        "KeyTiem": KeyTiem.XACNHANTIEMCHUNG
    },
    {
        "id": 4,
        "name": "Triệu chứng\nsau tiêm",
        "goscreen": "Modal_QuetMaTiem",
        "icon": "menutiem_trieuchung",
        "code": "",
        "linkicon": "",
        "linkWeb": "",
        "linearColor": ["#F2F2F2", "#F2F2F2"],
        "prior": 1,
        "rule": -2,
        "isShow": 0,
        "KeyTiem": KeyTiem.TRIEUCHUNG
    },
]

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,
    datahcm: state.datahcm
});
export default Utils.connectRedux(SubMenuTiem, mapStateToProps, true);
