import { AsyncStorage } from 'react-native';

const getToken = async (app) => {
    try {
        const value = await AsyncStorage.getItem('@token'+app);
        if (value !== null) {
            console.log('get token: value=');
            console.log(value);
            return value;
        }
        return '';
    } catch (error) {
        return '';
    }
};

export default getToken;
