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

export default class BanNhapAnSinh extends Component {


    constructor(props) {
        super(props);
        this.nthis = props.nthis;
        this.state = {
            refreshing: false,
            draftListAnSinh: [],
        }
    }

    componentDidMount() {
        this.getdraftListAnSinh();
        ROOTGlobal.dataGlobal._onRefreshBanNhapAnSinh = this.getdraftListAnSinh;
    }

    getdraftListAnSinh = async () => {
        this.setState({ refreshing: true });
        let draftListAnSinh = await Utils.ngetStore(nkey.draftListAnSinh, []);
        Utils.nlog('draftListAnSinh~~~~~', draftListAnSinh)
        this.setState({
            refreshing: false,
            draftListAnSinh: draftListAnSinh
        });
    }

    onPressDraft = (data) => {
        Utils.goscreen(this.nthis, 'Modal_YeuCauHoTroTuiAnSinh', { "isModalGuiPA": 102, data: data, isEdit: -1 })
        let onListeningDataPA = ROOTGlobal.dataGlobal._onListeningDataTuiAnSinh
        if (onListeningDataPA) {
            onListeningDataPA(data);
        }
    }

    _showAllImages = (arrImage = [], index = 0) => {
        Utils.goscreen(this.nthis, 'Modal_ShowListImage', { ListImages: arrImage, index });
    }
    handleRemoveDraft = async (index) => {
        let {
            draftListAnSinh
        } = this.state;
        draftListAnSinh.splice(index, 1);
        await Utils.nsetStore(nkey.draftListAnSinh, draftListAnSinh);
        this.setState({ draftListAnSinh });
    }

    render() {
        let {
            draftListAnSinh, refreshing
        } = this.state;
        let textempty = 'Không có bản nháp';

        return (
            <View style={nstyles.nstyles.nbody}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={draftListAnSinh}
                    ListEmptyComponent={<ListEmpty textempty={textempty} isImage={false} />}
                    contentContainerStyle={{ padding: 10, paddingBottom: nstyles.paddingBotX + 20 + (Platform.OS === 'android' ? 60 : 0) }}
                    keyExtractor={(item, index) => `${item.idDraft}`}
                    ItemSeparatorComponent={() => <View style={{ height: 10, }}></View>}
                    refreshing={refreshing}
                    onRefresh={this.getdraftListAnSinh}
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