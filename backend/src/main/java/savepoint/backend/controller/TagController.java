package savepoint.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import savepoint.backend.service.TagService;
import savepoint.backend.web.dto.CreateTagRequest;
import savepoint.backend.web.dto.TagResponse;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tags") // 프론트엔드 연동을 위해 /api 를 붙여주었습니다.
public class TagController {
    
    private final TagService tagService;

    // 1. 내 태그 목록 조회 (중복된 API를 하나로 깔끔하게 합쳤습니다!)
    @GetMapping
    public ResponseEntity<List<TagResponse>> getMyTags(HttpSession session) {
        // TagService에 이미 완벽하게 구현된 findMyTags 호출
        List<TagResponse> myTags = tagService.findMyTags(session);
        
        // 만약 등록된 태그가 없다면 빈 배열 반환
        if (myTags == null || myTags.isEmpty()) {
            return ResponseEntity.ok(java.util.Collections.emptyList());
        }
        
        return ResponseEntity.ok(myTags);
    }

    // 2. 태그 생성
    @PostMapping
    public ResponseEntity<TagResponse> createTag(@RequestBody CreateTagRequest request, HttpSession session){
        TagResponse response = tagService.createTag(session, request.label());
        return ResponseEntity.ok(response);
    }

    // 3. 태그 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, HttpSession session){
        tagService.delete(session, id);
        return ResponseEntity.ok().build();
    }
}