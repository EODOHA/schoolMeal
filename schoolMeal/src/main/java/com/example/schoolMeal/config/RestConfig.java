package com.example.schoolMeal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;

import com.example.schoolMeal.domain.entity.edudata.EduVideo;
import com.example.schoolMeal.domain.entity.mealResource.MealPolicy;

@Configuration
public class RestConfig {

    @Bean
    @Primary // 이 Bean을 기본으로 설정
    public RepositoryRestConfiguration customRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        config.exposeIdsFor(MealPolicy.class, EduVideo.class); // 엔티티들의 ID를 노출하도록 설정
        return config;
    }
}








