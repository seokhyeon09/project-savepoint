import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGameById, updateGame, deleteGame } from '../../api/game.api'; 
import { STATUS_OPTIONS, GENRE_OPTIONS } from '../../constants/gameOption'; 
import Input from '../../components/ui/Input';   
import Button from '../../components/ui/Button'; 
import './WriteGame.scss'; // 글쓰기 SCSS 공유

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
                    imageUrl: data.imageUrl || '',
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
            <div className="title-wrap">
                <h2>게임 정보 수정</h2>
                <p>내용을 수정하거나 라이브러리에서 삭제할 수 있습니다.</p>
            </div>

            <form className="write-form" onSubmit={handleSubmit}>
                {/* --- 1. 기본 정보 --- */}
                <section className="form-section">
                    <div className="form-group">
                        <label>타이틀 *</label>
                        <Input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="게임 제목" required />
                    </div>

                    <div className="form-group row-group">
                        <div className="input-wrap">
                            <label>장르</label>
                            <select name="genre" value={formData.genre} onChange={handleChange}>
                                {GENRE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                        <div className="input-wrap">
                            <label>플레이 상태</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    </div>
                </section>

                {/* --- 2. 썸네일 --- */}
                <section className="form-section">
                    <div className="form-group">
                        <label>게임 커버 이미지</label>
                        <div className="image-upload-wrap">
                            <input type="file" accept="image/*" onChange={() => alert('이미지 수정은 S3 연동 후 지원됩니다.')} />
                            {formData.imageUrl && (
                                <div className="image-preview" >
                                    <img src={formData.imageUrl} alt="미리보기"/>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* --- 3. 디테일 정보 --- */}
                <section className="form-section">
                    <div className="form-group row-group">
                        <div className="input-wrap">
                            <label>플레이 타임 (시간)</label>
                            <Input type="number" name="playTime" value={formData.playTime} onChange={handleChange} min="0" />
                        </div>
                        <div className="input-wrap">
                            <label>평점 (1~5)</label>
                            <Input type="number" name="rating" value={formData.rating} onChange={handleChange} min="0" max="5" step="0.5" />
                        </div>
                    </div>

                    <div className="form-group row-group">
                        <div className="input-wrap">
                            <label>시작일</label>
                            <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                        </div>
                        <div className="input-wrap">
                            <label>종료일</label>
                            <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                {/* --- 4. 리뷰 및 태그 --- */}
                <section className="form-section">
                    <div className="form-group">
                        <label>한줄평</label>
                        <Input type="text" name="shortReview" value={formData.shortReview} onChange={handleChange} placeholder="이 게임을 한 줄로 표현한다면?" />
                    </div>

                    <div className="form-group">
                        <label>상세 리뷰</label>
                        <textarea name="content" value={formData.content} onChange={handleChange} rows="5" placeholder="소감을 자유롭게 적어주세요."></textarea>
                    </div>

                    <div className="form-group">
                        <label>태그 (입력 후 Enter)</label>
                        <Input 
                            type="text" 
                            value={tagInput} 
                            onChange={(e) => setTagInput(e.target.value)} 
                            onKeyDown={handleTagKeyDown} 
                            placeholder="#오픈월드 #인생게임" 
                        />
                        <div className="tag-list">
                            {formData.tags.map(tag => (
                                <span key={tag} className="tag-item" onClick={() => removeTag(tag)} >
                                    #{tag} &times;
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- 5. 버튼 영역 (삭제, 취소, 수정완료) --- */}
                <div className="submit-wrap" >
                    
                    {/*  왼쪽: 삭제 버튼 */}
                    <Button 
                        text="삭제하기" 
                        type="button" 
                        className="delete-btn" 
                        onClick={handleDelete}  
                    />
                    
                    {/*  오른쪽: 취소 & 수정완료 버튼 그룹 */}
                    <div className="right-actions" >
                        <Button 
                            text="취소" 
                            type="button" 
                            className="cancel-btn" 
                            onClick={() => navigate(-1)} // 뒤로가기(상세페이지로) 또는 '/app/dashboard'
                        />
                        <Button 
                            text={isSubmitting ? "저장 중..." : "수정 완료"} 
                            type="submit" 
                            className="post" 
                            disabled={isSubmitting}
                        />
                    </div>

                </div>
            </form>
        </div>
    );
};

export default EditGame;