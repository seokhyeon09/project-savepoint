package savepoint.backend.web.dto;

public record PresignedUrlRequest(
        String fileName,
        String contentType
) {}