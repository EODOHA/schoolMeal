package com.example.schoolMeal.dto.imageManage;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ImageManageDto {
	private Long id;
	private String url;
	private String name;
	private String category;
	private String mimeType;

}
