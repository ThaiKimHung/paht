export interface Unit {
    ID:number,
    Name:string
}

interface Nam {
    DanhSach:Unit[],
    Chon:number
}

interface Thang {
    DanhSach:Unit[],
    Chon:number[],
    IsAll:boolean
}

export interface LastOption {
    Thang:number[],
    Nam:number,
    DonVi:number[],
    Option?:number
}

export interface OptionState {
    TypeOption:?number,
    Nam:Nam,
    Thang:Thang,
    DonVi:Thang,
    TimeTitle:string,
    DonViTitle:string,
    LastOption:LastOption
}
