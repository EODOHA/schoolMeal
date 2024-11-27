package com.example.schoolMeal.service.mealResource;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.common.PathResolver;
import com.example.schoolMeal.domain.entity.FileUrl;
import com.example.schoolMeal.domain.entity.mealResource.MealPolicy;
import com.example.schoolMeal.domain.entity.mealResource.MenuRecipe;
import com.example.schoolMeal.domain.repository.FileUrlRepository;
import com.example.schoolMeal.domain.repository.mealResource.MenuRecipeRepository;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;

@Service
public class MenuRecipeService extends PathResolver {

    @Autowired
    private MenuRecipeRepository menuRecipeRepository;
    
    @Autowired
    private FileUrlRepository fileUrlRepository;
    
    /* 파일 업로그 경로 설정 */
    private String menuRecipePath;

    @PostConstruct
    public void init() {
    	menuRecipePath = buildPath("급식 정책 자료실");
    }

    // 메뉴 및 레시피 저장
    public void write(MenuRecipe menuRecipe, MultipartFile file) {
        try {
            if (file != null && !file.isEmpty()) {
                // 파일이 있을 경우 파일 업로드 처리
                FileUrl fileUrl = saveFile(file); // 파일 저장 메서드 호출
                menuRecipe.setFileId(fileUrl.getId());  // 파일 ID 설정 (필요시 File 객체를 menuRecipe에 추가할 수 있음)
            } else {
            	menuRecipe.setFileId(null);  // 파일 ID가 없으면 null로 설정
            }

            // 메뉴 및 레시피 저장
            menuRecipeRepository.save(menuRecipe);  // menuRecipe 객체를 DB에 저장

        } catch (IOException e) {
            // 파일 업로드 관련 예외 처리
            System.err.println("파일 업로드 중 오류: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("파일 업로드 중 오류가 발생했습니다. 자세한 내용을 확인하세요.", e); // IOException 처리
        } catch (Exception e) {
            // 다른 예외 처리 (예: DB 오류 등)
            System.err.println("메뉴 및 레시피 저장 중 오류: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("메뉴 및 레시피 저장 중 오류가 발생했습니다. 다시 시도해 주세요.", e); // 다른 예외 처리
        }
    }
    
    // 파일 정보를 DB에 저장하는 메서드
    public FileUrl saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;  // 파일이 없으면 null 반환
        }

        // 원본 파일 이름 가져오기
        String origFilename = file.getOriginalFilename();

        // 파일 이름을 고유하게 설정 (현재 시간 + 원본 파일명)
        String filename = System.currentTimeMillis() + "_" + origFilename;

        // 파일이 저장될 경로 설정
        File saveDir = new File(menuRecipePath);
        if (!saveDir.exists()) {
            saveDir.mkdirs();  // 폴더가 없으면 생성
        }

        // 파일 경로 설정
        String filePath = menuRecipePath + File.separator + filename;

        // 파일 크기 설정
        Long fileSize = file.getSize();  // 파일 크기 (바이트 단위)

        // 파일을 지정한 경로에 저장
        file.transferTo(new File(filePath));

        // FileUrl 엔티티에 파일 정보 설정
        FileUrl fileUrl = FileUrl.builder()
                .origFileName(origFilename)
                .fileName(filename)
                .filePath(filePath)
                .fileSize(fileSize)  // 파일 크기 저장
                .build();

        // 파일 정보 DB에 저장
        FileUrl savedFileUrl = fileUrlRepository.save(fileUrl);

        return savedFileUrl;  // 저장된 FileUrl 반환
    }

