package com.example.schoolMeal.domain.entity.eduData;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "VideoEdu") // 테이블 명
@Entity
@Getter @Setter
@NoArgsConstructor
public class VideoEducation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;
    
    // 내용 필드, 최대 500자
    @Column(length = 500)
    private String content;
    
    // 제목 필드
    @Column(nullable = false, unique = true)
    private String title;
    
    // 작성자 필드
    @Column(nullable = false)
    private String writer;
    
    // 영상 파일 URL (영상 파일을 저장한 경로)
    @Column(nullable = true)
    private String videoUrl;
    
    // 썸네일 이미지 URL (영상과 관련된 이미지 파일 경로)
    @Column(nullable = true)
    private String imageUrl;

    // 생성 날짜와 시간을 저장하는 필드
    @Column(nullable = false)
    private LocalDateTime createdDate = LocalDateTime.now();  // 기본값을 현재 시간으로 설정

    // 이미지 URL을 서버에 맞게 반환하는 메서드 (예시로 추가)
    public String getFullImageUrl() {
        if (imageUrl != null && !imageUrl.isEmpty()) {
            return "http://localhost:8090" + imageUrl; // 이미지 URL을 풀 경로로 반환
        }
        return null;
    }
}
