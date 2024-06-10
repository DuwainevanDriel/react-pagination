import { useQuery } from "@tanstack/react-query";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "./src/components/ui/pagination";
import { useEffect, useState } from "react";

type Posts = {
  id: number;
  title: string;
  body: string;
}[];

function App() {
  const { data, isFetching, isError, error } = useQuery<Posts>({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      return response.json();
    },
  });

  const postsPerPage = 5;
  const pageLimit = 5;

  const [currentPage, setCurrentPage] = useState(1);
  const [pagesStart, setPagesStart] = useState(0);
  const [pagesEnd, setPagesEnd] = useState(pageLimit);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = data?.slice(firstPostIndex, lastPostIndex) || [];
  const pagesLength = data && Math.ceil(data!.length / postsPerPage);
  const pages =
    data &&
    Array.from(
      { length: Math.ceil(data.length / postsPerPage) },
      (_, i) => i + 1
    ).slice(pagesStart, pagesEnd);

  const pageHandler = (page: number) => {
    setCurrentPage(page);
  };

  const previousHandler = () => {
    if (currentPage === 1) return;
    setCurrentPage((prev) => prev - 1);

    if (pages && currentPage === pages[0]) {
      setPagesStart(currentPage - pageLimit - 1);
      setPagesEnd(pages[pages.length - 1] - pageLimit);
    }
  };

  const nextHandler = () => {
    if (currentPage === pagesLength) return;
    setCurrentPage((prev) => prev + 1);

    if (pages && currentPage === pages[pages.length - 1]) {
      setPagesStart(currentPage);
      setPagesEnd(pages[pages.length - 1] + pageLimit);
    }
  };

  return (
    <main>
      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-slate-200 font-medium text-4xl">
            React Pagination
          </h1>
          <p className="text-slate-200 text-md">
            Simple application to showcase how to do pagination with
            jsonplaceholder and tanstack query.
          </p>

          {isFetching && (
            <p className="text-slate-200 text-md">Fetching posts...</p>
          )}

          {isError && <p className="text-slate-200 text-md">{error.message}</p>}

          {currentPosts &&
            currentPosts.map((post) => {
              return (
                <div
                  key={post.id}
                  className="p-4 rounded-md border border-slate-500 w-full"
                >
                  <h3 className="text-slate-200 text-lg font-medium">
                    {post.id}. {post.title}
                  </h3>
                  <p className="text-slate-300 text-md">{post.body}</p>
                </div>
              );
            })}

          <Pagination>
            <PaginationContent>
              <PaginationItem className="cursor-pointer">
                <PaginationPrevious onClick={previousHandler} />
              </PaginationItem>

              {currentPage > pageLimit && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {pages &&
                pages.map((page) => {
                  return (
                    <PaginationItem key={page} className="cursor-pointer">
                      <PaginationLink
                        onClick={() => pageHandler(page)}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

              {pagesLength && currentPage <= pagesLength - pageLimit && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem className="cursor-pointer">
                <PaginationNext onClick={nextHandler} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>
    </main>
  );
}

export default App;
