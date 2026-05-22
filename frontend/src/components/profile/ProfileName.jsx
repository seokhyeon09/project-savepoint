import React from 'react'
import { useAuth } from '@/store/auth.store'
import { STATUS_BADGE } from '@/constants/memberStatus'
import './ProfileComponentAll.scss'
const ProfileName = () => {

  const { member, isReady } = useAuth()

  console.log(member)

  const nameDisplay = !isReady
    ? '불러오는 중....'
    : member?.name ?? '_'

  const badgeDisplay = member?.status
    ? STATUS_BADGE[member.status] ?? `● ${member.status}`
    : '_'
  return (
    <div className='profile-card profile-name-wrap'>
      <div className="profile-icon-wrap">
        {nameDisplay.charAt(0)}
      </div>
      <div className="profile-name">
        {nameDisplay}
      </div>
      <div className="role">일반회원</div>
      <div className="badge">{badgeDisplay}</div>
    </div>
  )
}

export default ProfileName