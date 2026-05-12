import React from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { STATUS_OPTIONS, GENRE_OPTIONS } from '../../constants/gameOption'; 
import './Sidebar.scss';
import { useAuth } from '@/store/auth.store';

const Sidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation(); 
    const navigate = useNavigate(); 

    const { member, isReady } = useAuth();

    const currentStatus = searchParams.get('status');
    const currentGenre = searchParams.get('genre');
    const isAll = !currentStatus && !currentGenre;

    const isDashboard = location.pathname === '/app/dashboard' || location.pathname === '/app';

    const handleReset = () => {
        if (!isDashboard) {
            navigate('/app/dashboard');
        } else {
            searchParams.delete('status');
            searchParams.delete('genre');
            setSearchParams(searchParams);
        }
    };

    const handleFilterClick = (filterKey, value) => {
        const newParams = new URLSearchParams(searchParams);

        if (newParams.get(filterKey) === value) {
            newParams.delete(filterKey); 
        } else {
            newParams.set(filterKey, value); 
        }

        if (!isDashboard) {
            navigate({
                pathname: '/app/dashboard',
                search: `?${newParams.toString()}` 
            });
        } else {
            setSearchParams(newParams);
        }
    };

    const handleProfileClick = () => {
        navigate('/app/profile'); 
    };

    return (
        <aside className="savepoint-aside">
            {/* --- 프로필 영역 --- */}
            <div className="sidebar-profile-wrap" onClick={handleProfileClick}>
                <div className="profile-avatar">
                    {!isReady ? '?' : (member?.name?.charAt(0) ?? '_')}
                </div>
                
                <div className="profile-info">
                    <span className="profile-edit">내 프로필 수정하기</span>
                    <span className="profile-name">
                        {!isReady ? '로딩중...' : (member?.name ?? '사용자')}
                    </span>
                    <span className="profile-email">
                        {member?.email ?? '이메일 없음'}
                    </span>
                </div>
            </div>

            <nav className="nav-section">
                
                {/* --- 전체 라이브러리 --- */}
                <div className="filter-group">
                    <ul>
                        <li className={isAll ? 'active' : ''} onClick={handleReset}>
                            전체 라이브러리
                        </li>
                    </ul>
                </div>

                {/* --- 상태 필터 영역 --- */}
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