import React, { Component, Fragment } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { nstyles, colors, sizes } from '../../../../styles';
import styles from '../styles';
import ImageFileCus from './ImageFileCus';
import Utils from '../../../../app/Utils';
import { Images } from '../../../images';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import HtmlViewCom from '../../../../components/HtmlView';
import { GetConfigByCode_NhatKy } from '../../../apis/apiapp';
import { ConfigScreenDH } from '../../../routers/screen';
import AppCodeConfig from '../../../../app/AppCodeConfig';
import { Width } from '../../../../styles/styles';


const IDRuleNK = 164;
class ItemNhatKy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditHXL: false,
            HanXuLy: props.HanXuLy ? props.HanXuLy : '',
            isNhatKy: "0",
            showDetail: props.index == 0
        }
    }
    _CheckHanXuLy = () => {
        var rules = Utils.getGlobal(nGlobalKeys.rules, [], AppCodeConfig.APP_ADMIN);
        for (let index = 0; index < rules.length; index++) {
            const element = rules[index];
            if (element == IDRuleNK) {
                this.setState({ isEditHXL: true });
                return
            }

        }
    }
    componentDidMount() {
        // alert(this.props.item.NoiDung);
        this._CheckHanXuLy();
        this._CheckNoiDungNhatKy();
    }
    _CheckNoiDungNhatKy = async () => {
        const res = await GetConfigByCode_NhatKy();
        // Utils.nlog("_CheckNoiDungNhatKy------>>>111:", res)
        if (res && res.data && res.status == 1) {
            this.setState({ isNhatKy: res?.data?.Value })
        }
        else {
            this.setState({ isNhatKy: "0" });
        }

    }
    render() {
        const { isEditHXL, HanXuLy, isNhatKy, showDetail } = this.state;
        // Utils.nlog("gia tri han xu ly", HanXuLy);
        const { nrow } = nstyles.nstyles;
        const { item, nthis, TimeText, isHuy = false } = this.props;

        const { ListFileDinhKem = [] } = item;
        var arrImg = [], arrFile = [];
        if (ListFileDinhKem.length > 0) {
            ListFileDinhKem.forEach(item => {
                let checkImage = Utils.checkIsImage(item.Link);

                if (checkImage == true) {
                    arrImg.push({ url: item.Link })
                } else {
                    arrFile.push({ FileName: item.TenFile, Link: item.Link })
                }
                Utils.nlog("gia tri image chi tiết", arrImg);
            });
        }
        // alert(item.NoiDung)
        return (
            <View style={{ borderLeftWidth: 1, borderColor: colors.grayLight, marginHorizontal: -6, paddingBottom: 15, marginLeft: 5 }}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => this.setState({ showDetail: !showDetail })}>
                    <Image source={Images.icAvatar} style={[nstyles.nstyles.nIcon20, { position: 'absolute', top: 0, left: -10 }]}
                        resizeMode='contain' />
                    <View style={{ marginHorizontal: 4, marginLeft: 15 }}>
                        <Text style={[styles.txt14, { fontWeight: 'bold' }]}>{item.TenPhuongXa}</Text>
                        <Text style={[styles.txt12, { fontStyle: 'italic', marginTop: 2 }]}> ({item.NguoiTao})</Text>
                        <View style={[nrow, { alignItems: 'center', marginTop: 5 }]}>
                            <Text style={[styles.txt13, { fontWeight: 'bold', color: colors.peacockBlue }]}>{item.ThaoTacText} </Text>
                            {
                                item.hadEdit != true ? null :
                                    <TouchableOpacity
                                        style={{ paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
                                        onPress={() => Utils.goscreen(this.props.nthis, "Modal_ModalXemSuaNhatKyDH", {
                                            data: item
                                        })}
                                    >
                                        <Image source={Images.icEdit} style={[nstyles.nstyles.nIcon14]}
                                            resizeMode='contain' />
                                        {
                                            !showDetail ? null :
                                                <Text style={{
                                                    fontSize: sizes.sizes.sText13, fontStyle: 'italic',
                                                    color: colors.peacockBlue
                                                }}> (Đã chỉnh sửa)</Text>
                                        }
                                    </TouchableOpacity>
                            }
                        </View>
                        <View style={[nrow, { alignItems: 'center', marginTop: 2 }]}>
                            <Image source={Images.icTime} style={[nstyles.nstyles.nIcon13, {}]}
                                resizeMode='contain' />
                            <Text style={[styles.txt12]}> {TimeText ? item[`${TimeText}`] : item.ThoiGian}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {
                    !showDetail ? null :
                        <View style={{ backgroundColor: colors.colorGrayBgr, marginTop: 5, paddingTop: 5 }}>
                            {/* tab xử lý */}
                            {isNhatKy == "0" || isNhatKy == "1" || isHuy ?

                                <View style={{ marginHorizontal: 5 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ height: 10, width: 10, borderRadius: 10, backgroundColor: colors.peacockBlue }}></View>
                                        <Text style={[styles.txt12, { fontWeight: 'bold' }]}>{`Nội dung (Nhật ký xử lý)`}</Text>
                                    </View>
                                    <View style={{}}>
                                        <HtmlViewCom html={item.NoiDungXL ? item.NoiDungXL : ''} style={{ height: '100%' }} />
                                    </View>
                                </View> : null}
                            {/* tab thao tác */}
                            {isNhatKy == "0" || isNhatKy == "2" || isHuy ?
                                <View style={{ marginHorizontal: 5 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ height: 10, width: 10, borderRadius: 10, backgroundColor: colors.peacockBlue }}></View>
                                        <Text style={[styles.txt12, { fontWeight: 'bold' }]}>{`Nội dung (Nhật ký thao tác)`}</Text>
                                    </View>
                                    <View style={{}}>
                                        <HtmlViewCom html={item.NoiDung ? item.NoiDung : ''} style={{ height: '100%' }} />
                                    </View>
                                </View> : null}
                            <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                                <ImageFileCus styleFile={{ width: Width(90), marginHorizontal: 5 }} dataMedia={arrImg} dataFile={arrFile} nthis={nthis} />
                            </ScrollView>
                            <Text style={{ marginLeft: 10, fontSize: sizes.reText(13), marginBottom: 2 }}>{`Hạn xử lý:${HanXuLy ? HanXuLy : 'Chưa cập nhật'}`}</Text>
                            {
                                isHuy ? null :
                                    <View style={{
                                        width: '100%', backgroundColor: colors.backgroundModal,
                                        // justifyContent: 'flex-end',
                                        flexDirection: 'row', paddingTop: 5, paddingBottom: 2
                                    }}>
                                        <View style={{ flex: 1 }}></View>

                                        {isEditHXL == true ?
                                            <TouchableOpacity
                                                style={{ paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
                                                // style={styles.backRightBtnRight}
                                                onPress={() => Utils.goscreen(this.props.nthis, ConfigScreenDH.Modal_ModalCapNhatHanXuLy, {
                                                    data: item,
                                                    HanXuLy: HanXuLy
                                                })}
                                            >
                                                <Image source={Images.icPen} style={[,
                                                    { width: 20, height: 18, tintColor: colors.peacockBlue }]}
                                                    resizeMode='contain' />
                                                <Text style={{ color: '#FFF', fontSize: sizes.sizes.sText14 }}>Hạn xử lý</Text>
                                            </TouchableOpacity> : null
                                        }
                                        {/* //  */}
                                        {/* {item.hadEdit == true ?
                                <TouchableOpacity
                                    style={{ paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
                                    // style={styles.backRightBtnRight}
                                    onPress={() => Utils.goscreen(this.props.nthis, "Modal_ModalXemSuaNhatKyDH", {
                                        data: item
                                    })}
                                >
                                    <Image source={Images.icEdit} style={[,
                                        { width: 20, height: 18 }]}
                                        resizeMode='contain' />
                                    <Text style={{ color: '#FFF', fontSize: sizes.sizes.sText14 }}>Đã chỉnh sửa</Text>
                                </TouchableOpacity> : null
                            } */}
                                        <TouchableOpacity
                                            style={{ paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
                                            // style={styles.backRightBtnRight}
                                            onPress={() => Utils.goscreen(this.props.nthis, "Modal_ModalXemSuaNhatKyDH", {
                                                data: item
                                            })}
                                        >
                                            <Image source={Images.icShowPass} style={[,
                                                { width: 20, height: 18, tintColor: colors.peacockBlue }]}
                                                resizeMode='contain' />
                                            <Text style={{ color: '#FFF', fontSize: sizes.sizes.sText14, marginLeft: 5, fontWeight: 'bold' }}>Xem</Text>
                                        </TouchableOpacity>
                                        {item.AlowEdit == true ? <TouchableOpacity
                                            style={{ paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
                                            // style={styles.backRightBtnLeft}
                                            onPress={() => Utils.goscreen(this.props.nthis, "Modal_ModalXemSuaNhatKyDH", {
                                                data: item,
                                                isEdit: true
                                            })}>
                                            <Image source={Images.icEditCB} style={[nstyles.nstyles.nIcon18, { tintColor: colors.peacockBlue }]} />
                                            <Text style={{ color: '#FFF', fontSize: sizes.sizes.sText14, marginLeft: 5, fontWeight: 'bold' }}>Sửa</Text>
                                        </TouchableOpacity> : null
                                        }
                                    </View>
                            }
                        </View>
                }
            </View>
        );
    }
}

ItemNhatKy.defaultProps = {
    item: {
        IdRow: 120220001,
        NguoiTao: 'Nguyen Van Teo',
        sdt: '0987654432',
        NoiDung: 'Nội dung -Lorem ipsum dolor sit amet, consectetuer adipis cing elit, sed diam nonummy nibh euismod tincidunt ut laor… ',
        CreatedDate: '12/02/2020 10:01',
    },
    goscreen: () => { },
    // nthis: this.nthisItemDanhSach
};

ItemNhatKy.propTypes = {
    item: PropTypes.object,
    goscreen: PropTypes.func,
    nthis: PropTypes.any,
    TimeText: PropTypes.string
};

export default ItemNhatKy;