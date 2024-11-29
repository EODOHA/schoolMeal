package com.example.schoolMeal.domain.entity.mealCounsel;

//MealCounsel 엔티티에 대한 동적 쿼리 조건을 정의하는 클래스
//제목, 내용, 작성자, 생성일자 에 따른 검색 조건을 제공
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class MealCounselSpecifications {

    //제목에 특정 문자열이 포함된 게시글을 검색하는 조건을 생성
    public static Specification<MealCounsel> titleContains(String title) {
        return (root, query, builder) -> builder.like(root.get("title"), "%" + title + "%");
    }

    //내용에 특정 문자열이 포함된 게시글을 검색하는 조건을 생성
    public static Specification<MealCounsel> contentContains(String content) {
        return (root, query, builder) -> builder.like(root.get("content"), "%" + content + "%");
    }

    //작성자가 특정 문자열인 게시글을 검색하는 조건을 생성
    public static Specification<MealCounsel> authorContains(String author) {
        return (root, query, builder) -> builder.like(root.get("author"), "%" + author + "%");
    }

    //특정 생성일자와 일치하는 게시글을 검색하는 조건을 생성
    public static Specification<MealCounsel> createdAtEquals(LocalDate createdAt) {
        return (root, query, builder) -> builder.equal(root.get("createdAt").as(LocalDate.class), createdAt);
    }
}