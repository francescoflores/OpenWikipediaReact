import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  IArticle,
  IParagraph,
  ITable,
} from "../../interfaces/ArticleInterfaces";
import Header from "../../components/Header";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Image,
} from "@nextui-org/react";
import Sidebar from "../../components/Sidebar";
import { TrashIcon } from "@heroicons/react/16/solid";

const Article = () => {
  const { VITE_BACKEND_URL } = import.meta.env;
  let { title } = useParams<{ title: string }>();
  title = title ? title.slice(1) : "";
  const [article, setArticle] = useState<IArticle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paragraphIndex, setParagraphIndex] = useState<number>(-1);
  const [paragraphText, setParagraphText] = useState<string>("");
  const [paragraphTitle, setParagraphTitle] = useState<string>("");
  const [tableIndex, setTableIndex] = useState<number>(-1);
  const [newRowKey, setNewRowKey] = useState("");
  const [newRowValue, setNewRowValue] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tableRows, setTableRows] = useState<{
    [key: string]: (string | ITable)[];
  }>({});

  const navigate = useNavigate();
  const {
    isOpen: isTableModalOpen,
    onOpen: onTableModalOpen,
    onClose: onTableModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const deleteArticle = async () => {
    try {
      await axios.delete(`${VITE_BACKEND_URL}/api/articles/${title}`);
      setArticle(null);
      onDeleteModalClose();
      navigate("/");
    } catch (error: any) {
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred while deleting the article.");
      }
    }
  };

  const confirmDeleteArticle = () => {
    onDeleteModalOpen();
  };

  const updateArticle = async (updatedArticle: IArticle) => {
    try {
      await axios.put(
        `${VITE_BACKEND_URL}/api/articles/${title}`,
        updatedArticle
      );
      setArticle(updatedArticle);
      setParagraphIndex(-1);
    } catch (error) {
      setError("An error occurred while updating the article.");
    }
  };

  const saveParagraph = async () => {
    try {
      if (article && paragraphIndex !== -1) {
        const updatedArticle = { ...article };
        updatedArticle.paragraphs[paragraphIndex].text = paragraphText;
        updatedArticle.paragraphs[paragraphIndex].title = paragraphTitle;
        updateArticle(updatedArticle);
        onClose();
      }
    } catch (error) {
      setError("An error occurred while saving the paragraph.");
    }
  };

  const deleteParagraph = async () => {
    try {
      if (article && paragraphIndex !== -1) {
        const currentLevel = article.paragraphs[paragraphIndex].level;
        let lastIndex = paragraphIndex + 1;

        while (
          lastIndex < article.paragraphs.length &&
          article.paragraphs[lastIndex].level > currentLevel
        ) {
          lastIndex++;
        }

        const updatedArticle = {
          ...article,
          paragraphs: article.paragraphs.filter(
            (_, index) => index < paragraphIndex || index >= lastIndex
          ),
        };

        updateArticle(updatedArticle);
        onClose();
      }
    } catch (error) {
      setError("An error occurred while deleting the paragraph.");
    }
  };

  const deleteTableRow = (key: string) => {
    const updatedRows = { ...tableRows };
    delete updatedRows[key];
    setTableRows(updatedRows);
  };

  const addTableRow = (key: string, value: string) => {
    setTableRows((prevRows) => ({
      ...prevRows,
      [key]: [value],
    }));
  };

  const renderParagraphs = (paragraphs: IParagraph[]) => {
    if (!paragraphs) return null;

    return paragraphs.map((paragraph, index) => (
      <div key={index} className="my-5 mt-5" id={`paragraph-${index}`}>
        <Header level={paragraph.level}>{paragraph.title}</Header>
        <button
          className="bg-transparent text-blue-700 hover:underline font-semibold py-1 px-1"
          onClick={() => {
            if (paragraph.title) {
              setParagraphTitle(paragraph.title);
            }
            if (paragraph.text) {
              setParagraphText(paragraph.text);
            }
            setParagraphIndex(index);
            onOpen();
          }}
        >
          [Edit]
        </button>
        <p>{paragraph.text}</p>
        <div className="flex justify-around">
          {paragraph.images &&
            paragraph.images.map((image, imgIndex) => (
              <Image
                key={imgIndex}
                src={image}
                alt={paragraph.title}
                className="my-4"
              />
            ))}
        </div>

        {paragraph.tables &&
          paragraph.tables.map((table, tblIndex) => (
            <div key={tblIndex}>
              {renderTable(table)}
              <button
                className="bg-transparent text-blue-700 hover:underline font-semibold py-1 px-1 ml-2"
                onClick={() => handleEditTable(index, tblIndex)}
              >
                [Edit Table]
              </button>
            </div>
          ))}
      </div>
    ));
  };

  const renderTable = (table: ITable) => {
    if (!table || !Object.keys(table.rows).length) return null;
    return (
      <Table
        aria-label={table.caption || "table"}
        className="my-5 bg-gray-100 border-slate-500 border-2"
        removeWrapper
      >
        <TableHeader>
          <TableColumn>{table.caption}</TableColumn>
          <TableColumn hidden>Values</TableColumn>
        </TableHeader>
        <TableBody>
          {Object.entries(table.rows).map(([key, values], index) => (
            <TableRow key={index}>
              <TableCell>{key}</TableCell>
              <TableCell>
                {values.map((value, i) => (
                  <div key={i}>
                    {typeof value === "string"
                      ? value
                      : renderTable(value as ITable)}
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const handleEditTable = (paraIndex: number, tblIndex: number) => {
    if (
      article &&
      article.paragraphs &&
      article.paragraphs.length > paraIndex &&
      paraIndex !== -1
    ) {
      const paragraph = article.paragraphs[paraIndex];

      if (
        paragraph.tables &&
        paragraph.tables.length > tblIndex &&
        tblIndex !== -1
      ) {
        const table = paragraph.tables[tblIndex];

        if (table) {
          setTableRows(table.rows);
          setParagraphIndex(paraIndex);
          setTableIndex(tblIndex);
          onTableModalOpen();
        } else {
          console.error("Table not found.");
        }
      } else {
        console.error(
          "Invalid table index or no tables found in the paragraph."
        );
      }
    } else {
      console.error(
        "Invalid paragraph index or no paragraphs found in the article."
      );
    }
  };

  const renderEditableTable = (rows: {
    [key: string]: (string | ITable)[];
  }) => {
    return (
      <Table
        aria-label="Editable Table"
        className="my-5 bg-gray-100 border-slate-500 border-2"
        removeWrapper
      >
        <TableHeader>
          <TableColumn>Key</TableColumn>
          <TableColumn>Values</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody>
          {Object.entries(rows).map(([key, values]) => (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell>
                {values.map((value, i) => (
                  <div key={i}>
                    {typeof value === "string"
                      ? value
                      : renderEditableTable((value as ITable).rows)}
                  </div>
                ))}
              </TableCell>
              <TableCell>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => deleteTableRow(key)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const saveTable = async (paragraphIndex: number, tableIndex: number) => {
    try {
      if (article && paragraphIndex !== -1 && tableIndex !== -1) {
        const updatedArticle = { ...article };
        const paragraph = updatedArticle.paragraphs[paragraphIndex];

        if (paragraph && paragraph.tables && paragraph.tables[tableIndex]) {
          paragraph.tables[tableIndex].rows = tableRows;
          updateArticle(updatedArticle);
          onTableModalClose();
        } else {
          throw new Error("Table not found.");
        }
      } else {
        console.error("Invalid article or indices");
      }
    } catch (error) {
      console.error("An error occurred while saving the table:", error);
      setError("An error occurred while saving the table.");
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get<IArticle>(
          `${VITE_BACKEND_URL}/api/articles/${title}`
        );
        setArticle(response.data);
        setError(null);
      } catch (error: any) {
        if (error.response && error.response.data) {
          setError(error.response.data.error);
        } else {
          setError("An error occurred while fetching the article.");
        }
        setArticle(null);
      }
    };

    fetchArticle();
  }, [title]);

  useEffect(() => {
    const postArticleVisit = async () => {
      try {
        await axios.post(`${VITE_BACKEND_URL}/api/articles/${title}/counter`);
      } catch (error: any) {
        console.error("An error occurred while logging the visit");
      }
    };

    postArticleVisit();
  }, [title, VITE_BACKEND_URL]);

  return (
    <>
      <div className="flex  my-2 justify-center">
        <h2 className="font-bold text-4xl text-center">{article?.title.replace("_", " ")}</h2>
        <Button
          color="danger"
          variant="bordered"
          isIconOnly
          size="sm"
          className="ml-2 h-6"
          onPress={confirmDeleteArticle}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>

      <hr />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2">
          {article && article.paragraphs && (
            <Sidebar paragraphs={article.paragraphs} />
          )}
        </div>
        <div className="col-span-6 flex flex-col ml-2">
          {article ? (
            <div>{renderParagraphs(article.paragraphs)}</div>
          ) : (
            <div>{error && <div style={{ color: "red" }}>{error}</div>}</div>
          )}
        </div>
        <div className="col-span-4">
          {article?.infoTable &&
            Object.keys(article.infoTable.rows).length > 0 && (
              <div className="overflow-auto">
                <h2 className="text-center font-bold -mb-3 text-lg">
                  {article.title.replace("_"," ")}
                </h2>
                {renderTable(article.infoTable)}
              </div>
            )}
        </div>

        <Modal
          isOpen={isDeleteModalOpen}
          onOpenChange={(open) =>
            open ? onDeleteModalOpen() : onDeleteModalClose()
          }
        >
          <ModalContent>
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Deletion
              </ModalHeader>
              <ModalBody>
                Are you sure you want to delete this article?
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onDeleteModalClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={deleteArticle}>
                  Confirm Delete
                </Button>
              </ModalFooter>
            </>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isOpen}
          onOpenChange={(open) => (open ? onOpen() : onClose())}
        >
          <ModalContent>
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Paragraph
              </ModalHeader>
              <ModalBody>
                <input
                  type="text"
                  value={paragraphTitle}
                  onChange={(e) => setParagraphTitle(e.target.value)}
                  className="w-full p-2 border rounded mt-2"
                  placeholder="Paragraph Title"
                />
                <textarea
                  value={paragraphText}
                  onChange={(e) => setParagraphText(e.target.value)}
                  rows={4}
                  className="w-full p-2 border rounded mt-2"
                  placeholder="Paragraph Text"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={deleteParagraph}
                >
                  Delete
                </Button>
                <Button color="primary" onPress={saveParagraph}>
                  Save
                </Button>
              </ModalFooter>
            </>
          </ModalContent>
        </Modal>

        <Modal
          size="xl"
          isOpen={isTableModalOpen}
          onOpenChange={(open) =>
            open ? onTableModalOpen() : onTableModalClose()
          }
        >
          <ModalContent className="max-h-[80vh] max-w-[90vw] overflow-y-auto">
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Table
              </ModalHeader>
              <ModalBody>
                <div className="overflow-auto">
                  {renderEditableTable(tableRows)}
                </div>
                <div className="flex mb-4">
                  <input
                    type="text"
                    value={newRowKey}
                    onChange={(e) => setNewRowKey(e.target.value)}
                    className="w-1/2 p-2 border rounded mr-2"
                    placeholder="Row Key"
                  />
                  <input
                    type="text"
                    value={newRowValue}
                    onChange={(e) => setNewRowValue(e.target.value)}
                    className="w-1/2 p-2 border rounded"
                    placeholder="Row Value"
                  />
                </div>
                <Button
                  color="primary"
                  disabled={newRowValue === "" || newRowKey === ""}
                  onPress={() => addTableRow(newRowKey, newRowValue)}
                >
                  Add Row
                </Button>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={() => saveTable(paragraphIndex, tableIndex)}
                >
                  Save Table
                </Button>
              </ModalFooter>
            </>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default Article;