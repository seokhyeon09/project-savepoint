import React from 'react'
import Button from '../../components/ui/Button'
import GameList from '../../components/game/GameList'

const Dashboard = () => {
  return (
    <div>
      <div className="title-wrap">
        <div className="title-text">
          <h2>MY LIBRARY</h2>
          <p>내 게임 컬랙션을 한눈에 확인하세요</p>
        </div>
        <div className="post-btn">
          <Button text="+ 게임 추가" className='post' />
        </div>
      </div>
      <div className="detail-wrap">
        <div className="game-count">총 게임</div>
        <div className="play-count">플레이수</div>
        <div className="play-time">플레이시간</div>
        <div className="avg-score">평균평점</div>
      </div>
      <div className="">검색</div>
      <div className="library">
        <GameList />
      </div>
    </div>
  )
}

export default Dashboard