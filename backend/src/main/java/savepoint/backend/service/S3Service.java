package savepoint.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket}")
    private String bucket;

    @Value("${aws.region}")
    private String region;

    // ✅ fileUrl 필드 추가: DB에 저장할 전체 공개 URL
    public record PresignedUrlDto(String presignedUrl, String s3Key, String fileUrl) {}

    public PresignedUrlDto getPresignedUrl(String prefix, String originalFileName) {

        // 1. 폴더/날짜/UUID 조합으로 고유한 S3 Key 생성
        // 예: games/2026/05/13/uuid-cover.jpg
        String datePath = LocalDate.now().toString().replace("-", "/");
        String s3Key = prefix + "/" + datePath + "/" + UUID.randomUUID() + "-" + originalFileName;

        // 2. S3 업로드 요청 정보 세팅
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(s3Key)
                .build();

        // 3. Presigned URL 세팅 (10분 유효)
        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .putObjectRequest(putObjectRequest)
                .build();

        // 4. 서명된 URL 생성
        PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(presignRequest);
        String presignedUrl = presignedRequest.url().toString();

        // ✅ 5. 이미지를 표시할 때 사용할 전체 공개 URL 생성
        // 형식: https://{bucket}.s3.{region}.amazonaws.com/{s3Key}
        String fileUrl = "https://" + bucket + ".s3." + region + ".amazonaws.com/" + s3Key;

        return new PresignedUrlDto(presignedUrl, s3Key, fileUrl);
    }
}