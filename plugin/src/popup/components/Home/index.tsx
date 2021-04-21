import "@popup/styles.css";

type HomeProps = {
  account: string;
};

function Home(props: HomeProps) {
  const { account } = props;

  return (
    <div className="Popup">
      <h2>Home</h2>
      <p>{`Account: ${account}`}</p>
    </div>
  );
}

export default Home;
