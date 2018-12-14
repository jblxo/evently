import Events from '../components/Events';

const Home = props => (
  <div>
    <Events page={parseFloat(props.query.page || 1)} />
  </div>
);

export default Home;
