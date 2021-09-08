import React, { useContext,useState } from 'react'
import DataContext from '../../context/data/dataContext'

const Films = () => {
    const dataContext = useContext(DataContext)
    const {setFilm,data} = dataContext
    const {films} = data
    const [state,setState] = useState({"rating":""})
    const onRatingChange = (e) =>{
        setState({...state,[e.target.name]:e.target.value})
    }
    const onSelect = (e) =>{
        e.preventDefault()
        console.log(e.target.name)
        const selection = films.filter(film => e.target.name == film["movie_title"])[0]
        selection["films"] = films
        console.log(selection)
        setFilm(selection)
    }

    return (
        <div className="card card-body mt-4 mb-4">
            <div className="card card-body mt-4 mb-4">

            <table className="table table-responsive-sm">
                <tbody>
                    <tr>
                        <th scope="col">Movie Title</th>
                        <th className="d-none d-sm-none d-md-block" scope="col">Director</th>
                        <th className="d-none d-sm-none d-md-none d-lg-none d-xl-block" scope="col">Genre</th>
                        <th scope="col">
                        <form className="form-inline">
                            <div className="form-group">
                                <input onChange={onRatingChange} className="form-control" style = {{color: "inherit",
                                                                                                    border: "none",
                                                                                                    padding: "0",
                                                                                                    font: "inherit",
                                                                                                    cursor: "pointer",
                                                                                                    outline: "inherit"}}
                                name="rating" placeholder="RATING" type="number" value={state["rating"]} />
                            </div>
                        </form>
                        </th>
                    </tr>
                    {films.map(film => (
                        film["rating"] >= state.rating ? 
                            <tr>
                            <td><form className="col" onSubmit={onSelect} name={film["movie_title"]}>
                                <div className="form-group col">
                                    <button style={{background: "none",
                                                    color: "inherit",
                                                    border: "none",
                                                    padding: "0",
                                                    font: "inherit",
                                                    cursor: "pointer",
                                                    outline: "inherit"}}type="submit">{film["movie_title"]}</button>
                                </div>
                            </form></td>
                            <td className="d-none d-sm-none d-md-none d-lg-block">{film["director"]}</td>
                            <td className="d-none d-sm-none d-md-none d-lg-none d-xl-block">{film["genre"]}</td>
                            <td>{`${film["rating"]}    `}</td>
                        </tr> : <tr></tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    )
}

export default Films
