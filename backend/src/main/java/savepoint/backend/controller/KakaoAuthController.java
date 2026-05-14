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
        response.sendRedirect(frontendUrl+"/oauth/kakao/callback?token=session");
    }
}
