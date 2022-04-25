import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, FlatList, BackHandler } from 'react-native'
import { nstyles, paddingTopMul } from '../../../styles/styles';
import { colors } from '../../../styles';
import { Images } from '../../images';
import { reText } from '../../../styles/size';
import Utils from '../../../app/Utils';
import apis from '../../apis';
import { HeaderCus, IsLoading, IsLoadingNew } from '../../../components';

export class DanhSachLinhVuc_DV extends Component {
    constructor(props) {
        super(props);
        this.DonViID = Utils.ngetParam(this, 'DonViID');
        this.Title = Utils.ngetParam(this, 'Title');
        this.state = {
            dataLinhVuc: [],
        }
    }
    componentDidMount() {
        this.LoadCBoLinhVuc()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goback(this)
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    LoadCBoLinhVuc = async () => {
        nthisIsLoading.show();
        const res = await apis.ApiDVC.LoadCBoLinhVuc(this.DonViID);
        if (res.status == 1) {
            nthisIsLoading.hide();
            this.setState({
                dataLinhVuc: res.data.data.DemThuTucHanhChinh_Lst_Result
            })
        }
        else {
            nthisIsLoading.hide();
        }
    }

    _renderDSLinhVuc = ({ item, index }) => {
        return (
            <TouchableOpacity key={index}
                onPress={() => Utils.goscreen(this, 'dsthutuc', {
                    DonViID: this.DonViID,
                    LinhVucID: item.LinhVucID,
                    TenLinhVuc: item.TenLinhVuc
                })}
                style={{
                    flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: colors.white, marginBottom: 5,
                    marginHorizontal: 15, borderRadius: 5,
                }}>
                <Image source={Images.icDichVC} style={[nstyles.nAva40, {}]} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignSelf: 'center' }}>
                    <Text style={{ marginLeft: 10, fontSize: reText(14), flex: 10 }} >{item.TenLinhVuc}</Text>
                    <Image source={Images.icBack} style={[nstyles.nIcon14, { tintColor: this.props.theme.colorLinear.color[0], alignSelf: 'center', transform: [{ rotate: "180deg" }] }]} resizeMode='contain' />
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        const { dataLinhVuc } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={this.Title ? this.Title : ''}
                    styleTitle={{ color: colors.white }}
                />
                <View style={{ backgroundColor: colors.BackgroundHome, flex: 1 }}>
                    <FlatList
                        style={{ marginVertical: 10 }}
                        data={dataLinhVuc}
                        renderItem={this._renderDSLinhVuc}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                {/* <IsLoadingNew /> */}
                <IsLoading/>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    theme: state.theme
});

export default Utils.connectRedux(DanhSachLinhVuc_DV, mapStateToProps, true) 
