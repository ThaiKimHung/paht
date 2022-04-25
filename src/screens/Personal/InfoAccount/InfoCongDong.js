import React, { Component, Fragment } from 'react'
import { Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Utils from '../../../../app/Utils';
import { AvatarUser, ButtonCom, IsLoading } from '../../../../components';
import { reText } from '../../../../styles/size';
import apis from '../../../apis';
import DangKyTaiKhoan from '../../user/DangKyTaiKhoan';

export class InfoCongDong extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isEdit: false
        }
    }

    render() {
        return (
            <View style={{ flex: 1, paddingTop: 5 }}>
                {/* <AvatarUser colorIcon={this.props.theme.colorLinear.color[0]} style={{ marginVertical: 13 }} /> */}
                <DangKyTaiKhoan hideHeader={true} nthis={this.props.nthis} isDangKy={false} OnEdit={this.state.isEdit} onEnEdit={(value) => this.setState({ isEdit: value ? value : false })} />
                <IsLoading />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(InfoCongDong, mapStateToProps, true);
