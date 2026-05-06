package savepoint.backend.web.dto;

public record UpdateProfileRequest(
        String name,
        String phone
) {
}