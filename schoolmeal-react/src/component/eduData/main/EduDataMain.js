import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

function EduDataMain() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h2>게시판 선택 Home</h2>
            <div className="button-container">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/eduData/nutrition-dietEducation")}
                >
                    영양 및 식재료 교육자료 게시판
                </Button>
                <br /><br />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/eduData/video-education")}
                >
                    영상 교육자료 게시판
                </Button>
            </div>
        </div>
    );
}

export default EduDataMain;
