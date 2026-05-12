import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameById } from '../../api/game.api';
import Button from '../../components/ui/Button';
import './GameDetail.scss';

const GameDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [game, setGame] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGameDetail = async () => {
            try {
                const data = await getGameById(id);
                setGame(data);
            } catch (error) {
                console.error("상세 정보 로드 실패:", error);
                alert("게임을 불러오지 못했습니다.");
                navigate(-1);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGameDetail();
    }, [id, navigate]);

    if (isLoading) return <div className="loading-state">데이터를 불러오는 중...</div>;
    if (!game) return <div className="error-state">게임 정보가 없습니다.</div>;

    return (
        <div className="game-detail-container">
            {/* 상단 브레드크럼 */}
            <div className="top-actions">
                <span className="path-link" onClick={() => navigate(-1)}>
                    📚 내 라이브러리 &gt;
                </span>
                <span className="path-text">
                    {game.status} &gt;
                </span>
                <span className="current-path">{game.title}</span>
            </div>

            {/* 메인 헤더 */}
            <header className="detail-header">
                <div className="title-block">
                    <div className="title-row">
                        <h2>{game.title}</h2>
                        {/* 🚀 다시 제목 옆으로 복귀! */}
                        <span className="badge status main-badge" data-status={game.status}>
                            {game.status}
                        </span>
                    </div>
                    <div className="meta-row">
                        <span className="badge genre">
                            🗡️ {game.genre}
                        </span>
                    </div>
                </div>
                <div className="action-buttons">
                    <Button text="✎ 수정하기" onClick={() => navigate(`/app/games/edit/${id}`)} className="edit-btn" />
                    <Button text="🗑 삭제" className="delete-btn" />
                </div>
            </header>

            <hr className="divider" />

            <article className="detail-content">
                {/* 왼쪽 패널 */}
                <div className="detail-info-wrap">
                    <div className="stats-strip">
                        <div className="stat-item">
                            <span className="stat-label">⏱ 총 플레이 시간</span>
                            <span className="stat-value lg">{game.playTime || 0}h</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-label">📅 시작일</span>
                            <span className="stat-value md">{game.startDate || '-'}</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-label">📅 종료일</span>
                            <span className="stat-value md">{game.endDate || '-'}</span>
                        </div>
                    </div>

                    <div className="section-card rating-section">
                        <div className="section-header">
                            <h3 className="section-title">나의 평점</h3>
                            <span className="rating-score">{Number(game.rating).toFixed(1)} / 5.0</span>
                        </div>
                        <div className="stars-display">
                            <span>
                                {'★'.repeat(Math.floor(game.rating))}{'☆'.repeat(5 - Math.floor(game.rating))}
                            </span>
                        </div>

                        {game.shortReview && (
                            <>
                                <span className="short-review-label">한줄평</span>
                                <div className="short-review-box">
                                    <div className="quote-bar"></div>
                                    <p>{game.shortReview}</p>
                                </div>
                            </>
                        )}
                    </div>

                    {game.content && (
                        <div className="section-card">
                            <div className="section-header">
                                <h3 className="section-title">📝 플레이 메모</h3>
                                <span className="section-meta">마지막 수정: {game.endDate || '-'}</span>
                            </div>
                            <div className="memo-content">
                                <p>{game.content}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 오른쪽 패널 */}
                <div className="detail-image-wrap">
                    <div className="cover-card">
                        <img src={game.imageUrl || '/assets/default-game.png'} alt={game.title} />
                    </div>

                    {game.tags && game.tags.length > 0 && (
                        <div className="section-card">
                            <div className="section-header">
                                <h3 className="section-title">🏷️ 태그</h3>
                            </div>
                            <div className="tags-wrap inner-tags">
                                {game.tags.map(tag => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
};

export default GameDetail;