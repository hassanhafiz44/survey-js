class Choice {
  constructor(value = "", text = "") {
    this.value = value;
    this.text = text;
  }
}

class Question {
  constructor(
    id = 0,
    type = "text",
    name = "",
    title = "Question!",
    isRequired = false,
    choices = []
  ) {
    this.id = id;
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
  constructor(container, schema = {}) {
    if (schema.questions === undefined) this.questions = [];
    else
      this.questions = schema.questions.map(
        (question, index) =>
          new Question(
            index,
            question.type,
            question.name,
            question.title,
            question.isRequired,
            question?.choices
          )
      );
    this.container = document.getElementById(container);
    this.isEditMode = false;
  }

  /**
   * Method to create survey and display it
   */
  createSurvey() {
    this.container.innerHTML = "";
    this.questions.forEach((question) => {
      const domQuestion = this.#createQuestion(question);
      this.container.append(domQuestion);
    });
  }

  /**
   *
   * @param {Question} question
   * @returns {HTMLDivElement|undefined} Returns the question dom object created
   */
  #createQuestion(question) {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");

    const mainDiv = document.createElement("div");
    mainDiv.classList.add("main");
    const asteriskSpan = this.#addRequiredAsterisk();
    asteriskSpan.style.display = question.isRequired ? "" : "none";

    mainDiv.append(asteriskSpan);
    questionDiv.append(mainDiv);

    if (this.isEditMode) {
      const toolbarDiv = document.createElement("div");
      toolbarDiv.classList.add("toolbar");

      const nameInput = document.createElement("input");
      nameInput.classList = "input-text input-name";
      nameInput.value = question.name;
      nameInput.placeholder = "Enter a name";

      nameInput.addEventListener("change", (ev) => {
        question.name = ev.target.value;
      });

      toolbarDiv.append(nameInput);
      questionDiv.append(toolbarDiv);

      const requiredInputDiv = document.createElement("div");
      const isRequiredInput = document.createElement("input");
      isRequiredInput.type = "checkbox";
      isRequiredInput.id = `isRequired-${question.id}`;
      isRequiredInput.checked = question.isRequired;

      isRequiredInput.addEventListener("change", (ev) => {
        question.isRequired = ev.target.checked;
        asteriskSpan.style.display = question.isRequired ? "" : "none";
      });
      requiredInputDiv.append(isRequiredInput);
      toolbarDiv.append(requiredInputDiv);

      const isRequiredLabel = document.createElement("label");
      isRequiredLabel.setAttribute("for", `isRequired-${question.id}`);
      isRequiredLabel.textContent = "Required";

      requiredInputDiv.append(isRequiredLabel);

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.textContent = "Delete";
      toolbarDiv.append(deleteButton);
      deleteButton.classList = "delete-button";
      deleteButton.addEventListener("click", (ev) => {
        this.#deleteQuestion(ev, question);
      });

      const mainInput = document.createElement("input");
      mainInput.value = question.title;
      mainInput.classList = "input-text";
      mainInput.setAttribute("required", "required");
      mainInput.addEventListener("change", (ev) => {
        question.title = ev.target.value;
      });

      mainDiv.append(mainInput);

      const inputDiv = document.createElement("div");
      inputDiv.classList = "input-label";

      mainDiv.append(inputDiv);
    } else {
      const mainLabel = document.createElement("label");
      mainLabel.textContent = question.title;
      mainLabel.setAttribute("for", `question-${question.name}`);

      const mainInput = document.createElement("input");
      mainInput.classList = "input-text input-answer";
      mainInput.id = `question-${question.name}`;
      mainDiv.append(mainLabel, mainInput);
    }
    return questionDiv;
  }

  /**
   *
   * @param {Question} question A question to convert into html
   *
   * @return {HTMLDivElement} html div element containg a complete question
   */
  #createTextQuestion(question) {
    const mainDiv = document.createElement("div");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", (ev) => {
      this.#deleteQuestion(ev, question);
    });
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", (ev) => {
      this.#editQuestion(ev, question);
    });
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

    mainDiv.append(deleteButton, label, input, editButton);
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
    span.textContent = "* ";
    span.classList.add("required-asterisk");
    return span;
  }

  editSurvey() {
    this.isEditMode = true;
    this.createSurvey();
    this.#createAddQuestionButton();
    this.#saveSurveyButton();
  }

  #addQuestion() {
    const question = new Question(this.questions.length);
    this.questions.push(question);
    this.editSurvey();
  }

  #deleteQuestion(ev, question) {
    const idx = this.questions.findIndex(
      (predicate) => question.name === predicate.name
    );
    this.questions.splice(idx, 1);
    this.editSurvey();
  }

  #createAddQuestionButton() {
    const button = document.createElement("button");
    button.textContent = "Add Question!";
    button.addEventListener("click", () => {
      this.#addQuestion();
    });
    this.container.append(button);
  }

  #saveSurveyButton() {
    const button = document.createElement("button");
    button.textContent = "Complete!";
    button.addEventListener("click", () => {
      console.log(JSON.stringify({ questions: this.questions }));
    });
    this.container.insertBefore(button, this.container.firstElementChild);
  }

  #editQuestion(ev, question) {
    this.#createEditModal();
  }

  #createEditModal() {
    const div = document.createElement("div");
    div.id = "editModal";
    div.style.zIndex = 9999;
    div.style.height = "100vh";
    div.style.width = "100%";
    div.style.position = "absolute";
    div.style.top = 0;
    div.style.left = 0;
    div.style.backgroundColor = "teal";
    const button = document.createElement("button");
    div.append(button);
    button.textContent = "Save";
    button.addEventListener("click", (ev) => {
      this.#saveQuestion();
    });
    this.container.append(div);
  }

  #saveQuestion() {
    const modal = document.getElementById("editModal");
    modal.remove();
  }
}
