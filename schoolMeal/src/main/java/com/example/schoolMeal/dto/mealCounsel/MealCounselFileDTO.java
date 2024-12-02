package com.example.schoolMeal.dto.mealCounsel;

import com.example.schoolMeal.domain.entity.mealCounsel.MealCounselFile;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MealCounselFileDTO {

    private Long id;
    private String fileName;
    private String fileType;
    private String fileUrl;

    @Builder
    public MealCounselFileDTO(Long id, String fileName, String fileType, String fileUrl) {
        this.id = id;
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileUrl = fileUrl;
    }

    public static MealCounselFileDTO fromEntity(MealCounselFile file) {
        return MealCounselFileDTO.builder()
                .id(file.getId())
                .fileName(file.getOriginalFileName())
                .fileType(file.getFileType())
                .fileUrl(file.getFileUrl())
                .build();
    }
    
}
