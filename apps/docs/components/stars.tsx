export async function Stars() {
  const response = await fetch('https://api.github.com/repos/shuding/nextra');
  const repo = await response.json();
  const stars = repo.stargazers_count;
  return <b>{stars}</b>;
}
