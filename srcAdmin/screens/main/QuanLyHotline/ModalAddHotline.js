// import React, { Component } from 'react'
// import { Text, View, Image, TextInput, TouchableOpacity, Animated } from 'react-native'
// import Utils from '../../../app/Utils'
// import { Images } from '../../../images'
// import { colors } from '../../../styles'
// import { reText } from '../../../styles/size'
// import { nstyles, nwidth } from '../../../styles/styles'
// import * as Animatable from 'react-native-animatable'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import { GetDetail_LienHe, Insert_LienHe, Delete_LienHe, Upload_LienHe } from '../../../apis/apiLienHe'

// export class ModalAddHotline extends Component {
//     constructor(props) {
//         super(props);
//         this.callback = Utils.ngetParam(this, 'callback', () => { });
//         this.IdLienHe = Utils.ngetParam(this, 'IdLienHe');
//         this.state = {
//             tieude: '',
//             phone: '',
//             prior: 0,
//             dataLienHe: [],
//             opacity: new Animated.Value(0),
//         }
//     }

//     componentDidMount() {
//         this._getChiTietLienHe();
//         this._startAnimation(0.4)
//     }

//     _startAnimation = (value) => {
//         setTimeout(() => {
//             Animated.timing(this.state.opacity, {
//                 toValue: value,
//                 duration: 300
//             }).start();
//         }, 350);
//     };

//     _getChiTietLienHe = async () => {
//         let res = await GetDetail_LienHe(this.IdLienHe);
//         if (res.status == 1 && res.data) {
//             Utils.nlog('Gia tri data lien he=====', res.data)
//             this.setState({
//                 dataLienHe: res.data,
//                 tieude: res.data.TieuDe,
//                 phone: res.data.NoiDung,
//                 prior: res.data.Prior
//             })
//         }
//     }
//     _goback = () => {
//         setTimeout(() => {
//             Animated.timing(this.state.opacity, {
//                 toValue: 0,
//                 duration: 250
//             }).start(() => {
//                 Utils.goback(this)
//             });
//         }, 100);
//     }

//     _addLienHe = async () => {
//         const { tieude, phone, prior } = this.state;
//         var warning = '';
//         if (!tieude)
//             warning += 'Ch??a c?? th??ng tin ti??u ?????!\n'
//         if (!phone)
//             warning += 'Ch??a c?? th??ng tin n???i dung!\n'
//         if (warning != '') {
//             Utils.showMsgBoxOK(this, "Th??ng b??o", warning)
//             return;
//         }
//         if (Utils.validateEmail(phone) || Utils.validatePhone(phone)) {
//             let res = await Upload_LienHe(tieude, phone, prior)
//             if (res.status == 1) {
//                 Utils.showMsgBoxOK(this, 'Th??ng b??o', 'Th??m th??nh c??ng', "X??c nh???n", () =>
//                     setTimeout(() => {
//                         Animated.timing(this.state.opacity, {
//                             toValue: 0,
//                             duration: 250
//                         }).start(() => {
//                             Utils.goback(this)
//                             this.callback()
//                         });
//                     }, 100))
//             } else {
//                 Utils.showMsgBoxOK(this, 'Th??ng b??o', 'Th??m th???t b???i')
//             }
//         } else {
//             Utils.showMsgBoxOK(this, "Th??ng b??o", 'Email ho???c s??? ??i???n kh??ng h???p l???!\nVui l??ng nh???p l???i')
//         }

//         // Utils.nlog('Gia tri ==', tieude, phone, prior)

