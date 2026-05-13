package savepoint.backend.service;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import savepoint.backend.domain.Member;
import savepoint.backend.repository.MemberRepository;
import savepoint.backend.web.dto.LoginRequest;
import savepoint.backend.web.dto.MemberResponse;
import savepoint.backend.web.dto.UpdateProfileRequest;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LoginService {

    private final MemberRepository repository;
    private final PasswordEncoder passwordEncoder;

    private static final String LOGIN_MEMBER_ID = "LOGIN_MEMBER_ID";

    // 1. 기존 로그인 기능 (유지)
    @Transactional
    public MemberResponse login(LoginRequest request, HttpSession session) {
        Member member = repository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비번이 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.password(), member.getPasswordHash())) {
            throw new IllegalArgumentException("이메일 또는 비번이 올바르지 않습니다.");
        }

        session.setAttribute(LOGIN_MEMBER_ID, member.getId());

        return MemberResponse.from(member);
    }

    // 2. 내 정보 조회
    public Optional<MemberResponse> me(HttpSession session) {
        Long memberId = (Long) session.getAttribute(LOGIN_MEMBER_ID);

        if (memberId == null) {
            return Optional.empty();
        }

        return repository.findById(memberId).map(MemberResponse::from);
    }

    // 3. 내 정보 수정
    @Transactional
    public MemberResponse updateMe(HttpSession session, UpdateProfileRequest request) {
        Long memberId = (Long) session.getAttribute(LOGIN_MEMBER_ID);

        if (memberId == null) {
            throw new IllegalArgumentException("로그인된 사용자가 없습니다.");
        }

        Member member = repository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        member.updateProfile(request.name(), request.phone());

        return MemberResponse.from(member);
    }

    // 4. 로그아웃
    //
    // ✅ 수정: HttpServletResponse 추가
    // 기존: session.invalidate()만 호출 → 서버 세션은 끊기지만,
    //       브라우저의 JSESSIONID 쿠키는 그대로 남아있음
    //       → 다음 카카오 로그인 시 만료된 세션 ID를 계속 전송해서 세션 충돌 발생
    //
    // 수정: session.invalidate() 후 응답에 Max-Age=0 쿠키를 추가해서
    //       브라우저가 JSESSIONID 쿠키를 즉시 삭제하도록 지시
    @Transactional
    public void logout(HttpSession session, HttpServletResponse response) {
        session.invalidate();

        // ✅ JSESSIONID 쿠키를 브라우저에서 즉시 삭제
        // Max-Age=0 → 브라우저가 해당 쿠키를 즉시 만료/삭제 처리
        ResponseCookie expiredCookie = ResponseCookie.from("JSESSIONID", "")
                .path("/")
                .maxAge(0)                  // 즉시 만료
                .httpOnly(true)
                .sameSite("Lax")
                .secure(false)              // 개발환경 (HTTPS 없음)
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, expiredCookie.toString());
    }
}