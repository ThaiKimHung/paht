import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { nstyles, colors } from '../../../../styles';
import { Images } from '../../../images';
import Utils from '../../../../app/Utils';
import { nkey } from '../../../../app/keys/keyStore';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import apis from '../../../apis';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';
import { reText } from '../../../../styles/size';
import { appConfig } from '../../../../app/Config';
import { NavigationEvents } from 'react-navigation';
import ImageCus from '../../../../components/ImageCus';

class Avatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datatt: {},
            checkLogIn: false,
            avatarSource: '',
        };
        nthisAvatar = this;
        ROOTGlobal.dataGlobal._onPressAvatar = nthisAvatar.getThongTin;
    }
    getThongTin = async () => {

    }
    avataOnPress = async () => {
        Utils.goscreen(this, 'tab_Person', {
            _CapNhatAvatar: this.getThongTin
        });
    };
    render() {
        const { nmiddle, nAva35 } = nstyles.nstyles;
        const { styImage = {}, textstyle = {}, auth = {} } = this.props;
        let AvataLink = auth?.userCD?.Avata || auth?.userDH?.Avata;
        if (AvataLink) {
            if (auth?.tokenCD) {
                AvataLink = appConfig.domain + AvataLink;
            } else {
                AvataLink = appConfig.domain + '/Upload/Avata/' + AvataLink;
            }

        }
        return (
            <TouchableOpacity onPress={this.avataOnPress} style={{ flex: 1, borderRadius: 35, alignItems: 'center', backgroundColor: colors.greenFE, }}>
                <NavigationEvents
                    onWillFocus={() => this.getThongTin()}
                />
                {
                    AvataLink ? <ImageCus source={AvataLink ? { uri: AvataLink } : Images.icUser} style={[nAva35, styImage]}
                        resizeMode='cover' /> : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={[{ color: colors.white, fontWeight: '700', paddingHorizontal: 10 }, textstyle]}>{`${auth?.userCD?.FullName ? auth?.userCD?.FullName[0] || 'T' : 'T'}`}</Text>
                    </View>
                }
            </TouchableOpacity>
        );
    }
}
const mapStateToProps = state => ({
    auth: state.auth
});
export default Utils.connectRedux(Avatar, mapStateToProps, true);
