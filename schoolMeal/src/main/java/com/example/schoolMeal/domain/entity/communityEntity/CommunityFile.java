package com.example.schoolMeal.domain.entity.communityEntity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "community_file")
public class CommunityFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;    // 파일 이름
    private String fileUrl;     // 파일 URL
    private String fileType;    // 파일 타입 (예: "video", "image", "document")

    // Community 설정 메서드
    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id")
    private Community community; // Community와의 연관 관계

    @Builder
    public CommunityFile(String fileName, String fileUrl, String fileType) {
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.fileType = fileType;
    }

}
