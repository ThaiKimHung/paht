import { StyleSheet } from "react-native";
import { Height } from "../../../../chat/styles/styles";
import { colors } from "../../../../styles";
import { reText } from "../../../../styles/size";

export const styleComponentUI = StyleSheet.create({
    coverComp: { flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, marginTop: 20 },
    viewContainComp: { flex: 1, paddingLeft: 10, borderBottomWidth: 0.5, borderBottomColor: colors.black_30 },
    labelComp: { color: colors.black_50, paddingRight: 10 },
    txtValueComp: { color: colors.black_50, textAlign: 'justify', marginVertical: 10, paddingRight: 10 },
})

export const stDropDownUI = StyleSheet.create({
    coverComp: { marginTop: 10, marginHorizontal: 10 },
    labelComp: { fontSize: reText(14), color: colors.black_50, paddingVertical: 8 },
    containerComp: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10, borderRadius: 3,
        borderWidth: 0.5, borderColor: colors.black_30,
        alignItems: 'center'
    },
    txtValueComp: { fontWeight: 'bold', fontSize: reText(14), color: colors.black_50 }
})

export const stInputUI = StyleSheet.create({
    coverComp: { marginTop: 10, marginHorizontal: 10 },
    labelComp: { fontSize: reText(14), color: colors.black_50, paddingVertical: 8 },
    inputComp: {
        minHeight: Height(18),
        maxHeight: Height(40),
        color: colors.black_80,
        padding: 10,
        lineHeight: 20,
        borderRadius: 5,
        borderColor: colors.black_30,
        backgroundColor: colors.white,
        borderWidth: 0.5
    },
    containSuggest: { flexWrap: 'wrap', flexDirection: 'row' },
    touchSuggest: { margin: 5, backgroundColor: colors.black_11, borderRadius: 5},
    txtSuggest: { padding: 10, fontSize: reText(14) }

})


export const stListCheck = StyleSheet.create({
    coverComp: { marginTop: 10, marginHorizontal: 10 },
    labelComp: { fontSize: reText(14), color: colors.black_50, paddingVertical: 8 },
    inputComp: {
        minHeight: Height(18),
        maxHeight: Height(40),
        color: colors.black_80,
        padding: 10,
        lineHeight: 20,
        borderRadius: 5,
        borderColor: colors.black_30,
        backgroundColor: colors.white,
        borderWidth: 0.5
    },
    containSuggest: { flexWrap: 'wrap', flexDirection: 'row' },
    touchSuggest: { margin: 5, backgroundColor: colors.black_11, borderRadius: 5 },
    txtSuggest: { padding: 10, fontSize: reText(14) }

})

