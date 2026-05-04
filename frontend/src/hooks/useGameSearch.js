// src/hooks/useGameSearch.js
import { useState, useMemo } from 'react';

const useGameSearch = (initialGames) => {
    // 검색어 상태 관리
    const [searchTerm, setSearchTerm] = useState('');

    // 검색어 입력 핸들러
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // 검색어에 맞게 게임 리스트 필터링 (useMemo로 성능 최적화)
    const searchedGames = useMemo(() => {
        if (!searchTerm.trim()) {
            return initialGames;
        }

        const lowerSearchTerm = searchTerm.toLowerCase();
        
        return initialGames.filter(game => {
            // 1. 게임 타이틀에 검색어가 포함되어 있는지 확인
            const matchTitle = game.title?.toLowerCase().includes(lowerSearchTerm);
            
            // 2. 게임 상세 리뷰(내용)에 검색어가 포함되어 있는지 확인
            const matchContent = game.content?.toLowerCase().includes(lowerSearchTerm);

            // 제목에 포함되거나(OR), 리뷰 내용에 포함되어 있다면 검색 결과에 노출!
            return matchTitle || matchContent;
        });
    }, [initialGames, searchTerm]);

    return {
        searchTerm,
        handleSearchChange,
        searchedGames
    };
};

export default useGameSearch;