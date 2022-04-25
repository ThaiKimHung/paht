import React, { Component } from 'react';
import {
    FlatList,
    View
} from 'react-native';
import ItemNhap from '../TabCaNhan/components/ItemNhap';
import Utils from '../../../app/Utils';
import { ListEmpty } from '../../../components';
import { nkey } from '../../../app/keys/keyStore';
import { nstyles, colors } from '../../../styles';
import { ROOTGlobal } from '../../../app/data/dataGlobal';

export default class BanNhap extends Component {


    constructor(props) {
        super(props);
        this.nthis = props.nthis;
        this.state = {
            refreshing: false,
            draftList: [],
        }
    }

    componentDidMount() {
        this.getDraftList();
        ROOTGlobal.dataGlobal._onRefreshBanNhap = this.getDraftList;
    }

    getDraftList = async () => {
        this.setState({ refreshing: true });
        let draftList = await Utils.ngetStore('draftList', []);
        Utils.nlog('draftList~~~~~', draftList)
        this.setState({
            refreshing: false,
            draftList: draftList
        });
    }

    onPressDraft = (data) => {
        console.log('data nhap', data)
        Utils.goscreen(this.nthis, 'Modal_TaoPhanAnh', { data: data, isEdit: -1 })
        let onListeningDataPA = ROOTGlobal.dataGlobal._onListeningDataPA
        if (onListeningDataPA) {
            onListeningDataPA(data);
        }
    }

    _showAllImages = (arrImage = [], index = 0) => {
        Utils.goscreen(this.nthis, 'Modal_ShowListImage', { ListImages: arrImage, index });
    }
    handleRemoveDraft = async (index) => {
        let {
            draftList
        } = this.state;
        draftList.splice(index, 1);
        await Utils.nsetStore(nkey.draftList, draftList);
        this.setState({ draftList });
    }

    render() {
        let {
            draftList, refreshing
        } = this.state;
        let textempty = 'Không có bản nháp';

        return (
            <View style={nstyles.nstyles.nbody}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={draftList}
                    ListEmptyComponent={<ListEmpty textempty={textempty} isImage={false} />}
                    contentContainerStyle={{ padding: 10, paddingBottom: nstyles.paddingBotX + 20 + (Platform.OS === 'android' ? 60 : 0) }}
                    keyExtractor={(item, index) => `${item.idDraft}`}
                    ItemSeparatorComponent={() => <View style={{ height: 10, }}></View>}
                    refreshing={refreshing}
                    onRefresh={this.getDraftList}
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