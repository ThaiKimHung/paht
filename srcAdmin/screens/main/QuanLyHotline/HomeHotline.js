// import React, { Component } from 'react'
// import { Platform } from 'react-native'
// import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native'
// import { GetList_LienHe } from '../../../apis/apiLienHe'
// import Utils from '../../../app/Utils'
// import { HeaderCom, ListEmpty } from '../../../components'
// import { Images } from '../../../images'
// import { colors } from '../../../styles'
// import { reText } from '../../../styles/size'
// import { nstyles, nwidth } from '../../../styles/styles'
// const widthColumn = (nwidth() - 10) / 3
// export class HomeHotline extends Component {
//     constructor(props) {
//         super(props)

//         this.state = {
//             keyword: '',
//             sodienthoai: [],
//             refreshing: true,
//             textempty: ''
//         }
//     }
//     componentDidMount() {
//         this.GetList_LienHe()
//     }
//     GetList_LienHe = async () => {
//         let res = await GetList_LienHe(this.state.keyword)
//         Utils.nlog("GetList_LienHe:", res);
//         if (res.status == 1) {
//             this.setState({ sodienthoai: res.data, refreshing: false })
//         }
//     }
//     _openMenu = () => {
//         this.props.navigation.openDrawer();
//     }
//     _onChange = (vals) => {
//         this.setState({ keyword: vals }, this.GetList_LienHe)
//     }
//     _onpenAddHotline = () => {
//         Utils.goscreen(this, 'Modal_AddHotlineDH', { callback: this._callback })
//     }
//     _onChiTiet = (vals) => {
//         Utils.goscreen(this, 'Modal_AddHotlineDH', { IdLienHe: vals, isChiTiet: true, callback: this._callback })
//     }
//     _callback = () => {
//         this._onRefresh()
//     }
//     _keyExtrac = (item, index) => index.toString();
//     _onRefresh = () => {
//         this.setState({ refreshing: true, textempty: 'Đang tải...', }, this.GetList_LienHe);
//     }
//     _renderItem = ({ item, index }) => {
//         const { sodienthoai } = this.state;
//         return (
//             <TouchableOpacity onPress={() => this._onChiTiet(item.Id)} key={index} style={{ flexDirection: 'row', }}>
//                 <View style={{ width: widthColumn + widthColumn / 2, borderWidth: 0.5, borderBottomWidth: index == sodienthoai.length - 1 ? 0.5 : 0 }}>
//                     <Text style={styles.title}>{item.TieuDe}</Text>
//                 </View>
//                 <View style={{ width: widthColumn, borderWidth: 0.5, borderBottomWidth: index == sodienthoai.length - 1 ? 0.5 : 0 }}>
//                     <Text style={styles.title}>{item.NoiDung} </Text>
//                 </View>
//                 <View style={{ width: widthColumn - widthColumn / 2, borderWidth: 0.5, borderBottomWidth: index == sodienthoai.length - 1 ? 0.5 : 0 }}>
//                     <Text style={styles.title}>{item.Prior}</Text>
//                 </View>
//             </TouchableOpacity>
//         )
//     }
//     render() {
//         const { sodienthoai, keyword, refreshing } = this.state;
//         return (
//             <View style={nstyles.ncontainer}>
//                 <HeaderCom
//                     titleText='Danh sách hotline'
//                     iconLeft={Images.icSlideMenu}
//                     nthis={this}
//                     onPressLeft={this._openMenu}
//                     iconRight={Images.icPlus}
//                     customStyleIconRight={{ tintColor: colors.white }}
//                     onPressRight={this._onpenAddHotline}
//                 />
//                 <View style={[nstyles.nbody, { marginTop: 10 }]}>
//                     <View style={{ marginHorizontal: 5, marginBottom: 10, backgroundColor: colors.white, paddingVertical: 10 }}>
//                         <TextInput
//                             placeholder={`Tìm kiếm theo tiêu đề, nội dung`}
//                             style={{ paddingHorizontal: 10, paddingVertical: 0 }}
//                             value={keyword}
//                             onChangeText={text => this._onChange(text)}
//                         />
//                     </View>
//                     <View style={{ flexDirection: 'row', marginLeft: 5, borderBottomWidth: 0.5, width: nwidth() - 10 }}>
//                         <View style={{ width: widthColumn + widthColumn / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
//                             <Text style={[styles.title, { fontWeight: 'bold' }]}>{`Tiêu đề`}</Text>
//                         </View>
//                         <View style={{ width: widthColumn, borderWidth: 0.5, borderBottomWidth: 0 }}>
//                             <Text style={[styles.title, { fontWeight: 'bold' }]}>{`Nội dung`}</Text>
//                         </View>

//                         <View style={{ width: widthColumn - widthColumn / 2, borderWidth: 0.5, borderBottomWidth: 0 }}>
//                             <Text style={[styles.title, { fontWeight: 'bold' }]}>{`Độ ưu tiên`}</Text>
//                         </View>
//                     </View>
//                     <FlatList
//                         data={sodienthoai}
//                         style={{ paddingHorizontal: 5 }}
//                         renderItem={this._renderItem}
//                         keyExtractor={this._keyExtrac}
//                         refreshing={refreshing}
//                         ListEmptyComponent={<ListEmpty textempty={this.state.textempty} />}
//                         onRefresh={this._onRefresh}
//                     />
//                 </View>
//             </View>
//         )
//     }
// }
// const styles = StyleSheet.create({
//     title: {
//         fontSize: reText(12),
//         textAlign: 'center',
//         padding: 10
//     }
// })
// export default HomeHotline
import React, { Component } from 'react';
import { View, Text } from 'react-native';

class HomeHotline extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View>
                <Text> HomeHotline </Text>
            </View>
        );
    }
}

export default HomeHotline;

