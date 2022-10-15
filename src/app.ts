// Project Type(because we want to instantiate it)
enum ProjectType {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectType
  ) {}
}

//project management class
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  //addListener
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  // The static keyword is a non-access modifier used for methods and attributes.
  //  Static methods/attributes can be accessed without creating an object of a class.
  // can be accessed in construcor, de-attach from instances, so use className

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  //methods to be called
  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectType.Active
    );

    this.projects.push(newProject);

    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

//validation
interface Validatable {
  value: string | number;
  required?: boolean; //or undefined
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

const validate = (validatableInput: Validatable) => {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }

  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }

  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  return isValid;
};

//autobind decorator
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  //   console.log(descriptor);
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

//component base class(can't be instantiated directly)
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;

    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedNode.firstElementChild as U; //section

    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach = (insertAtBeginning: boolean) => {
    /* The insertAdjacentElement() method of the Element interface inserts
     a given element node at a given position relative to the element it is
      invoked upon. */
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? "afterbegin" : "beforeend",
      this.element
    );
  };

  //abstract method- must be implemented in child class(private abstract method can't be allowed)
  abstract configure(): void;
  abstract renderContent(): void;
}

//ProjectItem Class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  private project: Project;

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  configure() {}

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent =
      this.project.people.toString() + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

//project list
class projectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);

    // this.templateElement = document.getElementById(
    //   "project-list"
    // )! as HTMLTemplateElement;

    // this.hostElement = document.getElementById("app")! as HTMLDivElement;

    this.assignedProjects = [];

    // const importedNode = document.importNode(
    //   this.templateElement.content,
    //   true
    // );

    // this.element = importedNode.firstElementChild as HTMLElement; //section
    // this.element.id = `${this.type}-projects`;

    this.configure();
    this.renderContent();
  }

  configure() {
    projectState.addListener((projects: Project[]) => {
      // this.assignedProjects = projects;
      // console.log(projects);

      const relevantProjects = projects.filter((project) => {
        if (this.type === "active") {
          return project.status === ProjectType.Active;
        }

        return project.status === ProjectType.Finished;
      });

      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    listEl.innerHTML = "";
    for (const prjItem of this.assignedProjects) {
      // const listItem = document.createElement("li");

      //this.element.id here is ul id
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
      console.log(this.element);
    }
  }
}

//   private attach = () => {
//     this.hostElement.insertAdjacentElement("beforeend", this.element);
//   };
// }

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
      max: 5,
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

const prjInput = new ProjectInput();
const activePrjList = new projectList("active");
const finishedPrjList = new projectList("finished");

// <!-- beforebegin -->
// <p>
//   <!-- afterbegin -->
//   foo
//   <!-- beforeend -->
// </p>
// <!-- afterend -->

// The slice() method returns a shallow copy of a portion of an array
//  into a new array object selected from start to end (end not included)
// where start and end represent the index of items in that array.
// The original array will not be modified.
