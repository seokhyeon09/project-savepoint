package savepoint.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import savepoint.backend.domain.Member;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    boolean existsByEmail(String email);
    Optional<Member> findByEmail(String email);
    Optional<Member> findByKakaoId(String kakaoId); // 카카오 로그인용 추가
}