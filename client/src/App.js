import { Suspense, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authApi from './api/authApi';
import './App.scss';
import Footer from './components/Footer';
import Header from './components/Header';
import LoadingPage from './components/LoadingPage';
import PageNotFound from './components/PageNotFound';
import TraillerMovie from './components/TraillerMovie';
import { AuthContext } from './contexts/authContext';
import AdminPage from './features/Admin';
import Auth from './features/Auth';
import CinemaSystem from './features/CenimaSystem';
import HomePage from './features/HomePage';
import MovieDetail from './features/MovieDetail';
import UserProfile from './features/UserProfile';

function App() {
    const [scrollHeight, setScrollHeight] = useState(0);
    const { state, dispatchAuth } = useContext(AuthContext); 
    const { isLogin, role } = state;
    const refreshToken = localStorage.getItem('refreshToken');

    useEffect(() => {
        const fecthDataUser = async (refreshToken) => {
            const dataUser = await authApi.getInfoUser(refreshToken);

            if(dataUser.status === 200)
                dispatchAuth({
                    type: 'SET_USER_INFO',
                    payload: dataUser.data,
                })
        }

        if(refreshToken) {
            fecthDataUser(refreshToken);
        }
    }, [refreshToken]);

    useEffect(() => {
        const handleWindowScroll = () => {
            setScrollHeight(window.pageYOffset);
        }

        window.addEventListener('scroll', handleWindowScroll);
        return () => {
            window.removeEventListener('scroll', handleWindowScroll);
        }
    }, []);

    const handleToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    return (
        <>
            <Suspense fallback={<LoadingPage />} >
                <LoadingPage />
                <TraillerMovie />
                <ToastContainer theme="colored" style={{zIndex: 999999999}}/>
                <BrowserRouter>
                    <Switch>
                        {
                            isLogin ? 
                                role === '0' && <Redirect exact from="/" to="/admin"/>
                            :   <Route path="/auth">
                                    <Auth isLogin={isLogin}/>
                                </Route> 
                        }
                        <Route exact path="/">
                            <Header />
                            <HomePage />
                            <Footer />
                        </Route>
                        <Route path="/my-profile">
                            <Header />
                            <UserProfile />
                            <Footer />
                        </Route>
                        <Route path="/cinema-system">
                            <Header />
                            <CinemaSystem />
                            <Footer />
                        </Route>
                        <Route path="/movie-current">
                            <Header />
                            <MovieDetail />
                            <Footer />
                        </Route>
                        <Route path="/comming-soon">
                            <Header />
                            <MovieDetail />
                            <Footer />
                        </Route>

                        <Route path="/admin">
                            <AdminPage />
                        </Route>
                        
                        <Route path="*" component={PageNotFound} />
                    </Switch>
                </BrowserRouter>
                
                <div className={scrollHeight >= 1000 ? "btn-on-top show" : "btn-on-top"} onClick={() => handleToTop()}>
                    <i className="fad fa-angle-up"></i>
                </div>
            </Suspense>
        </>

    );
}

export default App;
