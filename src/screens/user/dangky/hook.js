import apis from "../../../apis"
import { useState, useEffect } from "react";
import Utils from "../../../../app/Utils";

const useListDonVi = () => {
    const [refreshing, setrefreshing] = useState(true);
    const [data, setdata] = useState([]);
    const [error, seterror] = useState(false)
    const getData = async () => {
        Utils.setToggleLoading(true)
        let res = await apis.ApiUser.DS_DonViTNH();
        Utils.setToggleLoading(false)
        setrefreshing(false)
        if (res.status == 1 && res.data) {
            setdata(res.data.data || [])
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
    useListDonVi
}