import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { STATUS_OPTIONS, GENRE_OPTIONS } from '../../constants/gameOption'; // 원래 4개짜리 상태와 장르 옵션만 불러옵니다.
import './Sidebar.scss';

const Sidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // 주소창에서 현재 선택된 값을 읽어옵니다. (없으면 null)
    const currentStatus = searchParams.get('status');
    const currentGenre = searchParams.get('genre');

    // 상태와 장르가 모두 선택되지 않은 상태가 바로 '전체 라이브러리' 상태입니다.
    const isAll = !currentStatus && !currentGenre;

    // 1. 전체 라이브러리 (리셋) 기능
    const handleReset = () => {
        searchParams.delete('status');
        searchParams.delete('genre');
        setSearchParams(searchParams);
    };

    // 2. 개별 필터 토글(ON/OFF) 기능
    const handleFilterClick = (filterKey, value) => {
        // 방금 누른 값이 현재 주소창에 있는 값과 똑같다면? (한 번 더 누름)
        if (searchParams.get(filterKey) === value) {
            searchParams.delete(filterKey); // 선택 해제 (꼬리표 지우기)
        } else {
            searchParams.set(filterKey, value); // 새로운 값으로 설정
        }
        setSearchParams(searchParams);
    };

    return (
        <aside className="savepoint-aside">
            {/* 프로필 영역 생략... */}

            <nav className="nav-section">
                
                {/* --- 전체 라이브러리 (리셋 버튼 역할) --- */}
                <div className="filter-group">
                    <ul>
                        <li 
                            className={isAll ? 'active' : ''} 
                            onClick={handleReset}
                            style={{ fontWeight: 'bold', marginBottom: '1rem' }} // 시각적으로 띄워주면 좋습니다!
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