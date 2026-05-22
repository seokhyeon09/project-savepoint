import React, { useState, useEffect } from 'react'
import './ProfileComponentAll.scss'
import { useAuth } from '@/store/auth.store'
import { getMyTags } from '@/api/tag.api'
import { getMyGames } from '../../api/game.api'
import { PROFILE_ICONS } from '../../constants/profileIcon'
const ProfileSummary = () => {
  const [tags, setTags] = useState([])
  const { member, isReady } = useAuth()
  const [games, setGames] = useState([])



  const loadMyTags = async () => {
    const res = await getMyTags()
    const list = Array.isArray(res) ? res : res?.data ?? []

    setTags(
      list.map((t) => ({
        id: t.id,
        label: typeof t === 'string' ? t : t.label ?? t.name
      }))
    )
  }


  
  const loadMyGames = async () => {
    try {
      const res = await getMyGames() // 우리가 만든 게임 조회 API 호출
      const list = Array.isArray(res) ? res : res?.data ?? []
      setGames(list)
    } catch (error) {
      console.error(error)
      setGames([])
    }
  }

  useEffect(() => {
    loadMyTags()
    loadMyGames()
  }, [])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''

    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }


  return (
    <div className='profile-card'>
      <h4>활동 요약</h4>
      <ul className="profile-activity-list">
        <li>
          <span className='activity-label'>
            <img src={PROFILE_ICONS.memo} alt="icon" />
            등록한 게임
          </span>
          <span className='activity-value'>
            <span>
              {games.length}
            </span>
            개</span>
        </li>
        <li>
          <span className='activity-label'>
            <img src={PROFILE_ICONS.tag} alt="icon" />
            사용 태그
          </span>
          <span className='activity-value'>
            <span>
              {tags.length}

            </span>

            개</span>
        </li>
        <li>
          <span className='activity-label'>
            <img src={PROFILE_ICONS.calendar} alt="icon" />
            가입일
          </span>
          <span className='activity-value'>{formatDate(member?.createdAt)}</span>
        </li>
      </ul>
    </div>
  )
}

export default ProfileSummary