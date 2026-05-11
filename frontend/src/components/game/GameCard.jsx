import React from 'react'
import './GameComponentAll.scss'
import { Link } from 'react-router-dom'

const GameCard = ({game}) => {
    return (
        <Link to={`/app/games/${game.id}`} className='game-card'>
            <article>
                <div className='game-card-body'>
                    <div className="image">
                        <img src={game.imageUrl || '/assets/default-game.png'} alt={game.title} />
                    </div>
                    <div className={`status ${game.status?.toLowerCase()}`}>{game.status}</div>
                    <div className="card-info">
                        <h3 className='game-title'>{game.title}</h3>
                        <span>{game.rating}</span>
                        <p>{game.genre}</p>
                    </div>
                </div>
            </article>
        </Link>
    )
}

export default GameCard