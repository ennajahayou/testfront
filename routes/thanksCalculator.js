const createConnection = require("../dataBaseConnection");
var fs = require("fs");

// const autoEvaluationScoreWeight = [0.34, 0.5, 0.25];
// const PeerReviewScoreWeight = [0.33, 0.25, 0.5];
// const CEOEvaluationScoreWeight = [0.33, 0.25, 0.25];

// const ed_evaluations_descriptions = [
//   [1, 4, 10, 20],
//   [1, 7, 12, 30],
//   [1, 10, 25, 50],
// ];

// const er_evaluations_descriptions = [
//   [1, 4, 10, 20],
//   [1, 7, 12, 30],
//   [1, 10, 25, 50],
// ];

const thanksCalculator = async (executionId, scenario) => {
  var parameters = JSON.parse(fs.readFileSync("parameters.json", "utf8"));

  // Get self review from database

  const sqlSelfReview = `SELECT * FROM review WHERE id_execution = ?`;
  const sqlPeerReview = `SELECT * FROM peer_review WHERE id_execution = ?`;
  const sqlCeoReview = `SELECT * FROM ceo_review WHERE id_execution = ?`;

  const [selfReview, peerReview, ceoReview] = await Promise.all([
    executeSQLRequest(sqlSelfReview, [executionId]),
    executeSQLRequest(sqlPeerReview, [executionId]),
    executeSQLRequest(sqlCeoReview, [executionId]),
  ]);

  console.log({ selfReview, peerReview, ceoReview });

  const thanksFromSelfReview =
    parameters.autoEvaluation.difficulty[selfReview[0].difficulty] *
    parameters.autoEvaluation.reactivity[selfReview[0].reactivity];

  // const thanksFromSelfReview =
  //   ed_evaluations_descriptions[scenario][selfReview[0].difficulty] *
  //   er_evaluations_descriptions[scenario][selfReview[0].reactivity];

  const thanksFromCeoReview =
    parameters.CEOReview.result[ceoReview[0].expectations] *
    parameters.CEOReview.reactivity[ceoReview[0].reactivity];
  // ed_evaluations_descriptions[scenario][ceoReview[0].expectations] *
  // er_evaluations_descriptions[scenario][ceoReview[0].reactivity];

  const thanksFromPeerReviews =
    peerReview.reduce((sum, review) => {
      return (
        sum +
        parameters.peerReview.result[review.expectations] *
          parameters.peerReview.reactivity[review.reactivity]
        // ed_evaluations_descriptions[scenario][review.respect] *
        //   er_evaluations_descriptions[scenario][review.expectations]
      );
    }, 0) / peerReview.length;

  console.log({
    thanksFromSelfReview,
    thanksFromCeoReview,
    thanksFromPeerReviews,
  });

  const thanks =
    parameters.scoreWeight.autoEvaluation * thanksFromSelfReview +
    parameters.scoreWeight.peerReview * thanksFromPeerReviews +
    parameters.scoreWeight.CEOReview * thanksFromCeoReview;
  // autoEvaluationScoreWeight[scenario] * thanksFromSelfReview +
  // CEOEvaluationScoreWeight[scenario] * thanksFromCeoReview +
  // PeerReviewScoreWeight[scenario] * thanksFromPeerReviews;

  console.log({ thanks });

  return thanks;
};

const executeSQLRequest = async (sql, params) => {
  const connection = createConnection();

  const res = new Promise((resolve, reject) => {
    connection.query(sql, params, (err, rows) => {
      connection.close();
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });

  return res;
};

// const executionId = 50;
// thanksCalculator(executionId, 2);

module.exports = thanksCalculator;
