import React, { Component } from 'react';
import {
	Text,
	View,
	FlatList,
	StyleSheet,
	Image,
	TouchableOpacity, SafeAreaView, Alert,
} from 'react-native';

import { Images } from '../../../src/images';

import getToken from '../../api/getToken';
import { ConfigScreen } from '../../navigation';
import HeaderHKG from '../Component/HeaderHKG';
import { appConfig } from '../../../app/Config';
import { ItemCuocHop } from './Search';
import Utils from '../../../app/Utils';
import { IsLoading } from '../../../components';
import { nstyles } from '../../../styles/styles';


export default class HopTrongNgay extends Component {
	static navigationOptions = {
		header: null
	}
	constructor(props) {
		super(props);
		const { params } = this.props.navigation.state;
		this.state = {
			date: new Date(),
			idcn: params.idtv,
			loading: false,
			data: [],
			page: 0,
			error: null,
			refreshing: false,
		};
		this.refreshing = React.createRef(null)
	}
	componentDidMount() {
		getToken('hkg')
			.then(token => {
				if (token.length > 0) {
					this.makeRemoteRequest();
				} else {
					this.props.navigation.navigate('LoginHKG', { islogin: false })
					// Alert.alert(
					// 	'Thông báo',
					// 	'Bạn cần đăng nhập trước để xem',
					// 	[
					// 	  { text: 'Đồng ý', onPress: () => this.props.navigation.navigate('HomeHKG', {islogin: false}), cancelable: true },
					// 	]
					//   );
				}
			})

	}
	makeRemoteRequest = () => {
		this.refreshing.current.show()
		const { page, seed } = this.state;
		const url = appConfig.domain + `api/hop-khong-giay/getmobile?idtv=${this.state.idcn}&page=${this.state.page}&ngay=${this.state.date.getUTCDate()}&thang=${this.state.date.getMonth() + 1}&nam=${this.state.date.getFullYear()}&loai=1&txts=`
		this.setState({ loading: true });
		fetch(url, {
			method: 'GET',
			headers: {
				Token: 'rpNuGJebgtBEp0eQL1xKnqQG'
			},
		})
			.then(res => res.json())
			.then(res => {
				Utils.nlog('giá trị date mistin', url, res)
				this.refreshing.current.hide()
				res = res.data;
				this.setState({
					data: page === 0 ? res : [...this.state.data, ...res],
					error: res.error || null,
					loading: false,
					refreshing: false
				});
			})
			.catch(error => {
				this.setState({ error, loading: false });
			});
	};
	handleRefresh = () => {
		this.setState(
			{
				page: 0,
				refreshing: true
			},
			() => {
				this.makeRemoteRequest();
			}
		);
	};

	handleLoadMore = () => {
		this.setState(
			{
				page: this.state.page + 1
			},
			() => {
				this.makeRemoteRequest();
			}
		);
	};
	render() {
		const { navigate } = this.props.navigation;
		const viewnoitem = (
			<View style={{ alignItems: 'center', marginTop: 20 }}>
				<Text style={{ fontSize: 18, }}>Không có cuộc họp trong ngày</Text>
			</View>
		);
		const viewwithitem = (
			<FlatList
				onRefresh={this.handleRefresh}
				refreshing={this.state.refreshing}
				onEndReached={this.handleLoadMore}
				onEndReachedThreshold={0.5}
				data={this.state.data}
				renderItem={({ item }) =>
					<ItemCuocHop item={item} />
				}
			/>
		);
		const mainJSX = this.state.data ? viewwithitem : viewnoitem;
		return (
			<View style={nstyles.ncontainer}>
				<HeaderHKG
					onPressLeft={() => navigate(ConfigScreen.HomeHKG)}
					title={'Cuộc họp trong ngày'}
					iconLeft={Images.icBack}
				/>
				<SafeAreaView style={{ flex: 1 }}>
					{mainJSX}
				</SafeAreaView>
				<IsLoading ref={this.refreshing} />
			</View>

		);
	}

}
const st = StyleSheet.create({
	container: {
		flex: 1,
	},
	thanhphai: {
		flexDirection: 'row',
		padding: 0,
		justifyContent: 'flex-end',
	},
	thanhtrai: {

	},
	icon_thanh: {
		width: 30,
		height: 30,
		marginTop: 10,
		marginBottom: 10,
		marginRight: 10,
		marginLeft: 5,
	},
	bao: {
		flexDirection: 'row',
		padding: 5,
		borderBottomWidth: 0.5
	},
	bct: {
		flexDirection: 'row',
	},
	nd: {
		marginLeft: 10,
		flex: 1
	},
	td: {
		fontWeight: 'bold',
		color: 'black'
	},
	tdb: {
		fontWeight: 'bold',
		color: 'blue'
	},
	tdd: {
		fontWeight: 'bold',
		color: 'red'
	},
	bn: {
		marginTop: 2
	},
	bnd: {
		minHeight: 30
	},
	thu: {
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		overflow: 'hidden',
		height: 40,
		width: 60,
		backgroundColor: 'red',
	},
	ngay: {
		height: 40,
		width: 60,
		backgroundColor: 'white',
	},
	nam: {
		borderBottomLeftRadius: 5,
		borderBottomRightRadius: 5,
		overflow: 'hidden',
		height: 20,
		width: 60,
		backgroundColor: 'green',
	},
	textw: {
		textAlign: 'center',
		color: 'white'
	},
	textb: {
		textAlign: 'center',
		color: 'black'
	},
	icon: {
		width: 20,
		height: 20,
		marginTop: 5
	},
	ct: {
		marginTop: 0
	},
	txct: {
		marginLeft: 5,
		marginTop: 10,
		color: 'black',
		fontSize: 12,
	},
	icon_menu: {
		width: 30,
		height: 30,
		marginTop: 20,
		marginBottom: 0,
		marginRight: 10,
		marginLeft: 5,
	},
	thanh1: {
		backgroundColor: 'red',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: 5,
	},
	icon_menu: {
		width: 30,
		height: 30,
		marginBottom: 5,
		marginRight: 10,
		marginLeft: 5,
	},
});
