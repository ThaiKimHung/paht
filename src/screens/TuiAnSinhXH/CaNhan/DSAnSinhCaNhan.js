import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Utils from '../../../../app/Utils';
import { colors } from '../../../../styles';
import { Width } from '../../../../styles/styles';
import { Images } from '../../../images';
import HeaderCongDong from '../Component/HeaderCongDong';
import TabTouchHeaderList from '../Component/TabTouchHeaderList';
import BanNhapAnSinh from './BanNhapAnSinh';
import DaGuiAnSinh from './DaGuiAnSinh';

class DSAnSinhCaNhan extends Component {
    constructor(props) {
        super(props);
        this.yNext = 0
        this.animaDelta = 0
        this.isTabStatus = 1
        this.state = {
            dataFilter: [{
                key: 'DaGui',
                value: '1',
                title: 'Đã gửi',
                icon: Images.icDaGui
            },
            {
                key: 'BanNhap',
                value: '2',
                title: 'Bản nháp',
                icon: Images.icBanNhap
            }],
            filterChoose: '0',//Mặc định choose Tiêu Biểu
            fillterKeys: '', // Lọc mặc định theo (Key,Val)=>(MucDo,2)
            fillterVals: '',
            objectKey: {
                filterkey: `TypeReference`,
                filtervalue: `102`,
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
            }, this.GetListAnSinh);
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
                nthisTabbarAnSinh._startAnimation(-150);

            };
        };
        if (this.animaDelta < 0 || ytemp <= 0) {
            this.animaDelta = 0;
            if (this.isTabStatus != 1) {
                this.isTabStatus = 1;
                nthisTabbarAnSinh._startAnimation(0);
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
                    onPressHistory={() => { Utils.goscreen(this, 'Modal_LichSuGiupDo') }}
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
                            <DaGuiAnSinh objectfilter={objectKey} handleScroll={this.handleScroll} />
                            :
                            <BanNhapAnSinh />
                    }
                </View>
            </View>
        );
    }
}

export default DSAnSinhCaNhan;
