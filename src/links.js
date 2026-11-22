// Where a clicked result goes.
//
// Deployed (MainMenuB.aspx): the real WebForms pages, relative to MainMenuB.aspx.
// Preview: the #/ placeholder pages, because those .aspx pages don't exist there.
// preview/index.html sets window.SapienPreview = true to switch.
import { detailHash } from './hooks.js';

const PAGES = {
  learner: 'ViewStudent.aspx?student={0}', // {0} = pcode
  course: 'ViewCourse.aspx?group={0}', //     {0} = uicyear (uic-acyear)
  class: 'ViewCourse.aspx?group={0}', //      {0} = uicyear (classcode-acyear)
};

const isPreview = () => window.SapienPreview === true;

function link(kind, value) {
  if (isPreview()) return detailHash(kind, value);
  return PAGES[kind].replace('{0}', encodeURIComponent(value));
}

export const learnerLink = (r) => link('learner', r.pcode);
export const courseLink = (r) => link('course', r.uicyear);
export const classLink = (r) => link('class', r.uicyear);
