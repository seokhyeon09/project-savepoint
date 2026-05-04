import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameById } from '../../api/game.api';
import Button from '../../components/ui/Button';
import './GameDetail.scss'; // (직접 만드실 SCSS)

const GameDetail = () => {
    // 1. 주소창(/app/games/:id)에서 id 값을 빼옵니다.
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    // 2. 상태 관리
    const [game, setGame] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 3. 백엔드에서 1개 게임 데이터 불러오기
    useEffect(() => {
        const fetchGameDetail = async () => {
            try {
                const data = await getGameById(id);
                setGame(data);
            } catch (error) {
                console.error("상세 정보 로드 실패:", error);
                alert("게임을 불러오지 못했습니다.");
                navigate(-1); // 에러 시 뒤로 가기
            } finally {
                setIsLoading(false);
            }
        };

        fetchGameDetail();
    }, [id, navigate]);

    // 로딩 중 화면
    if (isLoading) return <div className="loading-state">데이터를 불러오는 중...</div>;
    // 데이터가 없을 때 화면
    if (!game) return <div className="error-state">게임 정보가 없습니다.</div>;

    return (
        <div className="game-detail-container">
            {/* 상단: 뒤로가기 버튼 */}
            <div className="top-actions">
                <Button text="← 목록으로" onClick={() => navigate(-1)} className="back-btn" />
            </div>

            {/* 메인 콘텐츠 영역 */}
            <article className="detail-content">
                {/* 왼쪽: 게임 커버 이미지 */}
                <div className="detail-image-wrap">
                    <img src={game.imageUrl || '/assets/default-game.png'} alt={game.title} />
                </div>

                {/* 오른쪽: 게임 상세 정보 */}
                <div className="detail-info-wrap">
                    <div className="header-info">
                        <span className="badge status">{game.status}</span>
                        <span className="badge genre">{game.genre}</span>
                        <h2>{game.title}</h2>
                        <p className="short-review">"{game.shortReview}"</p>
                    </div>

                    <div className="meta-info">
                        <div className="info-item">
                            <span className="label">플레이 타임</span>
                            <span className="value">{game.playTime} 시간</span>
                        </div>
                        <div className="info-item">
                            <span className="label">내 평점</span>
                            <span className="value">⭐ {game.rating} / 5.0</span>
                        </div>
                        <div className="info-item">
                            <span className="label">플레이 기간</span>
                            <span className="value">{game.startDate || '미정'} ~ {game.endDate || '미정'}</span>
                        </div>
                    </div>

                    <div className="tags-wrap">
                        {game.tags && game.tags.map(tag => (
                            <span key={tag} className="tag">#{tag}</span>
                        ))}
                    </div>

                    {/* 상세 리뷰 본문 */}
                    <div className="review-content">
                        <h3>상세 리뷰</h3>
                        <p>{game.content}</p>
                    </div>
                </div>
            </article>
            <div className="bottom-actions">
                <Button text="수정하기" onClick={() => navigate(`/app/games/edit/${id}`)} className="edit-btn" />
            </div>
        </div>
    );
};

export default GameDetail;