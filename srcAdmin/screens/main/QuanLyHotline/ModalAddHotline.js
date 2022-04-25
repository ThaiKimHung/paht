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
//             warning += 'Chưa có thông tin tiêu đề!\n'
//         if (!phone)
//             warning += 'Chưa có thông tin nội dung!\n'
//         if (warning != '') {
//             Utils.showMsgBoxOK(this, "Thông báo", warning)
//             return;
//         }
//         if (Utils.validateEmail(phone) || Utils.validatePhone(phone)) {
//             let res = await Upload_LienHe(tieude, phone, prior)
//             if (res.status == 1) {
//                 Utils.showMsgBoxOK(this, 'Thông báo', 'Thêm thành công', "Xác nhận", () =>
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
//                 Utils.showMsgBoxOK(this, 'Thông báo', 'Thêm thất bại')
//             }
//         } else {
//             Utils.showMsgBoxOK(this, "Thông báo", 'Email hoặc số điện không hợp lệ!\nVui lòng nhập lại')
//         }

//         // Utils.nlog('Gia tri ==', tieude, phone, prior)

//     }
//     _deleteLienHe = () => {
//         Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn xoá hotline này không?', 'Xác nhận', 'Huỷ', async () => {
//             let res = await Delete_LienHe(this.IdLienHe)
//             if (res.status == 1) {
//                 Utils.showMsgBoxOK(this, 'Thông báo', 'Xoá thành công', "Xác nhận", () =>
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
//                 Utils.showMsgBoxOK(this, 'Thông báo', 'Xoá thất bại')
//             }
//         })
//     }
//     _updateLienHe = async () => {
//         const { tieude, phone, prior } = this.state;
//         if (Utils.validateEmail(phone) || Utils.validatePhone(phone)) {
//             let res = await Upload_LienHe(tieude, phone, prior, this.IdLienHe)
//             if (res.status == 1) {
//                 Utils.showMsgBoxOK(this, 'Thông báo', 'Cập nhật thành công', "Xác nhận", () =>
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
//                 Utils.showMsgBoxOK(this, 'Thông báo', 'Cập nhật thất bại')
//             }
//         } else {
//             Utils.showMsgBoxOK(this, "Thông báo", 'Email hoặc số điện không hợp lệ!\nVui lòng nhập lại')
//         }
//     }
//     render() {
//         const { opacity, phone, tieude, prior, dataLienHe } = this.state;
//         return (
//             <View
//                 style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'center', paddingHorizontal: 20, flex: 1, paddingVertical: 20 }]}>
//                 <Animated.View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'black', opacity }} />
//                 <Animatable.View animation={'zoomInDown'} style={{ backgroundColor: colors.white, borderRadius: 10, zIndex: 1, padding: 10 }}>
//                     <Text style={{ alignSelf: 'center', fontSize: reText(15), fontWeight: 'bold', color: colors.colorRedLeft, marginBottom: 20 }}>{this.IdLienHe ? `Chi tiết hotline` : `Thêm hotline`}</Text>
//                     <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
//                         <Text style={{ fontSize: reText(14), marginBottom: 5 }}>{`Tiêu đề`}</Text>
//                         <View style={{ backgroundColor: colors.black_11, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 4, marginBottom: 10 }}>
//                             <TextInput
//                                 placeholder={'Nhập tiêu đề'}
//                                 style={{ fontSize: reText(15), paddingVertical: 0 }}
//                                 value={dataLienHe ? tieude : ''}
//                                 onChangeText={(val) => this.setState({ tieude: val })}
//                             />
//                         </View>
//                         <Text style={{ fontSize: reText(14), marginBottom: 5 }}>{`Nội dung`}</Text>
//                         <View style={{ backgroundColor: colors.black_11, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 4, marginBottom: 10 }}>
//                             <TextInput
//                                 placeholder={'Nhập nội dung'}
//                                 style={{ fontSize: reText(15), paddingVertical: 0 }}
//                                 value={dataLienHe ? phone : ''}
//                                 onChangeText={(val) => this.setState({ phone: val })}
//                             />
//                         </View>
//                         <Text style={{ fontSize: reText(14), marginBottom: 5 }}>{`Độ ưu tiên`}</Text>
//                         <View style={{ backgroundColor: colors.black_11, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 4, marginBottom: 10 }}>
//                             <TextInput
//                                 placeholder={'Nhập độ ưu tiên'}
//                                 style={{ fontSize: reText(15), paddingVertical: 0 }}
//                                 keyboardType='numeric'
//                                 value={dataLienHe ? prior.toString() : 0}
//                                 onChangeText={(val) => this.setState({ prior: val })}
//                             />
//                         </View>
//                         {
//                             this.IdLienHe ?
//                                 <View>
//                                     <Text style={{ fontSize: reText(14), marginBottom: 5 }}>{`Người chỉnh sửa`}</Text>
//                                     <View style={{ backgroundColor: colors.black_11, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 4, marginBottom: 10 }}>
//                                         <TextInput
//                                             editable={false}
//                                             style={{ fontSize: reText(15), color: dataLienHe?.CreatorUpdate ? colors.black : colors.black_20, paddingVertical: 0 }}
//                                             value={dataLienHe && dataLienHe.CreatorUpdate ? dataLienHe.CreatorUpdate : 'Người chỉnh sửa'}
//                                             onChangeText={(val) => this.setState({ prior: val })}
//                                         />
//                                     </View>
//                                     <Text style={{ fontSize: reText(14), marginBottom: 5 }}>{`Ngày chỉnh sửa`}</Text>
//                                     <View style={{ backgroundColor: colors.black_11, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 4, marginBottom: 10 }}>
//                                         <TextInput
//                                             editable={false}
//                                             style={{ fontSize: reText(15), color: dataLienHe?.CreatedDateUpdate ? colors.black : colors.black_20, paddingVertical: 0 }}
//                                             value={dataLienHe && dataLienHe.CreatedDateUpdate ? dataLienHe.CreatedDateUpdate : 'Ngày chỉnh sửa'}
//                                             onChangeText={(val) => this.setState({ prior: val })}
//                                         />
//                                     </View>
//                                 </View>
//                                 : null
//                         }
//                         <View style={{ flexDirection: 'row', justifyContent: 'space-around', }}>
//                             <TouchableOpacity onPress={() => this._goback()}
//                                 style={{ paddingVertical: 10, backgroundColor: colors.black_50, borderRadius: 5, paddingHorizontal: 22, marginTop: 15 }}>
//                                 <Text style={{ color: colors.white, fontWeight: 'bold' }}>Huỷ</Text>
//                             </TouchableOpacity>
//                             {
//                                 this.IdLienHe ?
//                                     <>
//                                         <TouchableOpacity onPress={() => this._updateLienHe()}
//                                             style={{ paddingVertical: 10, backgroundColor: colors.peacockBlue, borderRadius: 5, paddingHorizontal: 22, marginTop: 15 }}>
//                                             <Text style={{ color: colors.white, fontWeight: 'bold' }}>Sửa</Text>
//                                         </TouchableOpacity>
//                                         <TouchableOpacity onPress={() => this._deleteLienHe()}
//                                             style={{ paddingVertical: 10, backgroundColor: colors.peacockBlue, borderRadius: 5, paddingHorizontal: 22, marginTop: 15 }}>
//                                             <Text style={{ color: colors.white, fontWeight: 'bold' }}>Xoá</Text>
//                                         </TouchableOpacity>
//                                     </>
//                                     :
//                                     <TouchableOpacity onPress={() => this._addLienHe()}
//                                         style={{ paddingVertical: 10, backgroundColor: colors.peacockBlue, borderRadius: 5, paddingHorizontal: 22, marginTop: 15 }}>
//                                         <Text style={{ color: colors.white, fontWeight: 'bold' }}>Xác nhận</Text>
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

