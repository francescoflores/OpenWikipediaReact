import { IParagraph } from "../../interfaces/ArticleInterfaces";

const Sidebar = ({ paragraphs }: { paragraphs: IParagraph[]}) => {
  let currentIndex: number[] = [];
  const indices: { index: string; title: string; id: string }[] = [];

  const outputParagraphs = paragraphs.map((paragraph) => ({
    ...paragraph,
  }));

  if (outputParagraphs[0].title === null || outputParagraphs[0].title === "") {
    outputParagraphs[0].title = "(top)";
  }

  outputParagraphs.forEach((paragraph, idx) => {
    const level = paragraph.level - 1;

    while (currentIndex.length > level) {
      currentIndex.pop();
    }

    if (currentIndex.length === level) {
      currentIndex[level - 1]++;
    } else {
      currentIndex.push(1);
    }

    const currentIndexStr = currentIndex.join(".");
    indices.push({
      index: currentIndexStr,
      title: paragraph.title,
      id: `paragraph-${idx}`,
    });
  });
  return (
    <div className="fixed h-2/3 bg-gray-100 overflow-auto rounded-xl max-w-64 border-2 -ml-2 custom-scrollbar">
      <h2 className="text-center text-xl font-serif font-bold sm:text-2xl">
        Contents
      </h2>
      <div className="h-screen px-4 pt-2">
        <ul className="list-none pl-0">
          {indices.map((item, idx) => (
            <li key={idx} className="mb-2">
              <a
                href={`#${item.id}`}
                className="text-blue-700 hover:underline ml-2"
              >
                {item.index} {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
