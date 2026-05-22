package savepoint.backend.web.dto;

import savepoint.backend.domain.Member;
import java.time.LocalDateTime;

public record MemberResponse(
        Long id,
        String name,
        String email,
        String phone,
        String status,
        boolean emailVerified,
        LocalDateTime createdAt
) {
    public static MemberResponse from(Member member) {
        return new MemberResponse(
                member.getId(),
                member.getName(),
                member.getEmail(),
                member.getPhone(),
                member.getStatus().name(),
                member.isEmailVerified(),
                member.getCreatedAt()
        );
    }
}