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
            //console.log("multer req: ", req);
            const type = req.body.contentsType;
            //console.log(type);
            if (type === "sound") {
                cb(null, "meditation/sound");
            } else if (type === "text") {
                cb(null, "meditation/text");
            } else {
                console.log("multer error: undefined contents type used");
            }
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
    const { categoryNo } = req.query;
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
    const { contentsNo } = req.query;

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
                return res.status(200).json(util.successTrue(result[0]));
            } else {
                return res.sendStatus(204);
            }
        }
    );
});

router.post(
    "/sound",
    upload.fields([
        {
            name: "sound"
        },
        {
            name: "cover"
        }
    ]),
    (req, res, next) => {
        res.header("Access-Control-Allow-Headers", "multipart/form-data");
        var {
            categoryNo,
            contentsTitle,
            contentsExplain,
            //contentsFile,
            //contentsCover,
            contentsType
        } = req.body;

        contentsType = "sound";

        if (contentsType !== "sound" && contentsType !== "text") {
            return res
                .status(400)
                .json(
                    util.successFalse(
                        err,
                        "지정되지 않은 콘텐츠 타입을 사용했습니다"
                    )
                );
        }
        console.log(req.files);
        const contentsFile = req.files.sound[0].filename.normalize("NFC");
        const contentsCover = req.files.cover[0].filename.normalize("NFC");

        var contentsTime = "00:00:00";

        console.log("type is sound");
        audioDuration
            .getAudioDurationInSeconds("meditation/sound/" + contentsFile)
            .then(duration => {
                contentsTime = timeFormat.fromS(
                    Math.ceil(duration),
                    "hh:mm:ss"
                );

                con.query(
                    "insert into contents values('0',?,?,?,?,?,?,?,'1');",
                    [
                        categoryNo,
                        contentsTitle,
                        contentsExplain,
                        contentsTime,
                        contentsFile,
                        contentsType,
                        contentsCover
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
                            return res
                                .status(200)
                                .json(util.successTrue(result));
                        } else {
                            return res.sendStatus(204);
                        }
                    }
                );
            })
            .catch(err => {
                console.log(err);
            });
    }
);

