import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGameById, updateGame, deleteGame } from '../../api/game.api';
import { uploadImage } from '../../api/file.api';
import { STATUS_OPTIONS, GENRE_OPTIONS } from '../../constants/gameOption';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import './WriteGame.scss';

const EditGame = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 1. 상태 관리
    const [formData, setFormData] = useState({
        title: '', playTime: 0, genre: 'ACTION', status: 'PLAYING',
        startDate: '', endDate: '', rating: 0, imageUrl: '',
        shortReview: '', content: '', tags: []
    });

    const [tagInput, setTagInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    // 상태 버튼 전용 아이콘 매핑
    const statusIcons = {
        COMPLETED: '✓', PLAYING: '▶', PAUSED: '⏸', WISHLIST: '🔖', DROPPED: '✕'
    };

    // 2. 기존 데이터 불러오기
    useEffect(() => {
        const fetchGame = async () => {
            try {
                const data = await getGameById(id);
                setFormData({
                    title: data.title || '',
                    playTime: data.playTime || 0,
                    genre: data.genre || 'ACTION',
                    status: data.status || 'PLAYING',
                    startDate: data.startDate || '',
                    endDate: data.endDate || '',
                    rating: data.rating || 0,
                    imageUrl: data.imageUrl || '', // ✅ DB에 저장된 전체 URL 그대로 사용
                    shortReview: data.shortReview || '',
                    content: data.content || '',
                    tags: data.tags || []
                });
            } catch (error) {
                console.error('데이터 로드 실패:', error);
                alert('게임 정보를 불러오지 못했습니다.');
                navigate(-1);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGame();
    }, [id, navigate]);

    // 3. 입력 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'playTime' || name === 'rating' ? Number(value) : value
        }));
    };

    // ✅ 이미지 업로드 핸들러 추가
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setIsUploading(true);
            setUploadError('');
            const fileUrl = await uploadImage(file);
            setFormData(prev => ({ ...prev, imageUrl: fileUrl }));
        } catch (err) {
            setUploadError('이미지 업로드에 실패했습니다: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !formData.tags.includes(newTag)) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
    };

    // 4. API 전송 (수정 & 삭제)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) return alert('타이틀을 입력해주세요!');

        setIsSubmitting(true);
        try {
            await updateGame(id, formData);
            alert('성공적으로 수정되었습니다!');
            navigate(`/app/games/${id}`, { replace: true });
        } catch (error) {
            console.error('수정 에러:', error);
            alert('게임 수정에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("정말 이 게임을 라이브러리에서 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.")) {
            try {
                await deleteGame(id);
                alert("삭제되었습니다.");
                navigate('/app/dashboard', { replace: true });
            } catch (error) {
                console.error("삭제 실패:", error);
                alert("삭제에 실패했습니다.");
            }
        }
    };

    if (isLoading) return <div className="loading-state">데이터를 불러오는 중...</div>;

    return (
        <div className="write-page-container">
            <header className="write-header">
                <h2>게임 정보 수정</h2>
                <p>내용을 수정하거나 라이브러리에서 삭제할 수 있습니다.</p>
            </header>

            <form className="write-main-form" onSubmit={handleSubmit}>
                {/* 폼 입력 */}
                <div className="form-left-panel">
                    <div className="form-card">
                        <div className="form-group">
                            <label>게임 제목 *</label>
                            <Input name="title" value={formData.title} onChange={handleChange} placeholder="예: Elden Ring" className="search" required />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>플레이 시간</label>
                                <Input name="playTime" type="number" value={formData.playTime} onChange={handleChange} min="0" className="search" />
                            </div>
                            <div className="form-group">
                                <label>장르 *</label>
                                <select name="genre" value={formData.genre} onChange={handleChange}>
                                    {GENRE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* 플레이 상태 필(Pill) 버튼 그룹 */}
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
                            <label>평점 (0~5)</label>
                            <Input name="rating" type="number" value={formData.rating} onChange={handleChange} min="0" max="5" step="0.5" className="search" />
                        </div>

                        <div className="form-group">
                            <label>한줄평</label>
                            <Input name="shortReview" value={formData.shortReview} onChange={handleChange} placeholder="이 게임을 한 줄로 표현한다면?" className="search" />
                        </div>

                        <div className="form-group">
                            <label>메모</label>
                            <textarea name="content" value={formData.content} onChange={handleChange} placeholder="소감을 자유롭게 적어주세요." rows="6" />
                        </div>
                    </div>

                    {/* 하단 액션 버튼 영역 */}
                    <div className="form-actions" style={{ justifyContent: 'space-between', width: '100%' }}>
                        <Button
                            text="🗑 삭제하기"
                            type="button"
                            onClick={handleDelete}
                            className='delete-btn'
                        />
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Button text="✕ 취소" type="button" className="cancel-btn outline" onClick={() => navigate(-1)} />
                            <Button text={isSubmitting ? "저장 중..." : "💾 수정 완료"} type="submit" className="post" disabled={isSubmitting} />
                        </div>
                    </div>
                </div>

                {/* 오른쪽 패널: 이미지 & 태그 */}
                <div className="form-right-aside">
                    <div className="form-card image-upload-card">
                        <div className="image-drop-zone">
                            <div className="preview-box">
                                {/* ✅ 수정: DB의 imageUrl은 이미 전체 URL → 바로 src로 사용 */}
                                {formData.imageUrl ? (
                                    <img src={formData.imageUrl} alt="preview" />
                                ) : (
                                    <div className="placeholder">
                                        {isUploading ? '업로드 중...' : '이미지 미지정'}
                                    </div>
                                )}
                            </div>
                            {/* ✅ 수정: 이미지 수정 기능 활성화 */}
                            <label className="upload-label">
                                {isUploading ? '⏳ 업로드 중...' : '📤 이미지 수정'}
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={isUploading}
                                />
                            </label>
                            {uploadError && <p style={{ color: '#ff6b6b', fontSize: '12px' }}>{uploadError}</p>}
                        </div>
                    </div>

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
                            {formData.tags.map(tag => (
                                <span key={tag} className="tag-pill" onClick={() => removeTag(tag)}>
                                    {tag} ✕
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditGame;