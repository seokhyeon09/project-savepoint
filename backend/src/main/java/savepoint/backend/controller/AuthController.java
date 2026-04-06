package savepoint.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import savepoint.backend.service.LoginService;
import savepoint.backend.web.dto.LoginRequest;
import savepoint.backend.web.dto.MemberResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private  final LoginService loginService;
    @PostMapping("/login")
    public MemberResponse login(@RequestBody LoginRequest request, HttpSession session){
        return loginService.login(request,session);
    }

    @GetMapping("/me")
    public MemberResponse memberResponse(HttpSession session){
        return loginService.me(session);
    }

    @PostMapping("/logout")
    public void logout(HttpSession session){
        loginService.logout(session);
    }
}
