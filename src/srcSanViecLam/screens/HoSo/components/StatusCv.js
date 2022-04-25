


// TypeCV // loại cv  học sinh 0 ||  người lao động 1
// TypePerson // // hình thức làm việc Toàn thời gian 0   /Bán thời gian 1

export function StatusHinhThucLamViec(value) {
    console.log('gia tri value truyen xun', value)
    switch (value) {
        case 0:
            return 'Toàn thời gian';
        case 1:
            return 'Bán thời gian';
        default:
            return ''
    }

}

export function StatusHinhThucLamViecId(value) {
    switch (value) {
        case 'Toàn thời gian':
            return 0;
        case 'Bán thời gian':
            return 1;
        default:
            return ''
    }
}

export function StatusNguoiLaoDong(value) {
    switch (value) {
        case 1:
            return 'Người lao động';
        case 0:
            return 'Học sinh, sinh viên';
        default:
            return -1;
    }
}

export function StatusNguoiLaoDongId(value) {
    switch (value) {
        case 'Người lao động':
            return 1;
        case 'Học sinh, sinh viên':
            return 0;
        default:
            return -1;
    }
}
