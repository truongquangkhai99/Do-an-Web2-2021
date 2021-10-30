import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import moment from 'moment';
import 'moment/locale/vi';
import { useOnScreen } from '../../../../hooks/IntersectionImage';


const MovieList = () => {
    const [movieCurrentRef, visibleMovie] = useOnScreen({ threshold: 0.2 });
    const [movieCommingSoon, visibleComming] = useOnScreen({ threshold: 0.2 });
    const [movieCurrentLoading, setMovieCurrentLoading] = useState(false);
    const [movieCommingLoading, setMovieCommingLoading] = useState(false);
    const { data } = useSelector((state) => state.homepage);
    const { movieCurrent, movieComing } = data;
    const responsive = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 6,
        },
        tablet: {
          breakpoint: { max: 1024, min: 764 },
          items: 3
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1,
          partialVisibilityGutter: 30,
        }
      };

    useEffect(() => {
        if(visibleMovie) {
            setMovieCurrentLoading(true);
        }
        if(visibleComming) {
            setMovieCommingLoading(true);
        }
    }, [visibleMovie, visibleComming ]);

    return (
        <section className="movie-list">
            <div className="movie-current current"  ref={ !movieCurrentLoading ? movieCurrentRef : null}>
                <h3 className="current__title">Phim Hiện Đang Chiếu</h3>
                <Carousel responsive={responsive}>
                    {
                        movieCurrent ? movieCurrent.map((data) => {
                            return <div  key={data.movieId}>
                                        <div className="card-movie">
                                            <div className="card-img">
                                                {
                                                    !movieCurrentLoading ? 
                                                        visibleMovie ? <img src={data.poster1} alt="Card Movie" /> 
                                                        : <span className="skeleton-box" style={{width: '100%', height: '100%'}}></span>
                                                    : <img src={data.poster1} alt="Card Movie" />
                                                }
                                            </div>
                                            <div className="card-content">
                                                <div className="contentBox">
                                                    <h3>{data.movieName}</h3>
                                                    <p>{ moment.utc(data.premiereDate).format('L') } đến { moment.utc(data.endDate).format('L') }</p>
                                                </div>
                                            </div>
                                            <div className="btn-card">
                                                <Link to="/" className="btn">Mua vé</Link>
                                            </div>
                                        </div>
                                    </div>
                        }) : <div />
                    }
                </Carousel>
            </div>
            <div className="movie-current current mt-4" ref={ !movieCommingLoading ? movieCommingSoon : null}>
                <h3 className="current__title">Comming Soon</h3>
                <Carousel responsive={responsive}>
                    { 
                        movieComing ? movieComing.map((data) => {
                            return  <div key={data.movieId}>
                                        <div className="card-movie">
                                            <div className="card-img">
                                            {
                                                !movieCommingLoading ?
                                                visibleComming ? <img src={data.poster1} alt="Card Movie" />
                                                : <span className="skeleton-box" style={{width: '100%', height: '100%'}}></span>  
                                                : <img src={data.poster1} alt="Card Movie" />
                                            }
                                            </div>
                                            <div className="card-content">
                                                <div className="contentBox">
                                                    <h3>{data.movieName}</h3>
                                                    <p>Khởi chiếu: { moment.utc(data.premiereDate).format('L') }</p>
                                                </div>
                                            </div>
                                            <div className="btn-card">
                                                <Link to="/" className="btn">Mua vé</Link>
                                            </div>
                                        </div>
                                    </div>
                        }) : <div />
                    }
                </Carousel>
            </div>
        </section>
    );
};


MovieList.propTypes = {

};


export default MovieList;
