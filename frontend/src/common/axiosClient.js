import axios from "axios";
import { retrieveCache } from "./helpers";
import { BACKEND_URL } from "./constants";

const request = async (config, jwt) => {
    if(jwt === undefined)
        jwt = retrieveCache('jwt');
    try{
        const res = await axios.request({
            baseURL: BACKEND_URL,
            headers:{
                "Authorization":`${jwt}`
            },
            ...config
        })
        return res.data;
    }
    catch(error){
        throw error.response ? error.response.data.error : error.message;
    }
}

// Helper function to format dates for API requests
const formatDateForApi = (date) => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString();
};

export const signupApi = async (params)=>{
    return await request({
        method:"POST",
        url: "/signup",
        data: params
    })
}

export const loginApi = async (params)=>{
    return await request({
        method:"POST",
        url: "/login",
        data: params
    })
}

export const getAllParkingAreasApi = async () => {
    return await request({
        method: "GET",
        url: "/parking-areas"
    })
}

export const getNearbyParkingAreasApi = async (radius, lat, lng) => {
    return await request({
        method: "GET",
        url: `/parking-areas?radius=${radius}&lat=${lat}&lng=${lng}`
    });
}

export const getBookingsApi = async (parkingAreaId, startTime, endTime) => {
    return await request({
        method: "GET",
        url: `/bookings/${parkingAreaId}/${formatDateForApi(startTime)}/${formatDateForApi(endTime)}`,
    })
}

export const getAllBookingsApi = async () => {
    return await request({
        method: "GET",
        url: "/bookings",
    })
}

export const bookSlotApi = async (params) => {
    const formattedParams = {
        ...params,
        startTime: formatDateForApi(params.startTime),
        endTime: formatDateForApi(params.endTime)
    };
    
    return await request({
        method: "POST",
        url: "/bookings",
        data: formattedParams
    });
}

export const confirmSuccessfulPaymentApi = async (sessionId) => {
    return await request({
        method: "GET",
        url: "/bookings/confirmPayment?sessionId=" + sessionId,
    });
}

export const createParkingAreaApi = async (params) => {
    return await request({
        method: "POST",
        url: "/parking-areas",
        data: params
    });
}

export const updateParkingAreaApi = async (params) => {
    return await request({
        method: "PUT",
        url: "/parking-areas/"+params._id,
        data: params
    });
}

export const deleteParkingAreaApi = async (id) => {
    return await request({
        method: "DELETE",
        url: "/parking-areas/"+id,
    });
}
