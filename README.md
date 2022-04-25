

# ---- [Rules] Thực hiện khi code  ----

- [Hight]RootScreen.js là screen quan trọng, chứa setup notifi, đa ngôn ngữ,... có thể dùng để làm Flash Screen.
- [Hight]Màu, size Text, size Image phải được khai báo trong folder styles và gọi ra dùng.
- [Hight]Image icon khi add vào thì khai báo trong images/index.js và gọi ra dùng.
- [Hight]Các key khi sử dụng AsyncStore phải được khai báo trong app/data/keys/keyStore.js.
- [Hight]Các hàm API phải được viết riêng trong apis/... và gọi ra dùng. (đang xây dựng)

- [Medium]Chú ý App config được khai báo và gọi trong app/Config.js
- [Medium]Chú ý Utils là nơi khai bao những hàm thông dụng, cần phải xem trước.
- [Medium]nstyles là những styles chung. Tuỳ vào mỗi app thì sửa lại cho phù hợp và dùng
- [Medium]Code phải comment rõ ràng. 
- [Medium]Mỗi dòng code quá dài thì phải xuống dòng.
- [Medium]Giao diện chức năng tương tự cần phải tách ra components và gọi lại.

- [Slow]Sử dụng Utils.nlog() thay cho Utils.nlog()
----
* Những điều cần phải thực khi code trong Soucre Core này.
* Mọi người có thể đóng góp nếu thấy những điều bất cập về Rules



# ---- [Tips] - Có thể bạn chưa biết? ----

- nColors trong styles sẽ khai báo những tông màu chính của app, để dễ dàng thay đổi khi nhân lên.

- Nhánh Core(brand SoucreCore)[new] được tạo ra nhằm tối ưu source, tạo sẵn khung sườn cho coder, 
có những sẵn những component custom. Đơn giản cho dev mới khi code.

- [Thủ thuật] Mẹo code giúp tối ưu hiệu suất ứng dụng RN.
link: https://codeburst.io/6-simple-ways-to-speed-up-your-react-native-app-d5b775ab3f16

- Source Core có các components riêng: Chụp Camera, Quay video, Chọn Ảnh/Video từ Thư viện, ...

- Source Core có Alert custom. IOS,Android giống nhau. Xem showMsgBoxOK, showMsgBoxYesNo trong Utils

- Những file, folder có chữ ...Demo là những code mẫu của nhánh Core - brand SourceCore
----
* Những điều bạn biết có thể người khác không biết.
* Những mẹo, thủ thuật từ các nguồn link. Suy nghĩ của bạn về RN, code,... 
* Có gì hay thì mọi người thể đóng góp nha :))



# ---- [Contributor] Đóng góp Core (brand SourceCore) ----
- Tien Nhat
----
* Rất mong nhận ý kiến đóng góp để hoàn thiện phát triển Core.



# ---- [Notes] Ghi chú ----
- Mọi thành viên team Mobi VTS cần phải đọc qua các [Rules] trước khi code. Và phải cần đọc thêm [Tips] 


