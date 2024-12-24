package com.example.schoolMeal.domain.entity.mealCounsel;

// MealCounsel Entity
// 영양 상담 자료실을 위한 엔티티로, 게시글의 제목, 내용, 조회수, 작성자, 작성 및 수정 시간, 첨부 파일 등의 정보를 관리.
import jakarta.persistence.*;
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
@Setter
@ToString // Lombok을 사용하여 객체의 문자열 표현을 자동 생성
@NoArgsConstructor // Lombok을 사용하여 파라미터가 없는 기본 생성자 생성
@EntityListeners(AuditingEntityListener.class) // Spring Data JPA의 Auditing 기능을 사용하여 생성 및 수정 시간을 자동 설정
public class MealCounsel {

    @Id // 기본 키 필드로 설정
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본 키를 데이터베이스에서 자동 생성되도록 설정
    private Long id; // 게시글의 고유 ID

    private String title; // 게시글 제목

    @Column(length = 2000) // 게시글 내용 2000자로 제한
    private String content;

    @ColumnDefault("0") // 기본 조회수 0
    private int viewCount;
    
    private String author; // 작성자

    @CreatedDate // 엔티티가 처음 생성될 때 자동으로 설정
    private LocalDateTime createdAt; // 생성 시간

    @LastModifiedDate // 엔티티가 수정될 때마다 자동으로 갱신
    private LocalDateTime updatedAt; // 수정 시간

    private String youtubeHtml; // YouTube 삽입 코드

    // 첨부 파일 ID 목록
    // MealCounsel 엔티티와 FileUrl 간의 관계를 ID 기반으로 관리합니다.
    @ElementCollection // 별도 관계 매핑 없이 파일 ID를 저장
    @CollectionTable(name = "meal_counsel_files", joinColumns = @JoinColumn(name = "meal_counsel_id"))
    @Column(name = "file_id")
    private List<Long> fileIds = new ArrayList<>(); // 첨부 파일의 ID 리스트

    @Builder // 빌더 패턴을 통해 객체를 생성할 수 있습니다.
    public MealCounsel(Long id, String title, String content, int viewCount, String author, String youtubeHtml) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.author = author;
        this.youtubeHtml = youtubeHtml;
    }

    // 파일 ID 추가 메서드
    // 게시글에 파일을 첨부
    public void addFileId(Long fileId) {
        this.fileIds.add(fileId);
    }

    // 파일 ID 제거 메서드
    // 게시글에서 파일을 삭제
    public void removeFileId(Long fileId) {
        this.fileIds.remove(fileId);
    }

    // 조회수 증가 메서드
    // 게시글의 조회수를 업데이트
    public void incrementViewCount() {
        this.viewCount++;
    }

    // 게시글 수정 메서드
    public void update(String title, String content, String youtubeHtml) {
        this.title = title;
        this.content = content;
        this.youtubeHtml = youtubeHtml;
    }
}
