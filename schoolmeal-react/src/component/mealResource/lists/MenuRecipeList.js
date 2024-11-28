import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SERVER_URL } from "../../../Constants";
import "../../../css/mealResource/MealList.css";
import Button from "@mui/material/Button";
import FilterButton from "../FilterButton";
import { MdAttachFile } from "react-icons/md";
import { BsFileExcel } from "react-icons/bs";

function MenuRecipeList() {
    const [menuRecipe, setMenuRecipe] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    // 컴포넌트가 마운트되면 목록을 가져옴
    useEffect(() => {
        let url = SERVER_URL + "menuRecipes";
        if (selectedFilter === 'age') {
            url += '?filter=age';
        } else if (selectedFilter === 'season') {
            url += '?filter=season';
        }
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched data:", data); // 응답 데이터 확인
    
                // menuRecipes 배열이 _embedded에 포함되어 있어야 함
                if (data._embedded && data._embedded.menuRecipes) {
                    setMenuRecipe(data._embedded.menuRecipes); // menuRecipes 배열을 설정
                } else {
                    setMenuRecipe([]); // menuRecipes가 없다면 빈 배열 설정
                }
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setMenuRecipe([]); // 에러 발생 시 빈 배열로 설정
            });
    }, [selectedFilter]);    

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    // 상세 페이지로 이동하는 함수
    const goToDetailPage = (menuRecipe) => {
        const menuRecipeId = menuRecipe.id || (menuRecipe._links?.self?.href ? extractIdFromHref(menuRecipe._links.self.href) : null);
        if (!menuRecipeId) {
            console.error("Invalid ID:", menuRecipeId);
            return;
        }
        navigate(`/mealResource/menu-recipe/${menuRecipeId}`);
    };

    // URL에서 ID를 추출하는 함수
    const extractIdFromHref = (href) => {
        const parts = href.split('/');
        return parts[parts.length - 1];
    };

    // 새 글 쓰기 후 목록을 다시 가져오는 함수
    const handleWriteNew = () => {
        // 새 글 작성 후 목록을 다시 로드
        setSelectedFilter(selectedFilter === 'age' ? 'season' : 'age');  // 필터를 토글하여 목록을 갱신
        navigate("/mealResource/menu-recipe/write");
    };

    return (
        <div className="meal-list-container">
            <h1 className="title">식단 및 레시피</h1>
            <div className="button-group">
                <Button variant="outlined" onClick={() => navigate("/mealResource")}>
                    이전으로
                </Button>

                {/* 필터 컴포넌트 */}
                <FilterButton onFilterChange={setSelectedFilter} />

                <Button 
                    variant="outlined" 
                    onClick={handleWriteNew} 
                    style={{ marginLeft: "auto" }}
                >
                    새 글 쓰기
                </Button>

            </div>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>등록일</th>
                        <th>작성자</th>
                        <th>첨부파일</th>
                    </tr>
                </thead>
                <tbody>
                    {(menuRecipe && menuRecipe.length === 0) ? (
                        <tr>
                            <td colSpan="5">데이터가 없습니다.</td>
                        </tr>
                    ) : (
                        menuRecipe && menuRecipe.map((menuRecipe, index) => {
                            const isSelected = id && menuRecipe.id && id === menuRecipe.id.toString();
                        
                            // fileUrl은 fileId가 존재할 때만 유효한 것으로 처리
                            const fileUrl = menuRecipe.fileId ? menuRecipe._links?.fileUrl?.href : null;
                        
                            return (
                                <tr
                                    key={menuRecipe.id || `menuRecipe-${index}`}
                                    onClick={() => goToDetailPage(menuRecipe)}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor: isSelected ? "#e0f7fa" : "white",
                                    }}
                                >
                                    <td>{index + 1}</td>
                                    <td>{menuRecipe.title}</td>
                                    <td>{formatDate(menuRecipe.createdDate)}</td>
                                    <td>{menuRecipe.writer}</td>
                                    <td>
                                        {fileUrl ? (
                                            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                                <span className="attachment-icon"><MdAttachFile /></span>
                                            </a>
                                        ) : (
                                            <span className="attachment-icon"><BsFileExcel /></span>
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
