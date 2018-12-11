import Account from '../components/Account';

const UserPage = props => (
  <div>
    <Account id={props.query.id} />
  </div>
);

export default UserPage;
