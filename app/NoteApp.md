# ---- CẤU HÌNH SOURCE MỚI -----

[1]- Chuyển team IOS của target SourceCore , SourceCore-Test , Onesinal... => sang none

[2]- Đổi tên app, bundleId theo đúng chuẩn (hỏi anh Nhất trước khi đặt tên) chuyển version , build về 1.0

[2.1] IOS: Đổi tên app, bundleId theo đúng chuẩn (hỏi anh Nhất trước khi đặt tên) chuyển version , build về 1.0
[2.2] ANDROID: Đổi tên app, package theo đúng chuẩn (hỏi anh Nhất trước khi đặt tên) chuyển version , versionCode về 1.0

[3]- Đổi deeplink (Android,IOS), tên app, version, verIOS, verAndroid,... trong config.js

[4]- Đổi logo app IOS, android chú ý đổi backgrond launcher app của IOS và splash_screen của android,

[4.1] Android: phải export logo từ XD để vào trong các thư mục draw của android - (không biết hỏi lại)
[4.2] IOS: lên appicon.ios tick chọn 4 dòng export đầu trừ android để export icon
[4.3] Đổi logo import vào trong source: thư mục ImageApp và ImageComponent đối với ở ImageComponet iconApp phải tròn và không có nền vì nó dùng để làm modal loadingApp

[5]- Xem màu chủ đạo của app là gì để đổi trong redux, trong reducers file theme.js
[5.1] Mang màu ở key 1 xuống cuối và mang màu chủ đạo của app vào key 1 để thay thế
[5.2] Trong thư mục Theme.js 3 thuộc tính này có tác dụng thay đổi giao diện menu Home - có thể hỏi lại để chỉnh cho phù hợp với app
backGroundOnline: true,
imgHeaderMenu: true,
typeMenu: 2

[6]- Đổi imgSmartCity.jpg đối với menu dạng mới, (có thể đổi lại png - điều chỉnh trong index.js của thư mục Images), ngược lại đối menu dạng giống Tây Ninh Smart thì phải
vào XD export 2 ảnh với kích thước iphoneX và iphone 8 để phù hợp với các thiết bị với tên là imgBackgound (IphoneX) và imgBkgNoIphoneX (đối với Iphone 8)

# ------ CHÚ Ý -----

[7]- Đối với banner ở homedrawer nếu lỗi hãy đóng đoạn code banner lại và run app

[8]- Gắn codepush, onesignal có thể gắn sau cùng

[9]- Chú ý nếu gắn linkicon của menu thì phải lấy các icon tổng hợp lại gửi cho chị Dung -> lấy linkfull domain bỏ vào dataGlabal sau đó gửi lại nguyên objMenu cho chị Dung -> Mở code ở dòng code 114 ở HomeDrawer ra để sử dụng link icon động

[10]- Khi tách nhánh chú ý bundle: com.paht.caangiang.app (cập nhật inapp) đổi lại cho đúng bundle của từng nhánh

[11]- Chỉnh cài đặt lại (src/screens/CaiDat/index.js) chỉnh state lại khi tách nhánh là [4,7,6]

[12]- Comment lại Button dịch vụ công ở màn hình (src/screens/Personal/HomePersonal) từ dòng code [242->248]

# ------ THƯ VIỆN VLC MEDIA PLAYER ------

[1] FIX LỖI RUN & BUILD RELEASE
[+] Tắt Enable Bitcode [NO] ở SourceCore, SourceTest và Onesignal
[+] Bổ sung Other Linker Flags trong Build Setting [-Wl,-no_compact_unwind] ở SourceCore ,Onesignal (Của Target không phải của Project)
[+] Hạ version của SVG xuống 9.3.7 chỉ cần cài đè lên: npm i react-native-svg@9.3.7
[+++] Chỉnh sửa code trong node_module
[1.1] Tìm đến thư mực react-native-vlc-media-player
[1.2] Vào folder ios -> RCTVLCPlayerManager.m
[1.3] Chỉnh sửa đoạn code từ dòng 17 -> 25 thành như sau:
    RCT_EXPORT_VIEW_PROPERTY(onVideoProgress, RCTDirectEventBlock);
    RCT_EXPORT_VIEW_PROPERTY(onVideoPaused, RCTDirectEventBlock);
    RCT_EXPORT_VIEW_PROPERTY(onVideoStopped, RCTDirectEventBlock);
    RCT_EXPORT_VIEW_PROPERTY(onVideoBuffering, RCTDirectEventBlock);
    RCT_EXPORT_VIEW_PROPERTY(onVideoPlaying, RCTDirectEventBlock);
    RCT_EXPORT_VIEW_PROPERTY(onVideoEnded, RCTDirectEventBlock);
    RCT_EXPORT_VIEW_PROPERTY(onVideoError, RCTDirectEventBlock);
    RCT_EXPORT_VIEW_PROPERTY(onVideoOpen, RCTDirectEventBlock);
    RCT_EXPORT_VIEW_PROPERTY(onVideoLoadStart, RCTDirectEventBlock);
[1.4] Vào folder playerView -> VLCPlayerView.js -> dòng code 317 đổi thành if (diffTime > [1000->10000] )

[+] Vào folder playerView -> ControlBtn.js -> mở đoạn code đã bị comment từ dòng code 112->148 (Không làm điều này cũng được, chỉ cần khi sử dụng video tua được)


# ------ DÀNH CHO CAMERA CHẤM CÔNG TỪ JEEHR BÊ SANG ------
# ------ những file cài này nằm trong folder fileCaiCamera
[1] Tìm react-native-camera trong node - modules
 IOS : Cần sửa file RNCamera.m trong file ios --> RN 
 Android : cần sửa 3 file :
    [+] RNCameraView.java và RNCameraViewHelper.java: nằm trong android --> src --> main --> java --> org/reactnative --> camera
    [++]FacesDetectedEvent.java:  nằm trong android --> src --> main --> java --> org/reactnative --> camera --> events