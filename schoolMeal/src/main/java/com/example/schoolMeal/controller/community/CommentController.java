package com.example.schoolMeal.controller.community;

import com.example.schoolMeal.dto.community.CommentDTO;
import com.example.schoolMeal.service.community.CommentService;
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

    // 특정 지역별 커뮤니티에 대한 모든 댓글 조회
    @GetMapping("/regionalCommunity/{regionalCommunityId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByRegionalCommunity(@PathVariable Long regionalCommunityId) {
        List<CommentDTO> comments = commentService.getCommentsByRegionalCommunity(regionalCommunityId);
        return ResponseEntity.ok(comments);
    }
    
    // 특정 지역별 커뮤니티에 대한 댓글 개수 조회
    @GetMapping("/regionalCommunity/{regionalCommunityId}/commentCount")
    public ResponseEntity<Integer> getCommentCountByRegionalCommunity(@PathVariable Long regionalCommunityId) {
    	int commentCount = commentService.getCommentCountByRegionalCommunity(regionalCommunityId);
    	return ResponseEntity.ok(commentCount);
    }

    // 댓글 삭제 요청 처리 메서드
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok().build();
    }
}
