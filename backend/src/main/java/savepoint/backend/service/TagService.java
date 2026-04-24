// src/main/java/savepoint/backend/service/TagService.java
package savepoint.backend.service;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
// 🔥 전체 import 경로를 savepoint로 변경!
import savepoint.backend.domain.Member;
import savepoint.backend.domain.Game; 
import savepoint.backend.domain.Tag;
import savepoint.backend.repository.MemberRepository;
import savepoint.backend.repository.GameRepository; 
import savepoint.backend.repository.TagRepository;
// 🔥 TagResponse를 아직 안 만드셨다면 web.dto.TagResponse 도 하나 만들어주셔야 합니다. (기존 picstory 코드 참고)
import savepoint.backend.web.dto.TagResponse; 

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagService {

    private final TagRepository tagRepository;
    private final MemberRepository memberRepository;
    // PostRepository 대신 GameRepository 사용
    private final GameRepository gameRepository; 

    private static final String LOGIN_MEMBER_ID = "LOGIN_MEMBER_ID";

    @Transactional
    public TagResponse createTag(HttpSession session, String rawLabel) {
        Long memberId = (Long) session.getAttribute(LOGIN_MEMBER_ID);
        if (memberId == null) {
            throw new IllegalArgumentException("로그인 후 이용해 주세요");
        }
        Set<Tag> tags = resolveOrCreateTags(memberId, List.of(rawLabel));

        return tags.stream()
                .findFirst()
                .map(TagResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("태그 생성에 실패 했습니다."));
    }

    public List<TagResponse> findMyTags(HttpSession session) {
        Long memberId = (Long) session.getAttribute(LOGIN_MEMBER_ID);
        if (memberId == null) {
            return List.of();
        }
        return tagRepository.findAllByMember_Id(memberId)
                .stream()
                .map(TagResponse::from)
                .toList();
    }

    @Transactional
    public void delete(HttpSession session, Long tagId) {
        Long memberId = (Long) session.getAttribute(LOGIN_MEMBER_ID);
        if (memberId == null) {
            throw new IllegalArgumentException("로그인 후 이용해 주세요");
        }

        Tag tag = tagRepository.findByIdAndMember_Id(tagId, memberId)
                .orElseThrow(() -> new IllegalArgumentException("tag를 찾을 수 없습니다."));

        // Post가 아니라 Game에서 태그를 지우도록 수정
        for (Game game : tag.getGames()) {
            game.getTags().remove(tag);
        }
        tagRepository.delete(tag);
    }

    // 아래 normalizeLabels 와 resolveOrCreateTags 로직은 기존과 100% 동일하므로 생략하지 않고 그대로 두시면 됩니다!
    private static List<String> normalizeLabels(List<String> rawLabels) {
        if (rawLabels == null) {
            return List.of();
        }
        Set<String> unique = new LinkedHashSet<>();
        for (String raw : rawLabels) {
            if (raw == null) continue;
            String label = raw.trim();
            if (label.startsWith("#")) {
                label = label.substring(1).trim();
            }
            if (label.isBlank()) continue;
            if (label.length() > 50) {
                throw new IllegalArgumentException("태그는 50자 이하여야 합니다.");
            }
            unique.add(label);
        }
        return new ArrayList<>(unique);
    }

    @Transactional
    public Set<Tag> resolveOrCreateTags(Long memberId, List<String> rawLabels) {
        if (memberId == null) {
            throw new IllegalArgumentException("로그인 후 이용해 주세요");
        }
        List<String> normalized = normalizeLabels(rawLabels);
        if (normalized.isEmpty()) {
            return new HashSet<>();
        }
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        List<Tag> existingTags = tagRepository.findAllByMember_IdAndLabelIn(memberId, normalized);
        Map<String, Tag> existingByLabel = existingTags.stream()
                .collect(Collectors.toMap(Tag::getLabel, t -> t));

        List<Tag> toCreate = normalized.stream()
                .filter(label -> !existingByLabel.containsKey(label))
                .map(label -> new Tag(member, label))
                .toList();

        if (!toCreate.isEmpty()) {
            tagRepository.saveAll(toCreate);
        }

        Set<Tag> result = new HashSet<>(existingTags);
        result.addAll(toCreate);
        return result;
    }
}