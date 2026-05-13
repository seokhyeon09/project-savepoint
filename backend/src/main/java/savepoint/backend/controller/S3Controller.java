package savepoint.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import savepoint.backend.service.S3Service;
import savepoint.backend.web.dto.PresignedUrlRequest;
import savepoint.backend.web.dto.PresignedUrlResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/files") // 💡 프론트엔드 API 규칙을 맞추기 위해 /api/files 로 유지
public class S3Controller {
    
    private final S3Service s3Service;

    // GET에서 POST로 변경 완료!
    @PostMapping(value = "/presigned-url", consumes = MediaType.APPLICATION_JSON_VALUE)
    public PresignedUrlResponse createPresignedUrl(@RequestBody PresignedUrlRequest request){
        return s3Service.createPresignUrl(
                request.fileName(),
                request.contentType()
        );
    }
}