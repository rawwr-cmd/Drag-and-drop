//component base class(can't be instantiated directly)
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

    this.element = importedNode.firstElementChild as U; //section, li

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
