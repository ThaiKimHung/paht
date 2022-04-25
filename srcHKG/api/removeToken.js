import { AsyncStorage } from 'react-native';

const removeToken = async (app) => {
    try {
        await AsyncStorage.removeItem('@token' + app);
        return 'THANH_CONG';
    } catch (e) {
        return e;
    }
};
const RemoveTokenHKG = removeToken
export RemoveTokenHKG
export default removeToken;
