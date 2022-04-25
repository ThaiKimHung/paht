import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity } from 'react-native'
import apis from '../../../apis'
import { appConfig } from '../../../../app/Config'
import Utils from '../../../../app/Utils'
import { colors } from '../../../../styles'
import { linhvuc_color } from '../../../../styles/color'
import { reText } from '../../../../styles/size'
import ItemDanhSach from './ItemDanhSach'
import ItemDanhSach_Sub from './ItemDanhSach_Sub'
import { nGlobalKeys } from '../../../../app/keys/globalKey'
import { isLandscape, Width } from '../../../../styles/styles'


export class ItemGroupLinhVuc extends Component {
    constructor(props) {
        super(props)
        this.IdSource = Utils.getGlobal(nGlobalKeys.IdSource, '')
        this.state = {
            pageCurent: this.props.item.page ? this.props.item.page.Page : null,
            SumPage: this.props.item.page ? this.props.item.page.AllPage : null,
            DataLinhVuc: this.props.item.DataList ? this.props.item.DataList : [],
            loadmore: false,
            Key: this.props.item.filterKey ? this.props.item.filterKey : '',
            Val: this.props.item.filterVal ? this.props.item.filterVal : ''
        }
    }

    _renderItem = (item, index) => {
        const { SumPage, pageCurent, DataLinhVuc } = this.state
        if (index == 0) {
            return null
        }
        var {
            ListHinhAnh = [],
            IdPA,
            SoLuongTuongTac = 0,
            ChuyenMuc
        } = item;
        var arrImg = []; var arrLinkFile = [];
        ListHinhAnh.forEach(item => {
            const url = item.Path;
            let checkImage = Utils.checkIsImage(item.Path);
            // Utils.nlog("gia tri temp", temp)
            if (checkImage) {
                arrImg.push({
                    url: appConfig.domain + url
                })
            } else {
                arrLinkFile.push({ url: url, name: item.TenFile })
            }

        });

        return (
            <View key={index}>
                {index == 1 ? null :
                    <View style={{ height: 2, backgroundColor: colors.white, paddingHorizontal: 10 }} >
                        <View style={{ height: 2, backgroundColor: colors.BackgroundHome }} />
                    </View>
                }
                <ItemDanhSach_Sub
                    styleItemSub={[index == 1 ? { borderTopLeftRadius: 10, borderTopRightRadius: 10 } : null, pageCurent >= SumPage && index == this.state.DataLinhVuc.length - 1 ? { borderBottomLeftRadius: 10, borderBottomRightRadius: 10 } : null]}
                    colorLinhVuc={this.IdSource == 'CA' ? this.props.item.Color : colors.colorBlueLight}
                    nthis={this.props.nthis}
                    numberComent={SoLuongTuongTac}
                    dataItem={item}
                    // type={arrImg.length > 0 ? 1 : 2}
                    goscreen={() => Utils.goscreen(this.props.nthis, 'Modal_ChiTietPhanAnh', { IdPA: IdPA, TenChuyenMuc: ChuyenMuc, SoLuongTuongTac: SoLuongTuongTac })}
                    showImages={() => this.props.nthis._showAllImages(arrImg, 0)} />
            </View >
        )
    }
    _renderItem_First = (item, index) => {
        var {
            ListHinhAnh = [],
            IdPA,
            SoLuongTuongTac = 0,
            ChuyenMuc
        } = item;
        var arrImg = []; var arrLinkFile = [];
        ListHinhAnh.forEach(item => {
            const url = item.Path;
            let checkImage = Utils.checkIsImage(item.Path);
            if (checkImage) {
                arrImg.push({
                    url: appConfig.domain + url
                })
            } else {
                arrLinkFile.push({ url: url, name: item.TenFile })
            }

        });

        return (
            <ItemDanhSach
                styleContent={{ borderTopLeftRadius: 0 }}
                key={index}
                colorLinhVuc={this.IdSource == 'CA' ? this.props.item.Color : 'black'}
                nthis={this.props.nthis}
                numberComent={SoLuongTuongTac}
                dataItem={item}
                // type={arrImg.length > 0 ? 1 : 2}
                goscreen={() => Utils.goscreen(this.props.nthis, 'Modal_ChiTietPhanAnh', { IdPA: IdPA, TenChuyenMuc: ChuyenMuc, SoLuongTuongTac: SoLuongTuongTac })}
                showImages={() => this.props.nthis._showAllImages(arrImg, 0)} />
        )
    }

    _onLoadMore = async () => {
        const { pageCurent, SumPage, Key, Val } = this.state
        const pageNext = pageCurent + 1
        if (pageCurent < SumPage) {
            const res = await apis.ApiPhanAnh.GetDanhSachPAFilter(false, pageNext, 3, Key, Val);
            if (res.status == 1) {
                const temp = [...this.state.DataLinhVuc, ...res.data]
                this.setState({ DataLinhVuc: temp, pageCurent: pageNext })
            }
        }
    }

    render() {
        const { SumPage, pageCurent, DataLinhVuc } = this.state;
        let ColorLV = colors.colorBlueLight;
        if (this.IdSource == 'CA') {
            ColorLV = !linhvuc_color[this.props.item.Color] ? linhvuc_color[7].color : linhvuc_color[this.props.item.Color].color;
        }
        return (
            <View style={{ borderRadius: 10, paddingHorizontal: isLandscape() ? Width(15) : 0 }}>
                {DataLinhVuc.length > 0 ?
                    <View style={{
                        alignSelf: 'flex-start', padding: 5, paddingHorizontal: 10, marginTop: 10,
                        borderTopLeftRadius: 6, borderTopRightRadius: 6, borderBottomWidth: 1,
                        borderColor: colors.colorGrayBgr, backgroundColor: colors.white
                    }}>
                        <Text allowFontScaling={false} style={{
                            fontSize: reText(14), fontWeight: 'bold', color: ColorLV
                        }}>{`${this.props.item.LinhVuc}`}</Text>
                    </View> : null
                }
                {DataLinhVuc ?
                    <View style={{ borderRadius: 10 }}>
                        <FlatList
                            getItemLayout={(data, index) => (
                                { length: 0, offset: 0, index }
                            )}
                            scrollEnabled={false}
                            extraData={this.state}
                            data={DataLinhVuc}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                if (index == 0) {
                                    return this._renderItem_First(item, index)
                                } else {
                                    return this._renderItem(item, index)
                                }
                            }}
                        />
                        {
                            SumPage != null && pageCurent != null && pageCurent < SumPage ?
                                <View style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10, alignItems: 'center', backgroundColor: colors.white }}>
                                    <TouchableOpacity onPress={this._onLoadMore} style={{ backgroundColor: colors.white, padding: 10 }} activeOpacity={0.5}>
                                        <Text allowFontScaling={false} style={{ fontSize: reText(12), color: colors.redStar, opacity: 0.5 }}>{'Xem thêm>>'}</Text>
                                    </TouchableOpacity>
                                </View>
                                : null
                        }
                    </View>
                    :
                    null}
            </View>
        )
    }
}

export default ItemGroupLinhVuc
