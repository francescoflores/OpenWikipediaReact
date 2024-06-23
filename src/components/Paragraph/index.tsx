import { IParagraph } from "../../interfaces/ArticleInterfaces";
import Header from "../Header";
import { Image } from "@nextui-org/react";

const Paragraph = (paragraph: IParagraph, index: number) => {

  return (
    <div className="my-5 mt-5">
      <Header level={paragraph.level}>{paragraph.title}</Header>
      <button
        className="bg-transparent text-blue-700 hover:underline font-semibold py-1 px-1"
        onClick={() => null}
      >
        [Edit]
      </button>
      <p>{paragraph.text}</p>
      <div className="flex justify-around">
        {paragraph.images &&
          paragraph.images.map((image, imgIndex) => (
            <Image key={imgIndex} src={image} className="my-4" />
          ))}
      </div>

      {paragraph.tables &&
        paragraph.tables.map((table, tblIndex) => (
          <div key={tblIndex}>
            {/**todo: render table here*/}
            <button
              className="bg-transparent text-blue-700 hover:underline font-semibold py-1 px-1 ml-2"
              onClick={() => null}
            >
              [Edit Table]
            </button>
          </div>
        ))}
    </div>
  );
};
export default Paragraph;