package com.example.schoolMeal.domain.entity.mealInfo;

import java.util.ArrayList;
import java.util.List;

import com.example.schoolMeal.common.entity.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Table(name = "mealArchive") // 전문인력 이력사항 테이블
@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealArchive extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long arc_id;

	private String arc_title;

	private String arc_content;

	private String arc_author;

	@OneToMany(mappedBy = "mealArchive", // Many쪽이 연관관계의 주인
			fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
	@ToString.Exclude
	@Builder.Default
	private List<MealArchiveFile> arc_files = new ArrayList<>();

	
}
