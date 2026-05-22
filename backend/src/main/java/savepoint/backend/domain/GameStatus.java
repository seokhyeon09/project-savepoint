package savepoint.backend.domain;

public enum GameStatus {
    PLAYING("플레이중"),
    PAUSED("일시중단"),
    COMPLETED("완료"),
    WISHLIST("위시리스트");

    private final String label;

    GameStatus(String label) {
        this.label = label;
    }
    public String getLabel() { return label; }
}