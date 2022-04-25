import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    StatusBar,
    Button,
    Text,
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { RichEditor } from './rich-editor';
import Utils from '../../app/Utils';
import { ButtonCom, HeaderCom, HeaderCus } from '..';
import { colors } from '../../styles';
import { reText } from '../../styles/size';
import { Height } from '../../styles/styles';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { ImgComp } from '../ImagesComponent';
import { Images } from '../../src/images';

const ModalEditHTML = (props) => {

    const callback = Utils.ngetParam({ props: props }, "callback", () => { });
    const initialHtml = Utils.ngetParam({ props: props }, "content", "");
    const initialPlaceholder = 'Nhập nội dung ...';
    const [richEditorApi, setRichEditorApi] = useState({
        getHtml: () => { },
        setHtml: () => { },
        bold: () => { },
        italic: () => { },
        underline: () => { }

    })
    const setDate = () => {
        if (typeof richEditorApi !== 'undefined') {
            richEditorApi.setHtml(
                `<i>Current date:</i> <b>${new Date().toISOString()}</b>`,
            );
        }
    };
    const readHtml = async () => {
        if (typeof richEditorApi !== 'undefined') {
            const html = await richEditorApi.getHtml();
            callback(html);
            Utils.goback({ props: props });
            // Alert.alert(html);
        }
    };
    const bold = () => {
        if (typeof richEditorApi !== 'undefined') {
            richEditorApi.bold();
        }
    };
    const italic = () => {
        if (typeof richEditorApi !== 'undefined') {
            richEditorApi.italic();
        }
    };
    const underline = () => {
        if (typeof richEditorApi !== 'undefined') {
            richEditorApi.underline();
        }
    };
    return (
        <View style={{ flex: 1, backgroundColor: 'white', }}>
            <HeaderCus
                onPressLeft={() => Utils.goback({ props: props })}
                onPressRight={readHtml}
                Sright={{ tintColor: 'white' }}
                iconLeft={ImgComp.icBack}
                iconRight={ImgComp.icSave}
                title={'Chỉnh sửa nội dung'}
                styleTitle={{ color: 'white' }}
            />
            <Text style={{ backgroundColor: colors.BackgroundHome, fontSize: reText(12), paddingHorizontal: 15, paddingVertical: 10, fontWeight: 'bold', color: colors.colorBlueLight }}>Phủ khối để định dạng nội dung</Text>
            <View
                style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    borderBottomWidth: 0.5, borderBottomColor: colors.colorBlueLight, backgroundColor: colors.BackgroundHome
                }}
            >
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{ padding: 10 }}
                        onPress={() => bold()}>
                        <Text style={styles.bold}>In đậm</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <TouchableOpacity style={{ padding: 10 }} onPress={() => italic()}>
                        <Text style={styles.italic}>Chữ nghiêng</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <TouchableOpacity style={{ padding: 10 }} onPress={() => underline()}>
                        <Text style={styles.underline}>Gạch dưới</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={{ height: Height(1000) }} >
                    <RichEditor
                        initialHtml={initialHtml ? initialHtml : ''}
                        initialPlaceholder={initialPlaceholder}
                        onInitialized={(api) => {
                            setRichEditorApi(api);
                        }}
                    >
                    </RichEditor>

                    {/* <TouchableOpacity onPress={readHtml} style={{
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                        backgroundColor: 'red',
                    }}>
                        <Text style={{}}>{'Lưu'}</Text>
                    </TouchableOpacity> */}
                </ScrollView>
                <ButtonCom
                    text={"Nhập xong & Quay lại"}
                    style={{ borderRadius: 5, marginHorizontal: 10, marginBottom: isIphoneX() ? 25 : 5 }}
                    onPress={readHtml}
                />
            </View>
        </View >
    );
};


const styles = {
    ...StyleSheet.create({
        container: { flex: 1 },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingBottom: 36,
        },
        bold: { fontWeight: 'bold' },
        italic: { fontStyle: 'italic' },
        underline: { textDecorationLine: 'underline' },
    }),
};

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(ModalEditHTML, mapStateToProps, true);
