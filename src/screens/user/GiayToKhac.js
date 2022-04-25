import React, { Component, createRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import Utils from '../../../app/Utils';
import { ButtonCom, HeaderCus, IsLoading } from '../../../components';
import { colors } from '../../../styles';
import { reText } from '../../../styles/size';
import { nstyles } from '../../../styles/styles';
import { Images } from '../../images';
import RNFS from 'react-native-fs';
import apis from '../../apis';
import ImageCus from '../../../components/ImageCus';
import { appConfig } from '../../../app/Config';
import { Height } from '../../../chat/styles/styles';
import { getImageSize } from '../Gui_PhanAnh/GuiPhanAnh_Root';
import ImageResizer from 'react-native-image-resizer';
import UploadImage from './UploadImage';

class GiayToKhac extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback', () => { })
        this.state = {
            isChange: true
        };
        this.refLoading = createRef();
        this.RefUploadGTK = React.createRef(null);
    }
    componentDidMount() {
        const { userCD } = this.props.auth
        if (userCD?.GiayToKhac?.length != 0) {
            this.setState({ isChange: false })
        }
    }

    close = () => {
        Utils.goback(this)
    }

    confirm = async () => {
        this.refLoading.current.show()
        let dataBoDy = new FormData();
        const { userCD = {} } = this.props.auth;
        //lấy data giấy tờ khác
        let DataImageGTK = this.RefUploadGTK.current?.getData();
        if (DataImageGTK?.length > 0) {
            for (let index = 0; index < DataImageGTK.length; index++) {
                const element = DataImageGTK[index];
                let file = `File${index == 0 ? '' : index}`;

                // const { width, height } = await getImageSize(element?.uri);

                dataBoDy.append(file,
                    {
                        name: "file" + index + '.png',
                        type: "image/png",
                        uri: element?.uri
                    });

                // await ImageResizer.createResizedImage(element?.uri, width || 0, height || 0, 'JPEG', Platform.OS == 'android' ? 60 : 40, 0)
                //     .then(async (response) => {
                //         dataBoDy.append(file,
                //             {
                //                 name: "file" + index + '.png',
                //                 type: "image/png",
                //                 uri: response.uri
                //             });
                //     })
                //     .catch(err => {
                //         Utils.nlog("gia tri err-----------------", err)
                //     });

            }
        };
        dataBoDy.append("UserID", userCD?.UserID || '');

        Utils.nlog("data form", dataBoDy);
        let url = 'api/dungchung/FormUploadGiayToTuyThan';
        let res = await Utils.post_api_formdata(url, dataBoDy);
        this.refLoading.current.hide()
        Utils.nlog('[res]', res)
        if (res.status == 1) {
            Utils.showMsgBoxOK(this, 'Thông báo', 'Cập nhật giấy tờ thành công!', 'Xác nhận', () => {
                this.callback();
                Utils.goback(this);
            })
        } else {
            Utils.showMsgBoxOK(this, 'Cảnh báo', res?.error?.message || 'Tải lên thất bại !', 'Xác nhận')
        }
    }
    changeCMND = () => {
        this.setState({ isChange: true })
    }
    render() {
        const { isChange } = this.state
        const { userCD } = this.props.auth;

        const { GiayToKhac } = userCD || {}
        const DefaultImageGTK = GiayToKhac ? GiayToKhac.map(item => {
            return {
                uri: appConfig.domain + item?.Path
            }
        }) : []
        return (
            <View style={stGiayThongHanh.container}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => { Utils.goback(this) }}
                    iconLeft={Images.icBack}
                    title={`Giấy tờ khác`}
                    styleTitle={{ color: colors.white }}
                />
                <View style={stGiayThongHanh.body}>
                    <ScrollView >
                        <UploadImage isEdit={isChange} ref={this.RefUploadGTK} name={'Giấy tờ khác'} limit={5} DefaultImages={DefaultImageGTK || []} />
                    </ScrollView>
                    <View style={stGiayThongHanh.footer}>
                        <ButtonCom
                            Linear={true}
                            colorChange={[colors.grayLight, colors.grayLight]}
                            text={"Quay lại"}
                            onPress={this.close}
                            styleTouchable={{ flex: 1 }}
                            style={stGiayThongHanh.button}
                            txtStyle={{ fontSize: reText(14) }}
                        />
                        {
                            isChange ? <ButtonCom
                                text={"Cập nhật"}
                                onPress={this.confirm}
                                style={stGiayThongHanh.button}
                                styleTouchable={{ flex: 1 }}
                                txtStyle={{ fontSize: reText(14) }}
                            /> : <ButtonCom
                                text={"Thay đổi"}
                                onPress={this.changeCMND}
                                style={stGiayThongHanh.button}
                                styleTouchable={{ flex: 1 }}
                                txtStyle={{ fontSize: reText(14) }}
                            />
                        }
                    </View>
                    <IsLoading ref={this.refLoading} />
                </View>
            </View >
        );
    }
}

const stGiayThongHanh = StyleSheet.create({
    container: { flex: 1 },
    body: { flex: 1, backgroundColor: colors.white, padding: 10, paddingBottom: 20 },
    title: { color: colors.redStar, paddingVertical: 10 },
    card: {
        ...nstyles.shadow, backgroundColor: colors.black_10, borderRadius: 10, borderWidth: 0.5, borderColor: colors.greenFE, height: Height(50)
    },
    titleCard: { height: '100%', alignItems: 'center', justifyContent: 'center' },
    txtCard: { color: colors.greenFE, fontWeight: 'bold' },
    footer: { flexDirection: 'row', justifyContent: 'space-between' },
    button: { borderRadius: 5, marginHorizontal: 10, marginTop: 8 },
    imageCard: { width: '100%', height: '100%', borderRadius: 10 }

})
const mapStateToProps = state => ({
    auth: state.auth
});
export default Utils.connectRedux(GiayToKhac, mapStateToProps, true);

