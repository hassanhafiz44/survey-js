document.addEventListener("DOMContentLoaded", () => {
  fetch("./survey.json")
    .then((response) => response.json())
    .then((data) => {
      const survey = new Survey("questionnaire", data);
      // survey.createSurvey();
      survey.editSurvey();
    });
});
