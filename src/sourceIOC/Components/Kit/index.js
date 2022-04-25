import {BaseButton,IconButton as BtnIcon
    ,IconSmallButton as ISButton,
    LargeFullButton as BTNLargeFull
} from './Buttons'
import TextKit,{Label as LabelText} from './Text';
import {Stack as StackKit} from './Stack';
import COLOR,{ButtonFit} from './Color';
import FitKit from './Fit';
import Bar,{HeaderBar} from './Status';
import {Dimensions,Platform} from 'react-native';
import FONT from './Font';
import TextInput,{MenuPicker} from './TextField';
import DividerComp from './Divider';
import Indicator from './ActivityIndicator';
import DashView  from './Dash';
import RadioBtn ,{CheckButton as CheckBtn} from './RadioButton';

export const Stack = StackKit;
export const Divider = DividerComp;
export const Text = TextKit;
export const Picker = MenuPicker;
export const Button = BaseButton;
export const IconButton = BtnIcon;
export const LargeFullButton = BTNLargeFull;
export const IconSmallButton = ISButton;
export const Color = COLOR;
export const ButtonColor = ButtonFit;
export const Fit = FitKit;
export const Label = LabelText;
export const StatusBar = Bar;
export const Screen = Dimensions.get('window');
export const Font = FONT;
export const TextField = TextInput;
export const HeaderBarStatus = HeaderBar;
export const IsIOS = Platform.OS === 'ios';
export const ActivityIndicator = Indicator;
export const Dash = DashView;
export const RadioButton = RadioBtn;
export const CheckButton = CheckBtn;
