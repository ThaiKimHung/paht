import {
    createStackNavigator,
    createBottomTabNavigator,
    createSwitchNavigator,
    createDrawerNavigator
} from 'react-navigation';
import { Easing, Animated } from 'react-native';
import TabBarChat from './Container/TabBarChat';
import RoomChat from './RoomChat/RoomChat';
import Search from './Search/Search';
import AddGroupChat from './Groupchat/AddGroupChat';
import HomeChat from './HomeChat';
import DanhSachKB from './DanhBa/DanhSachKB';
import HomeDanhBa from './DanhBa/HomeDanhBa';
import KetBan from './DanhBa/KetBan';
import ModalAction from './RoomChat/ModalAction';
import ModalEditMember from './RoomChat/ModalEditMember';
import ModalinPut from './RoomChat/ModalinPut';
import ChuyenTruongNhom from './RoomChat/ChuyenTruongNhom';
import ThongTinNhom from './RoomChat/ThongTinNhom';
import ModalFileChat from './RoomChat/ModalFileChat';
import StackImageShow from './Component/StackImageShow';
import PlayVideo from './Component/PlayVideo';
import PlaySound from './Component/PlaySound';
import PDFExample from './Component/PDFExample';
import stackFile from './Component/stackFile';
import MediaPickerChat from './Component/MediaPickerChat';
import ViewImage from './Component/ViewImage';
import ViewVideo from './Component/ViewVideo';
import TakeCameraChat from './Component/TakeCameraChat';
import ModalIconChat from './RoomChat/ModalIconChat';
import ModalChuyenTiepTin from './RoomChat/ModalChuyenTiepTin';

const ChatStack = createStackNavigator(
    {
        sc_HomeChat: {
            screen: HomeChat,
            path: 'room/:IdGroup'
        },
        sc_Search: {
            screen: Search,
            navigationOptions: {
                header: null,
                animationEnabled: true
            }
        },
        sc_addGroup: AddGroupChat,
        sc_RoomChat: {
            screen: RoomChat,

            path: 'group/:IdGroup'
        },
        sc_DSKetBan: DanhSachKB

        // Modal_XacMinhPAHT: ModalXacMinhPA,
    },
    {
        headerMode: 'none'
    }
);
const DanhBaStack = createStackNavigator(
    {
        sc_DanhBa: HomeDanhBa,
        sc_KetBan: {
            path: 'ketban',
            screen: KetBan
        },
        sc_DSKetBan: {
            path: 'dsketban',
            screen: DanhSachKB
        },
    },
    {
        headerMode: 'none'
    }
);
ChatStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible
    };
};
const BottomNavigatior = createBottomTabNavigator(
    {
        sc_MainChat: {
            screen: ChatStack,
            path: 'chat'
        },
        sc_MainDanhBa: {
            screen: DanhBaStack,
            path: 'danhba',

        }
    },
    {
        initialRouteName: 'sc_MainChat',
        swipeEnabled: false,
        animationEnabled: true,
        lazy: true,
        tabBarComponent: TabBarChat
    }
);
const ChatMain = createStackNavigator(
    {
        Main: {
            screen: BottomNavigatior,
            path: 'bottomchat'
        },
        modal_Edit: ModalAction,
        modal_EditMember: ModalEditMember,
        modal_InPut: ModalinPut,
        sc_ChuyenTruongNhom: ChuyenTruongNhom,
        sc_ThongTinNhom: ThongTinNhom,
        Modal_FileChat: ModalFileChat,
        StackImageShow: StackImageShow,
        modal_playVideo: PlayVideo,
        Modal_PlaySound: PlaySound,
        Modal_PDFExample: PDFExample,
        Modal_stackFile: stackFile,
        Modal_MediaPickerChat: MediaPickerChat,
        Modal_ViewImage: ViewImage,
        Modal_ViewVideo: ViewVideo,
        Modal_TakeCameraChat: TakeCameraChat,
        Modal_IconChat: ModalIconChat,
        Modal_ChuyenTiepTin: ModalChuyenTiepTin,
        //-- Khai bao modal khong co Animations
    },
    {
        mode: 'modal',
        headerMode: 'none',
        navigationOptions: {
            header: null,
            animationEnabled: true,
            tabBarVisible: false,
        },
        transitionConfig: () => ({
            containerStyle: {
                backgroundColor: 'transparent'
            },
            transitionSpec: {
                duration: 0,
                timing: Animated.timing,
                easing: Easing.step0
            }
        }),
        transparentCard: true,

        cardStyle: {
            backgroundColor: 'transparent',
            opacity: 1
        }
    }
);
export default ChatMain