import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import SideBar from '../../components/SideBar';
import GLOBAL_TEXT from '../../../../contants/titleCinema';
import SlideImage from '../../components/SlideImage';
import ContentMovie from '../../components/ContentMovie';
import { useHistory, useLocation, useParams } from 'react-router';
import { useSelector } from 'react-redux';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const MovieCurrent = () => {
    const backgoundRef = useRef(null);
    const [dataRender, setDataRender] = useState([]);
    const [imageRender, setimageRender] = useState({});
    const history = useHistory();
    const params = useParams();
    const location = useQuery();
    const { data } = useSelector((state) => state.movieDetail);
    const { movieCurrent } = data;
    
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, []);

    useEffect(() => {
        if(movieCurrent) {
            const data = movieCurrent.filter(item => item.movieId === params.movieId);
            if(data.length > 0) {
                setDataRender(data);
                setimageRender({
                    poster1: data[0].poster1,
                    poster2: data[0].poster2,
                    poster3: data[0].poster3,
                    poster4: data[0].poster4,
                })
                const style = `
                background: url(${data[0].poster1}) 0% 0% / cover no-repeat;
                width: 100%;
                height: 100%;
                position: relative;
                transition: all 0.5s ease 0s;
                `;
                backgoundRef.current.style = style;
            }
            else {
                history.push('/movie-error');
            }
        }
       
    }, [movieCurrent]);

    return (
        <>
            <Helmet>
                <title> { location.get("name") ? location.get("name").replaceAll('-', ' ') : 'Movie Detail' }   | { GLOBAL_TEXT.TITLE_CINEMA }</title>
            </Helmet>
            <div className="movie-detail">
                <div className="container content">
                    <SideBar movieName={ dataRender && dataRender[0]?.movieName } type={1} />
                    <div className="layout-content">
                        <SlideImage imageRender={imageRender}/>
                        <ContentMovie data={dataRender}/>
                    </div>
                    <div className="description-movie">
                        <div className="container">
                            <h5 className="title">Chi Tiết</h5>
                            <div id="text_describe">
                                {
                                    dataRender && dataRender[0]?.describe
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-movie-detail">
                    <div className="bg-left" />
                    <div className="bg-right" ref={backgoundRef}/>
                </div>
            </div>
        </>
        
    );
};


MovieCurrent.propTypes = {

};


export default MovieCurrent;
