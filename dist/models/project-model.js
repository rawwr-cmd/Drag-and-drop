export var ProjectType;
(function (ProjectType) {
    ProjectType[ProjectType["Active"] = 0] = "Active";
    ProjectType[ProjectType["Finished"] = 1] = "Finished";
})(ProjectType || (ProjectType = {}));
export class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
//# sourceMappingURL=project-model.js.map