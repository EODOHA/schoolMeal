package com.example.schoolMeal.domain.repository.communityRepository;

import com.example.schoolMeal.domain.entity.communityEntity.Community_Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommunityCommentRepository extends JpaRepository<Community_Comment, Long> {

    // 특정 게시물의 최상위 댓글 조회 (대댓글 제외)
    List<Community_Comment> findByCommunity_IdAndParentCommentIsNull(Long postId);

    // 특정 댓글의 대댓글 조회
    List<Community_Comment> findByParentComment_Id(Long parentCommentId);
}
