import React, { PureComponent } from 'react';
import {
  View
} from 'react-native';
import { nstyles } from '../../styles';
import PropTypes from 'prop-types';
import { RootLang } from '../../app/data/locales';
import {WebView} from 'react-native-webview'

const patchPostMessageJsCode = `(${String(function () {
  var originalPostMessage = window.postMessage
  var patchedPostMessage = function (message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer)
  }
  patchedPostMessage.toString = function () {
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
  }
  window.postMessage = patchedPostMessage
})})();`
//-=---
const injectedScript = function () {
  function waitForBridge() {

    if (window.postMessage.length !== 1) {
      setTimeout(waitForBridge, 200);
    }
    else {
      let height = 0;
      var body = document.body;
      var heightBody = body.scrollHeight;
      if (document.documentElement.clientHeight > heightBody) {
        height = document.documentElement.clientHeight
      }
      else {
        height = heightBody;
      }
      postMessage(height)
    }
  }
  waitForBridge();

};
//-----

const getWebviewContent = (siteKey) => {
  const originalForm = '<!DOCTYPE html><html><head>' +
    '<style>  .text-xs-center { text-align: center; } .g-recaptcha { display: inline-block; } </style>' +
    `<script src="https://www.google.com/recaptcha/api.js?hl=${RootLang._keys}"></script>` +
    '<script type="text/javascript"> var onloadCallback = function() { }; ' +
    'var onDataCallback = function(response) { window.postMessage(response);  }; ' +
    'var onDataExpiredCallback = function(error) {  window.postMessage("expired"); }; ' +
    'var onDataErrorCallback = function(error) {  window.postMessage("error"); } </script>' +
    '</head><body>' +
    '<div class="text-xs-center"><div class="g-recaptcha" ' +
    'data-sitekey="' + siteKey + '" data-callback="onDataCallback" ' +
    'data-expired-callback="onDataExpiredCallback" ' +
    'data-error-callback="onDataErrorCallback"></div></div></body></html>';
  return originalForm;
}

export default class ReCaptchaView extends PureComponent {
  state = {
    webViewHeight: Number,
  };

  static propTypes = {
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onExpired: PropTypes.func.isRequired,
    defaultHeight: PropTypes.number,
    autoHeight: PropTypes.bool,
    url: PropTypes.string.isRequired,
    siteKey: PropTypes.string.isRequired
  }

  static defaultProps = {
    autoHeight: true,
    onError: () => null,
    onExpired: () => null,
    onSuccess: () => null,
    onloadCallback: () => null
  }

  constructor(props) {
    super(props);
    this.state = {
      webViewHeight: this.props.defaultHeight,
      touchNotRoBoot: false
    }
    this._onMessage = this._onMessage.bind(this);
    this.touchNotRoBoot = false;

  }

  _onMessage(e) {
    if (e && e.nativeEvent && e.nativeEvent.data) {
      const val = e.nativeEvent.data;
      if (!isNaN(val)) {
        if (val >= 425) this.touchNotRoBoot = true;
        // Utils.nlog('_onMessage - e.nativeEvent', e.nativeEvent)
        this.setState({
          webViewHeight: parseInt(val)
        });
      } else if (val === 'expired') {
        this.props.onExpired();
        this.setState({ webViewHeight: 100 });
      } else if (val === 'error') {
        this.props.onError();
        this.setState({ webViewHeight: 100 });
      } else {
        this.props.onSuccess(val);
        this.setState({ webViewHeight: 100 })
      }
    }
  }

  stopLoading() {
    this.webview.stopLoading();
  }

  render() {
    const _w = this.props.width || nstyles.Width(100)
    const _h = this.props.autoHeight ? this.state.webViewHeight : this.props.defaultHeight;
    return (
      <View style={{ height: _h, maxHeight: 525, alignItems: 'center' }}>
        <WebView
          ref={(ref) => { this.webview = ref; }}
          scalesPageToFit={false}
          injectedJavaScript={'(' + String(injectedScript) + ')();' + patchPostMessageJsCode}
          // injectedJavaScript={patchPostMessageJsCode}
          scrollEnabled={this.props.scrollEnabled || false}
          onMessage={this._onMessage}
          javaScriptEnabled
          automaticallyAdjustContentInsets
          /* {...this.props} */
          style={[{ width: _w }, this.props.style]}
          source={{
            html: getWebviewContent(this.props.siteKey),
            baseUrl: this.props.url
          }}
          onLoadEnd={() => Utils.nlog('onLoadEnd - ReCaptchaView')}
        >
        </WebView>
      </View>
    )
  }
}

// 6LeVKXwUAAAAANMPpX8WnIbX82of5yoNw-H8kedu