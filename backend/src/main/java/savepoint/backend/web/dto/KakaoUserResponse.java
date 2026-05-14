package savepoint.backend.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import software.amazon.awssdk.profiles.Profile;

@Getter
@Setter
public class KakaoUserResponse {

    private Long id;
    
    @JsonProperty("kakao_account")
    private KakaoAccount kakaoAccount;
    
    
    @Getter
    @Setter
    public static  class KakaoAccount{
        private String email;
        private Profile profile;
    }
    
    @Getter
    @Setter
    public static class Profile{
        private String nickname;
        @JsonProperty("profile_image_url")
        private String profileImageUrl;
    }
    
}
