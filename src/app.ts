import { ProjectInput } from "./components/project-input.js";
import { projectList } from "./components/project-list.js";

new ProjectInput();
new projectList("active");
new projectList("finished");

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
