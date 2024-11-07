package com.example.schoolMeal.common.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass // 상속하는 엔터티에서 공통 필드로 사용가능, 상속한 엔터티에 테이블에 자동생성
@EntityListeners(AuditingEntityListener.class) // Auditing 기능 활성화
@Getter 
@Setter
public abstract class BaseEntity {
	
	@CreatedDate
	private LocalDateTime createDate;	// 생성시간
	
	@LastModifiedDate
	private LocalDateTime lastModifiedDate;	//수정시간
}
