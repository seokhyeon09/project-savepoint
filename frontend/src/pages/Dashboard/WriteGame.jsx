import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame } from '../../api/game.api'; 
import { uploadImage } from '../../api/file.api';
import { GENRE_OPTIONS, STATUS_OPTIONS } from '../../constants/gameOption'; 
import Input from '../../components/ui/Input'; 
import Button from '../../components/ui/Button';
import './WriteGame.scss'; 

const WriteGame = () => {
    const navigate = useNavigate();
    const [tagInput, setTagInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '', playTime: '', genre: 'RPG', status: 'COMPLETED',
        startDate: '', endDate: '', rating: 0, imageUrl: '',
        shortReview: '', content: '', tags: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 상태 버튼 전용 아이콘 매핑 (피그마 사진 기준)
    const statusIcons = {
        COMPLETED: '✓', PLAYING: '▶', PAUSED: '⏸', WISHLIST: '🔖', DROPPED: '✕'
    };

    return (
        <div className="write-page-container">
            <header className="write-header">
                <h2>새 게임 기록하기</h2>
                <p>내 라이브러리에 새 게임을 추가하고 기록을 남겨보세요</p>
            </header>

            <form className="write-main-form" onSubmit={(e) => e.preventDefault()}>
                {/* 왼쪽 패널: 폼 입력 */}
                <div className="form-left-panel">
                    <div className="form-card">
                        <div className="form-group">
                            <label>게임 제목 *</label>
                            <Input name="title" value={formData.title} onChange={handleChange} placeholder="예: Elden Ring" className="search" />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>플레이 시간</label>
                                <Input name="playTime" type="number" value={formData.playTime} onChange={handleChange} placeholder="130" className="search" />
                            </div>
                            <div className="form-group">
                                <label>장르 *</label>
                                <select name="genre" value={formData.genre} onChange={handleChange}>
                                    {GENRE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* 플레이 상태 버튼 그룹 */}
                        <div className="form-group">
                            <label>플레이 상태</label>
                            <div className="status-pill-group">
                                {STATUS_OPTIONS.map(opt => (
                                    <button 
                                        key={opt.value}
                                        type="button"
                                        className={`pill-btn ${formData.status === opt.value ? 'active' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, status: opt.value }))}
                                    >
                                        <span className="icon">{statusIcons[opt.value]}</span>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>플레이 시작일</label>
                                <Input name="startDate" type="date" value={formData.startDate} onChange={handleChange} className="search" />
                            </div>
                            <div className="form-group">
                                <label>플레이 종료일</label>
                                <Input name="endDate" type="date" value={formData.endDate} onChange={handleChange} className="search" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>평점</label>
                            <div className="rating-input-area">
                                <div className="stars">⭐⭐⭐⭐☆</div>
                                <span className="rating-num">4.0 / 5.0</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>한줄평</label>
                            <Input name="shortReview" value={formData.shortReview} onChange={handleChange} placeholder="소울라이크의 완성, 게임 역사에 남을 걸작" className="search" />
                        </div>

                        <div className="form-group">
                            <label>메모</label>
                            <textarea name="content" value={formData.content} onChange={handleChange} placeholder="소울라이크가 싫다면 바뀔 수도 있을 만큼 완성도가 높다..." />
                        </div>
                    </div>

                    <div className="form-actions">
                        <Button text="✕ 취소" className="cancel-btn outline" onClick={() => navigate(-1)} />
                        <Button text="💾 저장하기" className="post" />
                    </div>
                </div>

                {/* 오른쪽 패널: 이미지 & 태그 */}
                <div className="form-right-aside">
                    <div className="form-card image-upload-card">
                        <div className="image-drop-zone">
                            <div className="preview-box">
                                {formData.imageUrl ? <img src={formData.imageUrl} alt="preview" /> : <div className="placeholder">이미지 미지정</div>}
                            </div>
                            <label className="upload-label">
                                📤 이미지 업로드
                                <input type="file" hidden />
                            </label>
                        </div>
                    </div>

                    <div className="form-card tag-card">
                        <label>🏷️ 태그</label>
                        <Input placeholder="태그 입력 후 Enter" className="search" />
                        <div className="tag-cloud">
                            {['오픈월드', '소울라이크', '명작'].map(t => (
                                <span key={t} className="tag-pill">{t} ✕</span>
                            ))}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default WriteGame;