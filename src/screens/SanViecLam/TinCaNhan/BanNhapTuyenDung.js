import React, { Component } from 'react';
import {
    FlatList,
    View
} from 'react-native';
import ItemNhap from './components/ItemNhap';
import Utils from '../../../../app/Utils';
import { ListEmpty } from '../../../../components';
import { nkey } from '../../../../app/keys/keyStore';
import { nstyles, colors } from '../../../../styles';
import { ROOTGlobal } from '../../../../app/data/dataGlobal';

export default class BanNhapTuyenDung extends Component {


    constructor(props) {
        super(props);
        this.nthis = props.nthis;
        this.state = {
            refreshing: false,
            draftListTuyenDung: [],
        }
    }

    componentDidMount() {
        this.getdraftListTuyenDung();
        ROOTGlobal.dataGlobal._onRefreshBanNhapTuyenDung = this.getdraftListTuyenDung;
    }

    getdraftListTuyenDung = async () => {
        this.setState({ refreshing: true });
        let draftListTuyenDung = await Utils.ngetStore(nkey.draftListTuyenDung, []);
        Utils.nlog('draftListTuyenDung~~~~~', draftListTuyenDung)
        this.setState({
            refreshing: false,
            draftListTuyenDung: draftListTuyenDung
        });
    }

    onPressDraft = (data) => {
        Utils.goscreen(this.nthis, 'Modal_GuiTinTuyenDung', { data: data, isEdit: -1 })
        let onListeningDataPA = ROOTGlobal.dataGlobal._onListeningDataTuyenDung
        if (onListeningDataPA) {
            onListeningDataPA(data);
        }
    }

    _showAllImages = (arrImage = [], index = 0) => {
        Utils.goscreen(this.nthis, 'Modal_ShowListImage', { ListImages: arrImage, index });
    }
    handleRemoveDraft = (index) => {
        Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn xoá tin tuyển dụng này?', 'Xoá', 'Xem lại', async () => {
            let {
                draftListTuyenDung
            } = this.state;
            draftListTuyenDung.splice(index, 1);
            await Utils.nsetStore(nkey.draftListTuyenDung, draftListTuyenDung);
            this.setState({ draftListTuyenDung });
        })
    }

    render() {
        let {
            draftListTuyenDung, refreshing
        } = this.state;
        let textempty = 'Không có bản nháp';

        return (
            <View style={nstyles.nstyles.nbody}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={draftListTuyenDung}
                    ListEmptyComponent={<ListEmpty textempty={textempty} isImage={false} />}
                    contentContainerStyle={{ padding: 10, paddingBottom: nstyles.paddingBotX + 20 + (Platform.OS === 'android' ? 60 : 0) }}
                    keyExtractor={(item, index) => `${item.idDraft}`}
                    ItemSeparatorComponent={() => <View style={{ height: 10, }}></View>}
                    refreshing={refreshing}
                    onRefresh={this.getdraftListTuyenDung}
                    renderItem={({ item, index }) => {
                        return (
                            <ItemNhap
                                nthis={this.nthis}
                                dataItem={item}
                                onPress={() => this.onPressDraft(item)}
                                removeDraft={() => this.handleRemoveDraft(index)}
                                showImages={() => this._showAllImages(item.ListHinhAnh)} />
                        )
                    }}
                />
            </View>
        )
    }

}