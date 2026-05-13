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
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        playTime: '',
        genre: 'RPG',
        status: 'COMPLETED',
        startDate: '',
        endDate: '',
        rating: 0,
        imageUrl: '',
        shortReview: '',
        content: '',
        tags: []
    });

    const statusIcons = {
        COMPLETED: '✓', PLAYING: '▶', PAUSED: '⏸', WISHLIST: '🔖'
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ── 평점 클릭 ──────────────────────────────────────────
    const handleRatingClick = (value) => {
        setFormData(prev => ({ ...prev, rating: value }));
    };

    // ── 이미지 업로드 ───────────────────────────────────────
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setIsUploading(true);
            setError('');

            // ✅ uploadImage()가 이제 fileUrl(전체 URL)을 반환합니다.
            // 예: https://버킷명.s3.ap-northeast-2.amazonaws.com/games/2026/05/13/uuid-cover.jpg
            const fileUrl = await uploadImage(file);

            // ✅ imageUrl에 전체 URL을 저장 → DB에도 전체 URL이 저장됨 → 이미지 표시 가능
            setFormData(prev => ({ ...prev, imageUrl: fileUrl }));
        } catch (err) {
            setError('이미지 업로드에 실패했습니다: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    // ── 태그 추가 ───────────────────────────────────────────
    const handleTagKeyDown = (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();

        const trimmed = tagInput.trim().replace(/^#/, '');
        if (!trimmed) return;
        if (formData.tags.includes(trimmed)) {
            setTagInput('');
            return;
        }
        setFormData(prev => ({ ...prev, tags: [...prev.tags, trimmed] }));
        setTagInput('');
    };

    const handleTagRemove = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tagToRemove)
        }));
    };

    // ── 폼 제출 ─────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError('게임 제목을 입력해주세요.');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            const payload = {
                title: formData.title.trim(),
                playTime: formData.playTime ? Number(formData.playTime) : null,
                genre: formData.genre,
                status: formData.status,
                startDate: formData.startDate || null,
                endDate: formData.endDate || null,
                rating: formData.rating ? Number(formData.rating) : null,
                imageUrl: formData.imageUrl || null, // ✅ 이미 전체 URL이 들어있음
                shortReview: formData.shortReview.trim() || null,
                content: formData.content.trim() || null,
                tags: formData.tags
            };

            await createGame(payload);
            navigate('/app');
        } catch (err) {
            setError(err.response?.data?.message || err.message || '저장에 실패했습니다.');
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

            {error && <p style={{ color: '#ff6b6b', marginBottom: '16px' }}>{error}</p>}

            <form className="write-main-form" onSubmit={handleSubmit}>
                {/* 왼쪽 패널 */}
                <div className="form-left-panel">
                    <div className="form-card">
                        <div className="form-group">
                            <label>게임 제목 *</label>
                            <Input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="예: Elden Ring"
                                className="search"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>플레이 시간 (시간)</label>
                                <Input
                                    name="playTime"
                                    type="number"
                                    value={formData.playTime}
                                    onChange={handleChange}
                                    placeholder="130"
                                    className="search"
                                />
                            </div>
                            <div className="form-group">
                                <label>장르 *</label>
                                <select name="genre" value={formData.genre} onChange={handleChange}>
                                    {GENRE_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 플레이 상태 */}
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

                        {/* 평점 */}
                        <div className="form-group">
                            <label>평점</label>
                            <div className="rating-input-area">
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span
                                            key={star}
                                            style={{ cursor: 'pointer', color: star <= formData.rating ? '#F5C842' : '#5C4028', fontSize: '24px' }}
                                            onClick={() => handleRatingClick(star)}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="rating-num">{formData.rating}.0 / 5.0</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>한줄평</label>
                            <Input
                                name="shortReview"
                                value={formData.shortReview}
                                onChange={handleChange}
                                placeholder="소울라이크의 완성, 게임 역사에 남을 걸작"
                                className="search"
                            />
                        </div>

                        <div className="form-group">
                            <label>메모</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="게임에 대한 상세한 기록을 남겨보세요..."
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <Button text="✕ 취소" className="cancel-btn outline" type="button" onClick={() => navigate(-1)} />
                        <Button
                            text={isSubmitting ? '저장 중...' : '💾 저장하기'}
                            className="post"
                            type="submit"
                        />
                    </div>
                </div>

                {/* 오른쪽 패널 */}
                <div className="form-right-aside">
                    {/* 이미지 업로드 */}
                    <div className="form-card image-upload-card">
                        <div className="image-drop-zone">
                            <div className="preview-box">
                                {/* ✅ 수정: formData.imageUrl이 이미 전체 URL이므로 바로 src로 사용 */}
                                {formData.imageUrl
                                    ? <img src={formData.imageUrl} alt="preview" />
                                    : <div className="placeholder">{isUploading ? '업로드 중...' : '이미지 미지정'}</div>
                                }
                            </div>
                            <label className="upload-label">
                                {isUploading ? '⏳ 업로드 중...' : '📤 이미지 업로드'}
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>
                    </div>

                    {/* 태그 */}
                    <div className="form-card tag-card">
                        <label>🏷️ 태그</label>
                        <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="태그 입력 후 Enter"
                            className="search"
                        />
                        <div className="tag-cloud">
                            {formData.tags.map(t => (
                                <span
                                    key={t}
                                    className="tag-pill"
                                    onClick={() => handleTagRemove(t)}
                                >
                                    #{t} ✕
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default WriteGame;