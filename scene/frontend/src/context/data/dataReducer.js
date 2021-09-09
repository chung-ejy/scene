import { GET_GENRES, SET_FILM, GET_DATA, SET_LOADING, STOP_LOADING, SET_ERROR, CLEAR_ERROR , POST_SENTIMENT} from "./types";
export default(state,action) => {
    switch(action.type) {
        case SET_ERROR:
            return {
                ...state,
                error: {msg:"rekt",type:"big sadge"},
                data:{"movie_title":"Guardians of the Galaxy","director":"James Gunn","genre":"Action & Adventure","rating":4.6,"youtubeId":"d96cjJhvlMA","films":[]},
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error:null
            }
        case SET_LOADING:
            return {
                ...state,
                loading:true
            }
        case GET_DATA:
            return {
                ...state,
                data:action.payload,
                loading:false
            }
        case GET_GENRES:
            return {
                ...state,
                genres:action.payload,
                loading:false
            }
        case SET_FILM:
            return {
                ...state,
                data:action.payload,
                loading:false
            }
        case POST_SENTIMENT:
                return {
                    ...state,
                    loading:false
            }
    }
}