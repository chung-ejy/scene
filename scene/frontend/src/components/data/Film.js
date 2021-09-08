import React, {useContext} from 'react'
import DataContext from '../../context/data/dataContext'

const Film = ({data}) => {
    const {youtubeId,title} = data
    const dataContext = useContext(DataContext)
    const { postSentiment } = dataContext
    const onSentiment = (e) =>{
        e.preventDefault()
        const pack = data
        console.log(data)
        pack["sentiment"] = e.target.name
        postSentiment(pack)
    }
    return (
        <div className="card card-body mt-4 mb-4">
            <div style={{height:"100%"}}class="row text-center">
            <div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" src={`https://www.youtube.com/embed/${youtubeId}?rel=0`} allowFullScreen></iframe>
            </div>
            </div>
            <div className="row">
                <h5 class="card-title text-center mb-1">
                    {title}
                </h5>
            </div>
            <div className="row">
            <table className="table table-responsive-sm">
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
            <div className="row mt-2">
                <form className="col" onSubmit={onSentiment} name="like">
                    <div className="form-group col">
                        <button type="submit" name="like" class="btn btn-primary form-control bg-info">Like</button>
                    </div>
                </form>
                <form className="col" onSubmit={onSentiment} name="dislike">
                    <div className="form-group col">
                        <button type="submit" name="dislike" class="btn btn-primary form-control bg-danger">Dislike</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Film
