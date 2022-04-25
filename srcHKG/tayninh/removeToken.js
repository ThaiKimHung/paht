import AsyncStorage from '@react-native-community/async-storage'

const removeToken = async (app) => {
    try {
        await AsyncStorage.removeItem('@token' + app);
        return 'THANH_CONG';
    } catch (e) {
        return e;
    }
};

export default removeToken;
