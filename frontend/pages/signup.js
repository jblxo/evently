import styled from 'styled-components';
import Signup from '../components/Signup';
import Signin from '../components/Signin';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-gap: 20px;
`;

const SignupPage = prosp => (
  <Columns>
    <Signup />
    <Signin />
  </Columns>
);

export default SignupPage;
