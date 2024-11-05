package com.example.schoolMeal.domain.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name="`user`")
@Entity
@Getter
@Setter
@NoArgsConstructor
public class User {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(nullable=false, updatable=false)
	private Long id;
	
	@Column(nullable=false, unique=true)
	private String username;
	
	@Column(nullable=false)
	private String password;
	
	@Column(nullable=false)
	private String role;
	
	
	// ---------------------------
	
	// 관리자의 밴 여부를 위한 필드들
	@Column(nullable=false)
	private String status = "active";
	
	@Column(name="ban_until")
	private LocalDateTime banUntil;
	
	
	public User(String username, String password, String role) {
		super();
		this.username = username;
		this.password = password;
		this.role = role;
	}
}
