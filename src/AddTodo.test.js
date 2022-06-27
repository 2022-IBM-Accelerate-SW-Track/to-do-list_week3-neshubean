import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

// `render(<App />);` mocks the compentent so that we can do the testing
// `screen.getByRole('textbox', {name: /Add New Item/i})`  Looks for a textbox compentent with the words "Add New Item"
// `fireEvent.change(inputTask, { target: { value: "History Test"}})` Types the value "History Test" into the text box.
// `fireEvent.click()` clicks the selected element.
// `screen.getByText(/History Test/i)` searches for "History Test" on the screen ignoring case using regex. (Note: getBy only looks for one value. If more than one value or no value is present then an error will occur.  If you want to get more then use `getAllBy`). 
// `expect(check).toBeInTheDocument();` the element should be in the page if it is the test case is passed. Otherwise the test fails. 
// If you want to check if a value is equal to something you can use `expect(value).toBe(value_I_want)`.
// Note: that the elements returned by `getByRole` or `getByText` may not have css or styling. If you want to have those values put a `data-testid` in that component and use `getByTestId` to grab those IDs.

// If we want to check if a value is 
// 1. Complete the Following Test Cases in `src/AddTodo.test.js`
//     + No duplicate task
//     + Submit Task with No Due Date
//     + Submit Task with No Task Name
//     + Late Tasks have Different Colors
//         1. Hint if we wanted to grab the color of the card for "History Test" we can use `const historyCheck = screen.getByTestId(/History Test/i).style.background`
//     + Delete Task
//         1. Hint: Earlier we used `screen.getByRole` for getting a Button and a Text Box how would we get a Checkbox? 


 test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const addTask = screen.getByRole('button', {name: /Add/i});
  const date = screen.getByLabelText("mm/dd/yyyy");
  const dueDate = "01/01/2023";
  //first
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(date, { target: { value: dueDate}});
  fireEvent.click(addTask);
  //duplicate
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(date, { target: { value: dueDate}});
  fireEvent.click(addTask);
  //make sure only 1 and no duplicate
  let check = screen.getAllByText(/History Test/i);
  expect(check.length).toBe(1);
 });

 test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const addTask = screen.getByRole('button', {name: /Add/i});
  const date = screen.getByLabelText("mm/dd/yyyy");
  const dueDate = "01/01/2023";
  //lack of task label
  fireEvent.change(inputTask, { target: { value: ""}});
  fireEvent.change(date, { target: { value: dueDate}});
  fireEvent.click(addTask);
  //make sure there
  let check = screen.getAllByText(/You have no todo's left/i);
  expect(check).toBeInTheDocument();
 });

 test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const addTask = screen.getByRole('button', {name: /Add/i});
  const date = screen.getByLabelText("mm/dd/yyyy");
  // const dueDate = "01/01/2023";
  //lack of due date label
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(date, { target: { value: null}});
  fireEvent.click(addTask);
  //make sure there
  let check = screen.getAllByText(/You have no todo's left/i);
  expect(check).toBeInTheDocument();
 });



 test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const addTask = screen.getByRole('button', {name: /Add/i});
  const date = screen.getByLabelText("mm/dd/yyyy");
  const dueDate = "01/01/2023";
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(date, { target: { value: dueDate}});
  fireEvent.click(addTask);
  //make sure there
  const check = screen.getByText(/History Test/i);
  expect(check).toBeInTheDocument();
  const dateCheck = screen.getByText(new RegExp(dueDate, "i"));
  expect(dateCheck).toBeInTheDocument();
  const delCheck = screen.getByTestId("checkbox");
  fireEvent.click(checkbox);
  const postDelCheck = screen.getByText(/You have no todo's left/i);
  expect(postDelCheck).toBeInTheDocument();
 });


 test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const addTask = screen.getByRole('button', {name: /Add/i});
  const date = screen.getByLabelText("mm/dd/yyyy");
  const dueDate = "01/01/2022";
  //late due date
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(date, { target: { value: dueDate}});
  fireEvent.click(addTask);
  //make sure there
  const check = screen.getByText(/History Test/i);
  expect(check).toBeInTheDocument();
  const dateCheck = screen.getByText(new RegExp(dueDate, "i"));
  expect(dateCheck).toBeInTheDocument();
  const colorCheck = check.style.background;
  expect(colorCheck).not.toBe("white");
 });
