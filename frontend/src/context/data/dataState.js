import { POST_SENTIMENT,GET_DATA, SET_LOADING, STOP_LOADING, SET_ERROR, CLEAR_ERROR } from "./types";
import React, { useReducer } from "react";
import DataContext from "./dataContext"
import dataReducer from "./dataReducer"
import axios from "axios"

const DataState = props => {
    const initialState = {
        title: "Scene",
        data: {"movie_title":"Guardians of the Galaxy","director":"James Gunn","genre":"Action & Adventure","rating":90,"youtubeId":"d96cjJhvlMA","films":[]},
        error:null,
        loading:false
    }

    const [state,dispatch] = useReducer(dataReducer,initialState)

    const setError = (msg,type) => {
        dispatch({
            type:SET_ERROR,
            payload: {msg,type}
        })
        setTimeout(()=> {
            clearError()
        },5000);
    }
    const clearError = () => {
        dispatch({
            type:CLEAR_ERROR
        });
    }

    const setLoading = () => {
        dispatch({
            type:SET_LOADING
        });
    }
    
    const stopLoading = () => {
        dispatch({
            type:STOP_LOADING
        });
    }

    const setTitle = (title) => {
        dispatch({
            type:SET_TITLE,
            payload: title
        });
    }

    const setText = (text) => {
        dispatch({
            type:SET_TEXT,
            payload: text
        });
    }

    const getData = (data) => {
        setLoading()
        axios.post(`/api/`,data).then(res=>{
            dispatch({
                type:GET_DATA,
                payload:res.data
            })
        }).catch(err => {
            stopLoading()
            setError(err.message,"danger")
        });
    }
    const postSentiment = (data) => {
        setLoading()
        axios.post(`/api/data/`,data).then(res=>{
            dispatch({
                type:POST_SENTIMENT,
            })
        }).catch(err => {
            stopLoading()
            setError(err.message,"danger")
        });
    }

    return (
        <DataContext.Provider value={{
            data:state.data,
            loading:state.loading,
            error:state.error,
            title:state.title,
            text:state.text,
            setError,
            setTitle,
            setText,
            getData,
            postSentiment
        }}>
            {props.children}
        </DataContext.Provider>
    )
}
export default DataState;