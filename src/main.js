function addRequiredAsterisk() {
  const span = document.createElement("span");
  span.textContent = " *";
  span.style.color = "red";
  return span;
}
function createRadioQuestion({ type, name, title, isRequired, choices }) {
  const mainDiv = document.createElement("div");
  mainDiv.classList.add("question");

  const titleParagrah = document.createElement("p");
  titleParagrah.textContent = title;
  if (isRequired) titleParagrah.append(addRequiredAsterisk());

  const options = document.createElement("div");

  mainDiv.append(titleParagrah, options);
  choices.forEach((elem, index) => {
    const label = document.createElement("label");
    label.textContent = elem.text;
    label.setAttribute("for", `${name}-${index + 1}`);

    const input = document.createElement("input");
    input.classList.add("form-control");
    input.setAttribute("type", type);
    input.id = `${name}-${index + 1}`;
    input.setAttribute("value", elem.value);
    if (isRequired) input.setAttribute("required", isRequired);
    input.name = name;

    options.append(input, label, document.createElement("br"));
  });

  return mainDiv;
}

function createTextQuestion({ title, name, type, isRequired }) {
  const mainDiv = document.createElement("div");
  mainDiv.classList.add("question");
  const label = document.createElement("label");
  label.textContent = title;
  label.setAttribute("for", name);

  if (isRequired) label.append(addRequiredAsterisk());

  const input = document.createElement("input");
  input.classList.add("form-control");
  input.setAttribute("type", type);
  input.id = name;
  if (isRequired) input.setAttribute("required", isRequired);
  input.name = name;

  mainDiv.append(label, input);
  return mainDiv;
}

function createQuestion(element) {
  switch (element.type) {
    case "text":
      return createTextQuestion(element);
    case "radio":
      return createRadioQuestion(element);
  }
}

function createForm(schema, containerId) {
  const container = document.querySelector(`#${containerId}`);
  schema.elements = schema.elements.map((element, index) => ({
    ...element,
    id: index + 1,
  }));
  schema.elements.forEach((element) => {
    const question = createQuestion(element);
    if (question !== undefined) container.append(createQuestion(element));
  });
}
