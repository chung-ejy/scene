import React, {useContext,useEffect,Fragment} from 'react';
import DataContext from "../../context/data/dataContext"
import Alert from "../alerts/Alert"
import Form from '../data/Form';
import Film from "../data/Film"
import Films from "../data/Films"
const Data = () => {
    const dataContext = useContext(DataContext)
    const {loading,title,getGenres} = dataContext;
    useEffect(() => {
        getGenres()
    },//eslint-disable-next-line
    [title]
    );
    return (
        <div className="card mt-4">
            <div className="card-body align-content-center justify-content-center">
            <div className="container text-center justify-content-center">
                        <h1>
                            {title[0].toUpperCase() + title.slice(1)}
                        </h1>
                {loading ? (
                    <Fragment>
                        <h3 className="text-center">
                            <i className="fas fa-film text-primary fa-7x"></i>
                        </h3>
                    </Fragment>
                        ) : (
                        <Fragment>
                            <Alert />
                            <Form />
                            <Film   />
                            <Films />
                        </Fragment>
                    )
                }
                </div>
            </div>
        </div>
    );
};

export default Data
