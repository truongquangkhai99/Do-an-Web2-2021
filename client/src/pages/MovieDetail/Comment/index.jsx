import React, { useContext, useEffect, useState } from 'react';
import { LayoutComment, MainComment, ImageUser, CommentBox,  ContentBox, CommentContent, CommentContentText, DependentComment, LayoutFetchData } from './Comment.Style';
import InputComment from './InputComment';
import RaitingStar from './RaitingStar';
import { Divider } from 'src/style-common/Layout.Style';
import Images from 'src/contants/image';
import ActionComment from './ActionComment';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { toast } from 'react-toastify';
import { AuthContext } from 'src/contexts/authContext';
import { useParams } from 'react-router-dom';
import { addComments, clearComments, defautlCreateStatus, getAllComments } from 'src/reducers/commentSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import socketIO from 'socket.io-client';
import { ClipLoader } from 'react-spinners';
import { Green } from 'src/contants/cssContants';
import { useOnScreen } from 'src/hooks/IntersectionImage';


// const ENDPOINT='ws://localhost:8900';
const ENDPOINT='/';
let socket =  socketIO(ENDPOINT, { transports:['websocket']});

const Comment = () => {

    const [commentRef, visibleComment] = useOnScreen({ threshold: 0.2 });
    const [commentLoading, setCommentLoading] = useState(false);

    const [isFetchComment, setIsFetchComment] = useState(1);
    const [raitingStar, setRaitingStar] = useState(0);
    const [commentActive, setCommentActive] = useState(-1);

    const { state } = useContext(AuthContext);
    const { id } = state;

    const params = useParams();
    const dispatch = useDispatch();

    const accessToken = localStorage.getItem('accessToken');

    const { comments, createStatus, totalPage } = useSelector(state => state.commentState);

    const handleSubmitComment = async (textCmt) => {
        if(params && params.movieId && createStatus === 0) {
            const data = {
                comments: textCmt,
                pointRating: raitingStar,
                idUser: id,
                movieId: params.movieId,
            }
            const statusResult = await dispatch(addComments(data));
            const result = unwrapResult(statusResult);
            socket.emit('joinRoom', {idComments: params.movieId});
            
            if(result.status === 200)
            {
                setRaitingStar(0);
                setTimeout(() => {
                    dispatch(getAllComments(params.movieId));
                    dispatch(defautlCreateStatus());
                }, 800);
            }
            else
                toast.error('Failed add comment !!!');
        }
    }

    const onActive = (idComment) => {
        if(commentActive === idComment)
            setCommentActive(-1);
        else
            setCommentActive(idComment);
    }

    useEffect(() => {
        dispatch(getAllComments({movieId: params.movieId, currentPage: isFetchComment}));
        setIsFetchComment(isFetchComment + 1);

        return () => {
            dispatch(clearComments());
        }
    }, []);

    useEffect(() => {
        if(visibleComment) {
            setCommentLoading(true);
        }
    }, [visibleComment]);

    useEffect(() => {
        if(commentLoading) {
            setCommentLoading(false);
            dispatch(getAllComments({movieId: params.movieId, currentPage: isFetchComment}));
            setIsFetchComment(isFetchComment + 1);
        }
    }, [commentLoading]);

    return (
        <>
            <LayoutComment>
                <RaitingStar setRaitingStar={setRaitingStar} raitingStar={raitingStar}/>
                <InputComment 
                    placeholder="Cảm nghĩ của bạn về bộ phim này ?"
                    clearText={createStatus === 1 ? true : false} 
                    onSubmit={(comment) => {
                        if(accessToken && id) {
                            if(raitingStar) {
                                if(comment) {
                                    handleSubmitComment(comment);
                                }
                                else
                                    toast.warn('Bạn hãy viết gì đó?');
                            }
                            else
                                toast.warn('Bạn chưa đánh giá! Vui lòng đánh giá trước khi bình luận.');
                        }
                        else
                            toast.warn('Cần đăng nhập để bình luận.');
                    }}
                />
                <Divider />
                <div className="w-100 h-auto mt-3">
                    <ul className="p-0">
                        {
                            comments && comments.length > 0
                            && comments.map((item) => {
                                const { Account, FeedbackComments } = item;
                                const momentTime =  moment(item.createdAt).fromNow();
                                return <li key={item.id}>
                                            <MainComment>
                                                <ImageUser>
                                                    <img src={ Account && Account.avartar ? Account.avartar :  Images.DefaultAvatar } alt="Not User"/>
                                                </ImageUser>
                                                <CommentBox>
                                                    <div>
                                                        <ContentBox className="p-1">
                                                            <CommentContent>
                                                                <div className="d-flex justify-content-between mb-1">
                                                                    <span>{ Account && Account.fullname ? Account.fullname : 'No Name'}</span>
                                                                    <span className="ml-5">Đánh giá { item.pointRating } sao</span>
                                                                </div>
                                                                <CommentContentText>
                                                                    { item.comments }
                                                                </CommentContentText>
                                                            </CommentContent>
                                                        </ContentBox>
                                                    </div>
                                                    <ActionComment 
                                                        fullname={Account.fullname} 
                                                        createdAt={momentTime}
                                                        onActive={() => onActive(item.id)}
                                                        active={item.id === commentActive ? true : false}
                                                        commentParentId={item.id}
                                                        idRecipients={item.Comment_idUser}
                                                    />
                                                </CommentBox>
                                            </MainComment>
                                            <DependentComment>
                                                <ul>
                                                    {
                                                        FeedbackComments && FeedbackComments.length > 0
                                                        && FeedbackComments.map((feedback, index) => {
                                                            const { ChildrenComment, ParentComment } = feedback;
                                                            const momentTime =  moment(feedback.createdAt).fromNow();
                                                            return  <li key={index}>
                                                                        <MainComment>
                                                                            <ImageUser>
                                                                                <img src={ ParentComment && ParentComment.avartar ? ParentComment.avartar : Images.DefaultAvatar } alt="Not User"/>
                                                                            </ImageUser>
                                                                            <CommentBox>
                                                                                <div>
                                                                                    <ContentBox>
                                                                                        <CommentContent>
                                                                                            <div className="d-flex justify-content-between">
                                                                                                <span>{ ParentComment && ParentComment.fullname ? ParentComment.fullname : 'No Name' }</span>
                                                                                                <span></span>
                                                                                            </div>
                                                                                            <CommentContentText>
                                                                                               <span>{ChildrenComment && ChildrenComment.idUser === ParentComment.idUser ? '' : ChildrenComment.fullname}</span> { feedback.comments }
                                                                                            </CommentContentText>
                                                                                        </CommentContent>
                                                                                    </ContentBox>
                                                                                </div>
                                                                                <ActionComment 
                                                                                    fullname={ParentComment.fullname} 
                                                                                    createdAt={momentTime}
                                                                                    onActive={() => onActive(feedback.id)}
                                                                                    active={feedback.id === commentActive ? true : false}
                                                                                    commentParentId={item.id}
                                                                                    idRecipients={ParentComment.idUser}
                                                                                />
                                                                            </CommentBox>
                                                                        </MainComment>
                                                                    </li>
                                                        })
                                                    }
                                                    
                                                </ul>    
                                            </DependentComment>
                                        </li>
                            })
                        }
                    </ul>
                    {
                        isFetchComment === totalPage || totalPage === 0 ? "" : <LayoutFetchData ref={!commentLoading ? commentRef : null}>
                            <ClipLoader size={30} color={Green}/>
                        </LayoutFetchData>
                    }
                </div>
            </LayoutComment> 
        </>
     
    );
};

export default Comment;
