import React from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, Image } from 'react-native';

// import Pdf from 'react-native-pdf';
import Utils from '../../app/Utils';
import { nheight, nwidth } from '../../styles/styles';
import apiChat from '../api/apis';
import { ImagesChat } from '../Images';

class PDFExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            source: Utils.ngetParam(this, 'source', '')
        }

    }
    // itemEdit.IdGroup, itemEdit.IsGroup
    // _sendFile = async (File) => {
    //     let { IdGroup, IsGroup } = this.props.dataInFo;
    //     Utils.nlog("gia tri sen fide---", this.props.dataInFo)
    //     let res = await apis.apiChat.UploadFileData(File, IdGroup, IsGroup);
    //     Utils.nlog("gia tri res sen file=====", res);
    //     if (res.status == 1) {
    //         Utils.nlog("vao sen file")
    //         const SendFile = Utils.ngetParam(this, "SendFile", () => { })
    //         SendFile(res.data)
    //     }
    // }
    _sendFile = async () => {
        // Utils.nlog("gia tri data send ", this.state.source)
        this.props.SendFileOfGroup([{ ...this.state.source }]);
        Utils.goback(this)
    }
    render() {
        Utils.nlog("vao pdf", 11111111)
        const source = { uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true };
        //const source = require('./test.pdf');  // ios only
        //const source = {uri:'bundle-assets://test.pdf'};

        //const source = {uri:'file:///sdcard/test.pdf'};
        //const source = {uri:"data:application/pdf;base64,JVBERi0xLjcKJc..."};

        return (
            <View style={styles.container}>
                {/* <Pdf
                    source={{ uri: this.state.source.uri }}
                    onLoadComplete={(numberOfPages, filePath) => {
                        console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link presse: ${uri}`)
                    }}
                    style={styles.pdf} /> */}
                <TouchableOpacity
                    onPress={
                        this._sendFile
                        // Utils.goback({ props })
                    }
                    style={{
                        position: 'absolute',
                        bottom: 100, right: 0,
                        paddingHorizontal: 20

                    }}>
                    {/* <Text style={{ textAlign: 'center' }}>Search</Text> */}
                    <Image source={ImagesChat.icSendMsg} style={[{ width: 40, height: 40 }]}>
                    </Image>
                </TouchableOpacity>
            </View>
        )
    }
}

const mapStateToProps = state => ({

    dataInFo: state.ReducerGroupChat.InFoGroup,
    // SetMessage: state.SetMessage,
});
export default Utils.connectRedux(PDFExample, mapStateToProps, true)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    pdf: {
        flex: 1,
        width: nwidth(),
        height: nheight(),
    }
});