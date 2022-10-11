//autobind decorator
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  console.log(descriptor);
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

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;

    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

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

    this.element = importedNode.firstElementChild as HTMLFormElement; //form
    //forn id =  "user-input"

    this.element.id = "user-input";

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
    this.attach();
  }

  //arrow func doesn't require binding, change submitHandler to arrow func
  //we use decorator
  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this.titleInputElement.value);
  }

  private configure = () => {
    this.element.addEventListener("submit", this.submitHandler);
    console.log(this);
  };

  private attach = () => {
    /* The insertAdjacentElement() method of the Element interface inserts
     a given element node at a given position relative to the element it is
      invoked upon. */
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  };
}

const prjInput = new ProjectInput();

// <!-- beforebegin -->
// <p>
//   <!-- afterbegin -->
//   foo
//   <!-- beforeend -->
// </p>
// <!-- afterend -->
