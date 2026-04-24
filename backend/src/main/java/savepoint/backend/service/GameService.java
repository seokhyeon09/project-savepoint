package savepoint.backend.service;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import savepoint.backend.domain.Game;
import savepoint.backend.domain.Member;
import savepoint.backend.repository.GameRepository;
import savepoint.backend.repository.MemberRepository;
import savepoint.backend.web.dto.CreateGameRequest;
import savepoint.backend.web.dto.GameResponse;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GameService {

    private final GameRepository gameRepository;
    private final MemberRepository memberRepository;
    private final TagService tagService; // 기존에 쓰시던 TagService 완벽 호환!

    private static final String LOGIN_MEMBER_ID = "LOGIN_MEMBER_ID";

    @Transactional
    public GameResponse createGame(CreateGameRequest request, HttpSession session) {
        // 1. 보안 코딩: 세션에서 로그인한 사용자 ID 꺼내기
        Long memberId = (Long) session.getAttribute(LOGIN_MEMBER_ID);
        if (memberId == null) {
            throw new IllegalArgumentException("로그인 후 이용해 주세요");
        }

        // 2. 작성자(Member) 조회
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 3. Game 엔티티 생성
        Game game = new Game(
                request.title(),
                request.playTime(),
                request.genre(),
                request.status(),
                request.startDate(),
                request.endDate(),
                request.rating(),
                request.imageUrl(),
                request.shortReview(),
                request.content(),
                member
        );

        // 4. 태그 생성 및 연결 (기존 TagService의 마법 같은 로직 재사용)
        if (request.tags() != null && !request.tags().isEmpty()) {
            game.updateTags(tagService.resolveOrCreateTags(memberId, request.tags()));
        }

        // 5. DB에 저장 후 DTO로 변환해서 반환
        Game savedGame = gameRepository.save(game);
        return GameResponse.from(savedGame);
    }
}