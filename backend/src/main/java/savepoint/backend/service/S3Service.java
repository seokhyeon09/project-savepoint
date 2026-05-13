package savepoint.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import savepoint.backend.web.dto.PresignedUrlResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.services.s3.S3Client;

import java.time.Duration;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class S3Service {

    private final S3Presigner s3Presigner;
    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket:}")
    private String bucket;

    @Value("${cloud.aws.region:ap-northeast-2}")
    private String region;

    public S3Service(S3Presigner s3Presigner, S3Client s3Client){
        this.s3Presigner = s3Presigner;
        this.s3Client = s3Client;
    }

    public PresignedUrlResponse createPresignUrl(String fileName, String contentType){
        if(bucket == null || bucket.isBlank()){
            throw new IllegalArgumentException("S3 bucket is not configured.");
        }

        // 파일명 공백 제거 등 안전 처리
        String safeFileName = (fileName == null || fileName.isBlank())
                ? "file" : fileName.replaceAll("\\s+", "_"); // 공백을 밑줄로 변경

        String safeContentType = (contentType == null || contentType.isBlank())
                ? "application/octet-stream" : contentType;

        // 💡 기존 꿀팁 적용: 날짜별 폴더링 (예: uploads/2026/05/13/uuid_파일명)
        String datePath = LocalDate.now().toString().replace("-", "/");
        String key = "uploads/" + datePath + "/" + UUID.randomUUID() + "_" + safeFileName;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(safeContentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .putObjectRequest(putObjectRequest)
                .build();

        PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(presignRequest);
        String fileUrl = "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;

        // 특강의 DTO에 맞춰서 반환
        return new PresignedUrlResponse(
                presignedRequest.url().toString(),
                key,
                fileUrl
        );
    }

    public void deleteFile(String fileUrl) {
        String key = fileUrl.substring(fileUrl.indexOf("/uploads/") + 1);
        s3Client.deleteObject(b -> b.bucket(bucket).key(key));
    }
}