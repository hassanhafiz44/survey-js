document.addEventListener("DOMContentLoaded", () => {
  fetch("./survey.json")
    .then((response) => response.json())
    .then((data) => {
      const survey = new Survey(data, "questionnaire");
      // survey.createSurvey();
      survey.editSurvey();
    });
});
