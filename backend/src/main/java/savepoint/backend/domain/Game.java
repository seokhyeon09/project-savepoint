package savepoint.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title; // 제목

    private Integer playTime; // 플레이 시간 (시간 또는 분 단위)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameGenre genre; // 장르 카테고리

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameStatus status; // 플레이 상태 카테고리

    private LocalDate startDate; // 플레이 시작일
    private LocalDate endDate;   // 플레이 종료일

    private Double rating; // 평점

    @Column(length = 500)
    private String imageUrl; // 표지 이미지 URL

    @Column(length = 100)
    private String shortReview; // 한줄평

    @Column(length = 2000)
    private String content; // 상세 내용

    // 작성자 (기존 보안 코딩 유지)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id")
    private Member member;

    // 태그 (기존 프로젝트의 Tag 엔티티 그대로 재사용!)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "game_tags",
            joinColumns = @JoinColumn(name = "game_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // 생성자 (글 작성 시 사용)
    public Game(String title, Integer playTime, GameGenre genre, GameStatus status,
                LocalDate startDate, LocalDate endDate, Double rating,
                String imageUrl, String shortReview, String content, Member member) {
        this.title = title;
        this.playTime = playTime;
        this.genre = genre;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.shortReview = shortReview;
        this.content = content;
        this.member = member;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // 태그 업데이트 메서드
    public void updateTags(Set<Tag> tags) {
        this.tags.clear();
        if (tags != null) {
            this.tags.addAll(tags);
        }
        this.updatedAt = LocalDateTime.now();
    }

    //필드값 업데이트를 위한 메서드
    public void update(String title, Integer playTime, GameGenre genre, GameStatus status,
                   LocalDate startDate, LocalDate endDate, Double rating,
                   String imageUrl, String shortReview, String content) {
        this.title = title;
        this.playTime = playTime;
        this.genre = genre;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.shortReview = shortReview;
        this.content = content;
        this.updatedAt = LocalDateTime.now();
    }
}