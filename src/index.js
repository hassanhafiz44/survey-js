document.addEventListener("DOMContentLoaded", () => {
  fetch("./survey.json")
    .then((response) => response.json())
    .then((data) => {
      createForm(data, "questionnaire");
    });
});
