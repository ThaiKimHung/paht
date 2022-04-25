import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Animated, FlatList, Platform } from 'react-native'
import { colors } from '../../../styles';
import { Height, isIOS, isLandscape, isPhoneMini, versionIOS, Width } from '../../../styles/styles';
import Utils from '../../../app/Utils';
import { isPad, reSize, reText } from '../../../styles/size';
import { BlurView } from '@react-native-community/blur';
import ItemMenu from './components/ItemMenu';
const getNumcolum = (list = []) => {
    if (list && list.length <= 4) {
        return 2
    } else {
        return 3
    }
}
const ModalMenuChild = (props) => {
    const data = Utils.ngetParam({ props }, "data", '');
    const _goScreenTab = Utils.ngetParam({ props }, "_goScreenTab", () => { });
    const { child = [], name } = data;
    const [opacity, setOpacity] = useState(new Animated.Value(0))
    useEffect(() => {
        startAnimation(1)
    }, []);
    const startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(opacity, {
                toValue: value,
                duration: 150
            }).start();
        }, 280);
    };
    const goBack = () => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 150
        }).start(() => {
            Utils.goback({ props: props })
        });
    }
    const renderMenu = (item, index, isCD = false) => {
        return <View style={{
            alignItems: 'center',
            width: `${100 / getNumcolum(child)}%`,

        }} key={index}>
            <ItemMenu item={item} index={index} isCD={isCD} isChild={true} _goScreenTab={_goScreenTab} />
        </View>
    }

    let withMenu = Width(getNumcolum(child) * 30);
    let heightMenu = Width(getNumcolum(child) * 25);
    if (isLandscape()) {
        withMenu = withMenu / 2;
        heightMenu = heightMenu / 2;
    }

    return (
        <View style={_styles.bodyContainer}>
            <Animated.View onTouchEnd={goBack} style={[_styles.animatedContainer, { opacity: opacity }]}>
                <BlurView
                    style={{
                        flex: 1,
                    }}
                    blurType='dark'
                    blurAmount={1}
                    reducedTransparencyFallbackColor={colors.black_40}
                    overlayColor={colors.black_20}
                // onTouchEnd={goBack}
                />
            </Animated.View>
            <Text numberOfLines={2} style={_styles.textTitle}>{name}</Text>
            {
                Platform.OS == 'ios' && !isPhoneMini && !versionIOS ? <BlurView style={[_styles.blurViewCenter, {
                    width: withMenu,
                    minHeight: heightMenu,
                }]}
                    blurType="materialLight"
                    blurAmount={1}
                    reducedTransparencyFallbackColor={colors.black_50}
                    overlayColor={colors.black_50}
                >
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        extraData={child}
                        numColumns={getNumcolum(child)}
                        data={child}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => renderMenu(item, index, true)}
                    />
                </BlurView> : <View style={[_styles.blurViewCenter, {
                    width: withMenu,
                    minHeight: heightMenu,
                    backgroundColor: "#D5D3D3"
                }]}
                >
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        extraData={child}
                        numColumns={getNumcolum(child)}
                        data={child}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => renderMenu(item, index, true)}
                    />
                </View>
            }
        </View>
    )
}

const mapStateToProps = state => ({
    theme: state.theme
});
export default Utils.connectRedux(ModalMenuChild, mapStateToProps, true);

const _styles = StyleSheet.create({
    blurViewCenter: {
        borderWidth: 1, borderColor: colors.blueGrey_20,
        borderRadius: reSize(15),
        padding: 10,
    },
    textTitle: {
        paddingVertical: 10, fontSize: reText(20), width: "80%", textAlign: 'center',
        color: colors.white, fontWeight: 'bold', marginBottom: Height(8)
    },
    animatedContainer: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
    },
    bodyContainer: {
        flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: Height(20)
    }
})
