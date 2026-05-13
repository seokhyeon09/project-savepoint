import axios from "axios";
import client from './client';

// 백엔드에 S3 출입증(Presigned URL) 발급 요청
export const getPresignedUrl = async ({ fileName, contentType }) => {
    // client의 BASE_URL이 'http://localhost:8080' 이므로 
    // 뒤에 프론트엔드 API 규칙에 맞게 '/api/files/presigned-url'을 붙여줍니다.
    const response = await client.post('/api/files/presigned-url', {
        fileName,
        contentType
    });
    return response.data;
};

// 발급받은 출입증으로 S3에 진짜 파일 다이렉트 업로드
export const uploadFileToS3 = async ({ uploadUrl, file, contentType }) => {
    const response = await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': contentType }
    });
    return response.data;
};

// 1,2번 과정묶기
export const uploadImage = async (file) => {
    const presigned = await getPresignedUrl({ fileName: file.name, contentType: file.type });

    await uploadFileToS3({ uploadUrl: presigned.uploadUrl, file, contentType: file.type });

    return {
        ...presigned,
        fileUrl: presigned.contentType // ← contentType에 URL이 들어있음
    };
};