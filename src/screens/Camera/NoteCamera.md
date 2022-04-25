# ---- [Lưu ý trước khi build app] ----


---------------[ANDROID]------------------

Mở theo đường dẫn sau : 

 -> node_module/react-native-camera/android/src/main/java/org/camera 

Thay thế [RNCameraView.java] [RNCameraViewHelper.java] trong node_module bằng file có sẵn trong thư mục FileReplace 

Tiếp sau đó <!--  CŨNG LÀ ĐƯỜNG DÃN ĐÓ  --> mở thư mục event , thay thế [FaceDetectionEvent.java] trong node_module bằng file có sẵn trong thư mục FileReplace 

---------------[IOS]------------------

Mở theo đường dẫn sau : 
 -> node_module/react-native-camera/ios/RN 

 Thay thế [RNCamera.m] trong node_module bằng file có sẵn trong thư mục FileReplace 


Lưu ý : npm lại không cần chỉnh , đổi nhánh không cần chỉnh , chỉ chỉnh khi nào DELETE thôi .

Hihi mãi yêu mọi người