import React, {useContext,useState } from 'react'
import DataContext from '../../context/data/dataContext'
const Film = () => {
    const dataContext = useContext(DataContext)
    const { data,postSentiment } = dataContext
    const [state,setState] = useState({...data,["sentiment"]:"",["show_starring"]:false})
    const { sentiment ,show_starring} = state
    const {youtubeId,imageId,title,films} = data
    const onSentiment = (e) =>{
        e.preventDefault()
        setState({...state,["sentiment"]:e.target.name})
        if (state.sentiment != "") {
            postSentiment(state)
        }
    }

    const clickStarring = (e) =>{
        e.preventDefault()
        setState({...state,["show_starring"]:!show_starring})
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
{            data["movie_title"] != "" ? <table className="col table table-responsive-sm">
                <tbody>
                    {["movie_title","director","rating","genre"].map(key => (
                        <tr key={key}>
                            <td>{key.replace("_"," ")}</td>
                            <td style={{wordWrap:"break-word"}}>{data[key]}</td>
                        </tr>
                    ))}
                    <tr key={"starring"}>
                    <td>starring</td>
                    <td><form className="col" onSubmit={clickStarring}>
                    <div className="form-group col">
                        <button className="text-primary" style={{background: "none",
                                        border: "none",
                                        padding: "0",
                                        textDecoration:"underline",
                                        font: "inherit",
                                        cursor: "pointer",
                                        outline: "inherit"}}type="submit">
                        {show_starring ? data["starring"]:<i class="fas fa-plus-circle fx-3"></i>}
                        </button>
                    </div>
                    </form>
                    </td>
                </tr>
                </tbody>
            </table> : <div></div>}
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
