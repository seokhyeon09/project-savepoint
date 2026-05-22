package savepoint.backend.service;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import savepoint.backend.config.KakaoProperties;
import savepoint.backend.domain.Member;
import savepoint.backend.repository.MemberRepository;
import savepoint.backend.web.dto.KakaoTokenResponse;
import savepoint.backend.web.dto.KakaoUserResponse;
import savepoint.backend.web.dto.MemberResponse;

@Service
@RequiredArgsConstructor
public class KakaoAuthService {

    private final KakaoProperties kakaoProperties;
    private final RestClient restClient = RestClient.create();

    private final MemberRepository memberRepository;

    private static final String LOGIN_MEMBER_ID = "LOGIN_MEMBER_ID";

    public String getAuthorizationUrl(){
        return UriComponentsBuilder
                .fromUriString("https://kauth.kakao.com/oauth/authorize")
                .queryParam("client_id",kakaoProperties.getClientId())
                .queryParam("redirect_uri",kakaoProperties.getRedirectUri())
                .queryParam("response_type","code")
                .build()
                .toString();
    }

    public MemberResponse login(String code, HttpSession session){
        KakaoTokenResponse token =  requestToken(code);

        KakaoUserResponse kakaoUser =requestUserInfo(token.getAccessToken());

        Member member = memberRepository.findByKakaoId(kakaoUser.getId())
                .orElseGet(()->memberRepository.save(createKakaoMember(kakaoUser)));
        session.setAttribute(LOGIN_MEMBER_ID,member.getId());

        return MemberResponse.from(member);

    }

    private KakaoTokenResponse requestToken(String code){
        MultiValueMap<String,String> body = new LinkedMultiValueMap<>();
        body.add("grant_type","authorization_code");
        body.add("client_id",kakaoProperties.getClientId());
        body.add("redirect_uri",kakaoProperties.getRedirectUri());
        body.add("code",code);

        if(StringUtils.hasText(kakaoProperties.getClientSecret())){
            body.add("client_secret",kakaoProperties.getClientSecret());
        }

        return  restClient.post()
                .uri(kakaoProperties.getTokenUri())
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(body)
                .retrieve()
                .body(KakaoTokenResponse.class);
    }

    private KakaoUserResponse requestUserInfo(String accessToken){
        return  restClient.get()
                .uri(kakaoProperties.getUserInfoUri())
                .header("Authorization","Bearer "+accessToken)
                .retrieve()
                .body(KakaoUserResponse.class);
    }

    private Member createKakaoMember(KakaoUserResponse kakaoUser){
        String name = "kakao"+ kakaoUser.getId();
        String email ="kakao"+kakaoUser.getId() + "@kakao.local";

        if(kakaoUser.getKakaoAccount()!=null){
            if(kakaoUser.getKakaoAccount().getEmail()!=null){
                email=kakaoUser.getKakaoAccount().getEmail();
            }
            if(kakaoUser.getKakaoAccount().getProfile()!=null
                && kakaoUser.getKakaoAccount().getEmail() !=null
            ){
                name= kakaoUser.getKakaoAccount().getProfile().getNickname();
            }



        }
        return new Member(
                name,
                email,
                "KAKAO_LOGIN",
                null,
                kakaoUser.getId(),
                "KAKAO"
        );
    }

}
