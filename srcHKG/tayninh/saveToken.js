import AsyncStorage from '@react-native-community/async-storage'

const saveToken = async (app, token) => {
    try {
        await AsyncStorage.setItem('@token' + app, token);
        return 'THANH_CONG';
    } catch (e) {
        return e;
    }
};

export default saveToken;
