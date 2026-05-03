package savepoint.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping; // 🔥 이거 추가!
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import savepoint.backend.service.GameService;
import savepoint.backend.web.dto.CreateGameRequest;
import savepoint.backend.web.dto.GameResponse;

import java.util.List; // 이거 추가!

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;

    // 1. 기존에 있던 게임 등록 (POST)
    @PostMapping
    public GameResponse create(@RequestBody CreateGameRequest request, HttpSession session) {
        return gameService.createGame(request, session);
    }

    // 2. 새로 추가할 내 게임 목록 조회 (GET)
    @GetMapping
    public List<GameResponse> getMyGames(HttpSession session) {
        // 세션 정보를 서비스로 넘겨서, 해당 유저가 작성한 게임 목록만 찾아오게 합니다.
        return gameService.getMyGames(session); 
    }
}