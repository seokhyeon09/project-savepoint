package savepoint.backend.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import savepoint.backend.service.KakaoAuthService;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;

@RestController
@RequestMapping("/api/auth/kakao")
@RequiredArgsConstructor
public class KakaoAuthController {
    private final KakaoAuthService kakaoAuthService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @GetMapping
    public void redirectToKakao(HttpServletResponse response) throws IOException{
        response.sendRedirect(kakaoAuthService.getAuthorizationUrl());
    }

    @GetMapping("/callback")
    public void callback(
      @RequestParam String code,
      HttpSession session,
      HttpServletResponse response
    ) throws  IOException{
        kakaoAuthService.login(code,session);
        // 보안에 로그인 사실 강제로 통보
        UsernamePasswordAuthenticationToken auth = 
                new UsernamePasswordAuthenticationToken("USER", null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);
        // 시큐리티 장부를 세션에 영구 저장
        session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
        response.sendRedirect(frontendUrl+"/oauth/kakao/callback?token=session");
    }
}
