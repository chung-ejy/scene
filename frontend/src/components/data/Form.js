import React, { useContext,useState } from 'react'
import DataContext from '../../context/data/dataContext'

const Form = ({data,loading}) => {
    const dataContext = useContext(DataContext)
    const {getData,postSentiment} = dataContext
    const {rating,director,genre,movie_title,sentiment} = data
    const [state,setState] = useState({"movie_title":movie_title,
                                    "rating":rating,"director":director,
                                    "genre":genre,"youtubeId":data.youtubeId,
                                    "films":[],
                                    "user_films":data.films,
                                    "user_rating":0,
                                    "user_youtubeId":data.youtubeId})
    const {user_films,youtubeId} = state
    const onRatingChange = (e) =>{
        setState({...state,[e.target.name]:e.target.value})
    }
    const onChange = (e) => {
        setState({...state,[e.target.name]:e.target.value});
        console.log(state)
    }
    const onSubmit = (e) => {
        e.preventDefault()
        getData(state)
        setState({...data})
    }
    const onSentiment = (e) =>{
        e.preventDefault()
        setState({...state,["sentiment"]: e.target.name})
        postSentiment(state)
    }

    const onSelect = (e) =>{
        e.preventDefault()
        console.log(e.target.name)
        const selection = user_films.filter(film => e.target.name == film["movie_title"])[0]
        setState({...state,"movie_title":selection["movie_title"],"genre":selection["genre"],"director":selection["director"],"youtubeId":selection["youtubeId"]})
    }

    return (
        <div className="card card-body mt-4 mb-4">
            <div class="embed-responsive embed-responsive-16by9 w-100 h-100 text-center">
                <iframe style = {{style:"flex-grow"}}class="embed-responsive-item" src={`https://www.youtube.com/embed/${youtubeId}?rel=0`} allowFullScreen></iframe>
            </div>
            <h5 class="card-title text-center mb-1">
                {data.title}
            </h5>
            <table className="table table-responsive-sm">
                <tbody>
                    {["movie_title","director","rating","genre"].map(key => (
                        <tr>
                            <td>{key}</td>
                            <td>{state[key]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={onSubmit}>
                {Object.keys(state).map(key =>(
                    key == "genre" || key == "director" || key == "rating"? 
                    <div className="form-group">
                        <input onChange={onChange} className="form-control" 
                        name={key} placeholder={key} type={"text"} value={state[key]} />
                    </div> : <div></div>
                ))}
                <div className="form-group">
                    <button type="submit" class="btn btn-primary form-control">Recommend</button>
                </div>
            </form>
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
            <div className="card card-body mt-4 mb-4">
               <form>
                    <div className="form-group">
                        <input onChange={onRatingChange} className="form-control" 
                        name="user_rating" placeholder="user_rating" type="number" value={state["user_rating"]} />
                    </div>
             </form>
            <table className="table table-responsive-sm">
                <tbody>
                    <tr>
                        <th scope="col">Movie Title</th>
                        <th scope="col">Director</th>
                        <th scope="col">Genre</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Select</th>  
                    </tr>
                    {user_films.map(film => (
                        film["rating"] > state.user_rating ? 
                            <tr>
                            <td>{film["movie_title"]}</td>
                            <td>{film["director"]}</td>
                            <td>{film["genre"]}</td>
                            <td>{film["rating"]}</td>
                            <td><form className="col" onSubmit={onSelect} name={film["movie_title"]}>
                                <div className="form-group col">
                                    <button type="submit" class="btn btn-primary form-control bg-danger">+</button>
                                </div>
                            </form></td>
                        </tr> : <tr></tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    )
}

export default Form
