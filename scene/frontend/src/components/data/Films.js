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
        // const selection = films.filter(film => e.target.name == film["movie_title"])[0]
        // selection["films"] = films
        // setFilm(selection)
    }

    return (
        <div className="card card-body mt-4 mb-4">
            <div className="card card-body mt-4 mb-4">

            <table className="table table-responsive-sm">
                <tbody>
                    <tr>
                        <th scope="col">Movie Title</th>
                        <th className="d-none d-lg-block" scope="col">Genre</th>
                        <th scope="col">Director</th>
                        {/* <th className="d-none d-lg-block" scope="col">Starring</th> */}
                        <th className="d-none d-lg-block" scope="col">
                        <form className="form-inline">
                            <div className="form-group">
                                <input onChange={onRatingChange} className="form-control" style = {{color: "inherit",
                                                                                                    border: "none",
                                                                                                    padding: "0",
                                                                                                    font: "inherit",
                                                                                                    cursor: "pointer",
                                                                                                    outline: "inherit"}}
                                name="rating" placeholder="RATING" type="number" min="1" max="5" value={state["rating"]} />
                            </div>
                        </form>
                        </th>
                    </tr>
                    {films.map(film => (
                        film["rating"] >= state.rating ? 
                            <tr>
                            <td><form className="col" onSubmit={onSelect} name={film["movie_title"]}>
                                <div className="form-group col">
                                    <button className="text-primary" style={{background: "none",
                                                    border: "none",
                                                    padding: "0",
                                                    textDecoration:"underline",
                                                    font: "inherit",
                                                    cursor: "pointer",
                                                    outline: "inherit"}}type="submit">{film["movie_title"]}</button>
                                </div>
                            </form></td>
                            <td className="d-none d-lg-block">{film["genre"]}</td>
                            <td >{film["director"]}</td>
                            {/* <td className="d-none d-lg-block">{film["starring"]}</td> */}
                            <td className="d-none d-lg-block">{`${film["rating"]}    `}</td>
                        </tr> : <tr></tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    )
}

export default Films
