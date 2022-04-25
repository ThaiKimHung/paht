import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    PixelRatio,
    Platform,
    Button,
    Dimensions,
    Fragment
} from 'react-native';
import YouTube, { YouTubeStandaloneIOS, YouTubeStandaloneAndroid } from 'react-native-youtube';

import Utils from '../../../../app/Utils';
import { nstyles } from '../../../../styles';


export default class YouTubePlay extends Component {
    constructor(props) {
        super(props)
        const { height = 200 } = props;
        this.tempHei = height;
        this.state = {
            isReady: false,
            status: null,
            quality: null,
            error: null,
            isPlaying: props.isPlaying != undefined ? props.isPlaying : false,
            isLooping: false,
            duration: 0,
            currentTime: 0,
            fullscreen: false,
            playerWidth: nstyles.nwidth(),
            height: this.tempHei
        };
    }
    _youTubeRef = React.createRef();
    static propTypes = {
        idVideo: PropTypes.string,
    };

    static defaultProps = {
        idVideo: 'fp4Bh2Wpu4U',
    };

    _setFullScreen = () => {
        this.setState({ fullscreen: true }, () => {
            if (Platform.OS === 'ios')
                this._youTubeRef.current.reloadIframe();
        });

    }

    handleReady = () => {
        setTimeout(() => this.setState({ height: this.tempHei + 16 }), 200);
    }

    render() {
        Utils.nlog('-------------------------this.props.idVideo', this.props.idVideo);
        return (
            <View style={this.props.style}>
                <YouTube
                    ref={this._youTubeRef}
                    resumePlayAndroid={false}
                    // You must have an API Key for the player to load in Android
                    // apiKey="AIzaSyCb8zCcjemE2YrGFKrOaDbp6Tg25hndnQU"
                    apiKey="AIzaSyA8cUgcN9mnM7ZIOz5wAAX0l61NWpYQdv0"

                    videoId={this.props.idVideo}

                    // videoIds={['uMK0prafzw0', 'qzYgSecGQww', 'XXlZfc1TrD0', 'czcjU1w-c6k']}
                    // playlistId="PLF797E961509B4EB5"
                    play={this.state.isPlaying}

                    // loop={this.state.isLooping}
                    fullscreen={this.state.fullscreen}
                    controls={1}
                    style={[
                        { height: this.state.height },
                        styles.player, this.props.style
                    ]}
                    onError={e => {
                        this.setState({ error: e.error });
                    }}
                    onReady={this.handleReady}
                    onChangeState={e => {
                        this.setState({ status: e.state });
                    }}
                    onChangeQuality={e => {
                        this.setState({ quality: e.quality });
                    }}
                    onChangeFullscreen={e => {
                        console.log('e.quality', e.isFullscreen)

                        this.setState({ fullscreen: e.isFullscreen });
                    }}
                    onProgress={e => {
                        this.setState({ currentTime: e.currentTime });
                    }}
                    origin="https://www.youtube.com"
                />
                {/* Fullscreen */}
                {/* {!this.state.fullscreen && (
                    <View style={styles.buttonGroup}>
                        <Button
                            title="Toàn màn hình"
                            onPress={this._setFullScreen}
                        />
                    </View>
                )} */}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    buttonGroup: {
        flexDirection: 'row',
        alignSelf: 'center',
        paddingBottom: 5,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    player: {
        alignSelf: 'stretch',
        marginVertical: 10,
    },
});