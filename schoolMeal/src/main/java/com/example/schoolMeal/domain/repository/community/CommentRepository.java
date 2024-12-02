package com.example.schoolMeal.domain.repository.community;

import com.example.schoolMeal.domain.entity.community.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

// 댓글 관련 데이터베이스 작업을 처리하는 리포지토리 인터페이스
public interface CommentRepository extends JpaRepository<Comment, Long> {
	
}