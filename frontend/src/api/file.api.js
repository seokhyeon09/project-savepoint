import axios from 'axios'
import client from './client'

/**
 * Presigned URL 발급 요청
 * 백엔드: GET /api/files/presigned-url?prefix=games&fileName=cover.jpg
 */
export const getPresignedUrl = async ({ prefix = 'games', fileName }) => {
    const response = await client.get('/api/files/presigned-url', {
        params: { prefix, fileName }
    })
    return response.data // { presignedUrl, s3Key, fileUrl }
}

/**
 * S3에 직접 파일 업로드 (Presigned URL 사용)
 */
export const uploadFileToS3 = async ({ uploadUrl, file, contentType }) => {
    await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': contentType }
    })
}

/**
 * 파일 선택 → presigned URL 발급 → S3 업로드 → fileUrl 반환
 *
 * ✅ 수정: s3Key 대신 fileUrl(전체 URL)을 반환합니다.
 *   - s3Key: games/2026/05/13/uuid-cover.jpg  ← DB 저장 X (이미지 표시 불가)
 *   - fileUrl: https://버킷명.s3.ap-northeast-2.amazonaws.com/games/...  ← DB에 이걸 저장해야 함
 */
export const uploadImage = async (file) => {
    const { presignedUrl, fileUrl } = await getPresignedUrl({
        prefix: 'games',
        fileName: file.name
    })

    await uploadFileToS3({
        uploadUrl: presignedUrl,
        file,
        contentType: file.type
    })

    // ✅ 전체 URL 반환 → DB에 저장 → 이미지 바로 표시 가능
    return fileUrl
}