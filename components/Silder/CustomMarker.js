import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '../../styles/color';
import { sizes } from '../../styles/size';
class CustomMarker extends React.Component {
    render() {
        return (
            <View style={styles.markerStyle}>
                <Text style={{ fontSize: sizes.sText17, color: 'white' }}>{this.props.Text}</Text>
            </View>
            // <Image
            //     style={styles.image}
            //     source={
            //         this.props.pressed ? require('./ruby.png') : require('./diamond.png')
            //     }
            //     resizeMode="contain"
            // />
        );
    }
}

const styles = StyleSheet.create({
    markerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        width: 30,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        backgroundColor: colors.colorSoftBlue,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 1,
        shadowOpacity: 0.2,
    },
});

export default CustomMarker;