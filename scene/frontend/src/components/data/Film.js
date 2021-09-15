import React, {useContext,useState, useEffect} from 'react'
import DataContext from '../../context/data/dataContext'
import axios from "axios"
const Film = ({data}) => {
    const {youtubeId,imageId,title,films} = data
    const dataContext = useContext(DataContext)
    const { postSentiment } = dataContext
    const [state,setState] = useState({...data,["sentiment"]:""})
    const { sentiment } = state
    const onSubmit = (e) => {
        e.preventDefault()
        if (state.sentiment != "") {
            postSentiment(state)
        }

    }
    const onSentiment = (e) =>{
        e.preventDefault()
        setState({...state,["sentiment"]:e.target.name})
    }
    return (
        <div className="card card-body mt-4 mb-4">
            <div style={{height:"100%"}}class="row text-center">
            {youtubeId != "" ?
                <div class="col embed-responsive embed-responsive-16by9 text-center">
                <iframe class="embed-responsive-item" src={`https://www.youtube.com/embed/${youtubeId}?rel=0`} allowFullScreen></iframe>
            </div> : imageId != ""?             <div className="col">
                <img src={imageId} class="img-fluid text-center" alt="..."/>
            </div> : <div></div>}
            </div>
            <div className="row">
                <h5 class="card-title text-center mb-1">
                    {title}
                </h5>
            </div>
            <div className="row">
            <table className="col table table-responsive-sm">
                <tbody>
                    {["movie_title","director","rating","genre"].map(key => (
                        <tr>
                            <td>{key.replace("_"," ")}</td>
                            <td>{data[key]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
{films.length > 0 ?            <div className="row mt-2">
                <form className="col" onSubmit={onSentiment} name="like">
                    <div className="form-group col">
                        <button type="submit" name="like" class={`btn btn-primary form-control ${sentiment != "like" ? "bg-info" : "bg-danger"}`}>Like</button>
                    </div>
                </form>
                <form className="col" onSubmit={onSentiment} name="dislike">
                    <div className="form-group col">
                        <button type="submit" name="dislike" class={`btn btn-primary form-control ${sentiment != "dislike" ? "bg-info" : "bg-danger"}`}>Dislike</button>
                    </div>
                </form>
                <form className="col" onSubmit={onSubmit} name="dislike">
                    <div className="form-group col">
                        <button type="submit" name="Send Data" class="btn btn-primary form-control bg-danger">Send Data</button>
                    </div>
                </form>
            </div>: <div></div>}
        </div>
    )
}

export default Film
