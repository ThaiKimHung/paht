import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Animated, Platform } from 'react-native';
import Utils from '../../../app/Utils';
import ImageCus from '../../../components/ImageCus';
import { colors } from '../../../styles';
import FontSize from '../../../styles/FontSize';
import { reText } from '../../../styles/size';
import { Height, heightStatusBar, Width } from '../../../styles/styles';
import { Images } from '../../images';

class DetailsUnit extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.scrollY = new Animated.Value(0)
    }

    render() {
        const { isLandscape } = this.props.theme
        const maxHeight = Platform.OS == 'android' ? Height(isLandscape ? 30 : 25) : Height(isLandscape ? 25 : 20)
        const minHeight = Height(isLandscape ? 15 : 10)
        const { scrollY } = this.state
        const headerScale = this.scrollY.interpolate({
            inputRange: [-maxHeight, 0],
            outputRange: [3, 1],
            extrapolate: 'clamp',
        });

        const headerHeight = this.scrollY.interpolate(
            {
                inputRange: [0, (maxHeight - minHeight) * 2],
                outputRange: [maxHeight, minHeight],
                extrapolate: 'clamp'
            });
        const opacityTitle = this.scrollY.interpolate(
            {
                inputRange: [0, 20, 35, 40],
                outputRange: [0, 0.1, 0.4, 1],
                extrapolate: 'clamp'
            });

        return (
            <View style={stDetailsUnit.container}>
                <Animated.View style={[{ height: headerHeight, transform: [{ scale: headerScale }] }]}>
                    <ImageCus defaultSourceCus={undefined} source={{ uri: `https://huongdanlamhochieu.com/wp-content/uploads/2019/03/passport-tha%CC%81i-nguye%CC%82n.jpg` }} style={stDetailsUnit.imgHeader} resizeMode='cover' />
                    <Animated.View style={[stDetailsUnit.titleHeader, { paddingTop: isLandscape ? heightStatusBar() - 15 : heightStatusBar() }]}>
                        <Animated.Text numberOfLines={1} style={[stDetailsUnit.txtTitle, { opacity: opacityTitle }]}>
                            {'Thị Xã Phổ Yên'.toUpperCase()}
                        </Animated.Text>
                    </Animated.View>
                </Animated.View>
                <ScrollView
                    style={stDetailsUnit.content}
                    scrollEventThrottle={16}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.scrollY } } }], {
                        useNativeDriver: false,
                    })}
                >
                    {/* Reder title of town */}
                    <View style={stDetailsUnit.titleTown}>
                        <Text style={stDetailsUnit.txtNameTown} numberOfLines={1}>{'Thị Xã Phổ Yên'}</Text>
                        <Text style={stDetailsUnit.txtSubTown} numberOfLines={1}>{`Phổ Yên là một thị xã nằm ở phía nam tỉnh Thái Nguyên, Việt Nam.`}</Text>
                    </View>
                    <View style={{ height: 1000 }} />

                </ScrollView>
                <TouchableOpacity
                    style={[stDetailsUnit.btnBack, {
                        top: isLandscape ? Platform.OS == 'android' ? heightStatusBar() + 5 : heightStatusBar() - 10 : heightStatusBar() + 10,
                    }]}
                    onPress={() => { Utils.goback(this) }}>
                    <Image source={Images.icBack} style={stDetailsUnit.iconBack} resizeMode='contain' />
                </TouchableOpacity>

            </View>
        );
    }
}

const stDetailsUnit = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BackgroundHome
    },
    btnBack: {
        position: 'absolute',
        top: heightStatusBar() + 10,
        left: 15,
        zIndex: 100
    },
    iconBack: {
        tintColor: colors.white
    },
    content: {
        // flex: 1,
        // padding: 10
    },
    imgHeader: {
        width: '100%', height: '100%'
    },
    header: {

    },
    titleHeader: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center', justifyContent: 'center',
        paddingTop: heightStatusBar()
    },
    txtTitle: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: reText(18),
        maxWidth: Width(70)
    },
    titleTown: {
        padding: 10,
        backgroundColor: colors.white
    },
    txtNameTown: {
        fontWeight: 'bold',
        color: 'red',
        fontSize: FontSize.reText(25),
        textAlign: 'justify'
    },
    txtSubTown: {
        marginTop: 10,
        fontSize: FontSize.reText(14),
        textAlign: 'justify'
    }
})

const mapStateToProps = state => ({
    theme: state.theme
});

export default Utils.connectRedux(DetailsUnit, mapStateToProps, true)
