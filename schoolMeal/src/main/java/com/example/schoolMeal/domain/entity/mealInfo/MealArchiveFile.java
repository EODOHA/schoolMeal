package com.example.schoolMeal.domain.entity.mealInfo;

import com.example.schoolMeal.common.entity.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Table(name = "mealArchiveFile")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class MealArchiveFile extends BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long arc_file_id;
	
	private String arc_originalFilename;

	private String arc_storedFilename;

	private String arc_file_url;

	private String arc_file_type;

	private Long arc_file_size;

	@ManyToOne
	@JoinColumn(name = "arc_id", nullable = false)
	@ToString.Exclude
	private MealArchive mealArchive;

	// 생성자 추가

	public MealArchiveFile(String arc_originalFilename, String arc_storedFilename, String arc_file_url,
			String arc_file_type, Long arc_file_size, MealArchive mealArchive) {
		this.arc_originalFilename = arc_originalFilename;
		this.arc_storedFilename = arc_storedFilename;
		this.arc_file_url = arc_file_url;
		this.arc_file_type = arc_file_type;
		this.arc_file_size = arc_file_size;
		this.mealArchive = mealArchive;
	}
	
}
