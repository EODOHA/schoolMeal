// Footer.js
import React from 'react';
import '../../css/layout/Footer.css';  // Footer.css 파일을 import

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="foot-root-box">
      <div className='foot-box1'>
        <img className="logo-box" src="/logo.png"></img>
        <p className='p-title'>한국교육환경보호원</p>
      </div>
      <div className='foot-box2'>
        <p className='p-sentence1'>COPYRIGHT ⓒ {currentYear}. ALL RIGHT RESERVED.</p>
        <p className='p-sentence2'>본 사이트 관리자는 식재료 홍보를 위해 관련업체가 탑재한 정보 및 관련 내용 등에 대하여 책임을 지지 않음을 알려드립니다.</p>
      </div>
    </footer>
  );
};

export default Footer;