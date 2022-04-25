import React, { Component, useState } from 'react';
import {
    Image, View, StyleSheet, Text, TouchableOpacity
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import apis from '../../apis';
import { Images } from '../../images';
// import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
import { appConfig } from '../../../app/Config';
import Utils from '../../../app/Utils';


const stSlogan = StyleSheet.create({

    txtH1: {
        fontSize: reText(18),
        color: colors.white,
        fontWeight: 'bold'
    }
});


const ItemSlogan = ({ item, index, nthis }) => {
    const [isLoading, setisLoading] = useState(true)
    let icon = item.ListFile.find(e => e.Type == 1)
    return (
        <TouchableOpacity
            onPress={() => {
                Utils.goscreen(nthis, "Modal_ChiTietCanhBao", {
                    item: item.Id,
                    data: item,
                    tuongtac: item.TuongTac,
                    TenCM: item.TenChuyenMuc
                })
            }}
            activeOpacity={0.95} style={{
                width: '100%', justifyContent: 'center',
                height: Height(20), alignItems: 'center',
                shadowColor: colors.blue,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.7,
                shadowRadius: 2,
                elevation: 3, marginBottom: 1
                // ...styles.shadown_nobgr

            }}>
            <View style={{
                width: Width(90), height: '100%', borderRadius: 10,
                backgroundColor: colors.black_50, borderWidth: 1, borderColor: colors.white
            }}>
                <Image source={item.Avatar ? { uri: appConfig.domain + item.Avatar.Path } : icon ? { uri: appConfig.domain + icon.Path } : Images.iconApp}
                    onLoadEnd={e => setisLoading(false)}
                    style={{ width: '100%', height: '100%', borderRadius: 10, }} resizeMode='cover' />
                {/* {
                    isLoading ? <View style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0
                    }}>
                        <SkeletonPlaceholder style={{ flex: 1, width: '100%', height: '100%' }}
                            speed={500}
                            backgroundColor={colors.white} highlightColor={colors.colorPowderBlue}>
                            <View style={{ width: '100%', height: '100%', borderRadius: 10, }} />
                        </SkeletonPlaceholder>
                    </View> : null
                } */}
                <View style={{
                    justifyContent: 'center', paddingHorizontal: 10, backgroundColor: colors.black_50, width: '100%', minHeight: 40,
                    color: colors.white, position: 'absolute', bottom: 0, right: 0, paddingVertical: 8, borderBottomRightRadius: 8, borderBottomLeftRadius: 8
                }}>
                    <Text numberOfLines={2}
                        style={[stSlogan.txtH1, {
                            textAlign: 'center', color: colors.white, fontSize: reText(14), width: '100%', fontWeight: 'normal'
                        }]}>
                        {item.TieuDe}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}




export default class Slogan extends Component {
    constructor(props) {
        super(props);
        // this.dataSlogan = props.dataSlogan;
        this.state = {
            dataTinTuc: [],
            isLoading: true
        };
    }

    componentDidMount = async () => {
        this._getListCanhBao();
    }

    _getListCanhBao = async () => {
        const res = await apis.ApiCanhBao.GetList_CanhBaoApp(false, 1, 10, -1);
        if (res.status == 1 && res.data) {
            console.log('XXXXX:', res)
            this.setState({ dataTinTuc: res.data, isLoading: false })
        } else {
            this.setState({ isLoading: false, dataTinTuc: [] })
        }
    }

    _renderItemText = ({ item, index }) => {
        return (
            <View style={{ width: '100%', justifyContent: 'center', minHeight: (reText(this.dataSlogan.sizeText + 4) * 2) }}>
                <Text style={[stSlogan.txtH1, nstyles.shadown_nobgr, {
                    textAlign: 'center', width: '100%', paddingHorizontal: Width(8),
                    color: this.dataSlogan.colorText, fontSize: reText(this.dataSlogan.sizeText)
                }]}>
                    {item}
                </Text>
            </View>

        );
    }

    _renderItemTinTuc = ({ item, index }) => {
        return (<ItemSlogan key={index} nthis={this} item={item} index={index} />
        );
    }

    render() {
        const { dataTinTuc, isLoading } = this.state;
        let dataDS = [];
        let timer = 4000;
        if (this.dataSlogan && this.dataSlogan.data && this.dataSlogan.data.length != 0 && dataTinTuc.length == 0) {
            timer = this.dataSlogan.timer;
            dataDS = this.dataSlogan.data;
        }
        if (dataTinTuc.length != 0)
            dataDS = dataTinTuc;
        if (dataDS.length != 0)
            return (
                <View style={{
                    alignSelf: 'center', width: '100%', paddingVertical: 6
                }}>
                    <Carousel
                        ref={(c) => { this._carousel = c; }}
                        data={dataDS}
                        renderItem={dataTinTuc.length != 0 ? this._renderItemTinTuc : this._renderItemText}
                        sliderWidth={Width(100)}
                        itemWidth={Width(100)}
                        loop={true}
                        autoplay={true}
                        // autoplayDelay={1000}
                        autoplayInterval={timer}
                    />
                </View>

            );
        return null;
    }
}