import React, { useContext,useState } from 'react'
import DataContext from '../../context/data/dataContext'

const Form = () => {
    const dataContext = useContext(DataContext)
    const {getData,genres,data} = dataContext
    const [state,setState] = useState({"movie_title":"","director":"","genre":"Action & Adventure","rating":"3"})
    const onChange = (e) => {
        setState({...state,[e.target.name]:e.target.value});
    }
    const onSubmit = (e) => {
        e.preventDefault()
        getData(state)
        setState({...data})
    }

    return (
        <div className="card card-body mt-4 mb-4">
            <h6 className="text-danger">Fill out any of the three:</h6>
            <form onSubmit={onSubmit}>
                {Object.keys(state).map(key =>(
                    key == "genre"  ? 
                    <div key={key} className="form-group">
                        <select placeholder="category" name="genre" onChange={onChange} className="form-control" id="exampleFormControlSelect1">
                        {genres.map(genre => <option key={genre}>{genre}</option>)}
                        </select>
                    </div>
                    : key == "director" || key == "movie_title"? 
                    <div key={key} className="form-group">
                        <input onChange={onChange} className="form-control" 
                        name={key} placeholder={key} type={"text"} value={state[key]} />
                    </div> : key == "rating"  ?
                    <div key={key} className="form-group ml-5 mt-4 mb-4">
                    <label className="mr-1" htmlFor="formRange">{`Rating: ${state["rating"]} `}</label>
                    <input onChange={onChange} className="form-range"
                        name={key} placeholder={key} type="range" step="0.1" min="0" max="5" value={state[key]} />
                    </div> : <div></div>
                ))}
                <div className="form-group">
                    <button type="submit" className="btn btn-primary form-control">Recommend</button>
                </div>
            </form>
        </div>
    )
}

export default Form
