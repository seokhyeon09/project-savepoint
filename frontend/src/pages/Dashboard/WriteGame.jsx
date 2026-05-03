import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame } from '../../api/game.api'; 
import { uploadImage } from '../../api/file.api'; // S3 이미지 업로드 함수
import { STATUS_OPTIONS, GENRE_OPTIONS } from '../../constants/gameOption'; // 옵션 배열 재사용
import Button from '../../components/ui/Button';
import './WriteGame.scss'; // (생성하실 SCSS 파일)

const WriteGame = () => {
    const navigate = useNavigate();
    
    // 1. 폼 데이터 상태 관리 (백엔드 GameRequest DTO 구조와 동일하게 세팅)
    const [formData, setFormData] = useState({
        title: '',
        playTime: 0,
        genre: 'ACTION', // 기본값 세팅
        status: 'PLAYING', // 기본값 세팅
        startDate: '',
        endDate: '',
        rating: 0,
        imageUrl: '',
        shortReview: '',
        content: '',
        tags: []
    });

    // 태그 입력을 위한 별도 상태
    const [tagInput, setTagInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 2. 일반 텍스트/숫자/셀렉트 입력 처리
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'playTime' || name === 'rating' ? Number(value) : value
        }));
    };

    // 3. 이미지 업로드 처리 (S3 다이렉트 업로드)
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // 파일을 선택하자마자 백엔드 거치지 않고 S3로 바로 쏩니다.
            const presigned = await uploadImage(file);
            
            // 업로드 성공 시, 반환받은 최종 이미지 주소를 formData에 저장합니다.
            // (주의: fileUrl은 백엔드 S3Controller 응답 키값에 맞게 수정하세요)
            setFormData((prev) => ({ ...prev, imageUrl: presigned.fileUrl || presigned.url })); 
        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            alert('이미지를 업로드하지 못했습니다.');
        }
    };

    // 4. 해시태그 엔터키 입력 처리
    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 폼 제출 방지
            const newTag = tagInput.trim();
            
            // 빈 값이 아니고, 중복된 태그가 아닐 때만 추가
            if (newTag && !formData.tags.includes(newTag)) {
                setFormData((prev) => ({
                    ...prev,
                    tags: [...prev.tags, newTag]
                }));
            }
            setTagInput(''); // 입력창 비우기
        }
    };

    // 태그 삭제 처리
    const removeTag = (tagToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    // 5. 폼 최종 제출
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
            navigate('/app/dashboard'); // 등록 후 대시보드로 이동
        } catch (error) {
            console.error('등록 에러:', error);
            alert('게임 등록에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="write-page-container">
            <div className="title-wrap">
                <h2>새로운 게임 추가</h2>
                <p>라이브러리에 보관할 게임의 정보를 입력해 주세요.</p>
            </div>

            <form className="write-form" onSubmit={handleSubmit}>
                {/* --- 1. 기본 정보 영역 --- */}
                <section className="form-section">
                    <div className="form-group">
                        <label>타이틀 *</label>
                        <input 
                            type="text" name="title" 
                            value={formData.title} onChange={handleChange} 
                            placeholder="게임 제목을 입력하세요" required 
                        />
                    </div>

                    <div className="form-group row-group">
                        <div className="input-wrap">
                            <label>장르</label>
                            <select name="genre" value={formData.genre} onChange={handleChange}>
                                {GENRE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-wrap">
                            <label>플레이 상태</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                {STATUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* --- 2. 썸네일 업로드 영역 --- */}
                <section className="form-section">
                    <div className="form-group">
                        <label>게임 커버 이미지</label>
                        <div className="image-upload-wrap">
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                            {formData.imageUrl && (
                                <div className="image-preview">
                                    <img src={formData.imageUrl} alt="미리보기" />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* --- 3. 디테일 정보 영역 --- */}
                <section className="form-section">
                    <div className="form-group row-group">
                        <div className="input-wrap">
                            <label>플레이 타임 (시간)</label>
                            <input type="number" name="playTime" value={formData.playTime} onChange={handleChange} min="0" />
                        </div>
                        <div className="input-wrap">
                            <label>평점 (1~5)</label>
                            <input type="number" name="rating" value={formData.rating} onChange={handleChange} min="0" max="5" step="0.5" />
                        </div>
                    </div>

                    <div className="form-group row-group">
                        <div className="input-wrap">
                            <label>시작일</label>
                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                        </div>
                        <div className="input-wrap">
                            <label>종료일</label>
                            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                {/* --- 4. 리뷰 및 태그 영역 --- */}
                <section className="form-section">
                    <div className="form-group">
                        <label>한줄평</label>
                        <input type="text" name="shortReview" value={formData.shortReview} onChange={handleChange} placeholder="이 게임을 한 줄로 표현한다면?" />
                    </div>

                    <div className="form-group">
                        <label>상세 리뷰</label>
                        <textarea name="content" value={formData.content} onChange={handleChange} rows="5" placeholder="게임에 대한 소감을 자유롭게 적어주세요."></textarea>
                    </div>

                    <div className="form-group">
                        <label>태그 (입력 후 Enter)</label>
                        <input 
                            type="text" 
                            value={tagInput} 
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="#오픈월드 #인생게임" 
                        />
                        <div className="tag-list">
                            {formData.tags.map(tag => (
                                <span key={tag} className="tag-item" onClick={() => removeTag(tag)}>
                                    #{tag} &times;
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- 제출 버튼 --- */}
                <div className="submit-wrap">
                    <Button 
                        text={isSubmitting ? "등록 중..." : "게임 저장하기"} 
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