class Choice {
  constructor(value = "", text = "") {
    this.value = value;
    this.text = text;
  }
}

class Question {
  constructor(
    type = "text",
    name = "",
    title = "Question!",
    isRequired = false,
    choices = []
  ) {
    this.type = type;
    this.name = name;
    this.title = title;
    this.isRequired = isRequired;
    this.choices = choices.map(
      (choice) => new Choice(choice.value, choice.text)
    );
  }
}

class Survey {
  constructor(schema, container) {
    this.questions = schema.questions.map(
      (question) =>
        new Question(
          question.type,
          question.name,
          question.title,
          question.isRequired,
          question?.choices
        )
    );
    this.container = document.getElementById(container);
  }

  /**
   * Method to create survey and display it
   */
  createSurvey() {
    this.questions.forEach((question) => {
      const domQuestion = this.#createQuestion(question);
      if (domQuestion !== undefined) this.container.append(domQuestion);
    });
  }

  /**
   *
   * @param {Question} question
   * @returns {HTMLDivElement|undefined} Returns the question dom object created
   */
  #createQuestion(question) {
    switch (question.type) {
      case "text":
        return this.#createTextQuestion(question);
      case "radio":
        return this.#createRadioQuestion(question);
      default:
        return undefined;
    }
  }

  /**
   *
   * @param {Question} question A question to convert into html
   *
   * @return {HTMLDivElement} html div element containg a complete question
   */
  #createTextQuestion(question) {
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("question");
    const label = document.createElement("label");
    label.textContent = question.title;
    label.setAttribute("for", question.name);

    if (question.isRequired) label.append(this.#addRequiredAsterisk());

    const input = document.createElement("input");
    input.classList.add("form-control");
    input.setAttribute("type", question.type);
    input.id = question.name;
    if (question.isRequired)
      input.setAttribute("required", question.isRequired);
    input.name = question.name;

    mainDiv.append(label, input);
    return mainDiv;
  }

  /**
   *
   * @param {Question} question
   *
   * @returns {HTMLDivElement} Div containing radio question
   */
  #createRadioQuestion(question) {
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("question");

    const titleParagrah = document.createElement("p");
    titleParagrah.textContent = question.title;
    if (question.isRequired) titleParagrah.append(this.#addRequiredAsterisk());

    const options = document.createElement("div");

    mainDiv.append(titleParagrah, options);

    question.choices.forEach((elem, index) => {
      const label = document.createElement("label");
      label.textContent = elem.text;
      label.setAttribute("for", `${question.name}-${index + 1}`);

      const input = document.createElement("input");
      input.classList.add("form-control");
      input.setAttribute("type", question.type);
      input.id = `${question.name}-${index + 1}`;
      input.setAttribute("value", elem.value);
      if (question.isRequired)
        input.setAttribute("required", question.isRequired);
      input.name = question.name;

      options.append(input, label, document.createElement("br"));
    });

    return mainDiv;
  }

  /**
   *
   * @returns {HTMLSpanElement} span containing red asterisk
   */
  #addRequiredAsterisk() {
    const span = document.createElement("span");
    span.textContent = " *";
    span.style.color = "red";
    return span;
  }

  editSurvey() {
    this.createSurvey();
    const button = document.createElement("button");
    button.textContent = "Add More Questions!";
    button.addEventListener("click", () => {
      this.#addQuestion();
    });
    this.container.append(button);
  }

  #addQuestion() {
    this.container.insertBefore(
      this.#createQuestion(new Question()),
      this.container.lastElementChild
    );
  }
}
