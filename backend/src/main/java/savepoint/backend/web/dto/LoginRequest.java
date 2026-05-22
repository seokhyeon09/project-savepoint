package savepoint.backend.web.dto;

public record LoginRequest(
        String email,
        String password
) {
}
