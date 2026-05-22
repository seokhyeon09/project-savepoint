import React from 'react'
import GameCard from './GameCard'

//부모로부터 games 배열 수령
const GameList = ({ games }) => {
  return (
    <div className="game-list-container">
        {/* 게임 데이터가 있을 때만 카드생성 */}
        {games && games.length > 0 ? (
            games.map((game) => (
                <GameCard key={game.id} game={game} />
            ))
        ) : (
            <div className="empty-state">
                <p>조건에 맞는 게임이 없습니다.</p>
            </div>
        )}
    </div>
  )
}

export default GameList