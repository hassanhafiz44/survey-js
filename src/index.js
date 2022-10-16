document.addEventListener("DOMContentLoaded", () => {
  document.body.style.position = "relative";
  fetch("./survey.json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const survey = new Survey("questionnaire", data);
      survey.createSurvey();
    });
});
