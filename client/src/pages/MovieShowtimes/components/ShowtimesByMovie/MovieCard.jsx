import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { Button } from 'src/style-common/Button.Style';
import { CardContent, CardImage, ContentBox, LayoutButton, LayoutCard } from 'src/style-common/CardMovie.Style';

const MovieCard = ({ className, setWidthItem, data }) => {
    const layoutRef = useRef(null);

    useEffect(() => {
        if(layoutRef && layoutRef.current) {
            setWidthItem && setWidthItem(layoutRef.current.offsetWidth);
        }
    }, [layoutRef, layoutRef.current?.offsetWidth]);
    
    return (
        <LayoutCard 
            className={className}
            ref={layoutRef}
        >
            <CardImage>
                <img src={data?.poster1} alt="No Item" />
            </CardImage>
            <CardContent
                className="hover"
            >
                <ContentBox>
                    <h3>{ data?.movieName }</h3>
                    <p>từ {moment(data?.premiereDate).format('DD/MM/YYYY')} đến {moment(data?.endDate).format('DD/MM/YYYY')}</p>
                </ContentBox>
            </CardContent>
            <LayoutButton>
                <Button className="w-100">
                    Xem xuất chiếu
                </Button>
            </LayoutButton>
        </LayoutCard>
    );
};

export default MovieCard;
