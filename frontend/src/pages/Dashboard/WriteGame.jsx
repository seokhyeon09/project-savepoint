import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame } from '../../api/game.api';
import { uploadImage } from '../../api/file.api';
import { STATUS_OPTIONS, GENRE_OPTIONS } from '../../constants/gameOption';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import './WriteGame.scss';

const WriteGame = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        playTime: 0,
        genre: 'ACTION',
        status: 'PLAYING',
        startDate: '',
        endDate: '',
        rating: 0,
        imageUrl: '',
        shortReview: '',
        content: '',
        tags: []
    });

    const [tagInput, setTagInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusIcons = {
        COMPLETED: '✓', PLAYING: '▶', PAUSED: '⏸', WISHLIST: '🔖', DROPPED: '✕'
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'playTime' || name === 'rating' ? Number(value) : value
        }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const presigned = await uploadImage(file);
            const imageUrl = presigned.fileUrl; // ← const 있는지 확인
            console.log({ imageUrl });
            setFormData((prev) => ({ ...prev, imageUrl }));
        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            alert('이미지를 업로드하지 못했습니다.');
        }
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !formData.tags.includes(newTag)) {
                setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) {
            alert('게임 타이틀을 입력해주세요!');
            return;
        }
        setIsSubmitting(true);
        try {
            await createGame(formData);
            alert('게임이 성공적으로 등록되었습니다!');
            navigate('/app/dashboard');
        } catch (error) {
            console.error('등록 에러:', error);
            alert('게임 등록에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="write-page-container">
            <header className="write-header">
                <h2>새 게임 기록하기</h2>
                <p>내 라이브러리에 새 게임을 추가하고 기록을 남겨보세요</p>
            </header>

            <form className="write-main-form" onSubmit={handleSubmit}>

                {/* 왼쪽 패널 */}
                <div className="form-left-panel">
                    <div className="form-card">
                        <div className="form-group">
                            <label>게임 제목 *</label>
                            <Input
                                type="text" name="title"
                                value={formData.title} onChange={handleChange}
                                placeholder="예: Elden Ring"
                                className="search"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>플레이 시간 (시간)</label>
                                <Input
                                    type="number" name="playTime"
                                    value={formData.playTime} onChange={handleChange}
                                    placeholder="130" className="search" min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>장르</label>
                                <select name="genre" value={formData.genre} onChange={handleChange}>
                                    {GENRE_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

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
                                <label>시작일</label>
                                <Input
                                    type="date" name="startDate"
                                    value={formData.startDate} onChange={handleChange}
                                    className="search"
                                />
                            </div>
                            <div className="form-group">
                                <label>종료일</label>
                                <Input
                                    type="date" name="endDate"
                                    value={formData.endDate} onChange={handleChange}
                                    className="search"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>평점 (0~5)</label>
                            <div className="rating-input-area">
                                <Input
                                    type="number" name="rating"
                                    value={formData.rating} onChange={handleChange}
                                    min="0" max="5" step="0.5" className="search"
                                />
                                <span className="rating-num">{formData.rating} / 5.0</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>한줄평</label>
                            <Input
                                type="text" name="shortReview"
                                value={formData.shortReview} onChange={handleChange}
                                placeholder="이 게임을 한 줄로 표현한다면?"
                                className="search"
                            />
                        </div>

                        <div className="form-group">
                            <label>상세 리뷰</label>
                            <textarea
                                name="content" value={formData.content}
                                onChange={handleChange} rows="5"
                                placeholder="게임에 대한 소감을 자유롭게 적어주세요."
                            />
                        </div>
                    </div>
                </div>

                {/* 오른쪽 패널 */}
                <div className="form-right-aside">
                    <div className="form-card image-upload-card">
                        <div className="image-drop-zone">
                            <div className="preview-box">
                                {formData.imageUrl
                                    ? <img src={formData.imageUrl} alt="미리보기" />
                                    : <div className="placeholder">이미지 미지정</div>
                                }
                            </div>
                            <label className="upload-label">
                                📤 이미지 업로드
                                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                            </label>
                        </div>
                    </div>

                    <div className="form-card tag-card">
                        <label>🏷️ 태그 (입력 후 Enter)</label>
                        <Input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="#오픈월드 #인생게임"
                            className="search"
                        />
                        <div className="tag-cloud">
                            {formData.tags.map(tag => (
                                <span key={tag} className="tag-pill" onClick={() => removeTag(tag)}>
                                    #{tag} ✕
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="form-actions">
                    <Button
                        text="✕ 취소" type="button"
                        className="cancel-btn"
                        onClick={() => navigate('/app/dashboard')}
                    />
                    <Button
                        text={isSubmitting ? "등록 중..." : "💾 게임 저장하기"}
                        type="submit"
                        className="post"
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </div>
    );
};

export default WriteGame;