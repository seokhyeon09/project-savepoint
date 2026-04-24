package savepoint.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import savepoint.backend.service.GameService;
import savepoint.backend.web.dto.CreateGameRequest;
import savepoint.backend.web.dto.GameResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;

    @PostMapping
    public GameResponse create(@RequestBody CreateGameRequest request, HttpSession session) {
        return gameService.createGame(request, session);
    }
}