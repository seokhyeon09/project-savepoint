package savepoint.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import savepoint.backend.service.S3Service;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class S3Controller {

    private final S3Service s3Service;

    // 프론트에서 ?prefix=games&fileName=cover.jpg 형태로 요청
    @GetMapping("/presigned-url")
    public ResponseEntity<Map<String, String>> getPresignedUrl(
            @RequestParam(defaultValue = "games") String prefix,
            @RequestParam String fileName) {

        S3Service.PresignedUrlDto result = s3Service.getPresignedUrl(prefix, fileName);

        // ✅ fileUrl 추가 반환: 프론트에서 DB 저장 및 이미지 표시에 사용
        return ResponseEntity.ok(Map.of(
                "presignedUrl", result.presignedUrl(),
                "s3Key",        result.s3Key(),
                "fileUrl",      result.fileUrl()   // ← 추가
        ));
    }
}