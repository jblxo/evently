import Events from '../components/Events';

const Home = props => (
  <div>
    <Events page={parseFloat(props.query.page)} />
  </div>
);

export default Home;
