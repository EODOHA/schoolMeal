package com.example.schoolMeal.domain.entity.imageManage;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ImageManage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	private String url;
	
	private String category;
	
	private String mimeType;
	
	@Lob
	@Column(nullable = true)
	private byte[] data;
	
	
}
