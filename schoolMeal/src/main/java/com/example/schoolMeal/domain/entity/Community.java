package com.example.schoolMeal.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;



import java.time.LocalDateTime;

@NoArgsConstructor  // 파라미터가 없는 기본 생성자를 자동으로 생성
@Entity
@Table(name = "community")  // 엔티티가 매핑될 데이터베이스 테이블 이름
@Getter
@Setter
@ToString
@EntityListeners(AuditingEntityListener.class) // 엔티티가 생성되거나 수정될 때 자동으로 날짜를 갱신

public class Community {

    @Id
    @Column(name = "community_id")      //DB 컬럼 이름
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;


    private String title; // 커뮤니티 글 제목

    @Column(length = 2000)  // 커뮤니티 컬럼 길이 최대 2000자
    private String content; // 커뮤니티 글 내용

    @ColumnDefault("0")
    private int viewCount; // 조회수, 기본값은 0

    private String author; // 작성자 ID

    // 생성일과 수정일 필드 추가
    @CreatedDate                    // 엔티티가 생성될 때 자동으로 현재 날짜와 시간이 입력
    @Column(updatable = false)      // 생성일은 수정 불가능
    private LocalDateTime createdAt; // 생성일

    @LastModifiedDate               // 엔티티가 수정될 때 자동으로 현재 날짜와 시간이 입력
    private LocalDateTime updatedAt; // 수정일



    @Builder
    public Community(Long id, String title, String content, int viewCount, String author) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.author = author;
    }

    // 커뮤니티 글을 직접 생성하는 정적 메서드
    public static Community createCommunity(String title, String content, String author) {   //제목 내용 사용자
        Community community = new Community();
        community.setTitle(title);
        community.setContent(content);
        community.setViewCount(0);      // 조회수는 기본값 0으로 설정
        community.setAuthor(author);
        return community;
    }


}
