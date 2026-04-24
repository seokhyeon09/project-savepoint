package savepoint.backend.web.dto;

import savepoint.backend.domain.Game;
import savepoint.backend.domain.GameGenre;
import savepoint.backend.domain.GameStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record GameResponse(
        Long id,
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
        List<String> tags,
        Long memberId,
        String memberName,
        LocalDateTime createdAt
) {
    public static GameResponse from(Game game) {
        return new GameResponse(
                game.getId(),
                game.getTitle(),
                game.getPlayTime(),
                game.getGenre(),
                game.getStatus(),
                game.getStartDate(),
                game.getEndDate(),
                game.getRating(),
                game.getImageUrl(),
                game.getShortReview(),
                game.getContent(),
                game.getTags().stream().map(tag -> tag.getLabel()).toList(),
                game.getMember().getId(),
                game.getMember().getName(),
                game.getCreatedAt()
        );
    }
}