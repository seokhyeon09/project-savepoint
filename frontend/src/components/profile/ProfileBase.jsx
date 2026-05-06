import React, { useState, useEffect } from 'react'
import './ProfileComponentAll.scss'
import { useAuth } from '@/store/auth.store'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { getMe, updateMe } from '@/api/auth.api'
import { PROFILE_ICONS } from '../../constants/profileIcon'
import { MEMBER_STATUS_LABEL } from '@/constants/memberStatus'
const ProfileBase = () => {

  const { login: setAuthMember } = useAuth()

  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const [edit, setEdit] = useState(false)
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [saveError, setSaveError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getMe()

        console.log(data)

        if (mounted) {
          setMember(data)
          setLoadError(null)
        }

      } catch (e) {
        if (mounted) {
          setLoadError(e?.message || '프로필을 불러오지 못했습니다.')
          setMember(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }


  }, [])


  const phoneDisplay = member?.phone?.trim() ? member.phone : ' '
  const statusDisplay = member?.status
    ? MEMBER_STATUS_LABEL[member.status] ?? member.status : ' '


  const startEdit = () => {
    if (!member) return

    setFormName(member.name ?? '')
    setFormPhone(member.phone ?? '')
    setSaveError(null)
    setEdit(true)
  }
  const cancelEdit = () => {
    setEdit(false)
    setSaveError(null)
  }
  const saveProfile = async () => {

    setSaving(true)
    setSaveError(null)

    try {
      const updated = await updateMe({
        name: formName,
        phone: formPhone
      })

      setMember(updated)
      setAuthMember(updated)
      setEdit(false)

    } catch (e) {
      setSaveError(e?.message || '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }

  }

  if (loading) {
    return (
      <div className='profile-card'>
        <p className="hint">프로필을 불러오는 중.....</p>
      </div>
    )
  }
  if (loadError || !member) {
    return (
      <div className='profile-card'>
        <p className="hint">{loadError || '프로필을 불러오는 중.....'}</p>
      </div>
    )
  }

  return (
    <div className='profile-card profile-base'>
      <div className="profile-info">
        <label htmlFor='profile-name'>
          <img src={PROFILE_ICONS.user} alt="icon" />
          이름
        </label>
        <Input
          className='profile-input'
          id="profile-name"
          value={edit ? formName : member.name ?? ''}
          onChange={edit ? (e) => setFormName(e.target.value) : undefined}
          readOnly={!edit}
          disabled={!edit}
        />
      </div>
      <div className="profile-info-field">
        <label htmlFor='profile-phone'>
          <img src={PROFILE_ICONS.phone} alt="icon" />
          전화번호
        </label>
        <Input
          className='profile-input'
          id="profile-phone"
          value={edit ? formPhone : member.phone ?? ''}
          onChange={edit ? (e) => setFormPhone(e.target.value) : undefined}
          readOnly={!edit}
          disabled={!edit}
        />
        <p className='hint'>본인 인증에 사용됩니다.</p>
      </div>
      <div className="profile-info-field">
        <label htmlFor='profile-email'>
          <img src={PROFILE_ICONS.mail} alt="icon" />
          이메일
        </label>
        <Input
          className='profile-input'
          id="profile-email"
          value={member.email ?? ''}
          readOnly
          disabled
        />
        {member.emailVerified ? (
          <div>✓ 인증됨</div>
        ) : (
          <div>미인증</div>
        )}
        <p className='hint'>로그인 및 알림 수신에 사용됩니다.</p>
      </div>
      <div className="profile-info-field">
        <label htmlFor='profile-status'>
          <img src={PROFILE_ICONS.badge} alt="icon" />
          회원 상태
        </label>
        <Input
          className='profile-input'
          id="profile-status"
          value={statusDisplay}
          readOnly
          disabled
        />
        <p className='hint'>서비스 이용 가능 여부를 나타냅니다.</p>

        {saveError && <p className='hind'>{saveError}</p>}
      </div>
      <div className="btn-wrap">
        {edit ? (
          <>
            <Button
              text={saving ? "저장 중..." : "저장"}
              onClick={saveProfile}
              disabled={saving}
              className="save" />
            <Button
              text="취소"
              onClick={cancelEdit}
              disabled={saving}
              className="cancel" />
          </>
        ) : (
          <Button text="내 정보 수정하기" className="edit" onClick={startEdit}/>

        )}
      </div>


    </div>
  )
}

export default ProfileBase