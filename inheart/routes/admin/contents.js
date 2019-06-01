const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const audioDuration = require("get-audio-duration");
const timeFormat = require("hh-mm-ss");
//const moment = require("moment");
//const momentDurationFormatSetUp = require("moment-duration-format");
const con = require("../../db/db");
const util = require("../../check/util");

var upload = multer({
    storage: multer.diskStorage({
        //서버 디스크에 저장
        destination(req, file, cb) {
            cb(null, "sound/"); //사운드 저장 경로
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname); //파일의 확장자를 ext에 저장
            cb(
                null,
                path.basename(file.originalname, ext) +
                new Date().valueOf() +
                ext
            ); //파일이름+업로드날짜+확장자
        }
    })
});

router.get("/list", (req, res, next) => {
    con.query(
        "select * from contents order by contentsIndex;",
        (err, result, fields) => {
            if (err) {
                //에러체크
                return res
                    .status(400)
                    .json(util.successFalse(err, "검색 실패"));
            }

            if (result && result.length != 0) {
                //result 결과값이 있으면

                console.log(result);
                return res.status(200).json(util.successTrue(result));
            } else {
                return res.sendStatus(204);
            }
        }
    );
});

router.get("/category/list", (req, res, next) => {
    const {
        categoryNo
    } = req.query;
    con.query(
        "select * from contents where categoryNo = 1 order by contentsIndex;",
        [categoryNo],
        (err, result, fields) => {
            if (err) {
                //에러체크
                return res
                    .status(400)
                    .json(util.successFalse(err, "검색 실패"));
            }

            if (result && result.length != 0) {
                //result 결과값이 있으면

                console.log(result);
                return res.status(200).json(util.successTrue(result));
            } else {
                return res.sendStatus(204);
            }
        }
    );
});

router.get("/", (req, res, next) => {
    const {
        contentsNo
    } = req.query;

    con.query(
        "select * from contents where contentsNo = ?;",
        [contentsNo],
        (err, result, fields) => {
            if (err) {
                //에러체크
                return res
                    .status(400)
                    .json(util.successFalse(err, "검색 실패"));
            }

            if (result && result.length != 0) {
                //result 결과값이 있으면

                console.log(result);
                return res.status(200).json(util.successTrue(result));
            } else {
                return res.sendStatus(204);
            }
        }
    );
});

router.post("/", upload.single("contents"), (req, res, next) => {
    res.header("Access-Control-Allow-Headers", "multipart/form-data");
    const {
        categoryNo,
        contentsTitle,
        contentsExplain,
        //contentsFile,
        contentsType
    } = req.body;

    const contentsFile = req.file.filename;

    audioDuration.getAudioDurationInSeconds('sound/' + req.file.filename).then((duration) => {
        const contentsTime = timeFormat.fromS(Math.ceil(duration), "hh:mm:ss");

        con.query(
            "insert into contents values('0',?,?,?,?,?,?,'1');",
            [
                categoryNo,
                contentsTitle,
                contentsExplain,
                contentsTime,
                contentsFile,
                contentsType
            ],
            (err, result, fields) => {
                if (err) {
                    //에러체크
                    return res
                        .status(400)
                        .json(util.successFalse(err, "업데이트 실패"));
                }

                if (result && result.length != 0) {
                    //result 결과값이 있으면

                    console.log(result);
                    return res.status(200).json(util.successTrue(result));
                } else {
                    return res.sendStatus(204);
                }
            }
        );
    });
    //console.log(req.file);
    //const contentsTime = "00:12:23"; //파일을 받아서 시간 확인 필요
});

router.put("/", upload.single("contents"), (req, res, next) => {
    res.header("Access-Control-Allow-Headers", "multipart/form-data");
    const {
        categoryNo,
        contentsTitle,
        contentsExplain,
        //contentsFile,
        contentsType,
        contentsNo
    } = req.body;

    //console.log(req.body);

    const contentsFile = req.file.filename;

    audioDuration.getAudioDurationInSeconds('sound/' + req.file.filename).then((duration) => {
        const contentsTime = timeFormat.fromS(Math.ceil(duration), "hh:mm:ss");

        con.query(
            "update contents set categoryNo = ?,contentsTitle = ?,contentsExplan = ?,contentsTime = ?,contentsFile = ?,contentsType = ? where contentsNo = ?;",
            [
                categoryNo,
                contentsTitle,
                contentsExplain,
                contentsTime,
                contentsFile,
                contentsType,
                contentsNo
            ],
            (err, result, fields) => {
                if (err) {
                    //에러체크
                    return res
                        .status(400)
                        .json(util.successFalse(err, "업데이트 실패"));
                }
    
                if (result && result.length != 0) {
                    //result 결과값이 있으면
    
                    console.log(result);
                    return res.status(200).json(util.successTrue(result));
                } else {
                    return res.sendStatus(204);
                }
            }
        );
    });
});

router.delete("/", (req, res, next) => {
    const {
        contentsNo
    } = req.body;

    con.query(
        "delete from contents where contentsNo = ?;",
        [contentsNo],
        (err, result, fields) => {
            if (err) {
                //에러체크
                return res
                    .status(400)
                    .json(util.successFalse(err, "삭제 실패"));
            }

            if (result && result.length != 0) {
                //result 결과값이 있으면

                console.log(result);
                return res.status(200).json(util.successTrue(result));
            } else {
                return res.sendStatus(204);
            }
        }
    );
});

router.all("/", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});

router.all("/list", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});

router.all("/category/list", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});

module.exports = router;