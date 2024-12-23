package com.example.schoolMeal.domain.entity.mealInfo;

import java.util.ArrayList;
import java.util.List;

import com.example.schoolMeal.common.entity.BaseEntity;
import com.example.schoolMeal.domain.entity.ImageUrl;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "mealExpert") // 전문인력 테이블
@Entity
@Getter
@Setter
//@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealExpert extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
//	@Column(nullable = false, updatable = false)
	private Long exp_id;

	private String exp_name; // 이름
	private String exp_department; // 소속
	private String exp_position; // 직책
	private String exp_email; // 이메일
	
	// 전문가의 이력(1:N 연관관계) -> 한 전문가는 여러 개의 이력을 가질 수 있다. 부모객체: mealExpert, 자식객체: ExpertHistory
	@OneToMany(mappedBy = "mealExpert",
			fetch = FetchType.EAGER, 
			cascade = CascadeType.ALL,
			orphanRemoval = true)
	@JsonManagedReference // @OneToMany 관계에서 주로 사용, 부모객체에서 자식 객체를 직렬화할때 자식객체를 포함시키도록 지정
	private List<ExpertHistory> histories = new ArrayList<>();

	// 전문가의 보유자격증(1:N 연관관계) -> 한 전문가는 여러 개의 자격증을 가질 수 있다. 부모객체:mealExpert, 자식객체: ExpertQualification
	
	@OneToMany(mappedBy = "mealExpert", // Many쪽이 연관관계의 주인, 외래키는 ExpertQualification 쪽에 생성
			fetch = FetchType.EAGER,
			cascade = CascadeType.ALL, // 영속성 전이 설정. One쪽의 상태가 변경되면 Many쪽의 데이터에도 동일한 동작이 일어난다.
			orphanRemoval = true) // 고아객체 제거(다른 연관관계가 없으므로 허용)
	@JsonManagedReference // @OneToMany 관계에서 주로 사용, 부모객체에서 자식 객체를 직렬화할때 자식객체를 포함시키도록 지정
	private List<ExpertQualification> qualifications = new ArrayList<>();

	 // 연관관계 편의 메서드(MealExpert에 다수의 history/qualificationd을 저장)
    public void addHistory(ExpertHistory history) {
        histories.add(history);
        history.setMealExpert(this);
    }
    public void addQualification(ExpertQualification qualification) {
        qualifications.add(qualification);
        qualification.setMealExpert(this);
    }
	public MealExpert(String exp_name, String exp_department, String exp_position, String exp_email) {
		super();
		this.exp_name = exp_name;
		this.exp_department = exp_department;
		this.exp_position = exp_position;
		this.exp_email = exp_email;
	}
    
}
