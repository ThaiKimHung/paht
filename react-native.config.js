// react-native.config.js
//tắt lỗi error khi run-ios, android. Không ảnh hưởng gì
module.exports = {
    dependencies: {
      'react-native-code-push': {
        platforms: {
          android: null
        }
      },
      // 'react-native-fbsdk': {
      //   platforms: {
      //     android: null
      //   }
      // },
      'react-native-maps': { // ko autolink dc map
        platforms: {
          android: null
        }
      },
      // 'react-native-onesignal': {
      //   platforms: {
      //     ios: null
      //   }
      // }
    },
  };