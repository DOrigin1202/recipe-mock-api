const express = require('express');
const cors = require('cors');
// recipes.json 파일 구조에 따라 유연하게 가져오기 위해 변수명 변경
const recipesData = require('./recipes.json'); 

const app = express();
app.use(cors()); 

app.get('/api/:keyId/:serviceId/:dataType/:startIdx/:endIdx', (req, res) => {
  const { startIdx, endIdx } = req.params;
  const { RCP_NM } = req.query; // ?RCP_NM=파스타 형식으로 받음

  // 1. 데이터 배열 안전하게 꺼내기 (핵심 수정 부분!)
  // recipes.json이 { COOKRCP01: { row: [...] } } 구조라고 가정
  let originalList = [];
  if (recipesData.COOKRCP01 && recipesData.COOKRCP01.row) {
      originalList = recipesData.COOKRCP01.row;
  } else {
      // 만약 json 파일이 그냥 배열 [ ... ] 로 되어있다면
      originalList = recipesData;
  }

  let result = [...originalList];

  // 2. 검색어 필터링 (검색어가 없으면 이 부분은 건너뛰고 전체 반환됨)
  if (RCP_NM) {
    // includes를 쓰면 '파스타'만 검색해도 '토마토 파스타'가 나옵니다.
    result = result.filter(r => r.RCP_NM.includes(RCP_NM));
  }

  // 3. 페이지네이션 (배열 자르기)
  const start = parseInt(startIdx) - 1;
  const end = parseInt(endIdx);
  
  // 검색 결과가 적어서 endIdx보다 작을 경우를 대비해 안전하게 자름
  const paged = result.slice(start, end);

  // 4. 응답 보내기
  res.json({
    COOKRCP01: {
      total_count: result.length.toString(), // 전체(또는 검색된) 개수
      row: paged,
      RESULT: {
        CODE: "INFO-000",
        MSG: "정상 처리되었습니다."
      }
    }
  });
  
  // 로그 확인용
  console.log(`📡 요청: ${RCP_NM ? `검색어(${RCP_NM})` : '전체목록'} | 결과: ${paged.length}개 반환`);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Mock API 서버 실행 중: http://localhost:${PORT}`);
});