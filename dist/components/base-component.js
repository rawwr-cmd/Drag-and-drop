export default class Component {
    constructor(templateId, hostElementId, insertAtStart, newElementId) {
        this.attach = (insertAtBeginning) => {
            this.hostElement.insertAdjacentElement(insertAtBeginning ? "afterbegin" : "beforeend", this.element);
        };
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
}
//# sourceMappingURL=base-component.js.map