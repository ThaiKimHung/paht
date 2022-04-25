import React, { Component } from 'react'
import { FlatList, Text, TouchableOpacity, View, Image, StyleSheet, ImageBackground, Platform, TextInput } from 'react-native'
import { appConfig } from '../../../app/Config'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import Utils from '../../../app/Utils'
import UtilsApp from '../../../app/UtilsApp'
import { HeaderCus, ListEmpty } from '../../../components'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { heightStatusBar, nstyles, paddingTopMul, Width } from '../../../styles/styles'
import { Images } from '../../images'



export class DLTM_Home extends Component {

    constructor(props) {
        super(props)
        this.ImgBGDuLich = Utils.getGlobal(nGlobalKeys.ImgBGDuLich, '')
        this.state = {
            lstDuLich: [],
            search: '',
            isSearch: false,
            refreshing: true,
            hasFocus: false,
        }
    }

    componentDidMount() {
        this.GetDanhSachDuLich()
    }

    GetDanhSachDuLich = async () => {
        this.setState({ refreshing: true })
        try {
            const response = await fetch('https://sonlacity.vietnaminfo.net/api/Place/GetByPageID?lang=vi&pageSize=10&pageId=1',
                {
                    method: 'GET',
                });
            const res = await response.json();
            this.setState({ lstDuLich: res.data, refreshing: false });
        } catch (error) {
            this.setState({ refreshing: false });
            console.log(error);
        }

    }

    _renderItem = ({ item, index }) => {
        const WidthThubm = Width(95);
        const HeightThubm = WidthThubm / 3;
        return (
            <TouchableOpacity
                key={index}
                style={{ marginBottom: 10, }}
                onPress={() => Utils.goscreen(this, 'scChiTietDuLichTM', { IdDuLich: item.DiaDiemDuLichID })}
            >
                <View style={[{ backgroundColor: colors.white, borderRadius: 15, flexDirection: 'row', alignItems: 'center', padding: 10, }]}>
                    <View style={{
                        elevation: 6,
                        shadowOffset: { width: 2, height: 5 },
                        shadowOpacity: 0.2,
                        shadowColor: colors.blueLightHign
                    }}>
                        <Image source={{ uri: item.AnhDaiDien }} style={[nstyles.nIcon65, { borderRadius: 6 }]} />
                    </View>
                    <View style={{ marginLeft: 10, }}>
                        <Text numberOfLines={2} style={{ fontWeight: 'bold', fontSize: reText(14), maxWidth: Width(60) }} >{item.TenDiaDiemDuLich}</Text>
                        <Text style={{ color: colors.colorGrayText, marginTop: 5, fontSize: reText(12) }}>{item.TenQuanHuyen}</Text>
                    </View>
                    <View style={{ position: 'absolute', top: 10, right: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <Text style={{ color: colors.colorGrayText, fontSize: reText(10), }} >{item.LuotXem} </Text>
                            <Image source={Images.icLuotXem} />
                        </View>
                        <View style={{ backgroundColor: '#00B4FE3a', padding: 5, borderRadius: 6, marginTop: 35, alignItems: 'center' }}>
                            <Image source={Images.icArrayNext} />
                        </View>
                    </View>
                </View>


            </TouchableOpacity>
        )
    }

    _Search = () => {
        const { search, lstDuLich } = this.state;
        if (search) {
            const result = lstDuLich.filter(item => Utils.removeAccents(item.TenDiaDiemDuLich)?.toUpperCase().includes(Utils.removeAccents(search.toUpperCase())))
            this.setState({ lstDuLich: result })
        } else {
            this._onRefresh()
        }
    }
    _clearText = () => {
        this.setState({ hasFocus: false });
        this.setState({ refreshing: true, search: '' }, this.GetDanhSachDuLich)
    }
    _onRefresh = () => {
        this.setState({ refreshing: true, search: '', isSearch: false }, this.GetDanhSachDuLich)
    }
    setFocus(hasFocus) {
        this.setState({ hasFocus });
    }

    render() {
        const { lstDuLich, isSearch, search, refreshing, hasFocus } = this.state
        Utils.nlog('Gia tra lstDuLich', lstDuLich)
        function isValidURL(url) {
            var RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

            if (RegExp.test(url)) {
                return true;
            } else {
                return false;
            }
        }
        Utils.nlog('Gia tra lstDuLich', isValidURL(this.ImgBGDuLich))

        return (
            <ImageBackground source={isValidURL(this.ImgBGDuLich) ? { uri: this.ImgBGDuLich } : Images.imgBGDuLich} style={{ flex: 1, }}>
                {/* <View style={[nstyles.ncontainer, {}]}> */}
                {/* <HeaderCus

                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
                    iconLeft={Images.icBack}
                    title={UtilsApp.getScreenTitle("Modal_DuLichThongMinh", 'Du lịch thông minh')}
                    styleTitle={{ color: colors.white }}
                /> */}
                <View style={{
                    paddingTop: Platform.OS == 'android' ? paddingTopMul() + heightStatusBar() : paddingTopMul(),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                }}>
                    <TouchableOpacity onPress={() => Utils.goback()} >
                        <Image source={Images.icArrowBack} />
                    </TouchableOpacity>
                    {
                        isSearch ?
                            <View style={[{
                                flexDirection: 'row',
                                borderRadius: 6,
                                backgroundColor: 'rgba(0,0,0,0.05)',
                                padding: 10,
                                marginHorizontal: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: colors.white,
                                width: Width(85)

                            }]}>
                                <Image source={Images.icSearch} style={[{}]} resizeMode='contain' />
                                <TextInput
                                    style={[{ paddingVertical: 0, flex: 1, marginLeft: 5 }]}
                                    autoFocus={true}
                                    returnKeyType='search'
                                    underlineColorAndroid='transparent'
                                    placeholder={`Địa điểm tìm kiếm ...`}
                                    value={search}
                                    onChangeText={text => this.setState({ search: text })}
                                    onSubmitEditing={this._Search}
                                    onFocus={() => this.setFocus(true)}
                                />
                                {
                                    search ? <TouchableOpacity onPress={this._clearText}>
                                        <Image source={Images.icClose} style={[nstyles.nIcon16, { tintColor: 'gray' }]} resizeMode='contain' />
                                    </TouchableOpacity> : null}
                            </View>
                            :
                            <Text style={{ marginHorizontal: Width(22), fontWeight: 'bold', fontSize: reText(18) }} >{`Du lịch thông minh`}</Text>
                    }
                    {
                        isSearch ? null : <TouchableOpacity onPress={() => this.setState({ isSearch: !isSearch })} style={{ backgroundColor: colors.colorWhite_03, padding: 5, borderRadius: 6 }}>
                            <Image source={Images.icSearch} />
                        </TouchableOpacity>
                    }

                </View>

                <View style={[nstyles.nbody, { marginHorizontal: 15 }]}>
                    <FlatList
                        onRefresh={this._onRefresh}
                        refreshing={refreshing}
                        showsVerticalScrollIndicator={false}
                        style={{ marginVertical: 20 }}
                        data={lstDuLich}
                        renderItem={this._renderItem}
                        ListEmptyComponent={<ListEmpty />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                {/* </View> */}
            </ImageBackground>

        )
    }
}

export default DLTM_Home

const stDLTM_Home = StyleSheet.create({
    text: { fontSize: reText(12), color: colors.colorGrayText }
})