import axios from "axios";
import client from './client';

export const getPresignedUrl = async ({ fileName, contentType }) => {
    const response = await client.post('/files/presigned-url', {
        fileName,
        contentType
    });
    return response.data;
};

export const uploadFileToS3 = async ({ uploadUrl, file, contentType }) => {
    const response = await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': contentType }
    });
    return response.data;
};

export const uploadImage = async (file) => {
    const presigned = await getPresignedUrl({
        fileName: file.name,
        contentType: file.type
    });

    await uploadFileToS3({
        uploadUrl: presigned.uploadUrl,
        file,
        contentType: file.type
    });

    return presigned; // 반환된 presigned.fileUrl을 Game 등록 시 imageUrl로 사용합니다.
};