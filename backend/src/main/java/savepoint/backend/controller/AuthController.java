package savepoint.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import savepoint.backend.service.LoginService;
import savepoint.backend.web.dto.LoginRequest;
import savepoint.backend.web.dto.MemberResponse;
import org.springframework.http.ResponseEntity;
import savepoint.backend.web.dto.UpdateProfileRequest;
import org.springframework.http.HttpStatus;

//보안 로그인 시 사용용도
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private  final LoginService loginService;
    @PostMapping("/login")
    public MemberResponse login(@RequestBody LoginRequest request, HttpSession session){
        MemberResponse response = loginService.login(request, session);

        // 보안에 로그인 사실 강제로 통보
        UsernamePasswordAuthenticationToken auth = 
                new UsernamePasswordAuthenticationToken("USER", null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);
        
        // 시큐리티 장부를 세션에 영구 저장
        session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

        return response;
    }

    @GetMapping("/me")
    public ResponseEntity<MemberResponse> memberResponse(HttpSession session) {
        return loginService.me(session)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PatchMapping("/me")
    public MemberResponse updateMe(@RequestBody UpdateProfileRequest request, HttpSession session){
        return loginService.updateMe(session, request);
    }

    @PostMapping("/logout")
    public void logout(HttpSession session){
        loginService.logout(session);
    }
}
