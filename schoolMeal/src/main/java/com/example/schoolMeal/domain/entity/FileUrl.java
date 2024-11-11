package com.example.schoolMeal.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FileUrl {
    
    @Id
    @GeneratedValue
    private Long id;
    
    @Column(nullable = false)
    private String origFileName;
    
    @Column(nullable = false)
    private String fileName;
    
    @Column(nullable = false)
    private String filePath;

    @Builder
    public FileUrl(Long id, String origFileName, String fileName, String filePath) {
        this.id = id;
        this.origFileName = origFileName;
        this.fileName = fileName;
        this.filePath = filePath;
    }
}