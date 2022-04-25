import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Utils from '../../../app/Utils';
import { nstyles, colors, sizes, styles } from '../../../styles';
import { HeaderCom, TextInputCom } from '../../../components';
import ButtonCus from '../../../components/ComponentApps/ButtonCus';
import { Width, Height } from '../../../styles/styles';
import HeaderModal from './components/HeaderModal';
import ItemNoiDung from './components/ItemNoiDung';
import { Images } from '../../images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
class XinYKien extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    goback = () => {
        Utils.goback(this)
    }
    render() {
        return (
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false} >
                <View style={{
                    flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center',
                }} onTouchEnd={this.goback} />
                <View style={{ backgroundColor: colors.backgroundModal }}>
                    <View style={{
                        backgroundColor: colors.white,
                        borderTopLeftRadius: 30, borderTopRightRadius: 30
                    }}>
                        <HeaderModal
                            _onPress={this.goback}
                            title='Xin ý kiến chủ tịch'
                        />

                        <ItemNoiDung
                            textTieuDe='Xin ý kiến'
                            textNoiDung={`Noi dung`}
                            numberOfLines={2}
                            multiline={true}
                            stTitle={{ marginLeft: 15 }}
                            stContaierTT={{ backgroundColor: colors.veryLightPink, width: Width(90), marginLeft: 15 }}
                        />

                        <ButtonCus
                            textTitle={`Thực hiện`}
                            stContainerR={{ marginLeft: 15, marginTop: 20.5, marginBottom: 30 }}
                        />
                    </View>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}
export default XinYKien
