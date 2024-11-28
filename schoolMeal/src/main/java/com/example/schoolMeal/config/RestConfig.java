package com.example.schoolMeal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;

import com.example.schoolMeal.domain.entity.eduData.VideoEducation;
import com.example.schoolMeal.domain.entity.mealResource.MealPolicyOperation;

@Configuration
public class RestConfig {

    @Bean
    @Primary // 이 Bean을 기본으로 설정
    public RepositoryRestConfiguration customRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        config.exposeIdsFor(MealPolicyOperation.class, VideoEducation.class); // 엔티티들의 ID를 노출하도록 설정
        return config;
    }
}








