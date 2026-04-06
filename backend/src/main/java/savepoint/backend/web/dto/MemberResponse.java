package savepoint.backend.web.dto;

import savepoint.backend.domain.Member;
import savepoint.backend.domain.MemberStatus;

import java.time.LocalDateTime;

public record MemberResponse (
        Long id,
        String name,
        String email,
        String phone,
        MemberStatus status,
        boolean emailVerified,
        LocalDateTime createdAt
) {
    public static MemberResponse from(Member m){
        return new MemberResponse(
                m.getId(),
                m.getName(),
                m.getEmail(),
                m.getPhone(),
                m.getStatus(),
                m.isEmailVerified(),
                m.getCreatedAt()
        );
    }
}
