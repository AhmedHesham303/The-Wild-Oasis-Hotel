import styled from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";
const H1 = styled.h1`
  font-size: 30px;
  font-weight: 600;
  color: blue;
`;
const App = () => {
  return (
    <>
      <GlobalStyles />
      <H1>Welcome to React</H1>
    </>
  );
};

export default App;
