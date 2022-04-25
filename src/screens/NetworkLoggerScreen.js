import React from 'react'
import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import NetworkLogger from 'react-native-network-logger';
import { colors } from '../../styles';
import { HeaderCus } from '../../components';
import { reText } from '../../styles/size';
import Utils from '../../app/Utils';
import { Images } from '../../srcAdmin/images';

const NetworkLoggerScreen = () => {
    return (
        <View style={{ backgroundColor: colors.white, flex: 1 }}>
            <HeaderCus
                title={'Api logger dev'}
                styleTitle={{ color: colors.white }}
                iconRight={null}
                iconLeft={Images.icBack}
                // onPressRight={this._LogOut}
                titleLeft={null}
                Sleft={{}}
                onPressLeft={() => Utils.BackStack()}
            />
            <NetworkLogger sort="asc" />
        </View>
    )
}

export default NetworkLoggerScreen

const styles = StyleSheet.create({})
