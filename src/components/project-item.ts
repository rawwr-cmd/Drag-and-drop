import { Draggable } from "../models/drag-drop-interfaces";
import { Project } from "../models/project-model";
import Component from "./base-component";
import { Autobind } from "../decorators/autobind-decorator";
//ProjectItem Class
export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return this.project.people + " persons";
    }
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @Autobind
  //class must have the properties of an interface
  dragStartHandler(event: DragEvent) {
    // console.log(event);
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move"; //data is attached
  }

  dragEndHandler(_: DragEvent) {
    console.log("DragEnd");
  }

  configure() {
    // console.log(this.element);
    this.element.addEventListener("dragstart", this.dragStartHandler); //li
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
