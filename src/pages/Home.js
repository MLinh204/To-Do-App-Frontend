import { useAuth } from "../contexts/AuthContext";

function Home() {
  const { user } = useAuth();
  if (!user) return <p>Please log in to view your todos.</p>;

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <div className="iframe-container">
        <iframe
          src="https://mlinh204.github.io/Tic-Tac-Toe-Game/"
          title="Example Iframe"
          frameBorder="0"
        />
      </div>
    </div>
  );
}

export default Home;