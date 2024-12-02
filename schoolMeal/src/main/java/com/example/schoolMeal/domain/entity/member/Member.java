package com.example.schoolMeal.domain.entity.member;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name="member")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Member {

	// 키
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(nullable=false, updatable=false)
	private Long id;
	
	// 회원명
	@Column(nullable=false)
	private String memberName;
	
	// 회원 아이디
	@Column(nullable=false, unique=true)
	private String memberId;
	
	// 회원 비밀번호
	@Column(nullable=false)
	private String password;
	
	// 회원 이메일
	@Column(nullable=false)
	private String email;
	
	// 회원 전화번호
	@Column(nullable=false)
	private String phone;
	
	// 회원 권한
	@Enumerated(EnumType.STRING)
	@Column(nullable=false)
	private Role role;
	
	
	// ---------------------------
	
	// 관리자의 밴 여부를 위한 필드들
	@Column(nullable=false)
	private String status = "active";
	
	@Column(name="ban_until")
	private LocalDateTime banUntil;
	
	// 비밀번호 오입력에 대한 필드들
	@Column(nullable=false)
	private boolean isLocked = false; // 계정 잠금 여부, 기본 값 false.
	
	private int failedAttempts = 0; // 비밀번호 틀린 횟수.
	
	// 계정 생성의 기본적인 생성자
	public Member(String memberName,
				  String memberId,
				  String password,
				  String email,
				  String phone,
				  Role role) {
		super();
		this.memberName = memberName;
		this.memberId = memberId;
		this.password = password;
		this.email = email;
		this.phone = phone;
		this.role = role;
	}
	
	// 계정 잠금 관련 메서드들
	// 1. 틀린 횟수 증가 메서드
	public void incrementFailedAttempts() {
		this.failedAttempts++;
	}
	
	// 2. 성공 시 틀린 횟수 초기화 메서드
	public void resetFailedAttempts() {
		this.failedAttempts = 0;
	}
	
	// 3. 계정 잠금 여부 확인 메서드
	public boolean isAccountLocked() {
		return this.isLocked;
	}
	
	// 4. 계정 잠금 메서드
	public void lockAccount() {
		this.isLocked = true;
		this.status = "banned"; // 잠금에서는 상태가 "banned"
	}
	
	// 5. 계정 잠금 해제 메서드
	public void unlockAccount() {
		this.isLocked = false;
		this.status = "active"; // 잠금 해제에서는 상태가 "active"
		this.banUntil = null;
	}
	
	// 6. Member 엔티티에 banUntil 설정 시 isLocked을 true로 설정
	public void setBanUntil(LocalDateTime banUntil) {
	    this.banUntil = banUntil;
	    if (banUntil != null && banUntil.isAfter(LocalDateTime.now())) {
	        this.isLocked = true;  // banUntil이 현재 시간보다 미래라면 계정 잠금
	        this.status = "banned"; // 상태도 banned로 변경
	    }
	}
	
}
