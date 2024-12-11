package com.example.schoolMeal.domain.entity.adminNotice;

import com.example.schoolMeal.common.entity.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class AdminNotice extends BaseEntity {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	private String title;
	private String content;
	private String author;
	private String fileName;
	
	// 공지사항 활성화 여부. 기본값 true.
	private boolean isActive = true;
	
	public AdminNotice(String title, String content, String author, String fileName) {
		this.title = title;
		this.content = content;
		this.author = author;
		this.fileName = fileName;
	}
}
