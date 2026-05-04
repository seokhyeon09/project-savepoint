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

import java.util.List; // List 임포트 추가!
import java.util.stream.Collectors; // stream 처리를 위한 임포트 추가!

import savepoint.backend.web.dto.UpdateGameRequest;

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

    // 여기서부터 새로 추가된 부분입니다! (내 게임 목록 조회 로직)
    public List<GameResponse> getMyGames(HttpSession session) {
        // 1. 세션에서 로그인한 사용자 ID 꺼내기 (createGame과 동일한 보안 로직)
        Long memberId = (Long) session.getAttribute(LOGIN_MEMBER_ID);
        if (memberId == null) {
            throw new IllegalArgumentException("로그인 후 이용해 주세요");
        }

        // 2. DB에서 이 사용자가 작성한 게임들만 전부 가져오기
        List<Game> myGames = gameRepository.findAllByMemberId(memberId);

        // 3. 가져온 Game 엔티티 리스트를 프론트엔드가 요구하는 GameResponse DTO 리스트로 변환하여 반환
        return myGames.stream()
                .map(GameResponse::from)
                .collect(Collectors.toList());
    }

    //게임 상세 조회
    public GameResponse getGameDetail(Long gameId, HttpSession session) {
        // 1. 보안 코딩: 세션에서 로그인한 사용자 ID 꺼내기
        Long memberId = (Long) session.getAttribute(LOGIN_MEMBER_ID);
        if (memberId == null) {
            throw new IllegalArgumentException("로그인 후 이용해 주세요");
        }

        // 2. DB에서 해당 ID의 게임 찾기 (없으면 에러 던지기)
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게임을 찾을 수 없습니다."));

        // 3. 권한 체크 (보안 강화)
        // 남이 작성한 게임의 상세 페이지를 강제로 주소 쳐서 들어오려는 것을 막습니다.
        if (!game.getMember().getId().equals(memberId)) {
            throw new IllegalArgumentException("이 게임 정보를 볼 권한이 없습니다.");
        }

        // 4. 안전하게 DTO로 변환하여 반환
        return GameResponse.from(game);
    }

    @Transactional
    public GameResponse updateGame(Long gameId, UpdateGameRequest request, HttpSession session) {
        // 1. 보안: 로그인 확인
        Long memberId = (Long) session.getAttribute(LOGIN_MEMBER_ID);
        if (memberId == null) {
            throw new IllegalArgumentException("로그인 후 이용해 주세요");
        }

        // 2. DB에서 게임 찾기
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게임을 찾을 수 없습니다."));

        // 3. 보안: 내 게임이 맞는지 권한 체크
        if (!game.getMember().getId().equals(memberId)) {
            throw new IllegalArgumentException("이 게임을 수정할 권한이 없습니다.");
        }

        // 4. 정보 업데이트 (엔티티 수정)
        game.update(
                request.title(), request.playTime(), request.genre(), request.status(),
                request.startDate(), request.endDate(), request.rating(), 
                request.imageUrl(), request.shortReview(), request.content()
        );

        // 5. 태그 업데이트 (기존 태그 갈아끼우기)
        if (request.tags() != null) {
            game.updateTags(tagService.resolveOrCreateTags(memberId, request.tags()));
        }

        // JPA의 '변경 감지(Dirty Checking)' 덕분에 repository.save()를 안 적어도
        // @Transactional이 끝나면 DB에 자동으로 UPDATE 쿼리가 날아갑니다!
        return GameResponse.from(game);
    }


    // 삭제
    @Transactional
    public void deleteGame(Long gameId, HttpSession session) {
        Long memberId = (Long) session.getAttribute(LOGIN_MEMBER_ID);
        if (memberId == null) throw new IllegalArgumentException("로그인 후 이용해 주세요");

        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게임을 찾을 수 없습니다."));

        // 내 글이 맞는지 확인하는 든든한 방어 로직!
        if (!game.getMember().getId().equals(memberId)) {
            throw new IllegalArgumentException("이 게임을 삭제할 권한이 없습니다.");
        }

        gameRepository.delete(game);
    }
}