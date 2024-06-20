import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardBody,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  useDisclosure,
} from "@nextui-org/react";
import { Link, Outlet } from "react-router-dom";
import { IMinimalArticle } from "../../interfaces/ArticleInterfaces";
import logo from "../../assets/logo.webp";

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<any[]>([]);
  const [mostVisitedArticles, setMostVisitedArticles] = useState<
    IMinimalArticle[] | []
  >([]);
  const [isWikipedia, setIsWikipedia] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { VITE_API_URL, VITE_BACKEND_URL } = import.meta.env;
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedArticle, setSelectedArticle] = useState<{
    title: string;
    url: string;
  } | null>(null);

  const handleWikipediaSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await axios.get(VITE_API_URL, {
        params: {
          action: "query",
          list: "search",
          format: "json",
          origin: "*", // accept crossorigin
          srsearch: searchQuery,
        },
      });

      if (response.data && response.data.query && response.data.query.search) {
        const articlesData = response.data.query.search.map(
          (article: { title: any; pageid: any }) => ({
            title: article.title,
            url: `https://en.wikipedia.org/?curid=${article.pageid}`,
          })
        );
        setArticles(articlesData);
      } else {
        console.error("Unexpected response structure:", response.data);
        setArticles([]);
      }
    } catch (error) {
      console.error("Error during the Wikipedia search:", error);
      setArticles([]);
    }
  };

  const toggleWikipedia = () => {
    setIsWikipedia(!isWikipedia);
    setSearchQuery("");
    setArticles([]);
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleOpenWikipediaSearch = async () => {
    try {
      const response = await axios.get(`${VITE_BACKEND_URL}/api/articles`, {
        params: {
          title: searchQuery,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        const articlesData = response.data.map(
          (article: { title: string; url: string }) => ({
            title: article.title,
            url: article.url,
          })
        );
        setArticles(articlesData);
      } else {
        console.error("Unexpected response structure:", response.data);
        setArticles([]);
      }
    } catch (error) {
      console.error("Error during the OpenWikipedia search:", error);
      setArticles([]);
    }
  };

  const saveArticle = async (article: { title: string; url: string }) => {
    try {
      await axios.post(
        `${VITE_BACKEND_URL}/api/articles`,
        {
          title: article.title.replace(" ", "_"),
          url: article.url,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSelectedArticle(article);
      setIsSuccessModalOpen(true);
      fetchMostVisitedArticle();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          setSelectedArticle(article);
          setIsConflictModalOpen(true);
        } else {
          console.error("Error while saving the article:", error);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const overwriteArticle = async () => {
    if (selectedArticle) {
      try {
        await axios.delete(
          `${VITE_BACKEND_URL}/api/articles/${selectedArticle.title.replace(
            " ",
            "_"
          )}`
        );
        await saveArticle(selectedArticle);
        setIsConflictModalOpen(false);
      } catch (error) {
        console.error("Error during the overwrite process:", error);
      }
    }
  };

  const fetchMostVisitedArticle = async () => {
    try {
      const response = await axios.get(
        `${VITE_BACKEND_URL}/api/articles/featured`
      );
      const articles = response.data;
      if (articles) {
        setMostVisitedArticles(articles);
      } else {
        setMostVisitedArticles([]);
      }
    } catch (error) {
      console.error("Error fetching the most visited article:", error);
      setMostVisitedArticles([]);
    }
  };

  useEffect(() => {
    fetchMostVisitedArticle();
  }, []);

  useEffect(() => {
    if (isWikipedia) {
      handleWikipediaSearch();
    } else {
      handleOpenWikipediaSearch();
    }
  }, [isWikipedia]);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <Image src={logo} className="w-32 h-32 sm:w-48 sm:h-48"></Image>

        <h1 className="text-4xl font-serif font-bold sm:text-6xl">
          OpenWikipedia
        </h1>
        <Switch defaultSelected color="primary" onClick={toggleWikipedia}>
          {isWikipedia ? "Wikipedia" : "OpenWikipedia"}
        </Switch>
        <div className="flex">
          <input
            className="border border-gray-400 px-2 py-1 w-96"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSelect={onOpen}
            placeholder={`Search on ${
              isWikipedia ? "Wikipedia" : "OpenWikipedia"
            }...`}
            disabled={!isWikipedia && !articles.length}
          />
        </div>

        <h2 className="text-2xl font-bold">
          {mostVisitedArticles.length
            ? "Most Visited Article"
            : "There's no article saved yet"}
        </h2>
        {mostVisitedArticles.map((article, index) => (
          <div key={index} className="mt-4 w-full flex justify-center px-4">
            <Card className="w-96">
              <CardBody className="text-center">
                <h3 className="text-xl font-semibold">
                  {article.title.replace("_", " ")}
                </h3>
                <div className="grid grid-cols-4">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-3"
                  >
                    {article.url}
                  </a>
                  <Link to={`/article/:${article.title}`}>
                    <button className="mt-2 bg-green-500 text-white px-4 py-1 rounded ml-3">
                      Open
                    </button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </div>
        ))}

        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          scrollBehavior="inside"
          size="2xl"
        >
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1 items-center">
                  Search {isWikipedia ? "Wikipedia" : "OpenWikipedia"}
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex">
                      <input
                        ref={inputRef}
                        className="border border-gray-400 px-2 py-1"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search on ${
                          isWikipedia ? "Wikipedia" : "OpenWikipedia"
                        }...`}
                      />
                      <button
                        className="ml-2 bg-blue-500 text-white px-4 py-1 rounded mx-3"
                        onClick={
                          isWikipedia
                            ? handleWikipediaSearch
                            : handleOpenWikipediaSearch
                        }
                      >
                        Search
                      </button>
                    </div>

                    {articles.map((article, index) => (
                      <Card key={index} fullWidth>
                        <CardBody className="text-center">
                          <h2 className="text-xl font-semibold">
                            {article.title.replace("_", " ")}
                          </h2>
                          <div className="grid grid-cols-4">
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="col-span-3"
                            >
                              {article.url}
                            </a>
                            {isWikipedia ? (
                              <button
                                className="mt-2 bg-green-500 text-white px-4 py-1 rounded ml-3"
                                onClick={() => saveArticle(article)}
                              >
                                Save
                              </button>
                            ) : (
                              <Link to={`/article/:${article.title}`}>
                                <button className="mt-2 bg-green-500 text-white px-4 py-1 rounded ml-3">
                                  Open
                                </button>
                              </Link>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>

      <Modal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        size="sm"
      >
        <ModalContent>
          <ModalHeader>Conflict</ModalHeader>
          <ModalBody>
            <p>
              The Article "{selectedArticle?.title}" is already present in the
              database. Would you like to overwrite it?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onPress={() => setIsConflictModalOpen(false)}
            >
              No
            </Button>
            <Button color="danger" onPress={overwriteArticle}>
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        size="sm"
      >
        <ModalContent>
          <ModalHeader>Success</ModalHeader>
          <ModalBody>
            <p>Article saved successfully!</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setIsSuccessModalOpen(false)}
              >
                OK
              </button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Outlet />
    </>
  );
};

export default Homepage;
