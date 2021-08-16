import React from 'react'
const Sentiment = ({data}) => {
    return (
        <div class="embed-responsive embed-responsive-16by9 text-center">
            <iframe class="embed-responsive-item" src={`https://www.youtube.com/embed/${data.url}?rel=0`} allowfullscreen></iframe>
        </div>
    )
}

export default Sentiment
