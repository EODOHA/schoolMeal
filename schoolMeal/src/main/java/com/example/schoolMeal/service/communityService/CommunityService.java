package com.example.schoolMeal.service.communityService;

import com.example.schoolMeal.domain.entity.communityEntity.Community;
import com.example.schoolMeal.domain.entity.communityEntity.Community_Comment;
import com.example.schoolMeal.domain.repository.communityRepository.CommunityRepository;
import com.example.schoolMeal.domain.repository.communityRepository.CommunityCommentRepository;
import com.example.schoolMeal.dto.communityInfo.CommunityDto;
import com.example.schoolMeal.dto.communityInfo.CommunityCommentDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class CommunityService {

    @Autowired
    private CommunityRepository communityRepository;

    @Autowired
    private CommunityCommentRepository communityCommentRepository;

    // 파일이 저장될 기본 경로를 application.properties에서 가져옴
    private final Path uploadPath;

    public CommunityService(@Value("${file.upload-dir}") String uploadDir) throws IOException {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath); // 디렉토리가 없을 경우 생성
        }
    }

    // 카테고리에 따른 게시물 목록 조회
    public Page<CommunityDto> getCommunityList(String categoryName, Pageable pageable) {
        return communityRepository.findByCategoryName(categoryName, pageable)
                .map(CommunityDto::new);
    }

    // 제목으로 검색
    public Page<CommunityDto> searchByTitle(Pageable pageable, String categoryName, String keyword) {
        return communityRepository.findByCategoryNameAndTitleContaining(pageable, categoryName, keyword)
                .map(CommunityDto::new);
    }

    // 내용으로 검색
    public Page<CommunityDto> searchByContent(Pageable pageable, String categoryName, String keyword) {
        return communityRepository.findByCategoryNameAndContentContaining(pageable, categoryName, keyword)
                .map(CommunityDto::new);
    }

    // 작성자로 검색
    public Page<CommunityDto> searchByAuthor(Pageable pageable, String categoryName, String keyword) {
        return communityRepository.findByCategoryNameAndAuthorContaining(pageable, categoryName, keyword)
                .map(CommunityDto::new);
    }

    public CommunityDto createCommunityWithFile(CommunityDto communityDto, MultipartFile file) throws IOException {
        // DTO -> 엔티티 변환
        Community community = communityDto.toEntity();

        // 디버깅 로그: 변환된 엔티티 확인
        System.out.println("Community Entity Before File Save: " + community);

        // 파일 저장 처리
        if (file != null && !file.isEmpty()) {
            String fileUrl = saveFile(file);
            community.setFileUrl(fileUrl); // 파일 URL 설정
            System.out.println("Saved File URL: " + fileUrl);
        }

        // 기본값 설정
        if (community.getAuthor() == null || community.getAuthor().isEmpty()) {
            community.setAuthor("익명 사용자");
        }
        if (community.getCreatedAt() == null) {
            community.setCreatedAt(java.time.LocalDateTime.now());
        }

        // 디버깅 로그: 데이터 저장 전 상태 확인
        System.out.println("Community Entity Before Save: " + community);

        // 데이터 저장
        Community savedCommunity = communityRepository.save(community);

        // 디버깅 로그: 저장된 데이터 확인
        System.out.println("Saved Community Entity: " + savedCommunity);

        return new CommunityDto(savedCommunity);
    }



    public String saveFile(MultipartFile file) throws IOException {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            // 디버깅 로그: 저장된 파일 경로 확인
            System.out.println("File saved at: " + filePath.toString());

            return "/uploads/" + fileName;
        } catch (IOException e) {
            System.err.println("File save failed: " + e.getMessage());
            throw new IOException("파일 저장 중 오류가 발생했습니다.", e);
        }
    }



    // 파일 다운로드 메서드
    public Resource getFile(String filename) throws IOException {
        // 저장된 파일의 경로를 지정합니다.
        Path filePath = uploadPath.resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            throw new IOException("파일을 찾을 수 없거나 읽을 수 없습니다: " + filename);
        }

        return resource;
    }

    // 조회수 증가
    @Transactional
    public void incrementViewCount(Long communityId) {
        communityRepository.incrementViewCount(communityId);
    }

    // 특정 ID로 게시물 조회
    public CommunityDto getCommunityById(Long communityId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new IllegalArgumentException("게시물이 존재하지 않습니다."));
        return new CommunityDto(community);
    }

    // 게시물 업데이트
    public CommunityDto updateCommunity(Long communityId, CommunityDto communityDto) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new IllegalArgumentException("게시물이 존재하지 않습니다."));
        community.setTitle(communityDto.getTitle());
        community.setContent(communityDto.getContent());
        community.setAuthor(communityDto.getAuthor());
        community.setCategoryName(communityDto.getCategoryName());

        Community updatedCommunity = communityRepository.save(community);
        return new CommunityDto(updatedCommunity);
    }

    // 게시물 삭제
    public void deleteCommunity(Long communityId) {
        communityRepository.deleteById(communityId);
    }

    //------------------댓글 기능 ----------------//

    // 댓글 생성 메서드 (대댓글 포함)
    @Transactional
    public CommunityCommentDto addComment(Long postId, Long parentCommentId, String content) {
        Community community = communityRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시물을 찾을 수 없습니다."));

        Community_Comment comment = new Community_Comment();
        comment.setContent(content);
        comment.setCommunity(community);

        if (parentCommentId != null) {
            // 대댓글의 경우 부모 댓글 설정
            Community_Comment parentComment = communityCommentRepository.findById(parentCommentId)
                    .orElseThrow(() -> new RuntimeException("부모 댓글을 찾을 수 없습니다."));
            comment.setParentComment(parentComment);
        }

        communityCommentRepository.save(comment);
        return new CommunityCommentDto(comment);
    }

    // 특정 게시물의 최상위 댓글 조회 (대댓글 제외)
    public List<Community_Comment> getComments(Long postId) {
        return communityCommentRepository.findByCommunity_IdAndParentCommentIsNull(postId);
    }

    // 특정 댓글의 대댓글 조회
    public List<Community_Comment> getReplies(Long parentCommentId) {
        return communityCommentRepository.findByParentComment_Id(parentCommentId);
    }

    // 댓글에 대한 좋아요 증가
    @Transactional
    public void likeComment(Long commentId) {
        Community_Comment comment = communityCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
        comment.incrementLikes();  // 좋아요 수 증가 메서드 호출
        communityCommentRepository.save(comment);
    }

    // 댓글에 대한 싫어요 증가
    @Transactional
    public void dislikeComment(Long commentId) {
        Community_Comment comment = communityCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
        comment.incrementDislikes();  // 싫어요 수 증가 메서드 호출
        communityCommentRepository.save(comment);
    }

    // 댓글 수정 메서드
    @Transactional
    public CommunityCommentDto updateComment(Long commentId, String newContent) {
        Community_Comment comment = communityCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
        comment.updateContent(newContent);  // 댓글 내용 수정
        communityCommentRepository.save(comment);
        return new CommunityCommentDto(comment);
    }

    // 댓글 삭제 메서드
    @Transactional
    public void deleteComment(Long commentId) {
        Community_Comment comment = communityCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        // 대댓글이 있는지 확인 후 함께 삭제
        if (!comment.getChildComments().isEmpty()) {
            comment.getChildComments().forEach(reply -> communityCommentRepository.delete(reply));
        }

        communityCommentRepository.delete(comment);
    }
}
