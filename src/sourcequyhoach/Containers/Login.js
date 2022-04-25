import LinkAPI, { onPostRequest, decodeResponse, encodeResponse } from './Config';
import AsyncStorage from '@react-native-community/async-storage';
import { store } from '../../../srcRedux/store';
import URL from './Config';
import Utils from '../../../app/Utils';
import axios from 'axios';
import { loadMenuApp } from '../../../srcRedux/actions/auth/Auth';

export function onAuthentication(payload, onSuccess) {
  let onProcessLogin = ({ statusCode, response }) => {
    onProcess({ statusCode, response }, onSuccess);
  };
  onPostRequest(LinkAPI.login, onProcessLogin, payload);
}

export function onChangePassWord(payload, onSuccess) {
  let onProcessChangePassword = ({ statusCode, response }) => {
    onProcess({ statusCode, response }, onSuccess);
  };
  onPostRequest(LinkAPI.changePassWord, onProcessChangePassword, payload);
}

const onProcess = ({ statusCode, response }, onSuccess) => {
  if (statusCode === 200) {
    AsyncStorage.setItem(LinkAPI.token, response)
      .then(() => {
        let userInfo = decodeResponse(response);
        userInfo = JSON.parse(userInfo);
        store.dispatch({ type: 'SET_USER_INFO', userInfo });
        onSuccess({ statusCode, response });
      })
      .catch((e) => {
        onSuccess({ statusCode: 201, response: e });
      });
  } else {
    onSuccess({ statusCode, response });
  }
};
export const OnSignIn = async (payload: Payload) => {
  Utils.nlog("vao login nha bạn ", payload)
  try {
    let encodeHeader = encodeResponse(payload);
    await axios.post(encodeURI(LinkAPI.signAuth), null, {
      headers: {
        'Content-Type': 'application/json',
        Data: encodeHeader,
      },
    })
      .then((res) => {
        AsyncStorage.setItem(LinkAPI.token, res.data)
          .then(() => {
            let userInfo = decodeResponse(res.data);
            userInfo = JSON.parse(userInfo);
            store.dispatch({ type: 'SET_USER_INFO', userInfo });
            store.dispatch({ type: 'SET_TOKEN', token: res.data });
          });
      })
      .catch((error) => {
        // Utils.nlog("vao error----------", store.getState().auth.RuleAppCanBo.filter(item => item.Ma != "ILIS"))
        store.dispatch(loadMenuApp({
          listObjectMenuDVC: store.getState().auth.RuleAppCanBo.filter(item => item.Ma != "ILIS")
        }))
        console.log("error", error);
      });

  } catch (e) {
    console.log(e);
  }
};

export const OnSignOut = () => {
  try {
    AsyncStorage.setItem(URL.token, '')
      .then(() => {
        store.dispatch({ type: 'SET_USER_INFO', userInfo: '' });
        store.dispatch({ type: 'SET_TOKEN', token: '' });
      });
  }
  catch (e) {
    console.log(e);
  }
};