// Project Type(because we want to instantiate it)
export enum ProjectType {
  Active,
  Finished,
}

export class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectType
  ) {}
}
