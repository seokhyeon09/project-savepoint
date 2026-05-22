package savepoint.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import savepoint.backend.service.MemberService;
import savepoint.backend.web.dto.MemberResponse;
import savepoint.backend.web.dto.SignupRequest;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

    @PostMapping
    public Long signup(@RequestBody SignupRequest request){
        return memberService.signup(
                request.name(),
                request.email(),
                request.password(),
                request.passwordConfirm(),
                request.phone()
                );
    }

    @GetMapping
    public List<MemberResponse> list(){
        return memberService.findAll()
                .stream()
                .map(MemberResponse::from)
                .toList();
    }
}
