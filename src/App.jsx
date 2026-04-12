import styled from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";
import Button from "./ui/Button";
import Input from "./ui/Input";
const H1 = styled.h1`
  font-size: 30px;
  font-weight: 600;
  color: yellow;
`;

const StyledApp = styled.main`
  background-color: orangered;
  padding: 20px;
`;
const App = () => {
  return (
    <>
      <GlobalStyles />
      <StyledApp>
        <H1>Welcome to React</H1>
        <Button>click</Button>
        <Button>click</Button>
        <Input placeholder="Enter your name" />
      </StyledApp>
    </>
  );
};

export default App;
