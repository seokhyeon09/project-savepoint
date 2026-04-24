// src/main/java/savepoint/backend/controller/TagController.java
package savepoint.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
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

    @GetMapping
    public List<TagResponse> myTags(HttpSession session){
        return tagService.findMyTags(session);
    }

    @PostMapping
    public TagResponse createTag(@RequestBody CreateTagRequest request, HttpSession session){
        return tagService.createTag(session, request.label());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, HttpSession session){
        tagService.delete(session, id);
    }
}