router.post("/text", upload.single("text"), (req, res, next) => {
    res.header("Access-Control-Allow-Headers", "multipart/form-data");
    var {
        categoryNo,
        contentsTitle,
        contentsExplain,
        //contentsFile,
        contentsType
    } = req.body;
    /*
    if(contentsType !== "sound" && contentsType !== "text"){
        return res
            .status(400)
            .json(
                util.successFalse(
                    err,
                    "지정되지 않은 콘텐츠 타입을 사용했습니다"
                )
            );
    }
    */

    contentsType = "text";
    const contentsFile = req.file.filename.normalize("NFC");
    const contentsCover = "";

    var contentsTime = "00:00:00";
    console.log(req.files);

    console.log("type is text");
    con.query(
        "insert into contents values('0',?,?,?,?,?,?,?,'1');",
        [
            categoryNo,
            contentsTitle,
            contentsExplain,
            contentsTime,
            contentsFile,
            contentsType,
            contentsCover
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

router.put(
    "/sound",
    upload.fields([
        {
            name: "sound"
        },
        {
            name: "cover"
        }
    ]),
    (req, res, next) => {
        res.header("Access-Control-Allow-Headers", "multipart/form-data");
        var {
            categoryNo,
            contentsTitle,
            contentsExplain,
            //contentsFile,
            //contentsCover,
            contentsType,
            contentsNo
        } = req.body;

        contentsType = "sound";

        var contentsFile = "";
        var contentsCover = "";

        if (req.files.sound != null) {
            contentsFile =
                ", contentsFile = '" +
                req.files.sound[0].filename.normalize("NFC") +
                "' ";
        }

        if (req.files.cover != null) {
            console.log("커버입장!!!!!");
            contentsCover =
                ", contentsCover = '" +
                req.files.cover[0].filename.normalize("NFC") +
                "' ";
        }

        var contentsTime = "00:00:00";

        if (req.files.sound != null) {
            console.log("type is sound");
            audioDuration
                .getAudioDurationInSeconds(
                    "meditation/sound/" +
                        req.files.sound[0].filename.normalize("NFC")
                )
                .then(duration => {
                    contentsTime = timeFormat.fromS(
                        Math.ceil(duration),
                        "hh:mm:ss"
                    );

                    console.log(req.files);

                    console.log("type is sound");
                    con.query(
                        "update contents set categoryNo = ?,contentsTitle = ?,contentsExplain = ?,contentsTime = ?,contentsType = ?" +
                            contentsCover +
                            contentsFile +
                            "where contentsNo = ?;",
                        [
                            categoryNo,
                            contentsTitle,
                            contentsExplain,
                            contentsTime,
                            contentsType,
                            contentsNo
                        ],
                        (err, result, fields) => {
                            if (err) {
                                //에러체크
                                return res
                                    .status(400)
                                    .json(
                                        util.successFalse(err, "업데이트 실패")
                                    );
                            }

                            if (result && result.length != 0) {
                                //result 결과값이 있으면

                                console.log(result);
                                return res
                                    .status(200)
                                    .json(util.successTrue(result));
                            } else {
                                return res.sendStatus(204);
                            }
                        }
                    );
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            con.query(
                "update contents set categoryNo = ?,contentsTitle = ?,contentsExplain = ?,contentsTime = ?,contentsType = ?" +
                    contentsCover +
                    contentsFile +
                    "where contentsNo = ?;",
                [
                    categoryNo,
                    contentsTitle,
                    contentsExplain,
                    contentsTime,
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
        }
    }
);

router.put("/text", upload.single("text"), (req, res, next) => {
    res.header("Access-Control-Allow-Headers", "multipart/form-data");
    var {
        categoryNo,
        contentsTitle,
        contentsExplain,
        //contentsFile,
        contentsType,
        contentsNo
    } = req.body;
    /*
    if(contentsType !== "sound" && contentsType !== "text"){
        return res
            .status(400)
            .json(
                util.successFalse(
                    err,
                    "지정되지 않은 콘텐츠 타입을 사용했습니다"
                )
            );
    }
    */
    contentsType = "text";

    var contentsFile = "";

    if (req.file != undefined) {
        contentsFile =
            ", contentsFile = '" + req.file.filename.normalize("NFC") + "' ";
    }

    var contentsTime = "00:00:00";
    console.log(req.files);

    console.log("type is text");
    con.query(
        "update contents set categoryNo = ?,contentsTitle = ?,contentsExplain = ?,contentsTime = ?,contentsType = ?" +
            contentsFile +
            "where contentsNo = ?;",
        [
            categoryNo,
            contentsTitle,
            contentsExplain,
            contentsTime,
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
/*
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

    console.log(req.file);

    //파일 미변경 시를 위함 == 하드코딩
    if (req.file == undefined) {
        if (contentsType === "sound") {
            con.query(
                "update contents set categoryNo = ?,contentsTitle = ?,contentsExplain = ?,contentsType = ? where contentsNo = ?;",
                [
                    categoryNo,
                    contentsTitle,
                    contentsExplain,
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
        } else if (contentsType === "text") {
            console.log("type is text");
            con.query(
                "update contents set categoryNo = ?,contentsTitle = ?,contentsExplain = ?,contentsTime = ?,contentsType = ? where contentsNo = ?;",
                [
                    categoryNo,
                    contentsTitle,
                    contentsExplain,
                    contentsTime,
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
        } else {
            return res
                .status(400)
                .json(
                    util.successFalse(
                        err,
                        "지정되지 않은 콘텐츠 타입을 사용했습니다"
                    )
                );
        }
    } else {
        const contentsFile = req.file.filename.normalize("NFC");
        var contentsTime = "00:00:00";

        if (contentsType === "sound") {
            console.log("type is sound");
            audioDuration
                .getAudioDurationInSeconds(
                    "meditation/sound/" + req.file.filename
                )
                .then(duration => {
                    contentsTime = timeFormat.fromS(
                        Math.ceil(duration),
                        "hh:mm:ss"
                    );

                    con.query(
                        "update contents set categoryNo = ?,contentsTitle = ?,contentsExplain = ?,contentsFile = ?,contentsType = ? where contentsNo = ?;",
                        [
                            categoryNo,
                            contentsTitle,
                            contentsExplain,
                            contentsFile,
                            contentsType,
                            contentsNo
                        ],
                        (err, result, fields) => {
                            if (err) {
                                //에러체크
                                return res
                                    .status(400)
                                    .json(
                                        util.successFalse(err, "업데이트 실패")
                                    );
                            }

                            if (result && result.length != 0) {
                                //result 결과값이 있으면

                                console.log(result);
                                return res
                                    .status(200)
                                    .json(util.successTrue(result));
                            } else {
                                return res.sendStatus(204);
                            }
                        }
                    );
                })
                .catch(err => {
                    console.log(err);
                });
        } else if (contentsType === "text") {
            console.log("type is text");
            con.query(
                "update contents set categoryNo = ?,contentsTitle = ?,contentsExplain = ?,contentsTime = ?,contentsFile = ?,contentsType = ? where contentsNo = ?;",
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
        } else {
            return res
                .status(400)
                .json(
                    util.successFalse(
                        err,
                        "지정되지 않은 콘텐츠 타입을 사용했습니다"
                    )
                );
        }
        //console.log(req.file);
        //const contentsTime = "00:12:23"; //파일을 받아서 시간 확인 필요
    }
});
*/
router.delete("/", (req, res, next) => {
    const { contentsNo } = req.body;

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

router.options("/sound", (req, res) => {
    res.sendStatus(200);
});

router.options("/text", (req, res) => {
    res.sendStatus(200);
});

router.options("/list", (req, res) => {
    res.sendStatus(200);
});

router.options("/category/list", (req, res) => {
    res.sendStatus(200);
});

router.all("/sound", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
});

router.all("/text", (req, res, next) => {
    return res
        .status(405)
        .json(util.successFalse(null, "요청 메서드를 확인하세요"));
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
