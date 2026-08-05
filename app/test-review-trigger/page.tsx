const Page = () => {
  const items: any[] = [1, 2, 3];
  return (
    <ul>
      {items.map((item) => (
        <li>{item}</li>
      ))}
    </ul>
  );
};

export default Page;
