package com.example.schoolMeal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;

import com.example.schoolMeal.domain.entity.eduData.NutritionDietEducation;
import com.example.schoolMeal.domain.entity.eduData.VideoEducation;
import com.example.schoolMeal.domain.entity.mealResource.MealPolicyOperation;
import com.example.schoolMeal.domain.entity.mealResource.MenuRecipe;

@Configuration
public class RestConfig {

    @Bean
    @Primary // 이 Bean을 기본으로 설정
    public RepositoryRestConfiguration customRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        config.exposeIdsFor(// 급식자료실
        					MealPolicyOperation.class,
        					MenuRecipe.class,
        					// 교육자료실
        					NutritionDietEducation.class,
        					VideoEducation.class); // 엔티티들의 ID를 노출하도록 설정
        return config;
    }
}








