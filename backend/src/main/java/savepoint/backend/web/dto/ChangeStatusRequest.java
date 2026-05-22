package savepoint.backend.web.dto;

import savepoint.backend.domain.MemberStatus;

public record ChangeStatusRequest(
        MemberStatus status
) {
}
