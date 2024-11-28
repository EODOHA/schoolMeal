package com.example.schoolMeal.dto.mealInfo;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.example.schoolMeal.common.entity.BaseEntity;
import com.example.schoolMeal.domain.entity.mealInfo.MealArchive;
import com.example.schoolMeal.domain.entity.mealInfo.MealArchiveFile;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MealArchiveDto extends BaseEntity {

	private Long arc_id;

	@NotBlank(message = "제목은 필수 항목입니다.")
	@Size(max = 100, message = "제목은 100자를 초과할 수 없습니다.")
	private String arc_title;

	@NotBlank(message = "게시물 내용을 입력하세요.")
	@Size(max = 5000, message = "내용은 5000자를 초과할 수 없습니다.")
	private String arc_content;

	private String arc_author;
	
	private List<MealArchiveFileDto> arc_files = new ArrayList<>();

	
}
