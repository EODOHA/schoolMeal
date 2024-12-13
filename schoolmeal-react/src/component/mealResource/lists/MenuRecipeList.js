import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../../Constants";
import "../../../css/mealResource/MealList.css";
import Button from "@mui/material/Button";
import FilterButton from "../filter/FilterButton"; // FilterButton에 검색 포함
import { MdAttachFile } from "react-icons/md";
import { BsFileExcel } from "react-icons/bs";
import { seasonTypeEnglish } from "../filter/seasonUtils";
import { HiChevronLeft, HiChevronDoubleLeft, HiChevronRight, HiChevronDoubleRight } from "react-icons/hi";
import { useAuth } from "../../sign/AuthContext";  // 권한설정

function MenuRecipeList() {
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("전체");
    const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
    const [selectedSeason, setSelectedSeason] = useState("");
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const applyFilter = useCallback(() => {
        let url = SERVER_URL + "menuRecipes";

        if (selectedFilter === "연령별" && selectedAgeGroup) {
            url = `${SERVER_URL}menuRecipe/byAgeGroup?ageGroup=${encodeURIComponent(selectedAgeGroup)}`;
        }

        if (selectedFilter === "시기별" && selectedSeason) {
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
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    };

    const goToDetailPage = (menuRecipe) => {
        const menuRecipeId =
            menuRecipe.id || (menuRecipe._links?.self?.href ? extractIdFromHref(menuRecipe._links.self.href) : null);
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
        const parts = href.split("/");
        return parts[parts.length - 1];
    };

    const handleWriteNew = () => {
        setSelectedFilter("전체");
        navigate("/mealResource/menu-recipe/write");
    };

    const handleFilterChange = (filter, ageGroup, season) => {
        setSelectedFilter(filter);
        setSelectedAgeGroup(ageGroup);
        setSelectedSeason(season);
    };

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);  //현재 페이지 상태(기본값:1)
    const [postsPerPage] = useState(5); // 페이지당 게시글 수
    const [pageNumbersPerBlock] = useState(4) // 한 블록당 표시할 페이지 번호 수

    // 데이터가 없을 경우 currentPage가 1로 초기화되도록 설정
    useEffect(() => {
        if (filteredRecipes.length === 0) {
            setCurrentPage(1); // 데이터가 없으면 페이지를 1로 설정
        }
    }, [filteredRecipes]);

    const totalPages = Math.ceil(filteredRecipes.length / postsPerPage); //전체 페이지 수
    const currentBlock = Math.ceil(currentPage / pageNumbersPerBlock); // 현재 블록 번호
    const startPage = (currentBlock - 1) * pageNumbersPerBlock + 1; //현재 블록의 첫 페이지 번호
    const endPage = Math.min(startPage + pageNumbersPerBlock - 1, totalPages);  //현재 블록의 마지막 페이지번호(전체 페이지 수를 넘지 않도록)

    // 현재 페이지의 게시물 추출
    const currentPosts = filteredRecipes.slice() // 원본 배열을 복사
        .reverse() // 게시글을 최신 순으로 정렬
        .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage); // 현재 페이지에 맞는 게시글만 슬라이싱

    // 페이지 번호 클릭 시 해당 페이지로 이동
    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 이전 페이지로 이동
    const handlePrevBlock = () => {
        if (currentPage > 1) {
            setCurrentPage(Math.max(currentPage - 1, 1));  // 1페이지보다 작은 페이지로 이동하지 않도록
        }
    }

    // 다음 페이지로 이동
    const handleNextBlock = () => {
        if (currentPage < totalPages) {
            setCurrentPage(Math.min(currentPage + 1, totalPages));  // totalPages를 넘지 않도록
        }
    };

    const totalLength = filteredRecipes.length;

    return (
        <div className="meal-resource-list-container">
            <h1 className="meal-resource-title">식단 및 레시피</h1>
            <div className="meal-resource-button-group">
                <FilterButton
                    variant="contained"
                    onFilterChange={handleFilterChange}
                    selectedFilter={selectedFilter}
                />
                {isAdmin && (
                    <Button
                        variant="outlined"
                        onClick={handleWriteNew}
                        style={{ marginLeft: "auto" }}
                    >
                        새 글 쓰기
                    </Button>
                )}
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
                    {currentPosts.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>
                                해당하는 게시글이 없습니다.
                            </td>
                        </tr>
                    ) : (
                        currentPosts.map((menuRecipe, index) => {
                            const href = menuRecipe._links?.self?.href;
                            const menuRecipeId = href ? extractIdFromHref(href) : menuRecipe.id;
                            const reversedIndex = totalLength - (currentPage - 1) * postsPerPage - index;

                            return (
                                <tr
                                    key={menuRecipeId || `menuRecipe-${index}`}
                                    onClick={() => goToDetailPage(menuRecipe)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{reversedIndex}</td>
                                    <td>{menuRecipe.title}</td>
                                    <td>{formatDate(menuRecipe.createdDate)}</td>
                                    <td>{menuRecipe.writer}</td>
                                    <td>
                                        {menuRecipe.fileUrlId ? (

                                            <span className="meal-resource-attachment-icon">
                                                <MdAttachFile />
                                            </span>

                                        ) : (
                                            <span className="meal-resource-attachment-icon">
                                                <BsFileExcel />
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
            {/* 페이지네이션 버튼 */}
            <div className="pagination">
                <Button
                    className="pagination-nav-button"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1 || filteredRecipes.length === 0}
                >
                    <HiChevronDoubleLeft />
                </Button>
                <Button
                    className="pagination-nav-button"
                    onClick={handlePrevBlock}
                    disabled={currentPage === 1 || filteredRecipes.length === 0}
                >
                    <HiChevronLeft />
                </Button>
                {Array.from({ length: endPage - startPage + 1 }, (_, idx) => (
                    <Button
                        key={startPage + idx}
                        className={`pagination-number ${currentPage === startPage + idx ? "selected" : ""}`}
                        onClick={() => handlePageClick(startPage + idx)}
                    >
                        {startPage + idx}
                    </Button>
                ))}
                <Button
                    className="pagination-nav-button"
                    onClick={handleNextBlock}
                    disabled={currentPage === totalPages || filteredRecipes.length === 0}
                >
                    <HiChevronRight />
                </Button>
                <Button
                    className="pagination-nav-button"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || filteredRecipes.length === 0}
                >
                    <HiChevronDoubleRight />
                </Button>
            </div>
        </div>
    );
}

export default MenuRecipeList;
