import {MapViewType} from './Reducer/MapView';
import {Type as PanelInfo} from './Reducer/PanelInfo';
import {Type as HienTrang} from './Reducer/HienTrang';
import {Type as QuyHoach} from './Reducer/QuyHoach'
import {Type as QuyHoachPanel} from './Reducer/PanelQuyHoach';

const Type = {
    'SHOW_THUA_DAT':'SHOW_THUA_DAT',
    'SHOW_QUY_HOACH':'SHOW_QUY_HOACH',
    'SET_ACTIVE_LAYER':'SET_ACTIVE_LAYER',
    'SET_SATELLITE_MODE':'SET_SATELLITE_MODE',
    'SET_USER_INFO':'SET_USER_INFO',
    'SET_TOKEN':'SET_TOKEN',
    "MAP_VIEW":MapViewType,
    "PANEL_INFO":PanelInfo,
    'HIEN_TRANG':HienTrang,
    "QUY_HOACH":QuyHoach,
    "QUY_HOACH_PANEL":QuyHoachPanel
}

export default Type;
