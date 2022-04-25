import React, { Component } from 'react';
import {
    Platform
} from 'react-native';
import { WebView, WebViewProps } from 'react-native-webview';


export default class WebViewCus extends Component<WebViewProps> {
    constructor(props) {
        super(props);
        this.countOnHeight = 0;
        this.state = {
            webViewHeight: 40
        }
    };
    _onWebViewMessage = (event: WebViewMessageEvent) => {
        // console.log("gia tri evendata countOnHeight ", this.props.source)
        if (this.countOnHeight == 2)
            return;
        this.countOnHeight++;
        // console.log("gia tri evendata ngeem ", Number(event.nativeEvent.data * 0.5));
            try {
                if (event.nativeEvent != null)
                    this.setState({ webViewHeight: Number(event.nativeEvent.data * 0.35) + 2 })
            } catch (error) {
            }
    }
    render() {

        var { style = {}, source, fontSize = 18 } = this.props;
        if (Platform.OS == 'android')
            fontSize = fontSize * 1.1;
        fontSize = 1.3281472327365 * fontSize;
        var html = source.html;
        if (html) {
            html = `<body><style>
            * {
                font-size: ${fontSize}px;
                font-family: 'Helvetica Neue';
            }
        </style><div style="padding-bottom: 10px" id='divBody'>${html}</div></body>`;
            source.html = html;
        }

        return (
            <WebView
                onMessage={this._onWebViewMessage}
                injectedJavaScript='window.ReactNativeWebView.postMessage(document.body.scrollHeight)'
                // injectedJavaScript={`window.ReactNativeWebView.postMessage(document.getElementById("divBody").scrollHeight)`}
                // scalesPageToFit={false}
                {...this.props}
                source={{ ...source }}
                style={{ height: this.state.webViewHeight, ...style }}
            // style={{ height: 40, ...style }}
            />
        );
    }
}
