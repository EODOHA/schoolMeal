package com.example.schoolMeal.service.community;

import com.example.schoolMeal.domain.entity.community.Notice;
import com.example.schoolMeal.domain.entity.community.CommunityFile;
import com.example.schoolMeal.domain.repository.community.NoticeRepository;
import com.example.schoolMeal.domain.repository.community.CommunityFileRepository;
import com.example.schoolMeal.dto.community.NoticeRequestDTO;
import com.example.schoolMeal.dto.community.NoticeResponseDTO;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityNotFoundException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;
import com.example.schoolMeal.common.PathResolver;

@Service
public class NoticeService extends PathResolver {

    @Autowired
    private NoticeRepository noticeRepository;

    @Autowired
    private CommunityFileRepository communityFileRepository;

    private String noticePath;

    @PostConstruct
    public void init() {
        noticePath = buildPath("공지사항");

        // 저장 경로의 유효성 검사
        File saveDir = new File(noticePath);
        if (!saveDir.exists() && !saveDir.mkdirs()) {
            throw new RuntimeException("저장 폴더를 생성할 수 없습니다: " + noticePath);
        }
    }

    // 공지사항 생성 메서드 (파일 첨부 포함)
    public NoticeResponseDTO createNotice(NoticeRequestDTO dto, MultipartFile file) throws IOException {
        Notice notice = new Notice(dto.getTitle(), dto.getContent(), dto.getAuthor());

        // 파일이 첨부된 경우 파일 저장을 처리
        if (file != null && !file.isEmpty()) {
            CommunityFile communityFile = saveFile(file);
            notice.setFile(communityFile);
        }

        Notice savedNotice = noticeRepository.save(notice); //공지사항 저장
        return mapToResponseDTO(savedNotice);               // 저장된 공지사항을 DTO로 변환 후 반환
    }

    // 공지사항 조회 메서드 (조회수 증가 포함)
    public NoticeResponseDTO getNotice(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notice not found"));
        notice.setViewCount(notice.getViewCount() + 1); // 조회수 증가
        noticeRepository.save(notice);  // 업데이트된 조회수를 반영하에 저장
        return mapToResponseDTO(notice);    // 조회된 공지사항을 DTO로 변환 후 반환
    }

    // 모든 공지사항 조회 메서드
    public List<NoticeResponseDTO> getAllNotices() {
        return noticeRepository.findAll().stream()
                .map(this::mapToResponseDTO)    // NOTICE엔터티를 ResponseDTO로 변환
                .collect(Collectors.toList());  // 반환
    }

    // 공지사항 수정 메서드 (파일 첨부 포함)
    public void updateNotice(Long id, NoticeRequestDTO dto, MultipartFile file) throws IOException {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notice not found"));

        // 기존 필드 업데이트
        notice.setTitle(dto.getTitle());
        notice.setContent(dto.getContent());
        notice.setAuthor(dto.getAuthor());
        notice.setUpdatedDate(LocalDateTime.now());

        // 파일이 첨부된 경우 기존 파일 삭제 후 새로운 파일 저장
        if (file != null && !file.isEmpty()) {
            // 기존 파일 삭제
            if (notice.getFile() != null) {
                deleteFileFromSystem(notice.getFile()); //기존 파일 삭제
                communityFileRepository.delete(notice.getFile()); // 기존 파일 엔터티 삭제
            }

            // 새로운 파일 저장
            CommunityFile newFile = saveFile(file);
            notice.setFile(newFile);
        }

        noticeRepository.save(notice);  // 저장
    }

    // 공지사항 삭제 메서드 (파일 삭제 포함)
    public void deleteNotice(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notice not found"));

        // 파일이 첨부된 경우 파일을 삭제
        if (notice.getFile() != null) {
            deleteFileFromSystem(notice.getFile()); // 파일 시스템에서 파일 삭제
            communityFileRepository.delete(notice.getFile()); // 파일 엔터티 삭제
        }

        noticeRepository.deleteById(id);
    }

    // 파일 저장 메서드 - Base64로 인코딩하여 데이터베이스에도 저장하고 파일은 디스크에도 저장
    private CommunityFile saveFile(MultipartFile file) throws IOException {
        String origFilename = file.getOriginalFilename();
        if (origFilename == null || origFilename.isEmpty()) {
            throw new IOException("파일 이름이 유효하지 않습니다.");
        }

        // 디스크에 저장할 파일 이름 생성
        String filename = System.currentTimeMillis() + "_" + origFilename;
        String filePath = noticePath + File.separator + filename;

        // 파일 저장 경로 출력
        System.out.println("파일 저장 경로: " + filePath);

        Path savePath = Paths.get(filePath);
        Files.copy(file.getInputStream(), savePath);

        // 파일을 InputStream으로 읽고 Base64로 인코딩
        byte[] bytes = Files.readAllBytes(savePath);
        String base64Data = Base64.getEncoder().encodeToString(bytes);
        String mimeType = file.getContentType();

        return communityFileRepository.save(CommunityFile.builder()
                .origFileName(filename)  // 디스크에 저장된 파일명으로 설정
                .base64Data(base64Data)  // 파일의 Base64인코딩 데이터
                .fileType(mimeType)      // 파일의 MIME 타입
                .build());
    }

    // 파일 삭제 메서드 - 파일 시스템에서 파일 삭제
    private void deleteFileFromSystem(CommunityFile file) {
        String filePath = noticePath + File.separator + file.getOrigFileName();
        File fileToDelete = new File(filePath);
        if (fileToDelete.exists() && !fileToDelete.delete()) {
            System.err.println("파일을 삭제할 수 없습니다: " + filePath);
        }
    }

    // 파일 MIME 타입 가져오기 메서드
    public String getMimeTypeByFileId(Long fileId) {
        CommunityFile file = communityFileRepository.findById(fileId)
                .orElseThrow(() -> new EntityNotFoundException("File not found"));
        return file.getFileType();
    }

    // 파일 Base64 데이터 가져오기 메서드
    public String getFileBase64DataById(Long fileId) {
        CommunityFile file = communityFileRepository.findById(fileId)
                .orElseThrow(() -> new EntityNotFoundException("File not found"));
        return file.getBase64Data();
    }

    // Notice 엔티티를 NoticeResponseDTO로 변환
    private NoticeResponseDTO mapToResponseDTO(Notice notice) {
        Long fileId = null;
        String origFileName = null;

        // 파일이 존재할 경우 파일 ID와 원본 파일 이름을 설정
        if (notice.getFile() != null) {
            fileId = notice.getFile().getId();
            origFileName = notice.getFile().getOrigFileName();
        }

        // NoticeResponseDTO 생성 후 반환
        return new NoticeResponseDTO(
                notice.getId(),
                notice.getTitle(),
                notice.getContent(),
                notice.getAuthor(),
                notice.getViewCount(),
                notice.getCreatedDate(),
                notice.getUpdatedDate(),
                fileId,
                origFileName
        );
    }
    //검색기능
    public List<NoticeResponseDTO> searchNotices(String keyword, String type) {
        List<Notice> notices;

        switch (type) {
            case "title":
                notices = noticeRepository.findByTitleContaining(keyword);
                break;
            case "content":
                notices = noticeRepository.findByContentContaining(keyword);
                break;
            default:
                throw new IllegalArgumentException("Invalid search type");
        }

        return notices.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
}
