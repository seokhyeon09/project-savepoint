import React from 'react';
import { useSearchParams, useLocation, useNavigate, createSearchParams } from 'react-router-dom'; //  useLocation, useNavigate 추가!
import { STATUS_OPTIONS, GENRE_OPTIONS } from '../../constants/gameOption'; 
import './Sidebar.scss';
import { useAuth } from '@/store/auth.store';

const Sidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation(); // 현재 내가 있는 주소 확인
    const navigate = useNavigate(); // 페이지 이동을 위한 함수

    // Zustand(또는 Context)에서 로그인된 내 정보 꺼내기
    const { member, isReady } = useAuth();

    // 주소창에서 현재 선택된 값을 읽어옵니다. (없으면 null)
    const currentStatus = searchParams.get('status');
    const currentGenre = searchParams.get('genre');
    // 상태와 장르가 모두 선택되지 않은 상태가 바로 '전체 라이브러리' 상태입니다.
    const isAll = !currentStatus && !currentGenre;

    //  현재 페이지가 대시보드인지 확인하는 변수
    const isDashboard = location.pathname === '/app/dashboard' || location.pathname === '/app';

    // 1. 전체 라이브러리 (리셋) 기능
    const handleReset = () => {
        if (!isDashboard) {
            // 대시보드가 아니면 깔끔하게 대시보드로 이동!
            navigate('/app/dashboard');
        } else {
            // 대시보드라면 기존처럼 필터만 초기화
            searchParams.delete('status');
            searchParams.delete('genre');
            setSearchParams(searchParams);
        }
    };

    // 2. 개별 필터 토글(ON/OFF) 기능
    const handleFilterClick = (filterKey, value) => {
        // 기존 파라미터를 복사해서 새로운 객체를 만듭니다.
        const newParams = new URLSearchParams(searchParams);

        if (newParams.get(filterKey) === value) {
            newParams.delete(filterKey); 
        } else {
            newParams.set(filterKey, value); 
        }

        if (!isDashboard) {
            //  대시보드가 아니면? -> "대시보드 주소 + 방금 누른 필터 조건"으로 페이지 이동!
            navigate({
                pathname: '/app/dashboard',
                search: `?${newParams.toString()}` // 예: ?genre=ACTION
            });
        } else {
            //  대시보드라면? -> 기존처럼 파라미터만 업데이트 (화면 리렌더링)
            setSearchParams(newParams);
        }
    };

    const handleProfileClick = () => {
        // 프로필 페이지 주소에 맞게 수정해주세요 (예: /app/profile)
        navigate('/app/profile'); 
    };

    return (
        <aside className="savepoint-aside">
            {/* --- 추가된 프로필 영역 --- */}
            <div 
                className="sidebar-profile-wrap" 
                onClick={handleProfileClick} 
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    padding: '1rem', 
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    marginBottom: '1rem'
                }}
            >
                {/* 프로필 동그라미 (이름 첫 글자) */}
                <div 
                    className="profile-avatar" 
                    style={{
                        width: '40px', height: '40px', 
                        borderRadius: '50%', backgroundColor: '#333', 
                        color: '#fff', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold'
                    }}
                >
                    {!isReady ? '?' : (member?.name?.charAt(0) ?? '_')}
                </div>
                
                {/* 프로필 이름과 이메일 */}
                <div className="profile-info" style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {!isReady ? '로딩중...' : (member?.name ?? '사용자')}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
                        {member?.email ?? '이메일 없음'}
                    </span>
                </div>
            </div>

            <nav className="nav-section">
                
                {/* --- 전체 라이브러리 (리셋 버튼 역할) --- */}
                <div className="filter-group">
                    <ul>
                        <li 
                            className={isAll ? 'active' : ''} 
                            onClick={handleReset}
                        >
                            전체 라이브러리
                        </li>
                    </ul>
                </div>

                {/* --- 상태 필터 영역 (4개) --- */}
                <div className="filter-group">
                    <h4>플레이 상태</h4>
                    <ul>
                        {STATUS_OPTIONS.map((option) => (
                            <li
                                key={option.value}
                                className={currentStatus === option.value ? 'active' : ''}
                                onClick={() => handleFilterClick('status', option.value)}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* --- 장르 필터 영역 --- */}
                <div className="filter-group">
                    <h4>장르</h4>
                    <ul>
                        {GENRE_OPTIONS.map((option) => (
                            <li
                                key={option.value}
                                className={currentGenre === option.value ? 'active' : ''}
                                onClick={() => handleFilterClick('genre', option.value)}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;