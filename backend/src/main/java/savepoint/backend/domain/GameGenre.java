package savepoint.backend.domain;

public enum GameGenre {
    ACTION("액션"),
    SHOOTING("슈팅"),
    ADVENTURE("어드벤처"),
    STRATEGY("전략"),
    SIMULATION("시뮬레이션"),
    RPG("롤플레잉"),
    PUZZLE("퍼즐"),
    RHYTHM("리듬"),
    ETC("기타");

    private final String label;

    GameGenre(String label) {
        this.label = label;
    }
    public String getLabel() { return label; }
}