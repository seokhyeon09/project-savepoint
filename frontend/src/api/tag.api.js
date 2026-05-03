import client from './client';

// 내 태그 목록 조회
export const getMyTags = async () => {
    const response = await client.get('/api/tags');
    return response.data;
};

// 새 태그 생성
export const createTag = async (label) => {
    const response = await client.post('/api/tags', { label });
    return response.data;
};

// 태그 삭제
export const deleteTag = async (tagId) => {
    await client.delete(`/api/tags/${tagId}`);
    return `${tagId} 삭제 완료`;
};