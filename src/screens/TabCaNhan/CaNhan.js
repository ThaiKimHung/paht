import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    BackHandler
} from 'react-native';
import { nstyles, colors, sizes } from '../../../styles';
import { Images } from '../../images';
import styles from '../Home/styles';
import DaGui from './DaGui'
import BanNhap from './BanNhap'
import Utils from '../../../app/Utils';
import { Header } from '../../../components';
import { ROOTGlobal } from '../../../app/data/dataGlobal';
import { reText } from '../../../styles/size';
import moment from 'moment'
import LinearGradient from 'react-native-linear-gradient';
class CaNhan extends Component {
    constructor(props) {
        super(props);
        nthisCaNhan = this;
        this.state = {
            tabBarToggle: true,
            data: [],
            textempty: 'Bạn chưa có phản ánh nào đã gửi đi',
            isUpdateList: false,
            objectFilter: {
                tungay: '',
                denngay: '',
                linhvuc: '',
                chuyenmuc: '',
                filterItem: {
                    key: '',
                    value: '',
                    title: 'Tất cả',
                    icon: Images.icTieuBieu
                }
            },
            objectKey: {
                filterkey: ``,
                filtervalue: ``,
            }
        }

        this.refDaGui = React.createRef(null);

    };
    componentDidMount() {
        ROOTGlobal.dataGlobal._tabbarChange = (value) => this._tabbarChange(value);
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goscreen(this, 'ManHinh_Home')
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    backAction = () => {
        Utils.goscreen(this, 'ManHinh_Home');
        return true
    }

    componentWillUnmount = async () => {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }


    _tabbarChange = (value) => {
        this.setState({ tabBarToggle: value });
    }

    _notifycation = () => {
        Utils.goscreen(this, "tab_Notificafion");
    }

    callBackFilter = (val) => {
        let { tungay,
            denngay,
            linhvuc,
            chuyenmuc,
            filterItem, } = val
        let objectKey = {
            filterkey: `LinhVuc|ChuyenMuc|tungay|denngay|${val.filterItem.key}`,
            filtervalue: `${val.linhvuc ? val.linhvuc.IdLinhVuc : ''}|${val.chuyenmuc ? val.chuyenmuc.IdChuyenMuc : ''}|${val.tungay ? moment(val.tungay, 'DD/MM/YYYY').format('DD-MM-YYYY') : ''}|${val.denngay ? moment(val.denngay, 'DD/MM/YYYY').format('DD-MM-YYYY') : ''}|${val.filterItem.value}`,
        }

        this.setState({
            objectKey: objectKey, objectFilter: val
        }, this.refDaGui.current._onRefresh)

    }
    render() {
        const { nrow, nmiddle } = nstyles.nstyles;
        const { tabBarToggle, isUpdateList } = this.state;
        return (
            <View style={[nstyles.nstyles.ncontainer, { backgroundColor: colors.BackgroundHome }]}>
                <Header
                    isLeft={true}
                    // shadown={false}
                    onPressNoti={this._notifycation}
                    nthis={this}
                />
                <View style={[{ flexDirection: 'row', marginTop: 10, marginHorizontal: 15, marginBottom: 15, borderRadius: 5, }]}>
                    {/* <View style={[nrow, { justifyContent: 'space-between', paddingVertical: 10 }]}> */}
                    <TouchableOpacity
                        onPress={() => this._tabbarChange(true)}
                        style={[nrow, {
                            justifyContent: 'center', alignItems: 'center', paddingVertical: 5,
                            flex: 1, backgroundColor: tabBarToggle ? this.props.theme.colorLinear.color[0] + '0D' : colors.white, borderTopLeftRadius: 5, borderBottomLeftRadius: 5,
                        }]}>
                        <Image source={Images.icDaGui} style={[nstyles.nstyles.nIcon30, { tintColor: tabBarToggle ? this.props.theme.colorLinear.color[0] : 'gray' }]} resizeMode='center' />
                        <Text style={[styles.text14, { marginLeft: 10, color: tabBarToggle ? this.props.theme.colorLinear.color[0] : 'gray' }]}>Đã gửi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this._tabbarChange(false)}
                        style={[nrow, {
                            justifyContent: 'center', alignItems: 'center', paddingVertical: 5, borderTopRightRadius: 5, borderBottomRightRadius: 5,
                            flex: 1, backgroundColor: tabBarToggle ? colors.white : this.props.theme.colorLinear.color[0] + '0D'
                        }]}>
                        <Image source={Images.icBanNhap} style={[nstyles.nstyles.nIcon30, { tintColor: tabBarToggle ? 'gray' : this.props.theme.colorLinear.color[0] }]} resizeMode='center' />
                        <Text style={[styles.text14, { marginLeft: 10, color: tabBarToggle ? 'gray' : this.props.theme.colorLinear.color[0] }]}>Bản nháp</Text>
                    </TouchableOpacity>
                    {/* </View> */}
                </View>
                {tabBarToggle ?
                    <DaGui nthis={this} ref={this.refDaGui} objectfilter={this.state.objectKey} /> :
                    <BanNhap nthis={this} />}
                {
                    tabBarToggle ? <TouchableOpacity
                        onPress={() => {
                            Utils.goscreen(this, "Modal_FilterSetup", {
                                objectFilter: this.state.objectFilter,
                                callback: this.callBackFilter
                            })
                        }}
                        style={{
                            position: 'absolute', top: 200,
                            right: 0, backgroundColor: 'red',
                            zIndex: 100, height: 50,
                            borderTopLeftRadius: 30,
                            borderBottomLeftRadius: 30,
                            alignItems: 'center', justifyContent: 'center',
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 0,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={this.props.theme.colorLinear.color}
                            style={{
                                height: 50,
                                borderTopLeftRadius: 30,
                                borderBottomLeftRadius: 30,
                                alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 0,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}
                        >
                            <Text style={{ fontWeight: 'bold', fontSize: reText(16), color: colors.white }}>{'Bộ lọc'}</Text>
                        </LinearGradient>
                    </TouchableOpacity> : null
                }

            </View>
        );
    }
}

const mapStateToProps = state => ({
    theme: state.theme
});
export default Utils.connectRedux(CaNhan, mapStateToProps, true)