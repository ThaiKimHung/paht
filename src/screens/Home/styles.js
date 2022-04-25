import { StyleSheet } from 'react-native';
import { sizes, colors } from '../../../styles'
const styles = StyleSheet.create({
    text12: {
        fontSize: sizes.reText(12)
    },
    text13: {
        fontSize: sizes.reText(13)
    },
    text14: {
        fontSize: sizes.reText(14)
    },
    text16: {
        fontSize: sizes.reText(14)
    },
    shadown: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
        backgroundColor: 'white'
    }
});
export default styles;