    // 메뉴 레시피 리스트 반환
    public List<MenuRecipe> menuRecipeList() {
        try {
            return menuRecipeRepository.findAll();
        } catch (Exception e) {
            System.err.println("메뉴 레시피 리스트 조회 중 오류: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("메뉴 레시피 리스트 목록 조회 중 오류가 발생했습니다. 다시 시도해 주세요.", e);
        }
    }

    // 특정 메뉴 레시피 리스트를 조회하면서 첨부 파일 정보도 함께 반환
    public MenuRecipe getPostWithFileDetails(Long id) {
        try {
            // 특정 ID로 급식 정책 조회
            MenuRecipe menuRecipe = menuRecipeRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("해당 ID의 메뉴 레시피 리스트가 존재하지 않습니다: " + id));

            // 파일 ID가 존재하는 경우, 연관된 파일 정보 조회
            if (menuRecipe.getFileId() != null) {
                FileUrl fileUrl = fileUrlRepository.findById(menuRecipe.getFileId())
                        .orElse(null); // 파일이 없을 경우 null 처리
                menuRecipe.setFileUrl(fileUrl); // menuRecipe에 FileUrl 설정
            }

            return menuRecipe;
        } catch (Exception e) {
            System.err.println("메뉴 레시피 리스트 조회 중 오류: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("메뉴 레시피 리스트 조회 중 오류가 발생했습니다. 다시 시도해 주세요.", e);
        }
    }

    // 메뉴 레시피 삭제
    @Transactional
    public void menuRecipeDelete(Long id) {
        try {
            // 메뉴 레시피 조회
            MenuRecipe menuRecipe = menuRecipeRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("해당 ID의 메뉴 및 레시피가 존재하지 않습니다: " + id));

            // 파일 삭제 (파일이 있을 경우에만)
            if (menuRecipe.getFileId() != null) {
                FileUrl fileUrl = fileUrlRepository.findById(menuRecipe.getFileId()).orElse(null);
                if (fileUrl != null) {
                    // 기존 파일 삭제
                    File fileToDelete = new File(fileUrl.getFilePath());
                    if (fileToDelete.exists()) {
                        boolean deleted = fileToDelete.delete();
                        if (!deleted) {
                            // 파일 삭제 실패해도 예외를 발생시키지 않고 로그만 출력
                            System.err.println("파일 삭제 실패: " + fileUrl.getFilePath());
                        }
                    }
                    // DB에서 파일 정보 삭제
                    fileUrlRepository.delete(fileUrl);
                }
            }

            // 메뉴 및 레시피 삭제
            menuRecipeRepository.deleteById(id);
            System.out.println("급식 정책 삭제 완료: " + id);

        } catch (Exception e) {
            // 예외 처리 간소화: 오류 메시지만 출력하고, 실행 흐름을 방해하지 않도록 처리
            System.err.println("메뉴 레시피 삭제 중 오류: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // 메뉴 레시피 수정
    public void menuRecipeUpdate(MenuRecipe menuRecipe, MultipartFile file) throws IOException {
        try {
            // 파일이 있으면 기존 파일 삭제 후 새 파일 저장
            if (file != null && !file.isEmpty()) {
                // 기존 파일이 있으면 삭제
                if (menuRecipe.getFileId() != null) {
                    FileUrl existingFile = fileUrlRepository.findById(menuRecipe.getFileId()).orElse(null);
                    if (existingFile != null) {
                        // 기존 파일 삭제
                        new File(existingFile.getFilePath()).delete();
                        fileUrlRepository.delete(existingFile);
                    }
                }
                // 새 파일 저장
                FileUrl fileUrl = saveFile(file);
                menuRecipe.setFileId(fileUrl.getId());  // 새 파일 ID 설정
            }

            // 메뉴 및 레시피 저장 (파일이 없으면 기존의 파일 ID 그대로 유지)
            menuRecipeRepository.save(menuRecipe);

        } catch (IOException e) {
            System.err.println("파일 업로드 또는 메뉴 및 레시피 수정 중 오류: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("파일 업로드 또는 메뉴 및 레시피 수정 중 오류가 발생했습니다.", e);
        } catch (Exception e) {
            System.err.println("메뉴 및 레시피 수정 중 오류: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("메뉴 및 레시피 수정 중 오류가 발생했습니다.", e);
        }
    }
}
