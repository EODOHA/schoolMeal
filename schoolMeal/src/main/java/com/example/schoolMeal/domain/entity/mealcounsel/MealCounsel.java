package com.example.schoolMeal.domain.entity.mealcounsel;

//MealCounsel Entity
//영양 상담 자료실을 위한 엔티티로, 게시글의 제목, 내용, 조회수, 작성자, 작성 및 수정 시간, 첨부 파일 등의 정보를 관리.

import jakarta.persistence.*; // JPA 관련 어노테이션 및 기능을 사용하기 위해 필요
import lombok.*; // Lombok을 사용하여 코드 간결화를 위해 Getter, ToString, NoArgsConstructor, Builder 등의 어노테이션 사용
import org.hibernate.annotations.ColumnDefault; // 기본값 설정을 위한 Hibernate 어노테이션
import org.springframework.data.annotation.CreatedDate; // 생성 날짜 자동 설정을 위한 Spring Data 어노테이션
import org.springframework.data.annotation.LastModifiedDate; // 수정 날짜 자동 설정을 위한 Spring Data 어노테이션
import org.springframework.data.jpa.domain.support.AuditingEntityListener; // 엔티티 변경을 감지하여 생성 및 수정 날짜를 자동 설정해주는 리스너

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity // JPA 엔티티로 설정하여 데이터베이스 테이블과 매핑
@Table(name = "mealcounsel") // 매핑할 테이블 이름을 "mealcounsel"로 지정
@Getter // Lombok을 사용하여 모든 필드에 대한 getter 메서드를 자동 생성
@ToString // Lombok을 사용하여 객체의 문자열 표현을 자동 생성
@NoArgsConstructor // Lombok을 사용하여 파라미터가 없는 기본 생성자 생성
@EntityListeners(AuditingEntityListener.class) // Spring Data JPA의 Auditing 기능을 사용하여 생성 및 수정 시간을 자동 설정

//두 객체가 같은 지 비교하기 위해 test 파일에서 사용함, 현재는 사용되지 않음
//@EqualsAndHashCode(onlyExplicitlyIncluded = true) // 특정 필드(여기서는 id)만을 기준으로 equals()와 hashCode()를 자동 생성

public class MealCounsel {

    @Id // 기본 키 필드로 설정
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본 키를 데이터베이스에서 자동 생성되도록 설정

    //@EqualsAndHashCode.Include // equals()와 hashCode() 생성 시 포함할 필드로 설정
    //두 객체가 같은 지 비교하기 위해 test 파일에서 사용함, 현재는 사용되지 않음

    private Long id; //게시글의 고유 ID (기본 키)

    private String title; //게시글 제목

    @Column(length = 2000) // 게시글의 내용 2000자로 제한
    private String content;

    //게시글 조회수, 기본값은 0이며, 조회될 때마다 증가합니다.
    @ColumnDefault("0")
    private int viewCount;

    private String author;//게시글 작성자

    //게시글 생성 시간
    //엔티티가 처음 생성될 때 자동으로 설정
    @CreatedDate
    private LocalDateTime createdAt;

    //게시글 수정 시간
    //엔티티가 수정될 때마다 자동으로 갱신
    @LastModifiedDate
    private LocalDateTime updatedAt;

    //YouTube 영상을 삽입할 수 있는 HTML 코드
    private String youtubeHtml;

    //첨부 파일 목록
    //MealCounselFile 엔티티와 일대다 관계로, 게시글에 여러 파일을 첨부할 수 있습니다.
    //CascadeType.ALL: MealCounsel이 삭제되면 연관된 파일도 함께 삭제
    //orphanRemoval = true: MealCounsel와 연관이 끊어진 파일 엔티티는 자동으로 삭제
    @OneToMany(mappedBy = "mealCounsel", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude //files 리스트를 @ToString.Exclude로 설정하여 순환 참조 방지.
    private List<MealCounselFile> files = new ArrayList<>();

    //MealCounsel 엔티티의 빌더 패턴 생성자
    //빌더 패턴을 통해 객체를 생성할 수 있습니다.
    @Builder
    public MealCounsel(Long id, String title, String content, int viewCount, String author, String youtubeHtml) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.author = author;
        this.youtubeHtml = youtubeHtml;
    }

    //파일 추가 메서드
    //게시글에 파일을 첨부
    // 양방향 연관관계를 설정하기 위해 파일의 mealCounsel 필드도 함께 설정합니다.
    public void addFile(MealCounselFile file) {
        files.add(file);
        file.setMealCounsel(this);
    }

    //파일 제거 메서드
    //게시글에서 파일을 삭제
    //양방향 연관관계를 해제하기 위해 파일의 mealCounsel 필드를 null로 설정합니다.
    public void removeFile(MealCounselFile file) {
        files.remove(file);
        file.setMealCounsel(null);
    }

    //조회수 설정 메서드
    //게시글의 조회수를 업데이트
    public void incrementViewCount() {
        this.viewCount++;
    }

    //게시글 업데이트 메소드 추가
    public void update(String title, String content, String youtubeHtml) {
        this.title = title;
        this.content = content;
        this.youtubeHtml = youtubeHtml;
    }
}
