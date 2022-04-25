import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Utils from '../../../../app/Utils';
import { colors } from '../../../../styles';
import { Width } from '../../../../styles/styles';
import { Images } from '../../../images';
import HeaderCongDong from '../Component/HeaderCongDong';
import TabTouchHeaderList from '../Component/TabTouchHeaderList';
import BanNhanTuyenDung from './BanNhapTuyenDung';
import DaGuiTuyenDung from './DaGuiTuyenDung';

class TinCaNhan extends Component {
    constructor(props) {
        super(props);
        this.yNext = 0
        this.animaDelta = 0
        this.isTabStatus = 1
        this.state = {
            dataFilter: [{
                key: 'DaGui',
                value: '1',
                title: 'Đã đăng',
                icon: Images.icDaDangTD
            },
            {
                key: 'BanNhap',
                value: '2',
                title: 'Bản nháp',
                icon: Images.icBanNhapTD
            }],
            filterChoose: '0',//Mặc định choose Tiêu Biểu
            fillterKeys: '', // Lọc mặc định theo (Key,Val)=>(MucDo,2)
            fillterVals: '',
            objectKey: {
                filterkey: `TypeReference`,
                filtervalue: `103`,
            }
        };
    }

    _chooseFilter = async (id, key, value) => {
        if (this.state.filterChoose != id) {
            this.setState({
                filterChoose: id,
                fillterKeys: key,
                fillterVals: value,
                // refreshing: true,
            });
        };
    }
    // XỬ LÝ ẨN HIỆN TABBOTTOM
    handleScroll = (event) => {
        let ytemp = event.nativeEvent.contentOffset.y;

        let deltaY = ytemp - this.yNext;
        this.yNext = ytemp;
        //----
        this.animaDelta += deltaY;
        if (this.animaDelta > 160) {
            this.animaDelta = 160;
            if (this.isTabStatus != -1 && ytemp > 50) {
                this.isTabStatus = -1;
                //run animation 1
                nthisTabbarTuyenDung._startAnimation(-150);

            };
        };
        if (this.animaDelta < 0 || ytemp <= 0) {
            this.animaDelta = 0;
            if (this.isTabStatus != 1) {
                this.isTabStatus = 1;
                nthisTabbarTuyenDung._startAnimation(0);
            };
        };
    };
    render() {
        const { filterChoose, objectKey } = this.state
        return (
            <View style={{ flex: 1 }}>
                <HeaderCongDong
                    isCaNhan={true}
                    onPressBack={() => { Utils.goscreen(this, 'ManHinh_Home') }}
                />
                <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                    <View style={{ width: Width(100) }}>
                        <TabTouchHeaderList
                            dataFilter={this.state.dataFilter}
                            filterChoose={this.state.filterChoose}
                            chooseFilter={this._chooseFilter}
                        />
                    </View>
                    {
                        filterChoose == '0' ?
                            <DaGuiTuyenDung objectfilter={objectKey} handleScroll={this.handleScroll} />
                            :
                            <BanNhanTuyenDung />
                    }
                </View>
            </View>
        );
    }
}

export default TinCaNhan;
