import client from './client';

// 게임 등록
export const createGame = async (payload) => {
    const response = await client.post('/api/games', payload);
    return response.data;
};

// 내 라이브러리 전체 조회 (추후 백엔드에 findMyGames 추가 시 사용)
export const getMyGames = async () => {
    const response = await client.get('/api/games');
    return response.data;
};

// 특정 게임 상세 조회
export const getGameById = async (id) => {
    const response = await client.get(`/api/games/${id}`);
    return response.data;
};

// 게임 정보 수정
export const updateGame = async (id, payload) => {
    const response = await client.patch(`/api/games/${id}`, payload);
    return response.data;
};

// 게임 삭제
export const deleteGame = async (id) => {
    const response = await client.delete(`/api/games/${id}`);
    return response.data;
};