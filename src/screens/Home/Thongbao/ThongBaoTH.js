import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { nstyles, Width } from '../../../../styles';
import { colors } from '../../../../styles';
import { Images } from '../../../images';
// import ComponentComDV from '../../DichVu/ComponentCom'
import Utils from '../../../../app/Utils';
import { reText } from '../../../../styles/size';
import ThongBaoXL from './ThongBaoXL'
import ThongBaoCD from './ThongBaoCD'
import ThongBaoUuDai from './ThongBaoUuDai'
export class ThongBaoTH extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTab: 2
        }
    }
    componentDidMount() {
        Utils.nlog("<><<><><><><><><>XLXLXLX:", this)
    }
    _ChonTab = (id) => {
        this.setState({ isTab: id })
    }

    _renderTab = (id) => {

        switch (id) {
            // case 0:
            //     return (
            //         <ThongBaoChung nthis={this} />
            //     )
            //     break;
            // case 1:
            //     return (
            //         <ThongBaoUuDai nthis={this.props.nthis} />
            //     )
            //     break;
            case 2:
                return (
                    <ThongBaoCD nthis={this.props.nthis} isCD={0} /> // công dân nên là isCD={0}
                )
                break;
            case 3:
                return (
                    <ThongBaoXL nthis={this.props.nthis} />
                )
                break;
        }
    }

    render() {
        const { isTab } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: colors.backgroundModal, }}>
                <View style={{ flex: 1, backgroundColor: colors.BackgroundHome, paddingTop: 5, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', }}>
                        {/* <TouchableOpacity style={[styles.stItem, { backgroundColor: isTab == 1 ? colors.colorChuyenMuc : colors.black_20 }]} onPress={() => this._ChonTab(1)}>
                            <Text style={styles.stText}>{`TB Chung`}</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={[styles.stItem, { backgroundColor: isTab == 2 ? colors.colorChuyenMuc : colors.black_20 }]} onPress={() => this._ChonTab(2)}>
                            <Text style={styles.stText}>{`TB Công dân`}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.stItem, { backgroundColor: isTab == 3 ? colors.colorChuyenMuc : colors.black_20 }]} onPress={() => this._ChonTab(3)} >
                            <Text style={styles.stText}>{`Phản ánh hiện trường`}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, marginTop: 5 }}>
                        {this._renderTab(isTab)}
                    </View>
                </View>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    stItem: {
        justifyContent: 'center', alignItems: 'center',
        height: 35, borderRadius: 5, flex: 1,
        marginHorizontal: 2.5
    },
    stText: {
        fontSize: reText(13), color: colors.white, textAlign: 'center', fontWeight: '700'

    }
})

export default ThongBaoTH
