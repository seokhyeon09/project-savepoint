package savepoint.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping; 
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import savepoint.backend.service.GameService;
import savepoint.backend.web.dto.CreateGameRequest;
import savepoint.backend.web.dto.GameResponse;

import java.util.List; // 이거 추가!

import org.springframework.web.bind.annotation.PathVariable; //특정게임 상세조회용

import savepoint.backend.web.dto.UpdateGameRequest;
import org.springframework.web.bind.annotation.PatchMapping;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.ResponseEntity;

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

    // 2. 내 게임 목록 조회 (GET)
    @GetMapping
    public List<GameResponse> getMyGames(HttpSession session) {
        // 세션 정보를 서비스로 넘겨서, 해당 유저가 작성한 게임 목록만 찾아오게 합니다.
        return gameService.getMyGames(session); 
    }

    // 3. 특정 게임 상세 정보 조회
    @GetMapping("/{id}")
    public GameResponse getGameDetail(@PathVariable("id") Long id, HttpSession session) {
        // 주소에서 뽑은 id와 로그인한 유저의 세션을 서비스로 넘깁니다.
        return gameService.getGameDetail(id, session);
    }

    //게임 수정 (프론트에서 patch로 보냈으니 @PatchMapping 사용)
    @PatchMapping("/{id}")
    public GameResponse updateGame(
            @PathVariable("id") Long id, 
            @RequestBody UpdateGameRequest request, 
            HttpSession session) {
            
        return gameService.updateGame(id, request, session);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable("id") Long id, HttpSession session) {
        gameService.deleteGame(id, session);
        return ResponseEntity.noContent().build();
    }
}