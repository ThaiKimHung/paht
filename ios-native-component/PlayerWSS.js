import React from 'react';
import { requireNativeComponent, View } from 'react-native';
import { colors } from '../styles';
import { isLandscape } from '../styles/styles';

type Props = {
    tyleScreen: Number,
    isFullScreen: Boolean
}

const RCTCustomView = requireNativeComponent('RCTPlayerWSS', PlayerWSS, {});

class PlayerWSS extends React.PureComponent<Props> {
    render() {
        const { style = {}, tyleScreen = 1, isFullScreen = false } = this.props;
        let { width, height } = style;
        let styleSize = { width, height };
        let sizeTyle = { height: width * 1 / tyleScreen };
        if (isFullScreen) {
            styleSize = { width: height, height: width };
            sizeTyle = { height: width, width: width * tyleScreen, alignSelf: 'center' }
        }

        return (
            <View {...this.props} style={[{ alignContent: 'center', justifyContent: 'center', backgroundColor: colors.black },
                style, styleSize, isFullScreen && !isLandscape() ? {
                    transform: [{ rotate: "90deg" }]
                } : {}]}>
                <RCTCustomView {...this.props} style={[style, styleSize, sizeTyle]} webSocket={this.props.url} />
            </View>
        )
    }
}

export default PlayerWSS;