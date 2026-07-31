import React from 'react';

export default function HomeContent({ isMobile }) {
  const rowsData = [
    { id: 1, bgUrl: '/1.png', title: '伦敦金 / 伦敦银' },
    { id: 2, bgUrl: '/3-1.jpg', title: '权威正规理财平台' },
    { id: 3, bgUrl: '/3-2.jpg', title: '高精尖 MTL 交易系统' },
    { id: 4, bgUrl: '/3-3.jpg', title: '权威正规理财平台' },
    { id: 5, bgUrl: '/3-4.jpg', title: '权威正规理财平台' },
    { id: 6, bgUrl: '/6.jpg', title: '权威正规理财平台' },
    { id: 7, bgUrl: '/7.jpg', title: '权威正规理财平台' },
    { id: 8, bgUrl: '/8.jpg', title: '权威正规理财平台' },
    { id: 9, bgUrl: '/9.jpg', title: '权威正规理财平台' },
    { id: 10, bgUrl: '/10.jpg', title: '权威正规理财平台' },
    { id: 11, bgUrl: '/11.jpg', title: '权威正规理财平台' },
    { id: 12, bgUrl: '/12.jpg', title: '权威正规理财平台' },
  ];

  // 外层容器样式：保持突破边距（Bleed Out）的全宽效果
  const getBannerContainerStyle = () => ({
    width: isMobile ? 'calc(100% + 24px)' : 'calc(100% + 80px)',
    marginLeft: isMobile ? '-12px' : '-40px',
    cursor: 'pointer',
    overflow: 'hidden',
    borderRadius: '4px', // 可选：加入极简微圆角让边缘更精致
  });

  // 图片样式：核心是 height: 'auto'，保证长图和短图都能自适应等比例缩放
  const imgStyle = {
    width: '100%',
    height: 'auto',
    display: 'block', // 消除 img 底部默认的空白间隙
    objectFit: 'cover',
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '12px' : '20px',
        overflowX: 'hidden',
      }}
    >
      {rowsData.map((row) => (
        <div
          key={row.id}
          style={getBannerContainerStyle()}
          className="content-row-banner"
        >
          <img
            src={row.bgUrl}
            alt={row.title}
            style={imgStyle}
            loading="lazy" // 优化长页面的图片懒加载性能
          />
        </div>
      ))}
    </div>
  );
}