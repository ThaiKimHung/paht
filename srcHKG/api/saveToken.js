import { AsyncStorage } from 'react-native';

const saveToken = async (app, token) => {
    try {
        await AsyncStorage.setItem('@token' + app, token);
        return 'THANH_CONG';
    } catch (e) {
        return e;
    }
};


export const SaveTokenHKG = {
    saveToken: saveToken
}
export default saveToken;

