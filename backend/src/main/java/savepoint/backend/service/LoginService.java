package savepoint.backend.service;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import savepoint.backend.domain.Member;
import savepoint.backend.repository.MemberRepository;
import savepoint.backend.web.dto.LoginRequest;
import savepoint.backend.web.dto.MemberResponse;
import savepoint.backend.web.dto.UpdateProfileRequest; //  추가된 DTO 임포트

import java.util.Optional; //  추가된 임포트

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LoginService {
    
    private final MemberRepository repository;
    private final PasswordEncoder passwordEncoder;

    private static final String LOGIN_MEMBER_ID = "LOGIN_MEMBER_ID";

    // 1. 기존 로그인 기능 (유지)
    @Transactional
    public MemberResponse login(LoginRequest request, HttpSession session){
        Member member = repository.findByEmail(request.email())
                .orElseThrow(()->new IllegalArgumentException("이메일 또는 비번이 올바르지 않습니다."));

        if(!passwordEncoder.matches(request.password(),member.getPasswordHash())){
            throw new IllegalArgumentException("이메일 또는 비번이 올바르지 않습니다.");
        }

        session.setAttribute(LOGIN_MEMBER_ID,member.getId());

        return MemberResponse.from(member);
    }

    // 2. 내 정보 조회 (강사님 컨트롤러에 맞춰 Optional 반환으로 수정)
    public Optional<MemberResponse> me(HttpSession session){
        Long memberId = (Long) session.getAttribute(LOGIN_MEMBER_ID);

        if(memberId == null){
            return Optional.empty(); // 세션이 없으면 빈 값 반환 (컨트롤러에서 401 에러로 처리됨)
        }
        
        return repository.findById(memberId).map(MemberResponse::from);
    }

    //  3. 새로 추가된 내 정보 수정 로직
    @Transactional
    public MemberResponse updateMe(HttpSession session, UpdateProfileRequest request){
        Long memberId = (Long) session.getAttribute(LOGIN_MEMBER_ID);
        
        if(memberId == null){
            throw new IllegalArgumentException("로그인된 사용자가 없습니다.");
        }

        Member member = repository.findById(memberId)
                .orElseThrow(()->new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 엔티티 수정 로직 호출
        member.updateProfile(request.name(), request.phone());

        return MemberResponse.from(member);
    }

    // 4. 기존 로그아웃 기능 (유지)
    @Transactional
    public void logout(HttpSession session){
        session.invalidate();
    }
}