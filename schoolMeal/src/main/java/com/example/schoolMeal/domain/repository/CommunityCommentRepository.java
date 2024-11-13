package com.example.schoolMeal.domain.repository;

import com.example.schoolMeal.domain.entity.Community_Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

//public interface CommunityCommentRepository extends JpaRepository<Community_Comment, Long> {
//    // 특정 게시물에 대한 모든 댓글을 조회하는 메서드
//    List<Community_Comment> findByPost_Id(Long postId);
//
//
//    // 대댓글을 찾는 메서드
//    List<Community_Comment> findByParentComment(Community_Comment parentComment);
public interface CommunityCommentRepository extends JpaRepository<Community_Comment, Long> {
    // 특정 게시물에 대한 모든 댓글을 조회하는 메서드
    List<Community_Comment> findByCommunity_Id(Long postId); // 변경된 부분: 'Post'를 'Community'로 수정

    // 대댓글을 찾는 메서드
    List<Community_Comment> findByParentComment(Community_Comment parentComment);
}
