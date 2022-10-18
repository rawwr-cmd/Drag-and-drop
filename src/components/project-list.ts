/// <reference path="base-component.ts"/>
/// <reference path = "../decorators/autobind-decorator.ts"/>
/// <reference path = "../models/drag-drop-interfaces.ts"/>
/// <reference path = "../models/project-model.ts"/>
/// <reference path = "../state/project-state.ts"/>

namespace App {
  //project list
  export class projectList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget
  {
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

    @Autobind
    dragOverHandler(event: DragEvent) {
      event.preventDefault();
      if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.add("droppable");
      }
    }

    @Autobind
    dropHandler(event: DragEvent) {
      // console.log(event);
      const projId = event.dataTransfer!.getData("text/plain");
      // console.log(projId);
      projectState.moveProject(
        projId,
        this.type === "active" ? ProjectType.Active : ProjectType.Finished
      );
    }

    @Autobind
    dragLeaveHandler(_: DragEvent) {
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.remove("droppable");
    }

    configure() {
      // console.log(this.element);
      this.element.addEventListener("dragover", this.dragOverHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);
      this.element.addEventListener("drop", this.dropHandler);

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
        // console.log(this.element);
      }
    }
  }
}

//   private attach = () => {
//     this.hostElement.insertAdjacentElement("beforeend", this.element);
//   };
// }
