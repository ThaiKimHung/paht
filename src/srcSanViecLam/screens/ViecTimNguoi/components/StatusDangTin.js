
export function StatusLoaiDoanhNghiepId(value) {
    switch (value) {
        case 'Doanh nghiệp, công ty':
            return 0;
        case 'Cá nhân':
            return 1;
        default:
            return -1;
    }
}

export function StatusLoaiDoanhNghiep(value) {
    switch (value) {
        case 0:
            return 'Doanh nghiệp, công ty';
        case 1:
            return 'Cá nhân';
        default:
            return '';
    }
}