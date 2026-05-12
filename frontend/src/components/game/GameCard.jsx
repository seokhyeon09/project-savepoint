import React from 'react'
import './GameComponentAll.scss'
import { Link } from 'react-router-dom'

const GameCard = ({game}) => {
    // 평점이 없을 경우를 대비해 0으로 기본값 설정 및 숫자형 변환
    const rating = Number(game.rating) || 0;
    
    // 채워진 별(★)과 빈 별(☆) 갯수 계산
    const filledStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(5 - Math.floor(rating));

    return (
        <Link to={`/app/games/${game.id}`} className='game-card'>
            <article>
                <div className='game-card-body'>
                    <div className="image">
                        <img src={game.imageUrl || '/assets/default-game.png'} alt={game.title} />
                    </div>
                    {/* 상태 뱃지 */}
                    <div className={`status ${game.status?.toLowerCase()}`}>{game.status}</div>
                    
                    <div className="card-info">
                        <h3 className='game-title'>{game.title}</h3>
                        
                        {/*별점과 숫자를 보여줌 */}
                        <div className="card-rating" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#F5C842', fontSize: '14px', letterSpacing: '1px' }}>
                                {filledStars}{emptyStars}
                            </span>
                        </div>
                        
                        <p>{game.genre}</p>
                    </div>
                </div>
            </article>
        </Link>
    )
}

export default GameCard