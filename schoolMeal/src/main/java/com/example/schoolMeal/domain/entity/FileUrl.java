package com.example.schoolMeal.domain.entity;

import java.io.File;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor  
public class FileUrl {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String origFileName;  // 원본 파일 이름

    @Column(nullable = false)
    private String fileName;  // 저장된 파일 이름 (서버에서 고유하게 생성된 파일 이름)

    @Column(nullable = false)
    private String filePath;  // 파일 경로

    @Column(nullable = false)
    private Long fileSize;  // 파일 크기 (바이트 단위)

    @Builder
    public FileUrl(Long id, String origFileName, String fileName, String filePath, Long fileSize) {
        this.id = id;
        this.origFileName = origFileName;
        this.fileName = fileName;
        this.filePath = filePath;
        this.fileSize = fileSize;
    }
}
