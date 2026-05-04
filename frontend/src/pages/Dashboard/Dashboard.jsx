import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import GameList from '../../components/game/GameList'
import { getMyGames } from '../../api/game.api' //만든 API 호출 함수

const Dashboard = () => {
    const navigate = useNavigate();
    
    // 상태 관리
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // URL 파라미터 (Aside에서 선택한 필터 값) 읽어오기
    const [searchParams] = useSearchParams();
    const currentStatus = searchParams.get('status');
    const currentGenre = searchParams.get('genre');

    // 1. 데이터 불러오기
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const data = await getMyGames();
                setGames(data);
            } catch (error) {
                console.error("데이터 로드 실패", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGames();
    }, []);

    // 2. 상단 통계 계산 로직 (games 원본 배열을 기준으로 계산)
    const totalCount = games.length;
    // 플레이 수: 위시리스트가 아닌 게임들
    const playedCount = games.filter(g => g.status !== 'WISHLIST').length; 
    // 플레이 시간: 모든 게임의 playTime 합산
    const totalPlayTime = games.reduce((sum, g) => sum + (g.playTime || 0), 0);
    // 평균 평점: 평점이 있는 게임들만 추려서 평균 내기
    const ratedGames = games.filter(g => g.rating && g.rating > 0);
    const avgScore = ratedGames.length > 0 
        ? (ratedGames.reduce((sum, g) => sum + g.rating, 0) / ratedGames.length).toFixed(1) 
        : 0;

    // 3. 리스트 필터링 로직 (URL 파라미터 기준)
    const filteredGames = games.filter(game => {
        const matchStatus = !currentStatus || game.status === currentStatus;
        const matchGenre = !currentGenre || game.genre === currentGenre;
        return matchStatus && matchGenre;
    });

    if (isLoading) return <div>로딩 중...</div>;

    return (
        <div>
            <div className="title-wrap">
                <div className="title-text">
                    <h2>MY LIBRARY</h2>
                    <p>내 게임 컬랙션을 한눈에 확인하세요</p>
                </div>
                <div className="post-btn">
                    {/* 게임 추가 버튼 클릭 시 글쓰기 페이지로 이동하도록 navigate 연결 */}
                    <Button 
                        text="+ 게임 추가" 
                        className='post' 
                        onClick={() => navigate('/app/games/new')} 
                    />
                </div>
            </div>

            {/* 계산된 통계 데이터를 화면에 출력 */}
            <div className="detail-wrap">
                <div className="game-count">총 게임: <strong>{totalCount}</strong>개</div>
                <div className="play-count">플레이수: <strong>{playedCount}</strong>개</div>
                <div className="play-time">플레이시간: <strong>{totalPlayTime}</strong>시간</div>
                <div className="avg-score">평균평점: <strong>{avgScore}</strong>점</div>
            </div>

            <div className="search">검색</div>

            <div className="library">
                {/* 4. 필터링된 게임 목록을 GameList로 내려줌. */}
                <GameList games={filteredGames} />
            </div>
        </div>
    )
}

export default Dashboard