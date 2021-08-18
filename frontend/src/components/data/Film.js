import React from 'react'

const Film = ({data}) => {
    const {youtubeId,title} = data
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
        </div>
    )
}

export default Film
