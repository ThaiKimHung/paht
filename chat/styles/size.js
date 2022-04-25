
import {
  Platform
} from 'react-native';

export const isPad = Platform.isPad && Platform.OS == 'ios';

let ratioText = isPad ? 1.2 : 1;
let ratioImg = isPad ? 1 : 1;

//Dùng để thay đổi kich thước Text tự động trên các thiết bị khác nhau
function reText(size = 14) {
  return size * ratioText;
}

//Dùng để thay đổi kich thước: height, with, margin, padding,... tự động trên các thiết bị khác nhau
function reSize(size = 0) {
  return size * ratioImg;
}

let sizes = {
  //font size text
  sText9: 9 * ratioText,
  sText8: 8 * ratioText,
  sText10: 10 * ratioText,
  sText11: 11 * ratioText,
  sText12: 12 * ratioText,
  sText13: 13 * ratioText,
  sText14: 14 * ratioText,
  sText15: 15 * ratioText,
  sText16: 16 * ratioText,
  sText17: 17 * ratioText,
  sText18: 18 * ratioText,
  sText19: 19 * ratioText,
  sText20: 20 * ratioText,
  sText22: 22 * ratioText,
  sText24: 24 * ratioText,
  sText26: 26 * ratioText,
  sText27: 27 * ratioText,
  sText28: 28 * ratioText,
  sText30: 30 * ratioText,
  sText32: 32 * ratioText,
  sText33: 33 * ratioText,
  sText36: 36 * ratioText,
  sText40: 40 * ratioText,
  sText54: 54 * ratioText,

  //img size
  nImgSize4: 4 * ratioImg,
  nImgSize5: 5 * ratioImg,
  nImgSize6: 6 * ratioImg,
  nImgSize7: 7 * ratioImg,
  nImgSize8: 8 * ratioImg,
  nImgSize9: 9 * ratioImg,
  nImgSize10: 10 * ratioImg,
  nImgSize11: 11 * ratioImg,
  nImgSize12: 12 * ratioImg,
  nImgSize13: 13 * ratioImg,
  nImgSize14: 14 * ratioImg,
  nImgSize15: 15 * ratioImg,
  nImgSize16: 16 * ratioImg,
  nImgSize17: 17 * ratioImg,
  nImgSize18: 18 * ratioImg,
  nImgSize19: 19 * ratioImg,
  nImgSize20: 20 * ratioImg,
  nImgSize21: 21 * ratioImg,
  nImgSize22: 22 * ratioImg,
  nImgSize24: 24 * ratioImg,
  nImgSize25: 25 * ratioImg,
  nImgSize26: 26 * ratioImg,
  nImgSize27: 27 * ratioImg,
  nImgSize28: 28 * ratioImg,
  nImgSize29: 29 * ratioImg,
  nImgSize30: 30 * ratioImg,
  nImgSize31: 31 * ratioImg,
  nImgSize32: 32 * ratioImg,
  nImgSize34: 34 * ratioImg,
  nImgSize35: 35 * ratioImg,
  nImgSize38: 38 * ratioImg,
  nImgSize40: 40 * ratioImg,
  nImgSize41: 41 * ratioImg,
  nImgSize42: 42 * ratioImg,
  nImgSize44: 44 * ratioImg,
  nImgSize48: 48 * ratioImg,
  nImgSize50: 50 * ratioImg,
  nImgSize56: 56 * ratioImg,
  nImgSize58: 58 * ratioImg,
  nImgSize60: 60 * ratioImg,
  nImgSize63: 63 * ratioImg,
  nImgSize65: 65 * ratioImg,
  nImgSize70: 70 * ratioImg,
  nImgSize72: 72 * ratioImg,
  nImgSize75: 75 * ratioImg,
  nImgSize78: 78 * ratioImg,
  nImgSize80: 80 * ratioImg,
  nImgSize81: 81 * ratioImg,
  nImgSize88: 88 * ratioImg,
  nImgSize90: 90 * ratioImg,
  nImgSize94: 94 * ratioImg,
  nImgSize104: 104 * ratioImg,
  nImgSize116: 116 * ratioImg,
  nImgSize120: 120 * ratioImg,
  nImgSize122: 122 * ratioImg,
  nImgSize125: 125 * ratioImg,
  nImgSize136: 136 * ratioImg,
  nImgSize137: 137 * ratioImg,
  nImgSize140: 140 * ratioImg,
  nImgSize152: 152 * ratioImg,
  nImgSize187: 187 * ratioImg,
  nImgSize291: 291 * ratioImg,
  nImgSize310: 310 * ratioImg,
  nImgSize350: 350 * ratioImg,
  nImgSize390: 390 * ratioImg,
}

export { sizes, reText, reSize };
