import Utils from "../../../../../app/Utils";


export const onUpdateAvatar = (refLoading, callback) => {
    let options = {
        assetType: 'Photos',//All,Videos,Photos - default
        multi: false,// chọn 1 or nhiều item
        response: res => callback(res), // callback giá trị trả về khi có chọn item
        limitCheck: -1, //gioi han sl media chon: -1 la khong co gioi han, >-1 la gioi han sl =  limitCheck
        groupTypes: 'All',
        showTakeCamera: true,
        // colorPicker: [colors.greenGov, colors.greenGov],
        // typeCamera: 1
    }
    Utils.navigate('Modal_MediaPicker', options);

}
// export const responseChooseAvata = async (res, refLoading, callback) => {
//     if (res.iscancel) {
//         // Utils.nlog('--ko chon item or back');
//         return;
//     }
//     else if (res.error) {
//         // Utils.nlog('--lỗi khi chon media');
//         return;
//     }
//     else {
//         //--dữ liệu media trả về là 1 item or 1 mảng item
//         //--Xử lý dữ liệu trong đây-----
//         Utils.nlog('Hinh da chon', res);
//         //Call API update Avatar
//         refLoading?.current?.show()
//         let resUpdateAvata = await apis.ApiGov.updateAvata(res[0])
//         refLoading?.current?.hide()
//         Utils.nlog('[LOG] res update', resUpdateAvata);
//         if (resUpdateAvata.code == 200 && resUpdateAvata?.data) {
//             Toast.show(resUpdateAvata?.message, Toast.SHORT)
//             const { userGov } = store.getState().auth
//             store.dispatch(SetUserApp(AppCodeConfig.APP_GOV, { ...userGov, user: resUpdateAvata?.data }))
//             callback(true)
//         } else {
//             Toast.show(resUpdateAvata?.message, Toast.SHORT)
//             callback(false)
//         }
//     }
// };

