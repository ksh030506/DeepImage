const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, process.env.multer_storage_destination_dir); // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
});
const upload = multer({ storage: storage });

module.exports = upload;