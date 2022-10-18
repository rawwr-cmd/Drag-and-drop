import { Component } from "./base-component.js";
import { Validatable, validate } from "../utils/validation.js";
import { Autobind } from "../decorators/autobind-decorator.js";
import { projectState } from "../state/project-state.js";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    // this.templateElement = document.getElementById(
    //   "project-input"
    // )! as HTMLTemplateElement;

    // this.hostElement = document.getElementById("app")! as HTMLDivElement;

    // const importedNode = document.importNode(
    //   this.templateElement.content,
    //   true
    // );

    //A "node", in this context, is simply an HTML element.
    //  The "DOM" is a tree structure that represents the HTML of the website,
    //  and every HTML element is a "node". See Document Object Model (DOM).

    // If deep is set to true, then externalNode and all of its descendants
    // are copied.
    // If false, then only the externalNode is copied. Thus, in the case that
    //  externalNode is a DocumentFragment, copying empty document fragments
    //  returns null for the new document fragment but copying a non-
    //  empty document fragment returns a non-null document fragment.

    // console.log(importedNode);

    // this.element = importedNode.firstElementChild as HTMLFormElement; //form
    //forn id =  "user-input"

    // this.element.id = "user-input";

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
  }

  renderContent() {}

  configure = () => {
    this.element.addEventListener("submit", this.submitHandler);
    // console.log(this);
  };

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };

    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 10,
    };

    if (
      //   enteredTitle.trim().length === 0 ||
      //   enteredDescription.trim().length === 0 ||
      //   enteredPeople.trim().length === 0

      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Please enter valid value");
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  //arrow func doesn't require binding, change submitHandler to arrow func
  //but, we will use decorator
  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      // console.log(title, desc, people);
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }

  // private attach = () => {
  //   this.hostElement.insertAdjacentElement("afterbegin", this.element);
  // };
}
