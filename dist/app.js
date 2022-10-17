"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// Project Type(because we want to instantiate it)
var ProjectType;
(function (ProjectType) {
    ProjectType[ProjectType["Active"] = 0] = "Active";
    ProjectType[ProjectType["Finished"] = 1] = "Finished";
})(ProjectType || (ProjectType = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class State {
    constructor() {
        this.listeners = [];
    }
    //addListener
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
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
    addProject(title, description, numOfPeople) {
        const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectType.Active);
        this.projects.push(newProject);
        this.updateListeners();
    }
    moveProject(projectId, newStatus) {
        const project = this.projects.find((prj) => prj.id === projectId);
        //if project.active = active and we want to move it to active projects
        //this project.status !== newStatus will skip it and skip unneccessary
        //rerendering cycle
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }
    updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}
const projectState = ProjectState.getInstance();
const validate = (validatableInput) => {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null &&
        typeof validatableInput.value === "string") {
        isValid =
            isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null &&
        typeof validatableInput.value === "string") {
        isValid =
            isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if (validatableInput.min != null &&
        typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null &&
        typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
};
//autobind decorator
function Autobind(_, _2, descriptor) {
    //   console.log(descriptor);
    const originalMethod = descriptor.value;
    const adjDescriptor = {
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
class Component {
    constructor(templateId, hostElementId, insertAtStart, newElementId) {
        this.attach = (insertAtBeginning) => {
            /* The insertAdjacentElement() method of the Element interface inserts
             a given element node at a given position relative to the element it is
              invoked upon. */
            this.hostElement.insertAdjacentElement(insertAtBeginning ? "afterbegin" : "beforeend", this.element);
        };
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild; //section, li
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
}
//ProjectItem Class
class ProjectItem extends Component {
    constructor(hostId, project) {
        super("single-project", hostId, false, project.id);
        this.project = project;
        this.configure();
        this.renderContent();
    }
    get persons() {
        if (this.project.people === 1) {
            return "1 person";
        }
        else {
            return this.project.people + " persons";
        }
    }
    //class must have the properties of an interface
    dragStartHandler(event) {
        // console.log(event);
        event.dataTransfer.setData("text/plain", this.project.id);
        event.dataTransfer.effectAllowed = "move"; //data is attached
    }
    dragEndHandler(event) {
        console.log("DragEnd");
    }
    configure() {
        // console.log(this.element);
        this.element.addEventListener("dragstart", this.dragStartHandler); //li
        this.element.addEventListener("dragend", this.dragEndHandler);
    }
    renderContent() {
        this.element.querySelector("h2").textContent = this.project.title;
        this.element.querySelector("h3").textContent = this.persons + " assigned";
        this.element.querySelector("p").textContent = this.project.description;
    }
}
__decorate([
    Autobind
    //class must have the properties of an interface
], ProjectItem.prototype, "dragStartHandler", null);
//project list
class projectList extends Component {
    constructor(type) {
        super("project-list", "app", false, `${type}-projects`);
        this.type = type;
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
    dragOverHandler(event) {
        event.preventDefault();
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            const listEl = this.element.querySelector("ul");
            listEl.classList.add("droppable");
        }
    }
    dropHandler(event) {
        // console.log(event);
        const projId = event.dataTransfer.getData("text/plain");
        // console.log(projId);
        projectState.moveProject(projId, this.type === "active" ? ProjectType.Active : ProjectType.Finished);
    }
    dragLeaveHandler(_) {
        const listEl = this.element.querySelector("ul");
        listEl.classList.remove("droppable");
    }
    configure() {
        // console.log(this.element);
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        this.element.addEventListener("drop", this.dropHandler);
        projectState.addListener((projects) => {
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
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent =
            this.type.toUpperCase() + " PROJECTS";
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        listEl.innerHTML = "";
        for (const prjItem of this.assignedProjects) {
            // const listItem = document.createElement("li");
            //this.element.id here is ul id
            new ProjectItem(this.element.querySelector("ul").id, prjItem);
            // console.log(this.element);
        }
    }
}
__decorate([
    Autobind
], projectList.prototype, "dragOverHandler", null);
__decorate([
    Autobind
], projectList.prototype, "dropHandler", null);
__decorate([
    Autobind
], projectList.prototype, "dragLeaveHandler", null);
//   private attach = () => {
//     this.hostElement.insertAdjacentElement("beforeend", this.element);
//   };
// }
class ProjectInput extends Component {
    constructor() {
        super("project-input", "app", true, "user-input");
        this.configure = () => {
            this.element.addEventListener("submit", this.submitHandler);
            // console.log(this);
        };
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
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.peopleInputElement = this.element.querySelector("#people");
        this.configure();
    }
    renderContent() { }
    gatherUserInput() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        const titleValidatable = {
            value: enteredTitle,
            required: true,
        };
        const descriptionValidatable = {
            value: enteredDescription,
            required: true,
            minLength: 5,
        };
        const peopleValidatable = {
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
            !validate(peopleValidatable)) {
            alert("Please enter valid value");
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
    clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }
    //arrow func doesn't require binding, change submitHandler to arrow func
    //but, we will use decorator
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            // console.log(title, desc, people);
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }
}
__decorate([
    Autobind
], ProjectInput.prototype, "submitHandler", null);
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
