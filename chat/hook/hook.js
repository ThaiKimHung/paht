import { useState, useEffect } from "react";
import apiChat from '../api/apis';
import Utils from "../../app/Utils";

const useSoThongBao = () => {
    const [refreshing, setrefreshing] = useState(true);
    const [data, setdata] = useState(0);
    const [error, seterror] = useState(false)
    const getData = async () => {
        // Utils.setToggleLoading(true)
        let res = await apiChat.DemSoTinNhanChuaXem();
        Utils.nlog("[tin chưa đọc]", res)
        // Utils.setToggleLoading(false)
        setrefreshing(false)
        if (res.status == 1 && res.data) {
            setdata(res.data || 0)
        } else {
            seterror(true);
        }
    }
    useEffect(() => {
        getData();
    }, [])
    // DS_DonViTNH
    return {
        data,
        refreshing,
        error
    }
}
export {
    useSoThongBao
}