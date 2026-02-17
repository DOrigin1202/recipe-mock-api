const express = require('express');
const cors = require('cors');
const recipes = require('./recipes.json');

const app = express();
app.use(cors()); // 프론트에서 fetch 할 수 있게

// http://localhost:3000/api/{keyId}/{serviceId}/{dataType}/{startIdx}/{endIdx}
// http://localhost:3000/api/{keyId}/{serviceId}/{dataType}/{startIdx}/{endIdx}/RCP_NM={검색어}
app.get('/api/:keyId/:serviceId/:dataType/:startIdx/:endIdx', (req, res) => {
  const { startIdx, endIdx } = req.params;
  const { RCP_NM } = req.query;

  let result = [...recipes];

  // 레시피 이름 검색 필터
  if (RCP_NM) {
    result = result.filter(r => r.RCP_NM.includes(RCP_NM));
  }

  // 페이지네이션
  const start = parseInt(startIdx) - 1;
  const end = parseInt(endIdx);
  const paged = result.slice(start, end);

  res.json({
    COOKRCP01: {
      total_count: result.length,
      row: paged,
      RESULT: {
        CODE: "INFO-000",
        MSG: "정상 처리되었습니다."
      }
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Mock API 서버 실행 중: http://localhost:${PORT}`);
  console.log(`📌 테스트: http://localhost:${PORT}/api/test/COOKRCP01/json/1/16`);
});
