package com.example.schoolMeal.domain.entity.mealCounsel;

//Meal Counsel에 관련된 파일 엔티티를 나타냅니다.
//업로드된 파일의 이름, 타입, URL 등의 정보를 저장합니다
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mealcounsel_file")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class MealCounselFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    //각 파일의 고유 식별자 게시물 id
    private Long id;

    //업로드한 파일의 원래 이름 (예: "document.pdf")
    private String originalFileName;

    //서버에 저장된 파일의 이름(고유한 이름)
    private String storedFileName;

    //파일의 타입 (예: "application/pdf", "image/jpeg")
    private String fileType;

    //파일이 저장된 URL로, 파일에 접근할 수 있는 경로
    private String fileUrl;

    //연관된 Meal Counsel 엔티티에 대한 참조입니다.
    //MealCounselFile과 MealCounsel 간의 다대일 관계를 나타냅니다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mealcounsel_id")
    @ToString.Exclude
    private MealCounsel mealCounsel;

    //필요할 경우 setter 메소드 추가
    public void setMealCounsel(MealCounsel mealCounsel) {
        this.mealCounsel = mealCounsel;
    }
    

}
