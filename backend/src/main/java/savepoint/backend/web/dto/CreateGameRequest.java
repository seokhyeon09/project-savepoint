package savepoint.backend.web.dto;

import savepoint.backend.domain.GameGenre;
import savepoint.backend.domain.GameStatus;

import java.time.LocalDate;
import java.util.List;

public record CreateGameRequest(
        String title,
        Integer playTime,
        GameGenre genre,
        GameStatus status,
        LocalDate startDate,
        LocalDate endDate,
        Double rating,
        String imageUrl,
        String shortReview,
        String content,
        List<String> tags // 자유 태그들
) {
}