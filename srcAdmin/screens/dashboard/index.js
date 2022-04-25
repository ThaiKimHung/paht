import React, { Component } from 'react'
import { BarChart, Grid } from 'react-native-svg-charts'
import BieuDoPATheoNam from './BieuDoPATheoNam'
import TinhHinhAnNinhTratTu from './TinhHinhAnNinhTratTu';
import { Text, View, StatusBar } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { HeaderCom } from '../../../components'
import { Images } from '../../images'
import { nstyles } from '../../../styles/styles'
import DanhGiaHaiLong from './DanhGiaHaiLong'
import DonViXuLyQuaHan from './DonViXuLyQuaHan'
import ThongKeTheoDonVi from './ThongKeTheoDonVi'
import ThongKeTongHop from './ThongKeTongHop'
import BieuDoXuLyQuaHan from './BieuDoXuLyQuaHan';
import BieuDoMucDoHaiLong from './BieuDoMucDoHaiLong';
import BieuDoCacDonVi from './BieuDoCacDonVi';
import Utils from '../../../app/Utils';
import { nGlobalKeys } from '../../../app/keys/globalKey';

class index extends Component {
    componentDidMount() {
        StatusBar.setHidden(false)
    }
    render() {
        return (
            <View style={nstyles.ncontainer}>
                <HeaderCom
                    nthis={this} titleText={'Dashboard'}
                    iconLeft={Images.icSlideMenu}
                    onPressLeft={() => this.props.navigation.openDrawer()}
                    iconRight={Images.icHome}
                    onPressRight={() => Utils.goscreen(this, 'ManHinh_Home')}
                />
                <ScrollView style={{ width: '100%', backgroundColor: 'white' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>

                    {/* <>
                            < ThongKeTongHop nthis={this} />
                            <View style={{ paddingVertical: 15 }}>
                                <TinhHinhAnNinhTratTu nthis={this} />
                            </View>
                            <View style={{ paddingVertical: 15 }}>
                                <BieuDoPATheoNam nthis={this} />
                            </View>
                            <View style={{ alignItems: 'center', paddingVertical: 15 }}>
                                <DanhGiaHaiLong nthis={this} />
                            </View>
                            <View style={{ alignItems: 'center', paddingVertical: 15 }}>
                                <ThongKeTheoDonVi nthis={this} />
                            </View>
                            <View style={{ paddingVertical: 15 }}>
                                <DonViXuLyQuaHan nthis={this} />
                            </View>
                        </> : */}
                    {/* Dashboard dành cho mới */}
                    <>
                        <View style={{ paddingVertical: 15 }}>
                            <TinhHinhAnNinhTratTu nthis={this} />
                        </View>
                        <View style={{ paddingVertical: 15 }}>
                            <BieuDoPATheoNam nthis={this} />
                        </View>
                        <View style={{ alignItems: 'center', paddingVertical: 15 }}>
                            <BieuDoMucDoHaiLong nthis={this} />
                        </View>
                        <View style={{ alignItems: 'center', paddingVertical: 15 }}>
                            <BieuDoCacDonVi nthis={this} />
                        </View>
                        <View style={{ paddingVertical: 15 }}>
                            <BieuDoXuLyQuaHan nthis={this} />
                        </View>
                    </>
                </ScrollView>
            </View >
        )
    }
}

const mapStateToProps = state => ({
    theme: state.theme
});

export default Utils.connectRedux(index, mapStateToProps, true)
