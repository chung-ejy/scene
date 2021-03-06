import { GET_GENRES, SET_FILM, POST_SENTIMENT,GET_DATA, SET_LOADING, STOP_LOADING, SET_ERROR, CLEAR_ERROR } from "./types";
import React, { useReducer } from "react";
import DataContext from "./dataContext"
import dataReducer from "./dataReducer"
import axios from "axios"

const DataState = props => {
    const initialState = {
        title: "Scene",
        data: {"movie_title":"",
                "director":"",
                "genre":"",
                "rating":4.45,
                "youtubeId":"",
                "imageId":"",
                "search":"",
                "films":[]},
        error:null,
        loading:false,
        genres:[]
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
        axios.post(`/api/search/`,data).then(res=>{
            dispatch({
                type:GET_DATA,
                payload:res.data
            })
        }).catch(err => {
            stopLoading()
            setError(err.message,"danger")
        });
    }

    const getGenres = () => {
        setLoading()
        axios.get(`/api/genres/`).then(res=>{
            dispatch({
                type:GET_GENRES,
                payload:res.data.genres
            })
        }).catch(err => {
            stopLoading()
            setError(err.message,"danger")
        });
    }

    const setFilm = (selection) => {
        setLoading()
            dispatch({
                type:SET_FILM,
                payload:selection
            });
    }

    const postSentiment = (info) => {
        setLoading()
        axios.post(`/api/data/`,info).then(res=>{
            dispatch({
                type:POST_SENTIMENT,
                payload:res.data,
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
            genres:state.genres,
            setError,
            setTitle,
            setText,
            getData,
            postSentiment,
            setFilm,
            getGenres
        }}>
            {props.children}
        </DataContext.Provider>
    )
}
export default DataState;