//     }
//     _deleteLienHe = () => {
//         Utils.showMsgBoxYesNo(this, 'Th??ng b??o', 'B???n c?? ch???c mu???n xo?? hotline n??y kh??ng?', 'X??c nh???n', 'Hu???', async () => {
//             let res = await Delete_LienHe(this.IdLienHe)
//             if (res.status == 1) {
//                 Utils.showMsgBoxOK(this, 'Th??ng b??o', 'Xo?? th??nh c??ng', "X??c nh???n", () =>
//                     setTimeout(() => {
//                         Animated.timing(this.state.opacity, {
//                             toValue: 0,
//                             duration: 250
//                         }).start(() => {
//                             Utils.goback(this)
//                             this.callback()
//                         });
//                     }, 100))
//             } else {
//                 Utils.showMsgBoxOK(this, 'Th??ng b??o', 'Xo?? th???t b???i')
//             }
//         })
//     }
//     _updateLienHe = async () => {
//         const { tieude, phone, prior } = this.state;
//         if (Utils.validateEmail(phone) || Utils.validatePhone(phone)) {
//             let res = await Upload_LienHe(tieude, phone, prior, this.IdLienHe)
//             if (res.status == 1) {
//                 Utils.showMsgBoxOK(this, 'Th??ng b??o', 'C???p nh???t th??nh c??ng', "X??c nh???n", () =>
//                     setTimeout(() => {
//                         Animated.timing(this.state.opacity, {
//                             toValue: 0,
//                             duration: 250
//                         }).start(() => {
//                             Utils.goback(this)
//                             this.callback()
//                         });
//                     }, 100))
//             } else {
//                 Utils.showMsgBoxOK(this, 'Th??ng b??o', 'C???p nh???t th???t b???i')
//             }
//         } else {
//             Utils.showMsgBoxOK(this, "Th??ng b??o", 'Email ho???c s??? ??i???n kh??ng h???p l???!\nVui l??ng nh???p l???i')
//         }
//     }
//     render() {
//         const { opacity, phone, tieude, prior, dataLienHe } = this.state;
//         return (
//             <View
//                 style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'center', paddingHorizontal: 20, flex: 1, paddingVertical: 20 }]}>
//                 <Animated.View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'black', opacity }} />
//                 <Animatable.View animation={'zoomInDown'} style={{ backgroundColor: colors.white, borderRadius: 10, zIndex: 1, padding: 10 }}>
//                     <Text style={{ alignSelf: 'center', fontSize: reText(15), fontWeight: 'bold', color: colors.colorRedLeft, marginBottom: 20 }}>{this.IdLienHe ? `Chi ti???t hotline` : `Th??m hotline`}</Text>
//                     <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
//                         <Text style={{ fontSize: reText(14), marginBottom: 5 }}>{`Ti??u ?????`}</Text>
//                         <View style={{ backgroundColor: colors.black_11, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 4, marginBottom: 10 }}>
//                             <TextInput
//                                 placeholder={'Nh???p ti??u ?????'}
//                                 style={{ fontSize: reText(15), paddingVertical: 0 }}
//                                 value={dataLienHe ? tieude : ''}
//                                 onChangeText={(val) => this.setState({ tieude: val })}
//                             />
//                         </View>
//                         <Text style={{ fontSize: reText(14), marginBottom: 5 }}>{`N???i dung`}</Text>
//                         <View style={{ backgroundColor: colors.black_11, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 4, marginBottom: 10 }}>
//                             <TextInput
//                                 placeholder={'Nh???p n???i dung'}
//                                 style={{ fontSize: reText(15), paddingVertical: 0 }}
//                                 value={dataLienHe ? phone : ''}
//                                 onChangeText={(val) => this.setState({ phone: val })}
//                             />
//                         </View>
//                         <Text style={{ fontSize: reText(14), marginBottom: 5 }}>{`????? ??u ti??n`}</Text>
//                         <View style={{ backgroundColor: colors.black_11, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 4, marginBottom: 10 }}>
//                             <TextInput
//                                 placeholder={'Nh???p ????? ??u ti??n'}
//                                 style={{ fontSize: reText(15), paddingVertical: 0 }}
//                                 keyboardType='numeric'
//                                 value={dataLienHe ? prior.toString() : 0}
//                                 onChangeText={(val) => this.setState({ prior: val })}
//                             />
//                         </View>
//                         {
//                             this.IdLienHe ?
//                                 <View>
//                                     <Text style={{ fontSize: reText(14), marginBottom: 5 }}>{`Ng?????i ch???nh s???a`}</Text>
//                                     <View style={{ backgroundColor: colors.black_11, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 4, marginBottom: 10 }}>
//                                         <TextInput
//                                             editable={false}
//                                             style={{ fontSize: reText(15), color: dataLienHe?.CreatorUpdate ? colors.black : colors.black_20, paddingVertical: 0 }}
//                                             value={dataLienHe && dataLienHe.CreatorUpdate ? dataLienHe.CreatorUpdate : 'Ng?????i ch???nh s???a'}
//                                             onChangeText={(val) => this.setState({ prior: val })}
//                                         />
//                                     </View>
//                                     <Text style={{ fontSize: reText(14), marginBottom: 5 }}>{`Ng??y ch???nh s???a`}</Text>
//                                     <View style={{ backgroundColor: colors.black_11, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 4, marginBottom: 10 }}>
//                                         <TextInput
//                                             editable={false}
//                                             style={{ fontSize: reText(15), color: dataLienHe?.CreatedDateUpdate ? colors.black : colors.black_20, paddingVertical: 0 }}
//                                             value={dataLienHe && dataLienHe.CreatedDateUpdate ? dataLienHe.CreatedDateUpdate : 'Ng??y ch???nh s???a'}
//                                             onChangeText={(val) => this.setState({ prior: val })}
//                                         />
//                                     </View>
//                                 </View>
//                                 : null
//                         }
//                         <View style={{ flexDirection: 'row', justifyContent: 'space-around', }}>
//                             <TouchableOpacity onPress={() => this._goback()}
//                                 style={{ paddingVertical: 10, backgroundColor: colors.black_50, borderRadius: 5, paddingHorizontal: 22, marginTop: 15 }}>
//                                 <Text style={{ color: colors.white, fontWeight: 'bold' }}>Hu???</Text>
//                             </TouchableOpacity>
//                             {
//                                 this.IdLienHe ?
//                                     <>
//                                         <TouchableOpacity onPress={() => this._updateLienHe()}
//                                             style={{ paddingVertical: 10, backgroundColor: colors.peacockBlue, borderRadius: 5, paddingHorizontal: 22, marginTop: 15 }}>
//                                             <Text style={{ color: colors.white, fontWeight: 'bold' }}>S???a</Text>
//                                         </TouchableOpacity>
//                                         <TouchableOpacity onPress={() => this._deleteLienHe()}
//                                             style={{ paddingVertical: 10, backgroundColor: colors.peacockBlue, borderRadius: 5, paddingHorizontal: 22, marginTop: 15 }}>
//                                             <Text style={{ color: colors.white, fontWeight: 'bold' }}>Xo??</Text>
//                                         </TouchableOpacity>
//                                     </>
//                                     :
//                                     <TouchableOpacity onPress={() => this._addLienHe()}
//                                         style={{ paddingVertical: 10, backgroundColor: colors.peacockBlue, borderRadius: 5, paddingHorizontal: 22, marginTop: 15 }}>
//                                         <Text style={{ color: colors.white, fontWeight: 'bold' }}>X??c nh???n</Text>
//                                     </TouchableOpacity>
//                             }
//                         </View>
//                     </KeyboardAwareScrollView>

//                 </Animatable.View>
//             </View>
//         )
//     }
// }
// export default ModalAddHotline
import React, { Component } from 'react';
import { View, Text } from 'react-native';

class ModalAddHotline extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View>
                <Text> ModalAddHotline </Text>
            </View>
        );
    }
}

export default ModalAddHotline;

