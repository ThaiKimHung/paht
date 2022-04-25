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

export default class BanNhapTuVanF0 extends Component {


    constructor(props) {
        super(props);
        this.nthis = props.nthis;
        this.state = {
            refreshing: false,
            draftListTuVanF0: [],
        }
    }

    componentDidMount() {
        this.getdraftListTuVanF0();
        ROOTGlobal.dataGlobal._onRefreshBanNhapTuVanF0 = this.getdraftListTuVanF0;
    }

    getdraftListTuVanF0 = async () => {
        this.setState({ refreshing: true });
        let draftListTuVanF0 = await Utils.ngetStore(nkey.draftListTuVanF0, []);
        Utils.nlog('draftListTuVanF0~~~~~', draftListTuVanF0)
        this.setState({
            refreshing: false,
            draftListTuVanF0: draftListTuVanF0
        });
    }

    onPressDraft = (data) => {
        Utils.goscreen(this.nthis, 'Modal_YeuCauTuVanF0', { "isModalGuiPA": 103, data: data, isEdit: -1 })
        let onListeningDataPA = ROOTGlobal.dataGlobal._onListeningDataTuVanF0
        if (onListeningDataPA) {
            onListeningDataPA(data);
        }
    }

    _showAllImages = (arrImage = [], index = 0) => {
        Utils.goscreen(this.nthis, 'Modal_ShowListImage', { ListImages: arrImage, index });
    }
    handleRemoveDraft = async (index) => {
        let {
            draftListTuVanF0
        } = this.state;
        draftListTuVanF0.splice(index, 1);
        await Utils.nsetStore(nkey.draftListTuVanF0, draftListTuVanF0);
        this.setState({ draftListTuVanF0 });
    }

    render() {
        let {
            draftListTuVanF0, refreshing
        } = this.state;
        let textempty = 'Không có bản nháp';

        return (
            <View style={nstyles.nstyles.nbody}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={draftListTuVanF0}
                    ListEmptyComponent={<ListEmpty textempty={textempty} isImage={false} />}
                    contentContainerStyle={{ padding: 10, paddingBottom: nstyles.paddingBotX + 20 + (Platform.OS === 'android' ? 60 : 0) }}
                    keyExtractor={(item, index) => `${item.idDraft}`}
                    ItemSeparatorComponent={() => <View style={{ height: 10, }}></View>}
                    refreshing={refreshing}
                    onRefresh={this.getdraftListTuVanF0}
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