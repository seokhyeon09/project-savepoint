// 1. 장르 옵션 (글쓰기 폼 등에서 사용)
export const GENRE_OPTIONS = [
    { label: '액션', value: 'ACTION' },
    { label: '슈팅', value: 'SHOOTING' },
    { label: '어드벤처', value: 'ADVENTURE' },
    { label: '전략', value: 'STRATEGY' },
    { label: '시뮬레이션', value: 'SIMULATION' },
    { label: '롤플레잉', value: 'RPG' },
    { label: '퍼즐', value: 'PUZZLE' },
    { label: '리듬', value: 'RHYTHM' },
    { label: '기타', value: 'ETC' }
];

// 2. 상태 옵션 - 4개 (백엔드와 동일 / 글쓰기, 수정 시 사용)
export const STATUS_OPTIONS = [
    { label: '플레이 중', value: 'PLAYING' },
    { label: '일시중단', value: 'PAUSED' },
    { label: '완료한 게임', value: 'COMPLETED' },
    { label: '위시리스트', value: 'WISHLIST' }
];

// 3. 사이드바 필터용 상태 옵션 - 5개 (전체 포함)
export const SIDEBAR_STATUS_OPTIONS = [
    { label: '전체 게임', value: 'ALL' }, // 프론트엔드에서만 쓰는 가짜 상태값
    ...STATUS_OPTIONS
];