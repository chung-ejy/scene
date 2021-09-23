import React, {useContext,useState } from 'react'
import DataContext from '../../context/data/dataContext'
const Film = () => {
    const dataContext = useContext(DataContext)
    const { data,postSentiment } = dataContext
    const [state,setState] = useState({...data,["sentiment"]:""})
    const { sentiment } = state
    const {youtubeId,imageId,title,films} = data
    const onSentiment = (e) =>{
        e.preventDefault()
        setState({...state,["sentiment"]:e.target.name})
        if (state.sentiment != "") {
            postSentiment(state)
        }
    }
    return (
        <div className="card card-body mt-4 mb-4">
            <div style={{height:"100%"}}className="row text-center">
            {youtubeId != "" ?
            <div className="col d-none d-lg-block embed-responsive embed-responsive-16by9 text-center">
                <iframe style={{minWidth:"800px",minHeight:"360px"}} className="embed-responsive-item" src={`https://www.youtube.com/embed/${youtubeId}?rel=0`} allowFullScreen></iframe>
            </div>
        : imageId != ""?             <div className="col">
                <img src={imageId} className="img-fluid text-center" alt="..."/>
            </div> : <div></div>}
            </div>
            <div className="row">
                <h5 className="card-title text-center mb-1">
                    {title}
                </h5>
            </div>
            <div className="row">
            <table className="col table table-responsive-sm">
                <tbody>
                    {["movie_title","director","rating","genre"].map(key => (
                        <tr key={key}>
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
                        <button type="submit" name="like" className={`btn btn-primary form-control ${sentiment != "like" ? "bg-info" : "bg-danger"}`}>Like</button>
                    </div>
                </form>
                <form className="col" onSubmit={onSentiment} name="dislike">
                    <div className="form-group col">
                        <button type="submit" name="dislike" className={`btn btn-primary form-control ${sentiment != "dislike" ? "bg-info" : "bg-danger"}`}>Dislike</button>
                    </div>
                </form>
            </div>: <div></div>}
        </div>
    )
}

export default Film
