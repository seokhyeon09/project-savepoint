package savepoint.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import savepoint.backend.service.KakaoAuthService;
import savepoint.backend.service.LoginService;
import savepoint.backend.web.dto.LoginRequest;
import savepoint.backend.web.dto.MemberResponse;
import savepoint.backend.web.dto.UpdateProfileRequest;

import java.net.URI;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final LoginService loginService;
    private final KakaoAuthService kakaoAuthService;

    @Value("${kakao.client-id}")
    private String kakaoClientId;

    @Value("${kakao.redirect-uri}")
    private String kakaoRedirectUri;

    // 기존 일반 로그인
    @PostMapping("/login")
    public MemberResponse login(@RequestBody LoginRequest request, HttpSession session) {
        return loginService.login(request, session);
    }

    // 내 정보 조회
    @GetMapping("/me")
    public ResponseEntity<MemberResponse> memberResponse(HttpServletRequest request) {
        // 핵심: getSession(false)를 사용하면 기존 세션이 없을 경우 새로 생성하지 않고 null을 반환합니다.
        HttpSession session = request.getSession(false);

        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return loginService.me(session)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    // 내 정보 수정
    @PatchMapping("/me")
    public MemberResponse updateMe(@RequestBody UpdateProfileRequest request, HttpSession session) {
        return loginService.updateMe(session, request);
    }

    // 로그아웃
    @PostMapping("/logout")
    public void logout(HttpSession session, HttpServletResponse response) {
        loginService.logout(session, response); // ✅ 정상 호출
    }

    /**
     * 카카오 로그인 URL 반환 (프론트에서 버튼 클릭 시 호출)
     * GET /auth/kakao/login-url
     */
    @GetMapping("/kakao/login-url")
    public ResponseEntity<String> kakaoLoginUrl() {
        String url = "https://kauth.kakao.com/oauth/authorize"
                + "?client_id=" + kakaoClientId
                + "&redirect_uri=" + kakaoRedirectUri
                + "&response_type=code";
        return ResponseEntity.ok(url);
    }

    /**
     * 카카오 OAuth 콜백
     * GET /auth/kakao/callback?code=...
     */
    @GetMapping("/kakao/callback")
    public ResponseEntity<MemberResponse> kakaoCallback(
            @RequestParam String code,
            HttpSession session) {
        MemberResponse member = kakaoAuthService.loginWithKakao(code, session);
        return ResponseEntity.ok(member);
    }
}