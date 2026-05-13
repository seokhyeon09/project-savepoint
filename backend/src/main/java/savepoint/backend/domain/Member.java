package savepoint.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "members")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 200)
    private String passwordHash;

    @Column(unique = true, length = 30)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MemberStatus status;

    @Column(nullable = false)
    private boolean emailVerified;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
        if(this.status == null) this.status = MemberStatus.ACTIVE;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Column(unique = true, length = 100)
    private String kakaoId;

    @Column(length = 500)
    private String profileImageUrl;

    public Member(String name, String email, String passwordHash, String phone) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.phone = phone;
        this.status = MemberStatus.ACTIVE;
        this.emailVerified = false;
    }

    public Member(String name, String email, String kakaoId, boolean emailVerified, String profileImageUrl) {
        this.name = name;
        this.email = email;
        this.kakaoId = kakaoId;
        this.emailVerified = emailVerified;
        this.profileImageUrl = profileImageUrl;
        this.passwordHash = ""; // Kakao user doesn't have a password
        this.status = MemberStatus.ACTIVE;
    }

    public void updateKakaoId(String kakaoId) {
        this.kakaoId = kakaoId;
    }

    public void changeStatus(MemberStatus status) {
        this.status = status;
    }

    public void updateProfile(String name, String phone) {
        this.name = name;
        this.phone = phone;
    }
}