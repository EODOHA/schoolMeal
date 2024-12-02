package com.example.schoolMeal.dto.mealInfo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MealArchiveFileDto {


	private Long arc_file_id;

	private String arc_originalFilename;

	private String arc_storedFilename;

	private String arc_file_url;

	private String arc_file_type;

	private Long arc_file_size;

	
}
