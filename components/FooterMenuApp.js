import React, { Component } from 'react'
import { Text, View, TouchableHighlight, Image, TouchableOpacity } from 'react-native'
import { appConfig, appConfigCus } from '../app/Config';
import { colors } from '../styles';
import { reText } from '../styles/size';
import { ImgComp } from './ImagesComponent';


export class FooterMenuApp extends Component {
    constructor(props) {
        super(props)
    };

    componentDidMount() {
    }

    render() {
        var { goScreen = () => { }, dataUser = {} } = this.props
        return (
            <View style={{
                // position: 'absolute', left: 0, right: 0, bottom: 5 + paddingBotX
            }}>
                {/* <TouchableHighlight
                    underlayColor="#325887"
                    onPress={goScreen}
                >
                    <View
                        style={{
                            height: 70, alignItems: 'center', flexDirection: 'row',
                            backgroundColor: '#25313F', paddingBottom: 5
                        }}>
                        <Image style={{ width: 40, height: 40, borderRadius: 20, margin: 20, }}
                            source={dataUser.avatarSource ? { uri: appConfig.domain + '/Upload/Avata/' + dataUser.avatarSource } : ImgComp.icUser}
                        />
                        <Text
                            numberOfLines={2}
                            style={{ color: '#FFF', fontWeight: '500', fontSize: 16, flex: 1, marginRight: 4 }}>{dataUser.fullname}</Text>
                    </View>
                </TouchableHighlight> */}
                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', padding: 4, backgroundColor: '#25313F' }}>
                    {/* <Text style={{
                        color: 'white', marginBottom: 10, marginLeft: 20, fontSize: 8,
                        textAlign: 'left'
                    }}>{appConfig.version + '-' + appConfig.mode}</Text> */}
                    <Text style={{
                        color: 'white', marginBottom: 15, marginLeft: 20, fontSize: 8,
                        textAlign: 'left'
                    }}>
                        {`ⓒ Viettel Information and Communications Technology Solutions Center`}
                    </Text>
                </View>
            </View>
        )
    }
}

export default FooterMenuApp
