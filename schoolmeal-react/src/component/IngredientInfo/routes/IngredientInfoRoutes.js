import React from 'react';
import { Route } from "react-router-dom";

// 식재료 정보 관련 컴포넌트 임포트
import IngredientInfoMain from '../routes/IngredientInfoMain';
import IngredientPriceList from '../lists/IngredientPriceList';
import ProductSafetyList from '../lists/ProductSafetyList';
import HaccpInfoList from '../lists/HaccpInfoList';
import HaccpInfoWrite from '../writes/HaccpInfoWrite';
import HaccpInfoEdit from '../edits/HaccpInfoEdit';
import HaccpFileUpload from '../uploads/HaccpFileUpload';
import IngredientPriceWrite from '../writes/IngredientPriceWrite';
import IngredientPriceUpload from '../uploads/IngredientPriceUpload';
import IngredientPriceEdit from '../edits/IngredientPriceEdit';
import ProductSafetyWrite from '../writes/ProductSafetyWrite';
import ProductSafetyEdit from '../edits/ProductSafetyEdit';
import ProductSafetyUpload from '../uploads/ProductSafetyUpload';

// 게시판 담당자 이상 권한 설정 관련 임포트
import BoardAdminRoute from '../../sign/BoardAdminRoute';



const IngredientInfoRoutes = (
  <>
    <Route path="ingredientInfo" element={<IngredientInfoMain />} />
    <Route path="ingredientInfo/ingredient-price" element={<IngredientPriceList />} />
    <Route path="ingredientInfo/product-safety" element={<ProductSafetyList />} /> 
    <Route path="ingredientInfo/haccp-info" element={<HaccpInfoList />} />

    <Route path="haccp-info/write" element={<BoardAdminRoute element={<HaccpInfoWrite />} />} />
    <Route path="haccp-info/edit/:haccpId" element={<BoardAdminRoute element={<HaccpInfoEdit />} />} />
    <Route path="haccp-info/write-file-upload" element={<BoardAdminRoute element={<HaccpFileUpload />} />} />

    <Route path="ingredient-price/write" element={<BoardAdminRoute element={<IngredientPriceWrite />} />} />
    <Route path="ingredient-price/edit/:priceId" element={<BoardAdminRoute element={<IngredientPriceEdit />} />} />
    <Route path="ingredient-price/write-file-upload" element={<BoardAdminRoute element={<IngredientPriceUpload />} />} />
    
    <Route path="product-safety/write" element={<BoardAdminRoute element={<ProductSafetyWrite />} />} />
    <Route path="product-safety/edit/:safetyId" element={<BoardAdminRoute element={<ProductSafetyEdit />} />} />
    <Route path="product-safety/write-file-upload" element={<BoardAdminRoute element={<ProductSafetyUpload />} />} />

  </>


);

export default IngredientInfoRoutes;
