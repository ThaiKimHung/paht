export type IChart = {
    title?:string,
    color:string[],
    data?:IRowChart[],
    fullData?:IRowChart[],
    isLoading?:boolean,
    isError?:boolean,
    isEmpty?:boolean,
    onLoadData?:any,
    chartType:string,
    minHeight?:number,
    leftTitle?:string,
    rightTitle?:string,
    middleTitle?:string
}

export type IRowChart = {
    ID?:number,
    percent?:number,
    title?:string,
    value?:string,
    color?:any,
    rootPercent?:number,
    leftPercent?:number,
    rightPercent?:number,
    leftValue?:string,
    rightValue?:string,
    leftTitle?:string,
    rightTitle?:string,
    middleValue?:number,
    middlePercent?:number
}
