import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input' //  커스텀 Input 컴포넌트 추가
import GameList from '../../components/game/GameList'
import { getMyGames } from '../../api/game.api' 
import useGameSearch from '../../hooks/useGameSearch' //  방금 만든 커스텀 훅 불러오기

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
    const playedCount = games.filter(g => g.status !== 'WISHLIST').length; 
    const totalPlayTime = games.reduce((sum, g) => sum + (g.playTime || 0), 0);
    const ratedGames = games.filter(g => g.rating && g.rating > 0);
    const avgScore = ratedGames.length > 0 
        ? (ratedGames.reduce((sum, g) => sum + g.rating, 0) / ratedGames.length).toFixed(1) 
        : 0;

    // 3. 리스트 필터링 로직 (1차: URL 파라미터 기준 사이드바 필터링)
    const filteredGames = games.filter(game => {
        const matchStatus = !currentStatus || game.status === currentStatus;
        const matchGenre = !currentGenre || game.genre === currentGenre;
        return matchStatus && matchGenre;
    });

    //  4. 검색 훅 적용 (2차: 사이드바 필터링이 끝난 목록을 검색 훅에 넘겨줍니다)
    const { searchTerm, handleSearchChange, searchedGames } = useGameSearch(filteredGames);

    if (isLoading) return <div>로딩 중...</div>;

    return (
        <div>
            <div className="title-wrap">
                <div className="title-text">
                    <h2>MY LIBRARY</h2>
                    <p>내 게임 컬랙션을 한눈에 확인하세요</p>
                </div>
                <div className="post-btn">
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

            {/*  5. 검색창 UI (Input 컴포넌트 활용) */}
            <div className="search-wrap" style={{ margin: '20px 0' }}>
                <Input 
                    type="text"
                    placeholder="게임 제목을 검색하세요..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="library">
                {/*  6. 사이드바 필터 + 검색까지 완료된 배열을 넘겨줌 */}
                <GameList games={searchedGames} />
            </div>
        </div>
    )
}

export default Dashboard