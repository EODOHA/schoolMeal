import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_URL } from "../../../Constants";
import "../../../css/mealResource/MealList.css";
import Button from "@mui/material/Button";
import FilterButton from "../filter/FilterButton";
import { MdAttachFile } from "react-icons/md";
import { BsFileExcel } from "react-icons/bs";
import { seasonTypeEnglish } from "../filter/seasonUtils";

function MenuRecipeList() {
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('전체');
    const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
    const [selectedSeason, setSelectedSeason] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const applyFilter = useCallback(() => {
        let url = SERVER_URL + "menuRecipes";
        
        if (selectedFilter === '연령별' && selectedAgeGroup) {
            url = `${SERVER_URL}menuRecipe/byAgeGroup?ageGroup=${encodeURIComponent(selectedAgeGroup)}`;
        }
    
        if (selectedFilter === '시기별' && selectedSeason) {
            const seasonType = seasonTypeEnglish(selectedSeason);
            url = `${SERVER_URL}menuRecipe/bySeason?season=${encodeURIComponent(seasonType)}`;

        }
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const recipes = data._embedded ? data._embedded.menuRecipes : [];
                setFilteredRecipes(recipes);
            })            
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [selectedFilter, selectedAgeGroup, selectedSeason]);

    useEffect(() => {
        applyFilter();
    }, [applyFilter]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    const goToDetailPage = (menuRecipe) => {
        const menuRecipeId = menuRecipe.id || (menuRecipe._links?.self?.href ? extractIdFromHref(menuRecipe._links.self.href) : null);
        if (!menuRecipeId) {
            console.error("Invalid ID:", menuRecipeId);
            return;
        }
        navigate(`/mealResource/menu-recipe/${menuRecipeId}`);
    };

    const extractIdFromHref = (href) => {
        if (!href) {
            console.error("Invalid href:", href);
            return null;
        }
        const parts = href.split('/');
        return parts[parts.length - 1];
    };

    const handleWriteNew = () => {
        setSelectedFilter('전체');
        navigate("/mealResource/menu-recipe/write");
    };

    const handleFilterChange = (filter, ageGroup, season) => {
        setSelectedFilter(filter);
        setSelectedAgeGroup(ageGroup);
        setSelectedSeason(season);
    };

    return (
        <div className="meal-resource-list-container">
            <h1 className="meal-resource-title">식단 및 레시피</h1>
            <div className="meal-resource-button-group">
                <Button variant="outlined" onClick={() => navigate("/mealResource")}>
                    이전으로
                </Button>
    
                <FilterButton 
                    variant="contained"
                    onFilterChange={handleFilterChange} 
                    selectedFilter={selectedFilter} 
                />
    
                <Button 
                    variant="outlined" 
                    onClick={handleWriteNew} 
                    style={{ marginLeft: "auto" }}
                >
                    새 글 쓰기
                </Button>
            </div>
            <table className="meal-resource-table">
                <thead className="meal-resource-thead">
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>등록일</th>
                        <th>작성자</th>
                        <th>첨부파일</th>
                    </tr>
                </thead>
                <tbody className="meal-resource-tbody">
                    {filteredRecipes.length === 0 ? (
                        <tr>
                            <td colSpan="6">데이터가 없습니다.</td>
                        </tr>
                    ) : (
                        filteredRecipes.map((menuRecipe, index) => {
                            const isSelected = id && menuRecipe.id && id === menuRecipe.id.toString();
                            const href = menuRecipe._links?.self?.href;
                            const menuRecipeId = href ? extractIdFromHref(href) : menuRecipe.id;
                            const fileUrl = menuRecipe.fileId ? menuRecipe._links?.fileUrl?.href : null;
                            const reversedIndex = filteredRecipes.length - index;

                            return (
                                <tr
                                    key={menuRecipeId || `menuRecipe-${index}`}
                                    onClick={() => goToDetailPage(menuRecipe)}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor: isSelected ? "#e0f7fa" : "white",
                                    }}
                                >
                                    <td>{reversedIndex}</td>
                                    <td>{menuRecipe.title}</td>
                                    <td>{formatDate(menuRecipe.createdDate)}</td>
                                    <td>{menuRecipe.writer}</td>
                                    <td>
                                        {fileUrl ? (
                                            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                                <span className="meal-resource-attachment-icon"><MdAttachFile /></span>
                                            </a>
                                        ) : (
                                            <span className="meal-resource-attachment-icon"><BsFileExcel /></span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );    
}

export default MenuRecipeList;
