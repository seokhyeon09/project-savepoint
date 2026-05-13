package savepoint.backend.service;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import savepoint.backend.domain.Member;
import savepoint.backend.repository.MemberRepository;
import savepoint.backend.web.dto.MemberResponse;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class KakaoAuthService {

    private final MemberRepository memberRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String LOGIN_MEMBER_ID = "LOGIN_MEMBER_ID";

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    @Value("${kakao.client-secret}")
    private String clientSecret;

    /**
     * 1. 인가 코드 → 액세스 토큰 교환
     */
    public String getAccessToken(String code) {
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("redirect_uri", redirectUri);
        params.add("client_secret", clientSecret);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
        Map<String, Object> body = response.getBody();

        if (body == null || !body.containsKey("access_token")) {
            throw new RuntimeException("카카오 토큰 발급 실패");
        }
        return (String) body.get("access_token");
    }

    /**
     * 2. 액세스 토큰 → 카카오 사용자 정보 조회
     */
    public Map<String, Object> getKakaoUserInfo(String accessToken) {
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                userInfoUrl, HttpMethod.GET, request, Map.class);

        return response.getBody();
    }

    /**
     * 3. 카카오 사용자 정보로 회원 찾기 또는 자동 가입 후 세션 등록
     */
    public MemberResponse loginWithKakao(String code, HttpSession session) {
        String accessToken = getAccessToken(code);
        Map<String, Object> userInfo = getKakaoUserInfo(accessToken);

        // kakaoId 추출
        String kakaoId = String.valueOf(userInfo.get("id"));

        // 카카오 계정 정보 추출
        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
        Map<String, Object> profile = kakaoAccount != null
                ? (Map<String, Object>) kakaoAccount.get("profile") : null;

        String email = kakaoAccount != null && kakaoAccount.containsKey("email")
                ? (String) kakaoAccount.get("email")
                : kakaoId + "@kakao.com"; // 이메일 미동의 시 fallback

        String nickname = profile != null && profile.containsKey("nickname")
                ? (String) profile.get("nickname") : "카카오유저";

        String profileImageUrl = profile != null && profile.containsKey("profile_image_url")
                ? (String) profile.get("profile_image_url") : null;

        // 기존 회원 조회 (kakaoId or email)
        Optional<Member> existingByKakao = memberRepository.findByKakaoId(kakaoId);

        Member member;
        if (existingByKakao.isPresent()) {
            // 이미 카카오로 가입된 유저
            member = existingByKakao.get();
        } else {
            // 이메일로 기존 일반 회원 조회 → 카카오 연동
            Optional<Member> existingByEmail = memberRepository.findByEmail(email);
            if (existingByEmail.isPresent()) {
                member = existingByEmail.get();
                member.updateKakaoId(kakaoId);
            } else {
                // 신규 가입
                member = new Member(nickname, email, kakaoId, true, profileImageUrl);
                memberRepository.save(member);
            }
        }

        // 세션에 로그인 처리
        session.setAttribute(LOGIN_MEMBER_ID, member.getId());
        return MemberResponse.from(member);
    }
}