package com.example.schoolMeal.domain.entity.community;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class CommunityFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String origFileName;  // 원본 파일 이름

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String base64Data;  // 파일의 Base64 인코딩된 데이터

    @Column(nullable = false)
    private String fileType;  // 파일의 MIME 타입

    @Builder
    public CommunityFile(String origFileName, String base64Data, String fileType) {
        this.origFileName = origFileName;
        this.base64Data = base64Data;
        this.fileType = fileType;
    }
}
