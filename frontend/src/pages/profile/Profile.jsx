import React from 'react'
import './ProfilePage.scss'
import { useNavigate } from 'react-router-dom'
import ProfileBase from '../../components/profile/ProfileBase'
import ProfileName from '../../components/profile/ProfileName'
import ProfileSummary from '../../components/profile/ProfileSummary'
import PagesHeader from '../../components/layouts/PagesHeader'

const Profile = () => {
  const navigate = useNavigate()
  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <section className='profile-section'>
      <div className="inner">
        <PagesHeader
          title='내 프로필'
          buttonText='뒤로가기'
          showButton
          buttonClass="back bl"
          backico="bh"
          onClick={handleGoBack}
        />
        
        <main className="profile-main">
          {/* 왼쪽: 이름과 서머너리 고정 박스 */}
          <div className="profile-left">
            <ProfileName />
            <ProfileSummary />
          </div>
          
          {/* 오른쪽: 베이스(수정 폼) 고정 박스 */}
          <div className="profile-right">
            <ProfileBase />
          </div>
        </main>
      </div>
    </section>
  )
}

export default Profile