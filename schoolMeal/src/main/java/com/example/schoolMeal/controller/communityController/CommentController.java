package com.example.schoolMeal.controller.communityController;

import com.example.schoolMeal.dto.communityInfo.CommentDTO;
import com.example.schoolMeal.service.communityService.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // 댓글 생성 요청 처리 메서드
    @PostMapping
    public ResponseEntity<CommentDTO> addComment(@RequestBody CommentDTO dto) {
        return ResponseEntity.ok(commentService.addComment(dto));
    }

    // 특정 공지사항에 대한 모든 댓글 조회
    @GetMapping("/notice/{noticeId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByNotice(@PathVariable Long noticeId) {
        List<CommentDTO> comments = commentService.getCommentsByNotice(noticeId);
        return ResponseEntity.ok(comments);
    }

    // 특정 지역별 커뮤니티에 대한 모든 댓글 조회
    @GetMapping("/regionalCommunity/{regionalCommunityId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByRegionalCommunity(@PathVariable Long regionalCommunityId) {
        List<CommentDTO> comments = commentService.getCommentsByRegionalCommunity(regionalCommunityId);
        return ResponseEntity.ok(comments);
    }

    // 특정 가공식품 정보에 대한 모든 댓글 조회
    @GetMapping("/processedFood/{processedFoodId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByProcessedFood(@PathVariable Long processedFoodId) {
        List<CommentDTO> comments = commentService.getCommentsByProcessedFood(processedFoodId);
        return ResponseEntity.ok(comments);
    }

    // 특정 급식시설·가구에 대한 모든 댓글 조회
    @GetMapping("/cateringFacility/{cateringFacilityId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByCateringFacility(@PathVariable Long cateringFacilityId) {
        List<CommentDTO> comments = commentService.getCommentsByCateringFacility(cateringFacilityId);
        return ResponseEntity.ok(comments);
    }

    // 댓글 삭제 요청 처리 메서드
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok().build();
    }
}
