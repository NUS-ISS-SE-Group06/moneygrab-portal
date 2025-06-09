import { render, screen } from '@testing-library/react';
import App from './App';


test("renders Commission page content", () => {
  render(<App />);
  const heading = screen.getByText("Account"); 
  
  expect(heading).toBeInTheDocument();
});